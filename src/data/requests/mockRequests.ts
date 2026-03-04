import { ServiceRequest, RequestStatus, RequestPriority } from "@/types/requests";

// In-memory store for demo purposes
let mockRequests: ServiceRequest[] = [];

// Generate unique ID
const generateRequestId = (): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  return `REQ-${timestamp}-${random}`;
};

// Add a new request
export const addRequest = (requestData: Partial<ServiceRequest>): ServiceRequest => {
  const now = new Date().toISOString();

  const newRequest: ServiceRequest = {
    id: generateRequestId(),
    userId: requestData.userId || 'user-123',
    userName: requestData.userName || 'John Doe',
    userEmail: requestData.userEmail || 'john.doe@company.com',
    serviceName: requestData.serviceName || '',
    serviceId: requestData.serviceId || '',
    requestType: requestData.requestType || '',
    requestCategory: requestData.requestCategory || 'deep-dive-analysis',
    priority: requestData.priority || 'medium',
    status: 'submitted',
    businessJustification: requestData.businessJustification || '',
    desiredCompletionDate: requestData.desiredCompletionDate || '',
    scope: requestData.scope,
    stakeholders: requestData.stakeholders,
    budgetCode: requestData.budgetCode,
    additionalRequirements: requestData.additionalRequirements,
    specificData: requestData.specificData || {},
    submittedAt: now,
    updatedAt: now,
    statusHistory: [
      {
        status: 'submitted',
        timestamp: now,
        comment: 'Request submitted successfully'
      }
    ],
    comments: [],
    deliverables: []
  };

  mockRequests.push(newRequest);
  return newRequest;
};

// Get all requests for a user
export const getUserRequests = (userId: string): ServiceRequest[] => {
  return mockRequests.filter(req => req.userId === userId);
};

// Get a specific request by ID
export const getRequestById = (requestId: string): ServiceRequest | undefined => {
  return mockRequests.find(req => req.id === requestId);
};

// Update request status
export const updateRequestStatus = (
  requestId: string,
  newStatus: RequestStatus,
  comment?: string
): ServiceRequest | undefined => {
  const request = mockRequests.find(req => req.id === requestId);

  if (request) {
    const now = new Date().toISOString();
    request.status = newStatus;
    request.updatedAt = now;
    request.statusHistory.push({
      status: newStatus,
      timestamp: now,
      comment: comment || `Status updated to ${newStatus}`
    });
  }

  return request;
};

// Add comment to request
export const addRequestComment = (
  requestId: string,
  author: string,
  message: string
): ServiceRequest | undefined => {
  const request = mockRequests.find(req => req.id === requestId);

  if (request) {
    const now = new Date().toISOString();
    request.comments.push({
      id: `comment-${Date.now()}`,
      author,
      timestamp: now,
      message
    });
    request.updatedAt = now;
  }

  return request;
};

// Add deliverable to request
export const addRequestDeliverable = (
  requestId: string,
  deliverable: {
    name: string;
    type: string;
    size: string;
    url: string;
  }
): ServiceRequest | undefined => {
  const request = mockRequests.find(req => req.id === requestId);

  if (request) {
    const now = new Date().toISOString();
    request.deliverables.push({
      id: `deliverable-${Date.now()}`,
      ...deliverable,
      uploadedAt: now
    });
    request.updatedAt = now;
  }

  return request;
};

// Get request counts by status
export const getRequestCountsByStatus = (userId: string): Record<RequestStatus, number> => {
  const userRequests = getUserRequests(userId);

  const counts: Record<RequestStatus, number> = {
    'submitted': 0,
    'under-review': 0,
    'approved': 0,
    'in-progress': 0,
    'pending-information': 0,
    'completed': 0,
    'delivered': 0,
    'closed': 0
  };

  userRequests.forEach(req => {
    counts[req.status]++;
  });

  return counts;
};

// Clear all requests (for testing)
export const clearAllRequests = (): void => {
  mockRequests = [];
};

// Seed with demo data
export const seedDemoRequests = (userId: string): void => {
  const demoRequests: Partial<ServiceRequest>[] = [
    {
      userId,
      userName: 'John Doe',
      userEmail: 'john.doe@company.com',
      serviceName: 'Application Rationalization Assessment',
      serviceId: 'application-rationalization',
      requestType: 'Deep-Dive Rationalization Report',
      requestCategory: 'deep-dive-analysis',
      priority: 'high',
      businessJustification: 'Need to identify cost savings opportunities for FY25 budget planning',
      desiredCompletionDate: '2024-12-15',
      scope: 'enterprise-wide',
      stakeholders: 'CFO, CIO, Application Owners',
      budgetCode: 'IT-2024-001'
    },
    {
      userId,
      userName: 'John Doe',
      userEmail: 'john.doe@company.com',
      serviceName: 'Portfolio Health Review',
      serviceId: 'portfolio-health-dashboard',
      requestType: 'Remediation Action Plan',
      requestCategory: 'consulting',
      priority: 'medium',
      businessJustification: 'Address critical health issues in the Business Applications segment',
      desiredCompletionDate: '2025-01-20',
      scope: 'specific-applications'
    },
    {
      userId,
      userName: 'John Doe',
      userEmail: 'john.doe@company.com',
      serviceName: 'Portfolio Health Review',
      serviceId: 'portfolio-health-dashboard',
      requestType: 'Health Review Workshop',
      requestCategory: 'workshop',
      priority: 'low',
      businessJustification: 'Quarterly alignment with stakeholders on portfolio health indicators',
      desiredCompletionDate: '2025-02-05',
      specificData: {
        numberOfParticipants: 8,
        duration: 'half-day',
        location: 'remote'
      }
    }
  ];

  demoRequests.forEach(req => addRequest(req));

  // Update some statuses for demo
  const requests = getUserRequests(userId);
  if (requests.length > 0) {
    updateRequestStatus(requests[0].id, 'in-progress', 'Analysis in progress, preliminary findings available');
    addRequestComment(requests[0].id, 'Portfolio Team', 'We have completed the initial data collection and are now analyzing the results.');
  }
  if (requests.length > 1) {
    updateRequestStatus(requests[1].id, 'under-review', 'Request is being reviewed by compliance team');
  }
  if (requests.length > 2) {
    updateRequestStatus(requests[2].id, 'submitted', 'Request received and placed in queue');
  }
};
