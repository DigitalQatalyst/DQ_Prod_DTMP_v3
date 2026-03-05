import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { BuildRequestType, BuildPriority } from "@/data/solutionBuild";

type WizardStep = 1 | 2 | 3 | 4;

interface FormData {
  // Step 1
  type: BuildRequestType | '';
  name: string;
  department: string;
  // Step 2
  businessNeed: string;
  sponsor: string;
  linkedSpecId: string;
  linkedInitiativeId: string;
  // Step 3
  requirements: string;
  technologyStack: string;
  // Step 4
  targetDate: string;
  budgetEstimate: string;
  priority: BuildPriority | '';
}

export default function BuildRequestWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prebuiltId = searchParams.get('prebuilt');
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [formData, setFormData] = useState<FormData>({
    type: '',
    name: '',
    department: '',
    businessNeed: '',
    sponsor: '',
    linkedSpecId: '',
    linkedInitiativeId: '',
    requirements: '',
    technologyStack: '',
    targetDate: '',
    budgetEstimate: '',
    priority: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Pre-fill form if coming from pre-built solution
  useEffect(() => {
    if (prebuiltId) {
      const { preBuiltSolutions } = require('@/data/solutionBuild');
      const solution = preBuiltSolutions.find((s: any) => s.id === prebuiltId);
      if (solution) {
        setFormData(prev => ({
          ...prev,
          type: 'pre-built',
          name: solution.name,
          requirements: solution.features.join('\n- '),
          technologyStack: solution.technicalRequirements.join(', '),
        }));
      }
    }
  }, [prebuiltId]);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = (step: WizardStep): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (step === 1) {
      if (!formData.type) newErrors.type = 'Request type is required';
      if (!formData.name.trim()) newErrors.name = 'Request name is required';
      if (!formData.department.trim()) newErrors.department = 'Department is required';
    } else if (step === 2) {
      if (!formData.businessNeed.trim()) newErrors.businessNeed = 'Business need is required';
      if (!formData.sponsor.trim()) newErrors.sponsor = 'Sponsor is required';
    } else if (step === 3) {
      if (!formData.requirements.trim()) newErrors.requirements = 'At least one requirement is required';
    } else if (step === 4) {
      if (!formData.priority) newErrors.priority = 'Priority is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4) as WizardStep);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1) as WizardStep);
  };

  const handleSubmit = () => {
    if (validateStep(4)) {
      console.log('Form submitted:', formData);
      // TODO: Save to data store
      navigate('/stage2', { state: { marketplace: 'solution-build', action: 'requests' } });
    }
  };

  const steps = [
    { number: 1, title: 'Type & Name', description: 'Basic information' },
    { number: 2, title: 'Business Need', description: 'Requirements & links' },
    { number: 3, title: 'Requirements', description: 'Technical details' },
    { number: 4, title: 'Timeline & Budget', description: 'Planning details' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/marketplaces/solution-build')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Solution Build
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {formData.type === 'custom' ? 'Request Custom Build' : 'New Build Request'}
          </h1>
          <p className="text-gray-500">
            {formData.type === 'custom'
              ? 'Tell us what you need and our expert delivery teams will build it'
              : 'Submit a new solution build request'}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                      currentStep > step.number
                        ? 'bg-green-600 text-white'
                        : currentStep === step.number
                        ? 'bg-orange-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {currentStep > step.number ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm font-medium text-gray-900">{step.title}</p>
                    <p className="text-xs text-gray-500">{step.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-4 ${
                      currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Step 1: Type & Name */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="type">Request Type *</Label>
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => updateFormData('type', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="pre-built" id="pre-built" />
                    <Label htmlFor="pre-built" className="flex-1 cursor-pointer">
                      <div className="font-medium">Pre-Built Solution</div>
                      <div className="text-xs text-gray-500">Deploy a pre-configured solution</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom" className="flex-1 cursor-pointer">
                      <div className="font-medium">Custom Build</div>
                      <div className="text-xs text-gray-500">Build a new solution from scratch</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="enhancement" id="enhancement" />
                    <Label htmlFor="enhancement" className="flex-1 cursor-pointer">
                      <div className="font-medium">Enhancement</div>
                      <div className="text-xs text-gray-500">Enhance an existing solution</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="integration" id="integration" />
                    <Label htmlFor="integration" className="flex-1 cursor-pointer">
                      <div className="font-medium">Integration</div>
                      <div className="text-xs text-gray-500">Integrate multiple systems</div>
                    </Label>
                  </div>
                </RadioGroup>
                {errors.type && <p className="text-sm text-red-600 mt-1">{errors.type}</p>}
              </div>

              <div>
                <Label htmlFor="name">
                  {formData.type === 'custom' ? 'What do you want to build? *' : 'Request Name *'}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder={
                    formData.type === 'custom'
                      ? "e.g., Customer Analytics Dashboard, Inventory Management System"
                      : "e.g., Customer 360 Data Platform"
                  }
                  className="mt-1"
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => updateFormData('department', value)}>
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
            </div>
          )}

          {/* Step 2: Business Need */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="businessNeed">
                  {formData.type === 'custom' ? 'What problem are you solving? *' : 'Business Need *'}
                </Label>
                <Textarea
                  id="businessNeed"
                  value={formData.businessNeed}
                  onChange={(e) => updateFormData('businessNeed', e.target.value)}
                  placeholder={
                    formData.type === 'custom'
                      ? "Describe the business problem or opportunity:\n- What challenge are you facing?\n- Who will use this solution?\n- What outcomes do you expect?"
                      : "Describe the business problem or opportunity this build will address..."
                  }
                  rows={4}
                  className="mt-1"
                />
                {errors.businessNeed && <p className="text-sm text-red-600 mt-1">{errors.businessNeed}</p>}
              </div>

              <div>
                <Label htmlFor="sponsor">Executive Sponsor *</Label>
                <Input
                  id="sponsor"
                  value={formData.sponsor}
                  onChange={(e) => updateFormData('sponsor', e.target.value)}
                  placeholder="e.g., Michael Chen"
                  className="mt-1"
                />
                {errors.sponsor && <p className="text-sm text-red-600 mt-1">{errors.sponsor}</p>}
              </div>

              {formData.type !== 'custom' && (
                <>
                  <div>
                    <Label htmlFor="linkedSpecId">Linked Solution Spec (Optional)</Label>
                    <Input
                      id="linkedSpecId"
                      value={formData.linkedSpecId}
                      onChange={(e) => updateFormData('linkedSpecId', e.target.value)}
                      placeholder="e.g., spec-cdp-001"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Link to an existing solution specification</p>
                  </div>

                  <div>
                    <Label htmlFor="linkedInitiativeId">Linked Initiative (Optional)</Label>
                    <Input
                      id="linkedInitiativeId"
                      value={formData.linkedInitiativeId}
                      onChange={(e) => updateFormData('linkedInitiativeId', e.target.value)}
                      placeholder="e.g., init-exec-dashboard"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Link to a strategic initiative</p>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 3: Requirements */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="requirements">
                  {formData.type === 'custom' ? 'Solution Requirements *' : 'Requirements *'}
                </Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => updateFormData('requirements', e.target.value)}
                  placeholder={
                    formData.type === 'custom'
                      ? "Describe what you want to build:\n- Key features and capabilities\n- User workflows and interactions\n- Data requirements\n- Integration needs"
                      : "List key requirements (one per line):\n- Integrate CRM, ERP, and web analytics\n- Real-time data synchronization\n- Customer segmentation engine"
                  }
                  rows={6}
                  className="mt-1"
                />
                {errors.requirements && <p className="text-sm text-red-600 mt-1">{errors.requirements}</p>}
              </div>

              <div>
                <Label htmlFor="technologyStack">
                  {formData.type === 'custom' ? 'Preferred Technology Stack (Optional)' : 'Technology Stack (Optional)'}
                </Label>
                <Input
                  id="technologyStack"
                  value={formData.technologyStack}
                  onChange={(e) => updateFormData('technologyStack', e.target.value)}
                  placeholder={
                    formData.type === 'custom'
                      ? "e.g., React, Python, AWS, PostgreSQL - or leave blank for team recommendation"
                      : "e.g., React, Node.js, PostgreSQL, AWS"
                  }
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.type === 'custom'
                    ? 'Our delivery teams will recommend the best stack if not specified'
                    : 'Preferred or required technologies'}
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Timeline & Budget */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="targetDate">Target Completion Date (Optional)</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => updateFormData('targetDate', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="budgetEstimate">Budget Estimate (Optional)</Label>
                <Input
                  id="budgetEstimate"
                  type="number"
                  value={formData.budgetEstimate}
                  onChange={(e) => updateFormData('budgetEstimate', e.target.value)}
                  placeholder="e.g., 150000"
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">Estimated budget in USD</p>
              </div>

              <div>
                <Label htmlFor="priority">Priority *</Label>
                <RadioGroup
                  value={formData.priority}
                  onValueChange={(value) => updateFormData('priority', value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="critical" id="critical" />
                    <Label htmlFor="critical" className="flex-1 cursor-pointer">
                      <div className="font-medium text-red-600">Critical</div>
                      <div className="text-xs text-gray-500">Urgent business need, immediate action required</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="flex-1 cursor-pointer">
                      <div className="font-medium text-orange-600">High</div>
                      <div className="text-xs text-gray-500">Important for business goals</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="flex-1 cursor-pointer">
                      <div className="font-medium text-yellow-600">Medium</div>
                      <div className="text-xs text-gray-500">Standard priority</div>
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="flex-1 cursor-pointer">
                      <div className="font-medium text-gray-600">Low</div>
                      <div className="text-xs text-gray-500">Nice to have, not time-sensitive</div>
                    </Label>
                  </div>
                </RadioGroup>
                {errors.priority && <p className="text-sm text-red-600 mt-1">{errors.priority}</p>}
              </div>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="text-sm text-gray-500">
            Step {currentStep} of 4
          </div>

          {currentStep === 4 ? (
            <Button 
              onClick={handleSubmit} 
              style={{ backgroundColor: '#16a34a', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
              className="hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              style={{ backgroundColor: '#ea580c', color: 'white' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c2410c'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ea580c'}
              className="hover:bg-orange-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
