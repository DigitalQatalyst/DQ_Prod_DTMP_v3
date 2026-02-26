export interface ExecutiveSummary {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  summaryType: string;
  audience: string;
  format: string;
  pageLength: string;
  outputFormats: string[];
  aiGeneration: string;
  includesMetrics: boolean;
  includesVisualizations: boolean;
  specialFeature: string;
  usageCount: number;
}

export const executiveSummaries: ExecutiveSummary[] = [
  {
    id: "quarterly-transformation-update",
    title: "Quarterly Transformation Update",
    description: "Executive summary of transformation progress, milestones, and key metrics",
    icon: "Presentation",
    category: "Progress Update",
    summaryType: "Quarterly Update",
    audience: "C-Suite",
    format: "Two-Pager",
    pageLength: "2 pages",
    outputFormats: ["PDF", "PPTX"],
    aiGeneration: "Full AI Generation",
    includesMetrics: true,
    includesVisualizations: true,
    specialFeature: "KPI dashboards",
    usageCount: 287
  },
  {
    id: "project-status-executive",
    title: "Project Status Executive Brief",
    description: "High-level project status summary for executive stakeholders",
    icon: "FileText",
    category: "Project Status",
    summaryType: "Project Status",
    audience: "Senior Management",
    format: "One-Pager",
    pageLength: "1 page",
    outputFormats: ["PDF", "PPTX", "DOCX"],
    aiGeneration: "Full AI Generation",
    includesMetrics: true,
    includesVisualizations: true,
    specialFeature: "RAG status",
    usageCount: 356
  },
  {
    id: "initiative-overview",
    title: "Strategic Initiative Overview",
    description: "Overview of strategic initiative for stakeholder communication",
    icon: "Target",
    category: "Initiative Overview",
    summaryType: "Initiative Overview",
    audience: "Stakeholders",
    format: "Two-Pager",
    pageLength: "2 pages",
    outputFormats: ["PDF", "PPTX"],
    aiGeneration: "AI-Assisted",
    includesMetrics: true,
    includesVisualizations: true,
    specialFeature: "Business case summary",
    usageCount: 198
  },
  {
    id: "performance-dashboard-summary",
    title: "Performance Dashboard Summary",
    description: "Executive dashboard view of key performance indicators",
    icon: "BarChart3",
    category: "Performance",
    summaryType: "Performance Dashboard",
    audience: "C-Suite",
    format: "Dashboard",
    pageLength: "1 page",
    outputFormats: ["PDF", "PPTX"],
    aiGeneration: "Full AI Generation",
    includesMetrics: true,
    includesVisualizations: true,
    specialFeature: "Real-time metrics",
    usageCount: 234
  },
  {
    id: "strategic-briefing",
    title: "Strategic Briefing Document",
    description: "Strategic briefing for executive decision-making sessions",
    icon: "BookOpen",
    category: "Strategic Briefing",
    summaryType: "Strategic Briefing",
    audience: "C-Suite",
    format: "Presentation",
    pageLength: "8-12 slides",
    outputFormats: ["PPTX", "PDF"],
    aiGeneration: "Full AI Generation",
    includesMetrics: true,
    includesVisualizations: true,
    specialFeature: "Decision matrices",
    usageCount: 167
  },
  {
    id: "board-report",
    title: "Board Report Template",
    description: "Comprehensive board-level report on transformation and technology",
    icon: "Users",
    category: "Board Report",
    summaryType: "Board Report",
    audience: "Board of Directors",
    format: "Presentation",
    pageLength: "15-20 slides",
    outputFormats: ["PPTX", "PDF"],
    aiGeneration: "Full AI Generation",
    includesMetrics: true,
    includesVisualizations: true,
    specialFeature: "Risk summary",
    usageCount: 145
  },
  {
    id: "investment-summary",
    title: "Investment Summary Brief",
    description: "Executive summary of technology investment portfolio and returns",
    icon: "TrendingUp",
    category: "Financial",
    summaryType: "Financial Summary",
    audience: "C-Suite",
    format: "Two-Pager",
    pageLength: "2 pages",
    outputFormats: ["PDF", "PPTX"],
    aiGeneration: "Full AI Generation",
    includesMetrics: true,
    includesVisualizations: true,
    specialFeature: "ROI tracking",
    usageCount: 178
  }
];

export const executiveSummariesFilters = {
  summaryType: ["Quarterly Update", "Project Status", "Initiative Overview", "Performance Dashboard", "Strategic Briefing", "Board Report"],
  audience: ["Board of Directors", "C-Suite", "Senior Management", "Stakeholders"],
  format: ["One-Pager", "Two-Pager", "Presentation", "Dashboard"],
  outputFormat: ["PDF", "PPTX", "DOCX"],
  includesMetrics: ["Yes", "No"],
  includesVisualizations: ["Yes", "No"],
  aiGeneration: ["Full AI Generation", "AI-Assisted", "Template Only"]
};
