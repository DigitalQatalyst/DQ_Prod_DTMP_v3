import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { lifecycleInstances } from "@/data/lifecycle/lifecycleData";
import { Plus, Clock } from "lucide-react";

export default function ProjectsPage() {
  const navigate = useNavigate();
  const projects = lifecycleInstances.filter(i => i.type === 'project');

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Lifecycle Management</h1>
          <p className="text-gray-500 mt-1">{projects.length} active projects under governance</p>
        </div>
        <Button onClick={() => navigate('/stage2/lifecycle/projects/new')}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/stage2/lifecycle/projects/${project.id}`)}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{project.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      Due: {new Date(project.forecastEndDate).toLocaleDateString()}
                    </span>
                    <span>Owner: {project.owner.name}</span>
                  </div>
                </div>
                <Badge className={project.overallHealth === 'on-track' ? 'bg-green-100 text-green-700' : project.overallHealth === 'at-risk' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}>
                  {project.overallHealth}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{project.overallProgress}%</span>
                </div>
                <Progress value={project.overallProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
