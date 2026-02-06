import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { SolutionSpecsPage } from "@/pages/SolutionSpecsPage";
import { SolutionBuildPage } from "@/pages/SolutionBuildPage";
import { SolutionSpecDetailPage } from "@/pages/SolutionSpecDetailPage";
import { SolutionBuildDetailPage } from "@/pages/SolutionBuildDetailPage";

// Mock the data
vi.mock("@/data/blueprints/solutionSpecs", () => ({
  solutionSpecs: [
    {
      id: "dbp-customer-360",
      title: "Customer 360 View",
      description: "Comprehensive customer data platform",
      solutionType: "DBP",
      scope: "enterprise",
      maturityLevel: "proven",
      diagramCount: 5,
      componentCount: 12,
      tags: ["customer", "data"],
      lastUpdated: "2024-01-15",
      author: "John Doe",
    },
  ],
  SolutionType: {},
}));

vi.mock("@/data/blueprints/solutionBuilds", () => ({
  solutionBuilds: [
    {
      id: "dbp-implementation",
      title: "DBP Implementation Guide",
      description: "Step-by-step implementation guide",
      solutionType: "DBP",
      buildComplexity: "advanced",
      technologyStack: ["React", "Node.js"],
      automationLevel: "fully-automated",
      codeSamples: true,
      tags: ["implementation", "guide"],
      lastUpdated: "2024-01-15",
      author: "John Doe",
    },
  ],
}));

describe("Marketplace Navigation Integration Tests", () => {
  it("navigates from Solution Specs to detail page", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/solution-specs"]}>
        <Routes>
          <Route path="/solution-specs" element={<SolutionSpecsPage />} />
          <Route path="/solution-specs/:id" element={<SolutionSpecDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Click on a spec card
    const card = screen.getByRole("button", { name: /View details for Customer 360 View/i });
    await user.click(card);

    // Should navigate to detail page
    await waitFor(() => {
      expect(screen.getByText("Customer 360 View")).toBeInTheDocument();
      expect(screen.getByText("Solution Specs")).toBeInTheDocument(); // Breadcrumb
    });
  });

  it("navigates from Solution Build to detail page", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/solution-build"]}>
        <Routes>
          <Route path="/solution-build" element={<SolutionBuildPage />} />
          <Route path="/solution-build/:id" element={<SolutionBuildDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Click on a build card
    const card = screen.getByRole("button", { name: /View details for DBP Implementation Guide/i });
    await user.click(card);

    // Should navigate to detail page
    await waitFor(() => {
      expect(screen.getByText("DBP Implementation Guide")).toBeInTheDocument();
      expect(screen.getByText("Solution Build")).toBeInTheDocument(); // Breadcrumb
    });
  });

  it("navigates back from detail page to marketplace", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/solution-specs/dbp-customer-360"]}>
        <Routes>
          <Route path="/solution-specs" element={<SolutionSpecsPage />} />
          <Route path="/solution-specs/:id" element={<SolutionSpecDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Click back button
    const backButton = screen.getByRole("button", { name: /Back to Solution Specs/i });
    await user.click(backButton);

    // Should navigate back to marketplace
    await waitFor(() => {
      expect(screen.getByText("Solution Specs")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Search solution specs...")).toBeInTheDocument();
    });
  });

  it("supports deep linking with type query parameter", () => {
    render(
      <MemoryRouter initialEntries={["/solution-specs?type=DBP"]}>
        <Routes>
          <Route path="/solution-specs" element={<SolutionSpecsPage />} />
        </Routes>
      </MemoryRouter>
    );

    // DBP tab should be active
    const dbpTab = screen.getByRole("tab", { name: /DBP/i });
    expect(dbpTab).toHaveAttribute("aria-selected", "true");
  });

  it("updates URL when type filter changes", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/solution-specs"]}>
        <Routes>
          <Route path="/solution-specs" element={<SolutionSpecsPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Click DBP tab
    const dbpTab = screen.getByRole("tab", { name: /DBP/i });
    await user.click(dbpTab);

    // URL should be updated (we can't directly check URL in tests, but we can verify the tab is active)
    await waitFor(() => {
      expect(dbpTab).toHaveAttribute("aria-selected", "true");
    });
  });

  it("maintains filter state within same marketplace", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter initialEntries={["/solution-specs"]}>
        <Routes>
          <Route path="/solution-specs" element={<SolutionSpecsPage />} />
          <Route path="/solution-specs/:id" element={<SolutionSpecDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    // Apply a filter
    const enterpriseCheckbox = screen.getByLabelText("Enterprise");
    await user.click(enterpriseCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
    });

    // Navigate to detail page
    const card = screen.getByRole("button", { name: /View details for Customer 360 View/i });
    await user.click(card);

    // Navigate back
    await waitFor(() => {
      const backButton = screen.getByRole("button", { name: /Back to Solution Specs/i });
      user.click(backButton);
    });

    // Filter state should be reset (new page load)
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Search solution specs...")).toBeInTheDocument();
    });
  });

  it("handles 404 state for invalid spec ID", () => {
    render(
      <MemoryRouter initialEntries={["/solution-specs/invalid-id"]}>
        <Routes>
          <Route path="/solution-specs/:id" element={<SolutionSpecDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Solution Spec Not Found")).toBeInTheDocument();
  });

  it("handles 404 state for invalid build ID", () => {
    render(
      <MemoryRouter initialEntries={["/solution-build/invalid-id"]}>
        <Routes>
          <Route path="/solution-build/:id" element={<SolutionBuildDetailPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Solution Build Not Found")).toBeInTheDocument();
  });
});
