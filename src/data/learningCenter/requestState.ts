import { makeLocalStorageStore } from "@/data/shared/localStorageUtils";

export type LearningTORequestStatus = "Open" | "In Review" | "Resolved";
export type LearningTORequestType = "admin-escalation";

export interface LearningTORequest {
  id: string;
  courseId: string;
  courseName: string;
  requesterName: string;
  requesterRole: string;
  type: LearningTORequestType;
  message: string;
  status: LearningTORequestStatus;
  createdAt: string;
  updatedAt: string;
  stage3RequestId?: string;
}

const REQUESTS_KEY = "dtmp.learning.toRequests";
const store = makeLocalStorageStore<LearningTORequest>(REQUESTS_KEY, 300);

const readRequests = (): LearningTORequest[] => store.read();
const writeRequests = (requests: LearningTORequest[]): void => store.write(requests);

export const getLearningTORequests = (requesterName?: string): LearningTORequest[] => {
  const requests = readRequests().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (!requesterName) return requests;
  return requests.filter(
    (request) => request.requesterName.toLowerCase() === requesterName.toLowerCase()
  );
};

export const addLearningTORequest = ({
  courseId,
  courseName,
  requesterName,
  requesterRole,
  message,
}: {
  courseId: string;
  courseName: string;
  requesterName: string;
  requesterRole: string;
  message: string;
}): LearningTORequest | null => {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) return null;

  const now = new Date().toISOString();
  const request: LearningTORequest = {
    id: `learning-to-request-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    courseId,
    courseName,
    requesterName,
    requesterRole,
    type: "admin-escalation",
    message: trimmedMessage,
    status: "Open",
    createdAt: now,
    updatedAt: now,
  };

  const requests = readRequests();
  writeRequests([request, ...requests]);
  return request;
};

export const updateLearningTORequestStatus = (
  requestId: string,
  status: LearningTORequestStatus
): LearningTORequest | null => {
  const requests = readRequests();
  let updated: LearningTORequest | null = null;
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

export const linkLearningTORequestToStage3 = (
  requestId: string,
  stage3RequestId: string
): LearningTORequest | null => {
  const requests = readRequests();
  let updated: LearningTORequest | null = null;
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
