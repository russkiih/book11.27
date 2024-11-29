'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Pencil, Trash2, ExternalLink, Copy } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { toast } from 'sonner'
import type { Database } from '@/types/supabase'
import Link from 'next/link'

interface Service {
  id: string
  name: string
  description: string | null
  duration: number
  price: number
  user_id: string
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0
  })
  const [username, setUsername] = useState<string | null>(null)

  const supabase = createClientComponentClient<Database>()

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setUsername(profile?.username)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }, [supabase])

  const fetchServices = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('user_id', user.id)
        .order('name')

      if (error) throw error
      setServices(data || [])
    } catch (error) {
      console.error('Error fetching services:', error)
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }, [supabase])

  useEffect(() => {
    fetchServices()
    fetchUserProfile()
  }, [fetchServices, fetchUserProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const serviceData = {
        ...formData,
        user_id: user.id
      }

      if (editingService) {
        // Update existing service
        const { error: updateError } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id)
          .eq('user_id', user.id)

        if (updateError) throw updateError
      } else {
        // Create new service
        const { error: insertError } = await supabase
          .from('services')
          .insert([serviceData])

        if (insertError) throw insertError
      }

      toast.success(editingService ? 'Service updated' : 'Service created')
      setIsModalOpen(false)
      setEditingService(null)
      setFormData({ name: '', description: '', duration: 30, price: 0 })
      fetchServices()
    } catch (error) {
      console.error('Error saving service:', error)
      toast.error('Failed to save service')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', serviceId)
        .eq('user_id', user.id)

      if (error) throw error

      toast.success('Service deleted')
      fetchServices()
    } catch (error) {
      console.error('Error deleting service:', error)
      toast.error('Failed to delete service')
    }
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      description: service.description || '',
      duration: service.duration,
      price: service.price
    })
    setIsModalOpen(true)
  }

  const handleCopy = async (service: Service) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const serviceCopy = {
        name: `${service.name} (Copy)`,
        description: service.description,
        duration: service.duration,
        price: service.price,
        user_id: user.id
      }

      const { error: insertError } = await supabase
        .from('services')
        .insert([serviceCopy])

      if (insertError) throw insertError

      toast.success('Service copied')
      fetchServices()
    } catch (error) {
      console.error('Error copying service:', error)
      toast.error('Failed to copy service')
    }
  }

  if (loading) {
    return <div className="flex justify-center py-8">Loading...</div>
  }

  return (
    <div className="flex flex-col pr-4">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-sm text-muted-foreground">
            Manage your available services
          </p>
        </div>
        <div className="flex items-center gap-4">
          {username && (
            <Link
              href={`/${username}/book`}
              target="_blank"
              className="flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90"
            >
              <ExternalLink className="h-4 w-4" />
              View Public Page
            </Link>
          )}
          <button
            type="button"
            onClick={() => {
              setEditingService(null)
              setFormData({ name: '', description: '', duration: 30, price: 0 })
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Add Service
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="grid gap-4">
        {services.map((service) => (
          <div
            key={service.id}
            className="flex items-center justify-between rounded-lg border bg-card p-4"
          >
            <div>
              <h3 className="font-medium">{service.name}</h3>
              <p className="text-sm text-muted-foreground">
                {service.description}
              </p>
              <div className="mt-1 flex gap-4 text-sm text-muted-foreground">
                <span>{service.duration} min</span>
                <span>${service.price}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopy(service)}
                className="rounded-md p-2 hover:bg-accent"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleEdit(service)}
                className="rounded-md p-2 hover:bg-accent"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(service.id)}
                className="rounded-md p-2 text-destructive hover:bg-accent"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80">
          <div className="w-full max-w-md rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-lg font-semibold">
              {editingService ? 'Edit Service' : 'Add Service'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                  rows={3}
                />
              </div>
              <div>
                <label htmlFor="duration" className="block text-sm font-medium">
                  Duration (minutes)
                </label>
                <input
                  id="duration"
                  type="number"
                  min="5"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value, 10) })}
                  className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                  required
                />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium">
                  Price ($)
                </label>
                <input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                  className="mt-1 block w-full rounded-md border bg-background px-3 py-2"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-md px-4 py-2 text-sm font-medium hover:bg-accent"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingService ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 