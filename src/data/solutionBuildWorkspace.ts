import { createStage3Request } from "@/data/stage3";
import { solutionBuilds, DEWA_DIVISIONS, type DewaDivision, type SolutionBuild } from "@/data/blueprints/solutionBuilds";

export type BuildRequestStatus =
  | "Submitted"
  | "Triage"
  | "Queue"
  | "In Progress"
  | "Testing"
  | "Complete"
  | "On Hold"
  | "Revision";

export type BuildRequestPriority = "Critical" | "High" | "Medium" | "Low";

export type BuildTimeline = "ASAP (expedited)" | "Standard" | "Planned";

export interface BuildMilestone {
  id: string;
  label: string;
  completed: boolean;
  completedAt?: string;
}

export const DEFAULT_MILESTONES: BuildMilestone[] = [
  { id: "kickoff", label: "Kickoff & Requirements Review", completed: false },
  { id: "architecture", label: "Architecture & Design Review", completed: false },
  { id: "build", label: "Build in Progress", completed: false },
  { id: "integration", label: "Integration & Testing", completed: false },
  { id: "uat", label: "UAT", completed: false },
  { id: "golive", label: "Go-Live & Handover", completed: false },
];

export interface BuildRequestDraft {
  dewaDivision: DewaDivision;
  programme: string;
  customisationSelections: string[];
  businessNeed: string;
  currentState: string;
  keyRequirements: string;
  timelinePreference: BuildTimeline;
  plannedStartDate?: string;
  priority: BuildRequestPriority;
  additionalRequirements: string;
  fromSpecId?: string;
  fromSpecTitle?: string;
}

export interface BuildRequest extends BuildRequestDraft {
  id: string;
  buildId: string;
  buildTitle: string;
  stream: string;
  submittedAt: string;
  status: BuildRequestStatus;
  progress: number;
  slaStatus: "On Track" | "At Risk" | "Breached";
  milestones: BuildMilestone[];
  assignedTeam?: string;
  stage3RequestId?: string;
}

export interface BuildRevision {
  id: string;
  requestId: string;
  note: string;
  createdAt: string;
  status: "Revision Raised" | "In Review" | "Resolved";
}

// ─── Storage keys ─────────────────────────────────────────────────────────────
const REQUESTS_KEY = "dewa_build_requests";
const REVISIONS_KEY = "dewa_build_revisions";
const COUNTER_KEY = "dewa_build_request_counter";
const SEEDED_KEY = "dewa_build_seeded";

const isBrowser = typeof window !== "undefined";

// ─── Request counter ──────────────────────────────────────────────────────────
function nextBldRef(): string {
  if (!isBrowser) return "BLD-2026-001";
  const year = new Date().getFullYear();
  const raw = localStorage.getItem(COUNTER_KEY);
  const n = raw ? parseInt(raw, 10) + 1 : 1;
  localStorage.setItem(COUNTER_KEY, String(n));
  return `BLD-${year}-${String(n).padStart(3, "0")}`;
}

// ─── Seed demo data if empty ──────────────────────────────────────────────────
function seedDemoDataIfEmpty() {
  if (!isBrowser) return;
  if (localStorage.getItem(SEEDED_KEY)) return;

  const demo: BuildRequest[] = [
    {
      id: "BLD-2026-001",
      buildId: "dws-01",
      buildTitle: "DEWA Digital Workplace Hub Deployment (Microsoft 365)",
      stream: "DWS",
      dewaDivision: "All Divisions" as DewaDivision,
      programme: "Digital DEWA Programme",
      customisationSelections: ["tier", "sharepoint"],
      businessNeed: "Modernise collaboration and productivity tools across all DEWA divisions.",
      currentState: "Legacy email and shared drives with no unified collaboration platform.",
      keyRequirements: "M365 E3 licensing, Teams rollout, SharePoint intranet for all 6 divisions.",
      timelinePreference: "Standard",
      priority: "High",
      additionalRequirements: "",
      submittedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      status: "In Progress",
      progress: 40,
      slaStatus: "On Track",
      milestones: [
        { id: "kickoff", label: "Kickoff & Requirements Review", completed: true, completedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString() },
        { id: "architecture", label: "Architecture & Design Review", completed: true, completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
        { id: "build", label: "Build in Progress", completed: false },
        { id: "integration", label: "Integration & Testing", completed: false },
        { id: "uat", label: "UAT", completed: false },
        { id: "golive", label: "Go-Live & Handover", completed: false },
      ],
      assignedTeam: "Team DWS",
    },
    {
      id: "BLD-2026-002",
      buildId: "dxp-03",
      buildTitle: "DEWA Rammas AI Platform Deployment",
      stream: "DXP",
      dewaDivision: "Customer Services",
      programme: "AI Strategy",
      customisationSelections: ["engine", "lang"],
      businessNeed: "Deploy AI-powered customer service assistant to reduce contact centre load.",
      currentState: "Manual contact centre handling all customer queries.",
      keyRequirements: "Arabic + English support, WhatsApp Business integration, human handoff.",
      timelinePreference: "Standard",
      priority: "High",
      additionalRequirements: "",
      submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: "Submitted",
      progress: 0,
      slaStatus: "On Track",
      milestones: DEFAULT_MILESTONES.map(m => ({ ...m })),
    },
  ];

  localStorage.setItem(REQUESTS_KEY, JSON.stringify(demo));
  localStorage.setItem(SEEDED_KEY, "1");
}

// ─── Read/write helpers ───────────────────────────────────────────────────────
function readStorage<T>(key: string, fallback: T): T {
  if (!isBrowser) return fallback;
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

function writeStorage(key: string, value: unknown) {
  if (!isBrowser) return;
  localStorage.setItem(key, JSON.stringify(value));
}

// ─── CRUD helpers ─────────────────────────────────────────────────────────────
export function listBuildRequests(): BuildRequest[] {
  seedDemoDataIfEmpty();
  return readStorage<BuildRequest[]>(REQUESTS_KEY, []);
}

export function getBuildRequestById(id: string): BuildRequest | undefined {
  return listBuildRequests().find(r => r.id === id);
}

function saveBuildRequests(reqs: BuildRequest[]) {
  writeStorage(REQUESTS_KEY, reqs);
}

export function createBuildRequest(buildId: string, draft: BuildRequestDraft): BuildRequest {
  const build = solutionBuilds.find(b => b.id === buildId);
  const id = nextBldRef();
  const req: BuildRequest = {
    ...draft,
    id,
    buildId,
    buildTitle: build ? build.title : draft.businessNeed.slice(0, 60),
    stream: build ? build.solutionType : "DBP",
    submittedAt: new Date().toISOString(),
    status: "Submitted",
    progress: 0,
    slaStatus: "On Track",
    milestones: DEFAULT_MILESTONES.map(m => ({ ...m })),
  };

  // Wire into Stage 3
  try {
    const s3Request = createStage3Request({
      type: "solution-build",
      title: req.buildTitle,
      description: draft.businessNeed.slice(0, 120),
      requester: {
        name: "Current User",
        email: "user@dewa.ae",
        department: draft.dewaDivision,
        organization: "DEWA",
      },
      priority: draft.priority === "Critical" ? "critical" : draft.priority === "High" ? "high" : draft.priority === "Medium" ? "medium" : "low",
      estimatedHours: 40,
      tags: [req.stream.toLowerCase(), "solution-build"],
    });
    req.stage3RequestId = s3Request.id;
  } catch {
    // graceful — Stage 3 wiring is non-critical
  }

  const reqs = listBuildRequests();
  reqs.unshift(req);
  saveBuildRequests(reqs);
  return req;
}

export function createCustomBuildRequest(input: {
  dewaDivision: DewaDivision;
  programme: string;
  businessNeed: string;
  currentState: string;
  keyRequirements: string;
  timelinePreference: BuildTimeline;
  priority: BuildRequestPriority;
  additionalRequirements: string;
}): BuildRequest {
  const draft: BuildRequestDraft = {
    ...input,
    customisationSelections: [],
  };
  const id = nextBldRef();
  const req: BuildRequest = {
    ...draft,
    id,
    buildId: "custom",
    buildTitle: input.businessNeed.slice(0, 60) || "Custom Build Request",
    stream: "DBP",
    submittedAt: new Date().toISOString(),
    status: "Submitted",
    progress: 0,
    slaStatus: "On Track",
    milestones: DEFAULT_MILESTONES.map(m => ({ ...m })),
  };

  try {
    const s3Request = createStage3Request({
      type: "solution-build",
      title: `Custom Build: ${req.buildTitle}`,
      description: input.businessNeed.slice(0, 120),
      requester: {
        name: "Current User",
        email: "user@dewa.ae",
        department: input.dewaDivision,
        organization: "DEWA",
      },
      priority: input.priority === "Critical" ? "critical" : input.priority === "High" ? "high" : input.priority === "Medium" ? "medium" : "low",
      estimatedHours: 40,
      tags: ["custom", "solution-build"],
    });
    req.stage3RequestId = s3Request.id;
  } catch {
    // graceful
  }

  const reqs = listBuildRequests();
  reqs.unshift(req);
  saveBuildRequests(reqs);
  return req;
}

export function updateBuildRequestStatus(id: string, status: BuildRequestStatus, progress?: number): void {
  const reqs = listBuildRequests();
  const idx = reqs.findIndex(r => r.id === id);
  if (idx === -1) return;
  reqs[idx].status = status;
  if (progress !== undefined) reqs[idx].progress = progress;
  saveBuildRequests(reqs);
}

export function updateBuildRequestProgress(id: string, progress: number): void {
  const reqs = listBuildRequests();
  const idx = reqs.findIndex(r => r.id === id);
  if (idx === -1) return;
  reqs[idx].progress = Math.min(100, Math.max(0, progress));
  saveBuildRequests(reqs);
}

export function updateBuildMilestone(requestId: string, milestoneId: string, completed: boolean): void {
  const reqs = listBuildRequests();
  const idx = reqs.findIndex(r => r.id === requestId);
  if (idx === -1) return;
  const mIdx = reqs[idx].milestones.findIndex(m => m.id === milestoneId);
  if (mIdx === -1) return;
  reqs[idx].milestones[mIdx].completed = completed;
  if (completed) {
    reqs[idx].milestones[mIdx].completedAt = new Date().toISOString();
  } else {
    delete reqs[idx].milestones[mIdx].completedAt;
  }
  // Auto-update progress based on milestones
  const done = reqs[idx].milestones.filter(m => m.completed).length;
  reqs[idx].progress = Math.round((done / 6) * 90); // max 90% until marked Complete
  saveBuildRequests(reqs);
}

export function assignBuildRequest(id: string, team: string): void {
  const reqs = listBuildRequests();
  const idx = reqs.findIndex(r => r.id === id);
  if (idx === -1) return;
  reqs[idx].assignedTeam = team;
  reqs[idx].status = "Queue";
  reqs[idx].progress = 10;
  saveBuildRequests(reqs);
}

export function completeBuildRequest(id: string): void {
  const reqs = listBuildRequests();
  const idx = reqs.findIndex(r => r.id === id);
  if (idx === -1) return;
  reqs[idx].status = "Complete";
  reqs[idx].progress = 100;
  reqs[idx].milestones = reqs[idx].milestones.map(m => ({
    ...m,
    completed: true,
    completedAt: m.completedAt ?? new Date().toISOString(),
  }));
  saveBuildRequests(reqs);
}

// ─── Revisions ────────────────────────────────────────────────────────────────
export function listBuildRevisions(): BuildRevision[] {
  return readStorage<BuildRevision[]>(REVISIONS_KEY, []);
}

export function createBuildRevision(requestId: string, note: string): BuildRevision {
  const rev: BuildRevision = {
    id: `brev-${Date.now()}`,
    requestId,
    note,
    createdAt: new Date().toISOString(),
    status: "Revision Raised",
  };
  const revs = listBuildRevisions();
  revs.unshift(rev);
  writeStorage(REVISIONS_KEY, revs);
  // Put request back to Revision status
  updateBuildRequestStatus(requestId, "Revision");
  return rev;
}

export function updateBuildRevisionStatus(revisionId: string, status: BuildRevision["status"]): void {
  const revs = listBuildRevisions();
  const idx = revs.findIndex(r => r.id === revisionId);
  if (idx === -1) return;
  revs[idx].status = status;
  writeStorage(REVISIONS_KEY, revs);
}

// Re-export DewaDivision for consumers
export type { DewaDivision };
export { DEWA_DIVISIONS };

// Helper for build-related SolutionBuild lookup
export function getBuildById(id: string): SolutionBuild | undefined {
  return solutionBuilds.find(b => b.id === id);
}
