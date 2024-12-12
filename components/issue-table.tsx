"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { format } from "date-fns"
import { Eye, Edit, Trash2, Plus } from "lucide-react"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { FeedbackModal } from "@/components/ui/feedback-modal"

interface Issue {
  id: string
  title: string
  description: string
  status: "open" | "closed"
  priority: "low" | "medium" | "high"
  notes: string | null
  reported_by: string
  created_at: string
  updated_at: string
  closed_at?: string
  reporter?: {
    email: string
    full_name?: string
  }
}

interface FeedbackModalState {
  isOpen: boolean
  title: string
  message: string
  type: 'success' | 'error'
}

function IssueCard({ 
  issue, 
  onEdit, 
  onDelete, 
  onView, 
  status, 
  onClose,
  onReopen,
  setEditingIssue,
  setFormData,
  handleSetDialogOpen 
}: {
  issue: Issue
  onEdit: (issue: Issue) => void
  onDelete: (id: string) => void
  onView: (issue: Issue) => void
  status: "open" | "closed"
  onClose: (id: string) => void
  onReopen: (id: string) => void
  setEditingIssue: (id: string) => void
  setFormData: (data: any) => void
  handleSetDialogOpen: (open: boolean) => void
}) {
  return (
    <div className="bg-card rounded-lg p-4 space-y-4 border border-gray-800">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="line-clamp-1 break-all text-lg font-semibold ">{issue.title}</h3>
            <div className={cn(
              "w-2 h-2 rounded-full",
              {
                "bg-green-500": issue.priority === "low",
                "bg-yellow-500": issue.priority === "medium",
                "bg-red-500": issue.priority === "high"
              }
            )} />
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-400">
              Created {format(new Date(issue.created_at), "PPP")}
            </p>
            <p className="text-sm text-gray-400">
              Reported by: {issue.reporter?.email || 'Unknown'}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {status === "open" ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onClose(issue.id)}
              className="h-8"
            >
              Close Issue
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onReopen(issue.id)}
              className="h-8"
            >
              Reopen Issue
            </Button>
          )}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onView(issue)}
              className="h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
            {status === "closed" && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(issue)}
                className="h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(issue.id)}
              className="h-8 w-8 text-red-500 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-sm">
        <p className="text-gray-400">Description</p>
        <p className="line-clamp-2 whitespace-normal">{issue.description}</p>
      </div>
      
      {issue.notes && (
        <div className="text-sm">
          <p className="text-gray-400">Notes</p>
          <p className="">{issue.notes}</p>
        </div>
      )}
    </div>
  )
}

export function IssueTable({ 
  status, 
  showControls = false,
  isDialogOpen,
  setIsDialogOpen
}: { 
  status: "open" | "closed"
  showControls?: boolean
  isDialogOpen?: boolean
  setIsDialogOpen?: (open: boolean) => void
}) {
  const [localDialogOpen, setLocalDialogOpen] = useState(false)
  const [issues, setIssues] = useState<Issue[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [editingIssue, setEditingIssue] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const [deletingIssueId, setDeletingIssueId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'low' as 'low' | 'medium' | 'high',
    notes: ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [viewingIssue, setViewingIssue] = useState<Issue | null>(null)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalState>({
    isOpen: false,
    title: '',
    message: '',
    type: 'success'
  })
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const supabase = createClientComponentClient()

  // Use the passed in dialog state if available, otherwise use local state
  const dialogOpen = isDialogOpen ?? localDialogOpen
  const handleSetDialogOpen = (open: boolean) => {
    if (setIsDialogOpen) {
      setIsDialogOpen(open)
    } else {
      setLocalDialogOpen(open)
    }
  }

  useEffect(() => {
    async function fetchIssues() {
      try {
        setIsLoading(true)
        console.log('Fetching issues with status:', status)
        
        // Get current user
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        console.log('Current user:', currentUser)
        setCurrentUserId(currentUser?.id || null)

        // Fetch issues
        const { data: issuesData, error: fetchError } = await supabase
          .from('issues')
          .select(`
            id,
            title,
            description,
            status,
            priority,
            notes,
            reported_by,
            created_at,
            updated_at,
            closed_at
          `)
          .eq('status', status)
          .order('created_at', { ascending: false })

        console.log('Query response:', { data: issuesData, error: fetchError })

        if (fetchError) {
          console.error('Supabase query error:', fetchError)
          throw new Error(fetchError.message || 'Failed to fetch issues')
        }

        if (!issuesData) {
          console.log('No data returned from query')
          setIssues([])
        } else {
          // Add reporter information to each issue
          const issuesWithReporter = issuesData.map(issue => ({
            ...issue,
            reporter: {
              email: issue.reported_by === currentUser?.id ? currentUser?.email : issue.reported_by,
              full_name: issue.reported_by === currentUser?.id ? currentUser?.user_metadata?.full_name || currentUser?.email : issue.reported_by
            }
          }))
          console.log(`Found ${issuesWithReporter.length} issues with status: ${status}`)
          setIssues(issuesWithReporter)
        }
      } catch (err) {
        console.error('Error details:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch issues')
        setIssues([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchIssues()
  }, [status, supabase])

  const handleSaveIssue = async () => {
    try {
      setIsSaving(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('You must be logged in to create an issue')
      }

      const issueData = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        notes: formData.notes || null,
        status: status,
        reported_by: user.id,
        ...(editingIssue ? { updated_at: new Date().toISOString() } : {
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      }

      if (editingIssue) {
        const { error } = await supabase
          .from('issues')
          .update(issueData)
          .eq('id', editingIssue)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('issues')
          .insert([issueData])

        if (error) throw error
      }

      // Refresh the issues list
      const { data, error: fetchError } = await supabase
        .from('issues')
        .select('*')
        .eq('status', status)
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setIssues(data as Issue[] || [])
      handleSetDialogOpen(false)
      setFeedbackModal({
        isOpen: true,
        title: 'Success',
        message: editingIssue ? 'Issue updated successfully.' : 'Issue created successfully.',
        type: 'success'
      })
    } catch (err) {
      console.error('Error saving issue:', err)
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to save issue',
        type: 'error'
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCloseIssue = async (issueId: string) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({
          status: 'closed',
          closed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', issueId)

      if (error) throw error

      // Remove the closed issue from the list
      setIssues(issues.filter(issue => issue.id !== issueId))
      setFeedbackModal({
        isOpen: true,
        title: 'Success',
        message: 'Issue closed successfully.',
        type: 'success'
      })
    } catch (error: any) {
      console.error('Error closing issue:', error)
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Failed to close issue',
        type: 'error'
      })
    }
  }

  const handleReopenIssue = async (issueId: string) => {
    try {
      const { error } = await supabase
        .from('issues')
        .update({
          status: 'open',
          closed_at: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', issueId)

      if (error) throw error

      // Remove the reopened issue from the closed list
      setIssues(issues.filter(issue => issue.id !== issueId))
      setFeedbackModal({
        isOpen: true,
        title: 'Success',
        message: 'Issue reopened successfully.',
        type: 'success'
      })
    } catch (error: any) {
      console.error('Error reopening issue:', error)
      setFeedbackModal({
        isOpen: true,
        title: 'Error',
        message: error.message || 'Failed to reopen issue',
        type: 'error'
      })
    }
  }

  const handleEditClick = (issue: Issue) => {
    setFormData({
      title: issue.title,
      description: issue.description,
      priority: issue.priority,
      notes: issue.notes || ''
    })
    setEditingIssue(issue.id)
    handleSetDialogOpen(true)
  }

  if (isLoading) {
    return <div className="flex justify-center p-4"><Icons.spinner className="h-6 w-4 animate-spin" /></div>
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>Error loading issues:</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {showControls && (
        <div className="flex justify-between items-center">
          <Button
            onClick={() => {
              setEditingIssue(null)
              handleSetDialogOpen(true)
            }}
            className="bg-orange-600 hover:bg-orange-500 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Issue
          </Button>
        </div>
      )}

      {issues.length === 0 ? (
        <div className="text-center text-gray-400 p-8">
          No {status} issues found.
        </div>
      ) : isDesktop ? (
        <div className="rounded-md border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead className="w-[100px]">Priority</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[150px]">Created</TableHead>
                <TableHead className="w-[200px]">Reported By</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {issues.map((issue) => (
                <TableRow key={issue.id}>
                  <TableCell className="font-medium">
                    <p className="line-clamp-1 text-sm">
                      {issue.title}
                    </p>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        {
                          "bg-green-500": issue.priority === "low",
                          "bg-yellow-500": issue.priority === "medium",
                          "bg-red-500": issue.priority === "high"
                        }
                      )} />
                      <span className="capitalize">{issue.priority}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[400px]">
                    <p className="break-all text-sm text-muted-foreground">
                      {issue.description}
                    </p>
                    {issue.notes && (
                      <p className="mt-1 truncate text-sm text-muted-foreground/80">
                        Notes: {issue.notes}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>{format(new Date(issue.created_at), "MMM d, yyyy")}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {issue.reporter?.email || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setViewingIssue(issue)
                          setIsViewModalOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {status === "open" ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCloseIssue(issue.id)}
                          className="h-8"
                        >
                          Close Issue
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReopenIssue(issue.id)}
                          className="h-8"
                        >
                          Reopen Issue
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setDeletingIssueId(issue.id)
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
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              status={status}
              onView={(issue) => {
                setViewingIssue(issue)
                setIsViewModalOpen(true)
              }}
              onEdit={handleEditClick}
              onClose={handleCloseIssue}
              onReopen={handleReopenIssue}
              onDelete={(id) => {
                setDeletingIssueId(id)
                setShowConfirmDelete(true)
              }}
              setEditingIssue={setEditingIssue}
              setFormData={setFormData}
              handleSetDialogOpen={handleSetDialogOpen}
            />
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={handleSetDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingIssue ? 'Edit Issue' : 'Create New Issue'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter issue title"
                  value={formData.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter issue description"
                  rows={4}
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    setFormData(prev => ({ ...prev, description: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value: 'low' | 'medium' | 'high') => 
                      setFormData(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any additional notes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => 
                    setFormData(prev => ({ ...prev, notes: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleSetDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveIssue}
              disabled={isSaving || !formData.title || !formData.description}
              className="bg-orange-600 hover:bg-orange-500 text-white"
            >
              {isSaving ? (
                <>
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                  {editingIssue ? 'Saving...' : 'Creating...'}
                </>
              ) : (
                editingIssue ? 'Save Changes' : 'Create Issue'
              )}
            </Button>
          </DialogFooter>
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
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      {
                        "bg-green-500": viewingIssue.priority === "low",
                        "bg-yellow-500": viewingIssue.priority === "medium",
                        "bg-red-500": viewingIssue.priority === "high"
                      }
                    )} />
                    <span className="text-lg capitalize">{viewingIssue.priority}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                <div className="bg-card-gradient rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{viewingIssue.description}</p>
                </div>
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
                  <p>Created: {format(new Date(viewingIssue.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                </div>
                <div>
                  {viewingIssue.updated_at && (
                    <p>Updated: {format(new Date(viewingIssue.updated_at), "MMM d, yyyy 'at' h:mm a")}</p>
                  )}
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
        onConfirm={async () => {
          if (!deletingIssueId) return
          try {
            const { error } = await supabase
              .from('issues')
              .delete()
              .eq('id', deletingIssueId)

            if (error) throw error

            setIssues(issues.filter(issue => issue.id !== deletingIssueId))
            setShowConfirmDelete(false)
            setDeletingIssueId(null)
            setFeedbackModal({
              isOpen: true,
              title: 'Success',
              message: 'Issue deleted successfully.',
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

