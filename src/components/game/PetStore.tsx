import { PETS } from "@/lib/gameData";
import type { PlayerProfile } from "@/hooks/useGameState";

import owlImg from "@/assets/pets/owl.png";
import catImg from "@/assets/pets/cat.png";
import toadImg from "@/assets/pets/toad.png";
import ratImg from "@/assets/pets/rat.png";
import phoenixImg from "@/assets/pets/phoenix.png";
import hippogriffImg from "@/assets/pets/hippogriff.png";
import thestralImg from "@/assets/pets/thestral.png";
import dragonImg from "@/assets/pets/dragon.png";
import nifflerImg from "@/assets/pets/niffler.png";
import basiliskImg from "@/assets/pets/basilisk.png";
import occamyImg from "@/assets/pets/occamy.png";
import grimImg from "@/assets/pets/grim.png";
import spectreCatImg from "@/assets/festivals/pet_spectre_cat.png";
import yuleFoxImg from "@/assets/festivals/pet_yule_fox.png";
import diyaPeacockImg from "@/assets/festivals/pet_diya_peacock.png";
import amourFawnImg from "@/assets/festivals/pet_amour_fawn.png";

const PET_IMAGES: Record<string, string> = {
  owl: owlImg, cat: catImg, toad: toadImg, rat: ratImg,
  phoenix: phoenixImg, hippogriff: hippogriffImg, thestral: thestralImg,
  dragon: dragonImg, niffler: nifflerImg, basilisk: basiliskImg,
  occamy: occamyImg, grim: grimImg,
  festival_spectre_cat: spectreCatImg,
  festival_yule_fox: yuleFoxImg,
  festival_diya_peacock: diyaPeacockImg,
  festival_amour_fawn: amourFawnImg,
};

interface PetStoreProps {
  profile: PlayerProfile;
  onSelectPet: (petId: string) => void;
  onPurchasePet?: (petId: string, cost: number) => void;
  onBack: () => void;
}

const PetStore = ({ profile, onSelectPet, onPurchasePet, onBack }: PetStoreProps) => {
  const standardPets = PETS.filter(p => !p.legendary && !p.festival);
  const legendaryPets = PETS.filter(p => p.legendary);
  const festivalPets = PETS.filter(p => p.festival);

  const renderPet = (pet: typeof PETS[number], i: number) => {
    const unlocked = profile.unlockedPets.includes(pet.id);
    const equipped = profile.pet?.id === pet.id;
    const isLegendary = !!pet.legendary;
    const canAfford = pet.cost ? profile.coins >= pet.cost : false;

    const handleClick = () => {
      if (equipped) return;
      if (unlocked) {
        onSelectPet(pet.id);
      } else if (isLegendary && pet.cost && canAfford && onPurchasePet) {
        onPurchasePet(pet.id, pet.cost);
      }
    };

    const clickable = unlocked || (isLegendary && canAfford);

    return (
      <button
        key={pet.id}
        onClick={handleClick}
        disabled={!clickable && !isLegendary}
        className={`card-illustrated p-5 text-left transition-all duration-300 animate-pop-in relative overflow-hidden ${
          equipped ? "!border-primary box-glow !bg-primary/8" :
          unlocked ? "hover:border-primary/30 hover:scale-[1.02]" :
          isLegendary && canAfford ? "hover:border-primary/40 hover:scale-[1.02] !border-primary/20" :
          isLegendary ? "!opacity-60 cursor-not-allowed !border-primary/15" :
          "!opacity-40 cursor-not-allowed"
        }`}
        style={{ animationDelay: `${i * 0.06}s` }}
      >
        {isLegendary && !unlocked && (
          <span className="absolute top-2 right-2 text-[10px] font-display font-bold tracking-wider px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30">
            ✨ LEGENDARY
          </span>
        )}
        <div className="flex items-center gap-3">
          <img
            src={PET_IMAGES[pet.id]}
            alt={pet.name}
            className={`w-14 h-14 rounded-xl object-cover ${isLegendary ? "ring-2 ring-primary/40" : ""}`}
            loading="lazy"
            width={1024}
            height={1024}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-foreground truncate">{pet.name}</h3>
            <p className="text-xs text-primary font-body font-medium">{pet.ability}</p>
          </div>
          {equipped && (
            <span className="text-xs font-display font-semibold text-primary px-2.5 py-1 rounded-full bg-primary/12 shrink-0">
              EQUIPPED
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground font-body mt-2 leading-relaxed">{pet.description}</p>

        {!unlocked && isLegendary && pet.cost && (
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className={`text-sm font-display font-semibold ${canAfford ? "text-primary" : "text-muted-foreground/70"}`}>
              🪙 {pet.cost.toLocaleString()}
            </span>
            <span className={`text-xs font-display font-semibold px-2.5 py-1 rounded-full ${
              canAfford ? "bg-primary/15 text-primary" : "bg-muted/30 text-muted-foreground"
            }`}>
              {canAfford ? "TAP TO BUY" : "NOT ENOUGH"}
            </span>
          </div>
        )}
        {!unlocked && !isLegendary && (
          <p className="text-xs text-muted-foreground/50 mt-2 font-body">🔒 Unlocks after World {pet.unlockWorld}</p>
        )}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6 animate-slide-up pb-8">
        <div className="card-illustrated p-5 flex items-center gap-4">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground font-display transition-colors text-lg">←</button>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold text-primary text-glow">🐾 Magical Pet Store</h2>
            <p className="text-sm text-muted-foreground font-body">Choose a companion for your journey</p>
          </div>
          <div className="text-right shrink-0">
            <div className="text-xs text-muted-foreground font-body">Coins</div>
            <div className="font-display text-lg font-semibold text-primary">🪙 {profile.coins.toLocaleString()}</div>
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">Companions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {standardPets.map((p, i) => renderPet(p, i))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-primary uppercase tracking-wider mb-3 px-1 text-glow">✨ Legendary Pets</h3>
          <p className="text-xs text-muted-foreground font-body mb-3 px-1">Rare magical creatures, purchased with coins</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {legendaryPets.map((p, i) => renderPet(p, i))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetStore;
