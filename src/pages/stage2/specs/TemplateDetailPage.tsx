import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTemplateById } from '@/data/specs/templates';

export default function TemplateDetailPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  
  const template = templateId ? getTemplateById(templateId) : null;
  
  if (!template) {
    return (
      <div className="stage2-content p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Template not found</p>
          <Button onClick={() => navigate('/stage2/specs/templates')} className="mt-4">
            Back to Templates
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="stage2-content p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/stage2/specs/templates')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Templates
      </Button>

      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-sm font-medium bg-purple-100 text-purple-700 rounded">
                {template.category}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded">
                {template.templateType}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{template.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{template.description}</p>
          </div>
          <div className="ml-6">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Download className="w-4 h-4 mr-2" />
              Download Template
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Purpose</h2>
          <p className="text-gray-700">{template.purpose}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">When to Use</h2>
          <p className="text-gray-700">{template.whenToUse}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Instructions</h2>
          <div className="whitespace-pre-line text-gray-700">{template.instructions}</div>
        </div>

        {template.sections && template.sections.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Template Sections</h2>
            <div className="space-y-4">
              {template.sections.map(section => (
                <div key={section.id} className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-gray-900">{section.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{section.description}</p>
                  <p className="text-sm text-gray-700">{section.guideText}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Available Files</h2>
          <div className="space-y-2">
            {template.files.map((file, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <span className="font-medium text-gray-900">{file.format.toUpperCase()}</span>
                  <span className="text-sm text-gray-500 ml-2">{file.size}</span>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}




