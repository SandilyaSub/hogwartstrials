// 3D Level Generator - converts level concepts to 3D obby platforms
import { WORLDS } from "@/lib/gameData";
import { getWorldBoss } from "@/lib/levelGenerator";
import type { Platform3D, Enemy3D, Coin3D, LevelData3D, LevelTheme3D, BossData3D } from "./types";

let idCounter = 0;
const uid = () => `obj_${idCounter++}`;

// Theme per world
function getTheme3D(worldId: number, levelIdx: number): LevelTheme3D {
  const themes: Record<number, LevelTheme3D> = {
    0: { // Tutorial
      skyColor: "#1a1a3a", fogColor: "#1a1a3a", fogDensity: 0.008,
      ambientColor: "#8888cc", directionalColor: "#ffffff",
      platformColor: "#6a5a4a", groundColor: "#2a2a1a",
    },
    1: {
      skyColor: "#050a14", fogColor: "#0a1525", fogDensity: 0.012,
      ambientColor: "#5555aa", directionalColor: "#aaaaff",
      platformColor: "#4a3a2a", groundColor: "#1a1a0a",
    },
    2: {
      skyColor: "#0a1a0a", fogColor: "#0a2a1a", fogDensity: 0.01,
      ambientColor: "#44aa44", directionalColor: "#88ff88",
      platformColor: "#2a4a2a", groundColor: "#0a1a0a",
    },
    3: {
      skyColor: "#10081a", fogColor: "#1a1030", fogDensity: 0.015,
      ambientColor: "#8855aa", directionalColor: "#cc88ff",
      platformColor: "#5a4a6a", groundColor: "#1a0a2a",
    },
    4: {
      skyColor: "#1a0a00", fogColor: "#2a1505", fogDensity: 0.01,
      ambientColor: "#aa6633", directionalColor: "#ffaa44",
      platformColor: "#5a3a1a", groundColor: "#2a1a0a",
    },
    5: {
      skyColor: "#080810", fogColor: "#10101a", fogDensity: 0.012,
      ambientColor: "#4455aa", directionalColor: "#6688ff",
      platformColor: "#3a3a4a", groundColor: "#0a0a1a",
    },
    6: {
      skyColor: "#050a0a", fogColor: "#0a1515", fogDensity: 0.014,
      ambientColor: "#33aa88", directionalColor: "#44ddaa",
      platformColor: "#2a4a4a", groundColor: "#0a1a1a",
    },
    7: {
      skyColor: "#100505", fogColor: "#1a0a0a", fogDensity: 0.015,
      ambientColor: "#aa3333", directionalColor: "#ff4444",
      platformColor: "#4a2a2a", groundColor: "#1a0a0a",
    },
  };
  return themes[worldId] || themes[1];
}

// Generate platforms in an obby (obstacle course) style - forward along Z axis
export function generateLevel3D(worldId: number, levelIdx: number): LevelData3D {
  idCounter = 0;
  const isBoss = levelIdx === 4;
  const theme = getTheme3D(worldId, levelIdx);
  const difficulty = (worldId - 1) * 5 + levelIdx;

  if (isBoss) {
    return generateBossArena3D(worldId, theme);
  }

  const platforms: Platform3D[] = [];
  const enemies: Enemy3D[] = [];
  const coins: Coin3D[] = [];

  // Start platform (large, safe)
  platforms.push({
    id: uid(), position: [0, 0, 0], size: [6, 1, 6],
    type: "normal", color: "#5a5a3a", label: "START",
  });

  // Generate obby path
  const numSegments = 15 + Math.min(difficulty * 2, 20);
  let lastX = 0, lastY = 0, lastZ = 0;

  for (let i = 0; i < numSegments; i++) {
    // Vary direction: mostly forward (Z), sometimes sideways (X), sometimes up (Y)
    const dirChoice = Math.random();
    let dx = 0, dy = 0, dz = 0;

    if (dirChoice < 0.5) {
      // Forward
      dz = -(3 + Math.random() * (2 + difficulty * 0.3));
      dx = (Math.random() - 0.5) * 4;
    } else if (dirChoice < 0.75) {
      // Sideways
      dx = (Math.random() > 0.5 ? 1 : -1) * (3 + Math.random() * 2);
      dz = -(1 + Math.random() * 2);
    } else {
      // Upward
      dy = 1 + Math.random() * 2;
      dz = -(2 + Math.random() * 2);
    }

    const nx = lastX + dx;
    const ny = Math.max(0, lastY + dy);
    const nz = lastZ + dz;

    // Platform width varies
    const pw = 1.5 + Math.random() * 2.5 - difficulty * 0.05;
    const pd = 1.5 + Math.random() * 2 - difficulty * 0.05;

    // Platform type based on difficulty and randomness
    let type: Platform3D["type"] = "normal";
    const roll = Math.random();
    if (difficulty > 3 && roll < 0.15) type = "moving";
    else if (difficulty > 6 && roll < 0.25) type = "disappearing";
    else if (difficulty > 10 && roll < 0.3) type = "hazard";

    const plat: Platform3D = {
      id: uid(),
      position: [nx, ny, nz],
      size: [Math.max(1.2, pw), 0.5, Math.max(1.2, pd)],
      type,
      visible: true,
    };

    if (type === "moving") {
      plat.moveAxis = Math.random() > 0.5 ? "x" : "z";
      plat.moveRange = 2 + Math.random() * 3;
      plat.moveSpeed = 0.5 + Math.random() * 1;
    }
    if (type === "disappearing") {
      plat.timer = 0;
    }

    platforms.push(plat);

    // Add coins above some platforms
    if (i % 3 === 0) {
      coins.push({
        id: uid(),
        position: [nx, ny + 2, nz],
        collected: false,
      });
    }

    // Add enemies on some platforms
    if (difficulty > 2 && Math.random() < 0.12 + difficulty * 0.01 && type === "normal") {
      const enemyTypes = ["spider", "ghost", "troll", "dementor"];
      const emojis: Record<string, string> = { spider: "🕷️", ghost: "👻", troll: "🧌", dementor: "💀" };
      const et = enemyTypes[Math.floor(Math.random() * Math.min(enemyTypes.length, 2 + Math.floor(worldId / 2)))];
      enemies.push({
        id: uid(),
        position: [nx, ny + 1.5, nz],
        size: [1, 1, 1],
        type: et,
        emoji: emojis[et],
        moveAxis: Math.random() > 0.5 ? "x" : "z",
        speed: 0.5 + Math.random() * difficulty * 0.1,
        range: 2 + Math.random() * 2,
        origPos: [nx, ny + 1.5, nz],
      });
    }

    // Add themed obstacles based on world
    if (worldId === 1 && levelIdx === 1 && i % 4 === 0) {
      // Moving staircases - add extra moving platforms
      for (let s = 0; s < 3; s++) {
        platforms.push({
          id: uid(),
          position: [nx + s * 0.8, ny + s * 0.6, nz - s * 0.8],
          size: [1.5, 0.3, 1.5],
          type: "moving",
          moveAxis: "x",
          moveRange: 2,
          moveSpeed: 0.7,
          color: "#5a5a6a",
        });
      }
    }

    lastX = nx;
    lastY = ny;
    lastZ = nz;
  }

  // Finish platform
  platforms.push({
    id: uid(),
    position: [lastX, lastY, lastZ - 5],
    size: [5, 1, 5],
    type: "finish",
    color: "#c8a020",
    label: "⭐ FINISH",
  });

  return {
    platforms, enemies, coins,
    startPos: [0, 2, 0],
    theme,
    specialMode: worldId === 1 && levelIdx === 2 ? "dark" : undefined,
  };
}

function generateBossArena3D(worldId: number, theme: LevelTheme3D): LevelData3D {
  const boss2d = getWorldBoss(worldId);
  const platforms: Platform3D[] = [];
  const coins: Coin3D[] = [];

  // Large flat arena
  platforms.push({
    id: uid(), position: [0, 0, -10], size: [20, 1, 20],
    type: "normal", color: "#3a3a3a",
  });

  // Dodge platforms
  for (let i = 0; i < 4; i++) {
    platforms.push({
      id: uid(),
      position: [-6 + i * 4, 2 + (i % 2), -10 + (i % 2) * 4],
      size: [2.5, 0.5, 2.5],
      type: "normal",
    });
  }

  const boss: BossData3D = {
    name: boss2d.name,
    emoji: boss2d.emoji,
    maxHp: boss2d.maxHp,
    attackSpeed: boss2d.attackSpeed,
    projectileSpeed: boss2d.projectileSpeed,
    color: boss2d.color,
  };

  return {
    platforms, enemies: [], coins,
    startPos: [0, 2, 0],
    theme,
    specialMode: "boss",
    boss,
  };
}

// Tutorial level generator
export function generateTutorialLevel(): LevelData3D {
  idCounter = 0;
  const theme = getTheme3D(0, 0);
  const platforms: Platform3D[] = [];
  const enemies: Enemy3D[] = [];
  const coins: Coin3D[] = [];

  // Section 1: Welcome area - wide safe platform
  platforms.push({
    id: uid(), position: [0, 0, 0], size: [8, 1, 8],
    type: "normal", color: "#5a4a3a", label: "Welcome to Hogwarts!",
  });

  // Section 2: Movement practice - straight path
  for (let i = 0; i < 5; i++) {
    platforms.push({
      id: uid(), position: [0, 0, -(8 + i * 4)], size: [3, 0.5, 3],
      type: "normal", color: "#4a4a5a",
    });
  }

  // Section 3: Jump practice - gaps between platforms
  const jumpStart = -30;
  for (let i = 0; i < 4; i++) {
    platforms.push({
      id: uid(), position: [(i % 2) * 3, i * 0.5, jumpStart - i * 5], size: [2.5, 0.5, 2.5],
      type: "normal", color: "#5a5a3a",
    });
  }

  // Section 4: Coins to collect
  const coinSection = jumpStart - 25;
  platforms.push({
    id: uid(), position: [0, 2, coinSection], size: [6, 1, 8],
    type: "normal", color: "#4a3a2a",
  });
  for (let i = 0; i < 5; i++) {
    coins.push({
      id: uid(),
      position: [-2 + i, 4, coinSection - 1 + (i % 2)],
      collected: false,
    });
  }

  // Section 5: Moving platform
  const movingSection = coinSection - 12;
  platforms.push({
    id: uid(), position: [0, 2, movingSection], size: [3, 0.5, 3],
    type: "moving", moveAxis: "x", moveRange: 3, moveSpeed: 1,
    color: "#3a4a6a",
  });
  platforms.push({
    id: uid(), position: [0, 2, movingSection - 6], size: [3, 0.5, 3],
    type: "normal",
  });

  // Section 6: Enemy - a slow spider to practice avoiding
  const enemySection = movingSection - 16;
  platforms.push({
    id: uid(), position: [0, 2, enemySection], size: [8, 1, 8],
    type: "normal", color: "#3a3a2a",
  });
  enemies.push({
    id: uid(),
    position: [0, 3.5, enemySection],
    size: [1, 1, 1],
    type: "spider",
    emoji: "🕷️",
    moveAxis: "x",
    speed: 0.5,
    range: 3,
    origPos: [0, 3.5, enemySection],
  });

  // Section 7: Disappearing platform
  const disappearSection = enemySection - 12;
  platforms.push({
    id: uid(), position: [-2, 2, disappearSection], size: [2, 0.5, 2],
    type: "disappearing", color: "#8a6aaa", timer: 0, visible: true,
  });
  platforms.push({
    id: uid(), position: [2, 2, disappearSection - 4], size: [2, 0.5, 2],
    type: "disappearing", color: "#8a6aaa", timer: 0, visible: true,
  });
  platforms.push({
    id: uid(), position: [0, 2, disappearSection - 8], size: [3, 0.5, 3],
    type: "normal",
  });

  // Section 8: Finish
  platforms.push({
    id: uid(), position: [0, 2, disappearSection - 16], size: [6, 1, 6],
    type: "finish", color: "#c8a020", label: "⭐ Tutorial Complete!",
  });

  return {
    platforms, enemies, coins,
    startPos: [0, 2, 0],
    theme,
  };
}
