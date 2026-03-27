// ─── Portfolio Management — Full Seeded Data ───────────────────────────────
// All 54 governance intelligence cards across 6 tabs

export type PMTab =
  | "application-portfolio"
  | "project-portfolio"
  | "transformation-initiatives"
  | "technology-rationalisation"
  | "governance-health"
  | "operational-asset-digitisation";

export type PMCardStatus =
  | "On Track"
  | "At Risk"
  | "Critical"
  | "Completed"
  | "Scoping"
  | "No Initiative";

export type DEWADivision =
  | "Generation"
  | "Transmission"
  | "Distribution"
  | "Water Services"
  | "Customer Services"
  | "Digital DEWA & Moro Hub"
  | "All Divisions"
  | "Corporate EA Office";

export type TechnicalDebt = "None" | "Low" | "Medium" | "High" | "Critical";
export type LifecycleStage = "Optimise" | "Sustain" | "Modernise" | "Replace" | "Retire";
export type RAGStatus = "Green" | "Amber" | "Red";
export type Complexity = "Low" | "Medium" | "High";
export type GovernanceTrend = "Improving" | "Stable" | "Declining";
export type OADCardState = "On Track" | "At Risk" | "Gap" | "Completed";

// ── Tab 1: Application Portfolio ──────────────────────────────────────────

export interface AppCard {
  id: string;
  tab: "application-portfolio";
  name: string;
  division: DEWADivision;
  applicationType: string;
  healthScore: number;
  technicalDebt: TechnicalDebt;
  lifecycleStage: LifecycleStage;
  annualTCO: string;
  riskFlag?: string;
  projectTag?: string;
  initiativeTag?: string;
  status: PMCardStatus;
  // Insights detail fields
  vendor?: string;
  hostingModel?: string;
  deploymentDate?: string;
  insightsBreakdown?: {
    performance: number;
    security: number;
    integration: number;
    support: number;
    compliance: number;
  };
  eaAlignment?: string;
  lifecycleRecommendation?: string;
}

export const appCards: AppCard[] = [
  {
    id: "APP-01",
    tab: "application-portfolio",
    name: "SCADA Network Management System",
    division: "Transmission",
    applicationType: "SCADA",
    healthScore: 72,
    technicalDebt: "High",
    lifecycleStage: "Sustain",
    annualTCO: "AED 2.4M",
    riskFlag: "OT security exposure flagged. IEC 62443 compliance review overdue.",
    projectTag: "OT Security Remediation",
    initiativeTag: "Smart Grid Modernisation Programme",
    status: "At Risk",
    vendor: "Siemens",
    hostingModel: "On-Premise",
    deploymentDate: "2018",
    insightsBreakdown: { performance: 78, security: 55, integration: 80, support: 70, compliance: 60 },
    eaAlignment: "Partially compliant — 4 of 7 OT standards met",
    lifecycleRecommendation: "Sustain with security uplift. IEC 62443 remediation required within 6 months.",
  },
  {
    id: "APP-02",
    tab: "application-portfolio",
    name: "MyDEWA Customer Portal",
    division: "Customer Services",
    applicationType: "Customer Portal",
    healthScore: 88,
    technicalDebt: "Low",
    lifecycleStage: "Modernise",
    annualTCO: "AED 1.1M",
    riskFlag: "Mobile experience gap identified. Arabic accessibility improvements needed.",
    projectTag: "Customer Portal Modernisation",
    initiativeTag: "Customer Experience Transformation",
    status: "On Track",
    vendor: "Internal / Moro Hub",
    hostingModel: "Cloud",
    deploymentDate: "2020",
    insightsBreakdown: { performance: 90, security: 88, integration: 85, support: 92, compliance: 87 },
    eaAlignment: "Compliant — 6 of 7 digital standards met",
    lifecycleRecommendation: "Modernise mobile UX and Arabic accessibility. Continue cloud-first approach.",
  },
  {
    id: "APP-03",
    tab: "application-portfolio",
    name: "SAP ERP S/4HANA",
    division: "All Divisions",
    applicationType: "ERP",
    healthScore: 91,
    technicalDebt: "None",
    lifecycleStage: "Optimise",
    annualTCO: "AED 6.8M",
    projectTag: undefined,
    initiativeTag: "Digital DEWA Programme",
    status: "On Track",
    vendor: "SAP",
    hostingModel: "Hybrid",
    deploymentDate: "2019",
    insightsBreakdown: { performance: 93, security: 91, integration: 90, support: 94, compliance: 92 },
    eaAlignment: "Fully compliant — 7 of 7 ERP standards met",
    lifecycleRecommendation: "Optimise — continue quarterly enhancement cycles. No replacement needed.",
  },
  {
    id: "APP-04",
    tab: "application-portfolio",
    name: "Legacy Billing System (BIS-3)",
    division: "Customer Services",
    applicationType: "Finance",
    healthScore: 54,
    technicalDebt: "Critical",
    lifecycleStage: "Replace",
    annualTCO: "AED 3.2M",
    riskFlag: "End of vendor support Q3 2026. Critical replacement required.",
    projectTag: "Legacy Billing System Replacement",
    initiativeTag: "Customer Experience Transformation",
    status: "Critical",
    vendor: "Oracle (Legacy)",
    hostingModel: "On-Premise",
    deploymentDate: "2011",
    insightsBreakdown: { performance: 50, security: 48, integration: 60, support: 40, compliance: 55 },
    eaAlignment: "Non-compliant — fails 5 of 7 finance standards",
    lifecycleRecommendation: "Replace immediately. Vendor EOL Q3 2026 creates critical business risk.",
  },
  {
    id: "APP-05",
    tab: "application-portfolio",
    name: "Microsoft 365 Tenant",
    division: "All Divisions",
    applicationType: "Collaboration",
    healthScore: 94,
    technicalDebt: "None",
    lifecycleStage: "Optimise",
    annualTCO: "AED 4.5M",
    riskFlag: "Power Platform governance gap identified.",
    projectTag: undefined,
    initiativeTag: "Digital DEWA Programme",
    status: "On Track",
    vendor: "Microsoft",
    hostingModel: "SaaS",
    deploymentDate: "2021",
    insightsBreakdown: { performance: 96, security: 94, integration: 92, support: 97, compliance: 93 },
    eaAlignment: "Compliant — 6 of 7 collaboration standards met",
    lifecycleRecommendation: "Optimise Power Platform governance. Implement DLP policies for M365.",
  },
  {
    id: "APP-06",
    tab: "application-portfolio",
    name: "IBM Maximo Asset Management",
    division: "Generation",
    applicationType: "Other",
    healthScore: 76,
    technicalDebt: "Medium",
    lifecycleStage: "Modernise",
    annualTCO: "AED 3.8M",
    riskFlag: "Integration with SCADA incomplete. Mobile field access not deployed.",
    projectTag: "Core Business Platform Modernisation",
    initiativeTag: "Digital DEWA Programme",
    status: "At Risk",
    vendor: "IBM",
    hostingModel: "On-Premise",
    deploymentDate: "2016",
    insightsBreakdown: { performance: 74, security: 80, integration: 65, support: 78, compliance: 82 },
    eaAlignment: "Partially compliant — 5 of 7 asset management standards met",
    lifecycleRecommendation: "Modernise — complete SCADA integration and deploy mobile field access module.",
  },
  {
    id: "APP-07",
    tab: "application-portfolio",
    name: "Rammas AI Platform",
    division: "Customer Services",
    applicationType: "CRM",
    healthScore: 84,
    technicalDebt: "Low",
    lifecycleStage: "Optimise",
    annualTCO: "AED 2.1M",
    riskFlag: "Arabic NLP accuracy below target. Model retraining overdue.",
    projectTag: "Rammas AI Enhancement Programme",
    initiativeTag: "Customer Experience Transformation",
    status: "On Track",
    vendor: "Internal / AI Team",
    hostingModel: "Cloud",
    deploymentDate: "2022",
    insightsBreakdown: { performance: 82, security: 88, integration: 85, support: 80, compliance: 86 },
    eaAlignment: "Compliant — 6 of 7 AI governance standards met",
    lifecycleRecommendation: "Optimise Arabic NLP model. Schedule quarterly retraining cycle.",
  },
  {
    id: "APP-08",
    tab: "application-portfolio",
    name: "Custom Distribution CRM",
    division: "Distribution",
    applicationType: "CRM",
    healthScore: 61,
    technicalDebt: "High",
    lifecycleStage: "Replace",
    annualTCO: "AED 1.4M",
    riskFlag: "Duplicate of Salesforce in Customer Services. Rationalisation opportunity identified.",
    projectTag: undefined,
    initiativeTag: undefined,
    status: "No Initiative",
    vendor: "Custom Build",
    hostingModel: "On-Premise",
    deploymentDate: "2014",
    insightsBreakdown: { performance: 62, security: 58, integration: 55, support: 65, compliance: 60 },
    eaAlignment: "Non-compliant — CRM duplication violates rationalisation policy",
    lifecycleRecommendation: "Replace with Salesforce. Initiate CRM consolidation programme.",
  },
  {
    id: "APP-09",
    tab: "application-portfolio",
    name: "DEWA Data Warehouse (Legacy)",
    division: "Digital DEWA & Moro Hub",
    applicationType: "Analytics",
    healthScore: 58,
    technicalDebt: "Critical",
    lifecycleStage: "Retire",
    annualTCO: "AED 2.8M",
    riskFlag: "Being replaced by enterprise data mesh. Decommission timeline Q4 2026.",
    projectTag: "Net-Zero Carbon Tracking Platform",
    initiativeTag: "DEWA Enterprise Data Strategy",
    status: "Critical",
    vendor: "Teradata (Legacy)",
    hostingModel: "On-Premise",
    deploymentDate: "2009",
    insightsBreakdown: { performance: 55, security: 60, integration: 52, support: 45, compliance: 58 },
    eaAlignment: "Non-compliant — scheduled retirement, data migration in progress",
    lifecycleRecommendation: "Retire Q4 2026. Accelerate data migration to enterprise data mesh.",
  },
  {
    id: "APP-10",
    tab: "application-portfolio",
    name: "Moro Hub Cloud Platform",
    division: "Digital DEWA & Moro Hub",
    applicationType: "Other",
    healthScore: 96,
    technicalDebt: "None",
    lifecycleStage: "Optimise",
    annualTCO: "AED 8.2M",
    riskFlag: undefined,
    projectTag: undefined,
    initiativeTag: "Digital DEWA Programme",
    status: "On Track",
    vendor: "Moro Hub",
    hostingModel: "Cloud",
    deploymentDate: "2020",
    insightsBreakdown: { performance: 97, security: 96, integration: 95, support: 98, compliance: 96 },
    eaAlignment: "Fully compliant — primary cloud platform performing above benchmark",
    lifecycleRecommendation: "Optimise — continue capacity planning and cloud-native workload migration.",
  },
];

// ── Tab 2: Project Portfolio ──────────────────────────────────────────────

export interface ProjectCard {
  id: string;
  tab: "project-portfolio";
  name: string;
  division: DEWADivision;
  parentInitiative: string;
  ragStatus: RAGStatus;
  ragLabel: string;
  projectStatus: "Active" | "At Risk" | "On Hold" | "Completed" | "Scoping";
  progress: number;
  budgetHealth: "On Track" | "Overspent" | "Underspent";
  targetCompletion: string;
  isOverdue?: boolean;
  projectManager: string;
  eaAlignment: number;
  // Insights
  budgetAllocated?: string;
  budgetSpent?: string;
  milestonesTotal?: number;
  milestonesAchieved?: number;
  nextMilestone?: string;
  topRisk1?: string;
  topRisk2?: string;
}

export const projectCards: ProjectCard[] = [
  {
    id: "PRJ-01",
    tab: "project-portfolio",
    name: "Smart Meter Rollout Phase 2",
    division: "Distribution",
    parentInitiative: "Smart Grid Modernisation Programme",
    ragStatus: "Green",
    ragLabel: "HEALTHY — on track",
    projectStatus: "Active",
    progress: 67,
    budgetHealth: "On Track",
    targetCompletion: "Q3 2026",
    projectManager: "Eng. Fatima Al Rashidi",
    eaAlignment: 91,
    budgetAllocated: "AED 22M",
    budgetSpent: "AED 14.7M",
    milestonesTotal: 12,
    milestonesAchieved: 8,
    nextMilestone: "Phase 2B meter deployment — Jul 2026",
    topRisk1: "Supply chain delay for smart meter hardware",
    topRisk2: "Grid integration testing backlog",
  },
  {
    id: "PRJ-02",
    tab: "project-portfolio",
    name: "OT Network Segmentation",
    division: "Transmission",
    parentInitiative: "Smart Grid Modernisation Programme",
    ragStatus: "Red",
    ragLabel: "CRITICAL — immediate attention required",
    projectStatus: "At Risk",
    progress: 30,
    budgetHealth: "Overspent",
    targetCompletion: "Q2 2026",
    isOverdue: true,
    projectManager: "Eng. Khalid Al Mansouri",
    eaAlignment: 74,
    budgetAllocated: "AED 5.2M",
    budgetSpent: "AED 5.8M",
    milestonesTotal: 8,
    milestonesAchieved: 2,
    nextMilestone: "Zone 3 segmentation — overdue",
    topRisk1: "Specialist OT security resource shortage",
    topRisk2: "Legacy equipment incompatibility in substations",
  },
  {
    id: "PRJ-03",
    tab: "project-portfolio",
    name: "Rammas AI Enhancement",
    division: "Customer Services",
    parentInitiative: "Customer Experience Transformation",
    ragStatus: "Green",
    ragLabel: "HEALTHY — on track",
    projectStatus: "Active",
    progress: 45,
    budgetHealth: "On Track",
    targetCompletion: "Q4 2026",
    projectManager: "Mariam Al Suwaidi",
    eaAlignment: 87,
    budgetAllocated: "AED 4.8M",
    budgetSpent: "AED 2.1M",
    milestonesTotal: 6,
    milestonesAchieved: 3,
    nextMilestone: "Arabic NLP v2 model training — Aug 2026",
    topRisk1: "Training data quality for Arabic dialect variants",
    topRisk2: "Model accuracy KPI threshold not yet met",
  },
  {
    id: "PRJ-04",
    tab: "project-portfolio",
    name: "DTMP Stage 1 Rollout",
    division: "Corporate EA Office",
    parentInitiative: "DTMP Enterprise Rollout",
    ragStatus: "Amber",
    ragLabel: "MONITOR — risk of slippage",
    projectStatus: "Active",
    progress: 52,
    budgetHealth: "On Track",
    targetCompletion: "Q2 2026",
    projectManager: "Mercy Wangari",
    eaAlignment: 96,
    budgetAllocated: "AED 1.4M",
    budgetSpent: "AED 0.7M",
    milestonesTotal: 10,
    milestonesAchieved: 5,
    nextMilestone: "Portfolio Management module launch — Apr 2026",
    topRisk1: "Integration dependencies with Lifecycle module",
    topRisk2: "UAT sign-off timeline for all 6 marketplaces",
  },
  {
    id: "PRJ-05",
    tab: "project-portfolio",
    name: "Legacy Billing System Replacement",
    division: "Customer Services",
    parentInitiative: "Legacy Billing System Replacement",
    ragStatus: "Amber",
    ragLabel: "MONITOR — risk of slippage",
    projectStatus: "Scoping",
    progress: 8,
    budgetHealth: "On Track",
    targetCompletion: "Q4 2027",
    projectManager: "TBC",
    eaAlignment: 81,
    budgetAllocated: "AED 18M",
    budgetSpent: "AED 0.4M",
    milestonesTotal: 20,
    milestonesAchieved: 1,
    nextMilestone: "Vendor evaluation shortlist — May 2026",
    topRisk1: "PM resource not yet confirmed",
    topRisk2: "Vendor support EOL deadline creates hard constraint",
  },
  {
    id: "PRJ-06",
    tab: "project-portfolio",
    name: "Net-Zero Carbon Tracking Platform",
    division: "All Divisions",
    parentInitiative: "Net-Zero Architecture Programme",
    ragStatus: "Green",
    ragLabel: "HEALTHY — on track",
    projectStatus: "Scoping",
    progress: 10,
    budgetHealth: "On Track",
    targetCompletion: "Q1 2027",
    projectManager: "Dr. Ahmed Al Mansoori",
    eaAlignment: 88,
    budgetAllocated: "AED 12M",
    budgetSpent: "AED 0.6M",
    milestonesTotal: 15,
    milestonesAchieved: 1,
    nextMilestone: "Architecture blueprint approval — Jun 2026",
    topRisk1: "Cross-divisional data integration complexity",
    topRisk2: "Regulatory reporting standard finalisation pending",
  },
  {
    id: "PRJ-07",
    tab: "project-portfolio",
    name: "SharePoint Intranet Rebuild",
    division: "All Divisions",
    parentInitiative: "DTMP Enterprise Rollout",
    ragStatus: "Green",
    ragLabel: "HEALTHY — on track",
    projectStatus: "Completed",
    progress: 100,
    budgetHealth: "On Track",
    targetCompletion: "January 2026",
    projectManager: "Sara Al Blooshi",
    eaAlignment: 95,
    budgetAllocated: "AED 0.8M",
    budgetSpent: "AED 0.76M",
    milestonesTotal: 8,
    milestonesAchieved: 8,
    nextMilestone: "Project closed — delivered",
    topRisk1: "None — project completed successfully",
    topRisk2: "Post-launch adoption monitoring ongoing",
  },
  {
    id: "PRJ-08",
    tab: "project-portfolio",
    name: "Distribution IoT Sensor Network",
    division: "Distribution",
    parentInitiative: "Smart Grid Modernisation Programme",
    ragStatus: "Amber",
    ragLabel: "MONITOR — risk of slippage",
    projectStatus: "Active",
    progress: 41,
    budgetHealth: "On Track",
    targetCompletion: "Q3 2026",
    projectManager: "Eng. Omar Al Mazrouei",
    eaAlignment: 83,
    budgetAllocated: "AED 8.4M",
    budgetSpent: "AED 3.4M",
    milestonesTotal: 9,
    milestonesAchieved: 4,
    nextMilestone: "Zone 4 sensor deployment — Aug 2026",
    topRisk1: "Sensor hardware procurement lead times",
    topRisk2: "Network coverage gaps in southern distribution zones",
  },
  {
    id: "PRJ-09",
    tab: "project-portfolio",
    name: "Virtual Engineer AI Platform",
    division: "All Divisions",
    parentInitiative: "Virtual Engineer 2026 Programme",
    ragStatus: "Green",
    ragLabel: "HEALTHY — on track",
    projectStatus: "Active",
    progress: 58,
    budgetHealth: "On Track",
    targetCompletion: "December 2026",
    projectManager: "Eng. Hassan Al Dhaheri",
    eaAlignment: 89,
    budgetAllocated: "AED 28M",
    budgetSpent: "AED 16.2M",
    milestonesTotal: 12,
    milestonesAchieved: 7,
    nextMilestone: "Field engineer pilot — Sep 2026",
    topRisk1: "AI model accuracy for complex fault diagnosis",
    topRisk2: "Change management — field engineer adoption",
  },
  {
    id: "PRJ-10",
    tab: "project-portfolio",
    name: "Desalination Digital Twin Phase 1",
    division: "Water Services",
    parentInitiative: "Net-Zero Architecture Programme",
    ragStatus: "Amber",
    ragLabel: "MONITOR — risk of slippage",
    projectStatus: "Active",
    progress: 34,
    budgetHealth: "Underspent",
    targetCompletion: "Q4 2026",
    projectManager: "Eng. Aisha Al Mansoori",
    eaAlignment: 85,
    budgetAllocated: "AED 14M",
    budgetSpent: "AED 4.7M",
    milestonesTotal: 10,
    milestonesAchieved: 3,
    nextMilestone: "Plant 3 digital twin model validation — Oct 2026",
    topRisk1: "OT sensor data quality from legacy plant instrumentation",
    topRisk2: "Simulation model calibration timeline",
  },
];

// ── Tab 3: Transformation Initiatives ─────────────────────────────────────

export interface InitiativeCard {
  id: string;
  tab: "transformation-initiatives";
  name: string;
  division: DEWADivision;
  initiativeType: string;
  status: "Active" | "Scoping" | "At Risk" | "On Hold" | "Completed";
  eaAlignmentScore: number;
  projectsCount: number;
  programmeBudget: string;
  targetCompletion: string;
}

export const initiativeCards: InitiativeCard[] = [
  {
    id: "INI-01",
    tab: "transformation-initiatives",
    name: "Smart Grid Modernisation Programme",
    division: "Transmission",
    initiativeType: "Infrastructure Transformation",
    status: "Active",
    eaAlignmentScore: 92,
    projectsCount: 7,
    programmeBudget: "AED 145M",
    targetCompletion: "2027",
  },
  {
    id: "INI-02",
    tab: "transformation-initiatives",
    name: "Virtual Engineer 2026 Programme",
    division: "All Divisions",
    initiativeType: "AI Deployment",
    status: "Active",
    eaAlignmentScore: 89,
    projectsCount: 4,
    programmeBudget: "AED 28M",
    targetCompletion: "December 2026",
  },
  {
    id: "INI-03",
    tab: "transformation-initiatives",
    name: "DTMP Enterprise Rollout",
    division: "Corporate EA Office",
    initiativeType: "Platform Deployment",
    status: "Active",
    eaAlignmentScore: 96,
    projectsCount: 3,
    programmeBudget: "AED 4.2M",
    targetCompletion: "Q2 2026",
  },
  {
    id: "INI-04",
    tab: "transformation-initiatives",
    name: "Customer Experience Transformation",
    division: "Customer Services",
    initiativeType: "DXP Programme",
    status: "Active",
    eaAlignmentScore: 85,
    projectsCount: 4,
    programmeBudget: "AED 18M",
    targetCompletion: "Q4 2026",
  },
  {
    id: "INI-05",
    tab: "transformation-initiatives",
    name: "Net-Zero Architecture Programme",
    division: "All Divisions",
    initiativeType: "Net-Zero Technology",
    status: "Scoping",
    eaAlignmentScore: 88,
    projectsCount: 2,
    programmeBudget: "AED 62M",
    targetCompletion: "2030 (phased)",
  },
  {
    id: "INI-06",
    tab: "transformation-initiatives",
    name: "Legacy Billing System Replacement",
    division: "Customer Services",
    initiativeType: "Application Modernisation",
    status: "Scoping",
    eaAlignmentScore: 81,
    projectsCount: 1,
    programmeBudget: "AED 18M",
    targetCompletion: "Q4 2027",
  },
  {
    id: "INI-07",
    tab: "transformation-initiatives",
    name: "OT Network Security Remediation",
    division: "Transmission",
    initiativeType: "Architecture Remediation",
    status: "At Risk",
    eaAlignmentScore: 74,
    projectsCount: 2,
    programmeBudget: "AED 5.2M",
    targetCompletion: "Q2 2026",
  },
  {
    id: "INI-08",
    tab: "transformation-initiatives",
    name: "DEWA Enterprise Data Strategy",
    division: "Digital DEWA & Moro Hub",
    initiativeType: "Data Platform",
    status: "Active",
    eaAlignmentScore: 87,
    projectsCount: 3,
    programmeBudget: "AED 34M",
    targetCompletion: "2027",
  },
  {
    id: "INI-09",
    tab: "transformation-initiatives",
    name: "Distribution Smart Meter Programme",
    division: "Distribution",
    initiativeType: "Infrastructure Transformation",
    status: "Active",
    eaAlignmentScore: 91,
    projectsCount: 2,
    programmeBudget: "AED 22M",
    targetCompletion: "2027",
  },
  {
    id: "INI-10",
    tab: "transformation-initiatives",
    name: "EA Maturity Improvement — Water Services",
    division: "Water Services",
    initiativeType: "EA Maturity Improvement",
    status: "Active",
    eaAlignmentScore: 78,
    projectsCount: 1,
    programmeBudget: "AED 1.8M",
    targetCompletion: "Q4 2026",
  },
];

// ── Tab 4: Technology Rationalisation ────────────────────────────────────

export interface RationalisationCard {
  id: string;
  tab: "technology-rationalisation";
  overlapTitle: string;
  divisionsAffected: string;
  systemsInOverlap: string;
  annualOverlapCost: string;
  recommendation: "Consolidate" | "Migrate" | "Retire" | "Evaluate";
  consolidationTarget: string;
  complexity: Complexity;
  savingPotential: string;
  status: "Identified" | "Under Analysis" | "Initiative Active" | "Resolved";
  initiativeTag?: string;
}

export const rationalisationCards: RationalisationCard[] = [
  {
    id: "RAT-01",
    tab: "technology-rationalisation",
    overlapTitle: "CRM Platform Duplication",
    divisionsAffected: "Customer Services & Distribution",
    systemsInOverlap: "Salesforce + Custom CRM (Distribution)",
    annualOverlapCost: "AED 1.4M/year",
    recommendation: "Consolidate",
    consolidationTarget: "Standardise on Salesforce",
    complexity: "Medium",
    savingPotential: "AED 900K/year",
    status: "Identified",
  },
  {
    id: "RAT-02",
    tab: "technology-rationalisation",
    overlapTitle: "Video Conferencing Fragmentation",
    divisionsAffected: "All Divisions",
    systemsInOverlap: "Microsoft Teams + Zoom + Webex (division-specific)",
    annualOverlapCost: "AED 680K/year",
    recommendation: "Consolidate",
    consolidationTarget: "Standardise on Microsoft Teams",
    complexity: "Low",
    savingPotential: "AED 420K/year",
    status: "Initiative Active",
    initiativeTag: "Video Consolidation Initiative",
  },
  {
    id: "RAT-03",
    tab: "technology-rationalisation",
    overlapTitle: "Data Warehouse Proliferation",
    divisionsAffected: "Digital DEWA, Generation, Water Services",
    systemsInOverlap: "3 separate data warehouse instances",
    annualOverlapCost: "AED 3.2M/year",
    recommendation: "Consolidate",
    consolidationTarget: "Consolidate to enterprise data mesh",
    complexity: "High",
    savingPotential: "AED 2.1M/year",
    status: "Under Analysis",
  },
  {
    id: "RAT-04",
    tab: "technology-rationalisation",
    overlapTitle: "Legacy Middleware Layer",
    divisionsAffected: "Transmission & Distribution",
    systemsInOverlap: "IBM MQ + MuleSoft (separate instances)",
    annualOverlapCost: "AED 2.8M/year",
    recommendation: "Migrate",
    consolidationTarget: "Migrate to unified API gateway",
    complexity: "High",
    savingPotential: "AED 1.6M/year",
    status: "Identified",
  },
  {
    id: "RAT-05",
    tab: "technology-rationalisation",
    overlapTitle: "HR System Duplication",
    divisionsAffected: "All Divisions",
    systemsInOverlap: "SAP SuccessFactors + legacy HRMS (3 divisions)",
    annualOverlapCost: "AED 1.1M/year",
    recommendation: "Migrate",
    consolidationTarget: "Full migration to SuccessFactors",
    complexity: "Medium",
    savingPotential: "AED 780K/year",
    status: "Initiative Active",
    initiativeTag: "HR System Consolidation Initiative",
  },
  {
    id: "RAT-06",
    tab: "technology-rationalisation",
    overlapTitle: "Monitoring Tool Fragmentation",
    divisionsAffected: "Digital DEWA & Moro Hub",
    systemsInOverlap: "Datadog + Prometheus + Nagios (separate teams)",
    annualOverlapCost: "AED 560K/year",
    recommendation: "Consolidate",
    consolidationTarget: "Standardise on Datadog",
    complexity: "Low",
    savingPotential: "AED 340K/year",
    status: "Identified",
  },
  {
    id: "RAT-07",
    tab: "technology-rationalisation",
    overlapTitle: "Document Management Duplication",
    divisionsAffected: "All Divisions",
    systemsInOverlap: "SharePoint + local file servers + 3 separate DMS tools",
    annualOverlapCost: "AED 1.8M/year",
    recommendation: "Consolidate",
    consolidationTarget: "Consolidate to SharePoint Online",
    complexity: "Medium",
    savingPotential: "AED 1.1M/year",
    status: "Identified",
  },
];

// ── Tab 5: Governance Health ──────────────────────────────────────────────

export interface GovernanceCard {
  id: string;
  tab: "governance-health";
  division: DEWADivision;
  overallGovernanceScore: number;
  architectureCompliance: number;
  standardsMet: string;
  eaMaturityScore: number;
  eaMaturityTarget: number;
  criticalViolations: number;
  nonCompliantProjects: number;
  maturityGap: string;
  trend: GovernanceTrend;
  lastReviewed: string;
  trendPercent?: string;
}

export const governanceCards: GovernanceCard[] = [
  {
    id: "GOV-01",
    tab: "governance-health",
    division: "Corporate EA Office",
    overallGovernanceScore: 88,
    architectureCompliance: 91,
    standardsMet: "25 of 27 standards",
    eaMaturityScore: 3.8,
    eaMaturityTarget: 4.5,
    criticalViolations: 0,
    nonCompliantProjects: 0,
    maturityGap: "0.7 to 4.5 target",
    trend: "Improving",
    lastReviewed: "March 2026",
    trendPercent: "+5% last quarter",
  },
  {
    id: "GOV-02",
    tab: "governance-health",
    division: "Transmission",
    overallGovernanceScore: 71,
    architectureCompliance: 67,
    standardsMet: "18 of 27 standards",
    eaMaturityScore: 2.9,
    eaMaturityTarget: 3.5,
    criticalViolations: 2,
    nonCompliantProjects: 3,
    maturityGap: "0.6 to 3.5 target",
    trend: "Declining",
    lastReviewed: "February 2026",
    trendPercent: "-8% last quarter",
  },
  {
    id: "GOV-03",
    tab: "governance-health",
    division: "Distribution",
    overallGovernanceScore: 76,
    architectureCompliance: 79,
    standardsMet: "21 of 27 standards",
    eaMaturityScore: 3.1,
    eaMaturityTarget: 3.5,
    criticalViolations: 1,
    nonCompliantProjects: 1,
    maturityGap: "0.4 to 3.5 target",
    trend: "Improving",
    lastReviewed: "February 2026",
    trendPercent: "+3% last quarter",
  },
  {
    id: "GOV-04",
    tab: "governance-health",
    division: "Generation",
    overallGovernanceScore: 73,
    architectureCompliance: 74,
    standardsMet: "20 of 27 standards",
    eaMaturityScore: 2.8,
    eaMaturityTarget: 3.5,
    criticalViolations: 1,
    nonCompliantProjects: 2,
    maturityGap: "0.7 to 3.5 target",
    trend: "Stable",
    lastReviewed: "January 2026",
    trendPercent: "0% last quarter",
  },
  {
    id: "GOV-05",
    tab: "governance-health",
    division: "Water Services",
    overallGovernanceScore: 68,
    architectureCompliance: 72,
    standardsMet: "19 of 27 standards",
    eaMaturityScore: 2.6,
    eaMaturityTarget: 3.2,
    criticalViolations: 1,
    nonCompliantProjects: 2,
    maturityGap: "0.6 to 3.2 target",
    trend: "Declining",
    lastReviewed: "January 2026",
    trendPercent: "-4% last quarter",
  },
  {
    id: "GOV-06",
    tab: "governance-health",
    division: "Customer Services",
    overallGovernanceScore: 82,
    architectureCompliance: 85,
    standardsMet: "23 of 27 standards",
    eaMaturityScore: 3.2,
    eaMaturityTarget: 3.8,
    criticalViolations: 0,
    nonCompliantProjects: 2,
    maturityGap: "0.6 to 3.8 target",
    trend: "Improving",
    lastReviewed: "March 2026",
    trendPercent: "+6% last quarter",
  },
  {
    id: "GOV-07",
    tab: "governance-health",
    division: "Digital DEWA & Moro Hub",
    overallGovernanceScore: 90,
    architectureCompliance: 91,
    standardsMet: "25 of 27 standards",
    eaMaturityScore: 3.5,
    eaMaturityTarget: 4.0,
    criticalViolations: 0,
    nonCompliantProjects: 0,
    maturityGap: "0.5 to 4.0 target",
    trend: "Improving",
    lastReviewed: "March 2026",
    trendPercent: "+4% last quarter",
  },
];

// ── Tab 6: Operational Asset Digitisation ────────────────────────────────

export interface OADCard {
  id: string;
  tab: "operational-asset-digitisation";
  assetClassName: string;
  division: DEWADivision;
  totalAssets: string;
  digitisedCount: string;
  digitisedPercentage: number;
  remainingCount: string;
  status: PMCardStatus;
  targetDate: string;
  projectTag?: string;
  initiativeTag?: string;
  cardState: OADCardState;
  stateDetail?: string;
}

export const oadCards: OADCard[] = [
  {
    id: "OAD-01",
    tab: "operational-asset-digitisation",
    assetClassName: "Smart Meters",
    division: "Distribution",
    totalAssets: "1,247,000 meters",
    digitisedCount: "887,000",
    digitisedPercentage: 71,
    remainingCount: "360,000",
    status: "On Track",
    targetDate: "100% by 2027",
    projectTag: "Smart Meter Rollout Phase 2",
    initiativeTag: "Smart Grid Modernisation Programme",
    cardState: "On Track",
  },
  {
    id: "OAD-02",
    tab: "operational-asset-digitisation",
    assetClassName: "Transmission Substations — SCADA Integration",
    division: "Transmission",
    totalAssets: "84 substations",
    digitisedCount: "61",
    digitisedPercentage: 73,
    remainingCount: "23",
    status: "At Risk",
    targetDate: "100% by Q4 2026",
    projectTag: "OT Network Segmentation",
    initiativeTag: "Smart Grid Modernisation Programme",
    cardState: "At Risk",
    stateDetail: "3 critical substations behind schedule",
  },
  {
    id: "OAD-03",
    tab: "operational-asset-digitisation",
    assetClassName: "Desalination Plants — Digital Twin",
    division: "Water Services",
    totalAssets: "12 plants",
    digitisedCount: "7",
    digitisedPercentage: 58,
    remainingCount: "5",
    status: "On Track",
    targetDate: "100% by Q4 2026",
    projectTag: "Desalination Digital Twin Phase 1",
    initiativeTag: "Net-Zero Architecture Programme",
    cardState: "On Track",
  },
  {
    id: "OAD-04",
    tab: "operational-asset-digitisation",
    assetClassName: "Generation PLCs — Firmware Currency",
    division: "Generation",
    totalAssets: "340 PLCs",
    digitisedCount: "278",
    digitisedPercentage: 82,
    remainingCount: "62 — 14 critical EOL",
    status: "At Risk",
    targetDate: "100% current by Q2 2026",
    projectTag: undefined,
    initiativeTag: undefined,
    cardState: "At Risk",
    stateDetail: "14 critical end-of-life PLCs. No active project.",
  },
  {
    id: "OAD-05",
    tab: "operational-asset-digitisation",
    assetClassName: "Fleet Vehicles — EV Transition",
    division: "All Divisions",
    totalAssets: "1,847 vehicles",
    digitisedCount: "423",
    digitisedPercentage: 23,
    remainingCount: "1,424",
    status: "On Track",
    targetDate: "60% EV by 2030",
    projectTag: undefined,
    initiativeTag: "Digital DEWA Programme",
    cardState: "On Track",
  },
  {
    id: "OAD-06",
    tab: "operational-asset-digitisation",
    assetClassName: "Water Pumping Stations — IoT Sensors",
    division: "Water Services",
    totalAssets: "67 stations",
    digitisedCount: "41",
    digitisedPercentage: 61,
    remainingCount: "26",
    status: "On Track",
    targetDate: "100% by 2027",
    projectTag: "Distribution IoT Sensor Network",
    initiativeTag: "Smart Grid Modernisation Programme",
    cardState: "On Track",
  },
  {
    id: "OAD-07",
    tab: "operational-asset-digitisation",
    assetClassName: "Distribution Feeders — Smart Monitoring",
    division: "Distribution",
    totalAssets: "312 feeders",
    digitisedCount: "198",
    digitisedPercentage: 63,
    remainingCount: "114",
    status: "At Risk",
    targetDate: "100% by 2027",
    projectTag: "Distribution IoT Sensor Network",
    initiativeTag: "Smart Grid Modernisation Programme",
    cardState: "At Risk",
    stateDetail: "Some feeders delayed — southern zone coverage gaps",
  },
  {
    id: "OAD-08",
    tab: "operational-asset-digitisation",
    assetClassName: "Generation Assets — Predictive Maintenance",
    division: "Generation",
    totalAssets: "847 major assets",
    digitisedCount: "312",
    digitisedPercentage: 37,
    remainingCount: "535",
    status: "No Initiative",
    targetDate: "—",
    projectTag: undefined,
    initiativeTag: undefined,
    cardState: "Gap",
    stateDetail: "No active project or initiative. Gap state — EA Office action required.",
  },
  {
    id: "OAD-09",
    tab: "operational-asset-digitisation",
    assetClassName: "Water Pipelines — Leak Detection",
    division: "Water Services",
    totalAssets: "4,200 km pipeline",
    digitisedCount: "1,890 km",
    digitisedPercentage: 45,
    remainingCount: "2,310 km",
    status: "No Initiative",
    targetDate: "—",
    projectTag: undefined,
    initiativeTag: undefined,
    cardState: "Gap",
    stateDetail: "No active project or initiative. Gap state — EA Office action required.",
  },
  {
    id: "OAD-10",
    tab: "operational-asset-digitisation",
    assetClassName: "Solar Panel Arrays — Performance Monitoring",
    division: "Generation",
    totalAssets: "2.4 GW capacity",
    digitisedCount: "2.1 GW",
    digitisedPercentage: 88,
    remainingCount: "0.3 GW",
    status: "On Track",
    targetDate: "100% by Q3 2026",
    projectTag: undefined,
    initiativeTag: "Digital DEWA Programme",
    cardState: "On Track",
  },
];

// ── Service Request Types ─────────────────────────────────────────────────

export const PM_REPORT_TYPES: Record<PMTab, string[]> = {
  "application-portfolio": [
    "Application Health Assessment",
    "Application Rationalization Brief",
    "Total Cost of Ownership (TCO) Analysis",
    "Technical Debt Report",
    "Executive Application Summary (PPTX)",
    "Migration Readiness Assessment",
  ],
  "project-portfolio": [
    "Project Health Report",
    "Portfolio Status Dashboard Brief (PPTX)",
    "Project Recovery Assessment",
    "Resource Capacity Review",
    "Benefits Realisation Report",
    "Portfolio RAG Summary (PPTX)",
  ],
  "transformation-initiatives": [
    "Initiative Status Report",
    "Programme Health Presentation (PPTX)",
    "EA Alignment Assessment",
    "Strategic Alignment Review",
    "Initiative Dependency Map",
  ],
  "technology-rationalisation": [
    "Rationalisation Business Case",
    "Consolidation Roadmap",
    "Vendor Comparison Brief",
    "Impact Assessment",
    "Savings Realisation Report",
  ],
  "governance-health": [
    "EA Compliance Audit Report",
    "EA Maturity Assessment",
    "Architecture Review Board Pack (PPTX)",
    "Maturity Improvement Roadmap",
    "Governance Health Dashboard Brief (PPTX)",
    "Division Governance Scorecard",
  ],
  "operational-asset-digitisation": [
    "Digitisation Progress Report",
    "Milestone Summary Brief",
    "Stakeholder Update Brief",
    "Risk Assessment",
    "Recovery Options Brief",
    "Feasibility Assessment",
    "Benefits Realisation Report",
  ],
};

export const PM_SLA_MAP: Record<string, string> = {
  "Application Health Assessment": "3 business days",
  "Application Rationalization Brief": "3 business days",
  "Total Cost of Ownership (TCO) Analysis": "3 business days",
  "Technical Debt Report": "3 business days",
  "Executive Application Summary (PPTX)": "5 business days",
  "Migration Readiness Assessment": "5 business days",
  "Project Health Report": "48 hours",
  "Portfolio Status Dashboard Brief (PPTX)": "5 business days",
  "Project Recovery Assessment": "5 business days",
  "Resource Capacity Review": "5 business days",
  "Benefits Realisation Report": "5 business days",
  "Portfolio RAG Summary (PPTX)": "48 hours",
  "Initiative Status Report": "48 hours",
  "Programme Health Presentation (PPTX)": "5 business days",
  "EA Alignment Assessment": "3 business days",
  "Strategic Alignment Review": "5 business days",
  "Initiative Dependency Map": "5 business days",
  "Rationalisation Business Case": "5 business days",
  "Consolidation Roadmap": "5 business days",
  "Vendor Comparison Brief": "5 business days",
  "Impact Assessment": "5 business days",
  "Savings Realisation Report": "3 business days",
  "EA Compliance Audit Report": "3 business days",
  "EA Maturity Assessment": "3 business days",
  "Architecture Review Board Pack (PPTX)": "5 business days",
  "Maturity Improvement Roadmap": "5 business days",
  "Governance Health Dashboard Brief (PPTX)": "5 business days",
  "Division Governance Scorecard": "48 hours",
  "Digitisation Progress Report": "48 hours",
  "Milestone Summary Brief": "48 hours",
  "Stakeholder Update Brief": "48 hours",
  "Risk Assessment": "3 business days",
  "Recovery Options Brief": "5 business days",
  "Feasibility Assessment": "5 business days",
};

// ── Tab display config ────────────────────────────────────────────────────

export const PM_TAB_CONFIG: Record<
  PMTab,
  { label: string; description: string; gradient: string; headerColor: string }
> = {
  "application-portfolio": {
    label: "Application Portfolio",
    description: "Every software application in DEWA's estate",
    gradient: "from-blue-500 to-blue-700",
    headerColor: "bg-blue-600",
  },
  "project-portfolio": {
    label: "Project Portfolio",
    description: "All active projects — governance view",
    gradient: "from-purple-500 to-purple-700",
    headerColor: "bg-purple-600",
  },
  "transformation-initiatives": {
    label: "Transformation Initiatives",
    description: "Strategic transformation programmes",
    gradient: "from-emerald-500 to-emerald-700",
    headerColor: "bg-emerald-600",
  },
  "technology-rationalisation": {
    label: "Technology Rationalisation",
    description: "Identified duplication & consolidation opportunities",
    gradient: "from-amber-500 to-amber-700",
    headerColor: "bg-amber-600",
  },
  "governance-health": {
    label: "Governance Health",
    description: "Architecture compliance & EA maturity by division",
    gradient: "from-rose-500 to-rose-700",
    headerColor: "bg-rose-600",
  },
  "operational-asset-digitisation": {
    label: "Operational Asset Digitisation",
    description: "Physical asset digitisation progress",
    gradient: "from-teal-500 to-teal-700",
    headerColor: "bg-teal-600",
  },
};

export const DIVISION_COLORS: Record<string, string> = {
  Generation: "bg-yellow-100 text-yellow-800",
  Transmission: "bg-blue-100 text-blue-800",
  Distribution: "bg-green-100 text-green-800",
  "Water Services": "bg-cyan-100 text-cyan-800",
  "Customer Services": "bg-purple-100 text-purple-800",
  "Digital DEWA & Moro Hub": "bg-indigo-100 text-indigo-800",
  "All Divisions": "bg-gray-100 text-gray-700",
  "Corporate EA Office": "bg-orange-100 text-orange-800",
};

export const STATUS_COLORS: Record<string, string> = {
  "On Track": "bg-green-100 text-green-800 border-green-200",
  "At Risk": "bg-amber-100 text-amber-800 border-amber-200",
  Critical: "bg-red-100 text-red-800 border-red-200",
  Completed: "bg-gray-100 text-gray-700 border-gray-200",
  Scoping: "bg-blue-100 text-blue-800 border-blue-200",
  "No Initiative": "bg-orange-100 text-orange-800 border-orange-200",
};
