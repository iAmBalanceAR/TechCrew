"use client"

import { useState, useEffect } from "react"
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
          .limit(5)

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
      <div className="space-y-3">
        {bands.map((band) => (
          <div key={band.id} className="bg-black/20 rounded-lg p-3 space-y-1">
            <h3 className="font-medium text-sm">{band.name}</h3>
            <div className="flex items-center justify-between text-xs text-white/70">
              <span>{band.home_location}</span>
              <span>{band.members} members</span>
            </div>
          </div>
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

