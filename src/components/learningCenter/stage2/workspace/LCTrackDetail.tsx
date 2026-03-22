import { CheckCircle2, PlayCircle, Circle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { learningTracks } from "@/data/learningCenter/learningTracks";
import { trackEnrollments } from "@/data/learningCenter/trackEnrollments";
import { enrolledCourses } from "@/data/learning";

interface LCTrackDetailProps {
  trackId: string;
  onContinueCourse: (courseId: string) => void;
}

const levelBadgeClass = (level: string) => {
  if (level === "beginner") return "bg-green-100 text-green-700";
  if (level === "intermediate") return "bg-blue-100 text-blue-700";
  if (level === "advanced") return "bg-purple-100 text-purple-700";
  return "bg-gray-100 text-gray-700";
};

export default function LCTrackDetail({ trackId, onContinueCourse }: LCTrackDetailProps) {
  const track = learningTracks.find((t) => t.id === trackId);
  const trackEnrollment = trackEnrollments.find(
    (te) => te.userId === "user-john-doe" && te.trackId === trackId
  );

  if (!track) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Track not found.
      </div>
    );
  }

  if (!trackEnrollment) {
    return (
      <div className="h-full p-8 flex flex-col items-center justify-center gap-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{track.title}</h2>
          <p className="text-gray-500 mb-6 max-w-md">{track.description}</p>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            Enrol in Track
          </Button>
        </div>
      </div>
    );
  }

  const courses = track.trackRuntime?.courses ?? [];
  const completedIds = new Set(trackEnrollment.completedCourseIds ?? []);
  const nextIncompleteId = courses.find((c) => !completedIds.has(c.courseId))?.courseId ?? null;

  const getCourseProgress = (courseTitle: string): number => {
    const titleLower = courseTitle.toLowerCase();
    const matched = enrolledCourses.find((ec) =>
      ec.courseName.toLowerCase().includes(titleLower.substring(0, 20)) ||
      titleLower.includes(ec.courseName.toLowerCase().substring(0, 20))
    );
    return matched?.progress ?? 0;
  };

  const totalCourses = courses.length;
  const completedCount = courses.filter((c) => completedIds.has(c.courseId)).length;
  const overallProgress = totalCourses > 0 ? Math.round((completedCount / totalCourses) * 100) : 0;

  const statusLabel =
    trackEnrollment.status === "completed"
      ? "Completed"
      : trackEnrollment.progress > 0
      ? "In Progress"
      : "Not Started";

  const statusClass =
    trackEnrollment.status === "completed"
      ? "bg-green-100 text-green-700"
      : trackEnrollment.progress > 0
      ? "bg-blue-100 text-blue-700"
      : "bg-gray-100 text-gray-600";

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 mb-1">{track.title}</h2>
            {track.description && (
              <p className="text-sm text-gray-500">{track.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 ml-4 flex-shrink-0">
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusClass}`}>
              {statusLabel}
            </span>
            {track.certification && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                Certification Awarded
              </span>
            )}
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-gray-600">Overall progress</span>
            <span className="font-medium text-gray-900">{overallProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-orange-500 h-2 rounded-full transition-all"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {completedCount} of {totalCourses} courses completed
          </div>
        </div>
      </div>

      {/* Course list */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide px-1">
          Courses in this Track
        </h3>
        {courses.map((course, idx) => {
          const isCompleted = completedIds.has(course.courseId);
          const courseProgress = isCompleted ? 100 : getCourseProgress(course.title);
          const isInProgress = !isCompleted && courseProgress > 0;
          const isNotStarted = !isCompleted && courseProgress === 0;

          return (
            <div
              key={course.courseId}
              className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-4"
            >
              {/* Position number */}
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                {idx + 1}
              </div>

              {/* Status icon */}
              <div className="flex-shrink-0 mt-0.5">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : isInProgress ? (
                  <PlayCircle className="w-5 h-5 text-blue-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </div>

              {/* Course info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 leading-snug">{course.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{course.duration}</div>
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs flex-shrink-0 ${levelBadgeClass(course.requirement === "elective" ? "elective" : "required")}`}
                  >
                    {course.requirement === "elective" ? "Elective" : "Required"}
                  </Badge>
                </div>

                {/* Progress bar for in-progress */}
                {isInProgress && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>{courseProgress}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${courseProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action button */}
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <Button size="sm" variant="outline" className="text-xs">
                    Review
                  </Button>
                ) : isInProgress ? (
                  <Button
                    size="sm"
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => onContinueCourse(course.courseId)}
                  >
                    Continue <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs"
                    onClick={() => onContinueCourse(course.courseId)}
                  >
                    Start <ArrowRight className="w-3 h-3 ml-1" />
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Continue Track CTA */}
      {nextIncompleteId && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 flex items-center justify-between">
          <div>
            <div className="font-semibold text-orange-800 mb-0.5">Continue your track</div>
            <div className="text-sm text-orange-600">
              {courses.find((c) => c.courseId === nextIncompleteId)?.title ?? "Next course"}
            </div>
          </div>
          <Button
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => onContinueCourse(nextIncompleteId)}
          >
            Continue Track <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
