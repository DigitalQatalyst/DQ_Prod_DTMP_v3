import type { SolutionType } from './solutionSpecs';

export interface SolutionBuild {
  id: string;
  title: string;
  description: string;
  solutionType: SolutionType;
  buildComplexity: 'basic' | 'intermediate' | 'advanced';
  technologyStack: string[];
  automationLevel: 'manual' | 'semi-automated' | 'fully-automated';
  codeSamples: boolean;
  tags: string[];
  lastUpdated: string;
  author: string;
  repositoryUrl?: string;
}

export const solutionBuilds: SolutionBuild[] = [
  {
    id: "microservices-deployment",
    title: "Microservices Platform Deployment",
    description: "Deploy microservices on Kubernetes with service mesh, container orchestration, and comprehensive DevOps tooling.",
    solutionType: "DBP",
    buildComplexity: "advanced",
    technologyStack: ["Kubernetes", "Helm", "ArgoCD", "Terraform", "Jenkins"],
    automationLevel: "fully-automated",
    codeSamples: true,
    tags: ["Microservices", "Kubernetes", "CI/CD", "DevOps", "Containers"],
    lastUpdated: "2026-01-15",
    author: "Platform Engineering Team",
    repositoryUrl: "https://github.com/example/microservices-deployment"
  },
  {
    id: "api-gateway-implementation",
    title: "API Gateway Implementation",
    description: "Enterprise API gateway with Kong, including security policies, rate limiting, and observability integration.",
    solutionType: "DBP",
    buildComplexity: "intermediate",
    technologyStack: ["Kong", "Kubernetes", "OAuth2", "Prometheus", "Grafana"],
    automationLevel: "semi-automated",
    codeSamples: true,
    tags: ["API Gateway", "Security", "Monitoring", "Kong"],
    lastUpdated: "2026-01-14",
    author: "Integration Architecture Team",
    repositoryUrl: "https://github.com/example/api-gateway-kong"
  },
  {
    id: "data-platform-build",
    title: "Modern Data Platform",
    description: "Lakehouse architecture on cloud with data lake, warehouse, governance, and analytics capabilities.",
    solutionType: "DIA",
    buildComplexity: "advanced",
    technologyStack: ["S3", "Glue", "Athena", "Redshift", "Databricks"],
    automationLevel: "semi-automated",
    codeSamples: true,
    tags: ["Data Lake", "Analytics", "AWS", "Lakehouse", "ETL"],
    lastUpdated: "2026-01-13",
    author: "Data Platform Team",
    repositoryUrl: "https://github.com/example/data-platform"
  },
  {
    id: "ci-cd-pipeline-setup",
    title: "Enterprise CI/CD Pipeline Setup",
    description: "Automated build, test, and deployment pipeline implementation with multi-cloud support and comprehensive testing.",
    solutionType: "SDO",
    buildComplexity: "intermediate",
    technologyStack: ["Jenkins", "GitLab CI", "Docker", "Kubernetes", "Helm"],
    automationLevel: "fully-automated",
    codeSamples: true,
    tags: ["CI/CD", "DevOps", "Automation", "Testing"],
    lastUpdated: "2026-01-12",
    author: "DevOps Team",
    repositoryUrl: "https://github.com/example/cicd-pipeline"
  },
  {
    id: "customer-data-platform-build",
    title: "Customer Data Platform Implementation",
    description: "Build unified customer profile system with real-time data integration, analytics, and personalization capabilities.",
    solutionType: "DXP",
    buildComplexity: "advanced",
    technologyStack: ["Kafka", "Elasticsearch", "MongoDB", "Spark", "API Gateway"],
    automationLevel: "semi-automated",
    codeSamples: true,
    tags: ["CDP", "Real-time", "Customer Data", "Analytics"],
    lastUpdated: "2026-01-11",
    author: "Customer Experience Team",
    repositoryUrl: "https://github.com/example/cdp-platform"
  },
  {
    id: "iam-platform-setup",
    title: "Identity & Access Management Platform Setup",
    description: "Complete IAM platform deployment with SSO, MFA, identity governance, and comprehensive access control.",
    solutionType: "SDO",
    buildComplexity: "intermediate",
    technologyStack: ["Azure AD", "Okta", "SAML", "OAuth2", "LDAP"],
    automationLevel: "semi-automated",
    codeSamples: true,
    tags: ["IAM", "Security", "SSO", "MFA", "Identity"],
    lastUpdated: "2026-01-10",
    author: "Security Architecture Team"
  },
  {
    id: "observability-stack-deploy",
    title: "Full-Stack Observability Deployment",
    description: "Deploy comprehensive monitoring, logging, and tracing solution with real-time alerting and dashboards.",
    solutionType: "SDO",
    buildComplexity: "intermediate",
    technologyStack: ["Prometheus", "Grafana", "Loki", "Jaeger", "Alertmanager"],
    automationLevel: "semi-automated",
    codeSamples: true,
    tags: ["Monitoring", "Logging", "Tracing", "Observability"],
    lastUpdated: "2026-01-09",
    author: "Platform Engineering Team",
    repositoryUrl: "https://github.com/example/observability-stack"
  },
  {
    id: "event-streaming-platform-build",
    title: "Event Streaming Platform",
    description: "Kafka-based event streaming architecture with schema registry, stream processing, and monitoring.",
    solutionType: "DBP",
    buildComplexity: "advanced",
    technologyStack: ["Kafka", "Schema Registry", "Kafka Connect", "KSQL", "Monitoring"],
    automationLevel: "semi-automated",
    codeSamples: true,
    tags: ["Kafka", "Event Streaming", "Real-time", "Integration"],
    lastUpdated: "2026-01-08",
    author: "Integration Architecture Team",
    repositoryUrl: "https://github.com/example/kafka-platform"
  },
  {
    id: "mobile-backend-deployment",
    title: "Mobile Backend Services",
    description: "Scalable mobile backend with push notifications, analytics, offline sync, and cross-platform support.",
    solutionType: "DXP",
    buildComplexity: "intermediate",
    technologyStack: ["API Gateway", "Lambda", "DynamoDB", "SNS", "Cognito"],
    automationLevel: "semi-automated",
    codeSamples: true,
    tags: ["Mobile", "Serverless", "AWS", "Backend"],
    lastUpdated: "2026-01-07",
    author: "Mobile Architecture Team",
    repositoryUrl: "https://github.com/example/mobile-backend"
  },
  {
    id: "service-mesh-deployment",
    title: "Service Mesh Deployment",
    description: "Istio service mesh on Kubernetes cluster with traffic management, security, and observability.",
    solutionType: "SDO",
    buildComplexity: "advanced",
    technologyStack: ["Istio", "Envoy", "Kiali", "Jaeger", "Prometheus"],
    automationLevel: "semi-automated",
    codeSamples: true,
    tags: ["Service Mesh", "Istio", "Microservices", "Security"],
    lastUpdated: "2026-01-06",
    author: "Platform Engineering Team",
    repositoryUrl: "https://github.com/example/istio-deployment"
  },
  {
    id: "ml-platform-setup",
    title: "Machine Learning Platform Setup",
    description: "Build end-to-end ML platform with MLOps capabilities, model registry, feature store, and automated deployment.",
    solutionType: "DIA",
    buildComplexity: "advanced",
    technologyStack: ["Kubeflow", "MLflow", "Airflow", "Feature Store", "Model Registry"],
    automationLevel: "semi-automated",
    codeSamples: true,
    tags: ["ML", "MLOps", "AI", "Data Science"],
    lastUpdated: "2026-01-05",
    author: "AI/ML Team",
    repositoryUrl: "https://github.com/example/ml-platform"
  },
  {
    id: "collaboration-platform-deploy",
    title: "Digital Workplace Hub",
    description: "Integrated collaboration and productivity platform with Microsoft 365, Teams, and Power Platform.",
    solutionType: "DWS",
    buildComplexity: "basic",
    technologyStack: ["Microsoft 365", "Teams", "SharePoint", "Azure AD", "Power Platform"],
    automationLevel: "manual",
    codeSamples: false,
    tags: ["Collaboration", "Microsoft 365", "Workplace", "Productivity"],
    lastUpdated: "2026-01-04",
    author: "Digital Workplace Team"
  },
  {
    id: "zero-trust-implementation",
    title: "Zero Trust Security Implementation",
    description: "Implement zero trust network architecture with identity-centric controls, micro-segmentation, and continuous verification.",
    solutionType: "SDO",
    buildComplexity: "advanced",
    technologyStack: ["ZTNA", "SDP", "Microsegmentation", "Identity Verification", "SIEM"],
    automationLevel: "semi-automated",
    codeSamples: true,
    tags: ["Zero Trust", "Security", "Network", "Identity"],
    lastUpdated: "2026-01-03",
    author: "Security Architecture Team",
    repositoryUrl: "https://github.com/example/zero-trust"
  },
  {
    id: "chatbot-platform-build",
    title: "Conversational AI Platform",
    description: "Enterprise chatbot platform with NLP, intent recognition, dialog management, and multi-channel support.",
    solutionType: "DXP",
    buildComplexity: "advanced",
    technologyStack: ["Dialogflow", "Cloud Functions", "Firestore", "NLP", "Analytics"],
    automationLevel: "semi-automated",
    codeSamples: true,
    tags: ["Chatbot", "AI", "NLP", "Conversational AI"],
    lastUpdated: "2026-01-02",
    author: "Digital Experience Team",
    repositoryUrl: "https://github.com/example/chatbot-platform"
  }
];
