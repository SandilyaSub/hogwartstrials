import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface HouseLeaderboardProps {
  onBack: () => void;
  playerHouseId?: string;
}

interface HouseEntry {
  house_id: string;
  house_name: string;
  total_points: number;
  house_color: string;
  house_emoji: string;
}

const HouseLeaderboard = ({ onBack, playerHouseId }: HouseLeaderboardProps) => {
  const [houses, setHouses] = useState<HouseEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from("house_leaderboard")
        .select("*")
        .order("total_points", { ascending: false });
      if (data) setHouses(data as unknown as HouseEntry[]);
      setLoading(false);
    };
    fetchLeaderboard();

    // Realtime updates
    const channel = supabase
      .channel("house_leaderboard_changes")
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "house_leaderboard" }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const maxPoints = Math.max(1, ...houses.map(h => h.total_points));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display text-primary mb-2">🏆 House Cup</h1>
          <p className="text-sm text-muted-foreground">
            Collect house tokens during levels to earn points for your house!
          </p>
        </div>

        {loading ? (
          <div className="text-center animate-pulse text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-4">
            {houses.map((house, rank) => {
              const isPlayer = house.house_id === playerHouseId;
              const barWidth = maxPoints > 0 ? (house.total_points / maxPoints) * 100 : 0;

              return (
                <div
                  key={house.house_id}
                  className={`relative rounded-xl border-2 p-4 transition-all ${
                    isPlayer
                      ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                      : "border-border bg-card/60"
                  }`}
                >
                  {/* Rank badge */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                      style={{
                        background: rank === 0 ? "linear-gradient(135deg, #ffd700, #f0c000)" :
                          rank === 1 ? "linear-gradient(135deg, #c0c0c0, #a0a0a0)" :
                          rank === 2 ? "linear-gradient(135deg, #cd7f32, #a06020)" :
                          "rgba(100,100,100,0.3)",
                        color: rank < 3 ? "#1a1a1a" : "#aaa",
                      }}
                    >
                      {rank + 1}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">{house.house_emoji}</span>
                        <span className="font-display text-lg text-foreground">
                          {house.house_name}
                        </span>
                        {isPlayer && (
                          <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-display">
                            Your House
                          </span>
                        )}
                      </div>

                      {/* Points bar */}
                      <div className="relative h-5 bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                          style={{
                            width: `${Math.max(2, barWidth)}%`,
                            background: `linear-gradient(90deg, ${house.house_color}, ${house.house_color}cc)`,
                          }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-foreground/80 drop-shadow-sm">
                          {house.total_points.toLocaleString()} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Info */}
        <div className="mt-6 p-3 rounded-lg bg-card/40 border border-border text-center">
          <p className="text-xs text-muted-foreground">
            🪙 Collect shining house tokens scattered across levels.<br />
            Points are added to your house's total — work together to win the House Cup!
          </p>
        </div>

        <button
          onClick={onBack}
          className="mt-6 w-full py-3 rounded-xl bg-card border border-border text-foreground font-display hover:bg-primary/10 transition-colors"
        >
          ← Back to World Map
        </button>
      </div>
    </div>
  );
};

export default HouseLeaderboard;
