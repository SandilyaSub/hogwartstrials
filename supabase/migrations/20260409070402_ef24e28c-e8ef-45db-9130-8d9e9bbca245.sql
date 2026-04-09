
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

SELECT cron.schedule(
  'weekly-house-cup-reset',
  '0 0 * * 1',
  $$
  SELECT net.http_post(
    url := 'https://qlybqauyoqsjqxwcgmri.supabase.co/functions/v1/weekly-house-cup-reset',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFseWJxYXV5b3FzanF4d2NnbXJpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDgxNTUsImV4cCI6MjA5MTIyNDE1NX0.LGLr_Cce6qciuQ_r2IIIZ0UjO_MVnsPbNOVbLTjUiVA"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);
