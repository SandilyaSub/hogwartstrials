import { useEffect, useRef, useState } from "react";
import TouchControls from "./TouchControls";
import type { FestivalQuest } from "@/lib/festivalQuests";

interface FestivalQuestCanvasProps {
  quest: FestivalQuest;
  onComplete: () => void;
  onExit: () => void;
}

interface Platform { x: number; y: number; w: number; h: number; }
interface Collectible { x: number; y: number; collected: boolean; bob: number; }

// Self-contained mini-platformer for festival side-quests. Reuses keysRef
// pattern so TouchControls works unchanged on mobile.
const FestivalQuestCanvas = ({ quest, onComplete, onExit }: FestivalQuestCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const rafRef = useRef<number>(0);
  const [collected, setCollected] = useState(0);
  const [timeLeft, setTimeLeft] = useState(quest.timeLimit);
  const [paused, setPaused] = useState(false);

  // Stable refs read inside the loop without re-triggering effect
  const collectedRef = useRef(0);
  const finishedRef = useRef(false);
  const failedRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const W = (canvas.width = canvas.offsetWidth);
    const H = (canvas.height = canvas.offsetHeight);

    // ---------- Procedural mini-level ----------
    const GROUND_Y = H - 60;
    const PLAYER_W = 28;
    const PLAYER_H = 36;
    const GRAVITY = 0.55;
    const JUMP_POWER = -11.5;
    const SPEED = 4.2;

    const platforms: Platform[] = [{ x: 0, y: GROUND_Y, w: W * 4, h: 60 }];
    let x = 80;
    const seed = quest.id.length * 7 + 13;
    let rng = seed;
    const rand = () => {
      rng = (rng * 1664525 + 1013904223) % 4294967296;
      return rng / 4294967296;
    };
    for (let i = 0; i < quest.platformCount; i++) {
      x += 110 + rand() * 90;
      const py = GROUND_Y - 80 - rand() * 200;
      const pw = 70 + rand() * 90;
      platforms.push({ x, y: py, w: pw, h: 14 });
    }
    const LEVEL_END = x + 200;

    // Collectibles distributed across platforms (not on the start ground)
    const collectibles: Collectible[] = [];
    const target = quest.objective.target;
    const elevated = platforms.slice(1);
    for (let i = 0; i < target; i++) {
      const p = elevated[i % elevated.length];
      collectibles.push({
        x: p.x + p.w / 2 + (rand() - 0.5) * (p.w * 0.6),
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

    // Particle pool for collect effects
    const particles: { x: number; y: number; vx: number; vy: number; life: number; color: string }[] = [];

    // ---------- Input ----------
    const onKeyDown = (e: KeyboardEvent) => {
      keysRef.current.add(e.key);
      if (e.key === " " || e.key === "ArrowUp") e.preventDefault();
    };
    const onKeyUp = (e: KeyboardEvent) => keysRef.current.delete(e.key);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // ---------- Timer (uses real seconds, paused when state is paused) ----------
    let lastSecond = performance.now();

    function step(now: number) {
      if (finishedRef.current || failedRef.current) return;
      if (paused) {
        lastSecond = now;
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      // ---- Update timer ----
      if (quest.timeLimit > 0 && now - lastSecond >= 1000) {
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

      // ---- Movement ----
      const k = keysRef.current;
      const left = k.has("ArrowLeft") || k.has("a");
      const right = k.has("ArrowRight") || k.has("d");
      const jump = k.has("ArrowUp") || k.has("w") || k.has(" ");

      if (left) { vx = -SPEED; facing = -1; }
      else if (right) { vx = SPEED; facing = 1; }
      else vx *= 0.8;

      if (jump && onGround) {
        vy = JUMP_POWER;
        onGround = false;
      }
      vy += GRAVITY;
      px += vx;
      py += vy;

      // Clamp left edge
      if (px < 0) px = 0;

      // ---- Platform collision ----
      onGround = false;
      for (const p of platforms) {
        if (
          px + PLAYER_W > p.x &&
          px < p.x + p.w &&
          py + PLAYER_H > p.y &&
          py + PLAYER_H < p.y + p.h + 20 &&
          vy >= 0
        ) {
          py = p.y - PLAYER_H;
          vy = 0;
          onGround = true;
        }
      }

      // ---- Death by falling ----
      if (py > H + 100) {
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
            // Defer state-changing callback so we don't unmount mid-frame
            setTimeout(() => onComplete(), 600);
          }
        }
      }

      // ---- Camera ----
      cameraX = Math.max(0, Math.min(LEVEL_END - W, px - W * 0.4));

      // ---- Render ----
      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, quest.skyTop);
      grad.addColorStop(1, quest.skyBottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Festival-specific atmospheric layer
      drawAtmosphere(ctx, W, H, quest.id, frameTick);

      // World transform
      ctx.save();
      ctx.translate(-cameraX, 0);

      // Platforms
      for (const p of platforms) {
        ctx.fillStyle = quest.groundColor;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.fillStyle = quest.primaryColor;
        ctx.fillRect(p.x, p.y, p.w, 3);
      }

      // Collectibles
      ctx.font = "26px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const c of collectibles) {
        if (c.collected) continue;
        const bobY = Math.sin(c.bob) * 4;
        // Glow halo
        const halo = ctx.createRadialGradient(c.x, c.y + bobY, 4, c.x, c.y + bobY, 24);
        halo.addColorStop(0, quest.primaryColor);
        halo.addColorStop(1, "transparent");
        ctx.fillStyle = halo;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(c.x, c.y + bobY, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillText(quest.objective.itemEmoji, c.x, c.y + bobY);
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

      // Player (simple wizard sprite — themed accent)
      const bob = Math.abs(vx) > 0.3 ? Math.sin(frameTick * 0.3) * 1.5 : 0;
      ctx.save();
      ctx.translate(px + PLAYER_W / 2, py + PLAYER_H / 2 + bob);
      ctx.scale(facing, 1);
      // Robe
      ctx.fillStyle = quest.secondaryColor;
      ctx.fillRect(-PLAYER_W / 2, -2, PLAYER_W, PLAYER_H / 2 + 2);
      // Head
      ctx.fillStyle = "hsl(35, 60%, 75%)";
      ctx.fillRect(-9, -PLAYER_H / 2, 18, 16);
      // Hat
      ctx.fillStyle = quest.primaryColor;
      ctx.beginPath();
      ctx.moveTo(-12, -PLAYER_H / 2);
      ctx.lineTo(12, -PLAYER_H / 2);
      ctx.lineTo(2, -PLAYER_H / 2 - 14);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      ctx.restore();

      // ---- Goal beacon (visible from afar) ----
      ctx.save();
      ctx.translate(-cameraX, 0);
      const goalX = LEVEL_END - 80;
      ctx.fillStyle = quest.primaryColor;
      ctx.globalAlpha = 0.4 + Math.sin(frameTick * 0.1) * 0.2;
      ctx.fillRect(goalX, 0, 4, GROUND_Y);
      ctx.globalAlpha = 1;
      ctx.restore();

      rafRef.current = requestAnimationFrame(step);
    }

    rafRef.current = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [quest, paused, onComplete]);

  // Failure -> exit (handled in render via effect)
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

      {isTouchDevice && !paused && <TouchControls keysRef={keysRef} />}

      {/* HUD */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none z-10">
        <div
          className="px-4 py-2 rounded-2xl backdrop-blur-md border border-white/20 font-display text-sm flex items-center gap-2 shadow-lg"
          style={{ background: "rgba(0,0,0,0.45)", color: "white" }}
        >
          <span className="text-xl">{quest.emoji}</span>
          <span>{quest.name}</span>
        </div>
        <div className="flex gap-2 pointer-events-auto">
          <div
            className="px-3 py-2 rounded-2xl backdrop-blur-md border border-white/20 font-display text-sm shadow-lg"
            style={{ background: "rgba(0,0,0,0.45)", color: "white" }}
          >
            {quest.objective.itemEmoji} {collected}/{quest.objective.target}
          </div>
          {quest.timeLimit > 0 && (
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

      {/* Bottom hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/60 font-display pointer-events-none z-10">
        Arrow keys / WASD · Space to jump
      </div>
    </div>
  );
};

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
      // Drifting bats
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
      // Crescent moon
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
      // Snowflakes
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
      // Floating diya glows + stars
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
      // Floating hearts
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
