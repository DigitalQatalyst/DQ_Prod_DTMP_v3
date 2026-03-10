import type { LearningTrack, LearningTrackCourseItem, TrackCourseRequirement } from "./types";
export type { LearningTrack };

type LearningTrackBase = Omit<LearningTrack, "trackRuntime">;

type TrackSeed = Omit<LearningTrackBase, "courses" | "courseList"> & {
  courseList: LearningTrackCourseItem[];
};

const runtimeFromCourseList = (
  courseList: LearningTrackCourseItem[] = [],
  options?: {
    completionRule?: "all-required" | "required-plus-electives";
    electiveCourseIds?: string[];
    minimumElectives?: number;
    capstoneRequired?: boolean;
  }
) => {
  const electiveIds = new Set(options?.electiveCourseIds ?? []);
  const completionRule = options?.completionRule ?? "all-required";

  return {
    completionRule,
    minimumElectives: options?.minimumElectives ?? 0,
    capstoneRequired: options?.capstoneRequired ?? false,
    courses: courseList.map((course, index) => {
      const requirement: TrackCourseRequirement = electiveIds.has(course.id)
        ? "elective"
        : "required";
      return {
        courseId: course.id,
        title: course.title,
        duration: course.duration,
        order: index + 1,
        requirement,
        weight: requirement === "required" ? 1 : 0.5,
      };
    }),
  };
};

const buildTrack = (track: TrackSeed): LearningTrackBase => ({
  ...track,
  courses: track.courseList.length,
  introduction:
    track.introduction ??
    `${track.description} This pathway is contextualised to DEWA's architecture priorities and role expectations.`,
  highlights:
    track.highlights ??
    [
      `Aligned to ${track.divisionTags?.join(", ") ?? "DEWA-wide"} contexts`,
      `Supports ${track.phaseAlignment?.join(" / ") ?? "DEWA"} phases in the 4D model`,
      `Connected to ${track.connectedProgrammes?.join(", ") ?? "key DEWA programmes"}`,
    ],
  learningOutcomes:
    track.learningOutcomes ??
    [
      "Build practical fluency in the relevant DEWA transformation context",
      "Connect learning directly to architecture governance and delivery expectations",
      "Apply the pathway content to real DTMP-aligned work",
    ],
  targetAudience:
    track.targetAudience ??
    `DEWA professionals in ${track.role} responsibilities who need structured capability building in this focus area.`,
  recommendedRoles: track.recommendedRoles ?? [track.role, "Enterprise Architect", "Programme Lead"],
  requirements:
    track.requirements ??
    [
      "Commitment to complete the courses in sequence",
      "Access to DTMP learning content",
      "Ability to apply learning to DEWA delivery contexts",
    ],
  timeline:
    track.timeline ??
    `Structured completion over ${track.duration.toLowerCase()} with course-by-course progression.`,
  assessmentInfo:
    track.assessmentInfo ??
    "Complete the required courses in the pathway and satisfy the relevant knowledge checks or completion activities.",
  inclusions:
    track.inclusions ??
    ["Curated courses", "DEWA-contextual learning path", "Completion tracking", "Certificate where applicable"],
});

const learningTracksBase: LearningTrackBase[] = [
  buildTrack({
    id: "dewa-ea-practitioner-pathway",
    title: "DEWA EA Practitioner Pathway",
    description:
      "The foundational track for anyone taking on an EA role within DEWA. Builds from first principles through to active EA Office governance - covering the 4D model, EA 4.0 practice, assessment methods, and transformation measurement.",
    duration: "Approx. 4 months",
    role: "EA Practitioner",
    focusArea: "Enterprise Architecture",
    certification: true,
    prerequisites: "None",
    prerequisiteLevel: "None",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Discern", "Drive"],
    connectedProgrammes: ["EA 4.0 Initiative", "DTMP Platform"],
    courseList: [
      { id: "enterprise-architecture-fundamentals-dewa", title: "Enterprise Architecture Fundamentals for DEWA", duration: "6 hours" },
      { id: "introduction-4d-governance-model", title: "Introduction to the 4D Governance Model", duration: "5 hours" },
      { id: "digital-business-platform-overview", title: "DEWA's Digital Business Platform - An Overview", duration: "4 hours" },
      { id: "dtmp-platform-orientation", title: "DTMP Platform Orientation - Getting Started", duration: "2 hours" },
      { id: "ea-4-practice-dewa-approach", title: "EA 4.0 Practice - DEWA's Approach", duration: "10 hours" },
      { id: "ea-assessment-methods", title: "EA Assessment Methods - Maturity, Readiness & Fitness", duration: "8 hours" },
      { id: "enterprise-architecture-governance-leading-ea-office", title: "Enterprise Architecture Governance - Leading the EA Office", duration: "16 hours" },
    ],
  }),
  buildTrack({
    id: "smart-grid-transmission-architecture-track",
    title: "Smart Grid & Transmission Architecture Track",
    description:
      "A focused track for architects and engineers working on DEWA's Smart Grid Strategy and Transmission Power Division programmes. Covers grid architecture, IT/OT convergence, cybersecurity, and clean energy integration.",
    duration: "Approx. 5 months",
    role: "Grid Architect",
    focusArea: "Smart Grid",
    certification: true,
    prerequisites: "Course 01 or equivalent EA background",
    prerequisiteLevel: "Basic",
    divisionTags: ["Transmission", "Distribution", "Generation"],
    phaseAlignment: ["Design", "Deploy"],
    connectedProgrammes: ["Smart Grid Strategy 2021-2035", "SDO Stream", "Net-Zero 2050"],
    courseList: [
      { id: "smart-grid-strategy-2021-2035", title: "Understanding DEWA's Smart Grid Strategy 2021-2035", duration: "4 hours" },
      { id: "introduction-it-ot-convergence", title: "Introduction to IT/OT Convergence", duration: "6 hours" },
      { id: "smart-grid-architecture-design-principles", title: "Smart Grid Architecture - Design Principles", duration: "12 hours" },
      { id: "cybersecurity-architecture-operational-technology", title: "Cybersecurity Architecture for Operational Technology", duration: "14 hours" },
      { id: "advanced-it-ot-convergence-architecture", title: "Advanced IT/OT Convergence Architecture", duration: "18 hours" },
      { id: "clean-energy-architecture-solar-storage-grid-integration", title: "Clean Energy Architecture - Solar, Storage & Grid Integration", duration: "16 hours" },
    ],
  }),
  buildTrack({
    id: "ai-governance-digital-innovation-track",
    title: "AI Governance & Digital Innovation Track",
    description:
      "For architects, data scientists, and programme managers working on DEWA's AI and digital innovation programmes - including the Virtual Engineer, Rammas, and enterprise Copilot deployments.",
    duration: "Approx. 4 months",
    role: "AI & Innovation Architect",
    focusArea: "AI & Digital Innovation",
    certification: true,
    prerequisites: "Course 08 recommended",
    prerequisiteLevel: "Basic",
    divisionTags: ["Digital DEWA & Moro Hub"],
    phaseAlignment: ["Design", "Deploy"],
    connectedProgrammes: ["Virtual Engineer Programme", "Rammas AI", "DIA Stream"],
    courseList: [
      { id: "ai-in-utility-operations-introduction", title: "AI in Utility Operations - An Introduction", duration: "5 hours" },
      { id: "ai-platform-architecture-design-governance", title: "AI Platform Architecture - Design and Governance", duration: "12 hours" },
      { id: "cloud-architecture-migration-government-utilities", title: "Cloud Architecture & Migration for Government Utilities", duration: "14 hours" },
      { id: "virtual-engineer-architecture-design-deployment", title: "Virtual Engineer Architecture - Design & Deployment", duration: "16 hours" },
      { id: "enterprise-integration-architecture-at-scale", title: "Enterprise Integration Architecture at Scale", duration: "18 hours" },
    ],
  }),
  buildTrack({
    id: "transformation-portfolio-governance-track",
    title: "Transformation Portfolio & Governance Track",
    description:
      "For programme managers, portfolio leads, and EA Office members responsible for tracking and governing DEWA's transformation portfolio. Covers portfolio management methods, KPI frameworks, investment alignment, and transformation ROI measurement.",
    duration: "Approx. 3 months",
    role: "Portfolio Manager",
    focusArea: "Portfolio Governance",
    certification: true,
    prerequisites: "None",
    prerequisiteLevel: "None",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Drive"],
    connectedProgrammes: ["Portfolio Management Marketplace", "EA 4.0 Initiative"],
    courseList: [
      { id: "dtmp-platform-orientation", title: "DTMP Platform Orientation - Getting Started", duration: "2 hours" },
      { id: "ea-4-practice-dewa-approach", title: "EA 4.0 Practice - DEWA's Approach", duration: "10 hours" },
      { id: "ea-assessment-methods", title: "EA Assessment Methods - Maturity, Readiness & Fitness", duration: "8 hours" },
      { id: "portfolio-programme-management-transformation", title: "Portfolio & Programme Management for Transformation", duration: "12 hours" },
      { id: "measuring-transformation-roi-ea-kpis-value-tracking", title: "Measuring Transformation ROI - EA KPIs & Value Tracking", duration: "12 hours" },
    ],
  }),
  buildTrack({
    id: "customer-experience-ai-services-architecture-track",
    title: "Customer Experience & AI Services Architecture Track",
    description:
      "For architects and project leads working on DEWA's customer-facing digital platforms - Rammas, Services 360, self-service, and the DXP stream. Covers CX architecture, AI service design, and integration at scale.",
    duration: "Approx. 3 months",
    role: "CX Architect",
    focusArea: "Customer Experience",
    certification: false,
    prerequisites: "None",
    prerequisiteLevel: "None",
    divisionTags: ["Customer Services", "Digital DEWA & Moro Hub"],
    phaseAlignment: ["Design", "Deploy"],
    connectedProgrammes: ["DXP Stream", "Services 360", "Rammas AI"],
    courseList: [
      { id: "ai-in-utility-operations-introduction", title: "AI in Utility Operations - An Introduction", duration: "5 hours" },
      { id: "digital-customer-experience-utilities", title: "Designing the Digital Customer Experience for Utilities", duration: "10 hours" },
      { id: "ai-platform-architecture-design-governance", title: "AI Platform Architecture - Design and Governance", duration: "12 hours" },
      { id: "stakeholder-engagement-ea-led-transformation", title: "Stakeholder Engagement in EA-Led Transformation", duration: "7 hours" },
      { id: "enterprise-integration-architecture-at-scale", title: "Enterprise Integration Architecture at Scale", duration: "18 hours" },
    ],
  }),
  buildTrack({
    id: "net-zero-sustainability-architecture-track",
    title: "Net-Zero & Sustainability Architecture Track",
    description:
      "For anyone working on DEWA's Net-Zero 2050 programme or sustainability-linked technology investments. Covers clean energy architecture, sustainability governance, and how to embed Net-Zero thinking into every architecture decision.",
    duration: "Approx. 3 months",
    role: "Sustainability Architect",
    focusArea: "Net-Zero & Sustainability",
    certification: true,
    prerequisites: "None",
    prerequisiteLevel: "None",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Design", "Drive"],
    connectedProgrammes: ["Net-Zero 2050", "MBR Solar Park", "Portfolio Management Marketplace"],
    courseList: [
      { id: "net-zero-2050-architecture-role", title: "Net-Zero 2050 - Architecture's Role in Sustainability", duration: "3 hours" },
      { id: "clean-energy-architecture-solar-storage-grid-integration", title: "Clean Energy Architecture - Solar, Storage & Grid Integration", duration: "16 hours" },
      { id: "architecture-for-net-zero-advanced-sustainability-governance", title: "Architecture for Net-Zero - Advanced Sustainability Governance", duration: "14 hours" },
      { id: "executive-transformation-leadership-dewa-context", title: "Executive Transformation Leadership - DEWA Context", duration: "8 hours" },
    ],
  }),
  buildTrack({
    id: "executive-transformation-leadership-track",
    title: "Executive Transformation Leadership Track",
    description:
      "A condensed, high-impact track for DEWA's senior leaders and executives. Covers the strategic essentials of EA-governed transformation - what to expect, how to read the dashboards, and how to champion the agenda at board level.",
    duration: "Approx. 6 weeks",
    role: "Executive",
    focusArea: "Executive Leadership",
    certification: true,
    prerequisites: "None - designed for non-technical senior leaders",
    prerequisiteLevel: "None",
    divisionTags: ["All Divisions"],
    phaseAlignment: ["Discern", "Drive"],
    connectedProgrammes: ["EA 4.0 Initiative", "Net-Zero 2050", "Digital Intelligence Marketplace"],
    courseList: [
      { id: "introduction-4d-governance-model", title: "Introduction to the 4D Governance Model", duration: "5 hours" },
      { id: "net-zero-2050-architecture-role", title: "Net-Zero 2050 - Architecture's Role in Sustainability", duration: "3 hours" },
      { id: "executive-transformation-leadership-dewa-context", title: "Executive Transformation Leadership - DEWA Context", duration: "8 hours" },
    ],
  }),
];

export const learningTracks: LearningTrack[] = learningTracksBase.map((track) => ({
  ...track,
  trackRuntime: runtimeFromCourseList(track.courseList, {
    completionRule: "all-required",
    minimumElectives: 0,
    capstoneRequired: false,
  }),
}));

export const tracksFilters = {
  role: [
    "EA Practitioner",
    "Grid Architect",
    "AI & Innovation Architect",
    "Portfolio Manager",
    "CX Architect",
    "Sustainability Architect",
    "Executive",
  ],
  focusArea: [
    "Enterprise Architecture",
    "Smart Grid",
    "AI & Digital Innovation",
    "Portfolio Governance",
    "Customer Experience",
    "Net-Zero & Sustainability",
    "Executive Leadership",
  ],
  duration: ["2-4 weeks", "1-2 months", "2-3 months", "3-6 months"],
  includesCertification: ["Yes", "No"],
  prerequisites: ["None", "Basic", "Intermediate"],
};
