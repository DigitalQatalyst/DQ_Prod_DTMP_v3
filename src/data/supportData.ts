
import { differenceInMinutes, parseISO } from "date-fns";

export type Priority = "low" | "medium" | "high" | "critical";
export type TicketStatus = "new" | "assigned" | "in-progress" | "pending-user" | "resolved" | "closed";
export type RequestStatus = "pending-approval" | "approved" | "rejected" | "in-progress" | "completed" | "cancelled";

export interface TicketComment {
  id: string;
  author: {
    id: string;
    name: string;
    role: "user" | "agent" | "system";
    avatar?: string;
  };
  content: string;
  timestamp: string;
  type: "comment" | "status-change" | "assignment" | "escalation" | "resolution";
  metadata?: { oldValue?: string; newValue?: string };
}

export interface Attachment {
  id: string;
  filename: string;
  fileSize: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadUrl: string;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  priority: Priority;
  status: TicketStatus;
  category: string;
  subcategory: string;
  affectedSystem?: string;
  requester: { id: string; name: string; email: string; department: string };
  assignee?: { id: string; name: string; email: string; team: string };
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  sla: {
    responseTimeHours: number;
    resolutionTimeHours: number;
    responseDeadline: string;
    resolutionDeadline: string;
    responseBreached: boolean;
    resolutionBreached: boolean;
    timeRemainingMinutes: number;
  };
  conversation: TicketComment[];
  attachments: Attachment[];
  relatedTickets?: string[];
  relatedKBArticles?: string[];
}

export interface ApprovalStep {
  id: string;
  stepNumber: number;
  approverName: string;
  approverRole: string;
  status: "pending" | "approved" | "rejected";
  approvedAt?: string;
  comments?: string;
  required: boolean;
}

export interface RequestedItem {
  id: string;
  itemType: string;
  itemName: string;
  itemDetails: string;
  quantity?: number;
}

export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details?: string;
}

export interface ServiceRequest {
  id: string;
  type: "access" | "provisioning" | "change" | "decommission" | "other";
  title: string;
  description: string;
  justification: string;
  status: RequestStatus;
  requester: { id: string; name: string; email: string; department: string; manager: string };
  approvalWorkflow: ApprovalStep[];
  requestedItems: RequestedItem[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedCompletionDate?: string;
  activityLog: ActivityLogEntry[];
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  subcategory?: string;
  content: string;
  summary: string;
  tags: string[];
  author: { name: string; role: string };
  createdAt: string;
  updatedAt: string;
  views: number;
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulPercentage: number;
  relatedArticles: string[];
  relatedTickets?: string[];
  featured: boolean;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedReadTime: string;
}

export interface KBCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  articleCount: number;
  color: string;
}

const minutesToDeadline = (deadline: string) => Math.max(differenceInMinutes(parseISO(deadline), new Date()), 0);

export const supportTickets: SupportTicket[] = [
  {
    id: "TICKET-2026-00123",
    subject: "Password Reset Request - Unable to Access Email",
    description: "Self-service reset not sending verification code; need manual reset.",
    priority: "high",
    status: "in-progress",
    category: "IT Support",
    subcategory: "Password Reset",
    affectedSystem: "Microsoft 365",
    requester: { id: "user-001", name: "Ahmed Al-Mansouri", email: "ahmed.almansouri@company.com", department: "Digital Transformation" },
    assignee: { id: "agent-005", name: "Sarah Mitchell", email: "sarah.mitchell@support.com", team: "IT Service Desk" },
    createdAt: "2026-02-09T08:30:00Z",
    updatedAt: "2026-02-09T09:15:00Z",
    sla: {
      responseTimeHours: 4,
      resolutionTimeHours: 24,
      responseDeadline: "2026-02-09T12:30:00Z",
      resolutionDeadline: "2026-02-10T08:30:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-10T08:30:00Z"),
    },
    conversation: [
      { id: "c-1", author: { id: "user-001", name: "Ahmed Al-Mansouri", role: "user", avatar: "AA" }, content: "Can't reset password; code not arriving.", timestamp: "2026-02-09T08:30:00Z", type: "comment" },
      { id: "c-2", author: { id: "agent-005", name: "Sarah Mitchell", role: "agent", avatar: "SM" }, content: "Confirm mobile ending 789?", timestamp: "2026-02-09T08:45:00Z", type: "comment" },
      { id: "c-3", author: { id: "user-001", name: "Ahmed Al-Mansouri", role: "user", avatar: "AA" }, content: "Yes, ending 789.", timestamp: "2026-02-09T09:00:00Z", type: "comment" },
    ],
    attachments: [],
    relatedKBArticles: ["KB-00101", "KB-00205"],
  },
  {
    id: "TICKET-2026-00118",
    subject: "Critical: Production Database Connection Failure",
    description: "Customer portal DB timing out; high CPU on primary node.",
    priority: "critical",
    status: "in-progress",
    category: "System Error",
    subcategory: "Database Issue",
    affectedSystem: "Customer Portal DB",
    requester: { id: "user-045", name: "David Chen", email: "david.chen@company.com", department: "IT Operations" },
    assignee: { id: "agent-012", name: "Marcus Johnson", email: "marcus.johnson@support.com", team: "DBA" },
    createdAt: "2026-02-09T07:15:00Z",
    updatedAt: "2026-02-09T09:45:00Z",
    sla: {
      responseTimeHours: 1,
      resolutionTimeHours: 4,
      responseDeadline: "2026-02-09T08:15:00Z",
      resolutionDeadline: "2026-02-09T11:15:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-09T11:15:00Z"),
    },
    conversation: [
      { id: "c-4", author: { id: "user-045", name: "David Chen", role: "user", avatar: "DC" }, content: "Production DB connection failures started 07:10.", timestamp: "2026-02-09T07:15:00Z", type: "comment" },
      { id: "c-5", author: { id: "system", name: "System", role: "system" }, content: "Escalated to Critical.", timestamp: "2026-02-09T07:16:00Z", type: "escalation" },
    ],
    attachments: [{ id: "attach-001", filename: "db_error_logs.txt", fileSize: "1.2 MB", fileType: "text/plain", uploadedBy: "David Chen", uploadedAt: "2026-02-09T07:15:00Z", downloadUrl: "/attachments/db_error_logs.txt" }],
  },
  {
    id: "TICKET-2026-00105",
    subject: "VPN drops every 10 minutes",
    description: "GlobalProtect unstable after client update.",
    priority: "medium",
    status: "pending-user",
    category: "Network",
    subcategory: "VPN",
    affectedSystem: "GlobalProtect",
    requester: { id: "user-078", name: "Priya Nair", email: "priya.nair@company.com", department: "Finance" },
    assignee: { id: "agent-021", name: "Liam Carter", email: "liam.carter@support.com", team: "Network Ops" },
    createdAt: "2026-02-08T16:00:00Z",
    updatedAt: "2026-02-09T09:00:00Z",
    sla: {
      responseTimeHours: 4,
      resolutionTimeHours: 24,
      responseDeadline: "2026-02-08T20:00:00Z",
      resolutionDeadline: "2026-02-09T16:00:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-09T16:00:00Z"),
    },
    conversation: [{ id: "c-6", author: { id: "agent-021", name: "Liam Carter", role: "agent", avatar: "LC" }, content: "Sent new config; awaiting retest.", timestamp: "2026-02-09T09:00:00Z", type: "comment" }],
    attachments: [],
    relatedKBArticles: ["KB-00115"],
  },
  {
    id: "TICKET-2026-00130",
    subject: "Laptop running hot and shutting down",
    description: "Device overheats after OS patch when multiple apps open.",
    priority: "medium",
    status: "in-progress",
    category: "Hardware",
    subcategory: "Laptop",
    requester: { id: "user-099", name: "Emma Wilson", email: "emma.wilson@company.com", department: "Marketing" },
    assignee: { id: "agent-033", name: "Oliver Smith", email: "oliver.smith@support.com", team: "Field Support" },
    createdAt: "2026-02-09T10:05:00Z",
    updatedAt: "2026-02-09T11:00:00Z",
    sla: {
      responseTimeHours: 8,
      resolutionTimeHours: 48,
      responseDeadline: "2026-02-09T18:05:00Z",
      resolutionDeadline: "2026-02-11T10:05:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-11T10:05:00Z"),
    },
    conversation: [],
    attachments: [],
  },
  {
    id: "TICKET-2026-00111",
    subject: "Access Request: Analytics Workspace",
    description: "Need access to Analytics workspace for Q1 dashboards.",
    priority: "low",
    status: "new",
    category: "Access",
    subcategory: "Workspace",
    requester: { id: "user-084", name: "Noah Patel", email: "noah.patel@company.com", department: "Analytics" },
    createdAt: "2026-02-09T09:50:00Z",
    updatedAt: "2026-02-09T09:50:00Z",
    sla: {
      responseTimeHours: 12,
      resolutionTimeHours: 72,
      responseDeadline: "2026-02-10T21:50:00Z",
      resolutionDeadline: "2026-02-12T09:50:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-12T09:50:00Z"),
    },
    conversation: [],
    attachments: [],
  },
  {
    id: "TICKET-2026-00107",
    subject: "Email delivery delays to external domains",
    description: "Outbound email delayed by 30+ minutes since morning.",
    priority: "high",
    status: "assigned",
    category: "Email",
    subcategory: "Delivery",
    requester: { id: "user-031", name: "Lucas Wright", email: "lucas.wright@company.com", department: "Sales" },
    assignee: { id: "agent-005", name: "Sarah Mitchell", email: "sarah.mitchell@support.com", team: "IT Service Desk" },
    createdAt: "2026-02-09T06:40:00Z",
    updatedAt: "2026-02-09T07:10:00Z",
    sla: {
      responseTimeHours: 2,
      resolutionTimeHours: 24,
      responseDeadline: "2026-02-09T08:40:00Z",
      resolutionDeadline: "2026-02-10T06:40:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-10T06:40:00Z"),
    },
    conversation: [],
    attachments: [],
  },
  {
    id: "TICKET-2026-00114",
    subject: "ServiceNow SSO login loop",
    description: "After credentials, SSO redirects back to login.",
    priority: "medium",
    status: "resolved",
    category: "Access",
    subcategory: "SSO",
    requester: { id: "user-054", name: "Ava Thompson", email: "ava.thompson@company.com", department: "HR" },
    assignee: { id: "agent-019", name: "Kevin Brown", email: "kevin.brown@support.com", team: "Identity Services" },
    createdAt: "2026-02-08T09:00:00Z",
    updatedAt: "2026-02-09T08:00:00Z",
    resolvedAt: "2026-02-09T08:00:00Z",
    sla: {
      responseTimeHours: 4,
      resolutionTimeHours: 24,
      responseDeadline: "2026-02-08T13:00:00Z",
      resolutionDeadline: "2026-02-09T09:00:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-09T09:00:00Z"),
    },
    conversation: [],
    attachments: [],
  },
  {
    id: "TICKET-2026-00102",
    subject: "Mobile app push notifications not received",
    description: "Users not receiving push notifications on iOS 5.2.",
    priority: "medium",
    status: "in-progress",
    category: "Application",
    subcategory: "Mobile",
    requester: { id: "user-066", name: "Sophia Martinez", email: "sophia.martinez@company.com", department: "Customer Success" },
    assignee: { id: "agent-025", name: "Brian Lee", email: "brian.lee@support.com", team: "Apps Support" },
    createdAt: "2026-02-09T05:30:00Z",
    updatedAt: "2026-02-09T09:10:00Z",
    sla: {
      responseTimeHours: 4,
      resolutionTimeHours: 24,
      responseDeadline: "2026-02-09T09:30:00Z",
      resolutionDeadline: "2026-02-10T05:30:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-10T05:30:00Z"),
    },
    conversation: [],
    attachments: [],
  },
  {
    id: "TICKET-2026-00109",
    subject: "Printer queue stuck in HQ 3rd floor",
    description: "Print jobs stuck 'processing'; device HP-LJ-3F-02.",
    priority: "low",
    status: "pending-user",
    category: "Hardware",
    subcategory: "Printer",
    requester: { id: "user-022", name: "James Cooper", email: "james.cooper@company.com", department: "Legal" },
    assignee: { id: "agent-033", name: "Oliver Smith", email: "oliver.smith@support.com", team: "Field Support" },
    createdAt: "2026-02-08T15:00:00Z",
    updatedAt: "2026-02-09T08:20:00Z",
    sla: {
      responseTimeHours: 8,
      resolutionTimeHours: 48,
      responseDeadline: "2026-02-08T23:00:00Z",
      resolutionDeadline: "2026-02-10T15:00:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-10T15:00:00Z"),
    },
    conversation: [],
    attachments: [],
  },
  {
    id: "TICKET-2026-00119",
    subject: "Account locked after MFA failures",
    description: "Account locked due to multiple failed MFA attempts; needs unlock.",
    priority: "high",
    status: "new",
    category: "Access",
    subcategory: "MFA",
    requester: { id: "user-017", name: "Isabella Rossi", email: "isabella.rossi@company.com", department: "Operations" },
    createdAt: "2026-02-09T10:20:00Z",
    updatedAt: "2026-02-09T10:20:00Z",
    sla: {
      responseTimeHours: 2,
      resolutionTimeHours: 8,
      responseDeadline: "2026-02-09T12:20:00Z",
      resolutionDeadline: "2026-02-09T18:20:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-09T18:20:00Z"),
    },
    conversation: [],
    attachments: [],
  },
  {
    id: "TICKET-2026-00104",
    subject: "Slow performance in analytics workspace",
    description: "Dashboards take 30s to load during peak hours.",
    priority: "medium",
    status: "resolved",
    category: "Performance",
    subcategory: "Analytics",
    requester: { id: "user-090", name: "Daniel Green", email: "daniel.green@company.com", department: "Analytics" },
    assignee: { id: "agent-017", name: "Mia Turner", email: "mia.turner@support.com", team: "Platform Performance" },
    createdAt: "2026-02-07T12:00:00Z",
    updatedAt: "2026-02-08T10:30:00Z",
    resolvedAt: "2026-02-08T10:30:00Z",
    sla: {
      responseTimeHours: 4,
      resolutionTimeHours: 24,
      responseDeadline: "2026-02-07T16:00:00Z",
      resolutionDeadline: "2026-02-08T12:00:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-08T12:00:00Z"),
    },
    conversation: [],
    attachments: [],
  },
  {
    id: "TICKET-2026-00127",
    subject: "New: Jira automation rule failing",
    description: "Triage rule not creating subtasks.",
    priority: "low",
    status: "new",
    category: "Application",
    subcategory: "Jira",
    requester: { id: "user-101", name: "Grace Lee", email: "grace.lee@company.com", department: "PMO" },
    createdAt: "2026-02-09T11:00:00Z",
    updatedAt: "2026-02-09T11:00:00Z",
    sla: {
      responseTimeHours: 12,
      resolutionTimeHours: 48,
      responseDeadline: "2026-02-10T23:00:00Z",
      resolutionDeadline: "2026-02-11T11:00:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-11T11:00:00Z"),
    },
    conversation: [],
    attachments: [],
  },
  {
    id: "TICKET-2026-00112",
    subject: "Resolved: Salesforce report export failure",
    description: "Exports timed out; cleared queued jobs resolved.",
    priority: "medium",
    status: "resolved",
    category: "Application",
    subcategory: "Salesforce",
    requester: { id: "user-032", name: "Henry Adams", email: "henry.adams@company.com", department: "Sales" },
    assignee: { id: "agent-030", name: "Chloe Morgan", email: "chloe.morgan@support.com", team: "CRM Support" },
    createdAt: "2026-02-08T07:00:00Z",
    updatedAt: "2026-02-08T14:00:00Z",
    resolvedAt: "2026-02-08T14:00:00Z",
    sla: {
      responseTimeHours: 4,
      resolutionTimeHours: 24,
      responseDeadline: "2026-02-08T11:00:00Z",
      resolutionDeadline: "2026-02-09T07:00:00Z",
      responseBreached: false,
      resolutionBreached: false,
      timeRemainingMinutes: minutesToDeadline("2026-02-09T07:00:00Z"),
    },
    conversation: [],
    attachments: [],
  },
];
export const serviceRequests: ServiceRequest[] = [
  {
    id: "REQ-2026-00045",
    type: "access",
    title: "SAP ERP Access Request - Finance Module",
    description: "Requesting access to SAP ERP Finance module.",
    justification: "Role requires direct access for budget reviews.",
    status: "pending-approval",
    requester: { id: "user-023", name: "Jennifer Park", email: "jennifer.park@company.com", department: "Finance", manager: "Robert Williams" },
    approvalWorkflow: [
      { id: "approval-001", stepNumber: 1, approverName: "Robert Williams", approverRole: "Direct Manager", status: "approved", approvedAt: "2026-02-08T14:30:00Z", comments: "Approved for Q1.", required: true },
      { id: "approval-002", stepNumber: 2, approverName: "Lisa Chen", approverRole: "Finance Director", status: "pending", required: true },
      { id: "approval-003", stepNumber: 3, approverName: "IT Security Team", approverRole: "IT Security", status: "pending", required: true },
    ],
    requestedItems: [{ id: "item-001", itemType: "Application Access", itemName: "SAP ERP - Finance", itemDetails: "Read/Write GL, AP, AR", quantity: 1 }],
    createdAt: "2026-02-08T10:15:00Z",
    updatedAt: "2026-02-08T14:30:00Z",
    estimatedCompletionDate: "2026-02-12T17:00:00Z",
    activityLog: [
      { id: "log-001", timestamp: "2026-02-08T10:15:00Z", actor: "Jennifer Park", action: "Request Submitted" },
      { id: "log-002", timestamp: "2026-02-08T14:30:00Z", actor: "Robert Williams", action: "Approved", details: "Manager approval" },
    ],
  },
  {
    id: "REQ-2026-00038",
    type: "provisioning",
    title: "New Employee Setup - Marketing Coordinator",
    description: "Complete IT setup for new marketing coordinator.",
    justification: "New hire starting Feb 15.",
    status: "in-progress",
    requester: { id: "user-056", name: "Maria Rodriguez", email: "maria.rodriguez@company.com", department: "HR", manager: "Thomas Anderson" },
    approvalWorkflow: [
      { id: "approval-101", stepNumber: 1, approverName: "Thomas Anderson", approverRole: "HR Director", status: "approved", approvedAt: "2026-02-07T09:00:00Z", required: true },
      { id: "approval-102", stepNumber: 2, approverName: "IT Provisioning", approverRole: "IT Ops", status: "approved", approvedAt: "2026-02-07T11:00:00Z", required: true },
    ],
    requestedItems: [
      { id: "item-101", itemType: "Hardware", itemName: "Dell Latitude 7440", itemDetails: "16GB/512GB", quantity: 1 },
      { id: "item-102", itemType: "Software License", itemName: "Adobe Creative Cloud", itemDetails: "All Apps", quantity: 1 },
      { id: "item-103", itemType: "Application Access", itemName: "Marketing Analytics", itemDetails: "Contributor" },
    ],
    createdAt: "2026-02-06T15:00:00Z",
    updatedAt: "2026-02-09T09:00:00Z",
    estimatedCompletionDate: "2026-02-14T18:00:00Z",
    activityLog: [{ id: "log-101", timestamp: "2026-02-06T15:00:00Z", actor: "Maria Rodriguez", action: "Request Submitted" }],
  },
  {
    id: "REQ-2026-00052",
    type: "change",
    title: "Increase API rate limits for Partner Integrations",
    description: "Temporary higher rate limit for partner data push.",
    justification: "Pilot partner needs to backfill data.",
    status: "in-progress",
    requester: { id: "user-061", name: "Omar Rahman", email: "omar.rahman@company.com", department: "Product", manager: "Linda Alvarez" },
    approvalWorkflow: [
      { id: "approval-201", stepNumber: 1, approverName: "Linda Alvarez", approverRole: "Product Director", status: "approved", approvedAt: "2026-02-08T12:00:00Z", required: true },
      { id: "approval-202", stepNumber: 2, approverName: "Security Review Board", approverRole: "Security", status: "pending", required: true },
    ],
    requestedItems: [{ id: "item-201", itemType: "Change", itemName: "API Gateway Rate Limit", itemDetails: "Increase to 2000 req/min for 14 days" }],
    createdAt: "2026-02-08T09:00:00Z",
    updatedAt: "2026-02-09T08:00:00Z",
    estimatedCompletionDate: "2026-02-10T18:00:00Z",
    activityLog: [{ id: "log-201", timestamp: "2026-02-08T09:00:00Z", actor: "Omar Rahman", action: "Request Submitted" }],
  },
  {
    id: "REQ-2026-00061",
    type: "decommission",
    title: "Decommission legacy file server",
    description: "Retire on-prem file server FS-LEG-01 after SharePoint migration.",
    justification: "Data migrated; reduce maintenance.",
    status: "approved",
    requester: { id: "user-015", name: "Ethan Walker", email: "ethan.walker@company.com", department: "IT Operations", manager: "Julia Barnes" },
    approvalWorkflow: [
      { id: "approval-301", stepNumber: 1, approverName: "Julia Barnes", approverRole: "IT Operations", status: "approved", approvedAt: "2026-02-07T10:00:00Z", required: true },
      { id: "approval-302", stepNumber: 2, approverName: "Risk Office", approverRole: "Risk", status: "approved", approvedAt: "2026-02-07T12:00:00Z", required: true },
    ],
    requestedItems: [{ id: "item-301", itemType: "Change", itemName: "Server Decommission", itemDetails: "Schedule power-off and disposal" }],
    createdAt: "2026-02-06T11:00:00Z",
    updatedAt: "2026-02-08T15:00:00Z",
    estimatedCompletionDate: "2026-02-12T10:00:00Z",
    activityLog: [{ id: "log-301", timestamp: "2026-02-06T11:00:00Z", actor: "Ethan Walker", action: "Request Submitted" }],
  },
  {
    id: "REQ-2026-00033",
    type: "access",
    title: "PowerBI Workspace Contributor Access",
    description: "Need contributor access to Sales Analytics workspace.",
    justification: "Building Q1 pipeline dashboards.",
    status: "completed",
    requester: { id: "user-034", name: "Lily Carter", email: "lily.carter@company.com", department: "Sales Ops", manager: "Jacob Miller" },
    approvalWorkflow: [],
    requestedItems: [{ id: "item-401", itemType: "Application Access", itemName: "PowerBI Workspace", itemDetails: "Contributor role" }],
    createdAt: "2026-02-05T08:00:00Z",
    updatedAt: "2026-02-06T10:00:00Z",
    completedAt: "2026-02-06T10:00:00Z",
    activityLog: [{ id: "log-401", timestamp: "2026-02-06T10:00:00Z", actor: "IT Operations", action: "Completed" }],
  },
  {
    id: "REQ-2026-00029",
    type: "provisioning",
    title: "New VM for QA environment",
    description: "Provision Windows Server VM for QA testing.",
    justification: "Upcoming release regression testing.",
    status: "completed",
    requester: { id: "user-070", name: "Harper Collins", email: "harper.collins@company.com", department: "Engineering", manager: "Michael Scott" },
    approvalWorkflow: [],
    requestedItems: [{ id: "item-501", itemType: "Infrastructure", itemName: "VM", itemDetails: "4 vCPU / 16GB / 200GB" }],
    createdAt: "2026-02-01T09:00:00Z",
    updatedAt: "2026-02-03T12:00:00Z",
    completedAt: "2026-02-03T12:00:00Z",
    activityLog: [{ id: "log-501", timestamp: "2026-02-03T12:00:00Z", actor: "Cloud Ops", action: "Provisioned" }],
  },
  {
    id: "REQ-2026-00057",
    type: "change",
    title: "Modify firewall rule for vendor IPs",
    description: "Allow vendor IP range 203.0.113.0/24 to staging.",
    justification: "Vendor integration testing.",
    status: "completed",
    requester: { id: "user-044", name: "Benjamin Lee", email: "benjamin.lee@company.com", department: "Security", manager: "Natalie Foster" },
    approvalWorkflow: [],
    requestedItems: [{ id: "item-601", itemType: "Change", itemName: "Firewall Rule", itemDetails: "Allow staging 443 from vendor range" }],
    createdAt: "2026-02-04T07:30:00Z",
    updatedAt: "2026-02-05T09:00:00Z",
    completedAt: "2026-02-05T09:00:00Z",
    activityLog: [{ id: "log-601", timestamp: "2026-02-05T09:00:00Z", actor: "Network Ops", action: "Completed" }],
  },
  {
    id: "REQ-2026-00048",
    type: "other",
    title: "Data extract for audit",
    description: "Export user access logs for January 2026.",
    justification: "Internal audit requirement.",
    status: "rejected",
    requester: { id: "user-011", name: "Mason Brooks", email: "mason.brooks@company.com", department: "Audit", manager: "Clara Wilson" },
    approvalWorkflow: [{ id: "approval-801", stepNumber: 1, approverName: "Data Governance", approverRole: "Governance", status: "rejected", comments: "Need narrower scope", required: true }],
    requestedItems: [{ id: "item-801", itemType: "Report", itemName: "Access Logs Export", itemDetails: "User access logs Jan 2026" }],
    createdAt: "2026-02-06T13:00:00Z",
    updatedAt: "2026-02-07T10:00:00Z",
    activityLog: [{ id: "log-801", timestamp: "2026-02-07T10:00:00Z", actor: "Data Governance", action: "Rejected", details: "Need narrower scope" }],
  },
];
export const knowledgeArticles: KnowledgeArticle[] = [
  { id: "KB-00101", title: "Resetting Your Microsoft 365 Password", category: "Getting Started", subcategory: "Account Access", content: "<p>Use self-service reset at https://passwordreset.microsoftonline.com...</p>", summary: "Steps to reset your Microsoft 365 password and verify MFA.", tags: ["password", "mfa", "m365"], author: { name: "IT Service Desk", role: "Support" }, createdAt: "2026-01-15T10:00:00Z", updatedAt: "2026-02-08T09:00:00Z", views: 1820, helpfulCount: 310, notHelpfulCount: 22, helpfulPercentage: 93, relatedArticles: ["KB-00105", "KB-00205"], relatedTickets: ["TICKET-2026-00123"], featured: true, difficulty: "beginner", estimatedReadTime: "4 min" },
  { id: "KB-00105", title: "Troubleshooting MFA Lockouts", category: "Troubleshooting", subcategory: "MFA", content: "<p>Common causes for MFA lockouts and how to resolve.</p>", summary: "Resolve common MFA lockouts including device changes and token desync.", tags: ["mfa", "access", "lockout"], author: { name: "Identity Team", role: "Security" }, createdAt: "2025-12-20T12:00:00Z", updatedAt: "2026-02-01T12:00:00Z", views: 980, helpfulCount: 140, notHelpfulCount: 18, helpfulPercentage: 89, relatedArticles: ["KB-00101"], relatedTickets: ["TICKET-2026-00119"], featured: false, difficulty: "beginner", estimatedReadTime: "5 min" },
  { id: "KB-00115", title: "Stabilizing VPN Connections on GlobalProtect", category: "Troubleshooting", subcategory: "VPN", content: "<p>Update client to 6.0.3, clear cache, and re-import certificate.</p>", summary: "Fix intermittent VPN drops by updating client and resetting config.", tags: ["vpn", "network", "remote"], author: { name: "Network Ops", role: "Networking" }, createdAt: "2025-11-01T10:00:00Z", updatedAt: "2026-01-28T08:00:00Z", views: 640, helpfulCount: 88, notHelpfulCount: 9, helpfulPercentage: 91, relatedArticles: [], relatedTickets: ["TICKET-2026-00105"], featured: false, difficulty: "intermediate", estimatedReadTime: "6 min" },
  { id: "KB-00120", title: "Email Delivery Checklist for External Domains", category: "How-To", subcategory: "Email", content: "<p>SPF, DKIM, DMARC checks and queue monitoring steps.</p>", summary: "Checklist to troubleshoot outbound email delays and failures.", tags: ["email", "delivery", "queue"], author: { name: "Messaging Team", role: "IT Operations" }, createdAt: "2025-10-12T09:00:00Z", updatedAt: "2026-02-02T09:30:00Z", views: 520, helpfulCount: 75, notHelpfulCount: 12, helpfulPercentage: 86, relatedArticles: ["KB-00101"], relatedTickets: ["TICKET-2026-00107"], featured: false, difficulty: "intermediate", estimatedReadTime: "7 min" },
  { id: "KB-00130", title: "Improving Laptop Thermal Performance", category: "How-To", subcategory: "Hardware", content: "<p>Steps to clean vents, update BIOS, and check background apps.</p>", summary: "Keep laptops cool after OS patches by updating drivers and cleaning vents.", tags: ["hardware", "laptop", "performance"], author: { name: "Field Support", role: "Support" }, createdAt: "2025-11-20T08:00:00Z", updatedAt: "2026-02-05T08:00:00Z", views: 410, helpfulCount: 68, notHelpfulCount: 7, helpfulPercentage: 91, relatedArticles: [], relatedTickets: ["TICKET-2026-00130"], featured: false, difficulty: "beginner", estimatedReadTime: "4 min" },
  { id: "KB-00140", title: "ServiceNow SSO Troubleshooting Guide", category: "Troubleshooting", subcategory: "SSO", content: "<p>Clear cookies, check IdP session, and validate clock skew.</p>", summary: "Fix SSO login loops for ServiceNow.", tags: ["sso", "servicenow", "access"], author: { name: "Identity Team", role: "Security" }, createdAt: "2025-09-10T12:00:00Z", updatedAt: "2026-01-30T11:00:00Z", views: 380, helpfulCount: 55, notHelpfulCount: 5, helpfulPercentage: 92, relatedArticles: [], relatedTickets: ["TICKET-2026-00114"], featured: false, difficulty: "intermediate", estimatedReadTime: "6 min" },
  { id: "KB-00150", title: "Analytics Workspace Performance Tuning", category: "Optimization", subcategory: "Analytics", content: "<p>Cache warm-up, query optimization, and concurrency limits.</p>", summary: "Reduce dashboard load times by tuning data refresh and caching.", tags: ["analytics", "performance"], author: { name: "Analytics Platform", role: "Engineering" }, createdAt: "2025-10-01T09:00:00Z", updatedAt: "2026-02-04T09:00:00Z", views: 460, helpfulCount: 70, notHelpfulCount: 10, helpfulPercentage: 88, relatedArticles: [], relatedTickets: ["TICKET-2026-00104"], featured: false, difficulty: "advanced", estimatedReadTime: "8 min" },
  { id: "KB-00160", title: "Setting Up New Hire Laptop", category: "Getting Started", subcategory: "Onboarding", content: "<p>Standard checklist for new hire laptop setup.</p>", summary: "Use this checklist for onboarding laptops.", tags: ["onboarding", "laptop"], author: { name: "IT Service Desk", role: "Support" }, createdAt: "2026-01-05T10:00:00Z", updatedAt: "2026-02-01T10:00:00Z", views: 260, helpfulCount: 40, notHelpfulCount: 4, helpfulPercentage: 91, relatedArticles: [], relatedTickets: [], featured: false, difficulty: "beginner", estimatedReadTime: "5 min" },
  { id: "KB-00165", title: "SharePoint Migration Tips", category: "How-To", subcategory: "Collaboration", content: "<p>Plan site structure, migrate in waves, and validate permissions.</p>", summary: "Checklist for smooth SharePoint migrations.", tags: ["sharepoint", "migration"], author: { name: "Collaboration Team", role: "IT" }, createdAt: "2025-12-12T09:00:00Z", updatedAt: "2026-01-22T09:00:00Z", views: 300, helpfulCount: 50, notHelpfulCount: 6, helpfulPercentage: 89, relatedArticles: [], relatedTickets: [], featured: false, difficulty: "intermediate", estimatedReadTime: "7 min" },
  { id: "KB-00170", title: "Clearing Stuck Print Jobs", category: "Troubleshooting", subcategory: "Printing", content: "<p>Clear queue, restart spooler, and reinstall driver.</p>", summary: "Fix stuck print queues on Windows.", tags: ["printer", "windows"], author: { name: "Field Support", role: "Support" }, createdAt: "2025-08-20T11:00:00Z", updatedAt: "2026-02-03T11:00:00Z", views: 210, helpfulCount: 32, notHelpfulCount: 3, helpfulPercentage: 91, relatedArticles: [], relatedTickets: ["TICKET-2026-00109"], featured: false, difficulty: "beginner", estimatedReadTime: "4 min" },
  { id: "KB-00175", title: "Creating Jira Automation Rules", category: "How-To", subcategory: "Jira", content: "<p>Examples of common Jira automation rules and troubleshooting.</p>", summary: "Build reliable Jira automation rules.", tags: ["jira", "automation"], author: { name: "PMO Tools", role: "PMO" }, createdAt: "2025-09-05T09:00:00Z", updatedAt: "2026-02-06T09:00:00Z", views: 180, helpfulCount: 25, notHelpfulCount: 4, helpfulPercentage: 86, relatedArticles: [], relatedTickets: ["TICKET-2026-00127"], featured: false, difficulty: "intermediate", estimatedReadTime: "6 min" },
  { id: "KB-00180", title: "Salesforce Export Best Practices", category: "How-To", subcategory: "Salesforce", content: "<p>Use scheduled exports, limit records, and monitor queues.</p>", summary: "Prevent export failures in Salesforce.", tags: ["salesforce", "export"], author: { name: "CRM Team", role: "Support" }, createdAt: "2025-10-10T10:00:00Z", updatedAt: "2026-02-01T10:00:00Z", views: 230, helpfulCount: 35, notHelpfulCount: 5, helpfulPercentage: 88, relatedArticles: [], relatedTickets: ["TICKET-2026-00112"], featured: false, difficulty: "intermediate", estimatedReadTime: "6 min" },
  { id: "KB-00185", title: "Handling Push Notification Issues", category: "Troubleshooting", subcategory: "Mobile", content: "<p>Verify app permissions, battery optimization, and FCM/APNS status.</p>", summary: "Resolve missing push notifications on mobile apps.", tags: ["mobile", "push", "notifications"], author: { name: "Mobile Apps", role: "Engineering" }, createdAt: "2025-11-14T10:00:00Z", updatedAt: "2026-02-04T10:00:00Z", views: 260, helpfulCount: 40, notHelpfulCount: 6, helpfulPercentage: 87, relatedArticles: [], relatedTickets: ["TICKET-2026-00102"], featured: false, difficulty: "intermediate", estimatedReadTime: "7 min" },
  { id: "KB-00190", title: "PowerBI Performance Checklist", category: "Optimization", subcategory: "Analytics", content: "<p>Optimize data model, reduce visuals, and enable aggregation.</p>", summary: "Improve PowerBI report performance.", tags: ["powerbi", "performance"], author: { name: "Analytics Platform", role: "Engineering" }, createdAt: "2025-11-25T09:00:00Z", updatedAt: "2026-02-02T09:00:00Z", views: 195, helpfulCount: 30, notHelpfulCount: 4, helpfulPercentage: 88, relatedArticles: [], relatedTickets: [], featured: false, difficulty: "advanced", estimatedReadTime: "7 min" },
  { id: "KB-00195", title: "Printer Maintenance Schedule", category: "Getting Started", subcategory: "Printing", content: "<p>Monthly cleaning and consumable checks.</p>", summary: "Routine maintenance schedule for office printers.", tags: ["printer", "maintenance"], author: { name: "Field Support", role: "Support" }, createdAt: "2025-07-12T08:00:00Z", updatedAt: "2026-01-15T08:00:00Z", views: 150, helpfulCount: 25, notHelpfulCount: 2, helpfulPercentage: 93, relatedArticles: [], relatedTickets: [], featured: false, difficulty: "beginner", estimatedReadTime: "3 min" },
  { id: "KB-00200", title: "API Gateway Rate Limit Changes", category: "How-To", subcategory: "API", content: "<p>Process for requesting temporary or permanent rate limit changes.</p>", summary: "How to request API rate limit increases with approvals.", tags: ["api", "gateway", "rate limit"], author: { name: "Integration Team", role: "Engineering" }, createdAt: "2025-09-01T09:00:00Z", updatedAt: "2026-02-08T09:00:00Z", views: 210, helpfulCount: 32, notHelpfulCount: 5, helpfulPercentage: 87, relatedArticles: [], relatedTickets: ["TICKET-2026-00118"], featured: true, difficulty: "intermediate", estimatedReadTime: "6 min" },
  { id: "KB-00205", title: "Self-Service Password Reset Troubleshooting", category: "Troubleshooting", subcategory: "Account Access", content: "<p>Ensure correct contact info, check SMS delivery, and clear cache.</p>", summary: "Troubleshoot SSR not delivering verification codes.", tags: ["password", "ssr", "m365"], author: { name: "Identity Team", role: "Security" }, createdAt: "2026-01-10T08:00:00Z", updatedAt: "2026-02-08T08:00:00Z", views: 320, helpfulCount: 48, notHelpfulCount: 6, helpfulPercentage: 89, relatedArticles: ["KB-00101"], relatedTickets: ["TICKET-2026-00123"], featured: false, difficulty: "beginner", estimatedReadTime: "5 min" },
  { id: "KB-00210", title: "Unlocking Accounts After MFA Failures", category: "How-To", subcategory: "MFA", content: "<p>Use admin portal to unlock and reset MFA tokens.</p>", summary: "Admins: unlock accounts and reset MFA tokens safely.", tags: ["mfa", "admin"], author: { name: "Identity Team", role: "Security" }, createdAt: "2026-01-25T09:00:00Z", updatedAt: "2026-02-06T09:00:00Z", views: 140, helpfulCount: 22, notHelpfulCount: 3, helpfulPercentage: 88, relatedArticles: ["KB-00105"], relatedTickets: ["TICKET-2026-00119"], featured: false, difficulty: "intermediate", estimatedReadTime: "4 min" },
  { id: "KB-00215", title: "Optimizing Salesforce Dashboards", category: "Optimization", subcategory: "Salesforce", content: "<p>Reduce components, use selective filters, schedule refresh.</p>", summary: "Improve Salesforce dashboard performance.", tags: ["salesforce", "dashboard"], author: { name: "CRM Team", role: "Support" }, createdAt: "2026-01-18T09:00:00Z", updatedAt: "2026-02-03T09:00:00Z", views: 160, helpfulCount: 24, notHelpfulCount: 4, helpfulPercentage: 86, relatedArticles: [], relatedTickets: [], featured: false, difficulty: "intermediate", estimatedReadTime: "6 min" },
  { id: "KB-00220", title: "Database Performance Runbook", category: "Optimization", subcategory: "Database", content: "<p>Checklist for CPU, memory, IO, and slow query analysis.</p>", summary: "Runbook for diagnosing database performance issues.", tags: ["database", "performance", "runbook"], author: { name: "DBA Team", role: "Engineering" }, createdAt: "2025-12-01T10:00:00Z", updatedAt: "2026-02-04T10:00:00Z", views: 240, helpfulCount: 36, notHelpfulCount: 6, helpfulPercentage: 86, relatedArticles: [], relatedTickets: ["TICKET-2026-00118"], featured: false, difficulty: "advanced", estimatedReadTime: "8 min" },
  { id: "KB-00225", title: "GlobalProtect Client Update Guide", category: "How-To", subcategory: "VPN", content: "<p>Steps to update client on Windows and macOS.</p>", summary: "Update GlobalProtect client to latest stable version.", tags: ["vpn", "client", "update"], author: { name: "Network Ops", role: "Networking" }, createdAt: "2026-01-02T09:00:00Z", updatedAt: "2026-02-05T09:00:00Z", views: 180, helpfulCount: 28, notHelpfulCount: 3, helpfulPercentage: 90, relatedArticles: ["KB-00115"], relatedTickets: ["TICKET-2026-00105"], featured: false, difficulty: "beginner", estimatedReadTime: "4 min" },
];

export const kbCategories: KBCategory[] = [
  { id: "cat-getting-started", name: "Getting Started", description: "Quick start guides and onboarding help", icon: "PlayCircle", articleCount: 3, color: "#3b82f6" },
  { id: "cat-troubleshooting", name: "Troubleshooting", description: "Fix common problems fast", icon: "Wrench", articleCount: 6, color: "#ef4444" },
  { id: "cat-how-to", name: "How-To", description: "Step-by-step procedures", icon: "ListChecks", articleCount: 5, color: "#f59e0b" },
  { id: "cat-optimization", name: "Optimization", description: "Improve performance and reliability", icon: "Gauge", articleCount: 4, color: "#10b981" },
  { id: "cat-security", name: "Security", description: "Identity and access guidance", icon: "Shield", articleCount: 2, color: "#6366f1" },
  { id: "cat-collaboration", name: "Collaboration", description: "Collaboration tools and tips", icon: "Users", articleCount: 1, color: "#8b5cf6" },
];

export const supportStats = {
  totalTickets: supportTickets.length,
  openTickets: supportTickets.filter((t) => !["resolved", "closed"].includes(t.status)).length,
  highPriority: supportTickets.filter((t) => t.priority === "critical" || t.priority === "high").length,
  pendingUser: supportTickets.filter((t) => t.status === "pending-user").length,
  resolvedLast7Days: supportTickets.filter((t) => t.resolvedAt).length,
  serviceRequests: serviceRequests.length,
  requestsInProgress: serviceRequests.filter((r) => r.status === "in-progress").length,
};
