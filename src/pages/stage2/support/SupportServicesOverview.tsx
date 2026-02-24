import { SupportLayout } from "./SupportLayout";
import { supportStats, supportTickets, serviceRequests } from "@/data/supportData";
import { SLATimer, PriorityBadge } from "@/components/stage2";
import { Ticket, ClipboardList, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export default function SupportServicesOverview() {
  const openTickets = supportTickets.filter((t) => !["resolved", "closed"].includes(t.status)).slice(0, 4);
  const inProgressRequests = serviceRequests.filter((r) => ["in-progress", "pending-approval", "approved"].includes(r.status)).slice(0, 4);

  const metrics = [
    { label: "Open Tickets", value: supportStats.openTickets, icon: Ticket, color: "text-orange-700 bg-orange-50" },
    { label: "High / Critical", value: supportStats.highPriority, icon: AlertTriangle, color: "text-red-700 bg-red-50" },
    { label: "Pending User", value: supportStats.pendingUser, icon: Clock, color: "text-amber-700 bg-amber-50" },
    { label: "Requests In Progress", value: supportStats.requestsInProgress, icon: ClipboardList, color: "text-blue-700 bg-blue-50" },
  ];

  return (
    <SupportLayout title="Support Services Overview" description="Snapshot of tickets, requests, and SLAs.">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="bg-white border border-gray-200 rounded-lg p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${m.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{m.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{m.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <section className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Priority Tickets</h2>
            <a className="text-sm text-orange-700 hover:underline" href="/stage2/support/tickets">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {openTickets.map((ticket) => (
              <div key={ticket.id} className="border border-gray-200 rounded-lg p-3 hover:border-orange-200 hover:bg-orange-50/30 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{ticket.subject}</p>
                    <p className="text-xs text-gray-600">{ticket.category} • {ticket.subcategory}</p>
                  </div>
                  <PriorityBadge priority={ticket.priority} size="small" />
                </div>
                <div className="mt-2">
                  <SLATimer deadline={ticket.sla.resolutionDeadline} timeRemainingMinutes={ticket.sla.timeRemainingMinutes} breached={ticket.sla.resolutionBreached} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-900">Service Requests</h2>
            <a className="text-sm text-orange-700 hover:underline" href="/stage2/support/requests">
              View all
            </a>
          </div>
          <div className="space-y-3">
            {inProgressRequests.map((req) => (
              <div key={req.id} className="border border-gray-200 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{req.title}</p>
                  <p className="text-xs text-gray-600 capitalize">{req.type} • {req.status.replace("-", " ")}</p>
                </div>
                <CheckCircle className="text-green-600" size={18} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </SupportLayout>
  );
}
