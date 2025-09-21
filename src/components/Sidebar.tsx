import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  Users, 
  BarChart3, 
  UserCog,
  Home,
  Shield,
  HelpCircle,
  Star
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isVisible?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isVisible = true }) => {
  const { user } = useAuth();

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    switch (user?.role) {
      case 'student':
        return [
          ...baseItems,
          { id: 'chatbot', label: 'Chat with Aasha', icon: MessageCircle },
          { id: 'booking', label: 'Book Session', icon: Calendar },
          { id: 'resources', label: 'Resources', icon: BookOpen },
          { id: 'forum', label: 'Peer Forum', icon: Users },
          { id: 'feedback', label: 'My Feedback & Ratings', icon: Star },
        ];
      case 'counsellor':
        return [
          ...baseItems,
          { id: 'bookings', label: 'My Bookings', icon: Calendar },
          { id: 'forum', label: 'Forum', icon: Users },
          { id: 'resources', label: 'Manage Resources', icon: BookOpen },
        ];
      case 'admin':
        return [
          ...baseItems,
          { id: 'analytics', label: 'Analytics', icon: BarChart3 },
          { id: 'users', label: 'Manage Users', icon: UserCog },
          { id: 'bookings', label: 'All Bookings', icon: Calendar },
          { id: 'forum', label: 'Moderate Forum', icon: Users },
          { id: 'resources', label: 'Manage Resources', icon: BookOpen },
        ];
      case 'volunteer':
        return [
          ...baseItems,
          { id: 'forum', label: 'Moderate Forum', icon: Shield },
          { id: 'resources', label: 'Manage Resources', icon: BookOpen },
          { id: 'training', label: 'Training Center', icon: HelpCircle },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className={`drawer-side transition-transform duration-300 ${isVisible ? '' : 'lg:-translate-x-full'}`}>
      <label htmlFor="drawer-toggle" className="drawer-overlay"></label>
      <aside className="w-64 min-h-full bg-base-200">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4 capitalize">{user?.role} Portal</h2>
          <ul className="menu menu-vertical px-0">
            {menuItems.map(item => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <a
                    onClick={() => {
                      if (item.id === 'chatbot') {
                        window.open('https://app.agentx.so/shared-chat/?agent=68c69f30b8037d766c21f4b7', '_blank');
                      } else {
                        setActiveTab(item.id);
                      }
                    }}
                    className={`flex items-center gap-3 ${activeTab === item.id ? 'active' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;