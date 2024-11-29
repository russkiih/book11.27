'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Database } from '@/types/supabase'
import type { AuthError } from '@supabase/supabase-js'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSuccessMessage(null)

    try {
      if (isSignUp) {
        // First check if username is available
        const { data: existingUser, error: usernameError } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username.toLowerCase())
          .single()

        if (existingUser) {
          throw new Error('Username already taken')
        }

        // Sign up the user
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              username: username.toLowerCase()
            }
          }
        })

        if (signUpError) throw signUpError
        if (!data.user) throw new Error('No user data returned')

        // Profile will be created automatically by the database trigger
        setSuccessMessage('Please check your email for confirmation link')
        return

      // biome-ignore lint/style/noUselessElse: <explanation>
      } else {
        // Regular sign in
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        router.push('/bookings')
        router.refresh()
      }
    } catch (error) {
      console.error('Auth error:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else if ((error as AuthError).message) {
        setError((error as AuthError).message)
      } else {
        setError('An unexpected error occurred')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-lg border bg-card p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{isSignUp ? 'Create Account' : 'Sign In'}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignUp
              ? 'Create an account to get started'
              : 'Welcome back! Please sign in to continue.'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="mt-8 space-y-6">
          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-300">
              {successMessage}
            </div>
          )}
          
          <div className="space-y-4">
            {isSignUp && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required={isSignUp}
                  className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="your-username"
                  pattern="[a-zA-Z0-9\-]+"
                  title="Username can only contain letters, numbers, and hyphens"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="••••••••"
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
                setSuccessMessage(null)
              }}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 