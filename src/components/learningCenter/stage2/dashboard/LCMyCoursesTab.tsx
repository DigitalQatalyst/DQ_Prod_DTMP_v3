import { useState } from "react";
import { ArrowRight, Award, CheckCircle2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  dashboardCourses,
  type DashboardCourse,
} from "@/data/learningCenter/stage2/learnerDashboardData";

interface LCMyCoursesTabProps {
  onContinueCourse: (courseId: string) => void;
}

type ViewTab = "in-progress" | "completed" | "all";

const levelBadgeClass = (level: string) => {
  if (level === "Beginner") return "bg-green-100 text-green-700";
  if (level === "Intermediate") return "bg-blue-100 text-blue-700";
  return "bg-purple-100 text-purple-700";
};

const DIVISIONS = [
  "All Divisions",
  "Generation",
  "Transmission",
  "Distribution",
  "Water Services",
  "Customer Services",
  "Digital DEWA & Moro Hub",
];

function UnenrolConfirm({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="mt-2 flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
      <span className="text-red-700">Are you sure? Progress will be lost.</span>
      <button
        className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
        onClick={onConfirm}
      >
        Confirm
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

function CourseRow({
  course,
  onContinue,
}: {
  course: DashboardCourse;
  onContinue: (id: string) => void;
}) {
  const [confirmUnenrol, setConfirmUnenrol] = useState(false);
  const [unenrolled, setUnenrolled] = useState(false);

  if (unenrolled) return null;

  return (
    <div className="bg-white border rounded-xl p-4 space-y-3 shadow-sm hover:shadow-md transition-shadow">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
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
            <span className="text-xs text-gray-400">{course.category}</span>
          </div>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug">{course.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {course.provider} · {course.duration}
          </p>
        </div>

        {/* Status badge */}
        {course.status === "completed" && (
          <Badge className="bg-green-100 text-green-700 shrink-0 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </Badge>
        )}
        {course.status === "not-started" && (
          <Badge className="bg-gray-100 text-gray-600 shrink-0 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Not Started
          </Badge>
        )}
      </div>

      {/* Progress bar for in-progress */}
      {course.status === "in-progress" && (
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-500">
              {course.lastAccessed && `Last accessed ${course.lastAccessed}`}
            </span>
            <span className="text-xs font-semibold text-orange-600">{course.progress}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div
              className="h-2 rounded-full bg-orange-500 transition-all"
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Completion date for completed */}
      {course.status === "completed" && course.completedDate && (
        <p className="text-xs text-gray-500">Completed on {course.completedDate}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 flex-wrap">
        {course.status === "in-progress" && (
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => onContinue(course.id)}
          >
            Continue <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )}
        {course.status === "completed" && (
          <>
            <Button size="sm" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Review <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
            {course.hasCertificate && (
              <Button
                size="sm"
                variant="outline"
                className="border-orange-200 text-orange-700 hover:bg-orange-50 flex items-center gap-1"
              >
                <Award className="w-3 h-3" />
                View Certificate
              </Button>
            )}
          </>
        )}
        {course.status === "not-started" && (
          <Button
            size="sm"
            className="bg-orange-600 hover:bg-orange-700 text-white"
            onClick={() => onContinue(course.id)}
          >
            Start Course <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        )}
        <div className="ml-auto">
          <Button
            size="sm"
            variant="ghost"
            className="text-xs text-gray-400 hover:text-red-600 hover:bg-red-50"
            onClick={() => setConfirmUnenrol(true)}
          >
            Unenrol
          </Button>
        </div>
      </div>

      {/* Unenrol confirmation */}
      {confirmUnenrol && (
        <UnenrolConfirm
          onConfirm={() => setUnenrolled(true)}
          onCancel={() => setConfirmUnenrol(false)}
        />
      )}
    </div>
  );
}

export default function LCMyCoursesTab({ onContinueCourse }: LCMyCoursesTabProps) {
  const [viewTab, setViewTab] = useState<ViewTab>("in-progress");
  const [levelFilter, setLevelFilter] = useState("All");
  const [divisionFilter, setDivisionFilter] = useState("All Divisions");
  const [sortBy, setSortBy] = useState("last-accessed");

  const filtered = dashboardCourses
    .filter((c) => {
      if (viewTab === "in-progress") return c.status === "in-progress";
      if (viewTab === "completed") return c.status === "completed";
      return true;
    })
    .filter((c) => levelFilter === "All" || c.level === levelFilter)
    .filter(
      (c) =>
        divisionFilter === "All Divisions" || c.divisionTags.includes(divisionFilter)
    )
    .sort((a, b) => {
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "level") return a.level.localeCompare(b.level);
      if (sortBy === "completion-date") {
        return (b.completedDate ?? "").localeCompare(a.completedDate ?? "");
      }
      // default: last-accessed (in-progress first, then completed)
      const order = { "in-progress": 0, "not-started": 1, completed: 2 };
      return order[a.status] - order[b.status];
    });

  const viewTabCounts = {
    "in-progress": dashboardCourses.filter((c) => c.status === "in-progress").length,
    completed: dashboardCourses.filter((c) => c.status === "completed").length,
    all: dashboardCourses.length,
  };

  const tabClass = (tab: ViewTab) =>
    `px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      viewTab === tab
        ? "bg-orange-600 text-white"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="space-y-5 p-6">
      {/* View Tabs */}
      <div className="flex gap-2 bg-gray-50 border rounded-xl p-1 w-fit">
        <button className={tabClass("in-progress")} onClick={() => setViewTab("in-progress")}>
          In Progress ({viewTabCounts["in-progress"]})
        </button>
        <button className={tabClass("completed")} onClick={() => setViewTab("completed")}>
          Completed ({viewTabCounts.completed})
        </button>
        <button className={tabClass("all")} onClick={() => setViewTab("all")}>
          All Enrolled ({viewTabCounts.all})
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <select
          className="text-sm border rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
        >
          <option value="All">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>

        <select
          className="text-sm border rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300"
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
        >
          {DIVISIONS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          className="text-sm border rounded-lg px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-300 ml-auto"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="last-accessed">Sort: Last Accessed</option>
          <option value="completion-date">Sort: Completion Date</option>
          <option value="title">Sort: Title</option>
          <option value="level">Sort: Level</option>
        </select>
      </div>

      {/* Course List */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <BookOpenIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="font-medium">No courses found</p>
          <p className="text-sm mt-1">Try adjusting your filters or explore the catalogue.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((course) => (
            <CourseRow key={course.id} course={course} onContinue={onContinueCourse} />
          ))}
        </div>
      )}
    </div>
  );
}

// Inline fallback icon to avoid import issues
function BookOpenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  );
}
