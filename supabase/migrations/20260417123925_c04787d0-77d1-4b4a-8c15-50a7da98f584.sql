-- Ensure RLS is enabled on realtime.messages
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

-- Drop prior version if it exists
DROP POLICY IF EXISTS "Authenticated can subscribe to house_leaderboard topic" ON realtime.messages;

-- Allow authenticated users to subscribe ONLY to the house_leaderboard topic
CREATE POLICY "Authenticated can subscribe to house_leaderboard topic"
ON realtime.messages
FOR SELECT
TO authenticated
USING (
  (realtime.topic() = 'house_leaderboard')
);