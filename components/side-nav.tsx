"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { 
  Home,
  Music2,
  Calendar,
  PackageSearch,
  AlertCircle,
  LogOut,
  User,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Bands", href: "/bands", icon: Music2 },
  { name: "Schedule", href: "/schedule", icon: Calendar },
  { name: "Gig Log", href: "/gig-log", icon: Music2 },
  { name: "Inventory", href: "/inventory", icon: PackageSearch },
  { name: "Issue Tracking", href: "/issue-tracking", icon: AlertCircle },
]

export function SideNav() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [userDetails, setUserDetails] = useState<{
    email?: string;
    firstName?: string;
    lastName?: string;
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
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const initials = userDetails.firstName && userDetails.lastName
    ? `${userDetails.firstName[0]}${userDetails.lastName[0]}`
    : "TC"

  return (
    <div className={cn(
      "fixed top-0 left-0 flex h-screen flex-col justify-between border-r border-gray-800 bg-card-gradient transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <Link 
            href="/dashboard" 
            className={cn("flex items-center gap-2", isCollapsed && "justify-center")}
          >
            <Home className={cn("transition-all", isCollapsed ? "h-8 w-8" : "h-6 w-6")} />
            {!isCollapsed && <span className="text-2xl font-bold text-gradient-orange">TechCrew</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="ml-auto"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="mb-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 w-full rounded-lg p-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors">
                  <Avatar className="h-8 w-8 border border-gray-700">
                    <AvatarFallback className="bg-gray-800 text-white">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium">
                      {userDetails.firstName} {userDetails.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{userDetails.email}</p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="start" side="right">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}

        <ScrollArea className="flex-1 -mx-2">
          <nav className="space-y-0 px-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-lg px-3 py-4 text-gray-300 transition-all hover:text-white",
                      isActive ? "bg-gray-800 text-white" : "hover:bg-gray-800",
                      isCollapsed && "justify-center px-2"
                    )}
                  >
                    <item.icon className={cn(
                      "transition-all",
                      isCollapsed ? "h-8 w-8" : "h-5 w-5"
                    )} />
                    {!isCollapsed && <span>{item.name}</span>}
                  </Link>
                  {!isCollapsed && index !== navigation.length - 1 && (
                    <div className="h-px bg-gradient-orange mx-2" />
                  )}
                </div>
              )
            })}
          </nav>
        </ScrollArea>
      </div>

      {!isCollapsed && (
        <div className="px-4 py-6 border-t border-gray-800">
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-gray-800/50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Sign Out
          </Button>
        </div>
      )}
    </div>
  )
} 