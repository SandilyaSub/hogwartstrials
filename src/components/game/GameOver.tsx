interface GameOverProps {
  onRetry: () => void;
  onWorldMap: () => void;
}

const GameOver = ({ onRetry, onWorldMap }: GameOverProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-6">
        <p className="text-6xl">💀</p>
        <h2 className="font-display text-3xl text-destructive">You Fell!</h2>
        <p className="text-foreground/50 italic">"Even the greatest wizards stumble..."</p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="font-display text-lg px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all tracking-wider"
          >
            Try Again
          </button>
          <button
            onClick={onWorldMap}
            className="font-display px-8 py-3 rounded-lg border border-border text-foreground/60 hover:text-foreground transition-all"
          >
            World Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
