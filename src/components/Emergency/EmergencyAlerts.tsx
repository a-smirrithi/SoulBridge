import React from 'react';
import { AlertTriangle, Clock, User, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEmergency } from '../../context/EmergencyContext';
import { format } from 'date-fns';

const EmergencyAlerts: React.FC = () => {
  const { user } = useAuth();
  const { getAlertsForUser, acknowledgeAlert, resolveAlert } = useEmergency();
  
  if (!user || (user.role !== 'counsellor' && user.role !== 'admin' && user.role !== 'volunteer')) {
    return null;
  }

  const alerts = getAlertsForUser(user.id, user.role);
  const activeAlerts = alerts.filter(alert => alert.status === 'active');
  const acknowledgedAlerts = alerts.filter(alert => alert.status === 'acknowledged');
  const resolvedAlerts = alerts.filter(alert => alert.status === 'resolved');

  const handleAcknowledge = (alertId: string) => {
    acknowledgeAlert(alertId, user.name);
  };

  const handleResolve = (alertId: string) => {
    resolveAlert(alertId, user.name);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'border-red-500 bg-red-50';
      case 'acknowledged': return 'border-yellow-500 bg-yellow-50';
      case 'resolved': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return 'badge-error';
      case 'acknowledged': return 'badge-warning';
      case 'resolved': return 'badge-success';
      default: return 'badge-ghost';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-red-600 flex items-center gap-2">
          <AlertTriangle className="w-7 h-7" />
          Emergency Alerts Dashboard
        </h1>
        <p className="text-base-content/70">
          Monitor and respond to student emergency requests
        </p>
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg border-l-4 border-red-500">
          <div className="stat-title">Active Alerts</div>
          <div className="stat-value text-red-600">{activeAlerts.length}</div>
          <div className="stat-desc">Requiring immediate attention</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg border-l-4 border-yellow-500">
          <div className="stat-title">Acknowledged</div>
          <div className="stat-value text-yellow-600">{acknowledgedAlerts.length}</div>
          <div className="stat-desc">Being handled</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg border-l-4 border-green-500">
          <div className="stat-title">Resolved</div>
          <div className="stat-value text-green-600">{resolvedAlerts.length}</div>
          <div className="stat-desc">Successfully handled</div>
        </div>
      </div>

      {/* Active Alerts */}
      {activeAlerts.length > 0 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h2 className="card-title text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Active Emergency Alerts
            </h2>
            <div className="space-y-4">
              {activeAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`border-2 rounded-lg p-4 ${getStatusColor(alert.status)}`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <span className="font-semibold">{alert.studentName}</span>
                      <span className={`badge ${getStatusBadge(alert.status)}`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/60">
                      <Clock className="w-4 h-4" />
                      {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
                    </div>
                  </div>
                  
                  <p className="text-base-content mb-4">{alert.message}</p>
                  
                  {alert.location && (
                    <p className="text-sm text-base-content/70 mb-4">
                      <strong>Location:</strong> {alert.location}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAcknowledge(alert.id)}
                      className="btn btn-warning btn-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Acknowledge
                    </button>
                    <button
                      onClick={() => handleResolve(alert.id)}
                      className="btn btn-success btn-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Mark Resolved
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* All Alerts History */}
      <div className="card bg-base-100 shadow">
        <div className="card-body">
          <h2 className="card-title">Alert History</h2>
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              <AlertTriangle className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p>No emergency alerts at this time.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(0, 10).map((alert) => (
                <div
                  key={alert.id}
                  className={`border rounded-lg p-3 ${getStatusColor(alert.status)}`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{alert.studentName}</span>
                      <span className={`badge badge-xs ${getStatusBadge(alert.status)}`}>
                        {alert.status}
                      </span>
                    </div>
                    <span className="text-xs text-base-content/60">
                      {format(new Date(alert.timestamp), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{alert.message}</p>
                  {alert.acknowledgedBy && (
                    <p className="text-xs text-base-content/60 mt-1">
                      Acknowledged by: {alert.acknowledgedBy}
                    </p>
                  )}
                  {alert.resolvedBy && (
                    <p className="text-xs text-base-content/60 mt-1">
                      Resolved by: {alert.resolvedBy}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyAlerts;