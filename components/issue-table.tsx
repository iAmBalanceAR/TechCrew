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
import { Textarea } from "../components/ui/textarea"
import { Edit, Trash2, Plus } from 'lucide-react'
import { Icons } from "../components/icons"
import { cn } from "../lib/utils"
import Select, { StylesConfig } from 'react-select'

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

interface IssueFormData {
  issue: string
  date: string
  tech: string
  priority: string
  notes?: string
}

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
    const data = {
      issue: formData.get('issue') as string,
      date: formData.get('date') as string,
      tech: formData.get('tech') as string,
      priority: selectedPriority?.value || 'medium',
      notes: formData.get('notes') as string,
    }
    onSubmit(data)
  }

  return (
    <form ref={ref} onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="issue">Issue</Label>
        <Input 
          id="issue" 
          name="issue"
          defaultValue={initialData?.issue}
          placeholder="Enter issue description" 
          required 
        />
      </div>
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
        <Label htmlFor="tech">Tech</Label>
        <Input 
          id="tech" 
          name="tech"
          defaultValue={initialData?.tech}
          placeholder="Enter tech name" 
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

const issues = [
  { id: 1, issue: "Faulty microphone", date: "2023-06-15", tech: "John Doe", status: "open", priority: "high", userId: 1 },
  { id: 2, issue: "Broken cable", date: "2023-06-12", tech: "Jane Smith", status: "open", priority: "medium", userId: 2 },
  { id: 3, issue: "Speaker distortion", date: "2023-06-10", tech: "John Doe", status: "closed", priority: "low", userId: 1 },
  { id: 4, issue: "Missing power supply", date: "2023-06-08", tech: "John Doe", status: "open", priority: "high", userId: 1 },
  { id: 5, issue: "Software glitch", date: "2023-06-05", tech: "Jane Smith", status: "closed", priority: "medium", userId: 2 },
]

const priorityColors = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-red-500",
}

export function IssueTable({ status }: { status: "open" | "closed" }) {
  const [currentUserId] = useState(1)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIssue, setEditingIssue] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const filteredIssues = issues.filter(issue => issue.status === status)

  const handleSubmit = useCallback(async (data: IssueFormData) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Form submitted:', data)
    } finally {
      setIsLoading(false)
      setIsDialogOpen(false)
      setEditingIssue(null)
    }
  }, [])

  const handleAdd = useCallback(() => {
    setEditingIssue(null)
    setIsDialogOpen(true)
  }, [])

  const handleEdit = useCallback((issueId: number) => {
    setEditingIssue(issueId)
    setIsDialogOpen(true)
  }, [])

  const handleCancel = useCallback(() => {
    setIsDialogOpen(false)
    setEditingIssue(null)
  }, [])

  const currentIssue = editingIssue 
    ? issues.find(issue => issue.id === editingIssue)
    : undefined

  return (
    <div>
      <div className="flex justify-between items-center">
        {status === "open" && (
          <Button onClick={handleAdd} variant="orange" className="ml-auto">
            <Plus className="h-4 w-4 mr-2" />
            Add New Issue
          </Button>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Issue</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Tech</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredIssues.map((issue) => (
            <TableRow key={issue.id}>
              <TableCell>{issue.issue}</TableCell>
              <TableCell>{issue.date}</TableCell>
              <TableCell>{issue.tech}</TableCell>
              <TableCell>
                <div className={`w-3 h-3 rounded-full ${priorityColors[issue.priority as keyof typeof priorityColors]}`}></div>
              </TableCell>
              <TableCell className="text-right">
                {issue.userId === currentUserId && (
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(issue.id)}>
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
            <DialogTitle>{editingIssue ? 'Edit Issue' : 'Add New Issue'}</DialogTitle>
          </DialogHeader>
          <IssueForm
            onSubmit={handleSubmit}
            initialData={currentIssue}
            isLoading={isLoading}
            onCancel={handleCancel}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

