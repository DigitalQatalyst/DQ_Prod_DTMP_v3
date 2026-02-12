import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SupportLayout } from "./SupportLayout";
import { serviceRequests } from "@/data/supportData";
import { PriorityBadge } from "@/components/stage2";
import { Search } from "lucide-react";

const statusOptions = ["all", "pending-approval", "approved", "in-progress", "completed", "rejected"] as const;

export default function ServiceRequestsPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<typeof statusOptions[number]>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(
    () =>
      serviceRequests.filter((r) => {
        const statusMatch = status === "all" || r.status === status;
        const queryMatch =
          !query ||
          r.title.toLowerCase().includes(query.toLowerCase()) ||
          r.id.toLowerCase().includes(query.toLowerCase());
        return statusMatch && queryMatch;
      }),
    [status, query],
  );

  return (
    <SupportLayout title="Service Requests" description="Access, provisioning, and change requests.">
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                status === s ? "bg-orange-50 text-orange-700 border-orange-200" : "border-gray-200 text-gray-700"
              }`}
            >
              {s === "all" ? "All" : s.replace("-", " ")}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            placeholder="Search by ID or title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-200 hover:bg-orange-50/40 transition-colors cursor-pointer"
            onClick={() => navigate(`/stage2/support/requests/${req.id}`)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{req.title}</p>
                <p className="text-xs text-gray-600 capitalize">{req.type}</p>
              </div>
              <PriorityBadge priority={req.status === "rejected" ? "high" : req.status === "pending-approval" ? "medium" : "low"} size="small" />
            </div>
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">{req.description}</p>
            <div className="text-xs text-gray-600 mt-2 flex items-center gap-2">
              <span className="font-semibold text-gray-800">{req.status.replace("-", " ")}</span>
              {req.estimatedCompletionDate && <>• ETA {new Date(req.estimatedCompletionDate).toLocaleDateString()}</>}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-600">
            No requests match this filter.
          </div>
        )}
      </div>
    </SupportLayout>
  );
}
