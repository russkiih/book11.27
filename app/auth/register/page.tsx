'use client'

import { UserProfileForm } from '@/components/features/UserProfileForm'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const router = useRouter()

  return (
    <div className="container max-w-2xl py-8">
      <h1 className="mb-8 text-2xl font-bold">Complete Your Profile</h1>
      <UserProfileForm 
        isRegistration={true}
        onComplete={() => router.push('/dashboard')}
      />
    </div>
  )
} 