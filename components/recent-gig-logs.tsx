import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const gigLogs = [
  { id: 1, date: "2023-06-15", band: "The Rockers", venue: "The Roxy" },
  { id: 2, date: "2023-06-12", band: "Jazz Ensemble", venue: "Blue Note" },
  { id: 3, date: "2023-06-10", band: "Acoustic Trio", venue: "Cafe Wha?" },
  { id: 4, date: "2023-06-08", band: "Electronic Beats", venue: "Output" },
  { id: 5, date: "2023-06-05", band: "Classical Orchestra", venue: "Carnegie Hall" },
]

export function RecentGigLogs() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Band</TableHead>
          <TableHead>Venue</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {gigLogs.map((gig) => (
          <TableRow key={gig.id}>
            <TableCell>{gig.date}</TableCell>
            <TableCell>{gig.band}</TableCell>
            <TableCell>{gig.venue}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

