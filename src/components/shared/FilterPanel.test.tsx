import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterPanel } from "./FilterPanel";
import { FilterConfig } from "@/data/blueprints/filters";

describe("FilterPanel", () => {
  const mockFilters: FilterConfig[] = [
    {
      key: "scope",
      label: "Scope",
      type: "checkbox",
      options: [
        { value: "enterprise", label: "Enterprise" },
        { value: "departmental", label: "Departmental" },
      ],
    },
    {
      key: "maturityLevel",
      label: "Maturity Level",
      type: "radio",
      options: [
        { value: "conceptual", label: "Conceptual" },
        { value: "proven", label: "Proven" },
      ],
    },
    {
      key: "complexity",
      label: "Complexity",
      type: "select",
      options: [
        { value: "low", label: "Low" },
        { value: "high", label: "High" },
      ],
    },
  ];

  it("renders all filter groups", () => {
    render(
      <FilterPanel
        filters={mockFilters}
        activeFilters={{}}
        onFilterChange={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByText("Filters")).toBeInTheDocument();
    expect(screen.getByText("Scope")).toBeInTheDocument();
    expect(screen.getByText("Maturity Level")).toBeInTheDocument();
    expect(screen.getByText("Complexity")).toBeInTheDocument();
  });

  it("renders checkbox options correctly", () => {
    render(
      <FilterPanel
        filters={mockFilters}
        activeFilters={{}}
        onFilterChange={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Enterprise")).toBeInTheDocument();
    expect(screen.getByLabelText("Departmental")).toBeInTheDocument();
  });

  it("handles checkbox filter changes", () => {
    const onFilterChange = vi.fn();

    render(
      <FilterPanel
        filters={mockFilters}
        activeFilters={{}}
        onFilterChange={onFilterChange}
        onReset={vi.fn()}
      />
    );

    const enterpriseCheckbox = screen.getByLabelText("Enterprise");
    fireEvent.click(enterpriseCheckbox);

    expect(onFilterChange).toHaveBeenCalledWith("scope", ["enterprise"]);
  });

  it("handles multiple checkbox selections", () => {
    const onFilterChange = vi.fn();

    render(
      <FilterPanel
        filters={mockFilters}
        activeFilters={{ scope: ["enterprise"] }}
        onFilterChange={onFilterChange}
        onReset={vi.fn()}
      />
    );

    const departmentalCheckbox = screen.getByLabelText("Departmental");
    fireEvent.click(departmentalCheckbox);

    expect(onFilterChange).toHaveBeenCalledWith("scope", [
      "enterprise",
      "departmental",
    ]);
  });

  it("handles radio filter changes", () => {
    const onFilterChange = vi.fn();

    render(
      <FilterPanel
        filters={mockFilters}
        activeFilters={{}}
        onFilterChange={onFilterChange}
        onReset={vi.fn()}
      />
    );

    const conceptualRadio = screen.getByLabelText("Conceptual");
    fireEvent.click(conceptualRadio);

    expect(onFilterChange).toHaveBeenCalledWith("maturityLevel", "conceptual");
  });

  it("shows reset button when filters are active", () => {
    render(
      <FilterPanel
        filters={mockFilters}
        activeFilters={{ scope: ["enterprise"] }}
        onFilterChange={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(screen.getByLabelText("Reset all filters")).toBeInTheDocument();
  });

  it("hides reset button when no filters are active", () => {
    render(
      <FilterPanel
        filters={mockFilters}
        activeFilters={{}}
        onFilterChange={vi.fn()}
        onReset={vi.fn()}
      />
    );

    expect(
      screen.queryByLabelText("Reset all filters")
    ).not.toBeInTheDocument();
  });

  it("calls onReset when reset button is clicked", () => {
    const onReset = vi.fn();

    render(
      <FilterPanel
        filters={mockFilters}
        activeFilters={{ scope: ["enterprise"] }}
        onFilterChange={vi.fn()}
        onReset={onReset}
      />
    );

    const resetButton = screen.getByLabelText("Reset all filters");
    fireEvent.click(resetButton);

    expect(onReset).toHaveBeenCalled();
  });

  it("reflects active checkbox filters in UI", () => {
    render(
      <FilterPanel
        filters={mockFilters}
        activeFilters={{ scope: ["enterprise", "departmental"] }}
        onFilterChange={vi.fn()}
        onReset={vi.fn()}
      />
    );

    const enterpriseCheckbox = screen.getByLabelText("Enterprise");
    const departmentalCheckbox = screen.getByLabelText("Departmental");

    expect(enterpriseCheckbox).toBeChecked();
    expect(departmentalCheckbox).toBeChecked();
  });

  it("reflects active radio filter in UI", () => {
    render(
      <FilterPanel
        filters={mockFilters}
        activeFilters={{ maturityLevel: "proven" }}
        onFilterChange={vi.fn()}
        onReset={vi.fn()}
      />
    );

    const provenRadio = screen.getByLabelText("Proven");
    expect(provenRadio).toBeChecked();
  });
});
