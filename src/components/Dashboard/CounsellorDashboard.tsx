import React, { useState } from 'react';
import { Calendar, CheckCircle, Clock, Users, MessageCircle, BookOpen, User, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { useEmergency } from '../../context/EmergencyContext';
import { mockUsers } from '../../data/mockData';
import EmergencyAlerts from '../Emergency/EmergencyAlerts';

interface CounsellorDashboardProps {
  setActiveTab: (tab: string) => void;
}

const CounsellorDashboard: React.FC<CounsellorDashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { getBookingsByCounsellor, getTodaysBookings } = useBookings();
  const { getAlertsForUser } = useEmergency();
  const [activeTab, setActiveTabLocal] = useState<'dashboard' | 'emergency'>('dashboard');

  const counsellorBookings = user ? getBookingsByCounsellor(user.id) : [];
  const todayBookings = user ? getTodaysBookings(user.id) : [];
  
  // Emergency alerts for this counsellor
  const emergencyAlerts = user ? getAlertsForUser(user.id, 'counsellor') : [];
  const activeEmergencyAlerts = emergencyAlerts.filter(alert => alert.status === 'active');
  
  // Calculate real stats
  const uniqueStudents = new Set(counsellorBookings.map(booking => booking.studentId)).size;
  const forumReplies = mockUsers.filter(u => u.role === 'counsellor').length; // Placeholder for real forum reply count

  const stats = [
    { label: 'Today\'s Sessions', value: todayBookings.length.toString(), icon: Calendar, color: 'text-blue-500' },
    { label: 'Total Sessions', value: counsellorBookings.length.toString(), icon: CheckCircle, color: 'text-green-500' },
    { label: 'Active Students', value: uniqueStudents.toString(), icon: Users, color: 'text-purple-500' },
    { label: 'Emergency Alerts', value: activeEmergencyAlerts.length.toString(), icon: AlertTriangle, color: 'text-red-500' },
  ];

  if (activeTab === 'emergency') {
    return <EmergencyAlerts />;
  }

  return (
    <div className="space-y-6">
      {/* Emergency Alert Banner */}
      {activeEmergencyAlerts.length > 0 && (
        <div className="alert alert-error shadow-lg">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <h3 className="font-bold">Emergency Alert!</h3>
            <div className="text-sm">
              {activeEmergencyAlerts.length} active emergency alert{activeEmergencyAlerts.length !== 1 ? 's' : ''} requiring immediate attention.
            </div>
          </div>
          <button 
            onClick={() => setActiveTabLocal('emergency')}
            className="btn btn-sm btn-outline"
          >
            View Alerts
          </button>
        </div>
      )}

      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <User className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold">Good morning, {user?.name}!</h1>
              <p className="opacity-90">Ready to make a difference in students' lives today?</p>
            </div>
          </div>
          {activeEmergencyAlerts.length > 0 && (
            <button 
              onClick={() => setActiveTabLocal('emergency')}
              className="btn btn-error btn-outline text-white border-white hover:bg-white hover:text-red-600"
            >
              <AlertTriangle className="w-5 h-5" />
              Emergency Alerts ({activeEmergencyAlerts.length})
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat bg-base-100 shadow rounded-lg">
              <div className={`stat-figure ${stat.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div className="stat-title">{stat.label}</div>
              <div className="stat-value text-primary">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Today's Schedule
            </h3>
            <div className="space-y-3">
              {todayBookings.length > 0 ? (
                todayBookings.map(booking => {
                  const student = mockUsers.find(u => u.id === booking.studentId);
                  return (
                    <div key={booking.id} className="flex items-center justify-between p-3 bg-base-200 rounded">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-primary" />
                        <div>
                          <p className="font-medium">{student?.name || 'Unknown Student'}</p>
                          <p className="text-sm text-base-content/70">{booking.time}</p>
                        </div>
                      </div>
                      <div className={`badge ${
                        booking.status === 'confirmed' ? 'badge-success' : 
                        booking.status === 'pending' ? 'badge-warning' : 'badge-error'
                      }`}>
                        {booking.status}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-base-content/70">No sessions scheduled for today</p>
              )}
            </div>
            <div className="card-actions justify-end">
              <button 
                onClick={() => setActiveTab('bookings')}
                className="btn btn-primary btn-sm"
              >
                View All Bookings
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title flex items-center gap-2">
              <Users className="w-5 h-5" />
              Recent Forum Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-base-200 rounded">
                <div className="avatar placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                    <span className="text-xs">JS</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium">John Student</p>
                  <p className="text-sm text-base-content/70">Posted: "Dealing with exam anxiety"</p>
                  <p className="text-xs text-base-content/50">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-base-200 rounded">
                <div className="avatar placeholder">
                  <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                    <span className="text-xs">SA</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-medium">Sarah Adams</p>
                  <p className="text-sm text-base-content/70">Asked: "Sleep schedule tips"</p>
                  <p className="text-xs text-base-content/50">5 hours ago</p>
                </div>
              </div>
            </div>
            <div className="card-actions justify-end">
              <button 
                onClick={() => setActiveTab('forum')}
                className="btn btn-primary btn-sm"
              >
                Visit Forum
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorDashboard;