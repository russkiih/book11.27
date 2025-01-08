'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'
import { Clock, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { BookingCalendar } from './components/BookingCalendar'
import { format } from 'date-fns'
import 'react-day-picker/dist/style.css'

const timeSlots = [
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
]

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  user_id: string
}

interface Provider {
  id: string
  email: string
  full_name?: string | null
}

interface BookingFormData {
  name: string
  email: string
  notes: string
  phone: string
}

interface BookingFormProps {
  initialServices: Service[]
  provider: Provider
  availableWeekdays: number[]
  availableHours: number[]
  hoursPerDay: Record<string, number[]>
  availability: Record<string, { enabled: boolean; timeRange: { start: string; end: string } }>
}

export default function BookingForm({
  initialServices,
  provider,
  availableWeekdays,
  availableHours,
  hoursPerDay,
  availability
}: BookingFormProps) {
  const [services] = useState<Service[]>(initialServices)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    notes: '',
    phone: ''
  })
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  // Get available time slots based on selected date
  const getTimeSlots = useCallback((date: Date) => {
    const dayOfWeek = date.getDay().toString()
    if (!availability[dayOfWeek]?.enabled) return []

    const { start, end } = availability[dayOfWeek].timeRange
    const startHour = Number.parseInt(start.split(':')[0], 10)
    const endHour = Number.parseInt(end.split(':')[0], 10)

    return Array.from(
      { length: endHour - startHour },
      (_, i) => {
        const hour = startHour + i
        return hour < 12 
          ? `${hour}:00 AM`
          : `${hour === 12 ? 12 : hour - 12}:00 PM`
      }
    )
  }, [availability])

  // Update time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      const slots = getTimeSlots(selectedDate)
      if (!slots.includes(selectedTime)) {
        setSelectedTime('')
      }
    }
  }, [selectedDate, selectedTime, getTimeSlots])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    if (name === 'phone') {
      // Remove any non-digit characters
      let phoneNumber = value.replace(/\D/g, '')
      
      // Only add +1 if it's exactly 10 digits and doesn't already have a country code
      if (phoneNumber.length === 10 && !value.includes('+')) {
        phoneNumber = `+1${phoneNumber}`
      }
      
      setFormData((prev) => ({
        ...prev,
        phone: phoneNumber
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const sendConfirmationEmail = async (bookingId: string) => {
    try {
      console.log('Attempting to send confirmation email for booking:', bookingId)
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Email API error:', data)
        throw new Error(data.error || 'Failed to send confirmation email')
      }

      console.log('Email API response:', data)
    } catch (error) {
      console.error('Email error:', error)
      // Don't throw the error, just log it
    }
  }

  const sendConfirmationSMS = async (bookingId: string) => {
    if (!bookingId) {
      console.error('No booking ID provided for SMS')
      throw new Error('No booking ID provided for SMS')
    }

    try {
      console.log('Starting SMS send process for booking:', bookingId)
      
      const requestBody = { bookingId }
      console.log('SMS request payload:', requestBody)

      const response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(requestBody),
      }).catch((fetchError: Error) => {
        console.error('Fetch failed:', fetchError)
        throw fetchError
      })

      console.log('SMS API response status:', response.status)
      const data = await response.json().catch((jsonError: Error) => {
        console.error('JSON parse failed:', jsonError)
        throw jsonError
      })
      
      console.log('SMS API complete response:', data)

      if (!response.ok) {
        const errorMessage = data.error || 'Failed to send confirmation SMS'
        console.error('SMS API error:', { status: response.status, data })
        throw new Error(errorMessage)
      }

      console.log('SMS sent successfully:', data)
      return data
    } catch (error) {
      console.error('SMS error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Please select all booking details')
      return
    }

    try {
      console.log('Form data being submitted:', formData)
      const dateTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')} ${selectedTime}`).toISOString()

      // First create the booking
      const { data: bookingData, error } = await supabase
        .from('bookings')
        .insert({
          service_id: selectedService.id,
          provider_id: provider.id,
          customer_name: formData.name,
          customer_email: formData.email,
          phone_number: formData.phone,
          booking_datetime: dateTime,
          notes: formData.notes,
          status: 'pending',
          duration: selectedService.duration,
          price: selectedService.price
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase error:', error)
        throw error
      }

      if (bookingData) {
        console.log('Booking created successfully:', bookingData)
        setBookingSuccess(true)
        
        try {
          console.log('Starting notifications process...')
          // Send email and SMS in parallel
          const [emailResult, smsResult] = await Promise.all([
            sendConfirmationEmail(bookingData.id),
            sendConfirmationSMS(bookingData.id)
          ])
          
          console.log('All notifications sent:', { emailResult, smsResult })
          toast.success('Booking submitted successfully!')
        } catch (error) {
          console.error('Notification error details:', {
            error,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          })
          toast.error('Booking created but failed to send notifications')
        }
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          notes: '',
          phone: ''
        })

        router.refresh()
      }
    } catch (error) {
      console.error('Submission error details:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      toast.error('Failed to submit booking. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Book Time with {provider.full_name}</h1>
          <p className="mt-2 text-muted-foreground">
            Select a service and time to book your appointment
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column - Service Selection */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 font-medium">Select a Service</h3>
              <div className="space-y-2">
                {services.map((service) => (
                  <button
                    key={service.id}
                    type="button"
                    onClick={() => setSelectedService(service)}
                    className={`w-full rounded-lg border p-4 text-left transition-colors ${
                      selectedService?.id === service.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:border-primary/50'
                    }`}
                  >
                    <div className="font-medium">{service.name}</div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {service.description}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <span>{service.duration} min</span>
                      <span>${service.price}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Details */}
          <div>
            <div className="space-y-4">
              {/* Booking Summary Card */}
              <div className={`rounded-lg border bg-card p-6 transition-colors ${
                bookingSuccess ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : ''
              }`}>
                <h3 className={`mb-4 font-medium ${
                  bookingSuccess ? 'text-green-700 dark:text-green-300' : ''
                }`}>
                  {bookingSuccess ? 'Booking Confirmed!' : 'Booking Summary'}
                </h3>
                {selectedService ? (
                  <div className="space-y-4">
                    <div>
                      <div className={`font-medium ${
                        bookingSuccess ? 'text-green-700 dark:text-green-300' : ''
                      }`}>
                        {selectedService.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedService.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className={`h-5 w-5 ${
                        bookingSuccess ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                      }`} />
                      <span>{selectedService.duration} min</span>
                    </div>
                    {selectedDate && selectedTime && (
                      <div className="flex items-center gap-3">
                        <Calendar className={`h-5 w-5 ${
                          bookingSuccess ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                        }`} />
                        <span>{format(selectedDate, 'PPP')} at {selectedTime}</span>
                      </div>
                    )}
                    {bookingSuccess && (
                      <div className="mt-4 rounded-md bg-green-100 p-4 dark:bg-green-900/40">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Your booking has been confirmed! We've sent you a confirmation email with the details.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setBookingSuccess(false)
                            setSelectedService(null)
                            setSelectedDate(undefined)
                            setSelectedTime('')
                          }}
                          className="mt-3 text-sm font-medium text-green-700 hover:text-green-600 dark:text-green-300 dark:hover:text-green-200 rounded-full px-4 py-2 border border-green-700 dark:border-green-300"
                        >
                          Book Another Appointment
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a service to see the summary
                  </p>
                )}
              </div>

              {/* Date/Time Selection */}
              {!bookingSuccess && selectedService && (
                <>
                  <BookingCalendar
                    selectedDate={selectedDate}
                    onSelect={setSelectedDate}
                    availableWeekdays={availableWeekdays}
                  />

                  {selectedDate && (
                    <div className="rounded-lg border bg-card p-6">
                      <h3 className="mb-4 font-medium">Select a Time</h3>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {getTimeSlots(selectedDate).map((time) => (
                          <button
                            key={time}
                            type="button"
                            onClick={() => setSelectedTime(time)}
                            className={`rounded-md border px-4 py-2 text-sm ${
                              selectedTime === time
                                ? 'border-primary bg-primary/10 text-primary'
                                : 'hover:border-primary hover:bg-primary/5'
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customer Information Form */}
                  {selectedDate && selectedTime && (
                    <div className="rounded-lg border bg-card p-6">
                      <h3 className="mb-4 font-medium">Your Information</h3>
                      <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium">
                            Name
                          </label>
                          <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium">
                            Email
                          </label>
                          <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-sm font-medium">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            required
                            placeholder="(555) 555-5555"
                            pattern="^\+?1?\d{10,}$"
                            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                            value={formData.phone}
                            onChange={handleInputChange}
                          />
                          <p className="mt-1 text-xs text-muted-foreground">
                            US phone number (10 digits)
                          </p>
                        </div>
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium">
                            Notes
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                            rows={3}
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                        >
                          Confirm Booking
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 