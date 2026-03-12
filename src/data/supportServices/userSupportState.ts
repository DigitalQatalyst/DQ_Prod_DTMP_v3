import { serviceRequests, supportTickets, type ServiceRequest, type SupportTicket } from "@/data/supportData";
import type { Stage3RequestStatus } from "@/data/stage3/types";

const SUPPORT_TICKETS_STORAGE_KEY = "support-services:user-tickets";
const SUPPORT_REQUESTS_STORAGE_KEY = "support-services:user-requests";

type Identifiable = { id: string };

const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;

const isIdentifiable = (value: unknown): value is Identifiable =>
  typeof value === "object" && value !== null && typeof (value as { id?: unknown }).id === "string";

export const mergeRecordsById = <T extends Identifiable>(records: T[]) => {
  const seen = new Set<string>();
  const deduped: T[] = [];

  for (const record of records) {
    if (seen.has(record.id)) continue;
    seen.add(record.id);
    deduped.push(record);
  }

  return deduped;
};

const readStoredRecords = <T extends Identifiable>(key: string): T[] => {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return mergeRecordsById(parsed.filter(isIdentifiable) as T[]);
  } catch {
    return [];
  }
};

const writeStoredRecords = <T extends Identifiable>(key: string, records: T[]) => {
  if (!canUseStorage()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(mergeRecordsById(records)));
  } catch {
    // Ignore storage write failures (private mode/quota/etc.)
  }
};

export const getStoredSupportTickets = () =>
  readStoredRecords<SupportTicket>(SUPPORT_TICKETS_STORAGE_KEY);

export const getStoredSupportRequests = () =>
  readStoredRecords<ServiceRequest>(SUPPORT_REQUESTS_STORAGE_KEY);

export const upsertStoredSupportTicket = (ticket: SupportTicket) => {
  const next = mergeRecordsById([ticket, ...getStoredSupportTickets()]);
  writeStoredRecords(SUPPORT_TICKETS_STORAGE_KEY, next);
  return next;
};

export const upsertStoredSupportRequest = (request: ServiceRequest) => {
  const next = mergeRecordsById([request, ...getStoredSupportRequests()]);
  writeStoredRecords(SUPPORT_REQUESTS_STORAGE_KEY, next);
  return next;
};

export const getSupportTicketsWithStored = () =>
  mergeRecordsById([...getStoredSupportTickets(), ...supportTickets]);

export const getSupportRequestsWithStored = () =>
  mergeRecordsById([...getStoredSupportRequests(), ...serviceRequests]);

const normalizeText = (value?: string) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const findSupportTicketForSync = (input: {
  supportTicketId?: string;
  supportSubject?: string;
  supportDescription?: string;
}) => {
  const tickets = getSupportTicketsWithStored();

  if (input.supportTicketId) {
    const byId = tickets.find((ticket) => ticket.id === input.supportTicketId);
    if (byId) return byId;
  }

  const normalizedSubject = normalizeText(input.supportSubject);
  if (!normalizedSubject) return null;

  const subjectMatches = tickets.filter(
    (ticket) => normalizeText(ticket.subject) === normalizedSubject
  );
  if (subjectMatches.length === 0) return null;
  if (!input.supportDescription) return subjectMatches[0];

  const normalizedDescription = normalizeText(input.supportDescription);
  const exactDescriptionMatch = subjectMatches.find(
    (ticket) => normalizeText(ticket.description) === normalizedDescription
  );
  return exactDescriptionMatch ?? subjectMatches[0];
};

const findSupportRequestForSync = (input: {
  supportServiceRequestId?: string;
  supportTitle?: string;
  supportDescription?: string;
}) => {
  const requests = getSupportRequestsWithStored();

  if (input.supportServiceRequestId) {
    const byId = requests.find((request) => request.id === input.supportServiceRequestId);
    if (byId) return byId;
  }

  const normalizedTitle = normalizeText(input.supportTitle);
  if (!normalizedTitle) return null;

  const titleMatches = requests.filter(
    (request) => normalizeText(request.title) === normalizedTitle
  );
  if (titleMatches.length === 0) return null;
  if (!input.supportDescription) return titleMatches[0];

  const normalizedDescription = normalizeText(input.supportDescription);
  const exactDescriptionMatch = titleMatches.find(
    (request) => normalizeText(request.description) === normalizedDescription
  );
  return exactDescriptionMatch ?? titleMatches[0];
};

const normalizeKeyPart = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const mapStage3StatusToTicketStatus = (status: Stage3RequestStatus): SupportTicket["status"] => {
  if (status === "new") return "new";
  if (status === "assigned") return "assigned";
  if (status === "in-progress") return "in-progress";
  if (status === "pending-user") return "pending-user";
  if (status === "completed") return "resolved";
  if (status === "cancelled") return "closed";
  return "in-progress";
};

const mapStage3StatusToServiceRequestStatus = (
  status: Stage3RequestStatus
): ServiceRequest["status"] => {
  if (status === "completed") return "completed";
  if (status === "cancelled") return "cancelled";
  if (status === "new") return "pending-approval";
  return "in-progress";
};

export const syncStoredSupportTicketFromStage3 = (input: {
  supportTicketId?: string;
  supportSubject?: string;
  supportDescription?: string;
  stage3Status: Stage3RequestStatus;
  assignedTo?: string;
  assignedTeam?: string;
  updatedAt?: string;
}): SupportTicket | null => {
  const target = findSupportTicketForSync(input);
  if (!target) return null;

  const now = input.updatedAt || new Date().toISOString();
  const mappedStatus = mapStage3StatusToTicketStatus(input.stage3Status);
  const assigneeKey = input.assignedTo ? normalizeKeyPart(input.assignedTo) : "";
  const assignee = input.assignedTo
    ? {
        id: `stage3-${assigneeKey || "support-assistant"}`,
        name: input.assignedTo,
        email: `${(assigneeKey || "support.assistant").replace(/-/g, ".")}@dtmp.local`,
        team: input.assignedTeam || target.assignee?.team || "Support Operations",
      }
    : undefined;

  const updated: SupportTicket = {
    ...target,
    status: mappedStatus,
    assignee,
    updatedAt: now,
    resolvedAt: mappedStatus === "resolved" || mappedStatus === "closed" ? target.resolvedAt || now : undefined,
  };

  upsertStoredSupportTicket(updated);
  return updated;
};

export const syncStoredSupportRequestFromStage3 = (input: {
  supportServiceRequestId?: string;
  supportTitle?: string;
  supportDescription?: string;
  stage3Status: Stage3RequestStatus;
  updatedAt?: string;
}): ServiceRequest | null => {
  const target = findSupportRequestForSync(input);
  if (!target) return null;

  const now = input.updatedAt || new Date().toISOString();
  const mappedStatus = mapStage3StatusToServiceRequestStatus(input.stage3Status);
  const updated: ServiceRequest = {
    ...target,
    status: mappedStatus,
    updatedAt: now,
    completedAt:
      mappedStatus === "completed" || mappedStatus === "cancelled"
        ? target.completedAt || now
        : undefined,
  };

  upsertStoredSupportRequest(updated);
  return updated;
};
