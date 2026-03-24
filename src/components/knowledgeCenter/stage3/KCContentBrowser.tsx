import { useMemo, useState } from "react";
import { AlertTriangle, ExternalLink, Pencil, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { knowledgeItems, type KnowledgeTab } from "@/data/knowledgeCenter/knowledgeItems";
import { getKnowledgeUsageMetrics } from "@/data/knowledgeCenter/analyticsState";
import { getTORequests } from "@/data/knowledgeCenter/requestState";
import { getArticleEdit } from "@/data/knowledgeCenter/articleEdits";

interface KCContentBrowserProps {
  role: "admin" | "viewer";
}

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

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function KCContentBrowser({ role }: KCContentBrowserProps) {
  const [search,    setSearch]    = useState("");
  const [activeTab, setActiveTab] = useState<KnowledgeTab | "all">("all");

  // ── Data ────────────────────────────────────────────────────────────────────

  const metrics = useMemo(() => getKnowledgeUsageMetrics(), []);
  const metricById = useMemo(() => new Map(metrics.map((m) => [m.itemId, m])), [metrics]);

  /** Count of open (non-resolved) requests per itemId */
  const openRequestsByItem = useMemo(() => {
    const counts = new Map<string, number>();
    getTORequests().forEach((r) => {
      if (r.status !== "Resolved") {
        counts.set(r.itemId, (counts.get(r.itemId) ?? 0) + 1);
      }
    });
    return counts;
  }, []);

  /** Whether any request for an item is a stale-flag */
  const staleFlagItems = useMemo(() => {
    const ids = new Set<string>();
    getTORequests().forEach((r) => {
      if (r.type === "stale-flag" && r.status !== "Resolved") ids.add(r.itemId);
    });
    return ids;
  }, []);

  const filtered = useMemo(() =>
    knowledgeItems.filter((item) => {
      const matchesTab    = activeTab === "all" || item.sourceTab === activeTab;
      const matchesSearch = !search.trim() || item.title.toLowerCase().includes(search.trim().toLowerCase());
      return matchesTab && matchesSearch;
    }),
  [search, activeTab]);

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-gray-50">
          <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search articles by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
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
            const metric       = metricById.get(item.id);
            const openCount    = openRequestsByItem.get(item.id) ?? 0;
            const isStaleFlag  = staleFlagItems.has(item.id);
            const edit         = getArticleEdit(item.id);
            const editLink     = `/marketplaces/knowledge-center/${item.sourceTab}/${item.sourceId}?mode=edit`;
            const viewLink     = `/marketplaces/knowledge-center/${item.sourceTab}/${item.sourceId}`;

            return (
              <div
                key={item.id}
                className={`bg-white border rounded-xl p-5 shadow-sm transition-all flex flex-col ${
                  isStaleFlag
                    ? "border-red-200 hover:border-red-300"
                    : openCount > 0
                    ? "border-orange-200 hover:border-orange-300"
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

                {/* Status signals row */}
                {(openCount > 0 || edit) && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {isStaleFlag && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                        <AlertTriangle className="w-2.5 h-2.5" />
                        Flagged Stale
                      </span>
                    )}
                    {openCount > 0 && !isStaleFlag && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        {openCount} open request{openCount !== 1 ? "s" : ""}
                      </span>
                    )}
                    {openCount > 0 && isStaleFlag && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                        {openCount} open request{openCount !== 1 ? "s" : ""}
                      </span>
                    )}
                    {edit && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        <Pencil className="w-2.5 h-2.5" />
                        Edited by TO · {fmtDate(edit.editedAt)}
                      </span>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 mb-3 line-clamp-2 flex-1">{item.description}</p>

                {/* Usage metrics */}
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span>Views: <strong className="text-gray-700">{metric?.views ?? 0}</strong></span>
                  <span>Saves: <strong className="text-gray-700">{metric?.saves ?? 0}</strong></span>
                  <span>Helpful: <strong className="text-gray-700">{metric?.helpfulVotes ?? 0}</strong></span>
                </div>

                {/* Footer */}
                <div className="border-t border-gray-100 pt-3 space-y-2">

                  {/* Edit button — admin only */}
                  {role === "admin" && (
                    <button
                      type="button"
                      onClick={() => window.open(editLink, "_blank", "noopener,noreferrer")}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      <Pencil className="w-3 h-3" />
                      Edit Article
                    </button>
                  )}

                  {/* View link */}
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
    </div>
  );
}
