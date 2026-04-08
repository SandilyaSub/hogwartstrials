import { WORLDS } from "@/lib/gameData";
import { LEVEL_STORIES } from "@/lib/levelStories";
import { useEffect, useState } from "react";

interface LevelIntroProps {
  worldId: number;
  levelIdx: number;
  onStart: () => void;
}

const LevelIntro = ({ worldId, levelIdx, onStart }: LevelIntroProps) => {
  const world = WORLDS[worldId - 1];
  const level = world.levels[levelIdx];
  const story = LEVEL_STORIES[level.id];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!story) {
    onStart();
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-y-auto">
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/15 animate-float"
            style={{
              width: `${20 + i * 8}px`,
              height: `${20 + i * 8}px`,
              left: `${5 + (i * 11) % 85}%`,
              top: `${5 + (i * 13) % 85}%`,
              animationDelay: `${i * 0.4}s`,
              filter: "blur(15px)",
            }}
          />
        ))}
      </div>

      <div
        className={`relative max-w-lg w-full text-center transition-all duration-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <div className="card-illustrated p-8 md:p-10 space-y-6">
          {/* World / Level label */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/60 border border-border text-xs font-display text-muted-foreground">
            <span>{world.emoji}</span>
            <span>World {worldId} · Level {levelIdx + 1}</span>
          </div>

          {/* Level name */}
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary text-glow leading-tight">
            {level.name}
          </h2>

          {/* Divider */}
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/40" />
            <span className="text-primary/50 text-sm">✦</span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/40" />
          </div>

          {/* Quote */}
          <blockquote className="relative px-4">
            <span className="absolute -top-2 -left-1 text-3xl text-primary/20 font-serif">"</span>
            <p className="font-body italic text-foreground/70 text-base md:text-lg leading-relaxed">
              {story.quote}
            </p>
            <footer className="mt-2 text-xs font-display text-primary/70">
              — {story.narrator}
            </footer>
          </blockquote>

          {/* Story */}
          <p className="font-body text-foreground/55 text-sm md:text-base leading-relaxed">
            {story.story}
          </p>

          {/* Buttons */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              onClick={onStart}
              className="btn-storybook text-lg px-12 py-4 bg-primary text-primary-foreground animate-magic-pulse"
            >
              ⚡ Begin Level
            </button>
            <button
              onClick={onStart}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground font-body transition-colors"
            >
              Skip →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelIntro;
