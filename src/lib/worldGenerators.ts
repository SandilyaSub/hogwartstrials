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

  // Flying car level - auto-scrolling, dodge obstacles
  // We place obstacles spread across a long level; the car auto-scrolls right
  // Player only moves up/down to dodge

  // Invisible floor and ceiling boundaries
  platforms.push({ x: 0, y: H - 30, w: 8000, h: 30, type: "hazard", color: "transparent" });
  platforms.push({ x: 0, y: 0, w: 8000, h: 10, type: "hazard", color: "transparent" });

  // Clouds to dodge (hazards placed at various heights)
  for (let i = 0; i < 40; i++) {
    const x = 400 + i * 180 + (i % 3) * 50;
    const y = 40 + ((i * 137) % (H - 120));
    const w = 50 + (i % 3) * 20;
    const h = 20 + (i % 2) * 10;
    platforms.push({
      x, y, w, h, type: "hazard",
      color: "#888", label: "☁️",
    });
  }

  // Birds to dodge
  for (let i = 0; i < 15; i++) {
    const x = 600 + i * 450;
    const y = 60 + ((i * 211) % (H - 140));
    enemies.push({
      x, y, w: 22, h: 22, type: "bird",
      dir: -1, speed: 1.5 + (i % 3) * 0.5, range: 200,
      origX: x, emoji: "🦅",
    });
  }

  // Whomping Willow tree tops at intervals
  for (let i = 0; i < 6; i++) {
    const x = 800 + i * 1200;
    platforms.push({
      x, y: H - 100, w: 60, h: 70, type: "hazard",
      color: "#3a5a2a", label: "🌳",
    });
  }

  // Hogwarts castle - the finish line
  platforms.push({ x: 7600, y: H / 2 - 30, w: 120, h: 60, type: "finish", label: "🏰 Hogwarts" });

  return { platforms, enemies, startX: 60, startY: H / 2, flyingCar: true };
}

function gen_2_3_PipeBalance(H: number): LevelData {
  const platforms: Platform[] = [];
  const enemies: Enemy[] = [];

  platforms.push({ x: 0, y: H - 40, w: 100, h: 40, type: "normal", color: "#2a3a2a" });

  // Narrow pipes to balance across
  for (let i = 0; i < 20; i++) {
    const x = 120 + i * 90;
    const y = H - 60 - Math.sin(i * 0.5) * 30 - (i * 5);
    const narrow = 30 + (i % 3) * 10; // Narrow pipes!
    platforms.push({
      x, y, w: narrow, h: 12, type: "normal",
      color: "#4a5a4a", // green pipe color
    });

    // Dripping water hazards
    if (i % 4 === 2) {
      platforms.push({ x: x + 5, y: y - 40, w: 20, h: 8, type: "hazard", color: "#2a4a6a" });
    }
  }

  // Spiders in the pipes
  enemies.push({ x: 400, y: H - 120, w: 18, h: 18, type: "spider", dir: 1, speed: 0.6, range: 40, origX: 400, emoji: "🕷️" });
  enemies.push({ x: 900, y: H - 160, w: 18, h: 18, type: "spider", dir: -1, speed: 0.8, range: 50, origX: 900, emoji: "🕷️" });
  enemies.push({ x: 1400, y: H - 200, w: 20, h: 20, type: "spider", dir: 1, speed: 1.0, range: 60, origX: 1400, emoji: "🕷️" });

  platforms.push({ x: 1920, y: H - 180, w: 80, h: 20, type: "finish", label: "🚪 Exit" });
  return { platforms, enemies, startX: 30, startY: H - 80, darkLevel: true };
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

  // Disappearing/reappearing platforms (time-shifted)
  for (let i = 0; i < 18; i++) {
    const x = 140 + i * 100;
    const y = H - 80 - Math.sin(i * 0.6) * 50 - i * 6;
    const isTimeShift = i % 3 === 0;
    platforms.push({
      x, y, w: 60 + (i % 2) * 20, h: 14,
      type: isTimeShift ? "disappearing" : "normal",
      timer: 0, visible: true,
      color: isTimeShift ? "#8a6aaa" : undefined,
      label: isTimeShift ? "⏳" : "",
    });
  }

  enemies.push({ x: 500, y: H - 160, w: 20, h: 20, type: "dementor", dir: 1, speed: 0.5, range: 80, origX: 500, emoji: "👻" });
  enemies.push({ x: 1200, y: H - 220, w: 20, h: 20, type: "dementor", dir: -1, speed: 0.7, range: 60, origX: 1200, emoji: "👻" });

  platforms.push({ x: 1940, y: H - 240, w: 80, h: 20, type: "finish", label: "⏰ Time Turner" });
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

  // Forest floor with tree root platforms
  for (let i = 0; i < 16; i++) {
    const x = 160 + i * 110;
    const y = H - 50 - Math.random() * 40 - (i % 3) * 30;
    platforms.push({
      x, y, w: 60 + Math.random() * 30, h: 14,
      type: "normal", color: "#3a2a1a",
    });
  }

  // Tree branch platforms (higher)
  for (let i = 0; i < 8; i++) {
    platforms.push({
      x: 200 + i * 220, y: H - 140 - (i % 2) * 40,
      w: 50, h: 10, type: "normal", color: "#4a3a1a", label: "🌿",
    });
  }

  // Spiders and centaurs
  enemies.push({ x: 400, y: H - 78, w: 22, h: 22, type: "spider", dir: 1, speed: 0.8, range: 60, origX: 400, emoji: "🕷️" });
  enemies.push({ x: 800, y: H - 78, w: 24, h: 24, type: "centaur", dir: -1, speed: 1.2, range: 80, origX: 800, emoji: "🐴" });
  enemies.push({ x: 1300, y: H - 78, w: 22, h: 22, type: "spider", dir: 1, speed: 1.0, range: 70, origX: 1300, emoji: "🕷️" });

  platforms.push({ x: 1940, y: H - 100, w: 80, h: 20, type: "finish", label: "🌙 Clearing" });
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

  // Rocky arena with fire hazards
  for (let i = 0; i < 14; i++) {
    const x = 140 + i * 120;
    const y = H - 70 - (i % 3) * 30 - i * 5;
    const isFire = i % 5 === 3;
    platforms.push({
      x, y, w: 65 + (i % 2) * 15, h: 14,
      type: isFire ? "hazard" : "normal",
      color: isFire ? "#aa3a0a" : "#5a4a3a",
      label: isFire ? "🔥" : "",
    });
  }

  // Dragon fire breath enemies
  enemies.push({ x: 500, y: H - 140, w: 28, h: 28, type: "dragon", dir: 1, speed: 0.5, range: 100, origX: 500, emoji: "🐉" });
  enemies.push({ x: 1100, y: H - 200, w: 28, h: 28, type: "dragon", dir: -1, speed: 0.7, range: 80, origX: 1100, emoji: "🐉" });

  platforms.push({ x: 1820, y: H - 200, w: 80, h: 20, type: "finish", label: "🥚 Golden Egg" });
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

  // Fast-paced escape with narrow platforms and many enemies
  for (let i = 0; i < 22; i++) {
    const x = 110 + i * 80;
    const y = H - 60 - (i % 4) * 20 - i * 3;
    platforms.push({
      x, y, w: 40 + (i % 2) * 15, h: 12,
      type: i % 3 === 0 ? "disappearing" : "normal",
      timer: 0, visible: true,
      color: "#3a2a2a",
    });
  }

  // Death Eaters chasing
  for (let i = 0; i < 5; i++) {
    enemies.push({
      x: 200 + i * 350, y: H - 90 - i * 10, w: 22, h: 22,
      type: "deathEater", dir: 1, speed: 1.0 + i * 0.2, range: 80, origX: 200 + i * 350, emoji: "💀",
    });
  }

  platforms.push({ x: 1880, y: H - 160, w: 80, h: 20, type: "finish", label: "🏠 Safe House" });
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

// ─── Export lookup ────────────────────────────

export function getWorldLevelGenerator(worldId: number, levelIdx: number, H: number): LevelData | null {
  const generators: Record<string, (H: number) => LevelData> = {
    "2-0": gen_2_1_DiagonAlley,
    "2-1": gen_2_2_FlyingEscape,
    "2-2": gen_2_3_PipeBalance,
    "2-3": gen_2_4_ChamberDoors,
    "3-0": gen_3_1_TimePlatforms,
    "3-1": gen_3_2_ClockTower,
    "3-2": gen_3_3_ForestRun,
    "3-3": gen_3_4_IceLake,
    "4-0": gen_4_1_DragonArena,
    "4-1": gen_4_2_CliffJumps,
    "4-2": gen_4_3_UnderwaterMaze,
    "4-3": gen_4_4_Graveyard,
    "5-0": gen_5_1_MinistryHall,
    "5-1": gen_5_2_ProphecyRoom,
    "5-2": gen_5_3_TrainingPuzzles,
    "5-3": gen_5_4_ChaosCorridor,
    "6-0": gen_6_1_PotionPuzzle,
    "6-1": gen_6_2_TowerJumps,
    "6-2": gen_6_3_DarkCorridor,
    "6-3": gen_6_4_InferiLake,
    "7-0": gen_7_1_EscapeRun,
    "7-1": gen_7_2_RuinedHogwarts,
    "7-2": gen_7_3_HardFlying,
    "7-3": gen_7_4_FinalClimb,
  };

  const key = `${worldId}-${levelIdx}`;
  const gen = generators[key];
  return gen ? gen(H) : null;
}
