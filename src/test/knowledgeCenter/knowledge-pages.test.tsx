import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KnowledgeCenterPage from "@/pages/KnowledgeCenterPage";
import KnowledgeCenterDetailPage from "@/pages/KnowledgeCenterDetailPage";

const renderKnowledgeCenter = () =>
  render(
    <MemoryRouter initialEntries={["/marketplaces/knowledge-center"]}>
      <Routes>
        <Route path="/marketplaces/knowledge-center" element={<KnowledgeCenterPage />} />
      </Routes>
    </MemoryRouter>
  );

const renderKnowledgeDetail = () =>
  render(
    <MemoryRouter initialEntries={["/marketplaces/knowledge-center/best-practices/api-first-architecture"]}>
      <Routes>
        <Route
          path="/marketplaces/knowledge-center/:tab/:cardId"
          element={<KnowledgeCenterDetailPage />}
        />
      </Routes>
    </MemoryRouter>
  );

describe("Knowledge Center pages", () => {
  it("supports search, filter, sort, and pagination on list page", async () => {
    renderKnowledgeCenter();

    expect(
      screen.getByRole("heading", { name: /DTMP Knowledge Center/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Best Practices/i })).toBeInTheDocument();

    const sortSelect = screen.getByRole("combobox");
    await userEvent.selectOptions(sortSelect, "newest");
    expect(sortSelect).toHaveValue("newest");

    const nextButton = screen.getByRole("button", { name: /Next/i });
    if (!nextButton.hasAttribute("disabled")) {
      await userEvent.click(nextButton);
      expect(screen.getByText(/Page 2 of/i)).toBeInTheDocument();
    }

    const domainGroupButton = screen.getByRole("button", { name: /Domain/i });
    await userEvent.click(domainGroupButton);
    expect(screen.getByLabelText("Architecture")).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(
      /Search best practices, patterns, or topics/i
    );
    await userEvent.clear(searchInput);
    await userEvent.type(searchInput, "FinOps");

    await waitFor(() => {
      expect(screen.getByText(/Cloud FinOps Governance Model/i)).toBeInTheDocument();
    });
  });

  it("renders reader collaboration and request sections with accessible controls", async () => {
    renderKnowledgeDetail();

    const openReaderButton = screen.getByRole("button", { name: /View Resource/i });
    await userEvent.click(openReaderButton);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Resource Reader/i })).toBeInTheDocument();
    });

    expect(
      screen.getByRole("heading", { name: /Comments and @Mentions/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Add a comment or mention someone/i)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Post Comment/i })).toBeInTheDocument();

    expect(
      screen.getByRole("heading", { name: /Request Clarification or Update/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Submit Request/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Mark Helpful/i })).toBeInTheDocument();
  });
});
