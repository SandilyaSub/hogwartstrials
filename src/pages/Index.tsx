import { useEffect, useState, useRef } from "react";
import type { DeathReason } from "@/components/game/GameOver";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useGameState } from "@/hooks/useGameState";
import { WORLDS } from "@/lib/gameData";

import { SHOP_ITEMS } from "@/lib/shopData";
import AuthScreen from "@/components/game/AuthScreen";
import TitleScreen from "@/components/game/TitleScreen";
import ProfileCreation from "@/components/game/ProfileCreation";
import CharacterSelect from "@/components/game/CharacterSelect";
import HouseSelect from "@/components/game/HouseSelect";
import WorldMap from "@/components/game/WorldMap";
import PetStore from "@/components/game/PetStore";
import Shop from "@/components/game/Shop";
import Feedback from "@/components/game/Feedback";
import SettingsScreen from "@/components/game/SettingsScreen";
import LevelIntro from "@/components/game/LevelIntro";
import GameCanvas from "@/components/game/GameCanvas";
import LevelComplete from "@/components/game/LevelComplete";
import GameOver from "@/components/game/GameOver";
import Tutorial from "@/components/game/Tutorial";
import HouseLeaderboard from "@/components/game/HouseLeaderboard";
import FestivalQuestCanvas from "@/components/game/FestivalQuestCanvas";
import FestivalRewardsGallery from "@/components/game/FestivalRewardsGallery";
import Social from "@/components/game/Social";
import { getFestivalById, getYearlyChapter, LEVELS_PER_QUEST } from "@/lib/festivalQuests";

const Index = () => {
  const { user, loading, signUp, signIn, signOut } = useAuth();
  const {
    screen, setScreen,
    profile, saveProfile,
    setUsername, selectCharacter, selectHouse, selectPet, purchasePet,
    completeLevel, startLevel, resetGame, purchaseItem,
    grantFestivalReward,
    advanceFestivalLevel,
    hasSave, dbLoaded,
  } = useGameState(user);

  // Active festival quest (set when player starts one from WorldMap)
  const [activeFestivalId, setActiveFestivalId] = useState<string | null>(null);
  const [activeFestivalLevel, setActiveFestivalLevel] = useState<number>(0);

  // Monday winner overlay
  const [mondayWinner, setMondayWinner] = useState<{ house_color: string; house_name: string; house_emoji: string } | null>(null);
  const deathReasonRef = useRef<DeathReason>("fall");

  useEffect(() => {
    const now = new Date();
    if (now.getUTCDay() !== 1) return; // Only on Mondays
    const day = now.getUTCDay();
    const diff = day === 0 ? -6 : 1 - day;
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() + diff);
    const weekStart = monday.toISOString().split("T")[0];

    supabase
      .from("house_cup_winners")
      .select("house_color, house_name, house_emoji")
      .eq("week_start", weekStart)
      .limit(1)
      .then(({ data }) => {
        if (data && data.length > 0) setMondayWinner(data[0] as any);
      });
  }, []);


  // Apply purchased theme colors to CSS variables
  useEffect(() => {
    const themeItem = SHOP_ITEMS.find(i => i.id === profile.activeTheme && i.type === "theme" && i.id !== "dark");
    const root = document.documentElement;
    if (themeItem?.themeColors) {
      const { primary, background, card } = themeItem.themeColors;
      // Add a custom class that overrides both :root and .light
      let styleEl = document.getElementById("custom-theme-style");
      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "custom-theme-style";
        document.head.appendChild(styleEl);
      }
      styleEl.textContent = `
        html, :root, :root.light, .light {
          --primary: ${primary} !important;
          --primary-foreground: 0 0% 100% !important;
          --background: ${background} !important;
          --foreground: 50 40% 92% !important;
          --card: ${card} !important;
          --card-foreground: 50 40% 92% !important;
          --popover: ${card} !important;
          --popover-foreground: 50 40% 92% !important;
          --ring: ${primary} !important;
          --border: ${card} !important;
          --input: ${card} !important;
          --muted: ${card} !important;
          --muted-foreground: 50 20% 55% !important;
          --secondary: ${card} !important;
          --secondary-foreground: 50 40% 92% !important;
          --accent: ${primary} !important;
          --accent-foreground: 50 40% 92% !important;
          --sidebar-background: ${background} !important;
          --sidebar-primary: ${primary} !important;
          --magic-glow: ${primary} !important;
        }
      `;
    } else {
      const styleEl = document.getElementById("custom-theme-style");
      if (styleEl) styleEl.textContent = "";
    }
  }, [profile.activeTheme]);

  if (loading || (user && !dbLoaded)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center animate-pulse">
          <div className="text-5xl mb-4">✨</div>
          <p className="font-display text-primary text-lg">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  const currentWorld = WORLDS[profile.currentWorld - 1];
  const currentLevel = currentWorld?.levels[profile.currentLevel];

  const renderScreen = () => { switch (screen) {
    case "auth":
      return (
        <AuthScreen onAuth={async (email, password, isSignUp) => {
          const err = isSignUp ? await signUp(email, password) : await signIn(email, password);
          return err?.message || null;
        }} />
      );

    case "title":
      return (
        <TitleScreen
          hasSave={hasSave}
          onContinue={() => setScreen(hasSave ? "worldmap" : "profile")}
          onSignOut={signOut}
        />
      );

    case "profile":
      return (
        <ProfileCreation onSubmit={(name) => { setUsername(name); setScreen("character"); }} />
      );

    case "character":
      return (
        <CharacterSelect onSelect={(id) => { selectCharacter(id); setScreen("house"); }} />
      );

    case "house":
      return (
        <HouseSelect onSelect={(id) => { selectHouse(id); setScreen("tutorial"); }} />
      );

    case "worldmap":
      return (
        <WorldMap
          profile={profile}
          onStartLevel={startLevel}
          onOpenPetStore={() => setScreen("petstore")}
          onOpenShop={() => setScreen("shop")}
          onOpenFeedback={() => setScreen("feedback")}
          onOpenSettings={() => setScreen("settings")}
          onOpenLeaderboard={() => setScreen("leaderboard")}
          onStartFestivalQuest={(questId) => {
            const startAt = profile.festivalProgress?.[questId] ?? 0;
            // If quest is already fully completed, replay from level 1.
            const lvl = startAt >= LEVELS_PER_QUEST ? 0 : startAt;
            setActiveFestivalId(questId);
            setActiveFestivalLevel(lvl);
            setScreen("festivalQuest");
          }}
          onOpenFestivalRewards={() => setScreen("festivalRewards")}
          onOpenSocial={() => setScreen("social")}
          onResetGame={resetGame}
        />
      );

    case "settings":
      return (
        <SettingsScreen
          profile={profile}
          onActivateTheme={(themeId) => {
            saveProfile({ ...profile, activeTheme: themeId });
          }}
          onSelectCharacter={selectCharacter}
          onActivatePremiumCharacter={(skinId) => {
            saveProfile({ ...profile, activeCharacterSkin: skinId });
          }}
          onBack={() => setScreen("worldmap")}
        />
      );

    case "petstore":
      return (
        <PetStore
          profile={profile}
          onSelectPet={selectPet}
          onPurchasePet={purchasePet}
          onBack={() => setScreen("worldmap")}
        />
      );

    case "shop":
      return (
        <Shop
          profile={profile}
          onPurchase={purchaseItem}
          onActivate={(item) => {
            if (item.type === "theme") {
              saveProfile({ ...profile, activeTheme: item.id });
            } else if (item.type === "character") {
              // Toggle premium character skin (deselect to revert to base character)
              const next = profile.activeCharacterSkin === item.id ? undefined : item.id;
              saveProfile({ ...profile, activeCharacterSkin: next });
            } else if (item.type === "accessory") {
              // Toggle accessory: replace any other accessory in the same slot
              const current = profile.activeAccessories || [];
              const isOn = current.includes(item.id);
              let next: string[];
              if (isOn) {
                next = current.filter(id => id !== item.id);
              } else {
                // Remove others sharing the same slot
                const slot = item.accessorySlot;
                const filtered = current.filter(id => {
                  const other = SHOP_ITEMS.find(s => s.id === id);
                  return other?.accessorySlot !== slot;
                });
                next = [...filtered, item.id];
              }
              saveProfile({ ...profile, activeAccessories: next });
            } else if (item.type === "upgrade" || item.type === "consumable") {
              // Toggle the effect on/off without losing the purchase
              const current = profile.activeUpgrades || {};
              const isOn = current[item.id] !== false; // default ON
              saveProfile({
                ...profile,
                activeUpgrades: { ...current, [item.id]: !isOn },
              });
            }
          }}
          onBack={() => setScreen("worldmap")}
        />
      );

    case "feedback":
      return (
        <Feedback
          userId={user?.id || ""}
          username={profile.username}
          onBack={() => setScreen("worldmap")}
        />
      );

    case "levelIntro":
      return (
        <LevelIntro
          worldId={profile.currentWorld}
          levelIdx={profile.currentLevel}
          onStart={() => setScreen("playing")}
        />
      );

    case "playing":
      return (
        <GameCanvas
          profile={profile}
          worldId={profile.currentWorld}
          levelIdx={profile.currentLevel}
          onComplete={(bonusCoins) => {
            completeLevel(currentLevel.id, bonusCoins || 0);
            setScreen("levelComplete");
          }}
          onDeath={(reason) => { deathReasonRef.current = reason; setScreen("gameOver"); }}
          onBack={() => setScreen("worldmap")}
        />
      );

    case "tutorial":
      return (
        <Tutorial
          profile={profile}
          onComplete={() => {
            saveProfile({ ...profile, tutorialCompleted: true });
            setScreen("worldmap");
          }}
        />
      );

    case "levelComplete": {
      const worldLevelCount = WORLDS[profile.currentWorld - 1]?.levels.length || 10;
      const isFinalBoss = profile.currentWorld === 7 && profile.currentLevel === worldLevelCount - 1;
      return (
        <LevelComplete
          worldId={profile.currentWorld}
          levelIdx={profile.currentLevel}
          isFinalBoss={isFinalBoss}
          onNextLevel={() => {
            if (profile.currentLevel < worldLevelCount - 1) {
              startLevel(profile.currentWorld, profile.currentLevel + 1);
            } else if (profile.currentWorld < 7) {
              startLevel(profile.currentWorld + 1, 0);
            } else {
              setScreen("worldmap");
            }
          }}
          onWorldMap={() => setScreen("worldmap")}
        />
      );
    }

    case "gameOver":
      return (
        <GameOver
          deathReason={deathReasonRef.current}
          onRetry={() => startLevel(profile.currentWorld, profile.currentLevel)}
          onWorldMap={() => setScreen("worldmap")}
        />
      );

    case "leaderboard":
      return (
        <HouseLeaderboard
          playerHouseId={profile.house?.id}
          onBack={() => setScreen("worldmap")}
        />
      );

    case "festivalQuest": {
      const quest = activeFestivalId ? getFestivalById(activeFestivalId) : undefined;
      if (!quest) {
        setScreen("worldmap");
        return null;
      }
      return (
        <FestivalQuestCanvas
          key={`${quest.id}-${activeFestivalLevel}`}
          quest={quest}
          levelIndex={activeFestivalLevel}
          houseId={profile.house?.id ?? null}
          onComplete={() => {
            const next = advanceFestivalLevel(quest.id, activeFestivalLevel, LEVELS_PER_QUEST);
            if (next === null) {
              grantFestivalReward(quest.reward.petId);
              setScreen("festivalComplete");
            } else {
              setScreen("festivalLevelComplete");
            }
          }}
          onExit={() => {
            setActiveFestivalId(null);
            setScreen("worldmap");
          }}
        />
      );
    }

    case "festivalLevelComplete": {
      const quest = activeFestivalId ? getFestivalById(activeFestivalId) : undefined;
      if (!quest) {
        setScreen("worldmap");
        return null;
      }
      const justCleared = activeFestivalLevel + 1;
      const isLast = justCleared >= LEVELS_PER_QUEST;
      return (
        <div
          className="fixed inset-0 flex items-center justify-center p-6"
          style={{
            background: `radial-gradient(ellipse at center, ${quest.primaryColor}30, hsl(var(--background)))`,
          }}
        >
          <div className="max-w-md w-full card-illustrated p-8 text-center animate-pop-in">
            <div className="text-5xl mb-3">{quest.emoji}</div>
            <p className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-1">
              {quest.name}
            </p>
            <h2 className="font-display text-2xl font-bold mb-2" style={{ color: quest.primaryColor }}>
              Level {justCleared}/{LEVELS_PER_QUEST} Cleared
            </h2>
            <div className="w-full h-2 rounded-full bg-muted/40 overflow-hidden mb-4">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${(justCleared / LEVELS_PER_QUEST) * 100}%`,
                  background: `linear-gradient(90deg, ${quest.primaryColor}, ${quest.secondaryColor})`,
                }}
              />
            </div>
            <p className="text-sm text-foreground/70 font-body mb-6">
              {LEVELS_PER_QUEST - justCleared} level{LEVELS_PER_QUEST - justCleared === 1 ? "" : "s"} until you unlock the <span className="font-semibold text-foreground">{quest.reward.petName}</span>!
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveFestivalId(null);
                  setScreen("worldmap");
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition font-display text-sm"
              >
                Map
              </button>
              <button
                onClick={() => {
                  if (isLast) {
                    grantFestivalReward(quest.reward.petId);
                    setScreen("festivalComplete");
                  } else {
                    setActiveFestivalLevel(activeFestivalLevel + 1);
                    setScreen("festivalQuest");
                  }
                }}
                className="flex-1 btn-primary font-display text-sm"
              >
                Next Level ▸
              </button>
            </div>
          </div>
        </div>
      );
    }

    case "festivalRewards":
      return (
        <FestivalRewardsGallery
          profile={profile}
          onSelectPet={selectPet}
          onBack={() => setScreen("worldmap")}
        />
      );

    case "festivalComplete": {
      const quest = activeFestivalId ? getFestivalById(activeFestivalId) : undefined;
      if (!quest) {
        setScreen("worldmap");
        return null;
      }
      const { chapter, year } = getYearlyChapter(quest);
      return (
        <div
          className="fixed inset-0 flex items-center justify-center p-6"
          style={{
            background: `radial-gradient(ellipse at center, ${quest.primaryColor}30, hsl(var(--background)))`,
          }}
        >
          <div className="max-w-md w-full card-illustrated p-8 text-center animate-pop-in">
            <div className="text-5xl mb-3 animate-bounce">{quest.emoji}</div>
            <p className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-1">
              Festival Quest Complete · {year}
            </p>
            <h2
              className="font-display text-2xl font-bold mb-1"
              style={{ color: quest.primaryColor }}
            >
              {quest.name}
            </h2>
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-display mb-4">
              {chapter.subtitle}
            </p>
            <p className="text-sm text-foreground/70 italic font-body mb-6">
              "{chapter.loreQuote}"
            </p>

            <div
              className="rounded-2xl p-4 mb-5"
              style={{
                background: `linear-gradient(135deg, ${quest.primaryColor}25, ${quest.secondaryColor}25)`,
                border: `2px solid ${quest.primaryColor}60`,
              }}
            >
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-display mb-2">
                Exclusive Reward Unlocked
              </p>
              <img
                src={quest.reward.petImg}
                alt={quest.reward.petName}
                width={96}
                height={96}
                className="w-24 h-24 mx-auto object-contain mb-2"
              />
              <p className="font-display text-lg font-semibold text-foreground">
                {quest.reward.petName}
              </p>
            </div>

            <p className="text-[11px] text-muted-foreground font-body mb-4">
              Equip it any time from the 🎁 <span className="font-semibold text-foreground">Festival Rewards</span> gallery on the World Map, or from the 🐾 Pet Store.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setActiveFestivalId(null);
                  setScreen("worldmap");
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition font-display text-sm"
              >
                Map
              </button>
              <button
                onClick={() => {
                  setActiveFestivalId(null);
                  setScreen("festivalRewards");
                }}
                className="flex-1 btn-primary font-display text-sm"
              >
                🎁 View Reward
              </button>
            </div>
          </div>
        </div>
      );
    }

    default:
      return null;
  }};

  return (
    <>
      {mondayWinner && (
        <div
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            background: `radial-gradient(ellipse at top, ${mondayWinner.house_color}18 0%, transparent 60%)`,
            borderTop: `3px solid ${mondayWinner.house_color}60`,
          }}
        />
      )}
      {renderScreen()}
    </>
  );
};

export default Index;
