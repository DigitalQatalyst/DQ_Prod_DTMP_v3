import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ClipboardList, Filter, Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  getApprovalQueue,
  type InitiativeApprovalRequest,
} from "@/data/lifecycle/serviceRequestState";
import { getDemoAccount, getLifecycleRole } from "@/data/shared/lifecycleRole";

const STATUS_CLASSES: Record<InitiativeApprovalRequest["status"], string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Approved: "bg-green-100 text-green-700 border-green-200",
  Rejected: "bg-red-100 text-red-700 border-red-200",
  "Clarification Requested": "bg-blue-100 text-blue-700 border-blue-200",
  Escalated: "bg-purple-100 text-purple-700 border-purple-200",
};

const PRIORITY_CLASSES: Record<string, string> = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-blue-100 text-blue-700",
  Low: "bg-gray-100 text-gray-600",
};

export default function LCInitiativeRequests() {
  const role = getLifecycleRole() ?? "initiative-owner";
  const currentUser = getDemoAccount(role);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");

  const allRequests = useMemo(
    () =>
      getApprovalQueue()
        .filter((r) => r.submittedBy === currentUser.name)
        .sort(
          (a, b) =>
            new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
        ),
    [currentUser.name]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allRequests.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (divisionFilter !== "all" && r.division !== divisionFilter) return false;
      if (q && !r.initiativeName.toLowerCase().includes(q) && !r.frameworkType.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [allRequests, search, statusFilter, divisionFilter]);

  const divisions = useMemo(
    () => Array.from(new Set(allRequests.map((r) => r.division))).sort(),
    [allRequests]
  );

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { Pending: 0, Approved: 0, Rejected: 0, "Clarification Requested": 0, Escalated: 0 };
    allRequests.forEach((r) => { counts[r.status] = (counts[r.status] ?? 0) + 1; });
    return counts;
  }, [allRequests]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Initiative Requests</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Initiative proposals submitted by {currentUser.name} for TO approval.
          </p>
        </div>
        <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
          <Link to="/marketplaces/lifecycle-management">Start New Initiative</Link>
        </Button>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {(["Pending", "Approved", "Clarification Requested", "Escalated", "Rejected"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
            className={`rounded-xl border p-3 text-left transition-all ${
              statusFilter === s ? "ring-2 ring-orange-400 ring-offset-1" : "hover:border-gray-300"
            } ${STATUS_CLASSES[s]}`}
          >
            <p className="text-lg font-bold">{statusCounts[s] ?? 0}</p>
            <p className="text-xs font-medium mt-0.5">{s}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or type..."
            className="pl-9 h-9 text-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 w-44 text-sm">
            <Filter className="w-3.5 h-3.5 mr-2 text-gray-400" />
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {["Pending", "Approved", "Clarification Requested", "Escalated", "Rejected"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={divisionFilter} onValueChange={setDivisionFilter}>
          <SelectTrigger className="h-9 w-44 text-sm">
            <SelectValue placeholder="All divisions" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All divisions</SelectItem>
            {divisions.map((d) => (
              <SelectItem key={d} value={d}>{d}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 ml-auto">
          {filtered.length} of {allRequests.length} requests
        </span>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <ClipboardList className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            {allRequests.length === 0 ? "No initiative requests yet" : "No requests match your filters"}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {allRequests.length === 0
              ? "Submit an initiative request from the Lifecycle Marketplace."
              : "Try adjusting your search or filters."}
          </p>
          {allRequests.length === 0 && (
            <Button asChild className="bg-orange-600 hover:bg-orange-700 text-white">
              <Link to="/marketplaces/lifecycle-management">Go to Lifecycle Marketplace</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r: InitiativeApprovalRequest) => (
            <Card key={r.id} className="border border-gray-200 hover:border-orange-200 hover:shadow-sm transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0 space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-gray-900">{r.initiativeName}</h3>
                      {r.priority && (
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${PRIORITY_CLASSES[r.priority] ?? ""}`}>
                          {r.priority}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      <span className="font-medium">{r.frameworkType}</span>
                      {" · "}
                      {r.division}
                      {r.isExternal && (
                        <span className="ml-1 px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 text-xs">External</span>
                      )}
                    </p>
                    <p className="text-xs text-gray-400">
                      Submitted {new Date(r.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      {r.targetStartDate && ` · Target start: ${new Date(r.targetStartDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`}
                    </p>
                    {r.objective && (
                      <p className="text-xs text-gray-600 line-clamp-2 mt-1 bg-gray-50 rounded px-2 py-1">
                        {r.objective}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Badge className={`text-xs border ${STATUS_CLASSES[r.status]}`}>
                      {r.status}
                    </Badge>
                    {r.estimatedBudget && (
                      <span className="text-xs text-gray-500">{r.estimatedBudget}</span>
                    )}
                  </div>
                </div>
                {r.status === "Clarification Requested" && (
                  <div className="mt-3 border-t border-blue-100 pt-3">
                    <p className="text-xs text-blue-700 font-medium">
                      Action required: The TO team has requested additional information. Please provide clarification to proceed.
                    </p>
                  </div>
                )}
                {r.status === "Rejected" && (
                  <div className="mt-3 border-t border-red-100 pt-3">
                    <p className="text-xs text-red-700 font-medium">
                      This request was not approved. Contact the TO team for feedback before resubmitting.
                    </p>
                  </div>
                )}
                {r.status === "Approved" && (
                  <div className="mt-3 border-t border-green-100 pt-3">
                    <p className="text-xs text-green-700 font-medium">
                      Approved! The TO team will be in touch to kick off the engagement.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
