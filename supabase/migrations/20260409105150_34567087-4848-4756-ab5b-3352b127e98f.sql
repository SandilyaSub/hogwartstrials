-- Drop the existing overly permissive INSERT policy
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.game_profiles;

-- Create a new INSERT policy scoped to authenticated users with value constraints
CREATE POLICY "Users can insert their own profile"
ON public.game_profiles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id
  AND coins = 0
  AND lives = 3
  AND current_world = 1
  AND current_level = 0
);