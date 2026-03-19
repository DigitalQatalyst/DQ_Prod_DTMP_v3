import { useState } from "react";
import { ChevronDown, ChevronUp, CheckCircle2, Award, PlayCircle, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { learningTracks } from "@/data/learningCenter/learningTracks";

// Mock enrollment state for "user-john-doe" mapped to the new track IDs
const USER_ENROLLMENTS: Record<
  string,
  { status: "in-progress" | "completed"; progress: number; completedCourseIds: string[] }
> = {
  "dewa-ea-practitioner-pathway": {
    status: "in-progress",
    progress: 58,
    completedCourseIds: [
      "enterprise-architecture-fundamentals-dewa",
      "introduction-4d-governance-model",
      "digital-business-platform-overview",
      "dtmp-platform-orientation",
    ],
  },
  "transformation-portfolio-governance-track": {
    status: "in-progress",
    progress: 25,
    completedCourseIds: ["dtmp-platform-orientation"],
  },
};

const statusBadgeClass = (status: string) => {
  if (status === "completed") return "bg-green-100 text-green-700";
  if (status === "in-progress") return "bg-blue-100 text-blue-700";
  return "bg-gray-100 text-gray-500";
};

const statusLabel = (status: string) => {
  if (status === "completed") return "Completed";
  if (status === "in-progress") return "In Progress";
  return "Not Started";
};

interface TrackCardProps {
  track: (typeof learningTracks)[0];
  enrollment?: {
    status: "in-progress" | "completed";
    progress: number;
    completedCourseIds: string[];
  };
  onContinue: (courseId: string) => void;
}

function TrackCard({ track, enrollment, onContinue }: TrackCardProps) {
  const [expanded, setExpanded] = useState(false);

  const completedCount = enrollment?.completedCourseIds.length ?? 0;
  const totalCount = track.trackRuntime?.courses.length ?? track.courses;
  const progressPct = enrollment?.progress ?? 0;
  const currentStatus = enrollment?.status ?? "not-started";

  // Determine next course to continue
  const nextCourse = track.trackRuntime?.courses.find(
    (c) => !enrollment?.completedCourseIds.includes(c.courseId)
  );

  return (
    <div className="bg-white border rounded-xl shadow-sm p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge className={`text-xs ${statusBadgeClass(currentStatus)}`}>
              {statusLabel(currentStatus)}
            </Badge>
            {track.certification && currentStatus === "completed" && (
              <Badge className="bg-green-100 text-green-700 flex items-center gap-1 text-xs">
                <Award className="w-3 h-3" />
                Certification Awarded
              </Badge>
            )}
            {track.certification && currentStatus !== "completed" && (
              <Badge className="bg-amber-100 text-amber-700 flex items-center gap-1 text-xs">
                <Award className="w-3 h-3" />
                Certification Available
              </Badge>
            )}
          </div>
          <h3 className="font-bold text-gray-900 text-base leading-snug">{track.title}</h3>
          <p className="text-xs text-gray-500 mt-1">
            {totalCount} courses · {track.duration} · {track.focusArea}
          </p>
        </div>

        {enrollment ? (
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
            onClick={() => nextCourse && onContinue(nextCourse.courseId)}
            disabled={!nextCourse}
          >
            {currentStatus === "completed" ? "Review Track" : "Continue Track"}
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="border-orange-300 text-orange-700 hover:bg-orange-50 shrink-0"
          >
            Enrol in Track
          </Button>
        )}
      </div>

      {/* Progress bar */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500">
            {completedCount} of {totalCount} courses completed
          </span>
          {enrollment && (
            <span className="text-xs font-semibold text-orange-600">{progressPct}%</span>
          )}
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-orange-500 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        {expanded ? (
          <>
            <ChevronUp className="w-4 h-4" /> Hide courses
          </>
        ) : (
          <>
            <ChevronDown className="w-4 h-4" /> Show courses ({totalCount})
          </>
        )}
      </button>

      {/* Collapsible course list */}
      {expanded && track.trackRuntime?.courses && (
        <div className="border-t pt-3 space-y-2">
          {track.trackRuntime.courses.map((c, idx) => {
            const isCompleted = enrollment?.completedCourseIds.includes(c.courseId);
            return (
              <div
                key={c.courseId}
                className="flex items-center gap-3 py-1.5"
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-300 shrink-0" />
                )}
                <span className="text-xs text-gray-400 shrink-0 w-5">{idx + 1}.</span>
                <span
                  className={`text-sm flex-1 ${isCompleted ? "text-gray-400 line-through" : "text-gray-700"}`}
                >
                  {c.title}
                </span>
                <span className="text-xs text-gray-400 shrink-0">{c.duration}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function LCMyTracksTab() {
  const handleContinue = (courseId: string) => {
    // In a full implementation, this would navigate into the course workspace
    console.log("Navigate to course:", courseId);
  };

  // Split tracks: enrolled first, then the rest
  const enrolledTrackIds = Object.keys(USER_ENROLLMENTS);
  const enrolledTracks = learningTracks.filter((t) => enrolledTrackIds.includes(t.id));
  const availableTracks = learningTracks.filter((t) => !enrolledTrackIds.includes(t.id));

  return (
    <div className="space-y-8 p-6">
      {/* Enrolled Tracks */}
      {enrolledTracks.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <PlayCircle className="w-5 h-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">My Tracks</h2>
            <Badge className="bg-orange-100 text-orange-700 text-xs">{enrolledTracks.length} enrolled</Badge>
          </div>
          <div className="space-y-4">
            {enrolledTracks.map((track) => (
              <TrackCard
                key={track.id}
                track={track}
                enrollment={USER_ENROLLMENTS[track.id]}
                onContinue={handleContinue}
              />
            ))}
          </div>
        </div>
      )}

      {/* Available Tracks */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-base font-semibold text-gray-900">Available Tracks</h2>
          <Badge className="bg-gray-100 text-gray-600 text-xs">{availableTracks.length} tracks</Badge>
        </div>
        <div className="space-y-4">
          {availableTracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              enrollment={undefined}
              onContinue={handleContinue}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
