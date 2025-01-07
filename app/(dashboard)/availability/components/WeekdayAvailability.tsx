'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/components/ui/use-toast'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Clock } from 'lucide-react'

const WEEKDAYS = [
  { id: 0, name: 'Sunday' },
  { id: 1, name: 'Monday' },
  { id: 2, name: 'Tuesday' },
  { id: 3, name: 'Wednesday' },
  { id: 4, name: 'Thursday' },
  { id: 5, name: 'Friday' },
  { id: 6, name: 'Saturday' },
]

const DEFAULT_TIME_RANGE = {
  start: '09:00',
  end: '17:00'
}

interface TimeRange {
  start: string
  end: string
}

interface DayAvailability {
  enabled: boolean
  timeRange: TimeRange
}

type WeekdayAvailabilityType = {
  [key: number]: DayAvailability
}

// Initialize default availability for all days
const getDefaultAvailability = (): WeekdayAvailabilityType => {
  const defaultAvailability: WeekdayAvailabilityType = {}
  for (const day of WEEKDAYS) {
    defaultAvailability[day.id] = {
      enabled: [1, 2, 3, 4, 5].includes(day.id),
      timeRange: { ...DEFAULT_TIME_RANGE }
    }
  }
  return defaultAvailability
}

export function WeekdayAvailability() {
  const [availability, setAvailability] = useState<WeekdayAvailabilityType>(getDefaultAvailability())
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('weekday_availability')
          .select('weekdays, availability')
          .eq('user_id', user.id)
          .single()

        if (error) {
          // If no record exists, create one with defaults
          const defaultAvail = getDefaultAvailability()
          const defaultWeekdays = [1, 2, 3, 4, 5]
          
          const { error: insertError } = await supabase
            .from('weekday_availability')
            .insert({ 
              user_id: user.id,
              weekdays: defaultWeekdays,
              availability: defaultAvail
            })
          
          if (!insertError) {
            setAvailability(defaultAvail)
          }
          return
        }

        if (data) {
          // If we have existing data, use it
          if (data.availability && Object.keys(data.availability).length > 0) {
            setAvailability(data.availability)
          } else if (data.weekdays) {
            // Convert weekdays array to availability format
            const availFromWeekdays = getDefaultAvailability()
            for (const day of WEEKDAYS) {
              availFromWeekdays[day.id] = {
                ...availFromWeekdays[day.id],
                enabled: data.weekdays.includes(day.id)
              }
            }
            setAvailability(availFromWeekdays)
          }
        }
      } catch (error) {
        console.error('Error fetching availability:', error)
      }
    }

    fetchAvailability()
  }, [supabase])

  const updateAvailability = async (
    dayId: number,
    update: Partial<DayAvailability>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const newAvailability = {
        ...availability,
        [dayId]: {
          ...availability[dayId],
          ...update
        }
      }
      
      // Calculate weekdays array for backward compatibility
      const weekdays = Object.entries(newAvailability)
        .filter(([_, value]) => value.enabled)
        .map(([key]) => Number.parseInt(key, 10))

      // Calculate hours array from time ranges, keeping track of hours per day
      const hoursPerDay = Object.entries(newAvailability)
        .filter(([_, value]) => value.enabled)
        .reduce((acc, [day, value]) => {
          const start = Number.parseInt(value.timeRange.start.split(':')[0], 10)
          const end = Number.parseInt(value.timeRange.end.split(':')[0], 10)
          acc[day] = Array.from(
            { length: end - start },
            (_, i) => start + i
          )
          return acc
        }, {} as Record<string, number[]>)

      // Combine all hours for backward compatibility
      const hours = [...new Set(Object.values(hoursPerDay).flat())].sort((a, b) => a - b)

      // First check if records exist
      const [weekdayRecord, hoursRecord] = await Promise.all([
        supabase
          .from('weekday_availability')
          .select('id')
          .eq('user_id', user.id)
          .single(),
        supabase
          .from('hours_availability')
          .select('id')
          .eq('user_id', user.id)
          .single()
      ])

      // Update or insert weekday availability
      const weekdayResult = await (weekdayRecord.data
        ? supabase
            .from('weekday_availability')
            .update({
              weekdays,
              availability: newAvailability,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
        : supabase
            .from('weekday_availability')
            .insert({
              user_id: user.id,
              weekdays,
              availability: newAvailability,
              updated_at: new Date().toISOString()
            }))

      // Update or insert hours availability with per-day information
      const hoursResult = await (hoursRecord.data
        ? supabase
            .from('hours_availability')
            .update({
              hours,
              hours_per_day: hoursPerDay,
              updated_at: new Date().toISOString()
            })
            .eq('user_id', user.id)
        : supabase
            .from('hours_availability')
            .insert({
              user_id: user.id,
              hours,
              hours_per_day: hoursPerDay,
              updated_at: new Date().toISOString()
            }))

      if (weekdayResult.error) {
        console.error('Weekday update error:', weekdayResult.error)
        throw new Error(`Failed to update weekday availability: ${weekdayResult.error.message}`)
      }

      if (hoursResult.error) {
        console.error('Hours update error:', hoursResult.error)
        throw new Error(`Failed to update hours availability: ${hoursResult.error.message}`)
      }

      // Only update state if both database operations succeeded
      setAvailability(newAvailability)

      toast({
        title: "Availability updated",
        description: "Your availability settings have been saved."
      })
    } catch (error) {
      console.error('Error updating availability:', error instanceof Error ? error.message : 'Unknown error')
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update availability.",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="rounded-md border bg-card">
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-medium">Set your weekdays availability</h2>
            <span className="text-sm text-muted-foreground">(All times in UTC)</span>
          </div>
        </div>
        <div className="space-y-1">
          {WEEKDAYS.map((day) => {
            const dayAvailability = availability[day.id]
            
            return (
              <div
                key={day.id}
                className={`flex items-center gap-4 p-3 rounded-md ${
                  dayAvailability.enabled ? 'bg-blue-100/50' : 'bg-gray-100/50'
                }`}
              >
                <Checkbox
                  checked={dayAvailability.enabled}
                  onCheckedChange={(checked) => 
                    updateAvailability(day.id, { enabled: !!checked })
                  }
                  className="h-5 w-5"
                />
                <span className="w-32 text-sm">{day.name}</span>
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <input
                      type="time"
                      value={dayAvailability.timeRange.start}
                      onChange={(e) => 
                        updateAvailability(day.id, {
                          timeRange: {
                            ...dayAvailability.timeRange,
                            start: e.target.value
                          }
                        })
                      }
                      className="w-[130px] rounded-md border px-3 py-1.5 text-black text-sm [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit-fields-wrapper]:text-black disabled:opacity-50"
                      disabled={!dayAvailability.enabled}
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={dayAvailability.timeRange.end}
                      onChange={(e) => 
                        updateAvailability(day.id, {
                          timeRange: {
                            ...dayAvailability.timeRange,
                            end: e.target.value
                          }
                        })
                      }
                      className="w-[130px] rounded-md border px-3 py-1.5 text-black text-sm [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-datetime-edit-fields-wrapper]:text-black disabled:opacity-50"
                      disabled={!dayAvailability.enabled}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-8 p-4 bg-blue-50/50 rounded-md">
          <Button variant="outline" className="gap-2 text-sm">
            <Clock className="h-4 w-4" />
            Add break
          </Button>
        </div>
      </div>
    </div>
  )
} 