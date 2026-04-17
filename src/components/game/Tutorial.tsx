import { useState } from "react";
import type { PlayerProfile } from "@/hooks/useGameState";

interface TutorialProps {
  profile: PlayerProfile;
  onComplete: () => void;
}

interface TutorialStep {
  title: string;
  description: string;
  emoji: string;
  visual?: string; // decorative emoji row
}

const TUTORIAL_STEPS: TutorialStep[] = [
  {
    title: "Welcome to Hogwarts! ✨",
    description: "Your magical adventure begins here! You'll platform through 7 worlds inspired by the Harry Potter books, facing obstacles, enemies, and bosses.",
    emoji: "🏰",
    visual: "🏰 ⚡ 🧙 📚 🦉",
  },
  {
    title: "Movement Controls 🏃",
    description: "Use Arrow Keys or W/A/S/D to move left and right. Press Space, W, or Up Arrow to jump. On mobile, tap the left side to go left, right side to go right, and the top half to jump!",
    emoji: "⌨️",
    visual: "⬅️ ➡️ ⬆️ [SPACE]",
  },
  {
    title: "Platforms & Obstacles 🧱",
    description: "Normal platforms are safe to stand on. Moving platforms slide back and forth — time your jumps! Disappearing platforms vanish after you land on them, so keep moving! Red hazard platforms will hurt you.",
    emoji: "🧱",
    visual: "🟫 ↔️ 💨 🟥",
  },
  {
    title: "Collect Coins! 🪙",
    description: "Gold coins float above platforms — walk into them to collect! Spend coins in the Magical Shop on upgrades, themes, and music tracks.",
    emoji: "🪙",
    visual: "🪙 🪙 🪙 🪙 🪙",
  },
  {
    title: "Watch Out for Enemies! 🕷️",
    description: "Enemies patrol platforms. Jump on them from above to defeat them! If they touch you from the side, you lose a life. Spiders, ghosts, trolls, and worse await...",
    emoji: "⚔️",
    visual: "🕷️ 👻 🧌 💀",
  },
  {
    title: "Pets & Abilities 🐾",
    description: "Adopt a magical pet from the Pet Store! Each gives a unique ability: Owls boost speed, Cats improve jumping, Toads give coin bonuses, and Phoenixes grant an extra life!",
    emoji: "🦉",
    visual: "🦉 🐈 🐸 🦅",
  },
  {
    title: "Flight Levels 🐉",
    description: "Some levels put you on a flying mount — Hippogriff, Thestral, or Dragon! The world auto-scrolls and you can move freely up, down, left, and right. Dodge clouds, fireballs, and rival flyers to reach the finish!",
    emoji: "🪶",
    visual: "🦅 🐴 🐉 ☁️ 🔥",
  },
  {
    title: "The Magical Shop 🏪",
    description: "Spend coins on ⬆️ Jump & Speed boosts, 🛡️ Shields, 🧲 Coin Magnets, 🎨 Themes, ✨ Accessories (wands, scarves, glasses), and 👑 Legendary character skins like Yule Ball Hermione & Dark Harry!",
    emoji: "🛒",
    visual: "⬆️ 🛡️ 🧲 ✨ 👑",
  },
  {
    title: "Equip & Unequip Anything ⚙️",
    description: "Owned upgrades and consumables can be toggled ON or OFF in the Shop — tap to switch. Swap legendary character skins and accessories from the Settings screen anytime!",
    emoji: "🎒",
    visual: "✅ ⛔ 🔁 ⚙️",
  },
  {
    title: "Boss Battles ⚡",
    description: "Every 10th level is a boss fight! Use number keys 1-5 to cast spells: ⚡ Stupefy, ✨ Expelliarmus, ❄️ Petrificus, and more. Dodge the boss's attacks and fight back!",
    emoji: "🐉",
    visual: "⚡ ✨ ❄️ 🔥 💜",
  },
  {
    title: "Themes & Style 🎨",
    description: "Purchase themes in the shop to transform the entire game's look — Amortentia Pink 💖, Ravenclaw Blue 💙, Dark Arts 🐍, and more!",
    emoji: "🎵",
    visual: "💖 💙 🐍 💛 🖤",
  },
  {
    title: "House Cup 🏆",
    description: "Every coin you earn adds points to your House on the weekly leaderboard! Compete with Gryffindor, Slytherin, Ravenclaw, and Hufflepuff. Winners are crowned each week — make your House proud!",
    emoji: "🏆",
    visual: "🦁 🐍 🦅 🦡",
  },
  {
    title: "You're Ready, Wizard! 🧙",
    description: "Reach the golden ⭐ FINISH platform to complete each level. Explore the World Map to pick your battles. Good luck — your Hogwarts adventure awaits!",
    emoji: "🌟",
    visual: "⭐ 🏆 🎉 ✨ 🧙",
  },
];

const Tutorial = ({ profile, onComplete }: TutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  const step = TUTORIAL_STEPS[currentStep];
  const isFirst = currentStep === 0;
  const isLast = currentStep >= TUTORIAL_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) setCurrentStep(s => s - 1);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="max-w-lg w-full space-y-6 animate-slide-up">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-display mb-2">
            📖 Tutorial — {currentStep + 1} of {TUTORIAL_STEPS.length}
          </p>
        </div>

        {/* Card */}
        <div className="card-illustrated p-8 space-y-5 animate-pop-in" key={currentStep}>
          {/* Emoji */}
          <div className="text-center">
            <span className="text-6xl inline-block animate-wiggle">{step.emoji}</span>
          </div>

          {/* Title */}
          <h2 className="font-display text-2xl font-bold text-primary text-center text-glow">
            {step.title}
          </h2>

          {/* Visual row */}
          {step.visual && (
            <div className="text-center text-2xl tracking-[0.3em] opacity-70">
              {step.visual}
            </div>
          )}

          {/* Description */}
          <p className="font-body text-sm text-foreground/80 text-center leading-relaxed">
            {step.description}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={handleBack}
            disabled={isFirst}
            className="px-5 py-2.5 bg-muted text-muted-foreground rounded-xl font-display text-sm disabled:opacity-25 disabled:cursor-not-allowed hover:opacity-80 transition-opacity"
          >
            ← Back
          </button>

          <button
            onClick={onComplete}
            className="text-xs text-muted-foreground/60 hover:text-foreground/80 transition-colors font-body underline"
          >
            Skip Tutorial
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-xl font-display text-sm hover:opacity-90 transition-opacity"
          >
            {isLast ? "🏰 Start Adventure!" : "Next →"}
          </button>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-1.5">
          {TUTORIAL_STEPS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentStep ? "bg-primary" : i < currentStep ? "bg-primary/40" : "bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
