import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Award, Lock } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface VolunteerLoginFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

const VolunteerLoginForm: React.FC<VolunteerLoginFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    certificationId: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { volunteerLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await volunteerLogin(formData.email, formData.password, formData.certificationId);
      if (success) {
        onSuccess();
      } else {
        setError('Invalid credentials or certification ID. Please verify your volunteer credentials.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card bg-base-100 w-full max-w-md">
        <div className="card-body">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-base-content">Volunteer Login</h2>
            <p className="text-base-content/70 mt-2">
              Access your volunteer moderator portal
            </p>
          </div>

          {/* Volunteer Requirements Info */}
          <div className="alert alert-info mb-6">
            <Award className="w-5 h-5" />
            <div className="text-sm">
              <div className="font-semibold">Volunteer Requirements:</div>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Mental Health First Aid Certification</li>
                <li>Completed Platform Training</li>
                <li>Active Certification ID</li>
              </ul>
            </div>
          </div>

          {error && (
            <div className="alert alert-error mb-4">
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                placeholder="volunteer@example.com"
                className="input input-bordered"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your password"
                  className="input input-bordered w-full pr-10"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-base-content/50" />
                  ) : (
                    <Eye className="w-5 h-5 text-base-content/50" />
                  )}
                </button>
              </div>
            </div>

            {/* Certification ID */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Certification ID</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="certificationId"
                  placeholder="MHFA-2024-XXXX"
                  className="input input-bordered w-full pl-10"
                  value={formData.certificationId}
                  onChange={handleChange}
                  required
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-base-content/50" />
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Enter your Mental Health First Aid certification ID
                </span>
              </label>
            </div>

            {/* Demo Credentials Button */}
            <div className="text-center">
              <button
                type="button"
                className="btn btn-outline btn-warning btn-sm"
                onClick={() => {
                  setFormData({
                    email: 'volunteer@soulbridge.com',
                    password: 'volunteer123',
                    certificationId: 'MHFA-2024-001'
                  });
                }}
              >
                🚀 Fill Demo Credentials
              </button>
              <div className="text-xs text-base-content/60 mt-2">
                Click to auto-fill volunteer demo login details
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`btn btn-primary w-full ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Verifying...
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  Login as Volunteer
                </>
              )}
            </button>

            {/* Quick Demo Login */}
            <button
              type="button"
              onClick={async () => {
                setIsLoading(true);
                setError('');
                try {
                  const success = await volunteerLogin('volunteer@soulbridge.com', 'volunteer123', 'MHFA-2024-001');
                  if (success) {
                    onSuccess();
                  } else {
                    setError('Demo login failed. Please try again.');
                  }
                } catch (err) {
                  setError('Demo login failed. Please try again.');
                } finally {
                  setIsLoading(false);
                }
              }}
              className="btn btn-success w-full"
              disabled={isLoading}
            >
              ⚡ Quick Demo Login
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost w-full"
            >
              Cancel
            </button>
          </form>

          {/* Additional Info */}
          <div className="text-center mt-6 pt-4 border-t border-base-300">
            <p className="text-sm text-base-content/60">
              Need help? Contact the platform administrator or complete volunteer training.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerLoginForm;