'use client'

import { BarChart2, Calendar, Clock, Users, DollarSign } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { format, startOfWeek, endOfWeek, eachWeekOfInterval, subWeeks } from 'date-fns'

interface Booking {
  booking_datetime: string
  price: number
}

interface MetricsData {
  totalBookings: number
  uniqueCustomers: number
  avgDuration: number
  totalRevenue: number
  monthlyBookings: Booking[]
}

interface InsightsDisplayProps {
  metrics: MetricsData
}

export function InsightsDisplay({ metrics }: InsightsDisplayProps) {
  const metricsDisplay = [
    {
      name: 'Total Bookings',
      value: metrics.totalBookings?.toString() || '0',
      icon: Calendar,
    },
    {
      name: 'Monthly Customers',
      value: metrics.uniqueCustomers?.toString() || '0',
      icon: Users,
    },
    {
      name: 'Avg. Duration',
      value: `${metrics.avgDuration}m`,
      icon: Clock,
    },
    {
      name: 'Total Revenue',
      value: `$${metrics.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
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
    <div className="flex flex-col pr-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Analytics and reporting for your bookings
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricsDisplay.map((metric) => {
          const Icon = metric.icon
          return (
            <div
              key={metric.name}
              className="rounded-lg border bg-card p-4"
            >
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
              </div>
            </div>
          )
        })}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-4 font-medium">Weekly Bookings</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="week"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#2563eb" 
                  fill="#3b82f6" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <h2 className="mb-4 font-medium">Weekly Revenue</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="week"
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#16a34a" 
                  fill="#22c55e" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
} 