export interface ShopItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cost: number;
  type: "upgrade" | "consumable" | "theme" | "song";
  stat?: string;
  value?: number;
  themeColors?: { primary: string; background: string; card: string };
}

export const SHOP_ITEMS: ShopItem[] = [
  // ─── Character Upgrades ───
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
  {
    id: "double_coins", name: "Galleon Charm", description: "2× coins per level",
    emoji: "🪙", cost: 150, type: "upgrade", stat: "coinMultiplier", value: 2,
  },
  {
    id: "magnet", name: "Accio Coins", description: "Coins fly towards you",
    emoji: "🧲", cost: 100, type: "upgrade", stat: "magnet", value: 1,
  },

  // ─── Consumables ───
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
  {
    id: "invisibility", name: "Invisibility Cloak", description: "Enemies can't see you for 10 seconds",
    emoji: "👻", cost: 70, type: "consumable", stat: "invisibility", value: 1,
  },
  {
    id: "time_turner", name: "Time-Turner", description: "Rewind 5 seconds when you fall",
    emoji: "⏳", cost: 90, type: "consumable", stat: "timeTurner", value: 1,
  },
  {
    id: "nimbus", name: "Nimbus 2000", description: "Float briefly after jumping",
    emoji: "🧹", cost: 75, type: "consumable", stat: "float", value: 1,
  },

  // ─── Themes ───
  {
    id: "theme_pink", name: "Amortentia Theme", description: "A rosy pink magical theme",
    emoji: "💖", cost: 100, type: "theme",
    themeColors: { primary: "330 85% 65%", background: "330 35% 8%", card: "330 30% 14%" },
  },
  {
    id: "theme_blue", name: "Ravenclaw Skies", description: "A brilliant blue theme",
    emoji: "💙", cost: 100, type: "theme",
    themeColors: { primary: "220 85% 60%", background: "220 35% 8%", card: "220 30% 14%" },
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
  {
    id: "theme_halloween", name: "Halloween Feast", description: "Pumpkins, bats & orange glow",
    emoji: "🎃", cost: 130, type: "theme",
    themeColors: { primary: "25 90% 50%", background: "270 20% 6%", card: "270 18% 10%" },
  },
  {
    id: "theme_christmas", name: "Yule Ball", description: "Festive red & snowy white",
    emoji: "🎄", cost: 130, type: "theme",
    themeColors: { primary: "0 70% 50%", background: "210 25% 8%", card: "210 20% 12%" },
  },
  {
    id: "theme_dark", name: "Dark Arts", description: "Sinister green & black",
    emoji: "🐍", cost: 140, type: "theme",
    themeColors: { primary: "120 70% 40%", background: "120 10% 4%", card: "120 8% 8%" },
  },
  {
    id: "theme_celestial", name: "Astronomy Tower", description: "Deep indigo & starlight",
    emoji: "🌌", cost: 140, type: "theme",
    themeColors: { primary: "260 60% 65%", background: "260 35% 6%", card: "260 28% 10%" },
  },

  // ─── Songs ───
  {
    id: "song_default", name: "Hedwig's Theme", description: "The classic magical melody",
    emoji: "🦉", cost: 0, type: "song",
  },
  {
    id: "song_adventure", name: "The Quidditch Pitch", description: "An upbeat, soaring adventure tune",
    emoji: "🧹", cost: 80, type: "song",
  },
  {
    id: "song_dark", name: "The Dark Forest", description: "A mysterious, eerie melody",
    emoji: "🌑", cost: 80, type: "song",
  },
  {
    id: "song_triumphant", name: "Victory at Hogwarts", description: "A triumphant, heroic fanfare",
    emoji: "🏆", cost: 100, type: "song",
  },
  {
    id: "song_peaceful", name: "The Great Lake", description: "A calm, peaceful lullaby",
    emoji: "🌊", cost: 80, type: "song",
  },
  {
    id: "song_battle", name: "Battle of Hogwarts", description: "An intense, driving battle theme",
    emoji: "⚔️", cost: 120, type: "song",
  },

  // ─── Premium Songs ───
  {
    id: "song_lush_life", name: "Lush Life", description: "A dreamy, uplifting pop melody",
    emoji: "🌴", cost: 200, type: "song",
  },
  {
    id: "song_touch", name: "Touch", description: "A smooth, soulful groove",
    emoji: "💫", cost: 200, type: "song",
  },
  {
    id: "song_passo_bem_solto", name: "Passo Bem Solto", description: "A chill, breezy Brazilian vibe",
    emoji: "🇧🇷", cost: 220, type: "song",
  },
  {
    id: "song_levitating", name: "Levitating", description: "A funky, groovy disco beat",
    emoji: "🪩", cost: 200, type: "song",
  },
  {
    id: "song_blinding_lights", name: "Blinding Lights", description: "A synth-driven retro banger",
    emoji: "🌃", cost: 250, type: "song",
  },
  {
    id: "song_dancin", name: "Dancin", description: "A smooth, flowing dance melody",
    emoji: "🕺", cost: 180, type: "song",
  },
  {
    id: "song_super_shy", name: "Super Shy", description: "A catchy, bouncy K-pop tune",
    emoji: "🫣", cost: 220, type: "song",
  },
];

export function getShopCategory(type: ShopItem["type"]): string {
  switch (type) {
    case "upgrade": return "⬆️ Upgrades";
    case "consumable": return "🧪 Consumables";
    case "theme": return "🎨 Themes";
    case "song": return "🎵 Songs";
  }
}
