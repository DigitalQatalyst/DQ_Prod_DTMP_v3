export type LearningLessonType =
  | "video"
  | "reading"
  | "quiz"
  | "exercise"
  | "discussion";

export type LearningLessonStatus =
  | "locked"
  | "available"
  | "not-started"
  | "in-progress"
  | "completed";

export type LearningModuleStatus =
  | "locked"
  | "available"
  | "in-progress"
  | "completed";

export type LearningEnrollmentStatus =
  | "not-started"
  | "in-progress"
  | "completed";

export interface LearningLesson {
  id: string;
  title: string;
  type: LearningLessonType;
  duration: string;
  status: LearningLessonStatus;
  description?: string;
  completedDate?: string;
  completedAt?: string;
}

export interface LearningModule {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  status: LearningModuleStatus;
  progress: number;
  lessons: LearningLesson[];
  quizScore?: number;
  quizAttempts?: number;
  unlockDate?: string;
}

export type LearningQuizResultStatus = "passed" | "pending" | "locked";

export interface LearningQuizResult {
  moduleId: string;
  moduleName: string;
  score: number | null;
  attempts: number;
  status: LearningQuizResultStatus;
}

export type LearningProjectStatus =
  | "not-started"
  | "in-progress"
  | "submitted"
  | "approved"
  | "rejected";

export interface LearningProject {
  id: string;
  title: string;
  description: string;
  status: LearningProjectStatus;
  score?: number;
  submittedAt?: string;
  reviewedAt?: string;
}

export interface LearningCertificateRequirement {
  id: string;
  text: string;
  met: boolean;
  detail?: string;
}

export type LearningCertificateType = "course" | "path";
export type LearningCertificateStatus = "earned" | "in-progress" | "revoked";

export interface LearningCertificate {
  id: string;
  type: LearningCertificateType;
  status: LearningCertificateStatus;
  title: string;
  ownerUserId: string;
  issuedDate?: string;
  validUntil?: string;
  version?: string;
}

export interface LearningCourseContract {
  id: string;
  title: string;
  description: string;
  duration: string;
  format: string;
  certification: boolean;
}
