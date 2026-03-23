// Change request types for Learning Centre content governance
export type LCChangeType =
  | "update-course-metadata"
  | "update-course-content"
  | "add-new-course"
  | "unpublish-course"
  | "archive-course"
  | "update-learning-track"
  | "add-new-learning-track"
  | "update-review";

export const lcChangeTypeLabels: Record<LCChangeType, string> = {
  "update-course-metadata": "Update Course Metadata",
  "update-course-content": "Update Course Content",
  "add-new-course": "Add New Course",
  "unpublish-course": "Unpublish Course",
  "archive-course": "Archive Course",
  "update-learning-track": "Update Learning Track",
  "add-new-learning-track": "Add New Learning Track",
  "update-review": "Update Review",
};

export type LCChangeStatus =
  | "draft"
  | "submitted"
  | "approved"
  | "rejected"
  | "in-implementation"
  | "implemented"
  | "verified"
  | "closed-not-verified";

export type LCUrgency = "low" | "medium" | "high" | "critical";

export interface LCChangeRequest {
  id: string;
  subject: string;
  subjectId: string;
  subjectType: "course" | "track" | "review";
  changeType: LCChangeType;
  changeDescription: string;
  reason: string;
  urgency: LCUrgency;
  status: LCChangeStatus;
  submittedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  approvalNote?: string;
  implementationNote?: string;
  implementedAt?: string;
  verifiedAt?: string;
}

const STORAGE_KEY = "dtmp.lc.changeRequests";

const SEED_DATA: LCChangeRequest[] = [
  {
    id: "lcr-001",
    subject: "EA 4.0 Practice - DEWA's Approach",
    subjectId: "ea-4-practice-dewa-approach",
    subjectType: "course",
    changeType: "update-course-metadata",
    changeDescription:
      "Update the course duration from 10 hours to 12 hours to reflect the addition of new KPI modules. Update the lesson count from 12 to 14. Revise the prerequisite text to explicitly mention the EA Fundamentals course as recommended.",
    reason:
      "Two new lessons were added to the KPI and EA Charter sections during the Q1 2026 content refresh. Duration and lesson count metadata is now out of sync with actual course content.",
    urgency: "medium",
    status: "submitted",
    submittedBy: "Sarah Al Hashimi",
    submittedAt: "2026-03-14T09:22:00Z",
  },
  {
    id: "lcr-002",
    subject: "Smart Grid Architecture - Design Principles",
    subjectId: "smart-grid-architecture-design-principles",
    subjectType: "course",
    changeType: "update-course-content",
    changeDescription:
      "Replace the substation automation module (Module 2, Lesson 3) with updated content reflecting IEC 61850 Edition 2.1 standards. Add a new worked example covering DEWA's 400kV substation automation rollout at Al Quoz. Update all references to legacy SCADA protocols in Module 3.",
    reason:
      "IEC 61850 Edition 2.1 was published in late 2025 and the current module references deprecated protocol specifications. The Al Quoz case study has been cleared for inclusion by the Transmission division communications team.",
    urgency: "high",
    status: "approved",
    submittedBy: "Ahmed Al Mansouri",
    submittedAt: "2026-03-08T11:45:00Z",
    approvedBy: "EA Office Approver",
    approvedAt: "2026-03-10T14:30:00Z",
    approvalNote:
      "Approved. Transmission team has confirmed the Al Quoz case study details are cleared for inclusion. IEC 61850 update is urgent for technical accuracy.",
  },
  {
    id: "lcr-003",
    subject: "Digital Twin Architecture for DEWA",
    subjectId: "digital-twin-architecture-dewa",
    subjectType: "course",
    changeType: "add-new-course",
    changeDescription:
      "Add a new Intermediate-level course titled 'Digital Twin Architecture for DEWA' covering: (1) Digital twin concepts and DEWA's current twin deployments in Generation and Transmission, (2) Architecture patterns for real-time OT data ingestion into twin models, (3) Integration with the Virtual Engineer programme, (4) Governance and data quality requirements for twin fidelity. Estimated duration: 10 hours, 12 lessons. Provider: Internal. Division tags: Generation, Transmission, Digital DEWA & Moro Hub.",
    reason:
      "DEWA's Digital Twin programme is accelerating in 2026 with active deployments in Generation and Transmission. There is no current learning content covering digital twin architecture for DEWA staff. Multiple division leads have requested this capability building material through the EA Office.",
    urgency: "high",
    status: "in-implementation",
    submittedBy: "Khalid Ibrahim",
    submittedAt: "2026-02-28T08:00:00Z",
    approvedBy: "EA Office Approver",
    approvedAt: "2026-03-03T10:15:00Z",
    approvalNote:
      "Approved for development. Assign to the Internal content team with a target publish date of 30 April 2026.",
  },
  {
    id: "lcr-004",
    subject: "DEWA EA Practitioner Pathway",
    subjectId: "dewa-ea-practitioner-pathway",
    subjectType: "track",
    changeType: "update-learning-track",
    changeDescription:
      "Add the new 'Digital Twin Architecture for DEWA' course (once published) as Course 8 in the DEWA EA Practitioner Pathway, positioned after the EA Assessment Methods course. Update the track duration from 'Approx. 4 months' to 'Approx. 5 months'. Update the track description to reference digital twin governance as a practitioner competency.",
    reason:
      "The Digital Twin Architecture course is being added to the catalogue and should be incorporated into the core EA practitioner pathway as digital twin governance is now a core EA competency in DEWA's operating model.",
    urgency: "low",
    status: "implemented",
    submittedBy: "Sarah Al Hashimi",
    submittedAt: "2026-03-01T13:00:00Z",
    approvedBy: "EA Office Approver",
    approvedAt: "2026-03-05T09:45:00Z",
    approvalNote: "Approved. Implement once the Digital Twin course (LCR-003) is published.",
    implementationNote:
      "Track metadata updated in the system. The Digital Twin course will be added to the course sequence upon publication. Track description and duration fields updated.",
    implementedAt: "2026-03-12T16:00:00Z",
  },
  {
    id: "lcr-005",
    subject: "Introduction to IT/OT Convergence",
    subjectId: "introduction-it-ot-convergence",
    subjectType: "course",
    changeType: "archive-course",
    changeDescription:
      "Archive the 'Introduction to IT/OT Convergence' Beginner course and redirect enrolled learners to the Intermediate 'Advanced IT/OT Convergence Architecture' course. The Beginner course content is now fully subsumed by the Advanced course's foundational module.",
    reason:
      "Content audit in February 2026 identified significant duplication between this Beginner course and the foundational module of the Advanced IT/OT Convergence Architecture course. Maintaining both creates confusion for learners selecting courses and inflates the catalogue unnecessarily.",
    urgency: "low",
    status: "rejected",
    submittedBy: "Ahmed Al Mansouri",
    submittedAt: "2026-02-20T10:30:00Z",
    rejectionReason:
      "Rejected. The Beginner course serves a different audience - non-technical staff in Generation and Water Services who are not ready for the Advanced course. Archiving it would remove the only accessible entry point for this cohort. Recommend raising a content update request to refresh the Beginner course instead.",
  },
];

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function loadFromStorage(): LCChangeRequest[] {
  if (!isBrowser()) return [...SEED_DATA];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed on first load
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
      return [...SEED_DATA];
    }
    const parsed = JSON.parse(raw) as LCChangeRequest[];
    return parsed;
  } catch {
    return [...SEED_DATA];
  }
}

function saveToStorage(data: LCChangeRequest[]): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getLCChangeRequests(): LCChangeRequest[] {
  return loadFromStorage();
}

export function getLCChangeRequestById(id: string): LCChangeRequest | undefined {
  return loadFromStorage().find((r) => r.id === id);
}

export function saveLCChangeRequest(
  req: Omit<LCChangeRequest, "id" | "submittedAt">
): LCChangeRequest {
  const all = loadFromStorage();
  const newId = `lcr-${String(all.length + 1).padStart(3, "0")}-${Date.now()}`;
  const newReq: LCChangeRequest = {
    ...req,
    id: newId,
    submittedAt: new Date().toISOString(),
  };
  const updated = [...all, newReq];
  saveToStorage(updated);
  return newReq;
}

export function updateLCChangeRequest(
  id: string,
  updates: Partial<LCChangeRequest>
): LCChangeRequest | null {
  const all = loadFromStorage();
  const idx = all.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  const updated = { ...all[idx], ...updates };
  all[idx] = updated;
  saveToStorage(all);
  return updated;
}
