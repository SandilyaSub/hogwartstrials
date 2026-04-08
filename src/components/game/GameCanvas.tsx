import { useRef, useEffect, useCallback, useState } from "react";
import { WORLDS } from "@/lib/gameData";
import { generateLevel, getLevelTheme, getBossSpells, type Platform, type Enemy, type Particle, type LevelData, type Projectile, type SpellDef } from "@/lib/levelGenerator";
import { toggleMusic, isMusicPlaying, startMusic } from "@/lib/musicEngine";
import type { PlayerProfile } from "@/hooks/useGameState";

interface GameCanvasProps {
  profile: PlayerProfile;
  worldId: number;
  levelIdx: number;
  onComplete: () => void;
  onDeath: () => void;
  onBack: () => void;
}

const GRAVITY = 0.6;
const BASE_JUMP = -12;
const BASE_SPEED = 5;
const PLAYER_W = 24;
const PLAYER_H = 32;

const GameCanvas = ({ profile, worldId, levelIdx, onComplete, onDeath, onBack }: GameCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const gameLoopRef = useRef<number>(0);
  const [paused, setPaused] = useState(false);
  const [musicOn, setMusicOn] = useState(isMusicPlaying());

  const world = WORLDS[worldId - 1];
  const level = world.levels[levelIdx];
  const theme = getLevelTheme(worldId, levelIdx);

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

    const levelData = generateLevel(worldId, levelIdx, 3000, H);
    const { platforms, enemies, startX, startY } = levelData;
    const isDark = levelData.darkLevel || false;
    const isCheckered = levelData.checkered || false;
    const isBoatLevel = levelData.boatLevel || false;
    const isBossArena = levelData.bossArena || false;
    const bossData = levelData.boss;

    let px = startX, py = startY, vx = 0, vy = 0;
    let onGround = false;
    let cameraX = 0;
    let hasRevive = petEffect.type === "revive";
    const particles: Particle[] = [];
    let frameCount = 0;

    // Boss fight state
    let bossHp = bossData?.maxHp || 0;
    let bossX = isBossArena ? 450 : 0;
    let bossY = isBossArena ? H - 100 : 0;
    let bossDir = -1;
    let bossAttackTimer = 0;
    let bossHitFlash = 0;
    let playerHp = 100;
    let playerMaxHp = 100;
    let playerHitFlash = 0;
    const projectiles: Projectile[] = [];
    const spells: SpellDef[] = isBossArena ? getBossSpells(worldId) : [];
    const spellCooldowns: number[] = spells.map(() => 0);

    const keys = keysRef.current;

    const onKeyDown = (e: KeyboardEvent) => {
      keys.add(e.key);
      if (e.key === "Escape") setPaused(p => !p);
    };
    const onKeyUp = (e: KeyboardEvent) => keys.delete(e.key);

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

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

      const left = keys.has("ArrowLeft") || keys.has("a") || touchLeft;
      const right = keys.has("ArrowRight") || keys.has("d") || touchRight;
      const jump = keys.has("ArrowUp") || keys.has("w") || keys.has(" ") || touchJump;

      if (left) vx = -speed;
      else if (right) vx = speed;
      else vx *= 0.8;

      if (jump && onGround) {
        vy = jumpPower;
        onGround = false;
        for (let i = 0; i < 5; i++) {
          particles.push({ x: px + PLAYER_W / 2, y: py + PLAYER_H, vx: (Math.random() - 0.5) * 3, vy: Math.random() * -2, life: 20, color: "hsl(45, 80%, 55%)" });
        }
      }

      vy += GRAVITY;
      px += vx;
      py += vy;

      // Update moving platforms
      platforms.forEach(p => {
        if (p.type === "moving" && p.origX !== undefined) {
          p.x = p.origX! + Math.sin(frameCount * 0.02 * (p.moveDir || 1)) * (p.moveRange || 50);
        }
        // Chess pieces on chess-colored platforms that move
        if (p.color && p.type === "moving" && p.origX !== undefined) {
          p.x = p.origX! + Math.sin(frameCount * 0.015 * (p.moveDir || 1)) * (p.moveRange || 25);
        }
      });

      // Update enemies
      enemies.forEach(e => {
        e.x += e.speed * e.dir;
        if (Math.abs(e.x - e.origX) > e.range) e.dir *= -1;
      });

      // Collision
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
            vy = jumpPower * 0.7;
            e.y = -100;
          } else {
            if (hasRevive) { hasRevive = false; vy = jumpPower; }
            else { handleDeath(); return; }
          }
        }
      }

      // ─── Boss Fight Logic ───
      if (isBossArena && bossData) {
        // Fire spells with number keys
        spells.forEach((spell, i) => {
          if (keys.has(spell.key) && spellCooldowns[i] <= 0) {
            const dirX = bossX > px ? 1 : -1;
            const dirY = (bossY - py) / (Math.abs(bossX - px) || 1);
            projectiles.push({
              x: px + PLAYER_W / 2, y: py + PLAYER_H / 2,
              vx: spell.speed * dirX, vy: dirY * spell.speed * 0.3,
              damage: spell.damage, color: spell.color, radius: 5,
              fromPlayer: true, life: 120, emoji: spell.emoji,
            });
            spellCooldowns[i] = spell.cooldown;
            // Muzzle flash particles
            for (let p = 0; p < 4; p++) {
              particles.push({
                x: px + PLAYER_W / 2, y: py + PLAYER_H / 2,
                vx: (Math.random() - 0.5) * 4 + dirX * 3,
                vy: (Math.random() - 0.5) * 4,
                life: 15, color: spell.color,
              });
            }
          }
        });
        // Tick cooldowns
        spellCooldowns.forEach((cd, i) => { if (cd > 0) spellCooldowns[i]--; });

        // Boss movement - paces back and forth
        bossX += bossDir * 1.5;
        if (bossX < 300 || bossX > 520) bossDir *= -1;

        // Boss attacks - fires projectiles at player
        bossAttackTimer++;
        if (bossAttackTimer >= bossData.attackSpeed) {
          bossAttackTimer = 0;
          const dx = px - bossX, dy = py - bossY;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;
          projectiles.push({
            x: bossX + 20, y: bossY + 20,
            vx: (dx / dist) * bossData.projectileSpeed,
            vy: (dy / dist) * bossData.projectileSpeed,
            damage: 10 + worldId * 2, color: bossData.color, radius: 6,
            fromPlayer: false, life: 180, emoji: "💀",
          });
          // Extra projectiles for harder bosses
          if (worldId >= 4) {
            projectiles.push({
              x: bossX + 20, y: bossY + 20,
              vx: (dx / dist) * bossData.projectileSpeed * 0.8 + 1,
              vy: (dy / dist) * bossData.projectileSpeed * 0.8 - 1,
              damage: 8 + worldId, color: bossData.color, radius: 4,
              fromPlayer: false, life: 150,
            });
          }
        }

        // Update projectiles
        for (let i = projectiles.length - 1; i >= 0; i--) {
          const proj = projectiles[i];
          proj.x += proj.vx;
          proj.y += proj.vy;
          proj.life--;

          if (proj.life <= 0) { projectiles.splice(i, 1); continue; }

          // Player spell hits boss
          if (proj.fromPlayer) {
            const bossW = 40, bossH = 50;
            if (proj.x > bossX && proj.x < bossX + bossW && proj.y > bossY && proj.y < bossY + bossH) {
              bossHp -= proj.damage;
              bossHitFlash = 10;
              projectiles.splice(i, 1);
              // Hit particles
              for (let p = 0; p < 6; p++) {
                particles.push({
                  x: proj.x, y: proj.y,
                  vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6,
                  life: 20, color: proj.color,
                });
              }
              if (bossHp <= 0) { handleComplete(); return; }
            }
          } else {
            // Boss projectile hits player
            if (proj.x > px && proj.x < px + PLAYER_W && proj.y > py && proj.y < py + PLAYER_H) {
              playerHp -= proj.damage;
              playerHitFlash = 8;
              projectiles.splice(i, 1);
              if (playerHp <= 0) { handleDeath(); return; }
            }
          }
        }

        if (bossHitFlash > 0) bossHitFlash--;
        if (playerHitFlash > 0) playerHitFlash--;
      }

      // Fall death (into water for boat level, off-screen otherwise)
      const deathY = isBoatLevel ? H - 45 : H + 100;
      if (py > deathY) {
        if (hasRevive) { hasRevive = false; py = startY - 100; vy = 0; px = startX; }
        else { handleDeath(); return; }
      }

      if (!isBossArena) {
        cameraX += (px - W / 3 - cameraX) * 0.1;
        if (cameraX < 0) cameraX = 0;
      } else {
        cameraX = 0; // Fixed camera for boss arena
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) particles.splice(i, 1);
      }
    }

    function draw() {
      // Background
      const [c1, c2] = theme.bgColors;
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

      // Ambient particles (theme-specific)
      if (theme.ambientParticles) {
        ctx.fillStyle = theme.ambientParticles.color;
        for (let i = 0; i < theme.ambientParticles.count; i++) {
          const ax = ((i * 211 + frameCount * 0.3) % W);
          const ay = ((i * 173 + frameCount * 0.2) % H);
          ctx.globalAlpha = 0.3 + Math.sin(frameCount * 0.05 + i) * 0.2;
          ctx.beginPath();
          ctx.arc(ax, ay, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      ctx.save();
      ctx.translate(-cameraX, 0);

      // Water for boat level
      if (isBoatLevel) {
        const waterY = H - 60;
        // Animated water surface
        for (let wx = -100; wx < 2200; wx += 4) {
          const waveH = Math.sin((wx + frameCount * 1.5) * 0.03) * 5 + Math.sin((wx - frameCount) * 0.05) * 3;
          const depth = H - waterY;
          const waterGrad = ctx.createLinearGradient(0, waterY + waveH, 0, H);
          waterGrad.addColorStop(0, "rgba(10, 40, 80, 0.7)");
          waterGrad.addColorStop(0.4, "rgba(5, 25, 60, 0.85)");
          waterGrad.addColorStop(1, "rgba(2, 10, 30, 0.95)");
          ctx.fillStyle = waterGrad;
          ctx.fillRect(wx, waterY + waveH, 5, depth - waveH);
        }
        // Moon reflection shimmer
        for (let i = 0; i < 15; i++) {
          const rx = ((i * 137 + frameCount * 0.4) % 2000);
          const ry = waterY + 8 + Math.sin(frameCount * 0.08 + i) * 4;
          ctx.globalAlpha = 0.15 + Math.sin(frameCount * 0.06 + i * 2) * 0.1;
          ctx.fillStyle = "#aaccff";
          ctx.fillRect(rx, ry, 12 + (i % 3) * 6, 2);
        }
        ctx.globalAlpha = 1;
      }

      // Checkered background (Wizard Chess)
      if (isCheckered) {
        const tileSize = 60;
        for (let r = 0; r < Math.ceil(H / tileSize); r++) {
          for (let c = 0; c < 20; c++) {
            ctx.fillStyle = (r + c) % 2 === 0 ? "rgba(20,20,20,0.3)" : "rgba(60,60,60,0.15)";
            ctx.fillRect(c * tileSize + 40, H - (r + 1) * tileSize, tileSize, tileSize);
          }
        }
      }

      // Draw platforms
      platforms.forEach(p => {
        if (p.type === "disappearing" && !p.visible) return;

        // Boat-shaped rendering for boat level (non-dock, non-hazard, non-finish platforms)
        const isBoatPlatform = isBoatLevel && p.color === "#6a4a2a";
        
        if (isBoatPlatform) {
          // Draw a proper boat hull shape
          const bx = p.x, by = p.y, bw = p.w, bh = p.h;
          const hullDepth = 14;
          
          // Hull (curved bottom)
          ctx.beginPath();
          ctx.moveTo(bx + 8, by);                    // top-left (inset)
          ctx.lineTo(bx + bw - 8, by);               // top-right (inset)
          ctx.lineTo(bx + bw - 2, by + hullDepth * 0.4); // right curve
          ctx.quadraticCurveTo(bx + bw * 0.75, by + hullDepth + 4, bx + bw * 0.5, by + hullDepth + 5); // bottom right curve
          ctx.quadraticCurveTo(bx + bw * 0.25, by + hullDepth + 4, bx + 2, by + hullDepth * 0.4);      // bottom left curve
          ctx.closePath();
          ctx.fillStyle = "#5a3518";
          ctx.fill();
          ctx.strokeStyle = "#3a2008";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          
          // Deck (flat top)
          ctx.fillStyle = "#7a5a30";
          ctx.fillRect(bx + 6, by, bw - 12, 4);
          
          // Wood plank lines
          ctx.strokeStyle = "rgba(0,0,0,0.2)";
          ctx.lineWidth = 0.5;
          for (let lx = bx + 18; lx < bx + bw - 18; lx += 12) {
            ctx.beginPath();
            ctx.moveTo(lx, by + 1);
            ctx.lineTo(lx, by + 3);
            ctx.stroke();
          }
          
          // Gunwale (rim)
          ctx.strokeStyle = "#8a6a3a";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(bx + 8, by);
          ctx.lineTo(bx + bw - 8, by);
          ctx.stroke();
          
          // Bow ornament (small pointed front)
          ctx.fillStyle = "#8a6a3a";
          ctx.beginPath();
          ctx.moveTo(bx + bw - 8, by);
          ctx.lineTo(bx + bw + 2, by + 4);
          ctx.lineTo(bx + bw - 8, by + 6);
          ctx.closePath();
          ctx.fill();
          
          // Lantern glow on some boats
          if (p.label === "🕯️" || p.label === "⛵") {
            ctx.fillStyle = "rgba(255, 200, 80, 0.15)";
            ctx.beginPath();
            ctx.arc(bx + bw / 2, by - 6, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.font = "10px serif";
            ctx.textAlign = "center";
            ctx.fillText(p.label, bx + bw / 2, by - 4);
          }
        } else {
          // Default rectangular platform drawing
          if (p.color) {
            ctx.fillStyle = p.color;
          } else {
            const colors: Record<string, string> = {
              normal: theme.platformColor,
              moving: "#3a4a6a",
              disappearing: p.timer && p.timer > 20 ? `rgba(100,80,60,${1 - (p.timer - 20) / 20})` : "#645040",
              hazard: p.color || "#8a2020",
              finish: "#c8a020",
              chess: p.color || "#3a3a3a",
              ice: "#8ac8e8",
            };
            ctx.fillStyle = colors[p.type] || theme.platformColor;
          }
          ctx.fillRect(p.x, p.y, p.w, p.h);

          // Highlight
          ctx.fillStyle = p.type === "finish" ? "#ffd700" : p.type === "hazard" ? "#ff4040" : theme.platformHighlight;
          ctx.fillRect(p.x, p.y, p.w, 3);
        }

        // Labels for finish, hazards, dock
        if (p.type === "finish") {
          ctx.fillStyle = "#ffd700";
          ctx.font = "14px Cinzel";
          ctx.textAlign = "center";
          ctx.fillText(p.label || "⭐ FINISH", p.x + p.w / 2, p.y - 8);
        } else if (p.label && !isBoatPlatform) {
          ctx.font = "11px serif";
          ctx.textAlign = "center";
          ctx.fillText(p.label, p.x + p.w / 2, p.y - 4);
        }
      });

      // Draw enemies
      enemies.forEach(e => {
        if (e.y < -50) return;
        const defaultEmojis: Record<string, string> = { spider: "🕷️", dementor: "👻", deathEater: "💀", troll: "🧌", chess: "♟", quirrell: "🧙" };
        const emoji = e.emoji || defaultEmojis[e.type] || "👾";
        ctx.fillStyle = "#222";
        ctx.fillRect(e.x, e.y, e.w, e.h);
        ctx.font = `${Math.max(14, e.w - 4)}px serif`;
        ctx.textAlign = "center";
        ctx.fillText(emoji, e.x + e.w / 2, e.y + e.h / 2 + 5);
      });

      // ─── Draw Boss ───
      if (isBossArena && bossData) {
        const bossW = 40, bossH = 50;
        // Boss body
        ctx.fillStyle = bossHitFlash > 0 ? "#fff" : bossData.color;
        ctx.fillRect(bossX, bossY, bossW, bossH);
        // Boss border glow
        ctx.strokeStyle = bossHitFlash > 0 ? "#ff0" : "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.strokeRect(bossX, bossY, bossW, bossH);
        // Boss emoji
        ctx.font = "28px serif";
        ctx.textAlign = "center";
        ctx.fillText(bossData.emoji, bossX + bossW / 2, bossY + bossH / 2 + 8);
        // Boss name
        ctx.font = "11px Cinzel";
        ctx.fillStyle = "#fff";
        ctx.fillText(bossData.name, bossX + bossW / 2, bossY - 28);
        // Boss HP bar
        const hpW = 80, hpH = 6;
        const hpX = bossX + bossW / 2 - hpW / 2, hpY = bossY - 18;
        ctx.fillStyle = "#333";
        ctx.fillRect(hpX, hpY, hpW, hpH);
        ctx.fillStyle = bossHp > bossData.maxHp * 0.3 ? "#e74c3c" : "#ff4444";
        ctx.fillRect(hpX, hpY, hpW * (bossHp / bossData.maxHp), hpH);
        ctx.strokeStyle = "#666";
        ctx.lineWidth = 1;
        ctx.strokeRect(hpX, hpY, hpW, hpH);
      }

      // Draw projectiles
      projectiles.forEach(proj => {
        ctx.globalAlpha = Math.min(1, proj.life / 20);
        ctx.fillStyle = proj.color;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        ctx.globalAlpha = 0.3;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, proj.radius * 2, 0, Math.PI * 2);
        ctx.fill();
        // Emoji
        if (proj.emoji) {
          ctx.globalAlpha = 1;
          ctx.font = `${proj.radius * 2 + 4}px serif`;
          ctx.textAlign = "center";
          ctx.fillText(proj.emoji, proj.x, proj.y + proj.radius);
        }
        ctx.globalAlpha = 1;
        // Trail particles
        if (frameCount % 3 === 0) {
          particles.push({
            x: proj.x, y: proj.y,
            vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5,
            life: 10, color: proj.color,
          });
        }
      });

      // Draw player
      const charColor = profile.character?.color || "#c0392b";
      ctx.fillStyle = playerHitFlash > 0 ? "#fff" : charColor;
      ctx.fillRect(px + 4, py, PLAYER_W - 8, PLAYER_H);
      ctx.fillStyle = "#f0d0a0";
      ctx.beginPath();
      ctx.arc(px + PLAYER_W / 2, py - 2, 8, 0, Math.PI * 2);
      ctx.fill();
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

      // Dark level overlay (Troll Dungeon - Lumos effect)
      if (isDark) {
        // Create a radial gradient centered on the player (screen space)
        const playerScreenX = px - cameraX + PLAYER_W / 2;
        const playerScreenY = py + PLAYER_H / 2;
        const gradient = ctx.createRadialGradient(playerScreenX, playerScreenY, 30, playerScreenX, playerScreenY, 150);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(0.5, "rgba(0,0,0,0.6)");
        gradient.addColorStop(1, "rgba(0,0,0,0.92)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        // Lumos glow around player
        ctx.save();
        ctx.globalAlpha = 0.15 + Math.sin(frameCount * 0.08) * 0.05;
        ctx.fillStyle = "#fffae0";
        ctx.beginPath();
        ctx.arc(playerScreenX, playerScreenY, 40, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Lumos label
        ctx.fillStyle = "#fffae0";
        ctx.globalAlpha = 0.6;
        ctx.font = "10px Cinzel";
        ctx.textAlign = "center";
        ctx.fillText("✨ Lumos", playerScreenX, playerScreenY - 50);
        ctx.globalAlpha = 1;
      }

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, W, isBossArena ? 60 : 36);
      ctx.font = "14px Cinzel";
      ctx.fillStyle = "#c8a020";
      ctx.textAlign = "left";
      ctx.fillText(`World ${worldId}: ${level.name}`, 10, 24);

      if (isBossArena) {
        // Player HP bar
        ctx.fillStyle = "#aaa";
        ctx.font = "10px Cinzel";
        ctx.fillText("HP", 10, 48);
        ctx.fillStyle = "#333";
        ctx.fillRect(30, 40, 120, 10);
        ctx.fillStyle = playerHp > 30 ? "#27ae60" : "#e74c3c";
        ctx.fillRect(30, 40, 120 * (playerHp / playerMaxHp), 10);
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 1;
        ctx.strokeRect(30, 40, 120, 10);

        // Spell bar
        ctx.textAlign = "center";
        spells.forEach((spell, i) => {
          const sx = 200 + i * 80;
          const ready = spellCooldowns[i] <= 0;
          ctx.fillStyle = ready ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.3)";
          ctx.fillRect(sx, 34, 70, 22);
          ctx.strokeStyle = ready ? spell.color : "#333";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(sx, 34, 70, 22);
          ctx.fillStyle = ready ? "#fff" : "#555";
          ctx.font = "10px Cinzel";
          ctx.fillText(`[${spell.key}] ${spell.emoji} ${spell.name}`, sx + 35, 49);
          // Cooldown overlay
          if (!ready) {
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect(sx, 34, 70 * (spellCooldowns[i] / spell.cooldown), 22);
          }
        });
      } else {
        ctx.textAlign = "right";
        ctx.fillStyle = hasRevive ? "#4ade80" : "#666";
        ctx.fillText(hasRevive ? "🔥 Revive Ready" : "", W - 10, 24);
      }

      // Touch controls
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
  }, [worldId, levelIdx, profile, paused, handleComplete, handleDeath, theme]);

  return (
    <div className="relative w-full h-screen bg-background">
      <canvas ref={canvasRef} className="w-full h-full block" style={{ imageRendering: "pixelated" }} />

      {/* Top right controls */}
      <div className="absolute top-2 right-2 z-10 flex gap-2">
        <button
          onClick={() => { setMusicOn(m => { toggleMusic(); return !m; }); }}
          className="text-xs px-2 py-1 rounded bg-card/80 border border-border font-display text-foreground/60 hover:text-foreground"
        >
          {musicOn ? "🎵 Music" : "🔇 Music"}
        </button>
        <button
          onClick={() => { cancelAnimationFrame(gameLoopRef.current); onBack(); }}
          className="text-xs px-2 py-1 rounded bg-card/80 border border-border font-display text-foreground/60 hover:text-foreground"
        >
          ✕ Exit
        </button>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-foreground/30 font-display">
        Arrow Keys / WASD to move · Space to jump
      </div>
    </div>
  );
};

export default GameCanvas;
