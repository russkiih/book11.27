'use client'

import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function ViewPublicPageButton() {
  const [username, setUsername] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .single()

        setUsername(profile?.username)
      } catch (error) {
        console.error('Error fetching username:', error)
      }
    }

    fetchUsername()
  }, [supabase])

  if (!username) return null

  return (
    <Link
      href={`/${username}/book`}
      target="_blank"
      className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
    >
      <ExternalLink className="h-4 w-4" />
      View Public Page
    </Link>
  )
} 