'use client'

import { Calendar, Clock, User } from 'lucide-react'
import { useState } from 'react'

const timeSlots = [
  '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
]

export default function BookPage() {
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <h1 className="text-2xl font-semibold">Book an Appointment</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Left Column - Host Info */}
          <div>
            <div className="rounded-lg border bg-card p-6">
              <div className="mb-6 flex items-center gap-4">
                <div className="relative h-16 w-16 overflow-hidden rounded-full bg-primary/10">
                  <User className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 text-primary" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">John Doe</h2>
                  <p className="text-sm text-muted-foreground">30 Minute Meeting</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span>30 min</span>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <span>Mon - Fri, 9:00 AM - 5:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Booking Form */}
          <div className="space-y-6">
            <div className="rounded-lg border bg-card p-6">
              <h3 className="mb-4 font-medium">Select a Date</h3>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2"
              />
            </div>

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

            {selectedDate && selectedTime && (
              <div className="rounded-lg border bg-card p-6">
                <h3 className="mb-4 font-medium">Your Information</h3>
                <form className="space-y-4">
                  <div>
                    <label className="mb-2 block text-sm">Name</label>
                    <input
                      type="text"
                      className="w-full rounded-md border bg-background px-3 py-2"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm">Email</label>
                    <input
                      type="email"
                      className="w-full rounded-md border bg-background px-3 py-2"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm">Notes</label>
                    <textarea
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
          </div>
        </div>
      </main>
    </div>
  )
} 