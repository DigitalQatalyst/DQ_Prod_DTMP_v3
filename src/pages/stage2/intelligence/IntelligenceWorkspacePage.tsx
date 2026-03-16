import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OverviewTab, MyRequestsTab } from "@/components/digitalIntelligence/stage2/DIRequestsHub";
import {
  dashboardRequests,
  addDashboardRequest,
} from "@/data/digitalIntelligence/stage2";
import type { DashboardUpdateRequest } from "@/data/digitalIntelligence/stage2";
import { createStage3Request } from "@/data/stage3";
import { intelligenceServices } from "@/data/digitalIntelligence/stage2";
import ServiceDashboardPage from "./ServiceDashboardPage";

interface IntelligenceWorkspacePageProps {
  activeSubService: string | null;
}

export default function IntelligenceWorkspacePage({
  activeSubService,
}: IntelligenceWorkspacePageProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const processedTokenRef = useRef<string | null>(null);
  const [requests, setRequests] = useState<DashboardUpdateRequest[]>(() => [...dashboardRequests]);
  const [focusRequestId, setFocusRequestId] = useState<string | null>(null);

  useEffect(() => {
    setRequests([...dashboardRequests]);
  }, []);

  useEffect(() => {
    const onFocus = () => setRequests([...dashboardRequests]);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    const state = (location.state || {}) as {
      marketplace?: string;
      action?: string;
      formData?: Record<string, string>;
      dashboardName?: string;
      serviceName?: string;
      cardId?: string;
      requestDescription?: string;
      actorEmail?: string;
    };

    if (state.marketplace !== "digital-intelligence" || !state.formData) return;

    const action = (state.action || "").trim();
    if (!action || action === "View Analytics") return;

    const token = `${action}:${JSON.stringify(state.formData)}:${state.dashboardName || state.serviceName || ""}`;
    if (processedTokenRef.current === token) return;
    processedTokenRef.current = token;

    const actionToRequestType: Record<string, DashboardUpdateRequest["requestType"]> = {
      "schedule-report": "schedule-report",
      "set-alert": "set-alert",
      "share-dashboard": "share-dashboard",
      "request-audit": "request-audit",
      "request-api": "request-api",
      "add-visualization": "add-visualization",
      "modify-chart": "modify-chart",
      "fix-data": "fix-data",
      "new-data-source": "new-data-source",
      "change-layout": "change-layout",
      "request-update": "modify-chart",
      "request-datasource": "new-data-source",
    };

    const requestType = actionToRequestType[action] || "modify-chart";
    const requestPriority = state.formData.priority;
    const priority: DashboardUpdateRequest["priority"] =
      requestPriority === "low" ||
      requestPriority === "medium" ||
      requestPriority === "high" ||
      requestPriority === "urgent"
        ? requestPriority
        : "medium";
    const dashboardName =
      state.dashboardName?.trim() ||
      state.serviceName?.trim() ||
      "Digital Intelligence Dashboard";
    const formData = state.formData || {};
    const descriptionCandidates = [
      formData.description,
      formData.improvement,
      formData.reason,
      formData.useCase,
      formData.justification,
      formData.message,
    ];

    const descriptionFromPreferredFields = descriptionCandidates
      .map((value) => value?.trim())
      .find((value): value is string => Boolean(value && value.length > 0));

    const excludedFallbackKeys = new Set([
      "email",
      "priority",
      "frequency",
      "direction",
      "accessLevel",
      "volume",
      "threshold",
      "dateRange",
      "metric",
      "sourceName",
      "connectionType",
      "name",
      "role",
    ]);

    const descriptionFromAnyMeaningfulField = Object.entries(formData)
      .filter(([key, value]) => !excludedFallbackKeys.has(key) && typeof value === "string")
      .map(([, value]) => value.trim())
      .find((value) => value.length > 0);

    const description =
      state.requestDescription?.trim() ||
      descriptionFromPreferredFields ||
      descriptionFromAnyMeaningfulField ||
      `Request submitted for ${dashboardName}.`;

    const requesterName = state.formData.name || "John Doe";
    const requesterEmail = state.actorEmail || state.formData.email || "user@company.com";
    const requesterRole = state.formData.role || "Business User";

    const serviceId =
      state.cardId ||
      intelligenceServices.find(
        (s) => s.title.toLowerCase() === dashboardName.toLowerCase(),
      )?.id ||
      dashboardName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const year = new Date().getFullYear();
    const nextOrdinal = dashboardRequests.length + 1;
    const id = `REQ-INT-${year}-${String(nextOrdinal).padStart(3, "0")}`;

    const newRequest: DashboardUpdateRequest = {
      id,
      dashboardId: serviceId,
      dashboardName,
      requestType,
      priority,
      description,
      submittedFormData: { ...formData },
      requestedBy: {
        id: "user-session",
        name: requesterName,
        email: requesterEmail,
        role: requesterRole,
      },
      status: "submitted",
      submittedDate: new Date().toISOString(),
      messages: [],
      notifyEmail: true,
      notifyInApp: true,
    };

    addDashboardRequest(newRequest);
    setRequests([...dashboardRequests]);
    setFocusRequestId(id);

    const actionLabels: Record<string, string> = {
      "schedule-report": "Schedule Email Report",
      "set-alert": "Set Threshold Alert",
      "share-dashboard": "Share with Team",
      "request-audit": "Request Data Audit",
      "request-api": "Request API Access",
      "request-update": "Request Dashboard Update",
      "request-datasource": "Request Data Source",
      "modify-chart": "Chart Modification",
      "add-visualization": "New Visualization",
      "fix-data": "Data Fix",
      "new-data-source": "New Data Source",
      "change-layout": "Layout Change",
    };

    const stage3Priority: "low" | "medium" | "high" | "critical" =
      priority === "urgent" ? "critical" : priority;

    const stage3EstimatedHours: Record<string, number> = {
      "schedule-report": 2,
      "set-alert": 3,
      "share-dashboard": 1,
      "request-audit": 16,
      "request-api": 8,
      "request-update": 6,
      "request-datasource": 12,
      "modify-chart": 6,
      "add-visualization": 8,
      "fix-data": 4,
      "new-data-source": 12,
      "change-layout": 4,
    };

    createStage3Request({
      type: "digital-intelligence",
      title: `Digital Intelligence — ${dashboardName}`,
      description: `${actionLabels[action] || action} — ${description}`,
      requester: {
        name: requesterName,
        email: requesterEmail,
        department: requesterRole,
        organization: "DTMP",
      },
      priority: stage3Priority,
      estimatedHours: stage3EstimatedHours[action] || 4,
      tags: [
        "digital-intelligence",
        action,
        dashboardName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        `service-id:${serviceId}`,
      ],
      relatedAssets: [
        `di-request:${id}`,
        `di-dashboard:${serviceId}`,
      ],
      notes: [`Auto-created from Digital Intelligence marketplace form submission (${actionLabels[action] || action}).`],
    });

    const { formData: _f, action: _a, ...rest } = state;
    navigate(location.pathname, { replace: true, state: rest });
  }, [location.pathname, location.state, navigate]);

  if (!activeSubService || activeSubService === "di-overview") {
    return (
      <div className="h-full overflow-y-auto p-6">
        <OverviewTab
          requests={requests}
          onOpenRequest={(requestId) => {
            setFocusRequestId(requestId);
            navigate("/stage2/intelligence/requests", {
              replace: true,
              state: {
                ...(location.state || {}),
                marketplace: "digital-intelligence",
              },
            });
          }}
        />
      </div>
    );
  }

  if (activeSubService === "di-my-requests") {
    return (
      <div className="h-full overflow-y-auto p-6">
        <MyRequestsTab
          requests={requests}
          focusRequestId={focusRequestId}
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      <ServiceDashboardPage serviceId={activeSubService} />
    </div>
  );
}
