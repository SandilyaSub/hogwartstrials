-- Store the service role key in Vault so pg_cron can authenticate to the edge function
DO $$
DECLARE
  v_secret_id uuid;
BEGIN
  SELECT id INTO v_secret_id FROM vault.secrets WHERE name = 'weekly_reset_service_role_key';
  IF v_secret_id IS NULL THEN
    PERFORM vault.create_secret(
      'eyJhbGciOiJIUzI1NiIsImtpZCI6IjBJZ3M5YnpqUWVxOWFjbE0iLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3FseWJxYXV5b3FzanF4d2NnbXJpLnN1cGFiYXNlLmNvIi9hdXRoL3YxIiwic3ViIjoic2VydmljZV9yb2xlIiwiYXVkIjoic2VydmljZV9yb2xlIiwiZXhwIjoyMDkxMjI0MTU1LCJpYXQiOjE3NzU2NDgxNTUsInJvbGUiOiJzZXJ2aWNlX3JvbGUiLCJhYWwiOiJhYWwxIiwic2Vzc2lvbl9pZCI6IiJ9.placeholder',
      'weekly_reset_service_role_key',
      'Service role key used by pg_cron to call weekly-house-cup-reset'
    );
  END IF;
END $$;

-- Unschedule the broken old cron job
SELECT cron.unschedule('weekly-house-cup-reset')
WHERE EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'weekly-house-cup-reset');

-- Recreate cron job that pulls the service role key from Vault each invocation
SELECT cron.schedule(
  'weekly-house-cup-reset',
  '0 0 * * 1',
  $job$
  SELECT net.http_post(
    url := 'https://qlybqauyoqsjqxwcgmri.supabase.co/functions/v1/weekly-house-cup-reset',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        SELECT decrypted_secret FROM vault.decrypted_secrets
        WHERE name = 'weekly_reset_service_role_key' LIMIT 1
      )
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $job$
);