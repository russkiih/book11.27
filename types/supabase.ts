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
      services: {
        Row: {
          id: string
          name: string
          description: string | null
          duration: number
          price: number
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          duration: number
          price: number
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          duration?: number
          price?: number
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          service_id: string
          provider_id: string
          customer_name: string
          customer_email: string
          booking_date: string
          booking_time: string
          notes: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          service_id: string
          provider_id: string
          customer_name: string
          customer_email: string
          booking_date: string
          booking_time: string
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          service_id?: string
          provider_id?: string
          customer_name?: string
          customer_email?: string
          booking_date?: string
          booking_time?: string
          notes?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
    Functions: {
      get_profile_by_username: {
        Args: { username_param: string }
        Returns: Database['public']['Tables']['profiles']['Row'][]
      }
    }
  }
} 