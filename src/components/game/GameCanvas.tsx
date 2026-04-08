import { useRef, useEffect, useCallback, useState } from "react";
import { WORLDS } from "@/lib/gameData";
import type { PlayerProfile } from "@/hooks/useGameState";

interface GameCanvasProps {
  profile: PlayerProfile;
  worldId: number;
  levelIdx: number;
  onComplete: () => void;
  onDeath: () => void;
  onBack: () => void;
}

interface Platform {
  x: number; y: number; w: number; h: number;
  type: "normal" | "moving" | "disappearing" | "hazard" | "finish";
  moveDir?: number; moveRange?: number; origX?: number; origY?: number;
  timer?: number; visible?: boolean;
}

interface Particle { x: number; y: number; vx: number; vy: number; life: number; color: string; }

interface Enemy {
  x: number; y: number; w: number; h: number; type: string; dir: number; speed: number; range: number; origX: number;
}

const GRAVITY = 0.6;
const BASE_JUMP = -12;
const BASE_SPEED = 5;
const PLAYER_W = 24;
const PLAYER_H = 32;

function generateLevel(worldId: number, levelIdx: number, canvasW: number, canvasH: number): { platforms: Platform[]; enemies: Enemy[]; startX: number; startY: number } {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const difficulty = (worldId - 1) * 5 + levelIdx;
  const isBoss = levelIdx === 4;
  
  // Ground
  platforms.push({ x: 0, y: canvasH - 40, w: 150, h: 40, type: "normal" });
  
  const totalPlatforms = 12 + difficulty * 2 + (isBoss ? 8 : 0);
  let lastX = 80;
  let lastY = canvasH - 80;
  
  for (let i = 0; i < totalPlatforms; i++) {
    const gapX = 60 + Math.random() * (40 + difficulty * 3);
    const gapY = -30 - Math.random() * (30 + difficulty * 2);
    let nx = lastX + gapX;
    let ny = Math.max(80, Math.min(canvasH - 100, lastY + gapY + (Math.random() > 0.5 ? 60 : 0)));
    const pw = 60 + Math.random() * 60 - difficulty;
    
    let type: Platform["type"] = "normal";
    const roll = Math.random();
    if (difficulty > 3 && roll < 0.2) type = "moving";
    else if (difficulty > 5 && roll < 0.35) type = "disappearing";
    else if (difficulty > 8 && roll < 0.4) type = "hazard";
    
    const plat: Platform = { x: nx, y: ny, w: Math.max(40, pw), h: 16, type, visible: true };
    if (type === "moving") {
      plat.origX = nx;
      plat.origY = ny;
      plat.moveDir = Math.random() > 0.5 ? 1 : -1;
      plat.moveRange = 40 + Math.random() * 60;
    }
    if (type === "disappearing") {
      plat.timer = 0;
    }
    
    platforms.push(plat);

    // Add enemies on some platforms
    if (difficulty > 2 && Math.random() < 0.15 + difficulty * 0.01 && type === "normal") {
      enemies.push({
        x: nx + pw / 4, y: ny - 24, w: 20, h: 20,
        type: worldId <= 2 ? "spider" : worldId <= 4 ? "dementor" : "deathEater",
        dir: 1, speed: 0.5 + Math.random(), range: pw * 0.6, origX: nx + pw / 4,
      });
    }
    
    lastX = nx;
    lastY = ny;
  }
  
  // Finish platform
  platforms.push({ x: lastX + 80, y: lastY - 20, w: 80, h: 20, type: "finish" });
  
  return { platforms, enemies, startX: 60, startY: canvasH - 80 };
}

const GameCanvas = ({ profile, worldId, levelIdx, onComplete, onDeath, onBack }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number>(0);
  const [paused, setPaused] = useState(false);
  
  const world = WORLDS[worldId - 1];
  const level = world.levels[levelIdx];

  const handleComplete = useCallback(() => {
    cancelAnimationFrame(gameLoopRef.current);
    onComplete();
  }, [onComplete]);

  const handleDeath = useCallback(() => {
    cancelAnimationFrame(gameLoopRef.current);
    onDeath();
  }, [onDeath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;
    
    const houseBoosts = profile.house?.boosts || { speed: 0, jump: 0, flying: 0 };
    const petEffect = profile.pet?.effect || { type: "", value: 0 };
    
    const jumpPower = BASE_JUMP - houseBoosts.jump * 1.5 - (petEffect.type === "jump" ? petEffect.value : 0);
    const speed = BASE_SPEED + houseBoosts.speed * 0.5 + (petEffect.type === "speed" ? petEffect.value * 0.5 : 0);
    
    const { platforms, enemies, startX, startY } = generateLevel(worldId, levelIdx, 3000, H);
    
    let px = startX, py = startY, vx = 0, vy = 0;
    let onGround = false;
    let cameraX = 0;
    let hasRevive = petEffect.type === "revive";
    const particles: Particle[] = [];
    let frameCount = 0;

    const keys = keysRef.current;

    const onKeyDown = (e: KeyboardEvent) => {
      keys.add(e.key);
      if (e.key === "Escape") setPaused(p => !p);
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key);
    
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // Touch controls
    let touchLeft = false, touchRight = false, touchJump = false;
    const onTouchStart = (e: TouchEvent) => {
      for (const t of Array.from(e.touches)) {
        if (t.clientY > H * 0.6) {
          if (t.clientX < W / 3) touchLeft = true;
          else if (t.clientX > W * 2 / 3) touchRight = true;
        } else {
          touchJump = true;
        }
      }
    };
    const onTouchEnd = () => { touchLeft = false; touchRight = false; touchJump = false; };
    
    canvas.addEventListener("touchstart", onTouchStart);
    canvas.addEventListener("touchend", onTouchEnd);

    function update() {
      frameCount++;
      
      // Input
      const left = keys.has("ArrowLeft") || keys.has("a") || touchLeft;
      const right = keys.has("ArrowRight") || keys.has("d") || touchRight;
      const jump = keys.has("ArrowUp") || keys.has("w") || keys.has(" ") || touchJump;
      
      if (left) vx = -speed;
      else if (right) vx = speed;
      else vx *= 0.8;
      
      if (jump && onGround) {
        vy = jumpPower;
        onGround = false;
        // Jump particles
        for (let i = 0; i < 5; i++) {
          particles.push({ x: px + PLAYER_W/2, y: py + PLAYER_H, vx: (Math.random() - 0.5) * 3, vy: Math.random() * -2, life: 20, color: "hsl(45, 80%, 55%)" });
        }
      }
      
      vy += GRAVITY;
      px += vx;
      py += vy;
      
      // Update platforms
      platforms.forEach(p => {
        if (p.type === "moving" && p.origX !== undefined) {
          p.x = p.origX! + Math.sin(frameCount * 0.02 * (p.moveDir || 1)) * (p.moveRange || 50);
        }
      });

      // Update enemies
      enemies.forEach(e => {
        e.x += e.speed * e.dir;
        if (Math.abs(e.x - e.origX) > e.range) e.dir *= -1;
      });
      
      // Collision with platforms
      onGround = false;
      for (const p of platforms) {
        if (!p.visible && p.type === "disappearing") continue;
        if (p.type === "hazard") {
          if (px + PLAYER_W > p.x && px < p.x + p.w && py + PLAYER_H > p.y && py < p.y + p.h) {
            if (hasRevive) { hasRevive = false; py = p.y - PLAYER_H - 50; vy = jumpPower; }
            else { handleDeath(); return; }
          }
          continue;
        }
        
        if (vy >= 0 && px + PLAYER_W > p.x && px < p.x + p.w && py + PLAYER_H >= p.y && py + PLAYER_H <= p.y + p.h + vy + 2) {
          py = p.y - PLAYER_H;
          vy = 0;
          onGround = true;
          
          if (p.type === "finish") { handleComplete(); return; }
          if (p.type === "disappearing") {
            p.timer = (p.timer || 0) + 1;
            if (p.timer > 40) p.visible = false;
          }
        }
      }

      // Enemy collision
      for (const e of enemies) {
        if (px + PLAYER_W > e.x && px < e.x + e.w && py + PLAYER_H > e.y && py < e.y + e.h) {
          if (vy > 0 && py + PLAYER_H - e.y < 10) {
            // Stomp
            vy = jumpPower * 0.7;
            e.y = -100; // remove
          } else {
            if (hasRevive) { hasRevive = false; vy = jumpPower; }
            else { handleDeath(); return; }
          }
        }
      }
      
      // Fall death
      if (py > H + 100) {
        if (hasRevive) { hasRevive = false; py = startY - 100; vy = 0; px = startX; }
        else { handleDeath(); return; }
      }
      
      // Camera
      cameraX += (px - W / 3 - cameraX) * 0.1;
      if (cameraX < 0) cameraX = 0;
      
      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) particles.splice(i, 1);
      }
    }

    function draw() {
      // Background gradient based on world
      const bgColors: Record<number, [string, string]> = {
        1: ["#0a0a1a", "#1a1040"],
        2: ["#0a1a0a", "#0a2a1a"],
        3: ["#1a0a2a", "#0a0a1a"],
        4: ["#1a1000", "#2a1500"],
        5: ["#0a0a2a", "#001030"],
        6: ["#0a1a1a", "#001a20"],
        7: ["#1a0000", "#0a0000"],
      };
      const [c1, c2] = bgColors[worldId] || bgColors[1];
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, c1);
      grad.addColorStop(1, c2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Stars
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      for (let i = 0; i < 40; i++) {
        const sx = ((i * 137 + 50) % W + frameCount * 0.1 * ((i % 3) - 1)) % W;
        const sy = (i * 97 + 30) % (H * 0.6);
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }
      
      ctx.save();
      ctx.translate(-cameraX, 0);
      
      // Draw platforms
      platforms.forEach(p => {
        if (p.type === "disappearing" && !p.visible) return;
        
        const colors: Record<string, string> = {
          normal: "#4a3a2a",
          moving: "#3a4a6a",
          disappearing: p.timer && p.timer > 20 ? `rgba(100,80,60,${1 - (p.timer - 20) / 20})` : "#645040",
          hazard: "#8a2020",
          finish: "#c8a020",
        };
        
        ctx.fillStyle = colors[p.type] || colors.normal;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        
        // Platform top highlight
        ctx.fillStyle = p.type === "finish" ? "#ffd700" : p.type === "hazard" ? "#ff4040" : "#6a5a4a";
        ctx.fillRect(p.x, p.y, p.w, 3);
        
        if (p.type === "finish") {
          ctx.fillStyle = "#ffd700";
          ctx.font = "14px Cinzel";
          ctx.textAlign = "center";
          ctx.fillText("⭐ FINISH", p.x + p.w / 2, p.y - 8);
        }
      });

      // Draw enemies
      enemies.forEach(e => {
        if (e.y < -50) return;
        const eColors: Record<string, string> = { spider: "#333", dementor: "#222", deathEater: "#1a1a1a" };
        ctx.fillStyle = eColors[e.type] || "#333";
        ctx.fillRect(e.x, e.y, e.w, e.h);
        const eEmoji: Record<string, string> = { spider: "🕷️", dementor: "👻", deathEater: "💀" };
        ctx.font = "14px serif";
        ctx.textAlign = "center";
        ctx.fillText(eEmoji[e.type] || "👾", e.x + e.w / 2, e.y + e.h / 2 + 5);
      });
      
      // Draw player
      const charColor = profile.character?.color || "#c0392b";
      ctx.fillStyle = charColor;
      ctx.fillRect(px + 4, py, PLAYER_W - 8, PLAYER_H);
      // Head
      ctx.fillStyle = "#f0d0a0";
      ctx.beginPath();
      ctx.arc(px + PLAYER_W / 2, py - 2, 8, 0, Math.PI * 2);
      ctx.fill();
      // Character emoji
      ctx.font = "10px serif";
      ctx.textAlign = "center";
      ctx.fillText(profile.character?.emoji || "⚡", px + PLAYER_W / 2, py - 12);

      // Pet
      if (profile.pet) {
        ctx.font = "12px serif";
        ctx.fillText(profile.pet.emoji, px + PLAYER_W + 8, py - 4 + Math.sin(frameCount * 0.1) * 3);
      }
      
      // Particles
      particles.forEach(p => {
        ctx.globalAlpha = p.life / 20;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
      });
      ctx.globalAlpha = 1;
      
      ctx.restore();
      
      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, W, 36);
      ctx.font = "14px Cinzel";
      ctx.fillStyle = "#c8a020";
      ctx.textAlign = "left";
      ctx.fillText(`World ${worldId}: ${level.name}`, 10, 24);
      ctx.textAlign = "right";
      ctx.fillStyle = hasRevive ? "#4ade80" : "#666";
      ctx.fillText(hasRevive ? "🔥 Revive Ready" : "", W - 10, 24);

      // Touch controls hint (mobile)
      if ('ontouchstart' in window) {
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, H * 0.6, W / 3, H * 0.4);
        ctx.fillRect(W * 2 / 3, H * 0.6, W / 3, H * 0.4);
        ctx.fillRect(W / 3, 0, W / 3, H * 0.6);
        ctx.globalAlpha = 0.3;
        ctx.font = "20px serif";
        ctx.textAlign = "center";
        ctx.fillText("◄", W / 6, H * 0.8);
        ctx.fillText("►", W * 5 / 6, H * 0.8);
        ctx.fillText("JUMP", W / 2, H * 0.3);
        ctx.globalAlpha = 1;
      }
    }

    function gameLoop() {
      if (!paused) {
        update();
        draw();
      }
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    gameLoopRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      cancelAnimationFrame(gameLoopRef.current);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [worldId, levelIdx, profile, paused, handleComplete, handleDeath]);

  return (
    <div className="relative w-full h-screen bg-background">
      <canvas ref={canvasRef} className="w-full h-full block" style={{ imageRendering: "pixelated" }} />
      
      {/* Back button */}
      <button
        onClick={() => { cancelAnimationFrame(gameLoopRef.current); onBack(); }}
        className="absolute top-2 right-2 z-10 text-xs px-2 py-1 rounded bg-card/80 border border-border font-display text-foreground/60 hover:text-foreground"
      >
        ✕ Exit
      </button>

      {/* Controls hint */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-foreground/30 font-display">
        Arrow Keys / WASD to move · Space to jump
      </div>
    </div>
  );
};

export default GameCanvas;
