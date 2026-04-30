import { useEffect, useMemo, useRef, useState } from "react";
import TouchControls from "./TouchControls";
import {
  getQuestSeed,
  getQuestLevelChapter,
  type ChapterModifier,
  type FestivalQuest,
} from "@/lib/festivalQuests";

interface FestivalQuestCanvasProps {
  quest: FestivalQuest;
  /** 0-indexed level within the quest (0..14). */
  levelIndex: number;
  onComplete: () => void;
  onExit: () => void;
}

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
  /** moving platforms: horizontal drift parameters */
  baseX: number;
  driftAmp: number;
  driftSpeed: number;
}
interface Collectible { x: number; y: number; collected: boolean; bob: number; }

// Self-contained mini-platformer for festival side-quests. Each quest is a
// 15-level mini-campaign; the chapter rotates through the quest's pool and
// difficulty (platforms / targets / time) scales with the level index.
const FestivalQuestCanvas = ({ quest, levelIndex, onComplete, onExit }: FestivalQuestCanvasProps) => {
  const { chapter, chapterIndex, totalLevels } = useMemo(
    () => getQuestLevelChapter(quest, levelIndex),
    [quest, levelIndex]
  );
  const seed = useMemo(() => getQuestSeed(quest, levelIndex), [quest, levelIndex]);
  const modifiers = chapter.modifiers ?? [];
  const hasMod = (m: ChapterModifier) => modifiers.includes(m);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const [collected, setCollected] = useState(0);
  const [timeLeft, setTimeLeft] = useState(chapter.timeLimit);

  const collectedRef = useRef(0);
  const finishedRef = useRef(false);
  const failedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = canvas.offsetHeight);

    // ---------- Tunable physics ----------
    const GROUND_Y = H - 60;
    const PLAYER_W = 28;
    const PLAYER_H = 36;
    const BASE_GRAVITY = 0.55;
    const JUMP_POWER = -11.5;
    const SPEED = 4.2;

    // Modifier-driven physics tweaks
    const friction = hasMod("ice_floor") ? 0.96 : 0.8; // slippery if icy
    const windEnabled = hasMod("wind_gusts");
    const swapGravityEnabled = hasMod("swap_gravity");
    const dimLights = hasMod("dim_lights");
    const movingPlatformsEnabled = hasMod("moving_platforms");

    // ---------- Seeded RNG ----------
    let rng = seed;
    const rand = () => {
      rng = (rng * 1664525 + 1013904223) % 4294967296;
      return rng / 4294967296;
    };

    // ---------- Procedural mini-level ----------
    const platforms: Platform[] = [
      { x: 0, y: GROUND_Y, w: W * 4, h: 60, baseX: 0, driftAmp: 0, driftSpeed: 0 },
    ];
    let x = 80;
    for (let i = 0; i < chapter.platformCount; i++) {
      x += 110 + rand() * 90;
      const py = GROUND_Y - 80 - rand() * 200;
      const pw = 70 + rand() * 90;
      // Roughly 1-in-3 platforms drift horizontally if the modifier is on.
      const drifts = movingPlatformsEnabled && rand() < 0.4;
      platforms.push({
        x,
        y: py,
        w: pw,
        h: 14,
        baseX: x,
        driftAmp: drifts ? 30 + rand() * 50 : 0,
        driftSpeed: drifts ? 0.01 + rand() * 0.02 : 0,
      });
    }
    const LEVEL_END = x + 200;

    // Collectibles distributed across platforms (not on the start ground)
    const collectibles: Collectible[] = [];
    const target = chapter.objective.target;
    const elevated = platforms.slice(1);
    for (let i = 0; i < target; i++) {
      const p = elevated[i % elevated.length];
      collectibles.push({
        x: p.baseX + p.w / 2 + (rand() - 0.5) * (p.w * 0.6),
        y: p.y - 26,
        collected: false,
        bob: rand() * Math.PI * 2,
      });
    }

    // ---------- Player state ----------
    let px = 60;
    let py = GROUND_Y - PLAYER_H;
    let vx = 0;
    let vy = 0;
    let onGround = false;
    let cameraX = 0;
    let facing = 1;
    let frameTick = 0;

    const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

    // Wind gust state — periodic horizontal pushes
    let windPhase = rand() * Math.PI * 2;

    // Swap-gravity state — pulses every ~6 sec
    let gravitySign = 1;
    let nextGravityFlip = 360 + Math.floor(rand() * 240);

    // ---------- Input ----------
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === " " || e.key === "ArrowUp") e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let lastSecond = performance.now();

    function step(now: number) {
      if (finishedRef.current || failedRef.current) return;

      // ---- Update timer ----
      if (chapter.timeLimit > 0 && now - lastSecond >= 1000) {
        lastSecond = now;
        setTimeLeft(t => {
          const next = t - 1;
          if (next <= 0 && collectedRef.current < target) {
            failedRef.current = true;
          }
          return Math.max(0, next);
        });
      }

      frameTick++;

      // ---- Modifier ticks ----
      let windAccel = 0;
      if (windEnabled) {
        windPhase += 0.012;
        windAccel = Math.sin(windPhase) * 0.18;
      }
      if (swapGravityEnabled && frameTick > nextGravityFlip) {
        gravitySign *= -1;
        nextGravityFlip = frameTick + 360 + Math.floor(rand() * 240);
      }

      // ---- Move platforms (must happen BEFORE collision so positions are current) ----
      if (movingPlatformsEnabled) {
        for (const p of platforms) {
          if (p.driftAmp > 0) {
            p.x = p.baseX + Math.sin(frameTick * p.driftSpeed) * p.driftAmp;
          }
        }
      }

      // ---- Movement ----
      const k = keysRef.current;
      const left = k.has("ArrowLeft") || k.has("a");
      const right = k.has("ArrowRight") || k.has("d");
      const jump = k.has("ArrowUp") || k.has("w") || k.has(" ");

      if (left) { vx = -SPEED; facing = -1; }
      else if (right) { vx = SPEED; facing = 1; }
      else vx *= friction;

      vx += windAccel;

      if (jump && onGround) {
        vy = JUMP_POWER * gravitySign;
        onGround = false;
      }
      vy += BASE_GRAVITY * gravitySign;
      px += vx;
      py += vy;

      if (px < 0) px = 0;

      // ---- Platform collision (works for both gravity directions) ----
      onGround = false;
      for (const p of platforms) {
        const overlapsX = px + PLAYER_W > p.x && px < p.x + p.w;
        if (!overlapsX) continue;
        if (gravitySign > 0) {
          if (py + PLAYER_H > p.y && py + PLAYER_H < p.y + p.h + 20 && vy >= 0) {
            py = p.y - PLAYER_H;
            vy = 0;
            onGround = true;
          }
        } else {
          // Inverted gravity: land on the bottom of the platform
          if (py < p.y + p.h && py > p.y - 20 && vy <= 0) {
            py = p.y + p.h;
            vy = 0;
            onGround = true;
          }
        }
      }

      // ---- Death by leaving the world ----
      if (py > H + 100 || py < -200) {
        failedRef.current = true;
      }

      // ---- Collectible pickup ----
      for (const c of collectibles) {
        if (c.collected) continue;
        c.bob += 0.08;
        const dx = px + PLAYER_W / 2 - c.x;
        const dy = py + PLAYER_H / 2 - c.y;
        if (dx * dx + dy * dy < 32 * 32) {
          c.collected = true;
          collectedRef.current += 1;
          setCollected(collectedRef.current);
          for (let i = 0; i < 10; i++) {
            particles.push({
              x: c.x,
              y: c.y,
              vx: (Math.random() - 0.5) * 4,
              vy: Math.random() * -3 - 1,
              life: 30,
              color: quest.primaryColor,
            });
          }
          if (collectedRef.current >= target) {
            finishedRef.current = true;
            setTimeout(() => onComplete(), 600);
          }
        }
      }

      cameraX = Math.max(0, Math.min(LEVEL_END - W, px - W * 0.4));

      // ---- Render: sky ----
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, quest.skyTop);
      grad.addColorStop(1, quest.skyBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      drawAtmosphere(ctx, W, H, quest.id, frameTick);

      ctx.save();
      ctx.translate(-cameraX, 0);

      for (const p of platforms) {
        drawThemedPlatform(ctx, p, quest, frameTick);
      }

      // Collectibles
      ctx.font = "26px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const c of collectibles) {
        if (c.collected) continue;
        const bobY = Math.sin(c.bob) * 4;
        const halo = ctx.createRadialGradient(c.x, c.y + bobY, 4, c.x, c.y + bobY, 24);
        halo.addColorStop(0, quest.primaryColor);
        halo.addColorStop(1, "transparent");
        ctx.fillStyle = halo;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(c.x, c.y + bobY, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillText(chapter.objective.itemEmoji, c.x, c.y + bobY);
      }

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const pt = particles[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.2;
        pt.life--;
        if (pt.life <= 0) particles.splice(i, 1);
        else {
          ctx.fillStyle = pt.color;
          ctx.globalAlpha = pt.life / 30;
          ctx.fillRect(pt.x - 2, pt.y - 2, 4, 4);
          ctx.globalAlpha = 1;
        }
      }

      // Player sprite
      const bob = Math.abs(vx) > 0.3 ? Math.sin(frameTick * 0.3) * 1.5 : 0;
      ctx.save();
      ctx.translate(px + PLAYER_W / 2, py + PLAYER_H / 2 + bob);
      ctx.scale(facing, gravitySign);
      ctx.fillStyle = quest.secondaryColor;
      ctx.fillRect(-PLAYER_W / 2, -2, PLAYER_W, PLAYER_H / 2 + 2);
      ctx.fillStyle = "hsl(35, 60%, 75%)";
      ctx.fillRect(-9, -PLAYER_H / 2, 18, 16);
      ctx.fillStyle = quest.primaryColor;
      ctx.beginPath();
      ctx.moveTo(-12, -PLAYER_H / 2);
      ctx.lineTo(12, -PLAYER_H / 2);
      ctx.lineTo(2, -PLAYER_H / 2 - 14);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.restore();

      // Goal beacon
      ctx.save();
      ctx.translate(-cameraX, 0);
      const goalX = LEVEL_END - 80;
      ctx.fillStyle = quest.primaryColor;
      ctx.globalAlpha = 0.4 + Math.sin(frameTick * 0.1) * 0.2;
      ctx.fillRect(goalX, 0, 4, GROUND_Y);
      ctx.globalAlpha = 1;
      ctx.restore();

      // Dim-lights vignette: dark overlay with a hole around the player
      if (dimLights) {
        const playerScreenX = px + PLAYER_W / 2 - cameraX;
        const playerScreenY = py + PLAYER_H / 2;
        const radial = ctx.createRadialGradient(
          playerScreenX, playerScreenY, 60,
          playerScreenX, playerScreenY, 280
        );
        radial.addColorStop(0, "rgba(0,0,0,0)");
        radial.addColorStop(1, "rgba(0,0,0,0.78)");
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, W, H);
      }

      // Wind direction indicator
      if (windEnabled && Math.abs(windAccel) > 0.05) {
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "white";
        ctx.font = "20px serif";
        ctx.textAlign = "center";
        ctx.fillText(windAccel > 0 ? "💨›" : "‹💨", W / 2, 40);
        ctx.restore();
      }

      // Inverted-gravity indicator
      if (swapGravityEnabled && gravitySign < 0) {
        ctx.save();
        ctx.fillStyle = "rgba(180, 100, 255, 0.18)";
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
    // Re-init only when the quest or its yearly chapter changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quest, seed, chapter, onComplete]);

  // Failure -> exit
  useEffect(() => {
    const id = setInterval(() => {
      if (failedRef.current) onExit();
    }, 200);
    return () => clearInterval(id);
  }, [onExit]);

  const isTouchDevice =
    typeof window !== "undefined" &&
    ("ontouchstart" in window || (navigator as any).maxTouchPoints > 0);

  return (
    <div
      className="fixed inset-0 w-screen overflow-hidden"
      style={{ height: "100dvh", background: quest.skyBottom }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block"
        style={{ imageRendering: "pixelated" }}
      />

      {isTouchDevice && <TouchControls keysRef={keysRef} />}

      {/* HUD */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div
          className="px-4 py-2 rounded-2xl backdrop-blur-md border border-white/20 font-display text-sm flex items-center gap-2 shadow-lg"
          style={{ background: "rgba(0,0,0,0.45)", color: "white" }}
        >
          <span className="text-xl">{quest.emoji}</span>
          <div className="flex flex-col leading-tight">
            <span>{quest.name} · {chapter.subtitle}</span>
            <span className="text-[10px] opacity-70">
              Level {levelIndex + 1}/{totalLevels} · chapter {chapterIndex + 1}/{quest.chapters.length}
            </span>
          </div>
        </div>
        <div className="flex gap-2 pointer-events-auto">
          <div
            className="px-3 py-2 rounded-2xl backdrop-blur-md border border-white/20 font-display text-sm shadow-lg"
            style={{ background: "rgba(0,0,0,0.45)", color: "white" }}
          >
            {chapter.objective.itemEmoji} {collected}/{chapter.objective.target}
          </div>
          {chapter.timeLimit > 0 && (
            <div
              className="px-3 py-2 rounded-2xl backdrop-blur-md border border-white/20 font-display text-sm shadow-lg"
              style={{
                background: "rgba(0,0,0,0.45)",
                color: timeLeft <= 10 ? "hsl(0, 90%, 70%)" : "white",
              }}
            >
              ⏱ {timeLeft}s
            </div>
          )}
          <button
            onClick={onExit}
            className="px-3 py-2 rounded-2xl backdrop-blur-md border border-white/20 font-display text-sm shadow-lg hover:bg-white/10 transition-colors"
            style={{ background: "rgba(0,0,0,0.45)", color: "white" }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Modifier badges */}
      {modifiers.length > 0 && (
        <div className="absolute top-20 left-3 flex flex-col gap-1 pointer-events-none z-10">
          {modifiers.map((m) => (
            <span
              key={m}
              className="px-2 py-0.5 rounded-full text-[10px] font-display font-semibold border border-white/20 shadow-sm"
              style={{ background: "rgba(0,0,0,0.45)", color: "white" }}
            >
              {modifierLabel(m)}
            </span>
          ))}
        </div>
      )}

      {/* Bottom hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/60 font-display pointer-events-none z-10">
        Arrow keys / WASD · Space to jump
      </div>
    </div>
  );
};

function modifierLabel(m: ChapterModifier): string {
  switch (m) {
    case "ice_floor": return "❄ Slippery floor";
    case "dim_lights": return "🌑 Dim lights";
    case "wind_gusts": return "💨 Wind gusts";
    case "rising_water": return "🌊 Rising water";
    case "swap_gravity": return "🔄 Gravity flips";
    case "moving_platforms": return "↔ Drifting platforms";
  }
}

// ---------- Atmosphere drawing per festival ----------
function drawAtmosphere(
  ctx: CanvasRenderingContext2D,
  W: number,
  H: number,
  id: string,
  tick: number
) {
  ctx.save();
  switch (id) {
    case "halloween": {
      ctx.fillStyle = "hsl(280, 30%, 8%)";
      for (let i = 0; i < 6; i++) {
        const bx = ((tick * 1.2 + i * 220) % (W + 40)) - 20;
        const by = 60 + Math.sin(tick * 0.05 + i) * 30 + i * 28;
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.quadraticCurveTo(bx + 6, by - 4, bx + 12, by);
        ctx.quadraticCurveTo(bx + 18, by - 4, bx + 24, by);
        ctx.lineTo(bx + 12, by + 4);
        ctx.closePath();
        ctx.fill();
      }
      ctx.fillStyle = "hsl(45, 100%, 85%)";
      ctx.beginPath();
      ctx.arc(W - 90, 80, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "hsl(280, 60%, 12%)";
      ctx.beginPath();
      ctx.arc(W - 78, 72, 28, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case "yule": {
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      for (let i = 0; i < 60; i++) {
        const sx = (i * 53 + tick * 0.5) % W;
        const sy = (i * 31 + tick * 1.5) % H;
        const size = 1 + (i % 3);
        ctx.fillRect(sx, sy, size, size);
      }
      break;
    }
    case "diwali": {
      ctx.fillStyle = "rgba(255,255,255,0.6)";
      for (let i = 0; i < 30; i++) {
        const sx = (i * 71) % W;
        const sy = (i * 41) % (H * 0.5);
        ctx.fillRect(sx, sy, 1, 1);
      }
      for (let i = 0; i < 4; i++) {
        const fx = ((tick * 0.5 + i * 180) % (W + 60)) - 30;
        const fy = 100 + i * 60 + Math.sin(tick * 0.04 + i) * 20;
        const g = ctx.createRadialGradient(fx, fy, 2, fx, fy, 18);
        g.addColorStop(0, "hsl(45, 100%, 70%)");
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(fx, fy, 18, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "valentines": {
      for (let i = 0; i < 8; i++) {
        const hx = ((tick * 0.4 + i * 130) % (W + 40)) - 20;
        const hy = (H - ((tick * 0.6 + i * 90) % H));
        ctx.fillStyle = `hsla(340, 90%, 70%, ${0.5 + (i % 3) * 0.15})`;
        ctx.font = "18px serif";
        ctx.fillText("♥", hx, hy);
      }
      break;
    }
  }
  ctx.restore();
}

export default FestivalQuestCanvas;
