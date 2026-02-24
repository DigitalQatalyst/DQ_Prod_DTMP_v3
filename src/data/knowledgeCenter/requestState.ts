export type TORequestStatus = "Open" | "In Review" | "Resolved";
export type TORequestType = "clarification" | "outdated-section";

export interface TORequest {
  id: string;
  itemId: string;
  requesterName: string;
  requesterRole: string;
  type: TORequestType;
  message: string;
  sectionRef?: string;
  status: TORequestStatus;
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

export const getTORequests = (requesterName?: string): TORequest[] => {
  const requests = readRequests().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (!requesterName) return requests;
  return requests.filter(
    (request) => request.requesterName.toLowerCase() === requesterName.toLowerCase()
  );
};

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

export const updateTORequestStatus = (
  requestId: string,
  status: TORequestStatus
): TORequest | null => {
  const requests = readRequests();
  let updated: TORequest | null = null;
  const next = requests.map((request) => {
    if (request.id !== requestId) return request;
    updated = {
      ...request,
      status,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });
  writeRequests(next);
  return updated;
};
