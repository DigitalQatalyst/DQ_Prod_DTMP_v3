import { ArchitectureBlueprint } from './types';

export const architectureBlueprints: ArchitectureBlueprint[] = [
  {
    id: 'ARCH-001',
    title: 'Event-Driven Microservices Architecture',
    category: 'microservices',
    subcategory: 'Event-Driven Architecture',
    description: 'A comprehensive blueprint for building scalable, loosely-coupled microservices using event-driven patterns with asynchronous messaging.',
    longDescription: `# Event-Driven Microservices Architecture

## Overview
This blueprint provides a complete reference architecture for implementing microservices using event-driven patterns. Services communicate through asynchronous events rather than synchronous API calls, enabling better scalability, resilience, and loose coupling.

## Key Principles
- **Loose Coupling**: Services are independent and don't need to know about each other
- **Scalability**: Services can scale independently based on event volume
- **Resilience**: Failures in one service don't cascade to others
- **Auditability**: Event log provides complete audit trail`,
    
    author: {
      name: 'Enterprise Architecture Team',
      role: 'Lead Architects',
      organization: 'DTMP'
    },
    version: '2.1',
    lastUpdated: '2026-01-15T00:00:00Z',
    publishedDate: '2024-06-20T00:00:00Z',
    
    overview: 'Reference architecture for building event-driven microservices with Apache Kafka, implementing CQRS and event sourcing patterns.',
    
    useCases: [
      'Large-scale distributed systems requiring high throughput',
      'Systems requiring eventual consistency across services',
      'Complex business domains with multiple bounded contexts',
      'Applications requiring complete audit trail of state changes',
      'Systems with fluctuating load requiring independent scaling'
    ],
    
    benefits: [
      'Services can be developed, deployed, and scaled independently',
      'Natural alignment with Domain-Driven Design bounded contexts',
      'Built-in audit trail through event log',
      'Improved fault tolerance and resilience',
      'Enables event sourcing and CQRS patterns',
      'Simplified data replication and synchronization'
    ],
    
    considerations: [
      'Increased operational complexity (need to manage message broker)',
      'Eventual consistency can be challenging for some use cases',
      'Event schema evolution requires careful planning',
      'Debugging distributed flows can be complex',
      'Need robust monitoring and observability',
      'Initial learning curve for team'
    ],
    
    components: [
      {
        id: 'comp-001',
        name: 'Order Service',
        type: 'Microservice',
        description: 'Manages order lifecycle and publishes order events',
        responsibilities: [
          'Create and manage orders',
          'Publish OrderCreated, OrderUpdated, OrderCompleted events',
          'Maintain order state'
        ],
        interfaces: ['REST API', 'Kafka Producer'],
        dependencies: ['Kafka Broker', 'Order Database'],
        technology: 'Spring Boot, Kafka Client'
      },
      {
        id: 'comp-002',
        name: 'Inventory Service',
        type: 'Microservice',
        description: 'Manages inventory and consumes order events',
        responsibilities: [
          'Track inventory levels',
          'Reserve inventory on OrderCreated event',
          'Publish InventoryReserved, InventoryInsufficient events'
        ],
        interfaces: ['REST API', 'Kafka Consumer', 'Kafka Producer'],
        dependencies: ['Kafka Broker', 'Inventory Database']
      },
      {
        id: 'comp-003',
        name: 'Kafka Broker',
        type: 'Message Broker',
        description: 'Distributed event streaming platform',
        responsibilities: [
          'Store and distribute events',
          'Maintain event ordering per partition',
          'Provide event replay capabilities'
        ],
        interfaces: ['Kafka Protocol'],
        dependencies: ['Zookeeper'],
        technology: 'Apache Kafka'
      },
      {
        id: 'comp-004',
        name: 'API Gateway',
        type: 'Gateway',
        description: 'Single entry point for client applications',
        responsibilities: [
          'Route requests to appropriate services',
          'Handle authentication and authorization',
          'Rate limiting and throttling'
        ],
        interfaces: ['HTTP/HTTPS'],
        dependencies: ['Order Service', 'Inventory Service'],
        technology: 'Kong or AWS API Gateway'
      }
    ],
    
    integrationPoints: [
      'Kafka topics for inter-service communication',
      'REST APIs for synchronous queries',
      'Schema Registry for event schema management'
    ],
    
    technologyStack: {
      required: [
        'Apache Kafka (message broker)',
        'Schema Registry (Confluent or Apicurio)',
        'Container orchestration (Kubernetes)',
        'Service mesh (optional: Istio)'
      ],
      recommended: [
        'Spring Boot or Node.js for services',
        'MongoDB or PostgreSQL for databases',
        'Redis for caching',
        'Prometheus + Grafana for monitoring',
        'Jaeger or Zipkin for distributed tracing'
      ],
      alternatives: [
        { tech: 'Apache Kafka', alternative: 'RabbitMQ, AWS SNS/SQS, Azure Service Bus' },
        { tech: 'Kubernetes', alternative: 'AWS ECS, Docker Swarm' },
        { tech: 'Spring Boot', alternative: 'Node.js (Express), .NET Core, Go' }
      ]
    },
    
    diagrams: {
      conceptual: '/diagrams/arch-001/conceptual.png',
      logical: '/diagrams/arch-001/logical.png',
      physical: '/diagrams/arch-001/physical.png',
      sequence: [
        '/diagrams/arch-001/order-creation-sequence.png',
        '/diagrams/arch-001/inventory-reservation-sequence.png'
      ]
    },
    
    referenceImplementation: {
      githubUrl: 'https://github.com/dtmp/event-driven-microservices-ref',
      documentation: 'https://docs.dtmp.com/blueprints/arch-001',
      demoUrl: 'https://demo.dtmp.com/event-driven-microservices'
    },
    
    complexity: 'advanced',
    estimatedEffort: '8-12 weeks',
    teamSize: '5-8 engineers',
    
    relatedBlueprints: ['ARCH-002', 'ARCH-005'],
    relatedPatterns: ['PTRN-012', 'PTRN-023', 'PTRN-034'],
    prerequisites: [
      'Understanding of microservices architecture',
      'Knowledge of Domain-Driven Design',
      'Experience with message brokers',
      'Familiarity with eventual consistency'
    ],
    
    downloads: 1247,
    views: 8934,
    rating: 4.7,
    reviewCount: 89,
    usageCount: 34,
    
    tags: ['microservices', 'event-driven', 'kafka', 'async', 'cqrs', 'event-sourcing', 'distributed-systems'],
    industryVerticals: ['Financial Services', 'E-commerce', 'Logistics', 'Healthcare'],
    
    status: 'approved',
    approvedBy: 'Chief Architect',
    approvalDate: '2024-06-18T00:00:00Z'
  },
  {
    id: 'ARCH-002',
    title: 'Cloud-Native Serverless Architecture',
    category: 'cloud',
    subcategory: 'Serverless Computing',
    description: 'Reference architecture for building serverless applications using AWS Lambda, Azure Functions, or Google Cloud Functions.',
    longDescription: `# Cloud-Native Serverless Architecture

## Overview
This blueprint provides a complete reference for building serverless applications that automatically scale and only pay for what you use.`,
    
    author: {
      name: 'Cloud Architecture Team',
      role: 'Cloud Architects',
      organization: 'DTMP'
    },
    version: '1.5',
    lastUpdated: '2026-01-10T00:00:00Z',
    publishedDate: '2024-08-15T00:00:00Z',
    
    overview: 'Serverless architecture blueprint using Function-as-a-Service (FaaS) for event-driven compute.',
    
    useCases: [
      'Event-driven processing workloads',
      'API backends with variable traffic',
      'Data processing pipelines',
      'Scheduled tasks and cron jobs',
      'Real-time file processing'
    ],
    
    benefits: [
      'No server management required',
      'Automatic scaling',
      'Pay-per-use pricing model',
      'Built-in high availability',
      'Faster time to market',
      'Reduced operational overhead'
    ],
    
    considerations: [
      'Cold start latency for infrequent invocations',
      'Vendor lock-in concerns',
      'Debugging can be more challenging',
      'Limited execution time (typically 15 minutes max)',
      'State management requires external services',
      'Cost can be unpredictable at scale'
    ],
    
    components: [
      {
        id: 'comp-sls-001',
        name: 'API Gateway',
        type: 'Gateway',
        description: 'Entry point for HTTP requests',
        responsibilities: ['Route requests', 'Handle authentication', 'Rate limiting'],
        interfaces: ['HTTP/HTTPS'],
        dependencies: [],
        technology: 'AWS API Gateway, Azure API Management'
      },
      {
        id: 'comp-sls-002',
        name: 'Function Handler',
        type: 'Function',
        description: 'Serverless function executing business logic',
        responsibilities: ['Process requests', 'Execute business logic', 'Return responses'],
        interfaces: ['HTTP', 'Event Triggers'],
        dependencies: ['Database', 'Message Queue'],
        technology: 'AWS Lambda, Azure Functions, Google Cloud Functions'
      }
    ],
    
    integrationPoints: [
      'API Gateway for HTTP endpoints',
      'Event sources (S3, SQS, EventBridge)',
      'Database connections',
      'External service APIs'
    ],
    
    technologyStack: {
      required: [
        'Function-as-a-Service platform',
        'API Gateway',
        'Cloud storage (S3, Blob Storage)',
        'Managed database service'
      ],
      recommended: [
        'Event streaming service',
        'Secrets management',
        'Monitoring and logging',
        'CI/CD pipeline'
      ],
      alternatives: [
        { tech: 'AWS Lambda', alternative: 'Azure Functions, Google Cloud Functions' },
        { tech: 'DynamoDB', alternative: 'Cosmos DB, Firestore' }
      ]
    },
    
    diagrams: {
      conceptual: '/diagrams/arch-002/conceptual.png',
      logical: '/diagrams/arch-002/logical.png'
    },
    
    referenceImplementation: {
      githubUrl: 'https://github.com/dtmp/serverless-ref',
      documentation: 'https://docs.dtmp.com/blueprints/arch-002'
    },
    
    complexity: 'intermediate',
    estimatedEffort: '4-6 weeks',
    teamSize: '2-4 engineers',
    
    relatedBlueprints: ['ARCH-001', 'ARCH-003'],
    relatedPatterns: ['PTRN-008', 'PTRN-015'],
    prerequisites: [
      'Cloud platform familiarity',
      'Understanding of event-driven architecture',
      'Knowledge of stateless design'
    ],
    
    downloads: 892,
    views: 5234,
    rating: 4.5,
    reviewCount: 56,
    usageCount: 22,
    
    tags: ['serverless', 'cloud-native', 'faas', 'aws', 'azure', 'scalable'],
    industryVerticals: ['Technology', 'E-commerce', 'Media', 'Startups'],
    
    status: 'approved',
    approvedBy: 'Cloud Architect',
    approvalDate: '2024-08-12T00:00:00Z'
  },
  {
    id: 'ARCH-008',
    title: 'Zero-Trust Network Security Architecture',
    category: 'security',
    subcategory: 'Zero-Trust Architecture',
    description: 'Comprehensive security blueprint implementing zero-trust principles: never trust, always verify, assume breach.',
    longDescription: `# Zero-Trust Network Security Architecture

## Overview
Zero-trust security model eliminates implicit trust and continuously validates every transaction. This blueprint provides a complete reference for implementing zero-trust across identity, devices, networks, applications, and data.

## Core Principles
1. **Verify explicitly**: Always authenticate and authorize based on all available data points
2. **Use least privilege access**: Limit user access with Just-In-Time and Just-Enough-Access (JIT/JEA)
3. **Assume breach**: Minimize blast radius and segment access`,
    
    author: {
      name: 'Security Architecture Team',
      role: 'Security Architects',
      organization: 'DTMP'
    },
    version: '1.3',
    lastUpdated: '2026-01-20T00:00:00Z',
    publishedDate: '2025-03-10T00:00:00Z',
    
    overview: 'Reference architecture for zero-trust security implementing identity-based access, micro-segmentation, and continuous verification.',
    
    useCases: [
      'Organizations moving to cloud and hybrid environments',
      'Companies with remote workforce requiring secure access',
      'Highly regulated industries (finance, healthcare, government)',
      'Organizations that have experienced security breaches',
      'Environments requiring strict data access controls'
    ],
    
    benefits: [
      'Reduced attack surface and lateral movement',
      'Improved visibility into access patterns and threats',
      'Better compliance with security regulations',
      'Supports modern hybrid and multi-cloud environments',
      'Enables secure remote access without VPN complexity',
      'Granular access control at identity level'
    ],
    
    considerations: [
      'Significant upfront investment in identity infrastructure',
      'Cultural shift required from perimeter-based security',
      'Complex initial setup and configuration',
      'Ongoing management of access policies',
      'Potential user friction if not implemented thoughtfully',
      'Requires strong identity and access management (IAM)'
    ],
    
    components: [
      {
        id: 'comp-sec-001',
        name: 'Identity Provider (IdP)',
        type: 'Service',
        description: 'Centralized identity and authentication service',
        responsibilities: [
          'Authenticate users and devices',
          'Issue and validate tokens',
          'Enforce MFA policies',
          'Maintain user and device inventory'
        ],
        interfaces: ['SAML 2.0', 'OAuth 2.0', 'OpenID Connect'],
        dependencies: [],
        technology: 'Azure AD, Okta, or Auth0'
      },
      {
        id: 'comp-sec-002',
        name: 'Zero-Trust Access Gateway',
        type: 'Gateway',
        description: 'Policy enforcement point for all access requests',
        responsibilities: [
          'Evaluate access policies based on context',
          'Enforce least-privilege access',
          'Log all access attempts',
          'Terminate connections on policy violations'
        ],
        interfaces: ['HTTP/HTTPS Proxy'],
        dependencies: ['Identity Provider', 'Policy Engine'],
        technology: 'Zscaler, Cloudflare Access, or Palo Alto Prisma'
      }
    ],
    
    integrationPoints: [
      'Integration with existing Active Directory/LDAP',
      'SIEM integration for security monitoring',
      'Endpoint management systems (MDM/UEM)',
      'Cloud provider security services'
    ],
    
    technologyStack: {
      required: [
        'Identity Provider (Azure AD, Okta)',
        'Zero-Trust Network Access (ZTNA) solution',
        'Multi-Factor Authentication (MFA)',
        'Endpoint Detection and Response (EDR)',
        'Security Information and Event Management (SIEM)'
      ],
      recommended: [
        'Cloud Access Security Broker (CASB)',
        'Data Loss Prevention (DLP)',
        'Privileged Access Management (PAM)',
        'Network micro-segmentation tools'
      ],
      alternatives: [
        { tech: 'Azure AD', alternative: 'Okta, Auth0, Ping Identity' },
        { tech: 'Zscaler', alternative: 'Cloudflare Access, Palo Alto Prisma' }
      ]
    },
    
    diagrams: {
      conceptual: '/diagrams/arch-008/zero-trust-conceptual.png',
      logical: '/diagrams/arch-008/zero-trust-logical.png',
      physical: '/diagrams/arch-008/zero-trust-deployment.png'
    },
    
    referenceImplementation: {
      githubUrl: 'https://github.com/dtmp/zero-trust-ref',
      documentation: 'https://docs.dtmp.com/blueprints/arch-008'
    },
    
    complexity: 'expert',
    estimatedEffort: '16-24 weeks',
    teamSize: '4-6 security engineers',
    
    relatedBlueprints: ['ARCH-009', 'ARCH-010'],
    relatedPatterns: ['PTRN-045', 'PTRN-056'],
    prerequisites: [
      'Strong understanding of identity and access management',
      'Network security fundamentals',
      'Cloud security concepts',
      'Experience with security policy management'
    ],
    
    downloads: 892,
    views: 5621,
    rating: 4.9,
    reviewCount: 67,
    usageCount: 28,
    
    tags: ['security', 'zero-trust', 'identity', 'iam', 'network-security', 'cloud-security'],
    industryVerticals: ['Financial Services', 'Healthcare', 'Government', 'Technology'],
    
    status: 'approved',
    approvedBy: 'CISO',
    approvalDate: '2025-03-08T00:00:00Z'
  }
];

// Add more blueprints to reach 15-20 total
architectureBlueprints.push(
  {
    id: 'ARCH-003',
    title: 'Data Mesh Architecture',
    category: 'data',
    subcategory: 'Data Architecture',
    description: 'Decentralized data architecture pattern for scaling data analytics across organizational domains.',
    longDescription: '# Data Mesh Architecture\n\nDecentralized approach to data management.',
    author: { name: 'Data Architecture Team', role: 'Data Architects', organization: 'DTMP' },
    version: '1.2',
    lastUpdated: '2026-01-18T00:00:00Z',
    publishedDate: '2024-09-10T00:00:00Z',
    overview: 'Data mesh architecture for domain-oriented data ownership.',
    useCases: ['Large organizations with multiple data domains', 'Scaling data analytics', 'Federated data governance'],
    benefits: ['Domain ownership', 'Scalability', 'Faster data access'],
    considerations: ['Requires cultural change', 'Complex governance', 'Initial setup effort'],
    components: [{ id: 'comp-dm-001', name: 'Data Product', type: 'Service', description: 'Domain-owned data product', responsibilities: ['Provide data', 'Maintain quality'], interfaces: ['API'], dependencies: [] }],
    integrationPoints: ['Domain APIs', 'Data catalog', 'Governance layer'],
    technologyStack: { required: ['Data catalog', 'API gateway'], recommended: ['Kubernetes', 'Data quality tools'], alternatives: [] },
    diagrams: {},
    complexity: 'advanced',
    estimatedEffort: '12-16 weeks',
    teamSize: '6-10 engineers',
    relatedBlueprints: [],
    relatedPatterns: [],
    prerequisites: ['Data architecture knowledge', 'Domain-driven design'],
    downloads: 654,
    views: 3421,
    rating: 4.4,
    reviewCount: 45,
    usageCount: 18,
    tags: ['data-mesh', 'data-architecture', 'decentralized', 'analytics'],
    industryVerticals: ['Financial Services', 'Retail', 'Technology'],
    status: 'approved',
    approvedBy: 'Chief Data Architect',
    approvalDate: '2024-09-08T00:00:00Z'
  },
  {
    id: 'ARCH-004',
    title: 'API-First Integration Architecture',
    category: 'integration',
    subcategory: 'API Integration',
    description: 'Comprehensive API-first architecture for modern system integration.',
    longDescription: '# API-First Integration Architecture\n\nDesign APIs first, then build implementations.',
    author: { name: 'Integration Team', role: 'Integration Architects', organization: 'DTMP' },
    version: '2.0',
    lastUpdated: '2026-01-12T00:00:00Z',
    publishedDate: '2024-07-15T00:00:00Z',
    overview: 'API-first approach to system integration.',
    useCases: ['Microservices integration', 'Third-party integrations', 'Mobile backend'],
    benefits: ['Contract-first design', 'Better documentation', 'Easier testing'],
    considerations: ['API versioning complexity', 'Performance overhead', 'Security considerations'],
    components: [{ id: 'comp-api-001', name: 'API Gateway', type: 'Gateway', description: 'Central API entry point', responsibilities: ['Route requests', 'Handle auth'], interfaces: ['REST', 'GraphQL'], dependencies: [] }],
    integrationPoints: ['REST APIs', 'GraphQL endpoints', 'Event streams'],
    technologyStack: { required: ['API Gateway', 'API documentation'], recommended: ['API testing tools'], alternatives: [] },
    diagrams: {},
    complexity: 'intermediate',
    estimatedEffort: '6-8 weeks',
    teamSize: '3-5 engineers',
    relatedBlueprints: ['ARCH-001'],
    relatedPatterns: [],
    prerequisites: ['REST API knowledge', 'API design principles'],
    downloads: 1123,
    views: 6789,
    rating: 4.6,
    reviewCount: 78,
    usageCount: 42,
    tags: ['api', 'integration', 'rest', 'graphql', 'microservices'],
    industryVerticals: ['Technology', 'E-commerce', 'Financial Services'],
    status: 'approved',
    approvedBy: 'Integration Architect',
    approvalDate: '2024-07-12T00:00:00Z'
  }
);

export const getBlueprintById = (id: string): ArchitectureBlueprint | undefined => {
  return architectureBlueprints.find(bp => bp.id === id);
};

export const getBlueprintsByCategory = (category: ArchitectureBlueprint['category']): ArchitectureBlueprint[] => {
  return architectureBlueprints.filter(bp => bp.category === category);
};

