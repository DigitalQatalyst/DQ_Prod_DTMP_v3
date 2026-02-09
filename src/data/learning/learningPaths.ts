import { LearningPath } from './types';

export const learningPaths: LearningPath[] = [
  {
    id: "transformation-leader-track",
    title: "Transformation Leader Track",
    description: "Comprehensive learning path for executives and leaders driving enterprise-wide digital transformation initiatives",
    thumbnail: "/placeholder.svg",
    courseCount: 6,
    totalDuration: "42 weeks",
    difficulty: 'advanced',
    enrolled: true,
    progress: 45,
    category: "Leadership",
    courses: [
      "digital-transformation-fundamentals",
      "dbp-framework-essentials",
      "agile-transformation-leadership",
      "change-management-excellence",
      "enterprise-architecture-patterns",
      "data-driven-decision-making"
    ],
    estimatedCompletion: "2024-08-15"
  },
  {
    id: "technical-architect-track",
    title: "Technical Architect Track",
    description: "Master enterprise architecture patterns, cloud strategies, and modern technology stacks",
    thumbnail: "/placeholder.svg",
    courseCount: 5,
    totalDuration: "38 weeks",
    difficulty: 'advanced',
    enrolled: true,
    progress: 60,
    category: "Technology",
    courses: [
      "enterprise-architecture-patterns",
      "cloud-migration-strategies",
      "dbp-framework-essentials",
      "cybersecurity-fundamentals",
      "data-driven-decision-making"
    ],
    estimatedCompletion: "2024-06-30"
  },
  {
    id: "agile-practitioner-track",
    title: "Agile Practitioner Track",
    description: "Build expertise in agile methodologies, scaled agile frameworks, and agile transformation",
    thumbnail: "/placeholder.svg",
    courseCount: 4,
    totalDuration: "28 weeks",
    difficulty: 'intermediate',
    enrolled: false,
    progress: 0,
    category: "Methodology",
    courses: [
      "agile-transformation-leadership",
      "change-management-excellence",
      "digital-transformation-fundamentals",
      "data-driven-decision-making"
    ]
  },
  {
    id: "change-management-track",
    title: "Change Management Professional Track",
    description: "Develop advanced change management skills for leading organizational transformation",
    thumbnail: "/placeholder.svg",
    courseCount: 3,
    totalDuration: "18 weeks",
    difficulty: 'intermediate',
    enrolled: false,
    progress: 0,
    category: "Change Management",
    courses: [
      "change-management-excellence",
      "digital-transformation-fundamentals",
      "agile-transformation-leadership"
    ]
  },
  {
    id: "cloud-specialist-track",
    title: "Cloud Transformation Specialist Track",
    description: "Comprehensive path for cloud migration, architecture, and optimization",
    thumbnail: "/placeholder.svg",
    courseCount: 4,
    totalDuration: "30 weeks",
    difficulty: 'intermediate',
    enrolled: false,
    progress: 0,
    category: "Technology",
    courses: [
      "cloud-migration-strategies",
      "enterprise-architecture-patterns",
      "cybersecurity-fundamentals",
      "data-driven-decision-making"
    ]
  },
  {
    id: "digital-strategy-track",
    title: "Digital Strategy & Innovation Track",
    description: "Learn to develop and execute digital strategies that drive business value",
    thumbnail: "/placeholder.svg",
    courseCount: 5,
    totalDuration: "32 weeks",
    difficulty: 'intermediate',
    enrolled: false,
    progress: 0,
    category: "Strategy",
    courses: [
      "digital-transformation-fundamentals",
      "dbp-framework-essentials",
      "data-driven-decision-making",
      "change-management-excellence",
      "enterprise-architecture-patterns"
    ]
  }
];

export const learningPathsStats = {
  totalPaths: learningPaths.length,
  enrolledPaths: learningPaths.filter(path => path.enrolled).length,
  completedPaths: learningPaths.filter(path => path.progress === 100).length,
  inProgressPaths: learningPaths.filter(path => path.progress > 0 && path.progress < 100).length
};
