// Learning Center Data Types

export interface CourseEnrollment {
  id: string; // URL-friendly slug
  courseId: string;
  courseName: string;
  instructor: string;
  instructorTitle: string;
  thumbnail: string;
  progress: number; // 0-100
  status: 'not-started' | 'in-progress' | 'completed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // e.g., "6 weeks"
  credits: number; // CPE credits
  enrolledDate: string;
  lastAccessed: string;
  estimatedCompletion: string;
  currentModule: {
    id: string;
    number: number;
    title: string;
    progress: number; // 0-100
  };
  stats: {
    modulesCompleted: number;
    totalModules: number;
    averageQuizScore: number;
    timeInvested: string; // e.g., "12h 35m"
    certificateEarned: boolean;
  };
  rating: number; // 0-5
  reviewCount: number;
  enrolledCount: number;
}

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'reading' | 'exercise' | 'quiz' | 'discussion';
  duration: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  completedAt?: string;
}

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
  progress: number; // 0-100
  quizScore?: number; // If completed
  lessons: Lesson[];
}

export interface CourseReview {
  id: string;
  userName: string;
  userRole: string;
  rating: number;
  date: string;
  comment: string;
}

export interface CourseDetail extends CourseEnrollment {
  description: string;
  learningObjectives: string[];
  prerequisites: string[];
  modules: CourseModule[];
  reviews: CourseReview[];
  relatedCourses: string[]; // Course IDs
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  courseCount: number;
  totalDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  enrolled: boolean;
  progress: number; // 0-100
  courses: string[]; // Course IDs in order
  estimatedCompletion?: string;
  category: string;
}

export interface Resource {
  id: string;
  title: string;
  type: 'document' | 'template' | 'tool' | 'video' | 'article';
  category: string;
  description: string;
  fileSize?: string;
  downloadUrl: string;
  thumbnail?: string;
  relatedCourses: string[]; // Course IDs
  downloads: number;
  lastUpdated: string;
}
