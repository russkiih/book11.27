'use client'

import { WeekdayAvailability } from './components/WeekdayAvailability'

export default function AvailabilityPage() {
  return (
    <div className="flex flex-col pr-4">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Availability</h1>
        <p className="text-sm text-muted-foreground">
          Define at which time your guests can book a meeting with you.
        </p>
      </div>
      <WeekdayAvailability />
    </div>
  )
} 