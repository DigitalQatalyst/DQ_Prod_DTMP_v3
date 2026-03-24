import { makeLocalStorageStore } from "@/data/shared/localStorageUtils";
import type { BuildRequest, BuildRequestStatus } from "./types";

const REQUESTS_KEY = "dtmp.solutionBuild.buildRequests";
const store = makeLocalStorageStore<BuildRequest>(REQUESTS_KEY, 300);

const readRequests = (): BuildRequest[] => store.read();
const writeRequests = (requests: BuildRequest[]): void => store.write(requests);

/**
 * Get all build requests, optionally filtered by requester
 */
export const getBuildRequests = (requesterName?: string): BuildRequest[] => {
  const requests = readRequests().sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
  if (!requesterName) return requests;
  return requests.filter(
    (request) => request.requestedBy.toLowerCase() === requesterName.toLowerCase()
  );
};

/**
 * Add a new build request
 */
export const addBuildRequest = (request: BuildRequest): BuildRequest => {
  const requests = readRequests();
  writeRequests([request, ...requests]);
  return request;
};

/**
 * Update build request status
 */
export const updateBuildRequestStatus = (
  requestId: string,
  status: BuildRequestStatus
): BuildRequest | null => {
  const requests = readRequests();
  let updated: BuildRequest | null = null;
  const next = requests.map((request) => {
    if (request.id !== requestId) return request;
    updated = {
      ...request,
      status,
    };
    return updated;
  });
  writeRequests(next);
  return updated;
};

/**
 * Link build request to Stage 3 request
 */
export const linkBuildRequestToStage3 = (
  requestId: string,
  stage3RequestId: string
): BuildRequest | null => {
  const requests = readRequests();
  let updated: BuildRequest | null = null;
  const next = requests.map((request) => {
    if (request.id !== requestId) return request;
    updated = {
      ...request,
      stage3RequestId,
    };
    return updated;
  });
  writeRequests(next);
  return updated;
};

/**
 * Get a single build request by ID
 */
export const getBuildRequestById = (requestId: string): BuildRequest | null => {
  const requests = readRequests();
  return requests.find((request) => request.id === requestId) ?? null;
};

/**
 * Update entire build request
 */
export const updateBuildRequest = (
  requestId: string,
  updates: Partial<BuildRequest>
): BuildRequest | null => {
  const requests = readRequests();
  let updated: BuildRequest | null = null;
  const next = requests.map((request) => {
    if (request.id !== requestId) return request;
    updated = {
      ...request,
      ...updates,
    };
    return updated;
  });
  writeRequests(next);
  return updated;
};
