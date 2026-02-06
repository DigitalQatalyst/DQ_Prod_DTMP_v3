import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MarketplaceHeader } from "./MarketplaceHeader";

describe("MarketplaceHeader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders title and description", () => {
    const mockOnSearchChange = vi.fn();
    
    render(
      <MarketplaceHeader
        title="Test Marketplace"
        description="Test description"
        searchValue=""
        onSearchChange={mockOnSearchChange}
        itemCount={10}
      />
    );

    expect(screen.getByText("Test Marketplace")).toBeInTheDocument();
    expect(screen.getByText("Test description")).toBeInTheDocument();
  });

  it("displays item count correctly", () => {
    const mockOnSearchChange = vi.fn();
    
    render(
      <MarketplaceHeader
        title="Test Marketplace"
        description="Test description"
        searchValue=""
        onSearchChange={mockOnSearchChange}
        itemCount={5}
      />
    );

    expect(screen.getByText("Showing 5 items")).toBeInTheDocument();
  });

  it("displays singular item text when count is 1", () => {
    const mockOnSearchChange = vi.fn();
    
    render(
      <MarketplaceHeader
        title="Test Marketplace"
        description="Test description"
        searchValue=""
        onSearchChange={mockOnSearchChange}
        itemCount={1}
      />
    );

    expect(screen.getByText("Showing 1 item")).toBeInTheDocument();
  });

  it("debounces search input with 300ms delay", async () => {
    const mockOnSearchChange = vi.fn();
    const user = userEvent.setup({ delay: null });
    
    render(
      <MarketplaceHeader
        title="Test Marketplace"
        description="Test description"
        searchValue=""
        onSearchChange={mockOnSearchChange}
        itemCount={10}
      />
    );

    const searchInput = screen.getByLabelText("Search...");
    
    // Type in the search box
    await user.type(searchInput, "test");

    // Should not call immediately
    expect(mockOnSearchChange).not.toHaveBeenCalled();

    // Fast-forward time by 300ms
    vi.advanceTimersByTime(300);

    // Should now be called with the debounced value
    await waitFor(() => {
      expect(mockOnSearchChange).toHaveBeenCalledWith("test");
    });
  });

  it("clears search when clear button is clicked", async () => {
    const mockOnSearchChange = vi.fn();
    const user = userEvent.setup({ delay: null });
    
    render(
      <MarketplaceHeader
        title="Test Marketplace"
        description="Test description"
        searchValue="initial"
        onSearchChange={mockOnSearchChange}
        itemCount={10}
      />
    );

    const clearButton = screen.getByLabelText("Clear search");
    await user.click(clearButton);

    // Fast-forward time by 300ms for debounce
    vi.advanceTimersByTime(300);

    await waitFor(() => {
      expect(mockOnSearchChange).toHaveBeenCalledWith("");
    });
  });

  it("uses custom search placeholder when provided", () => {
    const mockOnSearchChange = vi.fn();
    
    render(
      <MarketplaceHeader
        title="Test Marketplace"
        description="Test description"
        searchValue=""
        onSearchChange={mockOnSearchChange}
        itemCount={10}
        searchPlaceholder="Search solutions..."
      />
    );

    expect(screen.getByPlaceholderText("Search solutions...")).toBeInTheDocument();
  });
});
