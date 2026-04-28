import { FESTIVAL_QUESTS, LEVELS_PER_QUEST } from "@/lib/festivalQuests";
import type { PlayerProfile } from "@/hooks/useGameState";

interface FestivalRewardsGalleryProps {
  profile: PlayerProfile;
  onSelectPet: (petId: string) => void;
  onBack: () => void;
}

const FestivalRewardsGallery = ({ profile, onSelectPet, onBack }: FestivalRewardsGalleryProps) => {
  const equippedPetId = profile.pet?.id;

  return (
    <div className="min-h-[100dvh] bg-background p-4 sm:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl font-bold text-primary text-glow flex items-center gap-2">
              <span>🏆</span> Festival Rewards
            </h1>
            <p className="text-xs text-muted-foreground font-body">
              Cosmetic pets earned from limited-time festival quests
            </p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-secondary/60 border border-border hover:border-primary/30 transition font-display text-sm"
          >
            ← Back
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {FESTIVAL_QUESTS.map((quest) => {
            const owned = profile.unlockedPets.includes(quest.reward.petId);
            const progress = profile.festivalProgress?.[quest.id] ?? 0;
            const equipped = equippedPetId === quest.reward.petId;
            const pct = Math.min(100, (progress / LEVELS_PER_QUEST) * 100);

            return (
              <div
                key={quest.id}
                className="card-illustrated p-4 animate-pop-in"
                style={{
                  background: owned
                    ? `linear-gradient(135deg, ${quest.primaryColor}20, ${quest.secondaryColor}20)`
                    : undefined,
                  boxShadow: owned ? `0 0 20px ${quest.primaryColor}25` : undefined,
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={quest.reward.petImg}
                    alt={quest.reward.petName}
                    loading="lazy"
                    width={56}
                    height={56}
                    className="w-14 h-14 object-contain"
                    style={{ filter: owned ? "none" : "grayscale(1) opacity(0.4)" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-sm font-bold truncate" style={{ color: quest.primaryColor }}>
                      {quest.reward.petName}
                    </p>
                    <p className="text-[11px] text-muted-foreground font-body truncate">
                      {quest.emoji} {quest.name}
                    </p>
                  </div>
                </div>

                {owned ? (
                  <button
                    onClick={() => onSelectPet(quest.reward.petId)}
                    disabled={equipped}
                    className={`w-full px-3 py-2 rounded-xl font-display text-xs font-semibold transition ${
                      equipped
                        ? "bg-primary/20 text-primary border border-primary/40 cursor-default"
                        : "btn-primary"
                    }`}
                  >
                    {equipped ? "✓ Equipped" : "Equip Pet"}
                  </button>
                ) : (
                  <>
                    <div className="w-full h-1.5 rounded-full bg-muted/40 overflow-hidden mb-1">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${quest.primaryColor}, ${quest.secondaryColor})`,
                        }}
                      />
                    </div>
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground font-display">
                      {progress}/{LEVELS_PER_QUEST} levels · locked
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FestivalRewardsGallery;
