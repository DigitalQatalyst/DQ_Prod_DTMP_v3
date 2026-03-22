import { useState } from "react";
import { BookMarked, Clock, ArrowRight, Trash2, CalendarDays, CheckCircle, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { courses } from "@/data/learningCenter/courses";
import { getBookmarks } from "@/data/learningCenter/bookmarks";
import { mapToStage2CourseId } from "@/data/learningCenter/courseIdMap";
import { dashboardCourses, dashboardCertificates } from "@/data/learningCenter/stage2/learnerDashboardData";

interface LCBookmarkDetailProps {
  courseId: string;
  onEnrol: (courseId: string) => void;
  onRemove: (courseId: string) => void;
}

const levelBadgeClass = (level: string) => {
  if (level === "Beginner") return "bg-green-100 text-green-700";
  if (level === "Intermediate") return "bg-blue-100 text-blue-700";
  if (level === "Advanced") return "bg-purple-100 text-purple-700";
  return "bg-gray-100 text-gray-600";
};

export default function LCBookmarkDetail({ courseId, onEnrol, onRemove }: LCBookmarkDetailProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Pull from catalog
  const course = courses.find((c) => c.id === courseId);
  // Pull saved note and date from store
  const bookmark = getBookmarks().find((b) => b.courseId === courseId);

  // Check enrolment and cert status via Stage 2 mapped ID
  const stage2Id = mapToStage2CourseId(courseId);
  const enrolledRecord = dashboardCourses.find((c) => c.id === stage2Id);
  const certRecord = dashboardCertificates.find((c) => c.courseId === stage2Id);
  const isEnrolled = !!enrolledRecord;
  const hasCert = !!certRecord;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Course not found in catalogue.
      </div>
    );
  }

  const savedDate = bookmark?.savedAt
    ? new Date(bookmark.savedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const handleEnrol = () => {
    showToast("Enrolled! Find this course in My Courses.");
    onEnrol(course.id);
  };

  const handleRemove = () => {
    showToast("Bookmark removed.");
    onRemove(course.id);
  };

  const providerName = typeof course.provider === "string"
    ? course.provider
    : course.provider?.name ?? "Internal";

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {toastMsg}
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Title and meta */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <div className="text-xs text-purple-600 font-semibold uppercase tracking-wide mb-1">
              {course.category}
            </div>
            <h2 className="text-xl font-bold text-gray-900 leading-snug mb-2">{course.title}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{providerName}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {course.duration}
              </span>
              <span>•</span>
              <span>{course.lessons} lessons</span>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>

          {/* Bookmark info */}
          <div className="bg-purple-50 border border-purple-100 rounded-lg px-4 py-3 space-y-2">
            <div className="flex items-center gap-2">
              <BookMarked className="w-4 h-4 text-purple-600" />
              <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">
                Saved for Later
              </span>
            </div>
            {savedDate && (
              <div className="flex items-center gap-1.5 text-xs text-purple-600">
                <CalendarDays className="w-3.5 h-3.5" />
                Bookmarked on {savedDate}
              </div>
            )}
            {bookmark?.note && (
              <p className="text-sm text-purple-700 italic">"{bookmark.note}"</p>
            )}
          </div>

          {/* Metadata rows */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Level</span>
              <Badge variant="outline" className={`text-xs ${levelBadgeClass(course.level)}`}>
                {course.level}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Duration</span>
              <span className="font-medium text-gray-700">{course.duration}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">Format</span>
              <span className="font-medium text-gray-700">{course.format}</span>
            </div>
            <div className="flex items-start justify-between text-sm gap-3">
              <span className="text-gray-500 flex-shrink-0">Divisions</span>
              <div className="flex flex-wrap gap-1 justify-end">
                {course.divisionTags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Enrolment / cert status */}
          {(isEnrolled || hasCert) && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              {hasCert && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  <Award className="w-4 h-4 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-green-700">Certificate Earned</div>
                    <div className="text-xs text-green-600">{certRecord!.issueDate}</div>
                  </div>
                </div>
              )}
              {isEnrolled && !hasCert && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-blue-700">Already Enrolled</div>
                    <div className="text-xs text-blue-600">
                      {enrolledRecord!.progress}% complete · {enrolledRecord!.status === "in-progress" ? `Last accessed ${enrolledRecord!.lastAccessed}` : "Not started"}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CTAs */}
          <div className="pt-2 space-y-3">
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleEnrol}
            >
              {isEnrolled ? (
                <>Continue Learning <ArrowRight className="w-4 h-4 ml-2" /></>
              ) : (
                <>Enrol Now <ArrowRight className="w-4 h-4 ml-2" /></>
              )}
            </Button>
            <Button
              variant="ghost"
              className="w-full text-gray-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleRemove}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove Bookmark
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
