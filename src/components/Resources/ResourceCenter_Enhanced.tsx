import React, { useState } from 'react';
import { Book, Video, Headphones, Download, Search, Filter, Star, Clock, Users, Globe, Play, FileText, Bookmark } from 'lucide-react';
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
        return <Video className="w-5 h-5 text-red-500" />;
      case 'audio':
        return <Headphones className="w-5 h-5 text-green-500" />;
      case 'article':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'guide':
        return <Book className="w-5 h-5 text-purple-500" />;
      default:
        return <Book className="w-5 h-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'anxiety':
        return 'bg-orange-100 text-orange-800';
      case 'depression':
        return 'bg-blue-100 text-blue-800';
      case 'stress':
        return 'bg-red-100 text-red-800';
      case 'relationships':
        return 'bg-pink-100 text-pink-800';
      case 'academic':
        return 'bg-purple-100 text-purple-800';
      case 'wellness':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-base-content flex items-center justify-center gap-2">
          <Globe className="w-8 h-8 text-primary" />
          {t.title}
        </h1>
        <p className="text-base-content/70">{t.subtitle}</p>
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
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
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
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {resource.rating}
                </span>
              </div>

              <div className="card-actions justify-between">
                <span className="text-xs text-base-content/50">
                  {resource.views.toLocaleString()} views
                </span>
                <button className="btn btn-primary btn-sm">
                  <Play className="w-4 h-4" />
                  {t.viewResource}
                </button>
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
    </div>
  );
};

export default ResourceCenter;