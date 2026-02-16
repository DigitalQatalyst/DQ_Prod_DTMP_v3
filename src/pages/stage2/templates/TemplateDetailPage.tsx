import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  CheckCircle, 
  FileText, 
  Plus, 
  ShieldCheck, 
  Info,
  ChevronRight,
  Download
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { documentTemplates } from "@/data/stage2/templatesData";

export default function TemplateDetailPage() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  
  const template = documentTemplates.find(t => t.id === templateId);

  if (!template) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Template Not Found</h2>
        <p className="text-gray-500 mb-6 max-w-md">
          The template you're looking for doesn't exist or may have been removed.
        </p>
        <Button onClick={() => navigate('/stage2/templates/library')}>
          Browse All Templates
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb / Back Navigation */}
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <button 
          onClick={() => navigate('/stage2/templates/library')}
          className="flex items-center hover:text-gray-900 mr-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Library
        </button>
        <span className="mx-2 text-gray-300">/</span>
        <span className="font-medium text-gray-900 truncate max-w-[200px]">{template.title}</span>
      </nav>

      {/* Hero Section */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 lg:p-8 shadow-sm mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <FileText size={120} />
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="outline" className="uppercase tracking-wide text-xs font-semibold bg-gray-50">
                {template.category}
              </Badge>
              <Badge variant="secondary" className={`${
                template.complexity === 'simple' ? 'bg-green-100 text-green-700' :
                template.complexity === 'moderate' ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              } border-none`}>
                {template.complexity} Complexity
              </Badge>
              <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">
                v{template.version}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {template.title}
            </h1>
            
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {template.description}
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-gray-400" />
                <span><span className="font-semibold text-gray-900">{template.requestCount}</span> requests</span>
              </div>
              <div className="flex items-center gap-2">
                <Star size={18} className="text-yellow-400 fill-yellow-400" />
                <span><span className="font-semibold text-gray-900">{template.avgRating}</span> ({template.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={18} className="text-gray-400" />
                <span>Avg. <span className="font-semibold text-gray-900">{template.avgDeliveryTime}</span> delivery</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {template.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
          
          <div className="lg:w-80 flex flex-col gap-4 justify-center">
            <div className="bg-orange-50 rounded-xl p-5 border border-orange-100">
              <h3 className="font-semibold text-orange-900 mb-2">Ready to start?</h3>
              <p className="text-sm text-orange-700 mb-4">
                Configure your requirements and let our AI generate the first draft.
              </p>
              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white shadow-sm" 
                size="lg"
                onClick={() => navigate('/stage2/templates/new-request', { state: { templateId: template.id } })}
              >
                <Plus className="w-5 h-5 mr-2" />
                Request Document
              </Button>
            </div>
            
            {template.sampleOutput && (
              <Button variant="outline" className="w-full justify-start border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                <FileText className="w-4 h-4 mr-2" />
                View Sample Output
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-400" />
              Overview
            </h2>
            <div className="prose prose-orange max-w-none text-gray-600 bg-white p-6 rounded-xl border border-gray-200">
              <div dangerouslySetInnerHTML={{ __html: template.longDescription.replace(/\n/g, '<br />') }} />
            </div>
          </section>

          {/* Document Structure */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              Document Structure
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
              {template.sections.map((section) => (
                <div key={section.id} className="p-4 hover:bg-gray-50 transition-colors flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-500 font-semibold flex items-center justify-center text-sm">
                    {section.order}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{section.title}</h4>
                      {section.required && (
                        <span className="text-[10px] uppercase font-bold tracking-wider text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What You Get */}
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-gray-400" />
              What You'll Receive
            </h2>
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <ul className="space-y-3">
                {template.whatYouGet.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="mt-1 bg-green-200 rounded-full p-0.5">
                      <CheckCircle className="w-3 h-3 text-green-700" />
                    </div>
                    <span className="text-green-900">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          {/* Required Inputs Summary */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
              Information Needed
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Required Inputs
                </h4>
                <ul className="space-y-2">
                  {template.requiredInputs.map(input => (
                    <li key={input.id} className="text-sm text-gray-700 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                      {input.label}
                    </li>
                  ))}
                </ul>
              </div>
              
              {template.optionalInputs.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-4">
                    Optional Inputs
                  </h4>
                  <ul className="space-y-2">
                    {template.optionalInputs.map(input => (
                      <li key={input.id} className="text-sm text-gray-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        {input.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* When to Use */}
          <section className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
              When to Use
            </h3>
            <ul className="space-y-3">
              {template.whenToUse.map((useCase, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                  {useCase}
                </li>
              ))}
            </ul>
          </section>

          {/* Compliance */}
          {template.complianceFrameworks.length > 0 && (
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gray-500" />
                Compliance Frameworks
              </h3>
              <div className="flex flex-wrap gap-2">
                {template.complianceFrameworks.map((framework, idx) => (
                  <Badge key={idx} variant="outline" className="bg-gray-50 font-normal">
                    {framework}
                  </Badge>
                ))}
              </div>
            </section>
          )}

          {/* Best Practices */}
          <section className="bg-blue-50 rounded-xl border border-blue-100 p-6">
            <h3 className="font-semibold text-blue-900 mb-4 border-b border-blue-200 pb-3">
              Best Practices
            </h3>
            <ul className="space-y-3">
              {template.bestPractices.map((practice, idx) => (
                <li key={idx} className="text-sm text-blue-800 flex items-start gap-2">
                  <span className="text-blue-500 font-bold">•</span>
                  {practice}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
