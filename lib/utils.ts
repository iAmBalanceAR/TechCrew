import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatLocalDate(dateStr: string) {
  // Just parse the ISO date string - no need to add a day
  return parseISO(dateStr)
}

