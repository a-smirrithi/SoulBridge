import React, { useState } from 'react';
import { Book, Video, Headphones, Download, Search, Filter, Star, Clock, Users, Globe, Play, FileText, Bookmark, ExternalLink, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { mockPsychoeducationalResources } from '../../data/mockData';
import { PsychoeducationalResource } from '../../types';

const ResourceCenter: React.FC = () => {
  const { user } = useAuth() || {};
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLanguage, setSelectedLanguage] = useState<'all' | 'en' | 'hi' | 'ta'>('all');
  const [bookmarkedResources, setBookmarkedResources] = useState<string[]>([]);
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

  const translations = {
    en: {
      title: 'Psychoeducational Resource Hub',
      subtitle: 'Evidence-based mental health resources in multiple languages',
      searchPlaceholder: 'Search resources...',
      allCategories: 'All Categories',
      allTypes: 'All Types',
      allLanguages: 'All Languages',
      viewResource: 'View Resource',
      bookmark: 'Bookmark',
      bookmarked: 'Bookmarked',
      noResults: 'No resources found matching your criteria.',
      featuredTitle: 'Featured Resources',
      crisisSupport: 'Crisis Support Hotline',
      crisisDesc: '24/7 support for mental health emergencies',
      getHelpNow: 'Get Help Now',
      weeklyWebinars: 'Weekly Wellness Webinars',
      webinarDesc: 'Join our live sessions with mental health experts',
      viewSchedule: 'View Schedule',
      duration: 'Duration',
      rating: 'Rating',
      language: 'Language'
    },
    hi: {
      title: 'मनोशिक्षा संसाधन केंद्र',
      subtitle: 'कई भाषाओं में साक्ष्य-आधारित मानसिक स्वास्थ्य संसाधन',
      searchPlaceholder: 'संसाधन खोजें...',
      allCategories: 'सभी श्रेणियां',
      allTypes: 'सभी प्रकार',
      allLanguages: 'सभी भाषाएं',
      viewResource: 'संसाधन देखें',
      bookmark: 'बुकमार्क',
      bookmarked: 'बुकमार्क किया गया',
      noResults: 'आपके मानदंडों से मेल खाने वाले कोई संसाधन नहीं मिले।',
      featuredTitle: 'विशेष संसाधन',
      crisisSupport: 'संकट सहायता हॉटलाइन',
      crisisDesc: 'मानसिक स्वास्थ्य आपातकाल के लिए 24/7 सहायता',
      getHelpNow: 'अभी मदद लें',
      weeklyWebinars: 'साप्ताहिक कल्याण वेबिनार',
      webinarDesc: 'मानसिक स्वास्थ्य विशेषज्ञों के साथ हमारे लाइव सत्र में शामिल हों',
      viewSchedule: 'शेड्यूल देखें',
      duration: 'अवधि',
      rating: 'रेटिंग',
      language: 'भाषा'
    },
    ta: {
      title: 'உளவியல் கல்வி வளக் கூடம்',
      subtitle: 'பல மொழிகளில் சான்று அடிப்படையிலான மனநல வளங்கள்',
      searchPlaceholder: 'வளங்களைத் தேடுங்கள்...',
      allCategories: 'அனைத்து வகைகள்',
      allTypes: 'அனைத்து வகைகள்',
      allLanguages: 'அனைத்து மொழிகள்',
      viewResource: 'வளத்தைப் பார்க்கவும்',
      bookmark: 'புக்மார்க்',
      bookmarked: 'புக்மார்க் செய்யப்பட்டது',
      noResults: 'உங்கள் அளவுகோல்களுக்குப் பொருந்தும் வளங்கள் எதுவும் கிடைக்கவில்லை.',
      featuredTitle: 'சிறப்பு வளங்கள்',
      crisisSupport: 'நெருக்கடி ஆதரவு ஹாட்லைன்',
      crisisDesc: 'மனநல அவசரநிலைகளுக்கு 24/7 ஆதரவு',
      getHelpNow: 'இப்போது உதவி பெறுங்கள்',
      weeklyWebinars: 'வாராந்திர நல்வாழ்வு வலை விவாதங்கள்',
      webinarDesc: 'மனநல நிபுணர்களுடன் எங்கள் நேரடி அமர்வுகளில் சேருங்கள்',
      viewSchedule: 'அட்டவணையைப் பார்க்கவும்',
      duration: 'கால அளவு',
      rating: 'மதிப்பீடு',
      language: 'மொழி'
    }
  };

  const currentLang = user?.languagePreference || 'en';
  const t = translations[currentLang];

  const categories = [
    { value: 'all', label: t.allCategories },
    { value: 'anxiety', label: 'Anxiety / चिंता / கவலை' },
    { value: 'depression', label: 'Depression / अवसाद / மனச்சோர்வு' },
    { value: 'stress', label: 'Stress / तनाव / மன அழுத்தம்' },
    { value: 'relationships', label: 'Relationships / रिश्ते / உறவுகள்' },
    { value: 'academic', label: 'Academic / शैक्षणिक / கல்வி' },
    { value: 'wellness', label: 'Wellness / कल्याण / நல்வாழ்வு' }
  ];

  const types = [
    { value: 'all', label: t.allTypes },
    { value: 'video', label: 'Videos / वीडियो / வீடியோ' },
    { value: 'audio', label: 'Audio / ऑडियो / ஆடியோ' },
    { value: 'article', label: 'Articles / लेख / கட்டுரைகள்' },
    { value: 'guide', label: 'Guides / गाइड / வழிகாட்டிகள்' }
  ];

  const languages = [
    { value: 'all', label: t.allLanguages },
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिंदी' },
    { value: 'ta', label: 'தமிழ்' }
  ];

  const filteredResources = mockPsychoeducationalResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesType = selectedType === 'all' || resource.type === selectedType;
    const matchesLanguage = selectedLanguage === 'all' || resource.language === selectedLanguage;
    
    return matchesSearch && matchesCategory && matchesType && matchesLanguage;
  });

  const toggleBookmark = (resourceId: string) => {
    setBookmarkedResources(prev => 
      prev.includes(resourceId) 
        ? prev.filter(id => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-5 h-5 text-error" />;
      case 'audio':
        return <Headphones className="w-5 h-5 text-success" />;
      case 'article':
        return <FileText className="w-5 h-5 text-primary" />;
      case 'guide':
        return <Book className="w-5 h-5 text-secondary" />;
      default:
        return <Book className="w-5 h-5 text-base-content/50" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'anxiety':
        return 'badge badge-warning';
      case 'depression':
        return 'badge badge-info';
      case 'stress':
        return 'badge badge-error';
      case 'relationships':
        return 'badge badge-secondary';
      case 'academic':
        return 'badge badge-primary';
      case 'wellness':
        return 'badge badge-success';
      default:
        return 'badge badge-ghost';
    }
  };

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'hi': return '🇮🇳 हिं';
      case 'ta': return '🇮🇳 த';
      default: return '🇺🇸 EN';
    }
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    
    const resource = {
      id: `res-${Date.now()}`,
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-center flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-base-content flex items-center justify-center gap-2">
            <Globe className="w-8 h-8 text-primary" />
            {t.title}
          </h1>
          <p className="text-base-content/70">{t.subtitle}</p>
        </div>
        
        {/* Add Resource Button for Counsellors, Admins, and Volunteers */}
        {(user?.role === 'counsellor' || user?.role === 'admin' || user?.role === 'volunteer') && (
          <button
            onClick={() => setShowResourceForm(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            Add Resource
          </button>
        )}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map(category => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          {types.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>

        <select
          className="select select-bordered"
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value as any)}
        >
          {languages.map(language => (
            <option key={language.value} value={language.value}>
              {language.label}
            </option>
          ))}
        </select>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredResources.map((resource) => (
          <div key={resource.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
              <div className="flex items-start justify-between mb-2">
                <h3 className="card-title text-lg line-clamp-2 flex-1">{resource.title}</h3>
                <div className="flex items-center gap-2 ml-2">
                  {getTypeIcon(resource.type)}
                  {resource.url.includes('http') && (
                    <span className="badge badge-xs badge-outline" title="External Resource">
                      🔗
                    </span>
                  )}
                  <button
                    onClick={() => toggleBookmark(resource.id)}
                    className={`btn btn-ghost btn-sm ${bookmarkedResources.includes(resource.id) ? 'text-warning' : 'text-base-content/50'}`}
                    title={bookmarkedResources.includes(resource.id) ? t.bookmarked : t.bookmark}
                  >
                    <Bookmark className={`w-4 h-4 ${bookmarkedResources.includes(resource.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>
              
              <p className="text-base-content/70 text-sm mb-4 line-clamp-3">
                {resource.description}
              </p>

              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className={`${getCategoryColor(resource.category)} badge-sm`}>
                  {resource.category}
                </span>
                <span className="badge badge-sm badge-outline">
                  {getLanguageFlag(resource.language)}
                </span>
              </div>

              <div className="flex items-center justify-between text-sm text-base-content/60 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {resource.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-warning text-warning" />
                  {resource.rating}
                </span>
              </div>

              <div className="card-actions justify-between">
                <span className="text-xs text-base-content/50">
                  {resource.views.toLocaleString()} views
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(resource.url, '_blank')}
                    className="btn btn-primary btn-sm"
                  >
                    <Play className="w-4 h-4" />
                    {resource.url.includes('http') ? 'Open Link' : t.viewResource}
                  </button>
                  {resource.url.includes('http') && (
                    <button
                      onClick={() => window.open(resource.url, '_blank')}
                      className="btn btn-outline btn-sm"
                      title="Download/Access Resource"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredResources.length === 0 && (
        <div className="text-center py-12">
          <Book className="w-16 h-16 text-base-content/30 mx-auto mb-4" />
          <p className="text-base-content/60">{t.noResults}</p>
        </div>
      )}

      {/* Downloadable Resources Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-base-content mb-6 flex items-center gap-2">
          <Download className="w-6 h-6 text-primary" />
          Free Downloadable Mental Health Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
            <div className="card-body text-center">
              <Video className="w-12 h-12 text-primary mx-auto mb-2" />
              <h3 className="font-bold">🎥 YouTube Mental Health Videos</h3>
              <p className="text-sm">Guided meditations, breathing exercises, wellness content</p>
              <button 
                onClick={() => window.open('https://www.youtube.com/results?search_query=mental+health+meditation+relaxation', '_blank')}
                className="btn btn-primary btn-sm mt-2"
              >
                Browse Videos
              </button>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-success/10 to-accent/10 border border-success/20">
            <div className="card-body text-center">
              <Headphones className="w-12 h-12 text-success mx-auto mb-2" />
              <h3 className="font-bold">🎧 Relaxation Audio</h3>
              <p className="text-sm">Nature sounds, meditation music, calming audio</p>
              <button 
                onClick={() => window.open('https://www.youtube.com/results?search_query=meditation+music+relaxation+sounds', '_blank')}
                className="btn btn-success btn-sm mt-2"
              >
                Listen Now
              </button>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-info/10 to-warning/10 border border-info/20">
            <div className="card-body text-center">
              <FileText className="w-12 h-12 text-info mx-auto mb-2" />
              <h3 className="font-bold">📚 Wellness Guides</h3>
              <p className="text-sm">WHO resources, NIMHANS materials, research articles</p>
              <button 
                onClick={() => window.open('https://www.who.int/health-topics/mental-health', '_blank')}
                className="btn btn-info btn-sm mt-2"
              >
                Access Guides
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Resources */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-base-content mb-6">{t.featuredTitle}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content">
            <div className="card-body">
              <h3 className="card-title">{t.crisisSupport}</h3>
              <p>{t.crisisDesc}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-primary-content">
                  {t.getHelpNow}
                </button>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-accent to-info text-accent-content">
            <div className="card-body">
              <h3 className="card-title">{t.weeklyWebinars}</h3>
              <p>{t.webinarDesc}</p>
              <div className="card-actions justify-end">
                <button className="btn btn-accent-content">
                  {t.viewSchedule}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Resource Modal */}
      {showResourceForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card bg-base-100 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="card-body">
              <h3 className="card-title mb-4">Add New Mental Health Resource</h3>
              <form onSubmit={handleAddResource} className="space-y-4">
                <div>
                  <label className="label">
                    <span className="label-text">Resource Title</span>
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
                    <span className="label-text">Description</span>
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
                      <span className="label-text">Type</span>
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
                      <span className="label-text">Language</span>
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
                      <span className="label-text">Category</span>
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
                      <span className="label-text">Difficulty Level</span>
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
                    <span className="label-text">Resource URL</span>
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
                      <span className="label-text">Duration (minutes)</span>
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
                      <span className="label-text">Tags (comma separated)</span>
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
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Resource
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

export default ResourceCenter;