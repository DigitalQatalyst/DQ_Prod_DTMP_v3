// Persistent learner enrollment store — localStorage under "dtmp.lc.enrollments"
// Single source of truth for which courses the user is enrolled in, used by
// Stage 2 My Courses accordion and course workspace.

const STORE_KEY = "dtmp.lc.enrollments";
const isBrowser = typeof window !== "undefined";

export interface EnrolledEntry {
  courseId: string;       // matches courses.ts id (DEWA catalog ID)
  enrolledAt: string;     // ISO date string
  progress: number;       // 0-100
  status: "not-started" | "in-progress" | "completed";
  averageQuizScore: number;
  timeInvested: string;   // e.g. "12h 30m"
  totalModules: number;
}

// Seeded demo enrollments — real DEWA course IDs from courses.ts
const SEED: EnrolledEntry[] = [
  {
    courseId: "enterprise-architecture-fundamentals-dewa",
    enrolledAt: "2026-01-08",
    progress: 65,
    status: "in-progress",
    averageQuizScore: 84,
    timeInvested: "8h 20m",
    totalModules: 3,
  },
  {
    courseId: "introduction-4d-governance-model",
    enrolledAt: "2026-01-15",
    progress: 100,
    status: "completed",
    averageQuizScore: 91,
    timeInvested: "5h 45m",
    totalModules: 3,
  },
  {
    courseId: "dtmp-platform-orientation",
    enrolledAt: "2026-01-20",
    progress: 100,
    status: "completed",
    averageQuizScore: 88,
    timeInvested: "2h 10m",
    totalModules: 3,
  },
  {
    courseId: "ea-4-practice-dewa-approach",
    enrolledAt: "2026-02-02",
    progress: 30,
    status: "in-progress",
    averageQuizScore: 78,
    timeInvested: "4h 00m",
    totalModules: 3,
  },
  {
    courseId: "ai-in-utility-operations-introduction",
    enrolledAt: "2026-02-10",
    progress: 100,
    status: "completed",
    averageQuizScore: 90,
    timeInvested: "5h 30m",
    totalModules: 3,
  },
];

function seedIfEmpty(entries: EnrolledEntry[]): EnrolledEntry[] {
  if (entries.length > 0) return entries;
  return SEED;
}

export function getEnrollments(): EnrolledEntry[] {
  if (!isBrowser) return SEED;
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    const parsed: EnrolledEntry[] = raw ? JSON.parse(raw) : [];
    const seeded = seedIfEmpty(parsed);
    if (seeded !== parsed) {
      window.localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
    }
    return seeded;
  } catch {
    return SEED;
  }
}

export function isEnrolled(courseId: string): boolean {
  return getEnrollments().some((e) => e.courseId === courseId);
}

export function addEnrollment(courseId: string, totalModules = 3): EnrolledEntry[] {
  if (!isBrowser) return [];
  const existing = getEnrollments().filter((e) => e.courseId !== courseId);
  const entry: EnrolledEntry = {
    courseId,
    enrolledAt: new Date().toISOString(),
    progress: 0,
    status: "not-started",
    averageQuizScore: 0,
    timeInvested: "0h 00m",
    totalModules,
  };
  const updated = [entry, ...existing];
  window.localStorage.setItem(STORE_KEY, JSON.stringify(updated));
  return updated;
}

export function updateEnrollmentProgress(
  courseId: string,
  progress: number,
  averageQuizScore?: number
): EnrolledEntry[] {
  if (!isBrowser) return [];
  const updated = getEnrollments().map((e) => {
    if (e.courseId !== courseId) return e;
    return {
      ...e,
      progress,
      status: progress >= 100 ? ("completed" as const) : progress > 0 ? ("in-progress" as const) : e.status,
      averageQuizScore: averageQuizScore ?? e.averageQuizScore,
    };
  });
  window.localStorage.setItem(STORE_KEY, JSON.stringify(updated));
  return updated;
}
