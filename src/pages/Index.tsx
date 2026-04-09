import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useGameState } from "@/hooks/useGameState";
import { WORLDS } from "@/lib/gameData";
import { setSong } from "@/lib/musicEngine";
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

const Index = () => {
  const { user, loading, signUp, signIn, signOut } = useAuth();
  const {
    screen, setScreen,
    profile, saveProfile,
    setUsername, selectCharacter, selectHouse, selectPet,
    completeLevel, startLevel, resetGame, purchaseItem,
    hasSave, dbLoaded,
  } = useGameState(user);

  // Sync active song with music engine
  useEffect(() => {
    setSong(profile.activeSong || "default");
  }, [profile.activeSong]);

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
        :root, :root.light {
          --primary: ${primary} !important;
          --primary-foreground: ${background} !important;
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
          --muted-foreground: 50 20% 50% !important;
          --secondary: ${card} !important;
          --secondary-foreground: 50 40% 92% !important;
          --accent: ${primary} !important;
          --accent-foreground: 50 40% 92% !important;
          --sidebar-background: ${background} !important;
          --sidebar-primary: ${primary} !important;
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

  switch (screen) {
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
          onNewGame={() => { resetGame(); setScreen("profile"); }}
          onContinue={() => setScreen("worldmap")}
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
        <HouseSelect onSelect={(id) => { selectHouse(id); setScreen("worldmap"); }} />
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
          onActivateSong={(songId) => {
            saveProfile({ ...profile, activeSong: songId });
          }}
          onBack={() => setScreen("worldmap")}
        />
      );

    case "petstore":
      return (
        <PetStore
          profile={profile}
          onSelectPet={selectPet}
          onBack={() => setScreen("worldmap")}
        />
      );

    case "shop":
      return (
        <Shop
          profile={profile}
          onPurchase={purchaseItem}
          onActivate={(item) => {
            const updates: Partial<typeof profile> = {};
            if (item.type === "theme") updates.activeTheme = item.id;
            if (item.type === "song") updates.activeSong = item.id;
            saveProfile({ ...profile, ...updates });
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
          onComplete={() => {
            completeLevel(currentLevel.id);
            setScreen("levelComplete");
          }}
          onDeath={() => setScreen("gameOver")}
          onBack={() => setScreen("worldmap")}
        />
      );

    case "levelComplete": {
      const isFinalBoss = profile.currentWorld === 7 && profile.currentLevel === 4;
      return (
        <LevelComplete
          worldId={profile.currentWorld}
          levelIdx={profile.currentLevel}
          isFinalBoss={isFinalBoss}
          onNextLevel={() => {
            if (profile.currentLevel < 4) {
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
          onRetry={() => startLevel(profile.currentWorld, profile.currentLevel)}
          onWorldMap={() => setScreen("worldmap")}
        />
      );

    default:
      return null;
  }
};

export default Index;
