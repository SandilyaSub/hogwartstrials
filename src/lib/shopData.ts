export interface ShopItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cost: number;
  type: "upgrade" | "consumable" | "theme";
  // For upgrades: the stat it boosts
  stat?: string;
  value?: number;
  // For themes: the CSS variable overrides
  themeColors?: { primary: string; background: string; card: string };
}

export const SHOP_ITEMS: ShopItem[] = [
  // Character Upgrades
  {
    id: "jump_boost_1", name: "Featherweight Charm", description: "+1 Jump Height",
    emoji: "🪶", cost: 30, type: "upgrade", stat: "jump", value: 1,
  },
  {
    id: "jump_boost_2", name: "Levitation Mastery", description: "+2 Jump Height",
    emoji: "✨", cost: 80, type: "upgrade", stat: "jump", value: 2,
  },
  {
    id: "speed_boost_1", name: "Swift Potion", description: "+1 Speed",
    emoji: "⚡", cost: 30, type: "upgrade", stat: "speed", value: 1,
  },
  {
    id: "speed_boost_2", name: "Lightning Reflexes", description: "+2 Speed",
    emoji: "🏃", cost: 80, type: "upgrade", stat: "speed", value: 2,
  },

  // Consumables
  {
    id: "shield", name: "Protego Shield", description: "Survive one extra hit per level",
    emoji: "🛡️", cost: 50, type: "consumable", stat: "shield", value: 1,
  },
  {
    id: "super_jump", name: "Super Jump Spring", description: "Double jump height for one level",
    emoji: "🦘", cost: 40, type: "consumable", stat: "superJump", value: 1,
  },
  {
    id: "extra_life", name: "Felix Felicis", description: "+1 Extra Life",
    emoji: "🍀", cost: 60, type: "consumable", stat: "life", value: 1,
  },

  // Themes
  {
    id: "theme_pink", name: "Amortentia Theme", description: "A rosy pink magical theme",
    emoji: "💖", cost: 100, type: "theme",
    themeColors: { primary: "330 70% 60%", background: "330 30% 8%", card: "330 25% 12%" },
  },
  {
    id: "theme_blue", name: "Ravenclaw Skies", description: "A brilliant blue theme",
    emoji: "💙", cost: 100, type: "theme",
    themeColors: { primary: "220 70% 55%", background: "220 30% 8%", card: "220 25% 12%" },
  },
  {
    id: "theme_green", name: "Forbidden Forest", description: "A deep emerald theme",
    emoji: "💚", cost: 100, type: "theme",
    themeColors: { primary: "150 60% 45%", background: "150 30% 6%", card: "150 25% 10%" },
  },
  {
    id: "theme_gold", name: "Golden Snitch", description: "A luxurious golden theme",
    emoji: "💛", cost: 120, type: "theme",
    themeColors: { primary: "45 80% 55%", background: "40 25% 7%", card: "42 20% 11%" },
  },
];

export function getShopCategory(type: ShopItem["type"]): string {
  switch (type) {
    case "upgrade": return "⬆️ Upgrades";
    case "consumable": return "🧪 Consumables";
    case "theme": return "🎨 Themes";
  }
}
