import type { LearningTrack, TrackEnrollment } from "./types";
import type { PathCertificateState } from "./pathCertificates";
import type { TrackProgressSnapshot } from "./trackProgress";

export type TrackMilestoneType =
  | "enroll"
  | "course-complete"
  | "next-step"
  | "path-complete";

export interface TrackMilestoneNotification {
  id: string;
  type: TrackMilestoneType;
  message: string;
  timestamp: string;
}

interface BuildTrackMilestoneNotificationsParams {
  track: LearningTrack;
  enrollment?: TrackEnrollment;
  trackProgress?: TrackProgressSnapshot;
  pathCertificate?: PathCertificateState;
}

const formatDate = (date?: string) => date ?? "recently";

export const buildTrackMilestoneNotifications = ({
  track,
  enrollment,
  trackProgress,
  pathCertificate,
}: BuildTrackMilestoneNotificationsParams): TrackMilestoneNotification[] => {
  if (!enrollment) return [];

  const notifications: TrackMilestoneNotification[] = [];

  if (enrollment.startedAt) {
    notifications.push({
      id: `${track.id}-enroll`,
      type: "enroll",
      message: `You enrolled in ${track.title} on ${formatDate(enrollment.startedAt)}.`,
      timestamp: formatDate(enrollment.startedAt),
    });
  }

  if (enrollment.completedCourseIds.length > 0) {
    notifications.push({
      id: `${track.id}-course-complete`,
      type: "course-complete",
      message: `You have completed ${enrollment.completedCourseIds.length} course(s) in this path.`,
      timestamp: formatDate(enrollment.lastAccessed),
    });
  }

  if (trackProgress?.nextRequiredCourseTitle) {
    notifications.push({
      id: `${track.id}-next-step`,
      type: "next-step",
      message: `Next step: continue with ${trackProgress.nextRequiredCourseTitle}.`,
      timestamp: "Now",
    });
  }

  if (pathCertificate?.status === "earned") {
    notifications.push({
      id: `${track.id}-path-complete`,
      type: "path-complete",
      message: `Congratulations! You earned your path certificate (${pathCertificate.pathVersion}).`,
      timestamp: pathCertificate.issuedDate ?? "Today",
    });
  }

  return notifications;
};
