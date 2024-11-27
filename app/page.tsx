import { Metadata } from "next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Clock, DollarSign } from "lucide-react"

export const metadata: Metadata = {
  title: "Hair Salon Services",
  description: "Book your next hair appointment",
}

async function getServices() {
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('name')
  return services || []
}

export default async function ServicesPage() {
  const services = await getServices()

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8">Book an Appointment</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{service.duration} min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4" />
                    <span>${service.price}</span>
                  </div>
                </div>
                <Button className="w-full mt-4">Book Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4">Select a Date</h2>
          {/* Calendar component will be added here */}
        </div>
      </div>
    </div>
  )
}
