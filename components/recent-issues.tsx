import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const issues = [
  { id: 1, issue: "Faulty microphone", priority: "high", status: "open", assignee: "John Doe" },
  { id: 2, issue: "Missing cable", priority: "medium", status: "in progress", assignee: "Jane Smith" },
]

export function RecentIssues() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Issue</TableHead>
          <TableHead>Priority</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Assignee</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell>{issue.issue}</TableCell>
            <TableCell>
              <Badge variant={issue.priority === "high" ? "destructive" : "secondary"}>
                {issue.priority}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={issue.status === "open" ? "outline" : "default"}>
                {issue.status}
              </Badge>
            </TableCell>
            <TableCell>{issue.assignee}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

