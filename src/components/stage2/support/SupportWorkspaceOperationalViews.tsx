import { Badge } from "@/components/ui/badge";
import { PriorityBadge, SLATimer } from "@/components/stage2";
import type { ServiceRequest, SupportTicket } from "@/data/supportData";

interface SupportWorkspaceOperationalViewsProps {
  activeSubService: string;
  supportTicketsState: SupportTicket[];
  supportRequestsState: ServiceRequest[];
}

export function SupportWorkspaceOperationalViews({
  activeSubService,
  supportTicketsState,
  supportRequestsState,
}: SupportWorkspaceOperationalViewsProps) {
  if (activeSubService === "support-overview") {
    const metrics = [
      { label: "Open Tickets", value: supportTicketsState.filter((t) => !["resolved", "closed"].includes(t.status)).length },
      { label: "High / Critical", value: supportTicketsState.filter((t) => ["critical", "high"].includes(t.priority as string)).length },
      { label: "Pending User", value: supportTicketsState.filter((t) => t.status === "pending-user").length },
      { label: "Requests In Progress", value: supportRequestsState.filter((r) => r.status === "in-progress").length },
    ];
    const topTickets = supportTicketsState.filter((t) => !["resolved", "closed"].includes(t.status)).slice(0, 3);
    const topRequests = supportRequestsState.slice(0, 3);

    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <div key={m.label} className="bg-white border border-gray-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">{m.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Priority Tickets</h3>
            </div>
            <div className="space-y-3">
              {topTickets.map((t) => (
                <div key={t.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{t.subject}</p>
                      <p className="text-xs text-gray-600">{t.category} • {t.subcategory}</p>
                    </div>
                    <PriorityBadge priority={t.priority} size="small" />
                  </div>
                  <div className="mt-2">
                    <SLATimer
                      deadline={t.sla.resolutionDeadline}
                      timeRemainingMinutes={t.sla.timeRemainingMinutes}
                      breached={t.sla.resolutionBreached}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">Service Requests</h3>
            </div>
            <div className="space-y-3">
              {topRequests.map((r) => (
                <div key={r.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{r.title}</p>
                      <p className="text-xs text-gray-600 capitalize">{r.type}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {r.status.replace("-", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">{r.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubService === "support-tickets") {
    return (
      <div className="p-6 space-y-3">
        <div className="hidden md:grid grid-cols-[1fr_1.6fr_1fr_1fr_2fr] px-4 py-2 text-xs font-semibold text-gray-600 bg-gray-50 border border-gray-200 rounded-lg">
          <div>Ticket ID</div>
          <div>Subject</div>
          <div>Priority</div>
          <div>Status</div>
          <div className="text-center">SLA</div>
        </div>
        <div className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
          {supportTicketsState.map((t) => (
            <div
              key={t.id}
              className="flex flex-col md:grid md:grid-cols-[1fr_1.6fr_1fr_1fr_2fr] px-4 py-3 gap-3 items-start md:items-center"
            >
              <div className="text-sm font-semibold text-gray-900">{t.id}</div>
              <div className="text-sm text-gray-800 md:pr-4">{t.subject}</div>
              <div className="md:justify-self-start">
                <PriorityBadge priority={t.priority} size="small" />
              </div>
              <div className="text-sm capitalize text-gray-700">{t.status.replace("-", " ")}</div>
              <div className="w-full md:w-auto md:justify-self-stretch">
                <SLATimer
                  deadline={t.sla.resolutionDeadline}
                  timeRemainingMinutes={t.sla.timeRemainingMinutes}
                  breached={t.sla.resolutionBreached}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (activeSubService === "support-requests") {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {supportRequestsState.map((req) => (
          <div key={req.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-900">{req.title}</p>
                <p className="text-xs text-gray-600 capitalize">{req.type}</p>
              </div>
              <Badge variant="secondary" className="capitalize">
                {req.status.replace("-", " ")}
              </Badge>
            </div>
            <p className="text-sm text-gray-700 mt-2 line-clamp-2">{req.description}</p>
            <p className="text-xs text-gray-500 mt-1">Requester: {req.requester.name}</p>
          </div>
        ))}
      </div>
    );
  }

  if (activeSubService === "support-history") {
    const orderedTickets = [...supportTicketsState].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
    const total = orderedTickets.length;
    const open = orderedTickets.filter((ticket) => !["resolved", "closed"].includes(ticket.status)).length;
    const resolved = orderedTickets.filter((ticket) => ticket.status === "resolved").length;
    const closed = orderedTickets.filter((ticket) => ticket.status === "closed").length;

    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-sm text-gray-600">Total Tickets</p><p className="text-2xl font-semibold text-gray-900">{total}</p></div>
          <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-sm text-gray-600">Open</p><p className="text-2xl font-semibold text-gray-900">{open}</p></div>
          <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-sm text-gray-600">Resolved</p><p className="text-2xl font-semibold text-gray-900">{resolved}</p></div>
          <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-sm text-gray-600">Closed</p><p className="text-2xl font-semibold text-gray-900">{closed}</p></div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1.1fr_2fr_1fr_1fr] px-4 py-3 text-xs font-semibold text-gray-600 bg-gray-50">
            <div>Ticket</div>
            <div>Subject</div>
            <div>Status</div>
            <div>Updated</div>
          </div>
          <div className="divide-y divide-gray-200">
            {orderedTickets.map((ticket) => (
              <div key={ticket.id} className="grid grid-cols-[1.1fr_2fr_1fr_1fr] px-4 py-3 text-sm">
                <div className="font-semibold text-gray-900">{ticket.id}</div>
                <div className="text-gray-700 truncate">{ticket.subject}</div>
                <div className="capitalize text-gray-700">{ticket.status.replace("-", " ")}</div>
                <div className="text-gray-600">{new Date(ticket.updatedAt).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeSubService === "support-team") {
    const activeTickets = supportTicketsState.filter((ticket) => !["resolved", "closed"].includes(ticket.status));
    const assignedTickets = activeTickets.filter((ticket) => !!ticket.assignee);
    const teamLoad = assignedTickets.reduce<Record<string, number>>((acc, ticket) => {
      const key = ticket.assignee?.name || "Unassigned";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    const teamRows = Object.entries(teamLoad).sort((a, b) => b[1] - a[1]);

    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Active Tickets</p>
            <p className="text-2xl font-semibold text-gray-900">{activeTickets.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Assigned Tickets</p>
            <p className="text-2xl font-semibold text-gray-900">{assignedTickets.length}</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Unassigned Tickets</p>
            <p className="text-2xl font-semibold text-gray-900">{activeTickets.length - assignedTickets.length}</p>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Tickets by Team Member</h3>
          <div className="space-y-2">
            {teamRows.length === 0 && <p className="text-sm text-gray-600">No active assignments available.</p>}
            {teamRows.map(([name, count]) => (
              <div key={name} className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2">
                <span className="text-sm text-gray-800">{name}</span>
                <span className="text-sm font-semibold text-gray-900">{count} active</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeSubService === "support-analytics") {
    const total = supportTicketsState.length;
    const openCount = supportTicketsState.filter((ticket) => ["new", "assigned", "in-progress"].includes(ticket.status)).length;
    const statusCounts = supportTicketsState.reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {});
    const priorityCounts = supportTicketsState.reduce<Record<string, number>>((acc, ticket) => {
      acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
      return acc;
    }, {});
    const responseMet = supportTicketsState.filter((ticket) => !ticket.sla.responseBreached).length;
    const resolutionMet = supportTicketsState.filter((ticket) => !ticket.sla.resolutionBreached).length;
    const responsePercent = total ? Math.round((responseMet / total) * 100) : 0;
    const resolutionPercent = total ? Math.round((resolutionMet / total) * 100) : 0;

    return (
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-sm text-gray-600">Total Tickets</p><p className="text-2xl font-semibold text-gray-900">{total}</p></div>
          <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-sm text-gray-600">Open Tickets</p><p className="text-2xl font-semibold text-gray-900">{openCount}</p></div>
          <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-sm text-gray-600">Response SLA Met</p><p className="text-2xl font-semibold text-gray-900">{responsePercent}%</p></div>
          <div className="bg-white border border-gray-200 rounded-lg p-4"><p className="text-sm text-gray-600">Resolution SLA Met</p><p className="text-2xl font-semibold text-gray-900">{resolutionPercent}%</p></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tickets by Status</h3>
            <div className="space-y-2">
              {Object.entries(statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2">
                  <span className="text-sm capitalize text-gray-700">{status.replace("-", " ")}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tickets by Priority</h3>
            <div className="space-y-2">
              {Object.entries(priorityCounts).map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between border border-gray-200 rounded-md px-3 py-2">
                  <span className="text-sm capitalize text-gray-700">{priority}</span>
                  <span className="text-sm font-semibold text-gray-900">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
