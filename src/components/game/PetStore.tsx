import { PETS } from "@/lib/gameData";
import type { PlayerProfile } from "@/hooks/useGameState";

interface PetStoreProps {
  profile: PlayerProfile;
  onSelectPet: (petId: string) => void;
  onBack: () => void;
}

const PetStore = ({ profile, onSelectPet, onBack }: PetStoreProps) => {
  return (
    <div className="min-h-screen bg-background p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
        <div className="card-illustrated p-5 flex items-center gap-4">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground font-display transition-colors text-lg">←</button>
          <div>
            <h2 className="font-display text-2xl font-semibold text-primary text-glow">🐾 Magical Pet Store</h2>
            <p className="text-sm text-muted-foreground font-body">Choose a companion for your journey</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PETS.map((pet, i) => {
            const unlocked = profile.unlockedPets.includes(pet.id);
            const equipped = profile.pet?.id === pet.id;

            return (
              <button
                key={pet.id}
                onClick={() => unlocked && onSelectPet(pet.id)}
                disabled={!unlocked}
                className={`card-illustrated p-5 text-left transition-all duration-300 animate-pop-in ${
                  equipped ? "!border-primary box-glow !bg-primary/8" :
                  unlocked ? "hover:border-primary/30 hover:scale-[1.02]" :
                  "!opacity-40 cursor-not-allowed"
                }`}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{pet.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-display font-semibold text-foreground">{pet.name}</h3>
                    <p className="text-xs text-primary font-body font-medium">{pet.ability}</p>
                  </div>
                  {equipped && (
                    <span className="text-xs font-display font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/12">
                      EQUIPPED
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-body mt-2 leading-relaxed">{pet.description}</p>
                {!unlocked && (
                  <p className="text-xs text-muted-foreground/50 mt-2 font-body">🔒 Unlocks after World {pet.unlockWorld}</p>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PetStore;
