import type {
  Stage3ActivityAction,
  Stage3ActivityEntry,
  Stage3Request,
  Stage3RequestStatus,
  Stage3TeamMember,
} from "./types";

const now = new Date();
const day = 24 * 60 * 60 * 1000;
const DEFAULT_ACTIVITY_ACTOR = "TO Ops";
const INTAKE_ACTIVITY_ACTOR = "System Intake";

const createActivityEntry = (
  action: Stage3ActivityAction,
  detail: string,
  actor = DEFAULT_ACTIVITY_ACTOR
): Stage3ActivityEntry => ({
  id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  timestamp: new Date().toISOString(),
  actor,
  action,
  detail,
});

export const stage3Requests: Stage3Request[] = [
  {
    id: "req-stage3-001",
    requestNumber: "REQ-2026-001",
    type: "learning-center",
    title: "Manual Enrollment Override",
    description:
      "User completed prerequisite externally; request manual enrollment into Agile Transformation Leadership.",
    requester: {
      name: "Amina TO",
      email: "amina.to@dtmp.local",
      department: "Transformation Office",
      organization: "DTMP",
    },
    status: "new",
    priority: "high",
    createdAt: new Date(now.getTime() - 2 * day).toISOString(),
    updatedAt: new Date(now.getTime() - 2 * day).toISOString(),
    dueDate: new Date(now.getTime() + 2 * day).toISOString(),
    estimatedHours: 4,
    tags: ["learning", "enrollment", "override"],
    notes: ["Received from Stage 2 admin review queue."],
    activityLog: [
      createActivityEntry(
        "created",
        "Request received from Stage 2 Learning admin queue.",
        INTAKE_ACTIVITY_ACTOR
      ),
    ],
    slaStatus: "on-track",
  },
  {
    id: "req-stage3-002",
    requestNumber: "REQ-2026-002",
    type: "knowledge-center",
    title: "Clarification on API-First Pattern",
    description:
      "Requester needs governance clarification for section 3.2 and consistency checks across departments.",
    requester: {
      name: "Sarah Johnson",
      email: "sarah.johnson@dtmp.local",
      department: "Digital Commerce",
      organization: "DTMP",
    },
    status: "assigned",
    priority: "medium",
    assignedTo: "Michael Chen",
    assignedTeam: "Architecture",
    createdAt: new Date(now.getTime() - 4 * day).toISOString(),
    updatedAt: new Date(now.getTime() - day).toISOString(),
    dueDate: new Date(now.getTime() + day).toISOString(),
    estimatedHours: 8,
    actualHours: 3,
    tags: ["knowledge", "clarification", "architecture"],
    notes: ["Assigned to architecture reviewer.", "Waiting for supporting screenshots."],
    activityLog: [
      createActivityEntry(
        "created",
        "Request received from Stage 2 Knowledge workspace.",
        INTAKE_ACTIVITY_ACTOR
      ),
      createActivityEntry("assigned", "Assigned to Michael Chen (Architecture)."),
      createActivityEntry("status-changed", "Status moved to assigned."),
    ],
    slaStatus: "at-risk",
  },
  {
    id: "req-stage3-003",
    requestNumber: "REQ-2026-003",
    type: "solution-specs",
    title: "Retail Integration Specification",
    description:
      "Generate solution specification for event-driven retail integration with SAP and CRM.",
    requester: {
      name: "James Anderson",
      email: "j.anderson@dtmp.local",
      department: "Retail IT",
      organization: "DTMP",
    },
    status: "in-progress",
    priority: "high",
    assignedTo: "Lisa Wang",
    assignedTeam: "Solution Architecture",
    createdAt: new Date(now.getTime() - 7 * day).toISOString(),
    updatedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(now.getTime() + 3 * day).toISOString(),
    estimatedHours: 24,
    actualHours: 12,
    tags: ["specification", "integration", "retail"],
    notes: ["Initial draft generated with AI DocWriter."],
    activityLog: [
      createActivityEntry("created", "Request submitted from Solution Specs."),
      createActivityEntry("assigned", "Assigned to Lisa Wang (Solution Architecture)."),
      createActivityEntry("status-changed", "Status moved to in-progress."),
    ],
    slaStatus: "on-track",
  },
  {
    id: "req-stage3-004",
    requestNumber: "REQ-2026-004",
    type: "support-services",
    title: "Production Incident Triage",
    description:
      "P1 incident support request for API gateway errors after latest deployment.",
    requester: {
      name: "Daniel Park",
      email: "daniel.park@dtmp.local",
      department: "Platform Engineering",
      organization: "DTMP",
    },
    status: "pending-review",
    priority: "critical",
    assignedTo: "Sarah Miller",
    assignedTeam: "Support Operations",
    createdAt: new Date(now.getTime() - day).toISOString(),
    updatedAt: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    dueDate: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
    estimatedHours: 10,
    actualHours: 9,
    tags: ["support", "incident", "api-gateway"],
    notes: ["Fix deployed; awaiting requester validation."],
    activityLog: [
      createActivityEntry("created", "Incident request received."),
      createActivityEntry("assigned", "Assigned to Sarah Miller (Support Operations)."),
      createActivityEntry("status-changed", "Status moved to pending-review."),
    ],
    slaStatus: "breached",
  },
  {
    id: "req-stage3-005",
    requestNumber: "REQ-2026-005",
    type: "dtmp-templates",
    title: "Security Assessment Template Update",
    description:
      "Update the baseline security assessment template to include new controls.",
    requester: {
      name: "John Doe",
      email: "john.doe@dtmp.local",
      department: "Security",
      organization: "DTMP",
    },
    status: "completed",
    priority: "medium",
    assignedTo: "Michael Chen",
    assignedTeam: "Template Operations",
    createdAt: new Date(now.getTime() - 12 * day).toISOString(),
    updatedAt: new Date(now.getTime() - 6 * day).toISOString(),
    dueDate: new Date(now.getTime() - 7 * day).toISOString(),
    completedAt: new Date(now.getTime() - 6 * day).toISOString(),
    estimatedHours: 6,
    actualHours: 5,
    tags: ["templates", "security", "compliance"],
    notes: ["Delivered and accepted by requester."],
    activityLog: [
      createActivityEntry("created", "Template update request created."),
      createActivityEntry("assigned", "Assigned to Michael Chen (Template Operations)."),
      createActivityEntry("status-changed", "Status moved to completed."),
    ],
    slaStatus: "on-track",
    customerSatisfaction: 5,
  },
  {
    id: "req-stage3-006",
    requestNumber: "REQ-2026-006",
    type: "knowledge-center",
    title: "Playbook Update Validation Request",
    description:
      "TO reviewer requested validation of updated playbook sections before publication to all departments.",
    requester: {
      name: "Amina TO",
      email: "amina.to@dtmp.local",
      department: "Transformation Office",
      organization: "DTMP",
    },
    status: "new",
    priority: "medium",
    createdAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(now.getTime() + 2 * day).toISOString(),
    estimatedHours: 5,
    tags: ["knowledge", "playbook", "validation"],
    notes: ["Requires governance sign-off before final publish."],
    activityLog: [
      createActivityEntry(
        "created",
        "Validation request created from Knowledge Center governance queue.",
        INTAKE_ACTIVITY_ACTOR
      ),
    ],
    slaStatus: "on-track",
  },
];

export const stage3TeamMembers: Stage3TeamMember[] = [
  {
    id: "to-001",
    name: "Sarah Miller",
    role: "TO Operations Specialist",
    team: "Operations",
    capacityHours: 40,
    allocatedHours: 34,
    skills: ["triage", "support", "sla-management"],
  },
  {
    id: "to-002",
    name: "Michael Chen",
    role: "Solution Architect",
    team: "Architecture",
    capacityHours: 40,
    allocatedHours: 29,
    skills: ["solution-specs", "templates", "architecture"],
  },
  {
    id: "to-003",
    name: "Lisa Wang",
    role: "Technical Support Lead",
    team: "Support Operations",
    capacityHours: 40,
    allocatedHours: 31,
    skills: ["incident-response", "support-services", "consulting"],
  },
];

export type Stage3CreateRequestInput = Pick<
  Stage3Request,
  "type" | "title" | "description" | "requester" | "priority" | "estimatedHours" | "tags"
> & {
  assignedTo?: string;
  assignedTeam?: string;
  relatedAssets?: string[];
  notes?: string[];
};

const getNextRequestSequence = () => stage3Requests.length + 1;

export function createStage3Request(input: Stage3CreateRequestInput): Stage3Request {
  const createdAt = new Date();
  const seq = String(getNextRequestSequence()).padStart(3, "0");
  const request: Stage3Request = {
    id: `req-stage3-${seq}`,
    requestNumber: `REQ-${createdAt.getFullYear()}-${seq}`,
    type: input.type,
    title: input.title,
    description: input.description,
    requester: input.requester,
    status: "new",
    priority: input.priority,
    assignedTo: input.assignedTo,
    assignedTeam: input.assignedTeam,
    createdAt: createdAt.toISOString(),
    updatedAt: createdAt.toISOString(),
    dueDate: new Date(createdAt.getTime() + 3 * day).toISOString(),
    estimatedHours: input.estimatedHours,
    actualHours: 0,
    tags: input.tags,
    relatedAssets: input.relatedAssets ?? [],
    notes: input.notes ?? [],
    activityLog: [
      createActivityEntry(
        "created",
        `Request created from ${input.type} intake.`,
        INTAKE_ACTIVITY_ACTOR
      ),
    ],
    slaStatus: "on-track",
  };
  stage3Requests.unshift(request);
  return request;
}

const findRequestById = (requestId: string) =>
  stage3Requests.find((request) => request.id === requestId);

const findTeamMemberById = (memberId: string) =>
  stage3TeamMembers.find((member) => member.id === memberId);

export function assignStage3Request(
  requestId: string,
  memberId: string
): Stage3Request | null {
  const request = findRequestById(requestId);
  const member = findTeamMemberById(memberId);
  if (!request || !member) return null;

  request.assignedTo = member.name;
  request.assignedTeam = member.team;
  request.updatedAt = new Date().toISOString();

  if (request.status === "new") {
    request.status = "assigned";
  }
  request.activityLog.unshift(
    createActivityEntry("assigned", `Assigned to ${member.name} (${member.team}).`)
  );

  return request;
}

export function unassignStage3Request(requestId: string): Stage3Request | null {
  const request = findRequestById(requestId);
  if (!request) return null;

  request.assignedTo = undefined;
  request.assignedTeam = undefined;
  request.updatedAt = new Date().toISOString();

  if (request.status === "assigned") {
    request.status = "new";
  }
  request.activityLog.unshift(
    createActivityEntry("unassigned", "Request unassigned from current owner/team.")
  );

  return request;
}

const statusTransitions: Record<Stage3RequestStatus, Stage3RequestStatus[]> = {
  new: ["assigned", "cancelled", "on-hold"],
  assigned: ["in-progress", "on-hold", "cancelled"],
  "in-progress": ["pending-review", "pending-user", "on-hold", "cancelled"],
  "pending-review": ["completed", "in-progress", "on-hold"],
  "pending-user": ["in-progress", "pending-review", "cancelled"],
  completed: [],
  "on-hold": ["assigned", "in-progress", "cancelled"],
  cancelled: [],
};

export function getAvailableStage3Transitions(
  status: Stage3RequestStatus
): Stage3RequestStatus[] {
  return statusTransitions[status] ?? [];
}

export function transitionStage3RequestStatus(
  requestId: string,
  nextStatus: Stage3RequestStatus
): Stage3Request | null {
  const request = findRequestById(requestId);
  if (!request) return null;

  const allowed = getAvailableStage3Transitions(request.status);
  if (!allowed.includes(nextStatus)) {
    return null;
  }

  request.status = nextStatus;
  request.updatedAt = new Date().toISOString();
  request.activityLog.unshift(
    createActivityEntry("status-changed", `Status changed to ${nextStatus}.`)
  );

  if (nextStatus === "completed") {
    request.completedAt = new Date().toISOString();
  } else {
    request.completedAt = undefined;
  }

  return request;
}

export function appendStage3RequestNote(
  requestId: string,
  note: string,
  actor = DEFAULT_ACTIVITY_ACTOR
): Stage3Request | null {
  const request = findRequestById(requestId);
  if (!request) return null;

  const trimmed = note.trim();
  if (!trimmed) return null;

  request.notes.unshift(trimmed);
  request.updatedAt = new Date().toISOString();
  request.activityLog.unshift(createActivityEntry("note-added", trimmed, actor));
  return request;
}
