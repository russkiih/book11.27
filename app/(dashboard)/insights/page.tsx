'use client'

import { BarChart2, Calendar, Clock, Users } from 'lucide-react'

const metrics = [
  {
    name: 'Total Bookings',
    value: '1,234',
    change: '+12.3%',
    icon: Calendar,
  },
  {
    name: 'Active Users',
    value: '567',
    change: '+5.6%',
    icon: Users,
  },
  {
    name: 'Avg. Duration',
    value: '45m',
    change: '-2.3%',
    icon: Clock,
  },
  {
    name: 'Completion Rate',
    value: '94.2%',
    change: '+1.2%',
    icon: BarChart2,
  },
]

export default function InsightsPage() {
  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Insights</h1>
        <p className="text-sm text-muted-foreground">
          Analytics and reporting for your bookings
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => {
          const Icon = metric.icon
          const isPositive = metric.change.startsWith('+')
          return (
            <div
              key={metric.name}
              className="rounded-lg border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-md bg-primary/10 p-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div
                  className={`text-sm font-medium ${
                    isPositive ? 'text-green-500' : 'text-red-500'
                  }`}
                >
                  {metric.change}
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
      <div className="mt-4 rounded-lg border bg-card p-4">
        <h2 className="mb-4 font-medium">Booking Trends</h2>
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Chart placeholder - Add your preferred charting library
        </div>
      </div>
    </div>
  )
} 