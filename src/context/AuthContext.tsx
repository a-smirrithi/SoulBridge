import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { mockUsers } from '../data/mockData';
import bcrypt from 'bcryptjs';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: string) => Promise<boolean>;
  volunteerLogin: (email: string, password: string, certificationId: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('soulbridge_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && foundUser.password && bcrypt.compareSync(password, foundUser.password)) {
      const userWithoutPassword = { ...foundUser };
      delete userWithoutPassword.password;
      setUser(userWithoutPassword);
      localStorage.setItem('soulbridge_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string, role: string): Promise<boolean> => {
    // Check if user already exists
    if (mockUsers.find(u => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role: role as 'student' | 'counsellor' | 'admin',
      password: bcrypt.hashSync(password, 10),
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;
    setUser(userWithoutPassword);
    localStorage.setItem('soulbridge_user', JSON.stringify(userWithoutPassword));
    return true;
  };

  const volunteerLogin = async (email: string, password: string, certificationId: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.role === 'volunteer');
    if (foundUser && foundUser.password && bcrypt.compareSync(password, foundUser.password)) {
      // Verify certification ID (in real app, this would be validated against a database)
      if (foundUser.certificationId === certificationId) {
        const userWithoutPassword = { ...foundUser };
        delete userWithoutPassword.password;
        setUser(userWithoutPassword);
        localStorage.setItem('soulbridge_user', JSON.stringify(userWithoutPassword));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('soulbridge_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, volunteerLogin, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};