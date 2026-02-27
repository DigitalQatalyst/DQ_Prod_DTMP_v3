// Solutions Specs Type Definitions

export interface ArchitectureBlueprint {
  id: string; // Format: ARCH-001
  title: string;
  category: 'cloud' | 'microservices' | 'data' | 'integration' | 'security' | 'enterprise';
  subcategory: string;
  description: string;
  longDescription: string;
  
  author: {
    name: string;
    role: string;
    organization: string;
  };
  version: string;
  lastUpdated: string;
  publishedDate: string;
  
  overview: string;
  useCases: string[];
  benefits: string[];
  considerations: string[];
  
  components: BlueprintComponent[];
  integrationPoints: string[];
  technologyStack: {
    required: string[];
    recommended: string[];
    alternatives: Array<{ tech: string; alternative: string }>;
  };
  
  diagrams: {
    conceptual?: string;
    logical?: string;
    physical?: string;
    sequence?: string[];
  };
  
  referenceImplementation?: {
    githubUrl: string;
    documentation: string;
    demoUrl?: string;
  };
  
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  estimatedEffort: string;
  teamSize: string;
  
  relatedBlueprints: string[];
  relatedPatterns: string[];
  prerequisites: string[];
  
  downloads: number;
  views: number;
  rating: number;
  reviewCount: number;
  usageCount: number;
  
  tags: string[];
  industryVerticals: string[];
  
  status: 'draft' | 'review' | 'approved' | 'deprecated';
  approvedBy?: string;
  approvalDate?: string;
}

export interface BlueprintComponent {
  id: string;
  name: string;
  type: string;
  description: string;
  responsibilities: string[];
  interfaces: string[];
  dependencies: string[];
  technology?: string;
}

export interface DesignTemplate {
  id: string; // Format: TMPL-001
  title: string;
  templateType: 'document' | 'diagram' | 'checklist' | 'framework' | 'worksheet';
  category: 'requirements' | 'architecture' | 'design' | 'decision' | 'review';
  description: string;
  
  author: {
    name: string;
    role: string;
  };
  version: string;
  lastUpdated: string;
  
  purpose: string;
  whenToUse: string;
  instructions: string;
  
  sections?: TemplateSection[];
  
  files: {
    format: 'docx' | 'pdf' | 'xlsx' | 'pptx' | 'md' | 'drawio' | 'miro';
    url: string;
    size: string;
  }[];
  
  examples: {
    title: string;
    description: string;
    fileUrl: string;
  }[];
  
  bestPractices: string[];
  commonMistakes: string[];
  tips: string[];
  
  relatedTemplates: string[];
  relatedBlueprints: string[];
  
  downloads: number;
  rating: number;
  reviewCount: number;
  
  tags: string[];
  complexity: 'simple' | 'moderate' | 'complex';
}

export interface TemplateSection {
  id: string;
  title: string;
  description: string;
  order: number;
  required: boolean;
  guideText: string;
  exampleContent?: string;
}

export interface DesignPattern {
  id: string; // Format: PTRN-001
  name: string;
  patternType: 'architectural' | 'integration' | 'data' | 'security' | 'performance' | 'resilience';
  category: string;
  
  intent: string;
  problem: string;
  solution: string;
  
  structure: string;
  participants: PatternParticipant[];
  collaborations: string;
  
  applicability: string[];
  useCases: string[];
  
  benefits: string[];
  tradeoffs: string[];
  antipatterns: string[];
  
  codeExamples: {
    language: string;
    code: string;
    description: string;
  }[];
  realWorldExamples: {
    company?: string;
    scenario: string;
    implementation: string;
  }[];
  
  diagrams: {
    type: 'class' | 'sequence' | 'component' | 'deployment';
    url: string;
    caption: string;
  }[];
  
  relatedPatterns: string[];
  combines: string[];
  alternatives: string[];
  
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  maturityLevel: 'experimental' | 'emerging' | 'mature' | 'declining';
  
  views: number;
  implementations: number;
  rating: number;
  
  references: {
    title: string;
    author?: string;
    url?: string;
  }[];
  
  tags: string[];
}

export interface PatternParticipant {
  id: string;
  name: string;
  role: string;
  responsibilities: string[];
}

export interface UserDesign {
  id: string; // Format: DESIGN-2026-001
  title: string;
  designType: 'architecture' | 'solution' | 'integration' | 'data-model';
  status: 'draft' | 'in-review' | 'approved' | 'implemented' | 'archived';
  
  basedOnBlueprint?: string;
  basedOnTemplate?: string;
  
  owner: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
  team: string[];
  
  projectName?: string;
  businessObjective: string;
  stakeholders: string[];
  
  description: string;
  requirements: string[];
  constraints: string[];
  assumptions: string[];
  
  components: DesignComponent[];
  integrations: DesignIntegration[];
  
  architectureDecisions: ArchitectureDecision[];
  
  attachments: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: string;
    uploadedBy: string;
    uploadedAt: string;
    url: string;
  }[];
  
  createdAt: string;
  updatedAt: string;
  reviewDate?: string;
  approvalDate?: string;
  implementationDate?: string;
  
  comments: DesignComment[];
  reviews: DesignReview[];
  
  tags: string[];
}

export interface DesignComponent {
  id: string;
  name: string;
  type: string;
  description: string;
  technology?: string;
  vendor?: string;
  interfaces: string[];
  dependencies: string[];
}

export interface DesignIntegration {
  id: string;
  fromComponent: string;
  toComponent: string;
  protocol: string;
  dataFlow: string;
  syncAsync: 'synchronous' | 'asynchronous';
}

export interface ArchitectureDecision {
  id: string;
  title: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'superseded';
  context: string;
  decision: string;
  consequences: string;
  alternatives: string[];
  decidedBy: string;
  decidedDate: string;
}

export interface DesignComment {
  id: string;
  author: {
    name: string;
    role: string;
  };
  content: string;
  timestamp: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
}

export interface DesignReview {
  id: string;
  reviewer: {
    name: string;
    role: string;
  };
  reviewDate: string;
  status: 'approved' | 'approved-with-comments' | 'changes-requested' | 'rejected';
  comments: string;
  recommendations: string[];
}




