import React, { useState, Suspense, lazy, useCallback, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { BookingProvider } from './context/BookingContext';
import { MoodProvider } from './context/MoodContext';
import { EmergencyProvider } from './context/EmergencyContext';
import { FeedbackProvider } from './context/FeedbackContext';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import VolunteerLoginForm from './components/Auth/VolunteerLoginForm';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Lazy load components for better performance
const StudentDashboard = lazy(() => import('./components/Dashboard/StudentDashboard'));
const CounsellorDashboard = lazy(() => import('./components/Dashboard/CounsellorDashboard'));
const AdminDashboard = lazy(() => import('./components/Dashboard/AdminDashboard'));
const VolunteerDashboard = lazy(() => import('./components/Dashboard/VolunteerDashboard'));
const ChatbotInterface = lazy(() => import('./components/Chatbot/ChatbotInterface'));
const BookingSystem = lazy(() => import('./components/Booking/BookingSystem'));
const ResourceCenter = lazy(() => import('./components/Resources/ResourceCenter'));
const ForumInterface = lazy(() => import('./components/Forum/ForumInterface'));
const AssessmentInterface = lazy(() => import('./components/Assessment/AssessmentInterface'));
const UserManagement = lazy(() => import('./components/Admin/UserManagement'));
const AnalyticsDashboard = lazy(() => import('./components/Admin/AnalyticsDashboard'));
const TrainingCenter = lazy(() => import('./components/Training/TrainingCenter'));

// Loading component with improved UX
const LoadingScreen = React.memo(() => (
  <div className="min-h-screen bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
    <div className="text-center p-8">
      <div className="w-20 h-20 mx-auto mb-6 relative">
        <div className="absolute inset-0 rounded-full border-4 border-primary/30"></div>
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
      </div>
      <h2 className="text-2xl font-bold text-primary mb-2">SoulBridge</h2>
      <p className="text-base-content/70 mb-4">Connecting hearts, healing minds</p>
      <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
      <p className="text-sm text-base-content/50 mt-4">Loading your personalized experience...</p>
    </div>
  </div>
));

// Component fallback for lazy loading
const ComponentFallback = React.memo(() => (
  <div className="flex items-center justify-center min-h-96">
    <div className="loading loading-spinner loading-lg text-primary"></div>
  </div>
));

const MainApp: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [showRegister, setShowRegister] = useState(false);
  const [showVolunteerLogin, setShowVolunteerLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Memoize callbacks to prevent unnecessary re-renders
  const handleSwitchToRegister = useCallback(() => setShowRegister(true), []);
  const handleSwitchToLogin = useCallback(() => setShowRegister(false), []);
  const handleSwitchToVolunteer = useCallback(() => setShowVolunteerLogin(true), []);
  const handleCloseVolunteer = useCallback(() => setShowVolunteerLogin(false), []);
  const handleVolunteerSuccess = useCallback(() => setShowVolunteerLogin(false), []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {showVolunteerLogin ? (
            <VolunteerLoginForm 
              onClose={handleCloseVolunteer}
              onSuccess={handleVolunteerSuccess}
            />
          ) : showRegister ? (
            <RegisterForm onSwitchToLogin={handleSwitchToLogin} />
          ) : (
            <LoginForm 
              onSwitchToRegister={handleSwitchToRegister}
              onSwitchToVolunteer={handleSwitchToVolunteer}
            />
          )}
        </div>
      </div>
    );
  }

  // Memoize content rendering to prevent unnecessary recalculations
  const renderContent = useCallback(() => {
    switch (activeTab) {
      case 'dashboard':
        if (user?.role === 'student') return <StudentDashboard setActiveTab={setActiveTab} />;
        if (user?.role === 'counsellor') return <CounsellorDashboard setActiveTab={setActiveTab} />;
        if (user?.role === 'admin') return <AdminDashboard setActiveTab={setActiveTab} />;
        if (user?.role === 'volunteer') return <VolunteerDashboard setActiveTab={setActiveTab} />;
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
      default:
        return <div className="text-center text-base-content/70">Feature coming soon...</div>;
    }
  }, [activeTab, user?.role, setActiveTab]);

  // Memoize drawer class calculation
  const drawerClass = useMemo(() => 
    `drawer ${sidebarOpen ? 'lg:drawer-open' : ''}`, 
    [sidebarOpen]
  );

  return (
    <div className={drawerClass}>
      <input id="drawer-toggle" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 p-6 bg-base-200 transition-all duration-300">
          <Suspense fallback={<ComponentFallback />}>
            {renderContent()}
          </Suspense>
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
    <AuthProvider>
      <LanguageProvider>
        <BookingProvider>
          <MoodProvider>
            <EmergencyProvider>
              <FeedbackProvider>
                <MainApp />
              </FeedbackProvider>
            </EmergencyProvider>
          </MoodProvider>
        </BookingProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;