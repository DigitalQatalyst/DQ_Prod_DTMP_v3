import { makeLocalStorageStore } from "@/data/shared/localStorageUtils";

export type PortfolioRequestStatus = "Open" | "In Review" | "Resolved";
export type PortfolioRequestType = "assessment" | "analysis" | "optimization" | "dashboard" | "consultation";

export interface PortfolioRequest {
  id: string;
  serviceId: string;
  requesterName: string;
  requesterRole: string;
  type: PortfolioRequestType;
  message: string;
  portfolioScope?: string;
  status: PortfolioRequestStatus;
  createdAt: string;
  updatedAt: string;
  stage3RequestId?: string;
  requestTitle?: string; // Added to match the display titles
  priority?: "Low" | "Medium" | "High";
  targetDate?: string;
  progress?: number;
}

const REQUESTS_KEY = "dtmp.portfolio.toRequests";
const store = makeLocalStorageStore<PortfolioRequest>(REQUESTS_KEY, 300);

// Sample data to align with the images shown
const samplePortfolioRequests: PortfolioRequest[] = [
  {
    id: "portfolio-request-1709123456789-abc12",
    serviceId: "application-dependencies",
    requesterName: "David Chen",
    requesterRole: "Enterprise Architecture",
    type: "analysis",
    message: "Need comprehensive dependency mapping for application portfolio to support rationalization decisions",
    portfolioScope: "Enterprise",
    status: "Open",
    createdAt: "2026-03-05T10:00:00Z",
    updatedAt: "2026-03-05T10:00:00Z",
    requestTitle: "Dependency Impact Analysis Request",
    priority: "Medium",
    targetDate: "2026-03-11T00:00:00Z",
    progress: 0,
    stage3RequestId: "req-stage3-009"
  },
  {
    id: "portfolio-request-1709023456789-def34",
    serviceId: "application-rationalization",
    requesterName: "Maria Rodriguez",
    requesterRole: "PMO",
    type: "assessment",
    message: "Request deep-dive analysis for application rationalization with cost-benefit analysis",
    portfolioScope: "Business Unit",
    status: "In Review",
    createdAt: "2026-03-02T14:30:00Z",
    updatedAt: "2026-03-08T09:15:00Z",
    requestTitle: "Deep-Dive Rationalization Report",
    priority: "High",
    targetDate: "2026-12-15T00:00:00Z",
    progress: 65,
    stage3RequestId: "req-stage3-008"
  },
  {
    id: "portfolio-request-1709223456789-ghi56",
    serviceId: "application-health-dashboard",
    requesterName: "Sarah Johnson",
    requesterRole: "Application Owner",
    type: "consultation",
    message: "Need remediation action plan for applications showing health concerns",
    portfolioScope: "Application",
    status: "In Review",
    createdAt: "2026-03-01T16:45:00Z",
    updatedAt: "2026-03-09T11:30:00Z",
    requestTitle: "Remediation Action Plan",
    priority: "Medium",
    targetDate: "2026-01-20T00:00:00Z",
    progress: 23,
    stage3RequestId: "req-stage3-010"
  },
  {
    id: "portfolio-request-1709323456789-jkl78",
    serviceId: "application-health-dashboard",
    requesterName: "Michael Thompson",
    requesterRole: "Portfolio Manager",
    type: "consultation",
    message: "Request health review workshop to align on improvement strategies",
    portfolioScope: "Enterprise",
    status: "Open",
    createdAt: "2026-03-09T08:00:00Z",
    updatedAt: "2026-03-09T08:00:00Z",
    requestTitle: "Health Review Workshop",
    priority: "Low",
    targetDate: "2026-02-05T00:00:00Z",
    progress: 0,
    stage3RequestId: "req-stage3-011"
  },
  {
    id: "portfolio-request-1709423456789-mno90",
    serviceId: "application-dependencies",
    requesterName: "David Chen",
    requesterRole: "Enterprise Architecture",
    type: "analysis",
    message: "Additional dependency impact analysis request for second application cluster",
    portfolioScope: "Enterprise",
    status: "Open",
    createdAt: "2026-03-09T12:00:00Z",
    updatedAt: "2026-03-09T12:00:00Z",
    requestTitle: "Dependency Impact Analysis Request",
    priority: "Medium",
    targetDate: "2026-03-10T00:00:00Z",
    progress: 0,
    stage3RequestId: "req-stage3-007" // Links to the original health assessment
  }
];

const readRequests = (): PortfolioRequest[] => {
  const stored = store.read();
  // If no stored requests, initialize with sample data
  if (stored.length === 0) {
    writeRequests(samplePortfolioRequests);
    return samplePortfolioRequests;
  }
  return stored;
};

const writeRequests = (requests: PortfolioRequest[]): void => store.write(requests);

export const getPortfolioRequests = (requesterName?: string): PortfolioRequest[] => {
  const requests = readRequests().sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  if (!requesterName) return requests;
  return requests.filter(
    (request) => request.requesterName.toLowerCase() === requesterName.toLowerCase()
  );
};

export const addPortfolioRequest = ({
  serviceId,
  requesterName,
  requesterRole,
  type,
  message,
  portfolioScope,
  requestTitle,
  priority,
}: {
  serviceId: string;
  requesterName: string;
  requesterRole: string;
  type: PortfolioRequestType;
  message: string;
  portfolioScope?: string;
  requestTitle?: string;
  priority?: "Low" | "Medium" | "High";
}): PortfolioRequest | null => {
  const trimmedMessage = message.trim();
  if (!trimmedMessage) return null;

  const now = new Date().toISOString();
  const request: PortfolioRequest = {
    id: `portfolio-request-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    serviceId,
    requesterName,
    requesterRole,
    type,
    message: trimmedMessage,
    portfolioScope: portfolioScope?.trim() || undefined,
    status: "Open",
    createdAt: now,
    updatedAt: now,
    requestTitle: requestTitle || `${type} request`,
    priority: priority || "Medium",
    targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks from now
    progress: 0,
  };

  const requests = readRequests();
  writeRequests([request, ...requests]);
  return request;
};

export const updatePortfolioRequestStatus = (
  requestId: string,
  status: PortfolioRequestStatus
): PortfolioRequest | null => {
  const requests = readRequests();
  let updated: PortfolioRequest | null = null;
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

export const linkPortfolioRequestToStage3 = (
  requestId: string,
  stage3RequestId: string
): PortfolioRequest | null => {
  const requests = readRequests();
  let updated: PortfolioRequest | null = null;
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