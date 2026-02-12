import { useMemo, useState } from "react";
import SupportLayout from "./SupportLayout";
import { knowledgeArticles, kbCategories } from "@/data/supportData";
import { BookOpen, Search, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KnowledgeBasePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const navigate = useNavigate();

  const filtered = useMemo(() => {
    return knowledgeArticles.filter((a) => {
      const matchesCategory = category === "all" || a.category === category;
      const matchesQuery =
        !query ||
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.summary.toLowerCase().includes(query.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()));
      return matchesCategory && matchesQuery;
    });
  }, [query, category]);

  return (
    <SupportLayout title="Knowledge Base" description="Browse guides, how-tos, and troubleshooting.">
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
          <input
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
            placeholder="Search articles"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 w-full md:w-60"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="all">All categories</option>
          {kbCategories.map((c) => (
            <option key={c.id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((article) => (
          <div
            key={article.id}
            className="bg-white border border-gray-200 rounded-lg p-4 hover:border-orange-200 hover:bg-orange-50/40 transition-colors cursor-pointer"
            onClick={() => navigate(`/stage2/support/knowledge/${article.id}`)}
          >
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <BookOpen size={14} className="text-orange-600" />
              <span>{article.category}</span>
              <span>•</span>
              <span>{article.difficulty}</span>
              <span>•</span>
              <span>{article.estimatedReadTime}</span>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mt-2">{article.title}</h3>
            <p className="text-sm text-gray-700 mt-1 line-clamp-2">{article.summary}</p>
            <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
              {article.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                  <Tag size={12} /> {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-white border border-gray-200 rounded-lg p-6 text-center text-sm text-gray-600">
            No articles found.
          </div>
        )}
      </div>
    </SupportLayout>
  );
}
