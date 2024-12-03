'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const HOURS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  label: `${i.toString().padStart(2, '0')}:00`,
}))

export function HoursAvailability() {
  const [availableHours, setAvailableHours] = useState<number[]>([])
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchHours = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('hours_availability')
        .select('hours')
        .eq('user_id', user.id)
        .single()

      if (error) {
        // If no record exists, create one with default hours
        const defaultHours = Array.from({ length: 9 }, (_, i) => i + 9)
        await supabase
          .from('hours_availability')
          .insert({ user_id: user.id, hours: defaultHours })
        setAvailableHours(defaultHours)
      } else {
        setAvailableHours(data.hours)
      }
    }

    fetchHours()
  }, [supabase])

  const toggleHour = async (hourId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const newAvailableHours = availableHours.includes(hourId)
        ? availableHours.filter(id => id !== hourId)
        : [...availableHours, hourId].sort((a, b) => a - b)
      
      setAvailableHours(newAvailableHours)
      
      // First try to update
      let { error } = await supabase
        .from('hours_availability')
        .update({ 
          hours: newAvailableHours,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      // If no rows were affected, insert instead
      if (error?.code === 'PGRST116') {
        ({ error } = await supabase
          .from('hours_availability')
          .insert({ 
            user_id: user.id, 
            hours: newAvailableHours
          }))
      }

      if (error) throw error

      toast({
        title: "Hours updated",
        description: "Your available hours have been saved."
      })
    } catch (error) {
      console.error('Error updating hours:', error)
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