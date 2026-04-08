import { WORLDS } from "@/lib/gameData";

interface LevelCompleteProps {
  worldId: number;
  levelIdx: number;
  isFinalBoss: boolean;
  onNextLevel: () => void;
  onWorldMap: () => void;
}

const LevelComplete = ({ worldId, levelIdx, isFinalBoss, onNextLevel, onWorldMap }: LevelCompleteProps) => {
  const world = WORLDS[worldId - 1];
  const level = world.levels[levelIdx];
  const isWorldComplete = levelIdx === 4;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-6xl animate-float">
          {isFinalBoss ? "🏆" : isWorldComplete ? "⭐" : "✨"}
        </div>
        
        <div>
          <h2 className="font-display text-3xl text-primary text-glow">
            {isFinalBoss ? "YOU DEFEATED VOLDEMORT!" : isWorldComplete ? "World Complete!" : "Level Complete!"}
          </h2>
          <p className="text-foreground/60 mt-2 font-display">{level.name}</p>
          {isFinalBoss && (
            <p className="text-foreground/50 mt-4 italic">
              "The boy who lived... has conquered the Dark Lord."
            </p>
          )}
        </div>

        <div className="text-primary text-sm font-display">+{levelIdx === 4 ? 50 : 20} 🪙</div>

        <div className="flex flex-col gap-3">
          {!isFinalBoss && (
            <button
              onClick={onNextLevel}
              className="font-display text-lg px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all tracking-wider animate-magic-pulse"
            >
              {isWorldComplete ? "Next World" : "Next Level"}
            </button>
          )}
          <button
            onClick={onWorldMap}
            className="font-display px-8 py-3 rounded-lg border border-border text-foreground/60 hover:text-foreground hover:border-primary/30 transition-all"
          >
            World Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelComplete;
