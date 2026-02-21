-- ============================================================
-- Portal IC – Database Schema
-- Run this SQL in Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── admins_allowlist ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admins_allowlist (
  email TEXT PRIMARY KEY,
  role  TEXT NOT NULL CHECK (role IN ('secretaria', 'aseic')),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ── faq_articles ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS faq_articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  category         TEXT NOT NULL CHECK (category IN (
                     'matricula','tramites','laboratorios','becas',
                     'reglamentos','graduacion','vida_estudiantil')),
  content          TEXT NOT NULL,
  cover_image_url  TEXT,
  attachment_pdf_url TEXT,
  source_url       TEXT,
  status           TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft','published','archived')),
  published_at     TIMESTAMPTZ,
  updated_at       TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by       TEXT NOT NULL,
  fts_vector       TSVECTOR GENERATED ALWAYS AS (
                     to_tsvector('spanish', coalesce(title,'') || ' ' || coalesce(content,''))
                   ) STORED
);

CREATE INDEX IF NOT EXISTS faq_articles_fts_idx ON faq_articles USING GIN (fts_vector);
CREATE INDEX IF NOT EXISTS faq_articles_status_idx ON faq_articles (status);
CREATE INDEX IF NOT EXISTS faq_articles_category_idx ON faq_articles (category);

-- ── news_articles ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS news_articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  content_md       TEXT NOT NULL,
  cover_image_url  TEXT,
  attachment_pdf_url TEXT,
  pinned           BOOLEAN DEFAULT false NOT NULL,
  source_url       TEXT,
  status           TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft','published','archived')),
  published_at     TIMESTAMPTZ,
  updated_at       TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by       TEXT NOT NULL,
  fts_vector       TSVECTOR GENERATED ALWAYS AS (
                     to_tsvector('spanish', coalesce(title,'') || ' ' || coalesce(content_md,''))
                   ) STORED
);

CREATE INDEX IF NOT EXISTS news_articles_fts_idx ON news_articles USING GIN (fts_vector);
CREATE INDEX IF NOT EXISTS news_articles_status_idx ON news_articles (status);
CREATE INDEX IF NOT EXISTS news_articles_pinned_idx ON news_articles (pinned);

-- ── calendar_events ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS calendar_events (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  start_datetime   TIMESTAMPTZ NOT NULL,
  end_datetime     TIMESTAMPTZ,
  type             TEXT NOT NULL CHECK (type IN ('matricula','evaluacion','tramite','otro')),
  location         TEXT,
  description_md   TEXT,
  attachment_pdf_url TEXT,
  source_url       TEXT,
  status           TEXT NOT NULL DEFAULT 'draft'
                     CHECK (status IN ('draft','published','archived')),
  published_at     TIMESTAMPTZ,
  updated_at       TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by       TEXT NOT NULL,
  fts_vector       TSVECTOR GENERATED ALWAYS AS (
                     to_tsvector('spanish',
                       coalesce(title,'') || ' ' ||
                       coalesce(description_md,'') || ' ' ||
                       coalesce(location,''))
                   ) STORED
);

CREATE INDEX IF NOT EXISTS calendar_events_fts_idx ON calendar_events USING GIN (fts_vector);
CREATE INDEX IF NOT EXISTS calendar_events_status_idx ON calendar_events (status);
CREATE INDEX IF NOT EXISTS calendar_events_start_idx ON calendar_events (start_datetime);
CREATE INDEX IF NOT EXISTS calendar_events_type_idx ON calendar_events (type);

-- ── contacts ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contacts (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kind               TEXT NOT NULL CHECK (kind IN ('persona','departamento','entidad')),
  name               TEXT NOT NULL,
  role_or_department TEXT,
  email              TEXT,
  phone              TEXT,
  location           TEXT,
  hours              TEXT,
  link               TEXT,
  notes              TEXT,
  cover_image_url    TEXT,
  status             TEXT NOT NULL DEFAULT 'draft'
                       CHECK (status IN ('draft','published','archived')),
  published_at       TIMESTAMPTZ,
  updated_at         TIMESTAMPTZ DEFAULT now() NOT NULL,
  created_by         TEXT NOT NULL,
  fts_vector         TSVECTOR GENERATED ALWAYS AS (
                       to_tsvector('spanish',
                         coalesce(name,'') || ' ' ||
                         coalesce(role_or_department,'') || ' ' ||
                         coalesce(notes,''))
                     ) STORED
);

CREATE INDEX IF NOT EXISTS contacts_fts_idx ON contacts USING GIN (fts_vector);
CREATE INDEX IF NOT EXISTS contacts_status_idx ON contacts (status);
CREATE INDEX IF NOT EXISTS contacts_kind_idx ON contacts (kind);

-- ── content_reports ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS content_reports (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type  TEXT NOT NULL CHECK (page_type IN ('faq','news','calendar','contact')),
  page_id    UUID NOT NULL,
  message    TEXT NOT NULL CHECK (char_length(message) <= 500),
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS content_reports_created_idx ON content_reports (created_at DESC);

-- ── updated_at trigger ───────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['faq_articles','news_articles','calendar_events','contacts']
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I;
       CREATE TRIGGER set_updated_at
       BEFORE UPDATE ON %I
       FOR EACH ROW EXECUTE FUNCTION update_updated_at();',
      tbl, tbl
    );
  END LOOP;
END;
$$;
