import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface EmergencyAlert {
  id: string;
  studentId: string;
  studentName: string;
  message: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  acknowledgedBy?: string;
  resolvedBy?: string;
  location?: string;
  urgencyLevel: 'high' | 'medium' | 'low';
}

interface EmergencyContextType {
  alerts: EmergencyAlert[];
  activeAlerts: EmergencyAlert[];
  sendEmergencyAlert: (studentId: string, studentName: string, message?: string, location?: string) => void;
  acknowledgeAlert: (alertId: string, acknowledgedBy: string) => void;
  resolveAlert: (alertId: string, resolvedBy: string) => void;
  getAlertsForUser: (userId: string, userRole: string) => EmergencyAlert[];
}

const EmergencyContext = createContext<EmergencyContextType | undefined>(undefined);

export const useEmergency = () => {
  const context = useContext(EmergencyContext);
  if (context === undefined) {
    throw new Error('useEmergency must be used within an EmergencyProvider');
  }
  return context;
};

interface EmergencyProviderProps {
  children: ReactNode;
}

export const EmergencyProvider: React.FC<EmergencyProviderProps> = ({ children }) => {
  const [alerts, setAlerts] = useState<EmergencyAlert[]>([]);

  const sendEmergencyAlert = (
    studentId: string, 
    studentName: string, 
    message: string = 'Emergency assistance needed', 
    location?: string
  ) => {
    const newAlert: EmergencyAlert = {
      id: `emergency-${Date.now()}`,
      studentId,
      studentName,
      message,
      timestamp: new Date().toISOString(),
      status: 'active',
      location,
      urgencyLevel: 'high',
    };

    setAlerts(prev => [newAlert, ...prev]);
    
    // In a real app, this would trigger push notifications, emails, etc.
    console.log('🚨 EMERGENCY ALERT SENT:', newAlert);
  };

  const acknowledgeAlert = (alertId: string, acknowledgedBy: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'acknowledged' as const, acknowledgedBy }
          : alert
      )
    );
  };

  const resolveAlert = (alertId: string, resolvedBy: string) => {
    setAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId 
          ? { ...alert, status: 'resolved' as const, resolvedBy }
          : alert
      )
    );
  };

  const getAlertsForUser = (userId: string, userRole: string) => {
    if (userRole === 'student') {
      return alerts.filter(alert => alert.studentId === userId);
    } else if (userRole === 'counsellor' || userRole === 'admin' || userRole === 'volunteer') {
      return alerts; // Counsellors, admins, and volunteers see all alerts
    }
    return [];
  };

  const activeAlerts = alerts.filter(alert => alert.status === 'active');

  const value: EmergencyContextType = {
    alerts,
    activeAlerts,
    sendEmergencyAlert,
    acknowledgeAlert,
    resolveAlert,
    getAlertsForUser,
  };

  return (
    <EmergencyContext.Provider value={value}>
      {children}
    </EmergencyContext.Provider>
  );
};