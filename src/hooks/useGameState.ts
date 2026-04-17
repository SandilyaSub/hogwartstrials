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
  tutorialCompleted: boolean;
  /** Equipped premium character skin id (from shop). Falls back to base character. */
  activeCharacterSkin?: string;
  /** Equipped accessory ids (multiple, one per slot). */
  activeAccessories?: string[];
  /** Per-upgrade equip toggle. If a key is missing, the upgrade is considered ON (back-compat). */
  activeUpgrades?: Record<string, boolean>;
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
  tutorialCompleted: false,
  activeCharacterSkin: undefined,
  activeAccessories: [],
  activeUpgrades: {},
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

        // Local-only equipment state (skin + accessories + upgrade toggles) keyed by user id
        let activeCharacterSkin: string | undefined;
        let activeAccessories: string[] = [];
        let activeUpgrades: Record<string, boolean> = {};
        try {
          const raw = localStorage.getItem(`equip_${user.id}`);
          if (raw) {
            const parsed = JSON.parse(raw);
            activeCharacterSkin = parsed.activeCharacterSkin;
            activeAccessories = parsed.activeAccessories || [];
            activeUpgrades = parsed.activeUpgrades || {};
          }
        } catch {}

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
          tutorialCompleted: (data as any).tutorial_completed || false,
          activeCharacterSkin,
          activeAccessories,
          activeUpgrades,
        });
      }
      setDbLoaded(true);
      setScreen("title");
    };

    loadProfile();
  }, [user]);

  // Save to DB (and persist equipment locally)
  const saveProfile = useCallback(async (p: PlayerProfile) => {
    setProfile(p);
    if (!user) return;

    try {
      localStorage.setItem(`equip_${user.id}`, JSON.stringify({
        activeCharacterSkin: p.activeCharacterSkin,
        activeAccessories: p.activeAccessories || [],
        activeUpgrades: p.activeUpgrades || {},
      }));
    } catch {}

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

  const completeLevel = useCallback((levelId: string, bonusCoins: number = 0) => {
    const completed = [...new Set([...profile.completedLevels, levelId])];
    const world = WORLDS.find(w => w.levels.some(l => l.id === levelId));
    const levelIdx = world?.levels.findIndex(l => l.id === levelId) ?? -1;
    const newPets = [...profile.unlockedPets];

    if (world && levelIdx === world.levels.length - 1) {
      PETS.forEach(p => {
        if (p.unlockWorld <= world.id && !newPets.includes(p.id)) {
          newPets.push(p.id);
        }
      });
    }

    const baseCoins = (levelIdx === (world ? world.levels.length - 1 : -1) ? 50 : 20);
    const doubleOwned = !!profile.purchasedUpgrades?.["double_coins"];
    const doubleActive = profile.activeUpgrades?.["double_coins"] !== false; // default ON
    const multiplier = doubleOwned && doubleActive ? 2 : 1;
    const earned = baseCoins * multiplier + bonusCoins * multiplier;

    saveProfile({
      ...profile,
      completedLevels: completed,
      unlockedPets: newPets,
      coins: profile.coins + earned,
    });
  }, [profile, saveProfile]);

  const startLevel = useCallback((worldId: number, levelIdx: number) => {
    saveProfile({ ...profile, currentWorld: worldId, currentLevel: levelIdx });
    setScreen("levelIntro");
  }, [profile, saveProfile]);

  const purchaseItem = useCallback(async (item: ShopItem) => {
    if (profile.coins < item.cost) return;

    // Felix Felicis (extra_life) is a true one-shot consumable: grant +1 life immediately,
    // do NOT mark as owned so the user can buy it again.
    if (item.id === "extra_life") {
      saveProfile({
        ...profile,
        coins: profile.coins - item.cost,
        lives: Math.min(10, profile.lives + 1),
      });
      if (user) {
        await supabase.from("shop_purchases").insert({
          user_id: user.id,
          item_id: item.id,
          item_type: item.type,
          cost: item.cost,
        });
      }
      return;
    }

    const newUpgrades = { ...profile.purchasedUpgrades, [item.id]: true };
    const newTheme = item.type === "theme" ? item.id : profile.activeTheme;
    // Auto-equip newly purchased upgrades & consumables (so behavior matches user expectation right after buying)
    const newActiveUpgrades = { ...(profile.activeUpgrades || {}) };
    if (item.type === "upgrade" || item.type === "consumable") {
      newActiveUpgrades[item.id] = true;
    }
    saveProfile({
      ...profile,
      coins: profile.coins - item.cost,
      purchasedUpgrades: newUpgrades,
      activeTheme: newTheme,
      activeUpgrades: newActiveUpgrades,
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
    const reset = { ...DEFAULT_PROFILE, purchasedUpgrades: profile.purchasedUpgrades, activeTheme: profile.activeTheme };
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
