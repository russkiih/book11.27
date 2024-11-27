import type { Metadata } from "next"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { Plus } from "lucide-react"

export const metadata: Metadata = {
  title: "Services Management",
  description: "Manage your salon services",
}

async function getServices() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('name')
  return services || []
}

export default async function ServicesManagementPage() {
  const services = await getServices()

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Services Management</h1>
        <Button asChild>
          <Link href="/services/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.description}</TableCell>
                <TableCell>{service.duration} min</TableCell>
                <TableCell>${service.price}</TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" asChild className="mr-2">
                    <Link href={`/services/${service.id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <Button variant="destructive" asChild>
                    <Link href={`/services/${service.id}/delete`}>
                      Delete
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 