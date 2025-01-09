import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { BarChart2, Calendar, Users, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-70" />
        <div className="absolute inset-0">
          <div className="h-full w-full" style={{
            backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <div className="text-center">
            <h1 className="text-6xl sm:text-7xl font-bold text-gray-900 mb-8 tracking-tight">
              Streamline Your
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
                Beauty Business
              </div>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              The all-in-one platform for beauty professionals to manage bookings, 
              clients, and grow their business.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg h-12 px-8">
                  Start your project <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50">
              <Calendar className="h-12 w-12 text-purple-600 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Online Booking</h3>
              <p className="text-gray-600 leading-relaxed">
                24/7 appointment scheduling through your personalized booking page
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-blue-50">
              <Users className="h-12 w-12 text-blue-600 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Client Management</h3>
              <p className="text-gray-600 leading-relaxed">
                Centralized client history, preferences, and appointment tracking
              </p>
            </Card>
            
            <Card className="p-8 hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-purple-50">
              <BarChart2 className="h-12 w-12 text-purple-600 mb-6" />
              <h3 className="text-xl font-semibold mb-3">Business Analytics</h3>
              <p className="text-gray-600 leading-relaxed">
                Data-driven insights to help your business grow and succeed
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}