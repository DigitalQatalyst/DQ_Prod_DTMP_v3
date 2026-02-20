import type { LearningTrack, TrackEnrollment } from "./types";
import { getOrderedTrackCourses } from "./trackRuntime";
import { mapRuntimeCourseToStage2CourseId } from "./trackProgress";

export interface TrackCourseDropoff {
  position: number;
  courseId: string;
  title: string;
  reachedCount: number;
  completedCount: number;
  dropoffRate: number;
}

export interface TrackAnalyticsSnapshot {
  trackId: string;
  trackTitle: string;
  totalEnrollments: number;
  completionRate: number;
  avgCompletionTimeDays: number | null;
  bottleneckCourseTitle: string;
  bottleneckCompletionRate: number;
  atRiskLearners: number;
  dropoffByCourse: TrackCourseDropoff[];
}

const REFERENCE_DATE = new Date("2026-02-19");

const toDate = (value?: string) => (value ? new Date(value) : undefined);

const getDaysBetween = (start?: string, end?: string) => {
  const startDate = toDate(start);
  const endDate = toDate(end);
  if (!startDate || !endDate) return null;
  const millis = endDate.getTime() - startDate.getTime();
  return millis > 0 ? Math.round(millis / (1000 * 60 * 60 * 24)) : null;
};

const getLastAccessAgeDays = (lastAccessed?: string) => {
  const lastAccess = toDate(lastAccessed);
  if (!lastAccess) return null;
  const millis = REFERENCE_DATE.getTime() - lastAccess.getTime();
  return millis >= 0 ? Math.floor(millis / (1000 * 60 * 60 * 24)) : null;
};

const getCompletedRequiredCount = (
  enrollment: TrackEnrollment,
  requiredCourseIds: Set<string>
) =>
  enrollment.completedCourseIds.filter((courseId) => requiredCourseIds.has(courseId))
    .length;

export const buildTrackAnalytics = (
  track: LearningTrack,
  enrollments: TrackEnrollment[]
): TrackAnalyticsSnapshot => {
  const trackEnrollments = enrollments.filter((enrollment) => enrollment.trackId === track.id);
  const totalEnrollments = trackEnrollments.length;
  const orderedRequiredCourses = getOrderedTrackCourses(track).filter(
    (course) => course.requirement === "required"
  );
  const requiredCourseIds = new Set(
    orderedRequiredCourses.map((course) => course.courseId)
  );

  const completedTrackCount = trackEnrollments.filter(
    (enrollment) => enrollment.status === "completed"
  ).length;
  const completionRate =
    totalEnrollments === 0
      ? 0
      : Math.round((completedTrackCount / totalEnrollments) * 100);

  const completedDurations = trackEnrollments
    .filter((enrollment) => enrollment.status === "completed")
    .map((enrollment) => getDaysBetween(enrollment.startedAt, enrollment.completedAt))
    .filter((value): value is number => value !== null);
  const avgCompletionTimeDays =
    completedDurations.length > 0
      ? Math.round(
          completedDurations.reduce((sum, days) => sum + days, 0) /
            completedDurations.length
        )
      : null;

  const atRiskLearners = trackEnrollments.filter((enrollment) => {
    if (enrollment.status !== "in-progress") return false;
    const age = getLastAccessAgeDays(enrollment.lastAccessed);
    return age !== null && age >= 14;
  }).length;

  const dropoffByCourse: TrackCourseDropoff[] = [];
  let previousReachedCount = totalEnrollments;
  orderedRequiredCourses.forEach((course, index) => {
    const reachedCount = trackEnrollments.filter((enrollment) => {
      if (enrollment.status === "completed") return true;
      const completedRequiredCount = getCompletedRequiredCount(
        enrollment,
        requiredCourseIds
      );
      return completedRequiredCount >= index;
    }).length;
    const completedCount = trackEnrollments.filter((enrollment) =>
      enrollment.completedCourseIds.includes(course.courseId)
    ).length;
    const dropoffRate =
      previousReachedCount === 0
        ? 0
        : Math.round(
            ((previousReachedCount - reachedCount) / previousReachedCount) * 100
          );

    dropoffByCourse.push({
      position: course.order,
      courseId: course.courseId,
      title: course.title,
      reachedCount,
      completedCount,
      dropoffRate,
    });

    previousReachedCount = reachedCount;
  });

  const completionByCourse = orderedRequiredCourses.map((course) => {
    const completedCount = trackEnrollments.filter((enrollment) =>
      enrollment.completedCourseIds.includes(course.courseId)
    ).length;
    const completionRateForCourse =
      totalEnrollments === 0
        ? 0
        : Math.round((completedCount / totalEnrollments) * 100);
    return {
      title: course.title,
      completionRate: completionRateForCourse,
    };
  });

  const bottleneck =
    completionByCourse.reduce(
      (lowest, current) =>
        current.completionRate < lowest.completionRate ? current : lowest,
      completionByCourse[0] ?? { title: "N/A", completionRate: 0 }
    ) ?? { title: "N/A", completionRate: 0 };

  return {
    trackId: track.id,
    trackTitle: track.title,
    totalEnrollments,
    completionRate,
    avgCompletionTimeDays,
    bottleneckCourseTitle: bottleneck.title,
    bottleneckCompletionRate: bottleneck.completionRate,
    atRiskLearners,
    dropoffByCourse,
  };
};

export const findTrackByStage2CourseId = (
  stage2CourseId: string,
  tracks: LearningTrack[]
) =>
  tracks.find((track) =>
    getOrderedTrackCourses(track).some(
      (course) => mapRuntimeCourseToStage2CourseId(course.courseId) === stage2CourseId
    )
  );
