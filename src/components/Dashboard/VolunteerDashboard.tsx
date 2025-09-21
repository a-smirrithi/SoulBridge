import React, { useState } from 'react';
import { Shield, MessageSquare, BookOpen, Users, AlertTriangle, Clock, TrendingUp, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockForumPosts, mockUsers, mockPsychoeducationalResources } from '../../data/mockData';

interface VolunteerDashboardProps {
  setActiveTab: (tab: string) => void;
}

const VolunteerDashboard: React.FC<VolunteerDashboardProps> = ({ setActiveTab }) => {
  const { user } = useAuth() || {};
  const [showResourceForm, setShowResourceForm] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'video' as const,
    language: 'en' as const,
    category: 'wellness' as const,
    url: '',
    duration: 0,
    difficulty: 'beginner' as const,
    tags: ''
  });

  const currentLang = 'en'; // Force English for volunteer portal
  
  const translations = {
    en: {
      title: 'Volunteer Moderator Dashboard',
      welcome: 'Welcome back',
      subtitle: 'Your mental health advocacy makes a difference',
      stats: 'Moderation Statistics',
      flaggedPosts: 'Flagged Posts',
      postsReviewed: 'Posts Reviewed Today',
      helpfulReplies: 'Helpful Replies',
      resourcesAdded: 'Resources Added',
      recentActivity: 'Recent Moderation Activity',
      addResource: 'Add New Resource',
      forum: 'Moderate Forum',
      resources: 'Manage Resources',
      training: 'Training Materials',
      createResource: 'Create Resource',
      resourceTitle: 'Resource Title',
      resourceDescription: 'Description',
      resourceType: 'Type',
      language: 'Language',
      category: 'Category',
      url: 'URL',
      duration: 'Duration (minutes)',
      difficulty: 'Difficulty Level',
      tags: 'Tags (comma separated)',
      submit: 'Add Resource',
      cancel: 'Cancel'
    }
  };

  const t = translations[currentLang];

  // Calculate volunteer stats
  const flaggedPostsCount = mockForumPosts.filter(post => (post.flagCount || 0) > 0).length;
  const pendingPostsCount = mockForumPosts.filter(post => !post.isModerated).length;
  const volunteerRepliesCount = mockForumPosts.reduce((count, post) => 
    count + post.replies.filter(reply => reply.userRole === 'volunteer').length, 0
  );
  const resourcesAddedByVolunteers = mockPsychoeducationalResources.length;

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    
    const resource = {
      id: `vol-${Date.now()}`,
      title: newResource.title,
      description: newResource.description,
      type: newResource.type,
      language: newResource.language,
      category: newResource.category,
      url: newResource.url,
      duration: newResource.duration,
      difficulty: newResource.difficulty,
      tags: newResource.tags.split(',').map(tag => tag.trim()),
      createdAt: new Date().toISOString(),
      rating: 0,
      views: 0
    };

    // Add to resources (in real app, this would be an API call)
    mockPsychoeducationalResources.push(resource);
    
    // Reset form
    setNewResource({
      title: '',
      description: '',
      type: 'video',
      language: 'en',
      category: 'wellness',
      url: '',
      duration: 0,
      difficulty: 'beginner',
      tags: ''
    });
    setShowResourceForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            {t.title}
          </h1>
          <p className="text-base-content/70 mt-1">
            {t.welcome}, {user?.name}! {t.subtitle}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowResourceForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            {t.addResource}
          </button>
        </div>
      </div>

      {/* Volunteer Certification Badge */}
      <div className="alert alert-info">
        <Shield className="w-6 h-6" />
        <div>
          <h3 className="font-bold">Certified Mental Health Volunteer</h3>
          <div className="text-sm">
            Certification: {user?.certifications?.[0] || 'Mental Health First Aid'} | 
            Training Date: {user?.trainingDate ? new Date(user.trainingDate).toLocaleDateString() : 'June 2024'}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-error">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div className="stat-title">{t.flaggedPosts}</div>
          <div className="stat-value text-error">{flaggedPostsCount}</div>
          <div className="stat-desc">Need your attention</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-warning">
            <Clock className="w-8 h-8" />
          </div>
          <div className="stat-title">{t.postsReviewed}</div>
          <div className="stat-value text-warning">{pendingPostsCount}</div>
          <div className="stat-desc">Pending approval</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-success">
            <MessageSquare className="w-8 h-8" />
          </div>
          <div className="stat-title">{t.helpfulReplies}</div>
          <div className="stat-value text-success">{volunteerRepliesCount}</div>
          <div className="stat-desc">This month</div>
        </div>

        <div className="stat bg-base-100 shadow-lg rounded-lg">
          <div className="stat-figure text-info">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="stat-title">{t.resourcesAdded}</div>
          <div className="stat-value text-info">{resourcesAddedByVolunteers}</div>
          <div className="stat-desc">Total contributed</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => setActiveTab('forum')}
          className="card bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 hover:shadow-lg transition-shadow"
        >
          <div className="card-body text-center">
            <MessageSquare className="w-16 h-16 text-primary mx-auto mb-4" />
            <h3 className="card-title justify-center">{t.forum}</h3>
            <p>Review flagged posts and moderate discussions</p>
            {flaggedPostsCount > 0 && (
              <div className="badge badge-error">{flaggedPostsCount} flagged</div>
            )}
          </div>
        </button>

        <button
          onClick={() => setActiveTab('resources')}
          className="card bg-gradient-to-br from-success/10 to-accent/10 border border-success/20 hover:shadow-lg transition-shadow"
        >
          <div className="card-body text-center">
            <BookOpen className="w-16 h-16 text-success mx-auto mb-4" />
            <h3 className="card-title justify-center">{t.resources}</h3>
            <p>Add and manage mental health resources</p>
          </div>
        </button>

        <button
          onClick={() => setActiveTab('training')}
          className="card bg-gradient-to-br from-info/10 to-warning/10 border border-info/20 hover:shadow-lg transition-shadow"
        >
          <div className="card-body text-center">
            <Users className="w-16 h-16 text-info mx-auto mb-4" />
            <h3 className="card-title justify-center">{t.training}</h3>
            <p>Access volunteer training materials</p>
          </div>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title mb-4">
            <TrendingUp className="w-5 h-5" />
            {t.recentActivity}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm">Approved post "Managing exam stress" in Academic forum</span>
              <span className="text-xs text-base-content/50 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="w-2 h-2 bg-warning rounded-full"></div>
              <span className="text-sm">Flagged inappropriate content for review</span>
              <span className="text-xs text-base-content/50 ml-auto">4 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-base-200 rounded-lg">
              <div className="w-2 h-2 bg-info rounded-full"></div>
              <span className="text-sm">Added new meditation resource in Hindi</span>
              <span className="text-xs text-base-content/50 ml-auto">1 day ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Resource Modal */}
      {showResourceForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card bg-base-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="card-body">
              <h3 className="card-title mb-4">{t.createResource}</h3>
              <form onSubmit={handleAddResource} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">{t.resourceTitle}</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">{t.resourceDescription}</span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-24"
                    value={newResource.description}
                    onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">{t.resourceType}</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={newResource.type}
                      onChange={(e) => setNewResource({ ...newResource, type: e.target.value as any })}
                    >
                      <option value="video">Video</option>
                      <option value="audio">Audio</option>
                      <option value="article">Article</option>
                      <option value="guide">Guide</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">{t.language}</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={newResource.language}
                      onChange={(e) => setNewResource({ ...newResource, language: e.target.value as any })}
                    >
                      <option value="en">English</option>
                      <option value="hi">हिंदी</option>
                      <option value="ta">தமிழ்</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">{t.category}</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={newResource.category}
                      onChange={(e) => setNewResource({ ...newResource, category: e.target.value as any })}
                    >
                      <option value="wellness">Wellness</option>
                      <option value="anxiety">Anxiety</option>
                      <option value="depression">Depression</option>
                      <option value="stress">Stress</option>
                      <option value="relationships">Relationships</option>
                      <option value="academic">Academic</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">{t.difficulty}</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={newResource.difficulty}
                      onChange={(e) => setNewResource({ ...newResource, difficulty: e.target.value as any })}
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text">{t.url}</span>
                  </label>
                  <input
                    type="url"
                    className="input input-bordered w-full"
                    value={newResource.url}
                    onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                    placeholder="https://..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="label">
                      <span className="label-text">{t.duration}</span>
                    </label>
                    <input
                      type="number"
                      className="input input-bordered w-full"
                      value={newResource.duration}
                      onChange={(e) => setNewResource({ ...newResource, duration: parseInt(e.target.value) || 0 })}
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text">{t.tags}</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered w-full"
                      value={newResource.tags}
                      onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                      placeholder="meditation, relaxation, stress"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowResourceForm(false)}
                    className="btn btn-ghost"
                  >
                    {t.cancel}
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {t.submit}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VolunteerDashboard;