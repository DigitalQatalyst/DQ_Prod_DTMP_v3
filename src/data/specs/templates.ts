import { DesignTemplate } from './types';

export const designTemplates: DesignTemplate[] = [
  {
    id: 'TMPL-001',
    title: 'Solution Architecture Document (SAD) Template',
    templateType: 'document',
    category: 'architecture',
    description: 'Comprehensive template for documenting solution architecture decisions, components, and rationale.',
    
    author: {
      name: 'Architecture Practice',
      role: 'Enterprise Architecture Team'
    },
    version: '3.2',
    lastUpdated: '2026-01-10T00:00:00Z',
    
    purpose: 'Create consistent, comprehensive solution architecture documentation that captures all key design decisions and their rationale.',
    whenToUse: 'Use this template when designing any new solution or major enhancement that requires architectural approval and documentation.',
    instructions: `1. Download the template in your preferred format (Word, Markdown, or PDF)
2. Fill in each section following the guidance provided
3. Include diagrams for key architectural views (context, container, component, deployment)
4. Document all significant architecture decisions using the ADR template embedded in Section 5
5. Review with stakeholders and architecture review board
6. Store final version in enterprise architecture repository`,
    
    sections: [
      {
        id: 'section-001',
        title: '1. Executive Summary',
        description: 'High-level overview of the solution',
        order: 1,
        required: true,
        guideText: 'Provide a 2-3 paragraph summary covering: business problem, proposed solution approach, key technologies, estimated effort/cost, and expected benefits. Write for executive audience.',
        exampleContent: 'This solution addresses the need for real-time inventory visibility across 50+ warehouses by implementing an event-driven microservices architecture...'
      },
      {
        id: 'section-002',
        title: '2. Business Context',
        description: 'Business problem and objectives',
        order: 2,
        required: true,
        guideText: 'Describe: business problem statement, business objectives, success criteria, key stakeholders, constraints (budget, timeline, regulatory)'
      },
      {
        id: 'section-003',
        title: '3. Requirements Overview',
        description: 'Functional and non-functional requirements',
        order: 3,
        required: true,
        guideText: 'Summarize key functional requirements and critical non-functional requirements (performance, scalability, security, availability)'
      },
      {
        id: 'section-004',
        title: '4. Solution Overview',
        description: 'High-level solution approach',
        order: 4,
        required: true,
        guideText: 'Describe the overall solution approach, key components, integration points, and how it addresses the business objectives'
      },
      {
        id: 'section-005',
        title: '5. Architecture Decisions',
        description: 'Key architectural decisions and rationale',
        order: 5,
        required: true,
        guideText: 'Document significant architecture decisions using ADR format: Context, Decision, Consequences. Include alternatives considered.'
      }
    ],
    
    files: [
      {
        format: 'docx',
        url: '/templates/TMPL-001/solution-architecture-document.docx',
        size: '145 KB'
      },
      {
        format: 'md',
        url: '/templates/TMPL-001/solution-architecture-document.md',
        size: '42 KB'
      },
      {
        format: 'pdf',
        url: '/templates/TMPL-001/solution-architecture-document-example.pdf',
        size: '892 KB'
      }
    ],
    
    examples: [
      {
        title: 'E-commerce Platform SAD Example',
        description: 'Complete solution architecture document for microservices-based e-commerce platform',
        fileUrl: '/templates/TMPL-001/examples/ecommerce-platform-sad.pdf'
      }
    ],
    
    bestPractices: [
      'Start with executive summary - write it last after completing all sections',
      'Use diagrams extensively - architecture is visual',
      'Focus on "why" not just "what" - explain decision rationale',
      'Include alternatives considered for key decisions',
      'Keep it concise but comprehensive - target 20-30 pages',
      'Update the document as design evolves - it\'s a living document during design phase'
    ],
    
    commonMistakes: [
      'Too much implementation detail - this is architecture not detailed design',
      'Missing non-functional requirements analysis',
      'No clear traceability from requirements to architecture decisions',
      'Diagrams without sufficient context or explanation',
      'Not documenting alternatives considered',
      'Treating it as one-time exercise rather than living document'
    ],
    
    tips: [
      'Review approved SADs from similar projects for inspiration',
      'Schedule architecture review sessions early - don\'t wait until document is "perfect"',
      'Use tools like draw.io, Lucidchart, or Miro for diagrams',
      'Version control your SAD in Git alongside code',
      'Link to detailed design documents rather than embedding everything'
    ],
    
    relatedTemplates: ['TMPL-002', 'TMPL-005', 'TMPL-009'],
    relatedBlueprints: ['ARCH-001', 'ARCH-003'],
    
    downloads: 2134,
    rating: 4.8,
    reviewCount: 156,
    
    tags: ['architecture', 'documentation', 'sad', 'design', 'template'],
    complexity: 'moderate'
  },
  {
    id: 'TMPL-005',
    title: 'Architecture Decision Record (ADR) Template',
    templateType: 'document',
    category: 'decision',
    description: 'Lightweight template for documenting individual architecture decisions following the ADR format.',
    
    author: {
      name: 'Architecture Practice',
      role: 'Enterprise Architecture Team'
    },
    version: '2.0',
    lastUpdated: '2025-11-20T00:00:00Z',
    
    purpose: 'Document significant architecture decisions in a consistent, lightweight format that captures context, decision, and consequences.',
    whenToUse: 'Use for any significant architecture decision that has long-term impact, involves tradeoffs, or affects multiple components/teams.',
    instructions: `Create a new ADR for each significant decision (don't bundle multiple decisions)
Number ADRs sequentially (ADR-001, ADR-002, etc.)
Fill in all sections - keep each section concise (2-4 paragraphs max)
Store ADRs in version control alongside code (docs/adr/ directory)
ADRs are immutable once accepted - create new ADR to supersede if needed
Review ADRs during architecture reviews and retrospectives`,
    
    sections: [
      {
        id: 'adr-title',
        title: 'Title',
        description: 'Short noun phrase describing the decision',
        order: 1,
        required: true,
        guideText: 'Format: "Use [technology/pattern/approach] for [purpose]". Example: "Use Kafka for event streaming"',
        exampleContent: 'Use PostgreSQL for Order Management Database'
      },
      {
        id: 'adr-status',
        title: 'Status',
        description: 'Current status of this ADR',
        order: 2,
        required: true,
        guideText: 'Status options: Proposed, Accepted, Rejected, Deprecated, Superseded by ADR-XXX',
        exampleContent: 'Accepted'
      },
      {
        id: 'adr-context',
        title: 'Context',
        description: 'What is the issue that we\'re seeing that is motivating this decision',
        order: 3,
        required: true,
        guideText: 'Describe the forces at play: technical, business, organizational. What problem are we solving? What constraints exist?'
      },
      {
        id: 'adr-decision',
        title: 'Decision',
        description: 'What we decided to do',
        order: 4,
        required: true,
        guideText: 'State the decision clearly and concisely. Use active voice. "We will..."',
        exampleContent: 'We will use PostgreSQL 14 as the primary database for the order management system.'
      },
      {
        id: 'adr-consequences',
        title: 'Consequences',
        description: 'What becomes easier or harder as a result of this decision',
        order: 5,
        required: true,
        guideText: 'List both positive and negative consequences. Be honest about tradeoffs. Consider: operational impact, team skills, vendor lock-in, costs, technical debt.'
      }
    ],
    
    files: [
      {
        format: 'md',
        url: '/templates/TMPL-005/adr-template.md',
        size: '3 KB'
      },
      {
        format: 'docx',
        url: '/templates/TMPL-005/adr-template.docx',
        size: '18 KB'
      }
    ],
    
    examples: [
      {
        title: 'ADR-001: Use React for Frontend Framework',
        description: 'Example ADR documenting frontend framework selection',
        fileUrl: '/templates/TMPL-005/examples/adr-001-react-frontend.md'
      }
    ],
    
    bestPractices: [
      'Write ADRs at the time of decision - don\'t wait',
      'Keep each ADR focused on a single decision',
      'Be honest about negative consequences',
      'Include quantitative data when possible (benchmarks, costs)',
      'Reference other ADRs when decisions are related',
      'Store ADRs in version control with code',
      'Review ADRs during onboarding of new team members'
    ],
    
    commonMistakes: [
      'Writing ADRs after the fact (loses context)',
      'Bundling multiple decisions in one ADR',
      'Omitting alternatives considered',
      'Not updating status when ADR is superseded',
      'Writing too much - ADRs should be concise',
      'Storing ADRs only in wiki/docs (put them in code repo)'
    ],
    
    tips: [
      'Number ADRs sequentially - never reuse numbers',
      'Use markdown for easy version control',
      'Link ADRs from your main architecture documentation',
      'Review ADRs quarterly to identify superseded decisions',
      'Create templates/scripts to generate new ADR files',
      'ADRs are immutable - never edit accepted ADRs, create new one to supersede'
    ],
    
    relatedTemplates: ['TMPL-001', 'TMPL-003'],
    relatedBlueprints: [],
    
    downloads: 3421,
    rating: 4.9,
    reviewCount: 234,
    
    tags: ['adr', 'decision', 'documentation', 'architecture', 'lightweight'],
    complexity: 'simple'
  }
];

// Add more templates
designTemplates.push(
  {
    id: 'TMPL-002',
    title: 'Technical Design Document Template',
    templateType: 'document',
    category: 'design',
    description: 'Template for detailed technical design documentation.',
    author: { name: 'Architecture Practice', role: 'Enterprise Architecture Team' },
    version: '2.1',
    lastUpdated: '2025-12-15T00:00:00Z',
    purpose: 'Document detailed technical design decisions and implementation approach.',
    whenToUse: 'Use for detailed design phase after architecture is approved.',
    instructions: 'Fill in each section with technical details.',
    sections: [],
    files: [{ format: 'docx', url: '/templates/TMPL-002/technical-design.docx', size: '98 KB' }],
    examples: [],
    bestPractices: ['Include code examples', 'Document interfaces', 'Specify data models'],
    commonMistakes: ['Too much detail', 'Missing error handling'],
    tips: ['Keep it focused', 'Update regularly'],
    relatedTemplates: ['TMPL-001'],
    relatedBlueprints: [],
    downloads: 1876,
    rating: 4.7,
    reviewCount: 123,
    tags: ['design', 'technical', 'documentation'],
    complexity: 'moderate'
  },
  {
    id: 'TMPL-003',
    title: 'Architecture Review Checklist',
    templateType: 'checklist',
    category: 'review',
    description: 'Comprehensive checklist for architecture reviews.',
    author: { name: 'Architecture Practice', role: 'Enterprise Architecture Team' },
    version: '1.5',
    lastUpdated: '2025-11-10T00:00:00Z',
    purpose: 'Ensure all aspects are reviewed during architecture reviews.',
    whenToUse: 'Use during architecture review meetings.',
    instructions: 'Go through each item and verify compliance.',
    sections: [],
    files: [{ format: 'xlsx', url: '/templates/TMPL-003/review-checklist.xlsx', size: '45 KB' }],
    examples: [],
    bestPractices: ['Complete all items', 'Document findings'],
    commonMistakes: ['Skipping items', 'Not documenting decisions'],
    tips: ['Customize for your organization', 'Update based on learnings'],
    relatedTemplates: ['TMPL-001'],
    relatedBlueprints: [],
    downloads: 2341,
    rating: 4.8,
    reviewCount: 167,
    tags: ['review', 'checklist', 'governance'],
    complexity: 'simple'
  }
);

export const getTemplateById = (id: string): DesignTemplate | undefined => {
  return designTemplates.find(t => t.id === id);
};

