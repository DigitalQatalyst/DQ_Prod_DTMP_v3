import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { SolutionSpecsPage } from "./SolutionSpecsPage";

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
    {
      id: "dxp-portal",
      title: "Digital Experience Portal",
      description: "Modern web portal solution",
      solutionType: "DXP",
      scope: "departmental",
      maturityLevel: "conceptual",
      diagramCount: 0,
      componentCount: 8,
      tags: ["portal", "web"],
      lastUpdated: "2024-01-20",
      author: "Jane Smith",
    },
    {
      id: "dbp-analytics",
      title: "Analytics Platform",
      description: "Advanced analytics and reporting",
      solutionType: "DBP",
      scope: "project",
      maturityLevel: "reference",
      diagramCount: 3,
      componentCount: 6,
      tags: ["analytics", "reporting"],
      lastUpdated: "2024-02-01",
      author: "Bob Johnson",
    },
  ],
  SolutionType: {},
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("SolutionSpecsPage - Filtering and Search Logic", () => {
  it("filters specs by solution type", async () => {
    renderWithRouter(<SolutionSpecsPage />);

    // Initially should show all 3 specs
    expect(screen.getByText("Showing 3 items")).toBeInTheDocument();

    // Click DBP tab
    const dbpTab = screen.getByRole("tab", { name: /DBP/i });
    await userEvent.click(dbpTab);

    // Should show only 2 DBP specs
    await waitFor(() => {
      expect(screen.getByText("Showing 2 items")).toBeInTheDocument();
    });
  });

  it("searches specs by title", async () => {
    vi.useFakeTimers();
    renderWithRouter(<SolutionSpecsPage />);

    const searchInput = screen.getByPlaceholderText("Search solution specs...");
    await userEvent.type(searchInput, "Customer");

    // Advance timers for debounce
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
      expect(screen.getByText("Customer 360 View")).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it("searches specs by description", async () => {
    vi.useFakeTimers();
    renderWithRouter(<SolutionSpecsPage />);

    const searchInput = screen.getByPlaceholderText("Search solution specs...");
    await userEvent.type(searchInput, "analytics");

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
      expect(screen.getByText("Analytics Platform")).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it("searches specs by tags", async () => {
    vi.useFakeTimers();
    renderWithRouter(<SolutionSpecsPage />);

    const searchInput = screen.getByPlaceholderText("Search solution specs...");
    await userEvent.type(searchInput, "portal");

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
      expect(screen.getByText("Digital Experience Portal")).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it("filters specs by scope", async () => {
    renderWithRouter(<SolutionSpecsPage />);

    const enterpriseCheckbox = screen.getByLabelText("Enterprise");
    await userEvent.click(enterpriseCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
      expect(screen.getByText("Customer 360 View")).toBeInTheDocument();
    });
  });

  it("filters specs by maturity level", async () => {
    renderWithRouter(<SolutionSpecsPage />);

    const provenCheckbox = screen.getByLabelText("Proven");
    await userEvent.click(provenCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
      expect(screen.getByText("Customer 360 View")).toBeInTheDocument();
    });
  });

  it("filters specs with diagrams", async () => {
    renderWithRouter(<SolutionSpecsPage />);

    const hasDiagramsCheckbox = screen.getByLabelText("Yes");
    await userEvent.click(hasDiagramsCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Showing 2 items")).toBeInTheDocument();
    });
  });

  it("combines multiple filters", async () => {
    renderWithRouter(<SolutionSpecsPage />);

    // Filter by DBP type
    const dbpTab = screen.getByRole("tab", { name: /DBP/i });
    await userEvent.click(dbpTab);

    // Filter by enterprise scope
    const enterpriseCheckbox = screen.getByLabelText("Enterprise");
    await userEvent.click(enterpriseCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
      expect(screen.getByText("Customer 360 View")).toBeInTheDocument();
    });
  });

  it("combines search with filters", async () => {
    vi.useFakeTimers();
    renderWithRouter(<SolutionSpecsPage />);

    // Search for "platform"
    const searchInput = screen.getByPlaceholderText("Search solution specs...");
    await userEvent.type(searchInput, "platform");
    vi.advanceTimersByTime(300);

    // Filter by DBP type
    const dbpTab = screen.getByRole("tab", { name: /DBP/i });
    await userEvent.click(dbpTab);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
      expect(screen.getByText("Analytics Platform")).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it("shows empty state when no results match", async () => {
    vi.useFakeTimers();
    renderWithRouter(<SolutionSpecsPage />);

    const searchInput = screen.getByPlaceholderText("Search solution specs...");
    await userEvent.type(searchInput, "nonexistent");
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText("No solution specs found")).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it("resets filters correctly", async () => {
    renderWithRouter(<SolutionSpecsPage />);

    // Apply a filter
    const enterpriseCheckbox = screen.getByLabelText("Enterprise");
    await userEvent.click(enterpriseCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
    });

    // Reset filters
    const resetButton = screen.getByLabelText("Reset all filters");
    await userEvent.click(resetButton);

    await waitFor(() => {
      expect(screen.getByText("Showing 3 items")).toBeInTheDocument();
    });
  });
});
