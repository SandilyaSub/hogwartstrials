INSERT INTO storage.buckets (id, name, public)
VALUES ('game-music', 'game-music', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can read game music"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'game-music');

CREATE POLICY "Service role can upload game music"
ON storage.objects FOR INSERT
TO service_role
WITH CHECK (bucket_id = 'game-music');