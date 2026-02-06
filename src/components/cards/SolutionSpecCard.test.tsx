import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SolutionSpecCard } from "./SolutionSpecCard";
import { SolutionSpec } from "@/data/blueprints/solutionSpecs";

describe("SolutionSpecCard", () => {
  const mockSpec: SolutionSpec = {
    id: "test-spec",
    title: "Test Solution Spec",
    description: "This is a test solution specification",
    solutionType: "DBP",
    scope: "enterprise",
    maturityLevel: "proven",
    diagramCount: 5,
    componentCount: 12,
    tags: ["test", "solution", "spec"],
    lastUpdated: "2024-01-15",
    author: "Test Author",
  };

  it("renders spec title and description", () => {
    const mockOnClick = vi.fn();
    render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

    expect(screen.getByText("Test Solution Spec")).toBeInTheDocument();
    expect(screen.getByText("This is a test solution specification")).toBeInTheDocument();
  });

  it("displays solution type badge", () => {
    const mockOnClick = vi.fn();
    render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

    expect(screen.getByText("DBP")).toBeInTheDocument();
  });

  it("displays scope and maturity level", () => {
    const mockOnClick = vi.fn();
    render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("Proven")).toBeInTheDocument();
  });

  it("displays diagram count", () => {
    const mockOnClick = vi.fn();
    render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

    expect(screen.getByText("5 diagrams")).toBeInTheDocument();
  });

  it("displays component count", () => {
    const mockOnClick = vi.fn();
    render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

    expect(screen.getByText("12 components")).toBeInTheDocument();
  });

  it("displays singular form for single diagram", () => {
    const mockOnClick = vi.fn();
    const specWithOneDiagram = { ...mockSpec, diagramCount: 1 };
    render(<SolutionSpecCard spec={specWithOneDiagram} onClick={mockOnClick} />);

    expect(screen.getByText("1 diagram")).toBeInTheDocument();
  });

  it("displays singular form for single component", () => {
    const mockOnClick = vi.fn();
    const specWithOneComponent = { ...mockSpec, componentCount: 1 };
    render(<SolutionSpecCard spec={specWithOneComponent} onClick={mockOnClick} />);

    expect(screen.getByText("1 component")).toBeInTheDocument();
  });

  it("displays first 3 tags", () => {
    const mockOnClick = vi.fn();
    render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("solution")).toBeInTheDocument();
    expect(screen.getByText("spec")).toBeInTheDocument();
  });

  it("shows +N more indicator when more than 3 tags", () => {
    const mockOnClick = vi.fn();
    const specWithManyTags = {
      ...mockSpec,
      tags: ["tag1", "tag2", "tag3", "tag4", "tag5"],
    };
    render(<SolutionSpecCard spec={specWithManyTags} onClick={mockOnClick} />);

    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();

    render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

    const card = screen.getByRole("button", { name: /View details for Test Solution Spec/i });
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalledWith("test-spec");
  });

  it("calls onClick when Enter key is pressed", async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();

    render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

    const card = screen.getByRole("button", { name: /View details for Test Solution Spec/i });
    card.focus();
    await user.keyboard("{Enter}");

    expect(mockOnClick).toHaveBeenCalledWith("test-spec");
  });

  it("calls onClick when Space key is pressed", async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();

    render(<SolutionSpecCard spec={mockSpec} onClick={mockOnClick} />);

    const card = screen.getByRole("button", { name: /View details for Test Solution Spec/i });
    card.focus();
    await user.keyboard(" ");

    expect(mockOnClick).toHaveBeenCalledWith("test-spec");
  });

  it("renders with different solution types", () => {
    const mockOnClick = vi.fn();
    const dxpSpec = { ...mockSpec, solutionType: "DXP" as const };
    const { rerender } = render(<SolutionSpecCard spec={dxpSpec} onClick={mockOnClick} />);

    expect(screen.getByText("DXP")).toBeInTheDocument();

    const dwsSpec = { ...mockSpec, solutionType: "DWS" as const };
    rerender(<SolutionSpecCard spec={dwsSpec} onClick={mockOnClick} />);

    expect(screen.getByText("DWS")).toBeInTheDocument();
  });

  it("renders with no tags", () => {
    const mockOnClick = vi.fn();
    const specWithNoTags = { ...mockSpec, tags: [] };
    render(<SolutionSpecCard spec={specWithNoTags} onClick={mockOnClick} />);

    // Should still render without errors
    expect(screen.getByText("Test Solution Spec")).toBeInTheDocument();
  });
});
