import React, { useState } from 'react';
import { Plus, MessageCircle, Search, User, Reply, Filter, Clock, Shield, Flag, Languages } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockForumPosts, mockUsers } from '../../data/mockData';
import { ForumPost, ForumReply } from '../../types';
import { format } from 'date-fns';

const ForumInterface: React.FC = () => {
  const { user } = useAuth() || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [newPost, setNewPost] = useState({ title: '', content: '', language: 'en' });
  const [replyContent, setReplyContent] = useState('');
  const [filterLanguage, setFilterLanguage] = useState<'all' | 'en' | 'hi' | 'ta'>('all');
  const [showModeratorPanel, setShowModeratorPanel] = useState(false);

  const isVolunteer = user?.role === 'volunteer' || user?.role === 'admin';

  const translations = {
    en: {
      title: 'Peer Support Forum',
      newPost: 'New Post',
      searchPlaceholder: 'Search posts...',
      allLanguages: 'All Languages',
      moderatorPanel: 'Moderator Panel',
      createPostTitle: 'Create New Post',
      postTitle: 'Post Title',
      postContent: 'Share your thoughts...',
      language: 'Language',
      submit: 'Submit',
      cancel: 'Cancel',
      reply: 'Reply',
      replies: 'replies',
      replyPlaceholder: 'Write a supportive response...',
      flagPost: 'Flag Post',
      approvePost: 'Approve',
      moderatedBy: 'Moderated by trained volunteers'
    },
    hi: {
      title: 'सहयोगी सहायता मंच',
      newPost: 'नई पोस्ट',
      searchPlaceholder: 'पोस्ट खोजें...',
      allLanguages: 'सभी भाषाएं',
      moderatorPanel: 'मॉडरेटर पैनल',
      createPostTitle: 'नई पोस्ट बनाएं',
      postTitle: 'पोस्ट शीर्षक',
      postContent: 'अपने विचार साझा करें...',
      language: 'भाषा',
      submit: 'जमा करें',
      cancel: 'रद्द करें',
      reply: 'उत्तर',
      replies: 'उत्तर',
      replyPlaceholder: 'एक सहायक प्रतिक्रिया लिखें...',
      flagPost: 'पोस्ट को फ्लैग करें',
      approvePost: 'अनुमोदित करें',
      moderatedBy: 'प्रशिक्षित स्वयंसेवकों द्वारा नियंत्रित'
    },
    ta: {
      title: 'சக ஆதரவு மன்றம்',
      newPost: 'புதிய இடுகை',
      searchPlaceholder: 'இடுகைகளை தேடுங்கள்...',
      allLanguages: 'அனைத்து மொழிகள்',
      moderatorPanel: 'மதிப்பீட்டாளர் பலகம்',
      createPostTitle: 'புதிய இடுகை உருவாக்கவும்',
      postTitle: 'இடுகை தலைப்பு',
      postContent: 'உங்கள் எண்ணங்களை பகிர்ந்து கொள்ளுங்கள்...',
      language: 'மொழி',
      submit: 'சமர்ப்பிக்கவும்',
      cancel: 'ரத்து செய்',
      reply: 'பதில்',
      replies: 'பதில்கள்',
      replyPlaceholder: 'ஒரு ஆதரவான பதிலை எழுதுங்கள்...',
      flagPost: 'இடுகையை கொடியிடுங்கள்',
      approvePost: 'அங்கீகரிக்கவும்',
      moderatedBy: 'பயிற்சி பெற்ற தன்னார்வலர்களால் கட்டுப்படுத்தப்படுகிறது'
    }
  };

  const currentLang = user?.languagePreference || 'en';
  const t = translations[currentLang];

  const filteredPosts = mockForumPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLanguage = filterLanguage === 'all' || post.language === filterLanguage;
    return matchesSearch && matchesLanguage;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    
    const post: ForumPost = {
      id: Date.now().toString(),
      userId: user!.id,
      userName: user!.name,
      userRole: user!.role,
      title: newPost.title,
      content: newPost.content,
      timestamp: new Date().toISOString(),
      replies: [],
      language: newPost.language as 'en' | 'hi' | 'ta',
      isModerated: false,
      flagCount: 0
    };

    mockForumPosts.unshift(post);
    setShowNewPostForm(false);
    setNewPost({ title: '', content: '', language: 'en' });
  };

  const handleReply = (postId: string) => {
    if (!replyContent.trim()) return;

    const post = mockForumPosts.find(p => p.id === postId);
    if (post) {
      const reply: ForumReply = {
        id: `${postId}-${Date.now()}`,
        userId: user!.id,
        userName: user!.name,
        userRole: user!.role,
        content: replyContent,
        timestamp: new Date().toISOString(),
      };

      post.replies.push(reply);
      setReplyContent('');
      setSelectedPost(null);
    }
  };

  const handleFlagPost = (postId: string) => {
    const post = mockForumPosts.find(p => p.id === postId);
    if (post) {
      post.flagCount = (post.flagCount || 0) + 1;
    }
  };

  const handleApprovePost = (postId: string) => {
    const post = mockForumPosts.find(p => p.id === postId);
    if (post) {
      post.isModerated = true;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'counsellor': return 'badge-success';
      case 'volunteer': return 'badge-primary';
      case 'admin': return 'badge-error';
      default: return 'badge-ghost';
    }
  };

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'hi': return '🇮🇳 हिं';
      case 'ta': return '🇮🇳 த';
      default: return '🇺🇸 EN';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-base-content">{t.title}</h1>
          <p className="text-base-content/70 mt-1">{t.moderatedBy}</p>
        </div>
        <div className="flex gap-2">
          {isVolunteer && (
            <button
              onClick={() => setShowModeratorPanel(!showModeratorPanel)}
              className="btn btn-outline btn-sm"
            >
              <Shield className="w-4 h-4" />
              {t.moderatorPanel}
            </button>
          )}
          <button
            onClick={() => setShowNewPostForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            {t.newPost}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50 w-5 h-5" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            className="input input-bordered w-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="select select-bordered"
          value={filterLanguage}
          onChange={(e) => setFilterLanguage(e.target.value as any)}
        >
          <option value="all">{t.allLanguages}</option>
          <option value="en">English</option>
          <option value="hi">हिंदी</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>

      {/* Moderator Panel */}
      {showModeratorPanel && isVolunteer && (
        <div className="card bg-warning/10 border border-warning">
          <div className="card-body">
            <h3 className="card-title text-warning">
              <Shield className="w-5 h-5" />
              Moderator Panel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="stat">
                <div className="stat-title">Flagged Posts</div>
                <div className="stat-value text-error">
                  {mockForumPosts.filter(p => (p.flagCount || 0) > 0).length}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Pending Approval</div>
                <div className="stat-value text-warning">
                  {mockForumPosts.filter(p => !p.isModerated).length}
                </div>
              </div>
              <div className="stat">
                <div className="stat-title">Active Volunteers</div>
                <div className="stat-value text-success">
                  {mockUsers.filter(u => u.role === 'volunteer').length}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Post Form */}
      {showNewPostForm && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <h3 className="card-title">{t.createPostTitle}</h3>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input
                type="text"
                placeholder={t.postTitle}
                className="input input-bordered w-full"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
              <textarea
                placeholder={t.postContent}
                className="textarea textarea-bordered w-full h-32"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
              />
              <div className="flex gap-4">
                <select
                  className="select select-bordered"
                  value={newPost.language}
                  onChange={(e) => setNewPost({ ...newPost, language: e.target.value })}
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn btn-primary">
                  {t.submit}
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPostForm(false)}
                  className="btn btn-ghost"
                >
                  {t.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <div key={post.id} className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-base-content/50" />
                    <span className="font-medium">{post.userName}</span>
                    <span className={`badge badge-sm ${getRoleColor(post.userRole)}`}>
                      {post.userRole}
                    </span>
                    <span className="badge badge-sm badge-outline">
                      {getLanguageFlag(post.language || 'en')}
                    </span>
                    {!post.isModerated && (
                      <span className="badge badge-warning badge-sm">Pending Review</span>
                    )}
                    {(post.flagCount || 0) > 0 && (
                      <span className="badge badge-error badge-sm">
                        {post.flagCount} flags
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
                  <p className="text-base-content/80 mb-4">{post.content}</p>
                  <div className="flex items-center gap-4 text-sm text-base-content/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {format(new Date(post.timestamp), 'MMM d, yyyy h:mm a')}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {post.replies.length} {t.replies}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFlagPost(post.id)}
                    className="btn btn-ghost btn-sm"
                    title={t.flagPost}
                  >
                    <Flag className="w-4 h-4" />
                  </button>
                  {isVolunteer && (
                    <button
                      onClick={() => handleApprovePost(post.id)}
                      className="btn btn-success btn-sm"
                      title={t.approvePost}
                    >
                      <Shield className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Replies */}
              {post.replies.length > 0 && (
                <div className="border-t pt-4 space-y-3">
                  {post.replies.map((reply) => (
                    <div key={reply.id} className="bg-base-200 p-3 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-3 h-3 text-base-content/50" />
                        <span className="text-sm font-medium">{reply.userName}</span>
                        <span className={`badge badge-xs ${getRoleColor(reply.userRole)}`}>
                          {reply.userRole}
                        </span>
                        <span className="text-xs text-base-content/60">
                          {format(new Date(reply.timestamp), 'MMM d, h:mm a')}
                        </span>
                      </div>
                      <p className="text-sm">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Reply Form */}
              <div className="border-t pt-4">
                {selectedPost === post.id ? (
                  <div className="space-y-3">
                    <textarea
                      placeholder={t.replyPlaceholder}
                      className="textarea textarea-bordered w-full"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleReply(post.id)}
                        className="btn btn-primary btn-sm"
                        disabled={!replyContent.trim()}
                      >
                        {t.reply}
                      </button>
                      <button
                        onClick={() => setSelectedPost(null)}
                        className="btn btn-ghost btn-sm"
                      >
                        {t.cancel}
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedPost(post.id)}
                    className="btn btn-ghost btn-sm"
                  >
                    <Reply className="w-4 h-4" />
                    {t.reply}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
          <p className="text-base-content/60">No posts found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default ForumInterface;