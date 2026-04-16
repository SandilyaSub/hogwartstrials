export type DeathReason = "fall" | "enemy" | "boss" | "hazard" | "drown";

interface DeathMessage {
  emoji: string;
  title: string;
  quote: string;
}

const DEATH_MESSAGES: Record<DeathReason, DeathMessage[]> = {
  fall: [
    { emoji: "💀", title: "You Fell!", quote: "Even the greatest wizards stumble..." },
    { emoji: "😵", title: "Gravity Wins!", quote: "Not all who wander are lost — but you definitely are." },
    { emoji: "🕳️", title: "Into the Abyss!", quote: "The ground was right there... and then it wasn't." },
  ],
  enemy: [
    { emoji: "⚡", title: "Avada Kedavra!", quote: "The killing curse strikes without mercy." },
    { emoji: "🕷️", title: "Caught by a Creature!", quote: "Hagrid said they wouldn't hurt you... he lied." },
    { emoji: "💥", title: "Struck Down!", quote: "Even Dumbledore couldn't dodge every spell." },
    { emoji: "🐍", title: "Bitten!", quote: "The Dark Lord's servants show no mercy." },
  ],
  boss: [
    { emoji: "☠️", title: "The Dark Lord Wins!", quote: "You-Know-Who's power was too great... this time." },
    { emoji: "⚡", title: "Avada Kedavra!", quote: "The killing curse found its mark." },
    { emoji: "💀", title: "Defeated by Darkness!", quote: "Not every battle can be won on the first try." },
  ],
  hazard: [
    { emoji: "🔥", title: "Burned!", quote: "Playing with Fiendfyre is never wise." },
    { emoji: "💀", title: "Crushed!", quote: "Should have watched where you were stepping..." },
    { emoji: "⚡", title: "Zapped!", quote: "That trap was hidden well." },
  ],
  drown: [
    { emoji: "🌊", title: "Swept Away!", quote: "The Black Lake claims another soul..." },
    { emoji: "💧", title: "Drowned!", quote: "Gillyweed would have been useful right about now." },
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface GameOverProps {
  deathReason?: DeathReason;
  onRetry: () => void;
  onWorldMap: () => void;
}

const GameOver = ({ deathReason = "fall", onRetry, onWorldMap }: GameOverProps) => {
  const messages = DEATH_MESSAGES[deathReason] || DEATH_MESSAGES.fall;
  const msg = pickRandom(messages);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-y-auto">
      <div className="text-center space-y-8 animate-bounce-in">
        <div className="card-illustrated p-10 space-y-6">
          <div className="text-7xl animate-wiggle inline-block">{msg.emoji}</div>
          <h2 className="font-display text-3xl font-bold text-destructive">{msg.title}</h2>
          <p className="text-foreground/45 italic font-body text-base leading-relaxed">
            "{msg.quote}"
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