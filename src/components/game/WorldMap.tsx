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
  const { theme, toggleTheme } = useTheme();

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
      <div className="max-w-3xl mx-auto">
        {/* Header card */}
        <div className="card-illustrated p-5 mb-5 animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center text-2xl">
                {profile.character?.emoji || "⚡"}
              </div>
              <div>
                <h1 className="font-display text-xl font-semibold text-primary text-glow">
                  {profile.username}
                </h1>
                <p className="text-sm text-muted-foreground font-body">
                  {profile.house?.name} · {profile.pet?.emoji || "No pet"} · 🪙 {profile.coins}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={toggleTheme} className="p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition-all duration-300 text-foreground/60 hover:text-foreground">
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              <button onClick={onOpenPetStore} className="p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition-all duration-300 text-foreground/60 hover:text-foreground font-display text-sm">
                🐾
              </button>
              <button onClick={() => setShowMentor(true)} className="p-2.5 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition-all duration-300 text-foreground/60 hover:text-foreground font-display text-sm">
                🧙
              </button>
              <button onClick={onResetGame} className="p-2.5 rounded-xl bg-secondary/60 border border-destructive/30 hover:border-destructive transition-all duration-300 text-destructive/60 hover:text-destructive font-display text-sm">
                ↺
              </button>
            </div>
          </div>
        </div>

        {/* Mentor popup */}
        {showMentor && (
          <div className="mb-4 card-illustrated p-5 box-glow animate-pop-in">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-display text-sm font-semibold text-primary">{profile.house?.mentor || "Albus Dumbledore"}</p>
                <p className="text-foreground/65 mt-2 italic font-body text-base leading-relaxed">"{randomQuote}"</p>
              </div>
              <button onClick={() => setShowMentor(false)} className="text-muted-foreground hover:text-foreground transition-colors p-1">✕</button>
            </div>
          </div>
        )}

        {/* Worlds */}
        <div className="space-y-3">
          {WORLDS.map((world, wi) => {
            const completedCount = world.levels.filter(l => profile.completedLevels.includes(l.id)).length;
            const isExpanded = expandedWorld === world.id;

            return (
              <div
                key={world.id}
                className="card-illustrated overflow-hidden animate-slide-up transition-all duration-300"
                style={{ animationDelay: `${wi * 0.06}s` }}
              >
                <button
                  onClick={() => setExpandedWorld(isExpanded ? null : world.id)}
                  className="w-full p-4 text-left flex items-center gap-4 hover:bg-secondary/20 transition-all duration-300"
                >
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: `${world.color}18` }}
                  >
                    {world.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-base font-semibold" style={{ color: world.color }}>
                      World {world.id}: {world.title}
                    </h3>
                    <p className="text-xs text-muted-foreground font-body truncate">{world.subtitle} · {completedCount}/5</p>
                  </div>
                  <div className="w-20 h-2.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${(completedCount / 5) * 100}%`, backgroundColor: world.color }}
                    />
                  </div>
                  <span className="text-muted-foreground text-sm transition-transform duration-300" style={{ transform: isExpanded ? "rotate(180deg)" : "" }}>▾</span>
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
                          className={`w-full p-3.5 rounded-xl text-left flex items-center gap-3 transition-all duration-300 animate-pop-in ${
                            completed ? "bg-magic-green/10 border-2 border-magic-green/25" :
                            unlocked ? "bg-secondary/40 border-2 border-border hover:border-primary/30 hover:bg-secondary/60" :
                            "bg-secondary/15 border-2 border-border/30 opacity-35 cursor-not-allowed"
                          }`}
                          style={{ animationDelay: `${idx * 0.05}s` }}
                        >
                          <span className="text-lg">{completed ? "✅" : level.isBoss ? "💀" : unlocked ? "🔓" : "🔒"}</span>
                          <div className="flex-1 min-w-0">
                            <p className="font-display text-sm font-medium text-foreground">{level.name}</p>
                            <p className="text-xs text-muted-foreground font-body truncate">{level.description}</p>
                          </div>
                          {level.isBoss && (
                            <span className="text-xs font-display font-semibold text-destructive px-2.5 py-1 rounded-full bg-destructive/10">
                              BOSS
                            </span>
                          )}
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
