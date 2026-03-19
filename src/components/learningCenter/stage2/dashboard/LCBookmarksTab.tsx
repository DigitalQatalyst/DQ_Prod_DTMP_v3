import { useState } from "react";
import { BookMarked, ArrowRight, Trash2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  bookmarkedCourses,
  type BookmarkedCourse,
} from "@/data/learningCenter/stage2/learnerDashboardData";

interface LCBookmarksTabProps {
  onEnrol: (courseId: string) => void;
}

const levelBadgeClass = (level: string) => {
  if (level === "Beginner") return "bg-green-100 text-green-700";
  if (level === "Intermediate") return "bg-blue-100 text-blue-700";
  return "bg-purple-100 text-purple-700";
};

const levelGradient = (level: string) => {
  if (level === "Beginner") return "from-green-400 to-emerald-500";
  if (level === "Intermediate") return "from-blue-400 to-blue-600";
  return "from-purple-400 to-purple-600";
};

// Simple toast hook
function useToast() {
  const [message, setMessage] = useState<string | null>(null);
  const show = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };
  return { message, show };
}

function RemoveConfirm({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm mt-2">
      <span className="text-red-700 text-xs">Remove this bookmark?</span>
      <button
        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
        onClick={onConfirm}
      >
        Remove
      </button>
      <button
        className="text-xs text-gray-600 hover:text-gray-900 underline"
        onClick={onCancel}
      >
        Cancel
      </button>
    </div>
  );
}

function BookmarkCard({
  course,
  onEnrol,
  onRemove,
}: {
  course: BookmarkedCourse;
  onEnrol: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  const [confirmRemove, setConfirmRemove] = useState(false);
  const firstLetter = course.title.charAt(0).toUpperCase();

  return (
    <div className="bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Thumbnail */}
      <div className={`h-20 bg-gradient-to-br ${levelGradient(course.level)} flex items-center justify-center`}>
        <span className="text-white text-4xl font-bold opacity-40">{firstLetter}</span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelBadgeClass(course.level)}`}
          >
            {course.level}
          </span>
          {course.divisionTags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-xs font-medium px-2 py-0.5 rounded-full border border-orange-300 text-orange-700"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h3 className="font-semibold text-gray-900 text-sm leading-snug">{course.title}</h3>

        {/* Description */}
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{course.description}</p>

        {/* Provider + Duration */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span>{course.provider}</span>
          <span>·</span>
          <span>{course.duration}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white flex-1 flex items-center justify-center gap-1"
            onClick={() => onEnrol(course.id)}
          >
            Enrol Now <ArrowRight className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-400 hover:text-red-600 hover:bg-red-50 px-2"
            onClick={() => setConfirmRemove(true)}
            title="Remove bookmark"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        {confirmRemove && (
          <RemoveConfirm
            onConfirm={() => onRemove(course.id)}
            onCancel={() => setConfirmRemove(false)}
          />
        )}
      </div>
    </div>
  );
}

export default function LCBookmarksTab({ onEnrol }: LCBookmarksTabProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkedCourse[]>(bookmarkedCourses);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const toast = useToast();

  const handleEnrol = (courseId: string) => {
    setEnrolledIds((prev) => [...prev, courseId]);
    const course = bookmarks.find((b) => b.id === courseId);
    toast.show(`Successfully enrolled in "${course?.title ?? courseId}"`);
    onEnrol(courseId);
  };

  const handleRemove = (courseId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== courseId));
    toast.show("Bookmark removed.");
  };

  const visibleBookmarks = bookmarks.filter((b) => !enrolledIds.includes(b.id));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <BookMarked className="w-6 h-6 text-orange-500" />
        <div>
          <h2 className="text-base font-semibold text-gray-900">Saved Courses</h2>
          <p className="text-xs text-gray-500">
            {visibleBookmarks.length} course{visibleBookmarks.length !== 1 ? "s" : ""} bookmarked
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast.message && (
        <div className="fixed bottom-6 right-6 z-50 bg-green-700 text-white text-sm px-5 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          {toast.message}
        </div>
      )}

      {/* Recently enrolled notification strip */}
      {enrolledIds.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 flex items-center gap-2 text-sm text-green-800">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>
            {enrolledIds.length} course{enrolledIds.length !== 1 ? "s" : ""} added to My Courses.
            You can continue learning from the My Courses tab.
          </span>
        </div>
      )}

      {/* Grid / Empty state */}
      {visibleBookmarks.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <BookMarked className="w-14 h-14 mx-auto mb-3 text-gray-200" />
          <p className="font-medium text-gray-500">No saved courses yet</p>
          <p className="text-sm mt-1 max-w-sm mx-auto">
            Browse the Learning Centre and save courses to review later.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleBookmarks.map((course) => (
            <BookmarkCard
              key={course.id}
              course={course}
              onEnrol={handleEnrol}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
}
