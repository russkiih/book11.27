'use client'

import * as React from 'react'
import { Calendar, Clock } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Toaster } from 'sonner'

// Add timeSlots array at the top level
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
  duration: number
  price: number
  description: string
}

interface BookingFormData {
  name: string
  email: string
  notes: string
}

export default function BookPage() {
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [formData, setFormData] = useState<BookingFormData>({
    name: '',
    email: '',
    notes: ''
  })

  // Fetch services from Supabase
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('*')
          .order('name')

        if (error) {
          throw error
        }

        setServices(data || [])
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedService || !selectedDate || !selectedTime) {
      toast.error('Please select all booking details')
      return
    }

    try {
      const { error } = await supabase.from('bookings').insert({
        service_id: selectedService.id,
        customer_name: formData.name,
        customer_email: formData.email,
        booking_date: selectedDate,
        booking_time: selectedTime,
        notes: formData.notes,
        status: 'pending'
      })

      if (error) throw error

      toast.success('Booking submitted successfully!')
      // Reset form
      setSelectedService(null)
      setSelectedDate('')
      setSelectedTime('')
      setFormData({
        name: '',
        email: '',
        notes: ''
      })
    } catch (error) {
      console.error('Error submitting booking:', error)
      toast.error('Failed to submit booking. Please try again.')
    }
  }

  if (loading) {
    return <div className="flex justify-center py-8">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-center" />
      
      <header className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="text-2xl font-semibold">Book an Appointment</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column - Service Selection */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 font-medium">Select a Service</h3>
              <div className="space-y-2">
                {services.map((service) => (
                  <button
                    key={service.id}
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
                      <span>{service.price === 0 ? 'Free' : `$${service.price}`}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            
          </div>

          {/* Right Column - Booking Summary */}
          <div>
            <div className="space-y-2">
              {/* Booking Summary Card */}
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 font-medium">Booking Summary</h3>
                {selectedService ? (
                  <div className="space-y-4">
                    <div>
                      <div className="font-medium">{selectedService.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedService.description}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <span>{selectedService.duration} min</span>
                    </div>
                    {selectedDate && selectedTime && (
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <span>{selectedDate} at {selectedTime}</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Select a service to see the summary
                  </p>
                )}
              </div>

              {/* Date/Time/Form Section */}
              {selectedService && (
                <>
                  {/* Date Selection */}
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="mb-4 font-medium">Select a Date</h3>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full rounded-md border bg-background px-3 py-2"
                    />
                  </div>

                  {/* Time Selection */}
                  {selectedDate && (
                    <div className="rounded-lg border bg-card p-6">
                      <h3 className="mb-4 font-medium">Select a Time</h3>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                        {timeSlots.map((time) => (
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

                  {/* Information Form */}
                  {selectedDate && selectedTime && (
                    <div className="rounded-lg border bg-card p-6">
                      <h3 className="mb-4 font-medium">Your Information</h3>
                      <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                          <label className="mb-2 block text-sm">Name</label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full rounded-md border bg-background px-3 py-2"
                            placeholder="John Smith"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm">Email</label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full rounded-md border bg-background px-3 py-2"
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                        <div>
                          <label className="mb-2 block text-sm">Notes</label>
                          <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            className="w-full rounded-md border bg-background px-3 py-2"
                            rows={3}
                            placeholder="Add any additional notes..."
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
      </main>
    </div>
  )
} 