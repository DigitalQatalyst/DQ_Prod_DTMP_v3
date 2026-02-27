// Document Template Definition
export interface DocumentTemplate {
  id: string; // Format: TPL-001
  title: string;
  category: 'governance' | 'operational' | 'compliance' | 'technical' | 'hr' | 'security';
  subcategory: string; // e.g., "Data Privacy", "Change Management"
  description: string;
  longDescription: string; // Detailed explanation
  
  // Metadata
  author: {
    name: string;
    role: string;
  };
  version: string;
  lastUpdated: string;
  
  // What This Template Generates
  documentType: 'policy' | 'procedure' | 'guideline' | 'framework' | 'standard' | 'report';
  typicalLength: string; // e.g., "15-25 pages"
  format: 'word' | 'pdf' | 'markdown' | 'all';
  
  // Document Structure
  sections: TemplateSection[];
  
  // What AI Needs to Generate
  requiredInputs: RequiredInput[];
  optionalInputs: OptionalInput[];
  
  // Output Information
  whatYouGet: string[];
  sampleOutput?: string; // URL to sample document
  
  // Context & Guidance
  whenToUse: string[];
  bestPractices: string[];
  complianceFrameworks: string[]; // GDPR, SOC2, HIPAA, etc.
  
  // AI Generation Settings
  aiPromptTemplate: string; // Template for Claude prompt
  estimatedGenerationTime: string; // e.g., "2-3 minutes"
  
  // Usage Stats
  requestCount: number;
  avgRating: number;
  reviewCount: number;
  avgDeliveryTime: string; // e.g., "1-2 business days"
  
  // Tags
  tags: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  
  // Status
  status: 'active' | 'draft' | 'deprecated';
}

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  order: number;
  required: boolean;
}

export interface RequiredInput {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox';
  placeholder?: string;
  helpText?: string;
  options?: string[]; // For select/multiselect
}

export interface OptionalInput {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox';
  placeholder?: string;
  helpText?: string;
  options?: string[];
}

// Document Request (User submitted request)
export interface DocumentRequest {
  id: string; // Format: REQ-2026-001
  templateId: string; // Which template they're requesting
  templateTitle: string;
  
  // Requester
  requestedBy: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  
  // Request Details
  title: string; // Custom title for this request
  description: string; // Why they need this document
  inputs: RequestInput[]; // Their answers to template questions
  
  // Status & Timeline
  status: 'submitted' | 'under-review' | 'generating' | 'review-required' | 'delivered' | 'completed' | 'cancelled';
  priority: 'normal' | 'high' | 'urgent';
  submittedDate: string;
  expectedDeliveryDate: string;
  actualDeliveryDate?: string;
  
  // Assignment
  assignedTo?: {
    id: string;
    name: string;
    role: string;
  };
  
  // Progress
  progress: number; // 0-100
  currentStep: string; // "AI Generation", "Review", "Delivered"
  
  // Generated Document
  generatedDocument?: {
    id: string;
    version: string;
    generatedDate: string;
    fileUrl: string;
    fileName: string;
    fileSize: string;
    format: 'docx' | 'pdf' | 'md';
  };
  
  // Revisions
  revisions: DocumentRevision[];
  
  // Communication
  messages: RequestMessage[];
  
  // Feedback
  feedback?: {
    rating: number; // 1-5
    comments: string;
    submittedDate: string;
  };
  
  // Tags
  tags: string[];
}

export interface RequestInput {
  inputId: string; // Maps to RequiredInput or OptionalInput id
  label: string;
  value: string | string[] | boolean;
}

export interface DocumentRevision {
  id: string;
  version: string;
  changes: string;
  generatedDate: string;
  fileUrl: string;
  requestedBy: string;
}

export interface RequestMessage {
  id: string;
  from: {
    name: string;
    role: 'requester' | 'transformation-office';
  };
  to: string;
  message: string;
  timestamp: string;
  attachments?: {
    fileName: string;
    fileUrl: string;
  }[];
}

// Request Statistics (for dashboard)
export interface RequestStats {
  totalRequests: number;
  activeRequests: number;
  completedRequests: number;
  avgDeliveryTime: string;
  avgRating: number;
  mostRequestedTemplates: {
    templateId: string;
    templateTitle: string;
    requestCount: number;
  }[];
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: 'TPL-001',
    title: 'Data Privacy Policy',
    category: 'governance',
    subcategory: 'Data Privacy',
    description: 'Comprehensive data privacy policy covering data collection, usage, storage, and user rights in compliance with GDPR and CCPA.',
    longDescription: `
# Data Privacy Policy Template

Generate a complete, legally-sound data privacy policy customized for your organization. This template covers:

- Data collection practices and legal basis
- User rights (access, deletion, portability)
- Data storage and retention policies
- Third-party data sharing
- Breach notification procedures
- Cross-border data transfers
- Privacy by design principles

The AI will generate a policy aligned with GDPR, CCPA, and other major privacy regulations based on your organization's specific context.
    `,
    
    author: {
      name: 'Legal & Compliance Team',
      role: 'Policy Writers'
    },
    version: '2.1',
    lastUpdated: '2026-01-15T00:00:00Z',
    
    documentType: 'policy',
    typicalLength: '18-25 pages',
    format: 'all',
    
    sections: [
      {
        id: 'section-001',
        title: '1. Introduction and Scope',
        description: 'Purpose of policy and who it applies to',
        order: 1,
        required: true
      },
      {
        id: 'section-002',
        title: '2. Definitions',
        description: 'Key terms and definitions',
        order: 2,
        required: true
      },
      {
        id: 'section-003',
        title: '3. Data Collection',
        description: 'What data is collected and legal basis',
        order: 3,
        required: true
      },
      {
        id: 'section-004',
        title: '4. Data Usage',
        description: 'How collected data is used',
        order: 4,
        required: true
      },
      {
        id: 'section-005',
        title: '5. Data Storage and Security',
        description: 'Where and how data is stored',
        order: 5,
        required: true
      },
      {
        id: 'section-006',
        title: '6. Data Subject Rights',
        description: 'User rights under GDPR/CCPA',
        order: 6,
        required: true
      },
      {
        id: 'section-007',
        title: '7. Third-Party Data Sharing',
        description: 'When and how data is shared',
        order: 7,
        required: true
      },
      {
        id: 'section-008',
        title: '8. Data Retention',
        description: 'How long data is kept',
        order: 8,
        required: true
      },
      {
        id: 'section-009',
        title: '9. Breach Notification',
        description: 'Procedures for data breaches',
        order: 9,
        required: true
      },
      {
        id: 'section-010',
        title: '10. Policy Updates',
        description: 'How policy is maintained',
        order: 10,
        required: true
      }
    ],
    
    requiredInputs: [
      {
        id: 'input-001',
        label: 'Organization Name',
        type: 'text',
        placeholder: 'e.g., Acme Corporation',
        helpText: 'Full legal name of your organization'
      },
      {
        id: 'input-002',
        label: 'Department/Business Unit',
        type: 'text',
        placeholder: 'e.g., Marketing, IT, HR',
        helpText: 'Which department will this policy apply to?'
      },
      {
        id: 'input-003',
        label: 'Data Types Collected',
        type: 'multiselect',
        helpText: 'Select all types of data your organization collects',
        options: [
          'Personal identifiers (name, email, phone)',
          'Financial information (credit cards, bank accounts)',
          'Health information',
          'Behavioral data (website analytics, cookies)',
          'Location data',
          'Biometric data',
          'Employment data',
          'Other sensitive data'
        ]
      },
      {
        id: 'input-004',
        label: 'Geographic Scope',
        type: 'multiselect',
        helpText: 'Which regions does your organization operate in?',
        options: [
          'European Union (GDPR)',
          'United States (CCPA)',
          'United Kingdom',
          'Canada (PIPEDA)',
          'Asia-Pacific',
          'Latin America',
          'Global'
        ]
      },
      {
        id: 'input-005',
        label: 'Data Retention Period',
        type: 'text',
        placeholder: 'e.g., 7 years, As long as account is active',
        helpText: 'How long do you retain personal data?'
      }
    ],
    
    optionalInputs: [
      {
        id: 'input-opt-001',
        label: 'Third-Party Services Used',
        type: 'textarea',
        placeholder: 'e.g., AWS for hosting, Salesforce for CRM, Google Analytics',
        helpText: 'List major third-party services that process data'
      },
      {
        id: 'input-opt-002',
        label: 'Data Protection Officer Contact',
        type: 'text',
        placeholder: 'e.g., dpo@company.com',
        helpText: 'Email address for Data Protection Officer (if applicable)'
      },
      {
        id: 'input-opt-003',
        label: 'Special Considerations',
        type: 'textarea',
        placeholder: 'Any industry-specific requirements or special circumstances',
        helpText: 'Additional context for AI to consider'
      }
    ],
    
    whatYouGet: [
      'Complete 18-25 page privacy policy document',
      'Legally compliant with GDPR, CCPA, and other selected regulations',
      'Customized to your organization and data practices',
      'Ready-to-publish format (Word, PDF, or Markdown)',
      'Implementation checklist',
      'Privacy notice template for users',
      'Data subject request form templates'
    ],
    
    sampleOutput: '/samples/TPL-001/sample-data-privacy-policy.pdf',
    
    whenToUse: [
      'Launching new product or service that collects user data',
      'Expanding to new geographic markets (especially EU or California)',
      'Updating outdated privacy policy',
      'Responding to regulatory compliance requirements',
      'After a privacy audit identified gaps'
    ],
    
    bestPractices: [
      'Review policy annually and update as data practices change',
      'Make policy easily accessible on website',
      'Train employees on privacy policy requirements',
      'Maintain evidence of user consent where required',
      'Document all policy updates and notification to users',
      'Integrate privacy-by-design into product development'
    ],
    
    complianceFrameworks: [
      'GDPR (General Data Protection Regulation)',
      'CCPA (California Consumer Privacy Act)',
      'PIPEDA (Canada)',
      'UK Data Protection Act',
      'SOC 2',
      'ISO 27001'
    ],
    
    aiPromptTemplate: `Generate a comprehensive Data Privacy Policy for {organization_name} with the following specifications:

Department/Scope: {department}
Data Types: {data_types}
Geographic Scope: {geographic_scope}
Retention Period: {retention_period}
Third-Party Services: {third_party_services}

The policy must:
1. Comply with all applicable regulations for {geographic_scope}
2. Cover all {data_types} in detail
3. Provide clear user rights and contact procedures
4. Include breach notification procedures
5. Be written in clear, accessible language (not overly legal)
6. Include specific procedures for {organization_name}'s context

Use best practices from privacy law and include all required sections for compliance.`,
    
    estimatedGenerationTime: '3-5 minutes',
    
    requestCount: 127,
    avgRating: 4.8,
    reviewCount: 89,
    avgDeliveryTime: '1 business day',
    
    tags: ['privacy', 'gdpr', 'ccpa', 'compliance', 'data-protection', 'legal'],
    complexity: 'moderate',
    status: 'active'
  },
  
  {
    id: 'TPL-008',
    title: 'Incident Response Procedure',
    category: 'operational',
    subcategory: 'IT Operations',
    description: 'Detailed incident response procedure for IT security incidents, covering detection, containment, eradication, and recovery.',
    longDescription: `
# Incident Response Procedure Template

Generate a complete incident response procedure customized for your organization's IT environment and security posture.

Covers:
- Incident classification and severity levels
- Response team roles and responsibilities
- Detection and analysis procedures
- Containment strategies
- Eradication and recovery steps
- Post-incident review process
- Communication protocols

Aligned with NIST Cybersecurity Framework and industry best practices.
    `,
    
    author: {
      name: 'Security Operations Team',
      role: 'Security Architects'
    },
    version: '1.8',
    lastUpdated: '2026-02-01T00:00:00Z',
    
    documentType: 'procedure',
    typicalLength: '12-18 pages',
    format: 'all',
    
    sections: [
      {
        id: 'sec-ir-001',
        title: '1. Overview and Purpose',
        description: 'Purpose and scope of incident response',
        order: 1,
        required: true
      },
      {
        id: 'sec-ir-002',
        title: '2. Incident Classification',
        description: 'Severity levels and types of incidents',
        order: 2,
        required: true
      },
      {
        id: 'sec-ir-003',
        title: '3. Response Team',
        description: 'Roles, responsibilities, and escalation',
        order: 3,
        required: true
      },
      {
        id: 'sec-ir-004',
        title: '4. Detection and Analysis',
        description: 'How incidents are detected and assessed',
        order: 4,
        required: true
      },
      {
        id: 'sec-ir-005',
        title: '5. Containment',
        description: 'Immediate containment procedures',
        order: 5,
        required: true
      },
      {
        id: 'sec-ir-006',
        title: '6. Eradication and Recovery',
        description: 'Removing threats and restoring systems',
        order: 6,
        required: true
      },
      {
        id: 'sec-ir-007',
        title: '7. Post-Incident Activities',
        description: 'Review, documentation, and lessons learned',
        order: 7,
        required: true
      }
    ],
    
    requiredInputs: [
      {
        id: 'ir-input-001',
        label: 'Organization Name',
        type: 'text',
        placeholder: 'e.g., Acme Corporation'
      },
      {
        id: 'ir-input-002',
        label: 'IT Environment',
        type: 'multiselect',
        helpText: 'Select all that apply to your organization',
        options: [
          'On-premise data centers',
          'Cloud infrastructure (AWS/Azure/GCP)',
          'Hybrid cloud',
          'SaaS applications',
          'Mobile devices',
          'IoT devices'
        ]
      },
      {
        id: 'ir-input-003',
        label: 'Incident Response Team Size',
        type: 'select',
        options: ['1-5 people', '6-10 people', '11-20 people', '20+ people']
      },
      {
        id: 'ir-input-004',
        label: 'Operating Hours',
        type: 'select',
        options: ['Business hours only (9-5)', 'Extended hours (7am-10pm)', '24/7 operations']
      }
    ],
    
    optionalInputs: [
      {
        id: 'ir-opt-001',
        label: 'External Partners',
        type: 'textarea',
        placeholder: 'e.g., Cyber insurance provider, forensics firm, legal counsel',
        helpText: 'List any external partners involved in incident response'
      },
      {
        id: 'ir-opt-002',
        label: 'Compliance Requirements',
        type: 'multiselect',
        options: ['SOC 2', 'ISO 27001', 'PCI-DSS', 'HIPAA', 'GDPR']
      }
    ],
    
    whatYouGet: [
      'Complete incident response procedure document (12-18 pages)',
      'Incident classification matrix',
      'Response team contact list template',
      'Incident response flowcharts',
      'Communication templates',
      'Post-incident review template',
      'Incident log template'
    ],
    
    whenToUse: [
      'Establishing formal security incident response capability',
      'Updating outdated incident response procedures',
      'Preparing for compliance audit (SOC 2, ISO 27001)',
      'After a security incident revealed gaps',
      'Expanding IT operations to 24/7'
    ],
    
    bestPractices: [
      'Test incident response procedures through tabletop exercises quarterly',
      'Update procedures after each major incident',
      'Maintain up-to-date contact lists',
      'Integrate with change management process',
      'Train all IT staff on their incident response roles',
      'Document all incidents regardless of severity'
    ],
    
    complianceFrameworks: [
      'NIST Cybersecurity Framework',
      'ISO/IEC 27035',
      'SOC 2',
      'PCI-DSS Requirement 12.10'
    ],
    
    aiPromptTemplate: `Generate a detailed Incident Response Procedure for {organization_name}:

IT Environment: {it_environment}
Team Size: {team_size}
Operating Hours: {operating_hours}
External Partners: {external_partners}
Compliance: {compliance_requirements}

Include:
1. Specific procedures for {it_environment}
2. Role definitions appropriate for {team_size} team
3. On-call procedures for {operating_hours}
4. Escalation paths and communication protocols
5. Compliance alignment with {compliance_requirements}

Use NIST framework and industry best practices.`,
    
    estimatedGenerationTime: '2-3 minutes',
    
    requestCount: 84,
    avgRating: 4.9,
    reviewCount: 62,
    avgDeliveryTime: '1 business day',
    
    tags: ['security', 'incident-response', 'operations', 'nist', 'cybersecurity'],
    complexity: 'moderate',
    status: 'active'
  }
];

export const documentRequests: DocumentRequest[] = [
  {
    id: 'REQ-2026-045',
    templateId: 'TPL-001',
    templateTitle: 'Data Privacy Policy',
    
    requestedBy: {
      id: 'user-123',
      name: 'Jennifer Park',
      email: 'jennifer.park@company.com',
      department: 'Marketing'
    },
    
    title: 'Marketing Data Privacy Policy',
    description: 'Need updated privacy policy for new customer data platform launch. Must comply with GDPR and CCPA.',
    
    inputs: [
      {
        inputId: 'input-001',
        label: 'Organization Name',
        value: 'Acme Corporation'
      },
      {
        inputId: 'input-002',
        label: 'Department/Business Unit',
        value: 'Marketing'
      },
      {
        inputId: 'input-003',
        label: 'Data Types Collected',
        value: [
          'Personal identifiers (name, email, phone)',
          'Behavioral data (website analytics, cookies)',
          'Location data'
        ]
      },
      {
        inputId: 'input-004',
        label: 'Geographic Scope',
        value: [
          'European Union (GDPR)',
          'United States (CCPA)'
        ]
      },
      {
        inputId: 'input-005',
        label: 'Data Retention Period',
        value: '7 years or until user requests deletion'
      },
      {
        inputId: 'input-opt-001',
        label: 'Third-Party Services Used',
        value: 'Salesforce (CRM), Google Analytics, Segment (CDP), AWS (hosting)'
      },
      {
        inputId: 'input-opt-002',
        label: 'Data Protection Officer Contact',
        value: 'dpo@acmecorp.com'
      }
    ],
    
    status: 'generating',
    priority: 'high',
    submittedDate: '2026-02-05T09:30:00Z',
    expectedDeliveryDate: '2026-02-08T17:00:00Z',
    
    assignedTo: {
      id: 'staff-012',
      name: 'Sarah Chen',
      role: 'Senior Policy Writer'
    },
    
    progress: 75,
    currentStep: 'AI Generation Complete - Under Review',
    
    generatedDocument: {
      id: 'DOC-2026-045-v1',
      version: '1.0',
      generatedDate: '2026-02-06T14:23:00Z',
      fileUrl: '/documents/REQ-2026-045/data-privacy-policy-v1.docx',
      fileName: 'Acme_Marketing_Data_Privacy_Policy_v1.docx',
      fileSize: '245 KB',
      format: 'docx'
    },
    
    revisions: [],
    
    messages: [
      {
        id: 'msg-001',
        from: {
          name: 'Sarah Chen',
          role: 'transformation-office'
        },
        to: 'Jennifer Park',
        message: 'Hi Jennifer, I\'ve completed the initial AI generation of your Data Privacy Policy. The document covers all GDPR and CCPA requirements based on your inputs. I\'m currently reviewing for accuracy and will have it ready for you shortly.',
        timestamp: '2026-02-06T15:00:00Z'
      },
      {
        id: 'msg-002',
        from: {
          name: 'Jennifer Park',
          role: 'requester'
        },
        to: 'Sarah Chen',
        message: 'Thanks Sarah! Could you please emphasize the cookie consent requirements? We\'re implementing a new consent management platform.',
        timestamp: '2026-02-06T15:30:00Z'
      },
      {
        id: 'msg-003',
        from: {
          name: 'Sarah Chen',
          role: 'transformation-office'
        },
        to: 'Jennifer Park',
        message: 'Absolutely. I\'ll add an expanded section on cookie consent and integrate references to your consent management platform. Should have this ready by end of day.',
        timestamp: '2026-02-06T16:00:00Z'
      }
    ],
    
    tags: ['privacy', 'marketing', 'gdpr', 'ccpa', 'high-priority']
  },
  
  {
    id: 'REQ-2026-038',
    templateId: 'TPL-008',
    templateTitle: 'Incident Response Procedure',
    
    requestedBy: {
      id: 'user-089',
      name: 'Michael Torres',
      email: 'michael.torres@company.com',
      department: 'IT Operations'
    },
    
    title: 'IT Security Incident Response Procedure',
    description: 'Formalizing our incident response process for SOC 2 compliance audit.',
    
    inputs: [
      {
        inputId: 'ir-input-001',
        label: 'Organization Name',
        value: 'Acme Corporation'
      },
      {
        inputId: 'ir-input-002',
        label: 'IT Environment',
        value: [
          'Cloud infrastructure (AWS/Azure/GCP)',
          'SaaS applications',
          'Mobile devices'
        ]
      },
      {
        inputId: 'ir-input-003',
        label: 'Incident Response Team Size',
        value: '6-10 people'
      },
      {
        inputId: 'ir-input-004',
        label: 'Operating Hours',
        value: '24/7 operations'
      },
      {
        inputId: 'ir-opt-002',
        label: 'Compliance Requirements',
        value: ['SOC 2', 'ISO 27001']
      }
    ],
    
    status: 'delivered',
    priority: 'normal',
    submittedDate: '2026-02-01T10:00:00Z',
    expectedDeliveryDate: '2026-02-06T17:00:00Z',
    actualDeliveryDate: '2026-02-05T16:30:00Z',
    assignedTo: {
      id: 'staff-008',
      name: 'David Kim',
      role: 'Security Policy Specialist'
    },
    
    progress: 100,
    currentStep: 'Delivered - Awaiting Feedback',
    
    generatedDocument: {
      id: 'DOC-2026-038-v2',
      version: '2.0',
      generatedDate: '2026-02-05T16:30:00Z',
      fileUrl: '/documents/REQ-2026-038/incident-response-procedure-v2.pdf',
      fileName: 'Acme_Incident_Response_Procedure_v2.pdf',
      fileSize: '1.2 MB',
      format: 'pdf'
    },
    
    revisions: [
      {
        id: 'rev-001',
        version: '1.0',
        changes: 'Initial generation',
        generatedDate: '2026-02-03T11:00:00Z',
        fileUrl: '/documents/REQ-2026-038/incident-response-procedure-v1.pdf',
        requestedBy: 'System'
      },
      {
        id: 'rev-002',
        version: '2.0',
        changes: 'Added specific AWS CloudWatch integration details and expanded on-call rotation procedures',
        generatedDate: '2026-02-05T16:30:00Z',
        fileUrl: '/documents/REQ-2026-038/incident-response-procedure-v2.pdf',
        requestedBy: 'Michael Torres'
      }
    ],
    
    messages: [
      {
        id: 'msg-101',
        from: {
          name: 'David Kim',
          role: 'transformation-office'
        },
        to: 'Michael Torres',
        message: 'Michael, your Incident Response Procedure is ready! I\'ve included specific procedures for your AWS environment and 24/7 on-call rotation. The document is SOC 2 and ISO 27001 compliant. Please review and let me know if you need any adjustments.',
        timestamp: '2026-02-05T16:45:00Z'
      }
    ],
    
    tags: ['security', 'incident-response', 'soc2', 'iso27001', 'operations']
  }
];
