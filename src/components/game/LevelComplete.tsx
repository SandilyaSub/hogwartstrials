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
      <div className="text-center space-y-8 max-w-md animate-bounce-in">
        <div className="card-illustrated p-10 space-y-6">
          <div className="text-7xl animate-float">
            {isFinalBoss ? "🏆" : isWorldComplete ? "⭐" : "✨"}
          </div>
          
          <div>
            <h2 className="font-display text-3xl font-bold text-primary text-glow">
              {isFinalBoss ? "YOU DEFEATED VOLDEMORT!" : isWorldComplete ? "World Complete!" : "Level Complete!"}
            </h2>
            <p className="text-foreground/55 mt-3 font-display font-medium">{level.name}</p>
            {isFinalBoss && (
              <p className="text-foreground/45 mt-4 italic font-body text-base leading-relaxed">
                "The boy who lived... has conquered the Dark Lord."
              </p>
            )}
          </div>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary/12 text-primary font-display font-semibold text-sm">
            +{levelIdx === 4 ? 50 : 20} 🪙
          </div>

          <div className="flex flex-col gap-3 pt-2">
            {!isFinalBoss && (
              <button
                onClick={onNextLevel}
                className="btn-storybook text-lg px-8 py-4 bg-primary text-primary-foreground animate-magic-pulse"
              >
                {isWorldComplete ? "🌍 Next World" : "➡️ Next Level"}
              </button>
            )}
            <button
              onClick={onWorldMap}
              className="btn-storybook px-8 py-3 border-2 border-border text-foreground/55 hover:text-foreground hover:border-primary/30 bg-transparent"
            >
              🗺️ World Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelComplete;
