'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { Plus, Copy, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'
import { ServiceForm, ServiceFormData } from '../../../components/features/service-form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Service {
  id: string
  name: string
  duration: number
  price: number
  description: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [isNewServiceModalOpen, setIsNewServiceModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  // Fetch services from Supabase
  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name')

      if (error) {
        throw error
      }

      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopyService = async (service: Service) => {
    try {
      const newService = {
        name: `${service.name} (Copy)`,
        duration: service.duration,
        price: service.price,
        description: service.description
      }

      const { data, error } = await supabase
        .from('services')
        .insert([newService])
        .select()
        .single()

      if (error) throw error

      setServices([...services, data])
    } catch (error) {
      console.error('Error copying service:', error)
    }
  }

  const handleDeleteService = async (id: string) => {
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id)

      if (error) throw error

      setServices(services.filter(service => service.id !== id))
    } catch (error) {
      console.error('Error deleting service:', error)
    }
  }

  const handleCreateService = async (data: ServiceFormData) => {
    try {
      const { data: newService, error } = await supabase
        .from('services')
        .insert([data])
        .select()
        .single()

      if (error) throw error

      setServices([...services, newService])
      setIsNewServiceModalOpen(false)
    } catch (error) {
      console.error('Error creating service:', error)
    }
  }

  const handleEditService = async (data: ServiceFormData) => {
    if (!selectedService) return

    try {
      const { data: updatedService, error } = await supabase
        .from('services')
        .update(data)
        .eq('id', selectedService.id)
        .select()
        .single()

      if (error) throw error

      setServices(services.map(service => 
        service.id === selectedService.id ? updatedService : service
      ))
      setIsEditModalOpen(false)
      setSelectedService(null)
    } catch (error) {
      console.error('Error updating service:', error)
    }
  }

  const openEditModal = (service: Service) => {
    setSelectedService(service)
    setIsEditModalOpen(true)
  }

  const openDeleteDialog = (service: Service) => {
    setSelectedService(service)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selectedService) return
    await handleDeleteService(selectedService.id)
    setIsDeleteDialogOpen(false)
    setSelectedService(null)
  }

  if (loading) {
    return <div className="flex justify-center py-8">Loading...</div>
  }

  return (
    <div className="flex flex-col">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-sm text-muted-foreground">
            Manage the services you offer to your customers
          </p>
        </div>
        <Button onClick={() => setIsNewServiceModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Service
        </Button>
      </div>

      <div className="rounded-lg border bg-card">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="py-3 pl-4 text-left text-sm font-medium">Name</th>
              <th className="py-3 text-left text-sm font-medium">Duration</th>
              <th className="py-3 text-left text-sm font-medium">Price</th>
              <th className="py-3 pr-4 text-right text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b last:border-0">
                <td className="py-3 pl-4">
                  <div>
                    <div className="font-medium">{service.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {service.description}
                    </div>
                  </div>
                </td>
                <td className="py-3">{service.duration} min</td>
                <td className="py-3">
                  {service.price === 0 ? 'Free' : `$${service.price}`}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyService(service)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditModal(service)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openDeleteDialog(service)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <h3 className="mt-2 text-sm font-semibold">No services</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new service.
              </p>
              <Button className="mt-4" href="/services/new">
                <Plus className="mr-2 h-4 w-4" />
                New Service
              </Button>
            </div>
          </div>
        )}
      </div>

      <ServiceForm
        isOpen={isNewServiceModalOpen}
        onClose={() => setIsNewServiceModalOpen(false)}
        onSubmit={handleCreateService}
        title="Create New Service"
      />

      <ServiceForm
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedService(null)
        }}
        onSubmit={handleEditService}
        initialData={selectedService || undefined}
        title="Edit Service"
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the service
              "{selectedService?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedService(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
} 