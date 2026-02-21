-- ============================================================
-- Portal IC – Seed Data
-- Run AFTER all other SQL files
-- IMPORTANT: Replace placeholder emails with real admin emails
-- ============================================================

INSERT INTO admins_allowlist (email, role) VALUES
  -- Replace with real authorized emails:
  ('secretaria@tec.ac.cr',  'secretaria'),
  ('aseic@estudiantec.cr',  'aseic'),
  ('admin2@estudiantec.cr', 'aseic')
ON CONFLICT (email) DO NOTHING;
