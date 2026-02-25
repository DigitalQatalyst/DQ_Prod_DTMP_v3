// TypeScript interfaces for Solutions Specs Stage 2 Service

// Architecture Blueprint Types
export interface ArchitectureBlueprint {
  id: string;
  title: string;
  description: string;
  category: 'cloud' | 'microservices' | 'data' | 'integration' | 'security' | 'enterprise';
  complexity: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  components: ArchitectureComponent[];
  diagrams: ArchitectureDiagram[];
  technologyStack: TechnologyStack;
  implementationGuidance: string;
  bestPractices: string[];
  metrics: BlueprintMetrics;
  tags: string[];
  author: string;
  createdDate: string;
  lastUpdated: string;
}

export interface ArchitectureComponent {
  id: string;
  name: string;
  type: string;
  description: string;
  dependencies: string[];
  technologies: string[];
}

export interface ArchitectureDiagram {
  id: string;
  title: string;
  description: string;
  type: 'architecture' | 'sequence' | 'component' | 'deployment' | 'data-flow';
  fileUrl: string;
  thumbnailUrl?: string;
}

export interface TechnologyStack {
  required: Technology[];
  recommended: Technology[];
}

export interface Technology {
  name: string;
  version?: string;
  purpose: string;
  category: string;
}

export interface BlueprintMetrics {
  rating: number;
  usageCount: number;
  successRate: number;
}

// Design Template Types
export interface DesignTemplate {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'diagram' | 'checklist' | 'framework' | 'worksheet';
  category: 'requirements' | 'architecture' | 'design' | 'decision' | 'review';
  sections: TemplateSection[];
  files: TemplateFile[];
  examples: string[];
  bestPractices: string[];
  usageCount: number;
  author: string;
  createdDate: string;
  lastUpdated: string;
}

export interface TemplateSection {
  title: string;
  description: string;
  order: number;
}

export interface TemplateFile {
  name: string;
  type: string;
  size: string;
  downloadUrl: string;
}

// Design Pattern Types
export interface DesignPattern {
  id: string;
  title: string;
  description: string;
  type: 'architectural' | 'integration' | 'data' | 'security' | 'performance' | 'resilience';
  intent: string;
  problem: string;
  solution: string;
  codeExamples: CodeExample[];
  diagrams: PatternDiagram[];
  applicability: string;
  consequences: string[];
  relatedPatterns: string[];
  author: string;
  createdDate: string;
  lastUpdated: string;
}

export interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

export interface PatternDiagram {
  type: string;
  description: string;
  imageUrl: string;
}

// User Design Types
export interface UserDesign {
  id: string;
  title: string;
  description: string;
  type: 'architecture' | 'solution' | 'integration' | 'data-model';
  status: 'draft' | 'in-review' | 'approved' | 'archived';
  owner: string;
  components: DesignComponent[];
  decisions: DecisionRecord[];
  attachments: Attachment[];
  collaborators: Collaborator[];
  createdDate: string;
  modifiedDate: string;
}

export interface DesignComponent {
  id: string;
  name: string;
  type: string;
  description: string;
  properties: Record<string, unknown>;
}

export interface DecisionRecord {
  id: string;
  title: string;
  date: string;
  status: 'proposed' | 'accepted' | 'rejected' | 'superseded';
  rationale: string;
  alternatives: string[];
  consequences: string[];
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  url: string;
}

export interface Collaborator {
  userId: string;
  name: string;
  role: 'owner' | 'editor' | 'viewer';
  addedDate: string;
}
