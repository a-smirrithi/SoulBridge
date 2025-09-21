import React, { useState } from 'react';
import { BookOpen, Video, FileText, Award, Clock, Star, Download, ExternalLink, Users, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TrainingCenter: React.FC = () => {
  const { user } = useAuth() || {};
  const [activeCategory, setActiveCategory] = useState('mental-health');

  const currentLang = 'en'; // Force English for volunteer portal
  
  const translations = {
    en: {
      title: 'Volunteer Training Center',
      subtitle: 'Enhance your skills to provide better peer support',
      categories: {
        'mental-health': 'Mental Health Basics',
        'crisis': 'Crisis Intervention',
        'communication': 'Communication Skills',
        'ethics': 'Ethics & Boundaries'
      },
      completedModules: 'Completed Modules',
      inProgress: 'In Progress',
      available: 'Available',
      duration: 'Duration',
      difficulty: 'Difficulty',
      rating: 'Rating',
      viewCertificate: 'View Certificate',
      startModule: 'Start Module',
      continueModule: 'Continue',
      downloadCertificate: 'Download Certificate'
    }
  };

  const t = translations[currentLang];

  const trainingModules = {
    'mental-health': [
      {
        id: 'mh-1',
        title: 'Understanding Mental Health',
        description: 'Basic concepts and common mental health conditions',
        type: 'video',
        duration: 45,
        difficulty: 'beginner',
        rating: 4.8,
        status: 'completed',
        url: 'https://www.youtube.com/watch?v=DxIDKZHW3-E',
        certificate: true
      },
      {
        id: 'mh-2',
        title: 'Recognizing Warning Signs',
        description: 'How to identify when someone needs professional help',
        type: 'interactive',
        duration: 30,
        difficulty: 'intermediate',
        rating: 4.7,
        status: 'completed',
        url: 'https://www.nimhans.ac.in/',
        certificate: true
      },
      {
        id: 'mh-3',
        title: 'Cultural Sensitivity in Mental Health',
        description: 'Understanding cultural factors in mental health support',
        type: 'article',
        duration: 25,
        difficulty: 'intermediate',
        rating: 4.6,
        status: 'available',
        url: 'https://www.who.int/news-room/fact-sheets/detail/mental-disorders'
      }
    ],
    'crisis': [
      {
        id: 'crisis-1',
        title: 'Crisis Intervention Basics',
        description: 'First response to mental health crises',
        type: 'video',
        duration: 60,
        difficulty: 'advanced',
        rating: 4.9,
        status: 'in-progress',
        progress: 65,
        url: 'https://www.youtube.com/watch?v=1Evwgu369Jw'
      },
      {
        id: 'crisis-2',
        title: 'Suicide Prevention',
        description: 'Recognizing suicidal ideation and appropriate responses',
        type: 'certification',
        duration: 120,
        difficulty: 'advanced',
        rating: 4.8,
        status: 'available',
        url: 'https://suicidepreventionlifeline.org/'
      }
    ],
    'communication': [
      {
        id: 'comm-1',
        title: 'Active Listening Skills',
        description: 'Techniques for effective peer support conversations',
        type: 'video',
        duration: 35,
        difficulty: 'beginner',
        rating: 4.7,
        status: 'completed',
        url: 'https://www.youtube.com/watch?v=rzsVh8YwZEQ',
        certificate: true
      },
      {
        id: 'comm-2',
        title: 'Empathetic Communication',
        description: 'Building rapport and showing understanding',
        type: 'interactive',
        duration: 40,
        difficulty: 'intermediate',
        rating: 4.6,
        status: 'available',
        url: 'https://www.mindful.org/how-to-practice-empathy/'
      }
    ],
    'ethics': [
      {
        id: 'ethics-1',
        title: 'Volunteer Code of Ethics',
        description: 'Understanding your role and responsibilities',
        type: 'article',
        duration: 20,
        difficulty: 'beginner',
        rating: 4.5,
        status: 'completed',
        url: 'https://www.apa.org/ethics/code/',
        certificate: true
      },
      {
        id: 'ethics-2',
        title: 'Maintaining Boundaries',
        description: 'Professional boundaries in peer support',
        type: 'video',
        duration: 30,
        difficulty: 'intermediate',
        rating: 4.7,
        status: 'available',
        url: 'https://www.youtube.com/watch?v=9gWU9cKCKNI'
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'badge-success';
      case 'in-progress': return 'badge-warning';
      case 'available': return 'badge-info';
      default: return 'badge-ghost';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-5 h-5" />;
      case 'interactive': return <Users className="w-5 h-5" />;
      case 'article': return <FileText className="w-5 h-5" />;
      case 'certification': return <Award className="w-5 h-5" />;
      default: return <BookOpen className="w-5 h-5" />;
    }
  };

  const currentModules = trainingModules[activeCategory as keyof typeof trainingModules] || [];
  const completedCount = currentModules.filter((m: any) => m.status === 'completed').length;
  const totalCount = currentModules.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            {t.title}
          </h1>
          <p className="text-base-content/70 mt-1">{t.subtitle}</p>
        </div>
        
        {/* Progress Overview */}
        <div className="stats stats-horizontal shadow">
          <div className="stat">
            <div className="stat-figure text-success">
              <Award className="w-8 h-8" />
            </div>
            <div className="stat-title">{t.completedModules}</div>
            <div className="stat-value text-success">{completedCount}/{totalCount}</div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="tabs tabs-boxed bg-base-200 p-1">
        {Object.entries(t.categories).map(([key, label]) => (
          <button
            key={key}
            className={`tab ${activeCategory === key ? 'tab-active' : ''}`}
            onClick={() => setActiveCategory(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Certification Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {user?.certifications?.map((cert, index) => (
          <div key={index} className="card bg-gradient-to-br from-success/10 to-accent/10 border border-success/20">
            <div className="card-body">
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-success" />
                <div>
                  <h3 className="font-bold text-success">{cert}</h3>
                  <p className="text-sm text-base-content/70">
                    Certified • Valid until {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="card-actions justify-end mt-4">
                <button className="btn btn-sm btn-success btn-outline">
                  <Download className="w-4 h-4" />
                  {t.downloadCertificate}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Training Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentModules.map((module: any) => (
          <div key={module.id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
              {/* Module Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getTypeIcon(module.type)}
                  <div className={`badge ${getStatusColor(module.status)} badge-sm`}>
                    {(t as any)[module.status] || module.status}
                  </div>
                </div>
                {module.certificate && module.status === 'completed' && (
                  <Award className="w-5 h-5 text-warning" />
                )}
              </div>

              {/* Module Info */}
              <h3 className="card-title text-lg">{module.title}</h3>
              <p className="text-base-content/70 text-sm mb-4">{module.description}</p>

              {/* Module Details */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-base-content/50" />
                  <span>{module.duration} {t.duration.toLowerCase()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span>{module.rating} {t.rating}</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{t.difficulty}:</span>
                  <span className={`ml-2 capitalize ${
                    module.difficulty === 'beginner' ? 'text-success' :
                    module.difficulty === 'intermediate' ? 'text-warning' : 'text-error'
                  }`}>
                    {module.difficulty}
                  </span>
                </div>
              </div>

              {/* Progress Bar for In-Progress */}
              {module.status === 'in-progress' && module.progress && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{module.progress}%</span>
                  </div>
                  <progress className="progress progress-primary" value={module.progress} max="100"></progress>
                </div>
              )}

              {/* Action Buttons */}
              <div className="card-actions justify-end mt-4">
                {module.status === 'completed' && module.certificate && (
                  <button className="btn btn-sm btn-outline btn-success">
                    <Award className="w-4 h-4" />
                    {t.viewCertificate}
                  </button>
                )}
                <a
                  href={module.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`btn btn-sm ${
                    module.status === 'completed' ? 'btn-outline' : 'btn-primary'
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  {module.status === 'in-progress' ? t.continueModule : t.startModule}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title mb-4">Additional Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://www.samhsa.gov/find-help/national-helpline"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">SAMHSA National Helpline</div>
                <div className="text-sm text-base-content/70">Crisis support resources</div>
              </div>
            </a>
            <a
              href="https://www.nami.org/About-Mental-Illness"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors"
            >
              <ExternalLink className="w-5 h-5 text-primary" />
              <div>
                <div className="font-medium">NAMI Education</div>
                <div className="text-sm text-base-content/70">Mental health education</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCenter;