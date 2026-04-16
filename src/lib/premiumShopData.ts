export interface PremiumItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  priceLabel: string; // e.g. "$1.99"
  category: "character" | "powerup" | "cosmetic";
  highlight?: boolean; // featured item
}

export const PREMIUM_ITEMS: PremiumItem[] = [
  // ─── Exclusive Characters ───
  {
    id: "prem_dumbledore", name: "Albus Dumbledore", description: "The greatest wizard of all time. +3 to all stats.",
    emoji: "🧙‍♂️", priceLabel: "$2.99", category: "character", highlight: true,
  },
  {
    id: "prem_snape", name: "Severus Snape", description: "Master of potions. Enemies slow down near you.",
    emoji: "🖤", priceLabel: "$2.99", category: "character",
  },
  {
    id: "prem_voldemort", name: "Tom Riddle", description: "The Dark Lord himself. Immune to hazard platforms.",
    emoji: "💀", priceLabel: "$3.99", category: "character", highlight: true,
  },
  {
    id: "prem_dobby", name: "Dobby", description: "A free elf! Double jump permanently unlocked.",
    emoji: "🧦", priceLabel: "$1.99", category: "character",
  },

  // ─── Premium Power-ups ───
  {
    id: "prem_elder_wand", name: "Elder Wand", description: "Triple spell damage in all boss fights. Permanent.",
    emoji: "⚡", priceLabel: "$1.99", category: "powerup", highlight: true,
  },
  {
    id: "prem_resurrection_stone", name: "Resurrection Stone", description: "Revive with full HP once per level. Unlimited uses.",
    emoji: "💎", priceLabel: "$2.49", category: "powerup",
  },
  {
    id: "prem_marauders_map", name: "Marauder's Map Complete", description: "See all enemies, coins & secrets on every level.",
    emoji: "🗺️", priceLabel: "$1.49", category: "powerup",
  },
  {
    id: "prem_infinite_lives", name: "Infinite Lives Pack", description: "Never run out of lives. Play endlessly.",
    emoji: "♾️", priceLabel: "$3.99", category: "powerup", highlight: true,
  },

  // ─── Premium Cosmetics ───
  {
    id: "prem_theme_deathly", name: "Deathly Hallows Theme", description: "Exclusive tri-symbol theme with animated particles.",
    emoji: "△", priceLabel: "$0.99", category: "cosmetic",
  },
  {
    id: "prem_theme_patronus", name: "Patronus Glow Theme", description: "Shimmering silver-blue with ethereal light trails.",
    emoji: "🦌", priceLabel: "$0.99", category: "cosmetic",
  },
  {
    id: "prem_trail_fire", name: "Fiendfyre Trail", description: "Leave a trail of magical fire as you run.",
    emoji: "🔥", priceLabel: "$1.49", category: "cosmetic",
  },
  {
    id: "prem_trail_stars", name: "Starfall Trail", description: "Sparkling stars follow your every move.",
    emoji: "✨", priceLabel: "$1.49", category: "cosmetic",
  },
  {
    id: "prem_golden_skin", name: "Golden Wizard Skin", description: "Your character shines in pure gold. Flex on everyone.",
    emoji: "👑", priceLabel: "$2.99", category: "cosmetic", highlight: true,
  },
  {
    id: "prem_pet_phoenix", name: "Phoenix Companion", description: "A majestic phoenix follows you in every level.",
    emoji: "🔥", priceLabel: "$2.49", category: "cosmetic",
  },
];

export function getPremiumCategory(cat: PremiumItem["category"]): string {
  switch (cat) {
    case "character": return "🌟 Exclusive Characters";
    case "powerup": return "⚡ Premium Powers";
    case "cosmetic": return "✨ Premium Cosmetics";
  }
}
