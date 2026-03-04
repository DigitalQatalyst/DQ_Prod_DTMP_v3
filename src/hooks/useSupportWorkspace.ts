import { useState } from "react";
import {
  knowledgeArticles,
  serviceRequests,
  supportTickets,
  type ServiceRequest,
  type SupportTicket,
} from "@/data/supportData";
import { expertConsultancy, technicalSupport } from "@/data/supportServices";
import type { NewSupportRequestForm } from "@/pages/stage2/support/supportWorkspaceConfig";

interface UseSupportWorkspaceParams {
  marketplace: string;
  cardId: string;
  submittedTicket?: SupportTicket;
  submittedRequest?: ServiceRequest;
  onNavigateToTickets: () => void;
}

export function useSupportWorkspace({
  marketplace,
  cardId,
  submittedTicket,
  submittedRequest,
  onNavigateToTickets,
}: UseSupportWorkspaceParams) {
  const [supportSelectedService, setSupportSelectedService] = useState(() => {
    if (marketplace === "support-services" && cardId) {
      return (
        technicalSupport.find((s) => s.id === cardId) ||
        expertConsultancy.find((s) => s.id === cardId) ||
        null
      );
    }
    return null;
  });
  const [supportAttachments, setSupportAttachments] = useState<File[]>([]);
  const [supportSelectedArticleId, setSupportSelectedArticleId] = useState<string | null>(null);
  const [supportTicketsState, setSupportTicketsState] = useState<SupportTicket[]>(() => {
    if (submittedTicket) {
      return [submittedTicket, ...supportTickets];
    }
    return supportTickets;
  });
  const [supportSubmitMessage, setSupportSubmitMessage] = useState<string | null>(null);
  const [supportRequestsState, setSupportRequestsState] = useState<ServiceRequest[]>(() => {
    const seeded = technicalSupport.slice(0, 8).map((svc, idx) => ({
      id: `REQ-SVC-${String(idx + 1).padStart(3, "0")}`,
      type: "change" as const,
      title: svc.title,
      description: svc.description,
      justification: `Requesting engagement for ${svc.title}`,
      status: idx % 3 === 0 ? "pending-approval" : idx % 3 === 1 ? "in-progress" : "completed",
      requester: {
        id: "user-seeded",
        name: "Support User",
        email: "support.user@example.com",
        department: "IT Operations",
        manager: "Duty Manager",
      },
      approvalWorkflow: [],
      requestedItems: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      activityLog: [],
    }));
    if (submittedRequest) {
      return [submittedRequest, ...seeded, ...serviceRequests];
    }
    return [...seeded, ...serviceRequests];
  });
  const [newRequestForm, setNewRequestForm] = useState<NewSupportRequestForm>({
    requestType: "incident",
    category: "Platform/Account",
    priority: "high",
    subject: "",
    description: "",
    urgency: "important",
  });
  const [newRequestAttachments, setNewRequestAttachments] = useState<File[]>([]);
  const [newRequestError, setNewRequestError] = useState<string | null>(null);
  const [newRequestSuccess, setNewRequestSuccess] = useState<string | null>(null);

  const createTicketFromService = () => {
    if (!supportSelectedService) return;
    const now = new Date();
    const id = `TICKET-${now.getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
    const resolutionDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
    const minutesRemaining = Math.max(
      Math.floor((new Date(resolutionDeadline).getTime() - now.getTime()) / 60000),
      0,
    );
    const priority = supportSelectedService.slaLevel?.toLowerCase().includes("critical")
      ? "critical"
      : supportSelectedService.slaLevel?.toLowerCase().includes("high")
        ? "high"
        : "medium";
    const newTicket: SupportTicket = {
      id,
      subject: supportSelectedService.title,
      description: supportSelectedService.description,
      priority,
      status: "new",
      category: supportSelectedService.type || "Support",
      subcategory: supportSelectedService.title,
      requester: {
        id: "user-current",
        name: "You",
        email: "you@example.com",
        department: "N/A",
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      sla: {
        responseTimeHours: 4,
        resolutionTimeHours: 24,
        responseDeadline: new Date(now.getTime() + 4 * 60 * 60 * 1000).toISOString(),
        resolutionDeadline,
        responseBreached: false,
        resolutionBreached: false,
        timeRemainingMinutes: minutesRemaining,
      },
      conversation: [],
      attachments: supportAttachments.map((file) => ({
        id: `att-${file.name}`,
        filename: file.name,
        fileSize: `${Math.max(file.size / 1024, 1).toFixed(0)} KB`,
        fileType: file.type || "file",
        uploadedBy: "You",
        uploadedAt: now.toISOString(),
        downloadUrl: "#",
      })),
      relatedKBArticles: [],
    };
    setSupportTicketsState((prev) => [newTicket, ...prev]);
    const newRequest: ServiceRequest = {
      id: `REQ-${now.getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`,
      type: "change",
      title: supportSelectedService.title,
      description: supportSelectedService.description,
      justification: `Submitted from ${supportSelectedService.title} service`,
      status: "pending-approval",
      requester: {
        id: "user-current",
        name: "You",
        email: "you@example.com",
        department: "N/A",
        manager: "N/A",
      },
      approvalWorkflow: [],
      requestedItems: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      activityLog: [],
    };
    setSupportRequestsState((prev) => [newRequest, ...prev]);
    setSupportSubmitMessage("Request submitted and added to My Tickets.");
    setSupportAttachments([]);
    onNavigateToTickets();
  };

  const addNewRequestAttachments = (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const incoming = Array.from(fileList);
    setNewRequestAttachments((prev) => {
      const seen = new Set(prev.map((f) => f.name));
      const deduped = incoming.filter((f) => !seen.has(f.name));
      return [...prev, ...deduped];
    });
  };

  const removeNewRequestAttachment = (name: string) => {
    setNewRequestAttachments((prev) => prev.filter((f) => f.name !== name));
  };

  const submitNewSupportRequest = () => {
    const subject = newRequestForm.subject.trim();
    const description = newRequestForm.description.trim();

    if (subject.length < 10) {
      setNewRequestError("Subject must be at least 10 characters.");
      return;
    }
    if (description.length < 50) {
      setNewRequestError("Description must be at least 50 characters.");
      return;
    }

    setNewRequestError(null);
    const now = new Date();
    const ticketId = `TICKET-${now.getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`;
    const slaByPriority: Record<
      NewSupportRequestForm["priority"],
      { responseHours: number; resolutionHours: number }
    > = {
      critical: { responseHours: 4, resolutionHours: 24 },
      high: { responseHours: 24, resolutionHours: 72 },
      medium: { responseHours: 48, resolutionHours: 120 },
      low: { responseHours: 72, resolutionHours: 240 },
    };
    const slaTarget = slaByPriority[newRequestForm.priority];
    const responseDeadline = new Date(
      now.getTime() + slaTarget.responseHours * 60 * 60 * 1000,
    ).toISOString();
    const resolutionDeadline = new Date(
      now.getTime() + slaTarget.resolutionHours * 60 * 60 * 1000,
    ).toISOString();
    const timeRemainingMinutes = Math.max(
      Math.floor((new Date(resolutionDeadline).getTime() - now.getTime()) / 60000),
      0,
    );

    const newTicket: SupportTicket = {
      id: ticketId,
      subject,
      description,
      priority: newRequestForm.priority,
      status: "new",
      category: newRequestForm.category,
      subcategory: newRequestForm.requestType,
      requester: {
        id: "user-current",
        name: "You",
        email: "you@example.com",
        department: "N/A",
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
          author: { id: "user-current", name: "You", role: "user", avatar: "YO" },
          content: description,
          timestamp: now.toISOString(),
          type: "comment",
        },
      ],
      attachments: newRequestAttachments.map((file) => ({
        id: `att-${ticketId}-${file.name}`,
        filename: file.name,
        fileSize: `${Math.max(file.size / 1024, 1).toFixed(0)} KB`,
        fileType: file.type || "file",
        uploadedBy: "You",
        uploadedAt: now.toISOString(),
        downloadUrl: "#",
      })),
      relatedKBArticles: [],
    };
    setSupportTicketsState((prev) => [newTicket, ...prev]);

    const requestTypeMap: Record<NewSupportRequestForm["requestType"], ServiceRequest["type"]> = {
      incident: "other",
      "service-request": "change",
      question: "other",
      problem: "other",
      "change-request": "change",
    };

    const newRequest: ServiceRequest = {
      id: `REQ-${now.getFullYear()}-${Math.floor(Math.random() * 90000 + 10000)}`,
      type: requestTypeMap[newRequestForm.requestType],
      title: subject,
      description,
      justification: `Submitted as ${newRequestForm.requestType}; urgency: ${newRequestForm.urgency}`,
      status: "pending-approval",
      requester: {
        id: "user-current",
        name: "You",
        email: "you@example.com",
        department: "N/A",
        manager: "N/A",
      },
      approvalWorkflow: [],
      requestedItems: [],
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      activityLog: [
        {
          id: `log-${ticketId}-1`,
          timestamp: now.toISOString(),
          actor: "You",
          action: "Request Submitted",
        },
      ],
    };
    setSupportRequestsState((prev) => [newRequest, ...prev]);

    setNewRequestSuccess(`Request ${ticketId} was submitted and added to My Tickets.`);
    setNewRequestForm({
      requestType: "incident",
      category: "Platform/Account",
      priority: "high",
      subject: "",
      description: "",
      urgency: "important",
    });
    setNewRequestAttachments([]);
  };

  return {
    knowledgeArticles,
    supportSelectedService,
    setSupportSelectedService,
    supportAttachments,
    setSupportAttachments,
    supportSelectedArticleId,
    setSupportSelectedArticleId,
    supportTicketsState,
    setSupportTicketsState,
    supportSubmitMessage,
    setSupportSubmitMessage,
    supportRequestsState,
    setSupportRequestsState,
    newRequestForm,
    setNewRequestForm,
    newRequestAttachments,
    setNewRequestAttachments,
    newRequestError,
    setNewRequestError,
    newRequestSuccess,
    setNewRequestSuccess,
    createTicketFromService,
    addNewRequestAttachments,
    removeNewRequestAttachment,
    submitNewSupportRequest,
  };
}
