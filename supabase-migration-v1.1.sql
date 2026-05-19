-- ============================================================
-- Travel Workspace v1.1 — Incremental Migration
-- Run AFTER the original supabase-migration.sql
-- Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. Fix regions table schema
--    Old: had `region TEXT` + `country TEXT`
--    New: rename region → name (represents city/area name)
-- ──────────────────────────────────────────────────────────

-- Rename column `region` → `name` if it exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'regions' AND column_name = 'region'
  ) THEN
    ALTER TABLE regions RENAME COLUMN region TO name;
  END IF;
END $$;

-- Ensure `country` column exists (nullable)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'regions' AND column_name = 'country'
  ) THEN
    ALTER TABLE regions ADD COLUMN country TEXT;
  END IF;
END $$;

-- ──────────────────────────────────────────────────────────
-- 2. Add soft delete to spots
-- ──────────────────────────────────────────────────────────

ALTER TABLE spots ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- ──────────────────────────────────────────────────────────
-- 3. Update RLS policies for regions (CRUD)
-- ──────────────────────────────────────────────────────────

-- Drop old read-only policies if they exist
DROP POLICY IF EXISTS "public select regions"    ON regions;
DROP POLICY IF EXISTS "public insert regions"    ON regions;
DROP POLICY IF EXISTS "public update regions"    ON regions;
DROP POLICY IF EXISTS "public delete regions"    ON regions;

-- Re-create with full CRUD
CREATE POLICY "public select regions" ON regions FOR SELECT USING (true);
CREATE POLICY "public insert regions" ON regions FOR INSERT WITH CHECK (true);
CREATE POLICY "public update regions" ON regions FOR UPDATE USING (true);
CREATE POLICY "public delete regions" ON regions FOR DELETE USING (true);

-- Drop old read-only policies for categories
DROP POLICY IF EXISTS "public select categories" ON categories;
DROP POLICY IF EXISTS "public insert categories" ON categories;
DROP POLICY IF EXISTS "public update categories" ON categories;
DROP POLICY IF EXISTS "public delete categories" ON categories;

-- Re-create with full CRUD
CREATE POLICY "public select categories" ON categories FOR SELECT USING (true);
CREATE POLICY "public insert categories" ON categories FOR INSERT WITH CHECK (true);
CREATE POLICY "public update categories" ON categories FOR UPDATE USING (true);
CREATE POLICY "public delete categories" ON categories FOR DELETE USING (true);

-- ──────────────────────────────────────────────────────────
-- 4. Update seed data to match new schema (name column)
-- ──────────────────────────────────────────────────────────

-- Re-seed regions using new `name` column
-- (safe to run even if data already exists via ON CONFLICT)
INSERT INTO regions (name, country) VALUES
  ('首爾',   '韓國'),
  ('釜山',   '韓國'),
  ('濟州',   '韓國'),
  ('東京',   '日本'),
  ('京都',   '日本'),
  ('大阪',   '日本'),
  ('福岡',   '日本'),
  ('台北',   '台灣'),
  ('台南',   '台灣'),
  ('巴黎',   '法國')
ON CONFLICT (name) DO UPDATE SET country = EXCLUDED.country;

-- Re-seed categories (idempotent)
INSERT INTO categories (name, icon) VALUES
  ('景點',   '🏛️'),
  ('美食',   '🍜'),
  ('咖啡',   '☕'),
  ('寺廟',   '⛩️'),
  ('拍照',   '📸'),
  ('購物',   '🛍️'),
  ('自然',   '🌿'),
  ('夜生活', '🌙'),
  ('市場',   '🏪'),
  ('海灘',   '🏖️')
ON CONFLICT (name) DO NOTHING;

-- ──────────────────────────────────────────────────────────
-- 5. Add UNIQUE constraint to regions.name (if not exists)
-- ──────────────────────────────────────────────────────────

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'regions'
      AND constraint_type = 'UNIQUE'
      AND constraint_name = 'regions_name_key'
  ) THEN
    ALTER TABLE regions ADD CONSTRAINT regions_name_key UNIQUE (name);
  END IF;
END $$;

-- ──────────────────────────────────────────────────────────
-- Done. Summary of changes:
-- ✅ regions.region column renamed to regions.name
-- ✅ spots.deleted_at column added (soft delete)
-- ✅ regions RLS: full CRUD enabled
-- ✅ categories RLS: full CRUD enabled
-- ✅ Seed data updated
-- ──────────────────────────────────────────────────────────
