DROP POLICY IF EXISTS "Anyone can view feedback" ON public.feedback;

CREATE POLICY "Users can view their own feedback"
ON public.feedback
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);