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

  // Wide grassy ground to start
  for (let i = 0; i < 10; i++) platforms.push({ x: i * 90, y: H - 40, w: 88, h: 40, type: "normal", color: "#3a5a2a" });

  // Willow branches — wider platforms, gentler movement, more forgiving spacing
  const branchPositions = [
    { x: 80, y: H - 120 }, { x: 260, y: H - 120 },
    { x: 50, y: H - 200 }, { x: 220, y: H - 200 }, { x: 380, y: H - 210 },
    { x: 100, y: H - 290 }, { x: 300, y: H - 290 },
    { x: 60, y: H - 370 }, { x: 240, y: H - 380 }, { x: 400, y: H - 370 },
    { x: 140, y: H - 460 }, { x: 320, y: H - 460 },
    { x: 80, y: H - 540 }, { x: 280, y: H - 540 },
    { x: 180, y: H - 620 },
  ];
  branchPositions.forEach((b, i) => {
    // Every 3rd platform is moving (gentle sway), rest are solid
    const isMoving = i % 3 === 1;
    platforms.push({
      x: b.x, y: b.y, w: 90, h: 16,
      type: isMoving ? "moving" : "normal",
      moveRange: isMoving ? 40 : undefined,
      color: "#5a4a2a",
      label: i === 0 ? "🌳 Dodge the branches!" : undefined,
    });
  });

  // Only 2 gentle branch-swipe enemies (slower, smaller range)
  enemies.push({ x: 200, y: H - 320, w: 24, h: 24, type: "troll", dir: 1, speed: 0.7, range: 40, origX: 200, emoji: "🌿" });
  enemies.push({ x: 300, y: H - 500, w: 24, h: 24, type: "troll", dir: -1, speed: 0.8, range: 50, origX: 300, emoji: "🌿" });

  platforms.push({ x: 150, y: H - 700, w: 120, h: 22, type: "finish", label: "🚗 Flying Car Escape" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

function gen_2_6_MoaningMyrtleBathroom(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Flooded bathroom floor with sinks
  platforms.push({ x: 0, y: H - 40, w: 180, h: 40, type: "normal", color: "#4a5a6a", label: "🚻 Bathroom" });

  // Row of sinks along ground level — some working, some broken
  const sinks = [200, 310, 420, 530, 640];
  sinks.forEach((sx, i) => {
    platforms.push({ x: sx, y: H - 50, w: 60, h: 16, type: "normal", color: "#6a7a8a", label: "🚰" });
    // Water spray hazards from broken pipes above
    if (i % 2 === 0) {
      platforms.push({ x: sx + 10, y: H - 110, w: 15, h: 50, type: "hazard", color: "#4488cc", label: "💧" });
    }
  });

  // Upper bathroom level — toilet stalls as platforms
  const stalls = [
    { x: 100, y: H - 140, label: "🚪" }, { x: 250, y: H - 160, label: "🚪" },
    { x: 400, y: H - 150, label: "🚪" }, { x: 550, y: H - 170, label: "🚪" },
  ];
  stalls.forEach(s => {
    platforms.push({ x: s.x, y: s.y, w: 80, h: 14, type: "normal", color: "#5a6a7a", label: s.label });
  });

  // Slippery wet pipes going up toward the chamber entrance
  for (let i = 0; i < 6; i++) {
    const side = i % 2 === 0 ? 50 + i * 30 : 350 - i * 20;
    platforms.push({
      x: side, y: H - 240 - i * 70, w: 90, h: 12,
      type: "ice", color: "#8ab8d8", label: i % 2 === 0 ? "🪈" : "",
    });
  }

  // Spinning sink platform (the Chamber entrance mechanism)
  const spinSink: Platform = {
    x: 250, y: H - 680, w: 80, h: 14, type: "moving",
    color: "#8a9aaa", label: "🐍 Sink",
    origX: 250, origY: H - 680, moveDir: 1, moveRange: 60,
  };
  platforms.push(spinSink);

  // Myrtle flying around wailing
  enemies.push({ x: 350, y: H - 200, w: 22, h: 22, type: "myrtle", dir: -1, speed: 0.7, range: 120, origX: 350, emoji: "👻" });
  // Water burst enemies
  enemies.push({ x: 150, y: H - 400, w: 18, h: 18, type: "waterBurst", dir: 1, speed: 1.0, range: 50, origX: 150, emoji: "💦" });
  enemies.push({ x: 400, y: H - 550, w: 18, h: 18, type: "waterBurst", dir: -1, speed: 1.1, range: 60, origX: 400, emoji: "💦" });

  platforms.push({ x: 200, y: H - 780, w: 120, h: 20, type: "finish", label: "🐍 Chamber Entrance" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_2_7_AragogLair(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Forest clearing — you've followed the spiders here
  platforms.push({ x: 0, y: H - 40, w: 150, h: 40, type: "normal", color: "#2a3a1a", label: "🕸️ Follow the spiders..." });

  // Ground-level forest path with web obstacles
  for (let i = 0; i < 8; i++) {
    platforms.push({
      x: 170 + i * 110, y: H - 45 - (i % 2) * 15, w: 70, h: 16,
      type: "normal", color: "#3a2a1a", label: i % 3 === 0 ? "🍂" : "",
    });
  }

  // Web bridges between trees (disappearing — fragile webs)
  const webBridges = [
    { x: 300, y: H - 100 }, { x: 550, y: H - 120 },
    { x: 800, y: H - 110 }, { x: 1050, y: H - 130 },
  ];
  webBridges.forEach(wb => {
    platforms.push({ x: wb.x, y: wb.y, w: 100, h: 10, type: "disappearing", timer: 0, visible: true, color: "#cccccc", label: "🕸️" });
  });

  // Tree trunk platforms (safe havens)
  const trees = [
    { x: 200, y: H - 170, label: "🌲" }, { x: 480, y: H - 180, label: "🌲" },
    { x: 720, y: H - 200, label: "🌲" }, { x: 950, y: H - 190, label: "🌲" },
  ];
  trees.forEach(t => {
    platforms.push({ x: t.x, y: t.y, w: 65, h: 14, type: "normal", color: "#4a3a1a", label: t.label });
  });

  // Higher canopy escape route
  for (let i = 0; i < 5; i++) {
    platforms.push({
      x: 150 + i * 200, y: H - 260 - i * 30, w: 60, h: 12,
      type: "normal", color: "#2a4a1a", label: "🌿",
    });
  }

  // Acromantulas everywhere — ground and trees
  enemies.push({ x: 250, y: H - 68, w: 18, h: 18, type: "acromantula", dir: 1, speed: 0.9, range: 60, origX: 250, emoji: "🕷️" });
  enemies.push({ x: 500, y: H - 68, w: 20, h: 20, type: "acromantula", dir: -1, speed: 1.0, range: 70, origX: 500, emoji: "🕷️" });
  enemies.push({ x: 700, y: H - 220, w: 18, h: 18, type: "acromantula", dir: 1, speed: 1.1, range: 50, origX: 700, emoji: "🕷️" });
  enemies.push({ x: 400, y: H - 150, w: 22, h: 22, type: "acromantula", dir: -1, speed: 0.8, range: 80, origX: 400, emoji: "🕷️" });
  enemies.push({ x: 900, y: H - 68, w: 24, h: 24, type: "acromantula", dir: 1, speed: 1.2, range: 60, origX: 900, emoji: "🕷️" });
  // Aragog himself — large, slow
  enemies.push({ x: 600, y: H - 130, w: 36, h: 36, type: "aragog", dir: 1, speed: 0.3, range: 100, origX: 600, emoji: "🕷️" });

  platforms.push({ x: 1100, y: H - 300, w: 120, h: 20, type: "finish", label: "🚗 Escape the Lair" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_2_8_ParseltonguePipes(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Bathroom entrance — you've spoken Parseltongue
  platforms.push({ x: 0, y: H - 40, w: 160, h: 40, type: "normal", color: "#3a4a3a", label: "🐍 Open up..." });

  // Initial slide down — wide angled platforms descending
  for (let i = 0; i < 5; i++) {
    platforms.push({
      x: 40 + i * 60, y: H - 20 + i * 30, w: 100, h: 10,
      type: "normal", color: "#4a5a4a", label: i === 0 ? "🪈 Slide!" : "",
    });
  }

  // Vertical pipe shaft — zigzag climbing through ancient plumbing
  const pipeLeft = 30, pipeRight = 250;
  for (let i = 0; i < 16; i++) {
    const side = i % 2 === 0 ? pipeLeft : pipeRight;
    const w = 100 + (i % 3) * 20;
    platforms.push({
      x: side, y: H - 120 - i * 50, w, h: 16,
      type: i % 5 === 0 ? "ice" : "normal",
      color: i % 5 === 0 ? "#5a7a6a" : "#3a4a3a",
      label: i % 4 === 0 ? "🪈" : "",
    });
  }

  // Pipe junction platforms — wider rest areas
  platforms.push({ x: 60, y: H - 320, w: 250, h: 14, type: "normal", color: "#4a5a4a", label: "🔀 Junction" });
  platforms.push({ x: 40, y: H - 570, w: 280, h: 14, type: "normal", color: "#4a5a4a", label: "🔀 Junction" });

  // Grate traps — hazard platforms blocking parts of the path
  platforms.push({ x: 150, y: H - 200, w: 20, h: 40, type: "hazard", color: "#5a5a5a", label: "⚠️" });
  platforms.push({ x: 100, y: H - 450, w: 20, h: 40, type: "hazard", color: "#5a5a5a", label: "⚠️" });
  platforms.push({ x: 250, y: H - 650, w: 20, h: 40, type: "hazard", color: "#5a5a5a", label: "⚠️" });

  // Snakes guarding the pipes
  enemies.push({ x: 130, y: H - 250, w: 24, h: 24, type: "snake", dir: 1, speed: 0.7, range: 70, origX: 130, emoji: "🐍" });
  enemies.push({ x: 200, y: H - 430, w: 24, h: 24, type: "snake", dir: -1, speed: 0.9, range: 60, origX: 200, emoji: "🐍" });
  enemies.push({ x: 100, y: H - 700, w: 26, h: 26, type: "snake", dir: 1, speed: 1.0, range: 80, origX: 100, emoji: "🐍" });

  platforms.push({ x: 100, y: H - 870, w: 160, h: 20, type: "finish", label: "🐍 Chamber Below" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
}

function gen_2_9_SwordOfGryffindor(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Deep within the Chamber — dark stone floor
  platforms.push({ x: 0, y: H - 40, w: 200, h: 40, type: "normal", color: "#2a2a2a", label: "⚔️ The Chamber" });

  // Snake-head pillars along the sides (decorative + platforms)
  const pillars = [
    { x: 60, y: H - 120 }, { x: 300, y: H - 130 },
    { x: 60, y: H - 250 }, { x: 300, y: H - 260 },
    { x: 60, y: H - 380 }, { x: 300, y: H - 390 },
    { x: 60, y: H - 510 }, { x: 300, y: H - 520 },
  ];
  pillars.forEach((p, i) => {
    platforms.push({
      x: p.x, y: p.y, w: 70, h: 14, type: "normal",
      color: "#3a3a2a", label: i % 2 === 0 ? "🐍" : "🗿",
    });
  });

  // Central ascending path — Sorting Hat platforms
  const hatPath = [
    { x: 150, y: H - 170 }, { x: 200, y: H - 300 },
    { x: 130, y: H - 430 }, { x: 220, y: H - 560 },
  ];
  hatPath.forEach((p, i) => {
    platforms.push({
      x: p.x, y: p.y, w: 60, h: 12,
      type: i === 3 ? "normal" : "disappearing", timer: 0, visible: true,
      color: i === 3 ? "#aa7733" : "#5a4a3a",
      label: i === 3 ? "🎩 Hat!" : "",
    });
  });

  // Moving platforms — enchanted stones
  const mp1: Platform = { x: 180, y: H - 200, w: 55, h: 12, type: "moving", color: "#4a4a5a", origX: 180, origY: H - 200, moveDir: 1, moveRange: 40 };
  const mp2: Platform = { x: 150, y: H - 460, w: 55, h: 12, type: "moving", color: "#4a4a5a", origX: 150, origY: H - 460, moveDir: -1, moveRange: 50 };
  platforms.push(mp1, mp2);

  // Water on the floor (the Chamber is flooded)
  platforms.push({ x: 220, y: H - 30, w: 150, h: 20, type: "hazard", color: "#2a4a4a", label: "💧" });

  // Basilisk fragments — mini-snake enemies guarding the ascent
  enemies.push({ x: 120, y: H - 150, w: 22, h: 22, type: "snake", dir: 1, speed: 0.8, range: 60, origX: 120, emoji: "🐍" });
  enemies.push({ x: 250, y: H - 290, w: 22, h: 22, type: "snake", dir: -1, speed: 0.9, range: 50, origX: 250, emoji: "🐍" });
  enemies.push({ x: 100, y: H - 420, w: 24, h: 24, type: "snake", dir: 1, speed: 1.0, range: 70, origX: 100, emoji: "🐍" });
  // The Basilisk itself — large, dangerous
  enemies.push({ x: 180, y: H - 580, w: 36, h: 36, type: "basilisk", dir: 1, speed: 0.5, range: 100, origX: 180, emoji: "🐍" });

  platforms.push({ x: 140, y: H - 680, w: 120, h: 20, type: "finish", label: "⚔️ Sword of Gryffindor" });
  return { platforms, enemies, startX: 50, startY: H - 80 };
}

// ─── WORLD 3 EXTRA LEVELS ────────────────────────

function gen_3_5_HippogriffFlight(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Invisible floor and ceiling boundaries
  platforms.push({ x: 0, y: H - 30, w: 10000, h: 30, type: "hazard", color: "transparent" });
  platforms.push({ x: 0, y: 0, w: 10000, h: 10, type: "hazard", color: "transparent" });

  // Storm clouds to dodge
  for (let i = 0; i < 28; i++) {
    const x = 500 + i * 300 + (i % 3) * 70;
    const y = 40 + ((i * 151) % (H - 120));
    const w = 55 + (i % 3) * 20;
    const h = 22 + (i % 2) * 10;
    platforms.push({ x, y, w, h, type: "hazard", color: "#6a6a8a", label: "⛈️" });
  }

  // Dementors chasing through the sky
  for (let i = 0; i < 12; i++) {
    const x = 700 + i * 650;
    const y = 50 + ((i * 197) % (H - 130));
    enemies.push({
      x, y, w: 24, h: 24, type: "dementor",
      dir: -1, speed: 1.2 + (i % 3) * 0.3, range: 120,
      origX: x, emoji: "👻",
    });
  }

  // Hogwarts tower tops poking up
  for (let i = 0; i < 6; i++) {
    const x = 1000 + i * 1400;
    platforms.push({
      x, y: H - 90, w: 60, h: 60, type: "hazard",
      color: "#5a5a6a", label: "🏰",
    });
  }

  // Mountain peaks
  for (let i = 0; i < 4; i++) {
    const x = 2000 + i * 2000;
    platforms.push({
      x, y: H - 110, w: 80, h: 80, type: "hazard",
      color: "#4a4a3a", label: "⛰️",
    });
  }

  // Safe landing at Hagrid's hut
  platforms.push({ x: 9200, y: H / 2 - 30, w: 120, h: 60, type: "finish", label: "🦅 Safe Landing" });

  return { platforms, enemies, startX: 60, startY: H / 2, hippogriffFlight: true };
}

function gen_3_6_ShriekingShack(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Ground floor — entrance from the tunnel
  platforms.push({ x: 0, y: H - 40, w: 140, h: 40, type: "normal", color: "#4a3a2a", label: "🏚️ Ground Floor" });

  // Room 1: Living room — furniture as platforms, some collapse
  platforms.push({ x: 160, y: H - 50, w: 100, h: 16, type: "normal", color: "#6a5a3a", label: "🪑 Chair" });
  platforms.push({ x: 280, y: H - 80, w: 80, h: 16, type: "disappearing", timer: 0, visible: true, color: "#6a5a3a", label: "🛋️ Sofa" });
  platforms.push({ x: 400, y: H - 60, w: 90, h: 16, type: "normal", color: "#6a5a3a", label: "📦 Crate" });

  // Stairs going up — creaky, some disappear
  for (let i = 0; i < 5; i++) {
    platforms.push({
      x: 500 + i * 35, y: H - 90 - i * 30, w: 40, h: 10,
      type: i === 2 || i === 4 ? "disappearing" : "normal", timer: 0, visible: true,
      color: "#5a4a2a", label: i === 0 ? "📐 Stairs" : "",
    });
  }

  // Room 2: Upper bedroom — bed, wardrobe, broken windows
  platforms.push({ x: 400, y: H - 250, w: 120, h: 14, type: "normal", color: "#5a4a3a", label: "🛏️ Bed" });
  platforms.push({ x: 250, y: H - 280, w: 80, h: 14, type: "normal", color: "#4a3a2a", label: "🚪 Wardrobe" });
  platforms.push({ x: 550, y: H - 300, w: 70, h: 14, type: "disappearing", timer: 0, visible: true, color: "#5a4a3a", label: "🪟 Window" });

  // Room 3: Attic — exposed beams, narrow
  platforms.push({ x: 100, y: H - 350, w: 90, h: 12, type: "normal", color: "#5a4a2a", label: "🪵 Beam" });
  platforms.push({ x: 280, y: H - 380, w: 80, h: 12, type: "normal", color: "#5a4a2a", label: "🪵 Beam" });
  platforms.push({ x: 450, y: H - 410, w: 90, h: 12, type: "moving", color: "#5a4a2a", origX: 450, origY: H - 410, moveDir: 1, moveRange: 40, label: "🪵" });
  platforms.push({ x: 200, y: H - 450, w: 80, h: 12, type: "normal", color: "#5a4a2a" });
  platforms.push({ x: 380, y: H - 490, w: 90, h: 12, type: "disappearing", timer: 0, visible: true, color: "#5a4a2a" });

  // Sliding furniture — moving platforms (poltergeist activity)
  const slide1: Platform = { x: 150, y: H - 150, w: 70, h: 14, type: "moving", color: "#6a5a4a", label: "🪑", origX: 150, origY: H - 150, moveDir: 1, moveRange: 60 };
  const slide2: Platform = { x: 300, y: H - 320, w: 60, h: 14, type: "moving", color: "#6a5a4a", label: "📦", origX: 300, origY: H - 320, moveDir: -1, moveRange: 50 };
  platforms.push(slide1, slide2);

  // Werewolf Lupin — fast and dangerous
  enemies.push({ x: 350, y: H - 278, w: 26, h: 26, type: "werewolf", dir: 1, speed: 1.6, range: 80, origX: 350, emoji: "🐺" });
  // Ghostly echoes
  enemies.push({ x: 200, y: H - 180, w: 20, h: 20, type: "ghost", dir: -1, speed: 0.5, range: 60, origX: 200, emoji: "👤" });
  enemies.push({ x: 400, y: H - 430, w: 20, h: 20, type: "ghost", dir: 1, speed: 0.6, range: 50, origX: 400, emoji: "👤" });

  platforms.push({ x: 250, y: H - 550, w: 120, h: 20, type: "finish", label: "🏚️ Secret Passage" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_3_7_MaraudersMap(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Start in a corridor behind a portrait
  platforms.push({ x: 0, y: H - 40, w: 140, h: 40, type: "normal", color: "#5a4a3a", label: "🖼️ Behind the portrait" });

  // Secret passage 1 — narrow tunnel (horizontal)
  for (let i = 0; i < 6; i++) {
    platforms.push({
      x: 160 + i * 100, y: H - 60 - (i % 2) * 20, w: 70, h: 14,
      type: "normal", color: "#4a3a2a", label: i === 0 ? "🗺️ Passage" : "",
    });
  }

  // Emerge into corridor — painting platforms
  platforms.push({ x: 800, y: H - 100, w: 90, h: 14, type: "normal", color: "#6a5a4a", label: "🖼️" });
  platforms.push({ x: 930, y: H - 130, w: 80, h: 14, type: "normal", color: "#6a5a4a", label: "🖼️" });

  // Secret passage 2 — behind the one-eyed witch statue (vertical)
  platforms.push({ x: 1050, y: H - 80, w: 70, h: 14, type: "normal", color: "#5a5a5a", label: "🗿 Statue" });
  for (let i = 0; i < 4; i++) {
    const side = i % 2 === 0 ? 1000 : 1100;
    platforms.push({ x: side, y: H - 160 - i * 55, w: 70, h: 12, type: "normal", color: "#3a3a2a" });
  }

  // Secret passage 3 — the Honeydukes passage (longest)
  for (let i = 0; i < 8; i++) {
    platforms.push({
      x: 1200 + i * 90, y: H - 120 - (i % 3) * 30, w: 60, h: 12,
      type: i % 4 === 0 ? "disappearing" : "normal", timer: 0, visible: true,
      color: "#4a4a3a", label: i % 3 === 0 ? "🍬" : "",
    });
  }

  // Hidden map collectible platforms (gold)
  platforms.push({ x: 500, y: H - 150, w: 40, h: 10, type: "normal", color: "#c0a040", label: "🗺️" });
  platforms.push({ x: 1400, y: H - 200, w: 40, h: 10, type: "normal", color: "#c0a040", label: "🗺️" });

  // Filch patrolling corridors
  enemies.push({ x: 700, y: H - 78, w: 22, h: 22, type: "filch", dir: -1, speed: 0.7, range: 80, origX: 700, emoji: "🧹" });
  // Mrs Norris — fast cat
  enemies.push({ x: 1100, y: H - 108, w: 16, h: 16, type: "cat", dir: 1, speed: 1.5, range: 70, origX: 1100, emoji: "🐱" });
  // Prefect
  enemies.push({ x: 1500, y: H - 148, w: 20, h: 20, type: "prefect", dir: -1, speed: 0.9, range: 60, origX: 1500, emoji: "🧑‍🎓" });

  platforms.push({ x: 1900, y: H - 150, w: 120, h: 20, type: "finish", label: "🗺️ Mischief Managed" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_3_8_WillowTunnel(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Whomping Willow roots — you've pressed the knot
  platforms.push({ x: 0, y: H - 40, w: 140, h: 40, type: "normal", color: "#3a2a1a", label: "🌳 Tunnel Entrance" });

  // Narrow earth tunnel — zigzag with roots
  const tunnelPath = [
    { x: 160, y: H - 70, w: 100 }, { x: 100, y: H - 130, w: 90 },
    { x: 200, y: H - 190, w: 80 }, { x: 80, y: H - 250, w: 100 },
    { x: 220, y: H - 310, w: 90 }, { x: 100, y: H - 370, w: 80 },
    { x: 200, y: H - 430, w: 100 }, { x: 80, y: H - 490, w: 90 },
    { x: 220, y: H - 550, w: 80 }, { x: 100, y: H - 610, w: 100 },
    { x: 200, y: H - 670, w: 90 },
  ];
  tunnelPath.forEach((p, i) => {
    platforms.push({
      x: p.x, y: p.y, w: p.w, h: 14,
      type: i % 4 === 3 ? "disappearing" : "normal", timer: 0, visible: true,
      color: "#4a3a1a", label: i % 3 === 0 ? "🪨" : "",
    });
  });

  // Root hazards — they reach down from ceiling
  platforms.push({ x: 150, y: H - 100, w: 15, h: 30, type: "hazard", color: "#3a2a0a", label: "🌿" });
  platforms.push({ x: 180, y: H - 280, w: 15, h: 35, type: "hazard", color: "#3a2a0a", label: "🌿" });
  platforms.push({ x: 130, y: H - 460, w: 15, h: 30, type: "hazard", color: "#3a2a0a", label: "🌿" });
  platforms.push({ x: 200, y: H - 580, w: 15, h: 25, type: "hazard", color: "#3a2a0a", label: "🌿" });

  // Grabbing root enemies
  enemies.push({ x: 150, y: H - 160, w: 20, h: 20, type: "root", dir: 1, speed: 0.7, range: 50, origX: 150, emoji: "🌿" });
  enemies.push({ x: 200, y: H - 400, w: 22, h: 22, type: "root", dir: -1, speed: 0.8, range: 60, origX: 200, emoji: "🌿" });
  enemies.push({ x: 120, y: H - 580, w: 22, h: 22, type: "root", dir: 1, speed: 0.9, range: 55, origX: 120, emoji: "🌿" });

  platforms.push({ x: 120, y: H - 740, w: 120, h: 20, type: "finish", label: "🏚️ Shrieking Shack" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_3_9_PatronusTraining(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Lupin's classroom — wide arena floor
  platforms.push({ x: 0, y: H - 40, w: 500, h: 40, type: "normal", color: "#3a3a4a", label: "📚 Lupin's Classroom" });

  // Training obstacles — desks pushed aside, creating platforms
  const desks = [
    { x: 50, y: H - 110, label: "📚 Desk" }, { x: 200, y: H - 140, label: "📚" },
    { x: 350, y: H - 120, label: "📚" }, { x: 150, y: H - 200, label: "📚" },
    { x: 300, y: H - 230, label: "📚" }, { x: 80, y: H - 270, label: "📚" },
    { x: 250, y: H - 310, label: "📚" }, { x: 400, y: H - 280, label: "📚" },
  ];
  desks.forEach(d => {
    platforms.push({ x: d.x, y: d.y, w: 75, h: 14, type: "normal", color: "#5a4a3a", label: d.label });
  });

  // Boggart-Dementor wardrobe at center
  platforms.push({ x: 200, y: H - 80, w: 80, h: 40, type: "normal", color: "#2a2a2a", label: "🚪 Wardrobe" });

  // Patronus light platforms — glowing blue safe zones
  platforms.push({ x: 100, y: H - 170, w: 50, h: 12, type: "normal", color: "#88bbff", label: "✨" });
  platforms.push({ x: 350, y: H - 250, w: 50, h: 12, type: "normal", color: "#88bbff", label: "✨" });
  platforms.push({ x: 150, y: H - 350, w: 50, h: 12, type: "normal", color: "#88bbff", label: "✨" });

  // Higher challenge platforms
  for (let i = 0; i < 5; i++) {
    platforms.push({
      x: 50 + i * 100, y: H - 380 - i * 40, w: 60, h: 12,
      type: i % 2 === 0 ? "normal" : "disappearing", timer: 0, visible: true,
      color: "#4a4a6a",
    });
  }

  // Dementors — progressively more and faster (training waves)
  enemies.push({ x: 100, y: H - 130, w: 22, h: 22, type: "dementor", dir: 1, speed: 0.5, range: 60, origX: 100, emoji: "👻" });
  enemies.push({ x: 350, y: H - 160, w: 22, h: 22, type: "dementor", dir: -1, speed: 0.7, range: 70, origX: 350, emoji: "👻" });
  enemies.push({ x: 200, y: H - 250, w: 24, h: 24, type: "dementor", dir: 1, speed: 0.8, range: 80, origX: 200, emoji: "👻" });
  enemies.push({ x: 100, y: H - 350, w: 24, h: 24, type: "dementor", dir: -1, speed: 0.9, range: 90, origX: 100, emoji: "👻" });
  enemies.push({ x: 300, y: H - 450, w: 26, h: 26, type: "dementor", dir: 1, speed: 1.0, range: 100, origX: 300, emoji: "👻" });

  platforms.push({ x: 180, y: H - 600, w: 120, h: 20, type: "finish", label: "✨ Expecto Patronum!" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
}

function gen_4_5_YuleBall(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Great Hall dance floor
  platforms.push({ x: 0, y: H - 40, w: 600, h: 40, type: "normal", color: "#4a3a5a", label: "💃 Great Hall" });

  // Ice sculpture decorations (hazards)
  platforms.push({ x: 150, y: H - 80, w: 25, h: 40, type: "hazard", color: "#aaccee", label: "🧊" });
  platforms.push({ x: 400, y: H - 80, w: 25, h: 40, type: "hazard", color: "#aaccee", label: "🧊" });

  // Enchanted dance floor tiles — moving platforms
  const danceTiles = [
    { x: 50, y: H - 100, range: 40 }, { x: 200, y: H - 120, range: 50 },
    { x: 350, y: H - 110, range: 35 }, { x: 500, y: H - 130, range: 45 },
  ];
  danceTiles.forEach((dt, i) => {
    const p: Platform = {
      x: dt.x, y: dt.y, w: 70, h: 12, type: "moving", color: "#cc88ff",
      label: i === 0 ? "🎵" : "", origX: dt.x, origY: dt.y, moveDir: i % 2 === 0 ? 1 : -1, moveRange: dt.range,
    };
    platforms.push(p);
  });

  // Floating candles and chandelier platforms (higher tier)
  const chandeliers = [
    { x: 100, y: H - 200, label: "🕯️" }, { x: 300, y: H - 230, label: "🕯️" },
    { x: 500, y: H - 210, label: "🕯️" }, { x: 200, y: H - 280, label: "🕯️" },
    { x: 400, y: H - 300, label: "🕯️" },
  ];
  chandeliers.forEach(c => {
    platforms.push({ x: c.x, y: c.y, w: 60, h: 12, type: "normal", color: "#aa8844", label: c.label });
  });

  // Balcony platforms (even higher)
  platforms.push({ x: 50, y: H - 350, w: 90, h: 14, type: "normal", color: "#5a4a6a", label: "🏛️ Balcony" });
  platforms.push({ x: 250, y: H - 380, w: 80, h: 14, type: "normal", color: "#5a4a6a" });
  platforms.push({ x: 450, y: H - 360, w: 90, h: 14, type: "normal", color: "#5a4a6a" });

  // Waltzing couples, flying goblets, Peeves
  enemies.push({ x: 100, y: H - 68, w: 24, h: 24, type: "dancer", dir: 1, speed: 0.5, range: 100, origX: 100, emoji: "💃" });
  enemies.push({ x: 350, y: H - 68, w: 24, h: 24, type: "dancer", dir: -1, speed: 0.6, range: 80, origX: 350, emoji: "🕺" });
  enemies.push({ x: 250, y: H - 250, w: 18, h: 18, type: "goblet", dir: 1, speed: 1.2, range: 60, origX: 250, emoji: "🥂" });
  enemies.push({ x: 400, y: H - 330, w: 18, h: 18, type: "goblet", dir: -1, speed: 1.0, range: 50, origX: 400, emoji: "🥂" });

  platforms.push({ x: 200, y: H - 440, w: 120, h: 20, type: "finish", label: "💃 Grand Finale" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
}

function gen_4_6_TriwizardMaze(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Maze entrance
  platforms.push({ x: 0, y: H - 40, w: 120, h: 40, type: "normal", color: "#1a3a1a", label: "🌿 Maze" });

  // Hedge corridors — alternating left and right paths creating a maze feel
  // Path zigzags horizontally first, then ascends
  const mazePath = [
    { x: 140, y: H - 55, w: 100 }, { x: 280, y: H - 60, w: 90 },
    { x: 420, y: H - 50, w: 100 }, { x: 560, y: H - 65, w: 80 },
    { x: 700, y: H - 55, w: 100 }, { x: 840, y: H - 70, w: 90 },
    // Now ascend
    { x: 750, y: H - 130, w: 80 }, { x: 600, y: H - 160, w: 90 },
    { x: 450, y: H - 190, w: 80 }, { x: 300, y: H - 220, w: 90 },
    { x: 150, y: H - 250, w: 80 }, { x: 300, y: H - 310, w: 90 },
    { x: 500, y: H - 340, w: 80 }, { x: 650, y: H - 380, w: 90 },
  ];
  mazePath.forEach((p, i) => {
    platforms.push({
      x: p.x, y: p.y, w: p.w, h: 14, type: "normal",
      color: "#2a5a2a", label: i % 4 === 0 ? "🌿" : "",
    });
  });

  // Hedge walls (tall barriers you must go around)
  platforms.push({ x: 350, y: H - 50, w: 14, h: 50, type: "normal", color: "#1a4a1a" });
  platforms.push({ x: 650, y: H - 60, w: 14, h: 55, type: "normal", color: "#1a4a1a" });
  platforms.push({ x: 400, y: H - 200, w: 14, h: 50, type: "normal", color: "#1a4a1a" });

  // Golden mist — hazard zones (inverts your vision in the story)
  platforms.push({ x: 500, y: H - 80, w: 60, h: 8, type: "hazard", color: "#ccaa44", label: "✨ Mist" });
  platforms.push({ x: 200, y: H - 280, w: 60, h: 8, type: "hazard", color: "#ccaa44", label: "✨ Mist" });

  // Blast-Ended Skrewts lurking in dead ends
  enemies.push({ x: 500, y: H - 78, w: 22, h: 22, type: "skrewt", dir: 1, speed: 1.0, range: 60, origX: 500, emoji: "🦂" });
  enemies.push({ x: 350, y: H - 248, w: 24, h: 24, type: "skrewt", dir: -1, speed: 1.2, range: 70, origX: 350, emoji: "🦂" });
  // Sphinx guarding final path
  enemies.push({ x: 550, y: H - 368, w: 26, h: 26, type: "sphinx", dir: 1, speed: 0.4, range: 40, origX: 550, emoji: "🦁" });

  platforms.push({ x: 750, y: H - 440, w: 100, h: 20, type: "finish", label: "🏆 Triwizard Cup" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_4_7_MerpeopleVillage(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Lake surface — you dive in
  platforms.push({ x: 0, y: H - 40, w: 140, h: 40, type: "normal", color: "#3a5a7a", label: "🌊 Dive!" });

  // Descending underwater — kelp forests and stone ruins
  const descent = [
    { x: 160, y: H - 80, w: 80, label: "🌿 Kelp" },
    { x: 300, y: H - 120, w: 70, label: "🪨" },
    { x: 180, y: H - 170, w: 90, label: "🌿" },
    { x: 350, y: H - 210, w: 70, label: "🏛️ Ruin" },
    { x: 120, y: H - 260, w: 80, label: "🌿" },
  ];
  descent.forEach(d => {
    platforms.push({ x: d.x, y: d.y, w: d.w, h: 12, type: "ice", color: "#4488aa", label: d.label });
  });

  // Merpeople village — stone hut platforms
  const huts = [
    { x: 80, y: H - 320, label: "🏠" }, { x: 250, y: H - 350, label: "🏠" },
    { x: 400, y: H - 330, label: "🏠" }, { x: 150, y: H - 400, label: "🏠" },
    { x: 320, y: H - 430, label: "🏠" },
  ];
  huts.forEach(h => {
    platforms.push({ x: h.x, y: h.y, w: 75, h: 14, type: "normal", color: "#5a6a7a", label: h.label });
  });

  // Hostage rescue area — central platform
  platforms.push({ x: 200, y: H - 500, w: 100, h: 14, type: "normal", color: "#4a5a6a", label: "🧑 Rescue!" });

  // Ascent back to surface
  for (let i = 0; i < 5; i++) {
    platforms.push({
      x: 100 + i * 80, y: H - 560 - i * 50, w: 60, h: 12,
      type: "ice", color: "#5599bb", label: i === 0 ? "🫧 Up!" : "🫧",
    });
  }

  // Grindylows grabbing at you
  enemies.push({ x: 250, y: H - 150, w: 18, h: 18, type: "grindylow", dir: 1, speed: 1.2, range: 60, origX: 250, emoji: "🦑" });
  enemies.push({ x: 350, y: H - 300, w: 20, h: 20, type: "grindylow", dir: -1, speed: 1.3, range: 70, origX: 350, emoji: "🦑" });
  // Merpeople guards
  enemies.push({ x: 150, y: H - 380, w: 22, h: 22, type: "merperson", dir: 1, speed: 0.8, range: 50, origX: 150, emoji: "🧜" });
  enemies.push({ x: 300, y: H - 460, w: 22, h: 22, type: "merperson", dir: -1, speed: 0.9, range: 60, origX: 300, emoji: "🧜" });

  platforms.push({ x: 350, y: H - 810, w: 100, h: 20, type: "finish", label: "🫧 Surface!" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_4_8_PortkeyField(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Open field — scattered mundane objects
  platforms.push({ x: 0, y: H - 40, w: 200, h: 40, type: "normal", color: "#4a5a3a", label: "🏕️ Campsite" });

  // Ground level — field with scattered "Portkey" objects
  const portkeys = [
    { x: 220, y: H - 55, label: "👢 Boot" }, { x: 380, y: H - 50, label: "🫖 Kettle" },
    { x: 540, y: H - 60, label: "📰 Paper" }, { x: 700, y: H - 50, label: "🧤 Glove" },
    { x: 860, y: H - 55, label: "🔧 Wrench" }, { x: 1020, y: H - 50, label: "🎩 Hat" },
  ];
  portkeys.forEach(pk => {
    platforms.push({
      x: pk.x, y: pk.y, w: 70, h: 14,
      type: "disappearing", timer: 0, visible: true,
      color: "#6a8a4a", label: pk.label,
    });
  });

  // Teleported platforms — appearing at different heights (touching portkeys "teleports" you)
  const teleported = [
    { x: 300, y: H - 130 }, { x: 500, y: H - 180 }, { x: 200, y: H - 230 },
    { x: 650, y: H - 160 }, { x: 400, y: H - 280 }, { x: 750, y: H - 250 },
    { x: 300, y: H - 330 }, { x: 550, y: H - 380 }, { x: 150, y: H - 350 },
    { x: 700, y: H - 420 },
  ];
  teleported.forEach((t, i) => {
    platforms.push({
      x: t.x, y: t.y, w: 60, h: 12,
      type: i % 3 === 0 ? "moving" : "normal",
      color: i % 3 === 0 ? "#aabb55" : "#5a6a3a",
      origX: t.x, origY: t.y, moveDir: i % 2 === 0 ? 1 : -1, moveRange: 30,
    });
  });

  // Death Eater at the higher levels
  enemies.push({ x: 400, y: H - 200, w: 22, h: 22, type: "deathEater", dir: -1, speed: 1.2, range: 70, origX: 400, emoji: "💀" });
  enemies.push({ x: 600, y: H - 350, w: 24, h: 24, type: "deathEater", dir: 1, speed: 1.4, range: 80, origX: 600, emoji: "💀" });

  platforms.push({ x: 400, y: H - 480, w: 120, h: 20, type: "finish", label: "🔑 Grab the Portkey" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
}

function gen_4_9_WandPriori(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Graveyard floor — Priori Incantatem begins
  platforms.push({ x: 0, y: H - 40, w: 400, h: 40, type: "normal", color: "#2a2a2a", label: "⚡ Priori Incantatem" });

  // Tombstones as cover
  platforms.push({ x: 50, y: H - 90, w: 40, h: 50, type: "normal", color: "#5a5a5a", label: "🪦" });
  platforms.push({ x: 200, y: H - 100, w: 40, h: 60, type: "normal", color: "#5a5a5a", label: "🪦" });
  platforms.push({ x: 320, y: H - 85, w: 40, h: 45, type: "normal", color: "#5a5a5a", label: "🪦" });

  // Wand beam spiral — golden light platforms ascending in a helix
  for (let i = 0; i < 16; i++) {
    const angle = i * 0.7;
    const x = 200 + Math.sin(angle) * 130;
    const y = H - 140 - i * 45;
    platforms.push({
      x, y, w: 55, h: 12, type: "normal",
      color: i % 2 === 0 ? "#ffcc44" : "#ddaa33",
      label: i % 3 === 0 ? "✨" : "",
    });
  }

  // Ghostly echo platforms — the spectral figures from the wand
  platforms.push({ x: 100, y: H - 300, w: 50, h: 12, type: "disappearing", timer: 0, visible: true, color: "#aabbcc", label: "👤 Echo" });
  platforms.push({ x: 300, y: H - 450, w: 50, h: 12, type: "disappearing", timer: 0, visible: true, color: "#aabbcc", label: "👤 Echo" });

  // Dark magic enemies — Voldemort's spells
  enemies.push({ x: 150, y: H - 200, w: 20, h: 20, type: "darkSpell", dir: 1, speed: 1.2, range: 80, origX: 150, emoji: "💀" });
  enemies.push({ x: 280, y: H - 400, w: 22, h: 22, type: "darkSpell", dir: -1, speed: 1.4, range: 90, origX: 280, emoji: "💀" });
  // Voldemort himself at the top
  enemies.push({ x: 200, y: H - 600, w: 30, h: 30, type: "voldemort", dir: 1, speed: 0.5, range: 100, origX: 200, emoji: "🐍" });

  platforms.push({ x: 150, y: H - 850, w: 120, h: 20, type: "finish", label: "✨ Escape!" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
}

function gen_5_5_RoomOfRequirement(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // The room materializes around you
  platforms.push({ x: 0, y: H - 40, w: 200, h: 40, type: "normal", color: "#5a4a3a", label: "🚪 Room of Requirement" });

  // Walls shift — left side morphing
  const leftWall = [
    { x: 30, y: H - 110, w: 80 }, { x: 50, y: H - 200, w: 70 },
    { x: 20, y: H - 290, w: 90 }, { x: 40, y: H - 380, w: 75 },
  ];
  leftWall.forEach((p, i) => {
    platforms.push({ x: p.x, y: p.y, w: p.w, h: 12, type: "disappearing", timer: 0, visible: true, color: "#7a6a5a", label: i === 0 ? "🚪" : "" });
  });

  // Right side morphing
  const rightWall = [
    { x: 280, y: H - 150, w: 80 }, { x: 300, y: H - 240, w: 70 },
    { x: 270, y: H - 330, w: 85 }, { x: 290, y: H - 420, w: 75 },
  ];
  rightWall.forEach(p => {
    platforms.push({ x: p.x, y: p.y, w: p.w, h: 12, type: "normal", color: "#6a5a4a" });
  });

  // Central floating objects — the room provides what you need
  platforms.push({ x: 150, y: H - 170, w: 60, h: 12, type: "moving", color: "#8a7a5a", label: "📚", origX: 150, origY: H - 170, moveDir: 1, moveRange: 40 });
  platforms.push({ x: 180, y: H - 260, w: 55, h: 12, type: "moving", color: "#8a7a5a", label: "🪑", origX: 180, origY: H - 260, moveDir: -1, moveRange: 50 });
  platforms.push({ x: 160, y: H - 350, w: 60, h: 12, type: "normal", color: "#8a7a5a", label: "🏺" });
  platforms.push({ x: 140, y: H - 440, w: 65, h: 12, type: "disappearing", timer: 0, visible: true, color: "#8a7a5a", label: "🪞" });

  // Training dummies
  enemies.push({ x: 200, y: H - 180, w: 20, h: 20, type: "dummy", dir: 1, speed: 0.5, range: 40, origX: 200, emoji: "🎯" });
  enemies.push({ x: 100, y: H - 350, w: 20, h: 20, type: "dummy", dir: -1, speed: 0.6, range: 50, origX: 100, emoji: "🎯" });

  platforms.push({ x: 150, y: H - 520, w: 120, h: 20, type: "finish", label: "🚪 Room Found" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_5_6_UmbridgeOffice(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Sickeningly pink office floor
  platforms.push({ x: 0, y: H - 40, w: 500, h: 40, type: "normal", color: "#cc88aa", label: "🎀 Umbridge's Office" });

  // Doily-covered shelves — pink platforms at different heights
  const shelves = [
    { x: 50, y: H - 100, label: "🎀" }, { x: 200, y: H - 120, label: "🍵 Tea" },
    { x: 350, y: H - 110, label: "🎀" }, { x: 100, y: H - 180, label: "📋 Decree" },
    { x: 280, y: H - 200, label: "🎀" }, { x: 420, y: H - 170, label: "📋" },
    { x: 50, y: H - 260, label: "🎀" }, { x: 200, y: H - 290, label: "📋 Decree" },
    { x: 380, y: H - 270, label: "🎀" }, { x: 120, y: H - 350, label: "🎀" },
    { x: 300, y: H - 370, label: "📋" },
  ];
  shelves.forEach(s => {
    platforms.push({ x: s.x, y: s.y, w: 70, h: 12, type: "normal", color: "#ff99bb", label: s.label });
  });

  // Cat plate walls — decorative hazards
  platforms.push({ x: 150, y: H - 80, w: 20, h: 40, type: "hazard", color: "#ffaacc", label: "🐱" });
  platforms.push({ x: 350, y: H - 150, w: 20, h: 40, type: "hazard", color: "#ffaacc", label: "🐱" });

  // Cat plates that fly at you, quills that chase
  enemies.push({ x: 100, y: H - 130, w: 20, h: 20, type: "catPlate", dir: 1, speed: 0.8, range: 60, origX: 100, emoji: "🐱" });
  enemies.push({ x: 350, y: H - 230, w: 20, h: 20, type: "catPlate", dir: -1, speed: 0.9, range: 70, origX: 350, emoji: "🐱" });
  enemies.push({ x: 200, y: H - 320, w: 18, h: 18, type: "quill", dir: 1, speed: 1.1, range: 50, origX: 200, emoji: "✒️" });

  platforms.push({ x: 200, y: H - 440, w: 120, h: 20, type: "finish", label: "📋 Decree Dodged" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
}

function gen_5_7_ThestralFlight(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Hogwarts grounds — mounting the Thestral
  platforms.push({ x: 0, y: H - 40, w: 160, h: 40, type: "normal", color: "#2a3a2a", label: "🦇 Mount Thestral" });

  // Takeoff over the forest
  const treeTops = [
    { x: 180, y: H - 80 }, { x: 320, y: H - 120 }, { x: 460, y: H - 170 },
  ];
  treeTops.forEach((t, i) => {
    platforms.push({ x: t.x, y: t.y, w: 70, h: 14, type: "normal", color: "#2a4a2a", label: i === 0 ? "🌲" : "" });
  });

  // High altitude clouds — English countryside
  const clouds = [
    { x: 600, y: H - 230, range: 60 }, { x: 800, y: H - 280, range: 50 },
    { x: 1000, y: H - 250, range: 70 }, { x: 1200, y: H - 310, range: 55 },
    { x: 1400, y: H - 270, range: 65 }, { x: 1600, y: H - 330, range: 50 },
    { x: 1800, y: H - 290, range: 60 }, { x: 2000, y: H - 350, range: 55 },
  ];
  clouds.forEach((c, i) => {
    const p: Platform = {
      x: c.x, y: c.y, w: 60, h: 12, type: "moving", color: "#6a6a8a",
      label: i % 3 === 0 ? "☁️" : "", origX: c.x, origY: c.y, moveDir: i % 2 === 0 ? 1 : -1, moveRange: c.range,
    };
    platforms.push(p);
  });

  // Storm clouds — hazards
  platforms.push({ x: 900, y: H - 220, w: 50, h: 8, type: "hazard", color: "#3a3a5a", label: "⚡" });
  platforms.push({ x: 1500, y: H - 300, w: 50, h: 8, type: "hazard", color: "#3a3a5a", label: "⚡" });

  // Death Eaters chasing
  enemies.push({ x: 700, y: H - 260, w: 22, h: 22, type: "deathEater", dir: 1, speed: 1.3, range: 80, origX: 700, emoji: "💀" });
  enemies.push({ x: 1300, y: H - 300, w: 24, h: 24, type: "deathEater", dir: -1, speed: 1.5, range: 90, origX: 1300, emoji: "💀" });
  enemies.push({ x: 1900, y: H - 340, w: 24, h: 24, type: "deathEater", dir: 1, speed: 1.6, range: 100, origX: 1900, emoji: "💀" });

  platforms.push({ x: 2200, y: H - 380, w: 120, h: 20, type: "finish", label: "🏛️ Ministry Arrival" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_5_8_VeilChamber(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Death Chamber entrance
  platforms.push({ x: 0, y: H - 40, w: 180, h: 40, type: "normal", color: "#2a2a3a", label: "🌀 Death Chamber" });

  // Stone amphitheatre seating — descending then ascending around the veil
  const seats = [
    { x: 200, y: H - 60, w: 80 }, { x: 320, y: H - 80, w: 70 },
    { x: 440, y: H - 100, w: 80 }, { x: 350, y: H - 140, w: 70 },
    { x: 220, y: H - 160, w: 80 },
  ];
  seats.forEach((s, i) => {
    platforms.push({ x: s.x, y: s.y, w: s.w, h: 14, type: "normal", color: "#3a3a4a", label: i === 0 ? "🪨 Seats" : "" });
  });

  // The Archway with the Veil — central hazard (don't fall in!)
  platforms.push({ x: 280, y: H - 30, w: 100, h: 8, type: "hazard", color: "#1a1a2a", label: "🌀 The Veil" });

  // Floating platforms around the chamber — whispers draw you
  const floating = [
    { x: 100, y: H - 200 }, { x: 300, y: H - 240 }, { x: 500, y: H - 220 },
    { x: 150, y: H - 300 }, { x: 400, y: H - 320 }, { x: 250, y: H - 380 },
    { x: 450, y: H - 400 }, { x: 150, y: H - 440 }, { x: 350, y: H - 480 },
  ];
  floating.forEach((f, i) => {
    platforms.push({
      x: f.x, y: f.y, w: 60, h: 12,
      type: i % 3 === 0 ? "disappearing" : "normal", timer: 0, visible: true,
      color: "#3a3a5a",
    });
  });

  // Death Eaters attacking from all sides
  enemies.push({ x: 150, y: H - 130, w: 22, h: 22, type: "deathEater", dir: 1, speed: 1.2, range: 70, origX: 150, emoji: "💀" });
  enemies.push({ x: 400, y: H - 260, w: 22, h: 22, type: "deathEater", dir: -1, speed: 1.3, range: 80, origX: 400, emoji: "💀" });
  enemies.push({ x: 200, y: H - 400, w: 24, h: 24, type: "deathEater", dir: 1, speed: 1.4, range: 70, origX: 200, emoji: "💀" });
  // Bellatrix
  enemies.push({ x: 350, y: H - 450, w: 26, h: 26, type: "bellatrix", dir: -1, speed: 1.6, range: 90, origX: 350, emoji: "🧙‍♀️" });

  platforms.push({ x: 250, y: H - 550, w: 120, h: 20, type: "finish", label: "🌀 Beyond the Veil" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_5_9_DumbledoresArmy(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Room of Requirement — DA training room
  platforms.push({ x: 0, y: H - 40, w: 500, h: 40, type: "normal", color: "#3a4a5a", label: "⚡ DA Training" });

  // Training stations — each teaches a different skill
  // Station 1: Disarming — wide platforms
  platforms.push({ x: 50, y: H - 100, w: 100, h: 14, type: "normal", color: "#4488ff", label: "⚡ Expelliarmus" });
  platforms.push({ x: 200, y: H - 130, w: 90, h: 14, type: "normal", color: "#5a6a7a" });
  platforms.push({ x: 350, y: H - 110, w: 100, h: 14, type: "normal", color: "#5a6a7a" });

  // Station 2: Shielding — moving platforms to dodge
  const shield1: Platform = { x: 100, y: H - 200, w: 70, h: 12, type: "moving", color: "#4488ff", label: "🛡️ Protego", origX: 100, origY: H - 200, moveDir: 1, moveRange: 50 };
  const shield2: Platform = { x: 300, y: H - 230, w: 70, h: 12, type: "moving", color: "#5a6a7a", origX: 300, origY: H - 230, moveDir: -1, moveRange: 40 };
  platforms.push(shield1, shield2);

  // Station 3: Patronus — disappearing platforms (concentration)
  platforms.push({ x: 50, y: H - 300, w: 80, h: 12, type: "disappearing", timer: 0, visible: true, color: "#88bbff", label: "✨ Patronus" });
  platforms.push({ x: 200, y: H - 340, w: 70, h: 12, type: "normal", color: "#5a6a7a" });
  platforms.push({ x: 350, y: H - 320, w: 80, h: 12, type: "disappearing", timer: 0, visible: true, color: "#88bbff" });

  // Station 4: Combat — final gauntlet
  platforms.push({ x: 100, y: H - 410, w: 70, h: 12, type: "normal", color: "#4488ff", label: "⚔️ Combat" });
  platforms.push({ x: 280, y: H - 440, w: 80, h: 12, type: "normal", color: "#5a6a7a" });
  platforms.push({ x: 150, y: H - 500, w: 70, h: 12, type: "normal", color: "#5a6a7a" });
  platforms.push({ x: 350, y: H - 530, w: 80, h: 12, type: "normal", color: "#5a6a7a" });

  // Training dummies at each station
  enemies.push({ x: 300, y: H - 128, w: 20, h: 20, type: "dummy", dir: 1, speed: 0.5, range: 40, origX: 300, emoji: "🎯" });
  enemies.push({ x: 200, y: H - 258, w: 20, h: 20, type: "dummy", dir: -1, speed: 0.7, range: 50, origX: 200, emoji: "🎯" });
  enemies.push({ x: 150, y: H - 368, w: 22, h: 22, type: "dummy", dir: 1, speed: 0.9, range: 60, origX: 150, emoji: "🎯" });
  enemies.push({ x: 300, y: H - 468, w: 24, h: 24, type: "dummy", dir: -1, speed: 1.0, range: 70, origX: 300, emoji: "🎯" });

  platforms.push({ x: 200, y: H - 600, w: 120, h: 20, type: "finish", label: "⚡ DA Trained!" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
}

// ─── WORLD 6 EXTRA LEVELS ────────────────────────

function gen_6_5_SlugClubParty(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Slughorn's office — festive decorations
  platforms.push({ x: 0, y: H - 40, w: 400, h: 40, type: "normal", color: "#4a5a4a", label: "🥂 Slug Club Party" });

  // Curtained alcoves along the sides
  platforms.push({ x: 30, y: H - 100, w: 70, h: 14, type: "normal", color: "#6a3a3a", label: "🪟 Alcove" });
  platforms.push({ x: 300, y: H - 110, w: 70, h: 14, type: "normal", color: "#6a3a3a", label: "🪟" });

  // Floating chandeliers and candles — swaying platforms
  const chandeliers = [
    { x: 100, y: H - 170, range: 30 }, { x: 250, y: H - 200, range: 40 },
    { x: 50, y: H - 260, range: 35 }, { x: 200, y: H - 300, range: 45 },
    { x: 330, y: H - 280, range: 30 }, { x: 130, y: H - 360, range: 40 },
    { x: 280, y: H - 400, range: 35 },
  ];
  chandeliers.forEach((c, i) => {
    const p: Platform = {
      x: c.x, y: c.y, w: 60, h: 12, type: "moving", color: "#8a7a3a",
      label: i % 2 === 0 ? "🕯️" : "🪔",
      origX: c.x, origY: c.y, moveDir: i % 2 === 0 ? 1 : -1, moveRange: c.range,
    };
    platforms.push(p);
  });

  // Punch bowl table
  platforms.push({ x: 150, y: H - 140, w: 100, h: 14, type: "normal", color: "#5a4a3a", label: "🍷 Punch" });

  // Flying candelabras and Filch gatecrashing
  enemies.push({ x: 180, y: H - 230, w: 20, h: 20, type: "candelabra", dir: 1, speed: 0.7, range: 60, origX: 180, emoji: "🕯️" });
  enemies.push({ x: 100, y: H - 340, w: 20, h: 20, type: "candelabra", dir: -1, speed: 0.8, range: 50, origX: 100, emoji: "🕯️" });
  enemies.push({ x: 300, y: H - 380, w: 22, h: 22, type: "filch", dir: -1, speed: 0.9, range: 70, origX: 300, emoji: "🧹" });

  platforms.push({ x: 170, y: H - 480, w: 120, h: 20, type: "finish", label: "🥂 Party Over" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
}

function gen_6_6_Sectumsempra(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Bathroom floor — aftermath of the duel
  platforms.push({ x: 0, y: H - 40, w: 400, h: 40, type: "normal", color: "#3a3a3a", label: "💧 Flooded Bathroom" });

  // Broken mirrors — reflective platforms
  platforms.push({ x: 50, y: H - 90, w: 60, h: 14, type: "normal", color: "#8a8aaa", label: "🪞" });
  platforms.push({ x: 200, y: H - 100, w: 55, h: 14, type: "normal", color: "#8a8aaa", label: "🪞" });
  platforms.push({ x: 330, y: H - 85, w: 60, h: 14, type: "normal", color: "#8a8aaa", label: "🪞" });

  // Rising water — slippery ice platforms going up
  for (let i = 0; i < 8; i++) {
    const side = i % 2 === 0 ? 30 + i * 20 : 250 - i * 15;
    platforms.push({
      x: side, y: H - 160 - i * 55, w: 70, h: 12,
      type: "ice", color: "#5a8aaa",
      label: i % 3 === 0 ? "💧" : "",
    });
  }

  // Cursed water drains — hazard areas
  platforms.push({ x: 150, y: H - 50, w: 80, h: 8, type: "hazard", color: "#882222", label: "🩸" });
  platforms.push({ x: 100, y: H - 300, w: 60, h: 8, type: "hazard", color: "#882222", label: "🩸" });

  // Draco (duelling) and Myrtle screaming
  enemies.push({ x: 250, y: H - 128, w: 24, h: 24, type: "wizard", dir: -1, speed: 1.3, range: 80, origX: 250, emoji: "⚔️" });
  enemies.push({ x: 150, y: H - 350, w: 20, h: 20, type: "myrtle", dir: 1, speed: 0.6, range: 60, origX: 150, emoji: "👻" });

  platforms.push({ x: 150, y: H - 620, w: 120, h: 20, type: "finish", label: "💧 Escape" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
}

function gen_6_7_PensieveMemories(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Dumbledore's office — the Pensieve
  platforms.push({ x: 0, y: H - 40, w: 160, h: 40, type: "normal", color: "#4a4a5a", label: "💭 Pensieve" });

  // Swirling silver memory platforms — each one a different memory
  const memories = [
    { x: 180, y: H - 100, label: "💭 Riddle" }, { x: 350, y: H - 140, label: "💭 Slughorn" },
    { x: 200, y: H - 200, label: "💭 Gaunt" }, { x: 400, y: H - 240, label: "💭 Diary" },
    { x: 150, y: H - 300, label: "💭 Hepzibah" }, { x: 350, y: H - 340, label: "💭 Cave" },
    { x: 200, y: H - 400, label: "💭 Hogwarts" }, { x: 400, y: H - 440, label: "💭 Ring" },
    { x: 150, y: H - 500, label: "💭 Locket" }, { x: 350, y: H - 540, label: "💭 Cup" },
  ];
  memories.forEach((m, i) => {
    const p: Platform = {
      x: m.x, y: m.y, w: 65, h: 12,
      type: "moving", color: "#8888cc",
      label: m.label, origX: m.x, origY: m.y,
      moveDir: i % 2 === 0 ? 1 : -1, moveRange: 40 + (i % 3) * 15,
    };
    platforms.push(p);
  });

  // Static connecting platforms
  platforms.push({ x: 280, y: H - 170, w: 50, h: 10, type: "normal", color: "#6a6a8a" });
  platforms.push({ x: 300, y: H - 270, w: 50, h: 10, type: "normal", color: "#6a6a8a" });
  platforms.push({ x: 280, y: H - 370, w: 50, h: 10, type: "normal", color: "#6a6a8a" });
  platforms.push({ x: 300, y: H - 470, w: 50, h: 10, type: "normal", color: "#6a6a8a" });

  // Memory echoes — ghostly figures from the past
  enemies.push({ x: 300, y: H - 170, w: 20, h: 20, type: "memoryEcho", dir: 1, speed: 0.6, range: 60, origX: 300, emoji: "👤" });
  enemies.push({ x: 200, y: H - 370, w: 22, h: 22, type: "memoryEcho", dir: -1, speed: 0.7, range: 50, origX: 200, emoji: "👤" });
  enemies.push({ x: 350, y: H - 500, w: 22, h: 22, type: "memoryEcho", dir: 1, speed: 0.8, range: 55, origX: 350, emoji: "👤" });

  platforms.push({ x: 220, y: H - 620, w: 120, h: 20, type: "finish", label: "💭 Memory Found" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_6_8_LightningTower(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Base of Astronomy Tower
  platforms.push({ x: 0, y: H - 40, w: 200, h: 40, type: "normal", color: "#3a3a4a", label: "🏰 Astronomy Tower" });

  // Spiral staircase — alternating sides going up
  const stairs = [
    { x: 50, y: H - 100 }, { x: 250, y: H - 150 }, { x: 80, y: H - 200 },
    { x: 230, y: H - 260 }, { x: 60, y: H - 320 }, { x: 240, y: H - 380 },
    { x: 70, y: H - 440 }, { x: 220, y: H - 500 }, { x: 80, y: H - 560 },
    { x: 230, y: H - 620 }, { x: 60, y: H - 680 }, { x: 240, y: H - 740 },
  ];
  stairs.forEach((s, i) => {
    platforms.push({
      x: s.x, y: s.y, w: 70, h: 14,
      type: i % 4 === 3 ? "disappearing" : "normal", timer: 0, visible: true,
      color: "#5a5a6a", label: i % 5 === 0 ? "🪜" : "",
    });
  });

  // Crumbling tower sections — moving platforms (the tower is under attack)
  const crumble1: Platform = { x: 150, y: H - 300, w: 60, h: 12, type: "moving", color: "#6a5a4a", origX: 150, origY: H - 300, moveDir: 1, moveRange: 40 };
  const crumble2: Platform = { x: 150, y: H - 540, w: 60, h: 12, type: "moving", color: "#6a5a4a", origX: 150, origY: H - 540, moveDir: -1, moveRange: 50 };
  platforms.push(crumble1, crumble2);

  // Lightning strike hazards
  platforms.push({ x: 160, y: H - 420, w: 15, h: 40, type: "hazard", color: "#ffcc00", label: "⚡" });
  platforms.push({ x: 140, y: H - 660, w: 15, h: 40, type: "hazard", color: "#ffcc00", label: "⚡" });

  // Death Eaters climbing the tower
  enemies.push({ x: 180, y: H - 230, w: 22, h: 22, type: "deathEater", dir: 1, speed: 1.0, range: 60, origX: 180, emoji: "💀" });
  enemies.push({ x: 150, y: H - 460, w: 22, h: 22, type: "deathEater", dir: -1, speed: 1.2, range: 70, origX: 150, emoji: "💀" });
  enemies.push({ x: 180, y: H - 700, w: 24, h: 24, type: "deathEater", dir: 1, speed: 1.4, range: 80, origX: 180, emoji: "💀" });

  platforms.push({ x: 120, y: H - 810, w: 120, h: 20, type: "finish", label: "⚡ Tower Top" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
}

function gen_6_9_FelixFelicis(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Start — potion takes effect
  platforms.push({ x: 0, y: H - 40, w: 160, h: 40, type: "normal", color: "#5a5a2a", label: "🍀 Lucky!" });

  // Golden lucky path — wide, generous platforms (everything goes right!)
  const luckyPath = [
    { x: 180, y: H - 70 }, { x: 340, y: H - 80 }, { x: 500, y: H - 65 },
    { x: 660, y: H - 85 }, { x: 820, y: H - 70 }, { x: 980, y: H - 90 },
    { x: 1140, y: H - 75 }, { x: 1300, y: H - 85 }, { x: 1460, y: H - 70 },
    { x: 1620, y: H - 90 }, { x: 1780, y: H - 80 }, { x: 1940, y: H - 75 },
  ];
  luckyPath.forEach((p, i) => {
    platforms.push({
      x: p.x, y: p.y, w: 80, h: 14, type: "normal",
      color: i % 2 === 0 ? "#ffdd44" : "#ccaa33",
      label: i % 3 === 0 ? "🍀" : i % 3 === 1 ? "✨" : "",
    });
  });

  // Higher golden platforms for bonus path
  for (let i = 0; i < 6; i++) {
    platforms.push({
      x: 300 + i * 300, y: H - 150 - (i % 2) * 30, w: 60, h: 12,
      type: "normal", color: "#ffcc00", label: "⭐",
    });
  }

  // Speed run feel — no enemies, just fast platforming with generous platforms
  // The luck wears off at the end — platforms get trickier
  platforms.push({ x: 2100, y: H - 100, w: 50, h: 12, type: "disappearing", timer: 0, visible: true, color: "#aa8833", label: "😰" });
  platforms.push({ x: 2220, y: H - 130, w: 45, h: 12, type: "disappearing", timer: 0, visible: true, color: "#887733", label: "😰" });

  platforms.push({ x: 2350, y: H - 120, w: 120, h: 20, type: "finish", label: "🍀 Liquid Luck!" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

// ─── WORLD 7 EXTRA LEVELS ────────────────────────

function gen_7_5_GringottsVault(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Bank lobby
  platforms.push({ x: 0, y: H - 40, w: 160, h: 40, type: "normal", color: "#5a4a3a", label: "🏦 Gringotts" });

  // Mine cart track — fast horizontal then descending
  for (let i = 0; i < 6; i++) {
    platforms.push({
      x: 180 + i * 120, y: H - 60 - i * 15, w: 80, h: 14,
      type: "normal", color: "#6a5a3a", label: i === 0 ? "🛤️ Cart!" : "",
    });
  }

  // Deep vault descent — zigzag
  const vaultPath = [
    { x: 700, y: H - 170 }, { x: 550, y: H - 230 }, { x: 400, y: H - 290 },
    { x: 550, y: H - 350 }, { x: 700, y: H - 410 }, { x: 550, y: H - 470 },
    { x: 400, y: H - 530 },
  ];
  vaultPath.forEach((v, i) => {
    platforms.push({
      x: v.x, y: v.y, w: 70, h: 14,
      type: i % 3 === 0 ? "disappearing" : "normal", timer: 0, visible: true,
      color: "#8a7a5a", label: i % 2 === 0 ? "💰" : "",
    });
  });

  // Thief's Downfall — waterfall hazard
  platforms.push({ x: 620, y: H - 200, w: 20, h: 60, type: "hazard", color: "#4488cc", label: "💧 Downfall" });

  // Cursed treasure that multiplies — hazard platforms
  platforms.push({ x: 450, y: H - 260, w: 50, h: 8, type: "hazard", color: "#ffaa00", label: "🏆 Cursed!" });
  platforms.push({ x: 650, y: H - 380, w: 50, h: 8, type: "hazard", color: "#ffaa00", label: "🏆 Cursed!" });

  // Goblins guarding + dragon at the bottom
  enemies.push({ x: 600, y: H - 198, w: 20, h: 20, type: "goblin", dir: 1, speed: 1.0, range: 50, origX: 600, emoji: "👺" });
  enemies.push({ x: 500, y: H - 378, w: 22, h: 22, type: "goblin", dir: -1, speed: 1.1, range: 60, origX: 500, emoji: "👺" });
  enemies.push({ x: 550, y: H - 500, w: 30, h: 30, type: "dragon", dir: 1, speed: 0.5, range: 80, origX: 550, emoji: "🐉" });

  platforms.push({ x: 450, y: H - 610, w: 120, h: 20, type: "finish", label: "🐉 Ride the Dragon!" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_7_6_RoomOfHiddenThings(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Towering labyrinth of centuries of junk
  platforms.push({ x: 0, y: H - 40, w: 180, h: 40, type: "normal", color: "#4a4a4a", label: "📦 Room of Hidden Things" });

  // Piles of junk — irregular, varied sizes
  const junk = [
    { x: 200, y: H - 70, w: 90, label: "📦 Crate" }, { x: 350, y: H - 90, w: 60, label: "🪑" },
    { x: 460, y: H - 60, w: 80, label: "📚" }, { x: 150, y: H - 140, w: 70, label: "🧳" },
    { x: 320, y: H - 170, w: 85, label: "🪞" }, { x: 480, y: H - 150, w: 65, label: "📦" },
    { x: 100, y: H - 220, w: 75, label: "🧹" }, { x: 280, y: H - 260, w: 90, label: "🏺" },
    { x: 430, y: H - 240, w: 70, label: "📦" }, { x: 200, y: H - 320, w: 80, label: "🪑" },
    { x: 380, y: H - 350, w: 65, label: "🧳" }, { x: 120, y: H - 390, w: 85, label: "📚" },
    { x: 300, y: H - 430, w: 75, label: "📦" }, { x: 450, y: H - 410, w: 70, label: "🪞" },
  ];
  junk.forEach(j => {
    platforms.push({ x: j.x, y: j.y, w: j.w, h: 14, type: "normal", color: "#6a5a4a", label: j.label });
  });

  // The Diadem — hidden on a high platform
  platforms.push({ x: 250, y: H - 500, w: 60, h: 12, type: "normal", color: "#aaaacc", label: "👑 Diadem" });

  // Fiendfyre — cursed fire chasing from below (fire enemies)
  enemies.push({ x: 180, y: H - 100, w: 26, h: 26, type: "fiendfyre", dir: 1, speed: 1.4, range: 100, origX: 180, emoji: "🔥" });
  enemies.push({ x: 400, y: H - 200, w: 28, h: 28, type: "fiendfyre", dir: -1, speed: 1.5, range: 110, origX: 400, emoji: "🔥" });
  enemies.push({ x: 250, y: H - 350, w: 30, h: 30, type: "fiendfyre", dir: 1, speed: 1.6, range: 120, origX: 250, emoji: "🔥" });

  platforms.push({ x: 200, y: H - 570, w: 120, h: 20, type: "finish", label: "👑 Diadem Found" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_7_7_ForbiddenForestWalk(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // The solemn walk — each step heavier
  platforms.push({ x: 0, y: H - 40, w: 200, h: 40, type: "normal", color: "#1a2a1a", label: "🌲 The Forest" });

  // Long, atmospheric forest path — mostly horizontal, gentle
  const forestPath = [
    { x: 220, y: H - 55, label: "🌲" }, { x: 400, y: H - 50, label: "" },
    { x: 580, y: H - 60, label: "🌲" }, { x: 760, y: H - 50, label: "" },
    { x: 940, y: H - 55, label: "🌲" }, { x: 1120, y: H - 60, label: "" },
    { x: 1300, y: H - 50, label: "🌲" }, { x: 1480, y: H - 55, label: "" },
    { x: 1660, y: H - 60, label: "🌲" }, { x: 1840, y: H - 50, label: "" },
  ];
  forestPath.forEach(p => {
    platforms.push({ x: p.x, y: p.y, w: 80, h: 14, type: "normal", color: "#2a3a1a", label: p.label });
  });

  // Ghostly companions walk alongside — slow, ethereal (not really threats)
  // James
  enemies.push({ x: 300, y: H - 78, w: 20, h: 20, type: "ghostCompanion", dir: 1, speed: 0.3, range: 30, origX: 300, emoji: "👤" });
  // Lily
  enemies.push({ x: 700, y: H - 78, w: 20, h: 20, type: "ghostCompanion", dir: -1, speed: 0.3, range: 30, origX: 700, emoji: "👤" });
  // Sirius
  enemies.push({ x: 1100, y: H - 78, w: 20, h: 20, type: "ghostCompanion", dir: 1, speed: 0.3, range: 30, origX: 1100, emoji: "👤" });
  // Lupin
  enemies.push({ x: 1500, y: H - 78, w: 20, h: 20, type: "ghostCompanion", dir: -1, speed: 0.3, range: 30, origX: 1500, emoji: "👤" });

  // The clearing — Resurrection Stone
  platforms.push({ x: 2050, y: H - 50, w: 140, h: 20, type: "finish", label: "💎 Resurrection Stone" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_7_8_ElderWandChase(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Shattered Hogwarts corridor — the final chase
  platforms.push({ x: 0, y: H - 40, w: 160, h: 40, type: "normal", color: "#4a3a3a", label: "🏰 Hogwarts Ruins" });

  // Ruined corridor — crumbling platforms, fast-paced
  for (let i = 0; i < 12; i++) {
    platforms.push({
      x: 180 + i * 130, y: H - 60 - (i % 3) * 25, w: 65, h: 14,
      type: i % 4 === 0 ? "disappearing" : i % 3 === 0 ? "moving" : "normal",
      timer: 0, visible: true, color: "#5a4a3a",
      origX: 180 + i * 130, origY: H - 60 - (i % 3) * 25,
      moveDir: i % 2 === 0 ? 1 : -1, moveRange: 40,
      label: i % 5 === 0 ? "💥" : "",
    });
  }

  // Falling debris hazards
  platforms.push({ x: 500, y: H - 30, w: 60, h: 8, type: "hazard", color: "#5a3a2a", label: "🪨" });
  platforms.push({ x: 1000, y: H - 30, w: 60, h: 8, type: "hazard", color: "#5a3a2a", label: "🪨" });
  platforms.push({ x: 1500, y: H - 30, w: 60, h: 8, type: "hazard", color: "#5a3a2a", label: "🪨" });

  // Living statues defending the castle (on your side but in the way)
  enemies.push({ x: 400, y: H - 88, w: 22, h: 22, type: "statue", dir: 1, speed: 0.8, range: 50, origX: 400, emoji: "🗡️" });
  // Death Eaters chasing
  enemies.push({ x: 800, y: H - 98, w: 24, h: 24, type: "deathEater", dir: -1, speed: 1.5, range: 80, origX: 800, emoji: "💀" });
  enemies.push({ x: 1200, y: H - 88, w: 24, h: 24, type: "deathEater", dir: 1, speed: 1.7, range: 90, origX: 1200, emoji: "💀" });
  enemies.push({ x: 1600, y: H - 108, w: 26, h: 26, type: "deathEater", dir: -1, speed: 1.8, range: 100, origX: 1600, emoji: "💀" });

  platforms.push({ x: 1800, y: H - 100, w: 120, h: 20, type: "finish", label: "🪄 Elder Wand" });
  return { platforms, enemies, startX: 40, startY: H - 80 };
}

function gen_7_9_BattleOfHogwarts(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  // Great Hall entrance — the final battle
  platforms.push({ x: 0, y: H - 40, w: 500, h: 40, type: "normal", color: "#3a3a3a", label: "⚡ The Great Hall" });

  // Ruined castle interior — chaotic mix of everything
  // Fallen pillars
  platforms.push({ x: 100, y: H - 90, w: 40, h: 50, type: "normal", color: "#5a5a5a", label: "🏛️" });
  platforms.push({ x: 350, y: H - 100, w: 40, h: 60, type: "normal", color: "#5a5a5a", label: "🏛️" });

  // House table debris — platforms at varied heights
  const debris = [
    { x: 50, y: H - 130, type: "normal" as const, label: "🟥" },
    { x: 200, y: H - 150, type: "moving" as const, label: "🟨" },
    { x: 350, y: H - 140, type: "normal" as const, label: "🟦" },
    { x: 100, y: H - 210, type: "disappearing" as const, label: "🟩" },
    { x: 280, y: H - 240, type: "normal" as const, label: "" },
    { x: 420, y: H - 220, type: "moving" as const, label: "" },
    { x: 50, y: H - 300, type: "normal" as const, label: "💥" },
    { x: 200, y: H - 330, type: "ice" as const, label: "" },
    { x: 380, y: H - 310, type: "normal" as const, label: "" },
    { x: 130, y: H - 390, type: "disappearing" as const, label: "💥" },
    { x: 300, y: H - 420, type: "normal" as const, label: "" },
    { x: 450, y: H - 400, type: "moving" as const, label: "" },
    { x: 80, y: H - 480, type: "normal" as const, label: "💥" },
    { x: 250, y: H - 510, type: "normal" as const, label: "" },
    { x: 400, y: H - 490, type: "disappearing" as const, label: "" },
    { x: 180, y: H - 570, type: "normal" as const, label: "" },
    { x: 350, y: H - 600, type: "normal" as const, label: "" },
  ];
  debris.forEach(d => {
    platforms.push({
      x: d.x, y: d.y, w: 65, h: 12, type: d.type,
      moveRange: 50, timer: 0, visible: true,
      color: "#5a4a3a", label: d.label,
    });
  });

  // Death Eaters, giants, living statues
  enemies.push({ x: 150, y: H - 168, w: 22, h: 22, type: "deathEater", dir: 1, speed: 1.0, range: 60, origX: 150, emoji: "💀" });
  enemies.push({ x: 350, y: H - 268, w: 28, h: 28, type: "giant", dir: -1, speed: 0.6, range: 80, origX: 350, emoji: "🗿" });
  enemies.push({ x: 100, y: H - 418, w: 22, h: 22, type: "deathEater", dir: 1, speed: 1.2, range: 70, origX: 100, emoji: "💀" });
  enemies.push({ x: 300, y: H - 518, w: 24, h: 24, type: "statue", dir: -1, speed: 0.8, range: 50, origX: 300, emoji: "🗡️" });
  enemies.push({ x: 200, y: H - 578, w: 26, h: 26, type: "deathEater", dir: 1, speed: 1.4, range: 80, origX: 200, emoji: "💀" });

  platforms.push({ x: 200, y: H - 680, w: 140, h: 20, type: "finish", label: "⚡ Victory!" });
  return { platforms, enemies, startX: 60, startY: H - 80 };
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
