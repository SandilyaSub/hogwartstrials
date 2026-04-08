import { useState } from "react";

interface ProfileCreationProps {
  onSubmit: (username: string) => void;
}

const ProfileCreation = ({ onSubmit }: ProfileCreationProps) => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (username.trim().length < 2) {
      setError("Username must be at least 2 characters");
      return;
    }
    if (username.trim().length > 20) {
      setError("Username must be under 20 characters");
      return;
    }
    onSubmit(username.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-primary/10 animate-float"
            style={{
              width: `${40 + i * 20}px`,
              height: `${40 + i * 20}px`,
              left: `${10 + (i * 13) % 80}%`,
              top: `${10 + (i * 17) % 80}%`,
              animationDelay: `${i * 0.5}s`,
              filter: "blur(20px)",
            }}
          />
        ))}
      </div>

      <div className="relative max-w-md w-full space-y-8 text-center animate-slide-up">
        <div className="card-illustrated p-8 space-y-8">
          <div>
            <div className="text-6xl mb-4 animate-wiggle inline-block">📜</div>
            <h2 className="font-display text-3xl font-bold text-primary text-glow">
              The Sorting Begins
            </h2>
            <p className="text-foreground/55 mt-2 font-body text-lg">Enter your name, young wizard</p>
          </div>

          <div className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Your wizard name..."
              maxLength={20}
              className="w-full px-6 py-4 rounded-2xl bg-secondary/50 border-2 border-border text-foreground text-center font-display text-xl placeholder:text-muted-foreground/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
            {error && <p className="text-destructive text-sm font-medium animate-pop-in">{error}</p>}
            
            <button
              onClick={handleSubmit}
              disabled={username.trim().length < 2}
              className="w-full btn-storybook text-lg px-8 py-4 bg-primary text-primary-foreground disabled:opacity-25 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              ✨ Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreation;
