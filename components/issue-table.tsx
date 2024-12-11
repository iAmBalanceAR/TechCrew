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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Edit, Trash2, Plus } from 'lucide-react'
import { Icons } from "../components/icons"
import { cn } from "../lib/utils"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Select, { StylesConfig } from 'react-select'
import type { Issue, IssueFormData } from "@/types/index"
import { format } from 'date-fns'
import { FeedbackModal } from "@/components/ui/feedback-modal"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { formatLocalDate } from "@/lib/utils"

interface PriorityOption {
  value: 'low' | 'medium' | 'high'
  label: string
}

const customSelectStyles: StylesConfig<PriorityOption, false> = {
  control: (base, state) => ({
    ...base,
    background: 'rgb(2, 6, 23)',
    borderColor: 'rgb(55, 65, 81)',
    boxShadow: state.isFocused ? '0 0 0 1px rgb(55, 65, 81)' : 'none',
    '&:hover': {
      borderColor: 'rgb(75, 85, 101)'
    }
  }),
  menu: (base) => ({
    ...base,
    background: 'rgb(2, 6, 23)',
    border: '1px solid rgb(55, 65, 81)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgb(55, 65, 81)' : 'transparent',
    color: 'white',
    '&:active': {
      backgroundColor: 'rgb(75, 85, 101)'
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: 'white'
  }),
  input: (base) => ({
    ...base,
    color: 'white'
  }),
  placeholder: (base) => ({
    ...base,
    color: 'rgb(156, 163, 175)'
  }),
}

const priorityOptions: PriorityOption[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
]

interface IssueFormProps {
  onSubmit: (data: IssueFormData) => void
  initialData?: Partial<IssueFormData>
  isLoading: boolean
  onCancel: () => void
}

const IssueForm = forwardRef<HTMLFormElement, IssueFormProps>(({ 
  onSubmit, 
  initialData, 
  isLoading, 
  onCancel 
}, ref) => {
  const [selectedPriority, setSelectedPriority] = useState<PriorityOption | null>(
    initialData?.priority 
      ? { 
          value: initialData.priority as 'low' | 'medium' | 'high',
          label: initialData.priority.charAt(0).toUpperCase() + initialData.priority.slice(1) 
        }
      : null
  )

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data: IssueFormData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: initialData?.status || 'open',
      priority: selectedPriority?.value || 'medium',
      notes: formData.get('notes') as string || null,
    }
    onSubmit(data)
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input 
          id="title" 
          name="title"
          defaultValue={initialData?.title}
          placeholder="Enter issue title" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description"
          defaultValue={initialData?.description}
          placeholder="Enter issue description" 
          required 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="priority">Priority</Label>
        <Select<PriorityOption, false>
          inputId="priority"
          options={priorityOptions}
          value={selectedPriority}
          onChange={(newValue) => setSelectedPriority(newValue)}
          placeholder="Select priority"
          styles={customSelectStyles}
          theme={(theme) => ({
            ...theme,
            colors: {
              ...theme.colors,
              primary: 'rgb(55, 65, 81)',
              primary25: 'rgb(55, 65, 81)',
              neutral0: 'rgb(2, 6, 23)',
              neutral20: 'rgb(55, 65, 81)',
              neutral30: 'rgb(75, 85, 101)',
              neutral40: 'rgb(156, 163, 175)',
              neutral50: 'rgb(156, 163, 175)',
              neutral60: 'white',
              neutral80: 'white',
            },
          })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea 
          id="notes" 
          name="notes"
          defaultValue={initialData?.notes}
          placeholder="Enter additional notes" 
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

IssueForm.displayName = 'IssueForm'

const priorityColors: Record<'low' | 'medium' | 'high', string> = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
} as const;

const PriorityLegend = () => (
  <div className="flex items-center gap-4 mb-4">
    <span className="text-sm text-muted-foreground">Priority:</span>
    {Object.entries(priorityColors).map(([priority, color]) => (
      <div key={priority} className="flex items-center gap-1">
        <div className={`w-3 h-3 rounded-full ${color}`} />
        <span className="text-sm capitalize">{priority}</span>
      </div>
    ))}
  </div>
);

export function IssueTable({ 
  status, 
  showControls = false 
}: { 
  status: "open" | "closed"
  showControls?: boolean 
}) {
  const [issues, setIssues] = useState<Issue[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deletingIssueId, setDeletingIssueId] = useState<string | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [viewingIssue, setViewingIssue] = useState<Issue | null>(null)
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

  const supabase = createClientComponentClient()

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
    }
    fetchUser()
  }, [supabase])

  // Fetch issues
  const fetchIssues = useCallback(async () => {
    try {
      const { data: issuesData, error: issuesError } = await supabase
        .from('issues')
        .select('*')
        .eq('status', status === 'closed' ? 'closed' : 'open')
        .order('created_at', { ascending: false })
      
      if (issuesError) {
        console.error('Supabase error:', issuesError)
        throw issuesError
      }

      // Get the current user's email for display
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      
      const issuesWithReporter = issuesData.map(issue => ({
        ...issue,
        reporter: {
          email: issue.reported_by === currentUser?.id ? currentUser?.email : issue.reported_by,
          full_name: issue.reported_by === currentUser?.id ? currentUser?.user_metadata?.full_name || currentUser?.email : issue.reported_by
        }
      }))
      
      setIssues(issuesWithReporter)
    } catch (err) {
      console.error('Error fetching issues:', err)
      setError('Failed to load issues')
    } finally {
      setIsLoading(false)
    }
  }, [supabase, status])

  // Initial fetch
  useEffect(() => {
    fetchIssues()
  }, [fetchIssues])

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('issues_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'issues',
        },
        () => fetchIssues()
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'issues',
        },
        () => fetchIssues()
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'issues',
        },
        () => fetchIssues()
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, fetchIssues])

  const handleSubmit = useCallback(async (data: IssueFormData) => {
    setIsLoading(true)
    try {
      // Get current user info
      const { data: { user: currentUser } } = await supabase.auth.getUser()
      if (!currentUser) throw new Error('No user found')

      if (editingIssue) {
        const { error } = await supabase
          .from('issues')
          .update({
            title: data.title,
            description: data.description,
            priority: data.priority,
            notes: data.notes,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingIssue)

        if (error) throw error
        
        await fetchIssues()
        setIsDialogOpen(false)
        setEditingIssue(null)
        setFeedbackModal({
          isOpen: true,
          title: 'Success',
          message: 'Issue has been updated successfully.',
          type: 'success'
        })
      } else {
        const { error } = await supabase
          .from('issues')
          .insert([{
            title: data.title,
            description: data.description,
            status: 'open',
            priority: data.priority,
            reported_by: currentUser.id,
            notes: data.notes,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])

        if (error) throw error
        
        await fetchIssues()
        setIsDialogOpen(false)
        setEditingIssue(null)
        setFeedbackModal({
          isOpen: true,
          title: 'Success',
          message: 'New issue has been added successfully.',
          type: 'success'
        })
      }
    } catch (error: any) {
      console.error('Error saving issue:', error)
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Failed to save issue',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }, [editingIssue, supabase, fetchIssues])

  const handleDelete = useCallback(async () => {
    if (!deletingIssueId) return

    setIsLoading(true)
    try {
      const { error } = await supabase
        .from('issues')
        .delete()
        .eq('id', deletingIssueId)

      if (error) throw error

      await fetchIssues()
      setShowConfirmDelete(false)
      setDeletingIssueId(null)
      setFeedbackModal({
        isOpen: true,
        title: 'Success',
        message: 'Issue has been deleted successfully.',
        type: 'success'
      })
    } catch (error: any) {
      console.error('Error deleting issue:', error)
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Failed to delete issue',
        type: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }, [deletingIssueId, supabase, fetchIssues])

  const handleDeleteClick = useCallback((issueId: string) => {
    setDeletingIssueId(issueId)
    setShowConfirmDelete(true)
  }, [])

  const handleStatusChange = useCallback(async (issueId: string, newStatus: 'open' | 'closed') => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({
          status: newStatus,
          closed_at: newStatus === 'closed' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', issueId)

      if (error) throw error

      // Force refresh both tables
      fetchIssues()
      
      setFeedbackModal({
        isOpen: true,
        title: 'Success',
        message: `Issue has been ${newStatus === 'closed' ? 'closed' : 'reopened'} successfully.`,
        type: 'success'
      })
    } catch (error: any) {
      console.error('Error updating issue status:', error)
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Failed to update issue status',
        type: 'error'
      })
    }
  }, [supabase, fetchIssues])

  const currentIssue = editingIssue 
    ? issues.find(issue => issue.id === editingIssue)
    : undefined

  const handleAdd = useCallback(() => {
    setEditingIssue(null)
    setIsDialogOpen(true)
  }, [])

  const handleEdit = useCallback((issueId: string) => {
    setEditingIssue(issueId)
    setIsDialogOpen(true)
  }, [])

  const handleView = useCallback((issue: Issue) => {
    setViewingIssue(issue)
    setIsViewModalOpen(true)
  }, [])

  if (isLoading) {
    return <div className="flex justify-center p-4"><Icons.spinner className="h-6 w-4 animate-spin" /></div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>
  }

  return (
    <>
      {showControls ? (
        <div className="flex flex-col items-end gap-2">
          <Button onClick={() => {
            setEditingIssue(null)
            setIsDialogOpen(true)
          }} variant="orange">
            <Plus className="h-4 w-4 mr-2" />
            Add New Issue
          </Button>
          <PriorityLegend />
        </div>
      ) : (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Reported By</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-center">Priority</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell>{issue.title}</TableCell>
                  <TableCell>
                    {format(new Date(issue.created_at), "MMMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {issue.reporter?.email || issue.reported_by}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-normal text-blue-200 hover:text-blue-100"
                      onClick={() => handleView(issue)}
                    >
                      View Issue
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center">
                      <div className={`w-3 h-3 rounded-full ${priorityColors[issue.priority]}`} />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {issue.reported_by === currentUserId && (
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(issue.id)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteClick(issue.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                        <Button
                          variant={status === 'open' ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => handleStatusChange(issue.id, status === 'open' ? 'closed' : 'open')}
                        >
                          {status === 'open' ? 'Close' : 'Reopen'}
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingIssue ? 'Edit Issue' : 'Add New Issue'}</DialogTitle>
          </DialogHeader>
          <IssueForm
            onSubmit={handleSubmit}
            initialData={currentIssue}
            isLoading={isLoading}
            onCancel={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient-orange">
              Issue Details
            </DialogTitle>
          </DialogHeader>
          {viewingIssue && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Title</h3>
                  <p className="text-lg">{viewingIssue.title}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Priority</h3>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${priorityColors[viewingIssue.priority]}`} />
                    <span className="text-lg capitalize">{viewingIssue.priority}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                <p className="text-lg">{viewingIssue.description}</p>
              </div>

              {viewingIssue.notes && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Notes</h3>
                  <div className="bg-card-gradient rounded-lg p-4">
                    <p className="whitespace-pre-wrap">{viewingIssue.notes}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <p>Created: {format(new Date(viewingIssue.created_at), "MMMM d, yyyy 'at' h:mm a")}</p>
                </div>
                {viewingIssue.updated_at && (
                  <p>Updated: {format(new Date(viewingIssue.updated_at), "MMMM d, yyyy 'at' h:mm a")}</p>
                )}
                {viewingIssue.closed_at && (
                  <p>Closed: {format(new Date(viewingIssue.closed_at), "MMMM d, yyyy 'at' h:mm a")}</p>
                )}
                <div className="col-span-2">
                  <p>Reported By: {viewingIssue.reporter?.email || viewingIssue.reported_by}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        title="Confirm Delete"
        message="Are you sure you want to delete this issue? This action cannot be undone."
        onConfirm={handleDelete}
      />

      <FeedbackModal
        isOpen={feedbackModal.isOpen}
        onClose={() => setFeedbackModal(prev => ({ ...prev, isOpen: false }))}
        title={feedbackModal.title}
        message={feedbackModal.message}
        type={feedbackModal.type as 'success' | 'error'}
      />
    </>
  )
}

