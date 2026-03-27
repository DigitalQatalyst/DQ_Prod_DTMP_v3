import { useState } from "react";
import { FileText, Download, Eye, Search } from "lucide-react";
import { getPMReports, type PMReport } from "@/data/portfolioManagement/serviceRequests";
import { PM_TAB_CONFIG, type PMTab } from "@/data/portfolioManagement";

export default function PMMyReportsPage() {
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState<PMTab | "All">("All");
  const [formatFilter, setFormatFilter] = useState<"All" | "PDF" | "PPTX">("All");

  const all = getPMReports();

  const filtered = all.filter((r) => {
    if (tabFilter !== "All" && r.tabSource !== tabFilter) return false;
    if (formatFilter !== "All" && r.format !== formatFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!r.reportTitle.toLowerCase().includes(q) && !r.reportType.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-5 max-w-4xl">
      <div>
        <h2 className="text-lg font-bold text-gray-900">My Reports</h2>
        <p className="text-sm text-gray-500">Delivered governance reports and analysis documents</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reports..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-300"
          />
        </div>
        <select
          value={tabFilter}
          onChange={(e) => setTabFilter(e.target.value as PMTab | "All")}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="All">All Tabs</option>
          {(Object.entries(PM_TAB_CONFIG) as [PMTab, { label: string }][]).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        <select
          value={formatFilter}
          onChange={(e) => setFormatFilter(e.target.value as "All" | "PDF" | "PPTX")}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white"
        >
          <option value="All">All Formats</option>
          <option value="PDF">PDF</option>
          <option value="PPTX">PPTX</option>
        </select>
      </div>

      {/* Report count */}
      <p className="text-xs text-gray-500">{filtered.length} report{filtered.length !== 1 ? "s" : ""}</p>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No reports delivered yet</p>
          <p className="text-xs mt-1 text-gray-400">Submit a report request from any Portfolio Management card</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((report) => (
            <div key={report.id} className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${report.format === "PPTX" ? "bg-orange-100" : "bg-red-100"}`}>
                <FileText className={`w-5 h-5 ${report.format === "PPTX" ? "text-orange-600" : "text-red-600"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${report.format === "PPTX" ? "bg-orange-100 text-orange-700" : "bg-red-100 text-red-700"}`}>
                    {report.format}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{report.tabLabel}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900 truncate">{report.reportTitle}</p>
                <p className="text-xs text-gray-400">{report.reportType} · Delivered {report.deliveredDate}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors">
                  <Eye className="w-3.5 h-3.5" />
                  View
                </button>
                <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white transition-colors">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
