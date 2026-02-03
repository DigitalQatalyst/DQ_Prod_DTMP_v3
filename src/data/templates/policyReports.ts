export interface PolicyReport {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  policyType: string;
  compliance: string | null;
  pageLength: string;
  outputFormats: string[];
  aiGeneration: string;
  complexity: string;
  specialFeature: string;
  usageCount: number;
}

export const policyReports: PolicyReport[] = [
  {
    id: "api-governance-policy",
    title: "API Governance Policy",
    description: "Comprehensive policy for API design, deployment, and lifecycle management",
    icon: "Shield",
    category: "Governance",
    policyType: "Technical",
    compliance: "ISO 27001",
    pageLength: "10-15 pages",
    outputFormats: ["PDF", "DOCX", "Markdown"],
    aiGeneration: "Full AI Generation",
    complexity: "Moderate",
    specialFeature: "Auto-versioning",
    usageCount: 245
  },
  {
    id: "data-governance-policy",
    title: "Enterprise Data Governance Policy",
    description: "Define data ownership, quality standards, and governance processes",
    icon: "Database",
    category: "Data Management",
    policyType: "Strategic",
    compliance: "GDPR",
    pageLength: "15-20 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Complex",
    specialFeature: "GDPR templates",
    usageCount: 312
  },
  {
    id: "cloud-security-policy",
    title: "Cloud Security Policy",
    description: "Security standards and controls for cloud platform operations",
    icon: "Cloud",
    category: "Security",
    policyType: "Technical",
    compliance: "SOC 2",
    pageLength: "12-18 pages",
    outputFormats: ["PDF", "DOCX", "HTML"],
    aiGeneration: "Full AI Generation",
    complexity: "Moderate",
    specialFeature: "Multi-cloud support",
    usageCount: 198
  },
  {
    id: "change-management-policy",
    title: "Change Management Policy",
    description: "Governance framework for managing organizational and technical change",
    icon: "RefreshCw",
    category: "Change Management",
    policyType: "Operational",
    compliance: "COBIT",
    pageLength: "8-12 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "AI-Assisted",
    complexity: "Simple",
    specialFeature: "Workflow diagrams",
    usageCount: 276
  },
  {
    id: "architecture-standards-policy",
    title: "Architecture Standards & Principles Policy",
    description: "Enterprise architecture standards, principles, and decision frameworks",
    icon: "Layers",
    category: "Architecture",
    policyType: "Technical",
    compliance: null,
    pageLength: "10-15 pages",
    outputFormats: ["PDF", "DOCX", "Markdown"],
    aiGeneration: "Full AI Generation",
    complexity: "Moderate",
    specialFeature: "Pattern library",
    usageCount: 189
  },
  {
    id: "third-party-risk-policy",
    title: "Third-Party Risk Management Policy",
    description: "Framework for assessing and managing third-party vendor risks",
    icon: "Users",
    category: "Compliance",
    policyType: "Strategic",
    compliance: "NIST",
    pageLength: "10-15 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Moderate",
    specialFeature: "Risk matrices",
    usageCount: 156
  },
  {
    id: "incident-response-policy",
    title: "Incident Response Policy",
    description: "Procedures and escalation paths for security incident management",
    icon: "AlertTriangle",
    category: "Security",
    policyType: "Operational",
    compliance: "ISO 27001",
    pageLength: "8-12 pages",
    outputFormats: ["PDF", "DOCX", "HTML"],
    aiGeneration: "AI-Assisted",
    complexity: "Simple",
    specialFeature: "Playbook templates",
    usageCount: 223
  },
  {
    id: "ai-ethics-policy",
    title: "AI Ethics & Responsible AI Policy",
    description: "Ethical guidelines and governance for AI system development and deployment",
    icon: "Brain",
    category: "Governance",
    policyType: "Strategic",
    compliance: null,
    pageLength: "12-18 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Complex",
    specialFeature: "Ethics checklist",
    usageCount: 134
  },
  {
    id: "data-privacy-policy",
    title: "Data Privacy & Protection Policy",
    description: "Comprehensive data privacy policy covering collection, use, and retention",
    icon: "Lock",
    category: "Data Management",
    policyType: "Strategic",
    compliance: "GDPR",
    pageLength: "15-20 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Complex",
    specialFeature: "Multi-jurisdiction",
    usageCount: 287
  },
  {
    id: "devops-policy",
    title: "DevOps & CI/CD Policy",
    description: "Standards and practices for continuous integration and delivery pipelines",
    icon: "GitBranch",
    category: "Operations",
    policyType: "Technical",
    compliance: null,
    pageLength: "8-12 pages",
    outputFormats: ["PDF", "DOCX", "Markdown"],
    aiGeneration: "AI-Assisted",
    complexity: "Moderate",
    specialFeature: "Pipeline templates",
    usageCount: 201
  },
  {
    id: "access-control-policy",
    title: "Access Control & Identity Management Policy",
    description: "User access governance, authentication, and authorization standards",
    icon: "Key",
    category: "Security",
    policyType: "Technical",
    compliance: "SOC 2",
    pageLength: "10-15 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Moderate",
    specialFeature: "Role matrices",
    usageCount: 265
  },
  {
    id: "platform-governance-policy",
    title: "Platform Governance Policy",
    description: "Governance framework for internal platform teams and services",
    icon: "Boxes",
    category: "Governance",
    policyType: "Operational",
    compliance: null,
    pageLength: "8-12 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "AI-Assisted",
    complexity: "Simple",
    specialFeature: "SLA templates",
    usageCount: 178
  },
  {
    id: "backup-recovery-policy",
    title: "Backup & Disaster Recovery Policy",
    description: "Data backup, business continuity, and disaster recovery procedures",
    icon: "HardDrive",
    category: "Operations",
    policyType: "Operational",
    compliance: "ISO 27001",
    pageLength: "10-15 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Moderate",
    specialFeature: "RTO/RPO calculator",
    usageCount: 192
  },
  {
    id: "software-licensing-policy",
    title: "Software Licensing & Asset Management Policy",
    description: "Governance for software procurement, licensing, and compliance",
    icon: "FileKey",
    category: "Compliance",
    policyType: "Administrative",
    compliance: null,
    pageLength: "8-12 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "AI-Assisted",
    complexity: "Simple",
    specialFeature: "License tracker",
    usageCount: 145
  },
  {
    id: "code-quality-policy",
    title: "Code Quality & Security Standards Policy",
    description: "Development standards for code quality, security, and maintainability",
    icon: "Code",
    category: "Architecture",
    policyType: "Technical",
    compliance: null,
    pageLength: "10-15 pages",
    outputFormats: ["PDF", "DOCX", "Markdown"],
    aiGeneration: "Full AI Generation",
    complexity: "Moderate",
    specialFeature: "Linting configs",
    usageCount: 167
  }
];

export const policyReportsFilters = {
  policyDomain: ["Governance", "Security", "Data Management", "Architecture", "Operations", "Compliance", "Change Management"],
  policyType: ["Strategic", "Operational", "Technical", "Administrative"],
  complianceFramework: ["ISO 27001", "SOC 2", "GDPR", "HIPAA", "PCI-DSS", "NIST", "COBIT", "None"],
  outputFormat: ["PDF", "DOCX", "Markdown", "HTML"],
  complexity: ["Simple", "Moderate", "Complex"],
  pageLength: ["1-5 pages", "5-10 pages", "10-20 pages", "20+ pages"],
  aiGeneration: ["Full AI Generation", "AI-Assisted", "Template Only"]
};
