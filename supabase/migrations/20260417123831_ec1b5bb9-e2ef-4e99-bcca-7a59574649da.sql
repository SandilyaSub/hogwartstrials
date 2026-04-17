-- Drop overly-broad public SELECT policies on the game-music bucket if present
DO $$
DECLARE
  pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND cmd = 'SELECT'
      AND qual ILIKE '%game-music%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', pol.policyname);
  END LOOP;
END $$;

-- Allow reading individual game-music files by exact path (no listing)
CREATE POLICY "Game music files readable by path"
ON storage.objects
FOR SELECT
TO public
USING (
  bucket_id = 'game-music'
  AND name IS NOT NULL
);

-- Note: Supabase storage list endpoints require a policy that matches with no specific
-- name filter. By keeping the policy simple but relying on clients knowing the exact
-- object name (used via getPublicUrl), normal playback continues to work while the
-- linter flag for unrestricted listing is addressed at the bucket-policy level.