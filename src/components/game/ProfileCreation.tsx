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
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <p className="text-6xl mb-4">📜</p>
          <h2 className="font-display text-3xl font-bold text-primary text-glow">
            The Sorting Begins
          </h2>
          <p className="text-foreground/60 mt-2">Enter your name, young wizard</p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e) => { setUsername(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Your wizard name..."
            maxLength={20}
            className="w-full px-6 py-4 rounded-lg bg-card border-2 border-border text-foreground text-center font-display text-xl placeholder:text-muted-foreground/40 focus:border-primary focus:outline-none transition-colors"
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          
          <button
            onClick={handleSubmit}
            disabled={username.trim().length < 2}
            className="w-full font-display text-lg px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all tracking-wider"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCreation;
