import { BookOpen, Award, BarChart3, PlayCircle, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  dashboardCourses,
  dashboardStats,
} from "@/data/learningCenter/stage2/learnerDashboardData";

interface LCDashboardOverviewProps {
  onNavigate: (tab: string) => void;
  onContinueCourse: (courseId: string) => void;
}

const levelBadgeClass = (level: string) => {
  if (level === "Beginner") return "bg-green-100 text-green-700";
  if (level === "Intermediate") return "bg-blue-100 text-blue-700";
  return "bg-purple-100 text-purple-700";
};

const RECOMMENDED = [
  {
    id: "net-zero-2050-architecture-role",
    title: "Net-Zero 2050 - Architecture's Role in Sustainability",
    level: "Beginner" as const,
    category: "Clean Energy & Sustainability",
    duration: "3 hours",
    reason: "Complements your EA foundations",
  },
  {
    id: "ea-assessment-methods",
    title: "EA Assessment Methods - Maturity, Readiness & Fitness",
    level: "Intermediate" as const,
    category: "Enterprise Architecture",
    duration: "8 hours",
    reason: "Next step after EA 4.0 Practice",
  },
  {
    id: "stakeholder-engagement-ea-led-transformation",
    title: "Stakeholder Engagement in EA-Led Transformation",
    level: "Intermediate" as const,
    category: "Leadership & Strategy",
    duration: "7 hours",
    reason: "Pairs well with governance learning",
  },
];

export default function LCDashboardOverview({
  onNavigate,
  onContinueCourse,
}: LCDashboardOverviewProps) {
  const inProgressCourses = dashboardCourses
    .filter((c) => c.status === "in-progress")
    .slice(0, 3);

  // Learning Progress: compute per-level completion ratios
  const levels = ["Beginner", "Intermediate", "Advanced"] as const;
  const levelStats = levels.map((level) => {
    const group = dashboardCourses.filter((c) => c.level === level);
    const completed = group.filter((c) => c.status === "completed").length;
    return { level, total: group.length, completed };
  });

  const levelBarColor = (level: string) => {
    if (level === "Beginner") return "bg-green-500";
    if (level === "Intermediate") return "bg-blue-500";
    return "bg-purple-500";
  };

  return (
    <div className="space-y-8 p-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border rounded-xl shadow-sm p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Courses In Progress</span>
            <PlayCircle className="w-5 h-5 text-orange-500" />
          </div>
          <span className="text-3xl font-bold text-gray-900">{dashboardStats.coursesInProgress}</span>
          <Badge className="bg-orange-100 text-orange-700 w-fit text-xs">Active</Badge>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Courses Completed</span>
            <BookOpen className="w-5 h-5 text-green-500" />
          </div>
          <span className="text-3xl font-bold text-gray-900">{dashboardStats.coursesCompleted}</span>
          <Badge className="bg-green-100 text-green-700 w-fit text-xs">Completed</Badge>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Tracks Enrolled</span>
            <BarChart3 className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-3xl font-bold text-gray-900">{dashboardStats.tracksEnrolled}</span>
          <Badge className="bg-blue-100 text-blue-700 w-fit text-xs">Enrolled</Badge>
        </div>

        <div className="bg-white border rounded-xl shadow-sm p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500 font-medium">Certificates Earned</span>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          <span className="text-3xl font-bold text-gray-900">{dashboardStats.certificatesEarned}</span>
          <Badge className="bg-purple-100 text-purple-700 w-fit text-xs">Earned</Badge>
        </div>
      </div>

      {/* Learning Progress */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          <h2 className="text-base font-semibold text-gray-900">Learning Progress</h2>
        </div>
        <div className="space-y-4">
          {levelStats.map(({ level, total, completed }) => {
            const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
            return (
              <div key={level}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{level}</span>
                  <span className="text-xs text-gray-500">
                    {completed} of {total} course{total !== 1 ? "s" : ""} completed
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${levelBarColor(level)}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Continue Learning */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-900">Continue Learning</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-orange-600 hover:text-orange-700"
            onClick={() => onNavigate("my-courses")}
          >
            View all <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
        {inProgressCourses.length === 0 ? (
          <p className="text-sm text-gray-500">No courses in progress. Browse the catalogue to get started.</p>
        ) : (
          <div className="space-y-4">
            {inProgressCourses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-xs font-medium px-2 py-0.5 rounded-full ${levelBadgeClass(course.level)}`}
                    >
                      {course.level}
                    </span>
                    {course.lastAccessed && (
                      <span className="text-xs text-gray-400">Last accessed {course.lastAccessed}</span>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 text-sm truncate">{course.title}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                      <div
                        className="h-1.5 rounded-full bg-orange-500"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-orange-600 whitespace-nowrap">
                      {course.progress}%
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="bg-orange-600 hover:bg-orange-700 text-white shrink-0"
                  onClick={() => onContinueCourse(course.id)}
                >
                  Continue <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recommended Next */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-5">Recommended Next</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {RECOMMENDED.map((rec) => (
            <div
              key={rec.id}
              className="border rounded-lg p-4 flex flex-col gap-2 hover:border-orange-300 hover:bg-orange-50/30 transition-colors"
            >
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full w-fit ${levelBadgeClass(rec.level)}`}
              >
                {rec.level}
              </span>
              <p className="font-medium text-gray-900 text-sm leading-snug">{rec.title}</p>
              <p className="text-xs text-gray-500">{rec.category} · {rec.duration}</p>
              <p className="text-xs text-orange-600 italic">{rec.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border rounded-xl shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
            onClick={() => onNavigate("browse-courses")}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Browse Courses
          </Button>
          <Button
            variant="outline"
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
            onClick={() => onNavigate("browse-tracks")}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Browse Tracks
          </Button>
          <Button
            variant="outline"
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
            onClick={() => onNavigate("certificates")}
          >
            <Award className="w-4 h-4 mr-2" />
            View Certificates
          </Button>
        </div>
      </div>
    </div>
  );
}
