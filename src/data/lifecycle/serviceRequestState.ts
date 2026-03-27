// ─────────────────────────────────────────────────────────────────────────────
// Lifecycle Service Request State
// Pattern: matches requestState.ts — localStorage-backed, pure functions
// src/data/lifecycle/serviceRequestState.ts
// ─────────────────────────────────────────────────────────────────────────────

export type LCServiceType =
  | "Initiative Status Report"
  | "Programme Health Presentation"
  | "Risk Assessment"
  | "EA Governance Review"
  | "Strategic Alignment Review"
  | "Initiative Dependency Map"
  | "Stakeholder Update Brief"
  | "Initiative Closure Report"
  | "Project Health Report"
  | "Project Recovery Plan"
  | "Technical Advisory"
  | "Resource Request"
  | "Milestone Review"
  | "Budget Reforecast"
  | "Architecture Compliance Check"
  | "Initiative Scoping Workshop"
  | "Business Case Development"
  | "Feasibility Assessment"
  | "Architecture Pre-Assessment";

export type LCRequestStatus =
  | "Submitted"
  | "Assigned"
  | "In Progress"
  | "Delivered"
  | "Completed";

export interface LCServiceRequest {
  id: string;
  serviceType: LCServiceType;
  initiativeId: string;
  initiativeName: string;
  projectId?: string;
  projectName?: string;
  submittedBy: string;
  submittedByRole: string;
  status: LCRequestStatus;
  priority: "Critical" | "High" | "Medium" | "Low";
  notes?: string;
  assignedTo?: string;
  deliveredAt?: string;
  deliverableTitle?: string;
  deliverableFormat?: "PDF" | "PPTX" | "Word";
  slaHours: number;
  submittedAt: string;
  updatedAt: string;
}

// SLA hours per service type
export const LC_SERVICE_SLA: Record<LCServiceType, number> = {
  "Initiative Status Report": 48,
  "Stakeholder Update Brief": 48,
  "Programme Health Presentation": 72,
  "Technical Advisory": 72,
  "Budget Reforecast": 72,
  "Risk Assessment": 120,
  "EA Governance Review": 120,
  "Project Recovery Plan": 120,
  "Feasibility Assessment": 120,
  "Initiative Closure Report": 120,
  "Project Health Report": 120,
  "Resource Request": 120,
  "Milestone Review": 120,
  "Architecture Compliance Check": 120,
  "Strategic Alignment Review": 120,
  "Initiative Dependency Map": 120,
  "Initiative Scoping Workshop": 120,
  "Business Case Development": 120,
  "Architecture Pre-Assessment": 120,
};

export const INITIATIVE_LEVEL_SERVICES: LCServiceType[] = [
  "Initiative Status Report",
  "Programme Health Presentation",
  "Risk Assessment",
  "EA Governance Review",
  "Strategic Alignment Review",
  "Initiative Dependency Map",
  "Stakeholder Update Brief",
  "Initiative Closure Report",
];

export const PROJECT_LEVEL_SERVICES: LCServiceType[] = [
  "Project Health Report",
  "Project Recovery Plan",
  "Technical Advisory",
  "Resource Request",
  "Milestone Review",
  "Budget Reforecast",
  "Architecture Compliance Check",
];

export const PRE_APPROVAL_SERVICES: LCServiceType[] = [
  "Initiative Scoping Workshop",
  "Business Case Development",
  "Feasibility Assessment",
  "Architecture Pre-Assessment",
];

// ── Approval queue (initiative requests awaiting TO approval) ─────────────────

export type ApprovalStatus =
  | "Pending"
  | "Clarification Requested"
  | "Approved"
  | "Rejected"
  | "Escalated";

export interface InitiativeApprovalRequest {
  id: string;
  frameworkType: string;
  initiativeName: string;
  division: string;
  isExternal: boolean;
  objective: string;
  scope: string;
  keyStakeholders: string;
  proposedOwner: string;
  targetStartDate: string;
  estimatedBudget?: string;
  priority: "Critical" | "High" | "Medium" | "Low";
  contextFromPortfolio?: string;
  additionalContext?: string;
  submittedBy: string;
  submittedAt: string;
  status: ApprovalStatus;
  toNotes?: string;
  rejectionReason?: string;
  escalationNote?: string;
  updatedAt: string;
}

// ── Escalations ───────────────────────────────────────────────────────────────

export type EscalationType = "Blocker" | "Risk" | "Decision";
export type EscalationStatus = "Open" | "Acknowledged" | "Resolved" | "Escalated Further";
export type EscalationSeverity = "Critical" | "High" | "Medium" | "Low";

export interface LCEscalation {
  id: string;
  title: string;
  type: EscalationType;
  initiativeId: string;
  initiativeName: string;
  projectId?: string;
  projectName?: string;
  raisedBy: string;
  dateRaised: string;
  severity: EscalationSeverity;
  whatIsNeeded: string;
  toResponse?: string;
  status: EscalationStatus;
  resolvedNote?: string;
  updatedAt: string;
}

// ── Storage helpers ───────────────────────────────────────────────────────────

const REQUESTS_KEY = "dtmp.lifecycle.serviceRequests";
const APPROVALS_KEY = "dtmp.lifecycle.approvalQueue";
const ESCALATIONS_KEY = "dtmp.lifecycle.escalations";
const isBrowser = typeof window !== "undefined";

const parseJson = <T>(raw: string | null, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

// ── Service Requests ──────────────────────────────────────────────────────────

const readRequests = (): LCServiceRequest[] => {
  if (!isBrowser) return [];
  return parseJson<LCServiceRequest[]>(window.localStorage.getItem(REQUESTS_KEY), []);
};

const writeRequests = (requests: LCServiceRequest[]): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests.slice(0, 500)));
};

export const getLCRequests = (submittedBy?: string): LCServiceRequest[] => {
  const requests = readRequests().sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
  if (!submittedBy) return requests;
  return requests.filter((r) => r.submittedBy.toLowerCase() === submittedBy.toLowerCase());
};

export const getLCRequestsByInitiative = (initiativeId: string): LCServiceRequest[] =>
  readRequests().filter((r) => r.initiativeId === initiativeId);

export const addLCRequest = (data: Omit<LCServiceRequest, "id" | "submittedAt" | "updatedAt">): LCServiceRequest => {
  const now = new Date().toISOString();
  const request: LCServiceRequest = {
    ...data,
    id: `lc-req-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    submittedAt: now,
    updatedAt: now,
  };
  writeRequests([request, ...readRequests()]);
  return request;
};

export const updateLCRequestStatus = (
  requestId: string,
  status: LCRequestStatus,
  options?: { assignedTo?: string; deliveredAt?: string; deliverableTitle?: string; deliverableFormat?: "PDF" | "PPTX" | "Word" }
): LCServiceRequest | null => {
  const requests = readRequests();
  let updated: LCServiceRequest | null = null;
  const now = new Date().toISOString();
  const next = requests.map((r) => {
    if (r.id !== requestId) return r;
    updated = { ...r, status, updatedAt: now, ...options };
    return updated;
  });
  writeRequests(next);
  return updated;
};

// ── Approval Queue ────────────────────────────────────────────────────────────

const readApprovals = (): InitiativeApprovalRequest[] => {
  if (!isBrowser) return [];
  return parseJson<InitiativeApprovalRequest[]>(window.localStorage.getItem(APPROVALS_KEY), []);
};

const writeApprovals = (approvals: InitiativeApprovalRequest[]): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(APPROVALS_KEY, JSON.stringify(approvals.slice(0, 200)));
};

export const getApprovalQueue = (): InitiativeApprovalRequest[] =>
  readApprovals().sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

export const getPendingApprovals = (): InitiativeApprovalRequest[] =>
  getApprovalQueue().filter((a) => a.status === "Pending" || a.status === "Clarification Requested");

export const addApprovalRequest = (data: Omit<InitiativeApprovalRequest, "id" | "submittedAt" | "updatedAt" | "status">): InitiativeApprovalRequest => {
  const now = new Date().toISOString();
  const approval: InitiativeApprovalRequest = {
    ...data,
    id: `lc-appr-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    status: "Pending",
    submittedAt: now,
    updatedAt: now,
  };
  writeApprovals([approval, ...readApprovals()]);
  return approval;
};

export const updateApprovalStatus = (
  approvalId: string,
  status: ApprovalStatus,
  options?: { toNotes?: string; rejectionReason?: string; escalationNote?: string }
): InitiativeApprovalRequest | null => {
  const approvals = readApprovals();
  let updated: InitiativeApprovalRequest | null = null;
  const now = new Date().toISOString();
  const next = approvals.map((a) => {
    if (a.id !== approvalId) return a;
    updated = { ...a, status, updatedAt: now, ...options };
    return updated;
  });
  writeApprovals(next);
  return updated;
};

// ── Escalations ───────────────────────────────────────────────────────────────

const readEscalations = (): LCEscalation[] => {
  if (!isBrowser) return [];
  return parseJson<LCEscalation[]>(window.localStorage.getItem(ESCALATIONS_KEY), []);
};

const writeEscalations = (escalations: LCEscalation[]): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(ESCALATIONS_KEY, JSON.stringify(escalations.slice(0, 200)));
};

export const getEscalations = (): LCEscalation[] =>
  readEscalations().sort((a, b) => new Date(b.dateRaised).getTime() - new Date(a.dateRaised).getTime());

export const getOpenEscalations = (): LCEscalation[] =>
  getEscalations().filter((e) => e.status === "Open" || e.status === "Acknowledged");

export const addEscalation = (data: Omit<LCEscalation, "id" | "updatedAt" | "status">): LCEscalation => {
  const now = new Date().toISOString();
  const escalation: LCEscalation = {
    ...data,
    id: `lc-esc-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    status: "Open",
    updatedAt: now,
  };
  writeEscalations([escalation, ...readEscalations()]);
  return escalation;
};

export const updateEscalationStatus = (
  escalationId: string,
  status: EscalationStatus,
  options?: { toResponse?: string; resolvedNote?: string }
): LCEscalation | null => {
  const escalations = readEscalations();
  let updated: LCEscalation | null = null;
  const now = new Date().toISOString();
  const next = escalations.map((e) => {
    if (e.id !== escalationId) return e;
    updated = { ...e, status, updatedAt: now, ...options };
    return updated;
  });
  writeEscalations(next);
  return updated;
};
