import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

function getUrl(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_URL || ''
}

function getAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
}

// Browser client singleton — lazy initialization
let _browser: ReturnType<typeof createClient<Database>> | null = null

export function getSupabase() {
  if (!_browser) {
    const url = getUrl()
    const key = getAnonKey()
    if (!url || !key) throw new Error('Missing Supabase env vars (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)')
    _browser = createClient<Database>(url, key)
  }
  return _browser
}

// Server-side admin client — fresh per call (service role or anon fallback)
export function getSupabaseAdmin() {
  const url = getUrl()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || getAnonKey()
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  return createClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export type Order = Database['public']['Tables']['orders']['Row']
export type OrderInsert = Database['public']['Tables']['orders']['Insert']
export type StoreSettings = Database['public']['Tables']['store_settings']['Row']
export type Visitor = Database['public']['Tables']['visitors']['Row']
export type VisitorInsert = Database['public']['Tables']['visitors']['Insert']
