import React, { useState } from 'react';
import { User, Phone, MapPin, Car, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';

interface BookingPageProps {
  onViewChange: (view: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ onViewChange }) => {
  const { members, drivers, bookings, setBookings } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    destination: 'ICC, 57 Halt Road, riverton, Cape Town, 7490',
  });
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verificationError, setVerificationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const availableDrivers = drivers.filter(driver => driver.status === 'available');

  const handleVerifyMember = () => {
    const member = members.find(
      m => m.name.toLowerCase() === formData.name.toLowerCase() && 
           m.contact === formData.contact &&
           m.isActive
    );

    if (member) {
      setIsVerified(true);
      setVerificationError('');
      setFormData(prev => ({ ...prev, address: member.address }));
    } else {
      setVerificationError('Member not found or inactive. Please check your details.');
      setIsVerified(false);
    }
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDriverId) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const selectedDriver = drivers.find(d => d.id === selectedDriverId);
    if (!selectedDriver) return;

    const newBooking: Booking = {
      id: (1000 + bookings.length + 1).toString(),
      memberId: members.find(m => m.name.toLowerCase() === formData.name.toLowerCase())?.id || '',
      memberName: formData.name,
      memberContact: formData.contact,
      memberAddress: formData.address,
      driverId: selectedDriverId,
      driverName: selectedDriver.name,
      driverContact: selectedDriver.contact,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pickupAddress: formData.address,
      destination: formData.destination,
    };

    setBookings([...bookings, newBooking]);
    setBookingSuccess(true);
    setIsSubmitting(false);

    // Reset form after success
    setTimeout(() => {
      setBookingSuccess(false);
      setFormData({ 
        name: '', 
        contact: '', 
        address: '', 
        destination: 'ICC, 57 Halt Road, Riverton, Cape Town, 7490' 
      });
      setSelectedDriverId('');
      setIsVerified(false);
      onViewChange('track');
    }, 3000);
  };

  if (bookingSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-6">
            Your transport to ICC has been booked successfully. You'll be redirected to track your booking.
          </p>
          <div className="animate-pulse">
            <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Book Your Transport to ICC</h1>
          <p className="text-xl text-gray-600">Exclusive service for ICC members in Cape Town</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            {/* Step 1: Member Verification */}
            <div className="mb-8">
              <div className="flex items-center mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isVerified ? 'bg-green-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  1
                </div>
                <h2 className="ml-3 text-xl font-semibold text-gray-900">Verify ICC Membership</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      disabled={isVerified}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => setFormData(prev => ({ ...prev, contact: e.target.value }))}
                      disabled={isVerified}
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      placeholder="+27821234567"
                    />
                  </div>
                </div>
              </div>

              {verificationError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  {verificationError}
                </div>
              )}

              {isVerified && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  ICC Membership verified successfully!
                </div>
              )}

              {!isVerified && (
                <button
                  onClick={handleVerifyMember}
                  disabled={!formData.name || !formData.contact}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Verify ICC Membership
                </button>
              )}
            </div>

            {/* Step 2: Driver Selection */}
            {isVerified && (
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <h2 className="ml-3 text-xl font-semibold text-gray-900">Select Driver by Area</h2>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pickup Address in Cape Town
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address}
                      readOnly
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-red-400" />
                    <input
                      type="text"
                      value={formData.destination}
                      readOnly
                      className="pl-10 w-full p-3 border border-gray-300 rounded-lg bg-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableDrivers.map((driver) => (
                    <div
                      key={driver.id}
                      onClick={() => setSelectedDriverId(driver.id)}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        selectedDriverId === driver.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {driver.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">📍 {driver.area}</p>
                      <p className="text-sm text-gray-600 mb-1">🚗 {driver.vehicleType} - {driver.vehicleNumber}</p>
                      <p className="text-sm text-gray-600">📞 {driver.contact}</p>
                    </div>
                  ))}
                </div>

                {availableDrivers.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Car className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No drivers available at the moment. Please try again later.</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirm Booking */}
            {isVerified && selectedDriverId && (
              <div>
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <h2 className="ml-3 text-xl font-semibold text-gray-900">Confirm Booking</h2>
                </div>

                <form onSubmit={handleSubmitBooking}>
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h3 className="font-medium text-gray-900 mb-2">Booking Summary</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Member:</strong> {formData.name}</p>
                      <p><strong>Pickup:</strong> {formData.address}</p>
                      <p><strong>Destination:</strong> ICC, 57 Halt Road, Riverton, Cape Town, 7490</p>
                      <p><strong>Driver:</strong> {drivers.find(d => d.id === selectedDriverId)?.name}</p>
                      <p><strong>Area:</strong> {drivers.find(d => d.id === selectedDriverId)?.area}</p>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <Clock className="animate-spin h-5 w-5 mr-2" />
                        Confirming Booking...
                      </>
                    ) : (
                      'Confirm Transport to ICC'
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};