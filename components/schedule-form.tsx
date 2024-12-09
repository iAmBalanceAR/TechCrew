"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

export function ScheduleForm({ onSubmit }: { onSubmit: () => void }) {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    onSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input id="date" type="date" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="band">Band</Label>
        <Input id="band" placeholder="Enter band name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="showTime">Show Time</Label>
        <Input id="showTime" type="time" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="techWorking">Tech Working</Label>
        <Input id="techWorking" placeholder="Enter tech name" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Enter any additional notes" className="h-32" />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Submit Event
      </Button>
    </form>
  )
}

