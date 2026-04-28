import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  FESTIVAL_QUESTS,
  isFestivalActive,
  daysUntilFestival,
  getYearlyChapter,
  LEVELS_PER_QUEST,
  type FestivalQuest,
} from "@/lib/festivalQuests";
import type { PlayerProfile } from "@/hooks/useGameState";

interface FestivalsPanelProps {
  profile: PlayerProfile;
  onStartQuest: (questId: string) => void;
}

const FestivalsPanel = ({ profile, onStartQuest }: FestivalsPanelProps) => {
  const [open, setOpen] = useState(false);

  const activeCount = FESTIVAL_QUESTS.filter(
    (q) => isFestivalActive(q) && !profile.unlockedPets.includes(q.reward.petId)
  ).length;

  return (
    <div className="card-illustrated p-5 mb-5 animate-slide-up">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-3 text-left"
      >
        <div>
          <h2 className="font-display text-lg font-semibold text-primary text-glow flex items-center gap-2">
            <span>🎊</span> Festival Side-Quests
          </h2>
          <p className="text-xs text-muted-foreground font-body">
            Limited-time quests · exclusive cosmetic pets
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {activeCount > 0 && (
            <span className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground animate-pulse">
              {activeCount} LIVE
            </span>
          )}
          <ChevronDown
            className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="grid sm:grid-cols-2 gap-3 mt-4 animate-slide-up">
          {FESTIVAL_QUESTS.map((quest, i) => {
            const active = isFestivalActive(quest);
            const owned = profile.unlockedPets.includes(quest.reward.petId);
            const days = daysUntilFestival(quest);

            return (
              <FestivalCard
                key={quest.id}
                quest={quest}
                active={active}
                owned={owned}
                daysUntil={days}
                progress={profile.festivalProgress?.[quest.id] ?? 0}
                delay={i * 0.04}
                onStart={() => onStartQuest(quest.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

interface FestivalCardProps {
  quest: FestivalQuest;
  active: boolean;
  owned: boolean;
  daysUntil: number;
  progress: number;
  delay: number;
  onStart: () => void;
}

const FestivalCard = ({ quest, active, owned, daysUntil, progress, delay, onStart }: FestivalCardProps) => {
  const playable = active; // owned quests are still replayable while live
  const disabled = !playable;
  const { chapter, index, year, total } = getYearlyChapter(quest);

  return (
    <button
      onClick={() => !disabled && onStart()}
      disabled={disabled}
      className={`relative p-4 rounded-2xl text-left transition-all duration-300 animate-pop-in border-2 overflow-hidden group ${
        playable
          ? "border-transparent hover:scale-[1.02] cursor-pointer"
          : "border-border/30 opacity-60 cursor-not-allowed"
      }`}
      style={{
        animationDelay: `${delay}s`,
        background: playable
          ? `linear-gradient(135deg, ${quest.primaryColor}25, ${quest.secondaryColor}25)`
          : `linear-gradient(135deg, hsl(var(--secondary) / 0.4), hsl(var(--secondary) / 0.2))`,
        boxShadow: playable
          ? `0 0 24px ${quest.primaryColor}30, inset 0 0 0 1px ${quest.primaryColor}50`
          : undefined,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl drop-shadow-md">{quest.emoji}</span>
        {owned ? (
          <span
            className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full"
            style={{ background: "hsl(var(--magic-green) / 0.2)", color: "hsl(var(--magic-green))" }}
          >
            ✓ COMPLETED
          </span>
        ) : active ? (
          <span
            className="text-[10px] font-display font-bold px-2 py-0.5 rounded-full animate-pulse"
            style={{ background: quest.primaryColor, color: "white" }}
          >
            LIVE NOW
          </span>
        ) : (
          <span className="text-[10px] font-display font-semibold px-2 py-0.5 rounded-full bg-muted/40 text-muted-foreground">
            in {daysUntil}d
          </span>
        )}
      </div>

      <h3 className="font-display text-sm font-bold mb-0.5" style={{ color: quest.primaryColor }}>
        {quest.name}
      </h3>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-display mb-1">
        {year} · {chapter.subtitle} · {index + 1}/{total}
      </p>
      <p className="text-xs text-muted-foreground font-body line-clamp-2 mb-2">
        {chapter.description}
      </p>

      {/* Quest progress (15-level campaign) — hidden once reward is earned */}
      {playable && !owned && (
        <div className="mb-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] uppercase tracking-wide font-display text-muted-foreground">
              {progress > 0 ? `Resume · ${progress}/${LEVELS_PER_QUEST}` : `Level 1/${LEVELS_PER_QUEST}`}
            </span>
            <span
              className="text-[10px] font-display font-bold"
              style={{ color: quest.primaryColor }}
            >
              {Math.round((progress / LEVELS_PER_QUEST) * 100)}%
            </span>
          </div>
          <div className="w-full h-1 rounded-full bg-muted/40 overflow-hidden">
            <div
              className="h-full transition-all"
              style={{
                width: `${(progress / LEVELS_PER_QUEST) * 100}%`,
                background: `linear-gradient(90deg, ${quest.primaryColor}, ${quest.secondaryColor})`,
              }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 pt-2 border-t border-border/20">
        <img
          src={quest.reward.petImg}
          alt={quest.reward.petName}
          loading="lazy"
          width={32}
          height={32}
          className="w-8 h-8 object-contain"
          style={{ filter: owned || active ? "none" : "grayscale(0.8)" }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-display">
            {owned ? "Replay for fun" : "Reward"}
          </p>
          <p className="text-xs font-display font-semibold truncate text-foreground">
            {quest.reward.petName}
          </p>
        </div>
        {playable && (
          <span className="text-xs font-display font-bold" style={{ color: quest.primaryColor }}>
            {owned ? "REPLAY ▸" : progress > 0 ? "RESUME ▸" : "PLAY ▸"}
          </span>
        )}
      </div>
    </button>
  );
};

export default FestivalsPanel;
