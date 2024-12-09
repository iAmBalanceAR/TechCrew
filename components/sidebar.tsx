"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Home, FileText, Users, Package, AlertCircle, ChevronLeft, ChevronRight, LogOut } from 'lucide-react'
import { Footer } from "./footer"

const routes = [
  {
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
  },
  {
    label: 'Gig Log',
    icon: FileText,
    href: '/gig-log',
  },
  {
    label: 'Bands',
    icon: Users,
    href: '/bands',
  },
  {
    label: 'Inventory',
    icon: Package,
    href: '/inventory',
  },
  {
    label: 'Issue Tracking',
    icon: AlertCircle,
    href: '/issue-tracking',
  },
  {
    label: 'Sign Out',
    icon: LogOut,
    href: '/sign-out',
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className={cn(
      "fixed top-0 left-0 flex flex-col min-h-screen sidebarbg border-r transition-all duration-300",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex justify-between items-center">
        <Link href="/" className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
          <Home className={cn("transition-all", isCollapsed ? "h-8 w-8" : "h-6 w-6")} />
          {!isCollapsed && <span className="font-bold text-lg">TechCrew</span>}
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
      <ScrollArea className="flex-1 px-4">
        <nav className="flex flex-col gap-1 mt-2">
          {routes.map((route, index) => {
            const Icon = route.icon
            return (
              <div key={route.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start items-center transition-all",
                    pathname === route.href && "bg-secondary",
                    isCollapsed && "justify-center"
                  )}
                  asChild
                >
                  <Link href={route.href} className="flex items-center">
                    <Icon className={cn(
                      "transition-all",
                      isCollapsed ? "h-8 w-8" : "h-4 w-4 mr-2"
                    )} />
                    {!isCollapsed && <span>{route.label}</span>}
                  </Link>
                </Button>
                {index !== routes.length - 1 && (
                  <div className="h-px bg-gradient-orange my-2" />
                )}
              </div>
            )
          })}
        </nav>
      </ScrollArea>
      {!isCollapsed && <Footer />}
    </div>
  )
}

