import { useNavigate } from 'react-router-dom';
import { Plus, Upload, Layers, FileText, Zap, FolderOpen, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { specsStats, architectureBlueprints, designTemplates, userDesigns } from '@/data/specs';
import { getBlueprintById } from '@/data/specs/blueprints';

export default function SolutionSpecsOverview() {
  const navigate = useNavigate();
  
  // Get popular blueprints (top 3 by downloads)
  const popularBlueprints = [...architectureBlueprints]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 3);
  
  // Get frequent templates (top 3 by downloads)
  const frequentTemplates = [...designTemplates]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 3);
  
  // Get recent user designs
  const myRecentDesigns = [...userDesigns]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  return (
    <div className="stage2-content p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/stage2/overview')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Service Hub
        </Button>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Solutions Specs</h1>
            <p className="text-gray-600">Architecture blueprints, design templates, and reference patterns</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/stage2/specs/my-designs?action=new')}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Design
            </Button>
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Upload Blueprint
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Architecture Blueprints</p>
              <p className="text-2xl font-bold text-gray-900">{specsStats.totalBlueprints}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">3 new this month</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Design Templates</p>
              <p className="text-2xl font-bold text-gray-900">{specsStats.totalTemplates}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Most used: SAD Template</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Design Patterns</p>
              <p className="text-2xl font-bold text-gray-900">{specsStats.totalPatterns}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">Browse catalog</p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <FolderOpen className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">My Designs</p>
              <p className="text-2xl font-bold text-gray-900">{specsStats.totalUserDesigns}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500">1 in review</p>
        </div>
      </div>

      {/* Popular Blueprints */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Popular Blueprints</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/stage2/specs/blueprints')}
          >
            Browse All Blueprints →
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {popularBlueprints.map(blueprint => (
            <div
              key={blueprint.id}
              onClick={() => navigate(`/stage2/specs/blueprints/${blueprint.id}`)}
              className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                  {blueprint.category}
                </span>
                <span className="text-xs text-gray-500">{blueprint.complexity}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{blueprint.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{blueprint.description}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{blueprint.downloads} downloads</span>
                <span>★ {blueprint.rating}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Templates */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Frequently Used Templates</h2>
        <div className="bg-white rounded-lg border border-gray-200 divide-y">
          {frequentTemplates.map(template => (
            <div
              key={template.id}
              onClick={() => navigate(`/stage2/specs/templates/${template.id}`)}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900">{template.title}</h3>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{template.downloads} downloads</p>
                  <p className="text-xs text-gray-500">{template.complexity}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Recent Designs */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">My Recent Designs</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/stage2/specs/my-designs')}
          >
            View All →
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 divide-y">
          {myRecentDesigns.map(design => (
            <div
              key={design.id}
              onClick={() => navigate(`/stage2/specs/my-designs/${design.id}`)}
              className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-gray-900">{design.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      design.status === 'approved' ? 'bg-green-100 text-green-700' :
                      design.status === 'in-review' ? 'bg-yellow-100 text-yellow-700' :
                      design.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {design.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{design.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Updated {new Date(design.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}




