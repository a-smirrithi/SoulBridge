import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import { MoodProvider } from './context/MoodContext';
import { EmergencyProvider } from './context/EmergencyContext';
import { RatingProvider } from './context/RatingContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import VolunteerLoginForm from './components/Auth/VolunteerLoginForm';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import StudentDashboard from './components/Dashboard/StudentDashboard';
import CounsellorDashboard from './components/Dashboard/CounsellorDashboard';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import VolunteerDashboard from './components/Dashboard/VolunteerDashboard';
import ChatbotInterface from './components/Chatbot/ChatbotInterface';
import BookingSystem from './components/Booking/BookingSystem';
import ResourceCenter from './components/Resources/ResourceCenter';
import ForumInterface from './components/Forum/ForumInterface';
import AssessmentInterface from './components/Assessment/AssessmentInterface';
import UserManagement from './components/Admin/UserManagement';
import AnalyticsDashboard from './components/Admin/AnalyticsDashboard';
import TrainingCenter from './components/Training/TrainingCenter';
import StudentFeedback from './components/Student/StudentFeedback';

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showVolunteerLogin, setShowVolunteerLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Reset to dashboard when user changes (login/logout)
  useEffect(() => {
    setActiveTab('dashboard');
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="mb-4">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
          <h2 className="text-2xl font-bold text-base-content mb-2">SoulBridge</h2>
          <p className="text-base-content/70">Connecting hearts, healing minds...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showVolunteerLogin ? (
            <VolunteerLoginForm 
              onClose={() => setShowVolunteerLogin(false)}
              onSuccess={() => setShowVolunteerLogin(false)}
            />
          ) : showRegister ? (
            <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
          ) : (
            <LoginForm 
              onSwitchToRegister={() => setShowRegister(true)}
              onSwitchToVolunteer={() => setShowVolunteerLogin(true)}
            />
          )}
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (user.role === 'student') return <StudentDashboard setActiveTab={setActiveTab} />;
        if (user.role === 'counsellor') return <CounsellorDashboard setActiveTab={setActiveTab} />;
        if (user.role === 'admin') return <AdminDashboard setActiveTab={setActiveTab} />;
        if (user.role === 'volunteer') return <VolunteerDashboard setActiveTab={setActiveTab} />;
        return <div>Dashboard</div>;
      case 'chatbot':
        return <ChatbotInterface />;
      case 'booking':
      case 'bookings':
        return <BookingSystem />;
      case 'resources':
        return <ResourceCenter />;
      case 'forum':
        return <ForumInterface />;
      case 'assessment':
      case 'assessments':
        return <AssessmentInterface />;
      case 'users':
        return <UserManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'training':
        return <TrainingCenter />;
      case 'feedback':
        return <StudentFeedback />;
      default:
        return <div className="text-center text-base-content/70">Feature coming soon...</div>;
    }
  };

  return (
    <div className={`drawer ${sidebarOpen ? 'lg:drawer-open' : ''}`}>
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 bg-base-200 transition-all duration-300">
          {renderContent()}
        </main>
      </div>

      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isVisible={sidebarOpen}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookingProvider>
          <MoodProvider>
            <EmergencyProvider>
              <RatingProvider>
                <div className="min-h-screen bg-base-100" data-theme="cupcake">
                  <MainApp />
                </div>
              </RatingProvider>
            </EmergencyProvider>
          </MoodProvider>
        </BookingProvider>
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;