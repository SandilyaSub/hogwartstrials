import { useState } from "react";
import { CHARACTERS } from "@/lib/gameData";

import harryImg from "@/assets/characters/harry.png";
import hermioneImg from "@/assets/characters/hermione.png";
import ronImg from "@/assets/characters/ron.png";
import lunaImg from "@/assets/characters/luna.png";
import ginnyImg from "@/assets/characters/ginny.png";
import nevilleImg from "@/assets/characters/neville.png";
import dracoImg from "@/assets/characters/draco.png";
import cedricImg from "@/assets/characters/cedric.png";
import choImg from "@/assets/characters/cho.png";

const CHARACTER_IMAGES: Record<string, string> = {
  harry: harryImg,
  hermione: hermioneImg,
  ron: ronImg,
  luna: lunaImg,
  ginny: ginnyImg,
  neville: nevilleImg,
  draco: dracoImg,
  cedric: cedricImg,
  cho: choImg,
};

interface CharacterSelectProps {
  onSelect: (charId: string) => void;
}

const CharacterSelect = ({ onSelect }: CharacterSelectProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center bg-background p-4 overflow-y-auto py-8">
      <div className="max-w-3xl w-full space-y-8 text-center animate-slide-up">
        <div>
          <div className="text-5xl mb-3 animate-wiggle inline-block">🧙</div>
          <h2 className="font-display text-3xl font-bold text-primary text-glow">Choose Your Wizard</h2>
          <p className="text-foreground/55 mt-2 font-body text-lg">Select your character for this adventure</p>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
          {CHARACTERS.map((char, i) => (
            <button
              key={char.id}
              onClick={() => {
                setSelected(char.id);
                onSelect(char.id);
              }}
              className={`card-illustrated p-4 transition-all duration-300 text-center hover:scale-[1.03] animate-pop-in ${
                selected === char.id
                  ? "!border-primary box-glow !bg-primary/10"
                  : "hover:border-primary/30"
              }`}
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <img
                src={CHARACTER_IMAGES[char.id]}
                alt={char.name}
                loading="lazy"
                width={96}
                height={96}
                className="w-20 h-20 mx-auto mb-2 rounded-full object-cover border-2 border-muted"
              />
              <span className="font-display font-semibold text-sm text-foreground block">{char.name}</span>
              <span className="text-xs text-muted-foreground font-body mt-1 block">{char.description}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterSelect;
