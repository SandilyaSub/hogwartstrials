
-- Feedback table for user reviews/comments
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read all feedback
CREATE POLICY "Anyone can view feedback"
ON public.feedback FOR SELECT TO authenticated
USING (true);

-- Users can insert their own feedback
CREATE POLICY "Users can insert own feedback"
ON public.feedback FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add active_song column to game_profiles
ALTER TABLE public.game_profiles ADD COLUMN active_song TEXT NOT NULL DEFAULT 'default';
