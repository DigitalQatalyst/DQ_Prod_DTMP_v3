import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Paperclip } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ServiceRequest, SupportTicket } from "@/data/supportData";

type RequestType = "incident" | "service-request" | "question" | "problem" | "change-request";
type RequestPriority = "critical" | "high" | "medium" | "low";
type RequestUrgency = "blocking" | "important" | "not-urgent";

interface RequestFormState {
  requestType: RequestType;
  category: string;
  priority: RequestPriority;
  subject: string;
  description: string;
  urgency: RequestUrgency;
}

interface RequestContext {
  marketplace: string;
  tab: string;
  cardId: string;
  serviceName: string;
  action: string;
}

const supportCategoryOptions = [
  "Portfolio Management",
  "Learning Center",
  "Knowledge Center",
  "Digital Intelligence",
  "Solutions Specifications",
  "Solutions Build",
  "Lifecycle Management",
  "Platform/Account",
  "Other",
];

const createDefaultForm = (serviceName: string): RequestFormState => ({
  requestType: "incident",
  category: "Platform/Account",
  priority: "high",
  subject: serviceName,
  description: "",
  urgency: "important",
});

export default function SupportNewRequestPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const rawState = (location.state || {}) as Partial<RequestContext>;
  const requestContext: RequestContext = {
    marketplace: rawState.marketplace || "support-services",
    tab: rawState.tab || "technical-support",
    cardId: rawState.cardId || "",
    serviceName: (rawState.serviceName || "").trim(),
    action: rawState.action || "request-service",
  };
  const requestedServiceName = requestContext.serviceName;

  const [form, setForm] = useState<RequestFormState>(() => createDefaultForm(requestedServiceName));
  const [attachments, setAttachments] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);

  const backToSupport = () => {
    if (requestContext.cardId) {
      navigate(`/marketplaces/support-services/${requestContext.tab}/${requestContext.cardId}`);
      return;
    }
    navigate("/marketplaces/support-services");
  };

  const addAttachments = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList);
    setAttachments((prev) => {
      const seen = new Set(prev.map((item) => `${item.name}:${item.size}`));
      const deduped = incoming.filter((item) => !seen.has(`${item.name}:${item.size}`));
      return [...prev, ...deduped];
    });
  };

  const removeAttachment = (name: string) => {
    setAttachments((prev) => prev.filter((file) => file.name !== name));
  };

  const submitRequest = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = form.subject.trim();
    const description = form.description.trim();

    if (subject.length < 10) {
      setError("Subject must be at least 10 characters.");
      return;
    }
    if (description.length < 50) {
      setError("Description must be at least 50 characters.");
      return;
    }

    setError(null);
    const now = new Date();
    const ticketId = `TICKET-${now.getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
    const requestId = `REQ-${now.getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;

    const slaByPriority: Record<RequestPriority, { responseHours: number; resolutionHours: number }> = {
      critical: { responseHours: 4, resolutionHours: 24 },
      high: { responseHours: 24, resolutionHours: 72 },
      medium: { responseHours: 48, resolutionHours: 120 },
      low: { responseHours: 72, resolutionHours: 240 },
    };
    const slaTarget = slaByPriority[form.priority];
    const responseDeadline = new Date(now.getTime() + slaTarget.responseHours * 60 * 60 * 1000).toISOString();
    const resolutionDeadline = new Date(now.getTime() + slaTarget.resolutionHours * 60 * 60 * 1000).toISOString();
    const timeRemainingMinutes = Math.max(Math.floor((new Date(resolutionDeadline).getTime() - now.getTime()) / 60000), 0);

    const createdTicket: SupportTicket = {
      id: ticketId,
      subject,
      description,
      priority: form.priority,
      status: "new",
      category: form.category,
      subcategory: form.requestType,
      requester: {
        id: "user-current",
        name: "John Doe",
        email: "john.doe@company.com",
        department: "Support Services",
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      sla: {
        responseTimeHours: slaTarget.responseHours,
        resolutionTimeHours: slaTarget.resolutionHours,
        responseDeadline,
        resolutionDeadline,
        responseBreached: false,
        resolutionBreached: false,
        timeRemainingMinutes,
      },
      conversation: [
        {
          id: `c-${ticketId}-1`,
          author: { id: "user-current", name: "John Doe", role: "user", avatar: "JD" },
          content: description,
          timestamp: now.toISOString(),
          type: "comment",
        },
      ],
      attachments: attachments.map((file) => ({
        id: `att-${ticketId}-${file.name}`,
        filename: file.name,
        fileSize: `${Math.max(file.size / 1024, 1).toFixed(0)} KB`,
        fileType: file.type || "file",
        uploadedBy: "John Doe",
        uploadedAt: now.toISOString(),
        downloadUrl: "#",
      })),
      relatedKBArticles: [],
    };

    const requestTypeMap: Record<RequestType, ServiceRequest["type"]> = {
      incident: "other",
      "service-request": "change",
      question: "other",
      problem: "other",
      "change-request": "change",
    };

    const createdRequest: ServiceRequest = {
      id: requestId,
      type: requestTypeMap[form.requestType],
      title: subject,
      description,
      justification: `Submitted as ${form.requestType}; urgency: ${form.urgency}`,
      status: "pending-approval",
      requester: {
        id: "user-current",
        name: "John Doe",
        email: "john.doe@company.com",
        department: "Support Services",
        manager: "Support Manager",
      },
      approvalWorkflow: [],
      requestedItems: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      activityLog: [
        {
          id: `log-${ticketId}-1`,
          timestamp: now.toISOString(),
          actor: "John Doe",
          action: "Request Submitted",
        },
      ],
    };

    navigate("/stage2", {
      state: {
        marketplace: "support-services",
        tab: "support-tickets",
        serviceName: requestContext.serviceName || "Support Services",
        submittedTicket: createdTicket,
        submittedRequest: createdRequest,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1" id="main-content">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <button
            type="button"
            onClick={backToSupport}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={16} />
            Back to Support Services
          </button>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Submit Request</h1>
            </div>

            {error && (
              <div className="mb-4 px-3 py-2 rounded-md bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={submitRequest}>
              <label className="block text-sm text-gray-700 space-y-1">
                <span className="font-semibold">Service Requested</span>
                <input
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-700"
                  value={requestedServiceName || "General Support Request"}
                  readOnly
                />
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-sm text-gray-700 space-y-1">
                  <span className="font-semibold">Request Type</span>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                    value={form.requestType}
                    onChange={(e) => setForm((prev) => ({ ...prev, requestType: e.target.value as RequestType }))}
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
                    value={form.category}
                    onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
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
                    value={form.priority}
                    onChange={(e) => setForm((prev) => ({ ...prev, priority: e.target.value as RequestPriority }))}
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
                    value={form.urgency}
                    onChange={(e) => setForm((prev) => ({ ...prev, urgency: e.target.value as RequestUrgency }))}
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
                  value={form.subject}
                  onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                />
              </label>

              <label className="block text-sm text-gray-700 space-y-1">
                <span className="font-semibold">Description</span>
                <textarea
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-36 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  placeholder="Provide detailed context, observed behavior, and impact."
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                />
              </label>

              <div className="space-y-2">
                <label className="inline-flex items-center gap-2 text-sm font-semibold text-orange-700 cursor-pointer">
                  <Paperclip size={16} />
                  <input type="file" multiple className="hidden" onChange={(e) => addAttachments(e.target.files)} />
                  Attach files
                </label>
                {attachments.length > 0 && (
                  <ul className="space-y-1 text-xs text-gray-700">
                    {attachments.map((file) => (
                      <li key={`${file.name}-${file.size}`} className="flex items-center justify-between gap-2 border border-gray-200 rounded-md px-2 py-1">
                        <span className="truncate">{file.name}</span>
                        <button type="button" className="text-orange-700 hover:underline" onClick={() => removeAttachment(file.name)}>
                          remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" className="btn-primary">
                  Submit Request
                </button>
                <button
                  type="button"
                  className="px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={() => {
                    setForm(createDefaultForm(requestedServiceName));
                    setAttachments([]);
                    setError(null);
                  }}
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
