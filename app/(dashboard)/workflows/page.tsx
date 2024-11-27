'use client'

import { Play, Plus, Workflow } from 'lucide-react'

const workflows = [
  {
    id: 1,
    name: 'Booking Confirmation',
    description: 'Send confirmation emails and calendar invites',
    active: true,
  },
  {
    id: 2,
    name: 'Reminder Sequence',
    description: 'Send reminders before meetings',
    active: true,
  },
  {
    id: 3,
    name: 'Follow-up',
    description: 'Send follow-up emails after meetings',
    active: false,
  },
]

export default function WorkflowsPage() {
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Workflows</h1>
          <p className="text-sm text-muted-foreground">
            Automate your booking-related tasks
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Create Workflow
        </button>
      </div>
      <div className="grid gap-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-md bg-primary/10 p-2">
                <Workflow className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{workflow.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {workflow.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className={`rounded-full p-2 ${
                  workflow.active
                    ? 'bg-primary/10 text-primary'
                    : 'bg-secondary text-secondary-foreground'
                }`}
              >
                <Play className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 