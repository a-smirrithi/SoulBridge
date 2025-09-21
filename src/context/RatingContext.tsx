import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Rating {
  id: string;
  studentId: string;
  counsellorId: string;
  bookingId: string;
  rating: number; // 1-5 stars
  feedback: string;
  timestamp: string;
  sessionDate: string;
}

interface RatingContextType {
  ratings: Rating[];
  addRating: (rating: Omit<Rating, 'id' | 'timestamp'>) => void;
  getRatingsByStudent: (studentId: string) => Rating[];
  getRatingsByCounsellor: (counsellorId: string) => Rating[];
  getAverageRating: (counsellorId: string) => number;
  hasRatingForBooking: (studentId: string, bookingId: string) => boolean;
  getRatingForBooking: (studentId: string, bookingId: string) => Rating | null;
}

const RatingContext = createContext<RatingContextType | undefined>(undefined);

export const useRatings = () => {
  const context = useContext(RatingContext);
  if (!context) {
    throw new Error('useRatings must be used within a RatingProvider');
  }
  return context;
};

interface RatingProviderProps {
  children: ReactNode;
}

export const RatingProvider: React.FC<RatingProviderProps> = ({ children }) => {
  const [ratings, setRatings] = useState<Rating[]>([
    {
      id: 'rating_1',
      studentId: '1',
      counsellorId: '2',
      bookingId: '1',
      rating: 5,
      feedback: 'Dr. Sarah was incredibly helpful and understanding. The session really helped me work through my exam anxiety.',
      timestamp: '2025-09-20T11:00:00Z',
      sessionDate: '2025-09-20'
    }
  ]);

  const addRating = (ratingData: Omit<Rating, 'id' | 'timestamp'>) => {
    // Check if rating already exists for this booking
    const existingRating = ratings.find(
      rating => rating.studentId === ratingData.studentId && rating.bookingId === ratingData.bookingId
    );

    if (existingRating) {
      throw new Error('Rating already exists for this session. Ratings cannot be changed once submitted.');
    }

    const newRating: Rating = {
      ...ratingData,
      id: `rating_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      timestamp: new Date().toISOString(),
    };

    setRatings(prev => [...prev, newRating]);
  };

  const getRatingsByStudent = (studentId: string): Rating[] => {
    return ratings.filter(rating => rating.studentId === studentId);
  };

  const getRatingsByCounsellor = (counsellorId: string): Rating[] => {
    return ratings.filter(rating => rating.counsellorId === counsellorId);
  };

  const getAverageRating = (counsellorId: string): number => {
    const counsellorRatings = getRatingsByCounsellor(counsellorId);
    if (counsellorRatings.length === 0) return 0;
    
    const sum = counsellorRatings.reduce((acc, rating) => acc + rating.rating, 0);
    return Math.round((sum / counsellorRatings.length) * 10) / 10; // Round to 1 decimal
  };

  const hasRatingForBooking = (studentId: string, bookingId: string): boolean => {
    return ratings.some(rating => rating.studentId === studentId && rating.bookingId === bookingId);
  };

  const getRatingForBooking = (studentId: string, bookingId: string): Rating | null => {
    return ratings.find(rating => rating.studentId === studentId && rating.bookingId === bookingId) || null;
  };

  const value: RatingContextType = {
    ratings,
    addRating,
    getRatingsByStudent,
    getRatingsByCounsellor,
    getAverageRating,
    hasRatingForBooking,
    getRatingForBooking,
  };

  return (
    <RatingContext.Provider value={value}>
      {children}
    </RatingContext.Provider>
  );
};