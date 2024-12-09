"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Icons } from "../components/icons"

export function BandForm({ onSubmit }: { onSubmit: () => void }) {
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
        <Label htmlFor="name">Band Name</Label>
        <Input id="name" placeholder="Enter band name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="homeLocation">Home Location</Label>
        <Input id="homeLocation" placeholder="Enter home location" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="members">Number of Members</Label>
        <Input id="members" type="number" placeholder="Enter number of members" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastPlayed">Last Played</Label>
        <Input id="lastPlayed" type="date" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastTech">Last Tech</Label>
        <Input id="lastTech" placeholder="Enter last tech name" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" placeholder="Enter general notes" className="h-32" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="inputLists">Input Lists</Label>
        <Textarea id="inputLists" placeholder="Enter band's instrument input criteria" className="h-48" />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
        Submit Band Profile
      </Button>
    </form>
  )
}

