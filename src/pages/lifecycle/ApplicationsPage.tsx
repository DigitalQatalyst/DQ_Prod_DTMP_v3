import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { lifecycleInstances } from "@/data/lifecycle/lifecycleData";
import { Link2, Clock } from "lucide-react";

export default function ApplicationsPage() {
  const navigate = useNavigate();
  const apps = lifecycleInstances.filter(i => i.type === 'application-retirement' || i.type === 'application-modernization');

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Application Lifecycle Governance</h1>
        <p className="text-gray-500 mt-1">{apps.length} applications under lifecycle management</p>
      </div>

      <div className="space-y-4">
        {apps.map((app) => (
          <Card key={app.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/stage2/lifecycle/applications/${app.id}`)}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{app.name}</h3>
                    {app.portfolioLink && (
                      <Badge variant="outline" className="text-xs">
                        <Link2 className="w-3 h-3 mr-1" />
                        Portfolio
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(app.forecastEndDate).toLocaleDateString()}
                    </span>
                    <span>Owner: {app.owner.name}</span>
                    <Badge className="text-xs">{app.type.replace('-', ' ')}</Badge>
                  </div>
                </div>
                <Badge className={app.overallHealth === 'on-track' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}>
                  {app.overallHealth}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{app.overallProgress}%</span>
                </div>
                <Progress value={app.overallProgress} className="h-2" />
                {app.expectedBenefits.length > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Expected savings: ${(app.expectedBenefits.reduce((sum, b) => sum + (b.quantifiedValue || 0), 0) / 1000).toFixed(0)}K
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
