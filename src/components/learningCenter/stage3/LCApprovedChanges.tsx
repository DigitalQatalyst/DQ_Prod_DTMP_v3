import { useState } from "react";
import { Copy, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
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

const ACTIVE_STATUSES = ["approved", "in-implementation", "implemented", "verified"] as const;

export default function LCApprovedChanges({ requests, role, onRefresh }: Props) {
  const { toast } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [implNotes, setImplNotes] = useState<Record<string, string>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const visible = requests.filter((r) =>
    ACTIVE_STATUSES.includes(r.status as (typeof ACTIVE_STATUSES)[number])
  );

  const canImplement = role === "to-admin" || role === "to-ops";

  const handleMarkImplemented = (r: LCChangeRequest) => {
    updateLCChangeRequest(r.id, {
      status: "implemented",
      implementationNote: implNotes[r.id] || undefined,
      implementedAt: new Date().toISOString(),
    });
    toast({
      title: "Marked as implemented",
      description: `"${r.subject}" has been marked as implemented.`,
    });
    setExpandedId(null);
    onRefresh();
  };

  const handleVerify = (r: LCChangeRequest) => {
    updateLCChangeRequest(r.id, {
      status: "verified",
      verifiedAt: new Date().toISOString(),
    });
    toast({
      title: "Change verified",
      description: `"${r.subject}" has been verified and closed.`,
    });
    onRefresh();
  };

  const handleRaiseQuery = (r: LCChangeRequest) => {
    updateLCChangeRequest(r.id, { status: "closed-not-verified" });
    toast({
      title: "Query raised",
      description: `A query has been raised on "${r.subject}". Status set to Closed – Not Verified.`,
    });
    onRefresh();
  };

  const handleCopyInstruction = (r: LCChangeRequest) => {
    const text = [
      "IMPLEMENTATION INSTRUCTION",
      "─────────────────────────",
      `Change Type: ${lcChangeTypeLabels[r.changeType]}`,
      `Subject: ${r.subject}`,
      `Subject Type: ${r.subjectType}`,
      "",
      "Instruction:",
      r.changeDescription,
      "",
      "Reason:",
      r.reason,
      "",
      `Urgency: ${r.urgency.charAt(0).toUpperCase() + r.urgency.slice(1)}`,
      `Approved by: ${r.approvedBy ?? "—"}`,
      `Approved: ${r.approvedAt ? formatDate(r.approvedAt) : "—"}`,
      r.approvalNote ? `\nApproval Note:\n${r.approvalNote}` : "",
    ]
      .filter((line) => line !== undefined)
      .join("\n");

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(r.id);
      toast({ title: "Copied", description: "Implementation instruction copied to clipboard." });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Approved Changes</h2>
        <p className="text-sm text-gray-500">
          {visible.length} change {visible.length === 1 ? "request" : "requests"} in approved, in-implementation, implemented, or verified status
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-10 h-10 text-gray-300 mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">No approved changes</h3>
          <p className="text-gray-500 text-sm">Approved change requests will appear here.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Subject</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Type</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Status</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Urgency</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600">Approved</th>
                <th className="text-left px-5 py-2 font-medium text-gray-600 w-8"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visible.map((r) => {
                const isOpen = expandedId === r.id;
                return (
                  <>
                    <tr
                      key={r.id}
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => setExpandedId(isOpen ? null : r.id)}
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
                      <td className="px-5 py-3 text-gray-500 text-xs">
                        {r.approvedAt ? formatDate(r.approvedAt) : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpandedId(isOpen ? null : r.id); }}
                          className="p-1 rounded hover:bg-gray-100 text-gray-400"
                        >
                          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>

                    {isOpen && (
                      <tr key={`${r.id}-detail`}>
                        <td colSpan={6} className="px-5 py-4 bg-gray-50 border-t border-gray-100">
                          <div className="space-y-4">
                            {/* Implementation Instruction block */}
                            {(r.status === "approved" || r.status === "in-implementation") && (
                              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs font-semibold text-orange-700 uppercase tracking-wide">
                                    Implementation Instruction
                                  </p>
                                  <button
                                    onClick={() => handleCopyInstruction(r)}
                                    className="flex items-center gap-1 text-xs text-orange-600 hover:text-orange-800 border border-orange-300 rounded px-2 py-1 bg-white hover:bg-orange-50 transition-colors"
                                  >
                                    {copiedId === r.id ? (
                                      <CheckCircle className="w-3 h-3" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                    {copiedId === r.id ? "Copied" : "Copy"}
                                  </button>
                                </div>
                                <div className="text-sm space-y-1">
                                  <p><span className="font-medium text-gray-700">Change Type:</span> <span className="text-gray-600">{lcChangeTypeLabels[r.changeType]}</span></p>
                                  <p><span className="font-medium text-gray-700">Subject:</span> <span className="text-gray-600">{r.subject}</span></p>
                                  <p className="mt-2"><span className="font-medium text-gray-700">Instruction:</span></p>
                                  <p className="text-gray-600 whitespace-pre-wrap pl-2 border-l-2 border-orange-300">{r.changeDescription}</p>
                                  <p className="mt-2"><span className="font-medium text-gray-700">Reason:</span></p>
                                  <p className="text-gray-600 pl-2 border-l-2 border-orange-200">{r.reason}</p>
                                </div>
                              </div>
                            )}

                            {/* Approve / In Implementation — Mark as Implemented */}
                            {canImplement && (r.status === "approved" || r.status === "in-implementation") && (
                              <div className="space-y-2">
                                <label className="block text-xs font-medium text-gray-600">Implementation notes (optional)</label>
                                <Textarea
                                  value={implNotes[r.id] ?? ""}
                                  onChange={(e) => setImplNotes((prev) => ({ ...prev, [r.id]: e.target.value }))}
                                  placeholder="Describe what was done to implement this change..."
                                  rows={2}
                                />
                                <Button
                                  size="sm"
                                  className="bg-amber-600 hover:bg-amber-700 text-white"
                                  onClick={() => handleMarkImplemented(r)}
                                >
                                  Mark as Implemented
                                </Button>
                              </div>
                            )}

                            {/* Implemented — Verify / Raise Query */}
                            {r.status === "implemented" && role === "to-admin" && (
                              <div className="space-y-2">
                                {r.implementationNote && (
                                  <div>
                                    <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Implementation Note</p>
                                    <p className="text-sm text-gray-700">{r.implementationNote}</p>
                                    {r.implementedAt && (
                                      <p className="text-xs text-gray-400 mt-0.5">Implemented: {formatDate(r.implementedAt)}</p>
                                    )}
                                  </div>
                                )}
                                <div className="flex items-center gap-2 pt-1">
                                  <Button
                                    size="sm"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                    onClick={() => handleVerify(r)}
                                  >
                                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                                    Verify
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-300 text-red-600 hover:bg-red-50"
                                    onClick={() => handleRaiseQuery(r)}
                                  >
                                    Raise Query
                                  </Button>
                                </div>
                              </div>
                            )}

                            {/* Verified */}
                            {r.status === "verified" && (
                              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 text-sm">
                                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                                <span>This change has been implemented and verified. {r.verifiedAt && `Verified on ${formatDate(r.verifiedAt)}.`}</span>
                              </div>
                            )}

                            {/* Approval details */}
                            <div className="flex gap-4 text-xs text-gray-400 pt-2 border-t border-gray-200">
                              <span>Submitted by: <span className="text-gray-600">{r.submittedBy}</span></span>
                              {r.approvedBy && <span>Approved by: <span className="text-gray-600">{r.approvedBy}</span></span>}
                              {r.approvalNote && <span className="text-gray-500 italic">{r.approvalNote}</span>}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
