-- ============================================================
-- Portal IC – Storage Buckets & Policies
-- Run AFTER rls.sql
-- ============================================================

-- Create buckets (public = downloadable without auth)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('kb',       'kb',       true, 10485760, ARRAY['image/jpeg','image/png','image/webp','application/pdf']),
  ('news',     'news',     true, 10485760, ARRAY['image/jpeg','image/png','image/webp','application/pdf']),
  ('events',   'events',   true, 10485760, ARRAY['image/jpeg','image/png','image/webp','application/pdf']),
  ('contacts', 'contacts', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','application/pdf'])
ON CONFLICT (id) DO NOTHING;

-- ── Upload policies (admin only) ─────────────────────────────
DO $$
DECLARE
  bucket TEXT;
BEGIN
  FOREACH bucket IN ARRAY ARRAY['kb','news','events','contacts']
  LOOP
    -- INSERT (upload)
    EXECUTE format(
      'CREATE POLICY "%s_upload_admin" ON storage.objects
       FOR INSERT WITH CHECK (
         bucket_id = %L AND is_admin()
       );',
      bucket, bucket
    );

    -- UPDATE (replace file)
    EXECUTE format(
      'CREATE POLICY "%s_update_admin" ON storage.objects
       FOR UPDATE USING (
         bucket_id = %L AND is_admin()
       );',
      bucket, bucket
    );

    -- DELETE
    EXECUTE format(
      'CREATE POLICY "%s_delete_admin" ON storage.objects
       FOR DELETE USING (
         bucket_id = %L AND is_admin()
       );',
      bucket, bucket
    );

    -- SELECT (public download – bucket is already public, but explicit policy)
    EXECUTE format(
      'CREATE POLICY "%s_read_public" ON storage.objects
       FOR SELECT USING (bucket_id = %L);',
      bucket, bucket
    );
  END LOOP;
END;
$$;
