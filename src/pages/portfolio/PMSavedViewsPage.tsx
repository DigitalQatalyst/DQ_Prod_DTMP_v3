import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, ExternalLink, Trash2, Clock } from "lucide-react";
import { PM_TAB_CONFIG, type PMTab } from "@/data/portfolioManagement";

interface SavedView {
  id: string;
  assetName: string;
  tabSource: PMTab;
  lastVisited: string;
  url: string;
}

const SAVED_KEY = "pm_saved_views";

function getSavedViews(): SavedView[] {
  try {
    const stored = localStorage.getItem(SAVED_KEY);
    if (stored) return JSON.parse(stored) as SavedView[];
  } catch {}
  return DEMO_SAVED;
}

function deleteSavedView(id: string): void {
  const views = getSavedViews().filter((v) => v.id !== id);
  localStorage.setItem(SAVED_KEY, JSON.stringify(views));
}

const DEMO_SAVED: SavedView[] = [
  {
    id: "SV-001",
    assetName: "Transmission Division — Governance Health",
    tabSource: "governance-health",
    lastVisited: "2026-03-26",
    url: "/marketplaces/portfolio-management?tab=governance-health",
  },
  {
    id: "SV-002",
    assetName: "Legacy Billing System (BIS-3)",
    tabSource: "application-portfolio",
    lastVisited: "2026-03-24",
    url: "/marketplaces/portfolio-management?tab=application-portfolio",
  },
  {
    id: "SV-003",
    assetName: "Smart Grid Modernisation Programme",
    tabSource: "transformation-initiatives",
    lastVisited: "2026-03-22",
    url: "/marketplaces/portfolio-management?tab=transformation-initiatives",
  },
];

export default function PMSavedViewsPage() {
  const navigate = useNavigate();
  const [views, setViews] = useState<SavedView[]>(getSavedViews());

  const handleDelete = (id: string) => {
    deleteSavedView(id);
    setViews(getSavedViews());
  };

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-gray-900">Saved Views</h2>
        <p className="text-sm text-gray-500">
          Bookmarked Stage 1 intelligence views — return to specific cards and insights quickly
        </p>
      </div>

      {views.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Bookmark className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No saved views yet</p>
          <p className="text-xs mt-1 text-gray-400">
            Browse Portfolio Management and save card insights views to return to them quickly
          </p>
          <button
            onClick={() => navigate("/marketplaces/portfolio-management")}
            className="mt-4 text-xs bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Browse Portfolio
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {views.map((view) => {
            const tabCfg = PM_TAB_CONFIG[view.tabSource];
            return (
              <div key={view.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4 hover:border-orange-200 transition-colors">
                <div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Bookmark className="w-4 h-4 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {tabCfg.label}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">{view.assetName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <p className="text-xs text-gray-400">Last visited {view.lastVisited}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(view.url)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open
                  </button>
                  <button
                    onClick={() => handleDelete(view.id)}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-red-50 hover:border-red-200 hover:text-red-600 text-gray-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
