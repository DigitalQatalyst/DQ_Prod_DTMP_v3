import type { LearningTrack, TrackEnrollment } from "./types";
import { getOrderedTrackCourses } from "./trackRuntime";
import { mapRuntimeCourseToStage2CourseId } from "./trackProgress";
import { getTrackVersionPolicy } from "./trackPolicies";

export interface PathCertificateRequirement {
  id: string;
  text: string;
  met: boolean;
  detail?: string;
}

export interface PathCertificateState {
  trackId: string;
  trackTitle: string;
  status: "earned" | "in-progress";
  requirements: PathCertificateRequirement[];
  certificateId?: string;
  issuedDate?: string;
  validUntil?: string;
  downloadable: boolean;
  pathVersion: string;
  renewalPolicy: string;
  recertificationRequiredOnChange: boolean;
}

interface BuildPathCertificateStateParams {
  track: LearningTrack;
  enrollment: TrackEnrollment;
  courseProgressByStage2Id: Record<string, number>;
}

const isRuntimeCourseCompleted = (
  courseId: string,
  enrollment: TrackEnrollment,
  courseProgressByStage2Id: Record<string, number>
) => {
  if (enrollment.completedCourseIds.includes(courseId)) return true;
  const mappedStage2Id = mapRuntimeCourseToStage2CourseId(courseId);
  if (!mappedStage2Id) return false;
  return (courseProgressByStage2Id[mappedStage2Id] ?? 0) >= 100;
};

const buildCertificateId = (enrollment: TrackEnrollment, track: LearningTrack) =>
  `PATH-${track.id.toUpperCase()}-${enrollment.userId.toUpperCase()}`;

const addMonthsIso = (dateInput: string, months: number) => {
  const date = new Date(dateInput);
  const next = new Date(date.getTime());
  next.setMonth(next.getMonth() + months);
  return next.toISOString().slice(0, 10);
};

export const buildPathCertificateState = ({
  track,
  enrollment,
  courseProgressByStage2Id,
}: BuildPathCertificateStateParams): PathCertificateState => {
  const versionPolicy = getTrackVersionPolicy(track.id);
  const orderedCourses = getOrderedTrackCourses(track);
  const requiredCourses = orderedCourses.filter((course) => course.requirement === "required");
  const electiveCourses = orderedCourses.filter((course) => course.requirement === "elective");

  const requiredCompleted = requiredCourses.filter((course) =>
    isRuntimeCourseCompleted(course.courseId, enrollment, courseProgressByStage2Id)
  ).length;
  const electivesCompleted = electiveCourses.filter((course) =>
    isRuntimeCourseCompleted(course.courseId, enrollment, courseProgressByStage2Id)
  ).length;

  const requiredMet =
    requiredCourses.length === 0 || requiredCompleted === requiredCourses.length;

  const electiveMinimum = track.trackRuntime.minimumElectives ?? 0;
  const electiveNeeded =
    track.trackRuntime.completionRule === "required-plus-electives"
      ? electiveMinimum
      : 0;
  const electivesMet = electivesCompleted >= electiveNeeded;

  const capstoneNeeded = track.trackRuntime.capstoneRequired;
  const capstoneMet = !capstoneNeeded || Boolean(enrollment.capstoneCompleted);

  const requirements: PathCertificateRequirement[] = [
    {
      id: "path-required-courses",
      text: "Complete all required courses",
      met: requiredMet,
      detail: `${requiredCompleted}/${requiredCourses.length} completed`,
    },
  ];

  if (electiveNeeded > 0) {
    requirements.push({
      id: "path-electives",
      text: `Complete at least ${electiveNeeded} elective course${electiveNeeded > 1 ? "s" : ""}`,
      met: electivesMet,
      detail: `${electivesCompleted}/${electiveNeeded} completed`,
    });
  }

  if (capstoneNeeded) {
    requirements.push({
      id: "path-capstone",
      text: "Complete path capstone/final assessment",
      met: capstoneMet,
    });
  }

  const earned = requirements.every((requirement) => requirement.met);
  const issuedDate = earned
    ? enrollment.completedAt ?? enrollment.lastAccessed ?? "2026-02-19"
    : undefined;

  return {
    trackId: track.id,
    trackTitle: track.title,
    status: earned ? "earned" : "in-progress",
    requirements,
    certificateId: earned ? buildCertificateId(enrollment, track) : undefined,
    issuedDate,
    validUntil:
      earned && issuedDate
        ? addMonthsIso(issuedDate, versionPolicy.validityMonths)
        : undefined,
    downloadable: earned,
    pathVersion: versionPolicy.currentPathVersion,
    renewalPolicy: versionPolicy.renewalPolicy,
    recertificationRequiredOnChange:
      versionPolicy.recertificationRequiredOnChange,
  };
};
