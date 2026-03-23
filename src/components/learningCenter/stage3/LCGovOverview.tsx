import { useMemo } from "react";
import { AlertTriangle, MessageSquare } from "lucide-react";
import type { LCChangeRequest } from "@/data/learningCenter/stage3/lcChangeRequests";
import { lcChangeTypeLabels } from "@/data/learningCenter/stage3/lcChangeRequests";
import type { SessionRole } from "@/data/sessionRole";
import { getAllModuleComments } from "@/data/learningCenter/feedback";
import {
  getStatusBadgeClass,
  getStatusLabel,
  getChangeTypeBadgeClass,
  formatDate,
  isThisMonth,
} from "./lcGovUtils";

interface Props {
  requests: LCChangeRequest[];
  role: SessionRole | null;
}

export default function LCGovOverview({ requests, role }: Props) {
  // Live module comments from the feedback store
  const allComments = useMemo(() => getAllModuleComments(), []);
  const unresolvedComments = useMemo(() => allComments.filter((c) => !c.resolved), [allComments]);

  // Group unresolved comments by courseId to find which courses need attention
  const unresolvedByCourse = useMemo(() => {
    const map: Record<string, { courseId: string; count: number; sample: string }> = {};
    unresolvedComments.forEach((c) => {
      if (!map[c.courseId]) {
        map[c.courseId] = { courseId: c.courseId, count: 0, sample: c.moduleTitle };
      }
      map[c.courseId].count += 1;
    });
    return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 4);
  }, [unresolvedComments]);

  const openCount = useMemo(
    () => requests.filter((r) => r.status === "submitted" || r.status === "in-implementation").length,
    [requests]
  );
  const pendingApprovalCount = useMemo(
    () => requests.filter((r) => r.status === "submitted").length,
    [requests]
  );
  const implementedThisMonth = useMemo(
    () => requests.filter((r) => r.status === "implemented" && r.implementedAt && isThisMonth(r.implementedAt)).length,
    [requests]
  );
  const recentRequests = useMemo(
    () => [...requests].sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 5),
    [requests]
  );

  const metrics = [
    { label: "Total Courses Published", value: "30", sub: "All active in catalogue" },
    { label: "Change Requests Open", value: String(openCount), sub: "Submitted + in implementation" },
    { label: "Pending Approval", value: String(pendingApprovalCount), sub: "Awaiting review" },
    { label: "Implemented This Month", value: String(implementedThisMonth), sub: "March 2026" },
  ];

  const contentHealth = [
    { type: "Courses & Curriculum", items: "30 courses", lastReviewed: "8 Mar 2026", status: "Current" },
    { type: "Learning Tracks", items: "7 tracks", lastReviewed: "1 Mar 2026", status: "Current" },
    { type: "Reviews", items: "10 reviews", lastReviewed: "15 Feb 2026", status: "Review due" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Pending Actions Callout */}
      {role === "to-admin" && pendingApprovalCount > 0 && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            <span className="font-semibold">{pendingApprovalCount} change {pendingApprovalCount === 1 ? "request" : "requests"}</span>{" "}
            awaiting your approval. Visit the Pending Approval view to review and action them.
          </p>
        </div>
      )}

      {/* Metric Cards */}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-sm text-gray-500 mb-1">{m.label}</p>
            <p className="text-3xl font-bold text-gray-900">{m.value}</p>
            <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Content Health */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Content Health</h3>
          <p className="text-xs text-gray-500">Last review dates and status per content type</p>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-2 font-medium text-gray-600">Content Type</th>
              <th className="text-left px-5 py-2 font-medium text-gray-600">Items</th>
              <th className="text-left px-5 py-2 font-medium text-gray-600">Last Reviewed</th>
              <th className="text-left px-5 py-2 font-medium text-gray-600">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {contentHealth.map((row) => (
              <tr key={row.type} className="hover:bg-gray-50">
                <td className="px-5 py-3 font-medium text-gray-800">{row.type}</td>
                <td className="px-5 py-3 text-gray-600">{row.items}</td>
                <td className="px-5 py-3 text-gray-600">{row.lastReviewed}</td>
                <td className="px-5 py-3">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      row.status === "Current"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Unresolved Learner Questions */}
      {unresolvedComments.length > 0 && (
        <div className="bg-white border border-amber-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 border-b border-amber-100 bg-amber-50 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <div>
              <h3 className="font-semibold text-amber-900">
                Unresolved Learner Questions ({unresolvedComments.length})
              </h3>
              <p className="text-xs text-amber-700">
                Module-level questions from learners awaiting course admin response
              </p>
            </div>
          </div>
          <div className="divide-y divide-amber-50">
            {unresolvedByCourse.map((entry) => (
              <div key={entry.courseId} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-800 capitalize">
                    {entry.courseId.replace(/-/g, " ")}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">e.g. in "{entry.sample}"</p>
                </div>
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                  {entry.count} pending
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Change Requests */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Change Requests</h3>
          <p className="text-xs text-gray-500">Latest 5 change requests across all content types</p>
        </div>
        {recentRequests.length === 0 ? (
          <div className="px-5 py-8 text-center text-gray-400 text-sm">No change requests yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Subject</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Type</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Status</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentRequests.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-medium text-gray-800 max-w-xs truncate">{r.subject}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getChangeTypeBadgeClass(r.changeType)}`}>
                      {lcChangeTypeLabels[r.changeType]}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(r.status)}`}>
                      {getStatusLabel(r.status)}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-gray-500 text-xs">{formatDate(r.submittedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
