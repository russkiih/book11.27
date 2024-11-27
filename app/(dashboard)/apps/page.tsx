'use client'

import { Calendar, Mail, Slack, Video } from 'lucide-react'
import Image from 'next/image'

const apps = [
  {
    id: 1,
    name: 'Google Calendar',
    description: 'Sync your events with Google Calendar',
    icon: Calendar,
    installed: true,
  },
  {
    id: 2,
    name: 'Zoom',
    description: 'Create video meetings automatically',
    icon: Video,
    installed: true,
  },
  {
    id: 3,
    name: 'Slack',
    description: 'Get notifications in your Slack channels',
    icon: Slack,
    installed: false,
  },
  {
    id: 4,
    name: 'Email',
    description: 'Send automated email notifications',
    icon: Mail,
    installed: true,
  },
]

export default function AppsPage() {
  return (
    <div className="flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Apps</h1>
        <p className="text-sm text-muted-foreground">
          Connect and manage your integrations
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {apps.map((app) => {
          const Icon = app.icon
          return (
            <div
              key={app.id}
              className="flex flex-col rounded-lg border bg-card p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">{app.name}</h3>
                </div>
                <button
                  type="button"
                  className={`rounded-md px-3 py-1 text-sm font-medium ${
                    app.installed
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {app.installed ? 'Configure' : 'Install'}
                </button>
              </div>
              <p className="text-sm text-muted-foreground">{app.description}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
} 