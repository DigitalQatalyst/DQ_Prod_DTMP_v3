import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { SolutionBuildPage } from "./SolutionBuildPage";

// Mock the data
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
    {
      id: "dxp-deployment",
      title: "DXP Deployment",
      description: "Deploy digital experience platform",
      solutionType: "DXP",
      buildComplexity: "basic",
      technologyStack: ["Vue.js"],
      automationLevel: "manual",
      codeSamples: false,
      tags: ["deployment"],
      lastUpdated: "2024-01-20",
      author: "Jane Smith",
    },
    {
      id: "dbp-automation",
      title: "DBP Automation Scripts",
      description: "Automated deployment scripts",
      solutionType: "DBP",
      buildComplexity: "intermediate",
      technologyStack: ["Python", "Docker"],
      automationLevel: "semi-automated",
      codeSamples: true,
      tags: ["automation", "scripts"],
      lastUpdated: "2024-02-01",
      author: "Bob Johnson",
    },
  ],
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("SolutionBuildPage - Filtering and Search Logic", () => {
  it("filters builds by solution type", async () => {
    renderWithRouter(<SolutionBuildPage />);

    // Initially should show all 3 builds
    expect(screen.getByText("Showing 3 items")).toBeInTheDocument();

    // Click DBP tab
    const dbpTab = screen.getByRole("tab", { name: /DBP/i });
    await userEvent.click(dbpTab);

    // Should show only 2 DBP builds
    await waitFor(() => {
      expect(screen.getByText("Showing 2 items")).toBeInTheDocument();
    });
  });

  it("searches builds by title", async () => {
    vi.useFakeTimers();
    renderWithRouter(<SolutionBuildPage />);

    const searchInput = screen.getByPlaceholderText("Search solution builds...");
    await userEvent.type(searchInput, "Implementation");

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
      expect(screen.getByText("DBP Implementation Guide")).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it("searches builds by technology stack", async () => {
    vi.useFakeTimers();
    renderWithRouter(<SolutionBuildPage />);

    const searchInput = screen.getByPlaceholderText("Search solution builds...");
    await userEvent.type(searchInput, "Python");

    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
      expect(screen.getByText("DBP Automation Scripts")).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it("filters builds by complexity", async () => {
    renderWithRouter(<SolutionBuildPage />);

    const advancedCheckbox = screen.getByLabelText("Advanced");
    await userEvent.click(advancedCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
      expect(screen.getByText("DBP Implementation Guide")).toBeInTheDocument();
    });
  });

  it("filters builds by automation level", async () => {
    renderWithRouter(<SolutionBuildPage />);

    const fullyAutomatedCheckbox = screen.getByLabelText("Fully Automated");
    await userEvent.click(fullyAutomatedCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
      expect(screen.getByText("DBP Implementation Guide")).toBeInTheDocument();
    });
  });

  it("filters builds with code samples", async () => {
    renderWithRouter(<SolutionBuildPage />);

    const hasCodeSamplesCheckbox = screen.getByLabelText("Yes");
    await userEvent.click(hasCodeSamplesCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Showing 2 items")).toBeInTheDocument();
    });
  });

  it("combines multiple filters", async () => {
    renderWithRouter(<SolutionBuildPage />);

    // Filter by DBP type
    const dbpTab = screen.getByRole("tab", { name: /DBP/i });
    await userEvent.click(dbpTab);

    // Filter by advanced complexity
    const advancedCheckbox = screen.getByLabelText("Advanced");
    await userEvent.click(advancedCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
      expect(screen.getByText("DBP Implementation Guide")).toBeInTheDocument();
    });
  });

  it("combines search with filters", async () => {
    vi.useFakeTimers();
    renderWithRouter(<SolutionBuildPage />);

    // Search for "DBP"
    const searchInput = screen.getByPlaceholderText("Search solution builds...");
    await userEvent.type(searchInput, "DBP");
    vi.advanceTimersByTime(300);

    // Filter by code samples
    const hasCodeSamplesCheckbox = screen.getByLabelText("Yes");
    await userEvent.click(hasCodeSamplesCheckbox);

    await waitFor(() => {
      expect(screen.getByText("Showing 2 items")).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it("shows empty state when no results match", async () => {
    vi.useFakeTimers();
    renderWithRouter(<SolutionBuildPage />);

    const searchInput = screen.getByPlaceholderText("Search solution builds...");
    await userEvent.type(searchInput, "nonexistent");
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(screen.getByText("No solution builds found")).toBeInTheDocument();
    });

    vi.restoreAllMocks();
  });

  it("resets filters correctly", async () => {
    renderWithRouter(<SolutionBuildPage />);

    // Apply a filter
    const advancedCheckbox = screen.getByLabelText("Advanced");
    await userEvent.click(advancedCheckbox);

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
