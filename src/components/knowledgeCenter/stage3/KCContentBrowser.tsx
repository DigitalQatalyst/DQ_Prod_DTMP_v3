import { useMemo, useState } from "react";
import { ExternalLink, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { knowledgeItems, type KnowledgeTab } from "@/data/knowledgeCenter/knowledgeItems";
import { getKnowledgeUsageMetrics } from "@/data/knowledgeCenter/analyticsState";

interface KCContentBrowserProps {
  role: "admin" | "viewer";
}

const TAB_OPTIONS: { value: KnowledgeTab | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "best-practices", label: "Best Practices" },
  { value: "testimonials", label: "Testimonials" },
  { value: "playbooks", label: "Playbooks" },
  { value: "design-reports", label: "Design Reports" },
  { value: "policies-procedures", label: "Policies & Procedures" },
  { value: "executive-summaries", label: "Executive Summaries" },
  { value: "strategy-docs", label: "Strategy Docs" },
  { value: "architecture-standards", label: "Architecture Standards" },
  { value: "governance-frameworks", label: "Governance Frameworks" },
];

export default function KCContentBrowser({ role: _role }: KCContentBrowserProps) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<KnowledgeTab | "all">("all");

  const metrics = useMemo(() => getKnowledgeUsageMetrics(), []);
  const metricById = useMemo(() => {
    return new Map(metrics.map((m) => [m.itemId, m]));
  }, [metrics]);

  const filtered = useMemo(() => {
    return knowledgeItems.filter((item) => {
      const matchesTab = activeTab === "all" || item.sourceTab === activeTab;
      const matchesSearch =
        !search.trim() || item.title.toLowerCase().includes(search.trim().toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [search, activeTab]);

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

      {/* Tab filter */}
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

      {/* Results count */}
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
            const metric = metricById.get(item.id);
            const kcLink = `/marketplaces/knowledge-center/${item.sourceTab}/${item.sourceId}`;
            return (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-orange-200 transition-all"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">
                    {item.title}
                  </h4>
                  <Badge className="bg-orange-50 text-orange-700 border-0 text-xs flex-shrink-0 capitalize">
                    {item.type}
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-3 line-clamp-2">{item.description}</p>

                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span>Views: <strong className="text-gray-700">{metric?.views ?? 0}</strong></span>
                  <span>Saves: <strong className="text-gray-700">{metric?.saves ?? 0}</strong></span>
                  <span>Helpful: <strong className="text-gray-700">{metric?.helpfulVotes ?? 0}</strong></span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-xs text-gray-400">{item.updatedAt}</span>
                  <a
                    href={kcLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1"
                  >
                    View in KC
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
