import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { designTemplates, DesignTemplate } from '@/data/specs';

export default function DesignTemplatesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const filteredTemplates = useMemo(() => {
    let results = designTemplates;
    
    if (categoryFilter !== 'all') {
      results = results.filter(t => t.category === categoryFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return results;
  }, [categoryFilter, searchQuery]);

  return (
    <div className="stage2-content p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/stage2/specs/overview')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Overview
      </Button>
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Templates</h1>
        <p className="text-gray-600">Ready-to-use templates for architecture documentation, decision records, and design frameworks</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Categories</option>
          <option value="requirements">Requirements</option>
          <option value="architecture">Architecture</option>
          <option value="design">Design</option>
          <option value="decision">Decision</option>
          <option value="review">Review</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <div
            key={template.id}
            onClick={() => navigate(`/stage2/specs/templates/${template.id}`)}
            className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-orange-300 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                {template.category}
              </span>
              <span className="text-xs text-gray-500">{template.templateType}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.title}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{template.description}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
              <span>📥 {template.downloads}</span>
              <span>★ {template.rating}</span>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




