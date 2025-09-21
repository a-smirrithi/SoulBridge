import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Menu, X } from 'lucide-react';

interface NavbarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="navbar bg-primary text-primary-content shadow-lg">
      <div className="flex-1">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="btn btn-ghost btn-circle"
            title={sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <img 
            src="/logo.png" 
            alt="SoulBridge Logo" 
            className="w-8 h-8"
          />
          <h1 className="text-xl font-bold">SoulBridge</h1>
        </div>
      </div>
      
      <div className="flex-none gap-2">
        {/* Mobile drawer toggle */}
        <div className="lg:hidden">
          <label htmlFor="drawer-toggle" className="btn btn-ghost btn-circle">
            <Menu className="w-5 h-5" />
          </label>
        </div>
        
        <div className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
            <User className="w-5 h-5" />
          </div>
          <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 text-base-content rounded-box w-52">
            <li className="menu-title">
              <span>{user.name}</span>
              <span className="text-xs capitalize">{user.role}</span>
            </li>
            <li><a onClick={logout}><LogOut className="w-4 h-4" />Logout</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;