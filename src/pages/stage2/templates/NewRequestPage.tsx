import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { documentTemplates, DocumentTemplate } from "@/data/stage2/templatesData";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function NewRequestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Get template info from location state (from marketplace)
  const marketplaceTemplateId = location.state?.cardId;
  const marketplaceTemplateName = location.state?.serviceName;
  const marketplaceTab = location.state?.tab;
  
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(location.state?.templateId || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    defaultValues: {
      templateId: selectedTemplateId,
      title: marketplaceTemplateName ? `${marketplaceTemplateName} Request` : '',
      description: marketplaceTemplateName ? `Document request for ${marketplaceTemplateName}` : '',
      inputs: {} as Record<string, any>
    }
  });

  // Update form templateId when state changes
  useEffect(() => {
    if (selectedTemplateId) {
      form.setValue('templateId', selectedTemplateId);
    }
  }, [selectedTemplateId, form]);

  const selectedTemplate = documentTemplates.find(t => t.id === selectedTemplateId);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Create new request object
    const newRequest = {
      id: `REQ-2026-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      templateId: selectedTemplateId || 'marketplace-template',
      templateTitle: marketplaceTemplateName || selectedTemplate?.title || 'Document Template',
      requestedBy: {
        id: 'user-001',
        name: 'John Doe',
        email: 'john.doe@example.com',
        department: 'IT'
      },
      title: data.title,
      description: data.description,
      inputs: Object.entries(data.inputs || {}).map(([key, value]) => ({
        inputId: key,
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
        value: value as string | string[] | boolean
      })),
      status: 'submitted' as const,
      priority: 'normal' as const,
      submittedDate: new Date().toISOString(),
      expectedDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
      progress: 0,
      currentStep: 'Submitted - Awaiting Review',
      revisions: [],
      messages: [],
      tags: []
    };
    
    // Store in localStorage
    const existingRequests = JSON.parse(localStorage.getItem('documentRequests') || '[]');
    existingRequests.unshift(newRequest); // Add to beginning
    localStorage.setItem('documentRequests', JSON.stringify(existingRequests));
    
    setIsSubmitting(false);
    
    toast({
      title: "Request Submitted",
      description: "Your document generation request has been submitted successfully.",
    });
    
    // Navigate to my requests
    navigate('/stage2/templates/my-requests');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <button 
          onClick={() => navigate('/stage2/templates/overview')}
          className="flex items-center hover:text-gray-900 mr-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Overview
        </button>
        <span className="mx-2 text-gray-300">/</span>
        <span className="font-medium text-gray-900">New Request</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Document Request</h1>
        <p className="text-gray-500 mt-1">
          Select a template and provide the required information to generate your document.
        </p>
        {marketplaceTemplateName && (
          <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-start gap-3">
            <Sparkles className="text-orange-600 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <p className="text-sm font-medium text-orange-900">
                Pre-selected from marketplace: <span className="font-bold">{marketplaceTemplateName}</span>
              </p>
              <p className="text-xs text-orange-700 mt-1">
                You can change the template below or continue with this selection.
              </p>
            </div>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          
          {/* 1. Template Selection */}
          <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
              Select Template
            </h2>
            
            {marketplaceTemplateName ? (
              // Show pre-selected template as read-only input
              <FormItem>
                <FormLabel>Document Template</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      value={marketplaceTemplateName}
                      readOnly
                      disabled
                      className="bg-gray-50 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CheckCircle className="text-green-600" size={18} />
                    </div>
                  </div>
                </FormControl>
                <FormDescription>
                  This template was pre-selected from the marketplace.
                </FormDescription>
              </FormItem>
            ) : (
              <FormField
                control={form.control}
                name="templateId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Template</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        setSelectedTemplateId(value);
                      }} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a template..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {documentTemplates.map((template) => (
                          <SelectItem key={template.id} value={template.id}>
                            {template.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the type of document you need to generate.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedTemplate && !marketplaceTemplateName && (
              <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200 flex gap-4">
                <div className="bg-white p-2 rounded border border-gray-100 h-fit">
                  <FileText className="text-orange-600" size={24} />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{selectedTemplate.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">{selectedTemplate.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle size={12} /> {selectedTemplate.typicalLength}
                    </span>
                    <span className="flex items-center gap-1">
                      <Sparkles size={12} /> {selectedTemplate.estimatedGenerationTime} generation
                    </span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {(selectedTemplate || marketplaceTemplateName) && (
            <>
              {/* 2. Request Details */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                  Request Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Request Title <span className="text-red-500">*</span></FormLabel>
                        <FormControl>
                          <Input placeholder={`e.g., Q1 ${selectedTemplate?.title || marketplaceTemplateName || 'Document'}`} {...field} required />
                        </FormControl>
                        <FormDescription>A unique name for this document request.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-2">
                     <FormLabel>Priority</FormLabel>
                     <Select defaultValue="normal">
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                </div>

                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description / Purpose</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Why is this document needed? Who is the audience?" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </section>

              {/* 3. Document Inputs */}
              <section className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="bg-orange-100 text-orange-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                  Document Information
                </h2>
                
                <div className="space-y-6">
                  {/* If marketplace template, show generic inputs */}
                  {marketplaceTemplateName && !selectedTemplate && (
                    <>
                      <FormField
                        control={form.control}
                        name="inputs.organizationName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Organization Name <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Acme Corporation" {...field} required />
                            </FormControl>
                            <FormDescription>The name of your organization</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inputs.documentScope"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Document Scope <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the scope and coverage of this document..." 
                                {...field} 
                                required 
                                rows={4}
                              />
                            </FormControl>
                            <FormDescription>What areas, systems, or processes will this document cover?</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inputs.targetAudience"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Target Audience <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., IT Staff, Developers, Management" {...field} required />
                            </FormControl>
                            <FormDescription>Who will be using or reading this document?</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inputs.keyRequirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Key Requirements <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List the main requirements, policies, or guidelines to include..." 
                                {...field} 
                                required 
                                rows={5}
                              />
                            </FormControl>
                            <FormDescription>Specific requirements, rules, or standards to be documented</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="border-t border-gray-100 my-4 pt-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Optional Information</h3>
                      </div>

                      <FormField
                        control={form.control}
                        name="inputs.complianceFrameworks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Compliance Frameworks <span className="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., ISO 27001, GDPR, SOC 2" {...field} />
                            </FormControl>
                            <FormDescription>Any compliance standards or frameworks to align with</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="inputs.additionalContext"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              Additional Context <span className="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
                            </FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Any other relevant information or special considerations..." 
                                {...field} 
                                rows={3}
                              />
                            </FormControl>
                            <FormDescription>Additional details that will help generate a better document</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Required Inputs */}
                  {selectedTemplate?.requiredInputs?.map(input => (
                    <FormField
                      key={input.id}
                      control={form.control}
                      name={`inputs.${input.id}`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            {input.label} <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            {input.type === 'textarea' ? (
                              <Textarea placeholder={input.placeholder} {...field} required />
                            ) : input.type === 'select' ? (
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={input.placeholder || "Select option"} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {input.options?.map(opt => (
                                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : input.type === 'multiselect' ? (
                              <div className="space-y-2 border border-gray-200 p-3 rounded-md">
                                {input.options?.map(opt => (
                                  <div key={opt} className="flex items-center space-x-2">
                                    <Checkbox id={`${input.id}-${opt}`} />
                                    <label htmlFor={`${input.id}-${opt}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                      {opt}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <Input placeholder={input.placeholder} {...field} required />
                            )}
                          </FormControl>
                          {input.helpText && <FormDescription>{input.helpText}</FormDescription>}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}

                  {/* Optional Inputs */}
                  {selectedTemplate?.optionalInputs && selectedTemplate.optionalInputs.length > 0 && (
                    <>
                      <div className="border-t border-gray-100 my-4 pt-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Optional Information</h3>
                      </div>
                      {selectedTemplate.optionalInputs.map(input => (
                        <FormField
                          key={input.id}
                          control={form.control}
                          name={`inputs.${input.id}`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                {input.label} <span className="text-gray-400 text-xs font-normal ml-1">(Optional)</span>
                              </FormLabel>
                              <FormControl>
                                {input.type === 'textarea' ? (
                                  <Textarea placeholder={input.placeholder} {...field} />
                                ) : input.type === 'select' ? (
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder={input.placeholder || "Select option"} />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {input.options?.map(opt => (
                                        <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                ) : input.type === 'multiselect' ? (
                                  <div className="space-y-2 border border-gray-200 p-3 rounded-md">
                                    {input.options?.map(opt => (
                                      <div key={opt} className="flex items-center space-x-2">
                                        <Checkbox id={`${input.id}-${opt}`} />
                                        <label htmlFor={`${input.id}-${opt}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                          {opt}
                                        </label>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <Input placeholder={input.placeholder} {...field} />
                                )}
                              </FormControl>
                              {input.helpText && <FormDescription>{input.helpText}</FormDescription>}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </>
                  )}
                </div>
              </section>

              {/* Submit Action */}
              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" type="button" onClick={() => navigate('/stage2/templates/overview')}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-orange-600 hover:bg-orange-700 min-w-[150px]">
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </>
          )}
        </form>
      </Form>
    </div>
  );
}
