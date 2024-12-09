import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => request.cookies.get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => {
          response.cookies.set(name, value, options)
        },
        remove: (name: string, options: CookieOptions) => {
          response.cookies.set(name, '', { ...options, maxAge: 0 })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // If user is not signed in and the current path is not / or /auth/callback
  // redirect the user to /
  if (!session && !request.nextUrl.pathname.startsWith('/auth/callback')) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = '/'
    redirectUrl.searchParams.set(`redirectedFrom`, request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - / (home page)
     * - /auth/callback (auth callback)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|auth/callback|$).*)',
  ],
} 