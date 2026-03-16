import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it } from "vitest";
import Stage3AppPage from "@/pages/Stage3AppPage";
import { createStage3Request, stage3Requests } from "@/data/stage3/requests";

describe("Stage3AppPage support scope", () => {
  beforeEach(() => {
    window.localStorage.clear();
    stage3Requests.length = 0;
  });

  it("filters the queue to Support Services requests", async () => {
    createStage3Request({
      type: "support-services",
      title: "Support escalation",
      description: "Production support request linked from Stage 2 Support Services.",
      requester: {
        name: "Support User",
        email: "support.user@dtmp.local",
        department: "Support Services",
        organization: "DTMP",
      },
      priority: "high",
      estimatedHours: 4,
      tags: ["support-services"],
    });
    createStage3Request({
      type: "knowledge-center",
      title: "Knowledge clarification",
      description: "Knowledge request that should be hidden by the support scope.",
      requester: {
        name: "Knowledge User",
        email: "knowledge.user@dtmp.local",
        department: "Knowledge Center",
        organization: "DTMP",
      },
      priority: "medium",
      estimatedHours: 2,
      tags: ["knowledge-center"],
    });

    render(
      <MemoryRouter initialEntries={["/stage3/all"]}>
        <Routes>
          <Route path="/stage3/:view" element={<Stage3AppPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: "Support Services" })).toBeInTheDocument();
    expect(screen.getByText("Support escalation")).toBeInTheDocument();
    expect(screen.getByText("Knowledge clarification")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Support Services" }));

    await waitFor(() => {
      expect(screen.getByText("Support escalation")).toBeInTheDocument();
      expect(screen.queryByText("Knowledge clarification")).not.toBeInTheDocument();
    });
  });
});
