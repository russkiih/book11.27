import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import BookingConfirmationEmail from '@/app/emails/booking-confirmation'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { bookingId } = await request.json()
    
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: booking } = await supabase
      .from('bookings')
      .select('*, services(name)')
      .eq('id', bookingId)
      .single()

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    await resend.emails.send({
      from: 'Booking Confirmation <bookings@resend.dev>',
      to: booking.customer_email,
      subject: 'Booking Confirmation',
      react: BookingConfirmationEmail({
        customerName: booking.customer_name,
        serviceName: booking.services?.name || 'Service',
        datetime: booking.booking_datetime,
        duration: booking.duration,
        price: booking.price,
        providerName: booking.profiles?.full_name || 'Our Team',
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Email error:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

// Add CORS headers
export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { status: 200 })
} 