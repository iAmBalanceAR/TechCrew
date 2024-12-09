"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { InventoryGrid } from "@/components/inventory-grid"

export default function InventoryPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Inventory" text="View and manage your inventory." />
      <InventoryGrid />
    </DashboardShell>
  )
}

