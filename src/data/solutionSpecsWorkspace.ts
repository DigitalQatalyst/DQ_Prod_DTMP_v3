import { createStage3Request } from "@/data/stage3";
import { solutionSpecs, type DivisionRelevance, type SolutionSpec, type SolutionType } from "@/data/blueprints/solutionSpecs";

export type SolutionSpecRequestType =
  | "Current Build"
  | "Enhancement"
  | "Integration"
  | "New Initiative";

export type SolutionSpecRequestPriority =
  | "Urgent (within 1 month)"
  | "Standard (1-3 months)"
  | "Planning (3-6 months)"
  | "Future (6+ months)";

export type SolutionSpecOutput =
  | "Full Spec Document (PDF)"
  | "Architecture Diagrams"
  | "Component Definitions"
  | "Implementation Roadmap";

export type SolutionSpecRequestStatus =
  | "Submitted"
  | "Assigned"
  | "In Progress"
  | "Delivered"
  | "Completed"
  | "Revision";

export interface SolutionSpecRequestDraft {
  requestType: SolutionSpecRequestType;
  dewaDivision: DivisionRelevance | "Enterprise-wide";
  programme: string;
  businessNeed: string;
  currentState: string;
  keyRequirements: string;
  architectureConstraints: string;
  timelinePriority: SolutionSpecRequestPriority;
  preferredOutputs: SolutionSpecOutput[];
  additionalNotes: string;
}

export interface SolutionSpecRequest extends SolutionSpecRequestDraft {
  id: string;
  specId: string;
  specTitle: string;
  stream: SolutionType;
  submittedAt: string;
  assignedTo: string;
  status: SolutionSpecRequestStatus;
  slaStatus: "On Track" | "At Risk" | "Breached";
  deliveredDocumentIds: string[];
  stage3RequestId?: string;
}

export interface DeliveredSolutionSpec {
  id: string;
  requestId: string;
  specId: string;
  deliveredAt: string;
  specTitle: string;
  stream: SolutionType;
  maturityLevel: SolutionSpec["maturityLevel"];
  description: string;
  diagramCount: number;
  componentCount: number;
  documentCount: number;
  tags: string[];
  documentIds: string[];
  solutionBuildStartedAt?: string;
}

export interface SolutionSpecRevision {
  id: string;
  requestId: string;
  note: string;
  createdAt: string;
  status: "Revision Raised" | "In Review" | "Delivered";
}

const REQUESTS_KEY = "dtmp.solutionSpecs.requests";
const DELIVERED_KEY = "dtmp.solutionSpecs.delivered";
const REVISIONS_KEY = "dtmp.solutionSpecs.revisions";
const isBrowser = typeof window !== "undefined";

const defaultOutputs: SolutionSpecOutput[] = [
  "Full Spec Document (PDF)",
  "Architecture Diagrams",
  "Component Definitions",
];

export const defaultSolutionSpecRequestDraft = (
  spec: SolutionSpec
): SolutionSpecRequestDraft => ({
  requestType: "Current Build",
  dewaDivision:
    spec.divisionRelevance[0] === "All Divisions"
      ? "Enterprise-wide"
      : spec.divisionRelevance[0],
  programme: "",
  businessNeed: "",
  currentState: "",
  keyRequirements: "",
  architectureConstraints: "",
  timelinePriority: "Standard (1-3 months)",
  preferredOutputs: defaultOutputs,
  additionalNotes: "",
});

const read = <T,>(key: string, fallback: T): T => {
  if (!isBrowser) return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const write = (key: string, value: unknown) => {
  if (!isBrowser) return;
  window.localStorage.setItem(key, JSON.stringify(value));
};

const sampleRequests = (): SolutionSpecRequest[] => {
  const specsById = new Map(solutionSpecs.map((spec) => [spec.id, spec]));
  const base = [
    {
      id: "ssr-001",
      specId: "dws-dtmp-platform-architecture",
      requestType: "Enhancement" as const,
      dewaDivision: "Enterprise-wide" as const,
      programme: "EA 4.0 Initiative",
      businessNeed: "Need a refreshed DTMP architecture spec aligned to the new stage operating model.",
      currentState: "DTMP patterns exist but need a DEWA-contextualized target-state package.",
      keyRequirements: "Updated marketplace flow, TO operating model, AI DocWriter alignment.",
      architectureConstraints: "Preserve existing working Stage 2 and Stage 3 shell patterns.",
      timelinePriority: "Standard (1-3 months)" as const,
      preferredOutputs: ["Full Spec Document (PDF)", "Architecture Diagrams", "Implementation Roadmap"] as SolutionSpecOutput[],
      additionalNotes: "Used for internal roadmap and architecture review.",
      submittedAt: "2026-03-15T09:00:00.000Z",
      assignedTo: "Michael Chen",
      status: "In Progress" as const,
      slaStatus: "On Track" as const,
    },
    {
      id: "ssr-002",
      specId: "dxp-services-360",
      requestType: "Integration" as const,
      dewaDivision: "Customer Services" as const,
      programme: "Services 360",
      businessNeed: "Need a contextualized integration spec for customer channels, CRM, and Rammas AI.",
      currentState: "Journey services are fragmented across multiple teams and interfaces.",
      keyRequirements: "Channel orchestration, CRM integration, AI handoff, notification controls.",
      architectureConstraints: "Must align to customer identity and API governance standards.",
      timelinePriority: "Urgent (within 1 month)" as const,
      preferredOutputs: ["Full Spec Document (PDF)", "Architecture Diagrams", "Component Definitions"] as SolutionSpecOutput[],
      additionalNotes: "Support leadership review for channel consolidation.",
      submittedAt: "2026-03-13T10:15:00.000Z",
      assignedTo: "Lisa Wang",
      status: "Completed" as const,
      slaStatus: "On Track" as const,
    },
  ];

  return base.flatMap((entry) => {
    const spec = specsById.get(entry.specId);
    if (!spec) return [];
    return [
      {
        ...entry,
        specTitle: spec.title,
        stream: spec.solutionType,
        deliveredDocumentIds:
          entry.status === "Completed" ? spec.documents.map((doc) => doc.id) : [],
      },
    ];
  });
};

const sampleDelivered = (): DeliveredSolutionSpec[] => {
  const spec = solutionSpecs.find((item) => item.id === "dxp-services-360");
  if (!spec) return [];
  return [
    {
      id: "ssd-001",
      requestId: "ssr-002",
      specId: spec.id,
      deliveredAt: "2026-03-16T13:00:00.000Z",
      specTitle: spec.title,
      stream: spec.solutionType,
      maturityLevel: spec.maturityLevel,
      description: spec.description,
      diagramCount: spec.diagramCount,
      componentCount: spec.componentCount,
      documentCount: spec.documents.length,
      tags: spec.tags,
      documentIds: spec.documents.map((doc) => doc.id),
    },
  ];
};

const sampleRevisions = (): SolutionSpecRevision[] => [
  {
    id: "ssrev-001",
    requestId: "ssr-002",
    note: "Need one more view showing how Rammas AI hands off to live agents during peak demand.",
    createdAt: "2026-03-17T09:20:00.000Z",
    status: "In Review",
  },
];

export const listSolutionSpecRequests = (): SolutionSpecRequest[] =>
  read(REQUESTS_KEY, sampleRequests());

export const listDeliveredSolutionSpecs = (): DeliveredSolutionSpec[] =>
  read(DELIVERED_KEY, sampleDelivered());

export const listSolutionSpecRevisions = (): SolutionSpecRevision[] =>
  read(REVISIONS_KEY, sampleRevisions());

const persistRequests = (items: SolutionSpecRequest[]) => write(REQUESTS_KEY, items);
const persistDelivered = (items: DeliveredSolutionSpec[]) => write(DELIVERED_KEY, items);
const persistRevisions = (items: SolutionSpecRevision[]) => write(REVISIONS_KEY, items);

export const createSolutionSpecRequest = (
  spec: SolutionSpec,
  draft: SolutionSpecRequestDraft
): SolutionSpecRequest => {
  const requests = listSolutionSpecRequests();
  const createdAt = new Date().toISOString();
  const priority =
    draft.timelinePriority === "Urgent (within 1 month)"
      ? "high"
      : draft.timelinePriority === "Future (6+ months)"
        ? "low"
        : "medium";

  const stage3 = createStage3Request({
    type: "solution-specs",
    title: spec.title,
    description: draft.businessNeed,
    requester: {
      name: "Business User",
      email: "business.user@dewa.local",
      department: draft.dewaDivision,
      organization: "DEWA",
    },
    priority,
    estimatedHours: 24,
    tags: [spec.solutionType.toLowerCase(), "solution-specs", draft.requestType.toLowerCase().replace(/\s+/g, "-")],
    notes: [
      `Programme: ${draft.programme || "Not provided"}`,
      `Requirements: ${draft.keyRequirements}`,
    ],
    relatedAssets: [`solution-spec-request:${spec.id}`],
  });

  const request: SolutionSpecRequest = {
    ...draft,
    id: `ssr-${Date.now()}`,
    specId: spec.id,
    specTitle: spec.title,
    stream: spec.solutionType,
    submittedAt: createdAt,
    assignedTo: "Unassigned",
    status: "Submitted",
    slaStatus: "On Track",
    deliveredDocumentIds: [],
    stage3RequestId: stage3.id,
  };

  persistRequests([request, ...requests]);
  return request;
};

export const raiseSolutionSpecRevision = (
  requestId: string,
  note: string
): SolutionSpecRevision | null => {
  const trimmed = note.trim();
  if (!trimmed) return null;

  const revisions = listSolutionSpecRevisions();
  const requests = listSolutionSpecRequests().map((request) =>
    request.id === requestId ? { ...request, status: "Revision" as const } : request
  );

  const revision: SolutionSpecRevision = {
    id: `ssrev-${Date.now()}`,
    requestId,
    note: trimmed,
    createdAt: new Date().toISOString(),
    status: "Revision Raised",
  };

  persistRequests(requests);
  persistRevisions([revision, ...revisions]);
  return revision;
};

export const getSolutionSpecById = (id: string) =>
  solutionSpecs.find((spec) => spec.id === id) ?? null;

export const getSolutionSpecByDocumentId = (documentId: string) =>
  solutionSpecs.find((spec) => spec.documents.some((doc) => doc.id === documentId)) ?? null;

export const getSolutionSpecRequestByStage3RequestId = (stage3RequestId: string) =>
  listSolutionSpecRequests().find((request) => request.stage3RequestId === stage3RequestId) ?? null;

export const updateSolutionSpecRequestStatusFromStage3 = (
  stage3RequestId: string,
  status: SolutionSpecRequestStatus,
  assignedTo?: string
) => {
  const updated = listSolutionSpecRequests().map((request) =>
    request.stage3RequestId === stage3RequestId
      ? {
          ...request,
          status,
          assignedTo: assignedTo ?? request.assignedTo,
        }
      : request
  );
  persistRequests(updated);
};

export const deliverSolutionSpecRequestFromStage3 = (stage3RequestId: string) => {
  const requests = listSolutionSpecRequests();
  const target = requests.find((request) => request.stage3RequestId === stage3RequestId);
  if (!target) return null;

  const spec = getSolutionSpecById(target.specId);
  if (!spec) return null;

  const deliveredSpecs = listDeliveredSolutionSpecs();
  const existingDelivered = deliveredSpecs.find((item) => item.requestId === target.id);
  const deliveredAt = new Date().toISOString();

  const nextDelivered = existingDelivered
    ? deliveredSpecs.map((item) =>
        item.requestId === target.id
          ? {
              ...item,
              deliveredAt,
              documentIds: spec.documents.map((doc) => doc.id),
              documentCount: spec.documents.length,
            }
          : item
      )
    : [
        {
          id: `ssd-${Date.now()}`,
          requestId: target.id,
          specId: spec.id,
          deliveredAt,
          specTitle: spec.title,
          stream: spec.solutionType,
          maturityLevel: spec.maturityLevel,
          description: spec.description,
          diagramCount: spec.diagramCount,
          componentCount: spec.componentCount,
          documentCount: spec.documents.length,
          tags: spec.tags,
          documentIds: spec.documents.map((doc) => doc.id),
        },
        ...deliveredSpecs,
      ];

  const nextRequests = requests.map((request) =>
    request.stage3RequestId === stage3RequestId
      ? {
          ...request,
          status: "Completed" as const,
          deliveredDocumentIds: spec.documents.map((doc) => doc.id),
        }
      : request
  );

  persistDelivered(nextDelivered);
  persistRequests(nextRequests);
  return nextRequests.find((request) => request.stage3RequestId === stage3RequestId) ?? null;
};

export const markSolutionSpecBuildStarted = (requestId: string) => {
  const delivered = listDeliveredSolutionSpecs().map((item) =>
    item.requestId === requestId
      ? {
          ...item,
          solutionBuildStartedAt: new Date().toISOString(),
        }
      : item
  );
  persistDelivered(delivered);
};

/** Update a Solution Spec request directly by its own id (not via stage3RequestId). */
export const updateSsRequestById = (
  id: string,
  update: Partial<Pick<SolutionSpecRequest, "status" | "assignedTo">>
) => {
  const updated = listSolutionSpecRequests().map((r) =>
    r.id === id ? { ...r, ...update } : r
  );
  persistRequests(updated);
};

/** Deliver a Solution Spec request by its own id — creates the DeliveredSolutionSpec record and marks status Completed. */
export const deliverSsRequestById = (id: string): SolutionSpecRequest | null => {
  const requests = listSolutionSpecRequests();
  const target = requests.find((r) => r.id === id);
  if (!target) return null;
  const spec = getSolutionSpecById(target.specId);
  if (!spec) return null;

  const deliveredSpecs = listDeliveredSolutionSpecs();
  const existing = deliveredSpecs.find((item) => item.requestId === target.id);
  const deliveredAt = new Date().toISOString();

  const nextDelivered = existing
    ? deliveredSpecs.map((item) =>
        item.requestId === target.id
          ? { ...item, deliveredAt, documentIds: spec.documents.map((d) => d.id), documentCount: spec.documents.length }
          : item
      )
    : [
        {
          id: `ssd-${Date.now()}`,
          requestId: target.id,
          specId: spec.id,
          deliveredAt,
          specTitle: spec.title,
          stream: spec.solutionType,
          maturityLevel: spec.maturityLevel,
          description: spec.description,
          diagramCount: spec.diagramCount,
          componentCount: spec.componentCount,
          documentCount: spec.documents.length,
          tags: spec.tags,
          documentIds: spec.documents.map((d) => d.id),
        },
        ...deliveredSpecs,
      ];

  const nextRequests = requests.map((r) =>
    r.id === id
      ? { ...r, status: "Completed" as const, deliveredDocumentIds: spec.documents.map((d) => d.id) }
      : r
  );

  persistDelivered(nextDelivered);
  persistRequests(nextRequests);
  return nextRequests.find((r) => r.id === id) ?? null;
};

/** Create a custom (free-text) Solution Spec request from the marketplace form.
 *  Does not require an existing spec in the catalog — builds request from scratch
 *  and wires a corresponding Stage 3 entry so it appears in the TO Office queue.
 */
export interface CustomSsRequestInput {
  requesterName: string;
  division: string;
  stream: SolutionType;
  scope: string;
  title: string;
  problem: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  timeline: string;
}

export const createCustomSolutionSpecRequest = (
  input: CustomSsRequestInput
): SolutionSpecRequest => {
  const requests = listSolutionSpecRequests();
  const createdAt = new Date().toISOString();

  const timelinePriorityMap: Record<string, SolutionSpecRequestPriority> = {
    Urgent: "Urgent (within 1 month)",
    High: "Standard (1-3 months)",
    Medium: "Standard (1-3 months)",
    Low: "Planning (3-6 months)",
  };
  const stage3PriorityMap: Record<string, "high" | "medium" | "low"> = {
    Urgent: "high",
    High: "high",
    Medium: "medium",
    Low: "low",
  };

  const stage3 = createStage3Request({
    type: "solution-specs",
    title: input.title,
    description: input.problem,
    requester: {
      name: input.requesterName,
      email: `${input.requesterName.toLowerCase().replace(/\s+/g, ".")}@dewa.local`,
      department: input.division,
      organization: "DEWA",
    },
    priority: stage3PriorityMap[input.priority] ?? "medium",
    estimatedHours: 24,
    tags: [input.stream.toLowerCase(), "solution-specs", "custom-request"],
    notes: [
      `Division: ${input.division}`,
      `Scope: ${input.scope}`,
      `Timeline: ${input.timeline || "Not specified"}`,
    ],
    relatedAssets: [],
  });

  const request: SolutionSpecRequest = {
    id: `ssr-${Date.now()}`,
    specId: `custom-${Date.now()}`,
    specTitle: input.title,
    stream: input.stream,
    requestType: "New Initiative",
    dewaDivision: input.division as DivisionRelevance | "Enterprise-wide",
    programme: input.timeline || "",
    businessNeed: input.problem,
    currentState: "",
    keyRequirements: "",
    architectureConstraints: "",
    timelinePriority: timelinePriorityMap[input.priority] ?? "Standard (1-3 months)",
    preferredOutputs: ["Full Spec Document (PDF)", "Architecture Diagrams"],
    additionalNotes: `Scope: ${input.scope}`,
    submittedAt: createdAt,
    assignedTo: "Unassigned",
    status: "Submitted",
    slaStatus: "On Track",
    deliveredDocumentIds: [],
    stage3RequestId: stage3.id,
  };

  persistRequests([request, ...requests]);
  return request;
};

/** Update a revision status by revision id. */
export const updateSsRevisionStatus = (
  revisionId: string,
  status: SolutionSpecRevision["status"]
) => {
  const updated = listSolutionSpecRevisions().map((r) =>
    r.id === revisionId ? { ...r, status } : r
  );
  persistRevisions(updated);
};
