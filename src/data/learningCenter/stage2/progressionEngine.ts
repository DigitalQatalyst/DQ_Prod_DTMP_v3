import type { CourseModule, Lesson, UserCourseData } from "./types";

interface ProgressSourceCourse {
  id: string;
  courseName: string;
  instructor: string;
  progress: number;
  status: "not-started" | "in-progress" | "completed";
  stats: {
    totalModules: number;
    averageQuizScore: number;
    timeInvested: string;
  };
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

const deepClone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const firstIndexByStatus = (lessons: Lesson[], statuses: Lesson["status"][]) =>
  lessons.findIndex((lesson) => statuses.includes(lesson.status));

const updateLessonStatusesForModule = (
  lessons: Lesson[],
  completedCount: number,
  moduleStatus: CourseModule["status"]
) =>
  lessons.map((lesson, index) => {
    if (moduleStatus === "locked") return { ...lesson, status: "locked" as const };
    if (moduleStatus === "completed")
      return { ...lesson, status: "completed" as const };

    if (index < completedCount) return { ...lesson, status: "completed" as const };
    if (index === completedCount) return { ...lesson, status: "in-progress" as const };
    return { ...lesson, status: "not-started" as const };
  });

const deriveModuleProgressByLessons = (module: CourseModule) => {
  if (module.lessons.length === 0) return module.progress;
  const completed = module.lessons.filter((lesson) => lesson.status === "completed").length;
  return Math.round((completed / module.lessons.length) * 100);
};

const deriveCourseState = (next: UserCourseData) => {
  const totalModules = next.modules.length;
  next.completedModules = next.modules.filter((item) => item.status === "completed").length;
  next.totalModules = totalModules;
  next.overallProgress = Math.round(
    next.modules.reduce((sum, item) => sum + item.progress, 0) / totalModules
  );

  next.quizResults = next.modules.map((item) => {
    const existing = next.quizResults.find((quiz) => quiz.moduleId === item.id);
    if (item.status === "completed") {
      return {
        moduleId: item.id,
        moduleName: `Module ${item.number} Assessment`,
        score: item.quizScore ?? existing?.score ?? 85,
        attempts: existing?.attempts ?? 1,
        status: "passed" as const,
      };
    }
    return {
      moduleId: item.id,
      moduleName: `Module ${item.number} Assessment`,
      score: existing?.score ?? null,
      attempts: existing?.attempts ?? 0,
      status: item.status === "in-progress" ? ("pending" as const) : ("locked" as const),
    };
  });

  const passed = next.quizResults.filter((quiz) => quiz.status === "passed").length;
  next.stats = {
    ...next.stats,
    totalModules,
    completedModules: next.completedModules,
    progress: next.overallProgress,
    timeLeft:
      next.completedModules < totalModules
        ? `${totalModules - next.completedModules} week${
            totalModules - next.completedModules > 1 ? "s" : ""
          }`
        : "Completed",
  };
  next.certificateRequirements = next.certificateRequirements.map((requirement, index) => {
    if (index === 0) {
      return {
        ...requirement,
        met: next.completedModules === totalModules,
        detail: `${next.completedModules}/${totalModules} completed`,
      };
    }
    if (index === 1) {
      return {
        ...requirement,
        met: passed === totalModules,
        detail: `${passed}/${totalModules} passed`,
      };
    }
    return requirement;
  });
  syncCourseCertificateState(next);
};

const COURSE_CERT_ID_PREFIX = "CRS";
const ISSUE_DATE = "2026-02-19";

const addMonthsIso = (dateInput: string, months: number) => {
  const date = new Date(dateInput);
  const nextDate = new Date(date.getTime());
  nextDate.setMonth(nextDate.getMonth() + months);
  return nextDate.toISOString().slice(0, 10);
};

const syncCourseCertificateState = (next: UserCourseData) => {
  const allRequirementsMet = next.certificateRequirements.every((requirement) => requirement.met);
  const certificateId = `${COURSE_CERT_ID_PREFIX}-${next.courseId.toUpperCase()}-USER-JD`;
  const existing = next.issuedCertificates?.find(
    (certificate) => certificate.type === "course"
  );

  if (allRequirementsMet) {
    const issuedDate = existing?.issuedDate ?? ISSUE_DATE;
    const courseCertificate = {
      id: certificateId,
      type: "course" as const,
      status: "earned" as const,
      title: `${next.courseTitle} Course Certificate`,
      ownerUserId: "user-john-doe",
      issuedDate,
      validUntil: addMonthsIso(issuedDate, 24),
      version: "v1.0",
    };
    const withoutCourseCertificate = (next.issuedCertificates ?? []).filter(
      (certificate) => certificate.type !== "course"
    );
    next.issuedCertificates = [...withoutCourseCertificate, courseCertificate];
    return;
  }

  const inProgressCertificate = {
    id: certificateId,
    type: "course" as const,
    status: "in-progress" as const,
    title: `${next.courseTitle} Course Certificate`,
    ownerUserId: "user-john-doe",
    version: "v1.0",
  };
  const withoutCourseCertificate = (next.issuedCertificates ?? []).filter(
    (certificate) => certificate.type !== "course"
  );
  next.issuedCertificates = [...withoutCourseCertificate, inProgressCertificate];
};

export const findResumePoint = (data: UserCourseData) => {
  for (const module of data.modules) {
    if (module.status !== "in-progress") continue;
    const lesson =
      module.lessons.find((item) => item.status === "in-progress") ??
      module.lessons.find((item) => item.status === "not-started");
    if (lesson) return { moduleId: module.id, lessonId: lesson.id };
  }
  return undefined;
};

export const buildUserProgressionData = (
  source: ProgressSourceCourse,
  template: UserCourseData
): UserCourseData => {
  const cloned = deepClone(template);
  const totalModules = Math.max(1, Math.min(10, source.stats.totalModules || cloned.totalModules || 6));
  const modules = cloned.modules.slice(0, totalModules);
  const baseProgress = clamp(source.progress, 0, 100);
  const completedModulesTarget =
    baseProgress >= 100 ? totalModules : Math.floor((baseProgress / 100) * totalModules);
  const remainingModules = Math.max(0, totalModules - completedModulesTarget);

  const progressionModules = modules.map((module, index) => {
    const moduleNumber = index + 1;
    const totalLessons = module.lessons.length || 1;

    if (moduleNumber <= completedModulesTarget) {
      return {
        ...module,
        number: moduleNumber,
        status: "completed" as const,
        progress: 100,
        quizScore: Math.min(
          98,
          Math.max(75, source.stats.averageQuizScore || module.quizScore || 82)
        ),
        lessons: module.lessons.map((lesson) => ({
          ...lesson,
          status: "completed" as const,
        })),
      };
    }

    const isCurrent =
      (baseProgress === 0 && moduleNumber === 1) ||
      (baseProgress > 0 &&
        baseProgress < 100 &&
        moduleNumber === completedModulesTarget + 1);
    if (isCurrent) {
      const rawModuleProgress =
        baseProgress === 0
          ? 0
          : (baseProgress - (completedModulesTarget * 100) / totalModules) * totalModules;
      const currentProgress = clamp(Math.round(rawModuleProgress), 0, 99);
      const completedLessons = clamp(
        Math.floor((currentProgress / 100) * totalLessons),
        0,
        Math.max(0, totalLessons - 1)
      );

      return {
        ...module,
        number: moduleNumber,
        status: "in-progress" as const,
        progress: currentProgress,
        lessons: updateLessonStatusesForModule(
          module.lessons,
          completedLessons,
          "in-progress"
        ),
      };
    }

    return {
      ...module,
      number: moduleNumber,
      status: "locked" as const,
      progress: 0,
      lessons: module.lessons.map((lesson) => ({
        ...lesson,
        status: "locked" as const,
      })),
    };
  });

  const completedModules = progressionModules.filter((module) => module.status === "completed").length;
  const totalProgress = Math.round(
    progressionModules.reduce((sum, module) => sum + module.progress, 0) / totalModules
  );

  const quizResults = progressionModules.map((module) => {
    if (module.status === "completed") {
      return {
        moduleId: module.id,
        moduleName: `Module ${module.number} Assessment`,
        score: module.quizScore ?? Math.max(70, source.stats.averageQuizScore || 82),
        attempts: 1,
        status: "passed" as const,
      };
    }

    return {
      moduleId: module.id,
      moduleName: `Module ${module.number} Assessment`,
      score: null,
      attempts: 0,
      status: module.status === "in-progress" ? ("pending" as const) : ("locked" as const),
    };
  });

  const passedCount = quizResults.filter((quiz) => quiz.status === "passed").length;

  cloned.courseId = source.id;
  cloned.courseTitle = source.courseName;
  cloned.instructorName = source.instructor;
  cloned.overallProgress = totalProgress;
  cloned.completedModules = completedModules;
  cloned.totalModules = totalModules;
  cloned.modules = progressionModules;
  cloned.quizResults = quizResults;
  cloned.totalTimeSpent = source.stats.timeInvested;
  cloned.estimatedTimeRemaining =
    remainingModules > 0 ? `${Math.max(1, remainingModules * 2)}h 00m` : "0h 00m";
  cloned.stats = {
    ...cloned.stats,
    totalModules,
    completedModules,
    progress: totalProgress,
    timeLeft: remainingModules > 0 ? `${remainingModules} week${remainingModules > 1 ? "s" : ""}` : "Completed",
  };
  cloned.certificateRequirements = cloned.certificateRequirements.map((requirement, index) => {
    if (index === 0) {
      return {
        ...requirement,
        met: completedModules === totalModules,
        detail: `${completedModules}/${totalModules} completed`,
      };
    }
    if (index === 1) {
      return {
        ...requirement,
        met: passedCount === totalModules,
        detail: `${passedCount}/${totalModules} passed`,
      };
    }
    return requirement;
  });

  return cloned;
};

export const completeLessonAndRecalculate = (
  data: UserCourseData,
  moduleId: string,
  lessonId: string
): UserCourseData => {
  const next = deepClone(data);
  const moduleIndex = next.modules.findIndex((module) => module.id === moduleId);
  if (moduleIndex < 0) return next;

  const module = next.modules[moduleIndex];
  if (module.status === "locked" || module.status === "completed") return next;

  const lessonIndex = module.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (lessonIndex < 0) return next;

  const lesson = module.lessons[lessonIndex];
  if (lesson.status === "locked" || lesson.status === "completed") return next;

  module.lessons[lessonIndex] = { ...lesson, status: "completed", completedDate: "Today" };

  const nextInModuleIndex =
    module.lessons.findIndex((item) => item.status === "in-progress");
  if (nextInModuleIndex === -1) {
    const notStartedIdx = firstIndexByStatus(module.lessons, ["not-started"]);
    if (notStartedIdx >= 0) {
      module.lessons[notStartedIdx] = {
        ...module.lessons[notStartedIdx],
        status: "in-progress",
      };
    }
  }

  const completedLessons = module.lessons.filter((item) => item.status === "completed").length;
  module.progress = deriveModuleProgressByLessons(module);
  module.status = completedLessons === module.lessons.length ? "completed" : "in-progress";
  if (module.status === "completed") {
    module.quizScore = module.quizScore ?? 85;
    const nextModule = next.modules[moduleIndex + 1];
    if (nextModule && nextModule.status === "locked") {
      nextModule.status = "in-progress";
      nextModule.progress = 0;
      if (nextModule.lessons.length > 0) {
        nextModule.lessons = nextModule.lessons.map((item, idx) => ({
          ...item,
          status: idx === 0 ? "in-progress" : "not-started",
        }));
      }
    }
  }

  deriveCourseState(next);

  return next;
};

export const submitQuizAttemptAndRecalculate = (
  data: UserCourseData,
  moduleId: string,
  lessonId: string,
  score: number,
  passThreshold: number
): UserCourseData => {
  const next = deepClone(data);
  const moduleIndex = next.modules.findIndex((module) => module.id === moduleId);
  if (moduleIndex < 0) return next;
  const module = next.modules[moduleIndex];
  const lessonIndex = module.lessons.findIndex((lesson) => lesson.id === lessonId);
  if (lessonIndex < 0) return next;

  const lesson = module.lessons[lessonIndex];
  if (lesson.status === "locked") return next;

  const passed = score >= passThreshold;
  const quizResultIndex = next.quizResults.findIndex((quiz) => quiz.moduleId === moduleId);
  if (quizResultIndex >= 0) {
    const current = next.quizResults[quizResultIndex];
    next.quizResults[quizResultIndex] = {
      ...current,
      attempts: current.attempts + 1,
      score,
      status: passed ? "passed" : "pending",
    };
  }

  if (passed) {
    module.lessons[lessonIndex] = {
      ...lesson,
      status: "completed",
      completedDate: "Today",
    };
    module.quizScore = score;

    const notStartedIdx = firstIndexByStatus(module.lessons, ["not-started"]);
    if (notStartedIdx >= 0) {
      module.lessons[notStartedIdx] = {
        ...module.lessons[notStartedIdx],
        status: "in-progress",
      };
    }

    const completedLessons = module.lessons.filter(
      (item) => item.status === "completed"
    ).length;
    module.progress = deriveModuleProgressByLessons(module);
    module.status =
      completedLessons === module.lessons.length ? "completed" : "in-progress";

    if (module.status === "completed") {
      const nextModule = next.modules[moduleIndex + 1];
      if (nextModule && nextModule.status === "locked") {
        nextModule.status = "in-progress";
        nextModule.progress = 0;
        if (nextModule.lessons.length > 0) {
          nextModule.lessons = nextModule.lessons.map((item, idx) => ({
            ...item,
            status: idx === 0 ? "in-progress" : "not-started",
          }));
        }
      }
    }
  } else {
    module.lessons[lessonIndex] = {
      ...lesson,
      status: "in-progress",
    };
  }

  deriveCourseState(next);
  return next;
};
