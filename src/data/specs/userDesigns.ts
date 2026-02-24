import { UserDesign } from './types';

export const userDesigns: UserDesign[] = [
  {
    id: 'DESIGN-2026-001',
    title: 'Customer 360 Platform Architecture',
    designType: 'architecture',
    status: 'in-review',
    basedOnBlueprint: 'ARCH-001',
    
    owner: {
      id: 'user-042',
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      role: 'Solution Architect'
    },
    team: ['michael.torres@company.com', 'jennifer.park@company.com', 'david.kim@company.com'],
    
    projectName: 'Customer 360 Initiative',
    businessObjective: 'Create unified customer view across all touchpoints to enable personalized experiences and improve customer lifetime value by 15%.',
    stakeholders: ['Chief Marketing Officer', 'VP Customer Experience', 'VP IT'],
    
    description: 'Event-driven microservices architecture for Customer 360 platform integrating data from CRM, e-commerce, support, and marketing automation systems.',
    
    requirements: [
      'Real-time customer profile updates across all systems',
      'Support 50,000+ customer profile updates per day',
      'Sub-second query response times for customer lookup',
      'GDPR compliance for customer data management',
      'Integration with 8 source systems (Salesforce, SAP, Zendesk, etc.)',
      '99.9% availability SLA'
    ],
    
    constraints: [
      'Must integrate with existing Salesforce CRM (cannot replace)',
      'Budget: $2.4M capital, $480K annual operating cost',
      'Timeline: 9 months to MVP',
      'Team: 6 engineers, 1 architect, 1 PM',
      'Must use Azure cloud (company standard)',
      'PII data must remain in EU region for GDPR'
    ],
    
    assumptions: [
      'Source systems can publish events for customer data changes',
      'API rate limits from SaaS vendors will not be a bottleneck',
      'Customer matching logic accuracy of 95% is acceptable',
      'Eventual consistency acceptable (max 5 second lag)'
    ],
    
    components: [
      {
        id: 'comp-cdp-001',
        name: 'Customer Profile Service',
        type: 'Microservice',
        description: 'Manages unified customer profiles',
        technology: 'Node.js, Express',
        interfaces: ['REST API', 'GraphQL API'],
        dependencies: ['Customer Database', 'Event Bus']
      },
      {
        id: 'comp-cdp-002',
        name: 'Event Aggregation Service',
        type: 'Microservice',
        description: 'Aggregates customer events from source systems',
        technology: 'Java Spring Boot',
        interfaces: ['Kafka Consumer'],
        dependencies: ['Azure Event Hubs', 'Customer Profile Service']
      }
    ],
    
    integrations: [
      {
        id: 'int-001',
        fromComponent: 'Salesforce CDC',
        toComponent: 'Event Aggregation Service',
        protocol: 'Kafka',
        dataFlow: 'Customer updates from Salesforce',
        syncAsync: 'asynchronous'
      }
    ],
    
    architectureDecisions: [
      {
        id: 'ADR-001',
        title: 'Use Azure Event Hubs for Event Streaming',
        status: 'accepted',
        context: 'Need managed Kafka-compatible event streaming service. Considered Azure Event Hubs, Confluent Cloud, and self-managed Kafka on AKS.',
        decision: 'We will use Azure Event Hubs with Kafka protocol for event streaming.',
        consequences: 'Positive: Fully managed, integrates with Azure ecosystem, lower operational overhead. Negative: Vendor lock-in to Azure, slightly higher cost than self-managed.',
        alternatives: ['Confluent Cloud - better Kafka ecosystem but higher cost', 'Self-managed Kafka - most control but high operational burden'],
        decidedBy: 'Sarah Chen',
        decidedDate: '2026-01-15T00:00:00Z'
      },
      {
        id: 'ADR-002',
        title: 'Use Cosmos DB for Customer Profile Storage',
        status: 'accepted',
        context: 'Need globally distributed, low-latency database for customer profiles. Requirements: sub-10ms reads, 99.99% availability, multi-region replication.',
        decision: 'We will use Azure Cosmos DB with SQL API for customer profile storage.',
        consequences: 'Positive: Global distribution, guaranteed latency/availability SLAs, automatic indexing. Negative: Higher cost than PostgreSQL, learning curve for team.',
        alternatives: ['PostgreSQL with read replicas - lower cost but manual replication', 'MongoDB Atlas - similar capabilities but prefer Azure-native'],
        decidedBy: 'Architecture Review Board',
        decidedDate: '2026-01-18T00:00:00Z'
      }
    ],
    
    attachments: [
      {
        id: 'attach-001',
        fileName: 'customer-360-architecture-diagram.pdf',
        fileType: 'application/pdf',
        fileSize: '2.4 MB',
        uploadedBy: 'Sarah Chen',
        uploadedAt: '2026-01-20T00:00:00Z',
        url: '/designs/DESIGN-2026-001/customer-360-architecture-diagram.pdf'
      }
    ],
    
    createdAt: '2026-01-12T00:00:00Z',
    updatedAt: '2026-02-05T00:00:00Z',
    reviewDate: '2026-02-10T00:00:00Z',
    
    comments: [
      {
        id: 'comment-001',
        author: { name: 'Chief Architect', role: 'Enterprise Architect' },
        content: 'Overall design looks solid. My main concern is the complexity of customer matching logic across 8 source systems. Have you considered a phased approach starting with 2-3 systems?',
        timestamp: '2026-02-03T00:00:00Z',
        resolved: false
      }
    ],
    
    reviews: [
      {
        id: 'review-001',
        reviewer: { name: 'Michael Rodriguez', role: 'Lead Architect' },
        reviewDate: '2026-02-05T00:00:00Z',
        status: 'approved-with-comments',
        comments: 'Strong technical design. Address security comments before final approval.',
        recommendations: [
          'Add disaster recovery section',
          'Include cost estimation and ROI analysis',
          'Document data governance approach'
        ]
      }
    ],
    
    tags: ['customer-360', 'cdp', 'event-driven', 'microservices', 'azure']
  }
];

export const getUserDesignById = (id: string): UserDesign | undefined => {
  return userDesigns.find(d => d.id === id);
};




