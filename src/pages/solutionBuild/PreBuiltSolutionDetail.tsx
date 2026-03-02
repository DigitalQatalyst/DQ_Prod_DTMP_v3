import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, DollarSign, Wrench, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { preBuiltSolutions } from "@/data/solutionBuild";
import type { SolutionType, PreBuiltSolution } from "@/data/solutionBuild";
import QuickRequestForm from "./QuickRequestForm";

interface EnrichedSolution extends PreBuiltSolution {
  estimatedWeeks: string;
  costRange: string;
  customizationLevel: string;
  features: string[];
}

function enrichSolution(solution: PreBuiltSolution): EnrichedSolution {
  return {
    ...solution,
    estimatedWeeks: `${solution.timelineMin}-${solution.timelineMax}`,
    costRange: `$${(solution.costMin / 1000).toFixed(0)}K - $${(solution.costMax / 1000).toFixed(0)}K`,
    customizationLevel: solution.customizationOptions.length > 3 ? 'High' : solution.customizationOptions.length > 1 ? 'Medium' : 'Low',
    features: solution.deliverables,
  };
}

export default function PreBuiltSolutionDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const solution = preBuiltSolutions.find((s) => s.id === id);
  const enrichedSolution = solution ? enrichSolution(solution) : null;

  if (!enrichedSolution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Solution Not Found</h2>
          <Button onClick={() => navigate("/stage2/build/catalog")}>Back to Catalog</Button>
        </div>
      </div>
    );
  }

  const getSolutionTypeLabel = (type: SolutionType) => {
    const labels: Record<SolutionType, string> = {
      DBP: "Data & Business Platform",
      DIA: "Digital Intelligence & Analytics",
      DXP: "Digital Experience Platform",
      SDO: "Software Delivery & Operations",
      DWS: "Digital Workplace Solutions",
    };
    return labels[type];
  };

  const getSolutionTypeColor = (type: SolutionType) => {
    const colors: Record<SolutionType, string> = {
      DBP: "bg-blue-100 text-blue-800",
      DIA: "bg-purple-100 text-purple-800",
      DXP: "bg-green-100 text-green-800",
      SDO: "bg-orange-100 text-orange-800",
      DWS: "bg-pink-100 text-pink-800",
    };
    return colors[type];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/marketplaces/solution-build')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>

        {/* Solution Header */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <Badge className={getSolutionTypeColor(enrichedSolution.category)}>
              {getSolutionTypeLabel(enrichedSolution.category)}
            </Badge>
          </div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">{enrichedSolution.name}</h1>
          <p className="text-gray-600 mb-6">{enrichedSolution.description}</p>

          <div className="grid grid-cols-3 gap-6 mb-6">
            <div className="flex items-center">
              <Clock className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Timeline</p>
                <p className="font-medium text-gray-900">{enrichedSolution.estimatedWeeks} weeks</p>
              </div>
            </div>
            <div className="flex items-center">
              <DollarSign className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Cost Range</p>
                <p className="font-medium text-gray-900">{enrichedSolution.costRange}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Wrench className="w-5 h-5 mr-3 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Customization</p>
                <p className="font-medium text-gray-900">{enrichedSolution.customizationLevel}</p>
              </div>
            </div>
          </div>


        </div>

        {/* Quick Request Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Request This Solution</h2>
          <QuickRequestForm 
            solution={enrichedSolution} 
            onCustomize={() => navigate('/stage2', { state: { marketplace: 'solution-build', action: 'customize', solutionId: enrichedSolution.id } })}
          />
        </div>

        {/* Features */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {enrichedSolution.features.map((feature, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle2 className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Requirements */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Requirements</h2>
          <div className="space-y-2">
            {enrichedSolution.technicalRequirements.map((req, index) => (
              <div key={index} className="flex items-start">
                <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                <span className="text-gray-700">{req}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customization Options */}
        {enrichedSolution.customizationOptions && enrichedSolution.customizationOptions.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customization Options</h2>
            <div className="space-y-2">
              {enrichedSolution.customizationOptions.map((option, index) => (
                <div key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-orange-400 rounded-full mr-3 mt-2 flex-shrink-0" />
                  <span className="text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
