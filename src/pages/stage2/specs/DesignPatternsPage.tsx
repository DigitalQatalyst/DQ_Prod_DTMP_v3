import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { designPatterns, DesignPattern } from '@/data/specs';

export default function DesignPatternsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [patternTypeFilter, setPatternTypeFilter] = useState<string>('all');
  
  const filteredPatterns = useMemo(() => {
    let results = designPatterns;
    
    if (patternTypeFilter !== 'all') {
      results = results.filter(p => p.patternType === patternTypeFilter);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.intent.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    return results;
  }, [patternTypeFilter, searchQuery]);

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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Design Patterns</h1>
        <p className="text-gray-600">Proven architectural and design patterns for building scalable, resilient systems</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search patterns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={patternTypeFilter}
          onChange={(e) => setPatternTypeFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="all">All Types</option>
          <option value="architectural">Architectural</option>
          <option value="integration">Integration</option>
          <option value="data">Data</option>
          <option value="security">Security</option>
          <option value="performance">Performance</option>
          <option value="resilience">Resilience</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatterns.map(pattern => (
          <div
            key={pattern.id}
            onClick={() => navigate(`/stage2/specs/patterns/${pattern.id}`)}
            className="bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:border-orange-300 hover:shadow-lg transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded">
                {pattern.patternType}
              </span>
              <span className="text-xs text-gray-500">{pattern.difficulty}</span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{pattern.name}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{pattern.intent}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>👁️ {pattern.views}</span>
              <span>★ {pattern.rating}</span>
              <span>💻 {pattern.implementations}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




