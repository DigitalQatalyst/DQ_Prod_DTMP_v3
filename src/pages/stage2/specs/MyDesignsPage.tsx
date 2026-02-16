import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { userDesigns, UserDesign } from '@/data/specs';

export default function MyDesignsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const filteredDesigns = useMemo(() => {
    let results = userDesigns;
    
    if (statusFilter !== 'all') {
      results = results.filter(d => d.status === statusFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(d =>
        d.title.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query) ||
        d.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return results;
  }, [statusFilter, searchQuery]);

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
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Designs</h1>
          <p className="text-gray-600">Your saved architecture designs and solution specifications</p>
        </div>
        <Button
          onClick={() => navigate('/stage2/specs/my-designs?action=new')}
          className="bg-orange-600 hover:bg-orange-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Design
        </Button>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="in-review">In Review</option>
          <option value="approved">Approved</option>
          <option value="implemented">Implemented</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredDesigns.map(design => (
          <div
            key={design.id}
            onClick={() => navigate(`/stage2/specs/my-designs/${design.id}`)}
            className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-orange-300 hover:shadow-md transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{design.title}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    design.status === 'approved' ? 'bg-green-100 text-green-700' :
                    design.status === 'in-review' ? 'bg-yellow-100 text-yellow-700' :
                    design.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                    design.status === 'implemented' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {design.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{design.description}</p>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>Type: {design.designType}</span>
                  {design.projectName && <span>• Project: {design.projectName}</span>}
                  <span>• Updated {new Date(design.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredDesigns.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No designs found matching your criteria.</p>
          <Button
            onClick={() => navigate('/stage2/specs/my-designs?action=new')}
            className="bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Design
          </Button>
        </div>
      )}
    </div>
  );
}




