"use client"

import { useState, useEffect, SetStateAction } from "react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Icons } from "@/components/icons"
import Link from "next/link"
interface Band {
  id: string
  name: string
  home_location: string
  members: number
}

export function BandListings() {
  const [bands, setBands] = useState<Band[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchBands() {
      try {
        const { data, error } = await supabase
          .from('bands')
          .select('id, name, home_location, members')
          .order('name')

        if (error) throw error
        setBands(data || [])
      } catch (err) {
        console.error('Error fetching bands:', err)
        setError('Failed to load bands')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBands()
  }, [supabase])

  const filteredBands = bands.filter(band =>
    band.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    band.home_location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return <div className="flex justify-center p-4"><Icons.spinner className="h-6 w-6 animate-spin" /></div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  if (bands.length === 0) {
    return <div className="text-center p-4 text-white/70">No bands available</div>
  }

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
                <TableHead>Location</TableHead>
                <TableHead>Members</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBands
                .filter((_, index) => index % 2 === column)
                .map((band) => (
                  <TableRow key={band.id}>
                    <TableCell>{band.name}</TableCell>
                    <TableCell>{band.home_location}</TableCell>
                    <TableCell>{band.members}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        ))}
      </div>
      <div className="flex justify-end">
        <Link 
          href="/bands" 
          className="text-sm text-blue-200 hover:text-blue-100 hover:underline"
        >
          View All
        </Link>
      </div>
    </div>
  )
}

