export interface PremiumItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  priceLabel: string; // e.g. "$1.99"
  category: "character" | "powerup" | "cosmetic";
  highlight?: boolean; // featured item
}

// NOTE: These items are intentionally distinct from anything in the regular
// coin-based shop (see shopData.ts). No overlapping characters, accessories,
// themes, auras, powerups or pets.
export const PREMIUM_ITEMS: PremiumItem[] = [
  // ─── Exclusive Characters (none of these exist in the coin shop) ───
  {
    id: "prem_merlin", name: "Merlin the Ancient", description: "The legendary founder of magic. +5 to all stats.",
    emoji: "🪄", priceLabel: "$3.99", category: "character", highlight: true,
  },
  {
    id: "prem_morgana", name: "Morgana le Fay", description: "Dark sorceress of legend. Curse enemies on contact.",
    emoji: "🌙", priceLabel: "$2.99", category: "character",
  },
  {
    id: "prem_nicolas_flamel", name: "Nicolas Flamel", description: "The immortal alchemist. Coins are worth double.",
    emoji: "⚗️", priceLabel: "$2.49", category: "character", highlight: true,
  },
  {
    id: "prem_grindelwald", name: "Gellert Grindelwald", description: "Master duellist. Spells pierce through walls.",
    emoji: "🗡️", priceLabel: "$2.99", category: "character",
  },

  // ─── Premium Power-ups (mechanics not sold for coins) ───
  {
    id: "prem_time_turner", name: "Time-Turner", description: "Rewind death once per level. Permanent unlock.",
    emoji: "⏳", priceLabel: "$2.49", category: "powerup", highlight: true,
  },
  {
    id: "prem_invisibility_cloak", name: "Invisibility Cloak", description: "Phase through enemies for 5s every minute.",
    emoji: "👻", priceLabel: "$1.99", category: "powerup",
  },
  {
    id: "prem_pensieve", name: "Pensieve Memory", description: "Replay any boss with full health, anytime.",
    emoji: "🌀", priceLabel: "$1.49", category: "powerup",
  },
  {
    id: "prem_xp_boost", name: "Eternal House Boost", description: "All house points awarded are tripled. Forever.",
    emoji: "🏆", priceLabel: "$3.49", category: "powerup", highlight: true,
  },

  // ─── Premium Cosmetics (no overlap with coin themes/auras/pets) ───
  {
    id: "prem_theme_mirror_erised", name: "Mirror of Erised Theme", description: "Reflective gold UI with shifting reflections.",
    emoji: "🪞", priceLabel: "$1.49", category: "cosmetic",
  },
  {
    id: "prem_theme_chamber", name: "Chamber of Secrets Theme", description: "Emerald serpent UI with parseltongue runes.",
    emoji: "🐍", priceLabel: "$1.49", category: "cosmetic",
  },
  {
    id: "prem_aura_basilisk", name: "Basilisk Aura", description: "Coiling green serpent aura swirls around you.",
    emoji: "🟢", priceLabel: "$1.99", category: "cosmetic",
  },
  {
    id: "prem_aura_galaxy", name: "Galaxy Aura", description: "A swirling cosmos orbits your character.",
    emoji: "🌌", priceLabel: "$1.99", category: "cosmetic",
  },
  {
    id: "prem_skin_diamond", name: "Diamond Wizard Skin", description: "Crystalline character with refracted light.",
    emoji: "💎", priceLabel: "$2.99", category: "cosmetic", highlight: true,
  },
  {
    id: "prem_pet_thestral", name: "Thestral Companion", description: "A mysterious skeletal steed glides beside you.",
    emoji: "🦴", priceLabel: "$2.49", category: "cosmetic",
  },
];

export function getPremiumCategory(cat: PremiumItem["category"]): string {
  switch (cat) {
    case "character": return "🌟 Exclusive Characters";
    case "powerup": return "⚡ Premium Powers";
    case "cosmetic": return "✨ Premium Cosmetics";
  }
}
