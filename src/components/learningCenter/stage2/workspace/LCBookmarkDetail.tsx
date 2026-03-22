import { useState } from "react";
import { BookMarked, Clock, ArrowRight, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bookmarkedCourses } from "@/data/learningCenter/stage2/learnerDashboardData";

interface LCBookmarkDetailProps {
  courseId: string;
  onEnrol: (courseId: string) => void;
  onRemove: (courseId: string) => void;
}

const levelGradient = (level: string) => {
  if (level === "Beginner") return "from-green-400 to-green-600";
  if (level === "Intermediate") return "from-blue-400 to-blue-600";
  if (level === "Advanced") return "from-purple-400 to-purple-700";
  return "from-gray-400 to-gray-600";
};

const levelBadgeClass = (level: string) => {
  if (level === "Beginner") return "bg-green-100 text-green-700";
  if (level === "Intermediate") return "bg-blue-100 text-blue-700";
  if (level === "Advanced") return "bg-purple-100 text-purple-700";
  return "bg-gray-100 text-gray-600";
};

export default function LCBookmarkDetail({ courseId, onEnrol, onRemove }: LCBookmarkDetailProps) {
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const course = bookmarkedCourses.find((c) => c.id === courseId);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        Bookmark not found.
      </div>
    );
  }

  const handleEnrol = () => {
    showToast("Enrolled successfully! Find this course in My Courses.");
    onEnrol(course.id);
  };

  const handleRemove = () => {
    showToast("Bookmark removed.");
    onRemove(course.id);
  };

  return (
    <div className="h-full overflow-y-auto p-6">
      {/* Toast */}
      {toastMsg && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg">
          {toastMsg}
        </div>
      )}

      <div className="max-w-2xl mx-auto space-y-5">
        {/* Course thumbnail / header */}
        <div
          className={`w-full h-40 rounded-2xl bg-gradient-to-br ${levelGradient(course.level)} flex items-end p-5`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm`}>
              {course.level}
            </span>
            {course.divisionTags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Title and meta */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-snug mb-2">{course.title}</h2>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="font-medium text-gray-700">{course.provider}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {course.duration}
              </span>
            </div>
          </div>

          <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>

          {/* Why you saved this */}
          <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <BookMarked className="w-4 h-4 text-amber-600" />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                Why you saved this
              </span>
            </div>
            <p className="text-sm text-amber-700">
              Saved from the Learning Centre marketplace
            </p>
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

          {/* CTAs */}
          <div className="pt-2 space-y-3">
            <Button
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              onClick={handleEnrol}
            >
              Enrol Now <ArrowRight className="w-4 h-4 ml-2" />
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
