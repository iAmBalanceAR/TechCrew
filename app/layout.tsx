import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { SideNav } from "@/components/side-nav"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "TechCrew",
  description: "Manage your gigs, schedules, and events with ease",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.className} min-h-screen bg-black`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {session ? (
            <div className="flex min-h-screen">
              <SideNav />
              <main className="flex-1 pl-64">
                <div className="container mx-auto px-6 py-8">
                  {children}
                </div>
              </main>
            </div>
          ) : (
            <main className="min-h-screen">
              {children}
            </main>
          )}
        </ThemeProvider>
      </body>
    </html>
  )
}

