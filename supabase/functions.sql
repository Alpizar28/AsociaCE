-- ============================================================
-- Portal IC – Postgres Full-Text Search Functions
-- Run AFTER rls.sql
-- ============================================================

-- ── Global search across all modules ────────────────────────
CREATE OR REPLACE FUNCTION search_all(query TEXT)
RETURNS TABLE (
  type        TEXT,
  id          UUID,
  title       TEXT,
  slug        TEXT,
  excerpt     TEXT,
  published_at TIMESTAMPTZ,
  rank        REAL
) AS $$
DECLARE
  tsq TSQUERY;
BEGIN
  -- Build a safe tsquery (websearch form handles partial/multiword queries)
  tsq := websearch_to_tsquery('spanish', query);

  RETURN QUERY

  -- FAQ articles
  SELECT
    'faq'::TEXT,
    f.id,
    f.title,
    f.slug,
    left(f.content, 200)::TEXT AS excerpt,
    f.published_at,
    ts_rank(f.fts_vector, tsq)::REAL AS rank
  FROM faq_articles f
  WHERE f.status = 'published'
    AND f.fts_vector @@ tsq

  UNION ALL

  -- News articles
  SELECT
    'news'::TEXT,
    n.id,
    n.title,
    n.slug,
    left(n.content_md, 200)::TEXT AS excerpt,
    n.published_at,
    ts_rank(n.fts_vector, tsq)::REAL AS rank
  FROM news_articles n
  WHERE n.status = 'published'
    AND n.fts_vector @@ tsq

  UNION ALL

  -- Calendar events
  SELECT
    'calendar'::TEXT,
    e.id,
    e.title,
    e.slug,
    left(coalesce(e.description_md, ''), 200)::TEXT AS excerpt,
    e.published_at,
    ts_rank(e.fts_vector, tsq)::REAL AS rank
  FROM calendar_events e
  WHERE e.status = 'published'
    AND e.fts_vector @@ tsq

  UNION ALL

  -- Contacts
  SELECT
    'contact'::TEXT,
    c.id,
    c.name AS title,
    c.id::TEXT AS slug,
    left(coalesce(c.notes, c.role_or_department, ''), 200)::TEXT AS excerpt,
    c.published_at,
    ts_rank(c.fts_vector, tsq)::REAL AS rank
  FROM contacts c
  WHERE c.status = 'published'
    AND c.fts_vector @@ tsq

  ORDER BY rank DESC;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- ── Module-specific search functions ─────────────────────────

CREATE OR REPLACE FUNCTION search_faq(query TEXT)
RETURNS SETOF faq_articles AS $$
  SELECT * FROM faq_articles
  WHERE status = 'published'
    AND fts_vector @@ websearch_to_tsquery('spanish', query)
  ORDER BY ts_rank(fts_vector, websearch_to_tsquery('spanish', query)) DESC;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION search_news(query TEXT)
RETURNS SETOF news_articles AS $$
  SELECT * FROM news_articles
  WHERE status = 'published'
    AND fts_vector @@ websearch_to_tsquery('spanish', query)
  ORDER BY ts_rank(fts_vector, websearch_to_tsquery('spanish', query)) DESC;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION search_events(query TEXT)
RETURNS SETOF calendar_events AS $$
  SELECT * FROM calendar_events
  WHERE status = 'published'
    AND fts_vector @@ websearch_to_tsquery('spanish', query)
  ORDER BY ts_rank(fts_vector, websearch_to_tsquery('spanish', query)) DESC;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION search_contacts(query TEXT)
RETURNS SETOF contacts AS $$
  SELECT * FROM contacts
  WHERE status = 'published'
    AND fts_vector @@ websearch_to_tsquery('spanish', query)
  ORDER BY ts_rank(fts_vector, websearch_to_tsquery('spanish', query)) DESC;
$$ LANGUAGE SQL STABLE SECURITY DEFINER;
