import { useMemo, useState } from "react";
import { AlertTriangle, ExternalLink, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { knowledgeItems, type KnowledgeTab } from "@/data/knowledgeCenter/knowledgeItems";
import { getKnowledgeUsageMetrics } from "@/data/knowledgeCenter/analyticsState";
import { getTORequests } from "@/data/knowledgeCenter/requestState";
import { getArticleEdit } from "@/data/knowledgeCenter/articleEdits";
import {
  addUserArticle,
  deleteUserArticle,
  getUserArticles,
  type UserArticle,
} from "@/data/knowledgeCenter/userArticlesState";

interface KCContentBrowserProps {
  role: "admin" | "viewer";
}

// ── Constants ─────────────────────────────────────────────────────────────────

const TAB_OPTIONS: { value: KnowledgeTab | "all"; label: string }[] = [
  { value: "all",                    label: "All" },
  { value: "best-practices",         label: "Best Practices" },
  { value: "testimonials",           label: "Testimonials" },
  { value: "playbooks",              label: "Playbooks" },
  { value: "design-reports",         label: "Design Reports" },
  { value: "policies-procedures",    label: "Policies & Procedures" },
  { value: "executive-summaries",    label: "Executive Summaries" },
  { value: "strategy-docs",          label: "Strategy Docs" },
  { value: "architecture-standards", label: "Architecture Standards" },
  { value: "governance-frameworks",  label: "Governance Frameworks" },
];

const CATEGORY_TABS = TAB_OPTIONS.filter((t) => t.value !== "all") as {
  value: KnowledgeTab;
  label: string;
}[];

const BLANK_FORM = {
  title: "",
  sourceTab: "best-practices" as KnowledgeTab,
  type: "",
  department: "",
  audience: "",
  description: "",
  body: "",
  tags: "",
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

// ── Component ─────────────────────────────────────────────────────────────────

export default function KCContentBrowser({ role }: KCContentBrowserProps) {
  const [search,    setSearch]    = useState("");
  const [activeTab, setActiveTab] = useState<KnowledgeTab | "all">("all");
  const [showForm,  setShowForm]  = useState(false);
  const [form,      setForm]      = useState(BLANK_FORM);
  const [formError, setFormError] = useState("");
  const [userArticles, setUserArticles] = useState<UserArticle[]>(() => getUserArticles());

  // ── Data ──────────────────────────────────────────────────────────────────

  const metrics = useMemo(() => getKnowledgeUsageMetrics(), []);
  const metricById = useMemo(() => new Map(metrics.map((m) => [m.itemId, m])), [metrics]);

  const openRequestsByItem = useMemo(() => {
    const counts = new Map<string, number>();
    getTORequests().forEach((r) => {
      if (r.status !== "Resolved")
        counts.set(r.itemId, (counts.get(r.itemId) ?? 0) + 1);
    });
    return counts;
  }, []);

  const staleFlagItems = useMemo(() => {
    const ids = new Set<string>();
    getTORequests().forEach((r) => {
      if (r.type === "stale-flag" && r.status !== "Resolved") ids.add(r.itemId);
    });
    return ids;
  }, []);

  // Combined static + user-created items
  const allItems = useMemo(() => {
    const userAsKnowledge = userArticles.map((ua) => ({
      id: ua.id,
      sourceId: ua.sourceId,
      sourceTab: ua.sourceTab,
      title: ua.title,
      description: ua.description,
      type: ua.type,
      department: ua.department,
      tags: ua.tags,
      audience: ua.audience,
      difficulty: "",
      phase: "",
      updatedAt: ua.updatedAt,
      author: ua.author,
      isUserCreated: true,
    }));
    return [...knowledgeItems.map((i) => ({ ...i, isUserCreated: false })), ...userAsKnowledge];
  }, [userArticles]);

  const filtered = useMemo(() =>
    allItems.filter((item) => {
      const matchesTab    = activeTab === "all" || item.sourceTab === activeTab;
      const matchesSearch = !search.trim() || item.title.toLowerCase().includes(search.trim().toLowerCase());
      return matchesTab && matchesSearch;
    }),
  [allItems, search, activeTab]);

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleFormChange = (field: keyof typeof BLANK_FORM, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormError("");
  };

  const handleSubmit = () => {
    if (!form.title.trim())       { setFormError("Title is required."); return; }
    if (!form.description.trim()) { setFormError("Description is required."); return; }
    if (!form.body.trim())        { setFormError("Content is required."); return; }
    if (!form.department.trim())  { setFormError("Department is required."); return; }

    addUserArticle({
      sourceTab:   form.sourceTab,
      title:       form.title.trim(),
      description: form.description.trim(),
      body:        form.body.trim(),
      type:        form.type.trim() || "Article",
      department:  form.department.trim(),
      audience:    form.audience.trim() || "All Staff",
      tags:        form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      updatedAt:   new Date().toLocaleDateString("en-GB", { month: "long", year: "numeric" }),
      author:      "Sarah Miller",
      createdBy:   "TO Office",
    });

    setUserArticles(getUserArticles());
    setForm(BLANK_FORM);
    setShowForm(false);
    setFormError("");
  };

  const handleDelete = (id: string) => {
    deleteUserArticle(id);
    setUserArticles(getUserArticles());
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* Toolbar — search + New Article */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 flex-1">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search articles by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        {role === "admin" && (
          <Button
            onClick={() => setShowForm(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white flex-shrink-0 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            New Article
          </Button>
        )}
      </div>

      {/* Category filter */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-wrap gap-2">
        {TAB_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setActiveTab(value)}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
              activeTab === value
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-gray-700 border-gray-200 hover:border-orange-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <p className="text-sm text-gray-500 px-1">
        {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
      </p>

      {/* Content grid */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-10 text-center">
          <p className="text-sm text-gray-500">No articles match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((item) => {
            const metric      = metricById.get(item.id);
            const openCount   = openRequestsByItem.get(item.id) ?? 0;
            const isStaleFlag = staleFlagItems.has(item.id);
            const edit        = getArticleEdit(item.id);
            const editLink    = `/marketplaces/knowledge-center/${item.sourceTab}/${item.sourceId}?mode=edit`;
            const viewLink    = `/marketplaces/knowledge-center/${item.sourceTab}/${item.sourceId}`;

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-xl p-5 shadow-sm transition-all flex flex-col ${
                  item.isUserCreated
                    ? "border-green-200 hover:border-green-300"
                    : isStaleFlag
                    ? "border-red-200 hover:border-red-300"
                    : openCount > 0
                    ? "border-amber-200 hover:border-amber-300"
                    : "border-gray-200 hover:border-orange-200 hover:shadow-md"
                }`}
              >
                {/* Card header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                    {item.title}
                  </h4>
                  <Badge className="bg-orange-50 text-orange-700 border-0 text-xs flex-shrink-0 capitalize">
                    {item.type}
                  </Badge>
                </div>

                {/* Status signals */}
                {(item.isUserCreated || openCount > 0 || edit) && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.isUserCreated && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        TO Created
                      </span>
                    )}
                    {isStaleFlag && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Flagged Stale
                      </span>
                    )}
                    {openCount > 0 && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        {openCount} open request{openCount !== 1 ? "s" : ""}
                      </span>
                    )}
                    {edit && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
                        <Pencil className="w-2.5 h-2.5" />
                        Edited · {fmtDate(edit.editedAt)}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{item.description}</p>

                {/* Metrics */}
                {!item.isUserCreated && (
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span>Views: <strong className="text-gray-700">{metric?.views ?? 0}</strong></span>
                    <span>Saves: <strong className="text-gray-700">{metric?.saves ?? 0}</strong></span>
                    <span>Helpful: <strong className="text-gray-700">{metric?.helpfulVotes ?? 0}</strong></span>
                  </div>
                )}

                {/* Footer actions */}
                <div className="border-t border-gray-100 pt-3 space-y-2 mt-auto">
                  {role === "admin" && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => window.open(editLink, "_blank", "noopener,noreferrer")}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Pencil className="w-3 h-3" />
                        Edit Article
                      </button>
                      {item.isUserCreated && (
                        <button
                          type="button"
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
                          title="Delete article"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{item.updatedAt}</span>
                    <a
                      href={viewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-500 hover:text-orange-600 font-medium flex items-center gap-1 transition-colors"
                    >
                      View in KC
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── New Article slide-over ────────────────────────────────────────── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px]"
          onClick={() => setShowForm(false)}
        >
          <aside
            className="absolute right-0 top-0 h-full w-full max-w-[680px] bg-white border-l border-gray-200 shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Form header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div>
                <p className="font-bold text-gray-900 text-base">Add New Article</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Published to the Knowledge Centre and visible to all users.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                  placeholder="e.g. DEWA Cloud Migration Framework 2026"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Category + Type row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={form.sourceTab}
                    onChange={(e) => handleFormChange("sourceTab", e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
                  >
                    {CATEGORY_TABS.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    Article Type
                  </label>
                  <input
                    type="text"
                    value={form.type}
                    onChange={(e) => handleFormChange("type", e.target.value)}
                    placeholder="e.g. Framework, Policy, Guide"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Department + Audience row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.department}
                    onChange={(e) => handleFormChange("department", e.target.value)}
                    placeholder="e.g. Asset Management"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                    Audience
                  </label>
                  <input
                    type="text"
                    value={form.audience}
                    onChange={(e) => handleFormChange("audience", e.target.value)}
                    placeholder="e.g. Programme Leads"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Tags <span className="text-gray-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => handleFormChange("tags", e.target.value)}
                  placeholder="e.g. Cloud, Migration, EA, Digital"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Description <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">— shown on the article card</span>
                </label>
                <Textarea
                  value={form.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                  placeholder="A short summary of what this article covers and why it's relevant…"
                  rows={3}
                  className="text-sm resize-none"
                />
              </div>

              {/* Body */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">
                  Content <span className="text-red-500">*</span>
                  <span className="text-gray-400 font-normal ml-1">— shown in the article viewer</span>
                </label>
                <Textarea
                  value={form.body}
                  onChange={(e) => handleFormChange("body", e.target.value)}
                  placeholder="Write the full article content here. Use line breaks to separate paragraphs…"
                  rows={10}
                  className="text-sm"
                />
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}
            </div>

            {/* Form footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 flex-shrink-0 bg-gray-50">
              <Button
                variant="outline"
                onClick={() => { setShowForm(false); setForm(BLANK_FORM); setFormError(""); }}
              >
                Cancel
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={handleSubmit}
              >
                Publish Article
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
