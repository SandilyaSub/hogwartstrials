// Festival side-quest definitions. Each quest auto-unlocks during a real-world
// date window and rewards an exclusive cosmetic pet not available anywhere else.

import spectreCatImg from "@/assets/festivals/pet_spectre_cat.png";
import yuleFoxImg from "@/assets/festivals/pet_yule_fox.png";
import diyaPeacockImg from "@/assets/festivals/pet_diya_peacock.png";
import amourFawnImg from "@/assets/festivals/pet_amour_fawn.png";

export type FestivalId = "halloween" | "yule" | "diwali" | "valentines";

export type FestivalObjective =
  | { kind: "collect"; target: number; itemEmoji: string; itemLabel: string }
  | { kind: "defeat"; target: number; itemEmoji: string; itemLabel: string }
  | { kind: "deliver"; target: number; itemEmoji: string; itemLabel: string }
  | { kind: "light"; target: number; itemEmoji: string; itemLabel: string };

export interface FestivalReward {
  petId: string;          // unique festival pet id (stored in unlockedPets)
  petName: string;
  petImg: string;
  petEmoji: string;       // fallback for menus
}

export interface FestivalQuest {
  id: FestivalId;
  name: string;
  emoji: string;
  /** Tailwind/inline gradient for cards */
  primaryColor: string;
  secondaryColor: string;
  /** Background sky for canvas (HSL strings) */
  skyTop: string;
  skyBottom: string;
  groundColor: string;
  description: string;
  loreQuote: string;
  /** Inclusive month range (1-12) when quest is available each year */
  monthStart: number;
  dayStart: number;
  monthEnd: number;
  dayEnd: number;
  objective: FestivalObjective;
  reward: FestivalReward;
  /** Number of platforms in the procedurally generated mini-level */
  platformCount: number;
  /** Time limit in seconds (0 = no limit) */
  timeLimit: number;
}

export const FESTIVAL_QUESTS: FestivalQuest[] = [
  {
    id: "halloween",
    name: "All Hallows' Hunt",
    emoji: "🎃",
    primaryColor: "hsl(25, 95%, 55%)",
    secondaryColor: "hsl(280, 70%, 40%)",
    skyTop: "hsl(280, 60%, 12%)",
    skyBottom: "hsl(25, 80%, 25%)",
    groundColor: "hsl(280, 40%, 18%)",
    description: "The Forbidden Forest crawls with shadows. Gather enchanted pumpkins before the witching hour ends.",
    loreQuote: "On Hallowe'en, the very air seemed thick with magic and mischief.",
    monthStart: 10, dayStart: 20,
    monthEnd: 11, dayEnd: 2,
    objective: { kind: "collect", target: 13, itemEmoji: "🎃", itemLabel: "Pumpkins" },
    reward: {
      petId: "festival_spectre_cat",
      petName: "Spectre Cat",
      petImg: spectreCatImg,
      petEmoji: "🐈‍⬛",
    },
    platformCount: 14,
    timeLimit: 90,
  },
  {
    id: "yule",
    name: "The Yule Ball",
    emoji: "❄️",
    primaryColor: "hsl(190, 80%, 65%)",
    secondaryColor: "hsl(0, 75%, 55%)",
    skyTop: "hsl(220, 50%, 15%)",
    skyBottom: "hsl(200, 60%, 35%)",
    groundColor: "hsl(210, 30%, 85%)",
    description: "The Great Hall is decked for the feast. Gather missing presents from the snowy grounds before the ball begins.",
    loreQuote: "Twelve frost-covered Christmas trees, glittering with hundreds of candles, lined the walls.",
    monthStart: 12, dayStart: 15,
    monthEnd: 12, dayEnd: 31,
    objective: { kind: "collect", target: 12, itemEmoji: "🎁", itemLabel: "Gifts" },
    reward: {
      petId: "festival_yule_fox",
      petName: "Yule Fox",
      petImg: yuleFoxImg,
      petEmoji: "🦊",
    },
    platformCount: 13,
    timeLimit: 90,
  },
  {
    id: "diwali",
    name: "Festival of Lights",
    emoji: "🪔",
    primaryColor: "hsl(45, 95%, 60%)",
    secondaryColor: "hsl(330, 80%, 55%)",
    skyTop: "hsl(260, 50%, 20%)",
    skyBottom: "hsl(30, 70%, 45%)",
    groundColor: "hsl(30, 40%, 25%)",
    description: "Illuminate the Hogwarts grounds. Light every diya across the rooftops to banish the shadows.",
    loreQuote: "Where there is light, the darkest shadows must flee.",
    monthStart: 10, dayStart: 25,
    monthEnd: 11, dayEnd: 15,
    objective: { kind: "light", target: 15, itemEmoji: "🪔", itemLabel: "Diyas" },
    reward: {
      petId: "festival_diya_peacock",
      petName: "Diya Peacock",
      petImg: diyaPeacockImg,
      petEmoji: "🦚",
    },
    platformCount: 16,
    timeLimit: 100,
  },
  {
    id: "valentines",
    name: "Owls of Affection",
    emoji: "💌",
    primaryColor: "hsl(340, 85%, 65%)",
    secondaryColor: "hsl(50, 90%, 65%)",
    skyTop: "hsl(330, 60%, 35%)",
    skyBottom: "hsl(20, 70%, 60%)",
    groundColor: "hsl(340, 50%, 30%)",
    description: "Owls weave through the towers carrying love letters. Catch every last one before they're scattered.",
    loreQuote: "Hundreds of owls came flooding into the Great Hall, each carrying a tiny pink envelope.",
    monthStart: 2, dayStart: 10,
    monthEnd: 2, dayEnd: 20,
    objective: { kind: "deliver", target: 11, itemEmoji: "💌", itemLabel: "Letters" },
    reward: {
      petId: "festival_amour_fawn",
      petName: "Amour Fawn",
      petImg: amourFawnImg,
      petEmoji: "🦌",
    },
    platformCount: 12,
    timeLimit: 80,
  },
];

/**
 * Returns true if today's real-world date falls within the quest's window.
 * Window may cross month boundary (e.g. Oct 20 → Nov 2).
 */
export function isFestivalActive(quest: FestivalQuest, now: Date = new Date()): boolean {
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const start = quest.monthStart * 100 + quest.dayStart;
  const end = quest.monthEnd * 100 + quest.dayEnd;
  const today = m * 100 + d;
  if (start <= end) return today >= start && today <= end;
  // Window wraps year boundary (not used today but future-proof)
  return today >= start || today <= end;
}

/** Days until the festival opens, or 0 if active, or null if past this year. */
export function daysUntilFestival(quest: FestivalQuest, now: Date = new Date()): number {
  if (isFestivalActive(quest, now)) return 0;
  const year = now.getFullYear();
  let target = new Date(year, quest.monthStart - 1, quest.dayStart);
  if (target < now) target = new Date(year + 1, quest.monthStart - 1, quest.dayStart);
  const diff = Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function getFestivalById(id: string): FestivalQuest | undefined {
  return FESTIVAL_QUESTS.find(q => q.id === id);
}

/** All festival pet ids — useful for filtering them out of regular pet store. */
export const FESTIVAL_PET_IDS = FESTIVAL_QUESTS.map(q => q.reward.petId);
