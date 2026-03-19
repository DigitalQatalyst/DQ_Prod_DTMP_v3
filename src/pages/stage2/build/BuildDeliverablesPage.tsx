import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listBuildRequests } from "@/data/solutionBuildWorkspace";
import { STREAM_COLORS } from "@/data/blueprints/solutionBuilds";

export default function BuildDeliverablesPage() {
  const navigate = useNavigate();
  const completed = listBuildRequests().filter(r => r.status === "Complete");

  return (
    <div className="stage2-content p-6">
      <Button variant="ghost" size="sm" onClick={() => navigate("/stage2/build/overview")} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Overview
      </Button>

      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">My Completed Builds</h1>
        <p className="text-gray-600">Build solutions that have been fully delivered and accepted.</p>
      </div>

      {completed.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
          <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed builds yet</h3>
          <p className="text-gray-500 text-sm mb-6">Completed builds will appear here once delivered.</p>
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => navigate("/stage2/build/requests")}
          >
            View My Requests
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {completed.map(req => {
            const streamColors = STREAM_COLORS[req.stream] ?? STREAM_COLORS["DBP"];
            const completedMilestone = req.milestones.find(m => m.id === "golive");
            return (
              <div key={req.id} className="rounded-xl border border-gray-200 bg-white overflow-hidden">
                <div className={`${streamColors.headerBg} px-5 py-3 flex items-center justify-between`}>
                  <span className="text-xs text-white/80 font-medium uppercase tracking-wide">{req.stream}</span>
                  <CheckCircle2 className="w-4 h-4 text-white/80" />
                </div>
                <div className="p-5">
                  <p className="font-mono text-xs text-gray-400 mb-2">{req.id}</p>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{req.buildTitle}</h3>
                  <p className="text-sm text-gray-500 mb-3">{req.dewaDivision}</p>
                  {completedMilestone?.completedAt && (
                    <p className="text-xs text-gray-400">
                      Completed: {new Date(completedMilestone.completedAt).toLocaleDateString("en-GB")}
                    </p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                      Complete
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                      {req.priority} Priority
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={() => navigate("/stage2/build/requests")}
                  >
                    <Rocket className="w-3.5 h-3.5 mr-1" />
                    View Details
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
