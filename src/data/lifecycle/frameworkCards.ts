// ─────────────────────────────────────────────────────────────────────────────
// Lifecycle Management — Initiative Framework Cards (Tab 2: Start an Initiative)
// 12 DEWA initiative type frameworks per spec Section 03
// src/data/lifecycle/frameworkCards.ts
// ─────────────────────────────────────────────────────────────────────────────

export type FrameworkCategory = "Internal" | "External";

export interface InitiativeFramework {
  id: string;
  type: string;
  category: FrameworkCategory;
  typicalDuration: string;
  typicalScope: string;
  description: string;
  whatTOProvides: string[];
  whatDivisionProvides: string[];
  keyPhases: string[];
  expectedOutcomes: string[];
}

export const initiativeFrameworks: InitiativeFramework[] = [
  {
    id: "IFW-01",
    type: "Architecture Remediation Initiative",
    category: "Internal",
    typicalDuration: "3–9 months",
    typicalScope: "Division-level",
    description:
      "A structured programme to identify and remediate architecture compliance violations against DEWA's approved standards. Typically triggered by a compliance score drop on Portfolio Management's Governance Health tab.",
    whatTOProvides: [
      "Architecture gap analysis",
      "Remediation roadmap",
      "Standards alignment coaching",
      "Compliance monitoring",
      "ARB reporting",
    ],
    whatDivisionProvides: [
      "Initiative owner",
      "Access to active projects",
      "EA contact",
      "Budget approval",
    ],
    keyPhases: ["Assessment", "Gap Analysis", "Remediation Planning", "Execution", "Verification", "ARB Sign-Off"],
    expectedOutcomes: [
      "Division compliance score above 80%",
      "Non-compliant projects brought into alignment",
      "ARB approval received",
    ],
  },
  {
    id: "IFW-02",
    type: "Application Modernisation Initiative",
    category: "Internal",
    typicalDuration: "6–18 months",
    typicalScope: "Application-level",
    description:
      "Replace or modernise an at-risk or end-of-life application in DEWA's estate. Typically triggered by a Replace or Retire lifecycle stage flag on Portfolio Management's Application Portfolio tab.",
    whatTOProvides: [
      "Current state assessment",
      "Options analysis",
      "Vendor selection support",
      "Migration oversight",
      "Go-live governance",
    ],
    whatDivisionProvides: [
      "Application owner",
      "Technical documentation",
      "User group access",
      "Migration budget",
    ],
    keyPhases: ["Assessment", "Options Analysis", "Vendor Selection", "Migration Planning", "Execution", "Go-Live", "Stabilisation"],
    expectedOutcomes: [
      "Legacy application retired or modernised",
      "New platform operational",
      "Users migrated",
      "Documentation complete",
    ],
  },
  {
    id: "IFW-03",
    type: "Technology Rationalisation Programme",
    category: "Internal",
    typicalDuration: "6–12 months",
    typicalScope: "Cross-division",
    description:
      "Consolidate duplicate or redundant technology across DEWA divisions. Triggered by a Technology Rationalisation card on Portfolio Management.",
    whatTOProvides: [
      "Overlap analysis validation",
      "Consolidation roadmap",
      "Migration sequencing",
      "Savings tracking",
      "Stakeholder management",
    ],
    whatDivisionProvides: [
      "Division technology owners",
      "Usage data",
      "Budget for migration",
      "Executive sponsorship",
    ],
    keyPhases: ["Discovery", "Analysis", "Decision", "Consolidation Planning", "Execution", "Validation", "Savings Verification"],
    expectedOutcomes: [
      "Duplicate systems retired",
      "Target platform adopted across divisions",
      "Estimated savings realised",
    ],
  },
  {
    id: "IFW-04",
    type: "AI Deployment Programme",
    category: "Internal",
    typicalDuration: "6–15 months",
    typicalScope: "Division or Enterprise",
    description:
      "Deploy an AI capability within DEWA's operations. Covers Virtual Engineer, Rammas AI enhancements, new AI use cases, or AI platform expansions.",
    whatTOProvides: [
      "AI readiness assessment",
      "Responsible AI governance framework",
      "Platform architecture",
      "Use case development",
      "Deployment oversight",
    ],
    whatDivisionProvides: [
      "Division AI champion",
      "Access to operational data",
      "GPU compute provisioned on Moro Hub",
      "Change management plan",
    ],
    keyPhases: ["Readiness", "Governance", "Platform", "Use Case Development", "Testing", "Deployment", "Operationalisation"],
    expectedOutcomes: [
      "AI capability live in production",
      "Responsible AI controls in place",
      "Operational staff trained",
      "Performance baseline established",
    ],
  },
  {
    id: "IFW-05",
    type: "EA Maturity Improvement Initiative",
    category: "Internal",
    typicalDuration: "6–12 months",
    typicalScope: "Division-level",
    description:
      "Advance a division's EA maturity score against the EA 4.0 benchmark. Triggered by a low or declining score on Portfolio Management's Governance Health tab.",
    whatTOProvides: [
      "Maturity baseline assessment",
      "Capability gap analysis",
      "Improvement plan",
      "EA coaching",
      "Progress tracking",
      "Reassessment",
    ],
    whatDivisionProvides: [
      "Division EA lead or nominated EA champion",
      "Management commitment",
      "Time allocation for staff participation",
    ],
    keyPhases: ["Baseline Assessment", "Gap Analysis", "Improvement Plan", "Capability Building", "Practice Embedding", "Reassessment"],
    expectedOutcomes: [
      "Division maturity score advanced to target",
      "EA practices embedded in standard ways of working",
      "ARB representation improved",
    ],
  },
  {
    id: "IFW-06",
    type: "DXP Customer Experience Programme",
    category: "External",
    typicalDuration: "12–24 months",
    typicalScope: "Enterprise",
    description:
      "Transform DEWA's customer experience across all digital touchpoints. Covers Services 360 delivery, Rammas AI, mobile platforms, self-service portals, and contact centre modernisation.",
    whatTOProvides: [
      "CX architecture design",
      "Platform selection support",
      "Delivery oversight",
      "EA alignment monitoring",
      "Go-live governance",
    ],
    whatDivisionProvides: [
      "Customer Services division leadership",
      "CX programme budget",
      "External vendor engagement",
      "Customer data governance",
    ],
    keyPhases: ["Strategy", "Architecture", "Vendor Selection", "Platform Build", "Integration", "Testing", "Rollout", "Optimisation"],
    expectedOutcomes: [
      "Omnichannel CX platform live",
      "Rammas AI integrated",
      "Customer satisfaction targets met",
      "Services 360 vision achieved",
    ],
  },
  {
    id: "IFW-07",
    type: "DWS Workplace Modernisation Programme",
    category: "External",
    typicalDuration: "8–18 months",
    typicalScope: "Enterprise",
    description:
      "Modernise DEWA's digital workplace — Microsoft 365, core business platforms, HR systems, back office. Typically cross-division with significant change management requirements.",
    whatTOProvides: [
      "Workplace architecture design",
      "Vendor management support",
      "Adoption programme governance",
      "EA compliance monitoring",
    ],
    whatDivisionProvides: [
      "HR and IT division ownership",
      "Change management budget",
      "Vendor contracts",
      "Executive sponsorship",
    ],
    keyPhases: ["Assessment", "Architecture", "Procurement", "Deployment", "Adoption", "Optimisation"],
    expectedOutcomes: [
      "Modern digital workplace operational",
      "Adoption rates above target",
      "Legacy systems retired",
      "Productivity improvements evidenced",
    ],
  },
  {
    id: "IFW-08",
    type: "IT/OT Convergence Programme",
    category: "External",
    typicalDuration: "12–24 months",
    typicalScope: "Division-level (Operational)",
    description:
      "Converge IT and OT environments in DEWA's operational divisions — Generation, Transmission, Distribution, Water Services. High complexity, high stakes, requires specialist OT security expertise.",
    whatTOProvides: [
      "IT/OT architecture design",
      "IEC 62443 compliance oversight",
      "OT security review",
      "Integration governance",
      "PURDUE model implementation support",
    ],
    whatDivisionProvides: [
      "Division OT engineering team",
      "IT security team",
      "OT network documentation",
      "IEC 62443 gap assessment pre-work",
      "Executive safety sponsor",
    ],
    keyPhases: ["OT Assessment", "Architecture", "Security Design", "Network Segmentation", "Integration", "Testing", "Go-Live", "Compliance Verification"],
    expectedOutcomes: [
      "IEC 62443 Level 2 achieved",
      "OT networks segmented",
      "IT/OT monitoring live",
      "Security incident rate reduced",
    ],
  },
  {
    id: "IFW-09",
    type: "Net-Zero Technology Initiative",
    category: "Internal",
    typicalDuration: "12–36 months",
    typicalScope: "Enterprise",
    description:
      "Align DEWA's technology architecture and investment decisions to Net-Zero 2050 targets. Covers carbon tracking, sustainability dashboards, clean energy platform architecture, and Net-Zero governance.",
    whatTOProvides: [
      "Net-Zero architecture assessment",
      "Carbon tracking platform deployment",
      "Sustainability reporting framework",
      "Architecture standard development",
    ],
    whatDivisionProvides: [
      "Sustainability office engagement",
      "Carbon accounting methodology approval",
      "Cross-division data access",
      "ESG reporting requirements",
    ],
    keyPhases: ["Baseline", "Architecture", "Platform", "Governance", "Reporting", "Continuous Improvement"],
    expectedOutcomes: [
      "Carbon tracking platform live",
      "Net-Zero progress visible across all divisions",
      "Sustainability reporting automated",
      "Architecture decisions assessed against Net-Zero criteria",
    ],
  },
  {
    id: "IFW-10",
    type: "Security Uplift Programme",
    category: "External",
    typicalDuration: "6–18 months",
    typicalScope: "Division or Enterprise",
    description:
      "Uplift DEWA's security posture in a specific domain — zero trust deployment, OT security, DevSecOps, or enterprise integration security. Typically triggered by a compliance violation or security incident.",
    whatTOProvides: [
      "Security architecture design",
      "Vendor selection support",
      "Implementation oversight",
      "Compliance monitoring",
      "Security testing governance",
    ],
    whatDivisionProvides: [
      "CISO office engagement",
      "Security budget",
      "Network topology documentation",
      "Security policy approval authority",
    ],
    keyPhases: ["Assessment", "Architecture", "Vendor Selection", "Implementation", "Testing", "Certification", "Ongoing Monitoring"],
    expectedOutcomes: [
      "Security architecture compliant with target framework",
      "Compliance certification achieved",
      "Security monitoring operational",
    ],
  },
  {
    id: "IFW-11",
    type: "Data Platform Initiative",
    category: "Internal",
    typicalDuration: "12–24 months",
    typicalScope: "Enterprise",
    description:
      "Deploy or modernise DEWA's enterprise data platform — data mesh, data lake, data warehouse, analytics platform, or data governance framework.",
    whatTOProvides: [
      "Data architecture design",
      "Data governance framework",
      "Platform deployment oversight",
      "Data quality programme",
      "Domain data product support",
    ],
    whatDivisionProvides: [
      "Data owners across divisions",
      "Data classification complete",
      "Data governance policy approved",
      "Moro Hub compute provisioned",
    ],
    keyPhases: ["Data Strategy", "Architecture", "Governance", "Platform Deployment", "Domain Products", "Analytics", "Operationalisation"],
    expectedOutcomes: [
      "Enterprise data platform operational",
      "Domain data products live",
      "Federated governance in place",
      "Analytics capability available to all divisions",
    ],
  },
  {
    id: "IFW-12",
    type: "Platform Deployment Initiative",
    category: "Internal",
    typicalDuration: "3–12 months",
    typicalScope: "Division or Enterprise",
    description:
      "Deploy a specific DTMP-recommended platform solution following completion of Solution Specs. This initiative type is the direct continuation of the Solution Specs → Solution Build journey.",
    whatTOProvides: [
      "Deployment oversight",
      "EA compliance monitoring",
      "Go-live governance",
      "Post-deployment review",
    ],
    whatDivisionProvides: [
      "Approved solution spec from Solution Specs",
      "Deployment team in place",
      "Technical environment ready",
    ],
    keyPhases: ["Pre-Deployment", "Deployment", "Testing", "Go-Live", "Stabilisation", "Handover"],
    expectedOutcomes: [
      "Platform deployed and operational",
      "EA compliance verified",
      "Handover documentation complete",
      "Benefits baseline established",
    ],
  },
];

export const getFrameworkById = (id: string): InitiativeFramework | undefined =>
  initiativeFrameworks.find((f) => f.id === id);

export const getFrameworkByType = (type: string): InitiativeFramework | undefined =>
  initiativeFrameworks.find((f) => f.type === type);
