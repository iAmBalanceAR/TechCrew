"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Icons } from "@/components/icons"
import Link from "next/link"

interface Issue {
  id: string
  title: string
  priority: 'low' | 'medium' | 'high'
  status: 'open' | 'in_progress' | 'closed'
  assigned_to: string | null
  reported_by: string
  reporter?: {
    email: string
    full_name?: string
  }
}

export function RecentIssues() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchIssues() {
      try {
        const { data: issuesData, error: issuesError } = await supabase
          .from('issues')
          .select(`
            id,
            title,
            priority,
            status,
            assigned_to,
            reported_by
          `)
          .in('status', ['open', 'in_progress'])
          .order('priority', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(5)

        if (issuesError) {
          console.error('Issues fetch error:', issuesError)
          throw new Error(`Failed to fetch issues: ${issuesError.message}`)
        }
        // Get unique reporter IDs
        const reporterIds = Array.from(new Set(issuesData?.map(issue => issue.reported_by) || []))

        // Fetch all user profiles for the reporters
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, email, full_name')
          .in('id', reporterIds)

        // Create a map of user IDs to their profile information
        const userProfiles = (profiles || []).reduce((acc, profile) => ({
          ...acc,
          [profile.id]: {
            email: profile.email,
            full_name: profile.full_name
          }
        }), {} as Record<string, { email: string; full_name?: string }>)
        
      // Get the current user's email for display
      const { data: { user: currentUser } } = await supabase.auth.getUser()
        const issuesWithReporter = issuesData?.map(issue => ({
          ...issue,
          reporter: {
            email: issue.reported_by === currentUser?.id ? currentUser?.email : issue.reported_by,
            full_name: issue.reported_by === currentUser?.id ? currentUser?.user_metadata?.full_name || currentUser?.email : issue.reported_by
          }
        })) || []

        setIssues(issuesWithReporter)
      } catch (err) {
        console.error('Error in fetchIssues:', err)
        setError(err instanceof Error ? err.message : 'An unexpected error occurred')
      } finally {
        setIsLoading(false)
      }
    }

    fetchIssues()
  }, [supabase])

  function getPriorityVariant(priority: string) {
    switch (priority) {
      case 'high':
        return 'destructive'
      case 'medium':
        return 'default'
      default:
        return 'secondary'
    }
  }

  function getStatusVariant(status: string) {
    switch (status) {
      case 'open':
        return 'destructive'
      case 'in_progress':
        return 'default'
      default:
        return 'secondary'
    }
  }

  if (isLoading) {
    return <div className="flex justify-center p-4"><Icons.spinner className="h-6 w-6 animate-spin" /></div>
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>Error loading issues:</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  if (issues.length === 0) {
    return <div className="text-center p-4 text-white/70">No active issues</div>
  }

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {issues.map((issue) => (
          <div key={issue.id} className="bg-black/20 rounded-lg p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="font-medium text-sm line-clamp-1">{issue.title}</h3>
                <p className="text-xs text-white/70">
                  {issue.reporter?.email || issue.reported_by}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge variant={getPriorityVariant(issue.priority)} className="text-xs">
                  {issue.priority}
                </Badge>
                <Badge variant={getStatusVariant(issue.status)} className="text-xs">
                  {issue.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end">
        <Link 
          href="/issue-tracking" 
          className="text-sm text-blue-200 hover:text-blue-100 hover:underline"
        >
          View All
        </Link>
      </div>
    </div>
  )
}

