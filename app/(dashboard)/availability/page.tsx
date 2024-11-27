'use client'

import { Clock } from 'lucide-react'

export default function AvailabilityPage() {
  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Availability</h1>
        <p className="text-sm text-muted-foreground">
          Configure your availability hours and scheduling preferences
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-64 space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="font-medium mb-2">Time Zone</h2>
            <select className="w-full rounded-md border bg-background px-3 py-2">
              <option>America/New_York</option>
              <option>Europe/London</option>
              <option>Asia/Tokyo</option>
            </select>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h2 className="font-medium mb-2">Buffer Time</h2>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Before meetings</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>After meetings</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex-1 rounded-lg border bg-card p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">Weekly Hours</h2>
            <button
              type="button"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              <Clock className="h-4 w-4" />
              Add Hours
            </button>
          </div>
          <div className="text-center text-muted-foreground py-12">
            No availability set. Click &quot;Add Hours&quot; to set your weekly schedule.
          </div>
        </div>
      </div>
    </div>
  )
} 