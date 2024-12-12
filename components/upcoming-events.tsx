"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { Icons } from "@/components/icons"
import Link from "next/link"
import supabase from "@/lib/supabase-client"
import { formatLocalDate } from "@/lib/utils"

interface Event {
  id: string
  date: string
  band_id: string | null
  band_name: string | null
  show_time: string
  tech_name: string | null
  bands?: {
    name: string
  }
}

export function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const supabaseClient = supabase
    async function fetchUpcomingEvents() {
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const { data, error } = await supabaseClient
          .from('schedules')
          .select(`
            *,
            bands:band_id (
              name
            )
          `)
          .gte('date', today.toISOString().split('T')[0])
          .order('date', { ascending: true })
          .limit(6)

        if (error) throw error
        setEvents(data || [])
      } catch (err) {
        console.error('Error fetching upcoming events:', err)
        setError('Failed to load upcoming events')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUpcomingEvents()
  }, []) // Empty dependency array is fine here as we're using a stable supabase client

  if (isLoading) {
    return <div className="flex justify-center p-4"><Icons.spinner className="h-6 w-6 animate-spin" /></div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  if (events.length === 0) {
    return <div className="text-center p-4 text-white/70">No upcoming events scheduled</div>
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {events.map((event) => (
          <div key={event.id} className="bg-black/20 rounded-lg p-3 space-y-1">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-medium text-sm">{event.bands?.name || event.band_name}</h3>
                {event.tech_name && (
                  <p className="text-xs text-white/70">Tech: {event.tech_name}</p>
                )}
              </div>
              <div className="text-sm text-white/90">
                {format(formatLocalDate(event.date), "MMM d, yyyy")}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Link 
          href="/schedule" 
          className="text-sm text-blue-200 hover:text-blue-100 hover:underline"
        >
          View All
        </Link>
      </div>
    </div>
  )
}

