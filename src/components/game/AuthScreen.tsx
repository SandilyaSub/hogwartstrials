import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AuthScreenProps {
  onAuth: (email: string, password: string, isSignUp: boolean) => Promise<string | null>;
}

const AuthScreen = ({ onAuth }: AuthScreenProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async () => {
    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }
    if (forgotMode) {
      setLoading(true);
      setError("");
      const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setLoading(false);
      if (err) setError(err.message);
      else setSuccess("Password reset email sent! Check your inbox.");
      return;
    }
    if (!password.trim()) {
      setError("Please fill in both fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    const err = await onAuth(email.trim(), password, isSignUp);
    setLoading(false);
    if (err) {
      setError(err);
    } else if (isSignUp) {
      setSuccess("Account created! Check your email to confirm, then sign in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 overflow-y-auto">
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

      <div className="relative max-w-md w-full space-y-6 text-center animate-slide-up">
        <div className="card-illustrated p-8 space-y-6">
          <div>
            <div className="text-6xl mb-4 animate-wiggle inline-block">🧙‍♂️</div>
            <h2 className="font-display text-3xl font-bold text-primary text-glow">
              {forgotMode ? "Reset Password" : isSignUp ? "Create Your Account" : "Welcome Back, Wizard"}
            </h2>
            <p className="text-foreground/55 mt-2 font-body text-lg">
              {forgotMode ? "We'll send you a reset link" : isSignUp ? "Begin your magical journey" : "Continue your adventure"}
            </p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="Email address..."
              className="w-full px-5 py-3.5 rounded-2xl bg-secondary/50 border-2 border-border text-foreground font-body text-base placeholder:text-muted-foreground/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
            {!forgotMode && (
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                placeholder="Password..."
                className="w-full px-5 py-3.5 rounded-2xl bg-secondary/50 border-2 border-border text-foreground font-body text-base placeholder:text-muted-foreground/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
              />
            )}

            {error && <p className="text-destructive text-sm font-medium animate-pop-in">{error}</p>}
            {success && <p className="text-primary text-sm font-medium animate-pop-in">{success}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading || !email.trim() || (!forgotMode && !password.trim())}
              className="w-full btn-storybook text-lg px-8 py-4 bg-primary text-primary-foreground disabled:opacity-25 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {loading ? "✨ Loading..." : forgotMode ? "✨ Send Reset Link" : isSignUp ? "✨ Create Account" : "✨ Sign In"}
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => { setIsSignUp(!isSignUp); setError(""); setSuccess(""); }}
              className="text-sm text-muted-foreground hover:text-primary font-body transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
