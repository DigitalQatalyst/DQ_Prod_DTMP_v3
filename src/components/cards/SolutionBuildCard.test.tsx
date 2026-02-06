import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SolutionBuildCard } from "./SolutionBuildCard";
import { SolutionBuild } from "@/data/blueprints/solutionBuilds";

describe("SolutionBuildCard", () => {
  const mockBuild: SolutionBuild = {
    id: "test-build",
    title: "Test Solution Build",
    description: "This is a test solution build",
    solutionType: "DBP",
    buildComplexity: "advanced",
    technologyStack: ["React", "Node.js", "Docker"],
    automationLevel: "fully-automated",
    codeSamples: true,
    tags: ["test", "build", "solution"],
    lastUpdated: "2024-01-15",
    author: "Test Author",
  };

  it("renders build title and description", () => {
    const mockOnClick = vi.fn();
    render(<SolutionBuildCard build={mockBuild} onClick={mockOnClick} />);

    expect(screen.getByText("Test Solution Build")).toBeInTheDocument();
    expect(screen.getByText("This is a test solution build")).toBeInTheDocument();
  });

  it("displays solution type badge", () => {
    const mockOnClick = vi.fn();
    render(<SolutionBuildCard build={mockBuild} onClick={mockOnClick} />);

    expect(screen.getByText("DBP")).toBeInTheDocument();
  });

  it("displays build complexity", () => {
    const mockOnClick = vi.fn();
    render(<SolutionBuildCard build={mockBuild} onClick={mockOnClick} />);

    expect(screen.getByText("Advanced")).toBeInTheDocument();
  });

  it("displays automation level", () => {
    const mockOnClick = vi.fn();
    render(<SolutionBuildCard build={mockBuild} onClick={mockOnClick} />);

    expect(screen.getByText("Fully Automated")).toBeInTheDocument();
  });

  it("displays first 3 technologies from stack", () => {
    const mockOnClick = vi.fn();
    render(<SolutionBuildCard build={mockBuild} onClick={mockOnClick} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Node.js")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });

  it("shows +N indicator when more than 3 technologies", () => {
    const mockOnClick = vi.fn();
    const buildWithManyTechs = {
      ...mockBuild,
      technologyStack: ["React", "Node.js", "Docker", "Kubernetes", "PostgreSQL"],
    };
    render(<SolutionBuildCard build={buildWithManyTechs} onClick={mockOnClick} />);

    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("displays code samples indicator when available", () => {
    const mockOnClick = vi.fn();
    render(<SolutionBuildCard build={mockBuild} onClick={mockOnClick} />);

    expect(screen.getByText("Code samples available")).toBeInTheDocument();
  });

  it("does not display code samples indicator when not available", () => {
    const mockOnClick = vi.fn();
    const buildWithoutSamples = { ...mockBuild, codeSamples: false };
    render(<SolutionBuildCard build={buildWithoutSamples} onClick={mockOnClick} />);

    expect(screen.queryByText("Code samples available")).not.toBeInTheDocument();
  });

  it("displays first 3 tags", () => {
    const mockOnClick = vi.fn();
    render(<SolutionBuildCard build={mockBuild} onClick={mockOnClick} />);

    expect(screen.getByText("test")).toBeInTheDocument();
    expect(screen.getByText("build")).toBeInTheDocument();
    expect(screen.getByText("solution")).toBeInTheDocument();
  });

  it("shows +N more indicator when more than 3 tags", () => {
    const mockOnClick = vi.fn();
    const buildWithManyTags = {
      ...mockBuild,
      tags: ["tag1", "tag2", "tag3", "tag4", "tag5"],
    };
    render(<SolutionBuildCard build={buildWithManyTags} onClick={mockOnClick} />);

    expect(screen.getByText("+2 more")).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();

    render(<SolutionBuildCard build={mockBuild} onClick={mockOnClick} />);

    const card = screen.getByRole("button", { name: /View details for Test Solution Build/i });
    await user.click(card);

    expect(mockOnClick).toHaveBeenCalledWith("test-build");
  });

  it("calls onClick when Enter key is pressed", async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();

    render(<SolutionBuildCard build={mockBuild} onClick={mockOnClick} />);

    const card = screen.getByRole("button", { name: /View details for Test Solution Build/i });
    card.focus();
    await user.keyboard("{Enter}");

    expect(mockOnClick).toHaveBeenCalledWith("test-build");
  });

  it("calls onClick when Space key is pressed", async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();

    render(<SolutionBuildCard build={mockBuild} onClick={mockOnClick} />);

    const card = screen.getByRole("button", { name: /View details for Test Solution Build/i });
    card.focus();
    await user.keyboard(" ");

    expect(mockOnClick).toHaveBeenCalledWith("test-build");
  });

  it("renders with different complexity levels", () => {
    const mockOnClick = vi.fn();
    const basicBuild = { ...mockBuild, buildComplexity: "basic" as const };
    const { rerender } = render(<SolutionBuildCard build={basicBuild} onClick={mockOnClick} />);

    expect(screen.getByText("Basic")).toBeInTheDocument();

    const intermediateBuild = { ...mockBuild, buildComplexity: "intermediate" as const };
    rerender(<SolutionBuildCard build={intermediateBuild} onClick={mockOnClick} />);

    expect(screen.getByText("Intermediate")).toBeInTheDocument();
  });

  it("renders with different automation levels", () => {
    const mockOnClick = vi.fn();
    const manualBuild = { ...mockBuild, automationLevel: "manual" as const };
    const { rerender } = render(<SolutionBuildCard build={manualBuild} onClick={mockOnClick} />);

    expect(screen.getByText("Manual")).toBeInTheDocument();

    const semiAutomatedBuild = { ...mockBuild, automationLevel: "semi-automated" as const };
    rerender(<SolutionBuildCard build={semiAutomatedBuild} onClick={mockOnClick} />);

    expect(screen.getByText("Semi-Automated")).toBeInTheDocument();
  });

  it("renders with no tags", () => {
    const mockOnClick = vi.fn();
    const buildWithNoTags = { ...mockBuild, tags: [] };
    render(<SolutionBuildCard build={buildWithNoTags} onClick={mockOnClick} />);

    // Should still render without errors
    expect(screen.getByText("Test Solution Build")).toBeInTheDocument();
  });
});
