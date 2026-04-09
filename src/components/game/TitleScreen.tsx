import heroBg from "@/assets/hero-bg.jpg";
import { startMusic, isMusicPlaying } from "@/lib/musicEngine";
import { useTheme } from "@/hooks/useTheme";

interface TitleScreenProps {
  onNewGame: () => void;
  onContinue: () => void;
  hasSave: boolean;
  onSignOut?: () => void;
}

const TitleScreen = ({ onNewGame, onContinue, hasSave, onSignOut }: TitleScreenProps) => {
  const { theme, toggleTheme } = useTheme();
  const handleAction = (action: () => void) => {
    if (!isMusicPlaying()) startMusic();
    action();
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-x-hidden overflow-y-auto">
      <img src={heroBg} alt="Hogwarts Castle" className="absolute inset-0 w-full h-full object-cover opacity-60" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 z-20 text-sm px-4 py-2 rounded-2xl bg-card/80 backdrop-blur-sm border-2 border-border font-display font-medium text-foreground/70 hover:text-foreground hover:border-primary/40 transition-all duration-300"
      >
        {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
      </button>
      
      <div className="relative z-10 text-center space-y-10 px-4">
        {/* Logo area */}
        <div className="space-y-4 animate-slide-up">
          <div className="text-6xl animate-wiggle inline-block">​</div>
          <h1 className="font-display text-5xl md:text-7xl font-bold text-glow tracking-wide text-primary drop-shadow-lg">
            Wizarding Obby
          </h1>
          <p className="font-body text-lg md:text-xl text-foreground/60 tracking-widest uppercase font-medium">
            A Magical Parkour Adventure
          </p>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-primary/40" />
          <span className="text-primary/60 text-lg">✦</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-primary/40" />
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
          {hasSave && (
            <button
              onClick={() => handleAction(onContinue)}
              className="btn-storybook text-lg px-12 py-4 bg-primary text-primary-foreground animate-magic-pulse"
            >
              ✨ Continue Adventure
            </button>
          )}
          <button
            onClick={() => handleAction(onNewGame)}
            className="btn-storybook text-lg px-12 py-4 border-2 border-primary/40 text-primary hover:bg-primary/10 bg-card/50 backdrop-blur-sm"
          >
            📜 New Game
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-8 justify-center text-foreground/40 text-sm font-display animate-slide-up" style={{ animationDelay: "0.4s" }}>
          <span className="flex items-center gap-1.5">⚡ <span className="text-foreground/60">7 Worlds</span></span>
          <span className="flex items-center gap-1.5">🏰 <span className="text-foreground/60">35 Levels</span></span>
          <span className="flex items-center gap-1.5">🐾 <span className="text-foreground/60">7 Pets</span></span>
        </div>
        {onSignOut && (
          <button onClick={onSignOut} className="mt-3 text-xs text-muted-foreground/50 hover:text-muted-foreground font-body transition-colors">
            Sign Out
          </button>
        )}
      </div>

      {/* Floating particles */}
      {Array.from({ length: 16 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-primary/30 animate-sparkle"
          style={{
            width: `${3 + (i % 3) * 2}px`,
            height: `${3 + (i % 3) * 2}px`,
            left: `${8 + Math.random() * 84}%`,
            top: `${8 + Math.random() * 84}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${2 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  );
};

export default TitleScreen;
