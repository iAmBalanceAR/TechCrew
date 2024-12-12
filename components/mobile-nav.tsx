"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { 
  Home,
  Music2,
  Calendar,
  PackageSearch,
  AlertCircle,
  LogOut,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import * as Dialog from "@radix-ui/react-dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Bands", href: "/bands", icon: Music2 },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Gig Log", href: "/gig-log", icon: Music2 },
  { name: "Issue Tracking", href: "/issue-tracking", icon: AlertCircle },
]

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [isOpen, setIsOpen] = useState(false)
  const [userDetails, setUserDetails] = useState<{
    email?: string
    firstName?: string
    lastName?: string
  }>({})

  useEffect(() => {
    async function getUserDetails() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserDetails({
          email: user.email,
          firstName: user.user_metadata.first_name,
          lastName: user.user_metadata.last_name,
        })
      }
    }
    getUserDetails()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const initials = userDetails.firstName && userDetails.lastName
    ? `${userDetails.firstName[0]}${userDetails.lastName[0]}`
    : "TC"

  return (
    <div className="sticky top-0 z-50 w-full border-b border-gray-800 bg-card-gradient">
      <div className="flex h-16 items-center px-4">
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
          <Dialog.Trigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden min-h-[44px] min-w-[44px]"
              aria-label="Toggle menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
            <Dialog.Content className="fixed left-0 top-0 h-full w-[300px] bg-card-gradient p-0 shadow-lg focus:outline-none">
              <Dialog.Title asChild>
                <div className="sr-only">Navigation Menu</div>
              </Dialog.Title>
              <nav className="flex flex-col h-full" role="navigation" aria-label="Main navigation">
                <div className="p-4 border-b border-gray-800">
                  <Link 
                    href="/dashboard" 
                    className="flex items-center gap-2 min-h-[44px]"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="h-6 w-6" aria-hidden="true" />
                    <span className="text-2xl font-bold text-gradient-orange">TechCrew</span>
                  </Link>
                </div>
                
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center gap-3 min-h-[44px]">
                    <Avatar className="h-10 w-10 border border-gray-700">
                      <AvatarFallback className="bg-gray-800 text-white">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">
                        {userDetails.firstName} {userDetails.lastName}
                      </p>
                      <p className="text-sm text-gray-400">{userDetails.email}</p>
                    </div>
                  </div>
                </div>

                <ScrollArea className="flex-1">
                  <div className="p-4 space-y-2">
                    {navigation.map((item, index) => {
                      const isActive = pathname === item.href
                      return (
                        <div key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-lg px-4 py-3 min-h-[44px] text-gray-300 transition-all hover:text-white",
                              isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800"
                            )}
                            aria-current={isActive ? "page" : undefined}
                          >
                            <item.icon className="h-6 w-6 flex-shrink-0" aria-hidden="true" />
                            <span className="text-base">{item.name}</span>
                          </Link>
                          {index !== navigation.length - 1 && (
                            <div className="h-px bg-gradient-orange mx-2 my-2" role="separator" aria-hidden="true" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-gray-800">
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-gray-800/50 min-h-[44px]"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-3 h-6 w-6" aria-hidden="true" />
                    <span className="text-base">Sign Out</span>
                  </Button>
                </div>
              </nav>
              <Dialog.Close asChild>
                <button
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-800/50"
                  aria-label="Close navigation"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        <Link 
          href="/dashboard" 
          className="ml-4 flex items-center gap-2 lg:hidden min-h-[44px]"
        >
          <span className="text-xl font-bold text-gradient-orange">TechCrew</span>
        </Link>
      </div>
    </div>
  )
} 