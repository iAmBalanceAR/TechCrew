import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UpcomingEvents } from "@/components/upcoming-events"
import { RecentGigLogs } from "@/components/recent-gig-logs"
import { BandListings } from "@/components/band-listings"
import { RecentIssues } from "@/components/recent-issues"

export default function DashboardPage() {
  return (
    <div className="flex flex-col">
      <DashboardHeader
        heading={<span className="text-gradient-orange">Dashboard</span>}
        text="Welcome back! Here's an overview of your recent activity."
      />
      <div className="p-4 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card className="bg-card-gradient text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingEvents />
            </CardContent>
          </Card>
          <Card className="bg-card-gradient text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-semibold">Recent Gig Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentGigLogs />
            </CardContent>
          </Card>
        </div>
        <Card className="bg-card-gradient text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Band Listings</CardTitle>
          </CardHeader>
          <CardContent>
            <BandListings />
          </CardContent>
        </Card>
        <Card className="bg-card-gradient text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold">Recent Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentIssues />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

