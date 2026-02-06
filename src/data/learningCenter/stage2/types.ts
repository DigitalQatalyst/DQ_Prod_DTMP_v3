// ==========================================
// SHARED TYPES
// ==========================================

export type ModuleStatus = "completed" | "in-progress" | "locked";
export type LessonStatus = "completed" | "in-progress" | "not-started" | "locked";
export type LessonType = "video" | "reading" | "quiz" | "exercise" | "discussion";

// ==========================================
// USER VIEW TYPES
// ==========================================

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  duration: string;
  status: LessonStatus;
  description?: string;
  completedDate?: string;
}

export interface CourseModule {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  status: ModuleStatus;
  progress: number;
  lessons: Lesson[];
  quizScore?: number;
  quizAttempts?: number;
  unlockDate?: string;
}

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

export interface QuizResult {
  moduleId: string;
  moduleName: string;
  score: number | null;
  attempts: number;
  status: "passed" | "pending" | "locked";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: string;
}

export interface CertificateRequirement {
  id: string;
  text: string;
  met: boolean;
  detail?: string;
}

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
  achievements: Achievement[];
  certificateRequirements: CertificateRequirement[];
  instructorMessage: InstructorMessage;
  totalTimeSpent: string;
  avgDailyActivity: string;
  estimatedTimeRemaining: string;
  cpeCredits: number;
  cpeDomains: { name: string; credits: number }[];
  cpeReportableTo: string[];
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
