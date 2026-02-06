import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { SolutionSpecsPage } from "@/pages/SolutionSpecsPage";
import { SolutionBuildPage } from "@/pages/SolutionBuildPage";
import { SolutionSpecCard } from "@/components/cards/SolutionSpecCard";
import { SolutionBuildCard } from "@/components/cards/SolutionBuildCard";
import { MarketplaceHeader } from "@/components/shared/MarketplaceHeader";
import { TypeTabs } from "@/components/shared/TypeTabs";
import { FilterPanel } from "@/components/shared/FilterPanel";
import { SolutionSpec, SolutionType } from "@/data/blueprints/solutionSpecs";
import { SolutionBuild } from "@/data/blueprints/solutionBuilds";

// Mock the data
vi.mock("@/data/blueprints/solutionSpecs", () => ({
  solutionSpecs: [
    {
      id: "test-spec",
      title: "Test Spec",
      description: "Test description",
      solutionType: "DBP",
      scope: "enterprise",
      maturityLevel: "proven",
      diagramCount: 5,
      componentCount: 12,
      tags: ["test"],
      lastUpdated: "2024-01-15",
      author: "Test Author",
    },
  ],
  SolutionType: {},
}));

vi.mock("@/data/blueprints/solutionBuilds", () => ({
  solutionBuilds: [
    {
      id: "test-build",
      title: "Test Build",
      description: "Test description",
      solutionType: "DBP",
      buildComplexity: "advanced",
      technologyStack: ["React"],
      automationLevel: "fully-automated",
      codeSamples: true,
      tags: ["test"],
      lastUpdated: "2024-01-15",
      author: "Test Author",
    },
  ],
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe("Marketplace Accessibility Tests", () => {
  describe("Keyboard Navigation", () => {
    it("allows keyboard navigation through Solution Spec cards", async () => {
      const user = userEvent.setup();
      renderWithRouter(<SolutionSpecsPage />);

      const card = screen.getByRole("button", { name: /View details for Test Spec/i });
      
      // Tab to the card
      await user.tab();
      
      // Card should be focusable
      expect(card).toHaveFocus();
    });

    it("allows keyboard navigation through Solution Build cards", async () => {
      const user = userEvent.setup();
      renderWithRouter(<SolutionBuildPage />);

      const card = screen.getByRole("button", { name: /View details for Test Build/i });
      
      // Tab to the card
      await user.tab();
      
      // Card should be focusable
      expect(card).toHaveFocus();
    });

    it("allows keyboard activation of cards with Enter key", async () => {
      const mockOnClick = vi.fn();
      const user = userEvent.setup();
      
      const mockSpec: SolutionSpec = {
        id: "test",
        title: "Test",
        description: "Test",
        solutionType: "DBP",
        scope: "enterprise",
        maturityLevel: "proven",
        diagramCount: 1,
        componentCount: 1,
        tags: [],
        lastUpdated: "2024-01-15",
        author: "Test",
      };

      render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

      const card = screen.getByRole("button");
      card.focus();
      await user.keyboard("{Enter}");

      expect(mockOnClick).toHaveBeenCalled();
    });

    it("allows keyboard activation of cards with Space key", async () => {
      const mockOnClick = vi.fn();
      const user = userEvent.setup();
      
      const mockBuild: SolutionBuild = {
        id: "test",
        title: "Test",
        description: "Test",
        solutionType: "DBP",
        buildComplexity: "basic",
        technologyStack: [],
        automationLevel: "manual",
        codeSamples: false,
        tags: [],
        lastUpdated: "2024-01-15",
        author: "Test",
      };

      render(<SolutionBuildCard build={mockBuild} onClick={mockOnClick} />);

      const card = screen.getByRole("button");
      card.focus();
      await user.keyboard(" ");

      expect(mockOnClick).toHaveBeenCalled();
    });

    it("allows keyboard navigation through type tabs", async () => {
      const user = userEvent.setup();
      const mockOnTypeChange = vi.fn();
      const typeCounts: Record<SolutionType, number> = {
        DBP: 1,
        DXP: 1,
        DWS: 1,
        DIA: 1,
        SDO: 1,
      };

      render(
        <TypeTabs
          activeType="all"
          onTypeChange={mockOnTypeChange}
          typeCounts={typeCounts}
        />
      );

      const allTab = screen.getByRole("tab", { name: /All/i });
      
      // Tab should be focusable
      allTab.focus();
      expect(allTab).toHaveFocus();
    });

    it("allows keyboard navigation through filter checkboxes", async () => {
      const user = userEvent.setup();
      renderWithRouter(<SolutionSpecsPage />);

      const checkbox = screen.getByLabelText("Enterprise");
      
      // Tab to checkbox
      checkbox.focus();
      expect(checkbox).toHaveFocus();
      
      // Activate with Space
      await user.keyboard(" ");
      expect(checkbox).toBeChecked();
    });
  });

  describe("ARIA Labels and Roles", () => {
    it("has proper ARIA labels on Solution Spec cards", () => {
      const mockOnClick = vi.fn();
      const mockSpec: SolutionSpec = {
        id: "test",
        title: "Test Solution",
        description: "Test",
        solutionType: "DBP",
        scope: "enterprise",
        maturityLevel: "proven",
        diagramCount: 5,
        componentCount: 12,
        tags: [],
        lastUpdated: "2024-01-15",
        author: "Test",
      };

      render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

      const card = screen.getByRole("button", { name: /View details for Test Solution/i });
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("aria-label");
    });

    it("has proper ARIA labels on Solution Build cards", () => {
      const mockOnClick = vi.fn();
      const mockBuild: SolutionBuild = {
        id: "test",
        title: "Test Build",
        description: "Test",
        solutionType: "DBP",
        buildComplexity: "basic",
        technologyStack: [],
        automationLevel: "manual",
        codeSamples: false,
        tags: [],
        lastUpdated: "2024-01-15",
        author: "Test",
      };

      render(<SolutionBuildCard build={mockBuild} onClick={mockOnClick} />);

      const card = screen.getByRole("button", { name: /View details for Test Build/i });
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("aria-label");
    });

    it("has proper ARIA attributes on type tabs", () => {
      const mockOnTypeChange = vi.fn();
      const typeCounts: Record<SolutionType, number> = {
        DBP: 1,
        DXP: 1,
        DWS: 1,
        DIA: 1,
        SDO: 1,
      };

      render(
        <TypeTabs
          activeType="DBP"
          onTypeChange={mockOnTypeChange}
          typeCounts={typeCounts}
        />
      );

      const tablist = screen.getByRole("tablist");
      expect(tablist).toHaveAttribute("aria-label", "Solution type filter");

      const dbpTab = screen.getByRole("tab", { name: /DBP/i });
      expect(dbpTab).toHaveAttribute("aria-selected", "true");
      expect(dbpTab).toHaveAttribute("aria-controls");
      expect(dbpTab).toHaveAttribute("id");
    });

    it("has proper ARIA label on search input", () => {
      const mockOnSearchChange = vi.fn();

      render(
        <MarketplaceHeader
          title="Test"
          description="Test"
          searchValue=""
          onSearchChange={mockOnSearchChange}
          itemCount={0}
        />
      );

      const searchInput = screen.getByLabelText("Search...");
      expect(searchInput).toBeInTheDocument();
    });

    it("has proper ARIA live region for empty state", () => {
      vi.mock("@/data/blueprints/solutionSpecs", () => ({
        solutionSpecs: [],
        SolutionType: {},
      }));

      renderWithRouter(<SolutionSpecsPage />);

      const emptyState = screen.getByRole("status");
      expect(emptyState).toHaveAttribute("aria-live", "polite");
    });

    it("has proper list role for content grid", () => {
      renderWithRouter(<SolutionSpecsPage />);

      const list = screen.getByRole("list", { name: /Solution specifications/i });
      expect(list).toBeInTheDocument();
    });
  });

  describe("Screen Reader Compatibility", () => {
    it("provides descriptive text for diagram count", () => {
      const mockOnClick = vi.fn();
      const mockSpec: SolutionSpec = {
        id: "test",
        title: "Test",
        description: "Test",
        solutionType: "DBP",
        scope: "enterprise",
        maturityLevel: "proven",
        diagramCount: 5,
        componentCount: 12,
        tags: [],
        lastUpdated: "2024-01-15",
        author: "Test",
      };

      render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

      expect(screen.getByLabelText("5 diagrams")).toBeInTheDocument();
    });

    it("provides descriptive text for component count", () => {
      const mockOnClick = vi.fn();
      const mockSpec: SolutionSpec = {
        id: "test",
        title: "Test",
        description: "Test",
        solutionType: "DBP",
        scope: "enterprise",
        maturityLevel: "proven",
        diagramCount: 5,
        componentCount: 12,
        tags: [],
        lastUpdated: "2024-01-15",
        author: "Test",
      };

      render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

      expect(screen.getByLabelText("12 components")).toBeInTheDocument();
    });

    it("hides decorative icons from screen readers", () => {
      const mockOnClick = vi.fn();
      const mockSpec: SolutionSpec = {
        id: "test",
        title: "Test",
        description: "Test",
        solutionType: "DBP",
        scope: "enterprise",
        maturityLevel: "proven",
        diagramCount: 5,
        componentCount: 12,
        tags: [],
        lastUpdated: "2024-01-15",
        author: "Test",
      };

      const { container } = render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

      // Check that decorative icons have aria-hidden
      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBeGreaterThan(0);
    });

    it("provides clear item count information", () => {
      const mockOnSearchChange = vi.fn();

      render(
        <MarketplaceHeader
          title="Test"
          description="Test"
          searchValue=""
          onSearchChange={mockOnSearchChange}
          itemCount={5}
        />
      );

      expect(screen.getByText("Showing 5 items")).toBeInTheDocument();
    });
  });

  describe("Focus Management", () => {
    it("maintains focus visibility on interactive elements", async () => {
      const user = userEvent.setup();
      renderWithRouter(<SolutionSpecsPage />);

      const card = screen.getByRole("button", { name: /View details for Test Spec/i });
      
      await user.tab();
      
      // Card should have focus and be visible
      expect(card).toHaveFocus();
      expect(card).toBeVisible();
    });

    it("provides visible focus indicator on tabs", async () => {
      const user = userEvent.setup();
      renderWithRouter(<SolutionSpecsPage />);

      const allTab = screen.getByRole("tab", { name: /All/i });
      
      allTab.focus();
      
      expect(allTab).toHaveFocus();
      expect(allTab).toBeVisible();
    });

    it("provides visible focus indicator on filter controls", async () => {
      const user = userEvent.setup();
      renderWithRouter(<SolutionSpecsPage />);

      const checkbox = screen.getByLabelText("Enterprise");
      
      checkbox.focus();
      
      expect(checkbox).toHaveFocus();
      expect(checkbox).toBeVisible();
    });
  });
});
