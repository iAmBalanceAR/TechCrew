import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { SideNav } from "@/components/side-nav"
import { ThemeProvider } from "@/components/theme-provider"
import { Footer } from "@/components/footer"
import { MobileNav } from "@/components/mobile-nav"
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
            <div className="flex min-h-screen flex-col lg:flex-row">
              <div className="hidden lg:block">
                <SideNav />
              </div>
              <div className="lg:hidden">
                <MobileNav />
              </div>
              <main className="flex-1 lg:pl-64">
                <div className="container mx-auto px-4 py-4 lg:px-6 lg:py-8">
                  {children}
                  <Footer />
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

