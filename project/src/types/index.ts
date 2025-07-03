export interface Member {
  id: string;
  name: string;
  contact: string;
  address: string;
  isActive: boolean;
}

export interface Driver {
  id: string;
  name: string;
  contact: string;
  area: string;
  status: 'available' | 'busy' | 'offline';
  vehicleNumber: string;
  vehicleType: string;
}

export interface Booking {
  id: string;
  memberId: string;
  memberName: string;
  memberContact: string;
  memberAddress: string;
  driverId: string;
  driverName: string;
  driverContact: string;
  status: 'pending' | 'accepted' | 'on-the-way' | 'arrived' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  pickupAddress: string;
  destination: string;
}

export interface Admin {
  username: string;
  password: string;
}