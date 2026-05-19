# 🗺️ Travel Workspace

旅遊靈感收藏 + 個人旅遊知識庫。定位介於 Notion、Pinterest、Raindrop.io 與 Google Maps 收藏之間。

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **Gallery Workspace** | 視覺優先的 4 欄 Card Grid，點擊後右側展開 Detail Panel |
| **Saved Views** | 可自訂篩選 Tab（釜山美食 / 東京咖啡），支援 CRUD + Supabase 持久化 |
| **Detail Side Panel** | 類 Notion Peek，桌面右側展開、手機底部 Sheet |
| **Add Spot Modal** | 拖放上傳封面、多選分類、Map URL 預覽 |
| **Notes 自動渲染** | YouTube URL → embed、圖片 URL → 顯示、純文字 → 段落 |
| **Comments Timeline** | 按時間排列的旅遊筆記，支援新增 / 刪除 |
| **Full Page** | `/spots/[id]` 完整頁面 — Hero / Notes / Comments / Map |
| **搜尋 + 篩選** | 即時搜尋標題，搭配 Saved Views 組合篩選 |
| **Responsive** | Desktop 4 欄 + Right Panel ／ Tablet 2 欄 ／ Mobile 單欄 + Bottom Sheet |

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict, zero `any`) |
| Styling | Tailwind CSS |
| Icons | Lucide React |
| Data Fetching | TanStack Query v5 |
| Forms | React Hook Form + Zod v4 |
| Backend | Supabase (PostgreSQL + Storage + RLS) |

---

## 📁 Architecture

```
/app
  page.tsx              ← Main workspace (Gallery + Panel)
  /spots/[id]/page.tsx  ← Full page detail

/features
  /spots/components
    SpotCard.tsx         ← Card with favorite / open actions
    SpotCardSkeleton.tsx ← Loading skeleton
    DetailPanel.tsx      ← Side panel + bottom sheet
    AddSpotModal.tsx     ← Create spot modal
  /views/components
    SavedViewTabs.tsx    ← CRUD filter tabs
  /comments/components
    CommentTimeline.tsx  ← Timeline with add/delete

/components
  NotesRenderer.tsx      ← YouTube / image / text auto-parse
  SearchBar.tsx

/hooks
  useSpots.ts            ← TanStack Query hooks for spots
  useData.ts             ← regions / categories / views / comments

/services               ← ALL Supabase calls isolated here
  spots.ts              ← fetchSpots / createSpot / updateSpot / deleteSpot / toggleFavorite
  comments.ts           ← fetchComments / createComment / deleteComment
  savedViews.ts         ← CRUD for saved_views
  regions.ts            ← fetchRegions / fetchCategories

/lib
  supabase/client.ts    ← createBrowserClient<Database>
  env.ts                ← Zod env validation
  QueryProvider.tsx     ← TanStack Query provider

/types
  database.types.ts     ← Full Database interface (with Relationships[])
  index.ts              ← Domain types (Spot, SavedView, Comment…)

/utils
  index.ts              ← cn / formatDate / parseNotes / YouTube utils
```

---

## 🚀 Quick Start

### 1. Install

```bash
unzip travel-workspace.zip
cd travel-workspace
npm install
```

### 2. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) → New Project
2. Dashboard → **SQL Editor** → New Query
3. Paste the contents of `supabase-migration.sql` and **Run**

This creates all tables, RLS policies, storage bucket, seed regions/categories, and 4 sample spots.

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> **Where to find these:** Supabase Dashboard → Settings → API

### 4. Run

```bash
npm run dev
# → http://localhost:3000
```

---

## 🛠️ Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run type-check   # TypeScript check (zero errors)
npm run lint         # ESLint (zero errors, zero any)
```

---

## 🗄️ Database Schema

```
regions         id, country, region
categories      id, name, icon
spots           id, title, description, address, map_url, cover_image,
                notes, region_id→regions, is_favorite
spot_categories spot_id→spots, category_id→categories
saved_views     id, name, filters (JSONB)
comments        id, spot_id→spots, content
```

All tables have **Row Level Security** enabled.  
Current policies are open (personal workspace, no auth). Add `auth.uid()` predicates to lock down per-user.

---

## 📝 Notes Syntax

Notes support mixed content — auto-detected on save:

```
這是一段普通文字。

https://www.youtube.com/watch?v=xxxxxx
↑ 自動 embed YouTube player

https://example.com/photo.jpg
↑ 自動顯示圖片

更多交通資訊或其他文字...
```

---

## 🎨 Saved Views

Views are stored in `saved_views.filters` as JSONB:

```json
{ "region": "釜山", "categories": ["美食"] }
{ "region": "東京", "categories": ["咖啡"] }
```

Click **+ New View** in the tab bar to create. Hover any view tab to reveal the ✕ delete button.

---

## 🔐 Type Safety

- `Database` interface in `types/database.types.ts` is **fully typed** including `Relationships[]` arrays required by `@supabase/supabase-js` generics
- Every service method has an **explicit return type** (`Promise<Spot>`, `Promise<void>`, etc.)
- Every `.insert()` / `.update()` uses **typed payload** (`DbSpotInsert`, `DbSpotUpdate`, etc.)
- Zero `as any`, zero `never[]` inference issues
- Zod schema uses stable non-optional field types for correct `zodResolver` inference

---

## 🚀 Deploy to Vercel

```bash
npx vercel

# Set environment variables in Vercel Dashboard:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
```

---

## 📦 Generating Supabase Types (Optional)

After running the migration, you can regenerate types from the live schema:

```bash
npx supabase gen types typescript \
  --project-id your-project-id \
  --schema public \
  > types/database.types.ts
```

> Note: The generated file will be missing the `Relationships` arrays. You'll need to add them back, or use the existing `types/database.types.ts` which already includes them.
