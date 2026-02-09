import { CourseEnrollment, CourseDetail, CourseModule, Lesson } from './types';

// 8 Enrolled Courses with varying progress
export const enrolledCourses: CourseEnrollment[] = [
  {
    id: "digital-transformation-fundamentals",
    courseId: "dt-fundamentals-001",
    courseName: "Digital Transformation Fundamentals",
    instructor: "Dr. Sarah Chen",
    instructorTitle: "Chief Digital Officer, Global Tech Corp",
    thumbnail: "/placeholder.svg",
    progress: 65,
    status: 'in-progress',
    difficulty: 'beginner',
    duration: "6 weeks",
    credits: 12,
    enrolledDate: "2024-01-15",
    lastAccessed: "2024-02-05",
    estimatedCompletion: "2024-02-28",
    currentModule: {
      id: "module-5",
      number: 5,
      title: "Change Management Strategies",
      progress: 65
    },
    stats: {
      modulesCompleted: 4,
      totalModules: 6,
      averageQuizScore: 87,
      timeInvested: "12h 35m",
      certificateEarned: false
    },
    rating: 4.8,
    reviewCount: 234,
    enrolledCount: 1250
  },
  {
    id: "dbp-framework-essentials",
    courseId: "dbp-essentials-001",
    courseName: "DBP Framework Essentials",
    instructor: "Michael Rodriguez",
    instructorTitle: "Enterprise Architect, Fortune 500",
    thumbnail: "/placeholder.svg",
    progress: 45,
    status: 'in-progress',
    difficulty: 'intermediate',
    duration: "8 weeks",
    credits: 16,
    enrolledDate: "2024-01-20",
    lastAccessed: "2024-02-04",
    estimatedCompletion: "2024-03-15",
    currentModule: {
      id: "module-4",
      number: 4,
      title: "Business Capability Modeling",
      progress: 30
    },
    stats: {
      modulesCompleted: 3,
      totalModules: 8,
      averageQuizScore: 82,
      timeInvested: "18h 20m",
      certificateEarned: false
    },
    rating: 4.7,
    reviewCount: 189,
    enrolledCount: 890
  },
  {
    id: "agile-transformation-leadership",
    courseId: "agile-lead-001",
    courseName: "Agile Transformation Leadership",
    instructor: "Jennifer Park",
    instructorTitle: "Agile Coach & Transformation Lead",
    thumbnail: "/placeholder.svg",
    progress: 100,
    status: 'completed',
    difficulty: 'advanced',
    duration: "10 weeks",
    credits: 20,
    enrolledDate: "2023-11-01",
    lastAccessed: "2024-01-15",
    estimatedCompletion: "2024-01-10",
    currentModule: {
      id: "module-10",
      number: 10,
      title: "Sustaining Agile at Scale",
      progress: 100
    },
    stats: {
      modulesCompleted: 10,
      totalModules: 10,
      averageQuizScore: 94,
      timeInvested: "42h 15m",
      certificateEarned: true
    },
    rating: 4.9,
    reviewCount: 312,
    enrolledCount: 567
  },
  {
    id: "cloud-migration-strategies",
    courseId: "cloud-mig-001",
    courseName: "Cloud Migration Strategies",
    instructor: "David Kumar",
    instructorTitle: "Cloud Solutions Architect",
    thumbnail: "/placeholder.svg",
    progress: 30,
    status: 'in-progress',
    difficulty: 'intermediate',
    duration: "7 weeks",
    credits: 14,
    enrolledDate: "2024-01-25",
    lastAccessed: "2024-02-03",
    estimatedCompletion: "2024-03-10",
    currentModule: {
      id: "module-3",
      number: 3,
      title: "Application Assessment & Prioritization",
      progress: 50
    },
    stats: {
      modulesCompleted: 2,
      totalModules: 7,
      averageQuizScore: 85,
      timeInvested: "9h 45m",
      certificateEarned: false
    },
    rating: 4.6,
    reviewCount: 156,
    enrolledCount: 723
  },
  {
    id: "data-driven-decision-making",
    courseId: "data-driven-001",
    courseName: "Data-Driven Decision Making",
    instructor: "Dr. Emily Watson",
    instructorTitle: "Chief Data Officer",
    thumbnail: "/placeholder.svg",
    progress: 0,
    status: 'not-started',
    difficulty: 'beginner',
    duration: "5 weeks",
    credits: 10,
    enrolledDate: "2024-02-01",
    lastAccessed: "2024-02-01",
    estimatedCompletion: "2024-03-08",
    currentModule: {
      id: "module-1",
      number: 1,
      title: "Introduction to Data Analytics",
      progress: 0
    },
    stats: {
      modulesCompleted: 0,
      totalModules: 5,
      averageQuizScore: 0,
      timeInvested: "0h 0m",
      certificateEarned: false
    },
    rating: 4.7,
    reviewCount: 201,
    enrolledCount: 1100
  },
  {
    id: "enterprise-architecture-patterns",
    courseId: "ea-patterns-001",
    courseName: "Enterprise Architecture Patterns",
    instructor: "Robert Chang",
    instructorTitle: "Principal Enterprise Architect",
    thumbnail: "/placeholder.svg",
    progress: 80,
    status: 'in-progress',
    difficulty: 'advanced',
    duration: "12 weeks",
    credits: 24,
    enrolledDate: "2023-12-01",
    lastAccessed: "2024-02-05",
    estimatedCompletion: "2024-02-20",
    currentModule: {
      id: "module-10",
      number: 10,
      title: "Microservices Architecture",
      progress: 60
    },
    stats: {
      modulesCompleted: 9,
      totalModules: 12,
      averageQuizScore: 91,
      timeInvested: "38h 50m",
      certificateEarned: false
    },
    rating: 4.8,
    reviewCount: 145,
    enrolledCount: 445
  },
  {
    id: "change-management-excellence",
    courseId: "change-mgmt-001",
    courseName: "Change Management Excellence",
    instructor: "Lisa Thompson",
    instructorTitle: "Change Management Director",
    thumbnail: "/placeholder.svg",
    progress: 55,
    status: 'in-progress',
    difficulty: 'intermediate',
    duration: "6 weeks",
    credits: 12,
    enrolledDate: "2024-01-10",
    lastAccessed: "2024-02-04",
    estimatedCompletion: "2024-02-25",
    currentModule: {
      id: "module-4",
      number: 4,
      title: "Stakeholder Engagement Strategies",
      progress: 75
    },
    stats: {
      modulesCompleted: 3,
      totalModules: 6,
      averageQuizScore: 88,
      timeInvested: "14h 25m",
      certificateEarned: false
    },
    rating: 4.7,
    reviewCount: 178,
    enrolledCount: 890
  },
  {
    id: "cybersecurity-fundamentals",
    courseId: "cyber-fund-001",
    courseName: "Cybersecurity Fundamentals for Leaders",
    instructor: "James Martinez",
    instructorTitle: "Chief Information Security Officer",
    thumbnail: "/placeholder.svg",
    progress: 20,
    status: 'in-progress',
    difficulty: 'beginner',
    duration: "4 weeks",
    credits: 8,
    enrolledDate: "2024-01-28",
    lastAccessed: "2024-02-02",
    estimatedCompletion: "2024-02-28",
    currentModule: {
      id: "module-2",
      number: 2,
      title: "Threat Landscape Overview",
      progress: 40
    },
    stats: {
      modulesCompleted: 1,
      totalModules: 4,
      averageQuizScore: 83,
      timeInvested: "5h 15m",
      certificateEarned: false
    },
    rating: 4.6,
    reviewCount: 267,
    enrolledCount: 1450
  }
];


// Detailed course data for Digital Transformation Fundamentals
const dtFundamentalsModules: CourseModule[] = [
  {
    id: "module-1",
    number: 1,
    title: "Introduction to Digital Transformation",
    description: "Understanding the fundamentals of digital transformation and its impact on modern enterprises",
    duration: "2h 30m",
    status: 'completed',
    progress: 100,
    quizScore: 92,
    lessons: [
      { id: "lesson-1-1", title: "What is Digital Transformation?", type: 'video', duration: "25m", status: 'completed', completedAt: "2024-01-16" },
      { id: "lesson-1-2", title: "The Digital Imperative", type: 'reading', duration: "30m", status: 'completed', completedAt: "2024-01-16" },
      { id: "lesson-1-3", title: "Case Studies: Successful Transformations", type: 'video', duration: "45m", status: 'completed', completedAt: "2024-01-17" },
      { id: "lesson-1-4", title: "Module 1 Quiz", type: 'quiz', duration: "20m", status: 'completed', completedAt: "2024-01-17" }
    ]
  },
  {
    id: "module-2",
    number: 2,
    title: "Digital Strategy Development",
    description: "Learn how to develop and execute a comprehensive digital strategy",
    duration: "3h 15m",
    status: 'completed',
    progress: 100,
    quizScore: 88,
    lessons: [
      { id: "lesson-2-1", title: "Strategic Planning Framework", type: 'video', duration: "35m", status: 'completed', completedAt: "2024-01-18" },
      { id: "lesson-2-2", title: "Vision and Roadmap Creation", type: 'exercise', duration: "60m", status: 'completed', completedAt: "2024-01-19" },
      { id: "lesson-2-3", title: "Stakeholder Alignment", type: 'video', duration: "40m", status: 'completed', completedAt: "2024-01-20" },
      { id: "lesson-2-4", title: "Module 2 Quiz", type: 'quiz', duration: "25m", status: 'completed', completedAt: "2024-01-20" }
    ]
  },
  {
    id: "module-3",
    number: 3,
    title: "Technology Enablers",
    description: "Explore key technologies driving digital transformation",
    duration: "2h 45m",
    status: 'completed',
    progress: 100,
    quizScore: 85,
    lessons: [
      { id: "lesson-3-1", title: "Cloud Computing Essentials", type: 'video', duration: "30m", status: 'completed', completedAt: "2024-01-22" },
      { id: "lesson-3-2", title: "AI and Machine Learning Overview", type: 'video', duration: "35m", status: 'completed', completedAt: "2024-01-23" },
      { id: "lesson-3-3", title: "IoT and Edge Computing", type: 'reading', duration: "40m", status: 'completed', completedAt: "2024-01-24" },
      { id: "lesson-3-4", title: "Module 3 Quiz", type: 'quiz', duration: "20m", status: 'completed', completedAt: "2024-01-24" }
    ]
  },
  {
    id: "module-4",
    number: 4,
    title: "Organizational Transformation",
    description: "Managing organizational change during digital transformation",
    duration: "3h 00m",
    status: 'completed',
    progress: 100,
    quizScore: 90,
    lessons: [
      { id: "lesson-4-1", title: "Culture and Mindset Shift", type: 'video', duration: "40m", status: 'completed', completedAt: "2024-01-26" },
      { id: "lesson-4-2", title: "Building Digital Capabilities", type: 'video', duration: "35m", status: 'completed', completedAt: "2024-01-27" },
      { id: "lesson-4-3", title: "Leadership in Digital Age", type: 'discussion', duration: "45m", status: 'completed', completedAt: "2024-01-28" },
      { id: "lesson-4-4", title: "Module 4 Quiz", type: 'quiz', duration: "20m", status: 'completed', completedAt: "2024-01-28" }
    ]
  },
  {
    id: "module-5",
    number: 5,
    title: "Change Management Strategies",
    description: "Effective change management approaches for digital initiatives",
    duration: "2h 50m",
    status: 'in-progress',
    progress: 65,
    lessons: [
      { id: "lesson-5-1", title: "Change Management Frameworks", type: 'video', duration: "35m", status: 'completed', completedAt: "2024-02-01" },
      { id: "lesson-5-2", title: "Communication Strategies", type: 'video', duration: "30m", status: 'completed', completedAt: "2024-02-02" },
      { id: "lesson-5-3", title: "Resistance Management", type: 'exercise', duration: "45m", status: 'in-progress' },
      { id: "lesson-5-4", title: "Module 5 Quiz", type: 'quiz', duration: "20m", status: 'locked' }
    ]
  },
  {
    id: "module-6",
    number: 6,
    title: "Measuring Success and ROI",
    description: "Metrics and KPIs for digital transformation success",
    duration: "2h 30m",
    status: 'locked',
    progress: 0,
    lessons: [
      { id: "lesson-6-1", title: "Defining Success Metrics", type: 'video', duration: "30m", status: 'locked' },
      { id: "lesson-6-2", title: "ROI Calculation Methods", type: 'video', duration: "35m", status: 'locked' },
      { id: "lesson-6-3", title: "Continuous Improvement", type: 'reading', duration: "40m", status: 'locked' },
      { id: "lesson-6-4", title: "Final Assessment", type: 'quiz', duration: "25m", status: 'locked' }
    ]
  }
];

export const digitalTransformationFundamentals: CourseDetail = {
  ...enrolledCourses[0],
  description: "Master the fundamentals of digital transformation with this comprehensive course designed for leaders and practitioners. Learn strategic frameworks, technology enablers, and change management approaches to drive successful digital initiatives in your organization.",
  learningObjectives: [
    "Understand the core concepts and drivers of digital transformation",
    "Develop a comprehensive digital strategy aligned with business goals",
    "Identify and leverage key technology enablers",
    "Lead organizational change effectively during transformation",
    "Implement change management strategies for digital initiatives",
    "Measure and demonstrate ROI of digital transformation efforts"
  ],
  prerequisites: [
    "Basic understanding of business operations",
    "Familiarity with technology concepts (helpful but not required)",
    "Leadership or project management experience (recommended)"
  ],
  modules: dtFundamentalsModules,
  reviews: [
    {
      id: "review-1",
      userName: "Alex Johnson",
      userRole: "VP of Digital Strategy",
      rating: 5,
      date: "2024-01-20",
      comment: "Excellent course! The frameworks and case studies provided practical insights I could immediately apply to our transformation initiatives."
    },
    {
      id: "review-2",
      userName: "Maria Garcia",
      userRole: "IT Director",
      rating: 5,
      date: "2024-01-18",
      comment: "Dr. Chen's teaching style is engaging and the content is well-structured. The change management module was particularly valuable."
    },
    {
      id: "review-3",
      userName: "Tom Williams",
      userRole: "Business Analyst",
      rating: 4,
      date: "2024-01-15",
      comment: "Great foundational course. Would have liked more technical depth in some areas, but overall very comprehensive."
    }
  ],
  relatedCourses: ["dbp-framework-essentials", "change-management-excellence", "enterprise-architecture-patterns"]
};
