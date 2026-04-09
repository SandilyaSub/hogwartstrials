import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface FeedbackProps {
  userId: string;
  username: string;
  onBack: () => void;
}

interface FeedbackEntry {
  id: string;
  username: string;
  message: string;
  rating: number;
  created_at: string;
}

const Feedback = ({ userId, username, onBack }: FeedbackProps) => {
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadFeedback();
  }, []);

  const loadFeedback = async () => {
    const { data } = await supabase
      .from("feedback")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (data) setEntries(data as FeedbackEntry[]);
  };

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    await supabase.from("feedback").insert({
      user_id: userId,
      username: "Anonymous Wizard",
      message: message.trim(),
      rating,
    });
    setMessage("");
    setSuccess(true);
    setSubmitting(false);
    loadFeedback();
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-background p-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto space-y-6 animate-slide-up">
        {/* Header */}
        <div className="card-illustrated p-5 flex items-center gap-4">
          <button onClick={onBack} className="text-muted-foreground hover:text-foreground font-display transition-colors text-lg">←</button>
          <div className="flex-1">
            <h2 className="font-display text-2xl font-semibold text-primary text-glow">📝 Feedback</h2>
            <p className="text-sm text-muted-foreground font-body">Tell us what you think of the game!</p>
          </div>
        </div>

        {/* Submit form */}
        <div className="card-illustrated p-6 space-y-4">
          <h3 className="font-display text-lg font-semibold text-foreground/80">Leave Your Review</h3>

          {/* Star rating */}
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground font-body mr-2">Rating:</span>
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-2xl transition-transform hover:scale-110 ${star <= rating ? "" : "opacity-30"}`}
              >
                ⭐
              </button>
            ))}
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What do you think of Wizarding Obby?"
            maxLength={500}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border-2 border-border text-foreground font-body text-sm placeholder:text-muted-foreground/35 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 resize-none"
          />

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-body">{message.length}/500</span>
            <button
              onClick={handleSubmit}
              disabled={submitting || !message.trim()}
              className="btn-storybook px-6 py-2.5 bg-primary text-primary-foreground text-sm disabled:opacity-25 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {submitting ? "Sending..." : "✨ Submit"}
            </button>
          </div>

          {success && (
            <p className="text-primary text-sm font-medium animate-pop-in text-center">Thank you for your feedback! 🎉</p>
          )}
        </div>

        {/* Feedback list */}
        <div className="space-y-3">
          <h3 className="font-display text-lg font-semibold text-foreground/80 px-1">
            Community Reviews ({entries.length})
          </h3>
          {entries.length === 0 ? (
            <div className="card-illustrated p-8 text-center">
              <p className="text-muted-foreground font-body">No feedback yet — be the first!</p>
            </div>
          ) : (
            entries.map((entry, i) => (
              <div
                key={entry.id}
                className="card-illustrated p-4 animate-pop-in"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-display font-semibold text-foreground">{entry.username}</span>
                    <span className="text-xs text-muted-foreground font-body">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: entry.rating }).map((_, j) => (
                      <span key={j} className="text-xs">⭐</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground/70 font-body leading-relaxed">{entry.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Feedback;
