import { useRef, useEffect, useCallback, useState } from "react";
import type { DeathReason } from "./GameOver";
import { WORLDS } from "@/lib/gameData";
import { generateLevel, getLevelTheme, getBossSpells, type Platform, type Enemy, type Particle, type LevelData, type Projectile, type SpellDef, type HouseToken } from "@/lib/levelGenerator";

import type { PlayerProfile } from "@/hooks/useGameState";
import { supabase } from "@/integrations/supabase/client";
import dementorImg from "@/assets/dementor.png";
import harryImg from "@/assets/characters/harry.png";
import hermioneImg from "@/assets/characters/hermione.png";
import ronImg from "@/assets/characters/ron.png";
import lunaImg from "@/assets/characters/luna.png";
import ginnyImg from "@/assets/characters/ginny.png";
import nevilleImg from "@/assets/characters/neville.png";
import dracoImg from "@/assets/characters/draco.png";
import cedricImg from "@/assets/characters/cedric.png";
import choImg from "@/assets/characters/cho.png";

// Enemy avatars
import spiderImg from "@/assets/enemies/spider.png";
import deathEaterImg from "@/assets/enemies/death_eater.png";
import trollImg from "@/assets/enemies/troll.png";
import chessImg from "@/assets/enemies/chess.png";
import quirrellImg from "@/assets/enemies/quirrell.png";
import snakeImg from "@/assets/enemies/snake.png";
import werewolfImg from "@/assets/enemies/werewolf.png";
import pixieImg from "@/assets/enemies/pixie.png";
import goblinImg from "@/assets/enemies/goblin.png";
import portraitImg from "@/assets/enemies/portrait.png";
import centaurImg from "@/assets/enemies/centaur.png";
import wolfImg from "@/assets/enemies/wolf.png";
import birdImg from "@/assets/enemies/bird.png";
import wizardNpcImg from "@/assets/enemies/wizard_npc.png";
import dementorAvatarImg from "@/assets/enemies/dementor_avatar.png";

// Boss avatars
import bossQuirrellImg from "@/assets/bosses/quirrell.png";
import bossBasiliskImg from "@/assets/bosses/basilisk.png";
import bossDementorImg from "@/assets/bosses/dementor.png";
import bossHorntailImg from "@/assets/bosses/horntail.png";
import bossUmbridgeImg from "@/assets/bosses/umbridge.png";
import bossInferiImg from "@/assets/bosses/inferi.png";
import bossVoldemortImg from "@/assets/bosses/voldemort.png";

// Legacy enemy boss images (kept for enemy sprites)
import voldemortImg from "@/assets/enemies/voldemort.png";
import basiliskImg from "@/assets/enemies/basilisk.png";
import dragonImg from "@/assets/enemies/dragon.png";
import bellatrixImg from "@/assets/enemies/bellatrix.png";
import inferiImg from "@/assets/enemies/inferi.png";

// Mount avatars (used for flight levels)
import hippogriffMountImg from "@/assets/pets/hippogriff.png";
import thestralMountImg from "@/assets/pets/thestral.png";

const CHARACTER_IMAGES: Record<string, string> = {
  harry: harryImg, hermione: hermioneImg, ron: ronImg,
  luna: lunaImg, ginny: ginnyImg, neville: nevilleImg,
  draco: dracoImg, cedric: cedricImg, cho: choImg,
};

const ENEMY_IMAGES: Record<string, string> = {
  spider: spiderImg, deathEater: deathEaterImg, troll: trollImg,
  chess: chessImg, quirrell: quirrellImg, snake: snakeImg,
  werewolf: werewolfImg, pixie: pixieImg, goblin: goblinImg,
  portrait: portraitImg, centaur: centaurImg, wolf: wolfImg,
  bird: birdImg, wizard_npc: wizardNpcImg, dementor: dementorAvatarImg,
};

const BOSS_IMAGES: Record<string, string> = {
  "Professor Quirrell": bossQuirrellImg,
  "Basilisk": bossBasiliskImg,
  "Dementor Swarm": bossDementorImg,
  "Hungarian Horntail": bossHorntailImg,
  "Dolores Umbridge": bossUmbridgeImg,
  "Inferi Horde": bossInferiImg,
  "Lord Voldemort": bossVoldemortImg,
};

interface GameCanvasProps {
  profile: PlayerProfile;
  worldId: number;
  levelIdx: number;
  onComplete: (bonusCoins?: number) => void;
  onDeath: (reason: DeathReason) => void;
  onBack: () => void;
}

function shadeColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = Math.min(255, Math.max(0, (num >> 16) + amount));
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount));
  const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount));
  return `rgb(${r},${g},${b})`;
}

function getHairColor(charId: string): string {
  const hairColors: Record<string, string> = {
    harry: "#1a1a1a", hermione: "#6a3a1a", ron: "#c44a00",
    luna: "#d4b870", ginny: "#b83000", neville: "#4a3520",
    draco: "#e0d8b0", cedric: "#5a3a1a", cho: "#0a0a0a",
  };
  return hairColors[charId] || "#3a2a1a";
}

function drawCharacterDetails(ctx: CanvasRenderingContext2D, cx: number, cy: number, charId: string, pw: number, flash: boolean) {
  switch (charId) {
    case "harry":
      // Lightning scar
      ctx.strokeStyle = flash ? "#ddd" : "#c0392b";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + pw / 2 - 1, cy - 1);
      ctx.lineTo(cx + pw / 2 + 1, cy + 1);
      ctx.lineTo(cx + pw / 2 - 1, cy + 3);
      ctx.stroke();
      // Glasses
      ctx.strokeStyle = flash ? "#aaa" : "#333";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(cx + 9, cy + 5.5, 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx + 15, cy + 5.5, 3, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(cx + 12, cy + 5.5);
      ctx.lineTo(cx + 12, cy + 5.5);
      ctx.stroke();
      break;
    case "hermione":
      // Bushy hair puffs
      ctx.fillStyle = flash ? "#ddd" : "#6a3a1a";
      ctx.beginPath(); ctx.arc(cx + 4, cy + 3, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + pw - 4, cy + 3, 4, 0, Math.PI * 2); ctx.fill();
      break;
    case "ron":
      // Freckles
      ctx.fillStyle = flash ? "#ccc" : "#c08060";
      ctx.fillRect(cx + 7, cy + 7, 1, 1);
      ctx.fillRect(cx + 10, cy + 8, 1, 1);
      ctx.fillRect(cx + 15, cy + 7, 1, 1);
      break;
    case "luna":
      // Radish earrings
      ctx.fillStyle = flash ? "#ddd" : "#e74c3c";
      ctx.beginPath(); ctx.arc(cx + 4, cy + 9, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + pw - 4, cy + 9, 2, 0, Math.PI * 2); ctx.fill();
      break;
    case "draco":
      // Slicked-back hair point
      ctx.fillStyle = flash ? "#ddd" : "#e0d8b0";
      ctx.beginPath();
      ctx.moveTo(cx + pw / 2 - 5, cy - 2);
      ctx.lineTo(cx + pw / 2, cy - 5);
      ctx.lineTo(cx + pw / 2 + 5, cy - 2);
      ctx.closePath();
      ctx.fill();
      break;
    case "neville":
      // Rounder cheeks
      ctx.fillStyle = flash ? "#fdd" : "#f0b0a0";
      ctx.beginPath(); ctx.arc(cx + 6, cy + 7, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(cx + pw - 6, cy + 7, 2, 0, Math.PI * 2); ctx.fill();
      break;
    case "ginny":
      // Long flowing hair
      ctx.fillStyle = flash ? "#ddd" : "#b83000";
      ctx.fillRect(cx + 3, cy + 2, 3, 12);
      ctx.fillRect(cx + pw - 6, cy + 2, 3, 12);
      break;
  }
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
  
  const tokenPointsRef = useRef(0);

  const world = WORLDS[worldId - 1];
  const level = world.levels[levelIdx];
  const theme = getLevelTheme(worldId, levelIdx);

  const handleComplete = useCallback(() => {
    cancelAnimationFrame(gameLoopRef.current);
    // Submit house points
    const pts = tokenPointsRef.current;
    if (pts > 0 && profile.house?.id) {
      supabase.rpc("add_house_points", { p_house_id: profile.house.id, p_points: pts }).then(() => {});
    }
    tokenPointsRef.current = 0;
    onComplete();
  }, [onComplete, profile.house?.id]);

  const handleDeath = useCallback((reason: DeathReason = "fall") => {
    cancelAnimationFrame(gameLoopRef.current);
    onDeath(reason);
  }, [onDeath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const houseBoosts = profile.house?.boosts || { speed: 0, jump: 0, flying: 0 };
    const petEffect = profile.pet?.effect || { type: "", value: 0 };
    const upgrades = profile.purchasedUpgrades || {};

    // Shop upgrade boosts
    let shopJumpBoost = 0;
    let shopSpeedBoost = 0;
    let shopCoinMultiplier = 1;
    let shopHasMagnet = false;
    let shopHasShield = false;
    let shopHasSuperJump = false;
    let shopHasInvisibility = false;
    let shopHasTimeTurner = false;
    let shopHasFloat = false;

    if (upgrades["jump_boost_1"]) shopJumpBoost += 1;
    if (upgrades["jump_boost_2"]) shopJumpBoost += 2;
    if (upgrades["speed_boost_1"]) shopSpeedBoost += 1;
    if (upgrades["speed_boost_2"]) shopSpeedBoost += 2;
    if (upgrades["double_coins"]) shopCoinMultiplier = 2;
    if (upgrades["magnet"]) shopHasMagnet = true;
    if (upgrades["shield"]) shopHasShield = true;
    if (upgrades["super_jump"]) shopHasSuperJump = true;
    if (upgrades["invisibility"]) shopHasInvisibility = true;
    if (upgrades["time_turner"]) shopHasTimeTurner = true;
    if (upgrades["nimbus"]) shopHasFloat = true;

    // Super jump multiplies jump power by 1.5
    const superJumpMult = shopHasSuperJump ? 1.5 : 1;
    const jumpPower = (BASE_JUMP - houseBoosts.jump * 1.5 - (petEffect.type === "jump" ? petEffect.value : 0) - shopJumpBoost * 1.5) * superJumpMult;
    const speed = BASE_SPEED + houseBoosts.speed * 0.5 + (petEffect.type === "speed" ? petEffect.value * 0.5 : 0) + shopSpeedBoost * 0.5;

    // Invisibility: enemies ignore the player for the first 10s of the level (600 frames @ 60fps)
    let invisibilityFrames = shopHasInvisibility ? 600 : 0;
    // Nimbus float: after a jump, briefly halve gravity for a floaty feel
    let floatFrames = 0;
    // Time-Turner: rewind to start once if you fall to your death
    let timeTurnerCharges = shopHasTimeTurner ? 1 : 0;

    const levelData = generateLevel(worldId, levelIdx, 3000, H);
    const { platforms, enemies, startX, startY } = levelData;
    const houseTokens: HouseToken[] = levelData.houseTokens || [];
    const isDark = levelData.darkLevel || false;
    const isCheckered = levelData.checkered || false;
    const isBoatLevel = levelData.boatLevel || false;
    const isHippogriffFlight = levelData.hippogriffFlight || false;
    const isThestralFlight = levelData.thestralFlight || false;
    const isFlyingCar = levelData.flyingCar || isHippogriffFlight || isThestralFlight;
    const isBossArena = levelData.bossArena || false;
    const bossData = levelData.boss;

    let px = startX, py = startY, vx = 0, vy = 0;
    let onGround = false;
    let cameraX = 0;
    let cameraY = 0;
    let hasRevive = petEffect.type === "revive" || shopHasShield;
    const particles: Particle[] = [];
    let frameCount = 0;
    let flyingCarSpeed = 3;
    let carInvincible = 0;
    let collectedTokenPoints = 0; // track total tokens collected this level

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
      const down = keys.has("ArrowDown") || keys.has("s");

      if (isFlyingCar) {
        // Flying car mode: auto-scroll right, player moves up/down freely
        cameraX += flyingCarSpeed;
        px = cameraX + 80; // lock player near left side of screen

        // Up/down movement (no gravity)
        const carSpeed = 4;
        if (jump || keys.has("ArrowUp") || keys.has("w")) vy = -carSpeed;
        else if (down) vy = carSpeed;
        else vy *= 0.85;

        // Small left/right wiggle allowed
        if (left) vx = -2;
        else if (right) vx = 2;
        else vx *= 0.8;

        px += vx;
        py += vy;

        // Clamp to screen bounds
        if (py < 20) py = 20;
        if (py > H - 60) py = H - 60;

        if (carInvincible > 0) carInvincible--;

        // Increase speed over time
        flyingCarSpeed = 3 + frameCount * 0.0005;
      } else {
        if (left) vx = -speed;
        else if (right) vx = speed;
        else vx *= 0.8;

        if (jump && onGround) {
          vy = jumpPower;
          onGround = false;
          // Nimbus: float briefly after jumping
          if (shopHasFloat) floatFrames = 30;
          for (let i = 0; i < 5; i++) {
            particles.push({ x: px + PLAYER_W / 2, y: py + PLAYER_H, vx: (Math.random() - 0.5) * 3, vy: Math.random() * -2, life: 20, color: "hsl(45, 80%, 55%)" });
          }
        }

        // Apply gravity (Nimbus: half gravity while floating, only when going up or near apex)
        const gravityMult = floatFrames > 0 && vy < 2 ? 0.4 : 1;
        if (floatFrames > 0) floatFrames--;
        vy += GRAVITY * gravityMult;
        px += vx;
        py += vy;
      }

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
      if (isFlyingCar) {
        // Flying car: check collision with hazards and finish
        for (const p of platforms) {
          if (p.type === "finish") {
            if (px + PLAYER_W > p.x && px < p.x + p.w && py + PLAYER_H > p.y && py < p.y + p.h) {
              handleComplete(); return;
            }
            continue;
          }
          if (p.type === "hazard" && p.color !== "transparent") {
            if (px + PLAYER_W > p.x && px < p.x + p.w && py + PLAYER_H > p.y && py < p.y + p.h) {
              if (carInvincible <= 0) {
                if (hasRevive) { hasRevive = false; carInvincible = 60; }
                else { handleDeath("hazard"); return; }
              }
            }
          }
        }
        // Enemy collision in flying car
        for (const e of enemies) {
          if (px + PLAYER_W > e.x && px < e.x + e.w && py + PLAYER_H > e.y && py < e.y + e.h) {
            if (carInvincible <= 0) {
              if (hasRevive) { hasRevive = false; carInvincible = 60; }
              else { handleDeath("enemy"); return; }
            }
          }
        }
      } else {
      onGround = false;
      for (const p of platforms) {
        if (!p.visible && p.type === "disappearing") continue;
        if (p.type === "hazard") {
          if (px + PLAYER_W > p.x && px < p.x + p.w && py + PLAYER_H > p.y && py < p.y + p.h) {
            if (hasRevive) { hasRevive = false; py = p.y - PLAYER_H - 50; vy = jumpPower; }
            else { handleDeath("hazard"); return; }
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
      if (invisibilityFrames > 0) invisibilityFrames--;
      for (const e of enemies) {
        if (px + PLAYER_W > e.x && px < e.x + e.w && py + PLAYER_H > e.y && py < e.y + e.h) {
          if (vy > 0 && py + PLAYER_H - e.y < 10) {
            vy = jumpPower * 0.7;
            e.y = -100;
          } else if (invisibilityFrames > 0) {
            // Invisibility cloak active — enemies can't hurt you
            continue;
          } else {
            if (hasRevive) { hasRevive = false; vy = jumpPower; }
            else { handleDeath("enemy"); return; }
          }
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
              if (playerHp <= 0) { handleDeath("boss"); return; }
            }
          }
        }

        if (bossHitFlash > 0) bossHitFlash--;
        if (playerHitFlash > 0) playerHitFlash--;
      }

      // House token collection (NOTE: magnet/Accio Coins does NOT affect house tokens — only normal coins)
      houseTokens.forEach(token => {
        if (token.collected) return;
        const cx = px + PLAYER_W / 2;
        const cy = py + PLAYER_H / 2;

        if (Math.abs(cx - token.x) < 22 && Math.abs(cy - token.y) < 22) {
          token.collected = true;
          // Apply double-coins multiplier per token as well
          collectedTokenPoints += token.points * shopCoinMultiplier;
          tokenPointsRef.current = collectedTokenPoints;
          for (let i = 0; i < 8; i++) {
            particles.push({
              x: token.x, y: token.y,
              vx: (Math.random() - 0.5) * 5, vy: (Math.random() - 0.5) * 5,
              life: 25, color: profile.house?.id === "gryffindor" ? "#c0392b" : profile.house?.id === "slytherin" ? "#27ae60" : profile.house?.id === "ravenclaw" ? "#2980b9" : "#f39c12",
            });
          }
        }
      });

      // Fall death (into water for boat level, off-screen otherwise) - skip for flying car
      if (!isFlyingCar) {
        const deathY = isBoatLevel ? H - 45 : H + 100;
        if (py > deathY) {
          if (timeTurnerCharges > 0) {
            timeTurnerCharges--;
            px = startX; py = startY; vx = 0; vy = 0;
            // Visual rewind sparkles
            for (let i = 0; i < 30; i++) {
              particles.push({
                x: startX + (Math.random() - 0.5) * 60,
                y: startY + (Math.random() - 0.5) * 60,
                vx: (Math.random() - 0.5) * 4, vy: (Math.random() - 0.5) * 4,
                life: 40, color: "hsl(45, 90%, 65%)",
              });
            }
          } else if (hasRevive) {
            hasRevive = false; py = startY - 100; vy = 0; px = startX;
          } else {
            handleDeath(isBoatLevel ? "drown" : "fall"); return;
          }
        }
      }

      if (isFlyingCar) {
        // Camera is auto-scrolled in update above
      } else if (!isBossArena) {
        cameraX += (px - W / 3 - cameraX) * 0.1;
        if (cameraX < 0) cameraX = 0;
        // Vertical camera: follow player up and down smoothly
        const targetCameraY = -(py - H * 0.4);
        cameraY += (targetCameraY - cameraY) * 0.12;
      } else {
        cameraX = 0; // Fixed camera for boss arena
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) particles.splice(i, 1);
      }
    }

    // Helper: draw a mountain silhouette layer
    function drawMountains(yBase: number, color: string, parallax: number, seed: number) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(0, H);
      const scrollX = cameraX * parallax;
      for (let x = -60; x <= W + 60; x += 30) {
        const wx = x + scrollX;
        const h1 = Math.sin(wx * 0.003 + seed) * 40 + Math.sin(wx * 0.008 + seed * 2) * 25 + Math.cos(wx * 0.015 + seed * 0.5) * 15;
        ctx.lineTo(x, yBase - Math.abs(h1));
      }
      ctx.lineTo(W + 60, H);
      ctx.closePath();
      ctx.fill();
    }

    // Helper: draw tree silhouettes
    function drawTreeLine(yBase: number, color: string, parallax: number, count: number, seed: number) {
      const scrollX = cameraX * parallax;
      ctx.fillStyle = color;
      for (let i = 0; i < count; i++) {
        const tx = ((i * 137 + seed * 50) % (W + 100)) - 50;
        const treeH = 25 + ((i * 73 + seed) % 30);
        const treeW = 8 + ((i * 31 + seed) % 8);
        const bx = tx - (scrollX % (W + 100));
        const finalX = ((bx % (W + 100)) + W + 100) % (W + 100) - 50;
        // Trunk
        ctx.fillRect(finalX + treeW / 2 - 2, yBase - treeH * 0.3, 4, treeH * 0.3);
        // Canopy (triangle)
        ctx.beginPath();
        ctx.moveTo(finalX, yBase - treeH * 0.3);
        ctx.lineTo(finalX + treeW / 2, yBase - treeH);
        ctx.lineTo(finalX + treeW, yBase - treeH * 0.3);
        ctx.closePath();
        ctx.fill();
      }
    }

    // Helper: draw castle silhouette
    function drawCastle(x: number, y: number, scale: number, color: string) {
      ctx.fillStyle = color;
      const s = scale;
      // Main keep
      ctx.fillRect(x, y - 40 * s, 30 * s, 40 * s);
      // Towers
      ctx.fillRect(x - 8 * s, y - 55 * s, 14 * s, 55 * s);
      ctx.fillRect(x + 24 * s, y - 50 * s, 14 * s, 50 * s);
      // Tower tops (pointed)
      ctx.beginPath();
      ctx.moveTo(x - 8 * s, y - 55 * s);
      ctx.lineTo(x - 1 * s, y - 68 * s);
      ctx.lineTo(x + 6 * s, y - 55 * s);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 24 * s, y - 50 * s);
      ctx.lineTo(x + 31 * s, y - 63 * s);
      ctx.lineTo(x + 38 * s, y - 50 * s);
      ctx.closePath();
      ctx.fill();
      // Windows (lit)
      ctx.fillStyle = "rgba(255,200,80,0.3)";
      ctx.fillRect(x + 10 * s, y - 30 * s, 4 * s, 6 * s);
      ctx.fillRect(x + 18 * s, y - 25 * s, 4 * s, 6 * s);
      ctx.fillRect(x - 3 * s, y - 40 * s, 3 * s, 4 * s);
      ctx.fillRect(x + 28 * s, y - 35 * s, 3 * s, 4 * s);
    }

    function draw() {
      // Background
      if (isFlyingCar) {
        // Sky gradient — sunset for hippogriff, stormy midnight for thestral, night for car
        const skyGrad = ctx.createLinearGradient(0, 0, 0, H);
        if (isHippogriffFlight) {
          // Nighttime sky — deep indigo to midnight blue
          skyGrad.addColorStop(0, "#050818");
          skyGrad.addColorStop(0.3, "#0c1230");
          skyGrad.addColorStop(0.6, "#1a2050");
          skyGrad.addColorStop(0.85, "#2a2860");
          skyGrad.addColorStop(1, "#1a1838");
        } else if (isThestralFlight) {
          skyGrad.addColorStop(0, "#000005");
          skyGrad.addColorStop(0.3, "#0a0a20");
          skyGrad.addColorStop(0.6, "#1a1535");
          skyGrad.addColorStop(0.85, "#252040");
          skyGrad.addColorStop(1, "#0a0a1a");
        } else {
          skyGrad.addColorStop(0, "#020a20");
          skyGrad.addColorStop(0.2, "#0a1540");
          skyGrad.addColorStop(0.5, "#1a2a55");
          skyGrad.addColorStop(0.75, "#2a3a65");
          skyGrad.addColorStop(1, "#1a3a2a");
        }
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, H);
        if (isHippogriffFlight) {
          // Stars
          for (let i = 0; i < 70; i++) {
            const sx = (i * 149 + (cameraX * 0.04)) % W;
            const sy = (i * 83) % (H * 0.65);
            const tw = 0.5 + Math.sin(frameCount * 0.04 + i * 0.7) * 0.4;
            ctx.fillStyle = `rgba(240,240,255,${tw})`;
            ctx.fillRect(sx, sy, 2, 2);
          }
          // Full bright moon
          ctx.save();
          ctx.fillStyle = "rgba(255,250,220,0.06)";
          ctx.beginPath(); ctx.arc(W - 100, 80, 90, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(255,250,220,0.12)";
          ctx.beginPath(); ctx.arc(W - 100, 80, 55, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#fff8dc";
          ctx.beginPath(); ctx.arc(W - 100, 80, 32, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#f5eec0";
          ctx.beginPath(); ctx.arc(W - 96, 76, 26, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        } else if (isThestralFlight) {
          // Stars
          for (let i = 0; i < 60; i++) {
            const sx = (i * 137 + (cameraX * 0.05)) % W;
            const sy = (i * 71) % (H * 0.6);
            const tw = 0.4 + Math.sin(frameCount * 0.05 + i) * 0.3;
            ctx.fillStyle = `rgba(220,220,255,${tw})`;
            ctx.fillRect(sx, sy, 2, 2);
          }
          // Pale crescent moon
          ctx.save();
          ctx.fillStyle = "rgba(220,220,255,0.05)";
          ctx.beginPath(); ctx.arc(W - 90, 70, 60, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#d8d8e8";
          ctx.beginPath(); ctx.arc(W - 90, 70, 22, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#0a0a20";
          ctx.beginPath(); ctx.arc(W - 80, 65, 20, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
          // Occasional lightning flash
          if (frameCount % 180 < 4) {
            ctx.fillStyle = "rgba(180,180,255,0.15)";
            ctx.fillRect(0, 0, W, H);
          }
        } else {
          // Moon with atmospheric glow
          ctx.save();
          ctx.fillStyle = "rgba(255,240,200,0.03)";
          ctx.beginPath(); ctx.arc(W - 80, 60, 80, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "rgba(255,240,200,0.06)";
          ctx.beginPath(); ctx.arc(W - 80, 60, 50, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#e8e0c0";
          ctx.beginPath(); ctx.arc(W - 80, 60, 25, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#f0e8d0";
          ctx.beginPath(); ctx.arc(W - 78, 58, 20, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        }
        // Scrolling hills (parallax layers)
        const mtnA = isHippogriffFlight ? "rgba(20,25,55,0.75)" : isThestralFlight ? "rgba(15,15,30,0.85)" : "rgba(10,30,15,0.8)";
        const mtnB = isHippogriffFlight ? "rgba(12,15,38,0.9)" : isThestralFlight ? "rgba(8,8,20,0.95)" : "rgba(8,20,10,0.9)";
        drawMountains(H - 30, mtnA, 0.1, 1);
        drawMountains(H - 15, mtnB, 0.2, 3);
        // Ground silhouette with trees
        ctx.fillStyle = isHippogriffFlight ? "#080c1a" : isThestralFlight ? "#050510" : "#0a1a0a";
        for (let i = -1; i < W / 40 + 2; i++) {
          const gx = (i * 40 - (cameraX * 0.3) % 40);
          const gh = 20 + ((i * 37 + 13) % 30);
          ctx.fillRect(gx, H - gh, 42, gh);
        }
        const treeColor = isHippogriffFlight ? "#04060f" : isThestralFlight ? "#02020a" : "#0d1f0d";
        drawTreeLine(H - 20, treeColor, 0.25, 20, 7);
      } else {
        const [c1, c2] = theme.bgColors;
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, c1);
        grad.addColorStop(0.3, c1);
        grad.addColorStop(0.7, c2);
        grad.addColorStop(1, c2);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Parallax background scenery based on world
        if (worldId === 1) {
          // Hogwarts silhouette
          drawMountains(H * 0.7, "rgba(15,10,25,0.4)", 0.05, 0);
          drawCastle(W * 0.7 - cameraX * 0.03, H * 0.65, 1.2, "rgba(20,15,30,0.35)");
          drawCastle(W * 0.85 - cameraX * 0.04, H * 0.68, 0.8, "rgba(15,10,25,0.3)");
          drawMountains(H * 0.8, "rgba(10,8,18,0.5)", 0.08, 5);
          drawTreeLine(H * 0.82, "rgba(8,12,6,0.4)", 0.06, 15, 3);
        } else if (worldId === 2) {
          // Chamber - sewer/dungeon vibes with stalactites
          for (let i = 0; i < 12; i++) {
            const sx = ((i * 167 + 30) % W) - cameraX * 0.02;
            const sh = 20 + (i * 43 % 35);
            ctx.fillStyle = `rgba(30,40,25,${0.2 + (i % 3) * 0.1})`;
            ctx.beginPath();
            ctx.moveTo(sx - 6, 0);
            ctx.lineTo(sx, sh);
            ctx.lineTo(sx + 6, 0);
            ctx.closePath();
            ctx.fill();
          }
          drawMountains(H * 0.85, "rgba(15,20,10,0.3)", 0.04, 2);
        } else if (worldId === 3) {
          // Azkaban - cold, desolate
          drawMountains(H * 0.6, "rgba(20,15,30,0.3)", 0.03, 1);
          drawMountains(H * 0.75, "rgba(15,10,25,0.4)", 0.06, 4);
          drawTreeLine(H * 0.78, "rgba(10,8,15,0.35)", 0.05, 12, 5);
        } else if (worldId === 4) {
          // Goblet of Fire - fiery, warm
          drawMountains(H * 0.65, "rgba(30,15,5,0.3)", 0.04, 2);
          drawMountains(H * 0.8, "rgba(25,10,0,0.4)", 0.07, 6);
        } else if (worldId === 5) {
          // Ministry - dark urban
          for (let i = 0; i < 8; i++) {
            const bx = ((i * 197 + 20) % W) - cameraX * 0.02;
            const bh = 40 + (i * 47 % 50);
            ctx.fillStyle = `rgba(15,15,25,${0.25 + (i % 3) * 0.08})`;
            ctx.fillRect(bx, H * 0.55 - bh, 35, bh + H * 0.45);
            // Windows
            ctx.fillStyle = `rgba(255,200,80,${0.08 + Math.sin(frameCount * 0.02 + i) * 0.04})`;
            for (let wy = H * 0.55 - bh + 8; wy < H * 0.55; wy += 12) {
              ctx.fillRect(bx + 6, wy, 4, 5);
              ctx.fillRect(bx + 18, wy, 4, 5);
            }
          }
        } else if (worldId === 6) {
          drawMountains(H * 0.6, "rgba(10,25,25,0.3)", 0.03, 0);
          drawCastle(W * 0.6 - cameraX * 0.02, H * 0.58, 1.5, "rgba(10,20,20,0.25)");
          drawMountains(H * 0.75, "rgba(8,18,18,0.4)", 0.06, 3);
        } else if (worldId === 7) {
          // Deathly Hallows - ominous ruins
          drawMountains(H * 0.55, "rgba(25,5,5,0.3)", 0.03, 1);
          drawCastle(W * 0.3 - cameraX * 0.02, H * 0.52, 1.8, "rgba(20,5,5,0.2)");
          drawMountains(H * 0.7, "rgba(18,3,3,0.4)", 0.05, 4);
          drawTreeLine(H * 0.73, "rgba(15,5,5,0.3)", 0.04, 10, 9);
        }
      }

      // Stars with twinkling
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 137 + 50) % W + frameCount * 0.05 * ((i % 3) - 1)) % W;
        const sy = (i * 97 + 30) % (H * 0.5);
        const twinkle = 0.2 + Math.sin(frameCount * 0.03 + i * 1.7) * 0.15 + Math.sin(frameCount * 0.07 + i * 3.1) * 0.1;
        ctx.globalAlpha = twinkle;
        const starSize = 1 + (i % 4 === 0 ? 1 : 0);
        ctx.fillStyle = i % 7 === 0 ? "#aaccff" : i % 11 === 0 ? "#ffe8aa" : "#ffffff";
        ctx.beginPath();
        ctx.arc(sx, sy, starSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // Ambient particles (theme-specific, enhanced)
      if (theme.ambientParticles) {
        for (let i = 0; i < theme.ambientParticles.count; i++) {
          const ax = ((i * 211 + frameCount * 0.4) % W);
          const ay = ((i * 173 + Math.sin(frameCount * 0.02 + i * 2) * 20 + frameCount * 0.15) % H);
          const pulse = 0.25 + Math.sin(frameCount * 0.04 + i * 1.3) * 0.2;
          ctx.globalAlpha = pulse;
          // Glow
          ctx.fillStyle = theme.ambientParticles.color;
          ctx.beginPath();
          ctx.arc(ax, ay, 5, 0, Math.PI * 2);
          ctx.fill();
          // Core
          ctx.globalAlpha = pulse + 0.2;
          ctx.beginPath();
          ctx.arc(ax, ay, 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Floating candles for Hogwarts worlds
      if (worldId === 1 && !isFlyingCar) {
        for (let i = 0; i < 8; i++) {
          const cx = ((i * 193 + 40 + frameCount * 0.1) % (W + 40)) - 20;
          const cy = 30 + (i * 71 % 60) + Math.sin(frameCount * 0.025 + i * 2) * 8;
          // Candle body
          ctx.fillStyle = "rgba(240,220,180,0.4)";
          ctx.fillRect(cx - 1.5, cy, 3, 10);
          // Flame
          const flicker = Math.sin(frameCount * 0.15 + i * 3) * 1.5;
          ctx.fillStyle = "rgba(255,180,40,0.5)";
          ctx.beginPath();
          ctx.ellipse(cx, cy - 2 + flicker, 2.5, 4, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = "rgba(255,240,120,0.3)";
          ctx.beginPath();
          ctx.arc(cx, cy - 1, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Fireflies for forest worlds (3, 6)
      if ((worldId === 3 || worldId === 6) && !isFlyingCar) {
        for (let i = 0; i < 12; i++) {
          const fx = ((i * 179 + frameCount * 0.3) % W);
          const fy = H * 0.3 + ((i * 131) % (H * 0.5)) + Math.sin(frameCount * 0.03 + i) * 15;
          const brightness = 0.15 + Math.sin(frameCount * 0.06 + i * 2.7) * 0.15;
          ctx.globalAlpha = brightness;
          ctx.fillStyle = worldId === 3 ? "#aaccff" : "#aaffaa";
          ctx.beginPath();
          ctx.arc(fx, fy, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = brightness * 0.4;
          ctx.beginPath();
          ctx.arc(fx, fy, 6, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Embers for fire world (4)
      if (worldId === 4 && !isFlyingCar) {
        for (let i = 0; i < 10; i++) {
          const ex = ((i * 157 + frameCount * 0.5) % W);
          const ey = H - ((frameCount * 0.8 + i * 97) % H);
          ctx.globalAlpha = 0.3 + Math.sin(frameCount * 0.1 + i) * 0.15;
          ctx.fillStyle = i % 3 === 0 ? "#ff6030" : "#ffaa40";
          ctx.beginPath();
          ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      // Dark mist for world 7
      if (worldId === 7 && !isFlyingCar) {
        for (let i = 0; i < 5; i++) {
          const mx = ((i * 223 + frameCount * 0.15) % (W + 200)) - 100;
          const my = H * 0.7 + (i * 37 % 40);
          ctx.globalAlpha = 0.06 + Math.sin(frameCount * 0.01 + i) * 0.03;
          ctx.fillStyle = "#2a0000";
          ctx.beginPath();
          ctx.ellipse(mx, my, 80, 15, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.globalAlpha = 1;
      }

      ctx.save();
      ctx.translate(-cameraX, cameraY);

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
        } else if (isFlyingCar && p.type === "hazard" && p.color !== "transparent") {
          // Cloud-shaped hazards for flying car level
          const cx = p.x + p.w / 2, cy = p.y + p.h / 2;
          ctx.save();
          ctx.globalAlpha = 0.85 + Math.sin(frameCount * 0.04 + p.x * 0.01) * 0.1;
          ctx.fillStyle = "#c8c8d8";
          // Main cloud puff
          ctx.beginPath();
          ctx.arc(cx, cy, p.w * 0.35, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx - p.w * 0.22, cy + 3, p.w * 0.25, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx + p.w * 0.22, cy + 2, p.w * 0.28, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx - p.w * 0.1, cy - p.h * 0.4, p.w * 0.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx + p.w * 0.12, cy - p.h * 0.35, p.w * 0.22, 0, Math.PI * 2);
          ctx.fill();
          // Highlight
          ctx.fillStyle = "#e8e8f0";
          ctx.beginPath();
          ctx.arc(cx - p.w * 0.05, cy - p.h * 0.2, p.w * 0.15, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        } else {
          // Enhanced platform rendering with depth, textures, and glow
          const colors: Record<string, string> = {
            normal: theme.platformColor,
            moving: "#3a4a6a",
            disappearing: p.timer && p.timer > 20 ? `rgba(100,80,60,${1 - (p.timer - 20) / 20})` : "#645040",
            hazard: p.color || "#8a2020",
            finish: "#c8a020",
            chess: p.color || "#3a3a3a",
            ice: "#8ac8e8",
          };
          const baseColor = p.color || colors[p.type] || theme.platformColor;
          const radius = Math.min(6, p.h / 2, p.w / 4);

          // Drop shadow
          ctx.save();
          ctx.globalAlpha = 0.2;
          ctx.fillStyle = "#000";
          ctx.beginPath();
          ctx.roundRect(p.x + 2, p.y + 3, p.w, p.h, radius);
          ctx.fill();
          ctx.restore();

          // Platform body with gradient
          const platGrad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.h);
          platGrad.addColorStop(0, baseColor);
          platGrad.addColorStop(1, shadeColor(baseColor.startsWith("rgba") || baseColor.startsWith("rgb") ? "#4a4a4a" : baseColor, -25));
          ctx.beginPath();
          ctx.roundRect(p.x, p.y, p.w, p.h, radius);
          ctx.fillStyle = platGrad;
          ctx.fill();

          // Top highlight stripe
          ctx.beginPath();
          ctx.roundRect(p.x, p.y, p.w, Math.min(4, p.h / 2), [radius, radius, 0, 0]);
          ctx.fillStyle = p.type === "finish" ? "#ffd700" : p.type === "hazard" ? "#ff4040" : theme.platformHighlight;
          ctx.globalAlpha = 0.7;
          ctx.fill();
          ctx.globalAlpha = 1;

          // Surface texture lines (stone/brick feel)
          if (p.w > 30 && p.type !== "hazard" && p.type !== "finish") {
            ctx.strokeStyle = "rgba(255,255,255,0.06)";
            ctx.lineWidth = 0.5;
            for (let lx = p.x + 12; lx < p.x + p.w - 5; lx += 15) {
              ctx.beginPath();
              ctx.moveTo(lx, p.y + 2);
              ctx.lineTo(lx, p.y + p.h - 2);
              ctx.stroke();
            }
          }

          // Moving platform shimmer
          if (p.type === "moving") {
            ctx.globalAlpha = 0.12 + Math.sin(frameCount * 0.08) * 0.05;
            ctx.fillStyle = "#88aaff";
            ctx.beginPath();
            ctx.roundRect(p.x, p.y, p.w, p.h, radius);
            ctx.fill();
            ctx.globalAlpha = 1;
          }

          // Ice platform sparkle
          if (p.type === "ice") {
            for (let si = 0; si < 3; si++) {
              const sparkX = p.x + 10 + (si * 31 % (p.w - 20));
              const sparkY = p.y + 3 + (si * 7 % (p.h - 4));
              ctx.globalAlpha = 0.4 + Math.sin(frameCount * 0.12 + si * 2) * 0.3;
              ctx.fillStyle = "#fff";
              ctx.beginPath();
              ctx.arc(sparkX, sparkY, 1.5, 0, Math.PI * 2);
              ctx.fill();
            }
            ctx.globalAlpha = 1;
          }

          // Border
          ctx.strokeStyle = "rgba(255,255,255,0.08)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(p.x, p.y, p.w, p.h, radius);
          ctx.stroke();

          // Finish platform — golden glow + pulsing aura
          if (p.type === "finish") {
            ctx.strokeStyle = "#ffd700";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.roundRect(p.x, p.y, p.w, p.h, radius);
            ctx.stroke();
            // Pulsing glow
            ctx.save();
            ctx.globalAlpha = 0.15 + Math.sin(frameCount * 0.06) * 0.1;
            ctx.shadowColor = "#ffd700";
            ctx.shadowBlur = 20;
            ctx.fillStyle = "#ffd700";
            ctx.beginPath();
            ctx.roundRect(p.x - 4, p.y - 4, p.w + 8, p.h + 8, radius + 2);
            ctx.fill();
            ctx.restore();
          }

          // Hazard platform — danger glow
          if (p.type === "hazard") {
            ctx.save();
            ctx.globalAlpha = 0.1 + Math.sin(frameCount * 0.1) * 0.06;
            ctx.fillStyle = "#ff2020";
            ctx.beginPath();
            ctx.roundRect(p.x - 2, p.y - 2, p.w + 4, p.h + 4, radius + 1);
            ctx.fill();
            ctx.restore();
          }
        }

        // Labels for finish, hazards, dock
        if (p.type === "finish") {
          ctx.save();
          ctx.fillStyle = "#ffd700";
          ctx.font = "bold 14px Fredoka, sans-serif";
          ctx.textAlign = "center";
          ctx.shadowColor = "#ffd700";
          ctx.shadowBlur = 8;
          ctx.fillText(p.label || "⭐ FINISH", p.x + p.w / 2, p.y - 10);
          ctx.restore();
        } else if (p.label && !isBoatPlatform) {
          ctx.font = "11px serif";
          ctx.textAlign = "center";
          ctx.fillText(p.label, p.x + p.w / 2, p.y - 4);
        }
      });

      // Draw house tokens
      const houseColor = profile.house?.id === "gryffindor" ? "#c0392b" : profile.house?.id === "slytherin" ? "#27ae60" : profile.house?.id === "ravenclaw" ? "#2980b9" : "#f39c12";
      houseTokens.forEach(token => {
        if (token.collected) return;
        const tx = token.x, ty = token.y;
        const bob = Math.sin(frameCount * 0.06 + tx * 0.05) * 3;
        const pulse = 0.8 + Math.sin(frameCount * 0.1 + tx * 0.03) * 0.2;

        // Outer glow
        ctx.save();
        ctx.globalAlpha = 0.2 * pulse;
        ctx.fillStyle = houseColor;
        ctx.beginPath();
        ctx.arc(tx, ty + bob, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Token body (shield shape)
        ctx.save();
        ctx.globalAlpha = pulse;
        ctx.fillStyle = houseColor;
        ctx.beginPath();
        ctx.arc(tx, ty + bob, 9, 0, Math.PI * 2);
        ctx.fill();
        // Inner highlight
        ctx.fillStyle = "rgba(255,255,255,0.3)";
        ctx.beginPath();
        ctx.arc(tx - 2, ty + bob - 2, 4, 0, Math.PI * 2);
        ctx.fill();
        // Border
        ctx.strokeStyle = "rgba(255,255,255,0.5)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(tx, ty + bob, 9, 0, Math.PI * 2);
        ctx.stroke();
        // House initial
        ctx.fillStyle = "#fff";
        ctx.font = "bold 9px Fredoka, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(
          profile.house?.id === "gryffindor" ? "G" : profile.house?.id === "slytherin" ? "S" : profile.house?.id === "ravenclaw" ? "R" : "H",
          tx, ty + bob + 3
        );
        ctx.restore();

        // Sparkle trail
        if (frameCount % 8 === 0) {
          particles.push({
            x: tx + (Math.random() - 0.5) * 10, y: ty + bob,
            vx: (Math.random() - 0.5) * 1, vy: -Math.random() * 1.5,
            life: 15, color: houseColor,
          });
        }
      });

      // Draw enemies with avatar images
      enemies.forEach(e => {
        if (e.y < -50) return;
        // Subtle shadow/glow under enemy
        ctx.save();
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = e.type === "dementor" ? "#6a4aaa" : e.type === "chess" ? "#888" : "#ff4040";
        ctx.beginPath();
        ctx.ellipse(e.x + e.w / 2, e.y + e.h, e.w * 0.6, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        const bob = Math.sin(frameCount * 0.06 + e.origX * 0.1) * 2;

        // Try to draw avatar image
        const enemyImgSrc = ENEMY_IMAGES[e.type];
        if (enemyImgSrc) {
          const cacheKey = `__enemyImg_${e.type}`;
          if (!(window as any)[cacheKey]) {
            const img = new Image();
            img.src = enemyImgSrc;
            (window as any)[cacheKey] = img;
          }
          const imgEl = (window as any)[cacheKey] as HTMLImageElement;
          if (imgEl.complete && imgEl.naturalWidth > 0) {
            const imgSize = Math.max(e.w, e.h) * 1.8;
            ctx.save();
            ctx.beginPath();
            ctx.arc(e.x + e.w / 2, e.y + e.h / 2 + bob, imgSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(imgEl, e.x + e.w / 2 - imgSize / 2, e.y + e.h / 2 - imgSize / 2 + bob, imgSize, imgSize);
            ctx.restore();
            return;
          }
        }
        // Fallback to emoji
        const defaultEmojis: Record<string, string> = { spider: "🕷️", deathEater: "💀", troll: "🧌", chess: "♟", quirrell: "🧙" };
        const emoji = e.emoji || defaultEmojis[e.type] || "👾";
        const emojiSize = Math.max(18, e.w + 4);
        ctx.font = `${emojiSize}px serif`;
        ctx.textAlign = "center";
        ctx.fillText(emoji, e.x + e.w / 2, e.y + e.h / 2 + emojiSize * 0.35 + bob);
      });

      // ─── Draw Boss ───
      if (isBossArena && bossData) {
        const bossW = 40, bossH = 50;
        // Boss shadow
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = bossData.color;
        ctx.beginPath();
        ctx.ellipse(bossX + bossW / 2, bossY + bossH + 4, bossW * 0.6, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // Boss glow aura
        ctx.save();
        ctx.globalAlpha = 0.15 + Math.sin(frameCount * 0.05) * 0.05;
        ctx.fillStyle = bossData.color;
        ctx.beginPath();
        ctx.arc(bossX + bossW / 2, bossY + bossH / 2, bossW * 0.9, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        // Boss avatar image
        const bossImgSrc = BOSS_IMAGES[bossData.name];
        let bossDrawn = false;
        if (bossImgSrc) {
          const cacheKey = `__bossImg_${bossData.name}`;
          if (!(window as any)[cacheKey]) {
            const img = new Image();
            img.src = bossImgSrc;
            (window as any)[cacheKey] = img;
          }
          const bossImgEl = (window as any)[cacheKey] as HTMLImageElement;
          if (bossImgEl.complete && bossImgEl.naturalWidth > 0) {
            const imgSize = bossW * 1.8;
            ctx.save();
            ctx.beginPath();
            ctx.arc(bossX + bossW / 2, bossY + bossH / 2, imgSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(bossImgEl, bossX + bossW / 2 - imgSize / 2, bossY + bossH / 2 - imgSize / 2, imgSize, imgSize);
            if (bossHitFlash > 0) {
              ctx.globalAlpha = 0.5;
              ctx.fillStyle = "#fff";
              ctx.fillRect(bossX + bossW / 2 - imgSize / 2, bossY + bossH / 2 - imgSize / 2, imgSize, imgSize);
            }
            ctx.restore();
            bossDrawn = true;
          }
        }
        if (!bossDrawn) {
          if (bossHitFlash > 0) {
            ctx.save();
            ctx.globalAlpha = 0.6;
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.arc(bossX + bossW / 2, bossY + bossH / 2, bossW * 0.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          }
          ctx.font = "36px serif";
          ctx.textAlign = "center";
          ctx.fillText(bossData.emoji, bossX + bossW / 2, bossY + bossH / 2 + 12);
        }
        // Boss name
        ctx.font = "11px Fredoka, sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText(bossData.name, bossX + bossW / 2, bossY - 28);
        // Boss HP bar (rounded)
        const hpW = 80, hpH = 6;
        const hpX = bossX + bossW / 2 - hpW / 2, hpY = bossY - 18;
        ctx.beginPath();
        ctx.roundRect(hpX, hpY, hpW, hpH, 3);
        ctx.fillStyle = "#333";
        ctx.fill();
        ctx.beginPath();
        ctx.roundRect(hpX, hpY, hpW * (bossHp / bossData.maxHp), hpH, 3);
        ctx.fillStyle = bossHp > bossData.maxHp * 0.3 ? "#e74c3c" : "#ff4444";
        ctx.fill();
        ctx.strokeStyle = "#555";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(hpX, hpY, hpW, hpH, 3);
        ctx.stroke();
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
      if (isFlyingCar) {
        const cx = px, cy = py;
        if (isHippogriffFlight || isThestralFlight) {
          // Use the pre-made mount avatar (hippogriff or thestral)
          const mountSrc = isHippogriffFlight ? hippogriffMountImg : thestralMountImg;
          const mountKey = isHippogriffFlight ? "__mountImg_hippogriff" : "__mountImg_thestral";
          if (!(window as any)[mountKey]) {
            const img = new Image();
            img.src = mountSrc;
            (window as any)[mountKey] = img;
          }
          const mountImg = (window as any)[mountKey] as HTMLImageElement;

          const mW = 72, mH = 56;
          const bobY = Math.sin(frameCount * (isHippogriffFlight ? 0.08 : 0.09)) * 3;
          const flash = carInvincible > 0 && frameCount % 4 < 2;
          ctx.save();
          ctx.translate(cx, cy + bobY);

          // Subtle wing-flap scale to suggest motion
          const flap = 1 + Math.sin(frameCount * (isHippogriffFlight ? 0.15 : 0.18)) * 0.04;
          ctx.save();
          ctx.translate(mW / 2, mH / 2);
          ctx.scale(1, flap);
          ctx.translate(-mW / 2, -mH / 2);
          if (flash) {
            ctx.globalAlpha = 0.6;
          }
          if (mountImg.complete && mountImg.naturalWidth > 0) {
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(mountImg, 0, 0, mW, mH);
          }
          ctx.restore();

          // Character riding on top
          const charId = profile.character?.id || "harry";
          const imgKey = `__charImg_${charId}`;
          if (!(window as any)[imgKey]) {
            const img = new Image();
            img.src = CHARACTER_IMAGES[charId] || CHARACTER_IMAGES.harry;
            (window as any)[imgKey] = img;
          }
          const charImg = (window as any)[imgKey] as HTMLImageElement;
          if (charImg.complete && charImg.naturalWidth > 0) {
            const avatarSize = 22;
            ctx.save();
            ctx.beginPath();
            ctx.arc(mW * 0.48, mH * 0.22, avatarSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(charImg, mW * 0.48 - avatarSize / 2, mH * 0.22 - avatarSize / 2, avatarSize, avatarSize);
            ctx.restore();
          }

          ctx.restore();

          // Trail particles
          if (frameCount % 2 === 0) {
            particles.push({
              x: cx - 5, y: cy + mH * 0.5 + bobY,
              vx: -2 - Math.random() * 2, vy: (Math.random() - 0.5) * 1,
              life: isHippogriffFlight ? 12 : 18,
              color: isHippogriffFlight ? "rgba(200,220,255,0.4)" : "rgba(80,80,120,0.35)",
            });
          }
          if (isHippogriffFlight && frameCount % 20 === 0) {
            particles.push({
              x: cx + mW * 0.3, y: cy + mH * 0.3 + bobY,
              vx: -1 - Math.random(), vy: 0.5 + Math.random(),
              life: 30, color: "rgba(160,137,108,0.6)",
            });
          }
        } else {
          const carW = 50, carH = 28;
          ctx.fillStyle = carInvincible > 0 && frameCount % 4 < 2 ? "rgba(255,255,255,0.5)" : "#4a9adb";
          ctx.beginPath();
          ctx.moveTo(cx, cy + carH * 0.3);
          ctx.lineTo(cx + 8, cy);
          ctx.lineTo(cx + carW - 5, cy);
          ctx.lineTo(cx + carW, cy + carH * 0.3);
          ctx.lineTo(cx + carW + 5, cy + carH * 0.6);
          ctx.lineTo(cx + carW, cy + carH);
          ctx.lineTo(cx, cy + carH);
          ctx.lineTo(cx - 3, cy + carH * 0.6);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = "#2a6aaa";
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = "#aaddff";
          ctx.fillRect(cx + 12, cy + 3, 14, 10);
          ctx.fillRect(cx + 28, cy + 3, 12, 10);
          ctx.fillStyle = "#222";
          ctx.beginPath();
          ctx.arc(cx + 12, cy + carH + 2, 5, 0, Math.PI * 2);
          ctx.fill();
          ctx.beginPath();
          ctx.arc(cx + carW - 10, cy + carH + 2, 5, 0, Math.PI * 2);
          ctx.fill();
          if (frameCount % 2 === 0) {
            particles.push({
              x: cx - 5, y: cy + carH * 0.6,
              vx: -2 - Math.random() * 2, vy: (Math.random() - 0.5) * 1.5,
              life: 15, color: "rgba(200,200,200,0.6)",
            });
          }
          const carCharId = profile.character?.id || "harry";
          const carImgKey = `__charImg_${carCharId}`;
          if (!(window as any)[carImgKey]) {
            const img = new Image();
            img.src = CHARACTER_IMAGES[carCharId] || CHARACTER_IMAGES.harry;
            (window as any)[carImgKey] = img;
          }
          const carCharImg = (window as any)[carImgKey] as HTMLImageElement;
          if (carCharImg.complete && carCharImg.naturalWidth > 0) {
            const avatarSize = 18;
            ctx.save();
            ctx.beginPath();
            ctx.arc(cx + carW / 2, cy + carH / 2, avatarSize / 2, 0, Math.PI * 2);
            ctx.clip();
            ctx.drawImage(carCharImg, cx + carW / 2 - avatarSize / 2, cy + carH / 2 - avatarSize / 2, avatarSize, avatarSize);
            ctx.restore();
          }
        }
      } else {
        const charId = profile.character?.id || "harry";
        const charColor = profile.character?.color || "#c0392b";
        const flash = playerHitFlash > 0;
        const facingLeft = vx < -0.3;
        const cx = px, cy = py;

        // Shadow
        ctx.save();
        ctx.globalAlpha = 0.2;
        ctx.fillStyle = "#000";
        ctx.beginPath();
        ctx.ellipse(cx + PLAYER_W / 2, cy + PLAYER_H + 2, PLAYER_W * 0.5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        if (facingLeft) {
          ctx.translate(cx + PLAYER_W, 0);
          ctx.scale(-1, 1);
          ctx.translate(-cx, 0);
        }

        // Draw character avatar image
        const imgKey = `__charImg_${charId}`;
        if (!(window as any)[imgKey]) {
          const img = new Image();
          img.src = CHARACTER_IMAGES[charId] || CHARACTER_IMAGES.harry;
          (window as any)[imgKey] = img;
        }
        const charImg = (window as any)[imgKey] as HTMLImageElement;

        if (charImg.complete && charImg.naturalWidth > 0) {
          // Draw circular clipped avatar
          const imgSize = Math.max(PLAYER_W, PLAYER_H) + 4;
          const imgX = cx + PLAYER_W / 2 - imgSize / 2;
          const imgY = cy + PLAYER_H / 2 - imgSize / 2;

          ctx.save();
          ctx.beginPath();
          ctx.arc(cx + PLAYER_W / 2, cy + PLAYER_H / 2, imgSize / 2, 0, Math.PI * 2);
          ctx.clip();
          ctx.drawImage(charImg, imgX, imgY, imgSize, imgSize);

          // Flash overlay when hit
          if (flash) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = "#fff";
            ctx.fillRect(imgX, imgY, imgSize, imgSize);
            ctx.globalAlpha = 1;
          }
          ctx.restore();


          // Wand glow below
          ctx.fillStyle = charColor;
          ctx.globalAlpha = 0.4 + Math.sin(frameCount * 0.15) * 0.3;
          ctx.beginPath();
          ctx.arc(cx + PLAYER_W - 2, cy + PLAYER_H / 2 + 4, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = 1;
        } else {
          // Fallback emoji while loading
          ctx.font = `${PLAYER_H}px serif`;
          ctx.textAlign = "center";
          ctx.fillText(profile.character?.emoji || "⚡", cx + PLAYER_W / 2, cy + PLAYER_H - 2);
        }

        ctx.restore();
      }

      // Pet
      if (profile.pet) {
        ctx.font = "12px serif";
        ctx.textAlign = "center";
        ctx.fillText(profile.pet.emoji, px + PLAYER_W + 8, py - 4 + Math.sin(frameCount * 0.1) * 3);
      }

      // Particles (rounded)
      particles.forEach(p => {
        ctx.globalAlpha = p.life / 20;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      ctx.restore();

      // Vignette effect (subtle darkening at edges)
      const vignetteGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, W * 0.75);
      vignetteGrad.addColorStop(0, "rgba(0,0,0,0)");
      vignetteGrad.addColorStop(1, "rgba(0,0,0,0.35)");
      ctx.fillStyle = vignetteGrad;
      ctx.fillRect(0, 0, W, H);

      // Dark level overlay (Troll Dungeon - Lumos effect)
      if (isDark) {
        const playerScreenX = px - cameraX + PLAYER_W / 2;
        const playerScreenY = py + cameraY + PLAYER_H / 2;
        const gradient = ctx.createRadialGradient(playerScreenX, playerScreenY, 40, playerScreenX, playerScreenY, 170);
        gradient.addColorStop(0, "rgba(0,0,0,0)");
        gradient.addColorStop(0.4, "rgba(0,0,0,0.5)");
        gradient.addColorStop(1, "rgba(0,0,0,0.94)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, W, H);

        // Warm Lumos glow
        ctx.save();
        ctx.globalAlpha = 0.12 + Math.sin(frameCount * 0.08) * 0.05;
        ctx.fillStyle = "#fffae0";
        ctx.beginPath();
        ctx.arc(playerScreenX, playerScreenY, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 0.06;
        ctx.fillStyle = "#ffcc40";
        ctx.beginPath();
        ctx.arc(playerScreenX, playerScreenY, 80, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.fillStyle = "#fffae0";
        ctx.globalAlpha = 0.5;
        ctx.font = "10px Fredoka, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✨ Lumos", playerScreenX, playerScreenY - 55);
        ctx.globalAlpha = 1;
      }

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.fillRect(0, 0, W, isBossArena ? 60 : 36);
      ctx.font = "14px Fredoka, sans-serif";
      ctx.fillStyle = "#c8a020";
      ctx.textAlign = "left";
      ctx.fillText(`World ${worldId}: ${level.name}`, 10, 24);

      // House token counter
      const totalTokens = houseTokens.length;
      const collected = houseTokens.filter(t => t.collected).length;
      if (totalTokens > 0) {
        ctx.fillStyle = houseColor;
        ctx.textAlign = "center";
        ctx.fillText(`🪙 ${collected}/${totalTokens}  (+${collectedTokenPoints} pts)`, W / 2, 24);
      }

      if (isBossArena) {
        // Player HP bar
        ctx.fillStyle = "#aaa";
        ctx.font = "10px Fredoka, sans-serif";
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
          ctx.font = "10px Fredoka, sans-serif";
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
          onClick={() => { cancelAnimationFrame(gameLoopRef.current); onBack(); }}
          className="text-xs px-2 py-1 rounded bg-card/80 border border-border font-display text-foreground/60 hover:text-foreground"
        >
          ✕ Exit
        </button>
      </div>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-foreground/30 font-display">
        {levelIdx === 4
          ? "Arrow Keys / WASD to move · Space to jump · 1/2/3 to cast spells"
          : worldId === 2 && levelIdx === 1
          ? "↑↓ Arrow Keys / W/S to dodge · Auto-scrolling flight"
          : "Arrow Keys / WASD to move · Space to jump"}
      </div>
    </div>
  );
};

export default GameCanvas;
