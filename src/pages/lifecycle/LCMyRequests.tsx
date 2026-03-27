import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Filter, Shield, Download } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

import {
  getLCRequests,
  type LCServiceRequest,
  type LCRequestStatus,
  type LCServiceType,
} from "@/data/lifecycle/serviceRequestState";
import { getDemoAccount, getLifecycleRole } from "@/data/shared/lifecycleRole";

const STATUS_TO_BADGE: Partial<Record<LCRequestStatus, string>> = {
  Submitted: "bg-sky-100 text-sky-700 border-sky-200",
  Assigned: "bg-purple-100 text-purple-700 border-purple-200",
  "In Progress": "bg-blue-100 text-blue-700 border-blue-200",
  Delivered: "bg-green-100 text-green-700 border-green-200",
  Completed: "bg-green-50 text-green-600 border-green-100",
};

const PRIORITY_TO_BADGE: Record<LCServiceRequest["priority"], string> = {
  Critical: "bg-red-100 text-red-700 border-red-200",
  High: "bg-orange-100 text-orange-700 border-orange-200",
  Medium: "bg-blue-100 text-blue-700 border-blue-200",
  Low: "bg-gray-100 text-gray-700 border-gray-200",
};

function toDateInputValue(iso: string | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

export default function LCMyRequests() {
  const role = getLifecycleRole() ?? "initiative-owner";
  const account = getDemoAccount(role);
  const [status, setStatus] = useState<"all" | LCRequestStatus>("all");
  const [serviceType, setServiceType] = useState<"all" | LCServiceType>("all");
  const [initiativeQuery, setInitiativeQuery] = useState("");

  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const requests = useMemo(() => getLCRequests(account.name), [account.name]);

  const uniqueServiceTypes = useMemo(() => {
    return Array.from(new Set(requests.map((r) => r.serviceType))).sort();
  }, [requests]);

  const filtered = useMemo(() => {
    const q = initiativeQuery.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom).getTime() : null;
    const to = dateTo ? new Date(dateTo).getTime() : null;

    return requests
      .filter((r) => (status === "all" ? true : r.status === status))
      .filter((r) => (serviceType === "all" ? true : r.serviceType === serviceType))
      .filter((r) => (q ? r.initiativeName.toLowerCase().includes(q) : true))
      .filter((r) => {
        if (from === null && to === null) return true;
        const t = new Date(r.submittedAt).getTime();
        if (from !== null && t < from) return false;
        if (to !== null && t > to) return false;
        return true;
      })
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }, [requests, status, serviceType, initiativeQuery, dateFrom, dateTo]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="text-gray-500 mt-1">Lifecycle service request tracker for the demo role.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-gray-200">
            {filtered.length} shown
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="w-4 h-4" />
            Filters
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
            <div className="lg:col-span-1">
              <label className="text-xs text-gray-500 mb-1 block">Status</label>
              <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {(["Submitted", "Assigned", "In Progress", "Delivered", "Completed"] as LCRequestStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-1">
              <label className="text-xs text-gray-500 mb-1 block">Service Type</label>
              <Select value={serviceType} onValueChange={(v) => setServiceType(v as any)}>
                <SelectTrigger>
                  <SelectValue placeholder="Service type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  {uniqueServiceTypes.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="lg:col-span-1">
              <label className="text-xs text-gray-500 mb-1 block">Initiative search</label>
              <Input value={initiativeQuery} onChange={(e) => setInitiativeQuery(e.target.value)} placeholder="e.g. Smart Grid..." />
            </div>

            <div className="lg:col-span-1">
              <label className="text-xs text-gray-500 mb-1 block">Date range</label>
              <div className="flex gap-2">
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No requests match your filters.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const submitted = new Date(r.submittedAt).toLocaleDateString();
            const target = new Date(new Date(r.submittedAt).getTime() + r.slaHours * 60 * 60 * 1000);
            const isBreached = Date.now() > target.getTime();

            return (
              <Card key={r.id}>
                <CardContent className="p-5 space-y-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">Service</p>
                      <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{r.serviceType}</h2>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        Initiative: {r.initiativeName}
                        {r.projectName ? ` · Project: ${r.projectName}` : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={`${STATUS_TO_BADGE[r.status] ?? "bg-gray-100 text-gray-700 border-gray-200"} border`}>
                        {r.status}
                      </Badge>
                      <Badge className={`${PRIORITY_TO_BADGE[r.priority]} border`}>{r.priority}</Badge>
                      <Badge
                        className={`text-xs border ${isBreached ? "bg-red-100 text-red-700 border-red-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"}`}
                      >
                        SLA: {isBreached ? "Breached" : "On track"}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Submitted</p>
                      <p className="text-sm font-medium text-gray-900">{submitted}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Target delivery</p>
                      <p className="text-sm font-medium text-gray-900">{target.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Assigned TO</p>
                      <p className="text-sm font-medium text-gray-900">{r.assignedTo ?? "Unassigned"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Notes</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{r.notes ?? "-"}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      className="bg-white"
                      onClick={() =>
                        toast({
                          title: "Demo-only",
                          description: "Stage 2 request detail view is not implemented yet.",
                        })
                      }
                    >
                      Review
                    </Button>

                    <Button
                      onClick={() => {
                        if (!r.deliverableTitle) {
                          toast({ title: "Not delivered yet", description: "Deliverable is not available for this request." });
                          return;
                        }
                        toast({
                          title: "Demo file",
                          description: `Deliverable: ${r.deliverableTitle} (${r.deliverableFormat ?? "PDF"}). Download is demo-only.`,
                        });
                      }}
                    >
                      <Download className="w-4 h-4" />
                      View/Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="pt-4">
        <Card>
          <CardContent className="p-5 flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h3 className="font-semibold">Request tracker model</h3>
              </div>
              <p className="text-sm text-gray-600">
                This is wired to the spec’s `serviceRequestState.ts` model using your demo lifecycle role. Deliverable actions are demo-only until Stage 3 fulfilment UI is added.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/marketplaces/lifecycle-management">
                Browse Lifecycle
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

