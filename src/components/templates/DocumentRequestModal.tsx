import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { X, FileText, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { createTemplateStage3Intake } from "@/data/stage3/intake";

interface DocumentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: {
    id: string;
    title: string;
  };
  tab: "application-profiles" | "assessments";
  userEmail: string;
  userName: string;
}

export function DocumentRequestModal({
  isOpen,
  onClose,
  template,
  tab,
  userEmail,
  userName,
}: DocumentRequestModalProps) {
  const navigate = useNavigate();

  // Assessment form fields
  const [orgUnit, setOrgUnit] = useState("");
  const [assessmentScope, setAssessmentScope] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [framework, setFramework] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [assessmentOutputFormats, setAssessmentOutputFormats] = useState<string[]>([]);
  const [assessmentNotes, setAssessmentNotes] = useState("");

  // Application Profile form fields
  const [applicationName, setApplicationName] = useState("");
  const [applicationType, setApplicationType] = useState("");
  const [dbpDomain, setDbpDomain] = useState("");
  const [deploymentModel, setDeploymentModel] = useState("");
  const [primaryUsers, setPrimaryUsers] = useState("");
  const [includeIntegrationMap, setIncludeIntegrationMap] = useState(false);
  const [includeTCD, setIncludeTCD] = useState(false);
  const [profileOutputFormats, setProfileOutputFormats] = useState<string[]>([]);
  const [profileNotes, setProfileNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let message = "";
    if (tab === "assessments") {
      message = `Assessment Request: ${template.title}
Organization/Business Unit: ${orgUnit}
Assessment Scope: ${assessmentScope}
Focus Area: ${focusArea}
Framework: ${framework}
Target Audience: ${targetAudience}
Output Formats: ${assessmentOutputFormats.join(", ")}
Additional Notes: ${assessmentNotes}`;
    } else {
      message = `Application Profile Request: ${template.title}
Application Name: ${applicationName}
Application Type: ${applicationType}
DBP Domain: ${dbpDomain}
Deployment Model: ${deploymentModel}
Primary Users: ${primaryUsers}
Include Integration Map: ${includeIntegrationMap ? "Yes" : "No"}
Include TCD: ${includeTCD ? "Yes" : "No"}
Output Formats: ${profileOutputFormats.join(", ")}
Additional Notes: ${profileNotes}`;
    }

    // Create the Stage 3 intake
    createTemplateStage3Intake({
      templateId: template.id,
      templateTitle: template.title,
      tab,
      requesterName: userName,
      requesterEmail: userEmail,
      requesterRole: "Platform User",
      message,
    });

    onClose();
    
    // Navigate to Stage 2 My Requests
    navigate("/stage2/templates/my-requests", {
      state: {
        fromStage1: true,
        templateId: template.id,
        templateTitle: template.title,
      },
    });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const toggleOutputFormat = (format: string, isAssessment: boolean) => {
    if (isAssessment) {
      setAssessmentOutputFormats((prev) =>
        prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
      );
    } else {
      setProfileOutputFormats((prev) =>
        prev.includes(format) ? prev.filter((f) => f !== format) : [...prev, format]
      );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Request Document</h2>
              <p className="text-sm text-gray-600">{template.title}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Read-only selected document */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Selected Document Type</Label>
            <Input
              value={template.title}
              readOnly
              className="bg-gray-50 border-gray-300"
            />
          </div>

          {tab === "assessments" ? (
            <>
              {/* Assessment Form Fields */}
              <div className="space-y-2">
                <Label htmlFor="orgUnit" className="text-sm font-medium text-gray-700">
                  Organisation / Business Unit <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="orgUnit"
                  value={orgUnit}
                  onChange={(e) => setOrgUnit(e.target.value)}
                  placeholder="e.g., Digital Transformation Team"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessmentScope" className="text-sm font-medium text-gray-700">
                  Assessment Scope <span className="text-red-500">*</span>
                </Label>
                <Select value={assessmentScope} onValueChange={setAssessmentScope} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Organisation-wide">Organisation-wide</SelectItem>
                    <SelectItem value="Domain-specific">Domain-specific</SelectItem>
                    <SelectItem value="Project-level">Project-level</SelectItem>
                    <SelectItem value="Application-level">Application-level</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="focusArea" className="text-sm font-medium text-gray-700">
                  Specific Focus Area
                </Label>
                <Input
                  id="focusArea"
                  value={focusArea}
                  onChange={(e) => setFocusArea(e.target.value)}
                  placeholder="e.g., Cloud infrastructure security"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="framework" className="text-sm font-medium text-gray-700">
                  Framework Preference
                </Label>
                <Select value={framework} onValueChange={setFramework}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="COBIT">COBIT</SelectItem>
                    <SelectItem value="ISO 27001">ISO 27001</SelectItem>
                    <SelectItem value="NIST">NIST</SelectItem>
                    <SelectItem value="No Preference">No Preference</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-sm font-medium text-gray-700">
                  Target Audience <span className="text-red-500">*</span>
                </Label>
                <Select value={targetAudience} onValueChange={setTargetAudience} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Executive">Executive</SelectItem>
                    <SelectItem value="Senior Management">Senior Management</SelectItem>
                    <SelectItem value="Technical Team">Technical Team</SelectItem>
                    <SelectItem value="Compliance">Compliance</SelectItem>
                    <SelectItem value="Cross-functional">Cross-functional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Desired Output Format <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-wrap gap-4">
                  {["PDF", "DOCX", "PPTX"].map((format) => (
                    <div key={format} className="flex items-center space-x-2">
                      <Checkbox
                        id={`assessment-${format}`}
                        checked={assessmentOutputFormats.includes(format)}
                        onCheckedChange={() => toggleOutputFormat(format, true)}
                      />
                      <label
                        htmlFor={`assessment-${format}`}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {format}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assessmentNotes" className="text-sm font-medium text-gray-700">
                  Additional Context / Notes
                </Label>
                <Textarea
                  id="assessmentNotes"
                  value={assessmentNotes}
                  onChange={(e) => setAssessmentNotes(e.target.value)}
                  placeholder="Any additional information or specific requirements..."
                  rows={4}
                />
              </div>
            </>
          ) : (
            <>
              {/* Application Profile Form Fields */}
              <div className="space-y-2">
                <Label htmlFor="applicationName" className="text-sm font-medium text-gray-700">
                  Application Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="applicationName"
                  value={applicationName}
                  onChange={(e) => setApplicationName(e.target.value)}
                  placeholder="e.g., Salesforce CRM"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="applicationType" className="text-sm font-medium text-gray-700">
                  Application Type <span className="text-red-500">*</span>
                </Label>
                <Select value={applicationType} onValueChange={setApplicationType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CRM">CRM</SelectItem>
                    <SelectItem value="ERP">ERP</SelectItem>
                    <SelectItem value="Analytics">Analytics</SelectItem>
                    <SelectItem value="HR System">HR System</SelectItem>
                    <SelectItem value="Financial">Financial</SelectItem>
                    <SelectItem value="Security">Security</SelectItem>
                    <SelectItem value="Integration">Integration</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dbpDomain" className="text-sm font-medium text-gray-700">
                  DBP Domain <span className="text-red-500">*</span>
                </Label>
                <Select value={dbpDomain} onValueChange={setDbpDomain} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select domain" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customer Experience">Customer Experience</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
                    <SelectItem value="Digital Workplace">Digital Workplace</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deploymentModel" className="text-sm font-medium text-gray-700">
                  Deployment Model <span className="text-red-500">*</span>
                </Label>
                <Select value={deploymentModel} onValueChange={setDeploymentModel} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cloud">Cloud</SelectItem>
                    <SelectItem value="On-Premise">On-Premise</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="SaaS">SaaS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primaryUsers" className="text-sm font-medium text-gray-700">
                  Primary Users / Audience
                </Label>
                <Input
                  id="primaryUsers"
                  value={primaryUsers}
                  onChange={(e) => setPrimaryUsers(e.target.value)}
                  placeholder="e.g., Sales team, 250 users"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeIntegrationMap"
                    checked={includeIntegrationMap}
                    onCheckedChange={(checked) => setIncludeIntegrationMap(checked as boolean)}
                  />
                  <label
                    htmlFor="includeIntegrationMap"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Include Integration Map
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeTCD"
                    checked={includeTCD}
                    onCheckedChange={(checked) => setIncludeTCD(checked as boolean)}
                  />
                  <label
                    htmlFor="includeTCD"
                    className="text-sm text-gray-700 cursor-pointer"
                  >
                    Include TCD (Total Cost of Deployment)
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  Desired Output Format <span className="text-red-500">*</span>
                </Label>
                <div className="flex flex-wrap gap-4">
                  {["PDF", "DOCX"].map((format) => (
                    <div key={format} className="flex items-center space-x-2">
                      <Checkbox
                        id={`profile-${format}`}
                        checked={profileOutputFormats.includes(format)}
                        onCheckedChange={() => toggleOutputFormat(format, false)}
                      />
                      <label
                        htmlFor={`profile-${format}`}
                        className="text-sm text-gray-700 cursor-pointer"
                      >
                        {format}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profileNotes" className="text-sm font-medium text-gray-700">
                  Additional Context / Notes
                </Label>
                <Textarea
                  id="profileNotes"
                  value={profileNotes}
                  onChange={(e) => setProfileNotes(e.target.value)}
                  placeholder="Any additional information or specific requirements..."
                  rows={4}
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
