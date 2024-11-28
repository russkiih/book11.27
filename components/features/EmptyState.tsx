'use client'

import { Calendar } from "lucide-react"
import Link from "next/link"

export function EmptyState() {
  return (
    <div className="flex h-[calc(100vh-120px)] items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h3 className="mb-2 text-lg font-semibold">No bookings yet</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Share your booking page with potential clients to receive bookings.
        </p>
        <div className="flex justify-center gap-2">
          <Link
            href="/book"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            View public page
          </Link>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(`${window.location.origin}/book`)}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Copy link
          </button>
        </div>
      </div>
    </div>
  )
} 