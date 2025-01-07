import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BarChart2, Calendar, Users, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Streamline Your
              <span className="text-purple-600"> Beauty Business</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              The all-in-one platform for beauty professionals to manage bookings, 
              clients, and grow their business.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Calendar className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Online Booking</h3>
              <p className="text-gray-600">
                24/7 appointment scheduling through your personalized booking page
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Client Management</h3>
              <p className="text-gray-600">
                Centralized client history, preferences, and appointment tracking
              </p>
            </Card>
            
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <BarChart2 className="h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Business Analytics</h3>
              <p className="text-gray-600">
                Data-driven insights to help your business grow and succeed
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}