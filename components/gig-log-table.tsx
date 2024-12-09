"use client"

import { useState, useCallback, forwardRef } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"
import { Button } from "../components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Edit, Trash2, Plus } from 'lucide-react'
import { Icons } from "../components/icons"
import { cn } from "../lib/utils"

interface GigLogFormData {
  date: string
  band: string
  venue: string
  notes: string
}

interface GigLogFormProps {
  onSubmit: (data: GigLogFormData) => void
  initialData?: Partial<GigLogFormData>
  isLoading: boolean
  onCancel: () => void
}

const GigLogForm = forwardRef<HTMLFormElement, GigLogFormProps>(({ 
  onSubmit, 
  initialData, 
  isLoading, 
  onCancel 
}, ref) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      date: formData.get('date') as string,
      band: formData.get('band') as string,
      venue: formData.get('venue') as string,
      notes: formData.get('notes') as string,
    }
    onSubmit(data)
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">Date (YYYY-MM-DD)</Label>
        <Input 
          id="date" 
          name="date"
          type="text" 
          pattern="\d{4}-\d{2}-\d{2}"
          placeholder="YYYY-MM-DD"
          defaultValue={initialData?.date}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="band">Band</Label>
        <Input 
          id="band" 
          name="band"
          defaultValue={initialData?.band}
          placeholder="Enter band name" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="venue">Venue</Label>
        <Input 
          id="venue" 
          name="venue"
          defaultValue={initialData?.venue}
          placeholder="Enter venue name" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          name="notes"
          defaultValue={initialData?.notes}
          placeholder="Enter gig notes" 
          className="h-32" 
        />
      </div>
      <div className="flex space-x-2 justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className={cn(
            "bg-green-600 hover:bg-green-500 text-white",
            "flex-1 md:flex-none md:min-w-[100px]"
          )}
        >
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Update' : 'Submit'}
        </Button>
        <Button
          type="button"
          onClick={onCancel}
          className={cn(
            "bg-red-600 hover:bg-red-500 text-white",
            "flex-1 md:flex-none md:min-w-[100px]"
          )}
        >
          Cancel
        </Button>
      </div>
    </form>
  )
})

GigLogForm.displayName = 'GigLogForm'

const gigLogs = [
  { id: 1, date: "2023-06-15", band: "The Rockers", venue: "The Roxy", userId: 1 },
  { id: 2, date: "2023-06-12", band: "Jazz Ensemble", venue: "Blue Note", userId: 2 },
  { id: 3, date: "2023-06-10", band: "Acoustic Trio", venue: "Cafe Wha?", userId: 1 },
  { id: 4, date: "2023-06-08", band: "Electronic Beats", venue: "Output", userId: 1 },
  { id: 5, date: "2023-06-05", band: "Classical Orchestra", venue: "Carnegie Hall", userId: 2 },
]

export function GigLogTable() {
  const [currentUserId] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGig, setEditingGig] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async (data: GigLogFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', data)
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
      setEditingGig(null)
    }
  }, [])

  const handleAdd = useCallback(() => {
    setEditingGig(null)
    setIsDialogOpen(true)
  }, [])

  const handleEdit = useCallback((gigId: number) => {
    setEditingGig(gigId)
    setIsDialogOpen(true)
  }, [])

  const handleCancel = useCallback(() => {
    setIsDialogOpen(false)
    setEditingGig(null)
  }, [])

  const currentGig = editingGig 
    ? gigLogs.find(gig => gig.id === editingGig)
    : undefined

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gig Logs</h2>
        <Button onClick={handleAdd} variant="orange">
          <Plus className="h-4 w-4 mr-2" />
          Add New Gig Log
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Band</TableHead>
            <TableHead>Venue</TableHead>
            <TableHead className="w-[100px]"></TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gigLogs.map((gig) => (
            <TableRow key={gig.id}>
              <TableCell>{gig.date}</TableCell>
              <TableCell>{gig.band}</TableCell>
              <TableCell>{gig.venue}</TableCell>
              <TableCell></TableCell>
              <TableCell className="text-right">
                {gig.userId === currentUserId && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(gig.id)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGig ? 'Edit Gig Log' : 'Add New Gig Log'}</DialogTitle>
          </DialogHeader>
          <GigLogForm
            onSubmit={handleSubmit}
            initialData={currentGig}
            isLoading={isLoading}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

