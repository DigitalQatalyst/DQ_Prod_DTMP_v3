// Request System Types

export type RequestStatus = 
  | 'submitted'
  | 'under-review'
  | 'approved'
  | 'in-progress'
  | 'pending-information'
  | 'completed'
  | 'delivered'
  | 'closed';

export type RequestPriority = 'low' | 'medium' | 'high' | 'urgent';

export type RequestCategory = 
  | 'deep-dive-analysis'
  | 'workshop'
  | 'consulting'
  | 'custom-deliverable';

export type RequestScope = 
  | 'enterprise-wide'
  | 'business-unit'
  | 'department'
  | 'specific-applications';

export interface RequestCard {
  id: string;
  serviceId: string;
  title: string;
  description: string;
  category: RequestCategory;
  estimatedTimeline: string;
  icon: string;
  requestType: string;
}

export interface RequestFormData {
  // Auto-filled fields
  serviceName: string;
  serviceId: string;
  requestType: string;
  requestCategory: RequestCategory;
  
  // Required fields
  priority: RequestPriority;
  businessJustification: string;
  desiredCompletionDate: string;
  primaryContact: string;
  
  // Optional common fields
  scope?: RequestScope;
  stakeholders?: string;
  budgetCode?: string;
  additionalRequirements?: string;
  
  // Request type-specific fields
  // Deep-Dive Analysis & Reports
  reportFormat?: 'pdf' | 'powerpoint' | 'excel' | 'word';
  presentationRequired?: boolean;
  numberOfApplications?: number;
  specificFocusAreas?: string;
  
  // Workshops & Facilitation
  numberOfParticipants?: number;
  preferredDates?: string;
  duration?: 'half-day' | 'full-day' | 'two-day';
  location?: 'virtual' | 'on-site' | 'hybrid';
  workshopObjectives?: string;
  
  // Consulting & Expert Guidance
  consultationType?: 'one-time' | 'ongoing' | 'project-based';
  estimatedHours?: number;
  specificExpertise?: string;
  preferredConsultant?: string;
  
  // Custom Deliverables
  deliverableType?: string;
  targetAudience?: 'executive' | 'management' | 'technical' | 'all';
  formatRequirements?: string;
  brandingRequired?: boolean;
}

export interface RequestStatusHistory {
  status: RequestStatus;
  timestamp: string;
  comment?: string;
  updatedBy?: string;
}

export interface RequestComment {
  id: string;
  author: string;
  timestamp: string;
  message: string;
}

export interface RequestDeliverable {
  id: string;
  name: string;
  type: string;
  size: string;
  url: string;
  uploadedAt: string;
}

export interface ServiceRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  
  // Service info
  serviceName: string;
  serviceId: string;
  requestType: string;
  requestCategory: RequestCategory;
  
  // Request details
  priority: RequestPriority;
  status: RequestStatus;
  businessJustification: string;
  desiredCompletionDate: string;
  
  // Optional fields
  scope?: RequestScope;
  stakeholders?: string;
  budgetCode?: string;
  additionalRequirements?: string;
  
  // Type-specific data
  specificData?: Record<string, any>;
  
  // Tracking
  submittedAt: string;
  updatedAt: string;
  statusHistory: RequestStatusHistory[];
  comments: RequestComment[];
  deliverables: RequestDeliverable[];
  
  // Estimated completion
  estimatedCompletionDate?: string;
}

export interface RequestCardConfig {
  serviceId: string;
  cards: RequestCard[];
}
