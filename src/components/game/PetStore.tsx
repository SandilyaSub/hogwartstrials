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
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground font-display">← Back</button>
          <div>
            <h2 className="font-display text-2xl text-primary text-glow">🐾 Magical Pet Store</h2>
            <p className="text-sm text-muted-foreground">Choose a companion for your journey</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {PETS.map((pet) => {
            const unlocked = profile.unlockedPets.includes(pet.id);
            const equipped = profile.pet?.id === pet.id;

            return (
              <button
                key={pet.id}
                onClick={() => unlocked && onSelectPet(pet.id)}
                disabled={!unlocked}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  equipped ? "border-primary box-glow bg-primary/10" :
                  unlocked ? "border-border hover:border-primary/30 bg-card" :
                  "border-border/50 bg-card/50 opacity-50 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{pet.emoji}</span>
                  <div>
                    <h3 className="font-display text-foreground">{pet.name}</h3>
                    <p className="text-xs text-primary">{pet.ability}</p>
                  </div>
                  {equipped && <span className="ml-auto text-xs font-display text-primary">EQUIPPED</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{pet.description}</p>
                {!unlocked && (
                  <p className="text-xs text-muted-foreground/60 mt-1">🔒 Unlocks after World {pet.unlockWorld}</p>
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
