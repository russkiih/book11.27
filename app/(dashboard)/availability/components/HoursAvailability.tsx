'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  label: `${i.toString().padStart(2, '0')}:00`,
}))

export function HoursAvailability() {
  const [availableHours, setAvailableHours] = useState<number[]>(
    Array.from({ length: 9 }, (_, i) => i + 9) // Default 9am-5pm (9-17)
  )
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const toggleHour = async (hourId: number) => {
    try {
      const newAvailableHours = availableHours.includes(hourId)
        ? availableHours.filter(id => id !== hourId)
        : [...availableHours, hourId].sort((a, b) => a - b)
      
      setAvailableHours(newAvailableHours)
      
      // We'll implement the Supabase update later
      toast({
        title: "Hours updated",
        description: "Your available hours have been saved."
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update hours.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-center">Hours Availability</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {HOURS.map((hour) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            key={hour.id}
            onClick={() => toggleHour(hour.id)}
            className={`
              p-2 rounded-md border cursor-pointer text-center
              ${availableHours.includes(hour.id)
                ? 'bg-primary text-primary-foreground'
                : 'bg-background hover:bg-muted'}
            `}
          >
            {hour.label}
          </div>
        ))}
      </div>
    </div>
  )
} 