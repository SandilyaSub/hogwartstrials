// Premium character portraits
import dumbledoreImg from "@/assets/characters/premium/dumbledore.png";
import snapeImg from "@/assets/characters/premium/snape.png";
import voldemortImg from "@/assets/characters/premium/voldemort.png";
import dobbyImg from "@/assets/characters/premium/dobby.png";
import hagridImg from "@/assets/characters/premium/hagrid.png";
import harryGoldImg from "@/assets/characters/premium/harry_gold.png";
import hermioneYuleImg from "@/assets/characters/premium/hermione_yule.png";
import darkHarryImg from "@/assets/characters/premium/dark_harry.png";

export const PREMIUM_CHARACTER_IMAGES: Record<string, string> = {
  char_dumbledore: dumbledoreImg,
  char_snape: snapeImg,
  char_voldemort: voldemortImg,
  char_dobby: dobbyImg,
  char_hagrid: hagridImg,
  char_harry_gold: harryGoldImg,
  char_hermione_yule: hermioneYuleImg,
  char_dark_harry: darkHarryImg,
};

// Accessory illustrations
import sortingHatImg from "@/assets/accessories/sorting_hat.png";
import crownImg from "@/assets/accessories/crown.png";
import witchHatImg from "@/assets/accessories/witch_hat.png";
import glassesImg from "@/assets/accessories/glasses.png";
import sunglassesImg from "@/assets/accessories/sunglasses.png";
import scarfRedImg from "@/assets/accessories/scarf_red.png";
import auraFireImg from "@/assets/accessories/aura_fire.png";
import auraPatronusImg from "@/assets/accessories/aura_patronus.png";
import auraDarkImg from "@/assets/accessories/aura_dark.png";

export const ACCESSORY_IMAGES: Record<string, string> = {
  acc_sorting_hat: sortingHatImg,
  acc_crown: crownImg,
  acc_witch_hat: witchHatImg,
  acc_glasses: glassesImg,
  acc_sunglasses: sunglassesImg,
  acc_scarf_red: scarfRedImg,
  acc_aura_fire: auraFireImg,
  acc_aura_patronus: auraPatronusImg,
  acc_aura_dark: auraDarkImg,
};

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  emoji: string;
  cost: number;
  type: "upgrade" | "consumable" | "theme" | "character" | "accessory";
  stat?: string;
  value?: number;
  themeColors?: { primary: string; background: string; card: string };
  /** For character variants: tint color drawn around the avatar */
  characterTint?: string;
  /** For accessories: emoji drawn on the player + render slot */
  accessoryEmoji?: string;
  accessorySlot?: "hat" | "glasses" | "scarf" | "aura";
}

export const SHOP_ITEMS: ShopItem[] = [
  // ─── Character Upgrades ───
  {
    id: "jump_boost_1", name: "Featherweight Charm", description: "+1 Jump Height",
    emoji: "🪶", cost: 300, type: "upgrade", stat: "jump", value: 1,
  },
  {
    id: "jump_boost_2", name: "Levitation Mastery", description: "+2 Jump Height",
    emoji: "✨", cost: 800, type: "upgrade", stat: "jump", value: 2,
  },
  {
    id: "speed_boost_1", name: "Swift Potion", description: "+1 Speed",
    emoji: "⚡", cost: 300, type: "upgrade", stat: "speed", value: 1,
  },
  {
    id: "speed_boost_2", name: "Lightning Reflexes", description: "+2 Speed",
    emoji: "🏃", cost: 800, type: "upgrade", stat: "speed", value: 2,
  },
  {
    id: "double_coins", name: "Galleon Charm", description: "2× coins per level",
    emoji: "🪙", cost: 1250, type: "upgrade", stat: "coinMultiplier", value: 2,
  },
  {
    id: "magnet", name: "Accio Coins", description: "Strong magnetic pull — coins fly fast from far away",
    emoji: "🧲", cost: 1000, type: "upgrade", stat: "magnet", value: 1,
  },
  {
    id: "jump_boost_3", name: "Anti-Gravity Charm", description: "+3 Jump Height (top tier)",
    emoji: "🌙", cost: 1800, type: "upgrade", stat: "jump", value: 3,
  },
  {
    id: "speed_boost_3", name: "Tempus Acceleratio", description: "+3 Speed (top tier)",
    emoji: "💨", cost: 1800, type: "upgrade", stat: "speed", value: 3,
  },
  {
    id: "triple_coins", name: "Gringotts Vault", description: "3× coins per level (replaces 2×)",
    emoji: "💰", cost: 3000, type: "upgrade", stat: "coinMultiplier", value: 3,
  },
  {
    id: "lucky_charm", name: "Leprechaun's Luck", description: "+25% chance for bonus coins on every collect",
    emoji: "🍀", cost: 1400, type: "upgrade", stat: "luck", value: 1,
  },
  {
    id: "second_wind", name: "Phoenix Tears", description: "Auto-revive once per level at full health",
    emoji: "🔥", cost: 2200, type: "upgrade", stat: "revive", value: 1,
  },

  // ─── Consumables ───
  {
    id: "shield", name: "Protego Shield", description: "Survive one extra hit per level",
    emoji: "🛡️", cost: 500, type: "consumable", stat: "shield", value: 1,
  },
  {
    id: "super_jump", name: "Super Jump Spring", description: "Double jump height for one level",
    emoji: "🦘", cost: 450, type: "consumable", stat: "superJump", value: 1,
  },
  {
    id: "extra_life", name: "Felix Felicis", description: "+1 Extra Life",
    emoji: "🍀", cost: 625, type: "consumable", stat: "life", value: 1,
  },
  {
    id: "invisibility", name: "Invisibility Cloak", description: "Enemies can't see you for 10 seconds",
    emoji: "👻", cost: 750, type: "consumable", stat: "invisibility", value: 1,
  },
  {
    id: "time_turner", name: "Time-Turner", description: "Rewind 5 seconds when you fall",
    emoji: "⏳", cost: 950, type: "consumable", stat: "timeTurner", value: 1,
  },
  {
    id: "nimbus", name: "Nimbus 2000", description: "Float much longer after jumping — glide across gaps",
    emoji: "🧹", cost: 875, type: "consumable", stat: "float", value: 1,
  },
  {
    id: "firebolt", name: "Firebolt", description: "Even better float + extra mid-air boost",
    emoji: "🧹", cost: 1500, type: "consumable", stat: "float", value: 2,
  },
  {
    id: "polyjuice", name: "Polyjuice Potion", description: "Enemies ignore you for 20 seconds",
    emoji: "🧪", cost: 1100, type: "consumable", stat: "invisibility", value: 2,
  },
  {
    id: "elder_ward", name: "Elder Ward", description: "Survive TWO extra hits per level",
    emoji: "🛡️", cost: 1200, type: "consumable", stat: "shield", value: 2,
  },
  {
    id: "boost_coins", name: "Leprechaun Gold", description: "+150 coins next level on top of rewards",
    emoji: "🪙", cost: 600, type: "consumable", stat: "bonusCoins", value: 150,
  },
  {
    id: "mega_jump", name: "Bouncing Boots", description: "Triple jump height for one level",
    emoji: "👢", cost: 900, type: "consumable", stat: "superJump", value: 2,
  },

  // ─── Themes ───
  {
    id: "theme_pink", name: "Amortentia Theme", description: "A rosy pink magical theme",
    emoji: "💖", cost: 250, type: "theme",
    themeColors: { primary: "330 85% 65%", background: "330 35% 8%", card: "330 30% 14%" },
  },
  {
    id: "theme_blue", name: "Ravenclaw Skies", description: "A brilliant blue theme",
    emoji: "💙", cost: 250, type: "theme",
    themeColors: { primary: "220 85% 60%", background: "220 35% 8%", card: "220 30% 14%" },
  },
  {
    id: "theme_green", name: "Forbidden Forest", description: "A deep emerald theme",
    emoji: "💚", cost: 250, type: "theme",
    themeColors: { primary: "150 60% 45%", background: "150 30% 6%", card: "150 25% 10%" },
  },
  {
    id: "theme_gold", name: "Golden Snitch", description: "A luxurious golden theme",
    emoji: "💛", cost: 300, type: "theme",
    themeColors: { primary: "45 80% 55%", background: "40 25% 7%", card: "42 20% 11%" },
  },
  {
    id: "theme_halloween", name: "Halloween Feast", description: "Pumpkins, bats & orange glow",
    emoji: "🎃", cost: 325, type: "theme",
    themeColors: { primary: "25 90% 50%", background: "270 20% 6%", card: "270 18% 10%" },
  },
  {
    id: "theme_christmas", name: "Yule Ball", description: "Festive red & snowy white",
    emoji: "🎄", cost: 325, type: "theme",
    themeColors: { primary: "0 70% 50%", background: "210 25% 8%", card: "210 20% 12%" },
  },
  {
    id: "theme_dark", name: "Dark Arts", description: "Sinister green & black",
    emoji: "🐍", cost: 350, type: "theme",
    themeColors: { primary: "120 70% 40%", background: "120 10% 4%", card: "120 8% 8%" },
  },
  {
    id: "theme_celestial", name: "Astronomy Tower", description: "Deep indigo & starlight",
    emoji: "🌌", cost: 350, type: "theme",
    themeColors: { primary: "260 60% 65%", background: "260 35% 6%", card: "260 28% 10%" },
  },

  // ─── Legendary Characters (premium variants) ───
  {
    id: "char_dumbledore", name: "Albus Dumbledore", description: "The greatest wizard. Wisdom radiates.",
    emoji: "🧙‍♂️", cost: 1250, type: "character", characterTint: "#e8d57a",
  },
  {
    id: "char_snape", name: "Severus Snape", description: "Master of potions, robed in shadow.",
    emoji: "🦇", cost: 1125, type: "character", characterTint: "#1a1a2e",
  },
  {
    id: "char_voldemort", name: "Lord Voldemort", description: "He Who Must Not Be Named. Pure evil.",
    emoji: "💀", cost: 2000, type: "character", characterTint: "#5a1f5a",
  },
  {
    id: "char_dobby", name: "Dobby the House Elf", description: "A free elf! Loyal companion.",
    emoji: "🧦", cost: 875, type: "character", characterTint: "#9bb87a",
  },
  {
    id: "char_hagrid", name: "Rubeus Hagrid", description: "The lovable half-giant gamekeeper.",
    emoji: "🧔", cost: 1000, type: "character", characterTint: "#6b4423",
  },
  {
    id: "char_harry_gold", name: "Golden Harry", description: "Harry shimmering in pure gold. Flex!",
    emoji: "👑", cost: 1500, type: "character", characterTint: "#ffd700",
  },
  {
    id: "char_hermione_yule", name: "Yule Ball Hermione", description: "Hermione in her elegant pink gown.",
    emoji: "💃", cost: 950, type: "character", characterTint: "#ff9bc7",
  },
  {
    id: "char_dark_harry", name: "Dark Lord Harry", description: "What if Harry chose darkness?",
    emoji: "🌑", cost: 1375, type: "character", characterTint: "#3a0a3a",
  },

  // ─── Accessories (worn on top of any character) ───
  {
    id: "acc_sorting_hat", name: "Sorting Hat", description: "The legendary talking hat",
    emoji: "🎩", cost: 200, type: "accessory", accessoryEmoji: "🎩", accessorySlot: "hat",
  },
  {
    id: "acc_crown", name: "Triwizard Crown", description: "Wear the champion's crown",
    emoji: "👑", cost: 375, type: "accessory", accessoryEmoji: "👑", accessorySlot: "hat",
  },
  {
    id: "acc_witch_hat", name: "Pointed Witch Hat", description: "A classic pointed wizard hat",
    emoji: "🧙", cost: 150, type: "accessory", accessoryEmoji: "🎓", accessorySlot: "hat",
  },
  {
    id: "acc_glasses", name: "Round Glasses", description: "Harry's iconic round spectacles",
    emoji: "👓", cost: 125, type: "accessory", accessoryEmoji: "👓", accessorySlot: "glasses",
  },
  {
    id: "acc_sunglasses", name: "Cool Shades", description: "Look ice-cool dueling Death Eaters",
    emoji: "🕶️", cost: 225, type: "accessory", accessoryEmoji: "🕶️", accessorySlot: "glasses",
  },
  {
    id: "acc_scarf_red", name: "Gryffindor Scarf", description: "Bold red & gold knit",
    emoji: "🧣", cost: 175, type: "accessory", accessoryEmoji: "🧣", accessorySlot: "scarf",
  },
  {
    id: "acc_aura_fire", name: "Fiendfyre Aura", description: "Burning red aura surrounds you",
    emoji: "🔥", cost: 550, type: "accessory", accessoryEmoji: "🔥", accessorySlot: "aura",
  },
  {
    id: "acc_aura_patronus", name: "Patronus Aura", description: "Silver-blue ethereal glow",
    emoji: "✨", cost: 625, type: "accessory", accessoryEmoji: "✨", accessorySlot: "aura",
  },
  {
    id: "acc_aura_dark", name: "Dark Mark Aura", description: "Sinister green-black smoke",
    emoji: "💚", cost: 700, type: "accessory", accessoryEmoji: "🐍", accessorySlot: "aura",
  },

];

export function getShopCategory(type: ShopItem["type"]): string {
  switch (type) {
    case "upgrade": return "⬆️ Upgrades";
    case "consumable": return "🧪 Consumables";
    case "theme": return "🎨 Themes";
    case "character": return "🌟 Legendary Characters";
    case "accessory": return "🎩 Accessories";
  }
}
