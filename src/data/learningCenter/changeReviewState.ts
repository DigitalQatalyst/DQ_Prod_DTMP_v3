import type { CourseSettings } from "./stage2/types";

export type LearningChangeStatus = "draft" | "submitted" | "in-review" | "approved" | "rejected";

export interface LearningSettingDiff {
  field: keyof CourseSettings;
  label: string;
  before: string;
  after: string;
}

export interface LearningChangeSet {
  id: string;
  courseId: string;
  courseName: string;
  requestedBy: string;
  requestedAt: string;
  status: LearningChangeStatus;
  deleteRequested: boolean;
  settingsBefore: CourseSettings;
  settingsAfter: CourseSettings;
  diffs: LearningSettingDiff[];
  stage3RequestId?: string;
  reviewedAt?: string;
  reviewNote?: string;
}

const STORAGE_KEY = "dtmp.learning.changeSets";
const isBrowser = typeof window !== "undefined";

const labels: Record<keyof CourseSettings, string> = {
  courseTitle: "Course Title",
  courseCode: "Course Code",
  duration: "Duration",
  difficulty: "Difficulty",
  language: "Language",
  enrollmentType: "Enrollment Type",
  maxEnrollments: "Max Enrollments",
  enrollmentStart: "Enrollment Start",
  enrollmentEnd: "Enrollment End",
  passingScore: "Passing Score",
  quizAttempts: "Quiz Attempts",
  requireCompleteModules: "Require Complete Modules",
  requirePassQuizzes: "Require Pass Quizzes",
  requireFinalProject: "Require Final Project",
  requireFinalExam: "Require Final Exam",
  finalExamPassScore: "Final Exam Pass Score",
  cpeCredits: "CPE Credits",
  primaryInstructor: "Primary Instructor",
  notifyNewEnrollments: "Notify New Enrollments",
  notifyWeeklyReports: "Notify Weekly Reports",
  notifyInactivity: "Notify Inactivity",
  notifyQuizFailures: "Notify Quiz Failures",
};

const parseJson = <T>(raw: string | null, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const readChangeSets = (): LearningChangeSet[] => {
  if (!isBrowser) return [];
  return parseJson<LearningChangeSet[]>(window.localStorage.getItem(STORAGE_KEY), []);
};

const writeChangeSets = (changeSets: LearningChangeSet[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(changeSets.slice(0, 200)));
};

const toDisplay = (value: unknown) => {
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value ?? "");
};

export const buildLearningSettingDiffs = (
  before: CourseSettings,
  after: CourseSettings
): LearningSettingDiff[] => {
  const keys = Object.keys(before) as Array<keyof CourseSettings>;
  return keys
    .filter((key) => before[key] !== after[key])
    .map((key) => ({
      field: key,
      label: labels[key],
      before: toDisplay(before[key]),
      after: toDisplay(after[key]),
    }));
};

export const upsertLearningDraftChangeSet = ({
  courseId,
  courseName,
  requestedBy,
  settingsBefore,
  settingsAfter,
  deleteRequested,
}: {
  courseId: string;
  courseName: string;
  requestedBy: string;
  settingsBefore: CourseSettings;
  settingsAfter: CourseSettings;
  deleteRequested: boolean;
}): LearningChangeSet => {
  const existing = readChangeSets();
  const diffs = buildLearningSettingDiffs(settingsBefore, settingsAfter);
  const now = new Date().toISOString();

  const prior = existing.find(
    (set) => set.courseId === courseId && (set.status === "draft" || set.status === "submitted" || set.status === "in-review")
  );

  const next: LearningChangeSet = prior
    ? {
        ...prior,
        courseName,
        requestedBy,
        requestedAt: now,
        deleteRequested,
        settingsBefore,
        settingsAfter,
        diffs,
      }
    : {
        id: `learning-change-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        courseId,
        courseName,
        requestedBy,
        requestedAt: now,
        status: "draft",
        deleteRequested,
        settingsBefore,
        settingsAfter,
        diffs,
      };

  const without = existing.filter((set) => set.id !== next.id);
  writeChangeSets([next, ...without]);
  return next;
};

export const getLearningChangeSetById = (id: string): LearningChangeSet | undefined =>
  readChangeSets().find((set) => set.id === id);

export const getLearningDraftChangeSetByCourse = (
  courseId: string
): LearningChangeSet | undefined =>
  readChangeSets().find(
    (set) => set.courseId === courseId && (set.status === "draft" || set.status === "submitted" || set.status === "in-review")
  );

export const submitLearningDraftChangeSet = (changeSetId: string): LearningChangeSet | null => {
  const all = readChangeSets();
  let updated: LearningChangeSet | null = null;
  const next = all.map((set) => {
    if (set.id !== changeSetId) return set;
    updated = {
      ...set,
      status: "submitted",
      requestedAt: new Date().toISOString(),
    };
    return updated;
  });
  writeChangeSets(next);
  return updated;
};

export const attachStage3RequestToLearningChange = (
  changeSetId: string,
  stage3RequestId: string
): LearningChangeSet | null => {
  const all = readChangeSets();
  let updated: LearningChangeSet | null = null;
  const next = all.map((set) => {
    if (set.id !== changeSetId) return set;
    updated = {
      ...set,
      stage3RequestId,
      status: "in-review",
    };
    return updated;
  });
  writeChangeSets(next);
  return updated;
};

export const updateLearningChangeSetStatus = (
  changeSetId: string,
  status: "in-review" | "approved" | "rejected",
  reviewNote?: string
): LearningChangeSet | null => {
  const all = readChangeSets();
  let updated: LearningChangeSet | null = null;
  const next = all.map((set) => {
    if (set.id !== changeSetId) return set;
    updated = {
      ...set,
      status,
      reviewedAt: new Date().toISOString(),
      reviewNote: reviewNote?.trim() || set.reviewNote,
    };
    return updated;
  });
  writeChangeSets(next);
  return updated;
};
