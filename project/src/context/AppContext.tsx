import React, { createContext, useContext, useEffect } from 'react';
import { Member, Driver, Booking } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { mockMembers, mockDrivers, mockBookings } from '../data/mockData';

interface AppContextType {
  members: Member[];
  setMembers: (members: Member[]) => void;
  drivers: Driver[];
  setDrivers: (drivers: Driver[]) => void;
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useLocalStorage<Member[]>('letgo-members', []);
  const [drivers, setDrivers] = useLocalStorage<Driver[]>('letgo-drivers', []);
  const [bookings, setBookings] = useLocalStorage<Booking[]>('letgo-bookings', []);
  const [isAdmin, setIsAdmin] = useLocalStorage<boolean>('letgo-admin-auth', false);

  // Initialize with mock data if empty
  useEffect(() => {
    if (members.length === 0) {
      setMembers(mockMembers);
    }
    if (drivers.length === 0) {
      setDrivers(mockDrivers);
    }
    if (bookings.length === 0) {
      setBookings(mockBookings);
    }
  }, [members.length, drivers.length, bookings.length, setMembers, setDrivers, setBookings]);

  return (
    <AppContext.Provider
      value={{
        members,
        setMembers,
        drivers,
        setDrivers,
        bookings,
        setBookings,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};