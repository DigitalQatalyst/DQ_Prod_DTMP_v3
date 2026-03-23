import { useMemo, useState } from "react";
import { CheckCircle, Clock, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getTORequests,
  updateTORequestStatus,
  type TORequest,
  type TORequestStatus,
} from "@/data/knowledgeCenter/requestState";
import { knowledgeItems } from "@/data/knowledgeCenter/knowledgeItems";

interface KCIncomingRequestsProps {
  role: "admin" | "viewer";
}

type FilterStatus = "All" | TORequestStatus;

const REQUEST_TYPE_COLORS: Record<string, string> = {
  clarification: "bg-blue-100 text-blue-700",
  "outdated-section": "bg-amber-100 text-amber-700",
  collaboration: "bg-green-100 text-green-700",
};

const REQUEST_STATUS_COLORS: Record<TORequestStatus, string> = {
  Open: "bg-sky-100 text-sky-700",
  "In Review": "bg-orange-100 text-orange-700",
  Resolved: "bg-green-100 text-green-700",
};

export default function KCIncomingRequests({ role }: KCIncomingRequestsProps) {
  const [filter, setFilter] = useState<FilterStatus>("All");
  const [requests, setRequests] = useState<TORequest[]>(() => getTORequests());

  const itemById = useMemo(() => {
    return new Map(knowledgeItems.map((item) => [item.id, item]));
  }, []);

  const filtered = useMemo(() => {
    if (filter === "All") return requests;
    return requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  const handleStatusChange = (requestId: string, status: TORequestStatus) => {
    updateTORequestStatus(requestId, status);
    setRequests(getTORequests());
  };

  const filterOptions: FilterStatus[] = ["All", "Open", "In Review", "Resolved"];

  return (
    <div className="space-y-4">
      {/* Filter bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mr-2">
          Filter:
        </span>
        {filterOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setFilter(option)}
            className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
              filter === option
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
            }`}
          >
            {option}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-500">{filtered.length} request(s)</span>
      </div>

      {/* Request list */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No requests found for this filter.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((req) => {
            const item = itemById.get(req.itemId);
            return (
              <div
                key={req.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm"
              >
                <div className="flex items-start gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">
                      {item?.title ?? req.itemId}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {req.requesterName} · {req.requesterRole}
                    </p>
                    <p className="text-sm text-gray-700 mt-2 line-clamp-2">{req.message}</p>
                    {req.sectionRef && (
                      <p className="text-xs text-gray-400 mt-1">Section: {req.sectionRef}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <Badge
                      className={`text-xs ${
                        REQUEST_TYPE_COLORS[req.type] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {req.type}
                    </Badge>
                    <Badge className={`text-xs ${REQUEST_STATUS_COLORS[req.status]}`}>
                      {req.status}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      {new Date(req.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* TO Actions */}
                {role === "admin" && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex gap-2 flex-wrap">
                    {req.status === "Open" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
                        onClick={() => handleStatusChange(req.id, "In Review")}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Mark In Review
                      </Button>
                    )}
                    {req.status === "In Review" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs border-green-200 text-green-700 hover:bg-green-50"
                        onClick={() => handleStatusChange(req.id, "Resolved")}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Mark Resolved
                      </Button>
                    )}
                    {req.status === "Resolved" && (
                      <span className="text-xs text-green-600 font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Resolved
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
