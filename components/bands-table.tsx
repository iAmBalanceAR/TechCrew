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

interface BandFormData {
  name: string
  homeLocation: string
  members: number
  lastPlayed: string
  lastTech: string
  notes: string
  inputLists: string
}

interface BandFormProps {
  onSubmit: (data: BandFormData) => void
  initialData?: Partial<BandFormData>
  isLoading: boolean
  onCancel: () => void
}

const BandForm = forwardRef<HTMLFormElement, BandFormProps>(({ 
  onSubmit, 
  initialData, 
  isLoading, 
  onCancel 
}, ref) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      homeLocation: formData.get('homeLocation') as string,
      members: Number(formData.get('members')),
      lastPlayed: formData.get('lastPlayed') as string,
      lastTech: formData.get('lastTech') as string,
      notes: formData.get('notes') as string,
      inputLists: formData.get('inputLists') as string,
    }
    onSubmit(data)
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Band Name</Label>
        <Input 
          id="name" 
          name="name"
          defaultValue={initialData?.name}
          placeholder="Enter band name" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="homeLocation">Home Location</Label>
        <Input 
          id="homeLocation" 
          name="homeLocation"
          defaultValue={initialData?.homeLocation}
          placeholder="Enter home location" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="members">Number of Members</Label>
        <Input 
          id="members" 
          name="members"
          type="number" 
          defaultValue={initialData?.members}
          placeholder="Enter number of members" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastPlayed">Last Played</Label>
        <Input 
          id="lastPlayed" 
          name="lastPlayed"
          type="date" 
          defaultValue={initialData?.lastPlayed}
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="lastTech">Last Tech</Label>
        <Input 
          id="lastTech" 
          name="lastTech"
          defaultValue={initialData?.lastTech}
          placeholder="Enter last tech name" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          name="notes"
          defaultValue={initialData?.notes}
          placeholder="Enter general notes" 
          className="h-32" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="inputLists">Input Lists</Label>
        <Textarea 
          id="inputLists" 
          name="inputLists"
          defaultValue={initialData?.inputLists}
          placeholder="Enter band's instrument input criteria" 
          className="h-48" 
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

BandForm.displayName = 'BandForm'

const bands = [
  { id: 1, name: "The Rockers", homeLocation: "New York, NY", members: 4, lastPlayed: "2023-06-15", lastTech: "John Doe", userId: 1 },
  { id: 2, name: "Jazz Ensemble", homeLocation: "Chicago, IL", members: 5, lastPlayed: "2023-06-12", lastTech: "Jane Smith", userId: 2 },
  { id: 3, name: "Acoustic Trio", homeLocation: "Nashville, TN", members: 3, lastPlayed: "2023-06-10", lastTech: "John Doe", userId: 1 },
  { id: 4, name: "Electronic Beats", homeLocation: "Los Angeles, CA", members: 2, lastPlayed: "2023-06-08", lastTech: "John Doe", userId: 1 },
  { id: 5, name: "Classical Orchestra", homeLocation: "Boston, MA", members: 40, lastPlayed: "2023-06-05", lastTech: "Jane Smith", userId: 2 },
]

export function BandsTable() {
  const [currentUserId] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBand, setEditingBand] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = useCallback(async (data: BandFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', data)
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
      setEditingBand(null)
    }
  }, [])

  const handleAdd = useCallback(() => {
    setEditingBand(null)
    setIsDialogOpen(true)
  }, [])

  const handleEdit = useCallback((bandId: number) => {
    setEditingBand(bandId)
    setIsDialogOpen(true)
  }, [])

  const handleCancel = useCallback(() => {
    setIsDialogOpen(false)
    setEditingBand(null)
  }, [])

  const currentBand = editingBand 
    ? bands.find(band => band.id === editingBand)
    : undefined

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd} variant="orange">
          <Plus className="h-4 w-4 mr-2" />
          Add New Band
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Band Name</TableHead>
            <TableHead>Home Location</TableHead>
            <TableHead># of Members</TableHead>
            <TableHead>Last Played</TableHead>
            <TableHead>Last Tech</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bands.map((band) => (
            <TableRow key={band.id}>
              <TableCell>{band.name}</TableCell>
              <TableCell>{band.homeLocation}</TableCell>
              <TableCell>{band.members}</TableCell>
              <TableCell>{band.lastPlayed}</TableCell>
              <TableCell>{band.lastTech}</TableCell>
              <TableCell className="text-right">
                {band.userId === currentUserId && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(band.id)}>
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
            <DialogTitle>{editingBand ? 'Edit Band' : 'Add New Band'}</DialogTitle>
          </DialogHeader>
          <BandForm
            onSubmit={handleSubmit}
            initialData={currentBand}
            isLoading={isLoading}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

