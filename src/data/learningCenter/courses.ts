import type { LearningCourseContract } from "./learningModel";

export type CourseLevel = "Beginner" | "Intermediate" | "Advanced" | "Executive";
export type DewaPhase = "Discern" | "Design" | "Deploy" | "Drive";

export interface Course extends LearningCourseContract {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: CourseLevel;
  provider: { name: string; logo?: string } | null;
  rating: number;
  students: number;
  featured?: boolean;
  department: string;
  divisionTags: string[];
  category: string;
  format: string;
  certification: boolean;
  phaseAlignment: DewaPhase[];
  connectedProgrammes: string[];
  introduction?: string;
  highlights?: string[];
  learningOutcomes?: string[];
  prerequisites?: string;
  modules?: {
    title: string;
    duration: string;
    lessons: string[];
  }[];
  targetAudience?: string;
  recommendedRoles?: string[];
  requirements?: string[];
  timeline?: string;
  assessmentInfo?: string;
  documents?: {
    name: string;
    type: string;
    size: string;
  }[];
  resources?: { name: string; url: string }[];
  providerInfo?: {
    description: string;
    credentials: string[];
    otherCourses: { title: string; brief: string }[];
  };
  inclusions?: string[];
}

type CourseSeed = {
  id: string;
  provider: "Internal" | "Coursera" | "LinkedIn Learning";
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: Exclude<CourseLevel, "Executive">;
  divisionTags: string[];
  phaseAlignment: DewaPhase[];
  connectedProgrammes: string[];
  rating: number;
  students: number;
  featured?: boolean;
  category: string;
  prerequisites?: string;
  targetAudience?: string;
};

const providerDescriptions: Record<CourseSeed["provider"], Course["providerInfo"]> = {
  Internal: {
    description:
      "Internal content authored for DEWA and contextualised to the DTMP operating model, division architecture realities, and programme governance needs.",
    credentials: [
      "DEWA-contextualised enterprise architecture content",
      "Aligned to DTMP operating model and governance methods",
      "Focused on real DEWA platforms, programmes, and delivery patterns",
    ],
    otherCourses: [
      { title: "DTMP Platform Orientation - Getting Started", brief: "Foundational platform onboarding." },
      { title: "EA 4.0 Practice - DEWA's Approach", brief: "EA operating model and maturity guidance." },
    ],
  },
  Coursera: {
    description:
      "Coursera-hosted content curated for DEWA use where external capability building aligns with utility, cloud, data, and architecture needs.",
    credentials: [
      "Global online learning marketplace",
      "Utility and enterprise architecture-aligned course catalogues",
      "Flexible self-paced delivery",
    ],
    otherCourses: [
      { title: "Cloud Architecture & Migration for Government Utilities", brief: "Hybrid and sovereign cloud design." },
      { title: "Enterprise Integration Architecture at Scale", brief: "Large-scale integration governance." },
    ],
  },
  "LinkedIn Learning": {
    description:
      "LinkedIn Learning content selected where DEWA benefits from role-based upskilling in AI, customer experience, change, and platform governance.",
    credentials: [
      "Role-oriented professional learning content",
      "Flexible self-paced consumption",
      "Useful for broad enterprise adoption programmes",
    ],
    otherCourses: [
      { title: "AI Platform Architecture - Design and Governance", brief: "Enterprise AI lifecycle and controls." },
      { title: "Advanced IT/OT Convergence Architecture", brief: "Operational technology convergence patterns." },
    ],
  },
};

const createModules = (title: string, phaseAlignment: DewaPhase[], connectedProgrammes: string[]) => [
  {
    title: `${title} Foundations`,
    duration: "90 min",
    lessons: [
      `Why ${title.toLowerCase()} matters in DEWA's transformation context`,
      `Key architecture concepts and governance expectations`,
      `Division and stakeholder context`,
    ],
  },
  {
    title: "Methods and Application",
    duration: "2 hours",
    lessons: [
      `Applying ${phaseAlignment.join(" / ")} phase methods`,
      `Working patterns linked to ${connectedProgrammes[0]}`,
      "Decision points, artefacts, and common risks",
    ],
  },
  {
    title: "Operationalisation",
    duration: "90 min",
    lessons: [
      "How to apply the learning in live DEWA delivery contexts",
      "Governance checkpoints and evidence expectations",
      "Practical takeaways for cross-division execution",
    ],
  },
];

const buildCourse = (seed: CourseSeed): Course => {
  const primaryDepartment =
    seed.divisionTags.find((division) => division !== "All Divisions") ?? "All Divisions";

  return {
    id: seed.id,
    title: seed.title,
    description: seed.description,
    duration: seed.duration,
    lessons: seed.lessons,
    level: seed.level,
    provider: { name: seed.provider },
    rating: seed.rating,
    students: seed.students,
    featured: seed.featured ?? false,
    department: primaryDepartment,
    divisionTags: seed.divisionTags,
    category: seed.category,
    format: seed.provider === "Internal" ? "Instructor-led" : "Self-paced",
    certification: true,
    phaseAlignment: seed.phaseAlignment,
    connectedProgrammes: seed.connectedProgrammes,
    introduction: `${seed.description} This course is contextualised for DEWA's operating environment and connects learning directly to live architecture and transformation priorities.`,
    highlights: [
      `Aligned to DEWA divisions: ${seed.divisionTags.join(", ")}`,
      `Supports the ${seed.phaseAlignment.join(" / ")} phase${seed.phaseAlignment.length > 1 ? "s" : ""} of the 4D model`,
      `Connected to ${seed.connectedProgrammes.join(", ")}`,
    ],
    learningOutcomes: [
      `Explain the role of ${seed.title.toLowerCase()} in DEWA's enterprise architecture landscape`,
      "Apply the concepts to real DEWA initiatives and governance checkpoints",
      "Recognise dependencies, stakeholders, and delivery implications across divisions",
    ],
    prerequisites:
      seed.prerequisites ??
      (seed.level === "Beginner"
        ? "None."
        : seed.level === "Intermediate"
          ? "Foundational understanding of enterprise architecture or digital transformation."
          : "Relevant architecture or programme delivery experience recommended."),
    modules: createModules(seed.title, seed.phaseAlignment, seed.connectedProgrammes),
    targetAudience:
      seed.targetAudience ??
      `DEWA professionals working in ${seed.divisionTags.join(", ")} contexts who need architecture and transformation capability in this topic area.`,
    recommendedRoles: [
      "Enterprise Architects",
      "Programme Managers",
      "Division Leads",
      "Transformation Analysts",
    ],
    requirements: [
      "Access to DTMP learning materials",
      "Willingness to apply concepts to DEWA initiatives",
      "Completion of course activities and checks",
    ],
    timeline: `Recommended completion in ${seed.level === "Beginner" ? "2-3 weeks" : seed.level === "Intermediate" ? "3-5 weeks" : "4-6 weeks"} with paced study across ${seed.lessons} lessons.`,
    assessmentInfo:
      "Complete the course content, pass the knowledge checks, and submit the required activity or reflection to complete the learning experience.",
    documents: [
      { name: "Course Outline", type: "PDF", size: "320 KB" },
      { name: "DEWA Relevance Notes", type: "PDF", size: "540 KB" },
    ],
    resources: [{ name: "DTMP Learning Resource Pack", url: "#" }],
    providerInfo: providerDescriptions[seed.provider],
    inclusions: [
      "Video and reading content",
      "DEWA contextual notes",
      "Knowledge checks",
      "Completion certificate",
    ],
  };
};

export const courses: Course[] = [
  {
    id: "enterprise-architecture-fundamentals-dewa",
    provider: "Internal",
    title: "Enterprise Architecture Fundamentals for DEWA",
    description:
      "Understand the principles of enterprise architecture and why it matters for DEWA's digital transformation journey. Introduces EA concepts, the Corporate EA Office role, and DTMP as DEWA's governance platform.",
    duration: "6 hours",
    lessons: 8,
    level: "Beginner",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Discern"],
    connectedProgrammes: ["EA 4.0 Initiative", "DTMP Platform"],
    rating: 4.7,
    students: 1240,
    featured: true,
    category: "Enterprise Architecture",
  },
  {
    id: "introduction-4d-governance-model",
    provider: "Internal",
    title: "Introduction to the 4D Governance Model",
    description:
      "A foundational introduction to DTMP's 4D Operating Model - Discern, Design, Deploy, and Drive. Explains each phase, what it governs, and how it applies across DEWA's divisions.",
    duration: "5 hours",
    lessons: 6,
    level: "Beginner",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Discern"],
    connectedProgrammes: ["DTMP Platform", "EA 4.0 Initiative"],
    rating: 4.8,
    students: 1365,
    featured: true,
    category: "Enterprise Architecture",
  },
  {
    id: "digital-business-platform-overview",
    provider: "Internal",
    title: "DEWA's Digital Business Platform - An Overview",
    description:
      "Introduces DEWA's Digital Business Platform (DBP) and its four streams - DXP, DWS, DIA, and SDO. Explains how DTMP governs the architecture of each stream.",
    duration: "4 hours",
    lessons: 6,
    level: "Beginner",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Discern"],
    connectedProgrammes: ["Digital DEWA Programme", "DTMP Platform"],
    rating: 4.6,
    students: 1180,
    category: "Digital Platforms",
  },
  {
    id: "digital-transformation-fundamentals-utilities",
    provider: "LinkedIn Learning",
    title: "Digital Transformation Fundamentals for Utilities",
    description:
      "Core concepts of digital transformation applied to the water and electricity utility sector. Covers industry drivers, common transformation patterns, and readiness frameworks relevant to organisations like DEWA.",
    duration: "7 hours",
    lessons: 10,
    level: "Beginner",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Discern"],
    connectedProgrammes: ["Digital DEWA Programme"],
    rating: 4.5,
    students: 970,
    category: "Leadership & Strategy",
  },
  {
    id: "smart-grid-strategy-2021-2035",
    provider: "Internal",
    title: "Understanding DEWA's Smart Grid Strategy 2021-2035",
    description:
      "A non-technical introduction to DEWA's Smart Grid Strategy - what it targets, why it matters, and how technology architecture decisions support its delivery. Suitable for all DEWA staff.",
    duration: "4 hours",
    lessons: 5,
    level: "Beginner",
    divisionTags: ["Transmission", "Distribution"],
    phaseAlignment: ["Discern"],
    connectedProgrammes: ["Smart Grid Strategy 2021-2035"],
    rating: 4.7,
    students: 885,
    category: "Smart Grid & Grid Technology",
  },
  {
    id: "introduction-it-ot-convergence",
    provider: "Coursera",
    title: "Introduction to IT/OT Convergence",
    description:
      "Explains the convergence of Information Technology and Operational Technology - what it means, why it matters for utility organisations, and the architecture principles that govern secure IT/OT integration.",
    duration: "6 hours",
    lessons: 8,
    level: "Beginner",
    divisionTags: ["Generation", "Transmission", "Distribution", "Water Services"],
    phaseAlignment: ["Discern"],
    connectedProgrammes: ["Smart Grid Strategy", "Automation Fitness Initiative"],
    rating: 4.5,
    students: 1010,
    category: "Cybersecurity & OT Security",
  },
  {
    id: "net-zero-2050-architecture-role",
    provider: "Internal",
    title: "Net-Zero 2050 - Architecture's Role in Sustainability",
    description:
      "Introduces DEWA's Net-Zero 2050 commitment and explains how enterprise architecture decisions directly contribute to - or detract from - sustainability targets. For all DEWA staff who make or influence technology decisions.",
    duration: "3 hours",
    lessons: 5,
    level: "Beginner",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Discern"],
    connectedProgrammes: ["Net-Zero 2050", "Digital DEWA Programme"],
    rating: 4.8,
    students: 1295,
    category: "Clean Energy & Sustainability",
  },
  {
    id: "ai-in-utility-operations-introduction",
    provider: "LinkedIn Learning",
    title: "AI in Utility Operations - An Introduction",
    description:
      "A foundational course on how artificial intelligence is being applied in water and electricity utility operations - from predictive maintenance to customer service AI. Covers DEWA-relevant AI programmes including Rammas and the Virtual Engineer.",
    duration: "5 hours",
    lessons: 7,
    level: "Beginner",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Discern"],
    connectedProgrammes: ["Virtual Engineer Programme", "Rammas AI"],
    rating: 4.6,
    students: 1115,
    category: "AI & Automation",
  },
  {
    id: "dtmp-platform-orientation",
    provider: "Internal",
    title: "DTMP Platform Orientation - Getting Started",
    description:
      "A practical orientation course for all new DTMP users. Covers how to navigate the platform, access marketplaces, submit requests to the EA Office, and track your work in Stage 2.",
    duration: "2 hours",
    lessons: 4,
    level: "Beginner",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Discern"],
    connectedProgrammes: ["DTMP Platform"],
    rating: 4.9,
    students: 1525,
    featured: true,
    category: "Leadership & Strategy",
  },
  {
    id: "data-governance-fundamentals-utilities",
    provider: "Coursera",
    title: "Data Governance Fundamentals for Utilities",
    description:
      "Introduces data governance principles and why they are essential for a data-intensive utility organisation. Covers data classification, ownership, quality standards, and the architecture of a governed data environment.",
    duration: "6 hours",
    lessons: 8,
    level: "Beginner",
    divisionTags: ["Digital DEWA & Moro Hub", "All Divisions"],
    phaseAlignment: ["Discern"],
    connectedProgrammes: ["DIA Stream", "Moro Hub"],
    rating: 4.5,
    students: 960,
    category: "Data & Analytics",
  },
  {
    id: "ea-4-practice-dewa-approach",
    provider: "Internal",
    title: "EA 4.0 Practice - DEWA's Approach",
    description:
      "A deep dive into DEWA's EA 4.0 maturity standard - what it means, how it is measured, and what a division must do to achieve and maintain EA 4.0 practice. Covers the EA Charter, KPIs, and the Corporate EA Office operating model.",
    duration: "10 hours",
    lessons: 12,
    level: "Intermediate",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Discern", "Drive"],
    connectedProgrammes: ["EA 4.0 Initiative", "DTMP Platform"],
    rating: 4.8,
    students: 870,
    featured: true,
    category: "Enterprise Architecture",
  },
  {
    id: "smart-grid-architecture-design-principles",
    provider: "Internal",
    title: "Smart Grid Architecture - Design Principles",
    description:
      "Architecture design principles for DEWA's Smart Grid Strategy 2021-2035. Covers substation automation, advanced metering infrastructure, demand response systems, and the IT/OT integration architecture required for a functioning smart grid.",
    duration: "12 hours",
    lessons: 14,
    level: "Intermediate",
    divisionTags: ["Transmission", "Distribution"],
    phaseAlignment: ["Design"],
    connectedProgrammes: ["Smart Grid Strategy 2021-2035"],
    rating: 4.7,
    students: 785,
    category: "Smart Grid & Grid Technology",
  },
  {
    id: "solution-architecture-digital-platforms",
    provider: "Coursera",
    title: "Solution Architecture for Digital Platforms",
    description:
      "Covers the principles and methods of solution architecture for enterprise digital platforms - capability design, integration patterns, microservices architecture, and cloud-native design aligned to DEWA's DXP and DWS streams.",
    duration: "14 hours",
    lessons: 16,
    level: "Intermediate",
    divisionTags: ["Digital DEWA & Moro Hub", "All Divisions"],
    phaseAlignment: ["Design"],
    connectedProgrammes: ["DXP Stream", "DWS Stream"],
    rating: 4.6,
    students: 825,
    category: "Digital Platforms",
  },
  {
    id: "digital-customer-experience-utilities",
    provider: "Internal",
    title: "Designing the Digital Customer Experience for Utilities",
    description:
      "Architecture and design principles for DEWA's customer-facing digital platforms. Covers the Services 360 model, Rammas AI integration, omnichannel architecture, accessibility standards, and the People of Determination design requirements.",
    duration: "10 hours",
    lessons: 12,
    level: "Intermediate",
    divisionTags: ["Customer Services", "Digital DEWA & Moro Hub"],
    phaseAlignment: ["Design"],
    connectedProgrammes: ["DXP Stream", "Services 360", "Rammas AI"],
    rating: 4.7,
    students: 730,
    category: "Customer Experience",
  },
  {
    id: "ai-platform-architecture-design-governance",
    provider: "LinkedIn Learning",
    title: "AI Platform Architecture - Design and Governance",
    description:
      "Architecture design and governance for enterprise AI platforms. Covers AI model lifecycle management, responsible AI frameworks, multi-agent system design, and integration architecture - applied to DEWA's AI ecosystem including the Virtual Engineer and Rammas.",
    duration: "12 hours",
    lessons: 14,
    level: "Intermediate",
    divisionTags: ["Digital DEWA & Moro Hub"],
    phaseAlignment: ["Design"],
    connectedProgrammes: ["Virtual Engineer Programme", "Rammas AI", "DIA Stream"],
    rating: 4.6,
    students: 690,
    category: "AI & Automation",
  },
  {
    id: "desalination-water-network-technology-architecture",
    provider: "Internal",
    title: "Desalination & Water Network Technology Architecture",
    description:
      "Architecture principles for DEWA's desalination infrastructure and water distribution network - covering smart sensor integration, SCADA architecture, the Hatta Hydroelectric Plant IT systems, and water conservation technology design.",
    duration: "10 hours",
    lessons: 12,
    level: "Intermediate",
    divisionTags: ["Water Services"],
    phaseAlignment: ["Design"],
    connectedProgrammes: ["Water Network Programme", "Hatta Hydroelectric Plant"],
    rating: 4.6,
    students: 640,
    category: "Smart Grid & Grid Technology",
  },
  {
    id: "cybersecurity-architecture-operational-technology",
    provider: "Coursera",
    title: "Cybersecurity Architecture for Operational Technology",
    description:
      "Security architecture principles for utility OT environments - SCADA, DCS, substation automation, and smart metering security. Covers DEWA's OT security standards, IT/OT security convergence, and the architecture of secure utility operations.",
    duration: "14 hours",
    lessons: 16,
    level: "Intermediate",
    divisionTags: ["Generation", "Transmission", "Distribution", "Water Services"],
    phaseAlignment: ["Design", "Deploy"],
    connectedProgrammes: ["SDO Stream", "Smart Grid Strategy"],
    rating: 4.7,
    students: 845,
    category: "Cybersecurity & OT Security",
  },
  {
    id: "ea-assessment-methods",
    provider: "Internal",
    title: "EA Assessment Methods - Maturity, Readiness & Fitness",
    description:
      "Practical methods for conducting EA maturity assessments, digital readiness assessments, and automation fitness assessments. Aligned to DEWA's assessment framework as delivered through the Document Studio marketplace.",
    duration: "8 hours",
    lessons: 10,
    level: "Intermediate",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Discern"],
    connectedProgrammes: ["EA 4.0 Initiative", "Document Studio"],
    rating: 4.7,
    students: 760,
    category: "Enterprise Architecture",
  },
  {
    id: "portfolio-programme-management-transformation",
    provider: "LinkedIn Learning",
    title: "Portfolio & Programme Management for Transformation",
    description:
      "Principles and methods for managing a transformation programme portfolio - initiative tracking, investment alignment, EA compliance monitoring, and technology rationalisation. Directly supports use of DTMP's Portfolio Management marketplace.",
    duration: "12 hours",
    lessons: 14,
    level: "Intermediate",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Drive"],
    connectedProgrammes: ["Portfolio Management Marketplace"],
    rating: 4.5,
    students: 715,
    category: "Programme & Portfolio Management",
  },
  {
    id: "ev-infrastructure-architecture-smart-cities",
    provider: "Internal",
    title: "EV Infrastructure Architecture for Smart Cities",
    description:
      "Architecture design for EV charging infrastructure at city scale - interoperability standards, grid integration, data architecture, and the DEWA-RTA partnership model for Dubai's clean mobility programme.",
    duration: "8 hours",
    lessons: 10,
    level: "Intermediate",
    divisionTags: ["Distribution", "Digital DEWA & Moro Hub"],
    phaseAlignment: ["Design", "Deploy"],
    connectedProgrammes: ["Smart Grid Strategy", "DXP Stream"],
    rating: 4.6,
    students: 655,
    category: "Clean Energy & Sustainability",
  },
  {
    id: "cloud-architecture-migration-government-utilities",
    provider: "Coursera",
    title: "Cloud Architecture & Migration for Government Utilities",
    description:
      "Cloud architecture principles and migration methodologies for government utility environments - covering Moro Hub's green data centre, cloud security requirements, hybrid cloud patterns, and government data residency standards applicable to DEWA.",
    duration: "14 hours",
    lessons: 16,
    level: "Intermediate",
    divisionTags: ["Digital DEWA & Moro Hub"],
    phaseAlignment: ["Design", "Deploy"],
    connectedProgrammes: ["Moro Hub", "DWS Stream"],
    rating: 4.6,
    students: 805,
    category: "Digital Platforms",
  },
  {
    id: "stakeholder-engagement-ea-led-transformation",
    provider: "Internal",
    title: "Stakeholder Engagement in EA-Led Transformation",
    description:
      "Practical methods for engaging executives, division leads, project teams, and operational staff in EA-governed transformation. Covers communication frameworks, change narratives, and how to build architecture advocacy across DEWA's diverse stakeholder landscape.",
    duration: "7 hours",
    lessons: 9,
    level: "Intermediate",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Drive"],
    connectedProgrammes: ["EA 4.0 Initiative"],
    rating: 4.7,
    students: 700,
    category: "Leadership & Strategy",
  },
  {
    id: "enterprise-architecture-governance-leading-ea-office",
    provider: "Internal",
    title: "Enterprise Architecture Governance - Leading the EA Office",
    description:
      "Advanced course for EA Office leads and senior architects. Covers establishing and operating a Corporate EA Office, building governance frameworks, managing the architecture repository, measuring EA maturity, and reporting to executive leadership.",
    duration: "16 hours",
    lessons: 18,
    level: "Advanced",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Drive"],
    connectedProgrammes: ["EA 4.0 Initiative", "DTMP Platform"],
    rating: 4.9,
    students: 590,
    featured: true,
    category: "Enterprise Architecture",
  },
  {
    id: "virtual-engineer-architecture-design-deployment",
    provider: "Internal",
    title: "Virtual Engineer Architecture - Design & Deployment",
    description:
      "Advanced architecture course for the design and deployment of the DEWA Virtual Engineer - predictive failure analysis, root cause diagnostics, autonomous grid optimisation, and the integration architecture connecting the Virtual Engineer to Transmission, Distribution, and Generation OT systems.",
    duration: "16 hours",
    lessons: 18,
    level: "Advanced",
    divisionTags: ["Digital DEWA & Moro Hub", "Transmission"],
    phaseAlignment: ["Design", "Deploy"],
    connectedProgrammes: ["Virtual Engineer Programme"],
    rating: 4.8,
    students: 610,
    featured: true,
    category: "AI & Automation",
  },
  {
    id: "advanced-it-ot-convergence-architecture",
    provider: "LinkedIn Learning",
    title: "Advanced IT/OT Convergence Architecture",
    description:
      "Deep architecture course on IT/OT convergence for operational technology environments at utility scale. Covers the PURDUE model, IEC 62443 security standards, SCADA integration patterns, and real-time OT data architecture - directly applicable to DEWA's Generation, Transmission, Distribution, and Water Services OT estates.",
    duration: "18 hours",
    lessons: 20,
    level: "Advanced",
    divisionTags: ["Generation", "Transmission", "Distribution", "Water Services"],
    phaseAlignment: ["Design", "Deploy"],
    connectedProgrammes: ["SDO Stream", "Smart Grid Strategy"],
    rating: 4.7,
    students: 545,
    category: "Cybersecurity & OT Security",
  },
  {
    id: "clean-energy-architecture-solar-storage-grid-integration",
    provider: "Coursera",
    title: "Clean Energy Architecture - Solar, Storage & Grid Integration",
    description:
      "Advanced architecture course for the technology systems underpinning DEWA's clean energy infrastructure. Covers MBR Solar Park system architecture, energy storage integration, grid balancing architecture, and the technology stack required to meet DEWA's 36% clean energy target by 2030.",
    duration: "16 hours",
    lessons: 18,
    level: "Advanced",
    divisionTags: ["Generation", "Transmission"],
    phaseAlignment: ["Design", "Deploy"],
    connectedProgrammes: ["Net-Zero 2050", "MBR Solar Park", "Smart Grid Strategy"],
    rating: 4.8,
    students: 575,
    category: "Clean Energy & Sustainability",
  },
  {
    id: "measuring-transformation-roi-ea-kpis-value-tracking",
    provider: "Internal",
    title: "Measuring Transformation ROI - EA KPIs & Value Tracking",
    description:
      "Advanced methods for defining, tracking, and communicating the return on investment from EA-governed transformation. Covers DEWA-specific KPI frameworks, how to measure EA maturity impact on business outcomes, and how to build the evidence base for continued EA investment.",
    duration: "12 hours",
    lessons: 14,
    level: "Advanced",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Drive"],
    connectedProgrammes: ["EA 4.0 Initiative", "Digital Intelligence Marketplace"],
    rating: 4.7,
    students: 625,
    category: "Programme & Portfolio Management",
  },
  {
    id: "architecture-for-net-zero-advanced-sustainability-governance",
    provider: "Internal",
    title: "Architecture for Net-Zero - Advanced Sustainability Governance",
    description:
      "Advanced course on governing technology architecture decisions for sustainability outcomes. Covers carbon impact measurement in technology portfolios, sustainable architecture patterns, lifecycle analysis of digital assets, and how to align every architecture decision to DEWA's Net-Zero 2050 commitment.",
    duration: "14 hours",
    lessons: 16,
    level: "Advanced",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Drive"],
    connectedProgrammes: ["Net-Zero 2050", "Portfolio Management Marketplace"],
    rating: 4.8,
    students: 605,
    category: "Clean Energy & Sustainability",
  },
  {
    id: "enterprise-integration-architecture-at-scale",
    provider: "Coursera",
    title: "Enterprise Integration Architecture at Scale",
    description:
      "Advanced integration architecture for large, multi-division organisations. Covers API management at scale, event-driven architecture, integration governance, and the specific integration challenges of connecting DEWA's six divisions to the Digital Business Platform.",
    duration: "18 hours",
    lessons: 20,
    level: "Advanced",
    divisionTags: ["Digital DEWA & Moro Hub", "All Divisions"],
    phaseAlignment: ["Design", "Deploy"],
    connectedProgrammes: ["DIA Stream", "Moro Hub", "DBP"],
    rating: 4.6,
    students: 560,
    category: "Digital Platforms",
  },
  {
    id: "executive-transformation-leadership-dewa-context",
    provider: "Internal",
    title: "Executive Transformation Leadership - DEWA Context",
    description:
      "A C-suite and director-level programme on leading enterprise-wide digital transformation. Covers how DEWA's executive leadership can use DTMP, interpret EA maturity dashboards, govern the transformation portfolio, and champion the Net-Zero architecture agenda across all divisions.",
    duration: "8 hours",
    lessons: 10,
    level: "Advanced",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Drive"],
    connectedProgrammes: ["EA 4.0 Initiative", "Digital Intelligence Marketplace", "Net-Zero 2050"],
    rating: 4.9,
    students: 680,
    featured: true,
    category: "Leadership & Strategy",
    targetAudience: "Senior leaders, directors, and executives guiding enterprise-wide transformation and governance decisions.",
  },
].map(buildCourse);

export const coursesFilters = {
  department: [
    "Generation",
    "Transmission",
    "Distribution",
    "Water Services",
    "Customer Services",
    "Digital DEWA & Moro Hub",
    "Corporate EA Office",
    "All Divisions",
  ],
  category: [
    "Enterprise Architecture",
    "Smart Grid & Grid Technology",
    "AI & Automation",
    "Cybersecurity & OT Security",
    "Clean Energy & Sustainability",
    "Digital Platforms",
    "Data & Analytics",
    "Customer Experience",
    "Programme & Portfolio Management",
    "Leadership & Strategy",
  ],
  provider: ["Coursera", "LinkedIn Learning", "Internal"],
  level: ["Beginner", "Intermediate", "Advanced"],
  duration: ["< 5 hours", "5-10 hours", "10-20 hours", "20-40 hours", "40+ hours"],
  format: ["Self-paced", "Instructor-led", "Blended", "Workshop", "Cohort-based"],
  rating: ["5 stars", "4+ stars", "3+ stars", "All"],
};
