// Themed level generators for Worlds 2-7
import type { Platform, Enemy, LevelData } from "./levelGenerator";

// ─── WORLD 2: Chamber of Secrets ────────────────────────

function gen_2_1_DiagonAlley(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Cobblestone street - continuous ground
  for (let i = 0; i < 30; i++) {
    platforms.push({
      x: i * 80, y: H - 40, w: 78, h: 40, type: "normal",
      color: i % 2 === 0 ? "#5a4a3a" : "#4d4030",
    });
  }

  // Shop buildings - tall blocks with shop fronts you jump onto and between
  const shops = [
    { x: 100, w: 120, h: 90, name: "Ollivanders", emoji: "🪄", color: "#5a3a2a", awning: "#8a3333" },
    { x: 280, w: 100, h: 70, name: "Flourish & Blotts", emoji: "📚", color: "#3a4a5a", awning: "#3355aa" },
    { x: 440, w: 110, h: 100, name: "Eeylops Owl Emporium", emoji: "🦉", color: "#4a3a2a", awning: "#6a5a2a" },
    { x: 620, w: 90, h: 60, name: "Potage's Cauldrons", emoji: "⚗️", color: "#3a3a3a", awning: "#555555" },
    { x: 770, w: 130, h: 110, name: "Quality Quidditch", emoji: "🧹", color: "#3a2a1a", awning: "#aa4444" },
    { x: 970, w: 100, h: 80, name: "Madam Malkin's", emoji: "👗", color: "#4a3a5a", awning: "#7744aa" },
    { x: 1130, w: 120, h: 95, name: "Weasleys' WWW", emoji: "🎆", color: "#5a3a1a", awning: "#dd6600" },
    { x: 1320, w: 110, h: 75, name: "Magical Menagerie", emoji: "🐱", color: "#2a4a3a", awning: "#338855" },
    { x: 1500, w: 100, h: 85, name: "Slug & Jiggers", emoji: "🧪", color: "#3a3a2a", awning: "#667744" },
  ];

  shops.forEach(shop => {
    // Shop body (tall platform you can walk behind or jump onto)
    const shopTop = H - 40 - shop.h;
    platforms.push({
      x: shop.x, y: shopTop, w: shop.w, h: 16,
      type: "normal", color: shop.color, label: `${shop.emoji} ${shop.name}`,
    });
    // Awning ledge (lower, can stand on but disappears)
    platforms.push({
      x: shop.x + 10, y: shopTop + 35, w: shop.w - 20, h: 10,
      type: "disappearing", timer: 0, visible: true, color: shop.awning,
    });
    // Window ledge (narrow foothold on side)
    platforms.push({
      x: shop.x - 15, y: shopTop + 55, w: 20, h: 8,
      type: "normal", color: "#6a5a4a",
    });
  });

  // Floating signs between shops
  const signs = [
    { x: 230, y: H - 120, label: "🪧" },
    { x: 560, y: H - 100, label: "🏮" },
    { x: 900, y: H - 130, label: "🪧" },
    { x: 1250, y: H - 110, label: "🏮" },
  ];
  signs.forEach(s => {
    platforms.push({ x: s.x, y: s.y, w: 30, h: 8, type: "normal", color: "#7a5a3a", label: s.label });
  });

  // Street carts as moving platforms
  const p1: Platform = { x: 360, y: H - 55, w: 50, h: 12, type: "moving", color: "#6a5a3a", label: "🛒", origX: 360, origY: H - 55, moveDir: 1, moveRange: 60 };
  const p2: Platform = { x: 850, y: H - 55, w: 50, h: 12, type: "moving", color: "#6a5a3a", label: "🛒", origX: 850, origY: H - 55, moveDir: -1, moveRange: 50 };
  platforms.push(p1, p2);

  // NPCs wandering the street (wizards, goblins)
  enemies.push({ x: 200, y: H - 68, w: 18, h: 18, type: "wizard_npc", dir: 1, speed: 0.4, range: 80, origX: 200, emoji: "🧙" });
  enemies.push({ x: 500, y: H - 68, w: 16, h: 16, type: "goblin", dir: -1, speed: 0.6, range: 50, origX: 500, emoji: "👺" });
  enemies.push({ x: 750, y: H - 68, w: 18, h: 18, type: "wizard_npc", dir: 1, speed: 0.5, range: 70, origX: 750, emoji: "🧙‍♀️" });
  enemies.push({ x: 1050, y: H - 68, w: 16, h: 16, type: "goblin", dir: -1, speed: 0.7, range: 60, origX: 1050, emoji: "👺" });
  enemies.push({ x: 1400, y: H - 68, w: 18, h: 18, type: "wizard_npc", dir: 1, speed: 0.4, range: 90, origX: 1400, emoji: "🧙" });

  // Gringotts at the end - grand entrance
  platforms.push({ x: 1700, y: H - 160, w: 140, h: 20, type: "finish", label: "🏦 Gringotts Bank" });
  // Steps leading up to Gringotts
  platforms.push({ x: 1650, y: H - 70, w: 60, h: 14, type: "normal", color: "#e0d0b0" });
  platforms.push({ x: 1680, y: H - 100, w: 60, h: 14, type: "normal", color: "#e0d0b0" });
  platforms.push({ x: 1710, y: H - 130, w: 60, h: 14, type: "normal", color: "#e0d0b0" });

  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_2_2_FlyingEscape(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Invisible floor and ceiling boundaries
  platforms.push({ x: 0, y: H - 30, w: 10000, h: 30, type: "hazard", color: "transparent" });
  platforms.push({ x: 0, y: 0, w: 10000, h: 10, type: "hazard", color: "transparent" });

  // Clouds to dodge — fewer but larger, spaced out more
  for (let i = 0; i < 30; i++) {
    const x = 500 + i * 280 + (i % 3) * 60;
    const y = 50 + ((i * 137) % (H - 130));
    const w = 60 + (i % 3) * 25;
    const h = 25 + (i % 2) * 12;
    platforms.push({
      x, y, w, h, type: "hazard",
      color: "#c0c0d0", label: "☁️",
    });
  }

  // Birds to dodge — moderate count
  for (let i = 0; i < 10; i++) {
    const x = 800 + i * 700;
    const y = 60 + ((i * 211) % (H - 140));
    enemies.push({
      x, y, w: 22, h: 22, type: "bird",
      dir: -1, speed: 1.5 + (i % 3) * 0.4, range: 180,
      origX: x, emoji: "🦅",
    });
  }

  // Whomping Willow tree tops
  for (let i = 0; i < 5; i++) {
    const x = 1200 + i * 1600;
    platforms.push({
      x, y: H - 100, w: 70, h: 70, type: "hazard",
      color: "#3a5a2a", label: "🌳",
    });
  }

  // Hogwarts castle — the finish
  platforms.push({ x: 9200, y: H / 2 - 30, w: 120, h: 60, type: "finish", label: "🏰 Hogwarts" });

  return { platforms, enemies, startX: 60, startY: H / 2, flyingCar: true };
}

function gen_2_3_DetentionLockhart(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Lockhart's office - warm wooden classroom floor
  // Continuous floor sections (desks and gaps between them)
  platforms.push({ x: 0, y: H - 40, w: 160, h: 40, type: "normal", color: "#6a5030", label: "🪑 Desk" });

  // Desk platforms across the office - jump between desks stacked with fan mail
  const desks = [
    { x: 200, y: H - 50, w: 100, label: "📬 Fan Mail" },
    { x: 360, y: H - 70, w: 80, label: "✉️ Letters" },
    { x: 500, y: H - 50, w: 110, label: "📬 Fan Mail" },
    { x: 670, y: H - 80, w: 90, label: "🖋️ Quills" },
    { x: 820, y: H - 55, w: 100, label: "📬 Fan Mail" },
    { x: 980, y: H - 75, w: 80, label: "✉️ Letters" },
    { x: 1120, y: H - 50, w: 110, label: "📬 Fan Mail" },
    { x: 1290, y: H - 85, w: 90, label: "🖋️ Quills" },
    { x: 1440, y: H - 55, w: 100, label: "📬 Fan Mail" },
    { x: 1600, y: H - 70, w: 80, label: "✉️ Letters" },
  ];

  desks.forEach(d => {
    platforms.push({
      x: d.x, y: d.y, w: d.w, h: 16, type: "normal",
      color: "#7a5a30", label: d.label,
    });
  });

  // Bookshelves (tall platforms to climb)
  const shelves = [
    { x: 300, y: H - 130, w: 60 },
    { x: 620, y: H - 140, w: 55 },
    { x: 940, y: H - 135, w: 60 },
    { x: 1250, y: H - 145, w: 55 },
    { x: 1550, y: H - 130, w: 60 },
  ];
  shelves.forEach(s => {
    platforms.push({
      x: s.x, y: s.y, w: s.w, h: 14, type: "normal",
      color: "#5a3a1a", label: "📚",
    });
  });

  // Lockhart portrait platforms (disappearing - they wink and vanish!)
  platforms.push({ x: 180, y: H - 120, w: 40, h: 10, type: "disappearing", timer: 0, visible: true, color: "#8a6a3a", label: "🖼️" });
  platforms.push({ x: 750, y: H - 130, w: 40, h: 10, type: "disappearing", timer: 0, visible: true, color: "#8a6a3a", label: "🖼️" });
  platforms.push({ x: 1150, y: H - 125, w: 40, h: 10, type: "disappearing", timer: 0, visible: true, color: "#8a6a3a", label: "🖼️" });
  platforms.push({ x: 1500, y: H - 140, w: 40, h: 10, type: "disappearing", timer: 0, visible: true, color: "#8a6a3a", label: "🖼️" });

  // Flying envelopes (enemies - fan mail attacking you!)
  enemies.push({ x: 250, y: H - 90, w: 18, h: 14, type: "fanmail", dir: 1, speed: 1.2, range: 80, origX: 250, emoji: "💌" });
  enemies.push({ x: 550, y: H - 100, w: 18, h: 14, type: "fanmail", dir: -1, speed: 1.5, range: 90, origX: 550, emoji: "💌" });
  enemies.push({ x: 870, y: H - 85, w: 18, h: 14, type: "fanmail", dir: 1, speed: 1.0, range: 70, origX: 870, emoji: "💌" });
  enemies.push({ x: 1100, y: H - 110, w: 20, h: 16, type: "fanmail", dir: -1, speed: 1.8, range: 100, origX: 1100, emoji: "💌" });
  enemies.push({ x: 1350, y: H - 90, w: 18, h: 14, type: "fanmail", dir: 1, speed: 1.3, range: 80, origX: 1350, emoji: "💌" });
  enemies.push({ x: 1580, y: H - 105, w: 20, h: 16, type: "fanmail", dir: -1, speed: 1.6, range: 90, origX: 1580, emoji: "💌" });

  // Lockhart himself wandering around (big, slow, annoying)
  enemies.push({ x: 450, y: H - 78, w: 24, h: 28, type: "lockhart", dir: 1, speed: 0.3, range: 60, origX: 450, emoji: "🧑‍🦱" });
  enemies.push({ x: 1000, y: H - 78, w: 24, h: 28, type: "lockhart", dir: -1, speed: 0.35, range: 70, origX: 1000, emoji: "🧑‍🦱" });

  // Pixies (from Lockhart's disastrous class) - fast and erratic
  enemies.push({ x: 380, y: H - 150, w: 16, h: 16, type: "pixie", dir: 1, speed: 2.0, range: 50, origX: 380, emoji: "🧚" });
  enemies.push({ x: 780, y: H - 160, w: 16, h: 16, type: "pixie", dir: -1, speed: 2.2, range: 55, origX: 780, emoji: "🧚" });
  enemies.push({ x: 1200, y: H - 155, w: 16, h: 16, type: "pixie", dir: 1, speed: 2.5, range: 60, origX: 1200, emoji: "🧚" });

  // Finish - escape the detention!
  platforms.push({ x: 1750, y: H - 100, w: 100, h: 20, type: "finish", label: "🚪 Escape!" });

  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_2_4_ChamberDoors(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal" });

  // Series of rooms with doors (disappearing platforms = doors that open)
  for (let room = 0; room < 6; room++) {
    const rx = 150 + room * 260;
    // Floor of room
    platforms.push({ x: rx, y: H - 40, w: 200, h: 40, type: "normal", color: "#3a3a3a" });
    // Door (disappearing - touch to open)
    platforms.push({
      x: rx + 200, y: H - 100, w: 20, h: 60, type: "disappearing",
      timer: 0, visible: true, color: "#6a4a2a", label: "🚪",
    });
    // Platforms to jump to within room
    platforms.push({ x: rx + 40, y: H - 100, w: 60, h: 14, type: "normal" });
    platforms.push({ x: rx + 120, y: H - 130, w: 60, h: 14, type: "normal" });

    // Snake enemies in some rooms
    if (room % 2 === 1) {
      enemies.push({
        x: rx + 60, y: H - 68, w: 20, h: 20,
        type: "snake", dir: 1, speed: 0.7, range: 80, origX: rx + 60, emoji: "🐍",
      });
    }
  }

  platforms.push({ x: 1720, y: H - 100, w: 80, h: 20, type: "finish", label: "🐍 Chamber" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

// ─── WORLD 3: Prisoner of Azkaban ────────────────────────

function gen_3_1_TimePlatforms(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal" });

  // Longer time-shifting level with more variety
  for (let i = 0; i < 26; i++) {
    const x = 140 + i * 95;
    const y = H - 80 - Math.sin(i * 0.5) * 50 - i * 5;
    const isTimeShift = i % 4 === 0;
    const isMoving = i % 6 === 3;
    const p: Platform = {
      x, y, w: 55 + (i % 2) * 20, h: 14,
      type: isTimeShift ? "disappearing" : isMoving ? "moving" : "normal",
      timer: 0, visible: true,
      color: isTimeShift ? "#8a6aaa" : isMoving ? "#6a6a9a" : undefined,
      label: isTimeShift ? "⏳" : isMoving ? "⚙️" : "",
    };
    if (isMoving) {
      p.origX = x; p.origY = y;
      p.moveDir = i % 2 === 0 ? 1 : -1;
      p.moveRange = 35;
    }
    platforms.push(p);
  }

  // More dementors spread throughout
  enemies.push({ x: 400, y: H - 140, w: 20, h: 20, type: "dementor", dir: 1, speed: 0.5, range: 70, origX: 400, emoji: "👻" });
  enemies.push({ x: 900, y: H - 200, w: 20, h: 20, type: "dementor", dir: -1, speed: 0.6, range: 60, origX: 900, emoji: "👻" });
  enemies.push({ x: 1500, y: H - 250, w: 22, h: 22, type: "dementor", dir: 1, speed: 0.7, range: 80, origX: 1500, emoji: "👻" });
  enemies.push({ x: 2000, y: H - 180, w: 20, h: 20, type: "dementor", dir: -1, speed: 0.5, range: 65, origX: 2000, emoji: "👻" });

  platforms.push({ x: 2600, y: H - 280, w: 80, h: 20, type: "finish", label: "⏰ Time Turner" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_3_2_ClockTower(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Vertical climb up the clock tower
  platforms.push({ x: 0, y: H - 40, w: 200, h: 40, type: "normal" });

  // Ascending platforms with moving gears
  for (let i = 0; i < 20; i++) {
    const x = 50 + (i % 4) * 100 + Math.sin(i) * 50;
    const y = H - 80 - i * 35;
    const isGear = i % 4 === 0;
    const p: Platform = {
      x, y, w: 70, h: 14,
      type: isGear ? "moving" : "normal",
      color: isGear ? "#8a7a3a" : "#4a4a5a",
      label: isGear ? "⚙️" : "",
    };
    if (isGear) {
      p.origX = x; p.origY = y;
      p.moveDir = i % 2 === 0 ? 1 : -1;
      p.moveRange = 50;
    }
    platforms.push(p);
  }

  // Pendulum hazards
  platforms.push({ x: 200, y: H - 300, w: 30, h: 8, type: "hazard", color: "#8a6a2a", label: "🔔" });
  platforms.push({ x: 300, y: H - 500, w: 30, h: 8, type: "hazard", color: "#8a6a2a", label: "🔔" });

  platforms.push({ x: 200, y: H - 780, w: 100, h: 20, type: "finish", label: "🕐 Top" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
}

function gen_3_3_ForestRun(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 140, h: 40, type: "normal", color: "#2a3a1a" });

  // Longer forest floor with tree root platforms
  for (let i = 0; i < 24; i++) {
    const x = 160 + i * 100;
    const y = H - 50 - (i % 4) * 15 - (i % 3) * 20;
    platforms.push({
      x, y, w: 55 + (i % 3) * 15, h: 14,
      type: i % 7 === 0 ? "disappearing" : "normal",
      timer: 0, visible: true,
      color: "#3a2a1a",
      label: i % 5 === 0 ? "🍄" : "",
    });
  }

  // Tree branch platforms (higher) — more of them
  for (let i = 0; i < 12; i++) {
    platforms.push({
      x: 200 + i * 200, y: H - 130 - (i % 3) * 30,
      w: 50, h: 10, type: "normal", color: "#4a3a1a", label: "🌿",
    });
  }

  // Spiders, centaurs, and wolves
  enemies.push({ x: 300, y: H - 78, w: 20, h: 20, type: "spider", dir: 1, speed: 0.7, range: 50, origX: 300, emoji: "🕷️" });
  enemies.push({ x: 700, y: H - 78, w: 24, h: 24, type: "centaur", dir: -1, speed: 1.0, range: 70, origX: 700, emoji: "🐴" });
  enemies.push({ x: 1100, y: H - 78, w: 20, h: 20, type: "spider", dir: 1, speed: 0.9, range: 60, origX: 1100, emoji: "🕷️" });
  enemies.push({ x: 1500, y: H - 150, w: 22, h: 22, type: "spider", dir: -1, speed: 1.1, range: 55, origX: 1500, emoji: "🕷️" });
  enemies.push({ x: 1900, y: H - 78, w: 24, h: 24, type: "wolf", dir: 1, speed: 1.3, range: 80, origX: 1900, emoji: "🐺" });

  platforms.push({ x: 2600, y: H - 100, w: 80, h: 20, type: "finish", label: "🌙 Clearing" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_3_4_IceLake(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 100, h: 40, type: "normal" });

  // Ice platforms (slippery!)
  for (let i = 0; i < 18; i++) {
    const x = 120 + i * 100;
    const y = H - 60 - (i % 3) * 20 - i * 4;
    platforms.push({
      x, y, w: 70 + (i % 2) * 20, h: 14,
      type: "ice", color: "#8ac8e8",
    });
  }

  // Dementors hovering
  enemies.push({ x: 350, y: H - 130, w: 22, h: 22, type: "dementor", dir: 1, speed: 0.4, range: 100, origX: 350, emoji: "👻" });
  enemies.push({ x: 800, y: H - 150, w: 22, h: 22, type: "dementor", dir: -1, speed: 0.5, range: 80, origX: 800, emoji: "👻" });
  enemies.push({ x: 1400, y: H - 180, w: 24, h: 24, type: "dementor", dir: 1, speed: 0.6, range: 90, origX: 1400, emoji: "👻" });

  platforms.push({ x: 1920, y: H - 160, w: 80, h: 20, type: "finish", label: "🏠 Shore" });
  return { platforms, enemies, startX: 30, startY: H - 80 };
}

// ─── WORLD 4: Goblet of Fire ────────────────────────

function gen_4_1_DragonArena(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal" });

  // Longer rocky arena with fire hazards and varied terrain
  for (let i = 0; i < 22; i++) {
    const x = 140 + i * 110;
    const y = H - 70 - (i % 3) * 30 - i * 4;
    const isFire = i % 6 === 3;
    const isMoving = i % 5 === 2;
    const p: Platform = {
      x, y, w: 60 + (i % 2) * 15, h: 14,
      type: isFire ? "hazard" : isMoving ? "moving" : "normal",
      color: isFire ? "#aa3a0a" : "#5a4a3a",
      label: isFire ? "🔥" : isMoving ? "🪨" : "",
    };
    if (isMoving) {
      p.origX = x; p.origY = y;
      p.moveDir = i % 2 === 0 ? 1 : -1;
      p.moveRange = 40;
    }
    platforms.push(p);
  }

  // Egg nests as bonus platforms
  platforms.push({ x: 600, y: H - 160, w: 50, h: 12, type: "normal", color: "#6a5a2a", label: "🪹" });
  platforms.push({ x: 1200, y: H - 200, w: 50, h: 12, type: "normal", color: "#6a5a2a", label: "🪹" });

  // Dragon enemies — spaced out
  enemies.push({ x: 500, y: H - 150, w: 28, h: 28, type: "dragon", dir: 1, speed: 0.5, range: 90, origX: 500, emoji: "🐉" });
  enemies.push({ x: 1100, y: H - 200, w: 28, h: 28, type: "dragon", dir: -1, speed: 0.6, range: 80, origX: 1100, emoji: "🐉" });
  enemies.push({ x: 1800, y: H - 170, w: 26, h: 26, type: "dragon", dir: 1, speed: 0.7, range: 70, origX: 1800, emoji: "🐉" });

  platforms.push({ x: 2550, y: H - 220, w: 80, h: 20, type: "finish", label: "🥚 Golden Egg" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_4_2_CliffJumps(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 100, h: 40, type: "normal", color: "#5a4a3a" });

  // Cliff ledges with big gaps
  for (let i = 0; i < 14; i++) {
    const x = 130 + i * 130;
    const y = H - 80 - i * 12 - (i % 3) * 20;
    const isNarrow = i % 3 === 2;
    platforms.push({
      x, y, w: isNarrow ? 35 : 65, h: 14,
      type: "normal", color: "#6a5a4a",
    });
  }

  // Wind gusts (moving platforms)
  for (let i = 0; i < 4; i++) {
    const x = 300 + i * 400;
    const y = H - 150 - i * 20;
    const p: Platform = {
      x, y, w: 50, h: 12, type: "moving", color: "#aab8cc", label: "💨",
      origX: x, origY: y, moveDir: i % 2 === 0 ? 1 : -1, moveRange: 60,
    };
    platforms.push(p);
  }

  platforms.push({ x: 1950, y: H - 280, w: 80, h: 20, type: "finish", label: "⛰️ Summit" });
  return { platforms, enemies, startX: 30, startY: H - 80 };
}

function gen_4_3_UnderwaterMaze(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 100, h: 40, type: "normal" });

  // Underwater bubble platforms
  for (let i = 0; i < 18; i++) {
    const x = 120 + i * 100;
    const y = H - 70 - Math.sin(i * 0.8) * 40 - i * 6;
    const isBubble = i % 3 === 0;
    const p: Platform = {
      x, y, w: 55 + (i % 2) * 20, h: 14,
      type: isBubble ? "moving" : "normal",
      color: isBubble ? "#4a8aaa" : "#3a6a8a",
      label: isBubble ? "🫧" : "",
    };
    if (isBubble) {
      p.origX = x; p.origY = y;
      p.moveDir = 1; p.moveRange = 20;
    }
    platforms.push(p);
  }

  // Grindylows
  enemies.push({ x: 400, y: H - 120, w: 20, h: 20, type: "grindylow", dir: 1, speed: 0.8, range: 60, origX: 400, emoji: "🦑" });
  enemies.push({ x: 1000, y: H - 180, w: 20, h: 20, type: "grindylow", dir: -1, speed: 1.0, range: 70, origX: 1000, emoji: "🦑" });

  platforms.push({ x: 1920, y: H - 200, w: 80, h: 20, type: "finish", label: "🧜 Surface" });
  return { platforms, enemies, startX: 30, startY: H - 80, boatLevel: true };
}

function gen_4_4_Graveyard(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal", color: "#2a2a2a" });

  // Gravestones as platforms
  for (let i = 0; i < 16; i++) {
    const x = 140 + i * 110;
    const y = H - 60 - (i % 3) * 25 - i * 4;
    platforms.push({
      x, y, w: 50 + (i % 2) * 20, h: 14,
      type: "normal", color: "#4a4a4a",
      label: i % 3 === 0 ? "🪦" : "",
    });
  }

  // Death Eater patrols
  enemies.push({ x: 350, y: H - 100, w: 22, h: 22, type: "deathEater", dir: 1, speed: 0.8, range: 70, origX: 350, emoji: "💀" });
  enemies.push({ x: 800, y: H - 130, w: 22, h: 22, type: "deathEater", dir: -1, speed: 1.0, range: 60, origX: 800, emoji: "💀" });
  enemies.push({ x: 1300, y: H - 160, w: 24, h: 24, type: "deathEater", dir: 1, speed: 1.2, range: 80, origX: 1300, emoji: "💀" });

  platforms.push({ x: 1900, y: H - 160, w: 80, h: 20, type: "finish", label: "🏆 Portkey" });
  return { platforms, enemies, startX: 40, startY: H - 80, darkLevel: true };
}

// ─── WORLD 5: Order of the Phoenix ────────────────────────

function gen_5_1_MinistryHall(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal", color: "#2a2a3a" });

  // Polished floor tiles and floating memo platforms
  for (let i = 0; i < 16; i++) {
    const x = 140 + i * 110;
    const y = H - 60 - (i % 4) * 30 - i * 5;
    const isMemo = i % 4 === 0;
    const p: Platform = {
      x, y, w: 60 + (i % 2) * 20, h: 14,
      type: isMemo ? "moving" : "normal",
      color: isMemo ? "#aaaacc" : "#3a3a4a",
      label: isMemo ? "📜" : "",
    };
    if (isMemo) {
      p.origX = x; p.origY = y;
      p.moveDir = i % 2 === 0 ? 1 : -1;
      p.moveRange = 45;
    }
    platforms.push(p);
  }

  enemies.push({ x: 500, y: H - 130, w: 20, h: 20, type: "deathEater", dir: 1, speed: 0.6, range: 70, origX: 500, emoji: "🧙" });
  enemies.push({ x: 1100, y: H - 180, w: 20, h: 20, type: "deathEater", dir: -1, speed: 0.8, range: 60, origX: 1100, emoji: "🧙" });

  platforms.push({ x: 1900, y: H - 200, w: 80, h: 20, type: "finish", label: "🏛️ Courtroom" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_5_2_ProphecyRoom(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 100, h: 40, type: "normal" });

  // Shelves of prophecies - tall narrow platforms
  for (let shelf = 0; shelf < 8; shelf++) {
    const sx = 120 + shelf * 220;
    // Shelf levels
    for (let level = 0; level < 3; level++) {
      platforms.push({
        x: sx, y: H - 70 - level * 55,
        w: 140, h: 12, type: "normal",
        color: "#3a2a1a", label: level === 0 ? "🔮" : "",
      });
    }
    // Gap between shelves - disappearing
    platforms.push({
      x: sx + 160, y: H - 90 - (shelf % 2) * 30,
      w: 40, h: 10, type: "disappearing",
      timer: 0, visible: true, color: "#5a5a6a",
    });
  }

  enemies.push({ x: 600, y: H - 100, w: 20, h: 20, type: "deathEater", dir: 1, speed: 1.0, range: 80, origX: 600, emoji: "💀" });
  enemies.push({ x: 1300, y: H - 130, w: 22, h: 22, type: "deathEater", dir: -1, speed: 1.2, range: 70, origX: 1300, emoji: "💀" });

  platforms.push({ x: 1880, y: H - 140, w: 80, h: 20, type: "finish", label: "🔮 Prophecy" });
  return { platforms, enemies, startX: 30, startY: H - 80, darkLevel: true };
}

function gen_5_3_TrainingPuzzles(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal" });

  // D.A. Training room - mix of everything
  for (let i = 0; i < 20; i++) {
    const x = 140 + i * 95;
    const y = H - 70 - (i % 4) * 25 - i * 4;
    const roll = i % 5;
    let type: Platform["type"] = "normal";
    if (roll === 0) type = "moving";
    else if (roll === 2) type = "disappearing";
    else if (roll === 4) type = "hazard";

    const p: Platform = {
      x, y, w: 55 + (i % 3) * 10, h: 14, type,
      visible: true, timer: type === "disappearing" ? 0 : undefined,
      color: type === "hazard" ? "#aa3a3a" : undefined,
      label: type === "hazard" ? "⚡" : (type === "moving" ? "🎯" : ""),
    };
    if (type === "moving") {
      p.origX = x; p.origY = y;
      p.moveDir = i % 2 === 0 ? 1 : -1;
      p.moveRange = 35;
    }
    platforms.push(p);
  }

  // Training dummies
  enemies.push({ x: 450, y: H - 120, w: 18, h: 18, type: "dummy", dir: 1, speed: 0.4, range: 40, origX: 450, emoji: "🧸" });
  enemies.push({ x: 1000, y: H - 160, w: 18, h: 18, type: "dummy", dir: -1, speed: 0.6, range: 50, origX: 1000, emoji: "🧸" });

  platforms.push({ x: 2040, y: H - 190, w: 80, h: 20, type: "finish", label: "⚡ D.A." });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_5_4_ChaosCorridor(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 100, h: 40, type: "normal" });

  // Collapsing hallway - lots of disappearing platforms
  for (let i = 0; i < 22; i++) {
    const x = 120 + i * 85;
    const y = H - 60 - (i % 3) * 20 - i * 3;
    const isCollapsing = i % 2 === 0;
    platforms.push({
      x, y, w: 50 + (i % 2) * 15, h: 14,
      type: isCollapsing ? "disappearing" : "normal",
      timer: 0, visible: true,
      color: isCollapsing ? "#5a3a3a" : "#4a4a4a",
    });
  }

  // Spells flying (hazard platforms moving)
  for (let i = 0; i < 4; i++) {
    const p: Platform = {
      x: 300 + i * 400, y: H - 100 - i * 15,
      w: 25, h: 8, type: "hazard",
      color: "#aa2a4a", label: "💥",
      origX: 300 + i * 400, origY: H - 100 - i * 15,
      moveDir: i % 2 === 0 ? 1 : -1, moveRange: 80,
    };
    platforms.push(p);
  }

  enemies.push({ x: 600, y: H - 100, w: 22, h: 22, type: "deathEater", dir: 1, speed: 1.5, range: 80, origX: 600, emoji: "💀" });
  enemies.push({ x: 1200, y: H - 130, w: 22, h: 22, type: "deathEater", dir: -1, speed: 1.8, range: 70, origX: 1200, emoji: "💀" });

  platforms.push({ x: 2000, y: H - 160, w: 80, h: 20, type: "finish", label: "🚪 Escape" });
  return { platforms, enemies, startX: 30, startY: H - 80 };
}

// ─── WORLD 6: Half-Blood Prince ────────────────────────

function gen_6_1_PotionPuzzle(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal" });

  // Cauldron platforms and potion hazards
  const potionColors = ["#2a8a2a", "#8a2a8a", "#2a2a8a", "#8a8a2a", "#8a2a2a"];
  for (let i = 0; i < 16; i++) {
    const x = 140 + i * 110;
    const y = H - 60 - (i % 3) * 25 - i * 5;
    const isPotion = i % 4 === 2;
    platforms.push({
      x, y, w: 60 + (i % 2) * 15, h: 14,
      type: isPotion ? "hazard" : "normal",
      color: isPotion ? potionColors[i % 5] : "#3a3a3a",
      label: isPotion ? "⚗️" : (i % 4 === 0 ? "🧪" : ""),
    });
  }

  enemies.push({ x: 500, y: H - 120, w: 20, h: 20, type: "slug", dir: 1, speed: 0.3, range: 50, origX: 500, emoji: "🐛" });

  platforms.push({ x: 1900, y: H - 180, w: 80, h: 20, type: "finish", label: "📖 Prince's Book" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_6_2_TowerJumps(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 150, h: 40, type: "normal" });

  // Ascending tower — zigzag pattern
  for (let i = 0; i < 22; i++) {
    const side = i % 2 === 0 ? 50 : 250;
    const y = H - 80 - i * 32;
    platforms.push({
      x: side + (i % 3) * 30, y, w: 70, h: 14,
      type: i % 5 === 0 ? "moving" : "normal",
      origX: side + (i % 3) * 30, origY: y,
      moveDir: i % 2 === 0 ? 1 : -1, moveRange: i % 5 === 0 ? 40 : 0,
      color: "#4a4a5a",
    });
  }

  enemies.push({ x: 150, y: H - 300, w: 20, h: 20, type: "deathEater", dir: 1, speed: 0.6, range: 80, origX: 150, emoji: "💀" });
  enemies.push({ x: 250, y: H - 550, w: 22, h: 22, type: "deathEater", dir: -1, speed: 0.8, range: 60, origX: 250, emoji: "💀" });

  platforms.push({ x: 150, y: H - 800, w: 100, h: 20, type: "finish", label: "🗼 Tower Top" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_6_3_DarkCorridor(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal" });

  // Vanishing cabinet maze in darkness
  for (let i = 0; i < 16; i++) {
    const x = 140 + i * 100;
    const y = H - 60 - (i % 3) * 20 - i * 4;
    const isVanishing = i % 4 === 0;
    platforms.push({
      x, y, w: 55 + (i % 2) * 15, h: 14,
      type: isVanishing ? "disappearing" : "normal",
      timer: 0, visible: true,
      color: isVanishing ? "#4a2a1a" : "#3a3a3a",
      label: isVanishing ? "🗄️" : "",
    });
  }

  enemies.push({ x: 400, y: H - 100, w: 22, h: 22, type: "deathEater", dir: 1, speed: 1.0, range: 70, origX: 400, emoji: "💀" });
  enemies.push({ x: 1000, y: H - 130, w: 22, h: 22, type: "deathEater", dir: -1, speed: 1.2, range: 60, origX: 1000, emoji: "💀" });

  platforms.push({ x: 1780, y: H - 150, w: 80, h: 20, type: "finish", label: "🚪 Exit" });
  return { platforms, enemies, startX: 40, startY: H - 80, darkLevel: true };
}

function gen_6_4_InferiLake(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  const waterY = H - 60;

  platforms.push({ x: 0, y: waterY - 10, w: 100, h: 24, type: "normal", color: "#3a3a3a", label: "🪨 Shore" });

  // Rock platforms across cursed lake
  for (let i = 0; i < 14; i++) {
    const x = 130 + i * 120;
    platforms.push({
      x, y: waterY - 14 - (i % 3) * 10, w: 55 + (i % 2) * 15, h: 14,
      type: i % 4 === 0 ? "disappearing" : "normal",
      timer: 0, visible: true,
      color: "#4a4a4a", label: i % 3 === 0 ? "🪨" : "",
    });
  }

  // Inferi rising from water
  enemies.push({ x: 350, y: waterY - 40, w: 22, h: 22, type: "inferi", dir: 1, speed: 0.4, range: 60, origX: 350, emoji: "💀" });
  enemies.push({ x: 800, y: waterY - 35, w: 22, h: 22, type: "inferi", dir: -1, speed: 0.5, range: 50, origX: 800, emoji: "💀" });
  enemies.push({ x: 1300, y: waterY - 30, w: 24, h: 24, type: "inferi", dir: 1, speed: 0.6, range: 70, origX: 1300, emoji: "💀" });

  platforms.push({ x: 1820, y: waterY - 20, w: 80, h: 24, type: "finish", color: "#4a3a2a", label: "🏝️ Island" });
  return { platforms, enemies, startX: 30, startY: waterY - 50, boatLevel: true };
}

// ─── WORLD 7: Deathly Hallows ────────────────────────

function gen_7_1_EscapeRun(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 100, h: 40, type: "normal" });

  // Longer, more intense escape with varied platform types
  for (let i = 0; i < 30; i++) {
    const x = 110 + i * 80;
    const y = H - 60 - (i % 4) * 18 - i * 3;
    const roll = i % 5;
    platforms.push({
      x, y, w: 42 + (i % 2) * 15, h: 12,
      type: roll === 0 ? "disappearing" : roll === 3 ? "moving" : "normal",
      timer: 0, visible: true,
      color: "#3a2a2a",
      origX: x, origY: y,
      moveDir: i % 2 === 0 ? 1 : -1,
      moveRange: roll === 3 ? 30 : 0,
    });
  }

  // Death Eaters chasing — staggered
  for (let i = 0; i < 4; i++) {
    enemies.push({
      x: 300 + i * 500, y: H - 90 - i * 10, w: 22, h: 22,
      type: "deathEater", dir: 1, speed: 1.0 + i * 0.15, range: 70, origX: 300 + i * 500, emoji: "💀",
    });
  }

  // Fire hazards from the battle
  platforms.push({ x: 600, y: H - 130, w: 25, h: 8, type: "hazard", color: "#8a2a0a", label: "🔥" });
  platforms.push({ x: 1400, y: H - 150, w: 25, h: 8, type: "hazard", color: "#8a2a0a", label: "🔥" });

  platforms.push({ x: 2500, y: H - 180, w: 80, h: 20, type: "finish", label: "🏠 Safe House" });
  return { platforms, enemies, startX: 30, startY: H - 80 };
}

function gen_7_2_RuinedHogwarts(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal", color: "#3a3a3a" });

  // Broken castle — crumbling platforms, rubble
  for (let i = 0; i < 20; i++) {
    const x = 140 + i * 95;
    const y = H - 60 - Math.random() * 40 - i * 5;
    const isCrumbling = i % 3 === 0;
    platforms.push({
      x, y, w: 45 + Math.random() * 25, h: 12,
      type: isCrumbling ? "disappearing" : "normal",
      timer: 0, visible: true,
      color: "#4a4a4a",
      label: isCrumbling ? "💨" : (i % 5 === 0 ? "🧱" : ""),
    });
  }

  // Hazard rubble
  platforms.push({ x: 400, y: H - 120, w: 30, h: 8, type: "hazard", color: "#6a2a2a", label: "🔥" });
  platforms.push({ x: 900, y: H - 150, w: 30, h: 8, type: "hazard", color: "#6a2a2a", label: "🔥" });
  platforms.push({ x: 1400, y: H - 180, w: 30, h: 8, type: "hazard", color: "#6a2a2a", label: "🔥" });

  enemies.push({ x: 500, y: H - 100, w: 22, h: 22, type: "deathEater", dir: 1, speed: 1.2, range: 70, origX: 500, emoji: "💀" });
  enemies.push({ x: 1000, y: H - 140, w: 24, h: 24, type: "deathEater", dir: -1, speed: 1.5, range: 80, origX: 1000, emoji: "💀" });
  enemies.push({ x: 1500, y: H - 170, w: 22, h: 22, type: "deathEater", dir: 1, speed: 1.8, range: 60, origX: 1500, emoji: "💀" });

  platforms.push({ x: 2040, y: H - 220, w: 80, h: 20, type: "finish", label: "🏰 Great Hall" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_7_3_HardFlying(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 80, h: 40, type: "normal" });

  // Sky-high moving platforms, very precise jumps
  for (let i = 0; i < 20; i++) {
    const x = 110 + i * 100;
    const y = H - 100 - Math.sin(i * 0.5) * 60 - i * 8;
    const p: Platform = {
      x, y, w: 45 + (i % 2) * 10, h: 12,
      type: "moving", color: "#6a6a8a",
      origX: x, origY: y,
      moveDir: i % 2 === 0 ? 1 : -1,
      moveRange: 30 + i * 3,
    };
    platforms.push(p);
  }

  // Dragon enemies
  enemies.push({ x: 400, y: H - 200, w: 26, h: 26, type: "dragon", dir: 1, speed: 1.0, range: 100, origX: 400, emoji: "🐉" });
  enemies.push({ x: 1000, y: H - 300, w: 28, h: 28, type: "dragon", dir: -1, speed: 1.3, range: 80, origX: 1000, emoji: "🐉" });

  platforms.push({ x: 2100, y: H - 350, w: 80, h: 20, type: "finish", label: "🏰 Hogwarts" });
  return { platforms, enemies, startX: 20, startY: H - 80 };
}

function gen_7_4_FinalClimb(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 150, h: 40, type: "normal" });

  // The hardest climb — narrow, disappearing, hazards everywhere
  for (let i = 0; i < 25; i++) {
    const side = i % 2 === 0 ? 30 + (i % 3) * 40 : 200 + (i % 3) * 40;
    const y = H - 70 - i * 30;
    const roll = i % 6;
    let type: Platform["type"] = "normal";
    if (roll === 0) type = "moving";
    else if (roll === 2) type = "disappearing";
    else if (roll === 5) type = "hazard";

    const p: Platform = {
      x: side, y, w: 50 + (i % 2) * 10, h: 12, type,
      timer: type === "disappearing" ? 0 : undefined,
      visible: true,
      color: type === "hazard" ? "#6a1a1a" : "#4a4a4a",
      label: type === "hazard" ? "🔥" : "",
    };
    if (type === "moving") {
      p.origX = side; p.origY = y;
      p.moveDir = i % 2 === 0 ? 1 : -1;
      p.moveRange = 40;
    }
    platforms.push(p);
  }

  // Death Eaters everywhere
  for (let i = 0; i < 4; i++) {
    enemies.push({
      x: 100 + (i % 2) * 200, y: H - 200 - i * 150,
      w: 22, h: 22, type: "deathEater", dir: i % 2 === 0 ? 1 : -1,
      speed: 1.0 + i * 0.3, range: 70, origX: 100 + (i % 2) * 200, emoji: "💀",
    });
  }

  platforms.push({ x: 150, y: H - 830, w: 100, h: 20, type: "finish", label: "⚔️ Final Battle" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

// ─── WORLD 2 EXTRA LEVELS ────────────────────────

function gen_2_5_WhompingWillow(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 8; i++) platforms.push({ x: i * 90, y: H - 40, w: 88, h: 40, type: "normal", color: "#3a5a2a" });
  // Willow branches - swinging platforms
  for (let i = 0; i < 12; i++) {
    const y = H - 120 - i * 60;
    platforms.push({ x: 60 + (i % 3) * 140, y, w: 70, h: 14, type: "moving", moveRange: 80 + i * 0.2, color: "#5a4a2a", label: i === 0 ? "🌳 Dodge the branches!" : undefined });
  }
  for (let i = 0; i < 3; i++) enemies.push({ x: 150 + i * 120, y: H - 300 - i * 120, w: 30, h: 30, type: "troll", dir: 1, speed: 1.2, range: 60, origX: 150 + i * 120, emoji: "🌿" });
  platforms.push({ x: 180, y: H - 850, w: 100, h: 20, type: "finish", label: "🚗 Flying Car Escape" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_2_6_MoaningMyrtleBathroom(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 6; i++) platforms.push({ x: i * 100, y: H - 40, w: 98, h: 40, type: "normal", color: "#4a5a6a" });
  // Wet slippery platforms
  for (let i = 0; i < 10; i++) {
    const y = H - 130 - i * 65;
    platforms.push({ x: 40 + ((i * 67) % 300), y, w: 65, h: 12, type: i % 3 === 0 ? "ice" : "normal", color: i % 3 === 0 ? "#8ab8d8" : "#6a7a8a" });
  }
  // Water hazards
  for (let i = 0; i < 3; i++) platforms.push({ x: 50 + i * 150, y: H - 250 - i * 100, w: 80, h: 10, type: "disappearing", timer: 0, visible: true, color: "#4488aa" });
  enemies.push({ x: 200, y: H - 400, w: 20, h: 20, type: "ghost", dir: -1, speed: 0.8, range: 100, origX: 200, emoji: "👻" });
  platforms.push({ x: 160, y: H - 820, w: 100, h: 20, type: "finish", label: "🚰 Chamber Entrance" });
  return { platforms, enemies, startX: 30, startY: H - 80 };
}

function gen_2_7_AragogLair(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 6; i++) platforms.push({ x: i * 90, y: H - 40, w: 88, h: 40, type: "normal", color: "#2a3a1a" });
  // Web platforms
  for (let i = 0; i < 14; i++) {
    const y = H - 110 - i * 55;
    platforms.push({ x: 30 + ((i * 83) % 350), y, w: 55, h: 10, type: i % 4 === 0 ? "disappearing" : "normal", timer: 0, visible: true, color: "#aaa" });
  }
  for (let i = 0; i < 5; i++) enemies.push({ x: 80 + i * 80, y: H - 200 - i * 100, w: 18, h: 18, type: "spider", dir: 1, speed: 1.0 + i * 0.2, range: 50, origX: 80 + i * 80, emoji: "🕷️" });
  platforms.push({ x: 140, y: H - 880, w: 100, h: 20, type: "finish", label: "🕸️ Escape the Lair" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_2_8_ParseltonguePipes(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  // Pipe tunnel - narrow vertical climb
  for (let i = 0; i < 16; i++) {
    const side = i % 2 === 0 ? 30 : 250;
    platforms.push({ x: side, y: H - 80 - i * 55, w: 100, h: 14, type: "normal", color: "#3a4a3a" });
  }
  // Snake enemies in pipes
  for (let i = 0; i < 4; i++) enemies.push({ x: 140, y: H - 250 - i * 180, w: 24, h: 24, type: "snake", dir: i % 2 === 0 ? 1 : -1, speed: 1.3, range: 80, origX: 140, emoji: "🐍" });
  platforms.push({ x: 130, y: H - 960, w: 100, h: 20, type: "finish", label: "🐍 Chamber Below" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_2_9_SwordOfGryffindor(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 5; i++) platforms.push({ x: i * 100, y: H - 40, w: 98, h: 40, type: "normal", color: "#3a2a1a" });
  // Ascending chamber with hazards
  for (let i = 0; i < 15; i++) {
    const y = H - 120 - i * 58;
    platforms.push({ x: 20 + ((i * 97) % 320), y, w: 60, h: 12, type: i % 5 === 0 ? "normal" : "normal", color: i % 5 === 0 ? "#ffcc00" : "#5a4a3a" });
  }
  enemies.push({ x: 180, y: H - 500, w: 40, h: 40, type: "basilisk", dir: 1, speed: 0.6, range: 120, origX: 180, emoji: "🐍" });
  platforms.push({ x: 150, y: H - 920, w: 100, h: 20, type: "finish", label: "⚔️ Sword of Gryffindor" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

// ─── WORLD 3 EXTRA LEVELS ────────────────────────

function gen_3_5_HippogriffFlight(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  // Sky-high platforms - flight path
  for (let i = 0; i < 18; i++) {
    const y = H - 80 - i * 50;
    platforms.push({ x: 20 + ((i * 73) % 350), y, w: 55, h: 12, type: "moving", moveRange: 60 + i * 0.1, color: "#6699cc" });
  }
  for (let i = 0; i < 3; i++) enemies.push({ x: 100 + i * 130, y: H - 300 - i * 150, w: 20, h: 20, type: "bird", dir: 1, speed: 1.5, range: 80, origX: 100 + i * 130, emoji: "🦅" });
  platforms.push({ x: 170, y: H - 960, w: 100, h: 20, type: "finish", label: "🦅 Safe Landing" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_3_6_ShriekingShack(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 6; i++) platforms.push({ x: i * 85, y: H - 40, w: 83, h: 40, type: "normal", color: "#4a3a2a" });
  // Creaky floorboards
  for (let i = 0; i < 12; i++) {
    const y = H - 130 - i * 60;
    platforms.push({ x: 30 + ((i * 89) % 300), y, w: 70, h: 12, type: i % 3 === 0 ? "disappearing" : "normal", timer: 0, visible: true, color: "#6a5a3a" });
  }
  enemies.push({ x: 200, y: H - 350, w: 22, h: 22, type: "werewolf", dir: 1, speed: 1.8, range: 90, origX: 200, emoji: "🐺" });
  platforms.push({ x: 140, y: H - 860, w: 100, h: 20, type: "finish", label: "🏚️ Secret Passage" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_3_7_MaraudersMap(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  // Hidden passage maze
  for (let i = 0; i < 15; i++) {
    const y = H - 100 - i * 55;
    const visible = i % 4 !== 0;
    platforms.push({ x: 20 + ((i * 71) % 340), y, w: 65, h: 12, type: visible ? "normal" : "disappearing", timer: 0, visible, color: "#8a7a5a" });
  }
  for (let i = 0; i < 2; i++) enemies.push({ x: 120 + i * 160, y: H - 400 - i * 100, w: 20, h: 20, type: "ghost", dir: -1, speed: 1.0, range: 70, origX: 120 + i * 160, emoji: "👤" });
  platforms.push({ x: 160, y: H - 900, w: 100, h: 20, type: "finish", label: "🗺️ Mischief Managed" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_3_8_WillowTunnel(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  // Narrow tunnel climb
  for (let i = 0; i < 16; i++) {
    const side = i % 2 === 0 ? 40 : 220;
    platforms.push({ x: side, y: H - 70 - i * 52, w: 90, h: 14, type: "normal", color: "#5a4a2a" });
  }
  for (let i = 0; i < 3; i++) enemies.push({ x: 130, y: H - 200 - i * 200, w: 20, h: 20, type: "root", dir: 1, speed: 0.7, range: 60, origX: 130, emoji: "🌿" });
  platforms.push({ x: 100, y: H - 910, w: 100, h: 20, type: "finish", label: "🌳 End of Tunnel" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
}

function gen_3_9_PatronusTraining(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 5; i++) platforms.push({ x: i * 100, y: H - 40, w: 98, h: 40, type: "normal", color: "#2a2a4a" });
  // Dementor-filled ascending challenge
  for (let i = 0; i < 14; i++) {
    const y = H - 120 - i * 60;
    platforms.push({ x: 30 + ((i * 79) % 320), y, w: 60, h: 12, type: i % 4 === 0 ? "normal" : "normal", color: i % 4 === 0 ? "#aaccff" : "#4a4a6a" });
  }
  for (let i = 0; i < 5; i++) enemies.push({ x: 60 + i * 80, y: H - 250 - i * 120, w: 22, h: 22, type: "dementor", dir: i % 2 === 0 ? 1 : -1, speed: 0.9, range: 80, origX: 60 + i * 80, emoji: "👻" });
  platforms.push({ x: 150, y: H - 950, w: 100, h: 20, type: "finish", label: "✨ Expecto Patronum!" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

// ─── WORLD 4 EXTRA LEVELS ────────────────────────

function gen_4_5_YuleBall(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 8; i++) platforms.push({ x: i * 85, y: H - 40, w: 83, h: 40, type: "normal", color: "#4a3a5a" });
  // Dance floor - bouncy and moving platforms
  for (let i = 0; i < 12; i++) {
    const y = H - 120 - i * 60;
    platforms.push({ x: 40 + ((i * 91) % 320), y, w: 65, h: 12, type: i % 2 === 0 ? "normal" : "moving", moveRange: 50, color: i % 2 === 0 ? "#cc88ff" : "#8866aa" });
  }
  platforms.push({ x: 160, y: H - 860, w: 100, h: 20, type: "finish", label: "💃 Grand Finale" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_4_6_TriwizardMaze(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  // Hedge maze - narrow corridors
  for (let i = 0; i < 16; i++) {
    const y = H - 80 - i * 55;
    const x = i % 3 === 0 ? 20 : i % 3 === 1 ? 200 : 110;
    platforms.push({ x, y, w: 80, h: 14, type: "normal", color: "#2a5a2a" });
  }
  // Walls (decorative obstacles)
  for (let i = 0; i < 4; i++) platforms.push({ x: 150, y: H - 200 - i * 180, w: 12, h: 60, type: "normal", color: "#1a4a1a" });
  for (let i = 0; i < 3; i++) enemies.push({ x: 100 + i * 100, y: H - 300 - i * 130, w: 20, h: 20, type: "sphinx", dir: 1, speed: 1.0, range: 60, origX: 100 + i * 100, emoji: "🦁" });
  platforms.push({ x: 140, y: H - 940, w: 100, h: 20, type: "finish", label: "🏆 Triwizard Cup" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_4_7_MerpeopleVillage(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  // Underwater feel - all ice/slippery
  for (let i = 0; i < 15; i++) {
    const y = H - 100 - i * 55;
    platforms.push({ x: 30 + ((i * 67) % 330), y, w: 60, h: 12, type: "ice", color: "#4488aa" });
  }
  for (let i = 0; i < 4; i++) enemies.push({ x: 80 + i * 90, y: H - 250 - i * 130, w: 20, h: 20, type: "merperson", dir: i % 2 === 0 ? 1 : -1, speed: 1.1, range: 70, origX: 80 + i * 90, emoji: "🧜" });
  platforms.push({ x: 150, y: H - 900, w: 100, h: 20, type: "finish", label: "🫧 Surface!" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_4_8_PortkeyField(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 6; i++) platforms.push({ x: i * 90, y: H - 40, w: 88, h: 40, type: "normal", color: "#4a5a3a" });
  // Teleporting platforms
  for (let i = 0; i < 13; i++) {
    const y = H - 130 - i * 58;
    platforms.push({ x: 20 + ((i * 83) % 340), y, w: 55, h: 12, type: i % 3 === 0 ? "disappearing" : "normal", timer: 0, visible: true, color: "#6a8a4a" });
  }
  enemies.push({ x: 200, y: H - 500, w: 24, h: 24, type: "deathEater", dir: -1, speed: 1.4, range: 80, origX: 200, emoji: "💀" });
  platforms.push({ x: 160, y: H - 880, w: 100, h: 20, type: "finish", label: "🔑 Grab the Portkey" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_4_9_WandPriori(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 5; i++) platforms.push({ x: i * 100, y: H - 40, w: 98, h: 40, type: "normal", color: "#3a3a3a" });
  // Wand beam platforms ascending in spiral
  for (let i = 0; i < 16; i++) {
    const angle = i * 0.8;
    const x = 180 + Math.sin(angle) * 120;
    const y = H - 120 - i * 52;
    platforms.push({ x, y, w: 50, h: 12, type: "normal", color: "#ffcc44" });
  }
  enemies.push({ x: 180, y: H - 600, w: 30, h: 30, type: "voldemort", dir: 1, speed: 0.5, range: 100, origX: 180, emoji: "🐍" });
  platforms.push({ x: 150, y: H - 950, w: 100, h: 20, type: "finish", label: "✨ Priori Incantatem" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

// ─── WORLD 5 EXTRA LEVELS ────────────────────────

function gen_5_5_RoomOfRequirement(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 7; i++) platforms.push({ x: i * 80, y: H - 40, w: 78, h: 40, type: "normal", color: "#5a4a3a" });
  // Room morphs - platforms appear and disappear
  for (let i = 0; i < 14; i++) {
    const y = H - 110 - i * 58;
    platforms.push({ x: 25 + ((i * 77) % 330), y, w: 60, h: 12, type: i % 2 === 0 ? "disappearing" : "normal", timer: 0, visible: true, color: "#7a6a5a" });
  }
  platforms.push({ x: 140, y: H - 920, w: 100, h: 20, type: "finish", label: "🚪 Room Found" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_5_6_UmbridgeOffice(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 6; i++) platforms.push({ x: i * 90, y: H - 40, w: 88, h: 40, type: "normal", color: "#cc88aa" });
  // Pink decorative platforms
  for (let i = 0; i < 12; i++) {
    const y = H - 130 - i * 60;
    platforms.push({ x: 35 + ((i * 73) % 310), y, w: 65, h: 12, type: "normal", color: "#ff99bb" });
  }
  for (let i = 0; i < 3; i++) enemies.push({ x: 100 + i * 120, y: H - 300 - i * 130, w: 20, h: 20, type: "cat", dir: 1, speed: 0.8, range: 50, origX: 100 + i * 120, emoji: "🐱" });
  platforms.push({ x: 150, y: H - 870, w: 100, h: 20, type: "finish", label: "📋 Decree Dodged" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_5_7_ThestralFlight(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  // High altitude - moving cloud platforms
  for (let i = 0; i < 16; i++) {
    const y = H - 80 - i * 55;
    platforms.push({ x: 30 + ((i * 89) % 340), y, w: 55, h: 12, type: "moving", moveRange: 70 + i * 0.1, color: "#6a6a8a" });
  }
  platforms.push({ x: 160, y: H - 960, w: 100, h: 20, type: "finish", label: "🦇 Ministry Arrival" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_5_8_VeilChamber(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 5; i++) platforms.push({ x: i * 100, y: H - 40, w: 98, h: 40, type: "normal", color: "#2a2a3a" });
  // Mysterious veil - dark platforms
  for (let i = 0; i < 14; i++) {
    const y = H - 120 - i * 58;
    platforms.push({ x: 20 + ((i * 81) % 320), y, w: 60, h: 12, type: i % 4 === 0 ? "disappearing" : "normal", timer: 0, visible: true, color: "#3a3a5a" });
  }
  for (let i = 0; i < 4; i++) enemies.push({ x: 80 + i * 90, y: H - 280 - i * 140, w: 20, h: 20, type: "deathEater", dir: i % 2 === 0 ? 1 : -1, speed: 1.3, range: 70, origX: 80 + i * 90, emoji: "💀" });
  platforms.push({ x: 150, y: H - 930, w: 100, h: 20, type: "finish", label: "🌀 Beyond the Veil" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_5_9_DumbledoresArmy(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 6; i++) platforms.push({ x: i * 85, y: H - 40, w: 83, h: 40, type: "normal", color: "#3a4a5a" });
  // Training room - bouncy combat platforms
  for (let i = 0; i < 15; i++) {
    const y = H - 110 - i * 55;
    platforms.push({ x: 25 + ((i * 69) % 330), y, w: 60, h: 12, type: i % 3 === 0 ? "normal" : "normal", color: i % 3 === 0 ? "#4488ff" : "#5a6a7a" });
  }
  for (let i = 0; i < 3; i++) enemies.push({ x: 120 + i * 100, y: H - 350 - i * 120, w: 20, h: 20, type: "dummy", dir: 1, speed: 0.6, range: 40, origX: 120 + i * 100, emoji: "🎯" });
  platforms.push({ x: 150, y: H - 930, w: 100, h: 20, type: "finish", label: "⚡ DA Trained!" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

// ─── WORLD 6 EXTRA LEVELS ────────────────────────

function gen_6_5_SlugClubParty(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 7; i++) platforms.push({ x: i * 80, y: H - 40, w: 78, h: 40, type: "normal", color: "#4a5a4a" });
  // Party platforms with chandeliers
  for (let i = 0; i < 12; i++) {
    const y = H - 120 - i * 62;
    platforms.push({ x: 40 + ((i * 87) % 320), y, w: 65, h: 12, type: i % 3 === 0 ? "moving" : "normal", moveRange: 40, color: "#8a7a3a" });
  }
  platforms.push({ x: 150, y: H - 870, w: 100, h: 20, type: "finish", label: "🥂 Party Over" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_6_6_Sectumsempra(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 5; i++) platforms.push({ x: i * 100, y: H - 40, w: 98, h: 40, type: "normal", color: "#3a3a3a" });
  // Dark bathroom - wet hazards
  for (let i = 0; i < 14; i++) {
    const y = H - 110 - i * 56;
    platforms.push({ x: 20 + ((i * 79) % 340), y, w: 55, h: 12, type: i % 3 === 0 ? "ice" : "normal", color: "#5a6a7a" });
  }
  for (let i = 0; i < 2; i++) enemies.push({ x: 150 + i * 120, y: H - 400 - i * 150, w: 22, h: 22, type: "wizard", dir: -1, speed: 1.4, range: 80, origX: 150 + i * 120, emoji: "⚔️" });
  platforms.push({ x: 160, y: H - 900, w: 100, h: 20, type: "finish", label: "💧 Escape" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_6_7_PensieveMemories(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  // Floating memory fragments
  for (let i = 0; i < 16; i++) {
    const y = H - 80 - i * 54;
    platforms.push({ x: 30 + ((i * 71) % 330), y, w: 55, h: 12, type: "moving", moveRange: 50 + i * 0.1, color: "#8888cc" });
  }
  platforms.push({ x: 150, y: H - 940, w: 100, h: 20, type: "finish", label: "💭 Memory Found" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_6_8_LightningTower(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 5; i++) platforms.push({ x: i * 90, y: H - 40, w: 88, h: 40, type: "normal", color: "#3a3a4a" });
  // Astronomy tower climb
  for (let i = 0; i < 16; i++) {
    const y = H - 110 - i * 55;
    platforms.push({ x: 40 + ((i * 83) % 300), y, w: 55, h: 12, type: i % 4 === 0 ? "disappearing" : "normal", timer: 0, visible: true, color: "#5a5a6a" });
  }
  for (let i = 0; i < 3; i++) enemies.push({ x: 100 + i * 100, y: H - 350 - i * 150, w: 20, h: 20, type: "deathEater", dir: 1, speed: 1.2, range: 70, origX: 100 + i * 100, emoji: "💀" });
  platforms.push({ x: 140, y: H - 960, w: 100, h: 20, type: "finish", label: "⚡ Tower Top" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_6_9_FelixFelicis(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 6; i++) platforms.push({ x: i * 85, y: H - 40, w: 83, h: 40, type: "normal", color: "#5a5a2a" });
  // Lucky golden path - mostly bouncy
  for (let i = 0; i < 14; i++) {
    const y = H - 120 - i * 58;
    platforms.push({ x: 25 + ((i * 77) % 340), y, w: 60, h: 12, type: i % 2 === 0 ? "normal" : "normal", color: i % 2 === 0 ? "#ffdd44" : "#aa9933" });
  }
  platforms.push({ x: 155, y: H - 930, w: 100, h: 20, type: "finish", label: "🍀 Liquid Luck!" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

// ─── WORLD 7 EXTRA LEVELS ────────────────────────

function gen_7_5_GringottsVault(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 6; i++) platforms.push({ x: i * 90, y: H - 40, w: 88, h: 40, type: "normal", color: "#5a4a3a" });
  // Vault descent then ascent
  for (let i = 0; i < 15; i++) {
    const y = H - 120 - i * 56;
    platforms.push({ x: 30 + ((i * 83) % 320), y, w: 60, h: 12, type: i % 4 === 0 ? "disappearing" : "normal", timer: 0, visible: true, color: "#8a7a5a" });
  }
  for (let i = 0; i < 3; i++) enemies.push({ x: 100 + i * 110, y: H - 300 - i * 150, w: 22, h: 22, type: "goblin", dir: i % 2 === 0 ? 1 : -1, speed: 1.1, range: 60, origX: 100 + i * 110, emoji: "👺" });
  platforms.push({ x: 150, y: H - 940, w: 100, h: 20, type: "finish", label: "💰 Vault Escaped" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_7_6_RoomOfHiddenThings(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 5; i++) platforms.push({ x: i * 100, y: H - 40, w: 98, h: 40, type: "normal", color: "#4a4a4a" });
  // Piles of junk - irregular platforms
  for (let i = 0; i < 14; i++) {
    const y = H - 100 - i * 58;
    const w = 40 + (i % 3) * 20;
    platforms.push({ x: 20 + ((i * 91) % 310), y, w, h: 12, type: "normal", color: "#6a5a4a" });
  }
  // Fiendfyre
  for (let i = 0; i < 2; i++) enemies.push({ x: 130 + i * 150, y: H - 450 - i * 150, w: 26, h: 26, type: "fire", dir: 1, speed: 1.6, range: 90, origX: 130 + i * 150, emoji: "🔥" });
  platforms.push({ x: 150, y: H - 920, w: 100, h: 20, type: "finish", label: "👑 Diadem Found" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_7_7_ForbiddenForestWalk(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 8; i++) platforms.push({ x: i * 80, y: H - 40, w: 78, h: 40, type: "normal", color: "#2a3a1a" });
  // Forest path - dark ascending
  for (let i = 0; i < 13; i++) {
    const y = H - 120 - i * 58;
    platforms.push({ x: 25 + ((i * 73) % 340), y, w: 60, h: 12, type: "normal", color: "#3a4a2a" });
  }
  for (let i = 0; i < 4; i++) enemies.push({ x: 80 + i * 90, y: H - 250 - i * 130, w: 20, h: 20, type: "dementor", dir: i % 2 === 0 ? 1 : -1, speed: 0.9, range: 70, origX: 80 + i * 90, emoji: "👻" });
  platforms.push({ x: 140, y: H - 890, w: 100, h: 20, type: "finish", label: "🌲 Resurrection Stone" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_7_8_ElderWandChase(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  // Fast-paced chase - many moving platforms
  for (let i = 0; i < 16; i++) {
    const y = H - 80 - i * 54;
    platforms.push({ x: 30 + ((i * 79) % 330), y, w: 50, h: 12, type: "moving", moveRange: 80 + i * 0.15, color: "#5a5a5a" });
  }
  enemies.push({ x: 180, y: H - 500, w: 24, h: 24, type: "deathEater", dir: -1, speed: 1.8, range: 100, origX: 180, emoji: "💀" });
  platforms.push({ x: 150, y: H - 940, w: 100, h: 20, type: "finish", label: "🪄 Elder Wand" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_7_9_BattleOfHogwarts(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];
  for (let i = 0; i < 6; i++) platforms.push({ x: i * 90, y: H - 40, w: 88, h: 40, type: "normal", color: "#3a3a3a" });
  // Ruined castle - chaotic mix of everything
  for (let i = 0; i < 18; i++) {
    const y = H - 100 - i * 52;
    const types: Array<Platform["type"]> = ["normal", "moving", "disappearing", "normal", "ice"];
    const t = types[i % 5];
    platforms.push({ x: 20 + ((i * 67) % 340), y, w: 55, h: 12, type: t, moveRange: 60, timer: 0, visible: true, color: "#5a4a3a" });
  }
  for (let i = 0; i < 6; i++) enemies.push({ x: 50 + i * 60, y: H - 200 - i * 110, w: 20, h: 20, type: "deathEater", dir: i % 2 === 0 ? 1 : -1, speed: 1.0 + i * 0.2, range: 60, origX: 50 + i * 60, emoji: "💀" });
  platforms.push({ x: 150, y: H - 1020, w: 100, h: 20, type: "finish", label: "⚡ Victory!" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

// ─── Export lookup ────────────────────────────

export function getWorldLevelGenerator(worldId: number, levelIdx: number, H: number): LevelData | null {
  const generators: Record<string, (H: number) => LevelData> = {
    // World 2
    "2-0": gen_2_1_DiagonAlley,
    "2-1": gen_2_2_FlyingEscape,
    "2-2": gen_2_3_DetentionLockhart,
    "2-3": gen_2_4_ChamberDoors,
    "2-4": gen_2_5_WhompingWillow,
    "2-5": gen_2_6_MoaningMyrtleBathroom,
    "2-6": gen_2_7_AragogLair,
    "2-7": gen_2_8_ParseltonguePipes,
    "2-8": gen_2_9_SwordOfGryffindor,
    // World 3
    "3-0": gen_3_1_TimePlatforms,
    "3-1": gen_3_2_ClockTower,
    "3-2": gen_3_3_ForestRun,
    "3-3": gen_3_4_IceLake,
    "3-4": gen_3_5_HippogriffFlight,
    "3-5": gen_3_6_ShriekingShack,
    "3-6": gen_3_7_MaraudersMap,
    "3-7": gen_3_8_WillowTunnel,
    "3-8": gen_3_9_PatronusTraining,
    // World 4
    "4-0": gen_4_1_DragonArena,
    "4-1": gen_4_2_CliffJumps,
    "4-2": gen_4_3_UnderwaterMaze,
    "4-3": gen_4_4_Graveyard,
    "4-4": gen_4_5_YuleBall,
    "4-5": gen_4_6_TriwizardMaze,
    "4-6": gen_4_7_MerpeopleVillage,
    "4-7": gen_4_8_PortkeyField,
    "4-8": gen_4_9_WandPriori,
    // World 5
    "5-0": gen_5_1_MinistryHall,
    "5-1": gen_5_2_ProphecyRoom,
    "5-2": gen_5_3_TrainingPuzzles,
    "5-3": gen_5_4_ChaosCorridor,
    "5-4": gen_5_5_RoomOfRequirement,
    "5-5": gen_5_6_UmbridgeOffice,
    "5-6": gen_5_7_ThestralFlight,
    "5-7": gen_5_8_VeilChamber,
    "5-8": gen_5_9_DumbledoresArmy,
    // World 6
    "6-0": gen_6_1_PotionPuzzle,
    "6-1": gen_6_2_TowerJumps,
    "6-2": gen_6_3_DarkCorridor,
    "6-3": gen_6_4_InferiLake,
    "6-4": gen_6_5_SlugClubParty,
    "6-5": gen_6_6_Sectumsempra,
    "6-6": gen_6_7_PensieveMemories,
    "6-7": gen_6_8_LightningTower,
    "6-8": gen_6_9_FelixFelicis,
    // World 7
    "7-0": gen_7_1_EscapeRun,
    "7-1": gen_7_2_RuinedHogwarts,
    "7-2": gen_7_3_HardFlying,
    "7-3": gen_7_4_FinalClimb,
    "7-4": gen_7_5_GringottsVault,
    "7-5": gen_7_6_RoomOfHiddenThings,
    "7-6": gen_7_7_ForbiddenForestWalk,
    "7-7": gen_7_8_ElderWandChase,
    "7-8": gen_7_9_BattleOfHogwarts,
  };

  const key = `${worldId}-${levelIdx}`;
  const gen = generators[key];
  return gen ? gen(H) : null;
}
