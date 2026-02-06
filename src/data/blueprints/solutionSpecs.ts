export type SolutionType = 'DBP' | 'DXP' | 'DWS' | 'DIA' | 'SDO';

export interface SolutionSpec {
  id: string;
  title: string;
  description: string;
  solutionType: SolutionType;
  scope: 'enterprise' | 'departmental' | 'project';
  maturityLevel: 'conceptual' | 'proven' | 'reference';
  diagramCount: number;
  componentCount: number;
  tags: string[];
  lastUpdated: string;
  author: string;
  downloadUrl?: string;
}

export const solutionSpecs: SolutionSpec[] = [
  {
    id: "dbp-reference-architecture",
    title: "DBP Reference Architecture",
    description: "Complete enterprise reference architecture for Digital Business Platform with 12 capability domains covering integration, APIs, microservices, and business process management.",
    solutionType: "DBP",
    scope: "enterprise",
    maturityLevel: "reference",
    diagramCount: 5,
    componentCount: 45,
    tags: ["Microservices", "API Gateway", "Event Bus", "Data Mesh", "Cloud Native", "Multi-Cloud", "Cross-Industry"],
    lastUpdated: "2026-01-15",
    author: "Enterprise Architecture Team",
    downloadUrl: "/downloads/dbp-reference-architecture.pdf"
  },
  {
    id: "customer-360-platform",
    title: "Customer 360 Platform",
    description: "Unified customer data platform with real-time profile aggregation, analytics, and personalization capabilities across all customer touchpoints.",
    solutionType: "DXP",
    scope: "departmental",
    maturityLevel: "proven",
    diagramCount: 4,
    componentCount: 18,
    tags: ["CDP", "Real-time Analytics", "API Layer", "Data Lake", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2026-01-10",
    author: "Customer Experience Team"
  },
  {
    id: "omnichannel-experience-platform",
    title: "Omnichannel Experience Platform",
    description: "Seamless customer experience across web, mobile, in-store, and contact center touchpoints with unified journey orchestration.",
    solutionType: "DXP",
    scope: "project",
    maturityLevel: "proven",
    diagramCount: 3,
    componentCount: 22,
    tags: ["Headless CMS", "Mobile Backend", "POS Integration", "Journey Orchestration", "Hybrid", "Retail"],
    lastUpdated: "2026-01-08",
    author: "Digital Experience Team"
  },
  {
    id: "digital-workplace-hub",
    title: "Digital Workplace Hub",
    description: "Integrated employee experience platform with collaboration, productivity tools, and knowledge management for modern workforce.",
    solutionType: "DWS",
    scope: "departmental",
    maturityLevel: "proven",
    diagramCount: 3,
    componentCount: 15,
    tags: ["Microsoft 365", "Collaboration Tools", "Intranet", "Knowledge Graph", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2026-01-12",
    author: "Digital Workplace Team"
  },
  {
    id: "enterprise-data-platform",
    title: "Enterprise Data Platform",
    description: "Comprehensive data platform with data lake, warehouse, governance, and analytics capabilities for enterprise-wide data management.",
    solutionType: "DIA",
    scope: "enterprise",
    maturityLevel: "reference",
    diagramCount: 6,
    componentCount: 32,
    tags: ["Data Lake", "Data Warehouse", "Data Catalog", "ETL", "Governance", "Multi-Cloud", "Cross-Industry"],
    lastUpdated: "2026-01-14",
    author: "Data Architecture Team",
    downloadUrl: "/downloads/enterprise-data-platform.pdf"
  },
  {
    id: "api-gateway-architecture",
    title: "API Gateway Architecture",
    description: "Enterprise API management platform with gateway, developer portal, analytics, and comprehensive API lifecycle management.",
    solutionType: "DBP",
    scope: "project",
    maturityLevel: "proven",
    diagramCount: 3,
    componentCount: 12,
    tags: ["API Gateway", "Developer Portal", "Rate Limiting", "Analytics", "Hybrid", "Cross-Industry"],
    lastUpdated: "2026-01-09",
    author: "Integration Architecture Team"
  },
  {
    id: "microservices-platform",
    title: "Microservices Platform",
    description: "Cloud-native microservices architecture with service mesh, container orchestration, and comprehensive DevOps tooling.",
    solutionType: "DBP",
    scope: "departmental",
    maturityLevel: "reference",
    diagramCount: 5,
    componentCount: 28,
    tags: ["Kubernetes", "Service Mesh", "Docker", "CI/CD", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2026-01-11",
    author: "Platform Engineering Team",
    downloadUrl: "/downloads/microservices-platform.pdf"
  },
  {
    id: "identity-access-management",
    title: "Identity & Access Management",
    description: "Enterprise IAM platform with SSO, MFA, identity governance, and comprehensive access control across all systems.",
    solutionType: "SDO",
    scope: "project",
    maturityLevel: "proven",
    diagramCount: 4,
    componentCount: 14,
    tags: ["SSO", "MFA", "RBAC", "Identity Governance", "Hybrid", "Cross-Industry"],
    lastUpdated: "2026-01-07",
    author: "Security Architecture Team"
  },
  {
    id: "data-governance-platform",
    title: "Data Governance Platform",
    description: "Comprehensive data governance with data quality, lineage, cataloging, and compliance management for enterprise data assets.",
    solutionType: "DIA",
    scope: "project",
    maturityLevel: "reference",
    diagramCount: 4,
    componentCount: 16,
    tags: ["Data Catalog", "Data Quality", "Lineage", "Compliance", "Hybrid", "Financial Services"],
    lastUpdated: "2026-01-06",
    author: "Data Governance Team"
  },
  {
    id: "event-driven-architecture",
    title: "Event-Driven Architecture",
    description: "Scalable event-driven system with event streaming, processing, choreography, and real-time data integration.",
    solutionType: "DBP",
    scope: "departmental",
    maturityLevel: "reference",
    diagramCount: 4,
    componentCount: 16,
    tags: ["Kafka", "Event Store", "CQRS", "Saga Pattern", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2026-01-13",
    author: "Integration Architecture Team"
  },
  {
    id: "mobile-experience-platform",
    title: "Mobile Experience Platform",
    description: "Comprehensive mobile backend platform with offline sync, push notifications, analytics, and cross-platform support.",
    solutionType: "DXP",
    scope: "project",
    maturityLevel: "proven",
    diagramCount: 3,
    componentCount: 14,
    tags: ["GraphQL", "Offline Sync", "Push Notifications", "Analytics", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2026-01-05",
    author: "Mobile Architecture Team"
  },
  {
    id: "ai-ml-platform",
    title: "AI/ML Platform",
    description: "End-to-end machine learning platform with MLOps, model registry, feature store, and automated deployment capabilities.",
    solutionType: "DIA",
    scope: "project",
    maturityLevel: "reference",
    diagramCount: 5,
    componentCount: 20,
    tags: ["MLOps", "Feature Store", "Model Registry", "Kubernetes", "GPU Compute", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2026-01-15",
    author: "AI/ML Team",
    downloadUrl: "/downloads/ai-ml-platform.pdf"
  },
  {
    id: "iot-platform",
    title: "IoT Platform",
    description: "Industrial IoT platform with device management, data ingestion, edge computing, and real-time analytics for connected devices.",
    solutionType: "DIA",
    scope: "project",
    maturityLevel: "reference",
    diagramCount: 5,
    componentCount: 24,
    tags: ["MQTT", "Edge Computing", "Time Series DB", "Device Management", "Hybrid", "Manufacturing"],
    lastUpdated: "2026-01-04",
    author: "IoT Architecture Team"
  },
  {
    id: "headless-cms",
    title: "Headless CMS",
    description: "Modern headless content management system with multi-channel delivery, personalization, and digital asset management.",
    solutionType: "DXP",
    scope: "project",
    maturityLevel: "proven",
    diagramCount: 3,
    componentCount: 10,
    tags: ["Headless CMS", "CDN", "Personalization", "DAM", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2026-01-03",
    author: "Content Architecture Team"
  },
  {
    id: "zero-trust-security",
    title: "Zero Trust Security",
    description: "Comprehensive zero trust security architecture with identity-centric access control, micro-segmentation, and continuous verification.",
    solutionType: "SDO",
    scope: "enterprise",
    maturityLevel: "reference",
    diagramCount: 6,
    componentCount: 25,
    tags: ["Identity Provider", "Policy Engine", "Micro-segmentation", "SIEM", "Multi-Cloud", "Cross-Industry"],
    lastUpdated: "2026-01-02",
    author: "Security Architecture Team",
    downloadUrl: "/downloads/zero-trust-security.pdf"
  },
  {
    id: "real-time-analytics",
    title: "Real-Time Analytics",
    description: "Stream processing platform for real-time analytics, event processing, and instant insights from streaming data sources.",
    solutionType: "DIA",
    scope: "project",
    maturityLevel: "reference",
    diagramCount: 4,
    componentCount: 14,
    tags: ["Kafka Streams", "Flink", "Real-time Processing", "Stream SQL", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2026-01-01",
    author: "Data Architecture Team"
  },
  {
    id: "collaboration-platform",
    title: "Collaboration Platform",
    description: "Unified collaboration suite with real-time messaging, video conferencing, document collaboration, and team workspaces.",
    solutionType: "DWS",
    scope: "project",
    maturityLevel: "proven",
    diagramCount: 3,
    componentCount: 12,
    tags: ["Real-time Messaging", "Video Conferencing", "Document Collab", "Presence", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2025-12-30",
    author: "Digital Workplace Team"
  },
  {
    id: "service-mesh",
    title: "Service Mesh",
    description: "Microservices communication layer with traffic management, security, observability, and resilience patterns.",
    solutionType: "DBP",
    scope: "project",
    maturityLevel: "reference",
    diagramCount: 4,
    componentCount: 10,
    tags: ["Istio", "Envoy", "mTLS", "Traffic Management", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2025-12-29",
    author: "Platform Engineering Team"
  },
  {
    id: "personalization-engine",
    title: "Personalization Engine",
    description: "AI-powered personalization with ML-driven recommendations, A/B testing, and real-time content optimization.",
    solutionType: "DXP",
    scope: "project",
    maturityLevel: "reference",
    diagramCount: 3,
    componentCount: 8,
    tags: ["ML Models", "Real-time Processing", "A/B Testing", "Recommendation Engine", "Cloud-Native", "Retail"],
    lastUpdated: "2025-12-28",
    author: "Digital Experience Team"
  },
  {
    id: "enterprise-search",
    title: "Enterprise Search",
    description: "Unified search platform across all enterprise content with AI-powered relevance, federated search, and NLP capabilities.",
    solutionType: "DWS",
    scope: "project",
    maturityLevel: "proven",
    diagramCount: 3,
    componentCount: 9,
    tags: ["Elasticsearch", "NLP", "Federated Search", "Relevance Tuning", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2025-12-27",
    author: "Digital Workplace Team"
  },
  {
    id: "observability-platform",
    title: "Observability Platform",
    description: "Full-stack observability with monitoring, logging, distributed tracing, and intelligent alerting for complex systems.",
    solutionType: "SDO",
    scope: "project",
    maturityLevel: "reference",
    diagramCount: 4,
    componentCount: 15,
    tags: ["Prometheus", "Grafana", "Jaeger", "ELK Stack", "Multi-Cloud", "Cross-Industry"],
    lastUpdated: "2025-12-26",
    author: "Platform Engineering Team"
  },
  {
    id: "blockchain-platform",
    title: "Blockchain Platform",
    description: "Enterprise blockchain platform for supply chain, smart contracts, and asset tracking with permissioned distributed ledger.",
    solutionType: "DBP",
    scope: "project",
    maturityLevel: "conceptual",
    diagramCount: 4,
    componentCount: 12,
    tags: ["Hyperledger", "Smart Contracts", "Consensus", "Distributed Ledger", "Hybrid", "Financial Services"],
    lastUpdated: "2025-12-25",
    author: "Blockchain Architecture Team"
  },
  {
    id: "low-code-platform",
    title: "Low-Code Platform",
    description: "Enterprise low-code development platform with visual builders, workflow automation, and rapid application development.",
    solutionType: "DWS",
    scope: "project",
    maturityLevel: "proven",
    diagramCount: 3,
    componentCount: 13,
    tags: ["BPMN", "RPA", "Low-code", "Process Mining", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2025-12-24",
    author: "Digital Workplace Team"
  },
  {
    id: "conversational-ai",
    title: "Conversational AI",
    description: "AI chatbot and virtual assistant platform with NLP, intent recognition, dialog management, and multi-channel support.",
    solutionType: "DXP",
    scope: "project",
    maturityLevel: "reference",
    diagramCount: 4,
    componentCount: 12,
    tags: ["NLP", "Intent Recognition", "Dialog Management", "Multi-channel", "Cloud-Native", "Cross-Industry"],
    lastUpdated: "2025-12-23",
    author: "Digital Experience Team"
  },
  {
    id: "backup-disaster-recovery",
    title: "Backup & Disaster Recovery",
    description: "Enterprise backup and disaster recovery solution with automated backups, replication, and business continuity planning.",
    solutionType: "SDO",
    scope: "project",
    maturityLevel: "proven",
    diagramCount: 3,
    componentCount: 11,
    tags: ["Backup Automation", "Replication", "Recovery Orchestration", "RPO/RTO", "Multi-Cloud", "Cross-Industry"],
    lastUpdated: "2025-12-22",
    author: "Infrastructure Team"
  }
];
