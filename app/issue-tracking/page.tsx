"use client"

import { useState } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { IssueTable } from "@/components/issue-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

function PriorityLegend() {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-muted-foreground">Priority:</span>
      {[
        { level: "low", color: "bg-green-500" },
        { level: "medium", color: "bg-yellow-500" },
        { level: "high", color: "bg-red-500" }
      ].map(({ level, color }) => (
        <div key={level} className="flex items-center gap-1">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-sm capitalize">{level}</span>
        </div>
      ))}
    </div>
  )
}

export default function IssueTrackingPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <DashboardShell>
      <DashboardHeader heading="Issue Tracking" text="View and manage your issues." />
      <div className="space-y-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col items-end gap-2">
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-orange-600 hover:bg-orange-500 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Issue
            </Button>
            <PriorityLegend />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Issues</h2>
          </div>
        </div>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Open Issues</h3>
            <IssueTable 
              status="open" 
              showControls={false} 
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
            />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Closed Issues</h3>
            <IssueTable 
              status="closed" 
              showControls={false}
              isDialogOpen={isDialogOpen}
              setIsDialogOpen={setIsDialogOpen}
            />
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}

