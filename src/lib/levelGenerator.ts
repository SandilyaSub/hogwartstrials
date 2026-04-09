// Themed level generator for each world/level
import { getWorldLevelGenerator } from "./worldGenerators";

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

export interface BossData {
  name: string;
  emoji: string;
  maxHp: number;
  attackSpeed: number;    // frames between attacks
  projectileSpeed: number;
  color: string;
  spellResistance?: string; // spell type boss is resistant to
  weakness?: string;         // spell type boss is weak to
}

export interface SpellDef {
  name: string;
  emoji: string;
  damage: number;
  speed: number;
  cooldown: number; // frames
  color: string;
  key: string; // keyboard key
}

export interface Projectile {
  x: number; y: number; vx: number; vy: number;
  damage: number; color: string; radius: number;
  fromPlayer: boolean; life: number; emoji?: string;
}

export interface HouseToken {
  x: number; y: number;
  collected: boolean;
  points: number; // typically 5-15
}

export interface LevelData {
  platforms: Platform[];
  enemies: Enemy[];
  houseTokens?: HouseToken[];
  startX: number;
  startY: number;
  darkLevel?: boolean;
  checkered?: boolean;
  mirrorBoss?: boolean;
  boatLevel?: boolean;
  flyingCar?: boolean;
  bossArena?: boolean;
  boss?: BossData;
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

  // Per-world, per-level themes
  const worldThemes: Record<string, LevelTheme> = {
    // World 2 - Chamber of Secrets (green/sewer tones)
    "2-0": { bgColors: ["#0a0f1a", "#151a25"], platformColor: "#5a4a3a", platformHighlight: "#8a7a5a", ambientParticles: { color: "hsl(40, 60%, 50%)", count: 5 } },
    "2-1": { bgColors: ["#0a1020", "#152040"], platformColor: "#8a8aaa", platformHighlight: "#b0b0d0", ambientParticles: { color: "hsl(220, 40%, 70%)", count: 8 } },
    "2-2": { bgColors: ["#1a1008", "#2a1a10"], platformColor: "#6a5030", platformHighlight: "#8a7050", ambientParticles: { color: "hsl(40, 50%, 50%)", count: 5 } },
    "2-3": { bgColors: ["#0a0a10", "#10101a"], platformColor: "#3a3a3a", platformHighlight: "#5a5a6a", ambientParticles: { color: "hsl(150, 40%, 40%)", count: 4 } },
    "2-4": { bgColors: ["#0a1a0a", "#052a10"], platformColor: "#2a4a2a", platformHighlight: "#4a7a4a", ambientParticles: { color: "hsl(120, 60%, 40%)", count: 8 } },
    // World 3 - Prisoner of Azkaban (cold purples/blues)
    "3-0": { bgColors: ["#10081a", "#1a1030"], platformColor: "#5a4a6a", platformHighlight: "#8a7a9a", ambientParticles: { color: "hsl(270, 40%, 50%)", count: 6 } },
    "3-1": { bgColors: ["#0d0d15", "#15152a"], platformColor: "#5a5a6a", platformHighlight: "#8a8a9a", ambientParticles: { color: "hsl(40, 50%, 50%)", count: 4 } },
    "3-2": { bgColors: ["#050a05", "#0a150a"], platformColor: "#2a3a1a", platformHighlight: "#4a5a3a", ambientParticles: { color: "hsl(100, 30%, 30%)", count: 3 } },
    "3-3": { bgColors: ["#081020", "#0a1a35"], platformColor: "#6a8aaa", platformHighlight: "#8ab0d0", ambientParticles: { color: "hsl(200, 50%, 60%)", count: 7 } },
    "3-4": { bgColors: ["#0a0a1a", "#0a0a2a"], platformColor: "#3a2a4a", platformHighlight: "#5a4a6a", ambientParticles: { color: "hsl(260, 50%, 40%)", count: 10 } },
    // World 4 - Goblet of Fire (warm oranges/reds)
    "4-0": { bgColors: ["#1a0a00", "#2a1505"], platformColor: "#5a3a1a", platformHighlight: "#8a5a3a", ambientParticles: { color: "hsl(20, 70%, 50%)", count: 6 } },
    "4-1": { bgColors: ["#0a0a15", "#15152a"], platformColor: "#5a5a5a", platformHighlight: "#8a8a8a", ambientParticles: { color: "hsl(200, 20%, 50%)", count: 4 } },
    "4-2": { bgColors: ["#051020", "#0a1a35"], platformColor: "#3a5a7a", platformHighlight: "#5a8aaa", ambientParticles: { color: "hsl(200, 50%, 40%)", count: 8 } },
    "4-3": { bgColors: ["#0a0808", "#151010"], platformColor: "#3a3a3a", platformHighlight: "#5a5a5a", ambientParticles: { color: "hsl(0, 0%, 30%)", count: 3 } },
    "4-4": { bgColors: ["#1a0a00", "#2a1500"], platformColor: "#5a3a1a", platformHighlight: "#7a5a3a", ambientParticles: { color: "hsl(15, 80%, 50%)", count: 10 } },
    // World 5 - Order of the Phoenix (dark blues/greys)
    "5-0": { bgColors: ["#080810", "#10101a"], platformColor: "#3a3a4a", platformHighlight: "#5a5a7a", ambientParticles: { color: "hsl(230, 30%, 50%)", count: 5 } },
    "5-1": { bgColors: ["#060608", "#0a0a10"], platformColor: "#2a2a3a", platformHighlight: "#4a4a5a", ambientParticles: { color: "hsl(270, 40%, 40%)", count: 4 } },
    "5-2": { bgColors: ["#0a0a15", "#151525"], platformColor: "#4a4a5a", platformHighlight: "#6a6a8a", ambientParticles: { color: "hsl(45, 60%, 50%)", count: 6 } },
    "5-3": { bgColors: ["#0a0508", "#150a10"], platformColor: "#4a3a3a", platformHighlight: "#6a5a5a", ambientParticles: { color: "hsl(0, 50%, 40%)", count: 8 } },
    "5-4": { bgColors: ["#0a0a2a", "#001030"], platformColor: "#2a2a5a", platformHighlight: "#4a4a7a", ambientParticles: { color: "hsl(240, 50%, 50%)", count: 10 } },
    // World 6 - Half-Blood Prince (dark greens/teals)
    "6-0": { bgColors: ["#050a0a", "#0a1515"], platformColor: "#2a4a4a", platformHighlight: "#4a6a6a", ambientParticles: { color: "hsl(160, 40%, 40%)", count: 5 } },
    "6-1": { bgColors: ["#0a0a10", "#10101a"], platformColor: "#4a4a5a", platformHighlight: "#6a6a8a", ambientParticles: { color: "hsl(240, 20%, 50%)", count: 4 } },
    "6-2": { bgColors: ["#050505", "#0a0a0a"], platformColor: "#2a2a2a", platformHighlight: "#4a4a4a", ambientParticles: { color: "hsl(0, 0%, 25%)", count: 2 } },
    "6-3": { bgColors: ["#050a10", "#0a1520"], platformColor: "#3a4a5a", platformHighlight: "#5a7a8a", ambientParticles: { color: "hsl(200, 30%, 35%)", count: 6 } },
    "6-4": { bgColors: ["#0a1a1a", "#001a20"], platformColor: "#2a4a4a", platformHighlight: "#4a6a6a", ambientParticles: { color: "hsl(180, 40%, 30%)", count: 8 } },
    // World 7 - Deathly Hallows (dark reds/blacks)
    "7-0": { bgColors: ["#100505", "#1a0a0a"], platformColor: "#4a2a2a", platformHighlight: "#6a4a4a", ambientParticles: { color: "hsl(0, 40%, 35%)", count: 4 } },
    "7-1": { bgColors: ["#0a0808", "#150f0f"], platformColor: "#4a4a4a", platformHighlight: "#6a6a6a", ambientParticles: { color: "hsl(0, 30%, 40%)", count: 5 } },
    "7-2": { bgColors: ["#0a0a15", "#15152a"], platformColor: "#5a5a7a", platformHighlight: "#8a8aaa", ambientParticles: { color: "hsl(0, 60%, 50%)", count: 6 } },
    "7-3": { bgColors: ["#0a0505", "#150808"], platformColor: "#4a3a3a", platformHighlight: "#6a5a5a", ambientParticles: { color: "hsl(0, 50%, 40%)", count: 8 } },
    "7-4": { bgColors: ["#1a0000", "#0a0000"], platformColor: "#4a1a1a", platformHighlight: "#6a3a3a", ambientParticles: { color: "hsl(0, 70%, 45%)", count: 12 } },
  };

  const key = `${worldId}-${levelIdx}`;
  if (worldThemes[key]) return worldThemes[key];

  // Fallback
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
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const waterY = H - 60;

  // Dock start
  platforms.push({ x: 0, y: waterY - 10, w: 120, h: 24, type: "normal", color: "#5a3a1a", label: "🏚️ Dock" });

  // More boats across a longer lake
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
    { x: 1700, w: 85, moving: true },
    { x: 1860, w: 100, moving: false },
    { x: 2020, w: 90, moving: true },
    { x: 2180, w: 95, moving: true },
  ];

  boats.forEach((b, i) => {
    const p: Platform = {
      x: b.x, y: waterY - 14, w: b.w, h: 18,
      type: b.moving ? "moving" : "normal",
      color: "#6a4a2a",
      label: i === 0 ? "⛵" : (i % 4 === 0 ? "🕯️" : ""),
    };
    if (b.moving) {
      p.origX = b.x;
      p.origY = waterY - 14;
      p.moveDir = i % 2 === 0 ? 1 : -1;
      p.moveRange = 15 + (i % 3) * 8;
    }
    platforms.push(p);
  });

  // Rocky outcrops
  platforms.push({ x: 700, y: waterY - 50, w: 60, h: 14, type: "normal", color: "#4a4a4a", label: "🪨" });
  platforms.push({ x: 1500, y: waterY - 45, w: 50, h: 14, type: "normal", color: "#4a4a4a", label: "🪨" });

  // Squid tentacle hazards
  platforms.push({ x: 500, y: waterY - 30, w: 40, h: 12, type: "hazard", color: "#3a2a4a", label: "🦑" });
  platforms.push({ x: 1100, y: waterY - 25, w: 35, h: 12, type: "hazard", color: "#3a2a4a", label: "🦑" });
  platforms.push({ x: 1800, y: waterY - 28, w: 38, h: 12, type: "hazard", color: "#3a2a4a", label: "🦑" });

  // Hogwarts dock finish
  platforms.push({
    x: 2350, y: waterY - 20, w: 100, h: 24,
    type: "finish", color: "#4a3a2a", label: "🏰 Hogwarts",
  });

  return { platforms, enemies, startX: 40, startY: waterY - 50, boatLevel: true };
}

function gen_1_2_StaircaseMaze(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal", color: "#4a4a5a", label: "🏰" });

  // More staircases for a longer level
  const staircases = [
    { baseX: 140, baseY: H - 50, steps: 4, dir: 1, range: 35 },
    { baseX: 350, baseY: H - 130, steps: 3, dir: -1, range: 45 },
    { baseX: 520, baseY: H - 80, steps: 4, dir: 1, range: 30 },
    { baseX: 730, baseY: H - 160, steps: 3, dir: -1, range: 40 },
    { baseX: 900, baseY: H - 110, steps: 4, dir: 1, range: 50 },
    { baseX: 1100, baseY: H - 200, steps: 3, dir: -1, range: 35 },
    { baseX: 1280, baseY: H - 140, steps: 4, dir: 1, range: 45 },
    { baseX: 1460, baseY: H - 230, steps: 3, dir: -1, range: 30 },
    { baseX: 1640, baseY: H - 170, steps: 4, dir: 1, range: 40 },
    { baseX: 1820, baseY: H - 260, steps: 3, dir: -1, range: 50 },
    { baseX: 2000, baseY: H - 200, steps: 4, dir: 1, range: 35 },
  ];

  staircases.forEach((sc, si) => {
    for (let s = 0; s < sc.steps; s++) {
      const stepX = sc.baseX + s * 35;
      const stepY = sc.baseY - s * 28;
      const p: Platform = {
        x: stepX, y: stepY, w: 40, h: 10,
        type: "moving",
        color: (si + s) % 2 === 0 ? "#5a5a6a" : "#4a4a5a",
        origX: stepX, origY: stepY,
        moveDir: sc.dir, moveRange: sc.range,
      };
      platforms.push(p);
    }
    // Candle at top
    const topX = sc.baseX + (sc.steps - 1) * 35 + 20;
    const topY = sc.baseY - (sc.steps - 1) * 28 - 16;
    platforms.push({
      x: topX, y: topY, w: 8, h: 16, type: "normal",
      color: "#6a5a3a", label: "🕯️",
    });
  });

  // Landings between staircases
  platforms.push({ x: 320, y: H - 120, w: 50, h: 14, type: "normal", color: "#5a5a6a" });
  platforms.push({ x: 700, y: H - 150, w: 50, h: 14, type: "normal", color: "#5a5a6a" });
  platforms.push({ x: 1070, y: H - 190, w: 50, h: 14, type: "normal", color: "#5a5a6a" });
  platforms.push({ x: 1430, y: H - 220, w: 50, h: 14, type: "normal", color: "#5a5a6a" });
  platforms.push({ x: 1800, y: H - 250, w: 50, h: 14, type: "normal", color: "#5a5a6a" });

  // Portraits that move
  enemies.push({ x: 400, y: H - 170, w: 20, h: 20, type: "portrait", dir: 1, speed: 0.5, range: 40, origX: 400, emoji: "🖼️" });
  enemies.push({ x: 1000, y: H - 240, w: 20, h: 20, type: "portrait", dir: -1, speed: 0.6, range: 50, origX: 1000, emoji: "🖼️" });
  enemies.push({ x: 1600, y: H - 280, w: 20, h: 20, type: "portrait", dir: 1, speed: 0.5, range: 45, origX: 1600, emoji: "🖼️" });

  platforms.push({ x: 2200, y: H - 320, w: 80, h: 20, type: "finish", label: "🚪 Common Room" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_1_3_TrollDungeon(H: number): LevelData {
  // Dark level with narrow corridors - deterministic layout for reliability
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Ground start
  platforms.push({ x: 0, y: H - 40, w: 150, h: 40, type: "normal" });

  // Predefined platform positions for a fair, playable level
  const layout = [
    { x: 160, y: H - 80, w: 80 },
    { x: 280, y: H - 70, w: 70 },
    { x: 390, y: H - 100, w: 75 },
    { x: 510, y: H - 80, w: 80 },
    { x: 640, y: H - 110, w: 70, troll: true },
    { x: 760, y: H - 90, w: 75 },
    { x: 880, y: H - 120, w: 80 },
    { x: 1010, y: H - 100, w: 70 },
    { x: 1140, y: H - 130, w: 75 },
    { x: 1270, y: H - 110, w: 80, troll: true },
    { x: 1400, y: H - 140, w: 70 },
    { x: 1530, y: H - 120, w: 75 },
    { x: 1660, y: H - 150, w: 80 },
    { x: 1790, y: H - 130, w: 70 },
  ];

  layout.forEach(p => {
    platforms.push({ x: p.x, y: p.y, w: p.w, h: 16, type: "normal" });
    if (p.troll) {
      enemies.push({
        x: p.x + 10, y: p.y - 28, w: 24, h: 24,
        type: "troll", dir: 1, speed: 0.3, range: p.w * 0.5, origX: p.x + 10,
        emoji: "🧌",
      });
    }
  });

  // Hazard puddles between some platforms
  platforms.push({ x: 350, y: H - 30, w: 60, h: 10, type: "hazard", color: "#2a4a2a", label: "☠️ Sludge" });
  platforms.push({ x: 850, y: H - 30, w: 60, h: 10, type: "hazard", color: "#2a4a2a", label: "☠️ Sludge" });
  platforms.push({ x: 1350, y: H - 30, w: 60, h: 10, type: "hazard", color: "#2a4a2a", label: "☠️ Sludge" });

  platforms.push({ x: 1900, y: H - 150, w: 80, h: 20, type: "finish" });
  return { platforms, enemies, startX: 40, startY: H - 80, darkLevel: true };
}

function gen_1_4_WizardChess(H: number): LevelData {
  // Checkered platforms with deadly chess piece NPCs — balanced, not overwhelming
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  const tileSize = 60;
  const rows = 3;
  const cols = 18; // Longer board

  // Starting safe zone
  platforms.push({ x: 0, y: H - 40, w: 80, h: 40, type: "normal", color: "#4a4a5a" });

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const isBlack = (r + c) % 2 === 0;
      // Gaps in the board for challenge
      if (r > 0 && (c === 5 || c === 10 || c === 15)) continue;
      platforms.push({
        x: c * tileSize + 100,
        y: H - 40 - r * (tileSize + 20) + (r > 0 ? -20 : 0),
        w: tileSize - 4, h: 16,
        type: r === 0 ? "normal" : (c % 5 === 0 ? "moving" : "normal"),
        color: isBlack ? "#1a1a1a" : "#d0d0d0",
        origX: c * tileSize + 100,
        origY: H - 40 - r * (tileSize + 20) + (r > 0 ? -20 : 0),
        moveDir: c % 2 === 0 ? 1 : -1,
        moveRange: r > 0 ? 20 : 0,
      });
    }
  }

  // Fewer chess pieces — strategic placement, not a wall of death
  // Pawns — only a few
  for (let c = 2; c < cols; c += 4) {
    enemies.push({
      x: c * tileSize + 110, y: H - 68, w: 18, h: 18,
      type: "chess", dir: 1, speed: 0.4,
      range: tileSize * 0.7, origX: c * tileSize + 110,
      emoji: "♟",
    });
  }

  // One knight patrolling mid-section
  enemies.push({ x: 6 * tileSize + 110, y: H - 128, w: 22, h: 22, type: "chess", dir: 1, speed: 1.5, range: tileSize * 2, origX: 6 * tileSize + 110, emoji: "♞" });

  // One rook with wide patrol in later section
  enemies.push({ x: 11 * tileSize + 110, y: H - 68, w: 22, h: 22, type: "chess", dir: -1, speed: 0.5, range: tileSize * 2.5, origX: 11 * tileSize + 110, emoji: "♜" });

  // Bishop in upper tier
  enemies.push({ x: 9 * tileSize + 110, y: H - 128, w: 20, h: 20, type: "chess", dir: 1, speed: 0.8, range: tileSize * 1.5, origX: 9 * tileSize + 110, emoji: "♝" });

  // Queen guards near the end — fast but contained
  enemies.push({ x: 14 * tileSize + 110, y: H - 68, w: 24, h: 24, type: "chess", dir: 1, speed: 1.2, range: tileSize * 2, origX: 14 * tileSize + 110, emoji: "♛" });

  // King at end (slow, mostly decorative)
  enemies.push({ x: 16 * tileSize + 110, y: H - 128, w: 24, h: 24, type: "chess", dir: 1, speed: 0.2, range: tileSize * 0.4, origX: 16 * tileSize + 110, emoji: "♚" });

  // Path to finish
  platforms.push({ x: cols * tileSize + 130, y: H - 100, w: 70, h: 16, type: "normal" });
  platforms.push({ x: cols * tileSize + 230, y: H - 140, w: 80, h: 20, type: "finish", label: "♔ Victory" });

  return { platforms, enemies, startX: 30, startY: H - 60, checkered: true };
}

function gen_1_5_MirrorOfErised(H: number): LevelData {
  // Boss arena - flat ground, fight Quirrell/Voldemort
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Arena floor
  platforms.push({ x: 0, y: H - 40, w: 600, h: 40, type: "normal" });
  // Some elevated platforms for dodging
  platforms.push({ x: 80, y: H - 120, w: 80, h: 14, type: "normal" });
  platforms.push({ x: 280, y: H - 140, w: 80, h: 14, type: "normal" });
  platforms.push({ x: 460, y: H - 110, w: 80, h: 14, type: "normal" });

  const boss: BossData = {
    name: "Professor Quirrell",
    emoji: "🧙",
    maxHp: 100,
    attackSpeed: 80,
    projectileSpeed: 3,
    color: "#6a1a6a",
    weakness: "stupefy",
  };

  return { platforms, enemies, startX: 60, startY: H - 80, bossArena: true, boss };
}

// Available spells for boss fights
export function getBossSpells(worldId: number): SpellDef[] {
  // Base spells available from world 1
  const spells: SpellDef[] = [
    { name: "Stupefy", emoji: "⚡", damage: 12, speed: 7, cooldown: 30, color: "#e74c3c", key: "1" },
    { name: "Expelliarmus", emoji: "✨", damage: 8, speed: 9, cooldown: 20, color: "#f39c12", key: "2" },
    { name: "Petrificus", emoji: "❄️", damage: 15, speed: 5, cooldown: 50, color: "#3498db", key: "3" },
  ];

  // Unlock more spells in later worlds
  if (worldId >= 3) {
    spells.push({ name: "Patronus", emoji: "🦌", damage: 20, speed: 6, cooldown: 90, color: "#ecf0f1", key: "4" });
  }
  if (worldId >= 5) {
    spells.push({ name: "Sectumsempra", emoji: "🗡️", damage: 25, speed: 8, cooldown: 70, color: "#8e44ad", key: "5" });
  }

  return spells;
}

// Boss data for each world
export function getWorldBoss(worldId: number): BossData {
  const bosses: Record<number, BossData> = {
    1: { name: "Professor Quirrell", emoji: "🧙", maxHp: 100, attackSpeed: 80, projectileSpeed: 3, color: "#6a1a6a", weakness: "stupefy" },
    2: { name: "Basilisk", emoji: "🐍", maxHp: 150, attackSpeed: 60, projectileSpeed: 3.5, color: "#1a4a1a", weakness: "expelliarmus" },
    3: { name: "Dementor Swarm", emoji: "👻", maxHp: 180, attackSpeed: 50, projectileSpeed: 4, color: "#1a1a2a", weakness: "patronus" },
    4: { name: "Hungarian Horntail", emoji: "🐉", maxHp: 200, attackSpeed: 45, projectileSpeed: 4.5, color: "#4a2a0a", weakness: "stupefy" },
    5: { name: "Bellatrix", emoji: "🧙‍♀️", maxHp: 220, attackSpeed: 40, projectileSpeed: 5, color: "#2a0a2a", weakness: "expelliarmus" },
    6: { name: "Inferi Horde", emoji: "💀", maxHp: 250, attackSpeed: 35, projectileSpeed: 4, color: "#0a1a1a", weakness: "stupefy" },
    7: { name: "Lord Voldemort", emoji: "🐍", maxHp: 350, attackSpeed: 25, projectileSpeed: 6, color: "#1a0a0a", weakness: "expelliarmus" },
  };
  return bosses[worldId] || bosses[1];
}

// Generate house tokens placed above platforms
function generateHouseTokens(platforms: Platform[]): HouseToken[] {
  const tokens: HouseToken[] = [];
  const eligiblePlatforms = platforms.filter(p => 
    p.type === "normal" || p.type === "moving" || p.type === "ice"
  );
  
  // Place tokens above ~30% of eligible platforms
  eligiblePlatforms.forEach((p, i) => {
    if (i % 3 === 1 && tokens.length < 8) {
      tokens.push({
        x: p.x + p.w / 2,
        y: p.y - 30,
        collected: false,
        points: 5 + (i % 3) * 5, // 5, 10, or 15 points
      });
    }
  });
  
  return tokens;
}

// ─── Main Generator ────────────────────────────

export function generateLevel(worldId: number, levelIdx: number, canvasW: number, canvasH: number): LevelData {
  let data: LevelData;
  
  // World 1 has themed generators
  if (worldId === 1) {
    switch (levelIdx) {
      case 0: data = gen_1_1_HogwartsArrival(canvasH); break;
      case 1: data = gen_1_2_StaircaseMaze(canvasH); break;
      case 2: data = gen_1_3_TrollDungeon(canvasH); break;
      case 3: data = gen_1_4_WizardChess(canvasH); break;
      case 4: data = gen_1_5_MirrorOfErised(canvasH); break;
      default: data = generateGenericLevel(worldId, levelIdx, canvasW, canvasH); break;
    }
  } else {
    // Worlds 2-7 themed generators
    const themed = getWorldLevelGenerator(worldId, levelIdx, canvasH);
    data = themed || generateGenericLevel(worldId, levelIdx, canvasW, canvasH);
  }
  
  // Auto-generate house tokens if not already set
  if (!data.houseTokens || data.houseTokens.length === 0) {
    data.houseTokens = generateHouseTokens(data.platforms);
  }
  
  return data;
}

function generateGenericLevel(worldId: number, levelIdx: number, canvasW: number, canvasH: number): LevelData {
  const isBoss = levelIdx === 4;

  // Boss levels get an arena with spell combat
  if (isBoss) {
    return generateBossArena(worldId, canvasH);
  }

  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const difficulty = (worldId - 1) * 5 + levelIdx;

  platforms.push({ x: 0, y: canvasH - 40, w: 150, h: 40, type: "normal" });

  const totalPlatforms = 12 + difficulty * 2;
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

function generateBossArena(worldId: number, H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const boss = getWorldBoss(worldId);

  // Arena floor
  platforms.push({ x: 0, y: H - 40, w: 600, h: 40, type: "normal" });

  // Dodge platforms - more for harder worlds
  const numPlatforms = 2 + Math.min(worldId, 4);
  for (let i = 0; i < numPlatforms; i++) {
    platforms.push({
      x: 60 + i * (480 / numPlatforms),
      y: H - 100 - (i % 2) * 40,
      w: 70, h: 14, type: "normal",
    });
  }

  return { platforms, enemies, startX: 60, startY: H - 80, bossArena: true, boss };
}
