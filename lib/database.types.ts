export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string
          order_number: number
          name: string
          phone: string
          address: string
          city: string | null
          note: string | null
          status: string
          amount: number
          created_at: string
          updated_at: string
          ip_address: string | null
          source: string | null
        }
        Insert: {
          id?: string
          order_number?: number
          name: string
          phone: string
          address: string
          city?: string | null
          note?: string | null
          status?: string
          amount?: number
          created_at?: string
          updated_at?: string
          ip_address?: string | null
          source?: string | null
        }
        Update: {
          id?: string
          order_number?: number
          name?: string
          phone?: string
          address?: string
          city?: string | null
          note?: string | null
          status?: string
          amount?: number
          created_at?: string
          updated_at?: string
          ip_address?: string | null
          source?: string | null
        }
        Relationships: []
      }
      store_settings: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      visitors: {
        Row: {
          id: string
          ip: string | null
          country: string | null
          city: string | null
          page: string | null
          referrer: string | null
          created_at: string
        }
        Insert: {
          id?: string
          ip?: string | null
          country?: string | null
          city?: string | null
          page?: string | null
          referrer?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          ip?: string | null
          country?: string | null
          city?: string | null
          page?: string | null
          referrer?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
