"use client"

import { useState, useCallback, forwardRef, useEffect } from "react"
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
import { CustomDialog } from "../components/ui/custom-dialog"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from "date-fns"
import type { Band as BandType, BandFormData as BandFormDataType } from "@/types/index"
import { FeedbackModal } from "@/components/ui/feedback-modal"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Band extends BandType {
  last_played: string | null
}

interface BandFormData extends BandFormDataType {
  last_played?: string
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
      home_location: formData.get('home_location') as string,
      members: Number(formData.get('members')),
      last_played: formData.get('last_played') as string,
      notes: formData.get('notes') as string,
      input_lists: formData.get('input_lists') as string,
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
        <Label htmlFor="home_location">Home Location</Label>
        <Input 
          id="home_location" 
          name="home_location"
          defaultValue={initialData?.home_location}
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
        <Label htmlFor="last_played">Last Played</Label>
        <Input 
          id="last_played" 
          name="last_played"
          type="date" 
          defaultValue={initialData?.last_played}
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
        <Label htmlFor="input_lists">Input Lists</Label>
        <Textarea 
          id="input_lists" 
          name="input_lists"
          defaultValue={initialData?.input_lists}
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

function BandCard({ band, onEdit, onDelete }: { 
  band: Band
  onEdit: (id: string) => void
  onDelete: (id: string) => void 
}) {
  return (
    <div className="bg-card rounded-lg p-4 space-y-4 border border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{band.name}</h3>
          <p className="text-sm text-gray-400">{band.home_location}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(band.id)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(band.id)}
            className="h-8 w-8 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-400">Members</p>
          <p>{band.members}</p>
        </div>
        <div>
          <p className="text-gray-400">Last Played</p>
          <p>{band.last_played ? format(new Date(band.last_played), 'PP') : 'N/A'}</p>
        </div>
      </div>
      
      {(band.notes || band.input_lists) && (
        <div className="space-y-2 pt-2 border-t border-gray-800">
          {band.notes && (
            <div>
              <p className="text-sm font-medium text-gray-400">Notes</p>
              <p className="text-sm line-clamp-2">{band.notes}</p>
            </div>
          )}
          {band.input_lists && (
            <div>
              <p className="text-sm font-medium text-gray-400">Input Lists</p>
              <p className="text-sm line-clamp-2">{band.input_lists}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Add type definitions for the modal components
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  onConfirm: () => Promise<void>
}

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type: 'success' | 'error'
}

export function BandsTable() {
  const [bands, setBands] = useState<Band[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBand, setEditingBand] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deletingBandId, setDeletingBandId] = useState<string | null>(null)
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'success' | 'error';
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  });
  
  const supabase = createClientComponentClient()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
    }
    fetchUser()
  }, [supabase])

  const fetchBands = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('bands')
        .select('*')
        .order('name')
      
      if (error) throw error
      
      setBands(data || [])
    } catch (err) {
      console.error('Error fetching bands:', err)
      setError('Failed to load bands')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchBands()
  }, [fetchBands])

  const handleSubmit = useCallback(async (data: BandFormData) => {
    setIsLoading(true)
    try {
      if (editingBand) {
        const { error } = await supabase
          .from('bands')
          .update({
            name: data.name,
            home_location: data.home_location,
            members: data.members,
            last_played: data.last_played || null,
            notes: data.notes || null,
            input_lists: data.input_lists || null,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingBand)

        if (error) throw error
        
        await fetchBands()
        setIsDialogOpen(false)
        setEditingBand(null)
        setFeedbackModal({
          isOpen: true,
          title: 'Success',
          message: 'Band has been updated successfully.',
          type: 'success'
        })
      } else {
        const { error } = await supabase
          .from('bands')
          .insert([{
            name: data.name,
            home_location: data.home_location,
            members: data.members,
            last_played: data.last_played || null,
            notes: data.notes || null,
            input_lists: data.input_lists || null,
            created_by: currentUserId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])

        if (error) throw error

        await fetchBands()
        setIsDialogOpen(false)
        setEditingBand(null)
        setFeedbackModal({
          isOpen: true,
          title: 'Success', 
          message: 'New band has been added successfully.',
          type: 'success'
        })
      }
    } catch (err: any) {
      console.error('Error saving band:', err)
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: err.message || 'Failed to save band',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }, [editingBand, currentUserId, supabase, fetchBands])

  const handleDelete = useCallback(async () => {
    if (!deletingBandId) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('bands')
        .delete()
        .eq('id', deletingBandId)

      if (error) throw error

      await fetchBands()
      setShowConfirmDelete(false)
      setDeletingBandId(null)
      setFeedbackModal({
        isOpen: true,
        title: 'Success',
        message: 'Band has been deleted successfully.',
        type: 'success'
      })
    } catch (error: any) {
      console.error('Error deleting band:', error)
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Failed to delete band',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }, [deletingBandId, supabase, fetchBands])

  const handleDeleteClick = useCallback((bandId: string) => {
    setDeletingBandId(bandId)
    setShowConfirmDelete(true)
  }, [])

  const handleAdd = useCallback(() => {
    setEditingBand(null)
    setIsDialogOpen(true)
  }, [])

  const handleEdit = useCallback((bandId: string) => {
    setEditingBand(bandId)
    setIsDialogOpen(true)
  }, [])

  const currentBand = editingBand 
    ? bands.find(band => band.id === editingBand)
    : undefined

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          onClick={() => {
            setEditingBand(null)
            setIsDialogOpen(true)
          }}
          className="bg-orange-600 hover:bg-orange-500 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Band
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Icons.spinner className="h-6 w-6 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : bands.length === 0 ? (
        <div className="text-center text-gray-400 p-8">
          No bands found. Add your first band!
        </div>
      ) : isDesktop ? (
        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Last Played</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bands.map((band) => (
                <TableRow key={band.id}>
                  <TableCell className="font-medium">{band.name}</TableCell>
                  <TableCell>{band.home_location}</TableCell>
                  <TableCell>{band.members}</TableCell>
                  <TableCell>
                    {band.last_played ? format(new Date(band.last_played), 'PP') : 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingBand(band.id)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingBandId(band.id)
                          setShowConfirmDelete(true)
                        }}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {bands.map((band) => (
            <BandCard
              key={band.id}
              band={band}
              onEdit={(id) => {
                setEditingBand(id)
                setIsDialogOpen(true)
              }}
              onDelete={(id) => {
                setDeletingBandId(id)
                setShowConfirmDelete(true)
              }}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBand ? 'Edit Band' : 'Add New Band'}</DialogTitle>
          </DialogHeader>
          <BandForm
            onSubmit={handleSubmit}
            initialData={currentBand ? {
              name: currentBand.name,
              home_location: currentBand.home_location,
              members: currentBand.members,
              last_played: currentBand.last_played || undefined,
              notes: currentBand.notes || undefined,
              input_lists: currentBand.input_lists || undefined
            } : undefined}
            isLoading={isLoading}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Delete Band"
        message="Are you sure you want to delete this band? This action cannot be undone."
        onConfirm={async () => {
          if (!deletingBandId) return Promise.resolve()
          
          setIsLoading(true)
          try {
            const { error } = await supabase
              .from('bands')
              .delete()
              .eq('id', deletingBandId)

            if (error) throw error
            await fetchBands()
            setShowConfirmDelete(false)
            setDeletingBandId(null)
            setFeedbackModal({
              isOpen: true,
              title: 'Success',
              message: 'Band has been deleted successfully.',
              type: 'success'
            })
          } catch (err: unknown) {
            const error = err as Error
            console.error('Error:', error)
            setError(error.message)
          } finally {
            setIsLoading(false)
          }
        }}
      />

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal(prev => ({ ...prev, isOpen: false }))}
        title={feedbackModal.title}
        message={feedbackModal.message}
        type={feedbackModal.type}
      />
    </div>
  )
}

