import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { Twilio } from 'twilio'

interface TwilioError extends Error {
  code: string;
  message: string;
  moreInfo?: string;
}

export async function POST(request: Request) {
  try {
    // Initialize Twilio client inside the request handler
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

    // Validate Twilio credentials
    if (!accountSid || !authToken || !twilioPhoneNumber) {
      console.error('Missing Twilio credentials:', { accountSid, authToken, twilioPhoneNumber })
      return NextResponse.json(
        { error: 'Twilio configuration missing' },
        { status: 500 }
      )
    }

    const twilioClient = new Twilio(accountSid, authToken)
    const { bookingId } = await request.json()
    
    const supabase = createRouteHandlerClient({ cookies })
    
    // Get the booking with service info
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

    // Validate phone number
    if (!booking.phone_number?.startsWith('+')) {
      console.error('Invalid phone number format:', booking.phone_number)
      return NextResponse.json(
        { error: 'Invalid phone number format. Must start with +' },
        { status: 400 }
      )
    }

    // Get the provider's profile
    const { data: providerProfile, error: profileError } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', booking.provider_id)
      .single()

    if (profileError) {
      console.error('Error fetching provider profile:', profileError)
      return NextResponse.json({ error: 'Failed to fetch provider profile' }, { status: 500 })
    }

    // Format the booking datetime
    const bookingDate = new Date(booking.booking_datetime)
    const formattedDateTime = bookingDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    })

    // Compose the SMS message
    const message = `Booking Confirmation with ${providerProfile?.full_name}

Service: ${booking.services?.name}
Date & Time: ${formattedDateTime}
Duration: ${booking.duration} minutes
Price: $${booking.price}

Please arrive 5-10 minutes before your scheduled time.`

    try {
      // Log the message and phone number for debugging
      console.log('Attempting to send SMS to:', booking.phone_number)
      console.log('Message content:', message)
      console.log('Using Twilio number:', twilioPhoneNumber)
      
      // Format phone number if needed
      let formattedPhoneNumber = booking.phone_number
      if (!formattedPhoneNumber.startsWith('+')) {
        formattedPhoneNumber = `+1${formattedPhoneNumber.replace(/\D/g, '')}`
      }
      
      // Send SMS using Twilio
      const smsResponse = await twilioClient.messages.create({
        body: message,
        to: formattedPhoneNumber,
        from: twilioPhoneNumber
      })

      console.log('SMS sent successfully:', {
        sid: smsResponse.sid,
        status: smsResponse.status,
        errorCode: smsResponse.errorCode,
        errorMessage: smsResponse.errorMessage,
        direction: smsResponse.direction,
        dateCreated: smsResponse.dateCreated
      })
      
      return NextResponse.json({ 
        success: true, 
        messageId: smsResponse.sid,
        status: smsResponse.status,
        error: smsResponse.errorMessage 
      })
    } catch (error: unknown) {
      const smsError = error as TwilioError
      console.error('Error sending SMS:', {
        error: smsError,
        code: smsError.code,
        message: smsError.message,
        moreInfo: smsError.moreInfo
      })

      // Handle specific Twilio error codes
      if (smsError.code === '21606') {
        return NextResponse.json(
          { 
            error: 'SMS Configuration Error', 
            details: {
              message: 'The system is not properly configured for SMS. Please contact support.',
              code: smsError.code,
              moreInfo: smsError.moreInfo
            }
          },
          { status: 500 }
        )
      }

      // Handle toll-free verification errors
      if (smsError.message?.includes('toll-free') || smsError.message?.includes('verification required')) {
        return NextResponse.json(
          { 
            error: 'Toll-Free Number Not Verified', 
            details: {
              message: 'The SMS service is pending verification. This is a temporary issue and will be resolved once the toll-free number is verified.',
              code: smsError.code,
              moreInfo: 'https://www.twilio.com/docs/messaging/services/toll-free-verification'
            }
          },
          { status: 503 } // Service Temporarily Unavailable
        )
      }

      return NextResponse.json(
        { 
          error: 'Failed to send SMS', 
          details: {
            message: smsError.message,
            code: smsError.code,
            moreInfo: smsError.moreInfo
          }
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: Request) {
  return NextResponse.json({}, { status: 200 })
} 