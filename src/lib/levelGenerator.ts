// Themed level generator for each world/level
import { getWorldLevelGenerator } from "./worldGenerators";
import quirrellAvatar from "@/assets/bosses/quirrell.png";
import basiliskAvatar from "@/assets/bosses/basilisk.png";
import dementorAvatar from "@/assets/bosses/dementor.png";
import horntailAvatar from "@/assets/bosses/horntail.png";
import umbridgeAvatar from "@/assets/bosses/umbridge.png";
import inferiAvatar from "@/assets/bosses/inferi.png";
import voldemortAvatar from "@/assets/bosses/voldemort.png";

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
  avatar?: string;
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

export interface Coin {
  x: number; y: number;
  collected: boolean;
  value: number; // shop coins awarded (1-3)
}

export interface LevelData {
  platforms: Platform[];
  enemies: Enemy[];
  houseTokens?: HouseToken[];
  coins?: Coin[];
  startX: number;
  startY: number;
  darkLevel?: boolean;
  checkered?: boolean;
  mirrorBoss?: boolean;
  boatLevel?: boolean;
  flyingCar?: boolean;
  hippogriffFlight?: boolean;
  thestralFlight?: boolean;
  dragonFlight?: boolean;
  broomFlight?: boolean;
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
      case 0: return { bgColors: ["#02040c", "#0a1230"], platformColor: "#3a2a1a", platformHighlight: "#7a5a30", ambientParticles: { color: "hsl(220, 70%, 50%)", count: 8 } }; // Lake at night, Hogwarts in distance
      case 1: return { bgColors: ["#0d0d15", "#15152a"], platformColor: "#4a4a5a", platformHighlight: "#7a7a8a", ambientParticles: { color: "hsl(240, 30%, 50%)", count: 5 } };
      case 2: return { bgColors: ["#080605", "#1a0f08"], platformColor: "#3a3a2a", platformHighlight: "#a0703a", ambientParticles: { color: "hsl(25, 70%, 50%)", count: 5 } }; // Troll Dungeon - torchlit stone
      case 3: return { bgColors: ["#0a0a0f", "#151520"], platformColor: "#2a2a2a", platformHighlight: "#e0e0e0", ambientParticles: { color: "hsl(0, 0%, 80%)", count: 4 } };
      case 4: return { bgColors: ["#0a0808", "#151010"], platformColor: "#4a3a2a", platformHighlight: "#6a5a4a", ambientParticles: { color: "hsl(30, 40%, 40%)", count: 5 } };
      case 5: return { bgColors: ["#050805", "#0a100a"], platformColor: "#2a4a2a", platformHighlight: "#4a6a4a", ambientParticles: { color: "hsl(120, 50%, 30%)", count: 4 } };
      case 6: return { bgColors: ["#0a1020", "#152040"], platformColor: "#6a6a8a", platformHighlight: "#8a8aaa", ambientParticles: { color: "hsl(220, 40%, 60%)", count: 8 } };
      case 7: return { bgColors: ["#0a0a10", "#10101a"], platformColor: "#3a4a3a", platformHighlight: "#5a6a5a", ambientParticles: { color: "hsl(160, 40%, 40%)", count: 5 } };
      case 8: return { bgColors: ["#0a0510", "#15081a"], platformColor: "#4a3a5a", platformHighlight: "#6a5a7a", ambientParticles: { color: "hsl(280, 40%, 40%)", count: 6 } };
      case 9: return { bgColors: ["#100a1a", "#1a0a2a"], platformColor: "#4a3a5a", platformHighlight: "#9a7ab0", ambientParticles: { color: "hsl(280, 60%, 60%)", count: 10 } };
    }
  }

  // Per-world, per-level themes
  const worldThemes: Record<string, LevelTheme> = {
    // World 2 - Chamber of Secrets
    "2-0": { bgColors: ["#0a0f1a", "#151a25"], platformColor: "#5a4a3a", platformHighlight: "#8a7a5a", ambientParticles: { color: "hsl(40, 60%, 50%)", count: 5 } },
    "2-1": { bgColors: ["#0a1020", "#152040"], platformColor: "#8a8aaa", platformHighlight: "#b0b0d0", ambientParticles: { color: "hsl(220, 40%, 70%)", count: 8 } },
    "2-2": { bgColors: ["#1a1008", "#2a1a10"], platformColor: "#6a5030", platformHighlight: "#8a7050", ambientParticles: { color: "hsl(40, 50%, 50%)", count: 5 } },
    "2-3": { bgColors: ["#0a0a10", "#10101a"], platformColor: "#3a3a3a", platformHighlight: "#5a5a6a", ambientParticles: { color: "hsl(150, 40%, 40%)", count: 4 } },
    "2-4": { bgColors: ["#0a150a", "#0a200a"], platformColor: "#3a4a2a", platformHighlight: "#5a6a4a", ambientParticles: { color: "hsl(100, 40%, 35%)", count: 5 } },
    "2-5": { bgColors: ["#08101a", "#101a25"], platformColor: "#3a5a6a", platformHighlight: "#5a7a8a", ambientParticles: { color: "hsl(200, 40%, 50%)", count: 6 } },
    "2-6": { bgColors: ["#050a05", "#0a150a"], platformColor: "#2a3a2a", platformHighlight: "#4a5a4a", ambientParticles: { color: "hsl(120, 30%, 30%)", count: 4 } },
    "2-7": { bgColors: ["#0a0a10", "#10101a"], platformColor: "#2a3a3a", platformHighlight: "#4a5a5a", ambientParticles: { color: "hsl(150, 30%, 35%)", count: 4 } },
    "2-8": { bgColors: ["#0a0a0f", "#101020"], platformColor: "#4a3a2a", platformHighlight: "#6a5a4a", ambientParticles: { color: "hsl(40, 40%, 40%)", count: 6 } },
    "2-9": { bgColors: ["#030a05", "#082a15"], platformColor: "#1a4a2a", platformHighlight: "#3a8a4a", ambientParticles: { color: "hsl(140, 70%, 35%)", count: 10 } }, // Chamber of Secrets - serpentine green
    // World 3 - Prisoner of Azkaban
    "3-0": { bgColors: ["#10081a", "#1a1030"], platformColor: "#5a4a6a", platformHighlight: "#8a7a9a", ambientParticles: { color: "hsl(270, 40%, 50%)", count: 6 } },
    "3-1": { bgColors: ["#0d0d15", "#15152a"], platformColor: "#5a5a6a", platformHighlight: "#8a8a9a", ambientParticles: { color: "hsl(40, 50%, 50%)", count: 4 } },
    "3-2": { bgColors: ["#050a05", "#0a150a"], platformColor: "#2a3a1a", platformHighlight: "#4a5a3a", ambientParticles: { color: "hsl(100, 30%, 30%)", count: 3 } },
    "3-3": { bgColors: ["#081020", "#0a1a35"], platformColor: "#6a8aaa", platformHighlight: "#8ab0d0", ambientParticles: { color: "hsl(200, 50%, 60%)", count: 7 } },
    "3-4": { bgColors: ["#0a1020", "#152040"], platformColor: "#6a6a8a", platformHighlight: "#8a8aaa", ambientParticles: { color: "hsl(220, 40%, 60%)", count: 7 } },
    "3-5": { bgColors: ["#0a0510", "#15081a"], platformColor: "#3a2a3a", platformHighlight: "#5a4a5a", ambientParticles: { color: "hsl(300, 30%, 35%)", count: 4 } },
    "3-6": { bgColors: ["#0a0a0f", "#151520"], platformColor: "#4a4a5a", platformHighlight: "#6a6a7a", ambientParticles: { color: "hsl(240, 20%, 40%)", count: 5 } },
    "3-7": { bgColors: ["#050a05", "#0a150a"], platformColor: "#3a3a2a", platformHighlight: "#5a5a4a", ambientParticles: { color: "hsl(100, 30%, 30%)", count: 3 } },
    "3-8": { bgColors: ["#0a0810", "#15101a"], platformColor: "#4a3a5a", platformHighlight: "#6a5a7a", ambientParticles: { color: "hsl(270, 40%, 45%)", count: 6 } },
    "3-9": { bgColors: ["#0a0a1a", "#0a0a2a"], platformColor: "#3a2a4a", platformHighlight: "#5a4a6a", ambientParticles: { color: "hsl(260, 50%, 40%)", count: 10 } },
    // World 4 - Goblet of Fire (book chronological order)
    "4-0": { bgColors: ["#100a05", "#1a1a10"], platformColor: "#4a3a2a", platformHighlight: "#7a5a3a", ambientParticles: { color: "hsl(40, 60%, 50%)", count: 7 } }, // Portkey Field - dawn campsite
    "4-1": { bgColors: ["#0a0a15", "#15152a"], platformColor: "#5a5a5a", platformHighlight: "#8a8a8a", ambientParticles: { color: "hsl(200, 20%, 50%)", count: 4 } }, // Cliff Jumps
    "4-2": { bgColors: ["#1a0a00", "#2a1505"], platformColor: "#5a3a1a", platformHighlight: "#8a5a3a", ambientParticles: { color: "hsl(20, 70%, 50%)", count: 8 } }, // Dragon Arena - fire
    "4-3": { bgColors: ["#0a0815", "#15102a"], platformColor: "#3a3a5a", platformHighlight: "#aacae8", ambientParticles: { color: "hsl(220, 60%, 75%)", count: 8 } }, // Yule Ball - icy ballroom
    "4-4": { bgColors: ["#020815", "#04162a"], platformColor: "#1a3a5a", platformHighlight: "#3a7aaa", ambientParticles: { color: "hsl(200, 80%, 55%)", count: 12 } }, // Black Lake underwater
    "4-5": { bgColors: ["#020812", "#031020"], platformColor: "#1a3a4a", platformHighlight: "#2a6a8a", ambientParticles: { color: "hsl(180, 70%, 50%)", count: 10 } }, // Merpeople Village - deep
    "4-6": { bgColors: ["#0a100a", "#0a1a0a"], platformColor: "#2a4a2a", platformHighlight: "#4a6a4a", ambientParticles: { color: "hsl(120, 40%, 35%)", count: 5 } }, // Triwizard Maze
    "4-7": { bgColors: ["#0a0808", "#151010"], platformColor: "#3a3a3a", platformHighlight: "#5a5a5a", ambientParticles: { color: "hsl(0, 0%, 30%)", count: 4 } }, // Graveyard
    "4-8": { bgColors: ["#100a10", "#1a0a1a"], platformColor: "#5a3a5a", platformHighlight: "#caa030", ambientParticles: { color: "hsl(45, 80%, 55%)", count: 10 } }, // Priori Incantatem - golden
    "4-9": { bgColors: ["#1a0a00", "#2a1500"], platformColor: "#5a3a1a", platformHighlight: "#7a5a3a", ambientParticles: { color: "hsl(15, 80%, 50%)", count: 10 } }, // Boss
    // World 5 - Order of the Phoenix (book chronological order)
    "5-0": { bgColors: ["#3a1a25", "#5a2538"], platformColor: "#aa4a6a", platformHighlight: "#e08aa0", ambientParticles: { color: "hsl(330, 50%, 60%)", count: 6 } }, // Umbridge's pink office
    "5-1": { bgColors: ["#1a1008", "#2a1a10"], platformColor: "#5a4a3a", platformHighlight: "#7a6a5a", ambientParticles: { color: "hsl(40, 50%, 50%)", count: 6 } }, // Room of Requirement (warm wood)
    "5-2": { bgColors: ["#0a0a15", "#151525"], platformColor: "#4a4a5a", platformHighlight: "#6a6a8a", ambientParticles: { color: "hsl(45, 60%, 50%)", count: 6 } }, // D.A. Training
    "5-3": { bgColors: ["#100a1a", "#1a1030"], platformColor: "#3a2a4a", platformHighlight: "#5a4a7a", ambientParticles: { color: "hsl(50, 70%, 60%)", count: 8 } }, // DA showdown - patronus glow
    "5-4": { bgColors: ["#0a0508", "#150a10"], platformColor: "#4a3a3a", platformHighlight: "#6a5a5a", ambientParticles: { color: "hsl(0, 50%, 40%)", count: 8 } }, // Chaos Corridor
    "5-5": { bgColors: ["#000005", "#0a0a20"], platformColor: "#2a2a3a", platformHighlight: "#4a4a6a", ambientParticles: { color: "hsl(240, 30%, 50%)", count: 6 } }, // Thestral Flight - midnight
    "5-6": { bgColors: ["#080810", "#10101a"], platformColor: "#3a3a4a", platformHighlight: "#5a5a7a", ambientParticles: { color: "hsl(230, 30%, 50%)", count: 5 } }, // Ministry Atrium
    "5-7": { bgColors: ["#060608", "#0a0a10"], platformColor: "#2a2a3a", platformHighlight: "#4a4a5a", ambientParticles: { color: "hsl(200, 70%, 60%)", count: 8 } }, // Hall of Prophecy - blue glow
    "5-8": { bgColors: ["#000003", "#08080f"], platformColor: "#1a1a25", platformHighlight: "#3a3a4a", ambientParticles: { color: "hsl(260, 40%, 35%)", count: 5 } }, // Veil Chamber - pitch dark
    "5-9": { bgColors: ["#3a1a25", "#1a0a15"], platformColor: "#5a2a3a", platformHighlight: "#aa4a6a", ambientParticles: { color: "hsl(330, 60%, 55%)", count: 12 } }, // Battle of Ministry / Umbridge boss
    // World 6 - Half-Blood Prince
    "6-0": { bgColors: ["#050a0a", "#0a1515"], platformColor: "#2a4a4a", platformHighlight: "#4a6a6a", ambientParticles: { color: "hsl(160, 40%, 40%)", count: 5 } },
    "6-1": { bgColors: ["#0a0a10", "#10101a"], platformColor: "#4a4a5a", platformHighlight: "#6a6a8a", ambientParticles: { color: "hsl(240, 20%, 50%)", count: 4 } },
    "6-2": { bgColors: ["#050505", "#0a0a0a"], platformColor: "#2a2a2a", platformHighlight: "#4a4a4a", ambientParticles: { color: "hsl(0, 0%, 25%)", count: 2 } },
    "6-3": { bgColors: ["#000005", "#020812"], platformColor: "#1a2a3a", platformHighlight: "#3a8a6a", ambientParticles: { color: "hsl(140, 80%, 45%)", count: 10 } }, // Inferi cave - emerald potion glow
    "6-4": { bgColors: ["#1a100a", "#2a1a10"], platformColor: "#6a5a3a", platformHighlight: "#8a7a5a", ambientParticles: { color: "hsl(40, 50%, 50%)", count: 5 } },
    "6-5": { bgColors: ["#08101a", "#101a25"], platformColor: "#3a5a6a", platformHighlight: "#5a7a8a", ambientParticles: { color: "hsl(200, 40%, 50%)", count: 6 } },
    "6-6": { bgColors: ["#0a0810", "#15101a"], platformColor: "#4a3a5a", platformHighlight: "#6a5a7a", ambientParticles: { color: "hsl(280, 40%, 45%)", count: 5 } },
    "6-7": { bgColors: ["#0a0a10", "#10101a"], platformColor: "#4a4a5a", platformHighlight: "#6a6a8a", ambientParticles: { color: "hsl(240, 20%, 50%)", count: 5 } },
    "6-8": { bgColors: ["#0a0a0f", "#151520"], platformColor: "#4a4a5a", platformHighlight: "#6a6a7a", ambientParticles: { color: "hsl(200, 30%, 40%)", count: 5 } },
    "6-9": { bgColors: ["#0a1a1a", "#001a20"], platformColor: "#2a4a4a", platformHighlight: "#4a6a6a", ambientParticles: { color: "hsl(180, 40%, 30%)", count: 8 } },
    // World 7 - Deathly Hallows
    "7-0": { bgColors: ["#100505", "#1a0a0a"], platformColor: "#4a2a2a", platformHighlight: "#6a4a4a", ambientParticles: { color: "hsl(0, 40%, 35%)", count: 4 } },
    "7-1": { bgColors: ["#0a0808", "#150f0f"], platformColor: "#4a4a4a", platformHighlight: "#6a6a6a", ambientParticles: { color: "hsl(0, 30%, 40%)", count: 5 } },
    "7-2": { bgColors: ["#0a0a15", "#15152a"], platformColor: "#5a5a7a", platformHighlight: "#8a8aaa", ambientParticles: { color: "hsl(0, 60%, 50%)", count: 6 } },
    "7-3": { bgColors: ["#0a0505", "#150808"], platformColor: "#4a3a3a", platformHighlight: "#6a5a5a", ambientParticles: { color: "hsl(0, 50%, 40%)", count: 8 } },
    "7-4": { bgColors: ["#0a0a10", "#10101a"], platformColor: "#3a3a4a", platformHighlight: "#5a5a6a", ambientParticles: { color: "hsl(230, 30%, 40%)", count: 4 } },
    "7-5": { bgColors: ["#1a0a00", "#2a1500"], platformColor: "#5a3a1a", platformHighlight: "#7a5a3a", ambientParticles: { color: "hsl(15, 70%, 45%)", count: 7 } },
    "7-6": { bgColors: ["#050a05", "#0a150a"], platformColor: "#2a3a1a", platformHighlight: "#4a5a3a", ambientParticles: { color: "hsl(100, 30%, 30%)", count: 3 } },
    "7-7": { bgColors: ["#0a0508", "#150a10"], platformColor: "#4a3a3a", platformHighlight: "#6a5a5a", ambientParticles: { color: "hsl(0, 40%, 35%)", count: 5 } },
    "7-8": { bgColors: ["#0a0808", "#151010"], platformColor: "#4a3a3a", platformHighlight: "#6a5a5a", ambientParticles: { color: "hsl(0, 50%, 40%)", count: 8 } },
    "7-9": { bgColors: ["#1a0000", "#0a0000"], platformColor: "#4a1a1a", platformHighlight: "#6a3a3a", ambientParticles: { color: "hsl(0, 70%, 45%)", count: 12 } },
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

function gen_1_6_DevilsSnare(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Start platform — you've just dropped through the trapdoor
  platforms.push({ x: 0, y: H - 40, w: 140, h: 40, type: "normal", color: "#2a3a1a", label: "🕳️ Trapdoor" });

  // Vine-covered walls — hazard platforms lining bottom (the snare itself)
  for (let i = 0; i < 25; i++) {
    platforms.push({
      x: 160 + i * 90, y: H - 20, w: 85, h: 20, type: "hazard",
      color: "#1a3a0a", label: i % 3 === 0 ? "🌿" : "🍃",
    });
  }

  // Vine tendrils reaching up from below — hazard pillars
  const tendrils = [200, 450, 700, 1000, 1300, 1600, 1900];
  tendrils.forEach((x, i) => {
    const tendrilH = 60 + (i % 3) * 30;
    platforms.push({
      x, y: H - tendrilH, w: 20, h: tendrilH - 20, type: "hazard",
      color: "#1a4a0a", label: "🌱",
    });
  });

  // Safe platforms — roots and rocky ledges to escape upward
  const safePlatforms = [
    { x: 80, y: H - 90, w: 70, label: "🪨" },
    { x: 220, y: H - 120, w: 60, label: "🪵" },
    { x: 370, y: H - 85, w: 65, label: "🪨" },
    { x: 500, y: H - 130, w: 70, label: "🪵" },
    { x: 640, y: H - 100, w: 55, label: "🪨" },
    { x: 780, y: H - 140, w: 65, label: "🪵" },
    { x: 920, y: H - 110, w: 60, label: "🪨" },
    { x: 1060, y: H - 150, w: 70, label: "🪵" },
    { x: 1200, y: H - 120, w: 55, label: "🪨" },
    { x: 1350, y: H - 160, w: 65, label: "🪵" },
    { x: 1500, y: H - 130, w: 60, label: "🪨" },
    { x: 1650, y: H - 170, w: 70, label: "🪵" },
    { x: 1800, y: H - 140, w: 55, label: "🪨" },
    { x: 1950, y: H - 180, w: 65, label: "🪵" },
  ];
  safePlatforms.forEach(p => {
    platforms.push({ x: p.x, y: p.y, w: p.w, h: 14, type: "normal", color: "#4a3a1a", label: p.label });
  });

  // Higher escape route — light beams (bright platforms you must reach)
  const lightBeams = [
    { x: 300, y: H - 200 },
    { x: 600, y: H - 220 },
    { x: 900, y: H - 210 },
    { x: 1250, y: H - 230 },
    { x: 1550, y: H - 220 },
    { x: 1850, y: H - 240 },
  ];
  lightBeams.forEach(lb => {
    platforms.push({ x: lb.x, y: lb.y, w: 50, h: 12, type: "normal", color: "#e0d080", label: "☀️" });
  });

  // Disappearing vine bridges — they crumble as you step
  platforms.push({ x: 160, y: H - 70, w: 50, h: 10, type: "disappearing", timer: 0, visible: true, color: "#2a5a1a", label: "🌿" });
  platforms.push({ x: 550, y: H - 75, w: 50, h: 10, type: "disappearing", timer: 0, visible: true, color: "#2a5a1a", label: "🌿" });
  platforms.push({ x: 850, y: H - 80, w: 50, h: 10, type: "disappearing", timer: 0, visible: true, color: "#2a5a1a", label: "🌿" });
  platforms.push({ x: 1150, y: H - 85, w: 50, h: 10, type: "disappearing", timer: 0, visible: true, color: "#2a5a1a", label: "🌿" });
  platforms.push({ x: 1450, y: H - 80, w: 50, h: 10, type: "disappearing", timer: 0, visible: true, color: "#2a5a1a", label: "🌿" });
  platforms.push({ x: 1750, y: H - 75, w: 50, h: 10, type: "disappearing", timer: 0, visible: true, color: "#2a5a1a", label: "🌿" });

  // Animated vine enemies — they swing back and forth grabbing at you
  enemies.push({ x: 300, y: H - 100, w: 22, h: 22, type: "vine", dir: 1, speed: 0.6, range: 50, origX: 300, emoji: "🌿" });
  enemies.push({ x: 600, y: H - 110, w: 22, h: 22, type: "vine", dir: -1, speed: 0.8, range: 60, origX: 600, emoji: "🌿" });
  enemies.push({ x: 900, y: H - 90, w: 24, h: 24, type: "vine", dir: 1, speed: 0.7, range: 55, origX: 900, emoji: "🌿" });
  enemies.push({ x: 1200, y: H - 120, w: 22, h: 22, type: "vine", dir: -1, speed: 0.9, range: 65, origX: 1200, emoji: "🌿" });
  enemies.push({ x: 1500, y: H - 100, w: 24, h: 24, type: "vine", dir: 1, speed: 1.0, range: 50, origX: 1500, emoji: "🌿" });
  enemies.push({ x: 1850, y: H - 130, w: 24, h: 24, type: "vine", dir: -1, speed: 0.8, range: 70, origX: 1850, emoji: "🌿" });

  // Finish — escape into the light!
  platforms.push({ x: 2100, y: H - 200, w: 100, h: 20, type: "finish", label: "☀️ Escape!" });

  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_1_7_FlyingKeys(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Grand chamber floor — you start here before mounting a broom
  platforms.push({ x: 0, y: H - 40, w: 160, h: 40, type: "normal", color: "#4a3a5a", label: "🏰 Chamber" });

  // Scattered stone ledges and columns throughout the tall chamber
  const ledges = [
    { x: 200, y: H - 80, w: 70 },
    { x: 350, y: H - 130, w: 60 },
    { x: 500, y: H - 180, w: 70 },
    { x: 650, y: H - 100, w: 55 },
    { x: 800, y: H - 150, w: 65 },
    { x: 950, y: H - 200, w: 60 },
    { x: 1100, y: H - 120, w: 70 },
    { x: 1250, y: H - 170, w: 55 },
    { x: 1400, y: H - 220, w: 65 },
    { x: 1550, y: H - 140, w: 60 },
    { x: 1700, y: H - 190, w: 70 },
    { x: 1850, y: H - 240, w: 55 },
    { x: 2000, y: H - 160, w: 65 },
    { x: 2150, y: H - 210, w: 60 },
    { x: 2300, y: H - 260, w: 70 },
  ];
  ledges.forEach((l, i) => {
    platforms.push({
      x: l.x, y: l.y, w: l.w, h: 14, type: "normal",
      color: i % 2 === 0 ? "#5a4a6a" : "#4a3a5a",
      label: i % 4 === 0 ? "🏛️" : "",
    });
  });

  // Moving key-shaped platforms — these flutter up and down like the keys
  const keyPlatforms = [
    { x: 280, y: H - 160, range: 40 },
    { x: 580, y: H - 220, range: 50 },
    { x: 880, y: H - 180, range: 35 },
    { x: 1180, y: H - 250, range: 45 },
    { x: 1480, y: H - 200, range: 40 },
    { x: 1780, y: H - 270, range: 50 },
    { x: 2080, y: H - 230, range: 35 },
  ];
  keyPlatforms.forEach((kp, i) => {
    const p: Platform = {
      x: kp.x, y: kp.y, w: 45, h: 12, type: "moving",
      color: "#c0a040", label: "🔑",
      origX: kp.x, origY: kp.y,
      moveDir: i % 2 === 0 ? 1 : -1, moveRange: kp.range,
    };
    platforms.push(p);
  });

  // Hazard platforms — old rusty keys that hurt if touched
  platforms.push({ x: 450, y: H - 110, w: 35, h: 10, type: "hazard", color: "#8a4a2a", label: "🗝️" });
  platforms.push({ x: 750, y: H - 160, w: 35, h: 10, type: "hazard", color: "#8a4a2a", label: "🗝️" });
  platforms.push({ x: 1050, y: H - 200, w: 35, h: 10, type: "hazard", color: "#8a4a2a", label: "🗝️" });
  platforms.push({ x: 1350, y: H - 150, w: 35, h: 10, type: "hazard", color: "#8a4a2a", label: "🗝️" });
  platforms.push({ x: 1650, y: H - 230, w: 35, h: 10, type: "hazard", color: "#8a4a2a", label: "🗝️" });
  platforms.push({ x: 1950, y: H - 180, w: 35, h: 10, type: "hazard", color: "#8a4a2a", label: "🗝️" });

  // Flying key enemies — they swarm and dive at you
  enemies.push({ x: 300, y: H - 200, w: 18, h: 18, type: "key", dir: 1, speed: 1.5, range: 80, origX: 300, emoji: "🔑" });
  enemies.push({ x: 550, y: H - 250, w: 18, h: 18, type: "key", dir: -1, speed: 1.8, range: 90, origX: 550, emoji: "🔑" });
  enemies.push({ x: 800, y: H - 180, w: 20, h: 20, type: "key", dir: 1, speed: 1.3, range: 70, origX: 800, emoji: "🔑" });
  enemies.push({ x: 1050, y: H - 230, w: 18, h: 18, type: "key", dir: -1, speed: 2.0, range: 100, origX: 1050, emoji: "🔑" });
  enemies.push({ x: 1300, y: H - 200, w: 20, h: 20, type: "key", dir: 1, speed: 1.6, range: 85, origX: 1300, emoji: "🔑" });
  enemies.push({ x: 1600, y: H - 260, w: 18, h: 18, type: "key", dir: -1, speed: 1.9, range: 95, origX: 1600, emoji: "🔑" });
  enemies.push({ x: 1900, y: H - 220, w: 20, h: 20, type: "key", dir: 1, speed: 1.4, range: 75, origX: 1900, emoji: "🔑" });
  enemies.push({ x: 2200, y: H - 280, w: 22, h: 22, type: "key", dir: -1, speed: 2.2, range: 110, origX: 2200, emoji: "🔑" });

  // The door with the correct key — finish
  platforms.push({ x: 2450, y: H - 250, w: 100, h: 20, type: "finish", label: "🚪 The Door" });

  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_1_5_FluffyChamber(H: number): LevelData {
  // Fluffy's Chamber - sneak past the three-headed dog using music-enchanted platforms
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Entrance corridor
  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal", color: "#4a3a2a", label: "🚪 Third Floor" });

  // Corridor approach with suits of armor
  const corridor = [
    { x: 160, y: H - 60, w: 80 }, { x: 280, y: H - 55, w: 70 },
    { x: 400, y: H - 65, w: 75 }, { x: 530, y: H - 55, w: 80 },
    { x: 660, y: H - 70, w: 70 }, { x: 790, y: H - 60, w: 75 },
  ];
  corridor.forEach((p, i) => {
    platforms.push({ x: p.x, y: p.y, w: p.w, h: 16, type: "normal", color: "#4a4a5a", label: i % 3 === 0 ? "🗡️" : "" });
  });

  // Fluffy's room - wide area with the sleeping dog
  platforms.push({ x: 950, y: H - 40, w: 300, h: 40, type: "normal", color: "#3a2a1a", label: "🐕 Fluffy's Chamber" });

  // Fluffy as a patrolling enemy (slow when harp plays)
  enemies.push({ x: 1050, y: H - 72, w: 40, h: 28, type: "fluffy", dir: 1, speed: 0.4, range: 100, origX: 1050, emoji: "🐕‍🦺" });

  // Enchanted harp platforms (safe zones)
  platforms.push({ x: 980, y: H - 100, w: 50, h: 12, type: "normal", color: "#c0a040", label: "🎵" });
  platforms.push({ x: 1100, y: H - 120, w: 50, h: 12, type: "normal", color: "#c0a040", label: "🎵" });
  platforms.push({ x: 1200, y: H - 90, w: 50, h: 12, type: "normal", color: "#c0a040", label: "🎵" });

  // Path past Fluffy to the trapdoor
  platforms.push({ x: 1300, y: H - 60, w: 70, h: 16, type: "normal", color: "#3a2a1a" });
  platforms.push({ x: 1420, y: H - 80, w: 65, h: 16, type: "normal", color: "#3a2a1a" });
  platforms.push({ x: 1540, y: H - 100, w: 70, h: 16, type: "normal", color: "#3a2a1a" });
  platforms.push({ x: 1660, y: H - 75, w: 65, h: 16, type: "normal", color: "#3a2a1a" });
  platforms.push({ x: 1780, y: H - 110, w: 60, h: 16, type: "disappearing", timer: 0, visible: true, color: "#5a4a3a" });
  platforms.push({ x: 1900, y: H - 90, w: 70, h: 16, type: "normal", color: "#3a2a1a" });

  // More guardian dogs (smaller)
  enemies.push({ x: 1500, y: H - 108, w: 22, h: 22, type: "fluffy", dir: -1, speed: 0.6, range: 60, origX: 1500, emoji: "🐕" });
  enemies.push({ x: 1800, y: H - 138, w: 22, h: 22, type: "fluffy", dir: 1, speed: 0.5, range: 50, origX: 1800, emoji: "🐕" });

  // Trapdoor finish
  platforms.push({ x: 2050, y: H - 120, w: 100, h: 20, type: "finish", label: "🕳️ Trapdoor" });

  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_1_8_PotionRiddle(H: number): LevelData {
  // Snape's potion puzzle - fire barriers and potion-colored platforms
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal", color: "#3a3a3a", label: "🧪 Snape's Challenge" });

  // Purple flame barriers (hazards)
  const flamePositions = [250, 550, 850, 1150, 1500, 1800];
  flamePositions.forEach(x => {
    platforms.push({ x, y: H - 100, w: 20, h: 80, type: "hazard", color: "#6a1a8a", label: "🔮" });
  });

  // Black flame barriers
  platforms.push({ x: 400, y: H - 90, w: 20, h: 70, type: "hazard", color: "#1a1a1a", label: "🔥" });
  platforms.push({ x: 1000, y: H - 90, w: 20, h: 70, type: "hazard", color: "#1a1a1a", label: "🔥" });
  platforms.push({ x: 1650, y: H - 90, w: 20, h: 70, type: "hazard", color: "#1a1a1a", label: "🔥" });

  // Potion bottle platforms (safe stepping stones over flames)
  const potions = [
    { x: 160, y: H - 80, color: "#2a6a2a", label: "🧪" },
    { x: 300, y: H - 110, color: "#8a2a2a", label: "☠️" },
    { x: 430, y: H - 90, color: "#2a2a8a", label: "🧪" },
    { x: 560, y: H - 120, color: "#2a6a2a", label: "🧪" },
    { x: 700, y: H - 100, color: "#8a8a2a", label: "🧪" },
    { x: 830, y: H - 130, color: "#2a6a2a", label: "🧪" },
    { x: 960, y: H - 110, color: "#8a2a2a", label: "☠️" },
    { x: 1100, y: H - 140, color: "#2a2a8a", label: "🧪" },
    { x: 1240, y: H - 120, color: "#2a6a2a", label: "🧪" },
    { x: 1380, y: H - 150, color: "#8a8a2a", label: "🧪" },
    { x: 1520, y: H - 130, color: "#2a6a2a", label: "🧪" },
    { x: 1660, y: H - 160, color: "#2a2a8a", label: "🧪" },
    { x: 1800, y: H - 140, color: "#2a6a2a", label: "🧪" },
    { x: 1940, y: H - 170, color: "#8a8a2a", label: "🧪" },
  ];
  potions.forEach((p, i) => {
    platforms.push({
      x: p.x, y: p.y, w: 55, h: 14,
      type: i % 5 === 3 ? "disappearing" : "normal",
      timer: 0, visible: true, color: p.color, label: p.label,
    });
  });

  // Poison bottle enemies that float around
  enemies.push({ x: 350, y: H - 150, w: 18, h: 18, type: "potion", dir: 1, speed: 0.7, range: 60, origX: 350, emoji: "🧪" });
  enemies.push({ x: 750, y: H - 160, w: 18, h: 18, type: "potion", dir: -1, speed: 0.8, range: 70, origX: 750, emoji: "🧪" });
  enemies.push({ x: 1300, y: H - 180, w: 20, h: 20, type: "potion", dir: 1, speed: 0.9, range: 80, origX: 1300, emoji: "🧪" });
  enemies.push({ x: 1700, y: H - 190, w: 20, h: 20, type: "potion", dir: -1, speed: 1.0, range: 75, origX: 1700, emoji: "🧪" });

  platforms.push({ x: 2100, y: H - 180, w: 100, h: 20, type: "finish", label: "🔥 Final Chamber" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_1_9_ForbiddenCorridor(H: number): LevelData {
  // The last corridor before the Mirror - enchantments from each professor
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal", color: "#3a2a3a", label: "🏰 Final Corridor" });

  // Sprout's section - living vine platforms
  for (let i = 0; i < 4; i++) {
    platforms.push({
      x: 150 + i * 100, y: H - 70 - i * 15, w: 65, h: 14,
      type: i % 2 === 0 ? "normal" : "disappearing", timer: 0, visible: true,
      color: "#2a5a1a", label: i === 0 ? "🌿 Sprout" : "🌱",
    });
  }
  enemies.push({ x: 250, y: H - 110, w: 20, h: 20, type: "vine", dir: 1, speed: 0.6, range: 50, origX: 250, emoji: "🌿" });

  // Flitwick's section - floating charm platforms
  for (let i = 0; i < 4; i++) {
    const p: Platform = {
      x: 600 + i * 110, y: H - 100 - i * 20, w: 55, h: 12,
      type: "moving", color: "#4a4a8a", label: i === 0 ? "✨ Flitwick" : "✨",
      origX: 600 + i * 110, origY: H - 100 - i * 20,
      moveDir: i % 2 === 0 ? 1 : -1, moveRange: 30 + i * 10,
    };
    platforms.push(p);
  }

  // McGonagall's section - transfigured platforms that change
  for (let i = 0; i < 4; i++) {
    platforms.push({
      x: 1100 + i * 100, y: H - 120 - i * 15, w: 60, h: 14,
      type: "disappearing", timer: 0, visible: true,
      color: "#5a3a3a", label: i === 0 ? "🐱 McGonagall" : "🔄",
    });
  }
  enemies.push({ x: 1200, y: H - 170, w: 20, h: 20, type: "chess", dir: -1, speed: 0.8, range: 60, origX: 1200, emoji: "♟" });

  // Snape's section - dark magic residue
  for (let i = 0; i < 4; i++) {
    platforms.push({
      x: 1550 + i * 100, y: H - 140 - i * 20, w: 55, h: 14,
      type: "normal", color: "#2a2a2a", label: i === 0 ? "🧪 Snape" : "☠️",
    });
  }
  platforms.push({ x: 1650, y: H - 50, w: 60, h: 10, type: "hazard", color: "#3a1a3a", label: "💀 Curse" });
  platforms.push({ x: 1850, y: H - 50, w: 60, h: 10, type: "hazard", color: "#3a1a3a", label: "💀 Curse" });

  // Quirrell's dark energy at the end
  enemies.push({ x: 1750, y: H - 200, w: 22, h: 22, type: "darkMagic", dir: 1, speed: 1.0, range: 70, origX: 1750, emoji: "💀" });
  enemies.push({ x: 1900, y: H - 180, w: 22, h: 22, type: "darkMagic", dir: -1, speed: 0.9, range: 60, origX: 1900, emoji: "💀" });

  platforms.push({ x: 2050, y: H - 200, w: 100, h: 20, type: "finish", label: "🪞 Mirror Chamber" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_1_10_MirrorOfErised(H: number): LevelData {
  // Boss arena - fight Quirrell/Voldemort
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
    1: { name: "Professor Quirrell", emoji: "🧙", maxHp: 100, attackSpeed: 80, projectileSpeed: 3, color: "#6a1a6a", weakness: "stupefy", avatar: quirrellAvatar },
    2: { name: "Basilisk", emoji: "🐍", maxHp: 150, attackSpeed: 60, projectileSpeed: 3.5, color: "#1a4a1a", weakness: "expelliarmus", avatar: basiliskAvatar },
    3: { name: "Dementor Swarm", emoji: "👻", maxHp: 180, attackSpeed: 50, projectileSpeed: 4, color: "#1a1a2a", weakness: "patronus", avatar: dementorAvatar },
    4: { name: "Hungarian Horntail", emoji: "🐉", maxHp: 200, attackSpeed: 45, projectileSpeed: 4.5, color: "#4a2a0a", weakness: "stupefy", avatar: horntailAvatar },
    5: { name: "Dolores Umbridge", emoji: "🎀", maxHp: 220, attackSpeed: 40, projectileSpeed: 5, color: "#cc66aa", weakness: "expelliarmus", avatar: umbridgeAvatar },
    6: { name: "Inferi Horde", emoji: "💀", maxHp: 250, attackSpeed: 35, projectileSpeed: 4, color: "#0a1a1a", weakness: "stupefy", avatar: inferiAvatar },
    7: { name: "Lord Voldemort", emoji: "🐍", maxHp: 350, attackSpeed: 25, projectileSpeed: 6, color: "#1a0a0a", weakness: "expelliarmus", avatar: voldemortAvatar },
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

// Generate scattered shop coins (separate from house tokens) — these are pulled by the Accio Coins magnet
function generateCoins(platforms: Platform[]): Coin[] {
  const coins: Coin[] = [];
  const eligible = platforms.filter(p =>
    p.type === "normal" || p.type === "moving" || p.type === "ice"
  );
  eligible.forEach((p, i) => {
    // Skip platforms that already host a house token (those are at i % 3 === 1)
    if (i % 3 === 1) return;
    if (coins.length >= 14) return;
    // Place 1-3 coins above the platform in a small arc
    const count = 1 + (i % 3);
    for (let k = 0; k < count; k++) {
      const offset = (k - (count - 1) / 2) * 22;
      coins.push({
        x: p.x + p.w / 2 + offset,
        y: p.y - 28 - Math.abs(offset) * 0.4,
        collected: false,
        value: 1,
      });
    }
  });
  return coins;
}


export function generateLevel(worldId: number, levelIdx: number, canvasW: number, canvasH: number): LevelData {
  let data: LevelData;
  
  // World 1 has themed generators
  if (worldId === 1) {
    switch (levelIdx) {
      case 0: data = gen_1_1_HogwartsArrival(canvasH); break;
      case 1: data = gen_1_2_StaircaseMaze(canvasH); break;
      case 2: data = gen_1_3_TrollDungeon(canvasH); break;
      case 3: data = gen_1_4_WizardChess(canvasH); break;
      case 4: data = gen_1_5_FluffyChamber(canvasH); break;
      case 5: data = gen_1_6_DevilsSnare(canvasH); break;
      case 6: data = gen_1_7_FlyingKeys(canvasH); break;
      case 7: data = gen_1_8_PotionRiddle(canvasH); break;
      case 8: data = gen_1_9_ForbiddenCorridor(canvasH); break;
      case 9: data = gen_1_10_MirrorOfErised(canvasH); break;
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

  // Auto-generate scattered shop coins (skip for boss arenas and flight levels — those have other dynamics)
  if (!data.coins && !data.bossArena && !data.flyingCar && !data.hippogriffFlight && !data.thestralFlight && !data.dragonFlight && !data.broomFlight) {
    data.coins = generateCoins(data.platforms);
  } else if (!data.coins) {
    data.coins = [];
  }

  return data;
}

function generateGenericLevel(worldId: number, levelIdx: number, canvasW: number, canvasH: number): LevelData {
  const isBoss = levelIdx === 9;

  // Boss levels get an arena with spell combat
  if (isBoss) {
    return generateBossArena(worldId, canvasH);
  }

  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const rawDifficulty = (worldId - 1) * 5 + levelIdx;
  // Cap difficulty scaling so later levels stay challenging but never impossible
  const difficulty = Math.min(rawDifficulty, 25);

  platforms.push({ x: 0, y: canvasH - 40, w: 150, h: 40, type: "normal" });

  const totalPlatforms = 12 + Math.min(difficulty, 20) * 2;
  let lastX = 80, lastY = canvasH - 80;

  for (let i = 0; i < totalPlatforms; i++) {
    // Cap gap size so jumps are always reachable
    const maxGapX = Math.min(40 + difficulty * 3, 100);
    const gapX = 60 + Math.random() * maxGapX;
    const maxGapY = Math.min(30 + difficulty * 2, 70);
    const gapY = -30 - Math.random() * maxGapY;
    const nx = lastX + gapX;
    const ny = Math.max(80, Math.min(canvasH - 100, lastY + gapY + (Math.random() > 0.5 ? 60 : 0)));
    // Ensure platforms are never too narrow
    const pw = Math.max(50, 60 + Math.random() * 60 - Math.min(difficulty, 15));

    let type: Platform["type"] = "normal";
    const roll = Math.random();
    if (difficulty > 3 && roll < 0.15) type = "moving";
    else if (difficulty > 5 && roll < 0.25) type = "disappearing";
    else if (difficulty > 8 && roll < 0.3) type = "hazard";

    const plat: Platform = { x: nx, y: ny, w: Math.max(50, pw), h: 16, type, visible: true };
    if (type === "moving") {
      plat.origX = nx; plat.origY = ny;
      plat.moveDir = Math.random() > 0.5 ? 1 : -1;
      plat.moveRange = 40 + Math.random() * 60;
    }
    if (type === "disappearing") plat.timer = 0;

    platforms.push(plat);

    if (difficulty > 2 && Math.random() < Math.min(0.15 + difficulty * 0.01, 0.3) && type === "normal") {
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
