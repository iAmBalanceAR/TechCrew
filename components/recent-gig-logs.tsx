"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { formatLocalDate } from "@/lib/utils"
import { Icons } from "@/components/icons"
import Link from "next/link"
import supabase from "@/lib/supabase-client"

interface GigLog {
  id: string
  date: string
  band_id: string
  venue: string
  bands: {
    name: string
  }
}

export function RecentGigLogs() {
  const [gigLogs, setGigLogs] = useState<GigLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabaseClient = supabase
    async function fetchRecentGigLogs() {
      try {
        const { data, error } = await supabaseClient
          .from('gig_logs')
          .select(`
            *,
            bands:band_id (
              name
            )
          `)
          .order('date', { ascending: false })
          .limit(6)

        if (error) throw error
        setGigLogs(data || [])
      } catch (err) {
        console.error('Error fetching recent gig logs:', err)
        setError('Failed to load recent gig logs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentGigLogs()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center p-4"><Icons.spinner className="h-6 w-6 animate-spin" /></div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  if (gigLogs.length === 0) {
    return <div className="text-center p-4 text-white/70">No gig logs available</div>
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {gigLogs.map((gig) => (
          <div key={gig.id} className="bg-black/20 rounded-lg p-3 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-medium text-sm">{gig.bands.name}</h3>
                <p className="text-xs text-white/70">{gig.venue}</p>
              </div>
              <div className="text-sm text-white/90">
                {format(formatLocalDate(gig.date), "MMM d, yyyy")}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Link 
          href="/gig-log" 
          className="text-sm text-blue-200 hover:text-blue-100 hover:underline"
        >
          View All
        </Link>
      </div>
    </div>
  )
}

