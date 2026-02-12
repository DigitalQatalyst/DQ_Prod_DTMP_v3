import { useParams, useNavigate } from "react-router-dom";
import SupportLayout from "./SupportLayout";
import { supportTickets } from "@/data/supportData";
import { PriorityBadge, SLATimer, StatusTimeline, ConversationItem } from "@/components/stage2";
import { ArrowLeft, Paperclip } from "lucide-react";

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const ticket = supportTickets.find((t) => t.id === ticketId);

  if (!ticket) {
    return (
      <SupportLayout title="Ticket not found">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <p className="text-gray-700">Ticket {ticketId} not found.</p>
          <button className="mt-3 text-orange-700 font-semibold" onClick={() => navigate("/stage2/support/tickets")}>
            Back to tickets
          </button>
        </div>
      </SupportLayout>
    );
  }

  return (
    <SupportLayout title={ticket.subject} description={ticket.id}>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-orange-700 font-semibold"
        >
          <ArrowLeft size={16} /> Back
        </button>
        <PriorityBadge priority={ticket.priority} />
        <span className="text-sm text-gray-700 capitalize">Status: {ticket.status.replace("-", " ")}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-4 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Summary</h2>
            <p className="text-sm text-gray-700 mt-1">{ticket.description}</p>
            <p className="text-xs text-gray-500 mt-1">
              Category: {ticket.category} • {ticket.subcategory}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Timeline</h3>
            <StatusTimeline ticket={ticket} />
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Conversation</h3>
            <div className="space-y-3">
              {ticket.conversation.map((c) => (
                <ConversationItem key={c.id} comment={c} />
              ))}
            </div>
          </div>

          {ticket.attachments.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Attachments</h3>
              <div className="space-y-2">
                {ticket.attachments.map((file) => (
                  <div key={file.id} className="flex items-center gap-2 text-sm text-gray-700">
                    <Paperclip size={16} className="text-gray-500" />
                    <span>{file.filename}</span>
                    <span className="text-xs text-gray-500">({file.fileSize})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">SLA</h3>
            <SLATimer
              deadline={ticket.sla.resolutionDeadline}
              timeRemainingMinutes={ticket.sla.timeRemainingMinutes}
              breached={ticket.sla.resolutionBreached}
            />
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">People</h3>
            <p className="text-sm text-gray-700"><strong>Requester:</strong> {ticket.requester.name}</p>
            {ticket.assignee && <p className="text-sm text-gray-700"><strong>Assignee:</strong> {ticket.assignee.name} ({ticket.assignee.team})</p>}
          </div>
        </div>
      </div>
    </SupportLayout>
  );
}
