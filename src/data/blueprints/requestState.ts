import { makeLocalStorageStore } from "@/data/shared/localStorageUtils";

export type BlueprintRequestStatus = "Open" | "In Review" | "In Progress" | "Resolved" | "On Hold";
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

export const seedSpecsDemoRequests = (): void => {
  const existing = readRequests().filter((r) => r.marketplace === "solution-specs");
  if (existing.length > 0) return;

  const demo: BlueprintTORequest[] = [
    {
      id: "spec-req-2025-001",
      itemId: "customer-360-platform",
      itemTitle: "Customer Data Unification Platform",
      marketplace: "solution-specs",
      requesterName: "Amina TO",
      requesterRole: "Portfolio Manager",
      message: JSON.stringify({ requestType: "Current Build", timeline: "3 – 6 months" }),
      status: "In Progress",
      createdAt: "2026-02-10T00:00:00.000Z",
      updatedAt: "2026-02-10T00:00:00.000Z",
    },
    {
      id: "spec-req-2025-002",
      itemId: "api-gateway-architecture",
      itemTitle: "API Integration Hub Enhancement",
      marketplace: "solution-specs",
      requesterName: "Amina TO",
      requesterRole: "Portfolio Manager",
      message: JSON.stringify({ requestType: "Enhancement", timeline: "1 – 3 months" }),
      status: "Resolved",
      createdAt: "2026-02-05T00:00:00.000Z",
      updatedAt: "2026-02-05T00:00:00.000Z",
    },
    {
      id: "spec-req-2025-003",
      itemId: "erp-crm-connector",
      itemTitle: "ERP–CRM Connector",
      marketplace: "solution-specs",
      requesterName: "Amina TO",
      requesterRole: "Portfolio Manager",
      message: JSON.stringify({ requestType: "Integration", timeline: "3 – 6 months" }),
      status: "In Review",
      createdAt: "2026-01-28T00:00:00.000Z",
      updatedAt: "2026-01-28T00:00:00.000Z",
    },
    {
      id: "spec-req-2025-004",
      itemId: "digital-workplace-revamp",
      itemTitle: "Digital Workplace Revamp",
      marketplace: "solution-specs",
      requesterName: "Amina TO",
      requesterRole: "Portfolio Manager",
      message: JSON.stringify({ requestType: "Enhancement", timeline: "6 – 12 months" }),
      status: "Open",
      createdAt: "2026-01-15T00:00:00.000Z",
      updatedAt: "2026-01-15T00:00:00.000Z",
    },
    {
      id: "spec-req-2025-005",
      itemId: "enterprise-data-platform",
      itemTitle: "Data Governance Framework",
      marketplace: "solution-specs",
      requesterName: "Amina TO",
      requesterRole: "Portfolio Manager",
      message: JSON.stringify({ requestType: "Current Build", timeline: "6 – 12 months" }),
      status: "On Hold",
      createdAt: "2026-01-08T00:00:00.000Z",
      updatedAt: "2026-01-08T00:00:00.000Z",
    },
  ];

  writeRequests([...demo, ...readRequests()]);
};
