'use client'

import { useState, useEffect } from 'react'
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
  const [availableDays, setAvailableDays] = useState<number[]>([])
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchDays = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('weekday_availability')
        .select('weekdays')
        .eq('user_id', user.id)
        .single()

      if (error) {
        // If no record exists, create one with default days
        const defaultDays = [1, 2, 3, 4, 5]
        await supabase
          .from('weekday_availability')
          .insert({ user_id: user.id, weekdays: defaultDays })
        setAvailableDays(defaultDays)
      } else {
        setAvailableDays(data.weekdays)
      }
    }

    fetchDays()
  }, [supabase])

  const toggleDay = async (dayId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const newAvailableDays = availableDays.includes(dayId)
        ? availableDays.filter(id => id !== dayId)
        : [...availableDays, dayId]
      
      setAvailableDays(newAvailableDays)
      
      // First try to update
      let { error } = await supabase
        .from('weekday_availability')
        .update({ 
          weekdays: newAvailableDays,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', user.id)

      // If no rows were affected, insert instead
      if (error?.code === 'PGRST116') {
        ({ error } = await supabase
          .from('weekday_availability')
          .insert({ 
            user_id: user.id, 
            weekdays: newAvailableDays
          }))
      }

      if (error) throw error

      toast({
        title: "Availability updated",
        description: "Your availability settings have been saved."
      })
    } catch (error) {
      console.error('Error updating weekdays:', error)
      toast({
        title: "Error",
        description: "Failed to update availability.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-center">Weekdays Availability</h2>
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