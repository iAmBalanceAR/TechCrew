"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { IssueTable } from "@/components/issue-table"

export default function IssueTrackingPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Issue Tracking" text="View and manage your issues." />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Open Issues</h2>
        <IssueTable status="open" />
        <h2 className="text-2xl font-bold mt-8">Closed Issues</h2>
        <IssueTable status="closed" />
      </div>
    </DashboardShell>
  )
}

