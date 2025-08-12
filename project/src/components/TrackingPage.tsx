import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, Car, Navigation, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';

interface TrackingPageProps {
  onViewChange: (view: string) => void;
}

export const TrackingPage: React.FC<TrackingPageProps> = ({ onViewChange }) => {
  const { bookings, setBookings } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (searchTerm) {
      const filtered = bookings.filter(
        booking =>
          booking.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.memberContact.includes(searchTerm) ||
          booking.id.includes(searchTerm)
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookings);
    }
  }, [searchTerm, bookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'on-the-way': return 'bg-orange-100 text-orange-800';
      case 'arrived': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5" />;
      case 'accepted': return <CheckCircle className="h-5 w-5" />;
      case 'on-the-way': return <Navigation className="h-5 w-5" />;
      case 'arrived': return <MapPin className="h-5 w-5" />;
      case 'completed': return <CheckCircle className="h-5 w-5" />;
      case 'cancelled': return <XCircle className="h-5 w-5" />;
      default: return <AlertCircle className="h-5 w-5" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-ZA', {
      timeZone: 'Africa/Johannesburg',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const simulateStatusUpdate = (bookingId: string) => {
    const updatedBookings = bookings.map(booking => {
      if (booking.id === bookingId) {
        let newStatus = booking.status;
        switch (booking.status) {
          case 'pending':
            newStatus = 'accepted';
            break;
          case 'accepted':
            newStatus = 'on-the-way';
            break;
          case 'on-the-way':
            newStatus = 'arrived';
            break;
          case 'arrived':
            newStatus = 'completed';
            break;
        }
        return {
          ...booking,
          status: newStatus as Booking['status'],
          updatedAt: new Date().toISOString(),
        };
      }
      return booking;
    });
    setBookings(updatedBookings);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your ICC Transport</h1>
          <p className="text-xl text-gray-600">Monitor your Cape Town transport status in real-time</p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, phone number, or booking ID..."
              className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
            <Car className="absolute right-4 top-4 h-6 w-6 text-gray-400" />
          </div>
        </div>

        {/* Active Bookings */}
        <div className="space-y-6">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <Car className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'No bookings match your search criteria.' : 'You don\'t have any CTICC transport bookings yet.'}
              </p>
              <button
                onClick={() => onViewChange('booking')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Transport to ICC
              </button>
            </div>
          ) : (
            filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        Booking #{booking.id}
                      </h3>
                      <p className="text-gray-600">{booking.memberName}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="ml-2 capitalize">{booking.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Trip Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Cape Town Trip Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Pickup Location</p>
                            <p className="text-sm text-gray-600">{booking.pickupAddress}</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <MapPin className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">Destination</p>
                            <p className="text-sm text-gray-600">Impact Christian Center (ICC)</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Driver Details */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Cape Town Driver Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Car className="h-5 w-5 text-blue-600 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{booking.driverName}</p>
                            <p className="text-sm text-gray-600">Professional Cape Town Driver</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 text-green-600 mr-3" />
                          <p className="text-sm text-gray-600">{booking.driverContact}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Status Timeline (Cape Town Time)</h4>
                    <div className="text-sm text-gray-600">
                      <p><strong>Created:</strong> {formatTime(booking.createdAt)}</p>
                      <p><strong>Last Updated:</strong> {formatTime(booking.updatedAt)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                    <div className="mt-6 pt-6 border-t border-gray-200 flex space-x-4">
                      <button
                        onClick={() => simulateStatusUpdate(booking.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Simulate Status Update
                      </button>
                      <a
                        href={`tel:${booking.driverContact}`}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center"
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Driver
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};