export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced" | "Executive";
  provider: { name: string; logo?: string } | null;
  rating: number;
  students: number;
  featured?: boolean;
  department: string;
  category: string;
  format: string;
  certification: boolean;
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

export const courses: Course[] = [
  {
    id: "dt-fundamentals",
    title: "Digital Transformation Fundamentals",
    description: "Master the core concepts of digital transformation and the DBP framework",
    duration: "8 hours",
    lessons: 12,
    level: "Beginner",
    provider: { name: "Coursera" },
    rating: 4.8,
    students: 1250,
    featured: true,
    department: "Engineering",
    category: "Technical",
    format: "Self-paced",
    certification: true,
    introduction: "This comprehensive course provides a foundational understanding of digital transformation principles and the Digital Business Platform (DBP) framework. You'll learn how organizations successfully navigate digital change and build sustainable digital capabilities.",
    highlights: [
      "Understand the core principles of digital transformation",
      "Learn the DBP framework and its 12 capability domains",
      "Discover real-world transformation case studies",
      "Build practical skills for driving digital initiatives"
    ],
    learningOutcomes: [
      "Define digital transformation and its key components",
      "Apply the DBP framework to assess organizational maturity",
      "Identify transformation opportunities within your organization",
      "Create a basic digital transformation roadmap"
    ],
    prerequisites: "No prior experience required. Basic understanding of business operations is helpful.",
    modules: [
      {
        title: "Introduction to Digital Transformation",
        duration: "45 min",
        lessons: ["What is Digital Transformation?", "The Evolution of Digital Business", "Key Drivers and Trends"]
      },
      {
        title: "The DBP Framework",
        duration: "1.5 hours",
        lessons: ["Understanding the Digital Business Platform", "The 12 Capability Domains", "Framework Application"]
      },
      {
        title: "Transformation Strategy",
        duration: "2 hours",
        lessons: ["Assessing Current State", "Defining Target State", "Building the Roadmap"]
      },
      {
        title: "Implementation Fundamentals",
        duration: "2 hours",
        lessons: ["Change Management Essentials", "Stakeholder Engagement", "Measuring Success"]
      }
    ],
    targetAudience: "This course is designed for professionals at any level who want to understand digital transformation fundamentals and contribute to their organization's digital journey.",
    recommendedRoles: ["Business Analysts", "Project Managers", "Team Leaders", "IT Professionals", "Change Champions"],
    requirements: ["Access to a computer with internet connection", "Commitment to complete all modules", "Willingness to apply concepts to real scenarios"],
    timeline: "Self-paced learning with recommended completion in 2-3 weeks. Certificate available upon passing final assessment.",
    assessmentInfo: "Complete all module quizzes with 80% or higher and pass the final assessment to earn your certificate of completion.",
    documents: [
      { name: "Course Syllabus", type: "PDF", size: "245 KB" },
      { name: "DBP Framework Guide", type: "PDF", size: "1.2 MB" },
      { name: "Transformation Toolkit", type: "ZIP", size: "3.4 MB" }
    ],
    resources: [
      { name: "Digital Transformation Reading List", url: "#" },
      { name: "Industry Case Studies", url: "#" },
      { name: "Assessment Templates", url: "#" }
    ],
    providerInfo: {
      description: "Coursera partners with more than 200 leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
      credentials: ["World's leading online learning platform", "200+ university partners", "5000+ courses available"],
      otherCourses: [
        { title: "Enterprise Architecture for Digital Leaders", brief: "Advanced architecture course" },
        { title: "Agile Transformation Methods", brief: "Enterprise agile practices" }
      ]
    },
    inclusions: ["Video lessons", "Hands-on exercises", "Certificate of completion", "Lifetime access", "Downloadable resources"]
  },
  {
    id: "dbp-capability",
    title: "DBP Capability Framework Deep Dive",
    description: "Deep dive into the 12 domains and capability hierarchy",
    duration: "12 hours",
    lessons: 16,
    level: "Intermediate",
    provider: { name: "LinkedIn Learning" },
    rating: 4.6,
    students: 890,
    department: "Architecture",
    category: "Business",
    format: "Self-paced",
    certification: false,
    introduction: "Take a comprehensive journey through the DBP Capability Framework. This course provides detailed exploration of all 12 capability domains and teaches you how to apply the framework in real organizational contexts.",
    highlights: [
      "Master all 12 capability domains in depth",
      "Learn capability mapping and assessment techniques",
      "Understand domain interdependencies",
      "Apply framework to real scenarios"
    ],
    learningOutcomes: [
      "Explain each of the 12 capability domains in detail",
      "Conduct capability assessments",
      "Map organizational capabilities to the framework",
      "Identify capability gaps and improvement opportunities"
    ],
    prerequisites: "Completion of Digital Transformation Fundamentals or equivalent experience.",
    inclusions: ["Video lessons", "Hands-on exercises", "Downloadable resources", "Community access"]
  },
  {
    id: "4d-model-mastery",
    title: "4D Transformation Model Mastery",
    description: "Learn to apply Discern, Design, Deploy, and Drive across transformation",
    duration: "10 hours",
    lessons: 14,
    level: "Intermediate",
    provider: { name: "Internal" },
    rating: 4.9,
    students: 620,
    department: "Leadership",
    category: "Business",
    format: "Instructor-led",
    certification: true,
    introduction: "Master the 4D Transformation Model - the governance framework that structures enterprise-wide change. Learn how to apply Discern, Design, Deploy, and Drive phases to orchestrate successful transformation initiatives.",
    highlights: [
      "Comprehensive 4D model training",
      "Real transformation case studies",
      "Hands-on governance exercises",
      "Direct instructor feedback"
    ],
    learningOutcomes: [
      "Apply the 4D model to any transformation initiative",
      "Lead governance activities in each phase",
      "Manage transitions between phases",
      "Measure progress and outcomes effectively"
    ],
    prerequisites: "Basic understanding of digital transformation concepts.",
    inclusions: ["Live instructor sessions", "Workshop exercises", "Certificate of completion", "Post-course support"]
  },
  {
    id: "enterprise-arch",
    title: "Enterprise Architecture for Digital Leaders",
    description: "Architecting digital platforms with DBP principles",
    duration: "16 hours",
    lessons: 20,
    level: "Advanced",
    provider: { name: "Coursera" },
    rating: 4.7,
    students: 450,
    department: "Architecture",
    category: "Technical",
    format: "Self-paced",
    certification: true,
    introduction: "This advanced course equips digital leaders with the architectural thinking and skills needed to design and evolve enterprise digital platforms aligned with DBP principles.",
    highlights: [
      "Enterprise architecture frameworks",
      "Platform thinking and design",
      "Architecture governance",
      "Technology strategy alignment"
    ],
    learningOutcomes: [
      "Design enterprise-scale digital architectures",
      "Apply TOGAF and DBP principles together",
      "Lead architecture governance boards",
      "Create architecture roadmaps"
    ],
    prerequisites: "5+ years experience in IT or architecture roles. Completion of intermediate courses recommended.",
    inclusions: ["Video lessons", "Architecture templates", "Certificate of completion", "Peer review exercises"]
  },
  {
    id: "portfolio-mgmt-cert",
    title: "Portfolio Management Excellence",
    description: "Manage application and project portfolios strategically",
    duration: "20 hours",
    lessons: 24,
    level: "Intermediate",
    provider: { name: "Internal" },
    rating: 4.5,
    students: 380,
    department: "Executive",
    category: "Leadership",
    format: "Cohort-based",
    certification: true,
    introduction: "Learn to manage both application and project portfolios strategically. This certification program provides comprehensive training in portfolio governance, prioritization, and lifecycle management.",
    highlights: [
      "Dual portfolio focus (applications & projects)",
      "Strategic prioritization frameworks",
      "Lifecycle management practices",
      "Cohort-based peer learning"
    ],
    learningOutcomes: [
      "Establish portfolio governance structures",
      "Apply prioritization and selection criteria",
      "Manage portfolio health and performance",
      "Report to executive stakeholders"
    ],
    prerequisites: "Management experience preferred. Basic understanding of project management.",
    inclusions: ["Live cohort sessions", "Portfolio templates", "Certification exam", "Alumni network access"]
  },
  {
    id: "lifecycle-best-practices",
    title: "Lifecycle Management Best Practices",
    description: "Master ALM, PLM, and compliance lifecycle approaches",
    duration: "14 hours",
    lessons: 18,
    level: "Intermediate",
    provider: { name: "LinkedIn Learning" },
    rating: 4.4,
    students: 520,
    department: "Operations",
    category: "Technical",
    format: "Self-paced",
    certification: false,
    introduction: "This course covers best practices for managing the complete lifecycle of applications, projects, and products. Learn structured approaches to ALM, PLM, and compliance tracking.",
    highlights: [
      "Application Lifecycle Management (ALM)",
      "Project Lifecycle Management (PLM)",
      "Compliance and governance tracking",
      "Lifecycle optimization strategies"
    ],
    learningOutcomes: [
      "Implement ALM and PLM frameworks",
      "Track compliance requirements",
      "Optimize lifecycle stages",
      "Measure lifecycle metrics"
    ],
    prerequisites: "Familiarity with project or application management.",
    inclusions: ["Video lessons", "Framework templates", "Community access", "Downloadable resources"]
  },
  {
    id: "change-leadership",
    title: "Change Leadership in Transformation",
    description: "Lead transformation with effective change management strategies",
    duration: "12 hours",
    lessons: 15,
    level: "Intermediate",
    provider: { name: "Udemy" },
    rating: 4.6,
    students: 710,
    department: "HR",
    category: "Change Management",
    format: "Instructor-led",
    certification: false,
    introduction: "Develop the skills to lead organizational change effectively during digital transformation initiatives. This course combines change management theory with practical transformation strategies.",
    highlights: [
      "Change management frameworks",
      "Stakeholder engagement strategies",
      "Resistance management",
      "Communication planning"
    ],
    learningOutcomes: [
      "Apply change management models",
      "Build stakeholder coalitions",
      "Manage resistance effectively",
      "Communicate change compellingly"
    ],
    prerequisites: "Leadership or management experience helpful but not required.",
    inclusions: ["Video lessons", "Change toolkit", "Q&A sessions", "Downloadable resources"]
  },
  {
    id: "data-driven-decisions",
    title: "Data-Driven Decision Making",
    description: "Leverage analytics and insights for strategic decisions",
    duration: "10 hours",
    lessons: 12,
    level: "Intermediate",
    provider: { name: "Coursera" },
    rating: 4.7,
    students: 840,
    department: "Finance",
    category: "Business",
    format: "Self-paced",
    certification: true,
    introduction: "Learn to leverage data and analytics for better strategic decision-making. This course covers data literacy, analytical frameworks, and practical application of insights in business contexts.",
    highlights: [
      "Data literacy fundamentals",
      "Analytical decision frameworks",
      "Visualization and communication",
      "Practical application exercises"
    ],
    learningOutcomes: [
      "Interpret data and analytics outputs",
      "Apply decision frameworks",
      "Communicate insights effectively",
      "Build data-driven culture"
    ],
    prerequisites: "No technical background required. Basic business acumen helpful.",
    inclusions: ["Video lessons", "Hands-on exercises", "Certificate of completion", "Data templates"]
  },
  {
    id: "ai-transformation",
    title: "AI in Digital Transformation",
    description: "Apply artificial intelligence to accelerate digital transformation",
    duration: "6 hours",
    lessons: 10,
    level: "Advanced",
    provider: { name: "Internal" },
    rating: 4.8,
    students: 340,
    featured: true,
    department: "Engineering",
    category: "Technical",
    format: "Workshop",
    certification: false,
    introduction: "Explore the transformative potential of AI in enterprise digital transformation. This hands-on workshop covers AI use cases, implementation strategies, and governance considerations.",
    highlights: [
      "AI use case identification",
      "Implementation strategies",
      "Ethics and governance",
      "Hands-on labs"
    ],
    learningOutcomes: [
      "Identify high-value AI opportunities",
      "Plan AI implementations",
      "Address ethical considerations",
      "Build AI governance frameworks"
    ],
    prerequisites: "Technical background or deep understanding of digital transformation.",
    inclusions: ["Workshop materials", "Lab access", "AI toolkit", "Expert Q&A"]
  },
  {
    id: "transformation-leadership",
    title: "Transformation Leadership Program",
    description: "Executive program for driving enterprise-wide transformation",
    duration: "24 hours",
    lessons: 30,
    level: "Executive",
    provider: { name: "Internal" },
    rating: 4.9,
    students: 180,
    featured: true,
    department: "Executive",
    category: "Leadership",
    format: "Cohort-based",
    certification: true,
    introduction: "The flagship executive program for leaders driving enterprise-wide digital transformation. This immersive experience combines strategic frameworks, peer learning, and executive coaching.",
    highlights: [
      "Executive-level strategic frameworks",
      "Peer learning with other executives",
      "Personal coaching sessions",
      "Real transformation project work"
    ],
    learningOutcomes: [
      "Lead enterprise transformation strategy",
      "Build high-performing transformation teams",
      "Navigate complex stakeholder landscapes",
      "Deliver measurable transformation outcomes"
    ],
    prerequisites: "Senior leadership role with transformation responsibilities.",
    inclusions: ["Executive sessions", "Coaching hours", "Certification", "Alumni network", "Exclusive resources"]
  },
  {
    id: "strategic-roadmap",
    title: "Strategic Roadmap Development",
    description: "Create and execute transformation roadmaps",
    duration: "8 hours",
    lessons: 11,
    level: "Intermediate",
    provider: { name: "LinkedIn Learning" },
    rating: 4.5,
    students: 490,
    department: "Strategy",
    category: "Business",
    format: "Self-paced",
    certification: false,
    introduction: "Learn to create compelling transformation roadmaps that align stakeholders and guide execution. This course covers roadmap design, prioritization, and communication strategies.",
    highlights: [
      "Roadmap design principles",
      "Prioritization frameworks",
      "Stakeholder alignment",
      "Visual communication"
    ],
    learningOutcomes: [
      "Design strategic roadmaps",
      "Apply prioritization criteria",
      "Align stakeholders on roadmap",
      "Communicate roadmap effectively"
    ],
    prerequisites: "Basic project management knowledge.",
    inclusions: ["Video lessons", "Roadmap templates", "Community access", "Downloadable resources"]
  },
  {
    id: "stakeholder-engagement",
    title: "Stakeholder Engagement & Communication",
    description: "Master stakeholder management in transformation initiatives",
    duration: "7 hours",
    lessons: 9,
    level: "Beginner",
    provider: { name: "Udemy" },
    rating: 4.3,
    students: 650,
    department: "Marketing",
    category: "Change Management",
    format: "Self-paced",
    certification: false,
    introduction: "Develop essential skills for stakeholder engagement and communication during transformation. Learn to identify, analyze, and effectively engage stakeholders at all levels.",
    highlights: [
      "Stakeholder identification and analysis",
      "Engagement strategy development",
      "Communication planning",
      "Managing difficult stakeholders"
    ],
    learningOutcomes: [
      "Map and analyze stakeholders",
      "Develop engagement strategies",
      "Create communication plans",
      "Handle resistance and conflict"
    ],
    prerequisites: "No prior experience required.",
    inclusions: ["Video lessons", "Stakeholder templates", "Downloadable resources"]
  },
  {
    id: "agile-transformation",
    title: "Agile Transformation Methods",
    description: "Implement agile practices across the enterprise",
    duration: "11 hours",
    lessons: 14,
    level: "Intermediate",
    provider: { name: "Coursera" },
    rating: 4.6,
    students: 580,
    department: "Operations",
    category: "Technical",
    format: "Self-paced",
    certification: true,
    introduction: "Learn to implement agile practices at enterprise scale. This course covers agile frameworks, scaling methodologies, and practical implementation strategies.",
    highlights: [
      "Agile framework comparison",
      "Scaling agile (SAFe, LeSS, etc.)",
      "Cultural transformation",
      "Metrics and measurement"
    ],
    learningOutcomes: [
      "Select appropriate agile frameworks",
      "Scale agile across teams",
      "Drive cultural change",
      "Measure agile maturity"
    ],
    prerequisites: "Basic understanding of agile principles.",
    inclusions: ["Video lessons", "Hands-on exercises", "Certificate of completion", "Agile toolkit"]
  },
  {
    id: "cloud-architecture",
    title: "Cloud Architecture Fundamentals",
    description: "Design cloud-native platforms and migration strategies",
    duration: "15 hours",
    lessons: 19,
    level: "Advanced",
    provider: { name: "Internal" },
    rating: 4.7,
    students: 410,
    department: "Engineering",
    category: "Technical",
    format: "Blended",
    certification: true,
    introduction: "Master cloud architecture principles for digital platforms. This blended course combines online learning with hands-on labs to build practical cloud architecture skills.",
    highlights: [
      "Cloud architecture patterns",
      "Migration strategies",
      "Security and compliance",
      "Cost optimization"
    ],
    learningOutcomes: [
      "Design cloud-native architectures",
      "Plan cloud migrations",
      "Implement security controls",
      "Optimize cloud costs"
    ],
    prerequisites: "Technical background with infrastructure or development experience.",
    inclusions: ["Video lessons", "Lab environments", "Certificate of completion", "Architecture templates"]
  },
  {
    id: "transformation-roi",
    title: "Measuring Transformation ROI",
    description: "Quantify and communicate transformation value",
    duration: "9 hours",
    lessons: 13,
    level: "Intermediate",
    provider: { name: "LinkedIn Learning" },
    rating: 4.4,
    students: 320,
    department: "Finance",
    category: "Business",
    format: "Self-paced",
    certification: false,
    introduction: "Learn to measure and communicate the return on investment of transformation initiatives. This course covers metrics frameworks, value quantification, and executive reporting.",
    highlights: [
      "ROI frameworks for transformation",
      "Value quantification methods",
      "Metrics and KPIs",
      "Executive communication"
    ],
    learningOutcomes: [
      "Calculate transformation ROI",
      "Define meaningful metrics",
      "Build value cases",
      "Report to executives"
    ],
    prerequisites: "Basic financial literacy helpful.",
    inclusions: ["Video lessons", "ROI calculators", "Report templates", "Downloadable resources"]
  }
];

export const coursesFilters = {
  department: ["Engineering", "Marketing", "Sales", "Operations", "HR", "Finance", "Executive", "Architecture", "Leadership", "Strategy"],
  category: ["Technical", "Business", "Leadership", "Change Management", "Architecture"],
  provider: ["Internal", "Coursera", "LinkedIn Learning", "Udemy", "Custom"],
  level: ["Beginner", "Intermediate", "Advanced", "Executive"],
  duration: ["< 5 hours", "5-10 hours", "10-20 hours", "20-40 hours", "40+ hours"],
  format: ["Self-paced", "Instructor-led", "Blended", "Workshop", "Cohort-based"],
  certification: ["Available", "Not Available"],
  rating: ["5 stars", "4+ stars", "3+ stars", "All"]
};
