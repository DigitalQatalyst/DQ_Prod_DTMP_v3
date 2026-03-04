import type { Dispatch, SetStateAction } from "react";
import {
  Calendar,
  CheckCircle,
  Clock as ClockIcon,
  Eye,
  MessageCircle,
  Paperclip,
  Phone,
  ShieldCheck,
  Tag,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/stage2";
import { getSupportServiceDetail } from "@/data/supportServices/detailsSupport";
import type { KnowledgeArticle, ServiceRequest, SupportTicket } from "@/data/supportData";
import {
  buildKnowledgeDetailContent,
  supportCategoryOptions,
  type NewSupportRequestForm,
} from "@/pages/stage2/support/supportWorkspaceConfig";
import { SupportWorkspaceOperationalViews } from "@/components/stage2/support/SupportWorkspaceOperationalViews";

interface SupportWorkspacePanelsProps {
  activeService: string;
  activeSubService: string | null;
  supportSelectedService: any;
  supportSubmitMessage: string | null;
  createTicketFromService: () => void;
  supportAttachments: File[];
  setSupportAttachments: Dispatch<SetStateAction<File[]>>;
  supportTicketsState: SupportTicket[];
  supportRequestsState: ServiceRequest[];
  newRequestError: string | null;
  newRequestSuccess: string | null;
  setActiveSubService: (value: string | null) => void;
  newRequestForm: NewSupportRequestForm;
  setNewRequestForm: Dispatch<SetStateAction<NewSupportRequestForm>>;
  newRequestAttachments: File[];
  setNewRequestAttachments: Dispatch<SetStateAction<File[]>>;
  setNewRequestError: Dispatch<SetStateAction<string | null>>;
  addNewRequestAttachments: (fileList: FileList | null) => void;
  removeNewRequestAttachment: (name: string) => void;
  submitNewSupportRequest: () => void;
  knowledgeArticles: KnowledgeArticle[];
  supportSelectedArticleId: string | null;
  setSupportSelectedArticleId: Dispatch<SetStateAction<string | null>>;
}

export function SupportWorkspacePanels({
  activeService,
  activeSubService,
  supportSelectedService,
  supportSubmitMessage,
  createTicketFromService,
  supportAttachments,
  setSupportAttachments,
  supportTicketsState,
  supportRequestsState,
  newRequestError,
  newRequestSuccess,
  setActiveSubService,
  newRequestForm,
  setNewRequestForm,
  newRequestAttachments,
  setNewRequestAttachments,
  setNewRequestError,
  addNewRequestAttachments,
  removeNewRequestAttachment,
  submitNewSupportRequest,
  knowledgeArticles,
  supportSelectedArticleId,
  setSupportSelectedArticleId,
}: SupportWorkspacePanelsProps) {
  if (!activeSubService || activeService !== "Support Services") return null;

  if (activeSubService === "support-detail" && supportSelectedService) {
    const handleAttachmentAdd = (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      const newFiles = Array.from(fileList);
      setSupportAttachments((prev) => {
        const names = new Set(prev.map((f) => f.name));
        const deduped = newFiles.filter((f) => !names.has(f.name));
        return [...prev, ...deduped];
      });
    };

    const handleAttachmentRemove = (name: string) => {
      setSupportAttachments((prev) => prev.filter((f) => f.name !== name));
    };

    const detail = getSupportServiceDetail(supportSelectedService.id);
    return (
      <div className="p-6 space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          {supportSubmitMessage && (
            <div className="mb-3 px-3 py-2 rounded-md bg-green-50 text-green-700 border border-green-200 text-sm">
              {supportSubmitMessage}
            </div>
          )}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase text-gray-500 mb-1">{supportSelectedService.type}</p>
              <h2 className="text-2xl font-bold text-gray-900">{supportSelectedService.title}</h2>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-gray-700">
                {supportSelectedService.responseTime && <Badge variant="secondary">{supportSelectedService.responseTime}</Badge>}
                {supportSelectedService.deliveryModel && <Badge variant="secondary">{supportSelectedService.deliveryModel}</Badge>}
                {supportSelectedService.coverage && <Badge variant="secondary">{supportSelectedService.coverage}</Badge>}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <PriorityBadge priority={(supportSelectedService.slaLevel?.toLowerCase().includes("critical") ? "critical" : supportSelectedService.slaLevel?.toLowerCase().includes("high") ? "high" : "medium") as any} />
              <button className="btn-primary" onClick={createTicketFromService}>
                Submit Request
              </button>
              <p className="text-xs text-gray-600">Provided by Support Operations (24x7)</p>
            </div>
          </div>

          <p className="text-sm text-gray-700 mt-3">{supportSelectedService.description}</p>

          {detail && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">What's Included</h3>
                <ul className="text-sm text-gray-700 list-disc ml-4 space-y-1">
                  {detail.whatsIncluded?.slice(0, 6).map((i, idx) => <li key={idx}>{i}</li>)}
                </ul>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">Ideal For</h3>
                <ul className="text-sm text-gray-700 list-disc ml-4 space-y-1">
                  {detail.idealFor?.slice(0, 6).map((i, idx) => <li key={idx}>{i}</li>)}
                </ul>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4 text-sm text-gray-800">
            <div className="group relative rounded-lg p-4 bg-gradient-to-br from-orange-50 via-white to-white border border-orange-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-700">
                  <ShieldCheck size={16} />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wide text-orange-700 font-semibold">Office / Team</div>
                  <p className="font-semibold text-gray-900 leading-tight">Support Operations Center</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-gray-700">
                <span className="px-2 py-1 rounded-full bg-white border border-orange-100">Hours: 24x7</span>
                <span className="px-2 py-1 rounded-full bg-white border border-orange-100">TZ: UTC</span>
              </div>
              <p className="text-xs text-gray-600">Primary pod for incident coordination and advisory.</p>
            </div>

            <div className="group relative rounded-lg p-4 bg-gradient-to-br from-blue-50 via-white to-white border border-blue-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700">
                  <MessageCircle size={16} />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wide text-blue-700 font-semibold">Contact Channels</div>
                  <p className="font-semibold text-gray-900 leading-tight">Ticket, Chat, Bridge</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-700">
                <Phone size={12} />
                <span>Escalation: Duty Manager</span>
              </div>
              <p className="text-xs text-gray-600">Use chat for rapid triage; bridge opens a war room instantly.</p>
            </div>

            <div className="group relative rounded-lg p-4 bg-gradient-to-br from-amber-50 via-white to-white border border-amber-100 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-9 h-9 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700">
                  <Paperclip size={16} />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wide text-amber-700 font-semibold">Artifacts to attach</div>
                  <p className="text-xs text-gray-700">Logs, screenshots, environment details, and business impact.</p>
                </div>
              </div>
              <label className="flex items-center justify-center gap-2 text-sm font-semibold text-orange-700 cursor-pointer px-3 py-2 rounded-md border-2 border-dashed border-orange-200 bg-orange-50 hover:bg-orange-100 transition">
                <Paperclip size={16} />
                <input type="file" multiple className="hidden" onChange={(e) => handleAttachmentAdd(e.target.files)} />
                Attach files
              </label>
              {supportAttachments.length > 0 && (
                <ul className="space-y-1 text-xs text-gray-700">
                  {supportAttachments.map((file) => (
                    <li key={file.name} className="flex items-center justify-between gap-2 bg-orange-50 border border-orange-100 rounded px-2 py-1">
                      <span className="truncate">{file.name}</span>
                      <button className="text-orange-700 hover:underline" onClick={() => handleAttachmentRemove(file.name)}>
                        remove
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (
    ["support-overview", "support-tickets", "support-requests", "support-history", "support-team", "support-analytics"].includes(
      activeSubService,
    )
  ) {
    return (
      <SupportWorkspaceOperationalViews
        activeSubService={activeSubService}
        supportTicketsState={supportTicketsState}
        supportRequestsState={supportRequestsState}
      />
    );
  }

  if (activeSubService === "support-new-request") {
    return (
      <div className="p-6 space-y-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Submit New Support Request</h3>
            <p className="text-sm text-gray-600 mt-1">Create a support request for incidents, access, questions, and platform help.</p>
          </div>

          {newRequestError && (
            <div className="px-3 py-2 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">{newRequestError}</div>
          )}
          {newRequestSuccess && (
            <div className="px-3 py-2 rounded-md bg-green-50 border border-green-200 text-green-700 text-sm flex items-center justify-between gap-3">
              <span>{newRequestSuccess}</span>
              <button className="text-green-800 font-semibold hover:underline" onClick={() => setActiveSubService("support-tickets")}>
                Go to My Tickets
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm text-gray-700 space-y-1">
              <span className="font-semibold">Request Type</span>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={newRequestForm.requestType}
                onChange={(e) => setNewRequestForm((prev) => ({ ...prev, requestType: e.target.value as NewSupportRequestForm["requestType"] }))}
              >
                <option value="incident">Incident</option>
                <option value="service-request">Service Request</option>
                <option value="question">Question</option>
                <option value="problem">Problem</option>
                <option value="change-request">Change Request</option>
              </select>
            </label>

            <label className="text-sm text-gray-700 space-y-1">
              <span className="font-semibold">Category</span>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={newRequestForm.category}
                onChange={(e) => setNewRequestForm((prev) => ({ ...prev, category: e.target.value }))}
              >
                {supportCategoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="text-sm text-gray-700 space-y-1">
              <span className="font-semibold">Priority</span>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={newRequestForm.priority}
                onChange={(e) => setNewRequestForm((prev) => ({ ...prev, priority: e.target.value as NewSupportRequestForm["priority"] }))}
              >
                <option value="critical">P1 - Critical</option>
                <option value="high">P2 - High</option>
                <option value="medium">P3 - Medium</option>
                <option value="low">P4 - Low</option>
              </select>
            </label>

            <label className="text-sm text-gray-700 space-y-1">
              <span className="font-semibold">Urgency</span>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                value={newRequestForm.urgency}
                onChange={(e) => setNewRequestForm((prev) => ({ ...prev, urgency: e.target.value as NewSupportRequestForm["urgency"] }))}
              >
                <option value="blocking">Blocking my work</option>
                <option value="important">Important but I can wait</option>
                <option value="not-urgent">Not urgent</option>
              </select>
            </label>
          </div>

          <label className="block text-sm text-gray-700 space-y-1">
            <span className="font-semibold">Subject</span>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Describe the request in one line"
              value={newRequestForm.subject}
              onChange={(e) => setNewRequestForm((prev) => ({ ...prev, subject: e.target.value }))}
            />
          </label>

          <label className="block text-sm text-gray-700 space-y-1">
            <span className="font-semibold">Description</span>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-36 focus:outline-none focus:ring-2 focus:ring-orange-200"
              placeholder="Provide detailed context, observed behavior, and impact."
              value={newRequestForm.description}
              onChange={(e) => setNewRequestForm((prev) => ({ ...prev, description: e.target.value }))}
            />
          </label>

          <div className="space-y-2">
            <label className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 cursor-pointer">
              <Paperclip size={16} />
              <input type="file" multiple className="hidden" onChange={(e) => addNewRequestAttachments(e.target.files)} />
              Attach files
            </label>
            {newRequestAttachments.length > 0 && (
              <ul className="space-y-1 text-xs text-gray-700">
                {newRequestAttachments.map((file) => (
                  <li key={file.name} className="flex items-center justify-between gap-2 border border-gray-200 rounded-md px-2 py-1">
                    <span className="truncate">{file.name}</span>
                    <button className="text-orange-700 hover:underline" onClick={() => removeNewRequestAttachment(file.name)}>
                      remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button className="btn-primary" onClick={submitNewSupportRequest}>
              Submit Request
            </button>
            <button
              className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => {
                setNewRequestForm({
                  requestType: "incident",
                  category: "Platform/Account",
                  priority: "high",
                  subject: "",
                  description: "",
                  urgency: "important",
                });
                setNewRequestAttachments([]);
                setNewRequestError(null);
              }}
            >
              Clear Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeSubService === "support-knowledge") {
    return (
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {knowledgeArticles.slice(0, 12).map((article) => (
          <button
            key={article.id}
            onClick={() => {
              setSupportSelectedArticleId(article.id);
              setActiveSubService("support-knowledge-detail");
            }}
            className="bg-white border border-gray-200 rounded-lg p-4 text-left hover:border-orange-200 hover:bg-orange-50/40 transition-colors"
          >
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Badge variant="secondary">{article.category}</Badge>
              <span>{article.difficulty}</span>
              <span>•</span>
              <span>{article.estimatedReadTime}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mt-2">{article.title}</h3>
            <p className="text-sm text-gray-700 mt-1 line-clamp-3">{article.summary}</p>
            <p className="text-xs text-gray-500 mt-2">{article.views.toLocaleString()} views</p>
          </button>
        ))}
      </div>
    );
  }

  if (activeSubService === "support-knowledge-detail" && supportSelectedArticleId) {
    const article = knowledgeArticles.find((a) => a.id === supportSelectedArticleId);
    if (!article) return null;
    const detailContent = buildKnowledgeDetailContent(article);
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3">
          <button
            className="text-sm text-orange-700 font-semibold hover:underline"
            onClick={() => {
              setActiveSubService("support-knowledge");
              setSupportSelectedArticleId(null);
            }}
          >
            ← Back to Knowledge Base
          </button>
          <Badge variant="secondary">{article.category}</Badge>
          <span className="text-xs text-gray-600 capitalize">{article.difficulty}</span>
          <span className="text-xs text-gray-600">{article.estimatedReadTime}</span>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-2">
          <h2 className="text-xl font-bold text-gray-900">{article.title}</h2>
          <p className="text-[13px] text-gray-700">{article.summary}</p>
          <div className="flex gap-4 text-xs text-gray-600">
            <span className="inline-flex items-center gap-1"><Calendar size={14} /> Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
            <span className="inline-flex items-center gap-1"><ClockIcon size={14} /> {article.estimatedReadTime}</span>
            <span className="inline-flex items-center gap-1"><Eye size={14} /> {article.views.toLocaleString()} views</span>
            <span className="inline-flex items-center gap-1"><CheckCircle size={14} /> {article.helpfulPercentage}% found this helpful</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {article.tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
                <Tag size={12} /> {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Step-by-step actions</h3>
            <ul className="list-disc ml-5 mt-2 text-[13px] text-gray-700 space-y-1">
              {detailContent.stepByStepActions.map((step, idx) => (
                <li key={`${article.id}-step-${idx}`}>{step}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Key takeaways</h3>
            <ul className="list-disc ml-5 mt-2 text-[13px] text-gray-700 space-y-1">
              {detailContent.keyTakeaways.map((point, idx) => (
                <li key={`${article.id}-takeaway-${idx}`}>{point}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Full guidance</h3>
            <p className="text-[13px] text-gray-700 mt-2">{detailContent.fullGuidance}</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Why this matters</h3>
            <p className="text-[13px] text-gray-700 mt-1">{detailContent.whyThisMatters}</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Signals to watch</h3>
            <p className="text-[13px] text-gray-700 mt-1">{detailContent.signalsToWatch}</p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">If issues persist</h3>
            <p className="text-[13px] text-gray-700 mt-1">{detailContent.ifIssuesPersist}</p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
