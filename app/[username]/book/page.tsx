import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import BookingForm from './BookingForm'

export default async function BookPage({ params }: { params: { username: string } }) {
  const supabase = createServerComponentClient({ cookies })
  
  // Fetch initial data
  const { data: userData, error: userError } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('username', params.username)
    .single()

  if (userError || !userData) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Provider Not Found</h1>
          <p className="mt-2 text-gray-600">The provider you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const { data: servicesData } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', userData.id)
    .order('name')

  return <BookingForm initialServices={servicesData || []} provider={userData} />
} 