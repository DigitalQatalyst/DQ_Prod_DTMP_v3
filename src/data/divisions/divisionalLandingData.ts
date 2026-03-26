export type DivisionId =
  | "generation"
  | "transmission"
  | "distribution"
  | "water-civil"
  | "billing-services"
  | "innovation-future"
  | "power-water-planning"
  | "corporate"
  | "subsidiaries"
  | "business-support-hr";

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
  portfolio: "/marketplaces/portfolio-management",
  intelligence: "/marketplaces/digital-intelligence",
  support: "/marketplaces/support-services",
};

export const divisionalLandingData: Record<DivisionId, DivisionLandingContent> = {
  generation: {
    id: "generation",
    divisionLabel: "DEWA Generation",
    shortTitle: "Generation",
    heroTitle: "Powering Dubai's Future, Architectured for Net-Zero.",
    heroSubtitle: "DTMP for DEWA's Generation Division — governing the architecture of the world's most ambitious clean energy programme.",
    heroFacts: ["8,000 MW Solar Target by 2030", "MBR Solar Park — World's Largest Single-Site", "Net-Zero 2050 Leadership"],
    initiative: "PLANNED",
    contextTitle: "What the Generation Division Does",
    contextOverview: [
      "The engine of DEWA's clean energy future — and the division with the most ambitious transformation targets in the organisation.",
      "DEWA's Generation Division operates and expands the power generation infrastructure that keeps Dubai running. This includes the Jebel Ali Power and Desalination Complex, the Mohammed bin Rashid Al Maktoum Solar Park — the world's largest single-site solar park targeting 8,000 MW by 2030 — and the clean energy storage and fuel management systems that support 24/7 grid reliability.",
      "The division is at the centre of DEWA's Net-Zero 2050 vision. Every generation asset, every new solar installation, every storage system is an architecture decision that must be governed, lifecycle-managed, and aligned to DEWA's 36% clean energy target for 2030.",
    ],
    whyItMatters: [
      "Governs IT/OT architecture across generation assets",
      "Ensures Solar Park technology investments are structured and reusable",
      "Tracks architecture lifecycle from fuel to renewable transition",
      "Aligns generation capability design with Smart Grid Strategy 2021-2035",
      "Provides blueprints for AI-driven predictive maintenance integration",
      "Connects generation architecture to Net-Zero 2050 KPIs",
    ],
    priorities: [
      { title: "Clean Energy Architecture Governance", description: "Governing architecture decisions across MBR Solar Park, storage systems, and clean energy infrastructure to ensure alignment with DEWA's 36% clean energy target.", kpi: "KPI: Clean Energy Architecture Compliance Rate" },
      { title: "Generation Asset Lifecycle Management", description: "End-to-end visibility of generation assets — from commissioning to decommissioning — ensuring sustainable technology management across the division's portfolio.", kpi: "KPI: Asset Lifecycle Compliance Score" },
      { title: "IT/OT Convergence for Generation", description: "Structuring the technology architecture that connects operational technology (turbines, solar inverters, SCADA) with DEWA's enterprise IT systems for real-time intelligence.", kpi: "KPI: IT/OT Integration Coverage Rate" },
      { title: "Net-Zero Architecture Contribution", description: "Every architecture decision in Generation traceable to DEWA's Net-Zero 2050 commitment — with measurable carbon impact tracked through the EA platform.", kpi: "KPI: Net-Zero Architecture Contribution Score" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "EA literacy, clean energy technology architecture, and digital transformation pathways for Generation teams — including smart grid and renewable energy tracks.", audience: "All Generation Division roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "Architecture policies, clean energy governance standards, MBR Solar Park reference architectures, and generation technology blueprints.", audience: "Generation Architects, EA Leads, Asset Managers", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-powered generation of Assessment Reports, Technology Application Profiles, and clean energy architecture documents — fulfilled by the EA Office.", audience: "Generation project teams, Division leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Solution blueprints for solar asset integration, energy storage architecture, SCADA systems, and clean energy IT/OT convergence.", audience: "Solution Architects, Generation Technology Leads", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Implementation support for generation technology programmes — governed through the EA Office intake process.", audience: "Generation Project Teams, Delivery Managers", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Stage gate governance and compliance tracking for all active generation transformation initiatives.", audience: "Generation EA Office, Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
      { phase: "Drive", name: "Portfolio Management", description: "Track and govern active projects within DEWA's enterprise portfolio — ensuring investment, delivery progress, and strategic alignment are visible in one place.", audience: "Division Leadership, Programme Managers, EA Office", cta: "View Portfolio", route: m.portfolio },
      { phase: "Drive", name: "Digital Intelligence", description: "Architecture maturity insights, system analytics, and project intelligence — turning DTMP governance data into decision-ready visibility for leadership and EA teams.", audience: "EA Office, Division Leadership, Analysts", cta: "View Intelligence Dashboard", route: m.intelligence },
      { phase: "Drive", name: "Support Services", description: "Technical support and EA consultancy — from architecture queries and review requests to hands-on delivery assistance for teams across all DTMP phases.", audience: "All Division roles", cta: "Get Support", route: m.support },
    ],
    roles: [
      { name: "Generation EA Lead", summary: "Applies corporate EA standards to the Generation Division. Governs architecture for the MBR Solar Park and clean energy infrastructure portfolio.", actions: ["Govern generation technology architecture", "Maintain solar and storage blueprints", "Review initiative compliance", "Escalate cross-division dependencies"], cta: "Enter Generation EA Workspace", route: "/stage3/dashboard" },
      { name: "Generation Strategy & Leadership", summary: "Division directors and heads responsible for generation capacity, clean energy targets, and the MBR Solar Park programme delivery.", actions: ["Review generation portfolio progress", "Oversee Net-Zero target alignment", "Govern major investment decisions", "Access executive performance dashboards"], cta: "View Generation Intelligence Dashboard", route: "/marketplaces/portfolio-management" },
      { name: "Solar & Renewable Energy Architects", summary: "Technical architects designing and governing the technology architecture for solar, storage, and clean energy systems.", actions: ["Design solar and storage architecture", "Contribute blueprints to knowledge centre", "Assess new technology proposals", "Review IT/OT integration designs"], cta: "Access Renewable Architecture Workspace", route: "/marketplaces/solution-specs" },
      { name: "Generation Project Teams", summary: "Project managers and delivery teams executing generation transformation initiatives — new solar installations, storage systems, plant upgrades.", actions: ["Submit architecture requests", "Access generation solution specs", "Track initiative progress", "Request build support"], cta: "Access Generation Project Workspace", route: "/marketplaces/document-studio" },
      { name: "Asset & Lifecycle Operations", summary: "Operations teams responsible for generation asset performance, maintenance scheduling, and lifecycle governance.", actions: ["Manage asset lifecycle records", "Track compliance through stage gates", "Submit maintenance architecture requests", "Access predictive maintenance blueprints"], cta: "Open Generation Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "OT Security & DevOps", summary: "Teams governing secure delivery and operation of generation operational technology — SCADA, DCS, plant control systems.", actions: ["Govern OT security architecture", "Review IT/OT convergence standards", "Assess automation fitness", "Oversee secure deployment pipelines"], cta: "Access Generation SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },
  transmission: {
    id: "transmission",
    divisionLabel: "DEWA Transmission",
    shortTitle: "Transmission",
    heroTitle: "Governing the Architecture of DEWA's Grid Backbone.",
    heroSubtitle: "DTMP for DEWA's Transmission Power Division — where DEWA's EA 4.0 initiative is live and governed by the EA Office.",
    heroFacts: ["EA Initiative: ACTIVE", "Smart Grid Strategy 2021-2035", "0.94 CML — World Benchmark"],
    initiative: "ACTIVE",
    contextTitle: "What the Transmission Division Does",
    contextOverview: [
      "The backbone of Dubai's power network — and the home of DEWA's live EA governance initiative.",
      "DEWA's Transmission Power Division operates and maintains the high-voltage transmission network that carries power from generation assets to distribution substations across Dubai. With AED 7 billion invested in the Smart Grid Strategy 2021-2035, Transmission is undergoing one of the most significant infrastructure modernisation programmes in DEWA's history.",
      "This is the division where DTMP is currently live. The EA initiative — delivered by DigitalQatalyst — is establishing enterprise architecture governance across Transmission's technology landscape, building the EA Office function, and deploying the DTMP platform as the governance infrastructure.",
    ],
    whyItMatters: [
      "EA Initiative ACTIVE — this is the live engagement",
      "Smart Grid Strategy requires governed IT/OT architecture",
      "Automation fitness assessment underway across Transmission assets",
      "Platform Package (Starter) being deployed",
      "EA Office function being established and operationalised",
      "KPIs being measured against Charter success metrics",
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
      { phase: "Drive", name: "Portfolio Management", description: "Track and govern active projects within DEWA's enterprise portfolio — ensuring investment, delivery progress, and strategic alignment are visible in one place.", audience: "Division Leadership, Programme Managers, EA Office", cta: "View Portfolio", route: m.portfolio },
      { phase: "Drive", name: "Digital Intelligence", description: "Architecture maturity insights, system analytics, and project intelligence — turning DTMP governance data into decision-ready visibility for leadership and EA teams.", audience: "EA Office, Division Leadership, Analysts", cta: "View Intelligence Dashboard", route: m.intelligence },
      { phase: "Drive", name: "Support Services", description: "Technical support and EA consultancy — from architecture queries and review requests to hands-on delivery assistance for teams across all DTMP phases.", audience: "All Division roles", cta: "Get Support", route: m.support },
    ],
    roles: [
      { name: "Transmission EA Office", summary: "Owns live initiative governance and roadmap.", actions: ["Manage repository", "Approve submissions", "Track charter KPIs", "Govern roadmap"], cta: "Enter EA Operations Dashboard", route: "/stage3/dashboard" },
      { name: "Transmission Strategy & Leadership", summary: "Aligns governance with Smart Grid and 2030 targets.", actions: ["Portfolio oversight", "Investment governance", "Progress reviews", "Executive dashboards"], cta: "View Strategic Intelligence Dashboard", route: "/marketplaces/portfolio-management" },
      { name: "Transmission Architects", summary: "Design and govern transmission technology standards.", actions: ["Design/review architecture", "Contribute blueprints", "Manage capability canvas", "Enforce standards"], cta: "Access Architecture Workspace", route: "/marketplaces/solution-specs" },
      { name: "Transmission Project Teams", summary: "Execute Smart Grid and infrastructure transformation.", actions: ["Request specs", "Submit document requests", "Track progress", "Access build resources"], cta: "Access Project Workspace", route: "/marketplaces/document-studio" },
      { name: "Lifecycle Operations Teams", summary: "Manage stage gates, compliance, and performance.", actions: ["Stage-gate management", "Compliance tracking", "Performance monitoring", "Retirement governance"], cta: "Open Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "Security & DevOps Enablement", summary: "Govern secure OT delivery and automation fitness.", actions: ["Security reviews", "IT/OT governance", "Automation assessments", "Secure delivery"], cta: "Access SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },
  distribution: {
    id: "distribution",
    divisionLabel: "DEWA Distribution",
    shortTitle: "Distribution",
    heroTitle: "Last-Mile Intelligence. Architectured for a Smart City.",
    heroSubtitle: "DTMP for the Distribution Power Division — governing last-mile electricity architecture across Dubai's smart city infrastructure.",
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
      { phase: "Drive", name: "Portfolio Management", description: "Track and govern active projects within DEWA's enterprise portfolio — ensuring investment, delivery progress, and strategic alignment are visible in one place.", audience: "Division Leadership, Programme Managers, EA Office", cta: "View Portfolio", route: m.portfolio },
      { phase: "Drive", name: "Digital Intelligence", description: "Architecture maturity insights, system analytics, and project intelligence — turning DTMP governance data into decision-ready visibility for leadership and EA teams.", audience: "EA Office, Division Leadership, Analysts", cta: "View Intelligence Dashboard", route: m.intelligence },
      { phase: "Drive", name: "Support Services", description: "Technical support and EA consultancy — from architecture queries and review requests to hands-on delivery assistance for teams across all DTMP phases.", audience: "All Division roles", cta: "Get Support", route: m.support },
    ],
    roles: [
      { name: "Distribution EA Lead", summary: "Governs metering, EV, and substation architecture.", actions: ["Govern architecture", "Maintain blueprints", "Review compliance", "Coordinate with Transmission EA"], cta: "Enter Distribution EA Workspace", route: "/stage3/dashboard" },
      { name: "Distribution Strategy & Leadership", summary: "Oversees network performance and EV/metering delivery.", actions: ["Network oversight", "EV investment governance", "Metering tracking", "Connection quality metrics"], cta: "View Distribution Intelligence Dashboard", route: "/marketplaces/portfolio-management" },
      { name: "Distribution & Smart Grid Architects", summary: "Design network, metering, and EV architecture.", actions: ["Design architecture", "Develop EV blueprints", "Review metering integration", "Govern automation standards"], cta: "Access Distribution Architecture Workspace", route: "/marketplaces/solution-specs" },
      { name: "Distribution Project Teams", summary: "Deliver metering, EV, and substation programmes.", actions: ["Submit requests", "Access specs", "Track progress", "Request EV build support"], cta: "Access Distribution Project Workspace", route: "/marketplaces/document-studio" },
      { name: "Network Operations Teams", summary: "Manage daily network performance and compliance.", actions: ["Monitor lifecycle", "Track stage-gate compliance", "Submit requests", "Access dashboards"], cta: "Open Distribution Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "OT Security & DevOps", summary: "Govern secure OT delivery for distribution systems.", actions: ["Govern OT security", "Review meter data architecture", "Assess EV integration fitness", "Oversee secure delivery"], cta: "Access Distribution SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },
  "water-civil": {
    id: "water-civil",
    divisionLabel: "DEWA Water & Civil Division",
    shortTitle: "Water & Civil",
    heroTitle: "Sustainable Water Infrastructure for a Growing City.",
    heroSubtitle: "DTMP for DEWA's Water & Civil Division — governing desalination, water network, civil infrastructure, and conservation architecture.",
    heroFacts: ["4.5% Network Water Losses", "Hatta Hydroelectric Plant", "30% Water Demand Reduction Target"],
    initiative: "PLANNED",
    contextTitle: "What the Water & Civil Division Does",
    contextOverview: [
      "The Water & Civil Division manages the full water value chain — from desalination production through transmission and distribution networks to civil infrastructure across Dubai.",
      "DTMP governs the architecture investments that protect world-class water efficiency, scale conservation technologies, and ensure civil infrastructure assets are lifecycle-managed and aligned to DEWA's sustainability commitments.",
    ],
    whyItMatters: [
      "Desalination architecture and lifecycle governance",
      "Civil infrastructure asset management alignment",
      "Hatta Hydroelectric Plant IT integration architecture",
      "Smart-sensor water monitoring architecture",
      "Conservation technology alignment to Net-Zero 2050",
      "Urban-growth civil planning alignment",
    ],
    priorities: [
      { title: "Desalination Technology Architecture", description: "Govern desalination infrastructure for capacity, efficiency, and integration with enterprise systems.", kpi: "KPI: Desalination Technology Compliance Rate" },
      { title: "Water Network Efficiency Architecture", description: "Structure monitoring and control systems that maintain world-class low network-loss rates.", kpi: "KPI: Water Network Architecture Coverage" },
      { title: "Hatta Hydroelectric Integration", description: "Integrate Hatta plant systems with DEWA's enterprise intelligence and monitoring platforms.", kpi: "KPI: Hatta IT Integration Completeness Score" },
      { title: "Civil Infrastructure Lifecycle Governance", description: "Govern civil infrastructure assets from design through to decommissioning with full lifecycle visibility.", kpi: "KPI: Civil Asset Lifecycle Compliance Rate" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "Water technology, civil infrastructure, and sustainability architecture learning tracks.", audience: "All Water & Civil Division roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "Water standards, desalination policies, civil governance frameworks, and conservation references.", audience: "Water Architects, Civil Asset Managers, EA Leads", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated assessments for desalination, civil infrastructure, and network initiatives.", audience: "Water & Civil Project Teams, Division Leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Blueprints for desalination integration, smart sensors, Hatta, and civil infrastructure systems.", audience: "Water Technology Architects, Civil Engineers, Project Leads", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Support for desalination upgrades, civil infrastructure programmes, and conservation deployments.", audience: "Water & Civil Project Teams, Delivery Managers", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Lifecycle governance for water and civil transformation initiatives.", audience: "Water & Civil EA Office, Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
      { phase: "Drive", name: "Portfolio Management", description: "Track and govern active projects within DEWA's enterprise portfolio — ensuring investment, delivery progress, and strategic alignment are visible in one place.", audience: "Division Leadership, Programme Managers, EA Office", cta: "View Portfolio", route: m.portfolio },
      { phase: "Drive", name: "Digital Intelligence", description: "Architecture maturity insights, system analytics, and project intelligence — turning DTMP governance data into decision-ready visibility for leadership and EA teams.", audience: "EA Office, Division Leadership, Analysts", cta: "View Intelligence Dashboard", route: m.intelligence },
      { phase: "Drive", name: "Support Services", description: "Technical support and EA consultancy — from architecture queries and review requests to hands-on delivery assistance for teams across all DTMP phases.", audience: "All Division roles", cta: "Get Support", route: m.support },
    ],
    roles: [
      { name: "Water & Civil EA Lead", summary: "Governs desalination, civil infrastructure, and water network architecture.", actions: ["Govern water & civil architecture", "Maintain infrastructure blueprints", "Review initiative compliance", "Coordinate with Distribution EA"], cta: "Enter Water & Civil EA Workspace", route: "/stage3/dashboard" },
      { name: "Water & Civil Leadership", summary: "Oversees desalination operations, civil programmes, network performance, and conservation targets.", actions: ["Portfolio oversight", "Conservation governance", "Civil investment decisions", "Hatta programme tracking"], cta: "View Water & Civil Intelligence Dashboard", route: "/marketplaces/portfolio-management" },
      { name: "Water Technology & Civil Architects", summary: "Design and govern desalination, smart-water, and civil infrastructure architecture.", actions: ["Design desalination architecture", "Develop civil infrastructure blueprints", "Review Hatta integration", "Govern sensor standards"], cta: "Access Water & Civil Architecture Workspace", route: "/marketplaces/solution-specs" },
      { name: "Water & Civil Project Teams", summary: "Deliver desalination, civil infrastructure, and water monitoring programmes.", actions: ["Submit architecture requests", "Access water & civil specs", "Track programme progress", "Request build support"], cta: "Access Water & Civil Project Workspace", route: "/marketplaces/document-studio" },
      { name: "Water Network Operations", summary: "Manage daily water network performance and lifecycle compliance.", actions: ["Monitor asset lifecycle", "Track network compliance", "Submit maintenance requests", "Access performance dashboards"], cta: "Open Water & Civil Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "OT & Infrastructure Security", summary: "Govern secure water OT operations and civil infrastructure systems.", actions: ["Govern OT security architecture", "Review civil system integration", "Assess sensor fitness", "Oversee secure operations"], cta: "Access Water & Civil SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },
  "billing-services": {
    id: "billing-services",
    divisionLabel: "DEWA Billing Services Division",
    shortTitle: "Billing Services",
    heroTitle: "1.27 Million Accounts. Architectured for Zero Friction.",
    heroSubtitle: "DTMP for DEWA's Billing Services Division — governing billing platform, smart collections, and customer account architecture.",
    heroFacts: ["1.27M Customer Accounts", "97.01% Customer Happiness Score 2024", "Services 360 — 30+ Entities"],
    initiative: "PLANNED",
    contextTitle: "What the Billing Services Division Does",
    contextOverview: [
      "The Billing Services Division manages the full financial relationship between DEWA and its 1.27 million customer accounts — from meter reading through billing, smart collection platforms, and integrated customer account management.",
      "DTMP governs the architecture that keeps billing accurate, collections frictionless, and digital service delivery seamlessly integrated across Services 360 and DubaiNow-aligned channels.",
    ],
    whyItMatters: [
      "Billing platform architecture and lifecycle governance",
      "Smart collection platform integration standards",
      "Services 360 cross-entity billing integration",
      "Customer account data architecture and sovereignty",
      "Digital self-service billing channel governance",
      "Customer happiness KPI architecture alignment",
    ],
    priorities: [
      { title: "Billing Platform Architecture", description: "Govern the architecture of DEWA's billing and collection platforms for accuracy, scalability, and zero-downtime delivery.", kpi: "KPI: Billing Platform Architecture Compliance Rate" },
      { title: "Services 360 Integration Governance", description: "Structure scalable cross-entity billing integration across Services 360 and DubaiNow-aligned service channels.", kpi: "KPI: Services 360 Integration Compliance Rate" },
      { title: "Digital Collections Architecture", description: "Govern smart collection platform architecture ensuring seamless, accessible digital payment journeys for all 1.27M accounts.", kpi: "KPI: Digital Collections Platform Architecture Maturity" },
      { title: "Customer Data Architecture", description: "Govern customer account data standards, sovereignty, and analytics architecture aligned to DEWA's data strategy.", kpi: "KPI: Customer Data Architecture Maturity Score" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "Billing architecture, customer data, and digital collections learning tracks.", audience: "All Billing Services Division roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "Billing platform standards, Services 360 frameworks, and customer data governance references.", audience: "Billing Architects, Integration Leads, EA Office", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated billing platform assessments and integration architecture documents.", audience: "Billing Services Project Teams, Division Leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Blueprints for billing platforms, smart collections, Services 360 integration, and customer data systems.", audience: "Billing Architects, Integration Architects, Project Leads", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Support for billing platform upgrades and digital collections deployments.", audience: "Billing Services Project Teams, Delivery Managers", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Stage-gate governance for billing and collections transformation programmes.", audience: "Billing Services EA Office, Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
      { phase: "Drive", name: "Portfolio Management", description: "Track and govern active projects within DEWA's enterprise portfolio — ensuring investment, delivery progress, and strategic alignment are visible in one place.", audience: "Division Leadership, Programme Managers, EA Office", cta: "View Portfolio", route: m.portfolio },
      { phase: "Drive", name: "Digital Intelligence", description: "Architecture maturity insights, system analytics, and project intelligence — turning DTMP governance data into decision-ready visibility for leadership and EA teams.", audience: "EA Office, Division Leadership, Analysts", cta: "View Intelligence Dashboard", route: m.intelligence },
      { phase: "Drive", name: "Support Services", description: "Technical support and EA consultancy — from architecture queries and review requests to hands-on delivery assistance for teams across all DTMP phases.", audience: "All Division roles", cta: "Get Support", route: m.support },
    ],
    roles: [
      { name: "Billing Services EA Lead", summary: "Governs billing platform, collections, and customer data architecture.", actions: ["Govern billing architecture", "Maintain Services 360 blueprints", "Review collections integration", "Enforce data standards"], cta: "Enter Billing Services EA Workspace", route: "/stage3/dashboard" },
      { name: "Billing Services Leadership", summary: "Leads billing transformation, collections performance, and customer happiness delivery.", actions: ["Billing portfolio oversight", "Collections investment governance", "Services 360 programme tracking", "Happiness KPI oversight"], cta: "View Billing Intelligence Dashboard", route: "/marketplaces/portfolio-management" },
      { name: "Billing & Integration Architects", summary: "Design billing platform, collections, and Services 360 integration architecture.", actions: ["Design billing platform architecture", "Develop integration blueprints", "Review collections systems", "Govern customer data standards"], cta: "Access Billing Architecture Workspace", route: "/marketplaces/solution-specs" },
      { name: "Billing Services Project Teams", summary: "Deliver billing platform and collections transformation programmes.", actions: ["Submit architecture requests", "Access billing specs", "Track programme progress", "Request build support"], cta: "Access Billing Project Workspace", route: "/marketplaces/document-studio" },
      { name: "Collections & Operations Teams", summary: "Manage billing operations, collections performance, and platform lifecycle.", actions: ["Monitor platform lifecycle", "Track collections compliance", "Submit requests", "Access dashboards"], cta: "Open Billing Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "Data & Platform Security", summary: "Govern customer data protection and billing platform security architecture.", actions: ["Govern data security architecture", "Review privacy compliance", "Assess platform security", "Oversee secure delivery"], cta: "Access Billing SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },
  "innovation-future": {
    id: "innovation-future",
    divisionLabel: "DEWA Innovation & The Future Division",
    shortTitle: "Innovation & The Future",
    heroTitle: "Building the Cognitive Utility of Tomorrow.",
    heroSubtitle: "DTMP for DEWA's Innovation & The Future Division — governing AI platform, Virtual Engineer, and enterprise innovation architecture.",
    heroFacts: ["Virtual Engineer — Deploying 2026", "Microsoft Security Copilot Leadership", "Enterprise AI Governance Programme"],
    initiative: "HIGH PRIORITY",
    contextTitle: "What the Innovation & The Future Division Does",
    contextOverview: [
      "The Innovation & The Future Division drives DEWA's most forward-looking transformation programmes — from enterprise AI platforms and the Virtual Engineer deployment to future technology adoption and innovation governance across all divisions.",
      "This is DEWA's most architecture-intensive division. Every AI platform decision, every cognitive service deployment, and every emerging technology adoption requires governed architecture to ensure coherence, reusability, and responsible delivery at enterprise scale.",
    ],
    whyItMatters: [
      "AI platform architecture governance across all DEWA divisions",
      "Virtual Engineer deployment architecture and readiness",
      "Responsible AI governance frameworks for enterprise deployment",
      "Future technology assessment and adoption architecture",
      "Enterprise innovation programme lifecycle governance",
      "Government-grade cybersecurity architecture for AI systems",
    ],
    priorities: [
      { title: "AI Platform Architecture Governance", description: "Govern DEWA's AI ecosystem architecture for coherence, reuse, and responsible deployment across all divisions.", kpi: "KPI: AI Platform Architecture Maturity Score" },
      { title: "Virtual Engineer Deployment Readiness", description: "Structure and govern the architecture for Virtual Engineer — DEWA's predictive and autonomous field operations platform.", kpi: "KPI: Virtual Engineer Architecture Readiness Score" },
      { title: "Future Technology Adoption Governance", description: "Assess and govern emerging technology adoption across DEWA — ensuring new platforms are evaluated, architected, and integrated responsibly.", kpi: "KPI: Future Technology Architecture Assessment Rate" },
      { title: "Enterprise Cybersecurity Architecture", description: "Embed security-by-design across all AI and digital platforms — government-grade protection governed through DTMP.", kpi: "KPI: Enterprise Security Architecture Coverage" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "AI governance, future technology, innovation management, and cybersecurity architecture learning tracks.", audience: "All Innovation & The Future Division roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "AI governance frameworks, responsible AI standards, future technology references, and innovation architecture policies.", audience: "AI Architects, Innovation Leads, Security Architects", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated platform assessments, innovation architecture documents, and responsible AI reports.", audience: "Innovation Division Project Teams, Division Leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Blueprints for AI platforms, Virtual Engineer, future technology integration, and enterprise cybersecurity patterns.", audience: "AI Architects, Innovation Architects, Security Architects", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Support for AI deployments, Virtual Engineer rollout, and future technology programmes.", audience: "Innovation Division Project Teams, AI Delivery Managers", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Stage-gate governance for AI, Virtual Engineer, and innovation programme milestones.", audience: "Innovation & Future EA Office, AI Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
      { phase: "Drive", name: "Portfolio Management", description: "Track and govern active projects within DEWA's enterprise portfolio — ensuring investment, delivery progress, and strategic alignment are visible in one place.", audience: "Division Leadership, Programme Managers, EA Office", cta: "View Portfolio", route: m.portfolio },
      { phase: "Drive", name: "Digital Intelligence", description: "Architecture maturity insights, system analytics, and project intelligence — turning DTMP governance data into decision-ready visibility for leadership and EA teams.", audience: "EA Office, Division Leadership, Analysts", cta: "View Intelligence Dashboard", route: m.intelligence },
      { phase: "Drive", name: "Support Services", description: "Technical support and EA consultancy — from architecture queries and review requests to hands-on delivery assistance for teams across all DTMP phases.", audience: "All Division roles", cta: "Get Support", route: m.support },
    ],
    roles: [
      { name: "Innovation & Future EA Lead", summary: "Governs AI platform, Virtual Engineer, and enterprise innovation architecture compliance across DEWA.", actions: ["Govern AI/innovation architecture", "Maintain Virtual Engineer blueprints", "Review future technology proposals", "Enforce responsible AI standards"], cta: "Enter Innovation EA Workspace", route: "/stage3/dashboard" },
      { name: "Innovation & Future Leadership", summary: "Leads AI portfolio, Virtual Engineer programme, and future technology adoption across DEWA.", actions: ["AI portfolio oversight", "Virtual Engineer governance", "Future technology investment decisions", "Innovation programme tracking"], cta: "View Innovation Intelligence Dashboard", route: "/marketplaces/portfolio-management" },
      { name: "AI Platform & Innovation Architects", summary: "Design AI platforms, data pipelines, and future technology integration architecture.", actions: ["Design AI platform architecture", "Develop Virtual Engineer blueprints", "Assess future technology fit", "Govern responsible AI standards"], cta: "Access Innovation Architecture Workspace", route: "/marketplaces/solution-specs" },
      { name: "AI & Innovation Project Teams", summary: "Deliver AI deployments, Virtual Engineer rollout, and innovation programmes.", actions: ["Submit AI architecture requests", "Access innovation specs", "Track Virtual Engineer delivery", "Request AI build support"], cta: "Access Innovation Project Workspace", route: "/marketplaces/document-studio" },
      { name: "Future Technology Operations", summary: "Manage AI platform operations, innovation programme lifecycle, and compliance.", actions: ["Monitor AI platform lifecycle", "Track innovation compliance", "Submit technology requests", "Access programme dashboards"], cta: "Open Innovation Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "AI & Cybersecurity Architecture", summary: "Govern enterprise cybersecurity and AI security architecture across DEWA's innovation programmes.", actions: ["Govern AI security architecture", "Review AI model security", "Assess integration fitness", "Oversee secure AI deployment"], cta: "Access Innovation SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },

  "power-water-planning": {
    id: "power-water-planning",
    divisionLabel: "DEWA Power & Water Planning Division",
    shortTitle: "P&W Planning",
    heroTitle: "Planning the Infrastructure Dubai Needs Next.",
    heroSubtitle: "DTMP for DEWA's Power & Water Planning Division — governing the architecture of long-term capacity planning, demand forecasting, and strategic infrastructure investment.",
    heroFacts: ["20 GW Power Capacity Target by 2030", "735 MIGD Water Capacity by 2030", "Strategic Infrastructure Investment Governance"],
    initiative: "PLANNED",
    contextTitle: "What the Power & Water Planning Division Does",
    contextOverview: [
      "The Power & Water Planning Division governs DEWA's long-term capacity strategy — forecasting demand, planning infrastructure investments, and ensuring Dubai's power and water supply keeps pace with one of the world's fastest-growing cities.",
      "DTMP governs the architecture that underpins planning decisions — ensuring capacity models, demand forecasting platforms, and infrastructure investment frameworks are structured, governed, and aligned to DEWA's 2030 and Net-Zero 2050 targets.",
    ],
    whyItMatters: [
      "Capacity planning platform architecture and governance",
      "Demand forecasting system architecture",
      "Infrastructure investment decision framework alignment",
      "Cross-division planning integration architecture",
      "Net-Zero 2050 capacity alignment",
      "Smart Grid and clean energy capacity modelling governance",
    ],
    priorities: [
      { title: "Capacity Planning Architecture", description: "Govern the architecture of DEWA's power and water capacity planning platforms — ensuring demand models are accurate, integrated, and traceable to investment decisions.", kpi: "KPI: Capacity Planning Platform Architecture Compliance" },
      { title: "Demand Forecasting Governance", description: "Structure and govern demand forecasting systems that account for Dubai's population growth, EV adoption, and smart city demand patterns.", kpi: "KPI: Demand Forecasting Architecture Maturity Score" },
      { title: "Infrastructure Investment Alignment", description: "Ensure all major infrastructure investment decisions are architecturally assessed and aligned to DEWA's 2030 capacity targets before approval.", kpi: "KPI: Investment Architecture Review Coverage Rate" },
      { title: "Net-Zero Capacity Planning", description: "Govern the architecture of clean energy capacity planning — ensuring renewable integration, storage planning, and demand management are aligned to Net-Zero 2050.", kpi: "KPI: Net-Zero Capacity Architecture Alignment Score" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "Capacity planning, demand forecasting, and infrastructure investment architecture learning tracks.", audience: "All Power & Water Planning Division roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "Planning standards, capacity governance frameworks, and infrastructure investment architecture references.", audience: "Planning Architects, Strategy Leads, EA Office", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated capacity planning assessments and infrastructure investment architecture documents.", audience: "P&W Planning Project Teams, Division Leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Blueprints for capacity planning platforms, demand forecasting systems, and infrastructure investment frameworks.", audience: "Planning Architects, Strategy Architects, Project Leads", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Support for capacity planning platform deployments and forecasting system upgrades.", audience: "P&W Planning Project Teams, Delivery Managers", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Stage-gate governance for planning platform and infrastructure investment programme milestones.", audience: "P&W Planning EA Office, Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
      { phase: "Drive", name: "Portfolio Management", description: "Track and govern active projects within DEWA's enterprise portfolio — ensuring investment, delivery progress, and strategic alignment are visible in one place.", audience: "Division Leadership, Programme Managers, EA Office", cta: "View Portfolio", route: m.portfolio },
      { phase: "Drive", name: "Digital Intelligence", description: "Architecture maturity insights, system analytics, and project intelligence — turning DTMP governance data into decision-ready visibility for leadership and EA teams.", audience: "EA Office, Division Leadership, Analysts", cta: "View Intelligence Dashboard", route: m.intelligence },
      { phase: "Drive", name: "Support Services", description: "Technical support and EA consultancy — from architecture queries and review requests to hands-on delivery assistance for teams across all DTMP phases.", audience: "All Division roles", cta: "Get Support", route: m.support },
    ],
    roles: [
      { name: "P&W Planning EA Lead", summary: "Governs capacity planning, demand forecasting, and infrastructure investment architecture.", actions: ["Govern planning platform architecture", "Maintain forecasting blueprints", "Review investment proposals", "Coordinate with Generation and Transmission EA"], cta: "Enter P&W Planning EA Workspace", route: "/stage3/dashboard" },
      { name: "P&W Planning Leadership", summary: "Leads long-term capacity strategy, demand forecasting, and infrastructure investment governance.", actions: ["Capacity portfolio oversight", "Investment decision governance", "Demand strategy review", "2030 target alignment"], cta: "View Planning Intelligence Dashboard", route: "/marketplaces/portfolio-management" },
      { name: "Capacity & Planning Architects", summary: "Design and govern capacity planning platforms and demand forecasting architecture.", actions: ["Design planning platform architecture", "Develop forecasting blueprints", "Review infrastructure proposals", "Govern capacity standards"], cta: "Access Planning Architecture Workspace", route: "/marketplaces/solution-specs" },
      { name: "Planning Project Teams", summary: "Deliver capacity planning platform and infrastructure programme improvements.", actions: ["Submit architecture requests", "Access planning specs", "Track programme progress", "Request build support"], cta: "Access Planning Project Workspace", route: "/marketplaces/document-studio" },
      { name: "Planning Operations Teams", summary: "Manage planning platform operations and programme lifecycle compliance.", actions: ["Monitor platform lifecycle", "Track planning compliance", "Submit requests", "Access dashboards"], cta: "Open Planning Lifecycle Console", route: "/marketplaces/lifecycle-management" },
      { name: "Infrastructure & Data Security", summary: "Govern security architecture for planning platforms and infrastructure data systems.", actions: ["Govern planning data security", "Review integration security", "Assess platform fitness", "Oversee secure delivery"], cta: "Access Planning SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },

  corporate: {
    id: "corporate",
    divisionLabel: "DEWA Corporate & Strategy",
    shortTitle: "Corporate",
    heroTitle: "Enterprise Direction. Set from the Top.",
    heroSubtitle: "DTMP for DEWA Corporate & Strategy — governing the architecture decisions that set enterprise direction, standards, and investment priorities across all seven divisions.",
    heroFacts: ["7 Operating Divisions Governed", "One Enterprise Architecture Standard", "Net-Zero 2050 Enterprise Commitment"],
    initiative: "ACTIVE",
    contextTitle: "What Corporate & Strategy Governs",
    contextOverview: [
      "Corporate & Strategy is where DEWA's enterprise direction is set — and where architecture governance must be strongest. The CEO, executive leadership, CIO, CDO, CTO, and the Corporate EA Office collectively set the standards, investment priorities, and strategic direction that every division is measured against.",
      "DTMP at the corporate level is not about one division's projects — it's about the architecture of the enterprise itself. Standards compliance, investment governance, cross-division alignment, and Net-Zero 2050 trajectory are all owned here.",
      "Every architecture decision made across DEWA's seven divisions ultimately traces back to a corporate mandate. DTMP ensures that traceability is structured, auditable, and governed.",
    ],
    whyItMatters: [
      "Enterprise architecture standards set and enforced across all divisions",
      "Cross-division investment governance and prioritisation",
      "Strategic alignment between DEWA's 2030 targets and division architecture",
      "Net-Zero 2050 enterprise architecture roadmap ownership",
      "CIO/CDO/CTO digital strategy translated into architecture mandates",
      "Corporate EA Office governance across all DTMP phases",
    ],
    priorities: [
      { title: "Enterprise Standards Authority", description: "Define and enforce the architecture standards, principles, and patterns that all seven divisions must comply with — removing duplication and ensuring reuse at scale.", kpi: "KPI: Enterprise Standards Compliance Rate Across Divisions" },
      { title: "Investment Governance", description: "Govern all major technology and infrastructure investment decisions before approval — ensuring every major spend is architecturally assessed, aligned, and justifiable.", kpi: "KPI: Investment Architecture Review Coverage Rate" },
      { title: "Cross-Division Alignment", description: "Ensure that architecture decisions made in one division do not create technical debt or integration risk for another — governing the interfaces between all seven.", kpi: "KPI: Cross-Division Architecture Conflict Rate" },
      { title: "Net-Zero Architecture Mandate", description: "Own the enterprise-level architecture mandate for DEWA's Net-Zero 2050 commitment — ensuring every division's technology roadmap is aligned to the target.", kpi: "KPI: Net-Zero Architecture Alignment Score" },
      { title: "Digital Strategy Execution", description: "Translate the CIO, CDO, and CTO's digital strategy into governed architecture mandates — ensuring digital transformation programmes are structured and traceable.", kpi: "KPI: Digital Strategy Architecture Coverage" },
      { title: "EA Office Maturity", description: "Govern the maturity and capability of the Corporate EA Office itself — ensuring DTMP evolves alongside DEWA's growing transformation ambition.", kpi: "KPI: EA Office Maturity Index Score" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "Enterprise architecture governance, digital strategy, and DTMP leadership learning tracks for corporate and executive audiences.", audience: "All Corporate & Strategy roles, Division EA Leads", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "Enterprise architecture standards, investment governance frameworks, Net-Zero architecture policies, and cross-division reference models.", audience: "Corporate EA Office, CIO/CDO/CTO, Division Leads", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated enterprise architecture assessments, investment governance documents, and cross-division alignment reports.", audience: "Corporate EA Office, Strategy Office, Executive Leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Enterprise-wide architecture blueprints, integration patterns, standards specifications, and cross-division reference architectures.", audience: "Corporate EA Architects, Division EA Leads, CTO Office", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Governance support for enterprise-wide platform deployments and cross-division integration programmes.", audience: "Corporate EA Office, Programme Directors, Delivery Leads", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Enterprise-wide stage-gate governance for all major transformation programmes across DEWA's seven divisions.", audience: "Corporate EA Office, Executive Leadership, Programme Directors", cta: "View Lifecycle Dashboard", route: m.lifecycle },
      { phase: "Drive", name: "Portfolio Management", description: "Track and govern active projects within DEWA's enterprise portfolio — ensuring investment, delivery progress, and strategic alignment are visible in one place.", audience: "Division Leadership, Programme Managers, EA Office", cta: "View Portfolio", route: m.portfolio },
      { phase: "Drive", name: "Digital Intelligence", description: "Architecture maturity insights, system analytics, and project intelligence — turning DTMP governance data into decision-ready visibility for leadership and EA teams.", audience: "EA Office, Division Leadership, Analysts", cta: "View Intelligence Dashboard", route: m.intelligence },
      { phase: "Drive", name: "Support Services", description: "Technical support and EA consultancy — from architecture queries and review requests to hands-on delivery assistance for teams across all DTMP phases.", audience: "All Division roles", cta: "Get Support", route: m.support },
    ],
    roles: [
      { name: "Corporate EA Lead", summary: "Owns the enterprise architecture governance framework — setting standards, enforcing compliance, and ensuring DTMP operates effectively across all seven divisions.", actions: ["Set enterprise architecture standards", "Govern cross-division compliance", "Chair architecture review boards", "Report EA maturity to leadership"], cta: "Enter Corporate EA Workspace", route: "/stage3/dashboard" },
      { name: "CEO & Executive Leadership", summary: "Holds ultimate accountability for DEWA's architecture direction — translating strategic vision into governed investment and transformation priorities.", actions: ["Strategic direction and investment approval", "Enterprise architecture mandate oversight", "Net-Zero 2050 architecture commitment", "Cross-division performance governance"], cta: "View Executive Intelligence Dashboard", route: "/marketplaces/portfolio-management" },
      { name: "CIO / CDO / CTO", summary: "Translates DEWA's digital, data, and technology strategy into architecture mandates — governing the standards and platforms that all divisions operate on.", actions: ["Digital strategy to architecture translation", "Technology platform governance", "Data architecture mandate ownership", "Innovation architecture oversight"], cta: "Access Technology Strategy Workspace", route: "/marketplaces/solution-specs" },
      { name: "Corporate Strategy Office", summary: "Aligns DEWA's corporate strategy with enterprise architecture — ensuring all 2030 targets have a traceable architecture foundation.", actions: ["Strategy-to-architecture alignment", "2030 target architecture mapping", "Investment business case review", "Division performance benchmarking"], cta: "Access Strategy Architecture Workspace", route: "/marketplaces/document-studio" },
      { name: "Enterprise Programme Directors", summary: "Govern DEWA's largest cross-division transformation programmes — ensuring delivery stays architecturally aligned from inception to scale.", actions: ["Cross-division programme governance", "Architecture milestone review", "Investment tracking and reporting", "Programme risk and compliance"], cta: "Open Enterprise Programme Console", route: "/marketplaces/lifecycle-management" },
      { name: "Corporate Audit & Compliance", summary: "Govern architecture compliance, investment audit trails, and DTMP adherence across all divisions and subsidiaries.", actions: ["Architecture compliance audit", "Investment governance review", "DTMP adoption monitoring", "Cross-division compliance reporting"], cta: "Access Corporate Compliance Console", route: "/marketplaces/support-services" },
    ],
  },

  subsidiaries: {
    id: "subsidiaries",
    divisionLabel: "DEWA Group Subsidiaries",
    shortTitle: "Subsidiaries",
    heroTitle: "The DEWA Group. One Enterprise Architecture.",
    heroSubtitle: "DTMP for DEWA's subsidiary ecosystem — ensuring Moro Hub, Empower, Etihad ESCO, and Digital X operate within a unified, governed enterprise architecture framework.",
    heroFacts: ["Empower — World's Largest District Cooling Provider", "Moro Hub — UAE's Premier Data Centre & Cloud Hub", "Etihad ESCO — UAE Energy Efficiency Leader"],
    initiative: "PLANNED",
    contextTitle: "What the DEWA Group Subsidiary Ecosystem Covers",
    contextOverview: [
      "DEWA's subsidiary group extends the enterprise far beyond electricity and water — into data centre operations, district cooling, energy efficiency, and digital transformation services. Each subsidiary operates at significant scale, with its own technology assets, transformation programmes, and architecture decisions.",
      "DTMP governs the architecture interfaces between DEWA and its subsidiaries — ensuring that technology investments, integration patterns, and transformation decisions across the group are structured, reusable, and aligned to the enterprise standard.",
      "As DEWA's subsidiary footprint grows, so does the complexity of enterprise architecture governance. DTMP ensures that Moro Hub, Empower, Etihad ESCO, and Digital X all operate within a shared framework — reducing duplication and enabling group-wide reuse.",
    ],
    whyItMatters: [
      "Architecture governance across DEWA Group entities and interfaces",
      "Shared platform and integration pattern reuse across subsidiaries",
      "Investment alignment between DEWA and subsidiary transformation programmes",
      "Subsidiary technology architecture compliance with enterprise standards",
      "Cross-entity data architecture and integration governance",
      "Group-wide Net-Zero and sustainability architecture alignment",
    ],
    priorities: [
      { title: "Group Architecture Alignment", description: "Ensure all subsidiary technology investments and architecture decisions are governed against DEWA's enterprise standards — eliminating duplication across the group.", kpi: "KPI: Subsidiary Architecture Standards Compliance Rate" },
      { title: "Moro Hub Integration Governance", description: "Govern the architecture of DEWA's integration with Moro Hub — ensuring cloud, data centre, and digital platform interfaces are structured and reusable.", kpi: "KPI: Moro Hub Integration Architecture Coverage" },
      { title: "Empower Architecture Standards", description: "Govern district cooling architecture, IoT integration, and smart building platform decisions across Empower's estate — aligned to DEWA's Smart Grid strategy.", kpi: "KPI: Empower Architecture Review Coverage Rate" },
      { title: "Etihad ESCO Programme Alignment", description: "Align Etihad ESCO's energy efficiency programme architecture to DEWA's Net-Zero 2050 targets — ensuring shared measurement, reporting, and investment frameworks.", kpi: "KPI: ESCO Net-Zero Architecture Alignment Score" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "DTMP governance, enterprise architecture standards, and subsidiary integration learning tracks for group entity teams.", audience: "All DEWA Group Subsidiary roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "Enterprise architecture standards applicable across DEWA Group entities, integration reference models, and subsidiary governance frameworks.", audience: "Subsidiary EA Leads, Group CTO, Integration Architects", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated architecture assessments and integration governance documents for DEWA Group subsidiary programmes.", audience: "Subsidiary Project Teams, Group EA Office", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Integration blueprints, shared platform specifications, and cross-entity architecture patterns for the DEWA Group.", audience: "Integration Architects, Subsidiary EA Leads, Group CTO", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Architecture governance support for subsidiary platform deployments and DEWA Group integration programmes.", audience: "Subsidiary Project Teams, Integration Delivery Leads", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Stage-gate governance for subsidiary transformation programmes and DEWA Group integration milestones.", audience: "Group EA Office, Subsidiary Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
      { phase: "Drive", name: "Portfolio Management", description: "Track and govern active projects within DEWA's enterprise portfolio — ensuring investment, delivery progress, and strategic alignment are visible in one place.", audience: "Division Leadership, Programme Managers, EA Office", cta: "View Portfolio", route: m.portfolio },
      { phase: "Drive", name: "Digital Intelligence", description: "Architecture maturity insights, system analytics, and project intelligence — turning DTMP governance data into decision-ready visibility for leadership and EA teams.", audience: "EA Office, Division Leadership, Analysts", cta: "View Intelligence Dashboard", route: m.intelligence },
      { phase: "Drive", name: "Support Services", description: "Technical support and EA consultancy — from architecture queries and review requests to hands-on delivery assistance for teams across all DTMP phases.", audience: "All Division roles", cta: "Get Support", route: m.support },
    ],
    roles: [
      { name: "Group EA Lead", summary: "Governs enterprise architecture compliance and integration standards across all DEWA Group subsidiaries — ensuring group-wide reuse and alignment.", actions: ["Set group architecture standards", "Govern subsidiary compliance", "Review integration proposals", "Coordinate with Corporate EA Office"], cta: "Enter Group EA Workspace", route: "/stage3/dashboard" },
      { name: "Subsidiary CEOs & Leadership", summary: "Leads each DEWA Group entity's transformation agenda — ensuring subsidiary strategy aligns to the DEWA Group enterprise framework.", actions: ["Subsidiary strategy governance", "Group architecture mandate compliance", "Investment alignment to DEWA standards", "Programme performance reporting"], cta: "View Group Intelligence Dashboard", route: "/marketplaces/portfolio-management" },
      { name: "Moro Hub Architecture Teams", summary: "Design and govern cloud, data centre, and digital platform architecture for Moro Hub — aligned to DEWA Group standards.", actions: ["Cloud and data centre architecture", "Digital platform governance", "Integration design and review", "DEWA Group standards compliance"], cta: "Access Moro Hub Architecture Workspace", route: "/marketplaces/solution-specs" },
      { name: "Empower Architecture Teams", summary: "Design and govern district cooling, IoT, and smart building architecture for Empower — aligned to DEWA's Smart Grid and Net-Zero strategy.", actions: ["District cooling architecture", "IoT integration design", "Smart building platform governance", "Net-Zero alignment review"], cta: "Access Empower Architecture Workspace", route: "/marketplaces/solution-specs" },
      { name: "Etihad ESCO Project Teams", summary: "Deliver energy efficiency programme architecture — ensuring ESCO investments are governed, measurable, and aligned to DEWA's Net-Zero 2050 targets.", actions: ["Energy efficiency architecture", "ESCO programme delivery", "Net-Zero alignment tracking", "Investment compliance reporting"], cta: "Access ESCO Project Workspace", route: "/marketplaces/document-studio" },
      { name: "Group Integration & Security", summary: "Govern integration security architecture and data governance across all DEWA Group subsidiary interfaces.", actions: ["Integration security governance", "Cross-entity data architecture", "API and interface standards", "Group security compliance"], cta: "Access Group SecDevOps Console", route: "/marketplaces/support-services" },
    ],
  },
  "business-support-hr": {
    id: "business-support-hr",
    divisionLabel: "DEWA Business Support & HR Division",
    shortTitle: "Business Support & HR",
    heroTitle: "The Foundation Every Division Operates On.",
    heroSubtitle: "DTMP for DEWA's Business Support & HR Division — governing the architecture of procurement, human resources, project management, and the operational infrastructure that enables all eight divisions to deliver.",
    heroFacts: ["DEWA Academy — Enterprise Learning at Scale", "PMO — Governing Cross-Division Programme Delivery", "SCM & QHSE — Procurement & Quality Governance"],
    initiative: "PLANNED",
    contextTitle: "What Business Support & HR Governs",
    contextOverview: [
      "Business Support & HR is the division that keeps DEWA's operational engine running — governing human resources, procurement and supply chain, quality, project management, and the administrative infrastructure that all eight divisions depend on.",
      "DTMP at the Business Support & HR level governs the architecture of enterprise-wide shared services — ensuring HR platforms, procurement systems, project management tools, and quality management frameworks are structured, compliant, and aligned to DEWA's transformation standards.",
      "The division is home to DEWA Academy, the enterprise learning organisation, and the corporate PMO — two functions with direct relevance to DTMP's own capability-building mission.",
    ],
    whyItMatters: [
      "HR platform architecture and people data governance across all divisions",
      "Procurement and supply chain system architecture compliance",
      "DEWA Academy learning platform architecture and content governance",
      "Corporate PMO project management tool architecture and standards",
      "Quality management system architecture and QHSE compliance",
      "Cross-division shared service integration architecture",
    ],
    priorities: [
      { title: "HR Platform Architecture", description: "Govern the architecture of DEWA's enterprise HR platforms — ensuring talent, payroll, performance, and learning systems are integrated, governed, and aligned to the enterprise data model.", kpi: "KPI: HR Platform Architecture Compliance Score" },
      { title: "DEWA Academy Architecture", description: "Govern the learning platform architecture for DEWA Academy — ensuring digital learning tools, content systems, and certification platforms are structured and interoperable.", kpi: "KPI: Academy Platform Architecture Maturity Score" },
      { title: "PMO Tools Governance", description: "Ensure the corporate PMO's project management and portfolio tools comply with DTMP architecture standards — enabling consistent programme tracking across all divisions.", kpi: "KPI: PMO Tool Architecture Standards Compliance" },
      { title: "Procurement System Alignment", description: "Govern the architecture of SCM and procurement platforms — ensuring vendor management, contract systems, and supply chain tools are integrated and audit-ready.", kpi: "KPI: Procurement Architecture Integration Coverage" },
    ],
    marketplaces: [
      { phase: "Discern", name: "Learning Centre", description: "HR governance, procurement architecture, project management standards, and DEWA Academy learning track management.", audience: "All Business Support & HR roles", cta: "Explore", route: m.learning },
      { phase: "Discern", name: "Knowledge Centre", description: "HR system governance frameworks, procurement standards, PMO methodology references, and quality management architecture policies.", audience: "HR Architects, PMO Leads, Procurement Leads, EA Office", cta: "Explore", route: m.knowledge },
      { phase: "Design", name: "Document Studio", description: "AI-generated HR platform assessments, procurement architecture documents, and PMO tools governance reports.", audience: "Business Support Project Teams, Division Leadership", cta: "Access Studio", route: m.studio },
      { phase: "Design", name: "Solution Specs", description: "Blueprints for HR platforms, DEWA Academy systems, PMO tools, and procurement and supply chain architectures.", audience: "HR Architects, PMO Architects, Procurement Leads", cta: "Browse Specs", route: m.specs },
      { phase: "Deploy", name: "Solution Build", description: "Support for HR platform deployments, DEWA Academy system upgrades, and PMO tool implementations.", audience: "Business Support Project Teams, Delivery Managers", cta: "Request Build Support", route: m.build },
      { phase: "Drive", name: "Lifecycle Management", description: "Stage-gate governance for HR, procurement, and PMO transformation programme milestones.", audience: "Business Support EA Office, Programme Managers", cta: "View Lifecycle Dashboard", route: m.lifecycle },
      { phase: "Drive", name: "Portfolio Management", description: "Track and govern Business Support & HR projects within DEWA's enterprise portfolio — investment, progress, and strategic alignment in one view.", audience: "Division Leadership, Programme Managers, EA Office", cta: "View Portfolio", route: m.portfolio },
      { phase: "Drive", name: "Digital Intelligence", description: "Architecture maturity insights and analytics for Business Support & HR — turning governance data into decision-ready visibility for leadership and EA teams.", audience: "EA Office, Division Leadership, Analysts", cta: "View Intelligence Dashboard", route: m.intelligence },
      { phase: "Drive", name: "Support Services", description: "Technical support and EA consultancy for Business Support & HR teams — from architecture queries to hands-on delivery assistance.", audience: "All Division roles", cta: "Get Support", route: m.support },
    ],
    roles: [
      { name: "Business Support EA Lead", summary: "Governs HR platform, procurement system, PMO tools, and DEWA Academy architecture — ensuring all Business Support systems comply with enterprise standards.", actions: ["Govern HR platform architecture", "Review PMO tool compliance", "Assess procurement system fit", "Maintain DEWA Academy blueprint"], cta: "Enter Business Support EA Workspace", route: "/stage3/dashboard" },
      { name: "Division Leadership (EVP & VPs)", summary: "Leads DEWA's enterprise shared services — HR, procurement, project management, and quality — ensuring Business Support enables all divisions to deliver.", actions: ["Shared service strategy governance", "HR and PMO investment decisions", "Cross-division service alignment", "DEWA Academy oversight"], cta: "View Portfolio", route: "/marketplaces/portfolio-management" },
      { name: "HR & Talent Architecture", summary: "Design and govern enterprise HR platform architecture — talent systems, payroll, performance management, and learning infrastructure.", actions: ["HR platform architecture design", "People data governance", "Talent system integration", "DEWA Academy platform standards"], cta: "Browse Solution Specs", route: "/marketplaces/solution-specs" },
      { name: "PMO & Project Architects", summary: "Govern the architecture of DEWA's corporate PMO tools and project management frameworks — ensuring cross-division programme delivery is structured and traceable.", actions: ["PMO tool architecture governance", "Project management framework standards", "Cross-division programme architecture", "Portfolio tracking systems"], cta: "Browse Solution Specs", route: "/marketplaces/solution-specs" },
      { name: "Procurement & SCM Teams", summary: "Deliver procurement platform compliance and supply chain system improvements — governed through DTMP from specification to deployment.", actions: ["Submit procurement architecture requests", "Access SCM specs and blueprints", "Track procurement programme progress", "Request supply chain build support"], cta: "Open Document Studio", route: "/marketplaces/document-studio" },
      { name: "Operations & Quality Teams", summary: "Govern QHSE system architecture, quality management platforms, and operational compliance across Business Support & HR.", actions: ["QHSE system governance", "Quality platform lifecycle", "Operations compliance tracking", "Administrative system architecture"], cta: "Access Support Services", route: "/marketplaces/support-services" },
    ],
  },
};

export const divisionOrder: DivisionId[] = [
  "generation",
  "transmission",
  "distribution",
  "water-civil",
  "billing-services",
  "innovation-future",
  "power-water-planning",
  "corporate",
  "subsidiaries",
  "business-support-hr",
];

export const isDivisionId = (value?: string): value is DivisionId =>
  Boolean(value && value in divisionalLandingData);
