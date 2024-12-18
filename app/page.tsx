import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Grow Your Beauty Business
              <span className="text-purple-600 block">Effortlessly</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              Streamline your bookings, manage clients, and expand your beauty business 
              with our all-in-one platform designed for beauty professionals.
            </p>
            <div className="flex justify-center">
              <Link href="/login">
                <Button size="lg" variant="default">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              title="Online Booking"
              description="Let clients book appointments 24/7 through your personalized booking page"
              icon="📅"
            />
            <FeatureCard 
              title="Client Management"
              description="Keep track of client history, preferences, and appointments in one place"
              icon="👥"
            />
            <FeatureCard 
              title="Business Growth"
              description="Analytics and insights to help you make data-driven decisions"
              icon="📈"
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Beauty Business?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join thousands of beauty professionals who are growing their business with us.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Get Started Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ title, description, icon }: { 
  title: string
  description: string
  icon: string 
}) {
  return (
    <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}