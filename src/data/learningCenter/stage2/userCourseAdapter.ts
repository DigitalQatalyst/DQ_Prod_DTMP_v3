// Adapts a DEWA catalog Course + EnrolledEntry into a full UserCourseData
// so the existing Stage 2 workspace tabs render correctly without a separate
// hardcoded dataset per course.

import type { Course } from "@/data/learningCenter/courses";
import type { EnrolledEntry } from "@/data/learningCenter/enrollments";
import type { UserCourseData, CourseModule, Lesson } from "./types";
import { buildUserProgressionData } from "./progressionEngine";

const LESSON_TYPES: Lesson["type"][] = ["video", "reading", "video", "quiz"];

function buildLessonsFromStrings(
  lessonTitles: string[],
  moduleId: string
): Lesson[] {
  return lessonTitles.map((title, idx) => ({
    id: `${moduleId}-lesson-${idx + 1}`,
    type: LESSON_TYPES[idx % LESSON_TYPES.length],
    title,
    duration: idx % 3 === 2 ? "20 min" : "15 min",
    status: "locked" as const,
    completed: false,
  }));
}

function buildModulesFromCatalog(course: Course): CourseModule[] {
  const rawModules = course.modules ?? [];
  if (rawModules.length === 0) {
    // Fallback: generate 3 generic modules if catalog has none
    return [
      {
        id: `${course.id}-mod-1`,
        number: 1,
        title: `${course.title} Foundations`,
        duration: "90 min",
        status: "locked" as const,
        progress: 0,
        lessons: buildLessonsFromStrings(
          [
            `Why ${course.title} matters in DEWA's context`,
            "Core concepts and governance expectations",
            "Division and stakeholder overview",
          ],
          `${course.id}-mod-1`
        ),
      },
      {
        id: `${course.id}-mod-2`,
        number: 2,
        title: "Methods and Application",
        duration: "2 hours",
        status: "locked" as const,
        progress: 0,
        lessons: buildLessonsFromStrings(
          [
            "Applying methods in practice",
            "Working patterns and artefacts",
            "Decision points and common risks",
          ],
          `${course.id}-mod-2`
        ),
      },
      {
        id: `${course.id}-mod-3`,
        number: 3,
        title: "Operationalisation",
        duration: "90 min",
        status: "locked" as const,
        progress: 0,
        lessons: buildLessonsFromStrings(
          [
            "Applying the learning in live DEWA contexts",
            "Governance checkpoints and evidence",
            "Practical takeaways for cross-division execution",
          ],
          `${course.id}-mod-3`
        ),
      },
    ];
  }

  return rawModules.map((mod, idx) => {
    const modId = `${course.id}-mod-${idx + 1}`;
    return {
      id: modId,
      number: idx + 1,
      title: mod.title,
      duration: mod.duration,
      status: "locked" as const,
      progress: 0,
      lessons: buildLessonsFromStrings(mod.lessons, modId),
    };
  });
}

function buildWeeklyActivity(progress: number) {
  const weeks = ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5", "Wk 6"];
  return weeks.map((week, idx) => ({
    week,
    hoursSpent: progress > idx * 17 ? Math.round(1 + Math.random() * 2.5) : 0,
  }));
}

export function buildDewaUserCourseData(
  course: Course,
  enrollment: EnrolledEntry
): UserCourseData {
  const modules = buildModulesFromCatalog(course);
  const providerName =
    course.provider?.name ?? "DEWA Internal";

  const template: UserCourseData = {
    courseId: course.id,
    courseTitle: course.title,
    instructorName: providerName,
    institution: "DEWA / DTMP Learning Centre",
    overallProgress: enrollment.progress,
    completedModules: 0,
    totalModules: modules.length,
    stats: {
      totalModules: modules.length,
      completedModules: 0,
      timeLeft: `${modules.length} weeks`,
      progress: enrollment.progress,
      dueDate: "2026-06-30",
    },
    modules,
    learningOutcomes: (course.learningOutcomes ?? []).map((text, idx) => ({
      id: `lo-${idx + 1}`,
      text,
      achieved: enrollment.progress >= 100,
    })),
    resources: (course.documents ?? []).map((doc, idx) => ({
      id: `res-${idx + 1}`,
      name: doc.name,
      type: (doc.type.toLowerCase() as "pdf" | "powerpoint" | "spreadsheet" | "zip" | "link"),
      size: doc.size,
      description: `Course material: ${doc.name}`,
      downloadable: true,
    })),
    weeklyActivity: buildWeeklyActivity(enrollment.progress),
    quizResults: [],
    achievements: [
      {
        id: "ach-1",
        title: "Course Started",
        description: "Enrolled and began the course",
        icon: "🎯",
        earned: enrollment.progress > 0,
        earnedDate: enrollment.enrolledAt.slice(0, 10),
      },
      {
        id: "ach-2",
        title: "Halfway There",
        description: "Completed 50% of the course",
        icon: "⚡",
        earned: enrollment.progress >= 50,
      },
      {
        id: "ach-3",
        title: "Course Graduate",
        description: "Completed all modules",
        icon: "🏆",
        earned: enrollment.progress >= 100,
      },
    ],
    certificateRequirements: [
      {
        id: "req-1",
        title: "Complete All Modules",
        description: "All course modules must be completed",
        met: enrollment.progress >= 100,
        detail: `${Math.round((enrollment.progress / 100) * modules.length)}/${modules.length} completed`,
      },
      {
        id: "req-2",
        title: "Pass All Assessments",
        description: "Score 70% or above in each module quiz",
        met: enrollment.progress >= 100 && (enrollment.averageQuizScore ?? 0) >= 70,
        detail:
          enrollment.averageQuizScore > 0
            ? `Avg score: ${enrollment.averageQuizScore}%`
            : "Not yet attempted",
      },
    ],
    instructorMessage: {
      name: providerName,
      message: `Welcome to ${course.title}. This course is tailored specifically for DEWA's transformation context and connected directly to live DTMP initiatives. Reach out if you have questions.`,
      postedAgo: "3 days ago",
    },
    totalTimeSpent: enrollment.timeInvested,
    avgDailyActivity: "45 min",
    estimatedTimeRemaining:
      enrollment.progress >= 100
        ? "Completed"
        : `${Math.ceil(((100 - enrollment.progress) / 100) * parseInt(course.duration))} hours`,
    cpeCredits: Math.round((enrollment.progress / 100) * 8),
    cpeDomains: [{ name: course.category, credits: 8 }],
    cpeReportableTo: ["DEWA HR", "DTMP Programme Office"],
    issuedCertificates: [],
  };

  // Run the progression engine to distribute progress correctly across modules/lessons
  const source = {
    id: course.id,
    courseName: course.title,
    instructor: providerName,
    progress: enrollment.progress,
    status: enrollment.status,
    stats: {
      totalModules: modules.length,
      averageQuizScore: enrollment.averageQuizScore || 82,
      timeInvested: enrollment.timeInvested,
    },
  };

  return buildUserProgressionData(source, template);
}
