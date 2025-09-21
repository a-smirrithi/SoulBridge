import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface MoodEntry {
  id: string;
  userId: string;
  mood: number;
  moodLabel: string;
  date: string;
  timestamp: string;
}

interface MoodContextType {
  moodEntries: MoodEntry[];
  addMoodEntry: (userId: string, mood: number, moodLabel: string) => void;
  getUserMoodEntries: (userId: string) => MoodEntry[];
  getTodaysMood: (userId: string) => MoodEntry | null;
  getMoodHistory: (userId: string, days: number) => MoodEntry[];
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

interface MoodProviderProps {
  children: ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);

  const addMoodEntry = (userId: string, mood: number, moodLabel: string) => {
    const now = new Date();
    const entry: MoodEntry = {
      id: `${userId}-${now.getTime()}`,
      userId,
      mood,
      moodLabel,
      date: now.toDateString(),
      timestamp: now.toISOString(),
    };

    setMoodEntries(prev => [...prev, entry]);
  };

  const getUserMoodEntries = (userId: string) => {
    return moodEntries.filter(entry => entry.userId === userId);
  };

  const getTodaysMood = (userId: string) => {
    const today = new Date().toDateString();
    const todayEntries = moodEntries.filter(
      entry => entry.userId === userId && entry.date === today
    );
    return todayEntries.length > 0 ? todayEntries[todayEntries.length - 1] : null;
  };

  const getMoodHistory = (userId: string, days: number) => {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return moodEntries
      .filter(entry => 
        entry.userId === userId && 
        new Date(entry.timestamp) >= cutoffDate
      )
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const value: MoodContextType = {
    moodEntries,
    addMoodEntry,
    getUserMoodEntries,
    getTodaysMood,
    getMoodHistory,
  };

  return (
    <MoodContext.Provider value={value}>
      {children}
    </MoodContext.Provider>
  );
};