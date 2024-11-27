'use client'

import { Bell } from "lucide-react"
import { useState } from "react"

export function NotificationPrompt() {
  const [isVisible, setIsVisible] = useState(true)

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setIsVisible(false)
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error)
    }
  }

  if (!isVisible) return null

  return (
    <div className="mb-4 flex items-center justify-between rounded-lg bg-accent p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-background p-2">
          <Bell className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-medium">Enable browser notifications</h4>
          <p className="text-sm text-muted-foreground">
            Get notified about new bookings and updates
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={requestPermission}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Allow
        </button>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="rounded-md px-4 py-2 text-sm font-medium hover:bg-accent-foreground/10"
        >
          Dismiss
        </button>
      </div>
    </div>
  )
} 