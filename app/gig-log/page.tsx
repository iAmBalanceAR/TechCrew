"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { GigLogTable } from "@/components/gig-log-table"

export default function GigLogPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Gig Log" text="View and manage your gig logs." />
      <GigLogTable />
    </DashboardShell>
  )
}

