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
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'tech' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['users']['Insert']>
      }
      bands: {
        Row: {
          id: string
          name: string
          home_location: string
          members: number
          last_played: string | null
          last_tech: string | null
          notes: string | null
          input_lists: string | null
          created_by: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['bands']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['bands']['Insert']>
      }
      inventory_categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory_categories']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['inventory_categories']['Insert']>
      }
      inventory_items: {
        Row: {
          id: string
          category_id: string
          model: string
          quantity: number
          notes: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['inventory_items']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['inventory_items']['Insert']>
      }
      issues: {
        Row: {
          id: string
          title: string
          description: string
          status: 'open' | 'in_progress' | 'closed'
          priority: 'low' | 'medium' | 'high'
          assigned_to: string | null
          reported_by: string
          related_item_id: string | null
          notes: string | null
          created_at: string
          updated_at: string
          closed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['issues']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['issues']['Insert']>
      }
      gig_logs: {
        Row: {
          id: string
          date: string
          band_id: string
          venue: string
          notes: string | null
          tech_id: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['gig_logs']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['gig_logs']['Insert']>
      }
      equipment_checkouts: {
        Row: {
          id: string
          item_id: string
          quantity: number
          checked_out_by: string
          checked_out_at: string
          expected_return_date: string | null
          actual_return_date: string | null
          notes: string | null
          status: 'checked_out' | 'returned' | 'overdue'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['equipment_checkouts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['equipment_checkouts']['Insert']>
      }
      issue_comments: {
        Row: {
          id: string
          issue_id: string
          user_id: string
          comment: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['issue_comments']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['issue_comments']['Insert']>
      }
      band_contacts: {
        Row: {
          id: string
          band_id: string
          name: string
          role: string
          email: string | null
          phone: string | null
          is_primary: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['band_contacts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['band_contacts']['Insert']>
      }
    }
  }
} 