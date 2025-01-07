import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import BookingForm from './BookingForm'

export default async function BookPage({ 
  params: { username } 
}: { 
  params: { username: string } 
}) {
  // Create the Supabase client with proper cookie handling
  const supabase = createServerComponentClient({
    cookies: cookies
  })
  
  try {
    // Fetch initial data
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id, email, full_name')
      .eq('username', username)
      .single()

    if (userError || !userData) {
      notFound()
    }

    // Fetch services and availability
    const [
      { data: servicesData },
      { data: weekdayData },
      { data: hoursData }
    ] = await Promise.all([
      supabase
        .from('services')
        .select('*')
        .eq('user_id', userData.id)
        .order('name'),
      supabase
        .from('weekday_availability')
        .select('weekdays, availability')
        .eq('user_id', userData.id)
        .single(),
      supabase
        .from('hours_availability')
        .select('hours, hours_per_day')
        .eq('user_id', userData.id)
        .single()
    ])

    if (!servicesData?.length) {
      return (
        <div className="container max-w-4xl mx-auto p-6">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">No Services Available</h1>
              <p className="mt-2 text-gray-600">This provider hasn't set up any services yet.</p>
            </div>
          </div>
        </div>
      )
    }

    if (!weekdayData?.weekdays?.length || !hoursData?.hours?.length) {
      return (
        <div className="container max-w-4xl mx-auto p-6">
          <div className="flex min-h-[60vh] items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900">No Availability Set</h1>
              <p className="mt-2 text-gray-600">This provider hasn't set their availability yet.</p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="container max-w-4xl mx-auto p-6">
        <BookingForm 
          initialServices={servicesData} 
          provider={userData}
          availableWeekdays={weekdayData.weekdays}
          availableHours={hoursData.hours}
          hoursPerDay={hoursData.hours_per_day}
          availability={weekdayData.availability}
        />
      </div>
    )
  } catch (error) {
    console.error('Error in BookPage:', error)
    notFound()
  }
} 