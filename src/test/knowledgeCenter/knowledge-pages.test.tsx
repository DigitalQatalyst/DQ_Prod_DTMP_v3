import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { render, screen } from "@testing-library/react";
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
    <MemoryRouter initialEntries={["/marketplaces/knowledge-center/best-practices/api-first-integration-architecture"]}>
      <Routes>
        <Route path="/marketplaces/knowledge-center/:tab/:cardId" element={<KnowledgeCenterDetailPage />} />
      </Routes>
    </MemoryRouter>
  );

describe("Knowledge Center pages", () => {
  it("renders the DEWA contextualised list page and tab structure", async () => {
    renderKnowledgeCenter();

    expect(screen.getByRole("heading", { name: /DTMP Knowledge Centre/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Design Reports/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /Architecture Standards/i })).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search best practices, patterns, or topics/i);
    await userEvent.type(searchInput, "API-First");

    expect(screen.getByText(/API-First Integration Architecture/i)).toBeInTheDocument();
  });

  it("renders the contextualised detail page with core sections", () => {
    renderKnowledgeDetail();

    expect(screen.getByRole("heading", { name: /API-First Integration Architecture/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /About/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /View Resource/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Related Content/i })).toBeInTheDocument();
  });
});
