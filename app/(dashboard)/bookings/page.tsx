'use client'

import * as React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { TabNavigation } from '@/components/layout/TabNavigation'
import { NotificationPrompt } from '@/components/features/NotificationPrompt'
import { EmptyState } from '@/components/features/EmptyState'
import { format, parseISO } from 'date-fns'

interface Booking {
  id: string
  customer_name: string
  customer_email: string
  phone_number: string
  booking_datetime: string
  notes: string | null
  status: string
  duration: number
  price: number
  services: {
    name: string
    duration: number
  } | null
}

export default function BookingsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const supabase = createClientComponentClient()

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        setError(null)

        const { data: sessionData, error: sessionError } = await supabase.auth.getUser()
        
        if (sessionError) {
          throw new Error('Failed to get user session')
        }

        if (!sessionData.user) {
          throw new Error('No user logged in')
        }

        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id,
            customer_name,
            customer_email,
            phone_number, 
            booking_datetime,
            notes,
            status,
            duration,
            price,
            services: services (
              name,
              duration
            )
          `)
          .eq('provider_id', sessionData.user.id)
          .order('booking_datetime', { ascending: true })

        if (bookingsError) {
          throw bookingsError
        }

        const transformedBookings = bookingsData?.map(booking => ({
          ...booking,
          services: booking.services || null
        }))

        setBookings(transformedBookings as unknown as Booking[])
      } catch (err) {
        console.error('Error fetching bookings:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch bookings')
        setBookings([])
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [supabase])

  if (loading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-4 text-red-500">
        Error: {error}
      </div>
    )
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
          <div className="flex flex-col gap-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between rounded-md border p-4"
              >
                <div>
                  <h3 className="font-medium">{booking.customer_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.services?.name} - {booking.duration} min
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(booking.booking_datetime), 'PPP p')}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    📞 {booking.phone_number}
                  </p>
                  
                  {booking.notes && (
                    <p className="rounded-md border p-2 text-sm text-muted-foreground">
                      {booking.notes}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-center gap-2 text-green-600">
                  <span className="text-lg font-medium">
                    ${booking.price}
                  </span>
                  <span 
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      booking.status === 'pending' 
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
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