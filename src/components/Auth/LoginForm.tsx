import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onSwitchToVolunteer?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister, onSwitchToVolunteer }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo accounts for easy testing
  const demoAccounts = [
    { role: 'Student', email: 'student@soulbridge.com', password: 'password123' },
    { role: 'Counsellor', email: 'counsellor@soulbridge.com', password: 'password123' },
    { role: 'Admin', email: 'admin@soulbridge.com', password: 'password123' },
  ];

  const handleVolunteerDemo = () => {
    if (onSwitchToVolunteer) {
      onSwitchToVolunteer();
      // Pre-fill the volunteer login form when it opens
      setTimeout(() => {
        const volunteerEmail = document.querySelector('input[name="email"]') as HTMLInputElement;
        const volunteerPassword = document.querySelector('input[name="password"]') as HTMLInputElement;
        const volunteerCertId = document.querySelector('input[name="certificationId"]') as HTMLInputElement;
        
        if (volunteerEmail) volunteerEmail.value = 'volunteer@soulbridge.com';
        if (volunteerPassword) volunteerPassword.value = 'volunteer123';
        if (volunteerCertId) volunteerCertId.value = 'MHFA-2024-001';
      }, 100);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="text-center mb-6">
          <img 
            src="/logo.png" 
            alt="SoulBridge Logo" 
            className="w-16 h-16 mx-auto mb-4"
          />
          <h2 className="card-title text-2xl justify-center">Welcome to SoulBridge</h2>
          <p className="text-base-content/70">Sign in to continue</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <div className="input-group">
              <span className="bg-base-200">
                <Mail className="w-5 h-5" />
              </span>
              <input
                type="email"
                placeholder="your.email@example.com"
                className="input input-bordered w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <div className="input-group">
              <span className="bg-base-200">
                <Lock className="w-5 h-5" />
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Your password"
                className="input input-bordered w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="btn btn-ghost btn-square"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="divider">Demo Accounts</div>
        
        <div className="grid grid-cols-1 gap-2">
          {demoAccounts.map((account, index) => (
            <button
              key={index}
              className="btn btn-outline btn-sm"
              onClick={() => {
                setEmail(account.email);
                setPassword(account.password);
              }}
            >
              Demo {account.role}
            </button>
          ))}
          
          {/* Special Volunteer Demo Button */}
          <button
            className="btn btn-secondary btn-sm flex items-center gap-2"
            onClick={handleVolunteerDemo}
          >
            Demo Volunteer Moderator
          </button>
        </div>

        <div className="text-center mt-4 space-y-3">
          <p className="text-sm">
            Don't have an account?{' '}
            <button
              type="button"
              className="link link-primary"
              onClick={onSwitchToRegister}
            >
              Sign up
            </button>
          </p>
          
          {onSwitchToVolunteer && (
            <div className="space-y-2">
              <div className="divider text-xs">Volunteer Access</div>
              <button
                type="button"
                className="btn btn-outline btn-secondary btn-sm w-full"
                onClick={onSwitchToVolunteer}
              >
                🛡️ Volunteer Portal Access
              </button>
              <p className="text-xs text-base-content/60">
                For trained mental health volunteers only
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;