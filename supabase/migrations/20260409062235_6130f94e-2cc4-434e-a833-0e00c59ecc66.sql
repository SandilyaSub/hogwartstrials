
CREATE TABLE public.house_leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  house_id TEXT NOT NULL UNIQUE,
  house_name TEXT NOT NULL,
  total_points BIGINT NOT NULL DEFAULT 0,
  house_color TEXT NOT NULL DEFAULT '#333',
  house_emoji TEXT NOT NULL DEFAULT '🏠',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.house_leaderboard ENABLE ROW LEVEL SECURITY;

-- Anyone can read the leaderboard
CREATE POLICY "Anyone can view house leaderboard"
  ON public.house_leaderboard
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Authenticated users can update points (we'll increment via RPC)
CREATE POLICY "Authenticated users can update house points"
  ON public.house_leaderboard
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Seed the 4 houses
INSERT INTO public.house_leaderboard (house_id, house_name, total_points, house_color, house_emoji) VALUES
  ('gryffindor', 'Gryffindor', 0, '#c0392b', '🦁'),
  ('slytherin', 'Slytherin', 0, '#27ae60', '🐍'),
  ('ravenclaw', 'Ravenclaw', 0, '#2980b9', '🦅'),
  ('hufflepuff', 'Hufflepuff', 0, '#f39c12', '🦡');

-- Function to add points to a house
CREATE OR REPLACE FUNCTION public.add_house_points(p_house_id TEXT, p_points INT)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.house_leaderboard
  SET total_points = total_points + p_points, updated_at = now()
  WHERE house_id = p_house_id;
END;
$$;
