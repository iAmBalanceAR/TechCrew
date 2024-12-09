"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ScheduleTable } from "@/components/schedule-table"

export default function SchedulePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Schedule" text="View and manage your schedule." />
      <ScheduleTable />
    </DashboardShell>
  )
}

