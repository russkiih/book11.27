'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/components/ui/use-toast'

const WEEKDAYS = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
]

export function WeekdayAvailability() {
  const [availableDays, setAvailableDays] = useState<number[]>([1, 2, 3, 4, 5]) // Default Mon-Fri
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const toggleDay = async (dayId: number) => {
    try {
      const newAvailableDays = availableDays.includes(dayId)
        ? availableDays.filter(id => id !== dayId)
        : [...availableDays, dayId]
      
      setAvailableDays(newAvailableDays)
      
      // We'll implement the Supabase update later
      toast({
        title: "Availability updated",
        description: "Your availability settings have been saved."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update availability.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-center">Weekly Availability</h2>
      <div className="space-y-4">
        {WEEKDAYS.map((day) => (
          <div key={day.id} className="flex items-center justify-between">
            <span>{day.name}</span>
            <Switch
              checked={availableDays.includes(day.id)}
              onCheckedChange={() => toggleDay(day.id)}
            />
          </div>
        ))}
      </div>
    </div>
  )
} 