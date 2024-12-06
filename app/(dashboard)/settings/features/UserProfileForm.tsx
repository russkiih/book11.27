'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

interface Profile {
  username: string
  full_name: string
  avatar_url: string | null
  about: string | null
}

interface UserProfileFormProps {
  initialProfile?: Profile | null
  onComplete?: () => void
  isRegistration?: boolean
}

export function UserProfileForm({ 
  initialProfile, 
  onComplete,
  isRegistration = false 
}: UserProfileFormProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile || null)
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      setProfile(prev => prev ? { ...prev, ...updates } : null)
      toast({
        title: 'Success',
        description: updates.username 
          ? <div>
              Profile updated successfully. Your public booking page is now at:{' '}
              <Link 
                href={`/${updates.username}/book`}
                className="underline hover:text-primary"
                target="_blank"
              >
                bookingdash.com/{updates.username}
              </Link>
            </div>
          : 'Profile updated successfully',
      })

      if (onComplete) {
        onComplete()
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      })
    }
  }

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user')

      const file = event.target.files?.[0]
      if (!file) return

      if (file.size > 2 * 1024 * 1024) {
        throw new Error('File size must be less than 2MB')
      }

      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      const fileExt = file.name.split('.').pop()
      const filePath = `${user.id}/avatar.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error(uploadError.message)
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      await updateProfile({ avatar_url: publicUrl })
      
      toast({
        title: 'Success',
        description: 'Avatar uploaded successfully',
      })
    } catch (error) {
      console.error('Error uploading avatar:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to upload avatar',
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await updateProfile(profile || {})
  }

  return (
    <div className="w-full p-12 bg-card rounded-lg border shadow-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture */}
        <div className="space-y-4">
          <Label>Profile Picture</Label>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile?.avatar_url || ''} />
              <AvatarFallback>
                {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => document.getElementById('avatar-upload')?.click()}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Avatar'}
              </Button>
              {profile?.avatar_url && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => updateProfile({ avatar_url: null })}
                >
                  Remove
                </Button>
              )}
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Unique URL</Label>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">bookingdash.com/</span>
              <Input
                id="username"
                value={profile?.username || ''}
                // biome-ignore lint/style/noNonNullAssertion: <explanation>
                onChange={(e) => setProfile(prev => ({ ...prev!, username: e.target.value }))}
                className="max-w-[300px]"
                required={isRegistration}
              />
            </div>
            {profile?.username && !isRegistration && (
              <Link 
                href={`/${profile.username}/book`}
                className="inline-flex items-center gap-1 text-sm bg-gray-400 text-white px-3 py-1.5 rounded-md hover:bg-black/90"
                target="_blank"
              >
                <ExternalLink className="h-4 w-4" />
                View public booking page
              </Link>
            )}
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name">Full name or Company Name</Label>
          <Input
            id="full_name"
            value={profile?.full_name || ''}
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            onChange={(e) => setProfile(prev => ({ ...prev!, full_name: e.target.value }))}
            className="max-w-[300px]"
            required={isRegistration}
          />
        </div>

        {/* About */}
        <div className="space-y-2">
          <Label htmlFor="about">About</Label>
          <Textarea
            id="about"
            value={profile?.about || ''}
            // biome-ignore lint/style/noNonNullAssertion: <explanation>
            onChange={(e) => setProfile(prev => ({ ...prev!, about: e.target.value }))}
            className="min-h-[100px]"
          />
        </div>

        <Button type="submit">
          {isRegistration ? 'Complete Profile' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
} 