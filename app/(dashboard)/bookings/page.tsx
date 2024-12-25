'use client'

import * as React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { TabNavigation } from '@/components/layout/TabNavigation'
import { NotificationPrompt } from '@/components/features/NotificationPrompt'
import { EmptyState } from '@/components/features/EmptyState'
import { format, parseISO, isPast, formatDistanceToNow } from 'date-fns'
import { Filter, ArrowUpDown, Clock } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

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

type SortOption = {
  label: string
  value: string
  sortFn: (a: Booking, b: Booking) => number
}

const sortOptions: SortOption[] = [
  {
    label: 'Date (Closest)',
    value: 'date-closest',
    sortFn: (a, b) => parseISO(a.booking_datetime).getTime() - parseISO(b.booking_datetime).getTime()
  },
  {
    label: 'Date (Furthest)',
    value: 'date-furthest',
    sortFn: (a, b) => parseISO(b.booking_datetime).getTime() - parseISO(a.booking_datetime).getTime()
  },
  {
    label: 'Price (High to Low)',
    value: 'price-desc',
    sortFn: (a, b) => b.price - a.price
  },
  {
    label: 'Price (Low to High)',
    value: 'price-asc',
    sortFn: (a, b) => a.price - b.price
  }
]

type TabType = 'upcoming' | 'past' | 'canceled'

export default function BookingsPage() {
  const [bookings, setBookings] = React.useState<Booking[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [showSortDropdown, setShowSortDropdown] = React.useState(false)
  const [selectedSort, setSelectedSort] = React.useState<SortOption>(sortOptions[0])
  const pathname = usePathname()
  const router = useRouter()
  const currentTab = pathname.split('/').pop() as TabType || 'upcoming'
  const supabase = createClientComponentClient()

  React.useEffect(() => {
    if (pathname === '/bookings') {
      router.push('/bookings/upcoming')
    }
  }, [pathname, router])

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

  const filteredBookings = React.useMemo(() => {
    const now = new Date()
    const sorted = [...bookings].sort(selectedSort.sortFn)
    
    switch (currentTab) {
      case 'upcoming':
        return sorted.filter(booking => 
          !isPast(parseISO(booking.booking_datetime)) && 
          booking.status !== 'cancelled'
        )
      case 'past':
        return sorted.filter(booking => 
          isPast(parseISO(booking.booking_datetime)) && 
          booking.status !== 'cancelled'
        )
      case 'canceled':
        return sorted.filter(booking => booking.status === 'cancelled')
      default:
        return sorted
    }
  }, [bookings, selectedSort, currentTab])

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

  const renderBookingList = (bookings: Booking[]) => (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => {
        const bookingDate = parseISO(booking.booking_datetime)
        const isPastBooking = isPast(bookingDate)
        
        return (
          <div
            key={booking.id}
            className={`flex items-center justify-between rounded-md border p-4 ${
              isPastBooking ? 'bg-muted/30' : ''
            }`}
          >
            <div>
              <h3 className="font-medium">{booking.customer_name}</h3>
              <p className="text-sm text-muted-foreground">
                {booking.services?.name} - {booking.duration} min
              </p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{format(bookingDate, 'PPP p')}</span>
                {isPastBooking && (
                  <span className="text-xs text-muted-foreground">
                    ({formatDistanceToNow(bookingDate, { addSuffix: true })})
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                📞 {booking.phone_number}
              </p>
              
              {booking.notes && (
                <p className="mt-2 rounded-md border p-2 text-sm text-muted-foreground">
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
        )
      })}
    </div>
  )

  const getTabTitle = () => {
    switch (currentTab) {
      case 'upcoming':
        return 'Upcoming Appointments'
      case 'past':
        return 'Past Appointments'
      case 'canceled':
        return 'Canceled Appointments'
      default:
        return 'Appointments'
    }
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
      <div className="mt-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold">{getTabTitle()}</h2>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowSortDropdown(!showSortDropdown)}
            className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <ArrowUpDown className="h-4 w-4" />
            {selectedSort.label}
          </button>
          {showSortDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border bg-card shadow-lg">
              <div className="p-1">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setSelectedSort(option)
                      setShowSortDropdown(false)
                    }}
                    className={`flex w-full items-center px-3 py-2 text-sm hover:bg-accent ${
                      selectedSort.value === option.value ? 'bg-accent' : ''
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        {filteredBookings.length === 0 ? (
          <EmptyState />
        ) : (
          renderBookingList(filteredBookings)
        )}
      </div>
    </div>
  )
} 