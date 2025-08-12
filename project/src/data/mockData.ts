import { Member, Driver, Booking, Admin } from '../types';

export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'John Smith',
    contact: '+27821234567',
    address: '15 Long Street, Cape Town City Centre, 8001',
    isActive: true,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    contact: '+27821234568',
    address: '42 Kloof Street, Gardens, Cape Town, 8001',
    isActive: true,
  },
  {
    id: '3',
    name: 'Mike Chen',
    contact: '+27821234569',
    address: '78 Main Road, Sea Point, Cape Town, 8005',
    isActive: true,
  },
];

export const mockDrivers: Driver[] = [
  {
    id: '1',
    name: 'Ahmed Hassan',
    contact: '+27821111001',
    area: 'City Centre & Gardens',
    status: 'available',
    vehicleNumber: 'CA 123-456',
    vehicleType: 'Toyota Corolla',
  },
  {
    id: '2',
    name: 'David Wilson',
    contact: '+27821111002',
    area: 'Sea Point & Green Point',
    status: 'busy',
    vehicleNumber: 'CA 234-567',
    vehicleType: 'Honda CR-V',
  },
  {
    id: '3',
    name: 'Carlos Rodriguez',
    contact: '+27821111003',
    area: 'Camps Bay & Clifton',
    status: 'available',
    vehicleNumber: 'CA 345-678',
    vehicleType: 'Toyota Quantum',
  },
];

export const mockBookings: Booking[] = [
  {
    id: '1001',
    memberId: '1',
    memberName: 'John Smith',
    memberContact: '+27821234567',
    memberAddress: '15 Long Street, Cape Town City Centre, 8001',
    driverId: '2',
    driverName: 'David Wilson',
    driverContact: '+27821111002',
    status: 'on-the-way',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    updatedAt: new Date(Date.now() - 600000).toISOString(),
    pickupAddress: '15 Long Street, Cape Town City Centre, 8001',
    destination: 'Cape Town International Convention Centre (CTICC), Convention Square, Cape Town, 8001',
  },
  {
    id: '1002',
    memberId: '3',
    memberName: 'Mike Chen',
    memberContact: '+27821234569',
    memberAddress: '78 Main Road, Sea Point, Cape Town, 8005',
    driverId: '1',
    driverName: 'Ahmed Hassan',
    driverContact: '+27821111001',
    status: 'accepted',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    pickupAddress: '78 Main Road, Sea Point, Cape Town, 8005',
    destination: 'Cape Town International Convention Centre (CTICC), Convention Square, Cape Town, 8001',
  },
];

export const mockAdmin: Admin = {
  username: 'admin',
  password: 'admin123',
};