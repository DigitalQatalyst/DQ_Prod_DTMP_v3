import { useState } from "react";
import { Lock, ChevronDown, ChevronUp, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { updateLCChangeRequest } from "@/data/learningCenter/stage3/lcChangeRequests";
import type { LCChangeRequest } from "@/data/learningCenter/stage3/lcChangeRequests";
import { lcChangeTypeLabels } from "@/data/learningCenter/stage3/lcChangeRequests";
import type { SessionRole } from "@/data/sessionRole";
import {
  getStatusBadgeClass,
  getStatusLabel,
  getUrgencyBadgeClass,
  getChangeTypeBadgeClass,
  formatDate,
} from "./lcGovUtils";
import { useToast } from "@/hooks/use-toast";

interface Props {
  requests: LCChangeRequest[];
  role: SessionRole | null;
  onRefresh: () => void;
}

interface ActionState {
  type: "approve" | "reject" | "clarify" | null;
  note: string;
}

const INITIAL_ACTION: ActionState = { type: null, note: "" };

export default function LCPendingApproval({ requests, role, onRefresh }: Props) {
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionState, setActionState] = useState<Record<string, ActionState>>({});

  if (role !== "to-admin") {
    return (
      <div className="p-6">
        <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Access Restricted</h3>
          <p className="text-gray-500 text-sm max-w-sm">
            The Pending Approval queue is only accessible to Content Approvers. Please contact the EA Office if you need approval access.
          </p>
        </div>
      </div>
    );
  }

  const submitted = requests.filter((r) => r.status === "submitted");

  const getAction = (id: string): ActionState => actionState[id] ?? INITIAL_ACTION;
  const setAction = (id: string, update: Partial<ActionState>) => {
    setActionState((prev) => ({ ...prev, [id]: { ...(prev[id] ?? INITIAL_ACTION), ...update } }));
  };

  const handleApprove = (r: LCChangeRequest) => {
    const note = getAction(r.id).note;
    updateLCChangeRequest(r.id, {
      status: "approved",
      approvedBy: "EA Office Approver",
      approvedAt: new Date().toISOString(),
      approvalNote: note || undefined,
    });
    toast({
      title: "Change request approved",
      description: `"${r.subject}" has been approved and is ready for implementation.`,
    });
    setAction(r.id, INITIAL_ACTION);
    setExpandedId(null);
    onRefresh();
  };

  const handleReject = (r: LCChangeRequest) => {
    const note = getAction(r.id).note;
    if (!note.trim()) {
      toast({ title: "Rejection reason required", description: "Please enter a reason for rejecting this request.", variant: "destructive" });
      return;
    }
    updateLCChangeRequest(r.id, {
      status: "rejected",
      rejectionReason: note,
    });
    toast({
      title: "Change request rejected",
      description: `"${r.subject}" has been rejected.`,
    });
    setAction(r.id, INITIAL_ACTION);
    setExpandedId(null);
    onRefresh();
  };

  const handleClarify = (r: LCChangeRequest) => {
    updateLCChangeRequest(r.id, { status: "submitted" });
    toast({
      title: "Clarification requested",
      description: `Clarification has been requested for "${r.subject}".`,
    });
    setAction(r.id, INITIAL_ACTION);
    setExpandedId(null);
    onRefresh();
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Pending Approval</h2>
        <p className="text-sm text-gray-500">
          {submitted.length} change {submitted.length === 1 ? "request" : "requests"} awaiting your review
        </p>
      </div>

      {submitted.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-10 h-10 text-green-400 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">All clear</h3>
          <p className="text-gray-500 text-sm">No change requests are awaiting approval.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {submitted.map((r) => {
            const isOpen = expandedId === r.id;
            const action = getAction(r.id);
            return (
              <div key={r.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {/* Card header */}
                <div
                  className="px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => setExpandedId(isOpen ? null : r.id)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getChangeTypeBadgeClass(r.changeType)}`}>
                          {lcChangeTypeLabels[r.changeType]}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${getUrgencyBadgeClass(r.urgency)}`}>
                          {r.urgency}
                        </span>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getStatusBadgeClass(r.status)}`}>
                          {getStatusLabel(r.status)}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 truncate">{r.subject}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Submitted by {r.submittedBy} · {formatDate(r.submittedAt)}
                      </p>
                    </div>
                    <button className="p-1 rounded hover:bg-gray-100 text-gray-400 flex-shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {isOpen && (
                  <div className="border-t border-gray-100 px-5 py-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Change Description</p>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{r.changeDescription}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Reason</p>
                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{r.reason}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Current Content (Reference)</p>
                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs text-gray-600">
                          <p><span className="font-medium">Subject:</span> {r.subject}</p>
                          <p className="mt-1"><span className="font-medium">Type:</span> {r.subjectType === "course" ? "Published Course" : r.subjectType === "track" ? "Learning Track" : "Review"}</p>
                          <p className="mt-1 text-gray-400 italic">Full content available in the Content Browser → relevant content item.</p>
                        </div>
                      </div>
                    </div>

                    {/* Action selection */}
                    <div className="border-t border-gray-100 pt-4">
                      {action.type === null && (
                        <div className="flex items-center gap-3">
                          <p className="text-sm text-gray-600 font-medium">Action:</p>
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => setAction(r.id, { type: "approve" })}
                          >
                            <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                            onClick={() => setAction(r.id, { type: "reject" })}
                          >
                            <XCircle className="w-3.5 h-3.5 mr-1.5" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-amber-300 text-amber-700 hover:bg-amber-50"
                            onClick={() => setAction(r.id, { type: "clarify" })}
                          >
                            <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                            Request Clarification
                          </Button>
                        </div>
                      )}

                      {action.type === "approve" && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Approval note (optional)</label>
                            <Textarea
                              value={action.note}
                              onChange={(e) => setAction(r.id, { note: e.target.value })}
                              placeholder="Add any notes or conditions for the implementer..."
                              rows={2}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(r)}>
                              Confirm Approval
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setAction(r.id, INITIAL_ACTION)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {action.type === "reject" && (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Rejection reason <span className="text-red-500">*</span></label>
                            <Textarea
                              value={action.note}
                              onChange={(e) => setAction(r.id, { note: e.target.value })}
                              placeholder="Explain why this request is being rejected..."
                              rows={2}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => handleReject(r)}>
                              Confirm Rejection
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setAction(r.id, INITIAL_ACTION)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}

                      {action.type === "clarify" && (
                        <div className="space-y-3">
                          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                            This will send a clarification request back to the submitter. The change request will remain in Submitted status.
                          </p>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-50" onClick={() => handleClarify(r)}>
                              Confirm
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setAction(r.id, INITIAL_ACTION)}>
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
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
