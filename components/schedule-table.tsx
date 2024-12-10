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
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2, Plus } from 'lucide-react'
import { Icons } from "../components/icons"
import { cn } from "../lib/utils"
import { CustomDialog } from "../components/ui/custom-dialog"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from "date-fns"
import type { Schedule, ScheduleFormData } from "@/types/index"
import { FeedbackModal } from "@/components/ui/feedback-modal"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"

interface ScheduleFormProps {
  onSubmit: (data: ScheduleFormData) => void
  initialData?: Partial<ScheduleFormData>
  onCancel: () => void
}

const ScheduleForm = forwardRef<HTMLFormElement, ScheduleFormProps>(({ 
  onSubmit, 
  initialData, 
  onCancel 
}, ref) => {
  const [bands, setBands] = useState<{ id: string, name: string }[]>([])
  const [isBandOverride, setIsBandOverride] = useState(initialData?.is_band_override || false)
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
    const data: ScheduleFormData = {
      date: formData.get('date') as string,
      show_time: formData.get('show_time') as string,
      tech_name: formData.get('tech_name') as string || null,
      is_band_override: isBandOverride
    }

    if (isBandOverride) {
      data.band_name = formData.get('band_name') as string
    } else {
      data.band_id = formData.get('band_id') as string
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
        <Label htmlFor="show_time">Show Time</Label>
        <Input 
          id="show_time" 
          name="show_time"
          type="time" 
          defaultValue={initialData?.show_time}
          required 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tech_name">Tech Working</Label>
        <Input 
          id="tech_name" 
          name="tech_name"
          defaultValue={initialData?.tech_name || ''}
          placeholder="Enter tech name (optional)"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="band_id">Band</Label>
        <select
          id="band_id"
          name="band_id"
          defaultValue={initialData?.band_id || ''}
          className="w-full rounded-md border border-input bg-background px-3 py-2"
          required={!isBandOverride}
          disabled={isBandOverride}
        >
          <option value="">Select a band</option>
          {bands.map(band => (
            <option key={band.id} value={band.id}>
              {band.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="band_override" 
          checked={isBandOverride}
          onCheckedChange={(value: boolean | 'indeterminate') => setIsBandOverride(value as boolean)}
        />
        <Label htmlFor="band_override">Band Not Listed</Label>
      </div>

      {isBandOverride && (
        <div className="space-y-2">
          <Label htmlFor="band_name">Band Name</Label>
          <Input 
            id="band_name" 
            name="band_name"
            defaultValue={initialData?.band_name}
            placeholder="Enter band name" 
            required={isBandOverride}
          />
        </div>
      )}

      <div className="flex space-x-2 justify-end">
        <Button
          type="submit"
          className={cn(
            "bg-green-600 hover:bg-green-500 text-white",
            "flex-1 md:flex-none md:min-w-[100px]"
          )}
        >
          Submit
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

export function ScheduleTable() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deletingScheduleId, setDeletingScheduleId] = useState<string | null>(null)
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
  })
  const [userEmails, setUserEmails] = useState<Record<string, string>>({});
  const [currentUserEmail, setCurrentUserEmail] = useState<string>('');

  const supabase = createClientComponentClient()

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      console.log('Current user:', user)
      if (user) {
        setCurrentUserId(user.id);
        setCurrentUserEmail(user.email || '');
      }
    }
    fetchUser()
  }, [supabase])

  // Fetch schedules
  const fetchSchedules = useCallback(async () => {
    console.log('Fetching schedules...');
    try {
      const { data, error } = await supabase
        .from('schedules')
        .select(`
          *,
          bands:band_id (
            name
          )
        `)
        .order('date', { ascending: false })
      
      if (error) {
        console.error('Error fetching schedules:', error);
        throw error;
      }
      
      console.log('Fetched schedules:', data);
      setSchedules(data || [])
    } catch (err) {
      console.error('Error in fetchSchedules:', err)
      setError('Failed to load schedules')
    } finally {
      setIsLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchSchedules()
  }, [fetchSchedules])

  const handleSubmit = useCallback(async (data: ScheduleFormData) => {
    console.log('Submitting schedule with data:', data);
    console.log('Current user ID:', currentUserId);
    setIsLoading(true)
    try {
      if (editingSchedule) {
        console.log('Updating existing schedule:', editingSchedule);
        const { error } = await supabase
          .from('schedules')
          .update({
            date: data.date,
            band_id: data.is_band_override ? null : data.band_id,
            band_name: data.is_band_override ? data.band_name : null,
            show_time: data.show_time,
            tech_name: data.tech_name,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingSchedule)

        if (error) throw error
        
        await fetchSchedules()
        setIsDialogOpen(false)
        setEditingSchedule(null)
        setFeedbackModal({
          isOpen: true,
          title: 'Success',
          message: 'Schedule has been updated successfully.',
          type: 'success'
        })
      } else {
        const { data: responseData, error } = await supabase
          .from('schedules')
          .insert([{
            date: data.date,
            band_id: data.is_band_override ? null : data.band_id,
            band_name: data.is_band_override ? data.band_name : null,
            show_time: data.show_time,
            tech_name: data.tech_name,
            tech_id: currentUserId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()

        if (error) {
          console.error('Supabase insert error:', {
            error,
            rawError: JSON.stringify(error),
            data: {
              date: data.date,
              band_id: data.is_band_override ? null : data.band_id,
              band_name: data.is_band_override ? data.band_name : null,
              show_time: data.show_time,
              tech_name: data.tech_name,
              tech_id: currentUserId,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          });
          throw error;
        }
        
        console.log('Insert successful:', responseData);
        await fetchSchedules()
        setIsDialogOpen(false)
        setEditingSchedule(null)
        setFeedbackModal({
          isOpen: true,
          title: 'Success',
          message: 'New schedule has been added successfully.',
          type: 'success'
        })
      }
    } catch (error: any) {
      console.error('Error saving schedule:', {
        error,
        rawError: JSON.stringify(error),
        stack: error.stack
      });
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Failed to save schedule. Please check the console for more details.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }, [editingSchedule, currentUserId, supabase, fetchSchedules])

  const handleDelete = useCallback(async () => {
    if (!deletingScheduleId) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('schedules')
        .delete()
        .eq('id', deletingScheduleId)

      if (error) throw error

      await fetchSchedules()
      setShowConfirmDelete(false)
      setDeletingScheduleId(null)
      setFeedbackModal({
        isOpen: true,
        title: 'Success',
        message: 'Schedule has been deleted successfully.',
        type: 'success'
      })
    } catch (error: any) {
      console.error('Error deleting schedule:', error)
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Failed to delete schedule',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }, [deletingScheduleId, supabase, fetchSchedules])

  const handleDeleteClick = useCallback((scheduleId: string) => {
    setDeletingScheduleId(scheduleId)
    setShowConfirmDelete(true)
  }, [])

  const currentSchedule = editingSchedule 
    ? schedules.find(schedule => schedule.id === editingSchedule)
    : undefined

  const formInitialData: Partial<ScheduleFormData> | undefined = currentSchedule ? {
    date: currentSchedule.date,
    band_id: currentSchedule.band_id ?? undefined,
    band_name: currentSchedule.band_name ?? undefined,
    show_time: currentSchedule.show_time,
    tech_name: currentSchedule.tech_name ?? '',
    is_band_override: !!currentSchedule.band_name
  } : undefined

  const handleAdd = useCallback(() => {
    setEditingSchedule(null)
    setIsDialogOpen(true)
  }, [])

  const handleEdit = useCallback((scheduleId: string) => {
    setEditingSchedule(scheduleId)
    setIsDialogOpen(true)
  }, [])

  if (isLoading) {
    return <div className="flex justify-center p-4"><Icons.spinner className="h-6 w-4 animate-spin" /></div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Button onClick={handleAdd} variant="orange">
          <Plus className="h-4 w-4 mr-2" />
          Add New Schedule
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
          {schedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>{format(new Date(schedule.date), "MMMM d, yyyy")}</TableCell>
              <TableCell>{schedule.bands?.name || schedule.band_name}</TableCell>
              <TableCell>{format(new Date(`2000-01-01T${schedule.show_time}`), "h:mm a")}</TableCell>
              <TableCell>{schedule.tech_name}</TableCell>
              <TableCell className="text-right">
                {schedule.tech_id === currentUserId && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(schedule.id)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleDeleteClick(schedule.id)}
                    >
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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? 'Edit Event' : 'Add New Event'}</DialogTitle>
            <DialogDescription>
              {editingSchedule ? 'Edit the schedule details below.' : 'Fill in the schedule details below.'}
            </DialogDescription>
          </DialogHeader>
          <ScheduleForm
            onSubmit={handleSubmit}
            initialData={formInitialData}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this schedule? This action cannot be undone."
        onConfirm={handleDelete}
      />

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal(prev => ({ ...prev, isOpen: false }))}
        title={feedbackModal.title}
        message={feedbackModal.message}
        type={feedbackModal.type as 'success' | 'error'}
      />
    </div>
  )
}

