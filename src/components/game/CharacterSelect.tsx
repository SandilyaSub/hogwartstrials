import { useState } from "react";
import { CHARACTERS } from "@/lib/gameData";

interface CharacterSelectProps {
  onSelect: (charId: string) => void;
}

const CharacterSelect = ({ onSelect }: CharacterSelectProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-3xl w-full space-y-6 text-center">
        <div>
          <h2 className="font-display text-3xl font-bold text-primary text-glow">Choose Your Wizard</h2>
          <p className="text-foreground/60 mt-1">Select your character for this adventure</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {CHARACTERS.map((char) => (
            <button
              key={char.id}
              onClick={() => setSelected(char.id)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${
                selected === char.id
                  ? "border-primary box-glow bg-primary/10"
                  : "border-border hover:border-primary/30 bg-card"
              }`}
            >
              <span className="text-3xl block mb-1">{char.emoji}</span>
              <span className="font-display text-sm text-foreground block">{char.name}</span>
              <span className="text-xs text-muted-foreground">{char.description}</span>
            </button>
          ))}
        </div>

        <button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          className="font-display text-lg px-10 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all tracking-wider"
        >
          Select
        </button>
      </div>
    </div>
  );
};

export default CharacterSelect;
