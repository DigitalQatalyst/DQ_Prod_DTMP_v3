import { makeLocalStorageStore } from "@/data/shared/localStorageUtils";

export type BlueprintRequestStatus = "Open" | "In Review" | "Resolved";
export type BlueprintMarketplace = "solution-specs" | "solution-build";

export interface BlueprintTORequest {
  id: string;
  itemId: string;
  itemTitle: string;
  marketplace: BlueprintMarketplace;
  requesterName: string;
  requesterRole: string;
  message: string;
  status: BlueprintRequestStatus;
  createdAt: string;
  updatedAt: string;
  stage3RequestId?: string;
}

const REQUESTS_KEY = "dtmp.blueprints.toRequests";
const store = makeLocalStorageStore<BlueprintTORequest>(REQUESTS_KEY, 300);

const readRequests = (): BlueprintTORequest[] => store.read();
const writeRequests = (requests: BlueprintTORequest[]): void => store.write(requests);

export const getBlueprintTORequests = (requesterName?: string): BlueprintTORequest[] => {
  const requests = readRequests().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (!requesterName) return requests;
  return requests.filter(
    (request) => request.requesterName.toLowerCase() === requesterName.toLowerCase()
  );
};

export const addBlueprintTORequest = ({
  itemId,
  itemTitle,
  marketplace,
  requesterName,
  requesterRole,
  message,
}: {
  itemId: string;
  itemTitle: string;
  marketplace: BlueprintMarketplace;
  requesterName: string;
  requesterRole: string;
  message: string;
}): BlueprintTORequest | null => {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) return null;

  const now = new Date().toISOString();
  const request: BlueprintTORequest = {
    id: `blueprint-to-request-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    itemId,
    itemTitle,
    marketplace,
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

export const updateBlueprintTORequestStatus = (
  requestId: string,
  status: BlueprintRequestStatus
): BlueprintTORequest | null => {
  const requests = readRequests();
  let updated: BlueprintTORequest | null = null;
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

export const linkBlueprintTORequestToStage3 = (
  requestId: string,
  stage3RequestId: string
): BlueprintTORequest | null => {
  const requests = readRequests();
  let updated: BlueprintTORequest | null = null;
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
