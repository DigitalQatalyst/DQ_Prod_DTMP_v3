import { useMemo } from "react";
import { BarChart3, FileText, MessageSquare, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getKnowledgeUsageMetrics,
} from "@/data/knowledgeCenter/analyticsState";
import { getTORequests } from "@/data/knowledgeCenter/requestState";
import { knowledgeItems } from "@/data/knowledgeCenter/knowledgeItems";

interface KCGovOverviewProps {
  role: "admin" | "viewer";
}

const REQUEST_TYPE_COLORS: Record<string, string> = {
  clarification: "bg-blue-100 text-blue-700",
  "outdated-section": "bg-amber-100 text-amber-700",
  collaboration: "bg-green-100 text-green-700",
};

export default function KCGovOverview({ role }: KCGovOverviewProps) {
  const metrics = useMemo(() => getKnowledgeUsageMetrics(), []);
  const allRequests = useMemo(() => getTORequests(), []);
  const openRequests = allRequests.filter((r) => r.status === "Open");

  const totalViews = metrics.reduce((sum, m) => sum + m.views, 0);
  const staledCount = metrics.filter((m) => m.staleFlags > 0).length;

  const itemById = useMemo(() => {
    const map = new Map(knowledgeItems.map((item) => [item.id, item]));
    return map;
  }, []);

  const topItems = useMemo(() => {
    return metrics
      .slice(0, 5)
      .map((metric) => ({
        metric,
        item: itemById.get(metric.itemId),
      }))
      .filter(({ item }) => item !== undefined);
  }, [metrics, itemById]);

  const kpiCards = [
    {
      label: "Total Articles",
      value: knowledgeItems.length,
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Views",
      value: totalViews,
      icon: BarChart3,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Incoming Requests",
      value: openRequests.length,
      icon: MessageSquare,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Flagged as Stale",
      value: staledCount,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div
            key={label}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
          >
            <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Top content by engagement */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Top Content by Engagement</h3>
        </div>
        {topItems.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-500">No engagement data recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Tab
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Views
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Saves
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Helpful
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Depth %
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topItems.map(({ metric, item }) => (
                  <tr key={metric.itemId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-gray-900 max-w-xs truncate">
                      {item!.title}
                    </td>
                    <td className="px-4 py-3 text-gray-500 capitalize">
                      {item!.sourceTab.replace(/-/g, " ")}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{metric.views}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{metric.saves}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{metric.helpfulVotes}</td>
                    <td className="px-6 py-3 text-right text-gray-700">{metric.readingDepth}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Incoming requests panel */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Incoming Requests</h3>
          {openRequests.length > 4 && (
            <span className="text-sm text-orange-600 font-medium">
              View All ({openRequests.length}) →
            </span>
          )}
        </div>
        {openRequests.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-500">No open requests at this time.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {openRequests.slice(0, 4).map((req) => {
              const item = itemById.get(req.itemId);
              return (
                <div key={req.id} className="px-6 py-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item?.title ?? req.itemId}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">{req.requesterName}</p>
                  </div>
                  <Badge className={`text-xs flex-shrink-0 ${REQUEST_TYPE_COLORS[req.type] ?? "bg-gray-100 text-gray-700"}`}>
                    {req.type}
                  </Badge>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {new Date(req.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
