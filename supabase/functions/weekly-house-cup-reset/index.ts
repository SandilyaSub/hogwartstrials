import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Authenticate caller via shared secret
  const expected = Deno.env.get("WEEKLY_RESET_SECRET");
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!expected || authHeader !== `Bearer ${expected}`) {
    return new Response(
      JSON.stringify({ error: "Unauthorized" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 401 }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Get all houses sorted by points descending
    const { data: houses, error: fetchErr } = await supabase
      .from("house_leaderboard")
      .select("*")
      .order("total_points", { ascending: false });

    if (fetchErr) throw fetchErr;
    if (!houses || houses.length === 0) {
      return new Response(
        JSON.stringify({ message: "No houses found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const winner = houses[0];

    // Calculate the Monday of the current week
    const now = new Date();
    const dayOfWeek = now.getUTCDay(); // 0=Sun, 1=Mon...
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() + mondayOffset);
    const weekStart = monday.toISOString().split("T")[0];

    // Check if we already recorded a winner for this week
    const { data: existing } = await supabase
      .from("house_cup_winners")
      .select("id")
      .eq("week_start", weekStart)
      .limit(1);

    if (existing && existing.length > 0) {
      return new Response(
        JSON.stringify({ message: "Winner already recorded for this week", winner: winner.house_name }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Record the winner
    const { error: insertErr } = await supabase
      .from("house_cup_winners")
      .insert({
        house_id: winner.house_id,
        house_name: winner.house_name,
        house_color: winner.house_color,
        house_emoji: winner.house_emoji,
        total_points: winner.total_points,
        week_start: weekStart,
      });

    if (insertErr) throw insertErr;

    // Reset all house points to 0
    for (const house of houses) {
      const { error: resetErr } = await supabase
        .from("house_leaderboard")
        .update({ total_points: 0, updated_at: new Date().toISOString() })
        .eq("house_id", house.house_id);

      if (resetErr) throw resetErr;
    }

    return new Response(
      JSON.stringify({
        message: "House Cup winner recorded and points reset",
        winner: winner.house_name,
        points: winner.total_points,
        week_start: weekStart,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    // Log full error server-side, return generic message to caller
    console.error("Weekly reset failed:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
