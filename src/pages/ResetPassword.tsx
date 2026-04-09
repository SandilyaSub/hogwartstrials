import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (session && event === "SIGNED_IN")) {
        setSessionReady(true);
        setChecking(false);
      }
    });

    // Also check if session already exists (user may have landed with tokens already processed)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSessionReady(true);
      }
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (err) {
      setError(err.message);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="max-w-md w-full card-illustrated p-8 text-center space-y-4 animate-slide-up">
          <div className="text-5xl">✅</div>
          <h2 className="font-display text-2xl font-bold text-primary text-glow">Password Updated!</h2>
          <p className="text-muted-foreground font-body">Your password has been reset successfully.</p>
          <a href="/" className="inline-block btn-storybook px-6 py-3 bg-primary text-primary-foreground">
            Return to Game
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full card-illustrated p-8 space-y-6 text-center animate-slide-up">
        <div className="text-5xl">🔑</div>
        <h2 className="font-display text-2xl font-bold text-primary text-glow">Set New Password</h2>
        <p className="text-muted-foreground font-body text-sm">Enter your new password below.</p>

        {checking ? (
          <p className="text-muted-foreground text-sm animate-pulse">Verifying recovery link...</p>
        ) : !sessionReady ? (
          <p className="text-destructive text-sm font-medium">
            Invalid or expired recovery link. Please request a new password reset.
          </p>
        ) : (
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(""); }}
              placeholder="New password..."
              className="w-full px-5 py-3.5 rounded-2xl bg-secondary/50 border-2 border-border text-foreground font-body placeholder:text-muted-foreground/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <input
              type="password"
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setError(""); }}
              placeholder="Confirm password..."
              className="w-full px-5 py-3.5 rounded-2xl bg-secondary/50 border-2 border-border text-foreground font-body placeholder:text-muted-foreground/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {error && <p className="text-destructive text-sm font-medium animate-pop-in">{error}</p>}
            <button
              onClick={handleReset}
              disabled={loading || !password || !confirm}
              className="w-full btn-storybook text-lg px-8 py-4 bg-primary text-primary-foreground disabled:opacity-25 disabled:cursor-not-allowed"
            >
              {loading ? "✨ Updating..." : "✨ Update Password"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
