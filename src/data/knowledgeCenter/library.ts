export interface LibraryItem {
  id: string;
  title: string;
  description: string;
  contentType: string;
  format: string;
  typeIcon: string;
  author: string;
  length: string;
  datePublished: string;
  topics: string[];
  audience: string;
}

export const libraryItems: LibraryItem[] = [
  {
    id: "dbp-reference-architecture",
    title: "DBP Reference Architecture v3.0",
    description: "Comprehensive reference architecture for Digital Business Platforms",
    contentType: "Reference Architecture",
    format: "PDF",
    typeIcon: "FileText",
    author: "Enterprise Architecture Team",
    length: "Comprehensive (45 pages)",
    datePublished: "January 2024",
    topics: ["DBP Framework", "Architecture Patterns", "Capability Mapping"],
    audience: "Architect"
  },
  {
    id: "4d-model-guide",
    title: "The 4D Transformation Model: Complete Guide",
    description: "In-depth guide to applying Discern, Design, Deploy, and Drive phases",
    contentType: "Framework Guide",
    format: "PDF",
    typeIcon: "BookOpen",
    author: "Transformation Office",
    length: "Medium (28 pages)",
    datePublished: "December 2023",
    topics: ["4D Model", "Governance Models", "Change Management"],
    audience: "All Roles"
  },
  {
    id: "capability-mapping-research",
    title: "Capability-Based Planning Research Paper",
    description: "Academic research on effectiveness of capability-based transformation planning",
    contentType: "Research Paper",
    format: "PDF",
    typeIcon: "FileText",
    author: "Dr. Sarah Mitchell",
    length: "Comprehensive (52 pages)",
    datePublished: "November 2023",
    topics: ["Capability Mapping", "Research"],
    audience: "Executive"
  },
  {
    id: "maturity-assessment-framework",
    title: "Digital Maturity Assessment Framework",
    description: "Framework and toolkit for assessing digital transformation maturity",
    contentType: "Framework Guide",
    format: "PDF",
    typeIcon: "BarChart3",
    author: "Digital Intelligence Team",
    length: "Medium (32 pages)",
    datePublished: "January 2024",
    topics: ["Maturity Assessment", "DBP Framework"],
    audience: "Manager"
  },
  {
    id: "api-first-patterns",
    title: "API-First Architecture Patterns",
    description: "Design patterns and best practices for API-first digital platforms",
    contentType: "Technical Specification",
    format: "PDF",
    typeIcon: "Code",
    author: "API Governance Team",
    length: "Medium (24 pages)",
    datePublished: "December 2023",
    topics: ["Architecture Patterns", "API Design"],
    audience: "Architect"
  },
  {
    id: "transformation-leadership-video",
    title: "Leadership in Digital Transformation",
    description: "Video series featuring transformation leaders sharing insights and lessons learned",
    contentType: "Video",
    format: "Video",
    typeIcon: "Video",
    author: "Executive Leadership Panel",
    length: "Multi-part Series (6 episodes)",
    datePublished: "February 2024",
    topics: ["Leadership", "Change Management"],
    audience: "Executive"
  },
  {
    id: "governance-models-comparison",
    title: "Digital Governance Models: A Comparison",
    description: "Comparative analysis of different digital governance approaches",
    contentType: "White Paper",
    format: "PDF",
    typeIcon: "FileText",
    author: "Governance Center of Excellence",
    length: "Medium (18 pages)",
    datePublished: "October 2023",
    topics: ["Governance Models", "4D Model"],
    audience: "Manager"
  },
  {
    id: "cloud-migration-case-study",
    title: "Enterprise Cloud Migration: Lessons Learned",
    description: "Detailed case study of enterprise-wide cloud platform migration",
    contentType: "Case Study",
    format: "PDF",
    typeIcon: "FileText",
    author: "Cloud Platform Team",
    length: "Quick Read (12 pages)",
    datePublished: "November 2023",
    topics: ["Case Studies", "Cloud Architecture"],
    audience: "Practitioner"
  },
  {
    id: "dbp-domains-infographic",
    title: "12 DBP Domains Visual Guide",
    description: "Visual infographic explaining the 12 domains of the Digital Business Platform",
    contentType: "Infographic",
    format: "PDF",
    typeIcon: "Image",
    author: "Design Team",
    length: "Quick Read (2 pages)",
    datePublished: "January 2024",
    topics: ["DBP Framework", "Visual Guides"],
    audience: "All Roles"
  },
  {
    id: "change-management-playbook",
    title: "Enterprise Change Management Playbook",
    description: "Comprehensive playbook for managing organizational change in transformations",
    contentType: "Framework Guide",
    format: "PPTX",
    typeIcon: "Presentation",
    author: "Change Management Team",
    length: "Comprehensive (60 slides)",
    datePublished: "December 2023",
    topics: ["Change Management", "Governance Models"],
    audience: "Manager"
  },
  {
    id: "data-strategy-whitepaper",
    title: "Enterprise Data Strategy Framework",
    description: "Strategic framework for building data-driven digital platforms",
    contentType: "White Paper",
    format: "PDF",
    typeIcon: "FileText",
    author: "Data & Analytics Team",
    length: "Medium (22 pages)",
    datePublished: "January 2024",
    topics: ["Data Strategy", "Architecture Patterns"],
    audience: "Architect"
  },
  {
    id: "agile-at-scale-guide",
    title: "Agile at Scale: Implementation Guide",
    description: "Practical guide for implementing agile practices across large organizations",
    contentType: "Framework Guide",
    format: "PDF",
    typeIcon: "BookOpen",
    author: "Agile Center of Excellence",
    length: "Comprehensive (48 pages)",
    datePublished: "November 2023",
    topics: ["Agile", "Delivery"],
    audience: "Practitioner"
  },
  {
    id: "security-architecture-patterns",
    title: "Security Architecture Patterns for DBP",
    description: "Security patterns and practices for digital business platforms",
    contentType: "Reference Architecture",
    format: "PDF",
    typeIcon: "Shield",
    author: "Security Architecture Team",
    length: "Medium (30 pages)",
    datePublished: "January 2024",
    topics: ["Architecture Patterns", "Security"],
    audience: "Architect"
  },
  {
    id: "transformation-roi-whitepaper",
    title: "Measuring Transformation ROI",
    description: "Methodologies for quantifying and communicating transformation value",
    contentType: "White Paper",
    format: "PDF",
    typeIcon: "TrendingUp",
    author: "Portfolio Management Office",
    length: "Quick Read (14 pages)",
    datePublished: "October 2023",
    topics: ["ROI Measurement", "Portfolio Management"],
    audience: "Executive"
  },
  {
    id: "platform-operating-model",
    title: "Platform Operating Model Framework",
    description: "Framework for establishing platform teams and operating models",
    contentType: "Framework Guide",
    format: "PDF",
    typeIcon: "Users",
    author: "Platform Enablement Team",
    length: "Medium (22 pages)",
    datePublished: "December 2023",
    topics: ["Operating Models", "Platform Teams"],
    audience: "Manager"
  },
  {
    id: "ai-ethics-guidelines",
    title: "AI Ethics and Governance Guidelines",
    description: "Guidelines for ethical AI implementation and governance",
    contentType: "Framework Guide",
    format: "PDF",
    typeIcon: "Brain",
    author: "AI Ethics Committee",
    length: "Quick Read (16 pages)",
    datePublished: "February 2024",
    topics: ["AI/ML", "Ethics", "Governance Models"],
    audience: "All Roles"
  },
  {
    id: "customer-journey-mapping",
    title: "Customer Journey Mapping Toolkit",
    description: "Tools and templates for mapping and optimizing customer journeys",
    contentType: "Framework Guide",
    format: "PPTX",
    typeIcon: "Map",
    author: "Customer Experience Team",
    length: "Medium (45 slides)",
    datePublished: "November 2023",
    topics: ["Customer Experience", "Journey Mapping"],
    audience: "Practitioner"
  },
  {
    id: "devops-maturity-model",
    title: "DevOps Maturity Model and Assessment",
    description: "Maturity model for assessing and improving DevOps capabilities",
    contentType: "Framework Guide",
    format: "PDF",
    typeIcon: "GitBranch",
    author: "DevOps Center of Excellence",
    length: "Quick Read (18 pages)",
    datePublished: "January 2024",
    topics: ["Maturity Assessment", "DevOps", "Continuous Improvement"],
    audience: "Practitioner"
  },
  {
    id: "platform-economics-research",
    title: "Platform Economics: Business Model Research",
    description: "Research on platform business models and economics",
    contentType: "Research Paper",
    format: "PDF",
    typeIcon: "FileText",
    author: "Strategy Research Team",
    length: "Comprehensive (42 pages)",
    datePublished: "February 2024",
    topics: ["Platform Economics", "Strategy"],
    audience: "Executive"
  }
];

export const libraryFilters = {
  contentType: ["Reference Architecture", "Framework Guide", "Research Paper", "Case Study", "White Paper", "Technical Specification", "Video", "Infographic"],
  topic: ["DBP Framework", "4D Model", "Capability Mapping", "Maturity Assessment", "Architecture Patterns", "Governance Models", "Change Management"],
  format: ["PDF", "DOCX", "PPTX", "Video", "Interactive"],
  audience: ["Executive", "Architect", "Manager", "Practitioner", "All Roles"],
  length: ["Quick Read (<10 pages)", "Medium (10-30 pages)", "Comprehensive (30+ pages)", "Multi-part Series"],
  datePublished: ["Last month", "Last 3 months", "Last 6 months", "Last year", "All time"]
};
