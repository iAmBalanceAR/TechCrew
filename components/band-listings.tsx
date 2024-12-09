"use client"

import { SetStateAction, useState } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const bands = [
  { id: 1, name: "The Rockers", genre: "Rock", members: 4 },
  { id: 2, name: "Jazz Ensemble", genre: "Jazz", members: 5 },
  { id: 3, name: "Acoustic Trio", genre: "Acoustic", members: 3 },
  { id: 4, name: "Electronic Beats", genre: "Electronic", members: 2 },
  { id: 5, name: "Classical Orchestra", genre: "Classical", members: 40 },
  { id: 6, name: "Rock Legends", genre: "Rock", members: 5 },
  { id: 7, name: "Pop Sensations", genre: "Pop", members: 4 },
  { id: 8, name: "Indie Rockers", genre: "Indie", members: 4 },
  { id: 9, name: "Folk Troubadours", genre: "Folk", members: 3 },
  { id: 10, name: "Metal Mayhem", genre: "Metal", members: 5 },
]

export function BandListings() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredBands = bands.filter(band =>
    band.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    band.genre.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      <Input
        type="search"
        placeholder="Search bands..."
        value={searchTerm}
        onChange={(e: { target: { value: SetStateAction<string> } }) => setSearchTerm(e.target.value)}
      />
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((column) => (
          <Table key={column}>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead>Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBands
                .filter((_, index) => index % 2 === column)
                .map((band) => (
                  <TableRow key={band.id}>
                    <TableCell>{band.name}</TableCell>
                    <TableCell>{band.genre}</TableCell>
                    <TableCell>{band.members}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ))}
      </div>
    </div>
  )
}

