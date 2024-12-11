import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpcomingEvents } from "@/components/upcoming-events"
import { RecentGigLogs } from "@/components/recent-gig-logs"
import { BandListings } from "@/components/band-listings"
// import { InventoryOverview } from "@/components/inventory-overview"
import { RecentIssues } from "@/components/recent-issues"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        heading={<span className="text-gradient-orange">Dashboard</span>}
        text="Welcome back! Here's an overview of your recent activity."
      />
      <div className="p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-card-gradient text-white">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingEvents />
            </CardContent>
          </Card>
          <Card className="bg-card-gradient text-white">
            <CardHeader>
              <CardTitle>Recent Gig Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentGigLogs />
            </CardContent>
          </Card>
        </div>
        <Card className="bg-card-gradient text-white">
          <CardHeader>
            <CardTitle>Band Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <BandListings />
          </CardContent>
        </Card>
        {/* <Card className="bg-card-gradient text-white">
          <CardHeader>
            <CardTitle>Inventory Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <InventoryOverview />
          </CardContent>
        </Card> */}
        <Card className="bg-card-gradient text-white">
          <CardHeader>
            <CardTitle>Recent Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentIssues />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

