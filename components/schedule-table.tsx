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
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Edit, Trash2, Plus } from 'lucide-react'
import { Icons } from "../components/icons"
import { cn } from "../lib/utils"

interface ScheduleFormData {
  date: string
  band: string
  showTime: string
  techWorking: string
}

interface ScheduleFormProps {
  onSubmit: (data: ScheduleFormData) => void
  initialData?: Partial<ScheduleFormData>
  isLoading: boolean
  onCancel: () => void
}

const ScheduleForm = forwardRef<HTMLFormElement, ScheduleFormProps>(({ 
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
      showTime: formData.get('showTime') as string,
      techWorking: formData.get('techWorking') as string,
    }
    onSubmit(data)
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input 
          id="date" 
          name="date"
          type="date" 
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
        <Label htmlFor="showTime">Show Time</Label>
        <Input 
          id="showTime" 
          name="showTime"
          type="time"
          defaultValue={initialData?.showTime}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="techWorking">Tech Working</Label>
        <Input 
          id="techWorking" 
          name="techWorking"
          defaultValue={initialData?.techWorking}
          placeholder="Enter tech name" 
          required 
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

ScheduleForm.displayName = 'ScheduleForm'

const scheduleEvents = [
  { id: 1, date: "2023-06-15", band: "The Rockers", showTime: "20:00", techWorking: "John Doe", userId: 1 },
  { id: 2, date: "2023-06-18", band: "Jazz Ensemble", showTime: "19:30", techWorking: "Jane Smith", userId: 2 },
  { id: 3, date: "2023-06-20", band: "Acoustic Trio", showTime: "21:00", techWorking: "John Doe", userId: 1 },
  { id: 4, date: "2023-06-25", band: "Electronic Beats", showTime: "22:00", techWorking: "Alice Johnson", userId: 1 },
  { id: 5, date: "2023-06-30", band: "Classical Orchestra", showTime: "19:00", techWorking: "Bob Williams", userId: 2 },
]

export function ScheduleTable() {
  const [currentUserId] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async (data: ScheduleFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', data)
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
      setEditingEvent(null)
    }
  }, [])

  const handleAdd = useCallback(() => {
    setEditingEvent(null)
    setIsDialogOpen(true)
  }, [])

  const handleEdit = useCallback((eventId: number) => {
    setEditingEvent(eventId)
    setIsDialogOpen(true)
  }, [])

  const handleCancel = useCallback(() => {
    setIsDialogOpen(false)
    setEditingEvent(null)
  }, [])

  const currentEvent = editingEvent 
    ? scheduleEvents.find(event => event.id === editingEvent)
    : undefined

  return (
    <div>
      <div className="flex justify-between items-center">
        <Button onClick={handleAdd} variant="orange" className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add New Event
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Band</TableHead>
            <TableHead>Show Time</TableHead>
            <TableHead>Tech Working</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scheduleEvents.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.date}</TableCell>
              <TableCell>{event.band}</TableCell>
              <TableCell>{event.showTime}</TableCell>
              <TableCell>{event.techWorking}</TableCell>
              <TableCell className="text-right">
                {event.userId === currentUserId && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(event.id)}>
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
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          </DialogHeader>
          <ScheduleForm
            onSubmit={handleSubmit}
            initialData={currentEvent}
            isLoading={isLoading}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

