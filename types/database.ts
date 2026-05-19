export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      regions: {
        Row: { id: string; country: string; region: string; created_at: string }
        Insert: { id?: string; country: string; region: string; created_at?: string }
        Update: { id?: string; country?: string; region?: string; created_at?: string }
      }
      categories: {
        Row: { id: string; name: string; icon: string | null; created_at: string }
        Insert: { id?: string; name: string; icon?: string | null; created_at?: string }
        Update: { id?: string; name?: string; icon?: string | null; created_at?: string }
      }
      spots: {
        Row: {
          id: string; title: string; description: string | null
          address: string | null; map_url: string | null; region_id: string | null
          cover_image: string | null; notes: string | null
          is_favorite: boolean; created_at: string; updated_at: string
        }
        Insert: {
          id?: string; title: string; description?: string | null
          address?: string | null; map_url?: string | null; region_id?: string | null
          cover_image?: string | null; notes?: string | null
          is_favorite?: boolean; created_at?: string; updated_at?: string
        }
        Update: {
          id?: string; title?: string; description?: string | null
          address?: string | null; map_url?: string | null; region_id?: string | null
          cover_image?: string | null; notes?: string | null
          is_favorite?: boolean; created_at?: string; updated_at?: string
        }
      }
      spot_categories: {
        Row: { spot_id: string; category_id: string }
        Insert: { spot_id: string; category_id: string }
        Update: { spot_id?: string; category_id?: string }
      }
      saved_views: {
        Row: { id: string; name: string; filters: Json; created_at: string }
        Insert: { id?: string; name: string; filters: Json; created_at?: string }
        Update: { id?: string; name?: string; filters?: Json; created_at?: string }
      }
      comments: {
        Row: { id: string; spot_id: string; content: string; created_at: string }
        Insert: { id?: string; spot_id: string; content: string; created_at?: string }
        Update: { id?: string; spot_id?: string; content?: string; created_at?: string }
      }
    }
  }
}
