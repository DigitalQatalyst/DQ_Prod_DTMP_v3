export type TORequestStatus = "Open" | "Assigned" | "In Review" | "Resolved";
export type TORequestType = "clarification" | "outdated-section" | "stale-flag" | "collaboration";
export type TORequestPriority = "High" | "Medium" | "Low";
export type TOResolutionType = "Article Updated" | "Clarified" | "No Action Needed" | "Escalated";
export type TOThreadEntryKind = "system" | "internal" | "reply";

export interface TOActivityEntry {
  action: string;
  by: string;
  at: string;
}

export interface TOThreadEntry {
  id: string;
  kind: TOThreadEntryKind;
  text: string;
  by: string;
  at: string;
}

export interface TORequest {
  id: string;
  itemId: string;
  requesterName: string;
  requesterRole: string;
  type: TORequestType;
  message: string;
  sectionRef?: string;
  status: TORequestStatus;
  priority?: TORequestPriority;
  assignee?: string;
  toResponse?: string;
  resolutionType?: TOResolutionType;
  thread?: TOThreadEntry[];
  /** @deprecated kept for backward compat — new writes use thread only */
  activityLog?: TOActivityEntry[];
  createdAt: string;
  updatedAt: string;
}

const REQUESTS_KEY = "dtmp.knowledge.toRequests";
const isBrowser = typeof window !== "undefined";

const parseJson = <T>(raw: string | null, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const readRequests = (): TORequest[] => {
  if (!isBrowser) return [];
  return parseJson<TORequest[]>(window.localStorage.getItem(REQUESTS_KEY), []);
};

const writeRequests = (requests: TORequest[]) => {
  if (!isBrowser) return;
  window.localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests.slice(0, 300)));
};

const makeSystemEntry = (text: string, by: string, at: string): TOThreadEntry => ({
  id: `te-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
  kind: "system",
  text,
  by,
  at,
});

// ── Read ──────────────────────────────────────────────────────────────────────

export const getTORequests = (requesterName?: string): TORequest[] => {
  const requests = readRequests().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (!requesterName) return requests;
  return requests.filter(
    (request) => request.requesterName.toLowerCase() === requesterName.toLowerCase()
  );
};

// ── Create ────────────────────────────────────────────────────────────────────

export const addTORequest = ({
  itemId,
  requesterName,
  requesterRole,
  type,
  message,
  sectionRef,
}: {
  itemId: string;
  requesterName: string;
  requesterRole: string;
  type: TORequestType;
  message: string;
  sectionRef?: string;
}): TORequest | null => {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) return null;

  const now = new Date().toISOString();
  const request: TORequest = {
    id: `to-request-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemId,
    requesterName,
    requesterRole,
    type,
    message: trimmedMessage,
    sectionRef: sectionRef?.trim() || undefined,
    status: "Open",
    createdAt: now,
    updatedAt: now,
  };

  const requests = readRequests();
  writeRequests([request, ...requests]);
  return request;
};

// ── Status update ─────────────────────────────────────────────────────────────

export const updateTORequestStatus = (
  requestId: string,
  status: TORequestStatus,
  options?: { actor?: string; toResponse?: string; resolutionType?: TOResolutionType }
): TORequest | null => {
  const requests = readRequests();
  let updated: TORequest | null = null;
  const now = new Date().toISOString();
  const actor = options?.actor ?? "TO Team";

  const actionLabel =
    status === "Assigned"
      ? "Marked as Assigned"
      : status === "In Review"
      ? "Marked In Review"
      : "Marked Resolved";

  const systemEntry = makeSystemEntry(actionLabel, actor, now);

  const next = requests.map((request) => {
    if (request.id !== requestId) return request;
    updated = {
      ...request,
      status,
      updatedAt: now,
      toResponse: options?.toResponse?.trim() || request.toResponse,
      resolutionType: options?.resolutionType || request.resolutionType,
      thread: [...(request.thread ?? []), systemEntry],
    };
    return updated;
  });
  writeRequests(next);
  return updated;
};

// ── Assignment ────────────────────────────────────────────────────────────────

export const assignTORequest = (
  requestId: string,
  assignee: string,
  actor: string
): TORequest | null => {
  const requests = readRequests();
  let updated: TORequest | null = null;
  const now = new Date().toISOString();
  const systemEntry = makeSystemEntry(`Assigned to ${assignee}`, actor, now);

  const next = requests.map((r) => {
    if (r.id !== requestId) return r;
    updated = {
      ...r,
      assignee,
      status: r.status === "Open" ? "Assigned" : r.status,
      updatedAt: now,
      thread: [...(r.thread ?? []), systemEntry],
    };
    return updated;
  });
  writeRequests(next);
  return updated;
};

// ── Thread entry ──────────────────────────────────────────────────────────────

export const addTOThreadEntry = (
  requestId: string,
  kind: TOThreadEntryKind,
  text: string,
  by: string
): TORequest | null => {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const requests = readRequests();
  let updated: TORequest | null = null;
  const now = new Date().toISOString();
  const entry: TOThreadEntry = {
    id: `te-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    kind,
    text: trimmed,
    by,
    at: now,
  };
  const next = requests.map((r) => {
    if (r.id !== requestId) return r;
    updated = {
      ...r,
      updatedAt: now,
      thread: [...(r.thread ?? []), entry],
    };
    return updated;
  });
  writeRequests(next);
  return updated;
};

// ── Priority ──────────────────────────────────────────────────────────────────

export const setTORequestPriority = (
  requestId: string,
  priority: TORequestPriority,
  actor: string
): TORequest | null => {
  const requests = readRequests();
  let updated: TORequest | null = null;
  const now = new Date().toISOString();
  const systemEntry = makeSystemEntry(`Priority set to ${priority}`, actor, now);

  const next = requests.map((r) => {
    if (r.id !== requestId) return r;
    updated = {
      ...r,
      priority,
      updatedAt: now,
      thread: [...(r.thread ?? []), systemEntry],
    };
    return updated;
  });
  writeRequests(next);
  return updated;
};
