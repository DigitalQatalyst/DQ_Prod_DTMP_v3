export interface LearningTrack {
  id: string;
  title: string;
  description: string;
  courses: number;
  duration: string;
  role: string;
  focusArea: string;
  certification: boolean;
  prerequisites: string;
  introduction?: string;
  highlights?: string[];
  learningOutcomes?: string[];
  courseList?: {
    id: string;
    title: string;
    duration: string;
    completed?: boolean;
  }[];
  targetAudience?: string;
  recommendedRoles?: string[];
  requirements?: string[];
  timeline?: string;
  assessmentInfo?: string;
  inclusions?: string[];
}

export const learningTracks: LearningTrack[] = [
  {
    id: "transformation-leader",
    title: "Transformation Leader Pathway",
    description: "Complete pathway for transformation leaders driving enterprise-wide change",
    courses: 6,
    duration: "3 months",
    role: "Transformation Leader",
    focusArea: "Strategy",
    certification: true,
    prerequisites: "None",
    introduction: "The Transformation Leader Pathway is a comprehensive program designed to equip leaders with the skills, frameworks, and mindset needed to drive enterprise-wide digital transformation. This curated sequence of courses builds progressively from foundational concepts to advanced leadership practices.",
    highlights: [
      "Complete transformation leadership curriculum",
      "Progressive skill building across 6 courses",
      "Real-world transformation projects",
      "Executive certification upon completion"
    ],
    learningOutcomes: [
      "Lead enterprise transformation initiatives end-to-end",
      "Apply the 4D governance model effectively",
      "Build and manage high-performing transformation teams",
      "Measure and communicate transformation value"
    ],
    courseList: [
      { id: "dt-fundamentals", title: "Digital Transformation Fundamentals", duration: "8 hours" },
      { id: "4d-model-mastery", title: "4D Transformation Model Mastery", duration: "10 hours" },
      { id: "change-leadership", title: "Change Leadership in Transformation", duration: "12 hours" },
      { id: "strategic-roadmap", title: "Strategic Roadmap Development", duration: "8 hours" },
      { id: "stakeholder-engagement", title: "Stakeholder Engagement & Communication", duration: "7 hours" },
      { id: "transformation-roi", title: "Measuring Transformation ROI", duration: "9 hours" }
    ],
    targetAudience: "Current and aspiring transformation leaders who want to develop comprehensive skills for leading enterprise-wide change initiatives.",
    recommendedRoles: ["Transformation Directors", "Change Managers", "Program Managers", "Senior Project Managers"],
    requirements: ["Commitment to complete all 6 courses", "Access to a real transformation initiative for project work", "Time allocation of 10-15 hours per week"],
    timeline: "Recommended completion in 3 months with structured progression through courses. Certification exam available after completing all courses.",
    assessmentInfo: "Complete all 6 courses, submit a transformation project portfolio, and pass the certification exam to earn the Transformation Leader Certification.",
    inclusions: ["6 curated courses", "Certification exam", "Project portfolio review", "Alumni network access", "Digital badge"]
  },
  {
    id: "enterprise-architect",
    title: "Enterprise Architect Excellence Track",
    description: "Master enterprise architecture for digital platforms",
    courses: 8,
    duration: "4 months",
    role: "Enterprise Architect",
    focusArea: "Architecture",
    certification: true,
    prerequisites: "Basic",
    introduction: "The Enterprise Architect Excellence Track provides comprehensive training in enterprise architecture aligned with DBP principles. This program builds the skills needed to design, govern, and evolve enterprise digital platforms.",
    highlights: [
      "Complete enterprise architecture curriculum",
      "DBP-aligned architecture frameworks",
      "Hands-on architecture exercises",
      "Professional certification"
    ],
    learningOutcomes: [
      "Design enterprise-scale digital architectures",
      "Apply TOGAF and DBP frameworks together",
      "Lead architecture governance",
      "Create technology roadmaps"
    ],
    courseList: [
      { id: "dt-fundamentals", title: "Digital Transformation Fundamentals", duration: "8 hours" },
      { id: "dbp-capability", title: "DBP Capability Framework Deep Dive", duration: "12 hours" },
      { id: "enterprise-arch", title: "Enterprise Architecture for Digital Leaders", duration: "16 hours" },
      { id: "cloud-architecture", title: "Cloud Architecture Fundamentals", duration: "15 hours" }
    ],
    targetAudience: "IT architects, solution architects, and technical leaders transitioning to enterprise architecture roles.",
    recommendedRoles: ["Solution Architects", "IT Architects", "Technical Leads", "Platform Engineers"],
    requirements: ["5+ years in IT or architecture roles", "Basic understanding of enterprise systems", "Technical aptitude"],
    inclusions: ["8 curated courses", "Architecture labs", "Certification exam", "Professional network", "Digital badge"]
  },
  {
    id: "portfolio-manager",
    title: "Portfolio Manager Certification Path",
    description: "Comprehensive portfolio management certification program",
    courses: 5,
    duration: "2 months",
    role: "Portfolio Manager",
    focusArea: "Governance",
    certification: true,
    prerequisites: "None",
    introduction: "This certification path prepares professionals to manage application and project portfolios strategically. Learn the frameworks, tools, and practices for effective portfolio governance.",
    highlights: [
      "Dual focus on application and project portfolios",
      "Strategic prioritization skills",
      "Governance framework training",
      "Industry-recognized certification"
    ],
    learningOutcomes: [
      "Establish portfolio governance structures",
      "Apply strategic prioritization",
      "Manage portfolio performance",
      "Report to executive stakeholders"
    ],
    courseList: [
      { id: "dt-fundamentals", title: "Digital Transformation Fundamentals", duration: "8 hours" },
      { id: "portfolio-mgmt-cert", title: "Portfolio Management Excellence", duration: "20 hours" },
      { id: "lifecycle-best-practices", title: "Lifecycle Management Best Practices", duration: "14 hours" }
    ],
    targetAudience: "Portfolio managers, PMO leaders, and IT managers responsible for portfolio oversight.",
    recommendedRoles: ["Portfolio Managers", "PMO Directors", "IT Managers", "Investment Analysts"],
    inclusions: ["5 curated courses", "Portfolio templates", "Certification exam", "Alumni network"]
  },
  {
    id: "digital-product-owner",
    title: "Digital Product Owner Track",
    description: "Product ownership in digital transformation context",
    courses: 6,
    duration: "2.5 months",
    role: "Project Manager",
    focusArea: "Delivery",
    certification: false,
    prerequisites: "Basic",
    introduction: "Develop product ownership skills in the context of digital transformation. This track combines product management fundamentals with transformation-specific practices.",
    highlights: [
      "Product management fundamentals",
      "Agile product ownership",
      "Stakeholder management",
      "Digital product strategy"
    ],
    learningOutcomes: [
      "Define and prioritize product backlogs",
      "Apply agile product ownership practices",
      "Align products with transformation goals",
      "Measure product success"
    ],
    courseList: [
      { id: "dt-fundamentals", title: "Digital Transformation Fundamentals", duration: "8 hours" },
      { id: "agile-transformation", title: "Agile Transformation Methods", duration: "11 hours" },
      { id: "stakeholder-engagement", title: "Stakeholder Engagement & Communication", duration: "7 hours" }
    ],
    targetAudience: "Product owners, product managers, and project managers transitioning to product roles.",
    recommendedRoles: ["Product Owners", "Product Managers", "Project Managers", "Business Analysts"],
    inclusions: ["6 curated courses", "Product templates", "Peer learning", "Downloadable resources"]
  },
  {
    id: "change-champion",
    title: "Change Champion Development Path",
    description: "Lead organizational change in transformation initiatives",
    courses: 4,
    duration: "6 weeks",
    role: "Change Manager",
    focusArea: "Governance",
    certification: false,
    prerequisites: "None",
    introduction: "Become an effective change champion in your organization. This accelerated path develops the skills to lead and support organizational change during transformation.",
    highlights: [
      "Change management essentials",
      "Communication strategies",
      "Resistance management",
      "Peer champion network"
    ],
    learningOutcomes: [
      "Support organizational change effectively",
      "Communicate change compellingly",
      "Manage resistance at the team level",
      "Build change readiness"
    ],
    courseList: [
      { id: "dt-fundamentals", title: "Digital Transformation Fundamentals", duration: "8 hours" },
      { id: "change-leadership", title: "Change Leadership in Transformation", duration: "12 hours" },
      { id: "stakeholder-engagement", title: "Stakeholder Engagement & Communication", duration: "7 hours" }
    ],
    targetAudience: "Team leads, supervisors, and individual contributors who want to champion change in their areas.",
    recommendedRoles: ["Team Leads", "Supervisors", "Individual Contributors", "HR Business Partners"],
    inclusions: ["4 curated courses", "Change toolkit", "Champion community", "Recognition program"]
  },
  {
    id: "technical-lead",
    title: "Technical Lead Transformation Track",
    description: "Technical leadership in digital transformation",
    courses: 7,
    duration: "3 months",
    role: "Technology Lead",
    focusArea: "Technical",
    certification: true,
    prerequisites: "Intermediate",
    introduction: "This track prepares technical leaders to drive technology transformation. Combine technical depth with leadership skills for effective technology change leadership.",
    highlights: [
      "Technical leadership development",
      "Architecture and platform skills",
      "Team leadership practices",
      "Technical certification"
    ],
    learningOutcomes: [
      "Lead technical transformation initiatives",
      "Design scalable platforms",
      "Build and lead technical teams",
      "Balance technical debt with innovation"
    ],
    courseList: [
      { id: "dt-fundamentals", title: "Digital Transformation Fundamentals", duration: "8 hours" },
      { id: "enterprise-arch", title: "Enterprise Architecture for Digital Leaders", duration: "16 hours" },
      { id: "cloud-architecture", title: "Cloud Architecture Fundamentals", duration: "15 hours" },
      { id: "ai-transformation", title: "AI in Digital Transformation", duration: "6 hours" }
    ],
    targetAudience: "Technical leads, senior developers, and architects stepping into leadership roles.",
    recommendedRoles: ["Technical Leads", "Senior Developers", "DevOps Engineers", "Platform Engineers"],
    inclusions: ["7 curated courses", "Technical labs", "Certification exam", "Mentorship program"]
  },
  {
    id: "executive-leadership",
    title: "Executive Transformation Leadership",
    description: "C-level program for leading enterprise transformation",
    courses: 4,
    duration: "1 month",
    role: "Executive",
    focusArea: "Strategy",
    certification: true,
    prerequisites: "None",
    introduction: "An intensive executive program designed for C-level leaders and senior executives. Focus on strategic transformation leadership, board engagement, and enterprise-wide change.",
    highlights: [
      "Executive-focused content",
      "Peer networking with other executives",
      "Board and investor communications",
      "Executive coaching"
    ],
    learningOutcomes: [
      "Set transformation vision and strategy",
      "Lead cultural transformation",
      "Engage boards and investors",
      "Drive enterprise-wide change"
    ],
    courseList: [
      { id: "transformation-leadership", title: "Transformation Leadership Program", duration: "24 hours" },
      { id: "transformation-roi", title: "Measuring Transformation ROI", duration: "9 hours" }
    ],
    targetAudience: "C-level executives, senior VPs, and board members responsible for transformation oversight.",
    recommendedRoles: ["CEOs", "CIOs", "CTOs", "CDOs", "Senior VPs"],
    inclusions: ["4 executive courses", "Executive coaching", "Peer networking", "Certification", "Alumni access"]
  },
  {
    id: "fullstack-professional",
    title: "Full-Stack Transformation Professional",
    description: "Comprehensive program covering all aspects of transformation",
    courses: 12,
    duration: "6 months",
    role: "Transformation Leader",
    focusArea: "All",
    certification: true,
    prerequisites: "Intermediate",
    introduction: "The most comprehensive transformation program available. Cover all aspects of digital transformation from strategy to execution, governance to technology, change to measurement.",
    highlights: [
      "Complete transformation curriculum",
      "All major domains covered",
      "Multiple specialization options",
      "Premium certification"
    ],
    learningOutcomes: [
      "Lead transformation across all dimensions",
      "Advise on any transformation topic",
      "Build transformation practices",
      "Mentor other transformation professionals"
    ],
    courseList: [
      { id: "dt-fundamentals", title: "Digital Transformation Fundamentals", duration: "8 hours" },
      { id: "dbp-capability", title: "DBP Capability Framework Deep Dive", duration: "12 hours" },
      { id: "4d-model-mastery", title: "4D Transformation Model Mastery", duration: "10 hours" },
      { id: "enterprise-arch", title: "Enterprise Architecture for Digital Leaders", duration: "16 hours" },
      { id: "portfolio-mgmt-cert", title: "Portfolio Management Excellence", duration: "20 hours" },
      { id: "change-leadership", title: "Change Leadership in Transformation", duration: "12 hours" },
      { id: "transformation-leadership", title: "Transformation Leadership Program", duration: "24 hours" }
    ],
    targetAudience: "Ambitious professionals seeking comprehensive transformation expertise.",
    recommendedRoles: ["Transformation Consultants", "Transformation Directors", "Enterprise Architects", "Change Directors"],
    inclusions: ["12 courses", "Multiple certifications", "Capstone project", "Executive mentoring", "Lifetime alumni access"]
  }
];

export const tracksFilters = {
  role: ["Transformation Leader", "Enterprise Architect", "Portfolio Manager", "Project Manager", "Change Manager", "Technology Lead", "Executive"],
  focusArea: ["Strategy", "Architecture", "Delivery", "Governance", "Technical", "All"],
  duration: ["2-4 weeks", "1-2 months", "2-3 months", "3-6 months"],
  includesCertification: ["Yes", "No"],
  prerequisites: ["None", "Basic", "Intermediate"]
};
