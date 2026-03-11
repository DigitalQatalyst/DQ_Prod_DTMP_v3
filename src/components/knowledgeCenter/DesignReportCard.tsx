import { FileText, Download } from "lucide-react";
import type { DewaDocumentItem } from "@/data/knowledgeCenter/dewaDocuments";

interface DesignReportCardProps {
  report: DewaDocumentItem;
  onClick: () => void;
}

export function DesignReportCard({ report, onClick }: DesignReportCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-center justify-between mb-4">
        <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs font-semibold">
          {report.docTypeLabel}
        </span>
        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
          {report.format}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{report.title}</h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{report.description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {report.division && (
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs">{report.division}</span>
        )}
        {report.stream && (
          <span className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs">{report.stream}</span>
        )}
      </div>

      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-xs text-gray-600">{report.publishedDate}</span>
        <span className={`flex items-center gap-1 text-sm font-medium ${
          report.comingSoon ? "text-gray-400" : "text-orange-600"
        }`}>
          <Download className="w-4 h-4" />
          {report.comingSoon ? "Coming Soon" : "View Resource"}
        </span>
      </div>
    </div>
  );
}
