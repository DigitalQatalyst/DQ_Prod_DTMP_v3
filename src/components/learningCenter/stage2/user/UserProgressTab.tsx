import {
  Trophy,
  Flame,
  Star,
  Award,
  Sunrise,
  Lock,
  CheckCircle,
  Clock,
  BookOpen,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import type { UserCourseData } from "@/data/learningCenter/stage2/types";

interface UserProgressTabProps {
  data: UserCourseData;
}

const achievementIcons: Record<string, typeof Trophy> = {
  Sunrise: Sunrise,
  Trophy: Trophy,
  Flame: Flame,
  Award: Award,
  Star: Star,
};

const UserProgressTab = ({ data }: UserProgressTabProps) => {
  // Build module progress data for bar chart
  const moduleChartData = data.modules.map((mod) => ({
    name: `Mod ${mod.number}`,
    fullName: mod.title,
    progress: mod.progress,
    status: mod.status,
  }));

  return (
    <div className="space-y-8">
      {/* Overall Progress */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-primary-navy mb-4">
          Your Progress Dashboard
        </h3>
        <div className="flex items-center gap-4 mb-6">
          <span className="text-sm font-medium text-muted-foreground">
            Overall Completion:
          </span>
          <Progress
            value={data.overallProgress}
            className="flex-1 h-3 max-w-md [&>div]:bg-orange-600"
          />
          <span className="text-sm font-bold text-primary-navy">
            {data.overallProgress}%
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <BookOpen className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-primary-navy">
              {data.completedModules}/{data.totalModules}
            </p>
            <p className="text-xs text-muted-foreground">Modules</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Target className="w-5 h-5 text-purple-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-primary-navy">
              {data.quizResults.filter((q) => q.status === "passed").length}/{data.quizResults.length}
            </p>
            <p className="text-xs text-muted-foreground">Quizzes</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <CheckCircle className="w-5 h-5 text-green-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-primary-navy">
              {data.quizResults.filter((q) => q.status === "passed").length}/{data.modules.filter((m) => m.lessons.some((l) => l.type === "exercise")).length + 1}
            </p>
            <p className="text-xs text-muted-foreground">Exercises</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Star className="w-5 h-5 text-orange-600 mx-auto mb-1" />
            <p className="text-lg font-bold text-primary-navy">
              {Math.round(
                data.quizResults
                  .filter((q) => q.score !== null)
                  .reduce((sum, q) => sum + (q.score || 0), 0) /
                  data.quizResults.filter((q) => q.score !== null).length
              )}
              %
            </p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
        </div>
      </div>

      {/* Progress by Module (Bar Chart) */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary-navy mb-4">
          Progress by Module
        </h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={moduleChartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value: number, _name: string, props: { payload: { fullName: string; status: string } }) => [
                  `${value}% (${props.payload.status === "completed" ? "Completed" : props.payload.status === "in-progress" ? "In Progress" : "Not Started"})`,
                  props.payload.fullName,
                ]}
              />
              <Bar
                dataKey="progress"
                radius={[4, 4, 0, 0]}
                fill="#ea580c"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quiz Scores Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-primary-navy">
            Quiz Performance
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Module
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Score
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Attempts
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.quizResults.map((quiz) => (
                <tr key={quiz.moduleId} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-foreground">
                    {quiz.moduleName}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    {quiz.score !== null ? (
                      <span
                        className={`font-semibold ${
                          quiz.score >= 80
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {quiz.score}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">
                    {quiz.attempts}
                  </td>
                  <td className="px-6 py-3">
                    {quiz.status === "passed" ? (
                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Passed
                      </Badge>
                    ) : quiz.status === "pending" ? (
                      <Badge className="bg-gray-100 text-gray-600 border-0 text-xs">
                        Pending
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-100 text-gray-500 border-0 text-xs">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time Investment */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary-navy mb-2">
          Time Investment
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <p className="text-lg font-bold text-primary-navy">
              {data.totalTimeSpent}
            </p>
            <p className="text-xs text-muted-foreground">Total Time Spent</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary-navy">
              {data.avgDailyActivity}
            </p>
            <p className="text-xs text-muted-foreground">
              Avg Daily Activity
            </p>
          </div>
          <div className="text-center">
            <p className="text-lg font-bold text-primary-navy">
              {data.estimatedTimeRemaining}
            </p>
            <p className="text-xs text-muted-foreground">
              Estimated Remaining
            </p>
          </div>
        </div>
        <h4 className="text-sm font-medium text-muted-foreground mb-3">
          Weekly Activity
        </h4>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.weeklyActivity} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="hoursSpent"
                name="Hours"
                stroke="#ea580c"
                fill="#ea580c"
                fillOpacity={0.15}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary-navy mb-4">
          Achievements Earned
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.achievements.map((ach) => {
            const AchIcon = achievementIcons[ach.icon] || Trophy;
            return (
              <div
                key={ach.id}
                className={`border rounded-xl p-4 flex items-start gap-3 ${
                  ach.earned
                    ? "border-orange-200 bg-orange-50/50"
                    : "border-gray-200 bg-gray-50 opacity-60"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    ach.earned ? "bg-orange-100" : "bg-gray-200"
                  }`}
                >
                  {ach.earned ? (
                    <AchIcon className="w-5 h-5 text-orange-600" />
                  ) : (
                    <Lock className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {ach.earned ? "\uD83C\uDFC6 " : "\uD83D\uDD12 "}
                    {ach.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {ach.description}
                  </p>
                  {ach.earnedDate && (
                    <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Earned {ach.earnedDate}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserProgressTab;
