
CREATE TABLE public.house_cup_winners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  house_id TEXT NOT NULL,
  house_name TEXT NOT NULL,
  house_color TEXT NOT NULL DEFAULT '#333',
  house_emoji TEXT NOT NULL DEFAULT '🏠',
  total_points BIGINT NOT NULL DEFAULT 0,
  week_start DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.house_cup_winners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view house cup winners"
ON public.house_cup_winners
FOR SELECT
TO anon, authenticated
USING (true);

CREATE INDEX idx_house_cup_winners_week ON public.house_cup_winners(week_start DESC);
