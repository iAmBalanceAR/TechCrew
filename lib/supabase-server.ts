import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

export type CookieMethods = {
  get(name: string): string | undefined
  set(name: string, value: string, options: CookieOptions): void
  remove(name: string, options: CookieOptions): void
}

// Server-side client
export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch {
            // Handle cookie setting in middleware
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 })
          } catch {
            // Handle cookie removal in middleware
          }
        }
      }
    }
  )
} 