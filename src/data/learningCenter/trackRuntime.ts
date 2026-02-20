import type { LearningTrack } from "./types";

const byOrder = (a: { order: number }, b: { order: number }) => a.order - b.order;

export const getOrderedTrackCourses = (track: LearningTrack) =>
  [...track.trackRuntime.courses].sort(byOrder);

export const getTrackPrimaryCourseId = (track: LearningTrack) => {
  const orderedCourses = getOrderedTrackCourses(track);
  const firstRequired = orderedCourses.find((course) => course.requirement === "required");
  return firstRequired?.courseId ?? orderedCourses[0]?.courseId ?? "";
};
