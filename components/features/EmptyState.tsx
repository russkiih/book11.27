'use client'

import { Calendar, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/supabase'

export function EmptyState() {
  const [username, setUsername] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setUsername(profile?.username)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
    }

    fetchUserProfile()
  }, [supabase])

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
          {username && (
            <Link
              href={`/${username}/book`}
              target="_blank"
              className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
            >
              <ExternalLink className="h-4 w-4" />
              View Public Page
            </Link>
          )}
          <button
            type="button"
            onClick={() => username && navigator.clipboard.writeText(`${window.location.origin}/${username}/book`)}
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Copy link
          </button>
        </div>
      </div>
    </div>
  )
} 