// ─────────────────────────────────────────────────────────────────────────────
// Shared Lifecycle ↔ Portfolio Store
// Pattern: localStorage-backed read/write helpers — matches requestState.ts
// src/data/shared/lifecyclePortfolioStore.ts
// ─────────────────────────────────────────────────────────────────────────────

// ── Types ─────────────────────────────────────────────────────────────────────

export type InitiativeStatus = "Active" | "Scoping" | "At Risk" | "On Hold" | "Completed";

export type InitiativeType =
  | "Architecture Remediation"
  | "Application Modernisation"
  | "Technology Rationalisation"
  | "AI Deployment"
  | "EA Maturity Improvement"
  | "DXP Programme"
  | "DWS Modernisation"
  | "IT/OT Convergence"
  | "Net-Zero Technology"
  | "Security Uplift"
  | "Data Platform"
  | "Platform Deployment"
  | "Digital"
  | "Operational"
  | "Strategic"
  | "Innovation";

export type RAGStatus = "Green" | "Amber" | "Red";
export type BudgetHealth = "On Track" | "At Risk" | "Over Budget";
export type MilestoneStatus = "Complete" | "In Progress" | "Not Started" | "Delayed";

export type Division =
  | "Generation"
  | "Transmission"
  | "Distribution"
  | "Water"
  | "Customer Services"
  | "Corporate & Strategy"
  | "Business Support & HR"
  | "Innovation & AI"
  | "DEWA Group Subsidiaries"
  | "All Divisions";

export interface Milestone {
  id: string;
  name: string;
  status: MilestoneStatus;
  dueDate: string;
  owner?: string;
}

export interface Risk {
  id: string;
  title: string;
  severity: "Critical" | "High" | "Medium" | "Low";
  likelihood: "High" | "Medium" | "Low";
  impact: string;
  mitigation: string;
  owner: string;
  mitigationDueDate: string;
  status: "Open" | "Mitigated" | "Accepted" | "Closed";
}

export interface Blocker {
  id: string;
  title: string;
  projectId?: string;
  raisedBy: string;
  dateRaised: string;
  whatIsNeeded: string;
  escalationStatus: "Not Escalated" | "Escalated to TO" | "Escalated to Division Head";
  resolved: boolean;
  resolvedNote?: string;
}

export interface Project {
  id: string;
  parentInitiativeId: string;
  name: string;
  division: Division;
  pmName: string;
  rag: RAGStatus;
  progress: number;
  budgetHealth: BudgetHealth;
  budget: number;
  budgetSpent: number;
  targetDate: string;
  milestones: Milestone[];
  risks: Risk[];
  blockers: Blocker[];
  updatedAt: string;
}

export interface Initiative {
  id: string;
  name: string;
  division: Division;
  type: InitiativeType;
  status: InitiativeStatus;
  progress: number;
  eaAlignmentScore: number | null; // null = not yet assessed
  budget: number | null; // null = TBC
  budgetSpent: number;
  targetDate: string;
  owner: string;
  description: string;
  projects: string[];
  fromPortfolio?: boolean;
  portfolioCardId?: string;
  updatedAt: string;
}

export interface PortfolioStore {
  initiatives: Initiative[];
  projects: Project[];
}

// ── Seed data — 10 DEWA initiatives from spec ────────────────────────────────

const SEED_INITIATIVES: Initiative[] = [
  {
    id: "init-s01",
    name: "Smart Grid Modernisation Programme",
    division: "Transmission",
    type: "IT/OT Convergence",
    status: "Active",
    progress: 58,
    eaAlignmentScore: 92,
    budget: 145_000_000,
    budgetSpent: 84_100_000,
    targetDate: "2027-12-31",
    owner: "Eng. Khalid Al Rashidi",
    description:
      "Smart Grid Strategy 2021–2035 — primary execution vehicle. 7 projects spanning SCADA integration, smart meter rollout, distribution IoT sensors, OT security remediation, substation modernisation, demand response platform, and grid analytics.",
    projects: ["proj-s01", "proj-s02", "proj-s03", "proj-s04", "proj-s05", "proj-s06", "proj-s07"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-s02",
    name: "Virtual Engineer 2026 Programme",
    division: "All Divisions",
    type: "AI Deployment",
    status: "Active",
    progress: 45,
    eaAlignmentScore: 89,
    budget: 28_000_000,
    budgetSpent: 12_600_000,
    targetDate: "2026-12-31",
    owner: "Eng. Hassan Al Dhaheri",
    description:
      "AI-powered engineering assistant platform. Projects: AI platform deployment, knowledge base build, OT system integration, division rollout.",
    projects: ["proj-s08", "proj-s09", "proj-s10", "proj-s11"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-s03",
    name: "DTMP Enterprise Rollout",
    division: "Corporate & Strategy",
    type: "Platform Deployment",
    status: "Active",
    progress: 52,
    eaAlignmentScore: 96,
    budget: 4_200_000,
    budgetSpent: 2_184_000,
    targetDate: "2026-06-30",
    owner: "Mercy Wangari",
    description:
      "DTMP deployment across all DEWA divisions. Projects: Stage 1 marketplace contextualisation, Stage 2/3 activation, division onboarding.",
    projects: ["proj-s12", "proj-s13", "proj-s14"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-s04",
    name: "Customer Experience Transformation",
    division: "Customer Services",
    type: "DXP Programme",
    status: "Active",
    progress: 41,
    eaAlignmentScore: 85,
    budget: 18_000_000,
    budgetSpent: 7_380_000,
    targetDate: "2026-12-31",
    owner: "Mariam Al Suwaidi",
    description:
      "Services 360 delivery. Projects: CX platform deployment, Rammas AI enhancement, mobile app modernisation, contact centre integration.",
    projects: ["proj-s15", "proj-s16", "proj-s17", "proj-s18"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-s05",
    name: "Net-Zero Architecture Programme",
    division: "All Divisions",
    type: "Net-Zero Technology",
    status: "Scoping",
    progress: 10,
    eaAlignmentScore: 88,
    budget: 62_000_000,
    budgetSpent: 6_200_000,
    targetDate: "2030-12-31",
    owner: "Dr. Ahmed Al Mansoori",
    description:
      "Architecture programme to align DEWA's technology estate to Net-Zero 2050 targets. Scoping: Carbon tracking platform, Net-Zero architecture standards.",
    projects: ["proj-s19", "proj-s20"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-s06",
    name: "Legacy Billing System Replacement",
    division: "Customer Services",
    type: "Application Modernisation",
    status: "Scoping",
    progress: 8,
    eaAlignmentScore: 81,
    budget: 18_000_000,
    budgetSpent: 1_440_000,
    targetDate: "2027-12-31",
    owner: "TBC",
    description:
      "Replace end-of-life BIS-3 billing system. Critical — vendor support ending Q3 2026. Currently in options analysis phase.",
    projects: ["proj-s21"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-s07",
    name: "OT Network Security Remediation",
    division: "Transmission",
    type: "Security Uplift",
    status: "At Risk",
    progress: 30,
    eaAlignmentScore: 74,
    budget: 5_200_000,
    budgetSpent: 3_640_000,
    targetDate: "2026-06-30",
    owner: "Eng. Sara Al Blooshi",
    description:
      "Remediate architecture compliance violations in Transmission's OT network. At Risk — budget overrun, milestone missed. Recovery plan in progress.",
    projects: ["proj-s22", "proj-s23"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-s08",
    name: "DEWA Enterprise Data Strategy",
    division: "Innovation & AI",
    type: "Data Platform",
    status: "Active",
    progress: 34,
    eaAlignmentScore: 87,
    budget: 34_000_000,
    budgetSpent: 11_560_000,
    targetDate: "2027-12-31",
    owner: "Omar Al Mazrouei",
    description:
      "Enterprise data mesh deployment. Projects: Data mesh architecture, data catalogue, analytics platform modernisation.",
    projects: ["proj-s24", "proj-s25", "proj-s26"],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-s09",
    name: "Generation PLC Firmware Remediation",
    division: "Generation",
    type: "Architecture Remediation",
    status: "Scoping",
    progress: 5,
    eaAlignmentScore: null,
    budget: null,
    budgetSpent: 0,
    targetDate: "2026-06-30",
    owner: "TBC",
    description:
      "Remediate 14 critical end-of-life PLCs in Generation. Initiated from Portfolio Management Operational Asset Digitisation gap state. Just started.",
    projects: ["proj-s27"],
    fromPortfolio: true,
    portfolioCardId: "OAD-04",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "init-s10",
    name: "EA Maturity Improvement — Water Services",
    division: "Water",
    type: "EA Maturity Improvement",
    status: "Active",
    progress: 22,
    eaAlignmentScore: 78,
    budget: 1_800_000,
    budgetSpent: 396_000,
    targetDate: "2026-12-31",
    owner: "Eng. Aisha Al Mansoori",
    description:
      "Structured programme to advance Water Services EA maturity from 2.6 to 3.2 against EA 4.0 benchmark.",
    projects: ["proj-s28"],
    updatedAt: new Date().toISOString(),
  },
];

const SEED_PROJECTS: Project[] = [
  // init-s01: Smart Grid Modernisation Programme (7 projects)
  {
    id: "proj-s01",
    parentInitiativeId: "init-s01",
    name: "SCADA Integration Layer",
    division: "Transmission",
    pmName: "Eng. Faisal Al Hammadi",
    rag: "Green",
    progress: 75,
    budgetHealth: "On Track",
    budget: 18_000_000,
    budgetSpent: 13_500_000,
    targetDate: "2025-09-30",
    milestones: [
      { id: "ms-s01-1", name: "Architecture Design Approved", status: "Complete", dueDate: "2024-12-01", owner: "EA Office" },
      { id: "ms-s01-2", name: "Vendor Selection Complete", status: "Complete", dueDate: "2025-01-15", owner: "Procurement" },
      { id: "ms-s01-3", name: "Integration Development", status: "In Progress", dueDate: "2025-07-31", owner: "Delivery Team" },
      { id: "ms-s01-4", name: "UAT & Go-Live", status: "Not Started", dueDate: "2025-09-30", owner: "Eng. Faisal Al Hammadi" },
    ],
    risks: [
      { id: "risk-s01-1", title: "Vendor delivery delay risk", severity: "Medium", likelihood: "Medium", impact: "Could delay UAT by 4-6 weeks", mitigation: "Weekly delivery checkpoints with vendor", owner: "Eng. Faisal Al Hammadi", mitigationDueDate: "2025-07-31", status: "Open" },
    ],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s02",
    parentInitiativeId: "init-s01",
    name: "Smart Meter Rollout — Phase 2",
    division: "Distribution",
    pmName: "Eng. Noor Al Zaabi",
    rag: "Amber",
    progress: 48,
    budgetHealth: "At Risk",
    budget: 32_000_000,
    budgetSpent: 15_360_000,
    targetDate: "2026-06-30",
    milestones: [
      { id: "ms-s02-1", name: "Phase 2 Planning Approved", status: "Complete", dueDate: "2025-02-28", owner: "PMO" },
      { id: "ms-s02-2", name: "Hardware Procurement", status: "In Progress", dueDate: "2025-08-31", owner: "Procurement" },
      { id: "ms-s02-3", name: "Installation Campaign Zone 1", status: "Not Started", dueDate: "2026-03-31", owner: "Eng. Noor Al Zaabi" },
      { id: "ms-s02-4", name: "Full Rollout Complete", status: "Not Started", dueDate: "2026-06-30", owner: "Eng. Noor Al Zaabi" },
    ],
    risks: [
      { id: "risk-s02-1", title: "Hardware supply chain delay", severity: "High", likelihood: "Medium", impact: "Meter delivery delay 8-12 weeks, budget overrun AED 2.4M", mitigation: "Dual-source procurement strategy in progress", owner: "Procurement", mitigationDueDate: "2025-07-31", status: "Open" },
    ],
    blockers: [
      { id: "blk-s02-1", title: "Vendor payment confirmation pending", projectId: "proj-s02", raisedBy: "Eng. Noor Al Zaabi", dateRaised: "2025-03-10", whatIsNeeded: "Procurement to confirm payment processing to vendor", escalationStatus: "Not Escalated", resolved: false },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s03",
    parentInitiativeId: "init-s01",
    name: "Distribution IoT Sensor Network",
    division: "Distribution",
    pmName: "Eng. Saeed Al Ketbi",
    rag: "Green",
    progress: 60,
    budgetHealth: "On Track",
    budget: 22_000_000,
    budgetSpent: 13_200_000,
    targetDate: "2026-03-31",
    milestones: [
      { id: "ms-s03-1", name: "Pilot Zone Sensors Active", status: "Complete", dueDate: "2025-03-31", owner: "Eng. Saeed Al Ketbi" },
      { id: "ms-s03-2", name: "Zone 2–4 Deployment", status: "In Progress", dueDate: "2025-10-31", owner: "Delivery Team" },
      { id: "ms-s03-3", name: "Full Network Coverage", status: "Not Started", dueDate: "2026-03-31", owner: "Eng. Saeed Al Ketbi" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s04",
    parentInitiativeId: "init-s01",
    name: "OT Substation Security Uplift",
    division: "Transmission",
    pmName: "Eng. Sara Al Blooshi",
    rag: "Red",
    progress: 28,
    budgetHealth: "Over Budget",
    budget: 14_000_000,
    budgetSpent: 9_800_000,
    targetDate: "2026-06-30",
    milestones: [
      { id: "ms-s04-1", name: "IEC 62443 Gap Assessment", status: "Complete", dueDate: "2024-12-31", owner: "Security Team" },
      { id: "ms-s04-2", name: "Network Segmentation Design", status: "Delayed", dueDate: "2025-04-30", owner: "Architecture" },
      { id: "ms-s04-3", name: "Implementation Phase 1", status: "Not Started", dueDate: "2026-01-31", owner: "Eng. Sara Al Blooshi" },
    ],
    risks: [
      { id: "risk-s04-1", title: "Budget overrun — specialist contractor rates", severity: "Critical", likelihood: "High", impact: "AED 2.8M overrun already realised, further overrun projected", mitigation: "TO recovery plan requested. Scope reduction under review.", owner: "Eng. Sara Al Blooshi", mitigationDueDate: "2025-05-31", status: "Open" },
    ],
    blockers: [
      { id: "blk-s04-1", title: "Architecture review board decision pending", projectId: "proj-s04", raisedBy: "Eng. Sara Al Blooshi", dateRaised: "2025-03-01", whatIsNeeded: "ARB to approve revised network segmentation design", escalationStatus: "Escalated to TO", resolved: false },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s05",
    parentInitiativeId: "init-s01",
    name: "Demand Response Platform",
    division: "Generation",
    pmName: "Eng. Hamad Al Kaabi",
    rag: "Green",
    progress: 55,
    budgetHealth: "On Track",
    budget: 20_000_000,
    budgetSpent: 11_000_000,
    targetDate: "2026-09-30",
    milestones: [
      { id: "ms-s05-1", name: "Platform Architecture Signed Off", status: "Complete", dueDate: "2025-01-31", owner: "EA Office" },
      { id: "ms-s05-2", name: "Core Platform Build", status: "In Progress", dueDate: "2025-08-31", owner: "Delivery Team" },
      { id: "ms-s05-3", name: "Integration Testing", status: "Not Started", dueDate: "2026-03-31", owner: "QA Team" },
      { id: "ms-s05-4", name: "Go-Live", status: "Not Started", dueDate: "2026-09-30", owner: "Eng. Hamad Al Kaabi" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s06",
    parentInitiativeId: "init-s01",
    name: "Grid Analytics Dashboard",
    division: "Transmission",
    pmName: "Eng. Layla Al Mansoori",
    rag: "Green",
    progress: 68,
    budgetHealth: "On Track",
    budget: 8_000_000,
    budgetSpent: 5_440_000,
    targetDate: "2025-11-30",
    milestones: [
      { id: "ms-s06-1", name: "Data Model Finalised", status: "Complete", dueDate: "2025-01-31", owner: "Data Team" },
      { id: "ms-s06-2", name: "Dashboard Prototype", status: "Complete", dueDate: "2025-03-31", owner: "UX Team" },
      { id: "ms-s06-3", name: "Live Data Integration", status: "In Progress", dueDate: "2025-09-30", owner: "Integration Team" },
      { id: "ms-s06-4", name: "Executive Rollout", status: "Not Started", dueDate: "2025-11-30", owner: "Eng. Layla Al Mansoori" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s07",
    parentInitiativeId: "init-s01",
    name: "Substation Modernisation Programme",
    division: "Transmission",
    pmName: "Eng. Khalid Al Rashidi",
    rag: "Amber",
    progress: 40,
    budgetHealth: "On Track",
    budget: 31_000_000,
    budgetSpent: 12_400_000,
    targetDate: "2027-06-30",
    milestones: [
      { id: "ms-s07-1", name: "Priority Substations Identified", status: "Complete", dueDate: "2025-02-28", owner: "Engineering" },
      { id: "ms-s07-2", name: "Pilot Substation Complete", status: "In Progress", dueDate: "2025-09-30", owner: "Delivery Team" },
      { id: "ms-s07-3", name: "Phase 2 Deployment", status: "Not Started", dueDate: "2026-12-31", owner: "Eng. Khalid Al Rashidi" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },

  // init-s02: Virtual Engineer 2026 (4 projects)
  {
    id: "proj-s08",
    parentInitiativeId: "init-s02",
    name: "AI Platform Deployment",
    division: "Innovation & AI",
    pmName: "Eng. Hassan Al Dhaheri",
    rag: "Green",
    progress: 60,
    budgetHealth: "On Track",
    budget: 12_000_000,
    budgetSpent: 7_200_000,
    targetDate: "2026-06-30",
    milestones: [
      { id: "ms-s08-1", name: "Infrastructure Provisioned", status: "Complete", dueDate: "2025-02-28", owner: "Infra Team" },
      { id: "ms-s08-2", name: "Core AI Engine Live", status: "In Progress", dueDate: "2025-09-30", owner: "AI Team" },
      { id: "ms-s08-3", name: "Division Alpha Users Onboarded", status: "Not Started", dueDate: "2026-03-31", owner: "Eng. Hassan Al Dhaheri" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s09",
    parentInitiativeId: "init-s02",
    name: "Engineering Knowledge Base Build",
    division: "All Divisions",
    pmName: "Fatima Al Hashimi",
    rag: "Green",
    progress: 45,
    budgetHealth: "On Track",
    budget: 6_000_000,
    budgetSpent: 2_700_000,
    targetDate: "2026-09-30",
    milestones: [
      { id: "ms-s09-1", name: "Content Architecture Defined", status: "Complete", dueDate: "2025-03-31", owner: "Knowledge Team" },
      { id: "ms-s09-2", name: "Division 1 & 2 Content Ingested", status: "In Progress", dueDate: "2025-10-31", owner: "Fatima Al Hashimi" },
      { id: "ms-s09-3", name: "All Divisions Complete", status: "Not Started", dueDate: "2026-09-30", owner: "Fatima Al Hashimi" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s10",
    parentInitiativeId: "init-s02",
    name: "OT System Integration",
    division: "Transmission",
    pmName: "Eng. Rashed Al Suwaidi",
    rag: "Amber",
    progress: 30,
    budgetHealth: "On Track",
    budget: 7_000_000,
    budgetSpent: 2_100_000,
    targetDate: "2026-12-31",
    milestones: [
      { id: "ms-s10-1", name: "OT Data Schema Mapped", status: "Complete", dueDate: "2025-04-30", owner: "OT Team" },
      { id: "ms-s10-2", name: "Secure Integration Architecture Approved", status: "In Progress", dueDate: "2025-09-30", owner: "EA Office" },
      { id: "ms-s10-3", name: "Integration Live", status: "Not Started", dueDate: "2026-12-31", owner: "Eng. Rashed Al Suwaidi" },
    ],
    risks: [
      { id: "risk-s10-1", title: "OT security constraints limiting integration depth", severity: "High", likelihood: "Medium", impact: "AI may have read-only access only — reduced capability", mitigation: "Working with CISO to define approved access model", owner: "Security Team", mitigationDueDate: "2025-09-30", status: "Open" },
    ],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s11",
    parentInitiativeId: "init-s02",
    name: "Division Rollout Programme",
    division: "All Divisions",
    pmName: "Eng. Hassan Al Dhaheri",
    rag: "Green",
    progress: 15,
    budgetHealth: "On Track",
    budget: 3_000_000,
    budgetSpent: 450_000,
    targetDate: "2026-12-31",
    milestones: [
      { id: "ms-s11-1", name: "Rollout Strategy Approved", status: "In Progress", dueDate: "2025-07-31", owner: "PMO" },
      { id: "ms-s11-2", name: "Generation & Transmission Rollout", status: "Not Started", dueDate: "2026-06-30", owner: "Change Team" },
      { id: "ms-s11-3", name: "All Divisions Onboarded", status: "Not Started", dueDate: "2026-12-31", owner: "Eng. Hassan Al Dhaheri" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },

  // init-s03: DTMP Enterprise Rollout (3 projects)
  {
    id: "proj-s12",
    parentInitiativeId: "init-s03",
    name: "Stage 1 Marketplace Contextualisation",
    division: "Corporate & Strategy",
    pmName: "Mercy Wangari",
    rag: "Green",
    progress: 70,
    budgetHealth: "On Track",
    budget: 1_200_000,
    budgetSpent: 840_000,
    targetDate: "2025-09-30",
    milestones: [
      { id: "ms-s12-1", name: "All Marketplaces Live", status: "In Progress", dueDate: "2025-09-30", owner: "Mercy Wangari" },
      { id: "ms-s12-2", name: "Division Contextualisation Complete", status: "Not Started", dueDate: "2025-09-30", owner: "EA Office" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s13",
    parentInitiativeId: "init-s03",
    name: "Stage 2 & 3 Activation",
    division: "Corporate & Strategy",
    pmName: "Mercy Wangari",
    rag: "Green",
    progress: 45,
    budgetHealth: "On Track",
    budget: 1_800_000,
    budgetSpent: 810_000,
    targetDate: "2025-12-31",
    milestones: [
      { id: "ms-s13-1", name: "Stage 2 Dashboards Deployed", status: "In Progress", dueDate: "2025-10-31", owner: "Dev Team" },
      { id: "ms-s13-2", name: "Stage 3 TO Access Configured", status: "Not Started", dueDate: "2025-11-30", owner: "IT Ops" },
      { id: "ms-s13-3", name: "Full Platform Handover", status: "Not Started", dueDate: "2025-12-31", owner: "Mercy Wangari" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s14",
    parentInitiativeId: "init-s03",
    name: "Division Onboarding Programme",
    division: "All Divisions",
    pmName: "Noura Al Shamsi",
    rag: "Amber",
    progress: 35,
    budgetHealth: "On Track",
    budget: 1_200_000,
    budgetSpent: 420_000,
    targetDate: "2026-06-30",
    milestones: [
      { id: "ms-s14-1", name: "Onboarding Materials Published", status: "Complete", dueDate: "2025-04-30", owner: "L&D Team" },
      { id: "ms-s14-2", name: "Generation & Transmission Onboarded", status: "In Progress", dueDate: "2025-09-30", owner: "Noura Al Shamsi" },
      { id: "ms-s14-3", name: "All Divisions Onboarded", status: "Not Started", dueDate: "2026-06-30", owner: "Noura Al Shamsi" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },

  // init-s04: Customer Experience Transformation (4 projects)
  {
    id: "proj-s15",
    parentInitiativeId: "init-s04",
    name: "CX Platform Deployment",
    division: "Customer Services",
    pmName: "Mariam Al Suwaidi",
    rag: "Green",
    progress: 55,
    budgetHealth: "On Track",
    budget: 7_000_000,
    budgetSpent: 3_850_000,
    targetDate: "2026-09-30",
    milestones: [
      { id: "ms-s15-1", name: "UX Research & Design Complete", status: "Complete", dueDate: "2025-02-28", owner: "UX Team" },
      { id: "ms-s15-2", name: "Beta Launch", status: "In Progress", dueDate: "2025-09-30", owner: "Dev Team" },
      { id: "ms-s15-3", name: "Full Rollout", status: "Not Started", dueDate: "2026-09-30", owner: "Mariam Al Suwaidi" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s16",
    parentInitiativeId: "init-s04",
    name: "Rammas AI Enhancement",
    division: "Customer Services",
    pmName: "Ahmed Al Neyadi",
    rag: "Green",
    progress: 50,
    budgetHealth: "On Track",
    budget: 4_000_000,
    budgetSpent: 2_000_000,
    targetDate: "2026-06-30",
    milestones: [
      { id: "ms-s16-1", name: "NLP Model Upgrade", status: "Complete", dueDate: "2025-03-31", owner: "AI Team" },
      { id: "ms-s16-2", name: "Arabic Language Enhancement", status: "In Progress", dueDate: "2025-09-30", owner: "AI Team" },
      { id: "ms-s16-3", name: "Production Deployment", status: "Not Started", dueDate: "2026-06-30", owner: "Ahmed Al Neyadi" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s17",
    parentInitiativeId: "init-s04",
    name: "Mobile App Modernisation",
    division: "Customer Services",
    pmName: "Amal Al Rashdi",
    rag: "Amber",
    progress: 30,
    budgetHealth: "On Track",
    budget: 4_500_000,
    budgetSpent: 1_350_000,
    targetDate: "2026-12-31",
    milestones: [
      { id: "ms-s17-1", name: "App Architecture Review", status: "Complete", dueDate: "2025-03-31", owner: "EA Office" },
      { id: "ms-s17-2", name: "Redesign & Build", status: "In Progress", dueDate: "2026-06-30", owner: "Dev Team" },
      { id: "ms-s17-3", name: "Store Release", status: "Not Started", dueDate: "2026-12-31", owner: "Amal Al Rashdi" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s18",
    parentInitiativeId: "init-s04",
    name: "Contact Centre Integration",
    division: "Customer Services",
    pmName: "Mariam Al Suwaidi",
    rag: "Red",
    progress: 18,
    budgetHealth: "Over Budget",
    budget: 2_500_000,
    budgetSpent: 1_750_000,
    targetDate: "2026-06-30",
    milestones: [
      { id: "ms-s18-1", name: "Integration Specification", status: "Complete", dueDate: "2025-01-31", owner: "Architecture" },
      { id: "ms-s18-2", name: "API Gateway Configuration", status: "Delayed", dueDate: "2025-06-30", owner: "Integration Team" },
      { id: "ms-s18-3", name: "Go-Live", status: "Not Started", dueDate: "2026-06-30", owner: "Mariam Al Suwaidi" },
    ],
    risks: [
      { id: "risk-s18-1", title: "Third-party API compatibility issues", severity: "High", likelihood: "High", impact: "Integration blocked — milestone missed, budget overrun", mitigation: "Vendor escalation raised. Alternative integration approach under assessment.", owner: "Mariam Al Suwaidi", mitigationDueDate: "2025-06-30", status: "Open" },
    ],
    blockers: [
      { id: "blk-s18-1", title: "Vendor API documentation incomplete", projectId: "proj-s18", raisedBy: "Mariam Al Suwaidi", dateRaised: "2025-04-01", whatIsNeeded: "Vendor to provide complete API documentation for contact centre system", escalationStatus: "Escalated to TO", resolved: false },
    ],
    updatedAt: new Date().toISOString(),
  },

  // init-s05: Net-Zero Architecture Programme (2 scoping projects)
  {
    id: "proj-s19",
    parentInitiativeId: "init-s05",
    name: "Carbon Tracking Platform Scoping",
    division: "All Divisions",
    pmName: "Dr. Ahmed Al Mansoori",
    rag: "Green",
    progress: 15,
    budgetHealth: "On Track",
    budget: 5_000_000,
    budgetSpent: 750_000,
    targetDate: "2026-06-30",
    milestones: [
      { id: "ms-s19-1", name: "Regulatory Framework Mapped", status: "Complete", dueDate: "2025-04-30", owner: "Sustainability Office" },
      { id: "ms-s19-2", name: "Scoping Report Delivered", status: "In Progress", dueDate: "2025-10-31", owner: "Dr. Ahmed Al Mansoori" },
      { id: "ms-s19-3", name: "Business Case Approved", status: "Not Started", dueDate: "2026-06-30", owner: "CFO Office" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s20",
    parentInitiativeId: "init-s05",
    name: "Net-Zero Architecture Standards Development",
    division: "Corporate & Strategy",
    pmName: "Eng. Mohammed Al Falasi",
    rag: "Green",
    progress: 8,
    budgetHealth: "On Track",
    budget: 2_000_000,
    budgetSpent: 160_000,
    targetDate: "2026-12-31",
    milestones: [
      { id: "ms-s20-1", name: "Standards Framework Defined", status: "In Progress", dueDate: "2025-12-31", owner: "EA Office" },
      { id: "ms-s20-2", name: "ARB Review & Approval", status: "Not Started", dueDate: "2026-06-30", owner: "ARB" },
      { id: "ms-s20-3", name: "Standards Published", status: "Not Started", dueDate: "2026-12-31", owner: "Eng. Mohammed Al Falasi" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },

  // init-s06: Legacy Billing System (1 scoping project)
  {
    id: "proj-s21",
    parentInitiativeId: "init-s06",
    name: "BIS-3 Options Analysis",
    division: "Customer Services",
    pmName: "TBC",
    rag: "Amber",
    progress: 8,
    budgetHealth: "On Track",
    budget: 2_000_000,
    budgetSpent: 160_000,
    targetDate: "2025-12-31",
    milestones: [
      { id: "ms-s21-1", name: "Current State Assessment", status: "In Progress", dueDate: "2025-07-31", owner: "Architecture" },
      { id: "ms-s21-2", name: "Options Report Delivered", status: "Not Started", dueDate: "2025-12-31", owner: "TBC" },
    ],
    risks: [
      { id: "risk-s21-1", title: "BIS-3 vendor support ending Q3 2026", severity: "Critical", likelihood: "High", impact: "Unsupported billing system in production — compliance and operational risk", mitigation: "Accelerated options analysis. Emergency vendor support extension negotiation.", owner: "TBC", mitigationDueDate: "2025-12-31", status: "Open" },
    ],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },

  // init-s07: OT Network Security Remediation (2 projects)
  {
    id: "proj-s22",
    parentInitiativeId: "init-s07",
    name: "OT Network Segmentation",
    division: "Transmission",
    pmName: "Eng. Sara Al Blooshi",
    rag: "Red",
    progress: 25,
    budgetHealth: "Over Budget",
    budget: 3_000_000,
    budgetSpent: 2_400_000,
    targetDate: "2026-03-31",
    milestones: [
      { id: "ms-s22-1", name: "IEC 62443 Gap Analysis Complete", status: "Complete", dueDate: "2024-12-31", owner: "Security Team" },
      { id: "ms-s22-2", name: "Segmentation Architecture Approved", status: "Delayed", dueDate: "2025-03-31", owner: "ARB" },
      { id: "ms-s22-3", name: "Implementation Complete", status: "Not Started", dueDate: "2026-03-31", owner: "Eng. Sara Al Blooshi" },
    ],
    risks: [
      { id: "risk-s22-1", title: "Budget overrun — specialist OT security rates", severity: "Critical", likelihood: "High", impact: "AED 1.4M overrun already realised. Programme at risk of suspension.", mitigation: "Recovery plan submitted to TO. Scope reduction and phase extension under review.", owner: "Eng. Sara Al Blooshi", mitigationDueDate: "2025-05-31", status: "Open" },
    ],
    blockers: [
      { id: "blk-s22-1", title: "ARB approval for segmentation design outstanding", projectId: "proj-s22", raisedBy: "Eng. Sara Al Blooshi", dateRaised: "2025-02-15", whatIsNeeded: "ARB to schedule emergency review session for OT segmentation design", escalationStatus: "Escalated to TO", resolved: false },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s23",
    parentInitiativeId: "init-s07",
    name: "OT Security Monitoring Platform",
    division: "Transmission",
    pmName: "Eng. Hamad Al Muhairi",
    rag: "Amber",
    progress: 35,
    budgetHealth: "On Track",
    budget: 2_200_000,
    budgetSpent: 770_000,
    targetDate: "2026-06-30",
    milestones: [
      { id: "ms-s23-1", name: "Platform Selected", status: "Complete", dueDate: "2025-02-28", owner: "Procurement" },
      { id: "ms-s23-2", name: "Deployment & Configuration", status: "In Progress", dueDate: "2025-10-31", owner: "IT Ops" },
      { id: "ms-s23-3", name: "SOC Integration", status: "Not Started", dueDate: "2026-06-30", owner: "Eng. Hamad Al Muhairi" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },

  // init-s08: DEWA Enterprise Data Strategy (3 projects)
  {
    id: "proj-s24",
    parentInitiativeId: "init-s08",
    name: "Enterprise Data Mesh Architecture",
    division: "Innovation & AI",
    pmName: "Omar Al Mazrouei",
    rag: "Green",
    progress: 45,
    budgetHealth: "On Track",
    budget: 12_000_000,
    budgetSpent: 5_400_000,
    targetDate: "2026-12-31",
    milestones: [
      { id: "ms-s24-1", name: "Data Mesh Architecture Approved", status: "Complete", dueDate: "2025-01-31", owner: "EA Office" },
      { id: "ms-s24-2", name: "Domain Data Products (Phase 1)", status: "In Progress", dueDate: "2025-10-31", owner: "Data Team" },
      { id: "ms-s24-3", name: "Full Mesh Operational", status: "Not Started", dueDate: "2026-12-31", owner: "Omar Al Mazrouei" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s25",
    parentInitiativeId: "init-s08",
    name: "Enterprise Data Catalogue",
    division: "All Divisions",
    pmName: "Sara Al Kaabi",
    rag: "Green",
    progress: 38,
    budgetHealth: "On Track",
    budget: 8_000_000,
    budgetSpent: 3_040_000,
    targetDate: "2026-09-30",
    milestones: [
      { id: "ms-s25-1", name: "Catalogue Platform Selected", status: "Complete", dueDate: "2025-03-31", owner: "Procurement" },
      { id: "ms-s25-2", name: "Priority Domains Catalogued", status: "In Progress", dueDate: "2025-10-31", owner: "Sara Al Kaabi" },
      { id: "ms-s25-3", name: "All Domains Catalogued", status: "Not Started", dueDate: "2026-09-30", owner: "Sara Al Kaabi" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
  {
    id: "proj-s26",
    parentInitiativeId: "init-s08",
    name: "Analytics Platform Modernisation",
    division: "Corporate & Strategy",
    pmName: "Ahmed Al Hameli",
    rag: "Amber",
    progress: 20,
    budgetHealth: "On Track",
    budget: 14_000_000,
    budgetSpent: 2_800_000,
    targetDate: "2027-06-30",
    milestones: [
      { id: "ms-s26-1", name: "Current State Assessment", status: "Complete", dueDate: "2025-04-30", owner: "Architecture" },
      { id: "ms-s26-2", name: "Target Architecture Approved", status: "In Progress", dueDate: "2025-09-30", owner: "EA Office" },
      { id: "ms-s26-3", name: "Migration Execution", status: "Not Started", dueDate: "2026-12-31", owner: "Ahmed Al Hameli" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },

  // init-s09: Generation PLC Firmware (1 scoping project)
  {
    id: "proj-s27",
    parentInitiativeId: "init-s09",
    name: "PLC Firmware Assessment",
    division: "Generation",
    pmName: "TBC",
    rag: "Amber",
    progress: 5,
    budgetHealth: "On Track",
    budget: 0,
    budgetSpent: 0,
    targetDate: "2025-09-30",
    milestones: [
      { id: "ms-s27-1", name: "Asset Register Compiled", status: "In Progress", dueDate: "2025-06-30", owner: "Generation Engineering" },
      { id: "ms-s27-2", name: "Firmware Gap Assessment Complete", status: "Not Started", dueDate: "2025-09-30", owner: "TBC" },
    ],
    risks: [
      { id: "risk-s27-1", title: "14 critical EOL PLCs in production", severity: "Critical", likelihood: "High", impact: "Unpatched firmware vulnerabilities in live generation assets. Safety and compliance risk.", mitigation: "Expedited assessment underway. Interim monitoring controls in place.", owner: "TBC", mitigationDueDate: "2025-09-30", status: "Open" },
    ],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },

  // init-s10: EA Maturity Improvement — Water Services (1 project)
  {
    id: "proj-s28",
    parentInitiativeId: "init-s10",
    name: "Water Services EA Capability Build",
    division: "Water",
    pmName: "Eng. Aisha Al Mansoori",
    rag: "Green",
    progress: 22,
    budgetHealth: "On Track",
    budget: 1_800_000,
    budgetSpent: 396_000,
    targetDate: "2026-12-31",
    milestones: [
      { id: "ms-s28-1", name: "Maturity Baseline Assessment", status: "Complete", dueDate: "2025-03-31", owner: "EA Office" },
      { id: "ms-s28-2", name: "Gap Analysis & Improvement Plan", status: "In Progress", dueDate: "2025-07-31", owner: "Eng. Aisha Al Mansoori" },
      { id: "ms-s28-3", name: "Capability Building Programme", status: "Not Started", dueDate: "2026-06-30", owner: "L&D Team" },
      { id: "ms-s28-4", name: "Reassessment & Sign-Off", status: "Not Started", dueDate: "2026-12-31", owner: "EA Office" },
    ],
    risks: [],
    blockers: [],
    updatedAt: new Date().toISOString(),
  },
];

// ── Storage helpers ───────────────────────────────────────────────────────────

const STORE_KEY = "dtmp.lifecycle.portfolioStore";
const isBrowser = typeof window !== "undefined";

const parseJson = <T>(raw: string | null, fallback: T): T => {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const readStore = (): PortfolioStore => {
  if (!isBrowser) return { initiatives: SEED_INITIATIVES, projects: SEED_PROJECTS };
  const raw = window.localStorage.getItem(STORE_KEY);
  if (!raw) {
    const seed: PortfolioStore = { initiatives: SEED_INITIATIVES, projects: SEED_PROJECTS };
    window.localStorage.setItem(STORE_KEY, JSON.stringify(seed));
    return seed;
  }
  return parseJson<PortfolioStore>(raw, { initiatives: SEED_INITIATIVES, projects: SEED_PROJECTS });
};

const writeStore = (store: PortfolioStore): void => {
  if (!isBrowser) return;
  window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
};

// ── Read ──────────────────────────────────────────────────────────────────────

export const getInitiatives = (divisionFilter?: Division): Initiative[] => {
  const { initiatives } = readStore();
  if (!divisionFilter) return initiatives;
  return initiatives.filter((i) => i.division === divisionFilter || i.division === "All Divisions");
};

export const getInitiativeById = (id: string): Initiative | undefined =>
  readStore().initiatives.find((i) => i.id === id);

export const getProjects = (initiativeId?: string): Project[] => {
  const { projects } = readStore();
  if (!initiativeId) return projects;
  return projects.filter((p) => p.parentInitiativeId === initiativeId);
};

export const getProjectById = (id: string): Project | undefined =>
  readStore().projects.find((p) => p.id === id);

export const getProjectsByDivision = (division: Division): Project[] =>
  readStore().projects.filter((p) => p.division === division || p.division === "All Divisions");

// ── Update — Project RAG ──────────────────────────────────────────────────────

export const updateProjectRAG = (projectId: string, rag: RAGStatus): Project | null => {
  const store = readStore();
  let updated: Project | null = null;
  const now = new Date().toISOString();
  const nextProjects = store.projects.map((p) => {
    if (p.id !== projectId) return p;
    updated = { ...p, rag, updatedAt: now };
    return updated;
  });
  writeStore({ ...store, projects: nextProjects });
  return updated;
};

// ── Update — Milestone Status ─────────────────────────────────────────────────

export const updateMilestoneStatus = (
  projectId: string,
  milestoneId: string,
  status: MilestoneStatus
): Project | null => {
  const store = readStore();
  let updated: Project | null = null;
  const now = new Date().toISOString();
  const nextProjects = store.projects.map((p) => {
    if (p.id !== projectId) return p;
    const nextMilestones = p.milestones.map((m) => (m.id === milestoneId ? { ...m, status } : m));
    const completedCount = nextMilestones.filter((m) => m.status === "Complete").length;
    const autoProgress =
      nextMilestones.length > 0 ? Math.round((completedCount / nextMilestones.length) * 100) : p.progress;
    updated = { ...p, milestones: nextMilestones, progress: autoProgress, updatedAt: now };
    return updated;
  });
  writeStore({ ...store, projects: nextProjects });
  return updated;
};

// ── Update — Project Progress ─────────────────────────────────────────────────

export const updateProjectProgress = (projectId: string, progress: number): Project | null => {
  const store = readStore();
  let updated: Project | null = null;
  const now = new Date().toISOString();
  const nextProjects = store.projects.map((p) => {
    if (p.id !== projectId) return p;
    updated = { ...p, progress: Math.min(100, Math.max(0, progress)), updatedAt: now };
    return updated;
  });
  writeStore({ ...store, projects: nextProjects });
  return updated;
};

// ── Update — Initiative Progress ──────────────────────────────────────────────

export const updateInitiativeProgress = (initiativeId: string, progress: number): Initiative | null => {
  const store = readStore();
  let updated: Initiative | null = null;
  const now = new Date().toISOString();
  const nextInitiatives = store.initiatives.map((i) => {
    if (i.id !== initiativeId) return i;
    updated = { ...i, progress: Math.min(100, Math.max(0, progress)), updatedAt: now };
    return updated;
  });
  writeStore({ ...store, initiatives: nextInitiatives });
  return updated;
};

// ── Update — Initiative Status ────────────────────────────────────────────────

export const updateInitiativeStatus = (initiativeId: string, status: InitiativeStatus): Initiative | null => {
  const store = readStore();
  let updated: Initiative | null = null;
  const now = new Date().toISOString();
  const nextInitiatives = store.initiatives.map((i) => {
    if (i.id !== initiativeId) return i;
    updated = { ...i, status, updatedAt: now };
    return updated;
  });
  writeStore({ ...store, initiatives: nextInitiatives });
  return updated;
};

// ── Update — Budget Health ────────────────────────────────────────────────────

export const updateProjectBudgetHealth = (projectId: string, budgetHealth: BudgetHealth): Project | null => {
  const store = readStore();
  let updated: Project | null = null;
  const now = new Date().toISOString();
  const nextProjects = store.projects.map((p) => {
    if (p.id !== projectId) return p;
    updated = { ...p, budgetHealth, updatedAt: now };
    return updated;
  });
  writeStore({ ...store, projects: nextProjects });
  return updated;
};

// ── Resolve Blocker ───────────────────────────────────────────────────────────

export const resolveBlocker = (
  projectId: string,
  blockerId: string,
  resolvedNote: string
): Project | null => {
  const store = readStore();
  let updated: Project | null = null;
  const now = new Date().toISOString();
  const nextProjects = store.projects.map((p) => {
    if (p.id !== projectId) return p;
    const nextBlockers = p.blockers.map((b) =>
      b.id === blockerId ? { ...b, resolved: true, resolvedNote } : b
    );
    updated = { ...p, blockers: nextBlockers, updatedAt: now };
    return updated;
  });
  writeStore({ ...store, projects: nextProjects });
  return updated;
};

// ── Create — Initiative ───────────────────────────────────────────────────────

export const addInitiative = (data: Omit<Initiative, "id" | "updatedAt">): Initiative => {
  const store = readStore();
  const now = new Date().toISOString();
  const initiative: Initiative = {
    ...data,
    id: `init-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    updatedAt: now,
  };
  writeStore({ ...store, initiatives: [initiative, ...store.initiatives] });
  return initiative;
};

// ── Create — Project ──────────────────────────────────────────────────────────

export const addProject = (data: Omit<Project, "id" | "updatedAt">): Project => {
  const store = readStore();
  const now = new Date().toISOString();
  const project: Project = {
    ...data,
    id: `proj-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    updatedAt: now,
  };
  const nextInitiatives = store.initiatives.map((i) =>
    i.id === data.parentInitiativeId
      ? { ...i, projects: [...i.projects, project.id], updatedAt: now }
      : i
  );
  writeStore({ initiatives: nextInitiatives, projects: [project, ...store.projects] });
  return project;
};

// ── Reset ─────────────────────────────────────────────────────────────────────

export const resetStore = (): void => {
  if (!isBrowser) return;
  window.localStorage.removeItem(STORE_KEY);
};

// ── Derived helpers ───────────────────────────────────────────────────────────

export const getPortfolioSummary = () => {
  const { initiatives, projects } = readStore();
  return {
    totalInitiatives: initiatives.length,
    activeInitiatives: initiatives.filter((i) => i.status === "Active").length,
    totalProjects: projects.length,
    redProjects: projects.filter((p) => p.rag === "Red").length,
    amberProjects: projects.filter((p) => p.rag === "Amber").length,
    greenProjects: projects.filter((p) => p.rag === "Green").length,
    avgEaAlignment: Math.round(
      initiatives
        .filter((i) => i.eaAlignmentScore !== null)
        .reduce((sum, i) => sum + (i.eaAlignmentScore ?? 0), 0) /
        initiatives.filter((i) => i.eaAlignmentScore !== null).length
    ),
    totalBudget: initiatives.reduce((sum, i) => sum + (i.budget ?? 0), 0),
    totalBudgetSpent: initiatives.reduce((sum, i) => sum + i.budgetSpent, 0),
  };
};
