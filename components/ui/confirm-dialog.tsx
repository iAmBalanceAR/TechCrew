"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  onConfirm: () => void
}

export function ConfirmDialog({
  isOpen,
  onClose,
  title,
  message,
  onConfirm
}: ConfirmDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex flex-col items-center gap-4 py-4">
          <AlertTriangle className="h-12 w-12 text-yellow-500" />
          
          <h3 className="text-lg font-semibold text-center">{title}</h3>
          <p className="text-center text-muted-foreground">{message}</p>
          
          <div className="flex gap-4 mt-4">
            <Button 
              onClick={onClose}
              variant="outline"
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button 
              onClick={onConfirm}
              className="min-w-[100px] bg-red-600 hover:bg-red-500 text-white"
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 