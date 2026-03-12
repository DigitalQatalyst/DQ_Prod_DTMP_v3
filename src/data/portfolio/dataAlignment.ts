import { getSessionRole, type SessionRole } from "@/data/sessionRole";
import { getPortfolioRequests, type PortfolioRequest } from "./requestState";
import { stage3Requests } from "@/data/stage3/requests";
import type { Stage3Request } from "@/data/stage3/types";

/**
 * Data alignment utility to ensure consistency between Stage 2 (user view) 
 * and Stage 3 (operations view) for portfolio requests
 */

export interface AlignedPortfolioData {
  userRequests: PortfolioRequest[];
  operationalRequests: Stage3Request[];
  currentUserRole: SessionRole | null;
  isOperationalView: boolean;
}

/**
 * Get aligned portfolio data based on current user role and context
 */
export const getAlignedPortfolioData = (requesterName?: string): AlignedPortfolioData => {
  const currentUserRole = getSessionRole();
  const isOperationalView = currentUserRole === "to-ops" || currentUserRole === "to-admin";
  
  // Get user-facing portfolio requests
  const userRequests = getPortfolioRequests(requesterName);
  
  // Get operational Stage 3 requests for portfolio management
  const operationalRequests = stage3Requests.filter(
    request => request.type === "portfolio-management"
  );
  
  return {
    userRequests,
    operationalRequests,
    currentUserRole,
    isOperationalView
  };
};

/**
 * Get portfolio requests visible to current user based on their role
 */
export const getVisiblePortfolioRequests = (requesterName?: string): PortfolioRequest[] => {
  const { currentUserRole } = getAlignedPortfolioData();
  
  if (currentUserRole === "business-user" && requesterName) {
    // Business users only see their own requests
    return getPortfolioRequests(requesterName);
  } else if (currentUserRole === "to-ops" || currentUserRole === "to-admin") {
    // TO operations can see all requests
    return getPortfolioRequests();
  } else {
    // Default to user's own requests
    return getPortfolioRequests(requesterName);
  }
};

/**
 * Map portfolio request status to Stage 3 operational status
 */
export const mapPortfolioToOperationalStatus = (portfolioStatus: PortfolioRequest["status"]): Stage3Request["status"] => {
  switch (portfolioStatus) {
    case "Open":
      return "new";
    case "In Review":
      return "in-progress";
    case "Resolved":
      return "completed";
    default:
      return "new";
  }
};

/**
 * Map Stage 3 operational status to portfolio request status
 */
export const mapOperationalToPortfolioStatus = (operationalStatus: Stage3Request["status"]): PortfolioRequest["status"] => {
  switch (operationalStatus) {
    case "new":
    case "assigned":
      return "Open";
    case "in-progress":
    case "pending-review":
    case "pending-user":
      return "In Review";
    case "completed":
      return "Resolved";
    case "on-hold":
    case "cancelled":
      return "Open"; // Reset to open for potential re-work
    default:
      return "Open";
  }
};

/**
 * Find linked requests between Stage 2 and Stage 3
 */
export const findLinkedRequests = (portfolioRequestId: string): {
  portfolioRequest: PortfolioRequest | null;
  stage3Request: Stage3Request | null;
} => {
  const portfolioRequests = getPortfolioRequests();
  const portfolioRequest = portfolioRequests.find(req => req.id === portfolioRequestId) || null;
  
  let stage3Request: Stage3Request | null = null;
  if (portfolioRequest?.stage3RequestId) {
    stage3Request = stage3Requests.find(req => req.id === portfolioRequest.stage3RequestId) || null;
  } else {
    // Try to find by related assets
    stage3Request = stage3Requests.find(req => 
      req.relatedAssets?.includes(`portfolio-request:${portfolioRequestId}`)
    ) || null;
  }
  
  return { portfolioRequest, stage3Request };
};

/**
 * Sync status between portfolio request and Stage 3 request
 */
export const syncRequestStatus = (portfolioRequestId: string, newStatus: PortfolioRequest["status"]): boolean => {
  const { portfolioRequest, stage3Request } = findLinkedRequests(portfolioRequestId);
  
  if (!portfolioRequest || !stage3Request) {
    return false;
  }
  
  // Update portfolio request status
  // This would typically call updatePortfolioRequestStatus
  
  // Update Stage 3 request status
  const mappedStatus = mapPortfolioToOperationalStatus(newStatus);
  // This would typically call transitionStage3RequestStatus
  
  return true;
};

/**
 * Get request statistics for dashboard display
 */
export const getPortfolioRequestStats = (requesterName?: string) => {
  const requests = getVisiblePortfolioRequests(requesterName);
  
  const total = requests.length;
  const open = requests.filter(req => req.status === "Open").length;
  const inReview = requests.filter(req => req.status === "In Review").length;
  const resolved = requests.filter(req => req.status === "Resolved").length;
  
  return {
    total,
    open,
    inReview,
    resolved,
    completionRate: total > 0 ? Math.round((resolved / total) * 100) : 0
  };
};