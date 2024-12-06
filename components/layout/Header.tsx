'use client'

import { Bell, Search, LogOut } from "lucide-react"
import Image from "next/image"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

interface Profile {
  username: string
  full_name: string
  avatar_url: string | null
}

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        // Fetch profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url')
          .eq('id', user.id)
          .single()
        
        setProfile(profile)
      }
    }
    getUser()
  }, [supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search..."
            className="h-9 w-full rounded-md border bg-background pl-8 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="rounded-md p-2 hover:bg-accent">
          <Bell className="h-5 w-5" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 rounded-md p-2 hover:bg-accent"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback>
                {profile?.full_name?.[0] || user?.email?.[0].toUpperCase() || '?'}
              </AvatarFallback>
            </Avatar>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-48 rounded-md border bg-card shadow-lg">
              <div className="p-2">
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  {user?.email}
                </div>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-accent"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 