// Themed level generator for each world/level

export interface Platform {
  x: number; y: number; w: number; h: number;
  type: "normal" | "moving" | "disappearing" | "hazard" | "finish" | "chess" | "ice";
  moveDir?: number; moveRange?: number; origX?: number; origY?: number;
  timer?: number; visible?: boolean;
  color?: string; // override color
  label?: string; // text to draw on platform
}

export interface Enemy {
  x: number; y: number; w: number; h: number;
  type: string; dir: number; speed: number; range: number; origX: number;
  emoji?: string;
}

export interface Particle {
  x: number; y: number; vx: number; vy: number; life: number; color: string;
}

export interface LevelData {
  platforms: Platform[];
  enemies: Enemy[];
  startX: number;
  startY: number;
  darkLevel?: boolean;     // Troll Dungeon - limited visibility
  checkered?: boolean;     // Wizard Chess - draw checkered bg
  mirrorBoss?: boolean;    // Mirror of Erised boss
  boatLevel?: boolean;     // Hogwarts Arrival - water & boats
}

export interface LevelTheme {
  bgColors: [string, string];
  platformColor: string;
  platformHighlight: string;
  ambientParticles?: { color: string; count: number };
}

// Theme visuals per level
export function getLevelTheme(worldId: number, levelIdx: number): LevelTheme {
  if (worldId === 1) {
    switch (levelIdx) {
      case 0: return { // Hogwarts Arrival - boat across Black Lake
        bgColors: ["#050a14", "#0a1525"],
        platformColor: "#5a3a1a",
        platformHighlight: "#8a6a3a",
        ambientParticles: { color: "hsl(200, 60%, 40%)", count: 6 },
      };
      case 1: return { // Staircase Maze - vertical, grey stone
        bgColors: ["#0d0d15", "#15152a"],
        platformColor: "#4a4a5a",
        platformHighlight: "#7a7a8a",
        ambientParticles: { color: "hsl(240, 30%, 50%)", count: 5 },
      };
      case 2: return { // Troll Dungeon - very dark green
        bgColors: ["#050805", "#0a100a"],
        platformColor: "#3a3a2a",
        platformHighlight: "#5a5a4a",
        ambientParticles: { color: "hsl(120, 40%, 30%)", count: 3 },
      };
      case 3: return { // Wizard Chess - black and white
        bgColors: ["#0a0a0f", "#151520"],
        platformColor: "#2a2a2a",
        platformHighlight: "#e0e0e0",
        ambientParticles: { color: "hsl(0, 0%, 80%)", count: 4 },
      };
      case 4: return { // Mirror of Erised - purple mystical
        bgColors: ["#100a1a", "#1a0a2a"],
        platformColor: "#4a3a5a",
        platformHighlight: "#9a7ab0",
        ambientParticles: { color: "hsl(280, 60%, 60%)", count: 10 },
      };
    }
  }

  // Default themes for other worlds (will be expanded later)
  const defaults: Record<number, LevelTheme> = {
    1: { bgColors: ["#0a0a1a", "#1a1040"], platformColor: "#4a3a2a", platformHighlight: "#6a5a4a" },
    2: { bgColors: ["#0a1a0a", "#0a2a1a"], platformColor: "#2a4a2a", platformHighlight: "#4a6a4a" },
    3: { bgColors: ["#1a0a2a", "#0a0a1a"], platformColor: "#3a2a4a", platformHighlight: "#5a4a6a" },
    4: { bgColors: ["#1a1000", "#2a1500"], platformColor: "#5a3a1a", platformHighlight: "#7a5a3a" },
    5: { bgColors: ["#0a0a2a", "#001030"], platformColor: "#2a2a5a", platformHighlight: "#4a4a7a" },
    6: { bgColors: ["#0a1a1a", "#001a20"], platformColor: "#2a4a4a", platformHighlight: "#4a6a6a" },
    7: { bgColors: ["#1a0000", "#0a0000"], platformColor: "#4a1a1a", platformHighlight: "#6a3a3a" },
  };
  return defaults[worldId] || defaults[1];
}

// ─── World 1 Level Generators ────────────────────────────

function gen_1_1_HogwartsArrival(H: number): LevelData {
  // Boat ride across the Black Lake to Hogwarts
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const waterY = H - 60; // water surface level

  // Dock start - wooden pier
  platforms.push({ x: 0, y: waterY - 10, w: 120, h: 24, type: "normal", color: "#5a3a1a", label: "🏚️ Dock" });

  // Boats floating on the water - gently bobbing (moving platforms)
  const boats = [
    { x: 160, w: 100, moving: true },
    { x: 320, w: 90, moving: true },
    { x: 470, w: 100, moving: false },
    { x: 620, w: 85, moving: true },
    { x: 770, w: 100, moving: true },
    { x: 930, w: 90, moving: false },
    { x: 1080, w: 95, moving: true },
    { x: 1240, w: 100, moving: true },
    { x: 1400, w: 90, moving: false },
    { x: 1550, w: 100, moving: true },
  ];

  boats.forEach((b, i) => {
    const p: Platform = {
      x: b.x, y: waterY - 14, w: b.w, h: 18,
      type: b.moving ? "moving" : "normal",
      color: "#6a4a2a", // dark wood color
      label: i === 0 ? "⛵" : (i % 3 === 0 ? "🕯️" : ""),
    };
    if (b.moving) {
      p.origX = b.x;
      p.origY = waterY - 14;
      p.moveDir = i % 2 === 0 ? 1 : -1;
      p.moveRange = 15 + (i % 3) * 8; // gentle bobbing
    }
    platforms.push(p);
  });

  // Rocky outcrop mid-lake
  platforms.push({ x: 700, y: waterY - 50, w: 60, h: 14, type: "normal", color: "#4a4a4a", label: "🪨" });

  // Giant squid tentacle hazard
  platforms.push({ x: 500, y: waterY - 30, w: 40, h: 12, type: "hazard", color: "#3a2a4a", label: "🦑" });
  platforms.push({ x: 1100, y: waterY - 25, w: 35, h: 12, type: "hazard", color: "#3a2a4a", label: "🦑" });

  // Hogwarts dock finish
  platforms.push({
    x: 1700, y: waterY - 20, w: 100, h: 24,
    type: "finish", color: "#4a3a2a", label: "🏰 Hogwarts",
  });

  return { platforms, enemies, startX: 40, startY: waterY - 50, boatLevel: true };
}

function gen_1_2_StaircaseMaze(H: number): LevelData {
  // Lots of moving platforms (staircases)
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal" });

  let lastX = 80, lastY = H - 80;
  for (let i = 0; i < 16; i++) {
    const nx = lastX + 70 + Math.random() * 50;
    const ny = Math.max(80, lastY - 20 - Math.random() * 40 + (i % 3 === 0 ? 50 : 0));
    const isMoving = i % 2 === 0;

    const p: Platform = {
      x: nx, y: ny, w: 70 + Math.random() * 30, h: 16,
      type: isMoving ? "moving" : "normal",
    };
    if (isMoving) {
      p.origX = nx;
      p.origY = ny;
      p.moveDir = i % 4 < 2 ? 1 : -1;
      p.moveRange = 30 + Math.random() * 50;
    }
    platforms.push(p);
    lastX = nx;
    lastY = ny;
  }

  platforms.push({ x: lastX + 80, y: lastY - 20, w: 80, h: 20, type: "finish" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_1_3_TrollDungeon(H: number): LevelData {
  // Dark level with narrow corridors
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 150, h: 40, type: "normal" });

  let lastX = 80, lastY = H - 80;
  for (let i = 0; i < 14; i++) {
    const nx = lastX + 60 + Math.random() * 40;
    const ny = Math.max(80, lastY - 10 - Math.random() * 30 + (i % 3 === 0 ? 40 : 0));
    const pw = 50 + Math.random() * 40;

    platforms.push({ x: nx, y: ny, w: pw, h: 16, type: "normal" });

    // Troll enemies (slow, big)
    if (i === 4 || i === 9) {
      enemies.push({
        x: nx + 10, y: ny - 28, w: 24, h: 24,
        type: "troll", dir: 1, speed: 0.3, range: pw * 0.5, origX: nx + 10,
        emoji: "🧌",
      });
    }

    lastX = nx;
    lastY = ny;
  }

  platforms.push({ x: lastX + 80, y: lastY - 20, w: 80, h: 20, type: "finish" });
  return { platforms, enemies, startX: 40, startY: H - 80, darkLevel: true };
}

function gen_1_4_WizardChess(H: number): LevelData {
  // Checkered platforms, chess piece enemies
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Chess board ground
  const tileSize = 60;
  const rows = 3;
  const cols = 12;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isBlack = (r + c) % 2 === 0;
      platforms.push({
        x: c * tileSize + 40,
        y: H - 40 - r * (tileSize + 20) + (r > 0 ? -20 : 0),
        w: tileSize - 4, h: 16,
        type: r === 0 ? "normal" : (c % 3 === 0 ? "moving" : "normal"),
        color: isBlack ? "#1a1a1a" : "#d0d0d0",
        origX: c * tileSize + 40,
        origY: H - 40 - r * (tileSize + 20) + (r > 0 ? -20 : 0),
        moveDir: c % 2 === 0 ? 1 : -1,
        moveRange: r > 0 ? 25 : 0,
      });
    }
  }

  // Chess piece enemies
  const pieces = [
    { col: 2, emoji: "♞", speed: 1.5, label: "Knight" },   // Knight - fast
    { col: 5, emoji: "♜", speed: 0.4, label: "Rook" },     // Rook - slow but wide range
    { col: 8, emoji: "♝", speed: 0.8, label: "Bishop" },   // Bishop
    { col: 10, emoji: "♛", speed: 0.6, label: "Queen" },   // Queen
  ];

  pieces.forEach(p => {
    enemies.push({
      x: p.col * tileSize + 50, y: H - 68, w: 22, h: 22,
      type: "chess", dir: 1, speed: p.speed,
      range: tileSize * 1.5, origX: p.col * tileSize + 50,
      emoji: p.emoji,
    });
  });

  // Upper path to finish
  platforms.push({ x: cols * tileSize + 60, y: H - 120, w: 70, h: 16, type: "normal" });
  platforms.push({ x: cols * tileSize + 160, y: H - 160, w: 70, h: 16, type: "normal" });
  platforms.push({ x: cols * tileSize + 260, y: H - 140, w: 80, h: 20, type: "finish" });

  return { platforms, enemies, startX: 60, startY: H - 60, checkered: true };
}

function gen_1_5_MirrorOfErised(H: number): LevelData {
  // Boss level - hazards, Quirrell enemy, mirror finish
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal" });

  // Fire hazard gaps
  let lastX = 80, lastY = H - 80;
  for (let i = 0; i < 18; i++) {
    const nx = lastX + 55 + Math.random() * 45;
    const ny = Math.max(80, lastY - 15 - Math.random() * 35 + (i % 4 === 0 ? 50 : 0));
    const pw = 45 + Math.random() * 35;

    const isHazard = i % 5 === 3;
    const isDisappearing = i % 7 === 4;

    const p: Platform = {
      x: nx, y: ny, w: pw, h: 16,
      type: isHazard ? "hazard" : isDisappearing ? "disappearing" : "normal",
      visible: true,
    };
    if (isDisappearing) p.timer = 0;
    if (isHazard) p.color = "#6a1a6a"; // purple fire

    platforms.push(p);

    lastX = nx;
    lastY = ny;
  }

  // Quirrell boss - a large, faster enemy near the end
  enemies.push({
    x: lastX - 100, y: lastY - 30, w: 28, h: 28,
    type: "quirrell", dir: 1, speed: 1.2, range: 120, origX: lastX - 100,
    emoji: "🧙",
  });

  // Mirror finish
  platforms.push({
    x: lastX + 80, y: lastY - 20, w: 80, h: 20,
    type: "finish", label: "🪞 Mirror",
  });

  return { platforms, enemies, startX: 40, startY: H - 80, mirrorBoss: true };
}

// ─── Main Generator ────────────────────────────

export function generateLevel(worldId: number, levelIdx: number, canvasW: number, canvasH: number): LevelData {
  // World 1 has themed generators
  if (worldId === 1) {
    switch (levelIdx) {
      case 0: return gen_1_1_HogwartsArrival(canvasH);
      case 1: return gen_1_2_StaircaseMaze(canvasH);
      case 2: return gen_1_3_TrollDungeon(canvasH);
      case 3: return gen_1_4_WizardChess(canvasH);
      case 4: return gen_1_5_MirrorOfErised(canvasH);
    }
  }

  // Generic generator for worlds 2-7 (to be themed later)
  return generateGenericLevel(worldId, levelIdx, canvasW, canvasH);
}

function generateGenericLevel(worldId: number, levelIdx: number, canvasW: number, canvasH: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const difficulty = (worldId - 1) * 5 + levelIdx;
  const isBoss = levelIdx === 4;

  platforms.push({ x: 0, y: canvasH - 40, w: 150, h: 40, type: "normal" });

  const totalPlatforms = 12 + difficulty * 2 + (isBoss ? 8 : 0);
  let lastX = 80, lastY = canvasH - 80;

  for (let i = 0; i < totalPlatforms; i++) {
    const gapX = 60 + Math.random() * (40 + difficulty * 3);
    const gapY = -30 - Math.random() * (30 + difficulty * 2);
    const nx = lastX + gapX;
    const ny = Math.max(80, Math.min(canvasH - 100, lastY + gapY + (Math.random() > 0.5 ? 60 : 0)));
    const pw = 60 + Math.random() * 60 - difficulty;

    let type: Platform["type"] = "normal";
    const roll = Math.random();
    if (difficulty > 3 && roll < 0.2) type = "moving";
    else if (difficulty > 5 && roll < 0.35) type = "disappearing";
    else if (difficulty > 8 && roll < 0.4) type = "hazard";

    const plat: Platform = { x: nx, y: ny, w: Math.max(40, pw), h: 16, type, visible: true };
    if (type === "moving") {
      plat.origX = nx; plat.origY = ny;
      plat.moveDir = Math.random() > 0.5 ? 1 : -1;
      plat.moveRange = 40 + Math.random() * 60;
    }
    if (type === "disappearing") plat.timer = 0;

    platforms.push(plat);

    if (difficulty > 2 && Math.random() < 0.15 + difficulty * 0.01 && type === "normal") {
      enemies.push({
        x: nx + pw / 4, y: ny - 24, w: 20, h: 20,
        type: worldId <= 2 ? "spider" : worldId <= 4 ? "dementor" : "deathEater",
        dir: 1, speed: 0.5 + Math.random(), range: pw * 0.6, origX: nx + pw / 4,
      });
    }

    lastX = nx; lastY = ny;
  }

  platforms.push({ x: lastX + 80, y: lastY - 20, w: 80, h: 20, type: "finish" });
  return { platforms, enemies, startX: 60, startY: canvasH - 80 };
}
