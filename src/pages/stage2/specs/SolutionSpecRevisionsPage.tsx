import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  listSolutionSpecRequests,
  listSolutionSpecRevisions,
  raiseSolutionSpecRevision,
} from "@/data/solutionSpecsWorkspace";

export default function SolutionSpecRevisionsPage() {
  const navigate = useNavigate();
  const requests = useMemo(
    () => listSolutionSpecRequests().filter((request) => request.status === "Completed"),
    []
  );
  const revisions = useMemo(() => listSolutionSpecRevisions(), []);
  const [selectedRequestId, setSelectedRequestId] = useState<string>(requests[0]?.id ?? "");
  const [note, setNote] = useState("");

  return (
    <div className="stage2-content p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/stage2/specs/overview")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Overview
      </Button>

      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">Revisions</h1>
        <p className="text-gray-600">Raise revisions for delivered specs and track the linked follow-up tickets.</p>
      </div>

      <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Raise Revision</h2>
        <div className="grid gap-4">
          <select
            value={selectedRequestId}
            onChange={(e) => setSelectedRequestId(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm"
          >
            {requests.map((request) => (
              <option key={request.id} value={request.id}>
                {request.specTitle}
              </option>
            ))}
          </select>
          <Textarea
            rows={4}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe the revision required."
          />
          <div>
            <Button
              onClick={() => {
                const revision = raiseSolutionSpecRevision(selectedRequestId, note);
                if (revision) {
                  setNote("");
                  navigate("/stage2/specs/revisions", { replace: true });
                }
              }}
              disabled={!selectedRequestId || !note.trim()}
            >
              Submit Revision
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {revisions.map((revision) => (
          <div key={revision.id} className="rounded-xl border border-gray-200 bg-white p-5">
            <div className="mb-2 text-sm font-semibold text-gray-900">{revision.id}</div>
            <div className="mb-2 text-sm text-gray-500">
              Linked Request: {revision.requestId} • {new Date(revision.createdAt).toLocaleDateString("en-US")}
            </div>
            <p className="mb-3 text-sm text-gray-700">{revision.note}</p>
            <span className="rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700">
              {revision.status}
            </span>
          </div>
        ))}
        {revisions.length === 0 && <p className="text-sm text-gray-500">No revisions raised yet.</p>}
      </div>
    </div>
  );
}
