import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { architectureBlueprints, ArchitectureBlueprint } from '@/data/specs';

export default function ArchitectureLibraryPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<'all' | ArchitectureBlueprint['category']>('all');
  const [complexityFilter, setComplexityFilter] = useState<string>('all');
  
  const filteredBlueprints = useMemo(() => {
    let results = architectureBlueprints;
    
    if (category !== 'all') {
      results = results.filter(bp => bp.category === category);
    }
    
    if (complexityFilter !== 'all') {
      results = results.filter(bp => bp.complexity === complexityFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(bp =>
        bp.title.toLowerCase().includes(query) ||
        bp.description.toLowerCase().includes(query) ||
        bp.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return results;
  }, [category, complexityFilter, searchQuery]);
  
  const categories: Array<{ value: 'all' | ArchitectureBlueprint['category']; label: string; count: number }> = [
    { value: 'all', label: 'All', count: architectureBlueprints.length },
    { value: 'cloud', label: 'Cloud', count: architectureBlueprints.filter(b => b.category === 'cloud').length },
    { value: 'microservices', label: 'Microservices', count: architectureBlueprints.filter(b => b.category === 'microservices').length },
    { value: 'data', label: 'Data', count: architectureBlueprints.filter(b => b.category === 'data').length },
    { value: 'integration', label: 'Integration', count: architectureBlueprints.filter(b => b.category === 'integration').length },
    { value: 'security', label: 'Security', count: architectureBlueprints.filter(b => b.category === 'security').length },
    { value: 'enterprise', label: 'Enterprise', count: architectureBlueprints.filter(b => b.category === 'enterprise').length }
  ];

  return (
    <div className="stage2-content p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/stage2/specs/overview')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Overview
        </Button>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Architecture Library</h1>
            <p className="text-gray-600">Reference blueprints for cloud, microservices, data, integration, and security architectures</p>
          </div>
          <Button className="bg-orange-600 hover:bg-orange-700">
            <Upload className="w-4 h-4 mr-2" />
            Submit Blueprint
          </Button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {categories.map(cat => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              category === cat.value
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search blueprints..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={complexityFilter}
          onChange={(e) => setComplexityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Complexity</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
      </div>

      {/* Blueprints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBlueprints.map(blueprint => (
          <div
            key={blueprint.id}
            onClick={() => navigate(`/stage2/specs/blueprints/${blueprint.id}`)}
            className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-orange-300 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                {blueprint.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">{blueprint.complexity}</span>
                <span className="text-xs text-gray-500">v{blueprint.version}</span>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{blueprint.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{blueprint.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <span>📥 {blueprint.downloads.toLocaleString()}</span>
              <span>★ {blueprint.rating} ({blueprint.reviewCount})</span>
              <span>👥 {blueprint.usageCount}</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {blueprint.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {filteredBlueprints.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No blueprints found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}




