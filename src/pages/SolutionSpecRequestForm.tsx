import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  CheckCircle,
  FileText,
  Briefcase,
  ClipboardList,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

interface LocationState {
  specId?: string;
  serviceName?: string;
}

interface FormData {
  requestType: "custom-build" | "enhancement" | "integration" | "";
  solutionName: string;
  businessNeed: string;
  requirements: string;
  timeline: string;
}

const STEPS = [
  { number: 1, label: "Type & Name",   icon: FileText },
  { number: 2, label: "Business Need", icon: Briefcase },
  { number: 3, label: "Requirements",  icon: ClipboardList },
  { number: 4, label: "Timeline", icon: Clock },
];

const REQUEST_TYPES = [
  {
    value: "current-build",
    label: "Current Build",
    description: "Adopt the blueprint as-is without modifications",
  },
  {
    value: "enhancement",
    label: "Enhancement",
    description: "Enhance an existing solution",
  },
  {
    value: "integration",
    label: "Integration",
    description: "Integrate multiple systems",
  },
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

  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    requestType: "",
    solutionName: state.serviceName || "",
    businessNeed: "",
    requirements: "",
    timeline: "",
  });

  const canProceed = () => {
    switch (currentStep) {
      case 1: return formData.requestType !== "" && formData.solutionName.trim() !== "";
      case 2: return formData.businessNeed.trim() !== "";
      case 3: return formData.requirements.trim() !== "";
      case 4: return formData.timeline !== "";
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleGoToStage2 = () => {
    navigate("/stage2/specs/overview", {
      state: {
        fromRequest: true,
        specId: state.specId,
        serviceName: formData.solutionName,
        requestType: formData.requestType,
      },
    });
  };

  // ── Success Screen ──────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <Header />

        {/* Hero band */}
        <div className="bg-gradient-to-br from-orange-600 via-orange-500 to-amber-400 py-16 px-4 text-center text-white">
          {/* Animated check */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
            <div className="relative w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl">
              <CheckCircle className="w-12 h-12 text-orange-600" />
            </div>
          </div>

          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Your Build Journey Begins!</h1>
          <p className="text-orange-100 text-lg max-w-xl mx-auto leading-relaxed">
            <span className="font-semibold text-white">{formData.solutionName}</span> has been queued for review.
            Our architects are already on it.
          </p>
        </div>

        {/* What happens next */}
        <div className="max-w-3xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold text-gray-900 mb-8 text-center">What happens next?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              {
                step: "01",
                icon: "🔍",
                title: "Review",
                desc: "Our solution architects review your requirements within 1–2 business days.",
              },
              {
                step: "02",
                icon: "📐",
                title: "Scoping",
                desc: "We map your needs to the right blueprint and prepare a tailored proposal.",
              },
              {
                step: "03",
                icon: "🚀",
                title: "Kick-off",
                desc: "You're invited into your dedicated workspace to begin the build.",
              },
            ].map((item) => (
              <div key={item.step} className="relative bg-gray-50 border border-gray-200 rounded-xl p-6 text-center hover:border-orange-300 hover:shadow-md transition-all">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Step {item.step}
                </span>
                <div className="text-4xl mb-3 mt-2">{item.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Summary card */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-10 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <ClipboardList className="w-5 h-5 text-orange-600" />
              </div>
              <h3 className="font-bold text-gray-900">Request Summary</h3>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
              <div>
                <p className="text-gray-400 text-xs uppercase font-semibold mb-0.5">Solution</p>
                <p className="font-semibold text-gray-900">{formData.solutionName}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-semibold mb-0.5">Request Type</p>
                <p className="font-semibold text-gray-900 capitalize">{formData.requestType.replace("-", " ")}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs uppercase font-semibold mb-0.5">Timeline</p>
                <p className="font-semibold text-gray-900">{formData.timeline}</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={handleGoToStage2}
              className="bg-orange-600 hover:bg-orange-700 text-white px-10 py-5 h-auto text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all w-full sm:w-auto"
            >
              Open My Workspace
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/marketplaces/solution-specs")}
              className="text-gray-500 hover:text-gray-700 w-full sm:w-auto"
            >
              Back to Solution Specs
            </Button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <nav className="flex items-center text-sm text-muted-foreground flex-wrap">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces" className="hover:text-foreground transition-colors">Marketplaces</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link to="/marketplaces/solution-specs" className="hover:text-foreground transition-colors">Solution Specs</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="font-medium text-foreground">New Request</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">

        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">New Solution Spec Request</h1>
          <p className="text-gray-500">Submit a custom solution specification build request</p>
        </div>

        {/* ── Stepper ── */}
        <div className="mb-10">
          <div className="flex items-start">
            {STEPS.map((step, index) => (
              <div key={step.number} className="flex items-start flex-1">
                {/* Step circle + label */}
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                      currentStep === step.number
                        ? "bg-orange-600 text-white shadow-lg shadow-orange-200"
                        : currentStep > step.number
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      step.number
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium text-center whitespace-nowrap ${
                      currentStep === step.number
                        ? "text-gray-900"
                        : currentStep > step.number
                        ? "text-orange-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>

                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2 mt-5">
                    <div
                      className={`h-full transition-colors duration-300 ${
                        currentStep > step.number ? "bg-orange-400" : "bg-gray-200"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Form Card ── */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8 shadow-sm">

          {/* STEP 1 */}
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <Label className="text-base font-semibold text-gray-900 mb-5 block">
                  Request Type *
                </Label>
                <RadioGroup
                  value={formData.requestType}
                  onValueChange={(v) => setFormData({ ...formData, requestType: v as FormData["requestType"] })}
                  className="space-y-3"
                >
                  {REQUEST_TYPES.map((type) => (
                    <div
                      key={type.value}
                      onClick={() => setFormData({ ...formData, requestType: type.value })}
                      className={`flex items-center gap-4 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                        formData.requestType === type.value
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-200 hover:border-orange-300 hover:bg-gray-50"
                      }`}
                    >
                      <RadioGroupItem value={type.value} id={type.value} className="flex-shrink-0" />
                      <div className="flex-1">
                        <Label htmlFor={type.value} className="text-base font-semibold text-gray-900 cursor-pointer block">
                          {type.label}
                        </Label>
                        <p className="text-sm text-gray-500 mt-0.5">{type.description}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="solutionName" className="text-base font-semibold text-gray-900 mb-2 block">
                  Solution Name *
                </Label>
                <Input
                  id="solutionName"
                  value={formData.solutionName}
                  onChange={(e) => setFormData({ ...formData, solutionName: e.target.value })}
                  placeholder="Enter a name for this solution request"
                  className="w-full h-11"
                />
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Business Need</h2>
                <p className="text-sm text-gray-500 mb-6">Describe the business problem or opportunity this solution should address.</p>
                <Label htmlFor="businessNeed" className="text-base font-semibold text-gray-900 mb-2 block">
                  Business Need *
                </Label>
                <Textarea
                  id="businessNeed"
                  value={formData.businessNeed}
                  onChange={(e) => setFormData({ ...formData, businessNeed: e.target.value })}
                  placeholder="e.g. We need to unify our customer data across 5 regional systems to enable real-time personalisation and reduce manual reconciliation..."
                  rows={9}
                  className="w-full resize-none"
                />
                <p className="text-xs text-gray-400 mt-2">{formData.businessNeed.length} characters</p>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Requirements</h2>
                <p className="text-sm text-gray-500 mb-6">List the functional and non-functional requirements for this solution.</p>
                <Label htmlFor="requirements" className="text-base font-semibold text-gray-900 mb-2 block">
                  Requirements *
                </Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                  placeholder={`e.g.\n• Must integrate with SAP and Salesforce\n• Real-time data synchronisation (< 5s latency)\n• Role-based access control\n• GDPR compliant data handling\n• Mobile-responsive interface`}
                  rows={9}
                  className="w-full resize-none"
                />
                <p className="text-xs text-gray-400 mt-2">{formData.requirements.length} characters</p>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {currentStep === 4 && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Timeline</h2>
                <p className="text-sm text-gray-500 mb-6">Help us understand your expected delivery timeframe.</p>
              </div>

              <div>
                <Label className="text-base font-semibold text-gray-900 mb-4 block">
                  Expected Timeline *
                </Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TIMELINE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeline: option })}
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
              </div>
            </div>
          )}
        </div>

        {/* ── Navigation Footer ── */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="flex items-center gap-2 text-gray-600 disabled:opacity-40"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <span className="text-sm text-gray-400">Step {currentStep} of {STEPS.length}</span>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed px-7"
          >
            {currentStep === STEPS.length ? "Submit Request" : "Next"}
            {currentStep < STEPS.length && <ArrowRight className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

