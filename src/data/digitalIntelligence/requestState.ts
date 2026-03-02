import { makeLocalStorageStore } from "@/data/shared/localStorageUtils";

export type DIRequestStatus = "Open" | "In Review" | "Resolved";
export type DIServiceTab = "systems-portfolio" | "digital-maturity" | "projects-portfolio";

export interface DITORequest {
  id: string;
  serviceId: string;
  serviceTitle: string;
  tab: DIServiceTab;
  requesterName: string;
  requesterRole: string;
  message: string;
  status: DIRequestStatus;
  createdAt: string;
  updatedAt: string;
  stage3RequestId?: string;
}

const REQUESTS_KEY = "dtmp.di.toRequests";
const store = makeLocalStorageStore<DITORequest>(REQUESTS_KEY, 300);

const readRequests = (): DITORequest[] => store.read();
const writeRequests = (requests: DITORequest[]): void => store.write(requests);

export const getDITORequests = (requesterName?: string): DITORequest[] => {
  const requests = readRequests().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (!requesterName) return requests;
  return requests.filter(
    (request) => request.requesterName.toLowerCase() === requesterName.toLowerCase()
  );
};

export const addDITORequest = ({
  serviceId,
  serviceTitle,
  tab,
  requesterName,
  requesterRole,
  message,
}: {
  serviceId: string;
  serviceTitle: string;
  tab: DIServiceTab;
  requesterName: string;
  requesterRole: string;
  message: string;
}): DITORequest | null => {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) return null;

  const now = new Date().toISOString();
  const request: DITORequest = {
    id: `di-to-request-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    serviceId,
    serviceTitle,
    tab,
    requesterName,
    requesterRole,
    message: trimmedMessage,
    status: "Open",
    createdAt: now,
    updatedAt: now,
  };

  const requests = readRequests();
  writeRequests([request, ...requests]);
  return request;
};

export const updateDITORequestStatus = (
  requestId: string,
  status: DIRequestStatus
): DITORequest | null => {
  const requests = readRequests();
  let updated: DITORequest | null = null;
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

export const linkDITORequestToStage3 = (
  requestId: string,
  stage3RequestId: string
): DITORequest | null => {
  const requests = readRequests();
  let updated: DITORequest | null = null;
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
