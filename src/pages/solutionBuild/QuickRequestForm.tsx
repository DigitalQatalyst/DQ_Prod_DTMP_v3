import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { BuildPriority, PreBuiltSolution } from "@/data/solutionBuild";

interface QuickRequestFormProps {
  solution: PreBuiltSolution & {
    estimatedWeeks?: string;
    costRange?: string;
    customizationLevel?: string;
    features?: string[];
  };
  onCustomize: () => void;
}

export default function QuickRequestForm({ solution, onCustomize }: QuickRequestFormProps) {
  const navigate = useNavigate();
  const [department, setDepartment] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [priority, setPriority] = useState<BuildPriority | ''>('');
  const [errors, setErrors] = useState<{ department?: string; sponsor?: string; priority?: string }>({});

  const handleSubmit = () => {
    const newErrors: typeof errors = {};
    if (!department) newErrors.department = 'Department is required';
    if (!sponsor.trim()) newErrors.sponsor = 'Sponsor is required';
    if (!priority) newErrors.priority = 'Priority is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    console.log('Quick request submitted:', { solution: solution.id, department, sponsor, priority });
    navigate('/stage2', { state: { marketplace: 'solution-build', action: 'requests' } });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="department">Department *</Label>
        <Select value={department} onValueChange={(value) => { setDepartment(value); setErrors(prev => ({ ...prev, department: undefined })); }}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Engineering">Engineering</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="Platform">Platform</SelectItem>
            <SelectItem value="Executive">Executive</SelectItem>
            <SelectItem value="Customer Success">Customer Success</SelectItem>
            <SelectItem value="Operations">Operations</SelectItem>
          </SelectContent>
        </Select>
        {errors.department && <p className="text-sm text-red-600 mt-1">{errors.department}</p>}
      </div>

      <div>
        <Label htmlFor="sponsor">Executive Sponsor *</Label>
        <Select value={sponsor} onValueChange={(value) => { setSponsor(value); setErrors(prev => ({ ...prev, sponsor: undefined })); }}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select sponsor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Michael Chen">Michael Chen</SelectItem>
            <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
            <SelectItem value="David Park">David Park</SelectItem>
            <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
          </SelectContent>
        </Select>
        {errors.sponsor && <p className="text-sm text-red-600 mt-1">{errors.sponsor}</p>}
      </div>

      <div>
        <Label>Priority *</Label>
        <RadioGroup value={priority} onValueChange={(value) => { setPriority(value as BuildPriority); setErrors(prev => ({ ...prev, priority: undefined })); }} className="mt-2 space-y-2">
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="critical" id="quick-critical" />
            <Label htmlFor="quick-critical" className="flex-1 cursor-pointer">
              <div className="font-medium text-red-600">Critical</div>
              <div className="text-xs text-gray-500">Urgent business need</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="high" id="quick-high" />
            <Label htmlFor="quick-high" className="flex-1 cursor-pointer">
              <div className="font-medium text-orange-600">High</div>
              <div className="text-xs text-gray-500">Important for business goals</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="medium" id="quick-medium" />
            <Label htmlFor="quick-medium" className="flex-1 cursor-pointer">
              <div className="font-medium text-yellow-600">Medium</div>
              <div className="text-xs text-gray-500">Standard priority</div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
            <RadioGroupItem value="low" id="quick-low" />
            <Label htmlFor="quick-low" className="flex-1 cursor-pointer">
              <div className="font-medium text-gray-600">Low</div>
              <div className="text-xs text-gray-500">Not time-sensitive</div>
            </Label>
          </div>
        </RadioGroup>
        {errors.priority && <p className="text-sm text-red-600 mt-1">{errors.priority}</p>}
      </div>

      <div className="flex gap-3 pt-2">
        <Button 
          onClick={handleSubmit} 
          className="flex-1" 
          style={{ backgroundColor: '#16a34a', color: 'white' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
        >
          <Check className="w-4 h-4 mr-2" />
          Submit Request
        </Button>
        <Button onClick={onCustomize} variant="outline" className="flex-1">
          Customize Request
        </Button>
      </div>
    </div>
  );
}
