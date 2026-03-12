import { makeLocalStorageStore } from "@/data/shared/localStorageUtils";

export type SupportRequestStatus = "Open" | "In Review" | "Resolved";
export type SupportRequestType =
  | "incident"
  | "service-request"
  | "question"
  | "problem"
  | "change-request";
export type SupportRequestPriority = "critical" | "high" | "medium" | "low";

export interface SupportTORequest {
  id: string;
  serviceId: string;
  serviceName: string;
  supportTicketId?: string;
  supportServiceRequestId?: string;
  requesterName: string;
  requesterRole: string;
  type: SupportRequestType;
  priority: SupportRequestPriority;
  subject: string;
  description: string;
  category: string;
  status: SupportRequestStatus;
  createdAt: string;
  updatedAt: string;
  stage3RequestId?: string;
}

const REQUESTS_KEY = "dtmp.support.toRequests";
const store = makeLocalStorageStore<SupportTORequest>(REQUESTS_KEY, 300);

const readRequests = (): SupportTORequest[] => store.read();
const writeRequests = (requests: SupportTORequest[]): void => store.write(requests);

export const getSupportTORequests = (requesterName?: string): SupportTORequest[] => {
  const requests = readRequests().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (!requesterName) return requests;
  return requests.filter(
    (request) => request.requesterName.toLowerCase() === requesterName.toLowerCase()
  );
};

export const addSupportTORequest = ({
  serviceId,
  serviceName,
  supportTicketId,
  supportServiceRequestId,
  requesterName,
  requesterRole,
  type,
  priority,
  subject,
  description,
  category,
}: {
  serviceId: string;
  serviceName: string;
  supportTicketId?: string;
  supportServiceRequestId?: string;
  requesterName: string;
  requesterRole: string;
  type: SupportRequestType;
  priority: SupportRequestPriority;
  subject: string;
  description: string;
  category: string;
}): SupportTORequest | null => {
  const trimmedDescription = description.trim();
  const trimmedSubject = subject.trim();
  if (!trimmedDescription || !trimmedSubject) return null;

  const now = new Date().toISOString();
  const request: SupportTORequest = {
    id: `support-to-request-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    serviceId,
    serviceName,
    supportTicketId,
    supportServiceRequestId,
    requesterName,
    requesterRole,
    type,
    priority,
    subject: trimmedSubject,
    description: trimmedDescription,
    category,
    status: "Open",
    createdAt: now,
    updatedAt: now,
  };

  const requests = readRequests();
  writeRequests([request, ...requests]);
  return request;
};

export const getSupportTORequestById = (requestId: string): SupportTORequest | null => {
  const request = readRequests().find((entry) => entry.id === requestId);
  return request ?? null;
};

export const updateSupportTORequestStatus = (
  requestId: string,
  status: SupportRequestStatus
): SupportTORequest | null => {
  const requests = readRequests();
  let updated: SupportTORequest | null = null;
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

export const linkSupportTORequestToStage3 = (
  requestId: string,
  stage3RequestId: string
): SupportTORequest | null => {
  const requests = readRequests();
  let updated: SupportTORequest | null = null;
  const next = requests.map((request) => {
    if (request.id !== requestId) return request;
    updated = {
      ...request,
      stage3RequestId,
      updatedAt: new Date().toISOString(),
    };
    return updated;
  });
  writeRequests(next);
  return updated;
};
