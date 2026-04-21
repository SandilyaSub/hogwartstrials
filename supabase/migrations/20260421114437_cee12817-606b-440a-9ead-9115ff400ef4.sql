-- 1. Catch-up: record Ravenclaw as winner for the week starting Mon 2026-04-20
-- (the Monday cron silently failed due to bad auth header)
INSERT INTO public.house_cup_winners (house_id, house_name, house_color, house_emoji, total_points, week_start)
SELECT house_id, house_name, house_color, house_emoji, total_points, DATE '2026-04-20'
FROM public.house_leaderboard
WHERE NOT EXISTS (
  SELECT 1 FROM public.house_cup_winners WHERE week_start = DATE '2026-04-20'
)
ORDER BY total_points DESC
LIMIT 1;

-- 2. Reset all house points to zero so the new week starts fresh
UPDATE public.house_leaderboard
SET total_points = 0, updated_at = now()
WHERE total_points > 0;

-- 3. Replace the cron job with a simpler version that doesn't need auth
SELECT cron.unschedule('weekly-house-cup-reset')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-house-cup-reset');

SELECT cron.schedule(
  'weekly-house-cup-reset',
  '0 0 * * 1',
  $job$
  SELECT net.http_post(
    url := 'https://qlybqauyoqsjqxwcgmri.supabase.co/functions/v1/weekly-house-cup-reset',
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $job$
);