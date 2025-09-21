import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Booking } from '../types';
import { mockBookings as initialBookings } from '../data/mockData';

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  getBookingsByStudent: (studentId: string) => Booking[];
  getBookingsByCounsellor: (counsellorId: string) => Booking[];
  getTodaysBookings: (counsellorId: string) => Booking[];
  updateBookingStatuses: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};

interface BookingProviderProps {
  children: ReactNode;
}

export const BookingProvider: React.FC<BookingProviderProps> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);

  // Auto-update booking statuses on component mount and periodically
  useEffect(() => {
    const updateStatuses = () => {
      const now = new Date();
      console.log('Updating booking statuses at:', now.toLocaleString());
      
      setBookings(prev => 
        prev.map(booking => {
          // Parse booking date and time
          const bookingDateTime = new Date(`${booking.date}T${booking.time}:00`);
          console.log(`Booking ${booking.id}: ${bookingDateTime.toLocaleString()} vs Current: ${now.toLocaleString()}`);
          
          // If booking is in the past and status is pending/confirmed, mark as completed
          if (bookingDateTime < now && (booking.status === 'pending' || booking.status === 'confirmed')) {
            console.log(`Updating booking ${booking.id} from ${booking.status} to completed`);
            return { ...booking, status: 'completed' as const };
          }
          
          return booking;
        })
      );
    };

    // Update immediately on mount
    updateStatuses();

    // Set up interval to check every 30 seconds for more responsive updates
    const interval = setInterval(updateStatuses, 30000);

    return () => clearInterval(interval);
  }, []);

  const addBooking = (booking: Booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, ...updates } : booking
      )
    );
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(booking => booking.id !== id));
  };

  const getBookingsByStudent = (studentId: string) => {
    return bookings.filter(booking => booking.studentId === studentId);
  };

  const getBookingsByCounsellor = (counsellorId: string) => {
    return bookings.filter(booking => booking.counsellorId === counsellorId);
  };

  const getTodaysBookings = (counsellorId: string) => {
    const today = new Date().toDateString();
    return bookings.filter(booking => 
      booking.counsellorId === counsellorId &&
      new Date(booking.date).toDateString() === today
    );
  };

  const updateBookingStatuses = () => {
    const now = new Date();
    console.log('Manual booking status update triggered at:', now.toLocaleString());
    
    setBookings(prev => 
      prev.map(booking => {
        // Parse booking date and time
        const bookingDateTime = new Date(`${booking.date}T${booking.time}:00`);
        console.log(`Checking booking ${booking.id}: ${bookingDateTime.toLocaleString()} vs Current: ${now.toLocaleString()}`);
        
        // If booking is in the past and status is pending/confirmed, mark as completed
        if (bookingDateTime < now && (booking.status === 'pending' || booking.status === 'confirmed')) {
          console.log(`Updating booking ${booking.id} from ${booking.status} to completed`);
          return { ...booking, status: 'completed' as const };
        }
        
        return booking;
      })
    );
  };

  const value: BookingContextType = {
    bookings,
    addBooking,
    updateBooking,
    deleteBooking,
    getBookingsByStudent,
    getBookingsByCounsellor,
    getTodaysBookings,
    updateBookingStatuses,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};