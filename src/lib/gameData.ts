export interface Character {
  id: string;
  name: string;
  emoji: string;
  color: string;
  description: string;
}

export interface House {
  id: string;
  name: string;
  color: string;
  mentor: string;
  mentorTitle: string;
  boosts: { speed: number; jump: number; flying: number };
  description: string;
}

export interface Pet {
  id: string;
  name: string;
  emoji: string;
  ability: string;
  description: string;
  unlockWorld: number;
  effect: { type: string; value: number };
}

export interface Level {
  id: string;
  name: string;
  description: string;
  isBoss: boolean;
  theme: string;
}

export interface World {
  id: number;
  title: string;
  subtitle: string;
  emoji: string;
  levels: Level[];
  color: string;
}

export const CHARACTERS: Character[] = [
  { id: "harry", name: "Harry Potter", emoji: "⚡", color: "#c0392b", description: "The Chosen One" },
  { id: "hermione", name: "Hermione Granger", emoji: "📚", color: "#8e44ad", description: "Brightest Witch" },
  { id: "ron", name: "Ron Weasley", emoji: "♟️", color: "#e67e22", description: "Loyal Friend" },
  { id: "luna", name: "Luna Lovegood", emoji: "🌙", color: "#3498db", description: "Dreamer" },
  { id: "ginny", name: "Ginny Weasley", emoji: "🔥", color: "#e74c3c", description: "Fierce Spirit" },
  { id: "neville", name: "Neville Longbottom", emoji: "🌿", color: "#27ae60", description: "Brave Heart" },
  { id: "draco", name: "Draco Malfoy", emoji: "🐍", color: "#2ecc71", description: "Ambitious" },
  { id: "cedric", name: "Cedric Diggory", emoji: "⭐", color: "#f1c40f", description: "True Champion" },
  { id: "cho", name: "Cho Chang", emoji: "🦅", color: "#2980b9", description: "Swift Seeker" },
];

export const HOUSES: House[] = [
  { id: "gryffindor", name: "Gryffindor", color: "gryffindor", mentor: "Minerva McGonagall", mentorTitle: "Head of House", boosts: { speed: 0, jump: 1, flying: 0 }, description: "Where dwell the brave at heart" },
  { id: "slytherin", name: "Slytherin", color: "slytherin", mentor: "Severus Snape", mentorTitle: "Head of House", boosts: { speed: 1, jump: 0, flying: 0 }, description: "Cunning folk use any means" },
  { id: "ravenclaw", name: "Ravenclaw", color: "ravenclaw", mentor: "Filius Flitwick", mentorTitle: "Head of House", boosts: { speed: 0, jump: 0, flying: 1 }, description: "Wit beyond measure" },
  { id: "hufflepuff", name: "Hufflepuff", color: "hufflepuff", mentor: "Pomona Sprout", mentorTitle: "Head of House", boosts: { speed: 0, jump: 1, flying: 0 }, description: "Those patient and loyal" },
];

export const PETS: Pet[] = [
  { id: "owl", name: "Owl", emoji: "🦉", ability: "Speed Boost", description: "Slight speed boost & guides direction", unlockWorld: 1, effect: { type: "speed", value: 0.5 } },
  { id: "cat", name: "Cat", emoji: "🐱", ability: "Better Balance", description: "Easier narrow jumps", unlockWorld: 1, effect: { type: "balance", value: 1 } },
  { id: "toad", name: "Toad", emoji: "🐸", ability: "High Jump", description: "Higher jump height", unlockWorld: 2, effect: { type: "jump", value: 1 } },
  { id: "rat", name: "Rat", emoji: "🐀", ability: "Agility", description: "Faster in tight spaces", unlockWorld: 2, effect: { type: "speed", value: 0.8 } },
  { id: "phoenix", name: "Phoenix", emoji: "🔥", ability: "Revive", description: "Second chance after falling", unlockWorld: 4, effect: { type: "revive", value: 1 } },
  { id: "hippogriff", name: "Hippogriff", emoji: "🦅", ability: "Flight Control", description: "Better flying control", unlockWorld: 5, effect: { type: "flying", value: 1 } },
  { id: "thestral", name: "Thestral", emoji: "👻", ability: "See Hidden", description: "Reveals hidden platforms", unlockWorld: 6, effect: { type: "vision", value: 1 } },
];

export const WORLDS: World[] = [
  {
    id: 1, title: "Philosopher's Stone", subtitle: "Year One", emoji: "🧙‍♂️", color: "#c0392b",
    levels: [
      { id: "1-1", name: "Hogwarts Arrival", description: "Learn the basics of jumping and moving", isBoss: false, theme: "castle" },
      { id: "1-2", name: "Staircase Maze", description: "Navigate the moving staircases", isBoss: false, theme: "castle" },
      { id: "1-3", name: "Troll Dungeon", description: "Dark corridors — use Lumos!", isBoss: false, theme: "dungeon" },
      { id: "1-4", name: "Wizard Chess", description: "Moving tile platforms", isBoss: false, theme: "chess" },
      { id: "1-5", name: "Fluffy's Chamber", description: "Sneak past the three-headed dog", isBoss: false, theme: "chamber" },
      { id: "1-6", name: "Devil's Snare", description: "Escape the tangling vines", isBoss: false, theme: "dungeon" },
      { id: "1-7", name: "Flying Keys", description: "Chase the winged keys", isBoss: false, theme: "flying" },
      { id: "1-8", name: "Potion Riddle", description: "Navigate fire and ice barriers", isBoss: false, theme: "potions" },
      { id: "1-9", name: "Forbidden Corridor", description: "The final corridor to the Stone", isBoss: false, theme: "corridor" },
      { id: "1-10", name: "Mirror of Erised", description: "Defeat Quirrell!", isBoss: true, theme: "boss" },
    ],
  },
  {
    id: 2, title: "Chamber of Secrets", subtitle: "Year Two", emoji: "🐍", color: "#27ae60",
    levels: [
      { id: "2-1", name: "Diagon Alley Rooftops", description: "Rooftop jumping", isBoss: false, theme: "rooftop" },
      { id: "2-2", name: "Flying Escape", description: "Fly the enchanted car", isBoss: false, theme: "flying" },
      { id: "2-3", name: "Detention with Lockhart", description: "Dodge fan mail & sign letters", isBoss: false, theme: "detention" },
      { id: "2-4", name: "Chamber Doors", description: "Alohomora puzzles", isBoss: false, theme: "dungeon" },
      { id: "2-5", name: "Whomping Willow", description: "Dodge the swinging branches", isBoss: false, theme: "forest" },
      { id: "2-6", name: "Moaning Myrtle's Bathroom", description: "Flooded corridors and pipes", isBoss: false, theme: "water" },
      { id: "2-7", name: "Aragog's Lair", description: "Escape the spider colony", isBoss: false, theme: "forest" },
      { id: "2-8", name: "Parseltongue Pipes", description: "Slide through ancient plumbing", isBoss: false, theme: "dungeon" },
      { id: "2-9", name: "Sword of Gryffindor", description: "Claim the enchanted blade", isBoss: false, theme: "chamber" },
      { id: "2-10", name: "Basilisk Maze", description: "Defeat the Basilisk!", isBoss: true, theme: "boss" },
    ],
  },
  {
    id: 3, title: "Prisoner of Azkaban", subtitle: "Year Three", emoji: "🐺", color: "#8e44ad",
    levels: [
      { id: "3-1", name: "Time Platforms", description: "Platforms shift through time", isBoss: false, theme: "time" },
      { id: "3-2", name: "Clock Tower", description: "Climb the clock tower", isBoss: false, theme: "tower" },
      { id: "3-3", name: "Forest Run", description: "Escape through the forest", isBoss: false, theme: "forest" },
      { id: "3-4", name: "Ice Lake", description: "Slippery frozen surfaces", isBoss: false, theme: "ice" },
      { id: "3-5", name: "Hippogriff Flight", description: "Ride Buckbeak through the sky", isBoss: false, theme: "flying" },
      { id: "3-6", name: "Shrieking Shack", description: "Navigate the haunted house", isBoss: false, theme: "dark" },
      { id: "3-7", name: "Marauder's Map", description: "Discover secret passages", isBoss: false, theme: "castle" },
      { id: "3-8", name: "Willow Tunnel", description: "Escape through the roots", isBoss: false, theme: "forest" },
      { id: "3-9", name: "Patronus Training", description: "Master the Patronus charm", isBoss: false, theme: "training" },
      { id: "3-10", name: "Dementor Flight", description: "Survive the Dementors!", isBoss: true, theme: "boss" },
    ],
  },
  {
    id: 4, title: "Goblet of Fire", subtitle: "Year Four", emoji: "🔥", color: "#e67e22",
    levels: [
      { id: "4-1", name: "Dragon Arena", description: "Dodge the dragon's fire", isBoss: false, theme: "arena" },
      { id: "4-2", name: "Cliff Jumps", description: "Precarious cliff parkour", isBoss: false, theme: "cliffs" },
      { id: "4-3", name: "Underwater Maze", description: "Swim through the lake", isBoss: false, theme: "water" },
      { id: "4-4", name: "Graveyard", description: "Dark graveyard run", isBoss: false, theme: "dark" },
      { id: "4-5", name: "Yule Ball", description: "Dance floor obstacles", isBoss: false, theme: "ballroom" },
      { id: "4-6", name: "Triwizard Maze", description: "Navigate the enchanted hedges", isBoss: false, theme: "maze" },
      { id: "4-7", name: "Merpeople Village", description: "Deep underwater rescue", isBoss: false, theme: "water" },
      { id: "4-8", name: "Portkey Field", description: "Teleporting platforms", isBoss: false, theme: "field" },
      { id: "4-9", name: "Wand Priori", description: "Echoes of past spells", isBoss: false, theme: "magic" },
      { id: "4-10", name: "Dragon Chase", description: "Outrun the dragon!", isBoss: true, theme: "boss" },
    ],
  },
  {
    id: 5, title: "Order of the Phoenix", subtitle: "Year Five", emoji: "⚡", color: "#3498db",
    levels: [
      { id: "5-1", name: "Umbridge's Office", description: "Detention with the Inquisitor", isBoss: false, theme: "office" },
      { id: "5-2", name: "Room of Requirement", description: "The room shifts around you", isBoss: false, theme: "magic" },
      { id: "5-3", name: "D.A. Training", description: "Defense practice with Harry", isBoss: false, theme: "training" },
      { id: "5-4", name: "Dumbledore's Army", description: "The army stands together", isBoss: false, theme: "training" },
      { id: "5-5", name: "Chaos Corridor", description: "Educational Decrees collapse", isBoss: false, theme: "chaos" },
      { id: "5-6", name: "Thestral Flight", description: "Fly the invisible mounts to London", isBoss: false, theme: "flying" },
      { id: "5-7", name: "Ministry Hall", description: "Navigate the Ministry", isBoss: false, theme: "ministry" },
      { id: "5-8", name: "Hall of Prophecy", description: "Shelves of glowing orbs", isBoss: false, theme: "shelves" },
      { id: "5-9", name: "Veil Chamber", description: "Death's archway awaits", isBoss: false, theme: "dark" },
      { id: "5-10", name: "Battle of the Ministry", description: "Defeat Umbridge!", isBoss: true, theme: "boss" },
    ],
  },
  {
    id: 6, title: "Half-Blood Prince", subtitle: "Year Six", emoji: "🧪", color: "#1abc9c",
    levels: [
      { id: "6-1", name: "Potion Puzzle", description: "Navigate potion hazards", isBoss: false, theme: "potions" },
      { id: "6-2", name: "Tower Jumps", description: "Astronomy tower parkour", isBoss: false, theme: "tower" },
      { id: "6-3", name: "Dark Corridor", description: "Vanishing cabinet maze", isBoss: false, theme: "dark" },
      { id: "6-4", name: "Inferi Lake", description: "Cross the cursed lake", isBoss: false, theme: "water" },
      { id: "6-5", name: "Slug Club Party", description: "Navigate the fancy soirée", isBoss: false, theme: "ballroom" },
      { id: "6-6", name: "Sectumsempra", description: "Flooded cursed bathroom", isBoss: false, theme: "water" },
      { id: "6-7", name: "Pensieve Memories", description: "Jump through memories", isBoss: false, theme: "magic" },
      { id: "6-8", name: "Lightning Tower", description: "Crumbling tower ascent", isBoss: false, theme: "tower" },
      { id: "6-9", name: "Felix Felicis", description: "Luck-powered speed run", isBoss: false, theme: "castle" },
      { id: "6-10", name: "Horcrux Cave", description: "Survive the cave!", isBoss: true, theme: "boss" },
    ],
  },
  {
    id: 7, title: "Deathly Hallows", subtitle: "The Final Year", emoji: "⚔️", color: "#e74c3c",
    levels: [
      { id: "7-1", name: "Escape Run", description: "Flee from Death Eaters", isBoss: false, theme: "escape" },
      { id: "7-2", name: "Ruined Hogwarts", description: "Navigate the ruins", isBoss: false, theme: "ruins" },
      { id: "7-3", name: "Hard Flying", description: "Dragon escape flight", isBoss: false, theme: "flying" },
      { id: "7-4", name: "Final Climb", description: "Ascend the broken castle", isBoss: false, theme: "climb" },
      { id: "7-5", name: "Gringotts Vault", description: "Mine cart escape ride", isBoss: false, theme: "dungeon" },
      { id: "7-6", name: "Room of Hidden Things", description: "Fiendfyre escape", isBoss: false, theme: "fire" },
      { id: "7-7", name: "Forbidden Forest Walk", description: "Walk to your fate", isBoss: false, theme: "forest" },
      { id: "7-8", name: "Elder Wand Chase", description: "The final pursuit", isBoss: false, theme: "chase" },
      { id: "7-9", name: "Battle of Hogwarts", description: "The castle's last stand", isBoss: false, theme: "battle" },
      { id: "7-10", name: "Lord Voldemort", description: "FINAL BOSS BATTLE!", isBoss: true, theme: "final" },
    ],
  },
];

export const MENTOR_QUOTES: Record<string, string[]> = {
  dumbledore: [
    "It does not do to dwell on dreams and forget to live.",
    "Happiness can be found in the darkest of times...",
    "It is our choices that show what we truly are.",
    "Help will always be given at Hogwarts to those who ask for it.",
  ],
  gryffindor: ["Courage is not the absence of fear, but acting despite it.", "A true Gryffindor never backs down!"],
  slytherin: ["Use your cunning to find the path.", "Ambition will guide you forward."],
  ravenclaw: ["Observe carefully — wisdom reveals the way.", "Think before you leap... literally."],
  hufflepuff: ["Patience and loyalty — steady wins the race.", "Hard work always pays off."],
};