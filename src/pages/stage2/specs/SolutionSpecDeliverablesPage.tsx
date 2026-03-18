import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, ChevronUp, Download, Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listDeliveredSolutionSpecs, markSolutionSpecBuildStarted } from "@/data/solutionSpecsWorkspace";
import { getSolutionSpecById } from "@/data/solutionSpecsWorkspace";

const STREAM_PILL: Record<string, string> = {
  DBP: "bg-blue-100 text-blue-700",
  DXP: "bg-purple-100 text-purple-700",
  DWS: "bg-teal-100 text-teal-700",
  DIA: "bg-amber-100 text-amber-700",
  SDO: "bg-red-100 text-red-700",
};

const viewDoc = (title: string, summary: string, specTitle: string) => {
  const html = `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 860px; margin: 48px auto; padding: 0 24px; color: #1a1a1a; }
    h1 { font-size: 1.75rem; font-weight: 700; margin-bottom: 8px; }
    .meta { color: #6b7280; font-size: 0.875rem; margin-bottom: 32px; padding-bottom: 16px; border-bottom: 1px solid #e5e7eb; }
    p { line-height: 1.75; color: #374151; }
    .placeholder { margin-top: 48px; padding: 16px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; color: #92400e; font-size: 0.875rem; }
  </style>
</head>
<body>
  <div class="meta">DEWA DTMP · Solution Specs · ${specTitle}</div>
  <h1>${title}</h1>
  <p>${summary}</p>
  <div class="placeholder">This is a prototype placeholder. The full document will be delivered by the Transformation Office as a PDF upon spec completion.</div>
</body>
</html>`;
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank");
};

const downloadDoc = (title: string, summary: string, specTitle: string) => {
  const content = `DEWA DTMP — Solution Specification Document\n${specTitle}\n${"=".repeat(60)}\n\n${title}\n${"-".repeat(title.length)}\n\n${summary}\n\n[Prototype placeholder — full document delivered by the Transformation Office as a PDF upon spec completion.]`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/[^a-z0-9]/gi, "_")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const downloadAllBlueprints = (
  specTitle: string,
  docs: Array<{ title: string; summary: string }>
) => {
  const lines = docs
    .map((doc, i) => `## ${i + 1}. ${doc.title}\n\n${doc.summary}`)
    .join("\n\n---\n\n");
  const content = `DEWA DTMP — ${specTitle}\nAll Delivered Blueprints\n${"=".repeat(60)}\n\n${lines}\n\n[Prototype placeholder — full documents delivered by the Transformation Office as a ZIP package upon spec completion.]`;
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${specTitle.replace(/[^a-z0-9]/gi, "_")}_Blueprints.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

export default function SolutionSpecDeliverablesPage() {
  const navigate = useNavigate();
  const specs = useMemo(() => listDeliveredSolutionSpecs(), []);
  const [expandedDocs, setExpandedDocs] = useState<string | null>(null);

  return (
    <div className="stage2-content p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/stage2/specs/overview")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Overview
      </Button>

      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">My Specs</h1>
        <p className="text-gray-600">Delivered solution specifications and the bridge into Solution Build.</p>
      </div>

      {specs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
          <FileText className="mb-4 h-12 w-12 text-gray-300" />
          <h3 className="mb-2 text-lg font-semibold text-gray-900">No specs acquired yet</h3>
          <p className="mb-6 max-w-sm text-sm text-gray-500">
            Once the Transformation Office delivers a solution specification, it will appear here for review and action.
          </p>
          <Button variant="outline" onClick={() => navigate("/marketplaces/solution-specs")}>
            Browse Solution Specs
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {specs.map((spec) => {
            const fullSpec = getSolutionSpecById(spec.specId);
            const isExpanded = expandedDocs === spec.id;
            return (
              <div key={spec.id} className="rounded-xl border border-gray-200 bg-white p-5">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STREAM_PILL[spec.stream] ?? "bg-gray-100 text-gray-700"}`}>{spec.stream}</span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 capitalize">{spec.maturityLevel}</span>
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">Acquired</span>
                </div>
                <div className="mb-2 text-lg font-semibold text-gray-900">{spec.specTitle}</div>
                <p className="mb-4 text-sm text-gray-600">{spec.description}</p>
                <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-700">
                  <span>{spec.diagramCount} diagrams</span>
                  <span>{spec.componentCount} components</span>
                  <span>{spec.documentCount} documents</span>
                </div>
                <div className="mb-4 flex flex-wrap gap-2">
                  {spec.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-700">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Inline document list */}
                {isExpanded && fullSpec && (
                  <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-3">Delivered Documents</p>
                    {fullSpec.documents.map((doc) => (
                      <div key={doc.id} className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3">
                        <FileText className="h-4 w-4 shrink-0 text-orange-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{doc.title}</p>
                          <p className="text-xs text-gray-500 truncate">{doc.summary}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs text-gray-600 hover:text-orange-600"
                            onClick={() => viewDoc(doc.title, doc.summary, spec.specTitle)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 gap-1.5 text-xs text-gray-600 hover:text-orange-600"
                            onClick={() => downloadDoc(doc.title, doc.summary, spec.specTitle)}
                          >
                            <Download className="h-3.5 w-3.5" />
                            Download
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setExpandedDocs(isExpanded ? null : spec.id)}
                    className="inline-flex items-center gap-1"
                  >
                    {isExpanded ? "Hide Documents" : "View Documents"}
                    {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      markSolutionSpecBuildStarted(spec.requestId);
                      navigate("/marketplaces/solution-build", {
                        state: {
                          sourceSpecId: spec.specId,
                          sourceSpecTitle: spec.specTitle,
                          sourceStream: spec.stream,
                          requestId: spec.requestId,
                        },
                      });
                    }}
                  >
                    Begin in Solution Build →
                  </Button>
                  <Button
                    variant="ghost"
                    className="inline-flex items-center gap-1.5"
                    onClick={() => fullSpec && downloadAllBlueprints(spec.specTitle, fullSpec.documents)}
                  >
                    <Download className="h-4 w-4" />
                    Download All Blueprints
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
