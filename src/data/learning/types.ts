import type {
  LearningEnrollmentStatus,
  LearningLesson,
  LearningModule,
} from "../learningCenter/learningModel";

// Learning Center Data Types

export interface CourseEnrollment {
  id: string; // URL-friendly slug
  courseId: string;
  courseName: string;
  instructor: string;
  instructorTitle: string;
  thumbnail: string;
  progress: number; // 0-100
  status: LearningEnrollmentStatus;
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

export type Lesson = LearningLesson;

export type CourseModule = LearningModule;

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
