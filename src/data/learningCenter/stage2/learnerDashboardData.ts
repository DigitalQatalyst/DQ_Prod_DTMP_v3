// Mock data for the My Learning dashboard (Learning Centre Stage 2)

export interface DashboardCourse {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  divisionTags: string[];
  duration: string;
  progress: number; // 0-100
  status: "not-started" | "in-progress" | "completed";
  lastAccessed?: string; // e.g. "2 days ago"
  completedDate?: string; // e.g. "15 Jan 2026"
  hasCertificate: boolean;
  provider: string;
  category: string;
}

export interface DashboardCertificate {
  id: string;
  title: string;
  type: "Course Completion" | "Track Completion";
  courseName: string;
  issueDate: string;
  courseId: string;
}


export const dashboardCourses: DashboardCourse[] = [
  {
    id: "enterprise-architecture-fundamentals-dewa",
    title: "Enterprise Architecture Fundamentals for DEWA",
    level: "Beginner",
    divisionTags: ["All Divisions"],
    duration: "6 hours",
    progress: 100,
    status: "completed",
    completedDate: "12 Jan 2026",
    hasCertificate: true,
    provider: "Internal",
    category: "Enterprise Architecture",
  },
  {
    id: "introduction-4d-governance-model",
    title: "Introduction to the 4D Governance Model",
    level: "Beginner",
    divisionTags: ["All Divisions"],
    duration: "5 hours",
    progress: 100,
    status: "completed",
    completedDate: "20 Jan 2026",
    hasCertificate: true,
    provider: "Internal",
    category: "Enterprise Architecture",
  },
  {
    id: "dtmp-platform-orientation",
    title: "DTMP Platform Orientation - Getting Started",
    level: "Beginner",
    divisionTags: ["All Divisions"],
    duration: "2 hours",
    progress: 100,
    status: "completed",
    completedDate: "05 Jan 2026",
    hasCertificate: true,
    provider: "Internal",
    category: "Leadership & Strategy",
  },
  {
    id: "ea-4-practice-dewa-approach",
    title: "EA 4.0 Practice - DEWA's Approach",
    level: "Intermediate",
    divisionTags: ["All Divisions"],
    duration: "10 hours",
    progress: 45,
    status: "in-progress",
    lastAccessed: "2 days ago",
    hasCertificate: false,
    provider: "Internal",
    category: "Enterprise Architecture",
  },
  {
    id: "smart-grid-architecture-design-principles",
    title: "Smart Grid Architecture - Design Principles",
    level: "Intermediate",
    divisionTags: ["Transmission", "Distribution"],
    duration: "12 hours",
    progress: 30,
    status: "in-progress",
    lastAccessed: "5 days ago",
    hasCertificate: false,
    provider: "Internal",
    category: "Smart Grid & Grid Technology",
  },
  {
    id: "ai-in-utility-operations-introduction",
    title: "AI in Utility Operations - An Introduction",
    level: "Beginner",
    divisionTags: ["All Divisions"],
    duration: "5 hours",
    progress: 70,
    status: "in-progress",
    lastAccessed: "1 day ago",
    hasCertificate: false,
    provider: "LinkedIn Learning",
    category: "AI & Automation",
  },
  {
    id: "solution-architecture-digital-platforms",
    title: "Solution Architecture for Digital Platforms",
    level: "Intermediate",
    divisionTags: ["Digital DEWA & Moro Hub", "All Divisions"],
    duration: "14 hours",
    progress: 15,
    status: "in-progress",
    lastAccessed: "1 week ago",
    hasCertificate: false,
    provider: "Coursera",
    category: "Digital Platforms",
  },
  {
    id: "data-governance-fundamentals-utilities",
    title: "Data Governance Fundamentals for Utilities",
    level: "Beginner",
    divisionTags: ["Digital DEWA & Moro Hub", "All Divisions"],
    duration: "6 hours",
    progress: 0,
    status: "not-started",
    hasCertificate: false,
    provider: "Coursera",
    category: "Data & Analytics",
  },
];

export const dashboardCertificates: DashboardCertificate[] = [
  {
    id: "cert-001",
    title: "Course Completion Certificate",
    type: "Course Completion",
    courseName: "Enterprise Architecture Fundamentals for DEWA",
    issueDate: "12 Jan 2026",
    courseId: "enterprise-architecture-fundamentals-dewa",
  },
  {
    id: "cert-002",
    title: "Course Completion Certificate",
    type: "Course Completion",
    courseName: "Introduction to the 4D Governance Model",
    issueDate: "20 Jan 2026",
    courseId: "introduction-4d-governance-model",
  },
  {
    id: "cert-003",
    title: "Course Completion Certificate",
    type: "Course Completion",
    courseName: "DTMP Platform Orientation - Getting Started",
    issueDate: "05 Jan 2026",
    courseId: "dtmp-platform-orientation",
  },
];


export const dashboardStats = {
  coursesInProgress: 4,
  coursesCompleted: 3,
  tracksEnrolled: 2,
  certificatesEarned: 3,
};
