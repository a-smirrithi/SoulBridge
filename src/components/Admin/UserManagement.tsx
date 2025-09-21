import React, { useState } from 'react';
import { Users, Edit, Trash2, Plus, Search, Filter } from 'lucide-react';
import { mockUsers } from '../../data/mockData';
import { User } from '../../types';
import { format } from 'date-fns';

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as 'student' | 'counsellor' | 'volunteer' | 'admin',
  });

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(user);
    setShowAddForm(false);
    setNewUser({ name: '', email: '', role: 'student' });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
    });
  };

  const handleUpdateUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      const userIndex = mockUsers.findIndex(u => u.id === editingUser.id);
      if (userIndex !== -1) {
        mockUsers[userIndex] = {
          ...mockUsers[userIndex],
          ...newUser,
        };
      }
      setEditingUser(null);
      setNewUser({ name: '', email: '', role: 'student' });
    }
  };

  const handleDeleteUser = (userId: string) => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      mockUsers.splice(userIndex, 1);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'student': return 'badge-info';
      case 'counsellor': return 'badge-success';
      case 'volunteer': return 'badge-secondary';
      case 'admin': return 'badge-warning';
      default: return 'badge-ghost';
    }
  };

  const roleStats = {
    total: mockUsers.length,
    students: mockUsers.filter(u => u.role === 'student').length,
    counsellors: mockUsers.filter(u => u.role === 'counsellor').length,
    volunteers: mockUsers.filter(u => u.role === 'volunteer').length,
    admins: mockUsers.filter(u => u.role === 'admin').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-base-content/70">Manage platform users and their roles</p>
        </div>
        
        <button 
          onClick={() => setShowAddForm(true)}
          className="btn btn-primary"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Total Users</div>
          <div className="stat-value text-primary">{roleStats.total}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Students</div>
          <div className="stat-value text-info">{roleStats.students}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Counsellors</div>
          <div className="stat-value text-success">{roleStats.counsellors}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Volunteers</div>
          <div className="stat-value text-purple-500">{roleStats.volunteers}</div>
        </div>
        <div className="stat bg-base-100 shadow rounded-lg">
          <div className="stat-title">Admins</div>
          <div className="stat-value text-warning">{roleStats.admins}</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="form-control flex-1">
          <div className="input-group">
            <span className="bg-base-200">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search users..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="form-control">
          <select
            className="select select-bordered"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="counsellor">Counsellors</option>
            <option value="volunteer">Volunteers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Add/Edit User Form Modal */}
      {(showAddForm || editingUser) && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            
            <form onSubmit={editingUser ? handleUpdateUser : handleAddUser} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered"
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Role</span>
                </label>
                <select
                  className="select select-bordered"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as any})}
                >
                  <option value="student">Student</option>
                  <option value="counsellor">Counsellor</option>
                  <option value="volunteer">Volunteer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="modal-action">
                <button 
                  type="button" 
                  className="btn" 
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingUser(null);
                    setNewUser({ name: '', email: '', role: 'student' });
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Update' : 'Add'} User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="card bg-base-100 shadow">
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center space-x-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                            <span className="text-xs">{user.name.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold">{user.name}</div>
                          <div className="text-sm opacity-50">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className={`badge ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </div>
                    </td>
                    <td>
                      {format(new Date(user.createdAt), 'MMM d, yyyy')}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditUser(user)}
                          className="btn btn-ghost btn-xs"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user.id)}
                          className="btn btn-ghost btn-xs text-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No users found</h3>
          <p className="text-base-content/70">
            {searchTerm || roleFilter !== 'all' 
              ? "Try adjusting your search or filter criteria."
              : "No users available at the moment."
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;