// Learner feedback store — localStorage under "dtmp.lc.feedback"
// Two types: course-level ratings and module-level comments.

const FEEDBACK_KEY = "dtmp.lc.feedback";
const isBrowser = typeof window !== "undefined";

export interface CourseFeedback {
  courseId: string;
  rating: number; // 1-5
  comment: string;
  submittedAt: string; // ISO
  learnerName: string;
}

export interface ModuleComment {
  id: string;
  courseId: string;
  moduleId: string;
  moduleTitle: string;
  comment: string;
  submittedAt: string; // ISO
  learnerName: string;
  resolved: boolean;
  reply?: string;
  repliedAt?: string; // ISO
  repliedBy?: string;
}

interface FeedbackStore {
  courseFeedback: CourseFeedback[];
  moduleComments: ModuleComment[];
}

const SEED: FeedbackStore = {
  courseFeedback: [
    {
      courseId: "introduction-4d-governance-model",
      rating: 5,
      comment: "Very well structured. The DEWA-specific examples made the governance concepts much more applicable to our daily work.",
      submittedAt: "2026-01-28T09:15:00Z",
      learnerName: "John Doe",
    },
    {
      courseId: "dtmp-platform-orientation",
      rating: 4,
      comment: "Good overview. Would benefit from more hands-on exercises within the DTMP platform itself.",
      submittedAt: "2026-01-25T14:30:00Z",
      learnerName: "John Doe",
    },
  ],
  moduleComments: [
    {
      id: "mc-001",
      courseId: "enterprise-architecture-fundamentals-dewa",
      moduleId: "enterprise-architecture-fundamentals-dewa-mod-1",
      moduleTitle: "Enterprise Architecture Fundamentals for DEWA Foundations",
      comment: "Could we get more detail on how the EA framework connects to the Smart Grid initiative specifically?",
      submittedAt: "2026-02-10T10:20:00Z",
      learnerName: "John Doe",
      resolved: false,
    },
    {
      id: "mc-002",
      courseId: "enterprise-architecture-fundamentals-dewa",
      moduleId: "enterprise-architecture-fundamentals-dewa-mod-2",
      moduleTitle: "Methods and Application",
      comment: "The section on stakeholder mapping was very clear. Can we get the template referenced in this module?",
      submittedAt: "2026-02-14T16:45:00Z",
      learnerName: "John Doe",
      resolved: true,
    },
    {
      id: "mc-003",
      courseId: "ea-4-practice-dewa-approach",
      moduleId: "ea-4-practice-dewa-approach-mod-1",
      moduleTitle: "EA 4.0 Practice - DEWA's Approach Foundations",
      comment: "How does EA 4.0 differ from TOGAF in our DEWA context? The course mentions it but doesn't elaborate.",
      submittedAt: "2026-02-20T08:00:00Z",
      learnerName: "John Doe",
      resolved: false,
    },
  ],
};

function loadStore(): FeedbackStore {
  if (!isBrowser) return SEED;
  try {
    const raw = window.localStorage.getItem(FEEDBACK_KEY);
    if (!raw) {
      window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(SEED));
      return SEED;
    }
    return JSON.parse(raw) as FeedbackStore;
  } catch {
    return SEED;
  }
}

function saveStore(store: FeedbackStore): void {
  if (!isBrowser) return;
  window.localStorage.setItem(FEEDBACK_KEY, JSON.stringify(store));
}

// ── Course Feedback ──────────────────────────────────────────────────────────

export function getCourseFeedback(courseId: string): CourseFeedback | undefined {
  return loadStore().courseFeedback.find((f) => f.courseId === courseId);
}

export function getAllCourseFeedback(): CourseFeedback[] {
  return loadStore().courseFeedback;
}

export function submitCourseFeedback(feedback: Omit<CourseFeedback, "submittedAt">): void {
  const store = loadStore();
  const existing = store.courseFeedback.findIndex((f) => f.courseId === feedback.courseId);
  const entry: CourseFeedback = { ...feedback, submittedAt: new Date().toISOString() };
  if (existing >= 0) {
    store.courseFeedback[existing] = entry;
  } else {
    store.courseFeedback.unshift(entry);
  }
  saveStore(store);
}

// ── Module Comments ──────────────────────────────────────────────────────────

export function getModuleComments(courseId: string): ModuleComment[] {
  return loadStore().moduleComments.filter((c) => c.courseId === courseId);
}

export function getAllModuleComments(): ModuleComment[] {
  return loadStore().moduleComments;
}

export function addModuleComment(comment: Omit<ModuleComment, "id" | "submittedAt" | "resolved">): void {
  const store = loadStore();
  const entry: ModuleComment = {
    ...comment,
    id: `mc-${Date.now()}`,
    submittedAt: new Date().toISOString(),
    resolved: false,
  };
  store.moduleComments.unshift(entry);
  saveStore(store);
}

export function resolveModuleComment(id: string, reply?: string, repliedBy = "Course Coordinator"): void {
  const store = loadStore();
  const idx = store.moduleComments.findIndex((c) => c.id === id);
  if (idx >= 0) {
    store.moduleComments[idx].resolved = true;
    if (reply) {
      store.moduleComments[idx].reply = reply;
      store.moduleComments[idx].repliedAt = new Date().toISOString();
      store.moduleComments[idx].repliedBy = repliedBy;
    }
    saveStore(store);
  }
}
