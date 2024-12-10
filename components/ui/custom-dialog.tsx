"use client"

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CustomDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type?: 'success' | 'error' | 'delete'
  onConfirm?: () => void
  description?: string
}

export function CustomDialog({ 
  isOpen, 
  onClose, 
  title, 
  message, 
  type = 'success',
  onConfirm,
  description
}: CustomDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="py-4">
          <p className={cn(
            "text-sm",
            type === 'error' && "text-red-500",
            type === 'success' && "text-green-500"
          )}>
            {message}
          </p>
        </div>
        <DialogFooter>
          {type === 'delete' ? (
            <div className="flex space-x-2 justify-end w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={onConfirm}
              >
                Delete
              </Button>
            </div>
          ) : (
            <Button
              type="button"
              onClick={onClose}
              className={cn(
                type === 'success' && "bg-green-600 hover:bg-green-500",
                type === 'error' && "bg-red-600 hover:bg-red-500"
              )}
            >
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 