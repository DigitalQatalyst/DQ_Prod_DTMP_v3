import type { LearningTrack, TrackEnrollment } from "./types";
import { getOrderedTrackCourses } from "./trackRuntime";

const stage2CourseIdByRuntimeCourseId: Record<string, string> = {
  "dt-fundamentals": "digital-transformation-fundamentals",
  "dbp-capability": "dbp-framework-essentials",
  "4d-model-mastery": "dbp-framework-essentials",
  "change-leadership": "change-management-excellence",
  "stakeholder-engagement": "agile-transformation-leadership",
  "enterprise-arch": "enterprise-architecture-patterns",
  "cloud-architecture": "cloud-migration-strategies",
  "portfolio-mgmt-cert": "data-driven-decision-making",
};

export const mapRuntimeCourseToStage2CourseId = (courseId: string) =>
  stage2CourseIdByRuntimeCourseId[courseId];

export interface TrackProgressSnapshot {
  trackId: string;
  trackTitle: string;
  status: "not-started" | "in-progress" | "completed";
  progressPercent: number;
  requiredCompleted: number;
  requiredTotal: number;
  nextRequiredCourseId?: string;
  nextRequiredCourseTitle?: string;
  nextStage2CourseId?: string;
  stage2CourseIds: string[];
}

interface BuildTrackProgressParams {
  userId: string;
  tracks: LearningTrack[];
  enrollments: TrackEnrollment[];
  courseProgressByStage2Id: Record<string, number>;
}

const isCourseCompleted = (
  courseId: string,
  enrollment: TrackEnrollment,
  courseProgressByStage2Id: Record<string, number>
) => {
  if (enrollment.completedCourseIds.includes(courseId)) return true;

  const mappedStage2CourseId = mapRuntimeCourseToStage2CourseId(courseId);
  if (!mappedStage2CourseId) return false;

  return (courseProgressByStage2Id[mappedStage2CourseId] ?? 0) >= 100;
};

export const buildTrackProgressSnapshots = ({
  userId,
  tracks,
  enrollments,
  courseProgressByStage2Id,
}: BuildTrackProgressParams): TrackProgressSnapshot[] =>
  enrollments
    .filter((enrollment) => enrollment.userId === userId)
    .map((enrollment) => {
      const track = tracks.find((item) => item.id === enrollment.trackId);
      if (!track) return null;

      const orderedCourses = getOrderedTrackCourses(track);
      const requiredCourses = orderedCourses.filter(
        (course) => course.requirement === "required"
      );
      const requiredCompleted = requiredCourses.filter((course) =>
        isCourseCompleted(course.courseId, enrollment, courseProgressByStage2Id)
      ).length;
      const requiredTotal = requiredCourses.length;
      const progressPercent =
        requiredTotal === 0
          ? 100
          : Math.round((requiredCompleted / requiredTotal) * 100);

      const nextRequiredCourse = requiredCourses.find(
        (course) =>
          !isCourseCompleted(course.courseId, enrollment, courseProgressByStage2Id)
      );
      const nextCourseId =
        nextRequiredCourse?.courseId ?? enrollment.nextCourseId;

      return {
        trackId: track.id,
        trackTitle: track.title,
        status:
          requiredTotal > 0 && requiredCompleted === requiredTotal
            ? "completed"
            : enrollment.status,
        progressPercent,
        requiredCompleted,
        requiredTotal,
        nextRequiredCourseId: nextCourseId,
        nextRequiredCourseTitle:
          orderedCourses.find((course) => course.courseId === nextCourseId)?.title ??
          nextRequiredCourse?.title,
        nextStage2CourseId: nextCourseId
          ? mapRuntimeCourseToStage2CourseId(nextCourseId)
          : undefined,
        stage2CourseIds: orderedCourses
          .map((course) => mapRuntimeCourseToStage2CourseId(course.courseId))
          .filter((courseId): courseId is string => Boolean(courseId)),
      };
    })
    .filter((item): item is TrackProgressSnapshot => item !== null);
