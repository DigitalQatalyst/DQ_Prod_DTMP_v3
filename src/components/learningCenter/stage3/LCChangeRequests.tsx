import { useState } from "react";
import { Plus, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { LCChangeRequest, LCChangeStatus, LCChangeType, LCUrgency } from "@/data/learningCenter/stage3/lcChangeRequests";
import { lcChangeTypeLabels } from "@/data/learningCenter/stage3/lcChangeRequests";
import {
  getStatusBadgeClass,
  getStatusLabel,
  getUrgencyBadgeClass,
  getChangeTypeBadgeClass,
  formatDate,
} from "./lcGovUtils";
import LCChangeRequestDialog from "./LCChangeRequestDialog";

interface Props {
  requests: LCChangeRequest[];
  onRefresh: () => void;
}

type FilterStatus = LCChangeStatus | "all";
type FilterType = LCChangeType | "all";
type FilterUrgency = LCUrgency | "all";

export default function LCChangeRequests({ requests, onRefresh }: Props) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterUrgency, setFilterUrgency] = useState<FilterUrgency>("all");

  const filtered = requests.filter((r) => {
    if (filterStatus !== "all" && r.status !== filterStatus) return false;
    if (filterType !== "all" && r.changeType !== filterType) return false;
    if (filterUrgency !== "all" && r.urgency !== filterUrgency) return false;
    return true;
  });

  const statuses: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All Statuses" },
    { value: "draft", label: "Draft" },
    { value: "submitted", label: "Submitted" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "in-implementation", label: "In Implementation" },
    { value: "implemented", label: "Implemented" },
    { value: "verified", label: "Verified" },
    { value: "closed-not-verified", label: "Closed – Not Verified" },
  ];

  const urgencies: { value: FilterUrgency; label: string }[] = [
    { value: "all", label: "All Urgencies" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ];

  return (
    <div className="p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Change Requests</h2>
          <p className="text-sm text-gray-500">{filtered.length} of {requests.length} requests shown</p>
        </div>
        <Button
          className="bg-orange-600 hover:bg-orange-700 text-white"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Change Request
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as FilterType)}
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="all">All Types</option>
          {(Object.entries(lcChangeTypeLabels) as [LCChangeType, string][]).map(([v, l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
        <select
          value={filterUrgency}
          onChange={(e) => setFilterUrgency(e.target.value as FilterUrgency)}
          className="border border-gray-200 rounded-md px-3 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          {urgencies.map((u) => (
            <option key={u.value} value={u.value}>{u.label}</option>
          ))}
        </select>
        {(filterStatus !== "all" || filterType !== "all" || filterUrgency !== "all") && (
          <button
            onClick={() => { setFilterStatus("all"); setFilterType("all"); setFilterUrgency("all"); }}
            className="text-xs text-orange-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        {filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-gray-400 text-sm">
            No change requests match the selected filters.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Subject</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Type</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Status</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Urgency</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Submitted</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600 w-20">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <>
                  <tr
                    key={r.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  >
                    <td className="px-5 py-3 font-medium text-gray-800 max-w-xs">
                      <span className="line-clamp-1">{r.subject}</span>
                      <span className="block text-xs text-gray-400 font-normal capitalize">{r.subjectType}</span>
                    </td>
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
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getUrgencyBadgeClass(r.urgency)}`}>
                        {r.urgency}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">{formatDate(r.submittedAt)}</td>
                    <td className="px-5 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === r.id ? null : r.id); }}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500"
                      >
                        {expandedId === r.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    </td>
                  </tr>
                  {expandedId === r.id && (
                    <tr key={`${r.id}-detail`}>
                      <td colSpan={6} className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Change Description</p>
                            <p className="text-gray-700 whitespace-pre-wrap">{r.changeDescription}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Reason</p>
                            <p className="text-gray-700 whitespace-pre-wrap">{r.reason}</p>
                          </div>
                          {r.approvalNote && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Approval Note</p>
                              <p className="text-gray-700">{r.approvalNote}</p>
                            </div>
                          )}
                          {r.rejectionReason && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Rejection Reason</p>
                              <p className="text-red-700">{r.rejectionReason}</p>
                            </div>
                          )}
                          {r.implementationNote && (
                            <div>
                              <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Implementation Note</p>
                              <p className="text-gray-700">{r.implementationNote}</p>
                            </div>
                          )}
                          <div className="col-span-2 flex gap-4 text-xs text-gray-400 pt-2 border-t border-gray-200">
                            <span>Submitted by: <span className="text-gray-600">{r.submittedBy}</span></span>
                            <span>Submitted: <span className="text-gray-600">{formatDate(r.submittedAt)}</span></span>
                            {r.approvedBy && <span>Approved by: <span className="text-gray-600">{r.approvedBy}</span></span>}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <LCChangeRequestDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={onRefresh}
      />
    </div>
  );
}
