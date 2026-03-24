import { useMemo } from "react";
import { AlertTriangle, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getKnowledgeUsageMetrics } from "@/data/knowledgeCenter/analyticsState";
import { knowledgeItems } from "@/data/knowledgeCenter/knowledgeItems";

interface KCAnalyticsProps {
  role: "admin" | "viewer";
}

export default function KCAnalytics({ role }: KCAnalyticsProps) {
  const metrics = useMemo(() => getKnowledgeUsageMetrics(), []);

  const itemById = useMemo(() => {
    return new Map(knowledgeItems.map((item) => [item.id, item]));
  }, []);

  const top10 = useMemo(() => {
    return metrics.slice(0, 10).map((metric, index) => ({
      rank: index + 1,
      metric,
      item: itemById.get(metric.itemId),
    }));
  }, [metrics, itemById]);

  const staledItems = useMemo(() => {
    return metrics
      .filter((m) => m.staleFlags > 0)
      .map((metric) => ({
        metric,
        item: itemById.get(metric.itemId),
      }))
      .filter(({ item }) => item !== undefined);
  }, [metrics, itemById]);

  const deepReaders = metrics.filter((m) => m.readingDepth > 75).length;
  const skimmers = metrics.filter((m) => m.readingDepth >= 25 && m.readingDepth <= 75).length;
  const bounced = metrics.filter((m) => m.readingDepth < 25 && m.views > 0).length;

  return (
    <div className="space-y-6">
      {/* Top 10 most-viewed */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-orange-600" />
          <h3 className="font-semibold text-gray-900">Top 10 Most-Viewed Articles</h3>
        </div>
        {top10.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-500">No analytics data recorded yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-10">
                    #
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Type
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
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Avg Depth
                  </th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Stale
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {top10.map(({ rank, metric, item }) => (
                  <tr key={metric.itemId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-medium">{rank}</td>
                    <td className="px-4 py-3 font-medium text-gray-900 max-w-xs truncate">
                      {item?.title ?? metric.itemId}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs capitalize">
                      {item?.sourceTab.replace(/-/g, " ") ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-700">{metric.views}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{metric.saves}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{metric.helpfulVotes}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{metric.readingDepth}%</td>
                    <td className="px-4 py-3 text-right">
                      {metric.staleFlags > 0 ? (
                        <span className="text-amber-600 font-medium">{metric.staleFlags}</span>
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reading depth distribution */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Reading Depth Distribution</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-700">{deepReaders}</p>
            <p className="text-xs text-green-600 mt-1 font-medium">Deep Readers</p>
            <p className="text-xs text-gray-500 mt-0.5">&gt;75% depth</p>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-blue-700">{skimmers}</p>
            <p className="text-xs text-blue-600 mt-1 font-medium">Skimmers</p>
            <p className="text-xs text-gray-500 mt-0.5">25–75% depth</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-700">{bounced}</p>
            <p className="text-xs text-gray-600 mt-1 font-medium">Bounced</p>
            <p className="text-xs text-gray-500 mt-0.5">&lt;25% depth</p>
          </div>
        </div>
      </div>

      {/* Content health — stale flags */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-gray-900">Content Health — Stale Flags</h3>
        </div>
        {staledItems.length === 0 ? (
          <p className="px-6 py-8 text-sm text-gray-500">
            No content has been flagged as stale yet.
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {staledItems.map(({ metric, item }) => (
              <div
                key={metric.itemId}
                className="px-6 py-4 flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 text-sm truncate">
                    {item!.title}
                  </p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    {metric.staleFlags} stale flag{metric.staleFlags !== 1 ? "s" : ""}
                  </p>
                </div>
                {role === "admin" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs border-amber-200 text-amber-700 hover:bg-amber-50 flex-shrink-0"
                  >
                    Review Content
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
