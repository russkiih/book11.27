'use client'

import { cn } from "@/lib/utils"
import { Filter } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const tabs = [
  { name: 'Upcoming', href: '/bookings/upcoming' },
  { name: 'Past', href: '/bookings/past' },
  { name: 'Canceled', href: '/bookings/canceled' },
]

export function TabNavigation() {
  const pathname = usePathname()

  return (
    <div className="flex h-12 items-center justify-between border-b px-4">
      <nav className="flex space-x-4">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={cn(
              "px-3 py-2 text-sm font-medium",
              pathname === tab.href
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  )
} 