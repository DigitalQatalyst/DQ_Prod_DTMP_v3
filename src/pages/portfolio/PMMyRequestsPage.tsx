import { useState } from "react";
import { Clock, CheckCircle, AlertTriangle, Search, FileText } from "lucide-react";
import { getPMRequests, type PMRequest, type PMRequestStatus } from "@/data/portfolioManagement/serviceRequests";
import { PM_TAB_CONFIG, type PMTab } from "@/data/portfolioManagement";

const STATUS_PIPELINE: PMRequestStatus[] = [
  "Submitted",
  "Assigned",
  "In Progress",
  "Delivered",
  "Completed",
];

const STATUS_COLOR: Record<PMRequestStatus, string> = {
  Submitted: "bg-blue-100 text-blue-700 border-blue-200",
  Assigned: "bg-purple-100 text-purple-700 border-purple-200",
  "In Progress": "bg-amber-100 text-amber-700 border-amber-200",
  Delivered: "bg-green-100 text-green-700 border-green-200",
  Completed: "bg-gray-100 text-gray-700 border-gray-200",
};

const SLA_COLOR: Record<string, string> = {
  "On Track": "text-green-700",
  Approaching: "text-amber-700",
  Overdue: "text-red-700",
};

export default function PMMyRequestsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PMRequestStatus | "All">("All");
  const [tabFilter, setTabFilter] = useState<PMTab | "All">("All");

  const all = getPMRequests();

  const filtered = all.filter((r) => {
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    if (tabFilter !== "All" && r.tabSource !== tabFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.reportType.toLowerCase().includes(q) && !r.assetTitle.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-gray-900">My Requests</h2>
        <p className="text-sm text-gray-500">All portfolio governance report requests</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search requests..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as PMRequestStatus | "All")}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="All">All Statuses</option>
          {STATUS_PIPELINE.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select
          value={tabFilter}
          onChange={(e) => setTabFilter(e.target.value as PMTab | "All")}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="All">All Tabs</option>
          {(Object.entries(PM_TAB_CONFIG) as [PMTab, { label: string }][]).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      {/* Status pipeline header */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STATUS_PIPELINE.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setStatusFilter(statusFilter === s ? "All" : s)}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-all ${
                statusFilter === s
                  ? STATUS_COLOR[s]
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:border-gray-300"
              }`}
            >
              {s} ({all.filter((r) => r.status === s).length})
            </button>
            {i < STATUS_PIPELINE.length - 1 && <span className="text-gray-300 text-xs">›</span>}
          </div>
        ))}
      </div>

      {/* Request list */}
      {filtered.length === 0 ? (
        <div className="text-center py-14 text-gray-400">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No requests match your filters</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => <RequestCard key={req.id} req={req} />)}
        </div>
      )}
    </div>
  );
}

function RequestCard({ req }: { req: PMRequest }) {
  const [expanded, setExpanded] = useState(false);
  const stepIndex = STATUS_PIPELINE.indexOf(req.status);

  return (
    <div
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-orange-200 transition-colors cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="px-5 py-4 flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_COLOR[req.status]}`}>
              {req.status}
            </span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {req.tabLabel}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-900">{req.reportType}</p>
          <p className="text-xs text-gray-500 mt-0.5">{req.assetTitle}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs text-gray-400">Submitted {req.submittedDate}</p>
          <p className="text-xs text-gray-400">Due {req.targetDeliveryDate}</p>
          <p className={`text-xs font-medium mt-1 ${SLA_COLOR[req.slaStatus]}`}>
            {req.slaStatus === "On Track" ? "✓" : req.slaStatus === "Overdue" ? "⚠" : "~"} SLA {req.slaStatus}
          </p>
        </div>
      </div>

      {/* Progress pipeline */}
      {expanded && (
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
          <div className="flex items-center gap-0 mb-3">
            {STATUS_PIPELINE.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  i < stepIndex ? "bg-green-500 text-white" : i === stepIndex ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"
                }`}>
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                {i < STATUS_PIPELINE.length - 1 && (
                  <div className={`flex-1 h-0.5 ${i < stepIndex ? "bg-green-400" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {STATUS_PIPELINE.map((s, i) => (
              <span key={s} className={`text-xs text-center flex-1 ${i === stepIndex ? "font-semibold text-orange-600" : "text-gray-400"}`}>
                {s}
              </span>
            ))}
          </div>
          {req.assignedTo && (
            <p className="text-xs text-gray-500 mt-3">Assigned to: {req.assignedTo}</p>
          )}
          {req.notes && (
            <p className="text-xs text-gray-500 mt-1">Notes: {req.notes}</p>
          )}
        </div>
      )}
    </div>
  );
}
