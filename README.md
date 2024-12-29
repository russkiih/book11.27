# Booking System

A modern booking system with email and SMS notifications.

## Features

- Online booking system
- Email notifications using Resend
- SMS notifications using Twilio
- Calendar integration
- Real-time availability
- User dashboard

## Environment Variables

The following environment variables are required for the application to function properly:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Configuration (Resend)
RESEND_API_KEY=your_resend_api_key

# SMS Configuration (Twilio)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## SMS Notifications

The system uses Twilio to send SMS notifications to clients when they book an appointment. To set up SMS notifications:

1. Create a Twilio account at [twilio.com](https://www.twilio.com)
2. Get your Account SID and Auth Token from the Twilio Console
3. Purchase a phone number from Twilio
4. Add the Twilio credentials to your `.env.local` file

The SMS notification includes:
- Booking confirmation
- Service details
- Date and time
- Duration
- Price
- Reminder to arrive early

## Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

MIT
