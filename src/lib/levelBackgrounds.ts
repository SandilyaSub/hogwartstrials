// Per-level painted backgrounds. Falls back to per-world background when a level image isn't available.
import bgWorld1 from "@/assets/worlds/bg_world1.jpg";
import bgWorld2 from "@/assets/worlds/bg_world2.jpg";
import bgWorld3 from "@/assets/worlds/bg_world3.jpg";
import bgWorld4 from "@/assets/worlds/bg_world4.jpg";
import bgWorld5 from "@/assets/worlds/bg_world5.jpg";
import bgWorld6 from "@/assets/worlds/bg_world6.jpg";
import bgWorld7 from "@/assets/worlds/bg_world7.jpg";

// World 1
import l1_1 from "@/assets/levels/1-1.jpg";
import l1_2 from "@/assets/levels/1-2.jpg";
import l1_3 from "@/assets/levels/1-3.jpg";
import l1_4 from "@/assets/levels/1-4.jpg";
import l1_5 from "@/assets/levels/1-5.jpg";
import l1_6 from "@/assets/levels/1-6.jpg";
import l1_7 from "@/assets/levels/1-7.jpg";
import l1_8 from "@/assets/levels/1-8.jpg";
import l1_9 from "@/assets/levels/1-9.jpg";
import l1_10 from "@/assets/levels/1-10.jpg";
// World 2
import l2_1 from "@/assets/levels/2-1.jpg";
import l2_2 from "@/assets/levels/2-2.jpg";
import l2_3 from "@/assets/levels/2-3.jpg";
import l2_4 from "@/assets/levels/2-4.jpg";
import l2_5 from "@/assets/levels/2-5.jpg";
import l2_6 from "@/assets/levels/2-6.jpg";
import l2_7 from "@/assets/levels/2-7.jpg";
import l2_8 from "@/assets/levels/2-8.jpg";
import l2_9 from "@/assets/levels/2-9.jpg";
import l2_10 from "@/assets/levels/2-10.jpg";
// World 3
import l3_1 from "@/assets/levels/3-1.jpg";
import l3_2 from "@/assets/levels/3-2.jpg";
import l3_3 from "@/assets/levels/3-3.jpg";
import l3_4 from "@/assets/levels/3-4.jpg";
import l3_5 from "@/assets/levels/3-5.jpg";
import l3_6 from "@/assets/levels/3-6.jpg";
import l3_7 from "@/assets/levels/3-7.jpg";
import l3_8 from "@/assets/levels/3-8.jpg";
import l3_9 from "@/assets/levels/3-9.jpg";
import l3_10 from "@/assets/levels/3-10.jpg";
// World 4
import l4_1 from "@/assets/levels/4-1.jpg";
import l4_2 from "@/assets/levels/4-2.jpg";
import l4_3 from "@/assets/levels/4-3.jpg";
import l4_4 from "@/assets/levels/4-4.jpg";
import l4_5 from "@/assets/levels/4-5.jpg";
import l4_6 from "@/assets/levels/4-6.jpg";
import l4_7 from "@/assets/levels/4-7.jpg";
import l4_8 from "@/assets/levels/4-8.jpg";
import l4_9 from "@/assets/levels/4-9.jpg";
import l4_10 from "@/assets/levels/4-10.jpg";
// World 5 (only 1-3 generated so far)
import l5_1 from "@/assets/levels/5-1.jpg";
import l5_2 from "@/assets/levels/5-2.jpg";
import l5_3 from "@/assets/levels/5-3.jpg";
// World 7 (Gringotts Escape only — rest pending credit refresh)
import l7_5 from "@/assets/levels/7-5.jpg";

const LEVEL_BACKGROUNDS: Record<string, string> = {
  "1-1": l1_1, "1-2": l1_2, "1-3": l1_3, "1-4": l1_4, "1-5": l1_5,
  "1-6": l1_6, "1-7": l1_7, "1-8": l1_8, "1-9": l1_9, "1-10": l1_10,
  "2-1": l2_1, "2-2": l2_2, "2-3": l2_3, "2-4": l2_4, "2-5": l2_5,
  "2-6": l2_6, "2-7": l2_7, "2-8": l2_8, "2-9": l2_9, "2-10": l2_10,
  "3-1": l3_1, "3-2": l3_2, "3-3": l3_3, "3-4": l3_4, "3-5": l3_5,
  "3-6": l3_6, "3-7": l3_7, "3-8": l3_8, "3-9": l3_9, "3-10": l3_10,
  "4-1": l4_1, "4-2": l4_2, "4-3": l4_3, "4-4": l4_4, "4-5": l4_5,
  "4-6": l4_6, "4-7": l4_7, "4-8": l4_8, "4-9": l4_9, "4-10": l4_10,
  "5-1": l5_1, "5-2": l5_2, "5-3": l5_3,
  "7-5": l7_5,
};

const WORLD_BACKGROUNDS: Record<number, string> = {
  1: bgWorld1, 2: bgWorld2, 3: bgWorld3, 4: bgWorld4,
  5: bgWorld5, 6: bgWorld6, 7: bgWorld7,
};

/**
 * Returns the best background for a given level: per-level painted scene
 * if available, otherwise the world-wide fallback. levelIdx is 0-indexed.
 */
export function getLevelBackground(worldId: number, levelIdx: number): string | undefined {
  const key = `${worldId}-${levelIdx + 1}`;
  return LEVEL_BACKGROUNDS[key] ?? WORLD_BACKGROUNDS[worldId];
}
