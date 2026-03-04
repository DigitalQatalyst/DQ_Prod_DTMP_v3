import { makeLocalStorageStore } from "@/data/shared/localStorageUtils";

export type TemplateRequestStatus = "Open" | "In Review" | "Resolved";
export type TemplateTab = "application-profiles" | "assessments";

export interface TemplateTORequest {
  id: string;
  templateId: string;
  templateTitle: string;
  tab: TemplateTab;
  requesterName: string;
  requesterRole: string;
  message: string;
  status: TemplateRequestStatus;
  createdAt: string;
  updatedAt: string;
  stage3RequestId?: string;
}

const REQUESTS_KEY = "dtmp.templates.toRequests";
const store = makeLocalStorageStore<TemplateTORequest>(REQUESTS_KEY, 300);

const readRequests = (): TemplateTORequest[] => store.read();
const writeRequests = (requests: TemplateTORequest[]): void => store.write(requests);

export const getTemplateTORequests = (requesterName?: string): TemplateTORequest[] => {
  const requests = readRequests().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (!requesterName) return requests;
  return requests.filter(
    (request) => request.requesterName.toLowerCase() === requesterName.toLowerCase()
  );
};

export const addTemplateTORequest = ({
  templateId,
  templateTitle,
  tab,
  requesterName,
  requesterRole,
  message,
}: {
  templateId: string;
  templateTitle: string;
  tab: TemplateTab;
  requesterName: string;
  requesterRole: string;
  message: string;
}): TemplateTORequest | null => {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) return null;

  const now = new Date().toISOString();
  const request: TemplateTORequest = {
    id: `template-to-request-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    templateId,
    templateTitle,
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

export const updateTemplateTORequestStatus = (
  requestId: string,
  status: TemplateRequestStatus
): TemplateTORequest | null => {
  const requests = readRequests();
  let updated: TemplateTORequest | null = null;
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

export const linkTemplateTORequestToStage3 = (
  requestId: string,
  stage3RequestId: string
): TemplateTORequest | null => {
  const requests = readRequests();
  let updated: TemplateTORequest | null = null;
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
