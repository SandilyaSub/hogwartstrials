import { useAuth } from "@/hooks/useAuth";
import { useGameState } from "@/hooks/useGameState";
import { WORLDS } from "@/lib/gameData";
import AuthScreen from "@/components/game/AuthScreen";
import TitleScreen from "@/components/game/TitleScreen";
import ProfileCreation from "@/components/game/ProfileCreation";
import CharacterSelect from "@/components/game/CharacterSelect";
import HouseSelect from "@/components/game/HouseSelect";
import WorldMap from "@/components/game/WorldMap";
import PetStore from "@/components/game/PetStore";
import Shop from "@/components/game/Shop";
import GameCanvas from "@/components/game/GameCanvas";
import LevelComplete from "@/components/game/LevelComplete";
import GameOver from "@/components/game/GameOver";

const Index = () => {
  const { user, loading, signUp, signIn, signOut } = useAuth();
  const {
    screen, setScreen,
    profile,
    setUsername, selectCharacter, selectHouse, selectPet,
    completeLevel, startLevel, resetGame, purchaseItem,
    hasSave, dbLoaded,
  } = useGameState(user);

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
          onResetGame={resetGame}
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
          onBack={() => setScreen("worldmap")}
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
