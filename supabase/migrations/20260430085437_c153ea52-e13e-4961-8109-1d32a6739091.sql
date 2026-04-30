
-- Add evidence column (required going forward)
ALTER TABLE public.user_reports
  ADD COLUMN evidence_url TEXT;

-- Backfill any existing rows with placeholder so we can enforce NOT NULL
UPDATE public.user_reports SET evidence_url = 'legacy' WHERE evidence_url IS NULL;
ALTER TABLE public.user_reports ALTER COLUMN evidence_url SET NOT NULL;
ALTER TABLE public.user_reports
  ADD CONSTRAINT evidence_url_nonempty CHECK (char_length(evidence_url) > 0);

-- Private bucket for evidence screenshots
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-evidence', 'report-evidence', false)
ON CONFLICT (id) DO NOTHING;

-- Users can upload into a folder named with their own user id
CREATE POLICY "Users upload own report evidence"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'report-evidence'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Users can read back their own evidence
CREATE POLICY "Users read own report evidence"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'report-evidence'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
