import { ServiceForm } from "@/components/service-form"

export default function NewServicePage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Add New Service</h1>
      <div className="max-w-2xl">
        <ServiceForm />
      </div>
    </div>
  )
} 