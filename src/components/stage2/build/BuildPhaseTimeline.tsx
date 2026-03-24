import { CheckCircle } from "lucide-react";
import type { BuildLifecyclePhase } from "@/data/solutionBuild/types";

const BUILD_PHASES: BuildLifecyclePhase[] = ["Scoping", "Configuration", "Build", "UAT", "Go-Live"];

interface BuildPhaseTimelineProps {
  currentPhase: BuildLifecyclePhase;
}

export function BuildPhaseTimeline({ currentPhase }: BuildPhaseTimelineProps) {
  const currentIndex = BUILD_PHASES.indexOf(currentPhase);

  return (
    <div className="flex items-center gap-0 mt-4 mb-2">
      {BUILD_PHASES.map((phase, index) => (
        <div key={phase} className="flex items-center flex-1">
          <div className="flex flex-col items-center flex-1">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                index < currentIndex
                  ? "bg-green-500 text-white"
                  : index === currentIndex
                  ? "bg-orange-600 text-white ring-4 ring-orange-100"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {index < currentIndex ? <CheckCircle className="w-4 h-4" /> : index + 1}
            </div>
            <span
              className={`text-[11px] mt-1 text-center ${
                index === currentIndex ? "font-semibold text-orange-600" : "text-gray-500"
              }`}
            >
              {phase}
            </span>
          </div>
          {index < BUILD_PHASES.length - 1 && (
            <div
              className={`flex-1 h-0.5 mb-4 ${
                index < currentIndex ? "bg-green-400" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
