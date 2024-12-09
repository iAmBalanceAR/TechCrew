"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

const MotionDiv = motion.div;

const generateMockData = (startDate: Date, endDate: Date) => {
  const events = []
  const bands = ["The Rockers", "Jazz Ensemble", "Acoustic Trio", "Electronic Beats", "Classical Orchestra"]
  const techs = ["John Doe", "Jane Smith", "Alice Johnson", "Bob Williams"]

  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    if (d.getDay() === 5 || d.getDay() === 6) { // Friday or Saturday
      events.push({
        id: d.getTime(),
        date: d.toISOString().split('T')[0],
        band: bands[Math.floor(Math.random() * bands.length)],
        techWorking: techs[Math.floor(Math.random() * techs.length)]
      })
    }
  }

  return events
}

const today = new Date()
const twoMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 2, 1)
const twoMonthsFromNow = new Date(today.getFullYear(), today.getMonth() + 2, 0)

const scheduleEvents = generateMockData(twoMonthsAgo, twoMonthsFromNow)

export function DashboardCalendar() {
  const [date, setDate] = useState<Date>(new Date())
  const [direction, setDirection] = useState(0)

  const currentMonthEvents = scheduleEvents.filter(event => {
    const eventDate = new Date(event.date)
    return eventDate.getMonth() === date.getMonth() && eventDate.getFullYear() === date.getFullYear()
  })

  const goToPreviousMonth = () => {
    setDirection(-1)
    setDate(new Date(date.getFullYear(), date.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setDirection(1)
    setDate(new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6 lg:gap-0 lg:divide-x divide-border/10">
      <div className="px-2 py-4 lg:px-4">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToPreviousMonth}
            className="hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <h2 className="text-lg font-semibold">
            {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToNextMonth}
            className="hover:bg-white/10"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={date.toISOString()}
            custom={direction}
            initial={{ x: 300 * direction, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300 * direction, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="w-full [&_table]:w-full [&_table]:border-separate [&_table]:border-spacing-1 [&_.rdp-head_button]:text-white/60 [&_.rdp-day]:h-9 [&_.rdp-day]:w-9 [&_.rdp-button]:h-9 [&_.rdp-button]:w-9 [&_.rdp-button:hover]:bg-white/10 [&_.rdp-day_button:hover]:bg-white/10 [&_.rdp-day_button.rdp-day_selected]:bg-primary [&_.rdp-day_button.rdp-day_selected]:text-primary-foreground"
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="px-2 py-4 lg:px-4">
        <h3 className="text-lg font-semibold mb-4">Events this month</h3>
        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2">
          <AnimatePresence>
            {currentMonthEvents.map((event, index) => (
              <MotionDiv
                key={index}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "2.5rem 1fr auto",
                  gap: "0.75rem",
                  alignItems: "center",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "0.375rem"
                }}
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.05)"
                }}
              >
                <span className="font-medium text-sm tabular-nums">{new Date(event.date).getDate()}</span>
                <span className="truncate">{event.band}</span>
                <span className="text-sm text-white/70">{event.techWorking}</span>
              </MotionDiv>
            ))}
            {currentMonthEvents.length === 0 && (
              <div className="py-4 text-center text-white/50">
                No events scheduled
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

