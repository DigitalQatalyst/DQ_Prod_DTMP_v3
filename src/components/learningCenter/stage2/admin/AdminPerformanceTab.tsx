import {
  AlertTriangle,
  Star,
  MessageSquare,
  BarChart3,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { AdminCourseData } from "@/data/learningCenter/stage2/types";

interface AdminPerformanceTabProps {
  data: AdminCourseData;
}

const AdminPerformanceTab = ({ data }: AdminPerformanceTabProps) => {
  return (
    <div className="space-y-8">
      {/* Module-by-Module Performance Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-primary-navy flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-600" />
            Module-by-Module Performance
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
                  Started
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Completed
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Avg Score
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Avg Time
                </th>
                <th className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider px-6 py-3">
                  Drop-off
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.modulePerformance.map((mod) => (
                <tr
                  key={mod.moduleNumber}
                  className={`hover:bg-gray-50 ${
                    mod.flagged ? "bg-amber-50/50" : ""
                  }`}
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {mod.moduleName}
                      </span>
                      {mod.flagged && (
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">
                        {mod.started.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({mod.startedPercentage}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-foreground">
                        {mod.completed.toLocaleString()}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({mod.completedPercentage}%)
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span
                      className={`text-sm font-medium ${
                        mod.flagged ? "text-amber-600" : "text-foreground"
                      }`}
                    >
                      {mod.avgScore}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-muted-foreground">
                    {mod.avgTime}
                  </td>
                  <td className="px-6 py-3">
                    {mod.dropoffRate ? (
                      <Badge className="bg-red-100 text-red-700 border-0 text-xs">
                        {mod.dropoffRate}
                      </Badge>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Module 4 Warning */}
        <div className="px-6 py-4 border-t border-gray-200 bg-amber-50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-800 font-medium">
                Module 4 needs attention:
              </p>
              <ul className="text-sm text-amber-700 mt-1 space-y-0.5">
                <li>&bull; 22% drop-off rate (highest in course)</li>
                <li>&bull; 78% pass rate (below 80% target)</li>
                <li>&bull; Student feedback mentions difficulty spike</li>
              </ul>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="text-xs">
              View Module 4 Details
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Review Feedback
            </Button>
          </div>
        </div>
      </div>

      {/* Quiz Score Distribution */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary-navy mb-4">
          Quiz Score Distribution
        </h3>
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.quizDistribution}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="range" tick={{ fontSize: 12 }} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip formatter={(value: number) => [`${value}%`, "Students"]} />
              <Bar
                dataKey="percentage"
                radius={[4, 4, 0, 0]}
                fill="#ea580c"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Most Missed Questions:
          </h4>
          <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Q4.7: Technology stack selection (58% correct)</li>
            <li>Q2.5: Framework comparison (62% correct)</li>
            <li>Q5.3: Roadmap dependencies (65% correct)</li>
          </ol>
          <div className="flex gap-2 mt-3">
            <Button size="sm" variant="outline" className="text-xs">
              View Question Bank
            </Button>
            <Button size="sm" variant="outline" className="text-xs">
              Review Difficult Questions
            </Button>
          </div>
        </div>
      </div>

      {/* Student Feedback */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-primary-navy flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Student Feedback
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(data.overallRating)
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-bold text-primary-navy">
              {data.overallRating}/5.0
            </span>
            <span className="text-sm text-muted-foreground">
              ({data.totalReviews} reviews)
            </span>
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2 mb-6">
          {data.feedbackRatings.map((rating) => (
            <div key={rating.stars} className="flex items-center gap-3">
              <span className="text-sm w-16 text-right text-muted-foreground">
                {rating.stars} stars
              </span>
              <Progress
                value={rating.percentage}
                className="flex-1 h-2 max-w-xs [&>div]:bg-yellow-500"
              />
              <span className="text-sm w-10 text-muted-foreground">
                {rating.percentage}%
              </span>
            </div>
          ))}
        </div>

        {/* Common Feedback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="text-sm font-semibold text-green-800 mb-2 flex items-center gap-2">
              <ThumbsUp className="w-4 h-4" />
              Common Praise
            </h4>
            <ul className="space-y-1">
              {data.commonPraise.map((item, idx) => (
                <li key={idx} className="text-sm text-green-700">
                  &bull; "{item.text}" (mentioned in {item.count} reviews)
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <h4 className="text-sm font-semibold text-red-800 mb-2 flex items-center gap-2">
              <ThumbsDown className="w-4 h-4" />
              Common Complaints
            </h4>
            <ul className="space-y-1">
              {data.commonComplaints.map((item, idx) => (
                <li key={idx} className="text-sm text-red-700">
                  &bull; "{item.text}" (mentioned in {item.count} reviews)
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button variant="outline" size="sm">
            View All Reviews
          </Button>
          <Button variant="outline" size="sm">
            Respond to Feedback
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminPerformanceTab;
