import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useSupportWorkspace } from "@/hooks/useSupportWorkspace";
import { technicalSupport } from "@/data/supportServices";
import { stage3Requests } from "@/data/stage3/requests";
import { getSupportTORequests } from "@/data/supportServices/requestState";
import { serviceRequests, supportTickets } from "@/data/supportData";
import {
  upsertStoredSupportRequest,
  upsertStoredSupportTicket,
} from "@/data/supportServices/userSupportState";

describe("useSupportWorkspace stage3 linking", () => {
  beforeEach(() => {
    window.localStorage.clear();
    stage3Requests.length = 0;
  });

  it("creates a linked Stage 3 request when submitting from a support service detail", () => {
    const service = technicalSupport[0];
    const { result } = renderHook(() =>
      useSupportWorkspace({
        marketplace: "support-services",
        cardId: service.id,
        onNavigateToTickets: () => undefined,
      })
    );

    act(() => {
      result.current.createTicketFromService();
    });

    expect(stage3Requests).toHaveLength(1);
    expect(stage3Requests[0].type).toBe("support-services");

    const linkedRequests = getSupportTORequests("You");
    expect(linkedRequests).toHaveLength(1);
    expect(linkedRequests[0].stage3RequestId).toBe(stage3Requests[0].id);
    expect(result.current.supportSubmitMessage).toContain(stage3Requests[0].requestNumber);
  });

  it("creates a linked Stage 3 request for the Stage 2 support request form", () => {
    const { result } = renderHook(() =>
      useSupportWorkspace({
        marketplace: "support-services",
        cardId: "",
        onNavigateToTickets: () => undefined,
      })
    );

    act(() => {
      result.current.setNewRequestForm({
        requestType: "incident",
        category: "Platform/Account",
        priority: "critical",
        subject: "Users cannot log in to the support portal",
        description:
          "Users across multiple teams cannot log in to the support portal after the latest release, and work is currently blocked for ticket triage.",
        urgency: "blocking",
      });
    });

    act(() => {
      result.current.submitNewSupportRequest();
    });

    expect(stage3Requests).toHaveLength(1);
    expect(stage3Requests[0].type).toBe("support-services");

    const linkedRequests = getSupportTORequests("You");
    expect(linkedRequests).toHaveLength(1);
    expect(linkedRequests[0].stage3RequestId).toBe(stage3Requests[0].id);
    expect(result.current.newRequestSuccess).toContain(stage3Requests[0].requestNumber);
  });

  it("keeps previously stored submissions when a new submission is received", () => {
    const persistedTicket = {
      ...supportTickets[0],
      id: "TICKET-2026-99001",
      subject: "Persisted support ticket",
    };
    const persistedRequest = {
      ...serviceRequests[0],
      id: "REQ-2026-99001",
      title: "Persisted support request",
    };
    const latestTicket = {
      ...supportTickets[1],
      id: "TICKET-2026-99002",
      subject: "Latest support ticket",
    };
    const latestRequest = {
      ...serviceRequests[1],
      id: "REQ-2026-99002",
      title: "Latest support request",
    };

    upsertStoredSupportTicket(persistedTicket);
    upsertStoredSupportRequest(persistedRequest);

    const { result } = renderHook(() =>
      useSupportWorkspace({
        marketplace: "support-services",
        cardId: "",
        submittedTicket: latestTicket,
        submittedRequest: latestRequest,
        onNavigateToTickets: () => undefined,
      })
    );

    expect(result.current.supportTicketsState.some((t) => t.id === persistedTicket.id)).toBe(true);
    expect(result.current.supportTicketsState.some((t) => t.id === latestTicket.id)).toBe(true);
    expect(result.current.supportTicketsState.filter((t) => t.id === latestTicket.id)).toHaveLength(1);

    expect(result.current.supportRequestsState.some((r) => r.id === persistedRequest.id)).toBe(true);
    expect(result.current.supportRequestsState.some((r) => r.id === latestRequest.id)).toBe(true);
    expect(result.current.supportRequestsState.filter((r) => r.id === latestRequest.id)).toHaveLength(1);
  });
});
