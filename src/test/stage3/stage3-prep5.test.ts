import { beforeEach, describe, expect, it } from "vitest";
import { stage3Requests } from "@/data/stage3/requests";
import {
  createSupportStage3Intake,
  createSolutionSpecStage3Intake,
  createSolutionBuildStage3Intake,
  createTemplateStage3Intake,
  createDIStage3Intake,
} from "@/data/stage3/intake";
import { syncMarketplaceRequestStatusFromStage3 } from "@/data/stage3/marketplaceSync";
import { getSupportTORequests } from "@/data/supportServices/requestState";
import { getBlueprintTORequests } from "@/data/blueprints/requestState";
import { getTemplateTORequests } from "@/data/templates/requestState";
import { getDITORequests } from "@/data/digitalIntelligence/requestState";
import { serviceRequests, supportTickets } from "@/data/supportData";
import {
  getSupportRequestsWithStored,
  getSupportTicketsWithStored,
  upsertStoredSupportRequest,
  upsertStoredSupportTicket,
} from "@/data/supportServices/userSupportState";

beforeEach(() => {
  window.localStorage.clear();
  stage3Requests.length = 0;
});

// ─── Support Services ──────────────────────────────────────────────────────────

describe("createSupportStage3Intake", () => {
  const base = {
    serviceId: "svc-tech-001",
    serviceName: "Technical Support",
    requesterName: "Alice Ops",
    requesterEmail: "alice@dtmp.local",
    requesterRole: "IT Analyst",
    type: "incident" as const,
    priority: "high" as const,
    subject: "Production login failure",
    description: "Users unable to log into the platform since this morning.",
    category: "Platform/Account",
  };

  it("returns both marketplace request and stage3 request", () => {
    const result = createSupportStage3Intake(base);
    expect(result).not.toBeNull();
    expect(result!.request).toBeTruthy();
    expect(result!.stage3).toBeTruthy();
  });

  it("persists the support TO request to localStorage", () => {
    createSupportStage3Intake(base);
    const stored = getSupportTORequests("Alice Ops");
    expect(stored).toHaveLength(1);
    expect(stored[0].serviceId).toBe("svc-tech-001");
    expect(stored[0].type).toBe("incident");
    expect(stored[0].status).toBe("Open");
  });

  it("links the support request to the stage3 request id", () => {
    const result = createSupportStage3Intake(base)!;
    const stored = getSupportTORequests("Alice Ops");
    expect(stored[0].stage3RequestId).toBe(result.stage3.id);
  });

  it("stores linked Stage 2 ticket/request ids when provided", () => {
    createSupportStage3Intake({
      ...base,
      supportTicketId: "TICKET-2026-90123",
      supportServiceRequestId: "REQ-2026-90123",
    });
    const stored = getSupportTORequests("Alice Ops");
    expect(stored[0].supportTicketId).toBe("TICKET-2026-90123");
    expect(stored[0].supportServiceRequestId).toBe("REQ-2026-90123");
  });

  it("adds the stage3 request to the in-memory array", () => {
    createSupportStage3Intake(base);
    expect(stage3Requests).toHaveLength(1);
    expect(stage3Requests[0].type).toBe("support-services");
  });

  it("includes the support-request asset link in stage3 relatedAssets", () => {
    const result = createSupportStage3Intake(base)!;
    expect(result.stage3.relatedAssets).toContain(`support-request:${result.request!.id}`);
  });

  it("maps critical priority to stage3 critical priority", () => {
    const result = createSupportStage3Intake({ ...base, priority: "critical" })!;
    expect(result.stage3.priority).toBe("critical");
  });

  it("maps low priority to stage3 low priority", () => {
    const result = createSupportStage3Intake({ ...base, priority: "low" })!;
    expect(result.stage3.priority).toBe("low");
  });

  it("assigns 2 estimated hours for critical priority", () => {
    const result = createSupportStage3Intake({ ...base, priority: "critical" })!;
    expect(result.stage3.estimatedHours).toBe(2);
  });

  it("assigns 4 estimated hours for high priority", () => {
    const result = createSupportStage3Intake(base)!;
    expect(result.stage3.estimatedHours).toBe(4);
  });

  it("assigns 8 estimated hours for medium/low priority", () => {
    const result = createSupportStage3Intake({ ...base, priority: "medium" })!;
    expect(result.stage3.estimatedHours).toBe(8);
  });

  it("returns null when subject is empty", () => {
    expect(createSupportStage3Intake({ ...base, subject: "   " })).toBeNull();
  });

  it("returns null when description is empty", () => {
    expect(createSupportStage3Intake({ ...base, description: "" })).toBeNull();
  });

  it("does not create stage3 request for empty subject", () => {
    createSupportStage3Intake({ ...base, subject: "" });
    expect(stage3Requests).toHaveLength(0);
  });
});

// ─── Support Services sync ─────────────────────────────────────────────────────

describe("syncMarketplaceRequestStatusFromStage3 — support-services", () => {
  const base = {
    serviceId: "svc-002",
    serviceName: "Expert Consultancy",
    requesterName: "Bob Analyst",
    requesterEmail: "bob@dtmp.local",
    requesterRole: "Business Analyst",
    type: "service-request" as const,
    priority: "medium" as const,
    subject: "Need architecture review",
    description: "Requesting an expert architecture review for our new platform.",
    category: "Solutions Specifications",
  };

  it("syncs to In Review when stage3 status is in-progress", () => {
    const { stage3 } = createSupportStage3Intake(base)!;
    stage3.status = "in-progress";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getSupportTORequests("Bob Analyst")[0].status).toBe("In Review");
  });

  it("syncs to Resolved when stage3 status is completed", () => {
    const { stage3 } = createSupportStage3Intake(base)!;
    stage3.status = "completed";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getSupportTORequests("Bob Analyst")[0].status).toBe("Resolved");
  });

  it("syncs to Open when stage3 status is on-hold", () => {
    const { stage3 } = createSupportStage3Intake(base)!;
    stage3.status = "assigned";
    syncMarketplaceRequestStatusFromStage3(stage3);
    stage3.status = "on-hold";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getSupportTORequests("Bob Analyst")[0].status).toBe("Open");
  });

  it("syncs linked Stage 2 ticket assignee and status from Stage 3", () => {
    const syncedTicketId = "TICKET-2026-99031";
    const syncedRequestId = "REQ-2026-99031";

    upsertStoredSupportTicket({
      ...supportTickets[0],
      id: syncedTicketId,
      status: "new",
      assignee: undefined,
    });
    upsertStoredSupportRequest({
      ...serviceRequests[0],
      id: syncedRequestId,
      status: "pending-approval",
    });

    const { stage3 } = createSupportStage3Intake({
      ...base,
      requesterName: "Bob Analyst",
      supportTicketId: syncedTicketId,
      supportServiceRequestId: syncedRequestId,
    })!;

    stage3.status = "in-progress";
    stage3.assignedTo = "Sarah Miller";
    stage3.assignedTeam = "Support Operations";
    syncMarketplaceRequestStatusFromStage3(stage3);

    const activeTicket = getSupportTicketsWithStored().find((ticket) => ticket.id === syncedTicketId);
    const activeRequest = getSupportRequestsWithStored().find((request) => request.id === syncedRequestId);

    expect(activeTicket?.status).toBe("in-progress");
    expect(activeTicket?.assignee?.name).toBe("Sarah Miller");
    expect(activeTicket?.assignee?.team).toBe("Support Operations");
    expect(activeRequest?.status).toBe("in-progress");

    stage3.status = "completed";
    syncMarketplaceRequestStatusFromStage3(stage3);

    const completedTicket = getSupportTicketsWithStored().find((ticket) => ticket.id === syncedTicketId);
    const completedRequest = getSupportRequestsWithStored().find((request) => request.id === syncedRequestId);

    expect(completedTicket?.status).toBe("resolved");
    expect(completedRequest?.status).toBe("completed");
  });

  it("syncs Stage 2 service request status for legacy links without stored ids", () => {
    const legacyTitle = "Need architecture review";
    const legacyDescription =
      "Requesting an expert architecture review for our new platform.";
    const legacyRequestId = "REQ-2026-99055";

    upsertStoredSupportRequest({
      ...serviceRequests[0],
      id: legacyRequestId,
      title: legacyTitle,
      description: legacyDescription,
      status: "in-progress",
    });

    const { stage3 } = createSupportStage3Intake({
      ...base,
      subject: legacyTitle,
      description: legacyDescription,
      requesterName: "Legacy Sync User",
    })!;

    stage3.status = "cancelled";
    syncMarketplaceRequestStatusFromStage3(stage3);

    const updated = getSupportRequestsWithStored().find((request) => request.id === legacyRequestId);
    expect(updated?.status).toBe("cancelled");
  });
});

// ─── Solution Specs intake ─────────────────────────────────────────────────────

describe("createSolutionSpecStage3Intake", () => {
  const base = {
    specId: "spec-dbp-001",
    specTitle: "DBP Reference Architecture",
    requesterName: "Carol Architect",
    requesterEmail: "carol@dtmp.local",
    requesterRole: "Solution Architect",
    message: "Need access to the DBP reference architecture for our project.",
  };

  it("returns both marketplace request and stage3 request", () => {
    const result = createSolutionSpecStage3Intake(base);
    expect(result).not.toBeNull();
    expect(result!.request).toBeTruthy();
    expect(result!.stage3).toBeTruthy();
  });

  it("persists the blueprint TO request to localStorage", () => {
    createSolutionSpecStage3Intake(base);
    const stored = getBlueprintTORequests("Carol Architect");
    expect(stored).toHaveLength(1);
    expect(stored[0].itemId).toBe("spec-dbp-001");
    expect(stored[0].marketplace).toBe("solution-specs");
    expect(stored[0].status).toBe("Open");
  });

  it("links the blueprint request to the stage3 request id", () => {
    const result = createSolutionSpecStage3Intake(base)!;
    const stored = getBlueprintTORequests("Carol Architect");
    expect(stored[0].stage3RequestId).toBe(result.stage3.id);
  });

  it("adds the stage3 request to the in-memory array with correct type", () => {
    createSolutionSpecStage3Intake(base);
    expect(stage3Requests).toHaveLength(1);
    expect(stage3Requests[0].type).toBe("solution-specs");
  });

  it("includes the solution-spec-request asset link in stage3 relatedAssets", () => {
    const result = createSolutionSpecStage3Intake(base)!;
    expect(result.stage3.relatedAssets).toContain(`solution-spec-request:${result.request!.id}`);
  });

  it("defaults to medium priority", () => {
    const result = createSolutionSpecStage3Intake(base)!;
    expect(result.stage3.priority).toBe("medium");
  });

  it("applies caller-supplied priority", () => {
    const result = createSolutionSpecStage3Intake({ ...base, priority: "high" })!;
    expect(result.stage3.priority).toBe("high");
  });

  it("returns null when message is empty", () => {
    expect(createSolutionSpecStage3Intake({ ...base, message: "" })).toBeNull();
  });

  it("does not create a stage3 request for empty message", () => {
    createSolutionSpecStage3Intake({ ...base, message: "   " });
    expect(stage3Requests).toHaveLength(0);
  });
});

// ─── Solution Build intake ─────────────────────────────────────────────────────

describe("createSolutionBuildStage3Intake", () => {
  const base = {
    buildId: "build-dxp-002",
    buildTitle: "DXP Microservices Build",
    requesterName: "Dan Engineer",
    requesterEmail: "dan@dtmp.local",
    requesterRole: "DevOps Engineer",
    message: "Request access to the DXP microservices build resources.",
  };

  it("returns both marketplace request and stage3 request", () => {
    const result = createSolutionBuildStage3Intake(base);
    expect(result).not.toBeNull();
    expect(result!.request).toBeTruthy();
    expect(result!.stage3).toBeTruthy();
  });

  it("persists the blueprint TO request with solution-build marketplace", () => {
    createSolutionBuildStage3Intake(base);
    const stored = getBlueprintTORequests("Dan Engineer");
    expect(stored).toHaveLength(1);
    expect(stored[0].marketplace).toBe("solution-build");
    expect(stored[0].itemId).toBe("build-dxp-002");
  });

  it("links the blueprint request to the stage3 request id", () => {
    const result = createSolutionBuildStage3Intake(base)!;
    const stored = getBlueprintTORequests("Dan Engineer");
    expect(stored[0].stage3RequestId).toBe(result.stage3.id);
  });

  it("adds the stage3 request to the in-memory array with type solution-build", () => {
    createSolutionBuildStage3Intake(base);
    expect(stage3Requests[0].type).toBe("solution-build");
  });

  it("includes the solution-build-request asset link in stage3 relatedAssets", () => {
    const result = createSolutionBuildStage3Intake(base)!;
    expect(result.stage3.relatedAssets).toContain(`solution-build-request:${result.request!.id}`);
  });

  it("solution-specs and solution-build requests share the same localStorage key", () => {
    createSolutionSpecStage3Intake({
      specId: "spec-1",
      specTitle: "Spec One",
      requesterName: "Shared User",
      requesterEmail: "shared@dtmp.local",
      requesterRole: "User",
      message: "Spec request",
    });
    createSolutionBuildStage3Intake({
      buildId: "build-1",
      buildTitle: "Build One",
      requesterName: "Shared User",
      requesterEmail: "shared@dtmp.local",
      requesterRole: "User",
      message: "Build request",
    });
    // Both appear under the same getBlueprintTORequests query
    const all = getBlueprintTORequests("Shared User");
    expect(all).toHaveLength(2);
    expect(all.map((r) => r.marketplace)).toContain("solution-specs");
    expect(all.map((r) => r.marketplace)).toContain("solution-build");
  });

  it("returns null when message is empty", () => {
    expect(createSolutionBuildStage3Intake({ ...base, message: "" })).toBeNull();
  });
});

// ─── Blueprints sync ──────────────────────────────────────────────────────────

describe("syncMarketplaceRequestStatusFromStage3 — blueprints", () => {
  it("syncs solution-spec-request to In Review when stage3 is assigned", () => {
    const { stage3 } = createSolutionSpecStage3Intake({
      specId: "spec-sync-1",
      specTitle: "Sync Spec",
      requesterName: "Sync User",
      requesterEmail: "sync@dtmp.local",
      requesterRole: "Analyst",
      message: "Need this spec",
    })!;
    stage3.status = "assigned";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getBlueprintTORequests("Sync User")[0].status).toBe("In Review");
  });

  it("syncs solution-build-request to Resolved when stage3 is completed", () => {
    const { stage3 } = createSolutionBuildStage3Intake({
      buildId: "build-sync-1",
      buildTitle: "Sync Build",
      requesterName: "Build User",
      requesterEmail: "build@dtmp.local",
      requesterRole: "Engineer",
      message: "Need this build",
    })!;
    stage3.status = "completed";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getBlueprintTORequests("Build User")[0].status).toBe("Resolved");
  });
});

// ─── Templates intake ─────────────────────────────────────────────────────────

describe("createTemplateStage3Intake", () => {
  const base = {
    templateId: "app-profile-dws-001",
    templateTitle: "DWS Application Profile",
    tab: "application-profiles" as const,
    requesterName: "Eve Documenter",
    requesterEmail: "eve@dtmp.local",
    requesterRole: "Business Analyst",
    message: "Need to generate an application profile for our DWS initiative.",
  };

  it("returns both marketplace request and stage3 request", () => {
    const result = createTemplateStage3Intake(base);
    expect(result).not.toBeNull();
    expect(result!.request).toBeTruthy();
    expect(result!.stage3).toBeTruthy();
  });

  it("persists the template TO request to localStorage", () => {
    createTemplateStage3Intake(base);
    const stored = getTemplateTORequests("Eve Documenter");
    expect(stored).toHaveLength(1);
    expect(stored[0].templateId).toBe("app-profile-dws-001");
    expect(stored[0].tab).toBe("application-profiles");
    expect(stored[0].status).toBe("Open");
  });

  it("links the template request to the stage3 request id", () => {
    const result = createTemplateStage3Intake(base)!;
    const stored = getTemplateTORequests("Eve Documenter");
    expect(stored[0].stage3RequestId).toBe(result.stage3.id);
  });

  it("adds the stage3 request to the in-memory array with type dtmp-templates", () => {
    createTemplateStage3Intake(base);
    expect(stage3Requests).toHaveLength(1);
    expect(stage3Requests[0].type).toBe("dtmp-templates");
  });

  it("includes the template-request asset link in stage3 relatedAssets", () => {
    const result = createTemplateStage3Intake(base)!;
    expect(result.stage3.relatedAssets).toContain(`template-request:${result.request!.id}`);
  });

  it("works for assessments tab", () => {
    const result = createTemplateStage3Intake({
      ...base,
      templateId: "assessment-001",
      templateTitle: "Digital Maturity Assessment",
      tab: "assessments",
      requesterName: "Frank Assessor",
    })!;
    const stored = getTemplateTORequests("Frank Assessor");
    expect(stored[0].tab).toBe("assessments");
    expect(result.stage3.type).toBe("dtmp-templates");
  });

  it("defaults to low priority", () => {
    const result = createTemplateStage3Intake(base)!;
    expect(result.stage3.priority).toBe("low");
  });

  it("applies caller-supplied priority", () => {
    const result = createTemplateStage3Intake({ ...base, priority: "medium" })!;
    expect(result.stage3.priority).toBe("medium");
  });

  it("returns null when message is empty", () => {
    expect(createTemplateStage3Intake({ ...base, message: "" })).toBeNull();
  });

  it("does not create stage3 request for empty message", () => {
    createTemplateStage3Intake({ ...base, message: "   " });
    expect(stage3Requests).toHaveLength(0);
  });
});

// ─── Templates sync ────────────────────────────────────────────────────────────

describe("syncMarketplaceRequestStatusFromStage3 — templates", () => {
  const base = {
    templateId: "tmpl-sync-001",
    templateTitle: "Sync Template",
    tab: "assessments" as const,
    requesterName: "Grace Syncer",
    requesterEmail: "grace@dtmp.local",
    requesterRole: "Analyst",
    message: "Template request for sync test.",
  };

  it("syncs to In Review when stage3 is pending-review", () => {
    const { stage3 } = createTemplateStage3Intake(base)!;
    stage3.status = "pending-review";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getTemplateTORequests("Grace Syncer")[0].status).toBe("In Review");
  });

  it("syncs to Resolved when stage3 is completed", () => {
    const { stage3 } = createTemplateStage3Intake(base)!;
    stage3.status = "completed";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getTemplateTORequests("Grace Syncer")[0].status).toBe("Resolved");
  });
});

// ─── Digital Intelligence intake ──────────────────────────────────────────────

describe("createDIStage3Intake", () => {
  const base = {
    serviceId: "dm-001",
    serviceTitle: "Digital Maturity Index",
    tab: "digital-maturity" as const,
    requesterName: "Hank Intelligence",
    requesterEmail: "hank@dtmp.local",
    requesterRole: "Transformation Lead",
    message: "Request access to the Digital Maturity Index analytics dashboard.",
  };

  it("returns both marketplace request and stage3 request", () => {
    const result = createDIStage3Intake(base);
    expect(result).not.toBeNull();
    expect(result!.request).toBeTruthy();
    expect(result!.stage3).toBeTruthy();
  });

  it("persists the DI TO request to localStorage", () => {
    createDIStage3Intake(base);
    const stored = getDITORequests("Hank Intelligence");
    expect(stored).toHaveLength(1);
    expect(stored[0].serviceId).toBe("dm-001");
    expect(stored[0].tab).toBe("digital-maturity");
    expect(stored[0].status).toBe("Open");
  });

  it("links the DI request to the stage3 request id", () => {
    const result = createDIStage3Intake(base)!;
    const stored = getDITORequests("Hank Intelligence");
    expect(stored[0].stage3RequestId).toBe(result.stage3.id);
  });

  it("adds the stage3 request to the in-memory array with type digital-intelligence", () => {
    createDIStage3Intake(base);
    expect(stage3Requests).toHaveLength(1);
    expect(stage3Requests[0].type).toBe("digital-intelligence");
  });

  it("includes the di-request asset link in stage3 relatedAssets", () => {
    const result = createDIStage3Intake(base)!;
    expect(result.stage3.relatedAssets).toContain(`di-request:${result.request!.id}`);
  });

  it("works for systems-portfolio tab", () => {
    const result = createDIStage3Intake({
      ...base,
      tab: "systems-portfolio",
      serviceId: "sp-001",
      serviceTitle: "Systems Portfolio Overview",
      requesterName: "Iris Systems",
    })!;
    expect(getDITORequests("Iris Systems")[0].tab).toBe("systems-portfolio");
  });

  it("works for projects-portfolio tab", () => {
    const result = createDIStage3Intake({
      ...base,
      tab: "projects-portfolio",
      serviceId: "pp-001",
      serviceTitle: "Projects Portfolio Analytics",
      requesterName: "Jack Projects",
    })!;
    expect(getDITORequests("Jack Projects")[0].tab).toBe("projects-portfolio");
  });

  it("defaults to medium priority", () => {
    const result = createDIStage3Intake(base)!;
    expect(result.stage3.priority).toBe("medium");
  });

  it("applies caller-supplied priority", () => {
    const result = createDIStage3Intake({ ...base, priority: "critical" })!;
    expect(result.stage3.priority).toBe("critical");
  });

  it("returns null when message is empty", () => {
    expect(createDIStage3Intake({ ...base, message: "" })).toBeNull();
  });

  it("does not create stage3 request for empty message", () => {
    createDIStage3Intake({ ...base, message: "   " });
    expect(stage3Requests).toHaveLength(0);
  });
});

// ─── Digital Intelligence sync ─────────────────────────────────────────────────

describe("syncMarketplaceRequestStatusFromStage3 — digital-intelligence", () => {
  const base = {
    serviceId: "di-sync-001",
    serviceTitle: "Portfolio Risk Analyzer",
    tab: "projects-portfolio" as const,
    requesterName: "Kay Analytics",
    requesterEmail: "kay@dtmp.local",
    requesterRole: "Portfolio Manager",
    message: "Access request for portfolio risk analytics.",
  };

  it("syncs to In Review when stage3 is in-progress", () => {
    const { stage3 } = createDIStage3Intake(base)!;
    stage3.status = "in-progress";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getDITORequests("Kay Analytics")[0].status).toBe("In Review");
  });

  it("syncs to Resolved when stage3 is completed", () => {
    const { stage3 } = createDIStage3Intake(base)!;
    stage3.status = "completed";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getDITORequests("Kay Analytics")[0].status).toBe("Resolved");
  });

  it("syncs to In Review when stage3 is assigned", () => {
    const { stage3 } = createDIStage3Intake(base)!;
    stage3.status = "assigned";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getDITORequests("Kay Analytics")[0].status).toBe("In Review");
  });

  it("reverts to Open when stage3 moves to on-hold after review", () => {
    const { stage3 } = createDIStage3Intake(base)!;
    stage3.status = "in-progress";
    syncMarketplaceRequestStatusFromStage3(stage3);
    stage3.status = "on-hold";
    syncMarketplaceRequestStatusFromStage3(stage3);
    expect(getDITORequests("Kay Analytics")[0].status).toBe("Open");
  });
});

// ─── Cross-marketplace isolation ──────────────────────────────────────────────

describe("cross-marketplace isolation", () => {
  it("support, blueprint, template, and DI stores do not share data", () => {
    createSupportStage3Intake({
      serviceId: "s1",
      serviceName: "Support",
      requesterName: "Iso User",
      requesterEmail: "iso@dtmp.local",
      requesterRole: "User",
      type: "question",
      priority: "low",
      subject: "A question about something",
      description: "Some description long enough to pass validation",
      category: "Other",
    });
    createSolutionSpecStage3Intake({
      specId: "sp1",
      specTitle: "Spec",
      requesterName: "Iso User",
      requesterEmail: "iso@dtmp.local",
      requesterRole: "User",
      message: "Need spec",
    });
    createTemplateStage3Intake({
      templateId: "t1",
      templateTitle: "Template",
      tab: "assessments",
      requesterName: "Iso User",
      requesterEmail: "iso@dtmp.local",
      requesterRole: "User",
      message: "Need template",
    });
    createDIStage3Intake({
      serviceId: "d1",
      serviceTitle: "DI Service",
      tab: "systems-portfolio",
      requesterName: "Iso User",
      requesterEmail: "iso@dtmp.local",
      requesterRole: "User",
      message: "Need access",
    });

    // Each store is independent
    expect(getSupportTORequests("Iso User")).toHaveLength(1);
    expect(getBlueprintTORequests("Iso User")).toHaveLength(1);
    expect(getTemplateTORequests("Iso User")).toHaveLength(1);
    expect(getDITORequests("Iso User")).toHaveLength(1);

    // All 4 stage3 requests created
    expect(stage3Requests).toHaveLength(4);

    // Each has the correct type
    const types = stage3Requests.map((r) => r.type);
    expect(types).toContain("support-services");
    expect(types).toContain("solution-specs");
    expect(types).toContain("dtmp-templates");
    expect(types).toContain("digital-intelligence");
  });
});
