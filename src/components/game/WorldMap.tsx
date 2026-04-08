import { WORLDS, MENTOR_QUOTES } from "@/lib/gameData";
import type { PlayerProfile } from "@/hooks/useGameState";
import { useState } from "react";
import { useTheme } from "@/hooks/useTheme";

interface WorldMapProps {
  profile: PlayerProfile;
  onStartLevel: (worldId: number, levelIdx: number) => void;
  onOpenPetStore: () => void;
  onResetGame: () => void;
}

const WorldMap = ({ profile, onStartLevel, onOpenPetStore, onResetGame }: WorldMapProps) => {
  const [expandedWorld, setExpandedWorld] = useState<number | null>(null);
  const [showMentor, setShowMentor] = useState(false);

  const isLevelUnlocked = (worldId: number, levelIdx: number) => {
    if (worldId === 1 && levelIdx === 0) return true;
    const prevLevelId = levelIdx > 0
      ? WORLDS[worldId - 1].levels[levelIdx - 1].id
      : WORLDS[worldId - 2]?.levels[4]?.id;
    return prevLevelId ? profile.completedLevels.includes(prevLevelId) : false;
  };

  const mentorQuotes = MENTOR_QUOTES[profile.house?.id || "dumbledore"] || MENTOR_QUOTES.dumbledore;
  const randomQuote = mentorQuotes[Math.floor(Math.random() * mentorQuotes.length)];

  return (
    <div className="min-h-screen bg-background p-4 overflow-y-auto">
      {/* Header */}
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-primary text-glow">
              {profile.character?.emoji} {profile.username}
            </h1>
            <p className="text-sm text-muted-foreground">
              {profile.house?.name} · {profile.pet?.emoji || "No pet"} · 🪙 {profile.coins}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={onOpenPetStore} className="text-sm px-3 py-1.5 rounded bg-card border border-border hover:border-primary/30 font-display text-foreground/70">
              🐾 Pets
            </button>
            <button onClick={() => setShowMentor(true)} className="text-sm px-3 py-1.5 rounded bg-card border border-border hover:border-primary/30 font-display text-foreground/70">
              🧙 Mentor
            </button>
            <button onClick={onResetGame} className="text-sm px-3 py-1.5 rounded bg-card border border-destructive/30 hover:border-destructive font-display text-destructive/70">
              Reset
            </button>
          </div>
        </div>

        {/* Mentor popup */}
        {showMentor && (
          <div className="mb-4 p-4 rounded-lg bg-card border border-primary/30 box-glow">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-display text-sm text-primary">{profile.house?.mentor || "Albus Dumbledore"}</p>
                <p className="text-foreground/70 mt-1 italic">"{randomQuote}"</p>
              </div>
              <button onClick={() => setShowMentor(false)} className="text-muted-foreground hover:text-foreground">✕</button>
            </div>
          </div>
        )}

        {/* Worlds */}
        <div className="space-y-3">
          {WORLDS.map((world) => {
            const completedCount = world.levels.filter(l => profile.completedLevels.includes(l.id)).length;
            const isExpanded = expandedWorld === world.id;

            return (
              <div key={world.id} className="rounded-lg border border-border bg-card overflow-hidden">
                <button
                  onClick={() => setExpandedWorld(isExpanded ? null : world.id)}
                  className="w-full p-4 text-left flex items-center gap-3 hover:bg-secondary/30 transition-colors"
                >
                  <span className="text-2xl">{world.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-display text-lg" style={{ color: world.color }}>
                      World {world.id}: {world.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">{world.subtitle} · {completedCount}/5 completed</p>
                  </div>
                  <div className="w-16 h-2 rounded-full bg-secondary overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${(completedCount / 5) * 100}%`, backgroundColor: world.color }} />
                  </div>
                  <span className="text-muted-foreground">{isExpanded ? "▲" : "▼"}</span>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-2">
                    {world.levels.map((level, idx) => {
                      const unlocked = isLevelUnlocked(world.id, idx);
                      const completed = profile.completedLevels.includes(level.id);

                      return (
                        <button
                          key={level.id}
                          onClick={() => unlocked && onStartLevel(world.id, idx)}
                          disabled={!unlocked}
                          className={`w-full p-3 rounded text-left flex items-center gap-3 transition-all ${
                            completed ? "bg-magic-green/10 border border-magic-green/30" :
                            unlocked ? "bg-secondary/50 border border-border hover:border-primary/40" :
                            "bg-secondary/20 border border-border/50 opacity-40 cursor-not-allowed"
                          }`}
                        >
                          <span className="text-lg">{completed ? "✅" : level.isBoss ? "💀" : unlocked ? "🔓" : "🔒"}</span>
                          <div className="flex-1">
                            <p className="font-display text-sm text-foreground">{level.name}</p>
                            <p className="text-xs text-muted-foreground">{level.description}</p>
                          </div>
                          {level.isBoss && <span className="text-xs font-display text-destructive">BOSS</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WorldMap;
