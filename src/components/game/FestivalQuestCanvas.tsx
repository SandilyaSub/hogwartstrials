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
    const JUMP_POWER = -12.5;
    const SPEED = 4.6;

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
    let prevY = GROUND_Y;
    for (let i = 0; i < chapter.platformCount; i++) {
      // Horizontal gap kept within jump range (~95px max horizontal travel at jump apex)
      x += 70 + rand() * 55;
      // Vertical step relative to previous platform, capped so the player can always reach it
      const maxRise = 70;   // safely under jump apex (~120px)
      const maxDrop = 110;
      const dy = (rand() * (maxRise + maxDrop)) - maxRise; // -maxRise..+maxDrop
      let py = Math.min(GROUND_Y - 60, Math.max(120, prevY + dy));
      prevY = py;
      const pw = 90 + rand() * 80;
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

      // Sparkle trail when moving
      if (Math.abs(vx) > 1 && frameTick % 4 === 0) {
        particles.push({
          x: px + PLAYER_W / 2 - facing * 8,
          y: py + PLAYER_H - 4,
          vx: -facing * (0.5 + Math.random()),
          vy: -Math.random() * 1.2,
          life: 18,
          color: quest.primaryColor,
        });
      }

      // Player sprite — chibi wizard with cape, hat & wand
      const bob = Math.abs(vx) > 0.3 ? Math.sin(frameTick * 0.3) * 1.5 : 0;
      drawWizard(ctx, px, py, PLAYER_W, PLAYER_H, facing, gravitySign, bob, frameTick, quest);

      ctx.restore();

      // Goal: animated checkered flag
      ctx.save();
      ctx.translate(-cameraX, 0);
      const goalX = LEVEL_END - 80;
      drawGoalFlag(ctx, goalX, GROUND_Y, frameTick, quest);
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

// ---------- Themed platform ----------
function drawThemedPlatform(
  ctx: CanvasRenderingContext2D,
  p: { x: number; y: number; w: number; h: number },
  quest: FestivalQuest,
  tick: number,
) {
  const { x, y, w, h } = p;
  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.fillRect(x + 2, y + h, w, 4);

  // Body
  const grad = ctx.createLinearGradient(0, y, 0, y + h);
  grad.addColorStop(0, quest.groundColor);
  grad.addColorStop(1, shade(quest.groundColor, -25));
  ctx.fillStyle = grad;
  roundRect(ctx, x, y, w, h, 4);
  ctx.fill();

  // Top accent strip
  ctx.fillStyle = quest.primaryColor;
  roundRect(ctx, x, y, w, 4, 2);
  ctx.fill();

  // Theme overlay
  switch (quest.id) {
    case "halloween": {
      // pumpkin dots
      for (let i = 6; i < w - 6; i += 14) {
        ctx.fillStyle = "hsla(25, 90%, 55%, 0.85)";
        ctx.beginPath();
        ctx.arc(x + i, y + h / 2 + 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "yule": {
      // snow caps
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      for (let i = 3; i < w - 3; i += 8) {
        const sh = 3 + ((i * 7) % 4);
        ctx.beginPath();
        ctx.arc(x + i, y + 2, sh, Math.PI, 0);
        ctx.fill();
      }
      break;
    }
    case "diwali": {
      // string lights
      for (let i = 8; i < w - 4; i += 12) {
        const flick = 0.6 + Math.sin(tick * 0.2 + i) * 0.4;
        ctx.fillStyle = `hsla(${(i * 23) % 360}, 90%, 65%, ${flick})`;
        ctx.beginPath();
        ctx.arc(x + i, y - 2, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    }
    case "valentines": {
      ctx.fillStyle = "hsla(340, 90%, 75%, 0.85)";
      for (let i = 10; i < w - 6; i += 18) {
        ctx.font = "10px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("♥", x + i, y + h / 2 + 1);
      }
      break;
    }
    default: {
      // grass tufts
      ctx.fillStyle = shade(quest.primaryColor, 10);
      for (let i = 4; i < w - 4; i += 10) {
        ctx.fillRect(x + i, y - 2, 2, 3);
      }
    }
  }
}

// ---------- Chibi wizard player ----------
function drawWizard(
  ctx: CanvasRenderingContext2D,
  px: number, py: number,
  W: number, H: number,
  facing: number, gravitySign: number,
  bob: number, tick: number,
  quest: FestivalQuest,
) {
  ctx.save();
  ctx.translate(px + W / 2, py + H / 2 + bob);
  ctx.scale(facing, gravitySign);

  const skin = "hsl(32, 60%, 80%)";
  const robe = quest.secondaryColor;
  const trim = quest.primaryColor;
  const hat = shade(quest.primaryColor, -15);
  const cape = shade(quest.secondaryColor, -25);

  // Cape behind body
  ctx.fillStyle = cape;
  ctx.beginPath();
  ctx.moveTo(-8, -8);
  ctx.quadraticCurveTo(-14 - Math.sin(tick * 0.2) * 2, 0, -10, H / 2);
  ctx.lineTo(8, H / 2);
  ctx.quadraticCurveTo(6, 4, 4, -8);
  ctx.closePath();
  ctx.fill();

  // Body / robe
  ctx.fillStyle = robe;
  roundRect(ctx, -W / 2 + 2, -2, W - 4, H / 2 + 2, 4);
  ctx.fill();

  // Robe trim
  ctx.fillStyle = trim;
  ctx.fillRect(-W / 2 + 2, H / 2 - 2, W - 4, 3);

  // Belt
  ctx.fillStyle = "hsl(40, 70%, 30%)";
  ctx.fillRect(-W / 2 + 2, 4, W - 4, 3);

  // Head
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.arc(0, -H / 2 + 8, 9, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  ctx.fillStyle = "#222";
  ctx.fillRect(-3, -H / 2 + 7, 2, 2);
  ctx.fillRect(2, -H / 2 + 7, 2, 2);
  // Cheek
  ctx.fillStyle = "hsla(340, 80%, 70%, 0.6)";
  ctx.beginPath();
  ctx.arc(4, -H / 2 + 11, 1.6, 0, Math.PI * 2);
  ctx.fill();

  // Wizard hat
  ctx.fillStyle = hat;
  ctx.beginPath();
  ctx.moveTo(-11, -H / 2);
  ctx.lineTo(11, -H / 2);
  ctx.lineTo(3, -H / 2 - 18);
  ctx.closePath();
  ctx.fill();
  // Hat band
  ctx.fillStyle = trim;
  ctx.fillRect(-11, -H / 2 - 2, 22, 3);
  // Hat star
  ctx.fillStyle = "hsl(50, 100%, 65%)";
  ctx.font = "8px serif";
  ctx.textAlign = "center";
  ctx.fillText("★", 1, -H / 2 - 8);

  // Wand with sparkle tip
  ctx.strokeStyle = "hsl(30, 50%, 25%)";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(8, 2);
  ctx.lineTo(15, -6);
  ctx.stroke();
  const tipGlow = ctx.createRadialGradient(15, -6, 0, 15, -6, 5);
  tipGlow.addColorStop(0, "hsl(50, 100%, 80%)");
  tipGlow.addColorStop(1, "transparent");
  ctx.fillStyle = tipGlow;
  ctx.beginPath();
  ctx.arc(15, -6, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ---------- Goal flag ----------
function drawGoalFlag(
  ctx: CanvasRenderingContext2D,
  goalX: number, groundY: number,
  tick: number, quest: FestivalQuest,
) {
  // Pole
  ctx.fillStyle = "hsl(0, 0%, 25%)";
  ctx.fillRect(goalX, groundY - 80, 3, 80);
  // Glow
  const glow = ctx.createRadialGradient(goalX + 1, groundY - 70, 4, goalX + 1, groundY - 70, 40);
  glow.addColorStop(0, `hsla(0,0%,100%,${0.25 + Math.sin(tick * 0.1) * 0.1})`);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(goalX - 40, groundY - 110, 80, 80);
  // Checkered flag
  const wave = Math.sin(tick * 0.15) * 3;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 6; c++) {
      ctx.fillStyle = (r + c) % 2 === 0 ? quest.primaryColor : "white";
      ctx.fillRect(goalX + 3 + c * 5 + wave * (c / 6), groundY - 80 + r * 5, 5, 5);
    }
  }
  // Star on top
  ctx.fillStyle = "hsl(50, 100%, 65%)";
  ctx.font = "16px serif";
  ctx.textAlign = "center";
  ctx.fillText("★", goalX + 2, groundY - 84);
}

// ---------- helpers ----------
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function shade(hsl: string, deltaL: number): string {
  // expects "hsl(H, S%, L%)"
  const m = hsl.match(/hsl\(\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%\s*\)/i);
  if (!m) return hsl;
  const h = +m[1], s = +m[2];
  const l = Math.max(0, Math.min(100, +m[3] + deltaL));
  return `hsl(${h}, ${s}%, ${l}%)`;
}

export default FestivalQuestCanvas;
