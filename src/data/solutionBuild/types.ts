import type { SolutionType } from '../blueprints/solutionSpecs';

// Core Build Request Types
export type BuildRequestType = 'pre-built' | 'custom' | 'enhancement' | 'integration';
export type BuildRequestStatus = 'intake' | 'triage' | 'queue' | 'in-progress' | 'testing' | 'deployed' | 'closed';
export type BuildPriority = 'critical' | 'high' | 'medium' | 'low';
export type RequirementStatus = 'pending' | 'approved' | 'in-progress' | 'completed';
export type BlockerStatus = 'open' | 'in-progress' | 'resolved';
export type DeliverableType = 'solution' | 'documentation' | 'operations' | 'training';
export type PhaseStatus = 'not-started' | 'in-progress' | 'completed';

// Requirement
export interface Requirement {
  id: string;
  description: string;
  status: RequirementStatus;
  priority: BuildPriority;
  assignedTo?: string;
}

// Build Phase
export interface BuildPhase {
  id: string;
  name: 'Discovery' | 'Design' | 'Development' | 'Testing' | 'Deployment';
  status: PhaseStatus;
  startDate?: string;
  endDate?: string;
  progress: number;
  tasks: Task[];
}

// Task
export interface Task {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: string;
}

// Sprint
export interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  goals: string[];
  velocity: number;
  completedStoryPoints: number;
  totalStoryPoints: number;
}

// Blocker
export interface Blocker {
  id: string;
  title: string;
  description: string;
  status: BlockerStatus;
  impact: 'high' | 'medium' | 'low';
  createdAt: string;
  resolvedAt?: string;
  owner: string;
  supportTicketId?: string;
}

// Build Deliverable
export interface BuildDeliverable {
  id: string;
  type: DeliverableType;
  name: string;
  dueDate: string;
  completed: boolean;
  documentUrl?: string;
}

// Document
export interface BuildDocument {
  id: string;
  name: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  url: string;
  size: number;
}

// Message
export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  mentions: string[];
}

// TO Assessment
export interface ToAssessment {
  assessedBy: string;
  assessedAt: string;
  estimatedEffort: number; // in weeks
  estimatedCost: number;
  recommendedTeam: string;
  notes: string;
  approved: boolean;
}

// UAT Approval
export interface UATApproval {
  approver: string;
  approvedAt?: string;
  rejectedAt?: string;
  feedback: string;
  approved: boolean;
}

// Closure Details
export interface ClosureDetails {
  closedBy: string;
  closedAt: string;
  finalCost: number;
  lessonsLearned: {
    whatWentWell: string;
    whatCouldImprove: string;
    recommendations: string;
  };
  npsSurveyScheduled: boolean;
  addedToCatalog: boolean;
  supportContact: string;
}

// Main Build Request
export interface BuildRequest {
  id: string; // BLD-2026-001
  type: BuildRequestType;
  status: BuildRequestStatus;
  priority: BuildPriority;
  name: string;
  businessNeed: string;
  requestedBy: string;
  sponsor: string;
  department: string;
  submittedAt: string;
  targetDate?: string;
  budget: {
    approved: number;
    spent: number;
  };
  requirements: Requirement[];
  assignedTeam?: string;
  queuePosition?: number;
  estimatedDelivery?: string;
  progress: number;
  phases: BuildPhase[];
  currentSprint?: Sprint;
  blockers: Blocker[];
  deliverables: BuildDeliverable[];
  documents: BuildDocument[];
  messages: Message[];
  toAssessment?: ToAssessment;
  uatApproval?: UATApproval;
  closureDetails?: ClosureDetails;
  linkedSpecId?: string;
  linkedInitiativeId?: string;
  createdAppId?: string;
}

// Pre-Built Solution
export interface PreBuiltSolution {
  id: string;
  name: string;
  description: string;
  category: SolutionType;
  timelineMin: number; // weeks
  timelineMax: number; // weeks
  costMin: number;
  costMax: number;
  previousDeployments: number;
  customizationOptions: string[];
  technicalRequirements: string[];
  deliverables: string[];
  tags: string[];
  popularity: number;
}

// Delivery Team
export interface DeliveryTeam {
  id: string;
  name: 'Alpha' | 'Beta' | 'Gamma' | 'Delta';
  specialty: string;
  skills: string[];
  capacity: number; // max concurrent builds
  currentLoad: number; // current builds
  utilization: number; // percentage
  nextAvailable: string; // date
  queuedRequests: number;
  completedBuilds: number;
  averageDeliveryTime: number; // weeks
}

// User Role
export type UserRole = 'Staff' | 'Manager' | 'Product Owner' | 'Business Sponsor' | 'Team Lead' | 'EA' | 'Director' | 'Executive' | 'TO';

// Permission
export interface Permission {
  canSubmitRequest: boolean;
  canViewAllRequests: boolean;
  canViewOwnRequests: boolean;
  canViewDepartmentRequests: boolean;
  canTriage: boolean;
  canAssignTeam: boolean;
  canManageQueue: boolean;
  canUpdateProgress: boolean;
  canApproveUAT: boolean;
  canCloseBuild: boolean;
  canViewDashboard: boolean;
  canManageTeams: boolean;
}
