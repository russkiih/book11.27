'use client'

import { FileText, Plus } from 'lucide-react'

const forms = [
  {
    id: 1,
    name: 'Customer Intake Form',
    description: 'Initial consultation routing form',
    responses: 24,
  },
  {
    id: 2,
    name: 'Meeting Type Selector',
    description: 'Route to appropriate meeting type',
    responses: 156,
  },
]

export default function RoutingFormsPage() {
  return (
    <div className="flex flex-col pr-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Routing Forms</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your booking form workflows
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          New Form
        </button>
      </div>
      <div className="grid gap-4">
        {forms.map((form) => (
          <div
            key={form.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-md bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{form.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {form.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                {form.responses} responses
              </div>
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