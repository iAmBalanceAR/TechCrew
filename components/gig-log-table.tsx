"use client"

import { useState, useCallback, forwardRef, useEffect } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"
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
import { Edit, Trash2, Plus, Eye } from 'lucide-react'
import { Icons } from "../components/icons"
import { cn } from "../lib/utils"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { FeedbackModal } from "@/components/ui/feedback-modal"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { formatLocalDate } from "@/lib/utils"

// Types based on our Supabase schema
export interface GigLog {
  id: string
  date: string
  band_id: string
  venue: string
  notes: string | null
  tech_id: string
  created_at: string
  updated_at: string
  bands: {
    name: string
  }
}

interface GigLogFormData {
  date: string
  band_id: string
  venue: string
  notes?: string | null
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
  const [date, setDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : undefined
  )
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [bands, setBands] = useState<{ id: string, name: string }[]>([])
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchBands = async () => {
      const { data } = await supabase
        .from('bands')
        .select('id, name')
        .order('name')
      
      if (data) {
        setBands(data)
      }
    }
    fetchBands()
  }, [supabase])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      date: date?.toISOString().split('T')[0] || '',
      band_id: formData.get('band_id') as string,
      venue: formData.get('venue') as string,
      notes: formData.get('notes') as string | null,
    }
    onSubmit(data)
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate: Date | undefined) => {
                setDate(newDate)
                setIsCalendarOpen(false)
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="space-y-2">
        <Label htmlFor="band_id">Band</Label>
        <select
          id="band_id"
          name="band_id"
          defaultValue={initialData?.band_id || ''}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required
        >
          <option value="">Select a band</option>
          {bands.map(band => (
            <option key={band.id} value={band.id}>
              {band.name}
            </option>
          ))}
        </select>
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

function GigLogCard({ gig, onEdit, onDelete, onView }: {
  gig: GigLog
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onView: (gig: GigLog) => void
}) {
  return (
    <div className="bg-card rounded-lg p-4 space-y-4 border border-gray-800">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{gig.bands.name}</h3>
          <p className="text-sm text-gray-400">
            {format(new Date(gig.date), 'PPP')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(gig)}
            className="h-8 w-8"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(gig.id)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(gig.id)}
            className="h-8 w-8 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="text-sm">
        <p className="text-gray-400">Venue</p>
        <p>{gig.venue}</p>
      </div>
      
      {gig.notes && (
        <div className="text-sm">
          <p className="text-gray-400">Notes</p>
          <p className="line-clamp-2">{gig.notes}</p>
        </div>
      )}
    </div>
  )
}

export function GigLogTable() {
  const [gigLogs, setGigLogs] = useState<GigLog[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingGig, setEditingGig] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deletingGigId, setDeletingGigId] = useState<string | null>(null)
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: 'success' | 'error'
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  })
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingGig, setViewingGig] = useState<GigLog | null>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  
  const supabase = createClientComponentClient()

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current auth user:', user)
      setCurrentUserId(user?.id || null)
    }
    fetchUser()
  }, [supabase])

  // Fetch gig logs
  const fetchGigLogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('gig_logs')
        .select(`
          *,
          bands:band_id (
            name
          )
        `)
        .order('date', { ascending: false })
      
      if (error) throw error
      
      setGigLogs(data || [])
    } catch (err) {
      console.error('Error fetching gig logs:', err)
      setError('Failed to load gig logs')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchGigLogs()
  }, [fetchGigLogs])

  const handleSubmit = useCallback(async (data: GigLogFormData) => {
    setIsLoading(true)
    try {
      if (editingGig) {
        const { error } = await supabase
          .from('gig_logs')
          .update({
            date: data.date,
            band_id: data.band_id,
            venue: data.venue,
            notes: data.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingGig)

        if (error) throw error
        
        await fetchGigLogs()
        setIsDialogOpen(false)
        setEditingGig(null)
        setFeedbackModal({
          isOpen: true,
          title: 'Success',
          message: 'Gig log has been updated successfully.',
          type: 'success'
        })
      } else {
        console.log('Current user ID:', currentUserId)
        const { error } = await supabase
          .from('gig_logs')
          .insert([{
            date: data.date,
            band_id: data.band_id,
            venue: data.venue,
            notes: data.notes,
            tech_id: currentUserId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])

        if (error) throw error
        
        await fetchGigLogs()
        setIsDialogOpen(false)
        setEditingGig(null)
        setFeedbackModal({
          isOpen: true,
          title: 'Success',
          message: 'New gig log has been added successfully.',
          type: 'success'
        })
      }
    } catch (error: any) {
      console.error('Error saving gig log:', error)
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Failed to save gig log',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }, [editingGig, currentUserId, supabase, fetchGigLogs])

  const handleDelete = useCallback(async () => {
    if (!deletingGigId) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('gig_logs')
        .delete()
        .eq('id', deletingGigId)

      if (error) throw error

      await fetchGigLogs()
      setShowConfirmDelete(false)
      setDeletingGigId(null)
      setFeedbackModal({
        isOpen: true,
        title: 'Success',
        message: 'Gig log has been deleted successfully.',
        type: 'success'
      })
    } catch (error: any) {
      console.error('Error deleting gig log:', error)
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Failed to delete gig log',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }, [deletingGigId, supabase, fetchGigLogs])

  const handleDeleteClick = useCallback((gigId: string) => {
    setDeletingGigId(gigId)
    setShowConfirmDelete(true)
  }, [])

  const currentGig = editingGig 
    ? (() => {
        const gig = gigLogs.find(gig => gig.id === editingGig);
        return gig ? {
          date: gig.date,
          band_id: gig.band_id,
          venue: gig.venue,
          notes: gig.notes
        } : undefined;
      })()
    : undefined

  const handleAdd = useCallback(() => {
    setEditingGig(null)
    setIsDialogOpen(true)
  }, [])

  const handleEdit = useCallback((gigId: string) => {
    setEditingGig(gigId)
    setIsDialogOpen(true)
  }, [])

  const handleView = useCallback((gig: GigLog) => {
    setViewingGig(gig)
    setIsViewModalOpen(true)
  }, [])

  if (isLoading) {
    return <div className="flex justify-center p-4"><Icons.spinner className="h-6 w-6 animate-spin" /></div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button
          onClick={() => {
            setEditingGig(null)
            setIsDialogOpen(true)
          }}
          className="bg-orange-600 hover:bg-orange-500 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Gig Log
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Icons.spinner className="h-6 w-6 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : gigLogs.length === 0 ? (
        <div className="text-center text-gray-400 p-8">
          No gig logs found. Add your first gig!
        </div>
      ) : isDesktop ? (
        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Band</TableHead>
                <TableHead>Venue</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gigLogs.map((gig) => (
                <TableRow key={gig.id}>
                  <TableCell>{format(new Date(gig.date), 'PP')}</TableCell>
                  <TableCell>{gig.bands.name}</TableCell>
                  <TableCell>{gig.venue}</TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="truncate">{gig.notes}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setViewingGig(gig)
                          setIsViewModalOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingGig(gig.id)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingGigId(gig.id)
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
          {gigLogs.map((gig) => (
            <GigLogCard
              key={gig.id}
              gig={gig}
              onView={(gig) => {
                setViewingGig(gig)
                setIsViewModalOpen(true)
              }}
              onEdit={(id) => {
                setEditingGig(id)
                setIsDialogOpen(true)
              }}
              onDelete={(id) => {
                setDeletingGigId(id)
                setShowConfirmDelete(true)
              }}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingGig ? 'Edit Gig Log' : 'Add New Gig Log'}</DialogTitle>
          </DialogHeader>
          <GigLogForm
            onSubmit={handleSubmit}
            initialData={currentGig}
            isLoading={isLoading}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this gig log? This action cannot be undone."
        onConfirm={handleDelete}
      />

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal(prev => ({ ...prev, isOpen: false }))}
        title={feedbackModal.title}
        message={feedbackModal.message}
        type={feedbackModal.type as 'success' | 'error'}
      />

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient-orange">
              Gig Log Details
            </DialogTitle>
          </DialogHeader>
          {viewingGig && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                  <p className="text-lg">{format(formatLocalDate(viewingGig.date), "MMMM d, yyyy")}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Band</h3>
                  <p className="text-lg">{viewingGig.bands.name}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Venue</h3>
                <p className="text-lg">{viewingGig.venue}</p>
              </div>

              {viewingGig.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                  <div className="bg-card-gradient rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{viewingGig.notes}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p>Created: {format(new Date(viewingGig.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
                <div>
                  {viewingGig.updated_at && (
                    <p>Updated: {format(new Date(viewingGig.updated_at), "MMM d, yyyy 'at' h:mm a")}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

