'use client'

import { UserPlus } from 'lucide-react'
import Image from 'next/image'

const teamMembers = [
  { id: 1, name: 'John Doe', role: 'Admin', image: 'https://picsum.photos/seed/1/64/64' },
  { id: 2, name: 'Jane Smith', role: 'Member', image: 'https://picsum.photos/seed/2/64/64' },
  { id: 3, name: 'Mike Johnson', role: 'Member', image: 'https://picsum.photos/seed/3/64/64' },
]

export default function TeamsPage() {
  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Teams</h1>
          <p className="text-sm text-muted-foreground">
            Manage your team members and their roles
          </p>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" />
          Add Member
        </button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-4 rounded-lg border bg-card p-4"
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full">
              <Image
                src={member.image}
                alt={member.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{member.name}</h3>
              <p className="text-sm text-muted-foreground">{member.role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 