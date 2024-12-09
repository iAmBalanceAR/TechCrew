"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { BandsTable } from "@/components/bands-table"

export default function BandsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Bands" text="View and manage your bands." />
      <BandsTable />
    </DashboardShell>
  )
}

