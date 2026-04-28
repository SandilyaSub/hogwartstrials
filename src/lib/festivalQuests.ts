// Festival side-quest definitions. Each quest auto-unlocks during a real-world
// date window and rewards an exclusive cosmetic pet. Each festival ships with
// multiple "yearly chapters" that rotate so the challenge feels different
// every year (different objective wording, item, target, layout, time limit,
// and lore quote). The procedural level layout is also seeded by the year,
// so even within a single chapter the platforms are not identical year-to-year.

import spectreCatImg from "@/assets/festivals/pet_spectre_cat.png";
import yuleFoxImg from "@/assets/festivals/pet_yule_fox.png";
import diyaPeacockImg from "@/assets/festivals/pet_diya_peacock.png";
import amourFawnImg from "@/assets/festivals/pet_amour_fawn.png";
import sunPhoenixImg from "@/assets/festivals/pet_sun_phoenix.png";
import seashellTurtleImg from "@/assets/festivals/pet_seashell_turtle.png";

export type FestivalId = "halloween" | "yule" | "diwali" | "valentines" | "summer" | "summer_holiday";

export type FestivalObjectiveKind = "collect" | "defeat" | "deliver" | "light";

export interface FestivalObjective {
  kind: FestivalObjectiveKind;
  target: number;
  itemEmoji: string;
  itemLabel: string;
}

export interface FestivalReward {
  petId: string;
  petName: string;
  petImg: string;
  petEmoji: string;
}

/**
 * A single yearly variant of a festival quest. The active chapter is chosen
 * deterministically from the current year, so it cycles through over multiple
 * years. The chapter index is also folded into the procedural seed.
 */
export interface FestivalChapter {
  /** Short title appended after the festival name, e.g. "All Hallows' Hunt — Pumpkin Patch". */
  subtitle: string;
  description: string;
  loreQuote: string;
  objective: FestivalObjective;
  /** Number of platforms in the procedurally generated mini-level. */
  platformCount: number;
  /** Time limit in seconds (0 = no limit). */
  timeLimit: number;
  /** Optional twist tags affecting the canvas (icy floor, dim lights, wind, etc.). */
  modifiers?: ChapterModifier[];
}

export type ChapterModifier =
  | "ice_floor"        // reduced friction (Yule)
  | "dim_lights"       // darker overlay, smaller vision halo (Halloween / Diwali)
  | "wind_gusts"       // periodic horizontal push (Valentine's / Halloween)
  | "rising_water"     // floor rises slowly (Yule extreme)
  | "swap_gravity"     // briefly flipped gravity pulses (Halloween chaos)
  | "moving_platforms";// some platforms drift horizontally

export interface FestivalQuest {
  id: FestivalId;
  /** Base name of the festival (chapter subtitle is appended at runtime). */
  name: string;
  emoji: string;
  primaryColor: string;
  secondaryColor: string;
  skyTop: string;
  skyBottom: string;
  groundColor: string;
  /** Inclusive month range (1-12) when quest is available each year. */
  monthStart: number;
  dayStart: number;
  monthEnd: number;
  dayEnd: number;
  reward: FestivalReward;
  /** Yearly variants — cycle through across years. Must have ≥1 entry. */
  chapters: FestivalChapter[];
}

export const FESTIVAL_QUESTS: FestivalQuest[] = [
  // ─────────────────────────── HALLOWEEN ───────────────────────────
  {
    id: "halloween",
    name: "All Hallows' Hunt",
    emoji: "🎃",
    primaryColor: "hsl(25, 95%, 55%)",
    secondaryColor: "hsl(280, 70%, 40%)",
    skyTop: "hsl(280, 60%, 12%)",
    skyBottom: "hsl(25, 80%, 25%)",
    groundColor: "hsl(280, 40%, 18%)",
    monthStart: 10, dayStart: 20,
    monthEnd: 11, dayEnd: 2,
    reward: {
      petId: "festival_spectre_cat",
      petName: "Spectre Cat",
      petImg: spectreCatImg,
      petEmoji: "🐈‍⬛",
    },
    chapters: [
      {
        subtitle: "Pumpkin Patch",
        description: "The Forbidden Forest crawls with shadows. Gather enchanted pumpkins before the witching hour ends.",
        loreQuote: "On Hallowe'en, the very air seemed thick with magic and mischief.",
        objective: { kind: "collect", target: 13, itemEmoji: "🎃", itemLabel: "Pumpkins" },
        platformCount: 14, timeLimit: 90,
      },
      {
        subtitle: "Bat Swarm",
        description: "Hagrid's bats have escaped! Catch every last one as they swirl through the moonlit ruins.",
        loreQuote: "A fluttering of wings... and then darkness.",
        objective: { kind: "collect", target: 16, itemEmoji: "🦇", itemLabel: "Bats" },
        platformCount: 17, timeLimit: 95,
        modifiers: ["wind_gusts"],
      },
      {
        subtitle: "Spirit Lanterns",
        description: "Candles guide lost souls home. Light each lantern across the haunted graveyard.",
        loreQuote: "The candles flickered as if greeting old friends.",
        objective: { kind: "light", target: 11, itemEmoji: "🕯️", itemLabel: "Lanterns" },
        platformCount: 13, timeLimit: 80,
        modifiers: ["dim_lights"],
      },
      {
        subtitle: "Mischief Night",
        description: "Peeves has flipped the rules — gravity itself stumbles tonight. Snag every candy in the chaos.",
        loreQuote: "Mischief managed... eventually.",
        objective: { kind: "collect", target: 18, itemEmoji: "🍬", itemLabel: "Candies" },
        platformCount: 18, timeLimit: 110,
        modifiers: ["swap_gravity", "moving_platforms"],
      },
    ],
  },

  // ──────────────────────────── YULE ────────────────────────────
  {
    id: "yule",
    name: "The Yule Ball",
    emoji: "❄️",
    primaryColor: "hsl(190, 80%, 65%)",
    secondaryColor: "hsl(0, 75%, 55%)",
    skyTop: "hsl(220, 50%, 15%)",
    skyBottom: "hsl(200, 60%, 35%)",
    groundColor: "hsl(210, 30%, 85%)",
    monthStart: 12, dayStart: 15,
    monthEnd: 12, dayEnd: 31,
    reward: {
      petId: "festival_yule_fox",
      petName: "Yule Fox",
      petImg: yuleFoxImg,
      petEmoji: "🦊",
    },
    chapters: [
      {
        subtitle: "Gift Run",
        description: "The Great Hall is decked for the feast. Gather missing presents from the snowy grounds before the ball begins.",
        loreQuote: "Twelve frost-covered Christmas trees lined the walls.",
        objective: { kind: "collect", target: 12, itemEmoji: "🎁", itemLabel: "Gifts" },
        platformCount: 13, timeLimit: 90,
      },
      {
        subtitle: "Frozen Lake",
        description: "Skate across the Black Lake's frozen shore. Snowflakes scatter — gather every last one before they melt.",
        loreQuote: "The lake was a sheet of black glass under a blanket of snow.",
        objective: { kind: "collect", target: 15, itemEmoji: "❄️", itemLabel: "Snowflakes" },
        platformCount: 14, timeLimit: 95,
        modifiers: ["ice_floor"],
      },
      {
        subtitle: "Ornament Hunt",
        description: "The trees in the Great Hall need decorating. Find each enchanted ornament hidden in the courtyards.",
        loreQuote: "Hundreds of candles floated above the ornaments, twinkling like stars.",
        objective: { kind: "collect", target: 14, itemEmoji: "🔔", itemLabel: "Ornaments" },
        platformCount: 15, timeLimit: 90,
        modifiers: ["moving_platforms"],
      },
      {
        subtitle: "Light the Hearths",
        description: "A blizzard has snuffed every fireplace. Relight them before the castle freezes through.",
        loreQuote: "The fire roared back to life, and warmth returned to the stones.",
        objective: { kind: "light", target: 13, itemEmoji: "🔥", itemLabel: "Hearths" },
        platformCount: 16, timeLimit: 100,
        modifiers: ["ice_floor", "dim_lights"],
      },
    ],
  },

  // ─────────────────────────── DIWALI ───────────────────────────
  {
    id: "diwali",
    name: "Festival of Lights",
    emoji: "🪔",
    primaryColor: "hsl(45, 95%, 60%)",
    secondaryColor: "hsl(330, 80%, 55%)",
    skyTop: "hsl(260, 50%, 20%)",
    skyBottom: "hsl(30, 70%, 45%)",
    groundColor: "hsl(30, 40%, 25%)",
    monthStart: 10, dayStart: 25,
    monthEnd: 11, dayEnd: 15,
    reward: {
      petId: "festival_diya_peacock",
      petName: "Diya Peacock",
      petImg: diyaPeacockImg,
      petEmoji: "🦚",
    },
    chapters: [
      {
        subtitle: "Diya Path",
        description: "Illuminate the Hogwarts grounds. Light every diya across the rooftops to banish the shadows.",
        loreQuote: "Where there is light, the darkest shadows must flee.",
        objective: { kind: "light", target: 15, itemEmoji: "🪔", itemLabel: "Diyas" },
        platformCount: 16, timeLimit: 100,
      },
      {
        subtitle: "Rangoli Run",
        description: "Petals are scattered across the courtyards. Gather them to complete the rangoli before sundown.",
        loreQuote: "Color answers color, and the night begins to glow.",
        objective: { kind: "collect", target: 18, itemEmoji: "🌸", itemLabel: "Petals" },
        platformCount: 17, timeLimit: 100,
        modifiers: ["moving_platforms"],
      },
      {
        subtitle: "Sky Sparklers",
        description: "Catch every sparkler the sky throws — wind from the celebrations keeps tossing them about.",
        loreQuote: "Sparks rose like stars unwilling to fade.",
        objective: { kind: "collect", target: 20, itemEmoji: "🎆", itemLabel: "Sparklers" },
        platformCount: 18, timeLimit: 105,
        modifiers: ["wind_gusts"],
      },
      {
        subtitle: "Banish the Shadows",
        description: "Even the brightest festival has its shadows. Light each torch in the deep gloom of the dungeons.",
        loreQuote: "One flame is enough to remember a thousand more.",
        objective: { kind: "light", target: 12, itemEmoji: "🔥", itemLabel: "Torches" },
        platformCount: 14, timeLimit: 90,
        modifiers: ["dim_lights"],
      },
    ],
  },

  // ─────────────────────── VALENTINE'S ───────────────────────
  {
    id: "valentines",
    name: "Owls of Affection",
    emoji: "💌",
    primaryColor: "hsl(340, 85%, 65%)",
    secondaryColor: "hsl(50, 90%, 65%)",
    skyTop: "hsl(330, 60%, 35%)",
    skyBottom: "hsl(20, 70%, 60%)",
    groundColor: "hsl(340, 50%, 30%)",
    monthStart: 2, dayStart: 10,
    monthEnd: 2, dayEnd: 20,
    reward: {
      petId: "festival_amour_fawn",
      petName: "Amour Fawn",
      petImg: amourFawnImg,
      petEmoji: "🦌",
    },
    chapters: [
      {
        subtitle: "Letter Delivery",
        description: "Owls weave through the towers carrying love letters. Catch every last one before they're scattered.",
        loreQuote: "Hundreds of owls came flooding into the Great Hall, each carrying a tiny pink envelope.",
        objective: { kind: "deliver", target: 11, itemEmoji: "💌", itemLabel: "Letters" },
        platformCount: 12, timeLimit: 80,
      },
      {
        subtitle: "Heart Hunt",
        description: "Floating hearts drift through the corridors. Catch them before the wind sweeps them out the windows.",
        loreQuote: "Some things are too soft to last, and so we hold them while we can.",
        objective: { kind: "collect", target: 16, itemEmoji: "💖", itemLabel: "Hearts" },
        platformCount: 14, timeLimit: 85,
        modifiers: ["wind_gusts"],
      },
      {
        subtitle: "Rose Garden",
        description: "Madam Sprout's enchanted rose garden has bloomed. Pluck a bouquet from the highest perches.",
        loreQuote: "The roses sang quietly to themselves, in a language only the brave hear.",
        objective: { kind: "collect", target: 13, itemEmoji: "🌹", itemLabel: "Roses" },
        platformCount: 13, timeLimit: 80,
        modifiers: ["moving_platforms"],
      },
      {
        subtitle: "Amortentia Brew",
        description: "Find every drifting potion vial — each holds a memory worth keeping.",
        loreQuote: "It smelt different to each person, according to what attracted them.",
        objective: { kind: "collect", target: 14, itemEmoji: "🧪", itemLabel: "Vials" },
        platformCount: 15, timeLimit: 90,
      },
    ],
  },

  // ─────────────────────── SUMMER SOLSTICE ───────────────────────
  {
    id: "summer",
    name: "Solstice Spectacle",
    emoji: "☀️",
    primaryColor: "hsl(45, 100%, 60%)",
    secondaryColor: "hsl(195, 85%, 55%)",
    skyTop: "hsl(200, 90%, 65%)",
    skyBottom: "hsl(45, 95%, 75%)",
    groundColor: "hsl(40, 70%, 55%)",
    monthStart: 6, dayStart: 15,
    monthEnd: 7, dayEnd: 5,
    reward: {
      petId: "festival_sun_phoenix",
      petName: "Sun Phoenix",
      petImg: sunPhoenixImg,
      petEmoji: "🔥",
    },
    chapters: [
      {
        subtitle: "Sunbeam Hunt",
        description: "The longest day blazes over Hogwarts. Catch every sunbeam before dusk dims the towers.",
        loreQuote: "The summer sun lingered on the lake, painting it gold.",
        objective: { kind: "collect", target: 15, itemEmoji: "☀️", itemLabel: "Sunbeams" },
        platformCount: 15, timeLimit: 90,
      },
      {
        subtitle: "Quidditch Cup Prep",
        description: "Stray Quaffles drift across the pitch in the summer breeze. Round them all up before the match.",
        loreQuote: "The pitch shimmered under the heat, brooms whispering through the haze.",
        objective: { kind: "collect", target: 17, itemEmoji: "🏆", itemLabel: "Quaffles" },
        platformCount: 16, timeLimit: 95,
        modifiers: ["wind_gusts"],
      },
      {
        subtitle: "Ice Cream Run",
        description: "Florean Fortescue's enchanted ice cream is melting fast! Save every scoop before it's lost.",
        loreQuote: "A free ice cream every half hour — Diagon Alley had never been kinder.",
        objective: { kind: "collect", target: 18, itemEmoji: "🍦", itemLabel: "Scoops" },
        platformCount: 17, timeLimit: 85,
        modifiers: ["moving_platforms"],
      },
      {
        subtitle: "Solstice Bonfires",
        description: "Tradition says the longest night still falls — light each bonfire to greet the dawn.",
        loreQuote: "Where flame meets sky, the year turns once more.",
        objective: { kind: "light", target: 13, itemEmoji: "🔥", itemLabel: "Bonfires" },
        platformCount: 16, timeLimit: 95,
      },
    ],
  },
];

/**
 * Returns true if today's real-world date falls within the quest's window.
 */
export function isFestivalActive(quest: FestivalQuest, now: Date = new Date()): boolean {
  const m = now.getMonth() + 1;
  const d = now.getDate();
  const start = quest.monthStart * 100 + quest.dayStart;
  const end = quest.monthEnd * 100 + quest.dayEnd;
  const today = m * 100 + d;
  if (start <= end) return today >= start && today <= end;
  return today >= start || today <= end;
}

/** Days until the festival opens, or 0 if active. */
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

/**
 * Pick the active yearly chapter. Different per festival per year so two
 * festivals don't rotate in lockstep. Includes a per-festival offset so the
 * sequence each festival rotates through is independent.
 */
export function getYearlyChapter(
  quest: FestivalQuest,
  now: Date = new Date()
): { chapter: FestivalChapter; index: number; year: number; total: number } {
  const year = now.getFullYear();
  const offset = festivalOffset(quest.id);
  const index = ((year - 2024) + offset) % quest.chapters.length;
  const safeIndex = (index + quest.chapters.length) % quest.chapters.length;
  return {
    chapter: quest.chapters[safeIndex],
    index: safeIndex,
    year,
    total: quest.chapters.length,
  };
}

/** Stable per-festival offset so each festival cycles through chapters in its own order. */
function festivalOffset(id: FestivalId): number {
  switch (id) {
    case "halloween": return 0;
    case "yule": return 1;
    case "diwali": return 2;
    case "valentines": return 3;
    case "summer": return 4;
  }
}

/**
 * Deterministic seed for the procedural mini-level generator. Folds in the
 * year and chapter so the layout is different every year — even when the
 * objective happens to repeat.
 */
export function getQuestSeed(quest: FestivalQuest, now: Date = new Date()): number {
  const { index, year } = getYearlyChapter(quest, now);
  // Mix year + chapter + festival id length so the seed is well-distributed.
  return (year * 9301 + index * 49297 + quest.id.length * 233 + 1013904223) % 4294967296;
}

/** All festival pet ids — useful for filtering them out of regular pet store. */
export const FESTIVAL_PET_IDS = FESTIVAL_QUESTS.map(q => q.reward.petId);
