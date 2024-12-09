import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const events = [
  { id: 1, date: "2023-06-15", band: "The Rockers", venue: "The Roxy" },
  { id: 2, date: "2023-06-18", band: "Jazz Ensemble", venue: "Blue Note" },
  { id: 3, date: "2023-06-20", band: "Acoustic Trio", venue: "Cafe Wha?" },
  { id: 4, date: "2023-06-25", band: "Electronic Beats", venue: "Output" },
  { id: 5, date: "2023-06-30", band: "Classical Orchestra", venue: "Carnegie Hall" },
]

export function UpcomingEvents() {
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
        {events.map((event) => (
          <TableRow key={event.id}>
            <TableCell>{event.date}</TableCell>
            <TableCell>{event.band}</TableCell>
            <TableCell>{event.venue}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

