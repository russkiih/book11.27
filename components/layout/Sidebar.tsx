'use client'

import { cn } from "@/lib/utils"
import {
  Calendar,
  Users,
  Clock,
  Layout,
  FileText,
  Workflow,
  BarChart2,
  Settings,
  Scissors,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ViewPublicPageButton } from './ViewPublicPageButton'

const navigation = [
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Services', href: '/services', icon: Scissors },
  { name: 'Availability', href: '/availability', icon: Clock },
  { name: 'Teams', href: '/teams', icon: Users },
  { name: 'Apps', href: '/apps', icon: Settings },
  { name: 'Routing Forms', href: '/routing-forms', icon: FileText },
  { name: 'Workflows', href: '/workflows', icon: Workflow },
  { name: 'Insights', href: '/insights', icon: BarChart2 },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <span className="text-lg font-semibold">Event Dashboard</span>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-x-3 rounded-md px-3 py-2 text-sm font-medium",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-primary/5"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="mt-auto p-4 border-t">
        <ViewPublicPageButton />
      </div>
    </div>
  )
} 