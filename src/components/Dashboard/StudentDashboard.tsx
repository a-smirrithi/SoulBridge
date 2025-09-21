import React, { useState, useEffect } from 'react';
import { MessageCircle, Calendar, BookOpen, Users, Heart, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useMood } from '../../context/MoodContext';
import { useEmergency } from '../../context/EmergencyContext';
import { useBookings } from '../../context/BookingContext';
import { mockForumPosts } from '../../data/mockData';

interface StudentDashboardProps {
  setActiveTab: (tab: string) => void;
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { addMoodEntry, getTodaysMood } = useMood();
  const { sendEmergencyAlert } = useEmergency();
  const { bookings, updateBookingStatuses } = useBookings();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [moodSubmitted, setMoodSubmitted] = useState(false);
  const [sosMessage, setSosMessage] = useState('');
  const [showSosForm, setShowSosForm] = useState(false);
  const [sosSubmitted, setSosSubmitted] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Calculate real stats
  const studentBookings = bookings.filter(booking => booking.studentId === user?.id);
  const studentForumPosts = mockForumPosts.filter(post => post.userId === user?.id);
  
  // Calculate days active (based on first booking or post creation date)
  const firstActivityDate = [...studentBookings.map(b => new Date(b.date)), ...studentForumPosts.map(p => new Date(p.timestamp))].sort((a, b) => a.getTime() - b.getTime())[0];
  const daysActive = firstActivityDate ? Math.floor((Date.now() - firstActivityDate.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;
  
  // Resources read (mock calculation - in real app would track actual resource views)
  const resourcesRead = Math.min(studentBookings.length + studentForumPosts.length, 5);
  
  // Check if user already logged mood today
  useEffect(() => {
    if (user) {
      const todaysMood = getTodaysMood(user.id);
      if (todaysMood) {
        const moodIndex = moodOptions.findIndex(m => m.label === todaysMood.moodLabel);
        setSelectedMood(moodIndex);
        setMoodSubmitted(true);
      }
    }
  }, [user, getTodaysMood]);

  // Update last update time when bookings change
  useEffect(() => {
    setLastUpdate(new Date());
  }, [bookings]);

  const moodOptions = [
    { emoji: '😊', label: 'Great', value: 5 },
    { emoji: '😐', label: 'Okay', value: 3 },
    { emoji: '😔', label: 'Sad', value: 2 },
    { emoji: '😰', label: 'Anxious', value: 1 },
    { emoji: '😴', label: 'Tired', value: 2 },
  ];

  const handleMoodSelect = (index: number, value: number) => {
    if (!user) return;
    
    setSelectedMood(index);
    setMoodSubmitted(true);
    
    // Save mood to context
    addMoodEntry(user.id, value, moodOptions[index].label);
    
    // Show confirmation for 3 seconds
    setTimeout(() => {
      setMoodSubmitted(false);
    }, 3000);
  };

  const handleSosAlert = () => {
    if (!user) return;
    
    const message = sosMessage.trim() || 'Emergency assistance needed - please help!';
    sendEmergencyAlert(user.id, user.name, message);
    
    setSosSubmitted(true);
    setShowSosForm(false);
    setSosMessage('');
    
    // Show confirmation for 5 seconds
    setTimeout(() => {
      setSosSubmitted(false);
    }, 5000);
  };

  const quickActions = [
    {
      title: 'Chat with Aasha',
      description: 'Get instant support from our AI companion',
      icon: MessageCircle,
      color: 'bg-blue-500',
      action: () => window.open('https://app.agentx.so/shared-chat/?agent=68c69f30b8037d766c21f4b7', '_blank'),
    },
    {
      title: 'Book Session',
      description: 'Schedule a session with a counsellor',
      icon: Calendar,
      color: 'bg-green-500',
      action: () => setActiveTab('booking'),
    },
    {
      title: 'Resources',
      description: 'Access helpful guides and materials',
      icon: BookOpen,
      color: 'bg-purple-500',
      action: () => setActiveTab('resources'),
    },
    {
      title: 'Peer Forum',
      description: 'Connect with other students',
      icon: Users,
      color: 'bg-orange-500',
      action: () => setActiveTab('forum'),
    },
    {
      title: '🆘 Emergency Help',
      description: 'Get immediate assistance - we\'re here for you',
      icon: AlertTriangle,
      color: 'bg-red-500',
      action: () => setShowSosForm(true),
    },
  ];

  const stats = [
    { label: 'Days Active', value: daysActive.toString(), icon: Calendar },
    { label: 'Chat Sessions', value: studentBookings.length.toString(), icon: MessageCircle },
    { label: 'Resources Read', value: resourcesRead.toString(), icon: BookOpen },
    { label: 'Forum Posts', value: studentForumPosts.length.toString(), icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
        <div className="flex items-center gap-4">
          <Heart className="w-12 h-12" />
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name}!</h1>
            <p className="opacity-90">Your mental wellness journey continues here.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="stat bg-base-100 shadow rounded-lg">
              <div className="stat-figure text-primary">
                <Icon className="w-8 h-8" />
              </div>
              <div className="stat-title">{stat.label}</div>
              <div className="stat-value text-primary">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div
                key={index}
                onClick={action.action}
                className="card bg-base-100 shadow-lg hover:shadow-xl cursor-pointer transition-all duration-200 hover:scale-105"
              >
                <div className="card-body items-center text-center">
                  <div className={`p-3 rounded-full ${action.color} text-white mb-2`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="card-title text-lg">{action.title}</h3>
                  <p className="text-base-content/70 text-sm">{action.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <h3 className="card-title">Today's Mood Check</h3>
            <p className="text-base-content/70">How are you feeling today?</p>
            
            {moodSubmitted ? (
              <div className="mt-4 p-4 bg-success/10 border border-success/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-success" />
                  <span className="text-success font-medium">
                    Mood recorded! Thank you for sharing.
                  </span>
                </div>
                <p className="text-sm text-base-content/70 mt-1">
                  Selected: {selectedMood !== null ? moodOptions[selectedMood].label : ''}
                </p>
              </div>
            ) : (
              <div className="flex gap-2 mt-4">
                {moodOptions.map((mood, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <button
                      onClick={() => handleMoodSelect(index, mood.value)}
                      className={`btn btn-ghost btn-lg text-2xl hover:bg-primary hover:text-white transition-all ${
                        selectedMood === index ? 'bg-primary text-white' : ''
                      }`}
                      title={mood.label}
                    >
                      {mood.emoji}
                    </button>
                    <span className="text-xs text-base-content/60">{mood.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h3 className="card-title">Upcoming Sessions</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-base-content/50">
                  Updated: {lastUpdate.toLocaleTimeString()}
                </span>
                <button 
                  className="btn btn-sm btn-outline btn-primary"
                  onClick={() => {
                    updateBookingStatuses();
                    setLastUpdate(new Date());
                  }}
                  title="Refresh booking statuses"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </div>
            <div className="space-y-2">
              {studentBookings.length === 0 ? (
                <div className="text-center py-4 text-base-content/70">
                  <p>No sessions scheduled</p>
                  <button 
                    className="btn btn-primary btn-sm mt-2"
                    onClick={() => setActiveTab('booking')}
                  >
                    Book a Session
                  </button>
                </div>
              ) : (
                studentBookings
                  .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime())
                  .map(booking => {
                    const bookingDateTime = new Date(`${booking.date}T${booking.time}:00`);
                    const now = new Date();
                    const isPast = bookingDateTime < now;
                    
                    const statusColors = {
                      'pending': 'badge-warning',
                      'confirmed': 'badge-success', 
                      'completed': 'badge-info',
                      'cancelled': 'badge-error'
                    };

                    return (
                      <div key={booking.id} className="flex items-center justify-between p-3 bg-base-200 rounded">
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-primary" />
                          <div>
                            <p className="font-medium">Counsellor Session</p>
                            <p className="text-sm text-base-content/70">
                              {bookingDateTime.toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                              })}
                              {isPast && ' (Past)'}
                            </p>
                            {booking.notes && (
                              <p className="text-xs text-base-content/50">{booking.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className={`badge ${statusColors[booking.status]}`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SOS Alert Confirmation */}
      {sosSubmitted && (
        <div className="fixed top-4 right-4 z-50">
          <div className="alert alert-success shadow-lg">
            <div>
              <AlertTriangle className="w-6 h-6" />
              <span>
                <strong>Emergency alert sent!</strong><br />
                Counsellors and support staff have been notified immediately.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* SOS Form Modal */}
      {showSosForm && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-6 h-6" />
              Emergency Support Request
            </h3>
            <p className="py-4 text-base-content/70">
              This will immediately alert our counsellors and support staff. 
              You can add a message to help them understand your situation better.
            </p>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text">Message (optional)</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24"
                placeholder="Describe your situation or how we can help you..."
                value={sosMessage}
                onChange={(e) => setSosMessage(e.target.value)}
              />
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowSosForm(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleSosAlert}
                className="btn btn-error gap-2"
              >
                <AlertTriangle className="w-4 h-4" />
                Send Emergency Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;