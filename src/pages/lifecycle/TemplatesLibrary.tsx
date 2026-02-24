import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { lifecycleTemplates } from "@/data/lifecycle/lifecycleData";
import { Star, Users, Clock } from "lucide-react";

export default function TemplatesLibrary() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Lifecycle Templates Library</h1>
          <p className="text-gray-500 mt-1">Pre-built frameworks and stage-gate processes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lifecycleTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/stage2/lifecycle/templates/${template.id}`)}>
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <Badge variant="outline">{template.category}</Badge>
                <Badge className={template.complexity === 'complex' ? 'bg-red-100 text-red-700' : template.complexity === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}>
                  {template.complexity}
                </Badge>
              </div>
              <CardTitle className="text-lg">{template.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{template.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Duration
                  </span>
                  <span className="font-medium">{template.totalDuration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Usage
                  </span>
                  <span className="font-medium">{template.usageCount} times</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Rating
                  </span>
                  <span className="font-medium">{template.rating}/5.0 ({template.reviewCount})</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline">View Template</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
