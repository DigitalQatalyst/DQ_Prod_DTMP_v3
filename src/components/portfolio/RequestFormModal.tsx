import { useState, useEffect } from "react";
import { RequestCard, RequestFormData, RequestPriority, RequestScope } from "@/types/requests";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface RequestFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: RequestCard | null;
  serviceName: string;
  onSubmit: (formData: RequestFormData) => void;
  onAuthRequired: (formData: RequestFormData) => void;
}

export function RequestFormModal({ isOpen, onClose, card, serviceName, onSubmit, onAuthRequired }: RequestFormModalProps) {
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState<Partial<RequestFormData>>({
    serviceName: serviceName,
    serviceId: card?.serviceId || '',
    requestType: card?.requestType || '',
    requestCategory: card?.category || 'deep-dive-analysis',
    priority: 'medium',
    primaryContact: user?.name || '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [completionDate, setCompletionDate] = useState<Date>();

  // Update primary contact when user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, primaryContact: user.name }));
    }
  }, [user]);

  if (!card) return null;

  const updateField = (field: keyof RequestFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.priority) {
      newErrors.priority = 'Priority is required';
    }
    if (!formData.businessJustification || formData.businessJustification.length < 20) {
      newErrors.businessJustification = 'Business justification is required (minimum 20 characters)';
    }
    if (!completionDate) {
      newErrors.desiredCompletionDate = 'Desired completion date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const completeFormData: RequestFormData = {
      serviceName: formData.serviceName!,
      serviceId: formData.serviceId!,
      requestType: formData.requestType!,
      requestCategory: formData.requestCategory!,
      priority: formData.priority as RequestPriority,
      businessJustification: formData.businessJustification!,
      desiredCompletionDate: completionDate ? format(completionDate, 'yyyy-MM-dd') : '',
      primaryContact: formData.primaryContact!,
      scope: formData.scope,
      stakeholders: formData.stakeholders,
      budgetCode: formData.budgetCode,
      additionalRequirements: formData.additionalRequirements,
      // Type-specific fields
      reportFormat: formData.reportFormat,
      presentationRequired: formData.presentationRequired,
      numberOfApplications: formData.numberOfApplications,
      specificFocusAreas: formData.specificFocusAreas,
      numberOfParticipants: formData.numberOfParticipants,
      preferredDates: formData.preferredDates,
      duration: formData.duration,
      location: formData.location,
      workshopObjectives: formData.workshopObjectives,
      consultationType: formData.consultationType,
      estimatedHours: formData.estimatedHours,
      specificExpertise: formData.specificExpertise,
      preferredConsultant: formData.preferredConsultant,
      deliverableType: formData.deliverableType,
      targetAudience: formData.targetAudience,
      formatRequirements: formData.formatRequirements,
      brandingRequired: formData.brandingRequired,
    };

    // Check if user is authenticated
    if (!isAuthenticated) {
      // Store form data and trigger login
      onAuthRequired(completeFormData);
      return;
    }

    // User is authenticated, submit directly
    onSubmit(completeFormData);
  };

  const renderTypeSpecificFields = () => {
    switch (card.category) {
      case 'deep-dive-analysis':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="reportFormat">Report Format</Label>
              <Select value={formData.reportFormat} onValueChange={(value) => updateField('reportFormat', value)}>
                <SelectTrigger id="reportFormat">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="powerpoint">PowerPoint</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="word">Word</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="presentationRequired"
                checked={formData.presentationRequired}
                onCheckedChange={(checked) => updateField('presentationRequired', checked)}
              />
              <Label htmlFor="presentationRequired" className="text-sm font-normal cursor-pointer">
                Presentation to stakeholders required
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numberOfApplications">Number of Applications/Projects (optional)</Label>
              <Input
                id="numberOfApplications"
                type="number"
                value={formData.numberOfApplications || ''}
                onChange={(e) => updateField('numberOfApplications', parseInt(e.target.value))}
                placeholder="e.g., 250"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificFocusAreas">Specific Focus Areas (optional)</Label>
              <Textarea
                id="specificFocusAreas"
                value={formData.specificFocusAreas || ''}
                onChange={(e) => updateField('specificFocusAreas', e.target.value)}
                placeholder="Any specific areas to focus on..."
                rows={3}
              />
            </div>
          </>
        );

      case 'workshop':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="numberOfParticipants">Number of Participants *</Label>
              <Input
                id="numberOfParticipants"
                type="number"
                value={formData.numberOfParticipants || ''}
                onChange={(e) => updateField('numberOfParticipants', parseInt(e.target.value))}
                placeholder="e.g., 15"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration *</Label>
              <Select value={formData.duration} onValueChange={(value) => updateField('duration', value)}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="half-day">Half-day</SelectItem>
                  <SelectItem value="full-day">Full-day</SelectItem>
                  <SelectItem value="two-day">2-day</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Select value={formData.location} onValueChange={(value) => updateField('location', value)}>
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="virtual">Virtual</SelectItem>
                  <SelectItem value="on-site">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredDates">Preferred Dates (optional)</Label>
              <Input
                id="preferredDates"
                value={formData.preferredDates || ''}
                onChange={(e) => updateField('preferredDates', e.target.value)}
                placeholder="e.g., Dec 5-6 or Week of Dec 10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="workshopObjectives">Workshop Objectives *</Label>
              <Textarea
                id="workshopObjectives"
                value={formData.workshopObjectives || ''}
                onChange={(e) => updateField('workshopObjectives', e.target.value)}
                placeholder="What do you want to achieve from this workshop?"
                rows={3}
                required
              />
            </div>
          </>
        );

      case 'consulting':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="consultationType">Consultation Type *</Label>
              <Select value={formData.consultationType} onValueChange={(value) => updateField('consultationType', value)}>
                <SelectTrigger id="consultationType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="ongoing">Ongoing</SelectItem>
                  <SelectItem value="project-based">Project-based</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedHours">Estimated Hours Needed (optional)</Label>
              <Input
                id="estimatedHours"
                type="number"
                value={formData.estimatedHours || ''}
                onChange={(e) => updateField('estimatedHours', parseInt(e.target.value))}
                placeholder="e.g., 40"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specificExpertise">Specific Expertise Required *</Label>
              <Textarea
                id="specificExpertise"
                value={formData.specificExpertise || ''}
                onChange={(e) => updateField('specificExpertise', e.target.value)}
                placeholder="Describe the expertise you need..."
                rows={3}
                required
              />
            </div>
          </>
        );

      case 'custom-deliverable':
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="deliverableType">Deliverable Type *</Label>
              <Input
                id="deliverableType"
                value={formData.deliverableType || ''}
                onChange={(e) => updateField('deliverableType', e.target.value)}
                placeholder="e.g., Executive Presentation, Business Case"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience *</Label>
              <Select value={formData.targetAudience} onValueChange={(value) => updateField('targetAudience', value)}>
                <SelectTrigger id="targetAudience">
                  <SelectValue placeholder="Select audience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="executive">Executive</SelectItem>
                  <SelectItem value="management">Management</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                  <SelectItem value="all">All</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="formatRequirements">Format Requirements (optional)</Label>
              <Textarea
                id="formatRequirements"
                value={formData.formatRequirements || ''}
                onChange={(e) => updateField('formatRequirements', e.target.value)}
                placeholder="Any specific format or style requirements..."
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox 
                id="brandingRequired"
                checked={formData.brandingRequired}
                onCheckedChange={(checked) => updateField('brandingRequired', checked)}
              />
              <Label htmlFor="brandingRequired" className="text-sm font-normal cursor-pointer">
                Use company branding template
              </Label>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{card.requestType}</DialogTitle>
          <DialogDescription>
            {serviceName} • {card.estimatedTimeline}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Service Name (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="serviceName">Service</Label>
            <Input
              id="serviceName"
              value={formData.serviceName}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Request Type (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="requestType">Request Type</Label>
            <Input
              id="requestType"
              value={formData.requestType}
              disabled
              className="bg-gray-50"
            />
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">Priority *</Label>
            <Select value={formData.priority} onValueChange={(value) => updateField('priority', value)}>
              <SelectTrigger id="priority" className={errors.priority ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
            {errors.priority && <p className="text-sm text-red-500">{errors.priority}</p>}
          </div>

          {/* Business Justification */}
          <div className="space-y-2">
            <Label htmlFor="businessJustification">Business Justification *</Label>
            <Textarea
              id="businessJustification"
              value={formData.businessJustification || ''}
              onChange={(e) => updateField('businessJustification', e.target.value)}
              placeholder="Explain why this service is needed and the expected business value..."
              rows={4}
              className={errors.businessJustification ? 'border-red-500' : ''}
              maxLength={500}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{errors.businessJustification || 'Minimum 20 characters'}</span>
              <span>{formData.businessJustification?.length || 0}/500</span>
            </div>
          </div>

          {/* Desired Completion Date */}
          <div className="space-y-2">
            <Label htmlFor="desiredCompletionDate">Desired Completion Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !completionDate && "text-muted-foreground",
                    errors.desiredCompletionDate && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {completionDate ? format(completionDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={completionDate}
                  onSelect={setCompletionDate}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.desiredCompletionDate && <p className="text-sm text-red-500">{errors.desiredCompletionDate}</p>}
          </div>

          {/* Primary Contact */}
          <div className="space-y-2">
            <Label htmlFor="primaryContact">Primary Contact</Label>
            <Input
              id="primaryContact"
              value={formData.primaryContact}
              onChange={(e) => updateField('primaryContact', e.target.value)}
            />
          </div>

          {/* Optional Fields */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Additional Information (Optional)</h3>
            
            <div className="space-y-4">
              {/* Scope */}
              <div className="space-y-2">
                <Label htmlFor="scope">Scope</Label>
                <Select value={formData.scope} onValueChange={(value) => updateField('scope', value)}>
                  <SelectTrigger id="scope">
                    <SelectValue placeholder="Select scope" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enterprise-wide">Enterprise-wide</SelectItem>
                    <SelectItem value="business-unit">Business Unit</SelectItem>
                    <SelectItem value="department">Department</SelectItem>
                    <SelectItem value="specific-applications">Specific Applications</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Stakeholders */}
              <div className="space-y-2">
                <Label htmlFor="stakeholders">Stakeholders</Label>
                <Input
                  id="stakeholders"
                  value={formData.stakeholders || ''}
                  onChange={(e) => updateField('stakeholders', e.target.value)}
                  placeholder="e.g., CFO, CIO, Application Owners"
                />
              </div>

              {/* Budget Code */}
              <div className="space-y-2">
                <Label htmlFor="budgetCode">Budget Code</Label>
                <Input
                  id="budgetCode"
                  value={formData.budgetCode || ''}
                  onChange={(e) => updateField('budgetCode', e.target.value)}
                  placeholder="e.g., IT-2024-001"
                />
              </div>

              {/* Additional Requirements */}
              <div className="space-y-2">
                <Label htmlFor="additionalRequirements">Additional Requirements</Label>
                <Textarea
                  id="additionalRequirements"
                  value={formData.additionalRequirements || ''}
                  onChange={(e) => updateField('additionalRequirements', e.target.value)}
                  placeholder="Any other requirements or notes..."
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Type-Specific Fields */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Request Details</h3>
            <div className="space-y-4">
              {renderTypeSpecificFields()}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-orange-600 hover:bg-orange-700">
            Submit Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
