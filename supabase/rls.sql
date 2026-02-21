-- ============================================================
-- Portal IC – Row Level Security Policies
-- Run AFTER schema.sql
-- ============================================================

-- Enable RLS on all content tables
ALTER TABLE faq_articles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_articles      ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events    ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts           ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_reports    ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins_allowlist   ENABLE ROW LEVEL SECURITY;

-- ── Helper function: is current user an admin? ───────────────
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admins_allowlist
    WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid() LIMIT 1)
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ── admins_allowlist ─────────────────────────────────────────
-- Only admins can read; no public access to the allowlist itself
CREATE POLICY "admins_allowlist_select_admin"
  ON admins_allowlist FOR SELECT
  USING (is_admin());

-- ── faq_articles ─────────────────────────────────────────────
CREATE POLICY "faq_public_read"
  ON faq_articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "faq_admin_all"
  ON faq_articles FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── news_articles ────────────────────────────────────────────
CREATE POLICY "news_public_read"
  ON news_articles FOR SELECT
  USING (status = 'published');

CREATE POLICY "news_admin_all"
  ON news_articles FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── calendar_events ──────────────────────────────────────────
CREATE POLICY "calendar_public_read"
  ON calendar_events FOR SELECT
  USING (status = 'published');

CREATE POLICY "calendar_admin_all"
  ON calendar_events FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── contacts ─────────────────────────────────────────────────
CREATE POLICY "contacts_public_read"
  ON contacts FOR SELECT
  USING (status = 'published');

CREATE POLICY "contacts_admin_all"
  ON contacts FOR ALL
  USING (is_admin())
  WITH CHECK (is_admin());

-- ── content_reports ──────────────────────────────────────────
-- Anyone can insert a report (anonymous included)
CREATE POLICY "reports_public_insert"
  ON content_reports FOR INSERT
  WITH CHECK (true);

-- Only admins can read reports
CREATE POLICY "reports_admin_read"
  ON content_reports FOR SELECT
  USING (is_admin());

CREATE POLICY "reports_admin_delete"
  ON content_reports FOR DELETE
  USING (is_admin());
