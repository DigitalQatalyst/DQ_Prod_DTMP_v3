// ==========================================
// SHARED TYPES
// ==========================================

import type {
  LearningCertificate,
  LearningCertificateRequirement,
  LearningLesson,
  LearningLessonStatus,
  LearningLessonType,
  LearningModule,
  LearningModuleStatus,
  LearningProject,
  LearningQuizResult,
} from "../learningModel";

export type ModuleStatus = LearningModuleStatus;
export type LessonStatus = LearningLessonStatus;
export type LessonType = LearningLessonType;

// ==========================================
// USER VIEW TYPES
// ==========================================

export type Lesson = LearningLesson;

export type CourseModule = LearningModule;

export interface LearningOutcome {
  id: string;
  text: string;
  achieved: boolean;
}

export interface CourseStats {
  totalModules: number;
  completedModules: number;
  timeLeft: string;
  progress: number;
  dueDate: string;
}

export interface Resource {
  id: string;
  name: string;
  type: "pdf" | "powerpoint" | "spreadsheet" | "zip" | "link";
  fileType?: string;
  size?: string;
  description: string;
  downloadCount?: number;
  downloadable: boolean;
  availableAfterCompletion?: boolean;
}

export interface WeeklyActivity {
  week: string;
  hoursSpent: number;
}

export type QuizResult = LearningQuizResult;

export interface QuizQuestionOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizQuestionOption[];
  correctOptionId: string;
}

export interface QuizRuntimeConfig {
  moduleId: string;
  lessonId: string;
  title: string;
  passThreshold: number;
  maxAttempts: number;
  questions: QuizQuestion[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export type CertificateRequirement = LearningCertificateRequirement;

export interface InstructorMessage {
  name: string;
  message: string;
  postedAgo: string;
}

export interface UserCourseData {
  courseId: string;
  courseTitle: string;
  instructorName: string;
  institution: string;
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  stats: CourseStats;
  modules: CourseModule[];
  learningOutcomes: LearningOutcome[];
  resources: Resource[];
  weeklyActivity: WeeklyActivity[];
  quizResults: QuizResult[];
  quizConfigs?: QuizRuntimeConfig[];
  achievements: Achievement[];
  certificateRequirements: CertificateRequirement[];
  instructorMessage: InstructorMessage;
  totalTimeSpent: string;
  avgDailyActivity: string;
  estimatedTimeRemaining: string;
  cpeCredits: number;
  cpeDomains: { name: string; credits: number }[];
  cpeReportableTo: string[];
  finalProject?: LearningProject;
  issuedCertificates?: LearningCertificate[];
}

// ==========================================
// ADMIN VIEW TYPES
// ==========================================

export interface AdminStats {
  totalEnrollments: number;
  completedCount: number;
  completedPercentage: number;
  inProgressCount: number;
  inProgressPercentage: number;
  averageRating: number;
}

export interface EnrollmentTrend {
  month: string;
  enrollments: number;
  completions: number;
}

export interface CompletionFunnel {
  stage: string;
  count: number;
  percentage: number;
}

export interface ActivityFeedItem {
  id: string;
  message: string;
  timestamp: string;
}

export interface AdminAlert {
  id: string;
  type: "warning" | "info" | "error";
  message: string;
}

export type StudentStatus = "completed" | "active" | "at-risk" | "struggling";

export interface EnrolledStudent {
  id: string;
  name: string;
  enrolledDate: string;
  enrolledDays: number;
  progress: number;
  modulesCompleted: string;
  avgScore: number;
  status: StudentStatus;
  lastActivity: string;
}

export interface ModulePerformance {
  moduleNumber: number;
  moduleName: string;
  started: number;
  startedPercentage: number;
  completed: number;
  completedPercentage: number;
  avgScore: string;
  avgTime: string;
  passRate: string;
  dropoffRate?: string;
  flagged?: boolean;
}

export interface QuizDistribution {
  range: string;
  percentage: number;
}

export interface FeedbackRating {
  stars: number;
  percentage: number;
}

export interface ContentLesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  views?: number;
  reads?: number;
  attempts?: number;
  avgScore?: string;
  passRate?: string;
}

export interface ContentModule {
  id: string;
  number: number;
  title: string;
  lessons: ContentLesson[];
}

export interface ContentResource {
  id: string;
  name: string;
  fileType: string;
  size: string;
  downloads: number;
}

export interface CourseSettings {
  courseTitle: string;
  courseCode: string;
  duration: string;
  difficulty: string;
  language: string;
  enrollmentType: "open" | "approval" | "invitation";
  maxEnrollments: string;
  enrollmentStart: string;
  enrollmentEnd: string;
  passingScore: number;
  quizAttempts: string;
  requireCompleteModules: boolean;
  requirePassQuizzes: boolean;
  requireFinalProject: boolean;
  requireFinalExam: boolean;
  finalExamPassScore: number;
  cpeCredits: number;
  primaryInstructor: string;
  notifyNewEnrollments: boolean;
  notifyWeeklyReports: boolean;
  notifyInactivity: boolean;
  notifyQuizFailures: boolean;
}

export interface AdminCourseData {
  courseId: string;
  courseTitle: string;
  stats: AdminStats;
  enrollmentTrends: EnrollmentTrend[];
  completionFunnel: CompletionFunnel[];
  activityFeed: ActivityFeedItem[];
  alerts: AdminAlert[];
  recentActivitySummary: {
    newEnrollments: number;
    completedModule5: number;
    earnedCertificates: number;
    quizAttempts: number;
    avgQuizScore: number;
    requestedAssistance: number;
    resourceDownloads: number;
  };
  students: EnrolledStudent[];
  modulePerformance: ModulePerformance[];
  quizDistribution: QuizDistribution[];
  feedbackRatings: FeedbackRating[];
  overallRating: number;
  totalReviews: number;
  commonPraise: { text: string; count: number }[];
  commonComplaints: { text: string; count: number }[];
  contentModules: ContentModule[];
  contentResources: ContentResource[];
  settings: CourseSettings;
}
