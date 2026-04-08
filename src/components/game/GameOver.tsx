interface GameOverProps {
  onRetry: () => void;
  onWorldMap: () => void;
}

const GameOver = ({ onRetry, onWorldMap }: GameOverProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-y-auto">
      <div className="text-center space-y-8 animate-bounce-in">
        <div className="card-illustrated p-10 space-y-6">
          <div className="text-7xl animate-wiggle inline-block">💀</div>
          <h2 className="font-display text-3xl font-bold text-destructive">You Fell!</h2>
          <p className="text-foreground/45 italic font-body text-base leading-relaxed">
            "Even the greatest wizards stumble..."
          </p>
          
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={onRetry}
              className="btn-storybook text-lg px-10 py-4 bg-primary text-primary-foreground"
            >
              🔄 Try Again
            </button>
            <button
              onClick={onWorldMap}
              className="btn-storybook px-8 py-3 border-2 border-border text-foreground/55 hover:text-foreground hover:border-primary/30 bg-transparent"
            >
              🗺️ World Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOver;
