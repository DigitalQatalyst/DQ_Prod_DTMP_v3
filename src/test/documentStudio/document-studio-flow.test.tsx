import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DocumentStudioPage from "@/pages/TemplatesPage";
import DocumentStudioStage2Page from "@/pages/DocumentStudioStage2Page";
import DocumentStudioStage3Page from "@/pages/DocumentStudioStage3Page";
import {
  approveDesignReportRequest,
  createDocumentStudioRequest,
  ensureRequestHasGeneratedDocument,
  updateDocumentStudioRequestStatus,
} from "@/data/documentStudio";

describe("Document Studio flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the three documented marketplace tabs including Design Reports", async () => {
    render(
      <MemoryRouter initialEntries={["/marketplaces/document-studio"]}>
        <Routes>
          <Route path="/marketplaces/document-studio" element={<DocumentStudioPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: /Document Studio/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Assessments/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Application Profiles/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Design Reports/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: /Design Reports/i }));

    expect(screen.getByText(/Design Specifications - HLAD/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^Request Document$/i).length).toBeGreaterThan(0);
  });

  it("allows approving an awaiting-approval design report in Stage 2", async () => {
    const request = createDocumentStudioRequest({
      tab: "design-reports",
      cardId: "design-report",
      documentTypeName: "Design Report",
      title: "Design Report - DEWA Transmission - DWS",
      formData: {
        selectedDocumentType: "Design Report",
        divisionBusinessUnit: "Transmission",
        dbpStreams: ["DWS"],
        programmeInitiativeName: "Transmission Modernisation",
        organisationContext: "Context",
      },
    });
    updateDocumentStudioRequestStatus(request.id, "assigned", { assignedTo: "Michael Chen" });
    ensureRequestHasGeneratedDocument(request.id, "Michael Chen");

    render(
      <MemoryRouter initialEntries={[`/stage2/document-studio/my-requests/${request.id}`]}>
        <Routes>
          <Route
            path="/stage2/document-studio/:view/:requestId"
            element={<DocumentStudioStage2Page />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getAllByText(/^awaiting-approval$/i).length).toBeGreaterThan(0);

    const approveButton = screen.getByRole("button", { name: /Approve Document/i });
    await userEvent.click(approveButton);

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /Approve Document/i })).not.toBeInTheDocument();
    });

    expect(screen.getAllByText(/^approved$/i).length).toBeGreaterThan(0);
  });

  it("shows publish preview for approved design reports in Stage 3", async () => {
    const request = createDocumentStudioRequest({
      tab: "design-reports",
      cardId: "design-report",
      documentTypeName: "Design Report",
      title: "Design Report - DEWA Transmission - DWS",
      formData: {
        selectedDocumentType: "Design Report",
        divisionBusinessUnit: "Transmission",
        dbpStreams: ["DWS"],
        programmeInitiativeName: "Transmission Modernisation",
        organisationContext: "Platform redesign for transmission operations",
      },
    });
    updateDocumentStudioRequestStatus(request.id, "assigned", { assignedTo: "Michael Chen" });
    ensureRequestHasGeneratedDocument(request.id, "Michael Chen");
    approveDesignReportRequest(request.id);

    render(
      <MemoryRouter initialEntries={[`/stage3/document-studio/active/${request.id}`]}>
        <Routes>
          <Route
            path="/stage3/document-studio/:view/:requestId"
            element={<DocumentStudioStage3Page />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Knowledge Centre Card Preview/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Publish to Knowledge Centre/i })).toBeInTheDocument();

    const previewPanel = screen
      .getByText(/Knowledge Centre Card Preview/i)
      .closest("div");

    expect(previewPanel).not.toBeNull();
    expect(
      within(previewPanel as HTMLElement).getByText(/Enterprise-wide/i)
    ).toBeInTheDocument();
    expect(
      within(previewPanel as HTMLElement).getByText(/Transmission Modernisation/i)
    ).toBeInTheDocument();
  });
});
