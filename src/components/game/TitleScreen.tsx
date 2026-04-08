import heroBg from "@/assets/hero-bg.jpg";

interface TitleScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  hasSave: boolean;
}

const TitleScreen = ({ onNewGame, onContinue, hasSave }: TitleScreenProps) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <img src={heroBg} alt="Hogwarts Castle" className="absolute inset-0 w-full h-full object-cover" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
      
      <div className="relative z-10 text-center space-y-8">
        <div className="space-y-2">
          <h1 className="font-display text-5xl md:text-7xl font-bold text-glow tracking-wider text-primary">
            Wizarding Obby
          </h1>
          <p className="font-display text-xl md:text-2xl text-foreground/70 tracking-wide">
            A Magical Parkour Adventure
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 pt-4">
          {hasSave && (
            <button
              onClick={onContinue}
              className="font-display text-lg px-10 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all animate-magic-pulse tracking-wider"
            >
              Continue Adventure
            </button>
          )}
          <button
            onClick={onNewGame}
            className="font-display text-lg px-10 py-3 rounded-lg border-2 border-primary/50 text-primary hover:bg-primary/10 transition-all tracking-wider"
          >
            New Game
          </button>
        </div>

        <div className="pt-8 flex gap-6 justify-center text-foreground/40 text-sm">
          <span>⚡ 7 Worlds</span>
          <span>🏰 35 Levels</span>
          <span>🐾 7 Pets</span>
        </div>
      </div>

      {/* Floating particles */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/40 animate-sparkle"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default TitleScreen;
