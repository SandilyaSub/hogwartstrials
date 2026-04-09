-- Drop the existing permissive UPDATE policy
DROP POLICY IF EXISTS "Users can update their own profile" ON public.game_profiles;

-- Create a stricter UPDATE policy with WITH CHECK constraints
CREATE POLICY "Users can update their own profile"
ON public.game_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id
  AND coins >= 0 AND coins <= 99999
  AND lives >= 0 AND lives <= 10
  AND current_world >= 1 AND current_world <= 7
  AND current_level >= 0 AND current_level <= 9
);