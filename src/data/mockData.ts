import { 
  User, Booking, ForumPost, Resource, AssessmentTool, AssessmentResult, 
  PsychoeducationalResource, SupportService, StudentProfile 
} from '../types';
import bcrypt from 'bcryptjs';

// Mock users with hashed passwords
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Student',
    email: 'student@soulbridge.com',
    role: 'student',
    password: bcrypt.hashSync('password123', 10),
    createdAt: '2025-09-20T00:00:00Z',
    languagePreference: 'en',
    mentalHealthScore: 12,
  },
  {
    id: '2',
    name: 'Dr. Sarah Counsellor',
    email: 'counsellor@soulbridge.com',
    role: 'counsellor',
    password: bcrypt.hashSync('password123', 10),
    createdAt: '2025-01-01T00:00:00Z',
    languagePreference: 'en',
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@soulbridge.com',
    role: 'admin',
    password: bcrypt.hashSync('password123', 10),
    createdAt: '2025-01-01T00:00:00Z',
    languagePreference: 'en',
  },
  {
    id: '4',
    name: 'Dr. Mike Thompson',
    email: 'mike@soulbridge.com',
    role: 'counsellor',
    password: bcrypt.hashSync('password123', 10),
    createdAt: '2025-01-02T00:00:00Z',
    languagePreference: 'en',
  },
  {
    id: '5',
    name: 'Priya Volunteer',
    email: 'volunteer@soulbridge.com',
    role: 'volunteer',
    password: bcrypt.hashSync('volunteer123', 10),
    createdAt: '2025-01-03T00:00:00Z',
    isTrainedVolunteer: true,
    volunteerCertification: 'Mental Health First Aid Certified',
    certificationId: 'MHFA-2024-001',
    certifications: ['Mental Health First Aid', 'Peer Support Specialist', 'Crisis Intervention'],
    trainingDate: '2024-06-15T00:00:00Z',
    moderationPermissions: ['forum', 'resources', 'crisis_response'],
    languagePreference: 'en',
  },
  {
    id: '6',
    name: 'Arjun Kumar',
    email: 'arjun.volunteer@soulbridge.com',
    role: 'volunteer',
    password: bcrypt.hashSync('volunteer123', 10),
    createdAt: '2025-01-04T00:00:00Z',
    isTrainedVolunteer: true,
    volunteerCertification: 'Peer Support Specialist',
    certificationId: 'MHFA-2024-002',
    certifications: ['Peer Support Specialist', 'Youth Mental Health'],
    trainingDate: '2024-07-20T00:00:00Z',
    moderationPermissions: ['forum', 'resources'],
    languagePreference: 'en',
  },
  {
    id: '7',
    name: 'Maya Sharma',
    email: 'maya.volunteer@soulbridge.com',
    role: 'volunteer',
    password: bcrypt.hashSync('volunteer123', 10),
    createdAt: '2025-01-05T00:00:00Z',
    isTrainedVolunteer: true,
    volunteerCertification: 'Licensed Mental Health Counselor',
    certificationId: 'MHFA-2024-003',
    certifications: ['LMHC', 'Trauma-Informed Care', 'Group Facilitation'],
    trainingDate: '2024-05-10T00:00:00Z',
    moderationPermissions: ['forum', 'resources', 'crisis_response', 'admin'],
    languagePreference: 'en',
  },
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    studentId: '1',
    counsellorId: '2',
    date: '2025-09-20',
    time: '10:00',
    status: 'completed',
    notes: 'Initial consultation',
    createdAt: '2025-09-15T00:00:00Z',
  },
  {
    id: '2',
    studentId: '1',
    counsellorId: '4',
    date: '2025-09-21',
    time: '14:30',
    status: 'completed',
    createdAt: '2025-09-16T00:00:00Z',
  },
  {
    id: '3',
    studentId: '1',
    counsellorId: '2',
    date: '2025-09-21',
    time: '20:00',
    status: 'confirmed',
    notes: 'Evening session',
    createdAt: '2025-09-20T00:00:00Z',
  },
  {
    id: '4',
    studentId: '1',
    counsellorId: '4',
    date: '2025-09-22',
    time: '10:00',
    status: 'pending',
    notes: 'Follow-up session',
    createdAt: '2025-09-21T00:00:00Z',
  },
  {
    id: '5',
    studentId: '1',
    counsellorId: '2',
    date: '2025-09-23',
    time: '15:00',
    status: 'confirmed',
    notes: 'Weekly check-in',
    createdAt: '2025-09-21T00:00:00Z',
  },
];

export const mockForumPosts: ForumPost[] = [
  {
    id: '1',
    userId: '1',
    userName: 'John Student',
    userRole: 'student',
    title: 'Dealing with exam anxiety',
    content: 'I\'ve been struggling with anxiety before exams. Any tips?',
    timestamp: '2025-01-15T10:00:00Z',
    language: 'en',
    category: 'academic',
    isModerated: true,
    moderatedBy: '5',
    moderatedAt: '2025-01-15T10:30:00Z',
    replies: [
      {
        id: '1-1',
        userId: '5',
        userName: 'Priya Volunteer',
        userRole: 'volunteer',
        content: 'I understand how overwhelming exam anxiety can feel. Here are some techniques that many students find helpful: 1) Try the 4-7-8 breathing technique, 2) Break study sessions into 25-minute chunks with 5-minute breaks, 3) Practice positive self-talk. Remember, you\'re not alone in this! 💙',
        timestamp: '2025-01-15T10:45:00Z',
        isVolunteerResponse: true,
        isHelpful: true,
        isVerified: true,
        helpfulCount: 8,
      },
      {
        id: '1-2',
        userId: '2',
        userName: 'Dr. Sarah Counsellor',
        userRole: 'counsellor',
        content: 'Excellent advice from our volunteer! I\'d also recommend creating a study schedule and practicing mindfulness meditation. If anxiety persists, consider booking a session with one of our counsellors.',
        timestamp: '2025-01-15T11:00:00Z',
        isVerified: true,
        helpfulCount: 5,
      },
    ],
  },
  {
    id: '2',
    userId: '1',
    userName: 'John Student',
    userRole: 'student',
    title: 'Sleep schedule tips',
    content: 'Having trouble maintaining a healthy sleep schedule. What works for you?',
    timestamp: '2025-01-16T14:00:00Z',
    language: 'en',
    category: 'wellness',
    isModerated: true,
    moderatedBy: '6',
    moderatedAt: '2025-01-16T14:15:00Z',
    replies: [
      {
        id: '2-1',
        userId: '6',
        userName: 'Arjun Kumar',
        userRole: 'volunteer',
        content: 'Maintaining a sleep schedule can be really challenging. I suggest: 1) Going to sleep and waking up at the same time every day, 2) Reducing screen time before bed, 3) Avoiding caffeine after evening. Make gradual changes, don\'t change suddenly. Consistency is key for better sleep health! 💤',
        timestamp: '2025-01-16T14:30:00Z',
        isVolunteerResponse: true,
        isHelpful: true,
        isVerified: true,
        helpfulCount: 6,
      },
    ],
  },
  {
    id: '3',
    userId: '1',
    userName: 'Meera Student',
    userRole: 'student',
    title: 'Relationship stress affecting studies',
    content: 'My relationship problems are making it hard to focus on my studies. How do I manage both?',
    timestamp: '2025-01-17T16:00:00Z',
    language: 'en',
    category: 'relationships',
    flagCount: 0,
    isModerated: true,
    moderatedBy: '7',
    moderatedAt: '2025-01-17T16:10:00Z',
    replies: [
      {
        id: '3-1',
        userId: '7',
        userName: 'Maya Sharma',
        userRole: 'volunteer',
        content: 'It\'s completely normal for relationship stress to impact your studies. Here are some strategies: 1) Set specific study times where you focus only on academics, 2) Communicate your needs clearly with your partner, 3) Practice stress management techniques like journaling or meditation. Remember, it\'s okay to seek professional help if needed. Take care of yourself first! 🌸',
        timestamp: '2025-01-17T16:25:00Z',
        isVolunteerResponse: true,
        isHelpful: true,
        isVerified: true,
        helpfulCount: 12,
      },
    ],
  },
  {
    id: '4',
    userId: '8',
    userName: 'Anonymous Student',
    userRole: 'student',
    title: 'Feeling overwhelmed - need support',
    content: 'Everything feels too much right now. Studies, family expectations, future uncertainty... I don\'t know how to cope.',
    timestamp: '2025-01-18T20:00:00Z',
    language: 'en',
    category: 'stress',
    flagCount: 0,
    isModerated: true,
    moderatedBy: '5',
    moderatedAt: '2025-01-18T20:05:00Z',
    isPinned: true,
    replies: [
      {
        id: '4-1',
        userId: '5',
        userName: 'Priya Volunteer',
        userRole: 'volunteer',
        content: 'First, take a deep breath. What you\'re feeling is valid and you\'re brave for reaching out. 💙 When everything feels overwhelming: 1) Focus on just today, not the whole future, 2) Write down 3 things you\'re grateful for, 3) Talk to someone you trust. You\'re stronger than you think, and you don\'t have to face this alone. Our counselling services are here if you need professional support.',
        timestamp: '2025-01-18T20:15:00Z',
        isVolunteerResponse: true,
        isHelpful: true,
        isVerified: true,
        helpfulCount: 25,
      },
      {
        id: '4-2',
        userId: '7',
        userName: 'Maya Sharma',
        userRole: 'volunteer',
        content: 'Adding to Priya\'s excellent response - please remember that feeling overwhelmed is a sign that you care deeply, which is actually a strength. Consider breaking big problems into smaller, manageable steps. If you\'re having thoughts of self-harm, please reach out to our crisis helpline immediately: 1-800-HELP. You matter, and there are people who want to help you through this. 🌟',
        timestamp: '2025-01-18T20:30:00Z',
        isVolunteerResponse: true,
        isHelpful: true,
        isVerified: true,
        helpfulCount: 18,
      },
    ],
  },
];

export const mockResources: Resource[] = [
  {
    id: '1',
    title: 'Understanding Anxiety',
    description: 'A comprehensive guide to understanding and managing anxiety.',
    category: 'guide',
    link: '#',
    createdAt: '2025-01-10T00:00:00Z',
  },
  {
    id: '2',
    title: 'Meditation for Beginners',
    description: 'Learn the basics of meditation and mindfulness.',
    category: 'video',
    link: '#',
    createdAt: '2025-01-12T00:00:00Z',
  },
  {
    id: '3',
    title: 'Stress Management Techniques',
    description: 'Practical techniques for managing stress in daily life.',
    category: 'article',
    link: '#',
    createdAt: '2025-01-14T00:00:00Z',
  },
];

// Assessment Tools
export const mockAssessmentTools: AssessmentTool[] = [
  {
    id: 'phq9',
    name: 'PHQ-9',
    title: 'Patient Health Questionnaire-9',
    description: 'A depression screening tool that assesses the severity of depressive symptoms over the past two weeks.',
    questions: [
      {
        id: 'phq9-1',
        text: 'Little interest or pleasure in doing things',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'phq9-2',
        text: 'Feeling down, depressed, or hopeless',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'phq9-3',
        text: 'Trouble falling or staying asleep, or sleeping too much',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'phq9-4',
        text: 'Feeling tired or having little energy',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'phq9-5',
        text: 'Poor appetite or overeating',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'phq9-6',
        text: 'Feeling bad about yourself or that you are a failure',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'phq9-7',
        text: 'Trouble concentrating on things',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'phq9-8',
        text: 'Moving or speaking slowly, or being fidgety/restless',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'phq9-9',
        text: 'Thoughts that you would be better off dead or hurting yourself',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      }
    ],
    scoringRubric: [
      { range: [0, 4], severity: 'Minimal', description: 'No depression or minimal symptoms' },
      { range: [5, 9], severity: 'Mild', description: 'Mild depression symptoms' },
      { range: [10, 14], severity: 'Moderate', description: 'Moderate depression symptoms' },
      { range: [15, 19], severity: 'Moderately Severe', description: 'Moderately severe depression' },
      { range: [20, 27], severity: 'Severe', description: 'Severe depression symptoms' }
    ]
  },
  {
    id: 'gad7',
    name: 'GAD-7',
    title: 'Generalized Anxiety Disorder-7',
    description: 'A screening tool for anxiety disorders that measures severity of anxiety symptoms.',
    questions: [
      {
        id: 'gad7-1',
        text: 'Feeling nervous, anxious, or on edge',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'gad7-2',
        text: 'Not being able to stop or control worrying',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'gad7-3',
        text: 'Worrying too much about different things',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'gad7-4',
        text: 'Trouble relaxing',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'gad7-5',
        text: 'Being so restless that it is hard to sit still',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'gad7-6',
        text: 'Becoming easily annoyed or irritable',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      },
      {
        id: 'gad7-7',
        text: 'Feeling afraid, as if something awful might happen',
        type: 'scale',
        scaleRange: { min: 0, max: 3 }
      }
    ],
    scoringRubric: [
      { range: [0, 4], severity: 'Minimal', description: 'Minimal anxiety symptoms' },
      { range: [5, 9], severity: 'Mild', description: 'Mild anxiety symptoms' },
      { range: [10, 14], severity: 'Moderate', description: 'Moderate anxiety symptoms' },
      { range: [15, 21], severity: 'Severe', description: 'Severe anxiety symptoms' }
    ]
  }
];

// Psychoeducational Resources
export const mockPsychoeducationalResources: PsychoeducationalResource[] = [
  // 🎥 Real YouTube Mental Health Videos
  {
    id: 'yt-mindfulness-meditation',
    title: 'Mindfulness Meditation - Guided Practice (English)',
    description: 'A comprehensive guided mindfulness meditation session for beginners and experienced practitioners',
    type: 'video',
    language: 'en',
    category: 'wellness',
    url: 'https://www.youtube.com/watch?v=ZToicYcHIOU',
    duration: 20,
    difficulty: 'beginner',
    tags: ['mindfulness', 'meditation', 'guided', 'relaxation'],
    createdAt: '2025-01-15T00:00:00Z',
    rating: 4.8,
    views: 125000
  },
  {
    id: 'yt-anxiety-breathing',
    title: 'Breathing Exercises for Anxiety Relief',
    description: 'Simple breathing techniques to help manage anxiety and panic attacks, scientifically proven methods',
    type: 'video',
    language: 'en',
    category: 'anxiety',
    url: 'https://www.youtube.com/watch?v=tybOi4hjZFQ',
    duration: 12,
    difficulty: 'beginner',
    tags: ['breathing', 'anxiety', 'panic attacks', 'relief'],
    createdAt: '2025-01-16T00:00:00Z',
    rating: 4.9,
    views: 89500
  },
  {
    id: 'yt-yoga-nidra-english',
    title: 'Yoga Nidra - Deep Relaxation Practice',
    description: 'Traditional yoga nidra practice for deep relaxation and stress relief',
    type: 'video',
    language: 'en',
    category: 'stress',
    url: 'https://www.youtube.com/watch?v=M0u9GST_j3s',
    duration: 30,
    difficulty: 'beginner',
    tags: ['yoga nidra', 'relaxation', 'stress relief', 'meditation'],
    createdAt: '2025-01-17T00:00:00Z',
    rating: 4.7,
    views: 76200
  },
  {
    id: 'yt-depression-help',
    title: 'Understanding Depression: Signs, Symptoms & Getting Help',
    description: 'Educational video about recognizing depression symptoms and finding appropriate help and support',
    type: 'video',
    language: 'en',
    category: 'depression',
    url: 'https://www.youtube.com/watch?v=z-IR48Mb3W0',
    duration: 15,
    difficulty: 'beginner',
    tags: ['depression', 'mental health', 'awareness', 'help'],
    createdAt: '2025-01-18T00:00:00Z',
    rating: 4.6,
    views: 92300
  },
  {
    id: 'yt-stress-management',
    title: 'Stress Management Techniques That Actually Work',
    description: 'Evidence-based stress management strategies for daily life, work, and relationships',
    type: 'video',
    language: 'en',
    category: 'stress',
    url: 'https://www.youtube.com/watch?v=6p0DAz_30qQ',
    duration: 18,
    difficulty: 'intermediate',
    tags: ['stress management', 'coping', 'techniques', 'daily life'],
    createdAt: '2025-01-19T00:00:00Z',
    rating: 4.8,
    views: 45600
  },

  // 🎧 Real Audio Content from YouTube
  {
    id: 'yt-rain-sounds',
    title: 'Relaxing Rain Sounds for Sleep and Meditation',
    description: '3 hours of gentle rain sounds perfect for sleep, study, meditation, and stress relief',
    type: 'audio',
    language: 'en',
    category: 'wellness',
    url: 'https://www.youtube.com/watch?v=mPZkdNFkNps',
    duration: 180,
    difficulty: 'beginner',
    tags: ['rain sounds', 'sleep', 'meditation', 'nature'],
    createdAt: '2025-01-20T00:00:00Z',
    rating: 4.5,
    views: 67800
  },
  {
    id: 'yt-om-chanting',
    title: 'OM Chanting - Sacred Mantra Meditation',
    description: 'Traditional OM chanting for spiritual practice, meditation, and inner peace',
    type: 'audio',
    language: 'en',
    category: 'wellness',
    url: 'https://www.youtube.com/watch?v=qYnA9wWFHLI',
    duration: 21,
    difficulty: 'beginner',
    tags: ['om chanting', 'mantra', 'meditation', 'spiritual'],
    createdAt: '2025-01-21T00:00:00Z',
    rating: 4.7,
    views: 34200
  },
  {
    id: 'yt-forest-sounds',
    title: 'Forest Sounds - Birds Chirping, Nature Ambience',
    description: 'Peaceful forest sounds with birds chirping, perfect for relaxation and focus',
    type: 'audio',
    language: 'en',
    category: 'stress',
    url: 'https://www.youtube.com/watch?v=xNN7iTA57jM',
    duration: 60,
    difficulty: 'beginner',
    tags: ['forest sounds', 'birds', 'nature', 'relaxation'],
    createdAt: '2025-01-22T00:00:00Z',
    rating: 4.9,
    views: 28900
  },

  // 📚 Real Educational Resources and Articles
  {
    id: 'who-mental-health-guide',
    title: 'WHO Mental Health Action Plan 2013-2030',
    description: 'World Health Organization comprehensive guide on mental health policies, strategies, and implementation',
    type: 'guide',
    language: 'en',
    category: 'academic',
    url: 'https://www.who.int/publications/i/item/9789241506021',
    duration: 45,
    difficulty: 'advanced',
    tags: ['WHO', 'mental health', 'policy', 'global health'],
    createdAt: '2025-01-23T00:00:00Z',
    rating: 4.6,
    views: 56700
  },
  {
    id: 'nimhans-mental-health',
    title: 'NIMHANS Mental Health Resources',
    description: 'National Institute of Mental Health and Neurosciences - Educational materials and research publications',
    type: 'guide',
    language: 'en',
    category: 'academic',
    url: 'https://nimhans.ac.in/',
    duration: 30,
    difficulty: 'intermediate',
    tags: ['NIMHANS', 'research', 'education', 'indian mental health'],
    createdAt: '2025-01-24T00:00:00Z',
    rating: 4.8,
    views: 42100
  },
  {
    id: 'mindfulness-exercises',
    title: 'Daily Mindfulness Exercises for Mental Wellness',
    description: 'Simple mindfulness exercises that can be practiced daily to improve mental health and reduce stress',
    type: 'article',
    language: 'en',
    category: 'wellness',
    url: 'https://www.mindful.org/take-a-mindful-moment-5-simple-practices-for-daily-life/',
    duration: 10,
    difficulty: 'beginner',
    tags: ['mindfulness', 'daily practice', 'exercises', 'wellness'],
    createdAt: '2025-01-25T00:00:00Z',
    rating: 4.7,
    views: 78400
  },
  {
    id: 'anxiety-self-help',
    title: 'Self-Help Strategies for Managing Anxiety',
    description: 'Practical self-help techniques and strategies for managing anxiety disorders and panic attacks',
    type: 'article',
    language: 'en',
    category: 'anxiety',
    url: 'https://www.anxietycanada.com/articles/what-is-anxiety/',
    duration: 15,
    difficulty: 'intermediate',
    tags: ['anxiety', 'self-help', 'coping strategies', 'panic attacks'],
    createdAt: '2025-01-26T00:00:00Z',
    rating: 4.9,
    views: 91200
  },
  {
    id: 'meditation-guide-english',
    title: 'Learn Meditation - Complete Meditation Guide',
    description: 'Comprehensive meditation guidance and practices for mental peace and wellbeing',
    type: 'video',
    language: 'en',
    category: 'wellness',
    url: 'https://www.youtube.com/watch?v=example-meditation',
    duration: 25,
    difficulty: 'beginner',
    tags: ['meditation', 'mental peace', 'mindfulness', 'practice'],
    createdAt: '2025-01-27T00:00:00Z',
    rating: 4.8,
    views: 35600
  },
  {
    id: 'sleep-hygiene-guide',
    title: 'Sleep Hygiene: Better Sleep for Better Mental Health',
    description: 'Comprehensive guide to improving sleep quality and its impact on mental health and wellbeing',
    type: 'article',
    language: 'en',
    category: 'wellness',
    url: 'https://www.sleepfoundation.org/sleep-hygiene',
    duration: 12,
    difficulty: 'beginner',
    tags: ['sleep hygiene', 'sleep quality', 'mental health', 'wellbeing'],
    createdAt: '2025-01-28T00:00:00Z',
    rating: 4.6,
    views: 64800
  },
  {
    id: 'relationships-mental-health',
    title: 'Building Healthy Relationships for Mental Wellness',
    description: 'How healthy relationships contribute to mental wellness and strategies for improving social connections',
    type: 'article',
    language: 'en',
    category: 'relationships',
    url: 'https://www.mentalhealthamerica.net/relationships',
    duration: 18,
    difficulty: 'intermediate',
    tags: ['relationships', 'social connections', 'mental wellness', 'communication'],
    createdAt: '2025-01-29T00:00:00Z',
    rating: 4.7,
    views: 52300
  }
];

// Support Services
export const mockSupportServices: SupportService[] = [
  {
    id: 'svc-1',
    name: 'University Counseling Center',
    type: 'counsellor',
    description: 'Professional counseling services available to all students',
    contactInfo: {
      phone: '+91-98765-43210',
      email: 'counseling@university.edu',
      address: 'Student Services Building, Room 201'
    },
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: '9:00 AM - 5:00 PM',
      timezone: 'IST'
    },
    languages: ['en'],
    isEmergency: false
  },
  {
    id: 'svc-2',
    name: 'National Suicide Prevention Helpline',
    type: 'crisis',
    description: '24/7 crisis intervention and suicide prevention',
    contactInfo: {
      phone: '1-800-273-8255',
      website: 'https://suicidepreventionlifeline.org'
    },
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      hours: '24/7',
      timezone: 'IST'
    },
    languages: ['en'],
    isEmergency: true
  },
  {
    id: 'svc-3',
    name: 'Peer Support Groups',
    type: 'group-therapy',
    description: 'Weekly support groups facilitated by trained volunteers',
    contactInfo: {
      email: 'peersupp ort@university.edu',
      address: 'Community Center, Room 105'
    },
    availability: {
      days: ['Wednesday', 'Friday'],
      hours: '6:00 PM - 8:00 PM',
      timezone: 'IST'
    },
    languages: ['en'],
    isEmergency: false
  }
];

// Mock Student Profiles (Anonymized)
export const mockStudentProfiles: StudentProfile[] = [
  {
    id: 'profile-1',
    name: 'Student A',
    age: 20,
    gender: 'female',
    academicYear: 'Sophomore',
    department: 'Computer Science',
    assessmentScores: {
      phq9: 8,
      gad7: 12,
      ghq12: 6
    },
    riskLevel: 'moderate',
    primaryConcerns: ['Academic stress', 'Social anxiety'],
    supportNeeded: ['Counseling', 'Stress management'],
    preferredLanguage: 'en',
    anonymizedAt: '2025-01-10T00:00:00Z'
  },
  {
    id: 'profile-2',
    name: 'Student B',
    age: 22,
    gender: 'male',
    academicYear: 'Senior',
    department: 'Engineering',
    assessmentScores: {
      phq9: 15,
      gad7: 8,
      ghq12: 10
    },
    riskLevel: 'high',
    primaryConcerns: ['Depression', 'Career anxiety'],
    supportNeeded: ['Individual therapy', 'Career counseling'],
    preferredLanguage: 'en',
    anonymizedAt: '2025-01-11T00:00:00Z'
  },
  {
    id: 'profile-3',
    name: 'Student C',
    age: 19,
    gender: 'other',
    academicYear: 'Freshman',
    department: 'Arts',
    assessmentScores: {
      phq9: 3,
      gad7: 5,
      ghq12: 2
    },
    riskLevel: 'low',
    primaryConcerns: ['Adjustment issues', 'Homesickness'],
    supportNeeded: ['Peer support', 'Group activities'],
    preferredLanguage: 'en',
    anonymizedAt: '2025-01-12T00:00:00Z'
  },
  {
    id: 'profile-4',
    name: 'Student D',
    age: 21,
    gender: 'female',
    academicYear: 'Junior',
    department: 'Psychology',
    assessmentScores: {
      phq9: 18,
      gad7: 16,
      ghq12: 14
    },
    riskLevel: 'severe',
    primaryConcerns: ['Severe depression', 'Panic attacks', 'Academic failure'],
    supportNeeded: ['Immediate intervention', 'Medication consultation', 'Family support'],
    preferredLanguage: 'en',
    anonymizedAt: '2025-01-13T00:00:00Z'
  }
];