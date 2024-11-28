'use client'

import * as React from 'react'
import { TabNavigation } from '@/components/layout/TabNavigation'
import { NotificationPrompt } from '@/components/features/NotificationPrompt'
import { EmptyState } from '@/components/features/EmptyState'
import { supabase } from '@/lib/supabase'
import { format } from 'date-fns'

interface Booking {
  id: number
  customer_name: string
  customer_email: string
  booking_date: string
  booking_time: string
  notes: string
  status: string
  service: {
    name: string
    duration: number
  }
}

export default function BookingsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            *,
            service:services(name, duration)
          `)
          .order('booking_date', { ascending: true })

        if (error) throw error
        setBookings(data || [])
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex flex-col pr-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Bookings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your event bookings and scheduling
        </p>
      </div>
      <NotificationPrompt />
      <TabNavigation />
      <div className="mt-4">
        {bookings.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="rounded-md border">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between border-b p-4 last:border-0"
              >
                <div>
                  <h3 className="font-medium">{booking.customer_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.service.name} - {booking.service.duration} min
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(booking.booking_date), 'PPP')} at{' '}
                    {booking.booking_time}
                  </p>
                </div>
                <div>
                  <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 