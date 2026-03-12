import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  addBlueprintTORequest,
  linkBlueprintTORequestToStage3,
} from "@/data/blueprints/requestState";
import { createStage3Request } from "@/data/stage3";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LocationState {
  specId?: string;
  serviceName?: string;
}

type RequestType = "current-build" | "enhancement" | "integration" | "";

interface FormData {
  requestType: RequestType;
  solutionName: string;
  businessNeed: string;
  requirements: string;
  timeline: string;
}

const REQUEST_TYPES = [
  { value: "current-build", label: "Current Build",  description: "Adopt the blueprint as-is without modifications" },
  { value: "enhancement",   label: "Enhancement",    description: "Enhance an existing solution" },
  { value: "integration",   label: "Integration",    description: "Integrate multiple systems" },
] as const;

const TIMELINE_OPTIONS = [
  "Less than 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "6 – 12 months",
  "More than 12 months",
];

export default function SolutionSpecRequestForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state as LocationState) || {};

  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    requestType: "",
    solutionName: state.serviceName || "",
    businessNeed: "",
    requirements: "",
    timeline: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleClose = () => {
    setOpen(false);
    navigate("/marketplaces/solution-specs");
  };

  const handleSubmit = () => {
    const errors: Record<string, string> = {};
    if (!formData.requestType)          errors.requestType  = "Required";
    if (!formData.solutionName.trim())  errors.solutionName = "Required";
    if (!formData.businessNeed.trim())  errors.businessNeed = "Required";
    if (!formData.requirements.trim())  errors.requirements = "Required";
    if (!formData.timeline)             errors.timeline     = "Required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const blueprintRequest = addBlueprintTORequest({
      itemId: state.specId ?? `custom-${Date.now()}`,
      itemTitle: formData.solutionName,
      marketplace: "solution-specs",
      requesterName: "Amina TO",
      requesterRole: "Portfolio Manager",
      message: JSON.stringify({
        requestType: formData.requestType,
        timeline: formData.timeline,
        businessNeed: formData.businessNeed,
        requirements: formData.requirements,
      }),
    });

    if (blueprintRequest) {
      const stage3Request = createStage3Request({
        type: "solution-specs",
        title: `Solution Spec Build: ${formData.solutionName}`,
        description: formData.businessNeed,
        requester: {
          name: "Amina TO",
          email: "amina.to@dtmp.local",
          department: "Transformation Office",
          organization: "DTMP",
        },
        priority: "medium",
        estimatedHours: 16,
        tags: ["solution-specs", formData.requestType.replace("-", " ")],
        relatedAssets: [`solution-spec-request:${blueprintRequest.id}`],
        notes: [
          `Request Type: ${formData.requestType}`,
          `Timeline: ${formData.timeline}`,
          `Business Need: ${formData.businessNeed}`,
          `Requirements: ${formData.requirements}`,
        ],
      });
      linkBlueprintTORequestToStage3(blueprintRequest.id, stage3Request.id);
    }

    setOpen(false);
    navigate("/stage2/specs/overview", {
      state: {
        fromRequest: true,
        specId: state.specId,
        serviceName: formData.solutionName,
        requestType: formData.requestType,
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            New Solution Spec Request
          </DialogTitle>
          <p className="text-sm text-gray-500 mt-1">
            Submit a custom solution specification build request
          </p>
        </DialogHeader>

        <div className="space-y-6 mt-2">

          {/* Request Type */}
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Request Type <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.requestType}
              onValueChange={(v) => {
                setFormData({ ...formData, requestType: v as RequestType });
                setFormErrors({ ...formErrors, requestType: "" });
              }}
              className="space-y-2"
            >
              {REQUEST_TYPES.map((type) => (
                <div
                  key={type.value}
                  onClick={() => {
                    setFormData({ ...formData, requestType: type.value });
                    setFormErrors({ ...formErrors, requestType: "" });
                  }}
                  className={`flex items-center gap-3 rounded-lg border-2 px-4 py-3 cursor-pointer transition-all ${
                    formData.requestType === type.value
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                  }`}
                >
                  <RadioGroupItem value={type.value} id={`rt-${type.value}`} className="flex-shrink-0" />
                  <div>
                    <Label htmlFor={`rt-${type.value}`} className="text-sm font-semibold text-gray-900 cursor-pointer block">
                      {type.label}
                    </Label>
                    <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
            {formErrors.requestType && <p className="text-xs text-red-600 mt-1">{formErrors.requestType}</p>}
          </div>

          {/* Solution Name */}
          <div>
            <Label htmlFor="rf-solutionName" className="text-sm font-semibold text-gray-900 mb-2 block">
              Solution Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="rf-solutionName"
              value={formData.solutionName}
              onChange={(e) => {
                setFormData({ ...formData, solutionName: e.target.value });
                setFormErrors({ ...formErrors, solutionName: "" });
              }}
              placeholder="Enter a name for this solution request"
              className="w-full"
            />
            {formErrors.solutionName && <p className="text-xs text-red-600 mt-1">{formErrors.solutionName}</p>}
          </div>

          {/* Business Need */}
          <div>
            <Label htmlFor="rf-businessNeed" className="text-sm font-semibold text-gray-900 mb-1 block">
              Business Need <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500 mb-2">Describe the business problem or opportunity this solution should address.</p>
            <Textarea
              id="rf-businessNeed"
              value={formData.businessNeed}
              onChange={(e) => {
                setFormData({ ...formData, businessNeed: e.target.value });
                setFormErrors({ ...formErrors, businessNeed: "" });
              }}
              placeholder="e.g. We need to unify our customer data across 5 regional systems to enable real-time personalisation..."
              rows={4}
              className="w-full resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{formData.businessNeed.length} characters</p>
            {formErrors.businessNeed && <p className="text-xs text-red-600">{formErrors.businessNeed}</p>}
          </div>

          {/* Requirements */}
          <div>
            <Label htmlFor="rf-requirements" className="text-sm font-semibold text-gray-900 mb-1 block">
              Requirements <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-gray-500 mb-2">List the functional and non-functional requirements for this solution.</p>
            <Textarea
              id="rf-requirements"
              value={formData.requirements}
              onChange={(e) => {
                setFormData({ ...formData, requirements: e.target.value });
                setFormErrors({ ...formErrors, requirements: "" });
              }}
              placeholder={`e.g.\n• Must integrate with SAP and Salesforce\n• Real-time data synchronisation\n• Role-based access control`}
              rows={4}
              className="w-full resize-none"
            />
            <p className="text-xs text-gray-400 mt-1">{formData.requirements.length} characters</p>
            {formErrors.requirements && <p className="text-xs text-red-600">{formErrors.requirements}</p>}
          </div>

          {/* Timeline */}
          <div>
            <Label className="text-sm font-semibold text-gray-900 mb-3 block">
              Expected Timeline <span className="text-red-500">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {TIMELINE_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, timeline: option });
                    setFormErrors({ ...formErrors, timeline: "" });
                  }}
                  className={`text-left px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    formData.timeline === option
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-gray-200 text-gray-700 hover:border-orange-300 hover:bg-gray-50"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            {formErrors.timeline && <p className="text-xs text-red-600 mt-1">{formErrors.timeline}</p>}
          </div>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3"
          >
            <Check className="w-4 h-4 mr-2" />
            Submit Request
          </Button>

        </div>
      </DialogContent>
    </Dialog>
  );
}
