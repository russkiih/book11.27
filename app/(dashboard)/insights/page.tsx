import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { InsightsDisplay } from './components/InsightsDisplay'
import { startOfMonth, endOfMonth } from 'date-fns'

async function getBookingMetrics() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get total bookings
  const { count: totalBookings } = await supabase
    .from('bookings')
    .select('*', { count: 'exact' })
    .eq('provider_id', user?.id)

  // Get unique customers this month
  const startDate = startOfMonth(new Date())
  const endDate = endOfMonth(new Date())
  const { data: monthlyCustomers } = await supabase
    .from('bookings')
    .select('customer_email')
    .eq('provider_id', user?.id)
    .gte('booking_datetime', startDate.toISOString())
    .lte('booking_datetime', endDate.toISOString())
  
  const uniqueCustomers = new Set(monthlyCustomers?.map(b => b.customer_email)).size

  // Get average duration
  const { data: durationData } = await supabase
    .from('bookings')
    .select('duration')
    .eq('provider_id', user?.id)
  
  const avgDuration = durationData?.length 
    ? Math.round(durationData.reduce((acc, curr) => acc + curr.duration, 0) / durationData.length)
    : 0

  // Get total revenue
  const { data: revenueData } = await supabase
    .from('bookings')
    .select('price')
    .eq('provider_id', user?.id)

  const totalRevenue = revenueData?.reduce((acc, curr) => acc + (curr.price || 0), 0) || 0

  // Get monthly booking trends
  const { data: monthlyBookings } = await supabase
    .from('bookings')
    .select('booking_datetime, price')
    .eq('provider_id', user?.id)
    .order('booking_datetime', { ascending: true })

  return {
    totalBookings,
    uniqueCustomers,
    avgDuration,
    totalRevenue,
    monthlyBookings
  }
}

export default async function InsightsPage() {
  const metrics = await getBookingMetrics()
  return <InsightsDisplay metrics={metrics} />
} 