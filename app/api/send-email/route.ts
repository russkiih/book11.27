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
    
    console.log('Processing booking ID:', bookingId)
    console.log(`Using Resend API Key: ${process.env.RESEND_API_KEY?.substring(0, 8)}...`)
    
    // First get the booking with service info
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        services(name)
      `)
      .eq('id', bookingId)
      .single()

    if (bookingError) {
      console.error('Error fetching booking:', bookingError)
      return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
    }

    if (!booking) {
      console.error('No booking found for ID:', bookingId)
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Then get the provider's profile
    const { data: providerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', booking.provider_id)
      .single()

    if (profileError) {
      console.error('Error fetching provider profile:', profileError)
    }

    console.log('Booking data:', JSON.stringify(booking, null, 2))
    console.log('Provider profile:', JSON.stringify(providerProfile, null, 2))

    try {
      console.log('Attempting to send email to:', booking.customer_email)
      
      const emailData = {
        from: 'Booking Confirmation <bookings@resend.dev>',
        to: booking.customer_email,
        subject: 'Booking Confirmation',
        react: BookingConfirmationEmail({
          customerName: booking.customer_name,
          serviceName: booking.services?.name || 'Service',
          datetime: booking.booking_datetime,
          duration: booking.duration,
          price: booking.price,
          providerName: providerProfile?.full_name || 'Our Team',
        }),
      }
      
      console.log('Email payload:', JSON.stringify(emailData, null, 2))

      const emailResponse = await resend.emails.send(emailData)

      console.log('Email sent successfully:', emailResponse)
      return NextResponse.json({ success: true, response: emailResponse })
    } catch (emailError) {
      console.error('Error sending email:', {
        error: emailError,
        message: emailError instanceof Error ? emailError.message : 'Unknown error',
        name: emailError instanceof Error ? emailError.name : 'Unknown error type',
        stack: emailError instanceof Error ? emailError.stack : undefined
      })
      return NextResponse.json(
        { error: 'Failed to send email', details: emailError },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Unexpected error:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown error type',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { status: 200 })
} 