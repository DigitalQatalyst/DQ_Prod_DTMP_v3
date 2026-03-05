export type DivisionId =
  | "generation"
  | "transmission"
  | "distribution"
  | "water-services"
  | "customer-services"
  | "digital-dewa-moro-hub";

export interface DivisionPriority {
  title: string;
  description: string;
  kpi: string;
}

export interface DivisionMarketplace {
  phase: "Discern" | "Design" | "Deploy" | "Drive";
  name: string;
  description: string;
  audience: string;
  cta: string;
  route: string;
}

export interface DivisionRole {
  name: string;
  summary: string;
  actions: string[];
  cta: string;
  route: string;
}

export interface DivisionLandingContent {
  id: DivisionId;
  divisionLabel: string;
  shortTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroFacts: string[];
  initiative: "ACTIVE" | "PLANNED" | "HIGH PRIORITY";
  contextTitle: string;
  contextOverview: string[];
  whyItMatters: string[];
  priorities: DivisionPriority[];
  marketplaces: DivisionMarketplace[];
  roles: DivisionRole[];
}

const m = {
  learning: "/marketplaces/learning-center",
  knowledge: "/marketplaces/knowledge-center",
  studio: "/marketplaces/document-studio",
  specs: "/marketplaces/solution-specs",
  build: "/marketplaces/solution-build",
  lifecycle: "/marketplaces/lifecycle-management",
};

export const divisionalLandingData: Record<DivisionId, DivisionLandingContent> = {
  generation: {
    id: "generation",
    divisionLabel: "DEWA Generation",
    shortTitle: "Generation",
    heroTitle: "Powering Dubai's Future, Architectured for Net-Zero.",
    heroSubtitle: "DTMP for DEWA Generation governing clean-energy architecture.",
    heroFacts: ["8,000 MW Solar Target by 2030", "MBR Solar Park", "Net-Zero 2050 Leadership"],
    initiative: "PLANNED",
    contextTitle: "What the Generation Division Does",
    contextOverview: [
      "Generation operates Jebel Ali, MBR Solar Park, storage, and clean-energy infrastructure.",
      "Every generation asset decision requires governed architecture aligned to Net-Zero and 2030 clean-energy targets.",
    ],
    whyItMatters: [
      "Governs IT/OT architecture across generation assets",
      "Structures reusable Solar Park investments",
      "Tracks lifecycle from fuel to renewable transition",
      "Aligns with Smart Grid Strategy 2021-2035",
      "Supports predictive maintenance architecture",
      "Connects architecture to Net-Zero KPIs",
    ],
    priorities: [
      { title: "Clean Energy Architecture Governance", description: "Govern architecture across solar, storage, and clean-energy infrastructure.", kpi: "KPI: Clean Energy Architecture Compliance Rate" },
      { title: "Generation Asset Lifecycle Management", description: "Manage end-to-end lifecycle visibility from commissioning to decommissioning.", kpi: "KPI: Asset Lifecycle Compliance Score" },
      { title: "IT/OT Convergence for Generation", description: "Connect operational technology with enterprise IT for real-time intelligence.", kpi: "KPI: IT/OT Integration Coverage Rate" },
      { title: "Net-Zero Architecture Contribution", description: "Trace generation architecture to Net-Zero 2050 commitments.", kpi: "KPI: Net-Zero Architecture Contribution Score" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "EA literacy and clean-energy architecture tracks.", audience: "All Generation Division roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "Generation governance and solar reference architectures.", audience: "Generation Architects, EA Leads, Asset Managers", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated assessments and profiles for generation programmes.", audience: "Generation Project Teams, Division Leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Blueprints for solar integration, storage, and SCADA convergence.", audience: "Solution Architects, Generation Technology Leads", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Implementation support through EA intake process.", audience: "Generation Project Teams, Delivery Managers", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Stage gates and compliance for active generation initiatives.", audience: "Generation EA Office, Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
    ],
    roles: [
      { name: "Generation EA Lead", summary: "Governs architecture for MBR and clean-energy portfolios.", actions: ["Govern generation architecture", "Maintain solar and storage blueprints", "Review initiative compliance", "Escalate dependencies"], cta: "Enter Generation EA Workspace", route: "/stage3/dashboard" },
      { name: "Generation Strategy & Leadership", summary: "Leads capacity and clean-energy programme decisions.", actions: ["Portfolio oversight", "Net-Zero alignment", "Investment governance", "Executive dashboards"], cta: "View Generation Intelligence Dashboard", route: "/stage2/intelligence/overview" },
      { name: "Solar & Renewable Architects", summary: "Design and govern solar, storage, and clean-energy systems.", actions: ["Design architecture", "Contribute blueprints", "Assess proposals", "Review IT/OT designs"], cta: "Access Renewable Architecture Workspace", route: "/stage2/specs/overview" },
      { name: "Generation Project Teams", summary: "Deliver solar installations, storage, and plant upgrades.", actions: ["Submit requests", "Access specs", "Track progress", "Request build support"], cta: "Access Generation Project Workspace", route: "/stage2/templates/overview" },
      { name: "Asset & Lifecycle Operations", summary: "Manage performance, maintenance, and lifecycle governance.", actions: ["Manage lifecycle records", "Track stage-gate compliance", "Submit maintenance requests", "Use predictive maintenance blueprints"], cta: "Open Generation Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "OT Security & DevOps", summary: "Govern secure delivery for generation OT systems.", actions: ["Govern OT security", "Review IT/OT standards", "Assess automation fitness", "Oversee secure pipelines"], cta: "Access Generation SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },
  transmission: {
    id: "transmission",
    divisionLabel: "DEWA Transmission",
    shortTitle: "Transmission",
    heroTitle: "Governing the Architecture of DEWA's Grid Backbone.",
    heroSubtitle: "DTMP for Transmission where the EA 4.0 initiative is live.",
    heroFacts: ["EA Initiative: ACTIVE", "Smart Grid Strategy 2021-2035", "0.94 CML - World Benchmark"],
    initiative: "ACTIVE",
    contextTitle: "What the Transmission Division Does",
    contextOverview: [
      "Transmission manages high-voltage infrastructure carrying power across Dubai.",
      "This is DEWA's live EA initiative with active DTMP governance and charter KPI tracking.",
    ],
    whyItMatters: [
      "Live EA engagement",
      "Governed IT/OT Smart Grid architecture",
      "Automation fitness assessment in progress",
      "Platform Package deployment underway",
      "EA Office operationalisation",
      "Charter KPI measurement",
    ],
    priorities: [
      { title: "Technology Cost Efficiency", description: "Reduce redundancy through planning and lifecycle governance.", kpi: "KPI: Technology Rationalization Rate" },
      { title: "Modernised EA Practice", description: "Drive digital business-aligned EA governance.", kpi: "KPI: EA Practice Adoption Rate" },
      { title: "Accelerated Solution Delivery", description: "Improve review cycles and demand management.", kpi: "KPI: Review Cycle Efficiency" },
      { title: "Sustainable Digital Operations", description: "Advance lifecycle visibility aligned to Net-Zero.", kpi: "KPI: Asset Lifecycle Compliance" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "EA and Smart Grid learning pathways.", audience: "All Transmission Division roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "Transmission policies and Smart Grid artefacts.", audience: "Architects, Analysts, EA Office", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated assessments for transmission initiatives.", audience: "Project Teams, Architects, Transmission Leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Blueprints for substation automation and IT/OT convergence.", audience: "Solution Architects, Project Leads", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Delivery support for transmission transformation.", audience: "Transmission Project Teams, Delivery Managers", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Stage-gate governance for active initiatives.", audience: "Transmission EA Office, Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
    ],
    roles: [
      { name: "Transmission EA Office", summary: "Owns live initiative governance and roadmap.", actions: ["Manage repository", "Approve submissions", "Track charter KPIs", "Govern roadmap"], cta: "Enter EA Operations Dashboard", route: "/stage3/dashboard" },
      { name: "Transmission Strategy & Leadership", summary: "Aligns governance with Smart Grid and 2030 targets.", actions: ["Portfolio oversight", "Investment governance", "Progress reviews", "Executive dashboards"], cta: "View Strategic Intelligence Dashboard", route: "/stage2/intelligence/overview" },
      { name: "Transmission Architects", summary: "Design and govern transmission technology standards.", actions: ["Design/review architecture", "Contribute blueprints", "Manage capability canvas", "Enforce standards"], cta: "Access Architecture Workspace", route: "/stage2/specs/overview" },
      { name: "Transmission Project Teams", summary: "Execute Smart Grid and infrastructure transformation.", actions: ["Request specs", "Submit document requests", "Track progress", "Access build resources"], cta: "Access Project Workspace", route: "/stage2/templates/overview" },
      { name: "Lifecycle Operations Teams", summary: "Manage stage gates, compliance, and performance.", actions: ["Stage-gate management", "Compliance tracking", "Performance monitoring", "Retirement governance"], cta: "Open Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "Security & DevOps Enablement", summary: "Govern secure OT delivery and automation fitness.", actions: ["Security reviews", "IT/OT governance", "Automation assessments", "Secure delivery"], cta: "Access SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },
  distribution: {
    id: "distribution",
    divisionLabel: "DEWA Distribution",
    shortTitle: "Distribution",
    heroTitle: "Last-Mile Intelligence. Architectured for a Smart City.",
    heroSubtitle: "DTMP for Distribution governing last-mile electricity and water architecture.",
    heroFacts: ["Smart Metering Network", "Last-Mile Grid Reliability", "EV Infrastructure Architecture"],
    initiative: "PLANNED",
    contextTitle: "What the Distribution Division Does",
    contextOverview: [
      "Distribution manages low- and medium-voltage networks connecting to 1.27M customer accounts.",
      "It combines physical infrastructure and smart-city intelligence for metering, load management, and EV integration.",
    ],
    whyItMatters: [
      "Smart-metering architecture at city scale",
      "EV charging architecture governance",
      "IT/OT architecture for substations and feeders",
      "Demand response and load management alignment",
      "Customer-happiness support through architecture",
      "Smart Grid milestone alignment",
    ],
    priorities: [
      { title: "Smart Grid Last-Mile Architecture", description: "Govern architecture from substations to connection points.", kpi: "KPI: Smart Grid Distribution Coverage Rate" },
      { title: "EV Infrastructure Governance", description: "Structure interoperable and secure EV charging architecture.", kpi: "KPI: EV Infrastructure Architecture Compliance" },
      { title: "Customer Connection Lifecycle", description: "Manage lifecycle of distribution assets with reuse and compliance.", kpi: "KPI: Distribution Asset Lifecycle Compliance" },
      { title: "Distribution IT/OT Convergence", description: "Converge OT and enterprise systems for real-time intelligence.", kpi: "KPI: IT/OT Integration Coverage Rate" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "Smart metering, EV, and IT/OT learning tracks.", audience: "All Distribution Division roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "Distribution standards and EV/substation artefacts.", audience: "Distribution Architects, Asset Managers, EA Leads", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated assessments for metering/EV/substation programmes.", audience: "Distribution Project Teams, Division Leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Blueprints for metering, automation, EV charging, and DMS.", audience: "Distribution Architects, Project Leads", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Support for rollouts, EV installations, and upgrades.", audience: "Distribution Project Teams, Delivery Managers", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Lifecycle governance for distribution programmes.", audience: "Distribution EA Office, Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
    ],
    roles: [
      { name: "Distribution EA Lead", summary: "Governs metering, EV, and substation architecture.", actions: ["Govern architecture", "Maintain blueprints", "Review compliance", "Coordinate with Transmission EA"], cta: "Enter Distribution EA Workspace", route: "/stage3/dashboard" },
      { name: "Distribution Strategy & Leadership", summary: "Oversees network performance and EV/metering delivery.", actions: ["Network oversight", "EV investment governance", "Metering tracking", "Connection quality metrics"], cta: "View Distribution Intelligence Dashboard", route: "/stage2/intelligence/overview" },
      { name: "Distribution & Smart Grid Architects", summary: "Design network, metering, and EV architecture.", actions: ["Design architecture", "Develop EV blueprints", "Review metering integration", "Govern automation standards"], cta: "Access Distribution Architecture Workspace", route: "/stage2/specs/overview" },
      { name: "Distribution Project Teams", summary: "Deliver metering, EV, and substation programmes.", actions: ["Submit requests", "Access specs", "Track progress", "Request EV build support"], cta: "Access Distribution Project Workspace", route: "/stage2/templates/overview" },
      { name: "Network Operations Teams", summary: "Manage daily network performance and compliance.", actions: ["Monitor lifecycle", "Track stage-gate compliance", "Submit requests", "Access dashboards"], cta: "Open Distribution Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "OT Security & DevOps", summary: "Govern secure OT delivery for distribution systems.", actions: ["Govern OT security", "Review meter data architecture", "Assess EV integration fitness", "Oversee secure delivery"], cta: "Access Distribution SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },
  "water-services": {
    id: "water-services",
    divisionLabel: "DEWA Water Services",
    shortTitle: "Water Services",
    heroTitle: "Sustainable Water for a Growing City.",
    heroSubtitle: "DTMP for Water Services governing desalination, network, and conservation architecture.",
    heroFacts: ["4.5% Network Water Losses", "Hatta Hydroelectric Plant", "30% Water Demand Reduction Target"],
    initiative: "PLANNED",
    contextTitle: "What the Water Services Division Does",
    contextOverview: [
      "Water Services manages production, transmission, and distribution including desalination and Hatta.",
      "DTMP governs architecture investments that protect world-class efficiency and scale conservation technologies.",
    ],
    whyItMatters: [
      "Desalination architecture and lifecycle governance",
      "Hatta IT integration architecture",
      "Smart-sensor water monitoring architecture",
      "Conservation technology alignment",
      "Net-Zero support through water architecture",
      "Urban-growth planning alignment",
    ],
    priorities: [
      { title: "Desalination Technology Architecture", description: "Govern desalination for capacity and efficiency integration.", kpi: "KPI: Desalination Technology Compliance Rate" },
      { title: "Water Network Efficiency Architecture", description: "Structure monitoring systems maintaining low network-loss rates.", kpi: "KPI: Water Network Architecture Coverage" },
      { title: "Hatta Hydroelectric Integration", description: "Integrate Hatta systems with enterprise intelligence platforms.", kpi: "KPI: Hatta IT Integration Completeness Score" },
      { title: "Water Conservation Governance", description: "Ensure architecture contributes to conservation and sustainability.", kpi: "KPI: Conservation Technology Architecture Alignment" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "Water technology and sustainability learning tracks.", audience: "All Water Services Division roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "Water standards, desalination policies, and conservation frameworks.", audience: "Water Architects, Asset Managers, EA Leads", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated assessments for desalination and network initiatives.", audience: "Water Services Project Teams, Division Leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Blueprints for desalination integration, sensors, and Hatta.", audience: "Water Technology Architects, Project Leads", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Support for desalination upgrades and conservation deployments.", audience: "Water Services Project Teams, Delivery Managers", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Lifecycle governance for water transformation initiatives.", audience: "Water Services EA Office, Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
    ],
    roles: [
      { name: "Water Services EA Lead", summary: "Governs desalination, network, and conservation architecture.", actions: ["Govern architecture", "Maintain blueprints", "Review initiatives", "Coordinate with Distribution EA"], cta: "Enter Water Services EA Workspace", route: "/stage3/dashboard" },
      { name: "Water Services Leadership", summary: "Oversees desalination, network performance, and conservation programmes.", actions: ["Portfolio oversight", "Conservation governance", "Investment decisions", "Hatta tracking"], cta: "View Water Intelligence Dashboard", route: "/stage2/intelligence/overview" },
      { name: "Water Technology Architects", summary: "Design and govern desalination and smart-water architecture.", actions: ["Design desalination architecture", "Develop sensor blueprints", "Review Hatta integration", "Govern standards"], cta: "Access Water Architecture Workspace", route: "/stage2/specs/overview" },
      { name: "Water Services Project Teams", summary: "Deliver desalination and monitoring programmes.", actions: ["Submit requests", "Access water specs", "Track progress", "Request build support"], cta: "Access Water Project Workspace", route: "/stage2/templates/overview" },
      { name: "Water Network Operations", summary: "Manage water performance and lifecycle compliance.", actions: ["Monitor lifecycle", "Track network compliance", "Submit requests", "Access dashboards"], cta: "Open Water Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "OT & Operations Security", summary: "Govern secure water OT operations.", actions: ["Govern OT security", "Review integration", "Assess sensor fitness", "Oversee secure operations"], cta: "Access Water SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },
  "customer-services": {
    id: "customer-services",
    divisionLabel: "DEWA Customer Services",
    shortTitle: "Customer Services",
    heroTitle: "97% Happiness. Architectured for Every Customer.",
    heroSubtitle: "DTMP for Customer Services governing digital, AI, and integrated service architecture.",
    heroFacts: ["97.01% Customer Happiness Score 2024", "Rammas - 12M+ AI Interactions", "Services 360 - 30+ Entities"],
    initiative: "PLANNED",
    contextTitle: "What the Customer Services Division Does",
    contextOverview: [
      "Customer Services runs digital self-service, Rammas AI, and Services 360 across 1.27M accounts.",
      "It is a primary AI domain where governance ensures scalable, compliant customer experience delivery.",
    ],
    whyItMatters: [
      "Rammas AI architecture governance",
      "Services 360 integration architecture",
      "Digital self-service lifecycle management",
      "Alignment to happiness targets",
      "AI governance compliance",
      "Digital DEWA outcome alignment",
    ],
    priorities: [
      { title: "AI-Native Customer Experience", description: "Govern Rammas and conversational AI architecture.", kpi: "KPI: AI Customer Experience Architecture Maturity" },
      { title: "Services 360 Integration", description: "Structure scalable cross-entity integration via DubaiNow.", kpi: "KPI: Services 360 Integration Compliance Rate" },
      { title: "Digital Self-Service Governance", description: "Manage web/mobile lifecycle with accessibility standards.", kpi: "KPI: Digital Platform Architecture Compliance" },
      { title: "Customer Data & Intelligence", description: "Govern analytics and customer-intelligence architecture.", kpi: "KPI: Customer Data Architecture Maturity Score" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "CX architecture, AI deployment, and accessibility tracks.", audience: "All Customer Services Division roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "Rammas policies, CX standards, and Services 360 frameworks.", audience: "CX Architects, Integration Leads, EA Office", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated CX assessments and integration docs.", audience: "Customer Services Project Teams, Division Leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Blueprints for Rammas, Services 360, and intelligence systems.", audience: "CX Architects, Integration Architects, Project Leads", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Support for AI deployments and platform upgrades.", audience: "Customer Services Project Teams, CX Delivery Managers", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Stage-gate governance for AI/platform transformation.", audience: "Customer Services EA Office, Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
    ],
    roles: [
      { name: "Customer Services EA Lead", summary: "Governs CX, AI, and integration architecture.", actions: ["Govern CX/AI architecture", "Maintain Rammas blueprints", "Review Services 360 designs", "Enforce accessibility"], cta: "Enter Customer Services EA Workspace", route: "/stage3/dashboard" },
      { name: "Customer Services Leadership", summary: "Leads happiness and AI transformation delivery.", actions: ["Happiness oversight", "AI investment governance", "Platform transformation tracking", "Services 360 oversight"], cta: "View Customer Intelligence Dashboard", route: "/stage2/intelligence/overview" },
      { name: "CX & Integration Architects", summary: "Design Rammas and customer platform architecture.", actions: ["Design Rammas architecture", "Develop integration blueprints", "Review self-service architecture", "Govern data standards"], cta: "Access CX Architecture Workspace", route: "/stage2/specs/overview" },
      { name: "Customer Services Project Teams", summary: "Deliver AI deployments and integration programmes.", actions: ["Submit requests", "Access specs", "Track deployment progress", "Request build support"], cta: "Access Customer Project Workspace", route: "/stage2/templates/overview" },
      { name: "Digital Operations Teams", summary: "Manage platform/AI operations and monitoring.", actions: ["Monitor lifecycle", "Track AI compliance", "Submit requests", "Access dashboards"], cta: "Open Customer Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "AI & Data Security", summary: "Govern AI security and customer data protection.", actions: ["Govern AI security", "Review privacy compliance", "Assess model governance", "Oversee secure delivery"], cta: "Access Customer SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },
  "digital-dewa-moro-hub": {
    id: "digital-dewa-moro-hub",
    divisionLabel: "Digital DEWA & Moro Hub",
    shortTitle: "Digital DEWA & Moro Hub",
    heroTitle: "The Cognitive Core of DEWA's Digital Future.",
    heroSubtitle: "DTMP for Digital DEWA & Moro Hub governing AI, data-centre, and innovation architecture.",
    heroFacts: ["Largest Solar-Powered Green Data Centre", "Virtual Engineer - Deploying 2026", "Microsoft Security Copilot Leadership"],
    initiative: "HIGH PRIORITY",
    contextTitle: "What Digital DEWA & Moro Hub Does",
    contextOverview: [
      "Moro Hub provides cloud/data/AI infrastructure while Digital DEWA drives cognitive service programmes.",
      "This is DEWA's most architecture-intensive domain where AI governance and enterprise security converge.",
    ],
    whyItMatters: [
      "AI architecture governance for Rammas, Virtual Engineer, and Copilot",
      "Moro Hub data-centre architecture structuring",
      "Enterprise AI lifecycle governance",
      "Responsible AI deployment alignment",
      "Government-grade cybersecurity architecture",
      "Enterprise DBP standards alignment",
    ],
    priorities: [
      { title: "AI Platform Architecture Governance", description: "Govern AI ecosystem architecture for coherence and reuse.", kpi: "KPI: AI Platform Architecture Maturity Score" },
      { title: "Virtual Engineer Deployment", description: "Structure architecture for predictive and autonomous capabilities.", kpi: "KPI: Virtual Engineer Architecture Readiness Score" },
      { title: "Moro Hub & Data Centre Architecture", description: "Govern capacity, integration, security, and sustainability architecture.", kpi: "KPI: Moro Hub Architecture Compliance Rate" },
      { title: "Enterprise Cybersecurity Architecture", description: "Embed security-by-design across AI and digital platforms.", kpi: "KPI: Enterprise Security Architecture Coverage" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "AI governance, data-centre, and cybersecurity learning tracks.", audience: "All Digital DEWA & Moro Hub roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "AI governance frameworks and Moro/cyber references.", audience: "AI Architects, Data Centre Leads, Security Architects", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated platform assessments and cybersecurity reports.", audience: "Digital DEWA Project Teams, Division Leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Blueprints for AI platforms, Virtual Engineer, Moro, and cyber patterns.", audience: "AI Architects, Data Centre Architects, Security Architects", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Support for AI deployments and Moro infrastructure programmes.", audience: "Digital DEWA Project Teams, AI Delivery Managers", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Stage-gate governance for AI and Moro milestones.", audience: "Digital DEWA EA Office, AI Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
    ],
    roles: [
      { name: "Digital DEWA EA Lead", summary: "Governs AI and platform architecture compliance enterprise-wide.", actions: ["Govern AI/platform architecture", "Maintain VE blueprints", "Review Moro architecture", "Enforce responsible AI"], cta: "Enter Digital DEWA EA Workspace", route: "/stage3/dashboard" },
      { name: "Digital DEWA Leadership", summary: "Leads AI portfolio, Moro operations, and innovation delivery.", actions: ["AI portfolio oversight", "VE governance", "Moro investment decisions", "Copilot transformation tracking"], cta: "View Digital DEWA Intelligence Dashboard", route: "/stage2/intelligence/overview" },
      { name: "AI Platform & Data Architects", summary: "Design AI platforms, data pipelines, and ML infrastructure.", actions: ["Design AI architecture", "Develop VE blueprints", "Review Moro integrations", "Govern data standards"], cta: "Access AI Architecture Workspace", route: "/stage2/specs/overview" },
      { name: "AI & Platform Project Teams", summary: "Deliver AI deployments and infrastructure programmes.", actions: ["Submit AI requests", "Access specs", "Track VE delivery", "Request AI build support"], cta: "Access Digital DEWA Project Workspace", route: "/stage2/templates/overview" },
      { name: "Moro Hub Operations", summary: "Manage data-centre and AI platform reliability operations.", actions: ["Monitor platform lifecycle", "Track compliance", "Submit requests", "Access dashboards"], cta: "Open Digital DEWA Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "Cybersecurity Architecture", summary: "Govern enterprise cybersecurity and AI security architecture.", actions: ["Govern security architecture", "Review AI model security", "Assess integration fitness", "Oversee secure AI deployment"], cta: "Access Cybersecurity Architecture Console", route: "/marketplaces/support-services" },
    ],
  },
};

export const divisionOrder: DivisionId[] = [
  "generation",
  "transmission",
  "distribution",
  "water-services",
  "customer-services",
  "digital-dewa-moro-hub",
];

export const isDivisionId = (value?: string): value is DivisionId =>
  Boolean(value && value in divisionalLandingData);
