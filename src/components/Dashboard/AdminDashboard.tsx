import React, { useState } from 'react';
import { Users, Calendar, MessageSquare, BarChart3, TrendingUp, UserPlus, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useBookings } from '../../context/BookingContext';
import { useEmergency } from '../../context/EmergencyContext';
import { mockUsers, mockForumPosts } from '../../data/mockData';
import EmergencyAlerts from '../Emergency/EmergencyAlerts';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface AdminDashboardProps {
  setActiveTab: (tab: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { bookings } = useBookings();
  const { getAlertsForUser } = useEmergency();
  const [activeTab, setActiveTabLocal] = useState<'dashboard' | 'emergency'>('dashboard');

  // Emergency alerts for admin
  const emergencyAlerts = user ? getAlertsForUser(user.id, 'admin') : [];
  const activeEmergencyAlerts = emergencyAlerts.filter(alert => alert.status === 'active');

  // Calculate real statistics
  const totalUsers = mockUsers.length;
  const totalSessions = bookings.length;
  const forumPosts = mockForumPosts.length;
  
  // Calculate this month's sessions
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const thisMonthSessions = bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
  }).length;

  const stats = [
    { label: 'Total Users', value: totalUsers.toString(), change: `+${Math.floor(totalUsers * 0.1)} this month`, icon: Users, color: 'text-blue-500' },
    { label: 'Sessions This Month', value: thisMonthSessions.toString(), change: `${totalSessions} total`, icon: Calendar, color: 'text-green-500' },
    { label: 'Forum Posts', value: forumPosts.toString(), change: 'Active discussions', icon: MessageSquare, color: 'text-purple-500' },
    { label: 'Emergency Alerts', value: activeEmergencyAlerts.length.toString(), change: activeEmergencyAlerts.length > 0 ? 'URGENT' : 'None', icon: AlertTriangle, color: 'text-red-500' },
  ];

  // Calculate sessions per month for the last 6 months
  const getSessionsForMonth = (monthsBack: number) => {
    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() - monthsBack);
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.date);
      return bookingDate.getMonth() === targetDate.getMonth() && 
             bookingDate.getFullYear() === targetDate.getFullYear();
    }).length;
  };

  const sessionsData = {
    labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Sessions',
        data: [
          getSessionsForMonth(5), // April
          getSessionsForMonth(4), // May  
          getSessionsForMonth(3), // June
          getSessionsForMonth(2), // July
          getSessionsForMonth(1), // August
          getSessionsForMonth(0), // September
        ],
        backgroundColor: 'rgba(37, 99, 235, 0.5)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Helper functions for user activity and resources
  const getLastActivity = (user: any) => {
    const userBookings = bookings.filter(b => b.studentId === user.id || b.counsellorId === user.id);
    const userPosts = mockForumPosts.filter(p => p.userId === user.id);
    
    const allActivities = [
      ...userBookings.map(b => new Date(b.date)),
      ...userPosts.map(p => new Date(p.timestamp))
    ].sort((a, b) => b.getTime() - a.getTime());
    
    if (allActivities.length === 0) return 'No activity';
    
    const lastActivity = allActivities[0];
    const daysAgo = Math.floor((Date.now() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysAgo === 0) return 'Today';
    if (daysAgo === 1) return 'Yesterday';
    if (daysAgo < 7) return `${daysAgo} days ago`;
    return `${Math.floor(daysAgo / 7)} weeks ago`;
  };

  const isUserActiveThisWeek = (user: any) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const recentBookings = bookings.filter(b => 
      (b.studentId === user.id || b.counsellorId === user.id) && 
      new Date(b.date) > oneWeekAgo
    );
    
    const recentPosts = mockForumPosts.filter(p => 
      p.userId === user.id && 
      new Date(p.timestamp) > oneWeekAgo
    );
    
    return recentBookings.length > 0 || recentPosts.length > 0;
  };

  const getMostAccessedResources = () => {
    // Simulate resource access data based on user activity
    const resources = [
      { title: 'Anxiety Management Guide', type: 'Article', views: mockUsers.length * 3 + Math.floor(Math.random() * 10) },
      { title: 'Meditation Audio Series', type: 'Audio', views: mockUsers.length * 2 + Math.floor(Math.random() * 8) },
      { title: 'Crisis Support Contacts', type: 'Resource', views: mockUsers.length * 4 + Math.floor(Math.random() * 12) },
      { title: 'Student Wellness Videos', type: 'Video', views: mockUsers.length * 2 + Math.floor(Math.random() * 6) },
      { title: 'Mental Health Screening Tool', type: 'Assessment', views: Math.floor(mockUsers.length * 1.5) + Math.floor(Math.random() * 5) }
    ];
    
    return resources.sort((a, b) => b.views - a.views).slice(0, 5);
  };

  const userRoleData = {
    labels: ['Students', 'Counsellors', 'Admins'],
    datasets: [
      {
        data: [85, 12, 3],
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(249, 115, 22, 0.8)',
        ],
        borderColor: [
          'rgba(37, 99, 235, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(249, 115, 22, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

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

      <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BarChart3 className="w-12 h-12" />
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="opacity-90">Monitor and manage the SoulBridge platform</p>
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
              <div className="stat-desc flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-success">{stat.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Sessions Over Time</h3>
            <Bar data={sessionsData} options={chartOptions} />
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">User Distribution</h3>
            <div className="flex justify-center">
              <div className="w-64">
                <Doughnut data={userRoleData} options={chartOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Weekly User Activity</h3>
            <div className="space-y-3">
              {mockUsers.map((user, index) => {
                const lastActivity = getLastActivity(user);
                const isActive = isUserActiveThisWeek(user);
                return (
                  <div key={user.id} className="flex items-center justify-between p-2 bg-base-200 rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-base-content/60 capitalize">{user.role}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{lastActivity}</p>
                      <p className="text-xs text-base-content/60">{isActive ? 'Active' : 'Inactive'}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Most Accessed Resources</h3>
            <div className="space-y-3">
              {getMostAccessedResources().map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-base-200 rounded">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{resource.title}</p>
                      <p className="text-sm text-base-content/60">{resource.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{resource.views}</p>
                    <p className="text-xs text-base-content/60">views</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => setActiveTab('users')}
                className="btn btn-outline btn-block justify-start"
              >
                <Users className="w-5 h-5" />
                Manage Users
              </button>
              <button 
                onClick={() => setActiveTab('analytics')}
                className="btn btn-outline btn-block justify-start"
              >
                <BarChart3 className="w-5 h-5" />
                View Analytics
              </button>
              <button 
                onClick={() => setActiveTab('forum')}
                className="btn btn-outline btn-block justify-start"
              >
                <MessageSquare className="w-5 h-5" />
                Moderate Forum
              </button>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">System Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>Server Status</span>
                <div className="badge badge-success">Online</div>
              </div>
              <div className="flex justify-between items-center">
                <span>Database</span>
                <div className="badge badge-success">Connected</div>
              </div>
              <div className="flex justify-between items-center">
                <span>AI Service</span>
                <div className="badge badge-success">Active</div>
              </div>
              <div className="flex justify-between items-center">
                <span>Uptime</span>
                <span className="text-success">99.9%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>New user registered</span>
                <span className="text-base-content/60">2m ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Session completed</span>
                <span className="text-base-content/60">5m ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>New forum post</span>
                <span className="text-base-content/60">12m ago</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>Resource updated</span>
                <span className="text-base-content/60">1h ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;