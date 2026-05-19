-- ============================================================
-- Travel Workspace — Full Supabase Migration + Seed
-- Run in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ──────────────────────────────────────────────────────────
-- 1. TABLES
-- ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS regions (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  country    TEXT        NOT NULL,
  region     TEXT        NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS categories (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL UNIQUE,
  icon       TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS spots (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT        NOT NULL,
  description TEXT,
  address     TEXT,
  map_url     TEXT,
  region_id   UUID        REFERENCES regions(id)   ON DELETE SET NULL,
  cover_image TEXT,
  notes       TEXT,
  is_favorite BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS spot_categories (
  spot_id     UUID REFERENCES spots(id)      ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (spot_id, category_id)
);

CREATE TABLE IF NOT EXISTS saved_views (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  name       TEXT        NOT NULL,
  filters    JSONB       NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS comments (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  spot_id    UUID        NOT NULL REFERENCES spots(id) ON DELETE CASCADE,
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ──────────────────────────────────────────────────────────
-- 2. ROW LEVEL SECURITY
-- ──────────────────────────────────────────────────────────

ALTER TABLE regions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories    ENABLE ROW LEVEL SECURITY;
ALTER TABLE spots         ENABLE ROW LEVEL SECURITY;
ALTER TABLE spot_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_views   ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments      ENABLE ROW LEVEL SECURITY;

-- Public read (personal workspace — no auth needed)
CREATE POLICY "public select regions"        ON regions        FOR SELECT USING (true);
CREATE POLICY "public select categories"     ON categories     FOR SELECT USING (true);
CREATE POLICY "public select spots"          ON spots          FOR SELECT USING (true);
CREATE POLICY "public select spot_cats"      ON spot_categories FOR SELECT USING (true);
CREATE POLICY "public select saved_views"    ON saved_views    FOR SELECT USING (true);
CREATE POLICY "public select comments"       ON comments       FOR SELECT USING (true);

-- Write
CREATE POLICY "public insert spots"          ON spots          FOR INSERT WITH CHECK (true);
CREATE POLICY "public update spots"          ON spots          FOR UPDATE USING (true);
CREATE POLICY "public delete spots"          ON spots          FOR DELETE USING (true);

CREATE POLICY "public insert spot_cats"      ON spot_categories FOR INSERT WITH CHECK (true);
CREATE POLICY "public delete spot_cats"      ON spot_categories FOR DELETE USING (true);

CREATE POLICY "public insert saved_views"    ON saved_views    FOR INSERT WITH CHECK (true);
CREATE POLICY "public update saved_views"    ON saved_views    FOR UPDATE USING (true);
CREATE POLICY "public delete saved_views"    ON saved_views    FOR DELETE USING (true);

CREATE POLICY "public insert comments"       ON comments       FOR INSERT WITH CHECK (true);
CREATE POLICY "public delete comments"       ON comments       FOR DELETE USING (true);

-- ──────────────────────────────────────────────────────────
-- 3. STORAGE BUCKET
-- ──────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'spot-images',
  'spot-images',
  true,
  10485760,   -- 10 MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif','image/avif']
)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "public select spot-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'spot-images');

CREATE POLICY "public insert spot-images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'spot-images');

CREATE POLICY "public delete spot-images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'spot-images');

-- ──────────────────────────────────────────────────────────
-- 4. SEED — Regions
-- ──────────────────────────────────────────────────────────

INSERT INTO regions (country, region) VALUES
  ('韓國', '首爾'),
  ('韓國', '釜山'),
  ('韓國', '濟州'),
  ('日本', '東京'),
  ('日本', '京都'),
  ('日本', '大阪'),
  ('日本', '福岡'),
  ('台灣', '台北'),
  ('台灣', '台南'),
  ('法國', '巴黎')
ON CONFLICT (region) DO NOTHING;

-- ──────────────────────────────────────────────────────────
-- 5. SEED — Categories
-- ──────────────────────────────────────────────────────────

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
-- 6. SEED — Sample Spots
-- ──────────────────────────────────────────────────────────

WITH
  r_busan  AS (SELECT id FROM regions WHERE region = '釜山'),
  r_seoul  AS (SELECT id FROM regions WHERE region = '首爾'),
  r_tokyo  AS (SELECT id FROM regions WHERE region = '東京'),
  c_sight  AS (SELECT id FROM categories WHERE name = '景點'),
  c_temple AS (SELECT id FROM categories WHERE name = '寺廟'),
  c_photo  AS (SELECT id FROM categories WHERE name = '拍照'),
  c_food   AS (SELECT id FROM categories WHERE name = '美食'),
  c_coffee AS (SELECT id FROM categories WHERE name = '咖啡'),

  inserted AS (
    INSERT INTO spots (title, description, address, map_url, region_id, cover_image, notes)
    VALUES
      (
        '梵魚寺',
        '韓國代表性寺廟之一，擁有超過千年歷史，附近是金井山，適合登山健行。',
        '부산 금정구 범어사로 250',
        'https://naver.me/5Rh0PDIh',
        (SELECT id FROM r_busan),
        'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=1200&auto=format&fit=crop',
        E'韓國代表性寺廟之一，擁有超過千年歷史。\n\n附近是金井山，時間夠的話可以慢慢散步。\n\n地鐵梵魚寺站出站後，需要再搭乘公車前往。'
      ),
      (
        '甘川洞文化村',
        '彩色山城與觀景平台，是釜山最受歡迎的拍照景點之一，很適合悠閒散步。',
        '부산 사하구 감내2로 203',
        'https://maps.google.com',
        (SELECT id FROM r_busan),
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
        E'彩色的房屋沿著山坡層疊而上，非常上鏡。\n\n建議早上去人比較少。\n\n附近有一些不錯的小咖啡館。'
      ),
      (
        '土俗村蔘雞湯',
        '首爾知名蔘雞湯老店，常常大排長龍，但絕對值得等待。',
        '서울 종로구 자하문로5길 5',
        'https://maps.google.com',
        (SELECT id FROM r_seoul),
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
        E'建議開店前就去排隊，週末尤其人多。\n\n蔘雞湯份量很大，一個人剛好。\n\n記得帶現金，不確定是否接受刷卡。'
      ),
      (
        'Blue Bottle Tokyo 清澄白河',
        '美國精品咖啡品牌，東京第一間店，工業風空間設計，週末人潮很多。',
        '東京都江東区平野1-4-8',
        'https://maps.google.com',
        (SELECT id FROM r_tokyo),
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1200&auto=format&fit=crop',
        E'極簡工業風設計，是打卡聖地。\n\n週末排隊時間約 30 分鐘。\n\n附近的清澄白河也是東京咖啡激戰區，可以一次逛多間。'
      )
    RETURNING id, title
  ),

  spot_梵魚寺  AS (SELECT id FROM inserted WHERE title = '梵魚寺'),
  spot_甘川    AS (SELECT id FROM inserted WHERE title = '甘川洞文化村'),
  spot_蔘雞湯  AS (SELECT id FROM inserted WHERE title = '土俗村蔘雞湯'),
  spot_bb      AS (SELECT id FROM inserted WHERE title = 'Blue Bottle Tokyo 清澄白河')

INSERT INTO spot_categories (spot_id, category_id)
VALUES
  ((SELECT id FROM spot_梵魚寺), (SELECT id FROM c_sight)),
  ((SELECT id FROM spot_梵魚寺), (SELECT id FROM c_temple)),
  ((SELECT id FROM spot_甘川),   (SELECT id FROM c_sight)),
  ((SELECT id FROM spot_甘川),   (SELECT id FROM c_photo)),
  ((SELECT id FROM spot_蔘雞湯), (SELECT id FROM c_food)),
  ((SELECT id FROM spot_bb),     (SELECT id FROM c_coffee));

-- ──────────────────────────────────────────────────────────
-- 7. SEED — Sample Saved Views
-- ──────────────────────────────────────────────────────────

INSERT INTO saved_views (name, filters) VALUES
  ('首爾',   '{"region": "首爾"}'),
  ('釜山',   '{"region": "釜山"}'),
  ('釜山美食', '{"region": "釜山", "categories": ["美食"]}'),
  ('東京咖啡', '{"region": "東京", "categories": ["咖啡"]}')
ON CONFLICT DO NOTHING;

-- ──────────────────────────────────────────────────────────
-- 8. SEED — Sample Comments
-- ──────────────────────────────────────────────────────────

INSERT INTO comments (spot_id, content, created_at)
SELECT
  (SELECT id FROM spots WHERE title = '梵魚寺'),
  '秋天好像很漂亮，之後可以安排楓葉季再來。',
  '2026-05-14T10:00:00Z'
WHERE EXISTS (SELECT 1 FROM spots WHERE title = '梵魚寺');

INSERT INTO comments (spot_id, content, created_at)
SELECT
  (SELECT id FROM spots WHERE title = '梵魚寺'),
  '地鐵站出來後還要搭公車，交通時間要抓一下。',
  '2026-06-02T14:30:00Z'
WHERE EXISTS (SELECT 1 FROM spots WHERE title = '梵魚寺');
