export interface ProcedureReport {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  procedureType: string;
  pageLength: string;
  outputFormats: string[];
  aiGeneration: string;
  complexity: string;
  includesFlowchart: boolean;
  specialFeature: string;
  usageCount: number;
}

export const procedureReports: ProcedureReport[] = [
  {
    id: "change-management-procedure",
    title: "Change Management Procedure",
    description: "Step-by-step process for requesting, approving, and implementing changes",
    icon: "ListChecks",
    category: "Change Management",
    procedureType: "Standard Operating Procedure",
    pageLength: "5-8 pages",
    outputFormats: ["PDF", "DOCX", "HTML"],
    aiGeneration: "Full AI Generation",
    complexity: "Simple",
    includesFlowchart: true,
    specialFeature: "Approval workflows",
    usageCount: 312
  },
  {
    id: "release-management-procedure",
    title: "Release Management Procedure",
    description: "Standardized process for planning, scheduling, and deploying releases",
    icon: "Rocket",
    category: "Release Management",
    procedureType: "Standard Operating Procedure",
    pageLength: "8-12 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Moderate",
    includesFlowchart: true,
    specialFeature: "Release checklist",
    usageCount: 289
  },
  {
    id: "incident-response-procedure",
    title: "Incident Response Procedure",
    description: "Detailed procedures for detecting, responding to, and resolving incidents",
    icon: "AlertCircle",
    category: "Incident Management",
    procedureType: "Work Instruction",
    pageLength: "10-15 pages",
    outputFormats: ["PDF", "DOCX", "HTML"],
    aiGeneration: "AI-Assisted",
    complexity: "Moderate",
    includesFlowchart: true,
    specialFeature: "Severity matrix",
    usageCount: 267
  },
  {
    id: "code-review-procedure",
    title: "Code Review Procedure",
    description: "Guidelines and process for conducting effective code reviews",
    icon: "GitPullRequest",
    category: "Project Delivery",
    procedureType: "Process Guide",
    pageLength: "5-8 pages",
    outputFormats: ["PDF", "DOCX", "Markdown"],
    aiGeneration: "AI-Assisted",
    complexity: "Simple",
    includesFlowchart: false,
    specialFeature: "Review checklist",
    usageCount: 234
  },
  {
    id: "architecture-review-procedure",
    title: "Architecture Review Procedure",
    description: "Process for reviewing and approving architecture decisions and designs",
    icon: "Building",
    category: "Architecture Review",
    procedureType: "Standard Operating Procedure",
    pageLength: "8-12 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Moderate",
    includesFlowchart: true,
    specialFeature: "Decision records",
    usageCount: 198
  },
  {
    id: "security-review-procedure",
    title: "Security Review Procedure",
    description: "Security assessment process for applications and infrastructure changes",
    icon: "ShieldCheck",
    category: "Security Review",
    procedureType: "Work Instruction",
    pageLength: "10-15 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Complex",
    includesFlowchart: true,
    specialFeature: "Threat modeling",
    usageCount: 245
  },
  {
    id: "onboarding-procedure",
    title: "Employee IT Onboarding Procedure",
    description: "Standard procedure for onboarding new employees to IT systems",
    icon: "UserPlus",
    category: "Operations",
    procedureType: "Checklist",
    pageLength: "3-5 pages",
    outputFormats: ["PDF", "DOCX", "HTML"],
    aiGeneration: "AI-Assisted",
    complexity: "Simple",
    includesFlowchart: false,
    specialFeature: "Automated checklist",
    usageCount: 321
  },
  {
    id: "data-classification-procedure",
    title: "Data Classification Procedure",
    description: "Process for classifying and labeling data based on sensitivity",
    icon: "Tags",
    category: "Data Governance",
    procedureType: "Process Guide",
    pageLength: "5-8 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Simple",
    includesFlowchart: true,
    specialFeature: "Classification matrix",
    usageCount: 187
  },
  {
    id: "vendor-assessment-procedure",
    title: "Vendor Security Assessment Procedure",
    description: "Standardized process for evaluating third-party vendor security",
    icon: "ClipboardList",
    category: "Security Review",
    procedureType: "Standard Operating Procedure",
    pageLength: "8-12 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Moderate",
    includesFlowchart: true,
    specialFeature: "Assessment scorecard",
    usageCount: 156
  },
  {
    id: "backup-restore-procedure",
    title: "Backup & Restore Procedure",
    description: "Step-by-step instructions for backup execution and data restoration",
    icon: "Database",
    category: "Operations",
    procedureType: "Work Instruction",
    pageLength: "5-8 pages",
    outputFormats: ["PDF", "DOCX", "HTML"],
    aiGeneration: "AI-Assisted",
    complexity: "Simple",
    includesFlowchart: true,
    specialFeature: "Verification steps",
    usageCount: 203
  },
  {
    id: "capacity-planning-procedure",
    title: "Capacity Planning Procedure",
    description: "Process for forecasting and planning infrastructure capacity needs",
    icon: "TrendingUp",
    category: "Operations",
    procedureType: "Process Guide",
    pageLength: "8-12 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Moderate",
    includesFlowchart: false,
    specialFeature: "Forecasting models",
    usageCount: 174
  },
  {
    id: "patch-management-procedure",
    title: "Patch Management Procedure",
    description: "Systematic approach to testing, approving, and deploying system patches",
    icon: "Download",
    category: "Operations",
    procedureType: "Standard Operating Procedure",
    pageLength: "8-12 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    complexity: "Moderate",
    includesFlowchart: true,
    specialFeature: "Patch schedule",
    usageCount: 219
  }
];

export const procedureReportsFilters = {
  processArea: ["Change Management", "Release Management", "Incident Management", "Project Delivery", "Architecture Review", "Security Review", "Data Governance", "Operations"],
  procedureType: ["Standard Operating Procedure", "Work Instruction", "Process Guide", "Checklist"],
  audienceLevel: ["Executive", "Management", "Practitioner", "All Levels"],
  outputFormat: ["PDF", "DOCX", "Markdown", "HTML"],
  includesFlowchart: ["Yes", "No"],
  complexity: ["Simple", "Moderate", "Complex"],
  aiGeneration: ["Full AI Generation", "AI-Assisted", "Template Only"]
};
