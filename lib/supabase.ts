import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// Client-side singleton
export const createBrowserSupabaseClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
} 