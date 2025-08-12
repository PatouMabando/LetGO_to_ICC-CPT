import React from 'react';
import { Car, Users, MapPin, Clock, Shield, CheckCircle } from 'lucide-react';

interface HomePageProps {
  onViewChange: (view: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onViewChange }) => {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'ICC Member-Only Service',
      description: 'Exclusive transport service for verified ICC members in Cape Town only.',
    },
    {
      icon: <MapPin className="h-8 w-8 text-green-600" />,
      title: 'Cape Town Area Coverage',
      description: 'Select drivers based on your Cape Town location for faster pickup times.',
    },
    {
      icon: <Clock className="h-8 w-8 text-orange-600" />,
      title: 'Real-Time Tracking',
      description: 'Track your driver\'s progress from booking to arrival at ICC.',
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      title: 'Secure & Reliable',
      description: 'Professional Cape Town drivers with verified credentials and insurance.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Verify ICC Membership',
      description: 'Enter your name and contact details to verify your ICC membership status.',
    },
    {
      number: '2',
      title: 'Select Cape Town Driver',
      description: 'Choose from available drivers in your Cape Town area.',
    },
    {
      number: '3',
      title: 'Track Progress',
      description: 'Monitor your driver\'s real-time status and location in Cape Town.',
    },
    {
      number: '4',
      title: 'Arrive at ICC',
      description: 'Arrive safely at the Cape Town International Convention Centre.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Welcome to LetGO to ICC
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-4 max-w-3xl mx-auto">
              Premium transport service exclusively for ICC members in Cape Town.
            </p>
            <p className="text-lg text-blue-200 mb-8 max-w-2xl mx-auto">
              Safe, reliable transport to ICC with real-time tracking.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onViewChange('booking')}
                className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
              >
                Book Transport to ICC
              </button>
              <button
                onClick={() => onViewChange('track')}
                className="bg-blue-700 text-white hover:bg-blue-800 px-8 py-4 rounded-lg font-semibold text-lg transition-colors border-2 border-blue-500"
              >
                Track Your Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose LetGO to ICC in Cape Town?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience premium transport service designed specifically for ICC members in Cape Town.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works in Cape Town
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, secure, and straightforward transport booking process for Cape Town ICC members.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cape Town Areas Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cape Town Areas We Cover
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Professional drivers available across all major Cape Town areas.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              'City Centre & Gardens',
              'Sea Point & Green Point',
              'Camps Bay & Clifton',
              'Wynberg & Claremont',
              'Goodwood & Parow',
              'Bo-Kaap & Woodstock',
              'Bellville & Durbanville',
              'Mitchell\'s Plain & Khayelitsha'
            ].map((area, index) => (
              <div key={index} className="bg-blue-50 p-4 rounded-lg text-center">
                <MapPin className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">{area}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Book Your Transport to ICC?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of satisfied ICC members in Cape Town who trust us for their transportation needs to ICC.
          </p>
          <button
            onClick={() => onViewChange('booking')}
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 rounded-lg font-semibold text-lg transition-colors shadow-lg"
          >
            Start Booking Process
          </button>
        </div>
      </div>
    </div>
  );
};