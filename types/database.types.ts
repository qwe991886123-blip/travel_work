export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      regions: {
        Row: {
          id: string
          name: string
          country: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          country?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          country?: string | null
          created_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          id: string
          name: string
          icon: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string | null
          created_at?: string
        }
        Relationships: []
      }
      spots: {
        Row: {
          id: string
          title: string
          description: string | null
          address: string | null
          map_url: string | null
          region_id: string | null
          cover_image: string | null
          notes: string | null
          is_favorite: boolean
          deleted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          address?: string | null
          map_url?: string | null
          region_id?: string | null
          cover_image?: string | null
          notes?: string | null
          is_favorite?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          address?: string | null
          map_url?: string | null
          region_id?: string | null
          cover_image?: string | null
          notes?: string | null
          is_favorite?: boolean
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'spots_region_id_fkey'
            columns: ['region_id']
            isOneToOne: false
            referencedRelation: 'regions'
            referencedColumns: ['id']
          }
        ]
      }
      spot_categories: {
        Row: {
          spot_id: string
          category_id: string
        }
        Insert: {
          spot_id: string
          category_id: string
        }
        Update: {
          spot_id?: string
          category_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'spot_categories_spot_id_fkey'
            columns: ['spot_id']
            isOneToOne: false
            referencedRelation: 'spots'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'spot_categories_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          }
        ]
      }
      saved_views: {
        Row: {
          id: string
          name: string
          filters: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          filters?: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          filters?: Json
          created_at?: string
        }
        Relationships: []
      }
      comments: {
        Row: {
          id: string
          spot_id: string
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          spot_id: string
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          spot_id?: string
          content?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'comments_spot_id_fkey'
            columns: ['spot_id']
            isOneToOne: false
            referencedRelation: 'spots'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

// ─── Row aliases ──────────────────────────────────────────────────────────────
export type DbRegion       = Database['public']['Tables']['regions']['Row']
export type DbCategory     = Database['public']['Tables']['categories']['Row']
export type DbSpot         = Database['public']['Tables']['spots']['Row']
export type DbSpotCategory = Database['public']['Tables']['spot_categories']['Row']
export type DbSavedView    = Database['public']['Tables']['saved_views']['Row']
export type DbComment      = Database['public']['Tables']['comments']['Row']

// ─── Insert / Update aliases ──────────────────────────────────────────────────
export type DbRegionInsert       = Database['public']['Tables']['regions']['Insert']
export type DbRegionUpdate       = Database['public']['Tables']['regions']['Update']
export type DbCategoryInsert     = Database['public']['Tables']['categories']['Insert']
export type DbCategoryUpdate     = Database['public']['Tables']['categories']['Update']
export type DbSpotInsert         = Database['public']['Tables']['spots']['Insert']
export type DbSpotUpdate         = Database['public']['Tables']['spots']['Update']
export type DbSpotCategoryInsert = Database['public']['Tables']['spot_categories']['Insert']
export type DbSavedViewInsert    = Database['public']['Tables']['saved_views']['Insert']
export type DbSavedViewUpdate    = Database['public']['Tables']['saved_views']['Update']
export type DbCommentInsert      = Database['public']['Tables']['comments']['Insert']
