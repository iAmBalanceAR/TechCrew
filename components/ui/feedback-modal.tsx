"use client"

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
  type: 'success' | 'error'
}

export function FeedbackModal({
  isOpen,
  onClose,
  title,
  message,
  type
}: FeedbackModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <div className="flex flex-col items-center gap-4 py-4">
          {type === 'success' ? (
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          ) : (
            <XCircle className="h-12 w-12 text-red-500" />
          )}
          
          <h3 className="text-lg font-semibold text-center">{title}</h3>
          <p className="text-center text-muted-foreground">{message}</p>
          
          <Button 
            onClick={onClose}
            className={cn(
              "mt-4 min-w-[100px]",
              type === 'success' ? "bg-green-600 hover:bg-green-500" : "bg-red-600 hover:bg-red-500",
              "text-white"
            )}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 