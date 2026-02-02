export interface Playbook {
  id: string;
  title: string;
  description: string;
  industry: string;
  type: string;
  scope: string;
  format: string;
  formatIcon: string;
  contributor: string;
  coverGradient: string;
  topics: string[];
}

export const playbooks: Playbook[] = [
  {
    id: "financial-services-digital",
    title: "Financial Services Digital Transformation Playbook",
    description: "Comprehensive guide to digital transformation in banking and financial services",
    industry: "Financial Services",
    type: "End-to-End Transformation",
    scope: "Enterprise-wide",
    format: "Interactive Guide",
    formatIcon: "MonitorPlay",
    contributor: "Internal Experts",
    coverGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    topics: [
      "Open Banking APIs",
      "Digital Payments Platform",
      "Customer 360 View",
      "Regulatory Compliance",
      "AI-Powered Risk Management"
    ]
  },
  {
    id: "healthcare-patient-experience",
    title: "Healthcare Patient Experience Platform",
    description: "Building integrated patient experience platforms in healthcare organizations",
    industry: "Healthcare",
    type: "Domain-Specific",
    scope: "Enterprise-wide",
    format: "PDF Document",
    formatIcon: "FileText",
    contributor: "Industry Partners",
    coverGradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    topics: [
      "Patient Portal Integration",
      "Telehealth Platform",
      "Health Records Interoperability",
      "Care Coordination",
      "HIPAA Compliance"
    ]
  },
  {
    id: "retail-omnichannel",
    title: "Retail Omnichannel Excellence Playbook",
    description: "Creating seamless omnichannel retail experiences",
    industry: "Retail & E-commerce",
    type: "End-to-End Transformation",
    scope: "Enterprise-wide",
    format: "Interactive Guide",
    formatIcon: "MonitorPlay",
    contributor: "Consulting Firms",
    coverGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    topics: [
      "Unified Commerce Platform",
      "Inventory Visibility",
      "Personalization Engine",
      "Loyalty Programs",
      "In-Store Digital Experience"
    ]
  },
  {
    id: "manufacturing-industry-40",
    title: "Manufacturing Industry 4.0 Transformation",
    description: "Digital transformation strategies for smart manufacturing",
    industry: "Manufacturing",
    type: "End-to-End Transformation",
    scope: "Enterprise-wide",
    format: "PDF Document",
    formatIcon: "FileText",
    contributor: "Technology Vendors",
    coverGradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    topics: [
      "Digital Twin Implementation",
      "IoT Sensor Networks",
      "Predictive Maintenance",
      "Supply Chain Integration",
      "Quality Management Systems"
    ]
  },
  {
    id: "public-sector-citizen-services",
    title: "Public Sector Citizen Services Platform",
    description: "Modernizing government services with digital platforms",
    industry: "Public Sector",
    type: "Domain-Specific",
    scope: "Enterprise-wide",
    format: "Workshop Kit",
    formatIcon: "Presentation",
    contributor: "Internal Experts",
    coverGradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    topics: [
      "Citizen Portal Development",
      "Service Digitization",
      "Identity Management",
      "Data Privacy & Security",
      "Accessibility Standards"
    ]
  },
  {
    id: "technology-saas-platform",
    title: "SaaS Platform Architecture Playbook",
    description: "Building scalable multi-tenant SaaS platforms",
    industry: "Technology",
    type: "Technology-Specific",
    scope: "Business Unit",
    format: "Interactive Guide",
    formatIcon: "MonitorPlay",
    contributor: "Technology Vendors",
    coverGradient: "linear-gradient(135deg, #fa8bff 0%, #2bd2ff 90%)",
    topics: [
      "Multi-Tenancy Architecture",
      "Subscription Management",
      "Usage Metering",
      "API Gateway Design",
      "Tenant Isolation"
    ]
  },
  {
    id: "education-digital-learning",
    title: "Digital Learning Platform for Education",
    description: "Building comprehensive digital learning ecosystems",
    industry: "Education",
    type: "End-to-End Transformation",
    scope: "Enterprise-wide",
    format: "PDF Document",
    formatIcon: "FileText",
    contributor: "Internal Experts",
    coverGradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    topics: [
      "Learning Management System",
      "Virtual Classroom Integration",
      "Student Information System",
      "Assessment & Analytics",
      "Parent Engagement Portal"
    ]
  },
  {
    id: "energy-smart-grid",
    title: "Energy & Utilities Smart Grid Platform",
    description: "Digital transformation for energy and utilities sectors",
    industry: "Energy & Utilities",
    type: "Domain-Specific",
    scope: "Enterprise-wide",
    format: "Video Series",
    formatIcon: "Video",
    contributor: "Industry Partners",
    coverGradient: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",
    topics: [
      "Smart Meter Integration",
      "Grid Management System",
      "Demand Response Platform",
      "Outage Management",
      "Customer Energy Portal"
    ]
  },
  {
    id: "financial-regulatory-compliance",
    title: "Financial Services Regulatory Compliance",
    description: "Compliance-driven digital transformation in financial services",
    industry: "Financial Services",
    type: "Compliance-Driven",
    scope: "Enterprise-wide",
    format: "PDF Document",
    formatIcon: "FileText",
    contributor: "Consulting Firms",
    coverGradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    topics: [
      "KYC/AML Automation",
      "Regulatory Reporting",
      "Audit Trail Management",
      "Data Governance Framework",
      "Compliance Monitoring"
    ]
  },
  {
    id: "retail-supply-chain-digital",
    title: "Retail Supply Chain Digitization",
    description: "End-to-end supply chain transformation for retail",
    industry: "Retail & E-commerce",
    type: "Domain-Specific",
    scope: "Business Unit",
    format: "Interactive Guide",
    formatIcon: "MonitorPlay",
    contributor: "Internal Experts",
    coverGradient: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
    topics: [
      "Inventory Optimization",
      "Supplier Integration",
      "Warehouse Automation",
      "Last-Mile Delivery",
      "Demand Forecasting"
    ]
  },
  {
    id: "healthcare-telehealth",
    title: "Telehealth Platform Implementation",
    description: "Building comprehensive telehealth capabilities",
    industry: "Healthcare",
    type: "Technology-Specific",
    scope: "Department",
    format: "Workshop Kit",
    formatIcon: "Presentation",
    contributor: "Technology Vendors",
    coverGradient: "linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)",
    topics: [
      "Video Consultation Platform",
      "Remote Patient Monitoring",
      "E-Prescription Integration",
      "Provider Scheduling",
      "Insurance Integration"
    ]
  },
  {
    id: "manufacturing-supply-chain",
    title: "Manufacturing Supply Chain Resilience",
    description: "Building resilient and agile supply chains in manufacturing",
    industry: "Manufacturing",
    type: "Domain-Specific",
    scope: "Enterprise-wide",
    format: "PDF Document",
    formatIcon: "FileText",
    contributor: "Consulting Firms",
    coverGradient: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)",
    topics: [
      "Supplier Risk Management",
      "Real-Time Tracking",
      "Blockchain for Traceability",
      "Alternative Sourcing",
      "Demand-Supply Matching"
    ]
  }
];

export const playbooksFilters = {
  industry: ["Financial Services", "Healthcare", "Retail & E-commerce", "Manufacturing", "Public Sector", "Technology", "Education", "Energy & Utilities"],
  playbookType: ["End-to-End Transformation", "Domain-Specific", "Technology-Specific", "Compliance-Driven"],
  scope: ["Enterprise-wide", "Business Unit", "Department", "Function"],
  format: ["Interactive Guide", "PDF Document", "Video Series", "Workshop Kit"],
  contributedBy: ["Internal Experts", "Industry Partners", "Consulting Firms", "Technology Vendors"]
};
