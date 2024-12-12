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
import { formatInTimeZone } from "date-fns-tz"
import { FeedbackModal } from "@/components/ui/feedback-modal"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { format } from "date-fns"
import { parseISO, addDays } from "date-fns"
import { formatLocalDate } from "@/lib/utils"

interface ScheduleFormData {
  date: string
  show_time: string
  tech_name: string | null
  band_id?: string | null
  band_name?: string | null
  is_band_override: boolean
}

interface Schedule {
  id: string
  date: string
  band_id: string | null
  band_name: string | null
  show_time: string
  tech_name: string | null
  tech_id: string | null
  is_band_override: boolean
  created_by: string
  created_at: string
  updated_at: string
  bands?: {
    name: string
  } | null
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
    const dateStr = formData.get('date') as string
    const data: ScheduleFormData = {
      date: dateStr,
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

// Add ScheduleCard component for mobile view
function ScheduleCard({ schedule, onEdit, onDelete }: {
  schedule: Schedule
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="bg-card rounded-lg p-4 space-y-4 border border-gray-800">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">
            {schedule.is_band_override ? schedule.band_name : schedule.bands?.name}
          </h3>
          <p className="text-sm text-gray-400">
            {format(parseISO(schedule.date), 'PPP')}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(schedule.id)}
            className="h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(schedule.id)}
            className="h-8 w-8 text-red-500 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-400">Show Time</p>
          <p>{schedule.show_time}</p>
        </div>
        <div>
          <p className="text-gray-400">Tech Working</p>
          <p>{schedule.tech_name || 'Not assigned'}</p>
        </div>
      </div>
    </div>
  )
}

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
  const isDesktop = useMediaQuery("(min-width: 768px)")

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
    setIsLoading(true)
    try {
      if (editingSchedule) {
        const scheduleData = {
          date: data.date,
          show_time: data.show_time,
          tech_name: data.tech_name,
          band_id: data.is_band_override ? null : data.band_id,
          band_name: data.is_band_override ? data.band_name : null,
          is_band_override: data.is_band_override,
          updated_at: new Date().toISOString()
        }

        const { error } = await supabase
          .from('schedules')
          .update(scheduleData)
          .eq('id', editingSchedule)

        if (error) throw error
      } else {
        const scheduleData = {
          date: data.date,
          show_time: data.show_time,
          tech_name: data.tech_name,
          tech_id: currentUserId,
          band_id: data.is_band_override ? null : data.band_id,
          band_name: data.is_band_override ? data.band_name : null,
          is_band_override: data.is_band_override,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { error } = await supabase
          .from('schedules')
          .insert([scheduleData])

        if (error) throw error
      }

      await fetchSchedules()
      setIsDialogOpen(false)
      setEditingSchedule(null)
      setFeedbackModal({
        isOpen: true,
        title: 'Success',
        message: editingSchedule ? 'Schedule updated successfully.' : 'Schedule created successfully.',
        type: 'success'
      })
    } catch (err) {
      console.error('Error saving schedule:', err)
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: 'Failed to save schedule. Please try again.',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase, editingSchedule, currentUserId, fetchSchedules])

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button
          onClick={() => {
            setEditingSchedule(null)
            setIsDialogOpen(true)
          }}
          className="bg-orange-600 hover:bg-orange-500 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Schedule
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Icons.spinner className="h-6 w-6 animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 p-4">{error}</div>
      ) : schedules.length === 0 ? (
        <div className="text-center text-gray-400 p-8">
          No schedules found. Add your first schedule!
        </div>
      ) : isDesktop ? (
        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Show Time</TableHead>
                <TableHead>Band</TableHead>
                <TableHead>Tech Working</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>
                    {format(parseISO(schedule.date), 'PPP')}
                  </TableCell>
                  <TableCell>{schedule.show_time}</TableCell>
                  <TableCell>
                    {schedule.is_band_override ? schedule.band_name : schedule.bands?.name}
                  </TableCell>
                  <TableCell>{schedule.tech_name || 'Not assigned'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditingSchedule(schedule.id)
                          setIsDialogOpen(true)
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingScheduleId(schedule.id)
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
          {schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onEdit={(id) => {
                setEditingSchedule(id)
                setIsDialogOpen(true)
              }}
              onDelete={(id) => {
                setDeletingScheduleId(id)
                setShowConfirmDelete(true)
              }}
            />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
          </DialogHeader>
          <ScheduleForm
            onSubmit={handleSubmit}
            initialData={currentSchedule ? {
              date: currentSchedule.date,
              show_time: currentSchedule.show_time,
              tech_name: currentSchedule.tech_name || null,
              band_id: currentSchedule.band_id,
              band_name: currentSchedule.band_name,
              is_band_override: currentSchedule.is_band_override
            } : undefined}
            isLoading={isLoading}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Delete Schedule"
        message="Are you sure you want to delete this schedule? This action cannot be undone."
        onConfirm={async () => {
          if (deletingScheduleId) {
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
            } catch (error: unknown) {
              console.error('Error deleting schedule:', error)
              setFeedbackModal({
                isOpen: true,
                title: 'Error',
                message: 'Failed to delete schedule. Please try again.',
                type: 'error'
              })
            } finally {
              setIsLoading(false)
            }
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

