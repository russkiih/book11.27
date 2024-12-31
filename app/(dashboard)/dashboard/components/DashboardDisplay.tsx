'use client'

import { BarChart2, Calendar, Clock, Users, DollarSign } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, startOfWeek, endOfWeek, eachWeekOfInterval, subWeeks } from 'date-fns'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'

interface Booking {
  booking_datetime: string
  price: number
}

interface Profile {
  username: string
  full_name: string | null
}

interface MetricsData {
  totalBookings: number
  uniqueCustomers: number
  avgDuration: number
  totalRevenue: number
  monthlyBookings: Booking[]
}

interface DashboardDisplayProps {
  profile: Profile
  metrics: MetricsData
}

export function DashboardDisplay({ profile, metrics }: DashboardDisplayProps) {
  const router = useRouter()
  
  const metricsDisplay = [
    {
      name: 'Total Bookings',
      value: metrics.totalBookings?.toString() || '0',
      icon: Calendar,
      description: 'All time bookings'
    },
    {
      name: 'Monthly Customers',
      value: metrics.uniqueCustomers?.toString() || '0',
      icon: Users,
      description: 'Unique customers this month'
    },
    {
      name: 'Avg. Duration',
      value: `${metrics.avgDuration}m`,
      icon: Clock,
      description: 'Average appointment length'
    },
    {
      name: 'Total Revenue',
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: 'Total earnings'
    },
  ]

  // Prepare data for the trends chart - last 12 weeks
  const last12Weeks = eachWeekOfInterval({
    start: subWeeks(new Date(), 11),
    end: new Date(),
  })

  const weeklyData = last12Weeks.map(week => {
    const weekStart = startOfWeek(week, { weekStartsOn: 1 }) // Start on Monday
    const weekEnd = endOfWeek(week, { weekStartsOn: 1 })
    
    const weekBookings = metrics.monthlyBookings?.filter(booking => {
      const bookingDate = new Date(booking.booking_datetime)
      return bookingDate >= weekStart && bookingDate <= weekEnd
    })

    return {
      week: `Week of ${format(weekStart, 'MMM d')}`,
      bookings: weekBookings?.length || 0,
      revenue: weekBookings?.reduce((sum, booking) => sum + (booking.price || 0), 0) || 0,
    }
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="mb-8 text-3xl font-bold">
        Welcome{profile?.full_name ? `, ${profile.full_name}` : ' back'}!
      </h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricsDisplay.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.name} className="p-6">
              <div className="flex items-center justify-between">
                <div className="rounded-md bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-3">
                <h3 className="text-sm font-medium text-muted-foreground">
                  {metric.name}
                </h3>
                <p className="text-2xl font-semibold">{metric.value}</p>
                <p className="mt-1 text-sm text-gray-500">{metric.description}</p>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Booking Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="week"
                  tick={{ fontSize: 12 }}
                  interval={1}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stackId="1"
                  stroke="#8884d8"
                  fill="#8884d8"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-medium">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              type="button"
              onClick={() => router.push('/availability')}
              className="w-full rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
            >
              Set Availability
            </button>
            <button 
              type="button"
              onClick={() => router.push('/settings')}
              className="w-full rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
            >
              Update Profile
            </button>
          </div>
        </Card>
      </div>
    </div>
  )
} 