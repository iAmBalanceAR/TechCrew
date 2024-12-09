"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, FileText, Users, Package, AlertCircle } from 'lucide-react'

export function MainNav() {
  const pathname = usePathname()

  const routes = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/gig-log", label: "Gig Log", icon: FileText },
    { href: "/bands", label: "Bands", icon: Users },
    { href: "/inventory", label: "Inventory", icon: Package },
    { href: "/issue-tracking", label: "Issue Tracking", icon: AlertCircle },
  ]

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Home className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block text-gradient-orange">
          TechCrew
        </span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        {routes.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center transition-colors hover:text-foreground/80",
              pathname === href || pathname?.startsWith(href)
                ? "text-foreground"
                : "text-foreground/60"
            )}
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}

