'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { UserProfileForm } from './features/UserProfileForm'

export default function SettingsPage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error
        setProfile(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [supabase])

  if (loading) {
    return <div className="flex items-center justify-center p-4">Loading...</div>
  }

  return (
    <div className="flex flex-col pr-4">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage settings for your profile
        </p>
      </div>

      <UserProfileForm initialProfile={profile} />
    </div>
  )
} 