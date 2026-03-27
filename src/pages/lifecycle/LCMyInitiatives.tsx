import { useMemo } from "react";
import { Eye, Briefcase } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

import {
  getInitiatives,
  getProjects,
  type Initiative,
  type InitiativeStatus,
} from "@/data/shared/lifecyclePortfolioStore";
import { getDemoAccount, getLifecycleRole, type LifecycleInsightsRole } from "@/data/shared/lifecycleRole";

const STATUS_BADGE: Record<InitiativeStatus, string> = {
  Active: "bg-teal-100 text-teal-700 border-teal-200",
  Scoping: "bg-blue-100 text-blue-700 border-blue-200",
  "At Risk": "bg-amber-100 text-amber-800 border-amber-200",
  "On Hold": "bg-slate-200 text-slate-600 border-slate-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
};

function getMyInitiativesForUser(userName: string, initiatives: Initiative[], projects: ReturnType<typeof getProjects>) {
  const mine: Initiative[] = [];

  for (const ini of initiatives) {
    if (ini.owner === userName) {
      mine.push(ini);
      continue;
    }
    const isPM = projects.some((p) => p.parentInitiativeId === ini.id && p.pmName === userName);
    if (isPM) mine.push(ini);
  }
  return mine;
}

export default function LCMyInitiatives() {
  const role = getLifecycleRole() ?? "initiative-owner";
  const account = getDemoAccount(role);

  const initiatives = useMemo(() => getInitiatives(), []);
  const projects = useMemo(() => getProjects(), []);

  const myInitiatives = useMemo(() => getMyInitiativesForUser(account.name, initiatives, projects), [initiatives, projects, account.name]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Initiatives</h1>
          <p className="text-gray-500 mt-1">Quick list of initiatives where you are owner or PM.</p>
        </div>
        <Badge variant="outline" className="border-gray-200">
          {myInitiatives.length} initiatives
        </Badge>
      </div>

      {myInitiatives.length === 0 ? (
        <Card>
          <CardContent className="p-5 text-sm text-gray-600">
            No initiatives found for your demo role ({account.title}). Try switching role using the “Select Your Role” demo selector in Stage 1.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {myInitiatives.map((ini) => (
            <Card key={ini.id}>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-teal-600" />
                      <h2 className="text-lg font-semibold text-gray-900 truncate">{ini.name}</h2>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{ini.type}</p>
                  </div>
                  <Badge className={`${STATUS_BADGE[ini.status]} border`}>{ini.status}</Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span className="font-medium text-gray-700">{ini.progress}%</span>
                  </div>
                  <Progress value={ini.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="border-gray-200 text-xs">
                      Division: {ini.division}
                    </Badge>
                    <Badge variant="outline" className="border-gray-200 text-xs">
                      EA Alignment: {ini.eaAlignmentScore === null ? "TBD" : `${ini.eaAlignmentScore}%`}
                    </Badge>
                  </div>

                  <Button
                    onClick={() => {
                      window.localStorage.setItem("dtmp.lifecycle.openInitiativeId", ini.id);
                      toast({
                        title: "Opening Lifecycle",
                        description: "Stage 1 will open the “See Insights” cockpit for this initiative (demo/localStorage).",
                      });
                      window.location.href = "/marketplaces/lifecycle-management";
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    Open Cockpit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

