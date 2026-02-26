export type Stage3RequestType =
  | "dtmp-templates"
  | "solution-specs"
  | "solution-build"
  | "support-services"
  | "learning-center"
  | "knowledge-center";

export type Stage3RequestStatus =
  | "new"
  | "assigned"
  | "in-progress"
  | "pending-review"
  | "pending-user"
  | "completed"
  | "on-hold"
  | "cancelled";

export type Stage3Priority = "critical" | "high" | "medium" | "low";
export type Stage3SlaStatus = "on-track" | "at-risk" | "breached";

export type Stage3ActivityAction =
  | "created"
  | "assigned"
  | "unassigned"
  | "status-changed"
  | "note-added";

export interface Stage3Requester {
  name: string;
  email: string;
  department: string;
  organization: string;
}

export interface Stage3ActivityEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: Stage3ActivityAction;
  detail: string;
}

export interface Stage3Request {
  id: string;
  requestNumber: string;
  type: Stage3RequestType;
  title: string;
  description: string;
  requester: Stage3Requester;
  status: Stage3RequestStatus;
  priority: Stage3Priority;
  assignedTo?: string;
  assignedTeam?: string;
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  completedAt?: string;
  estimatedHours: number;
  actualHours?: number;
  tags: string[];
  relatedAssets?: string[];
  notes: string[];
  activityLog: Stage3ActivityEntry[];
  slaStatus: Stage3SlaStatus;
  customerSatisfaction?: number;
}

export interface Stage3TeamMember {
  id: string;
  name: string;
  role: string;
  team: string;
  capacityHours: number;
  allocatedHours: number;
  skills: string[];
}
