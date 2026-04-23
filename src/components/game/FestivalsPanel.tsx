import { FESTIVAL_QUESTS, isFestivalActive, daysUntilFestival, type FestivalQuest } from "@/lib/festivalQuests";
import type { PlayerProfile } from "@/hooks/useGameState";

interface FestivalsPanelProps {
  profile: PlayerProfile;
  onStartQuest: (questId: string) => void;
}

const FestivalsPanel = ({ profile, onStartQuest }: FestivalsPanelProps) => {
  return (
    <div className="card-illustrated p-5 mb-5 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-lg font-semibold text-primary text-glow flex items-center gap-2">
            <span>🎊</span> Festival Side-Quests
          </h2>
          <p className="text-xs text-muted-foreground font-body">
            Limited-time quests · exclusive cosmetic pets
          </p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
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
              delay={i * 0.06}
              onStart={() => onStartQuest(quest.id)}
            />
          );
        })}
      </div>
    </div>
  );
};

interface FestivalCardProps {
  quest: FestivalQuest;
  active: boolean;
  owned: boolean;
  daysUntil: number;
  delay: number;
  onStart: () => void;
}

const FestivalCard = ({ quest, active, owned, daysUntil, delay, onStart }: FestivalCardProps) => {
  const disabled = !active || owned;

  return (
    <button
      onClick={() => !disabled && onStart()}
      disabled={disabled}
      className={`relative p-4 rounded-2xl text-left transition-all duration-300 animate-pop-in border-2 overflow-hidden group ${
        active && !owned
          ? "border-transparent hover:scale-[1.02] cursor-pointer"
          : "border-border/30 opacity-60 cursor-not-allowed"
      }`}
      style={{
        animationDelay: `${delay}s`,
        background: active && !owned
          ? `linear-gradient(135deg, ${quest.primaryColor}25, ${quest.secondaryColor}25)`
          : `linear-gradient(135deg, hsl(var(--secondary) / 0.4), hsl(var(--secondary) / 0.2))`,
        boxShadow: active && !owned
          ? `0 0 24px ${quest.primaryColor}30, inset 0 0 0 1px ${quest.primaryColor}50`
          : undefined,
      }}
    >
      {/* Status pill */}
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

      <h3 className="font-display text-sm font-bold mb-1" style={{ color: quest.primaryColor }}>
        {quest.name}
      </h3>
      <p className="text-xs text-muted-foreground font-body line-clamp-2 mb-3">
        {quest.description}
      </p>

      {/* Reward preview */}
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
          <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-display">Reward</p>
          <p className="text-xs font-display font-semibold truncate text-foreground">
            {quest.reward.petName}
          </p>
        </div>
        {active && !owned && (
          <span className="text-xs font-display font-bold" style={{ color: quest.primaryColor }}>
            PLAY ▸
          </span>
        )}
      </div>
    </button>
  );
};

export default FestivalsPanel;
