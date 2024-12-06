'use client'

import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function ViewPublicPageButton() {
  const [profile, setProfile] = useState<{ username: string } | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel>

    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Get initial profile data
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        setProfile(data)

        // Create a unique channel name using user ID
        channel = supabase
          .channel(`profile-changes-${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'profiles',
              filter: `id=eq.${user.id}`,
            },
            (payload) => {
              if (payload.eventType === 'UPDATE') {
                setProfile(payload.new as { username: string })
              }
            }
          )
          .subscribe()
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }

    fetchProfile()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [supabase])

  if (!profile?.username) return null

  return (
    <Link
      href={`/${profile.username}/book`}
      target="_blank"
      className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
    >
      <ExternalLink className="h-4 w-4" />
      View Public Page
    </Link>
  )
} 