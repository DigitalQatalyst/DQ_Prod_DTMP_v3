import {
  Users,
  CheckCircle,
  TrendingUp,
  Star,
  AlertTriangle,
  AlertCircle,
  Info,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import type { AdminCourseData } from "@/data/learningCenter/stage2/types";

interface AdminOverviewTabProps {
  data: AdminCourseData;
}

const AdminOverviewTab = ({ data }: AdminOverviewTabProps) => {
  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-navy">
            {data.stats.totalEnrollments.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Enrollments</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-navy">
            {data.stats.completedCount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            Completed ({data.stats.completedPercentage}%)
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-navy">
            {data.stats.inProgressCount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">
            In Progress ({data.stats.inProgressPercentage}%)
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center">
              <Star className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary-navy">
            {data.stats.averageRating}/5.0
          </p>
          <p className="text-sm text-muted-foreground">Avg Rating</p>
        </div>
      </div>

      {/* Enrollment Trend Chart */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary-navy mb-4">
          Enrollment Trends (Last 12 Months)
        </h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.enrollmentTrends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="enrollments"
                name="Enrollments"
                stroke="#ea580c"
                strokeWidth={2}
                dot={{ fill: "#ea580c", r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="completions"
                name="Completions"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ fill: "#16a34a", r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-sm text-muted-foreground mt-3">
          Total Enrollments: {data.stats.totalEnrollments.toLocaleString()} (+23%
          vs previous period)
        </p>
      </div>

      {/* Completion Funnel */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-primary-navy mb-4">
          Student Journey Funnel
        </h3>
        <div className="space-y-3">
          {data.completionFunnel.map((stage, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <div className="w-44 text-sm text-foreground font-medium truncate flex-shrink-0">
                {stage.stage}
              </div>
              <div className="flex-1 bg-gray-100 rounded-full h-7 overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center px-3 transition-all"
                  style={{
                    width: `${stage.percentage}%`,
                    backgroundColor:
                      idx === 0
                        ? "#ea580c"
                        : idx === data.completionFunnel.length - 1
                        ? "#16a34a"
                        : `hsl(${25 + idx * 15}, 80%, ${55 + idx * 3}%)`,
                  }}
                >
                  <span className="text-xs font-medium text-white whitespace-nowrap">
                    {stage.count.toLocaleString()}
                  </span>
                </div>
              </div>
              <span className="text-sm font-medium text-muted-foreground w-12 text-right flex-shrink-0">
                {stage.percentage}%
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-800">
            <strong>Drop-off Analysis:</strong> Biggest drop occurs between
            Module 3 and Module 4 (22% drop-off). Recommendation: Review Module
            4 difficulty level.
          </p>
        </div>
      </div>

      {/* Recent Activity & Alerts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Feed */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            <h3 className="text-lg font-semibold text-primary-navy">
              Recent Activity (Last 24h)
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {data.activityFeed.map((item) => (
              <div key={item.id} className="px-6 py-3 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                <span className="text-sm text-foreground">{item.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="text-lg font-semibold text-primary-navy">
              Attention Required
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {data.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`px-6 py-3 flex items-start gap-3 ${
                  alert.type === "warning"
                    ? "bg-amber-50/50"
                    : alert.type === "error"
                    ? "bg-red-50/50"
                    : "bg-blue-50/50"
                }`}
              >
                {alert.type === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                ) : alert.type === "error" ? (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                )}
                <span className="text-sm text-foreground">
                  {alert.message}
                </span>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 border-t border-gray-100">
            <Button variant="outline" size="sm" className="w-full">
              View All Alerts
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewTab;
