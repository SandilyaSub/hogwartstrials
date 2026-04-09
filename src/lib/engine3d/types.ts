// 3D Engine Types

export interface Platform3D {
  id: string;
  position: [number, number, number]; // x, y, z
  size: [number, number, number]; // width, height, depth
  type: "normal" | "moving" | "disappearing" | "hazard" | "finish" | "ice" | "checkpoint";
  color?: string;
  label?: string;
  moveAxis?: "x" | "y" | "z";
  moveRange?: number;
  moveSpeed?: number;
  visible?: boolean;
  timer?: number;
}

export interface Enemy3D {
  id: string;
  position: [number, number, number];
  size: [number, number, number];
  type: string;
  emoji?: string;
  moveAxis: "x" | "z";
  speed: number;
  range: number;
  origPos: [number, number, number];
}

export interface Coin3D {
  id: string;
  position: [number, number, number];
  collected: boolean;
}

export interface LevelData3D {
  platforms: Platform3D[];
  enemies: Enemy3D[];
  coins: Coin3D[];
  startPos: [number, number, number];
  theme: LevelTheme3D;
  specialMode?: "flying" | "boss" | "dark";
  boss?: BossData3D;
}

export interface LevelTheme3D {
  skyColor: string;
  fogColor: string;
  fogDensity: number;
  ambientColor: string;
  directionalColor: string;
  platformColor: string;
  groundColor?: string;
  particleColor?: string;
}

export interface BossData3D {
  name: string;
  emoji: string;
  maxHp: number;
  attackSpeed: number;
  projectileSpeed: number;
  color: string;
}

export interface PlayerState3D {
  position: [number, number, number];
  velocity: [number, number, number];
  onGround: boolean;
  hp: number;
  alive: boolean;
  facing: number; // rotation Y
}
