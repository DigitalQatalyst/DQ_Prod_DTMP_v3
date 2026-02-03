export interface Assessment {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  assessmentType: string;
  framework: string;
  assessmentScope: string;
  pageLength: string;
  outputFormats: string[];
  aiGeneration: string;
  includesScorecard: boolean;
  includesRecommendations: boolean;
  specialFeature: string;
  usageCount: number;
}

export const assessments: Assessment[] = [
  {
    id: "digital-maturity-assessment",
    title: "Digital Maturity Assessment",
    description: "Comprehensive assessment of digital transformation maturity across all dimensions",
    icon: "BarChart3",
    category: "Maturity",
    assessmentType: "Maturity Assessment",
    framework: "DBP Framework",
    assessmentScope: "Enterprise",
    pageLength: "25-35 pages",
    outputFormats: ["PDF", "DOCX", "PPTX"],
    aiGeneration: "Full AI Generation",
    includesScorecard: true,
    includesRecommendations: true,
    specialFeature: "Benchmark data",
    usageCount: 345
  },
  {
    id: "capability-assessment",
    title: "Capability Assessment Template",
    description: "Assess organizational capabilities against target state requirements",
    icon: "Target",
    category: "Capability",
    assessmentType: "Capability Assessment",
    framework: "DBP Framework",
    assessmentScope: "Enterprise",
    pageLength: "18-25 pages",
    outputFormats: ["PDF", "DOCX", "Excel"],
    aiGeneration: "Full AI Generation",
    includesScorecard: true,
    includesRecommendations: true,
    specialFeature: "Gap analysis",
    usageCount: 278
  },
  {
    id: "cloud-readiness-assessment",
    title: "Cloud Readiness Assessment",
    description: "Evaluate organizational readiness for cloud adoption and migration",
    icon: "Cloud",
    category: "Readiness",
    assessmentType: "Readiness Assessment",
    framework: "Custom Framework",
    assessmentScope: "Enterprise",
    pageLength: "15-22 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    includesScorecard: true,
    includesRecommendations: true,
    specialFeature: "Migration readiness",
    usageCount: 234
  },
  {
    id: "security-risk-assessment",
    title: "Security Risk Assessment",
    description: "Comprehensive security risk assessment with threat analysis and controls",
    icon: "Shield",
    category: "Risk",
    assessmentType: "Risk Assessment",
    framework: "NIST",
    assessmentScope: "Enterprise",
    pageLength: "20-30 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    includesScorecard: true,
    includesRecommendations: true,
    specialFeature: "Risk register",
    usageCount: 198
  },
  {
    id: "application-health-check",
    title: "Application Health Check",
    description: "Technical health assessment for applications in the portfolio",
    icon: "Activity",
    category: "Health Check",
    assessmentType: "Health Check",
    framework: "Custom Framework",
    assessmentScope: "Application",
    pageLength: "10-15 pages",
    outputFormats: ["PDF", "DOCX", "Excel"],
    aiGeneration: "AI-Assisted",
    includesScorecard: true,
    includesRecommendations: true,
    specialFeature: "Tech debt score",
    usageCount: 267
  },
  {
    id: "transformation-gap-analysis",
    title: "Transformation Gap Analysis",
    description: "Identify gaps between current state and target transformation outcomes",
    icon: "GitCompare",
    category: "Gap Analysis",
    assessmentType: "Gap Analysis",
    framework: "4D Model",
    assessmentScope: "Enterprise",
    pageLength: "18-25 pages",
    outputFormats: ["PDF", "DOCX", "PPTX"],
    aiGeneration: "Full AI Generation",
    includesScorecard: true,
    includesRecommendations: true,
    specialFeature: "Roadmap alignment",
    usageCount: 189
  },
  {
    id: "data-governance-maturity",
    title: "Data Governance Maturity Assessment",
    description: "Assess data governance practices and identify improvement areas",
    icon: "Database",
    category: "Maturity",
    assessmentType: "Maturity Assessment",
    framework: "CMMI",
    assessmentScope: "Domain",
    pageLength: "15-22 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    includesScorecard: true,
    includesRecommendations: true,
    specialFeature: "Data quality metrics",
    usageCount: 156
  },
  {
    id: "project-health-assessment",
    title: "Project Health Assessment",
    description: "Evaluate project health and identify risks and remediation actions",
    icon: "ClipboardCheck",
    category: "Health Check",
    assessmentType: "Health Check",
    framework: "Custom Framework",
    assessmentScope: "Project",
    pageLength: "8-12 pages",
    outputFormats: ["PDF", "DOCX", "PPTX"],
    aiGeneration: "AI-Assisted",
    includesScorecard: true,
    includesRecommendations: true,
    specialFeature: "RAG status",
    usageCount: 312
  }
];

export const assessmentsFilters = {
  assessmentType: ["Maturity Assessment", "Capability Assessment", "Readiness Assessment", "Gap Analysis", "Risk Assessment", "Health Check"],
  framework: ["DBP Framework", "4D Model", "CMMI", "NIST", "Custom Framework"],
  assessmentScope: ["Enterprise", "Domain", "Project", "Application"],
  outputFormat: ["PDF", "DOCX", "PPTX", "Excel"],
  includesScorecard: ["Yes", "No"],
  includesRecommendations: ["Yes", "No"],
  aiGeneration: ["Full AI Generation", "AI-Assisted", "Template Only"]
};
