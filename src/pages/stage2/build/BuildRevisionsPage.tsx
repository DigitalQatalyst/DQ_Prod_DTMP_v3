import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listBuildRevisions, listBuildRequests } from "@/data/solutionBuildWorkspace";

const REVISION_STATUS_COLORS: Record<string, string> = {
  "Revision Raised": "bg-red-100 text-red-700",
  "In Review": "bg-amber-100 text-amber-700",
  Resolved: "bg-green-100 text-green-700",
};

export default function BuildRevisionsPage() {
  const navigate = useNavigate();
  const revisions = listBuildRevisions();
  const requests = listBuildRequests();

  const revisionItems = revisions.map(rev => {
    const req = requests.find(r => r.id === rev.requestId);
    return { rev, req };
  });

  return (
    <div className="stage2-content p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">My Revisions</h1>
        <p className="text-gray-600">Revision requests raised against completed build deliveries.</p>
      </div>

      {revisionItems.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <RefreshCw className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No revisions yet</h3>
          <p className="text-gray-500 text-sm mb-6">
            Revisions can be raised from completed build requests in the My Requests section.
          </p>
          <Button
            variant="outline"
            onClick={() => navigate("/stage2/solution-build/my-requests")}
          >
            View My Requests
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {revisionItems.map(({ rev, req }) => (
            <div key={rev.id} className="rounded-xl border border-gray-200 bg-white p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                <div>
                  <p className="font-mono text-xs text-gray-400 mb-1">{rev.id}</p>
                  {req && (
                    <p className="font-semibold text-gray-900">{req.buildTitle}</p>
                  )}
                  {req && (
                    <p className="text-sm text-gray-500">{req.id} · {req.stream}</p>
                  )}
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${REVISION_STATUS_COLORS[rev.status] ?? "bg-gray-100 text-gray-700"}`}>
                  {rev.status}
                </span>
              </div>
              <div className="rounded-lg border border-red-100 bg-red-50 p-3 mb-3">
                <p className="text-sm text-red-800">{rev.note}</p>
              </div>
              <p className="text-xs text-gray-400">
                Raised: {new Date(rev.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
