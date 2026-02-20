export type TrackCourseRequirement = "required" | "elective";

export interface LearningTrackCourseItem {
  id: string;
  title: string;
  duration: string;
  completed?: boolean;
}

export interface LearningTrackRuntimeCourse {
  courseId: string;
  title: string;
  duration: string;
  order: number;
  requirement: TrackCourseRequirement;
  weight: number;
}

export interface LearningTrackRuntime {
  completionRule: "all-required" | "required-plus-electives";
  minimumElectives: number;
  capstoneRequired: boolean;
  courses: LearningTrackRuntimeCourse[];
}

export interface LearningTrack {
  id: string;
  title: string;
  description: string;
  courses: number;
  duration: string;
  role: string;
  focusArea: string;
  certification: boolean;
  prerequisites: string;
  introduction?: string;
  highlights?: string[];
  learningOutcomes?: string[];
  courseList?: LearningTrackCourseItem[];
  targetAudience?: string;
  recommendedRoles?: string[];
  requirements?: string[];
  timeline?: string;
  assessmentInfo?: string;
  inclusions?: string[];
  trackRuntime: LearningTrackRuntime;
}

export type TrackEnrollmentStatus = "not-started" | "in-progress" | "completed";

export interface TrackEnrollment {
  id: string;
  userId: string;
  trackId: string;
  status: TrackEnrollmentStatus;
  progress: number;
  startedAt?: string;
  completedAt?: string;
  lastAccessed?: string;
  linkedCourseIds: string[];
  completedCourseIds: string[];
  nextCourseId?: string;
  capstoneCompleted?: boolean;
}
