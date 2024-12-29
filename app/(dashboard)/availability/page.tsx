'use client'

import { Clock } from 'lucide-react'
import { WeekdayAvailability } from './components/WeekdayAvailability'
import { HoursAvailability } from './components/HoursAvailability'

export default function AvailabilityPage() {
  return (
    <div className="flex flex-col pr-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Availability</h1>
        <p className="text-sm text-muted-foreground">
          Configure your working hours and availability preferences
        </p>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-64 space-y-4">
          <div className="rounded-lg border bg-card p-4">
            <h2 className="font-medium mb-2">Time Zone</h2>
            <select className="w-full rounded-md border bg-background px-3 py-2" defaultValue="America/New_York">
              <option value="America/New_York">EST (Eastern Time)</option>
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="America/Los_Angeles">PST (Pacific Time)</option>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border bg-card p-4">
              <HoursAvailability />
            </div>
            <div className="rounded-lg border bg-card p-4">
              <WeekdayAvailability />
            </div>      
          </div>
        </div>
      </div>
    </div>
  )
} 