'use client'

import { Bell, Search, User } from "lucide-react"
import Image from "next/image"

export function Header() {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4">
      <div className="flex items-center gap-4">
        <div className="relative h-8 w-8 overflow-hidden rounded-full">
          <Image
            src="https://picsum.photos/32/32"
            alt="Profile"
            fill
            className="object-cover"
          />
        </div>
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
        <button type="button" className="rounded-md p-2 hover:bg-accent">
          <User className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
} 