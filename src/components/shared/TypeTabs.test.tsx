import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TypeTabs } from "./TypeTabs";
import { SolutionType } from "@/data/blueprints/solutionSpecs";

describe("TypeTabs", () => {
  const mockTypeCounts: Record<SolutionType, number> = {
    DBP: 5,
    DXP: 3,
    DWS: 2,
    DIA: 4,
    SDO: 1,
  };

  it("renders all solution type tabs", () => {
    const mockOnTypeChange = vi.fn();

    render(
      <TypeTabs
        activeType="all"
        onTypeChange={mockOnTypeChange}
        typeCounts={mockTypeCounts}
      />
    );

    expect(screen.getByRole("tab", { name: /All/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /DBP/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /DXP/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /DWS/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /DIA/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /SDO/i })).toBeInTheDocument();
  });

  it("displays correct count badges for each type", () => {
    const mockOnTypeChange = vi.fn();

    render(
      <TypeTabs
        activeType="all"
        onTypeChange={mockOnTypeChange}
        typeCounts={mockTypeCounts}
      />
    );

    // Total count for "All" tab (5 + 3 + 2 + 4 + 1 = 15)
    expect(screen.getByText("15")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument(); // DBP
    expect(screen.getByText("3")).toBeInTheDocument(); // DXP
    expect(screen.getByText("2")).toBeInTheDocument(); // DWS
    expect(screen.getByText("4")).toBeInTheDocument(); // DIA
    expect(screen.getByText("1")).toBeInTheDocument(); // SDO
  });

  it("highlights the active tab", () => {
    const mockOnTypeChange = vi.fn();

    render(
      <TypeTabs
        activeType="DBP"
        onTypeChange={mockOnTypeChange}
        typeCounts={mockTypeCounts}
      />
    );

    const dbpTab = screen.getByRole("tab", { name: /DBP/i });
    expect(dbpTab).toHaveAttribute("aria-selected", "true");
  });

  it("calls onTypeChange when a tab is clicked", () => {
    const mockOnTypeChange = vi.fn();

    render(
      <TypeTabs
        activeType="all"
        onTypeChange={mockOnTypeChange}
        typeCounts={mockTypeCounts}
      />
    );

    const dxpTab = screen.getByRole("tab", { name: /DXP/i });
    fireEvent.click(dxpTab);

    expect(mockOnTypeChange).toHaveBeenCalledWith("DXP");
  });

  it("handles zero counts correctly", () => {
    const mockOnTypeChange = vi.fn();
    const zeroTypeCounts: Record<SolutionType, number> = {
      DBP: 0,
      DXP: 0,
      DWS: 0,
      DIA: 0,
      SDO: 0,
    };

    render(
      <TypeTabs
        activeType="all"
        onTypeChange={mockOnTypeChange}
        typeCounts={zeroTypeCounts}
      />
    );

    // Should display 0 for all tabs
    const badges = screen.getAllByText("0");
    expect(badges).toHaveLength(6); // All + 5 solution types
  });

  it("has proper accessibility attributes", () => {
    const mockOnTypeChange = vi.fn();

    render(
      <TypeTabs
        activeType="DBP"
        onTypeChange={mockOnTypeChange}
        typeCounts={mockTypeCounts}
      />
    );

    const nav = screen.getByRole("tablist");
    expect(nav).toHaveAttribute("aria-label", "Solution type filter");

    const dbpTab = screen.getByRole("tab", { name: /DBP/i });
    expect(dbpTab).toHaveAttribute("aria-selected", "true");
    expect(dbpTab).toHaveAttribute("aria-controls", "DBP-panel");
    expect(dbpTab).toHaveAttribute("id", "DBP-tab");
  });
});
