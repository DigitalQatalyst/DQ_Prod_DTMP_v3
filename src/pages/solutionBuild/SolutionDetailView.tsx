import { Clock, DollarSign, Wrench, CheckCircle2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PreBuiltSolution, SolutionType } from "@/data/solutionBuild";

interface SolutionDetailViewProps {
  solution: PreBuiltSolution;
  onSubmit: () => void;
  onCustomize: () => void;
  getSolutionTypeColor: (type: SolutionType) => string;
}

export default function SolutionDetailView({ solution, onSubmit, onCustomize, getSolutionTypeColor }: SolutionDetailViewProps) {
  const enrichedSolution = {
    ...solution,
    estimatedWeeks: `${solution.timelineMin}-${solution.timelineMax}`,
    costRange: `$${(solution.costMin / 1000).toFixed(0)}K - $${(solution.costMax / 1000).toFixed(0)}K`,
    customizationLevel: solution.customizationOptions.length > 3 ? 'High' : solution.customizationOptions.length > 1 ? 'Medium' : 'Low',
    features: solution.deliverables,
  };

  return (
    <div>
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="mb-4">
          <Badge className={getSolutionTypeColor(solution.category)}>{solution.category}</Badge>
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-4">{solution.name}</h1>
        <p className="text-gray-600 mb-6">{solution.description}</p>
        
        <div className="grid grid-cols-3 gap-6">
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
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Request This Solution</h2>
        <div className="space-y-4">
          <div>
            <Label>Department *</Label>
            <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Executive Sponsor *</Label>
            <Select><SelectTrigger className="mt-1"><SelectValue placeholder="Select sponsor" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Priority *</Label>
            <RadioGroup className="mt-2 space-y-2">
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="high" id="s2-high" />
                <Label htmlFor="s2-high" className="flex-1 cursor-pointer"><div className="font-medium text-orange-600">High</div></Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="medium" id="s2-medium" />
                <Label htmlFor="s2-medium" className="flex-1 cursor-pointer"><div className="font-medium text-yellow-600">Medium</div></Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex gap-3 pt-2">
            <Button 
              className="flex-1" 
              onClick={onSubmit}
              style={{ backgroundColor: '#16a34a', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
            >
              <CheckCircle className="w-4 h-4 mr-2" />Submit Request
            </Button>
            <Button variant="outline" className="flex-1" onClick={onCustomize}>
              Customize Request
            </Button>
          </div>
        </div>
      </div>
      
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
      
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Technical Requirements</h2>
        <div className="space-y-2">
          {solution.technicalRequirements.map((req, index) => (
            <div key={index} className="flex items-start">
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0" />
              <span className="text-gray-700">{req}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
