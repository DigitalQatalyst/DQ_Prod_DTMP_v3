export interface StrategyDoc {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
  strategyType: string;
  timeHorizon: string;
  scopeLevel: string;
  pageLength: string;
  outputFormats: string[];
  aiGeneration: string;
  includesFinancials: boolean;
  includesRoadmap: boolean;
  specialFeature: string;
  usageCount: number;
}

export const strategyDocs: StrategyDoc[] = [
  {
    id: "digital-transformation-strategy",
    title: "Digital Transformation Strategy",
    description: "Comprehensive digital transformation strategy document with vision, goals, and roadmap",
    icon: "Target",
    category: "Transformation",
    strategyType: "Digital Transformation",
    timeHorizon: "3 Years",
    scopeLevel: "Enterprise",
    pageLength: "25-35 pages",
    outputFormats: ["PDF", "DOCX", "PPTX"],
    aiGeneration: "Full AI Generation",
    includesFinancials: true,
    includesRoadmap: true,
    specialFeature: "Executive presentation",
    usageCount: 312
  },
  {
    id: "platform-strategy",
    title: "Platform Strategy Document",
    description: "Digital platform strategy covering architecture, capabilities, and evolution",
    icon: "Layers",
    category: "Architecture",
    strategyType: "Platform Strategy",
    timeHorizon: "3 Years",
    scopeLevel: "Enterprise",
    pageLength: "20-30 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    includesFinancials: true,
    includesRoadmap: true,
    specialFeature: "Capability heatmaps",
    usageCount: 245
  },
  {
    id: "data-strategy",
    title: "Enterprise Data Strategy",
    description: "Data management, governance, and analytics strategy document",
    icon: "Database",
    category: "Data",
    strategyType: "Data Strategy",
    timeHorizon: "3 Years",
    scopeLevel: "Enterprise",
    pageLength: "20-28 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    includesFinancials: true,
    includesRoadmap: true,
    specialFeature: "Data maturity model",
    usageCount: 198
  },
  {
    id: "technology-roadmap",
    title: "Technology Roadmap",
    description: "Multi-year technology investment and modernization roadmap",
    icon: "Map",
    category: "Technology",
    strategyType: "Technology Roadmap",
    timeHorizon: "5 Years",
    scopeLevel: "Enterprise",
    pageLength: "15-25 pages",
    outputFormats: ["PDF", "DOCX", "PPTX"],
    aiGeneration: "Full AI Generation",
    includesFinancials: true,
    includesRoadmap: true,
    specialFeature: "Investment timeline",
    usageCount: 267
  },
  {
    id: "innovation-strategy",
    title: "Innovation Strategy",
    description: "Innovation framework, focus areas, and execution approach",
    icon: "Lightbulb",
    category: "Innovation",
    strategyType: "Innovation Strategy",
    timeHorizon: "3 Years",
    scopeLevel: "Enterprise",
    pageLength: "15-20 pages",
    outputFormats: ["PDF", "DOCX", "PPTX"],
    aiGeneration: "AI-Assisted",
    includesFinancials: false,
    includesRoadmap: true,
    specialFeature: "Innovation funnel",
    usageCount: 156
  },
  {
    id: "customer-experience-strategy",
    title: "Customer Experience Strategy",
    description: "Digital customer experience vision and transformation roadmap",
    icon: "Heart",
    category: "Customer",
    strategyType: "Domain Strategy",
    timeHorizon: "3 Years",
    scopeLevel: "Enterprise",
    pageLength: "18-25 pages",
    outputFormats: ["PDF", "DOCX", "PPTX"],
    aiGeneration: "Full AI Generation",
    includesFinancials: true,
    includesRoadmap: true,
    specialFeature: "Journey mapping",
    usageCount: 189
  },
  {
    id: "cloud-strategy",
    title: "Cloud Strategy Document",
    description: "Cloud adoption strategy covering migration, operations, and optimization",
    icon: "Cloud",
    category: "Technology",
    strategyType: "Technology Roadmap",
    timeHorizon: "3 Years",
    scopeLevel: "Enterprise",
    pageLength: "20-28 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    includesFinancials: true,
    includesRoadmap: true,
    specialFeature: "Migration waves",
    usageCount: 234
  },
  {
    id: "api-strategy",
    title: "API Strategy Document",
    description: "API-first strategy covering design, governance, and monetization",
    icon: "Code",
    category: "Architecture",
    strategyType: "Domain Strategy",
    timeHorizon: "1 Year",
    scopeLevel: "Domain",
    pageLength: "12-18 pages",
    outputFormats: ["PDF", "DOCX", "Markdown"],
    aiGeneration: "AI-Assisted",
    includesFinancials: false,
    includesRoadmap: true,
    specialFeature: "API catalog vision",
    usageCount: 145
  },
  {
    id: "security-strategy",
    title: "Cybersecurity Strategy",
    description: "Enterprise security strategy with risk framework and controls roadmap",
    icon: "Shield",
    category: "Security",
    strategyType: "Domain Strategy",
    timeHorizon: "3 Years",
    scopeLevel: "Enterprise",
    pageLength: "20-30 pages",
    outputFormats: ["PDF", "DOCX"],
    aiGeneration: "Full AI Generation",
    includesFinancials: true,
    includesRoadmap: true,
    specialFeature: "Risk heat maps",
    usageCount: 178
  },
  {
    id: "workforce-digital-strategy",
    title: "Digital Workforce Strategy",
    description: "Strategy for digital skills, tools, and ways of working",
    icon: "Users",
    category: "Workforce",
    strategyType: "Domain Strategy",
    timeHorizon: "3 Years",
    scopeLevel: "Enterprise",
    pageLength: "15-22 pages",
    outputFormats: ["PDF", "DOCX", "PPTX"],
    aiGeneration: "AI-Assisted",
    includesFinancials: true,
    includesRoadmap: true,
    specialFeature: "Skills framework",
    usageCount: 134
  }
];

export const strategyDocsFilters = {
  strategyType: ["Digital Transformation", "Platform Strategy", "Domain Strategy", "Technology Roadmap", "Innovation Strategy", "Data Strategy"],
  timeHorizon: ["1 Year", "3 Years", "5 Years", "Multi-Year"],
  scopeLevel: ["Enterprise", "Business Unit", "Department", "Domain"],
  outputFormat: ["PDF", "DOCX", "PPTX", "Markdown"],
  includesFinancials: ["Yes", "No"],
  includesRoadmap: ["Yes", "No"],
  aiGeneration: ["Full AI Generation", "AI-Assisted", "Template Only"]
};
