export interface User {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'counsellor' | 'admin' | 'volunteer';
  password?: string;
  createdAt: string;
  isTrainedVolunteer?: boolean;
  volunteerCertification?: string;
  certificationId?: string;
  certifications?: string[];
  trainingDate?: string;
  moderationPermissions?: string[];
  languagePreference?: 'en' | 'hi' | 'ta';
  mentalHealthScore?: number;
}

export interface Booking {
  id: string;
  studentId: string;
  counsellorId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
}

export interface ForumPost {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  title: string;
  content: string;
  timestamp: string;
  replies: ForumReply[];
  language?: 'en' | 'hi' | 'ta';
  category?: string;
  flagCount?: number;
  flaggedBy?: string[];
  isModerated?: boolean;
  moderatedBy?: string;
  moderatedAt?: string;
  isPinned?: boolean;
  tags?: string[];
}

export interface ForumReply {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  content: string;
  timestamp: string;
  isVolunteerResponse?: boolean;
  isHelpful?: boolean;
  isVerified?: boolean;
  helpfulCount?: number;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  category: 'article' | 'video' | 'tool' | 'guide';
  link: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  message: string;
  sender: 'user' | 'aasha';
  timestamp: string;
}

export interface AnalyticsData {
  totalUsers: number;
  totalSessions: number;
  totalPosts: number;
  usersByRole: { student: number; counsellor: number; admin: number; volunteer: number };
  sessionsThisMonth: number;
  postsThisWeek: number;
}

// Psychological Assessment Types
export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'scale' | 'text';
  options?: string[];
  scaleRange?: { min: number; max: number };
}

export interface AssessmentTool {
  id: string;
  name: 'PHQ-9' | 'GAD-7' | 'GHQ-12';
  title: string;
  description: string;
  questions: AssessmentQuestion[];
  scoringRubric: { range: [number, number]; severity: string; description: string }[];
}

export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentType: 'PHQ-9' | 'GAD-7' | 'GHQ-12';
  responses: { questionId: string; answer: string | number }[];
  totalScore: number;
  severity: string;
  recommendations: string[];
  completedAt: string;
}

// Enhanced Resource Types
export interface PsychoeducationalResource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'audio' | 'guide' | 'worksheet' | 'article';
  language: 'en' | 'hi' | 'ta';
  category: 'anxiety' | 'depression' | 'stress' | 'wellness' | 'relationships' | 'academic' | 'mindfulness' | 'general';
  url: string;
  duration?: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt: string;
  rating: number;
  views: number;
}

// Institutional Support Types
export interface SupportService {
  id: string;
  name: string;
  type: 'counsellor' | 'helpline' | 'crisis' | 'group-therapy';
  description: string;
  contactInfo: {
    phone?: string;
    email?: string;
    address?: string;
    website?: string;
  };
  availability: {
    days: string[];
    hours: string;
    timezone: string;
  };
  languages: ('en' | 'hi' | 'ta')[];
  isEmergency: boolean;
}

// Mock Student Profile Types
export interface StudentProfile {
  id: string;
  name: string; // Anonymized
  age: number;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  academicYear: string;
  department: string;
  assessmentScores: {
    phq9?: number;
    gad7?: number;
    ghq12?: number;
  };
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  primaryConcerns: string[];
  supportNeeded: string[];
  preferredLanguage: 'en' | 'hi' | 'ta';
  anonymizedAt: string;
}