'use client'

import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface BookingCalendarProps {
  selectedDate: Date | undefined
  onSelect: (date: Date | undefined) => void
  availableWeekdays: number[]
}

export function BookingCalendar({ selectedDate, onSelect, availableWeekdays }: BookingCalendarProps) {
  // Disable days that aren't in availableWeekdays
  const disabledDays = (date: Date) => {
    const day = date.getDay()
    return !availableWeekdays.includes(day)
  }

  // Disable past dates
  const disablePastDates = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return date < today
  }

  const isDisabled = (date: Date) => {
    return disabledDays(date) || disablePastDates(date)
  }

  const footer = selectedDate ? (
    <p className="mt-4 text-sm text-muted-foreground">
      You selected {format(selectedDate, 'PPP')}.
    </p>
  ) : (
    <p className="mt-4 text-sm text-muted-foreground">
      Please pick a day.
    </p>
  )

  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-4 font-medium">Select a Date</h3>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        disabled={isDisabled}
        footer={footer}
        showOutsideDays
        className={cn(
          'rounded-md border',
          'rdp-day_selected:bg-primary rdp-day_selected:text-primary-foreground',
          'rdp-day_today:bg-accent rdp-day_today:text-accent-foreground'
        )}
      />
      <p className="mt-2 text-sm text-muted-foreground">
        Available days: {availableWeekdays.map(day => 
          ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]
        ).join(', ')}
      </p>
    </div>
  )
} 