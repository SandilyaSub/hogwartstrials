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
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 overflow-y-auto">
      <div className="max-w-2xl w-full space-y-8 text-center animate-slide-up">
        <div>
          <div className="text-5xl mb-3 animate-wiggle inline-block">🎩</div>
          <h2 className="font-display text-3xl font-bold text-primary text-glow">The Sorting Hat</h2>
          <p className="text-foreground/55 mt-2 font-body text-lg">Choose your Hogwarts house</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {HOUSES.map((house, i) => (
            <button
              key={house.id}
              onClick={() => setSelected(house.id)}
              className={`card-illustrated p-6 text-left transition-all duration-300 hover:scale-[1.02] animate-pop-in ${
                selected === house.id ? "" : "hover:border-primary/30"
              }`}
              style={{
                animationDelay: `${i * 0.1}s`,
                ...(selected === house.id ? {
                  borderColor: `hsl(var(--${house.id}))`,
                  boxShadow: `0 0 20px hsl(var(--${house.id}) / 0.35), inset 0 0 30px hsl(var(--${house.id}) / 0.05)`,
                  background: `linear-gradient(145deg, hsl(var(--${house.id}) / 0.12), hsl(var(--card)))`,
                } : {}),
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{HOUSE_EMOJIS[house.id]}</span>
                <h3 className="font-display text-lg font-semibold" style={{ color: `hsl(var(--${house.id}))` }}>
                  {house.name}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">{house.description}</p>
              <p className="text-xs text-foreground/45 mt-3 font-body">🧙 Mentor: {house.mentor}</p>
              <div className="flex gap-2 mt-3">
                {house.boosts.speed > 0 && <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/80 text-foreground/60 font-display">⚡ Speed</span>}
                {house.boosts.jump > 0 && <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/80 text-foreground/60 font-display">🦘 Jump</span>}
                {house.boosts.flying > 0 && <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/80 text-foreground/60 font-display">🧹 Flying</span>}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => selected && onSelect(selected)}
          disabled={!selected}
          className="btn-storybook text-lg px-12 py-4 bg-primary text-primary-foreground disabled:opacity-25 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
        >
          🏰 Join House
        </button>
      </div>
    </div>
  );
};

export default HouseSelect;
