import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Copy, Bookmark, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getBlueprintById } from '@/data/specs/blueprints';

export default function BlueprintDetailPage() {
  const { blueprintId } = useParams<{ blueprintId: string }>();
  const navigate = useNavigate();
  
  const blueprint = blueprintId ? getBlueprintById(blueprintId) : null;
  
  if (!blueprint) {
    return (
      <div className="stage2-content p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Blueprint not found</p>
          <Button onClick={() => navigate('/stage2/specs/blueprints')} className="mt-4">
            Back to Architecture Library
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="stage2-content p-6">
      {/* Header */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/stage2/specs/blueprints')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Architecture Library
      </Button>

      {/* Blueprint Hero Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded">
                {blueprint.category}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded">
                {blueprint.complexity}
              </span>
              <span className="text-sm text-gray-500">v{blueprint.version}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{blueprint.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{blueprint.description}</p>
            
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>{blueprint.downloads.toLocaleString()} downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span>{blueprint.rating} ({blueprint.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-2">
                <span>👥</span>
                <span>{blueprint.usageCount} implementations</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col gap-2">
            <Button className="bg-orange-600 hover:bg-orange-700 w-full">
              <Download className="w-4 h-4 mr-2" />
              Download Blueprint
            </Button>
            <Button variant="outline" className="w-full">
              <Copy className="w-4 h-4 mr-2" />
              Use as Template
            </Button>
            <Button variant="outline" className="w-full">
              <Bookmark className="w-4 h-4 mr-2" />
              Save to My Library
            </Button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Overview</h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: blueprint.longDescription }} />
        </div>

        {/* Use Cases */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Use Cases</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {blueprint.useCases.map((useCase, idx) => (
              <li key={idx}>{useCase}</li>
            ))}
          </ul>
        </div>

        {/* Benefits & Considerations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Benefits
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {blueprint.benefits.map((benefit, idx) => (
                <li key={idx}>{benefit}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Considerations
            </h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {blueprint.considerations.map((consideration, idx) => (
                <li key={idx}>{consideration}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Components */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Components</h2>
          <div className="space-y-4">
            {blueprint.components.map(component => (
              <div key={component.id} className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-semibold text-gray-900">{component.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{component.description}</p>
                <div className="text-xs text-gray-500">
                  <span className="font-medium">Type:</span> {component.type}
                  {component.technology && (
                    <>
                      <span className="mx-2">•</span>
                      <span className="font-medium">Technology:</span> {component.technology}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technology Stack */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Technology Stack</h2>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Required</h4>
              <ul className="list-disc list-inside text-gray-700">
                {blueprint.technologyStack.required.map((tech, idx) => (
                  <li key={idx}>{tech}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Recommended</h4>
              <ul className="list-disc list-inside text-gray-700">
                {blueprint.technologyStack.recommended.map((tech, idx) => (
                  <li key={idx}>{tech}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




