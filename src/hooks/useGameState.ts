import { useState, useCallback, useEffect } from "react";
import { CHARACTERS, HOUSES, PETS, WORLDS, type Character, type House, type Pet } from "@/lib/gameData";
import { supabase } from "@/integrations/supabase/client";
import type { ShopItem } from "@/lib/shopData";
import type { User } from "@supabase/supabase-js";

export type GameScreen = "title" | "auth" | "profile" | "character" | "house" | "worldmap" | "petstore" | "shop" | "feedback" | "settings" | "levelIntro" | "playing" | "levelComplete" | "gameOver" | "tutorial" | "leaderboard";

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
  purchasedUpgrades: Record<string, boolean>;
  activeTheme: string;
  activeSong: string;
  tutorialCompleted: boolean;
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
  purchasedUpgrades: {},
  activeTheme: "dark",
  activeSong: "default",
  tutorialCompleted: false,
};

export function useGameState(user: User | null) {
  const [screen, setScreen] = useState<GameScreen>(user ? "title" : "auth");
  const [profile, setProfile] = useState<PlayerProfile>(DEFAULT_PROFILE);
  const [dbLoaded, setDbLoaded] = useState(false);

  // Load profile from DB when user signs in
  useEffect(() => {
    if (!user) {
      setProfile(DEFAULT_PROFILE);
      setScreen("auth");
      setDbLoaded(false);
      return;
    }

    const loadProfile = async () => {
      const { data, error } = await supabase
        .from("game_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data && !error) {
        const char = data.character_id ? CHARACTERS.find(c => c.id === data.character_id) || null : null;
        const house = data.house_id ? HOUSES.find(h => h.id === data.house_id) || null : null;
        const pet = data.pet_id ? PETS.find(p => p.id === data.pet_id) || null : null;

        setProfile({
          username: data.username || "",
          character: char,
          house: house,
          pet: pet,
          unlockedPets: data.unlocked_pets || ["owl", "cat"],
          currentWorld: data.current_world || 1,
          currentLevel: data.current_level || 0,
          completedLevels: data.completed_levels || [],
          coins: data.coins || 0,
          lives: data.lives || 3,
          purchasedUpgrades: (data.purchased_upgrades as Record<string, boolean>) || {},
          activeTheme: data.active_theme || "dark",
          activeSong: (data as any).active_song || "default",
          tutorialCompleted: (data as any).tutorial_completed || false,
        });
      }
      setDbLoaded(true);
      setScreen("title");
    };

    loadProfile();
  }, [user]);

  // Save to DB
  const saveProfile = useCallback(async (p: PlayerProfile) => {
    setProfile(p);
    if (!user) return;

    await supabase.from("game_profiles").update({
      username: p.username,
      character_id: p.character?.id || null,
      house_id: p.house?.id || null,
      pet_id: p.pet?.id || null,
      unlocked_pets: p.unlockedPets,
      current_world: p.currentWorld,
      current_level: p.currentLevel,
      completed_levels: p.completedLevels,
      coins: p.coins,
      lives: p.lives,
      purchased_upgrades: p.purchasedUpgrades,
      active_theme: p.activeTheme,
      active_song: p.activeSong,
      tutorial_completed: p.tutorialCompleted,
    } as any).eq("user_id", user.id);
  }, [user]);

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
      coins: profile.coins + (levelIdx === 4 ? 50 : 20) * (profile.purchasedUpgrades?.["double_coins"] ? 2 : 1),
    });
  }, [profile, saveProfile]);

  const startLevel = useCallback((worldId: number, levelIdx: number) => {
    saveProfile({ ...profile, currentWorld: worldId, currentLevel: levelIdx });
    setScreen("levelIntro");
  }, [profile, saveProfile]);

  const purchaseItem = useCallback(async (item: ShopItem) => {
    if (profile.coins < item.cost) return;
    const newUpgrades = { ...profile.purchasedUpgrades, [item.id]: true };
    const newTheme = item.type === "theme" ? item.id : profile.activeTheme;
    const newSong = item.type === "song" ? item.id : profile.activeSong;
    saveProfile({
      ...profile,
      coins: profile.coins - item.cost,
      purchasedUpgrades: newUpgrades,
      activeTheme: newTheme,
      activeSong: newSong,
    });

    if (user) {
      await supabase.from("shop_purchases").insert({
        user_id: user.id,
        item_id: item.id,
        item_type: item.type,
        cost: item.cost,
      });
    }
  }, [profile, saveProfile, user]);

  const resetGame = useCallback(() => {
    const reset = { ...DEFAULT_PROFILE, purchasedUpgrades: profile.purchasedUpgrades, activeTheme: profile.activeTheme, activeSong: profile.activeSong };
    saveProfile(reset);
    setScreen("title");
  }, [saveProfile, profile.purchasedUpgrades, profile.activeTheme]);

  const hasSave = profile.username.length > 0;

  return {
    screen, setScreen,
    profile, saveProfile,
    setUsername, selectCharacter, selectHouse, selectPet,
    completeLevel, startLevel, resetGame, purchaseItem,
    hasSave, dbLoaded,
  };
}
