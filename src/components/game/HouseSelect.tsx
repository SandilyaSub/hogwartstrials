import { useState } from "react";
import { HOUSES } from "@/lib/gameData";

interface HouseSelectProps {
  onSelect: (houseId: string) => void;
}

const HOUSE_EMOJIS: Record<string, string> = {
  gryffindor: "🦁",
  slytherin: "🐍",
  ravenclaw: "🦅",
  hufflepuff: "🦡",
};

const HouseSelect = ({ onSelect }: HouseSelectProps) => {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full space-y-6 text-center">
        <div>
          <p className="text-5xl mb-2">🎩</p>
          <h2 className="font-display text-3xl font-bold text-primary text-glow">The Sorting Hat</h2>
          <p className="text-foreground/60 mt-1">Choose your Hogwarts house</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {HOUSES.map((house) => (
            <button
              key={house.id}
              onClick={() => setSelected(house.id)}
              className={`p-5 rounded-lg border-2 transition-all text-left ${
                selected === house.id
                  ? `border-${house.color} ${house.id}-glow bg-${house.color}/10`
                  : "border-border hover:border-primary/30 bg-card"
              }`}
              style={selected === house.id ? { borderColor: `hsl(var(--${house.id}))`, boxShadow: `0 0 15px hsl(var(--${house.id}) / 0.4)` } : {}}
            >
              <span className="text-3xl">{HOUSE_EMOJIS[house.id]}</span>
              <h3 className="font-display text-lg mt-2" style={{ color: `hsl(var(--${house.id}))` }}>
                {house.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{house.description}</p>
              <p className="text-xs text-foreground/50 mt-2">Mentor: {house.mentor}</p>
              <div className="flex gap-2 mt-2 text-xs text-foreground/40">
                {house.boosts.speed > 0 && <span>+Speed</span>}
                {house.boosts.jump > 0 && <span>+Jump</span>}
                {house.boosts.flying > 0 && <span>+Flying</span>}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          className="font-display text-lg px-10 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all tracking-wider"
        >
          Join House
        </button>
      </div>
    </div>
  );
};

export default HouseSelect;
