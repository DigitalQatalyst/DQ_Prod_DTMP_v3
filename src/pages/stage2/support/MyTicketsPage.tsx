import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { SupportLayout } from "./SupportLayout";
import { supportTickets, TicketStatus } from "@/data/supportData";
import { PriorityBadge, SLATimer } from "@/components/stage2";
import { Search } from "lucide-react";

const statusFilters: { label: string; value: TicketStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "New", value: "new" },
  { label: "In Progress", value: "in-progress" },
  { label: "Pending User", value: "pending-user" },
  { label: "Resolved", value: "resolved" },
];

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const statusParam = (searchParams.get("status") as TicketStatus | null) || "all";

  const filtered = useMemo(() => {
    return supportTickets.filter((t) => {
      const matchesStatus = statusParam === "all" || t.status === statusParam;
      const matchesQuery =
        !query ||
        t.subject.toLowerCase().includes(query.toLowerCase()) ||
        t.id.toLowerCase().includes(query.toLowerCase());
      return matchesStatus && matchesQuery;
    });
  }, [query, statusParam]);

  return (
    <SupportLayout title="My Tickets" description="Track and manage your support tickets.">
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 flex-wrap">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setSearchParams(f.value === "all" ? {} : { status: f.value })}
              className={`px-3 py-1.5 rounded-full text-sm border ${
                statusParam === f.value ? "bg-orange-50 text-orange-700 border-orange-200" : "border-gray-200 text-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            placeholder="Search by ID or subject"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-12 px-4 py-3 text-xs font-semibold text-gray-600 bg-gray-50">
          <div className="col-span-2">Ticket ID</div>
          <div className="col-span-4">Subject</div>
          <div className="col-span-2">Priority</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">SLA</div>
        </div>
        <div className="divide-y divide-gray-200">
          {filtered.map((t) => (
            <button
              key={t.id}
              className="w-full text-left grid grid-cols-12 px-4 py-3 hover:bg-orange-50/50 transition-colors"
              onClick={() => navigate(`/stage2/support/tickets/${t.id}`)}
            >
              <div className="col-span-2 text-sm font-semibold text-gray-900">{t.id}</div>
              <div className="col-span-4 text-sm text-gray-800">{t.subject}</div>
              <div className="col-span-2"><PriorityBadge priority={t.priority} size="small" /></div>
              <div className="col-span-2 text-sm capitalize text-gray-700">{t.status.replace("-", " ")}</div>
              <div className="col-span-2">
                <SLATimer deadline={t.sla.resolutionDeadline} timeRemainingMinutes={t.sla.timeRemainingMinutes} breached={t.sla.resolutionBreached} />
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="p-6 text-center text-sm text-gray-600">No tickets match this filter.</div>
          )}
        </div>
      </div>
    </SupportLayout>
  );
}
