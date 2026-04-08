import { useState, useCallback } from "react";
import { CHARACTERS, HOUSES, PETS, WORLDS, type Character, type House, type Pet } from "@/lib/gameData";

export type GameScreen = "title" | "profile" | "character" | "house" | "worldmap" | "petstore" | "playing" | "levelComplete" | "gameOver";

export interface PlayerProfile {
  username: string;
  character: Character | null;
  house: House | null;
  pet: Pet | null;
  unlockedPets: string[];
  currentWorld: number;
  currentLevel: number;
  completedLevels: string[];
  coins: number;
  lives: number;
}

const DEFAULT_PROFILE: PlayerProfile = {
  username: "",
  character: null,
  house: null,
  pet: null,
  unlockedPets: ["owl", "cat"],
  currentWorld: 1,
  currentLevel: 0,
  completedLevels: [],
  coins: 0,
  lives: 3,
};

export function useGameState() {
  const [screen, setScreen] = useState<GameScreen>("title");
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    const saved = localStorage.getItem("hp_obby_profile");
    if (saved) {
      try { return JSON.parse(saved); } catch { return DEFAULT_PROFILE; }
    }
    return DEFAULT_PROFILE;
  });
  const [mentorMessage, setMentorMessage] = useState<string | null>(null);

  const saveProfile = useCallback((p: PlayerProfile) => {
    setProfile(p);
    localStorage.setItem("hp_obby_profile", JSON.stringify(p));
  }, []);

  const setUsername = useCallback((username: string) => {
    saveProfile({ ...profile, username });
  }, [profile, saveProfile]);

  const selectCharacter = useCallback((charId: string) => {
    const char = CHARACTERS.find(c => c.id === charId) || null;
    saveProfile({ ...profile, character: char });
  }, [profile, saveProfile]);

  const selectHouse = useCallback((houseId: string) => {
    const house = HOUSES.find(h => h.id === houseId) || null;
    saveProfile({ ...profile, house });
  }, [profile, saveProfile]);

  const selectPet = useCallback((petId: string) => {
    const pet = PETS.find(p => p.id === petId) || null;
    saveProfile({ ...profile, pet });
  }, [profile, saveProfile]);

  const completeLevel = useCallback((levelId: string) => {
    const completed = [...new Set([...profile.completedLevels, levelId])];
    const world = WORLDS.find(w => w.levels.some(l => l.id === levelId));
    const levelIdx = world?.levels.findIndex(l => l.id === levelId) ?? -1;
    const newPets = [...profile.unlockedPets];
    
    // Unlock pets based on world completion
    if (world && levelIdx === 4) {
      PETS.forEach(p => {
        if (p.unlockWorld <= world.id && !newPets.includes(p.id)) {
          newPets.push(p.id);
        }
      });
    }

    saveProfile({
      ...profile,
      completedLevels: completed,
      unlockedPets: newPets,
      coins: profile.coins + (levelIdx === 4 ? 50 : 20),
    });
  }, [profile, saveProfile]);

  const startLevel = useCallback((worldId: number, levelIdx: number) => {
    saveProfile({ ...profile, currentWorld: worldId, currentLevel: levelIdx });
    setScreen("playing");
  }, [profile, saveProfile]);

  const resetGame = useCallback(() => {
    saveProfile(DEFAULT_PROFILE);
    setScreen("title");
  }, [saveProfile]);

  const hasSave = profile.username.length > 0;

  return {
    screen, setScreen,
    profile, saveProfile,
    setUsername, selectCharacter, selectHouse, selectPet,
    completeLevel, startLevel, resetGame,
    mentorMessage, setMentorMessage,
    hasSave,
  };
}
