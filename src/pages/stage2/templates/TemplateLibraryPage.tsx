import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Users, 
  Star, 
  Clock, 
  ChevronRight, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { documentTemplates, DocumentTemplate } from "@/data/stage2/templatesData";

// Content Header Component
const ContentHeader = ({ backLink, backText, breadcrumbs }: { backLink: string, backText?: string, breadcrumbs: string[] }) => {
  const navigate = useNavigate();
  return (
    <div className="mb-6">
      <nav className="flex items-center text-sm text-gray-500 mb-4">
        {backLink && (
          <button 
            onClick={() => navigate(backLink)}
            className="flex items-center hover:text-gray-900 mr-4"
          >
            <ChevronRight className="w-4 h-4 rotate-180 mr-1" />
            {backText || 'Back'}
          </button>
        )}
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            {index > 0 && <span className="mx-2">/</span>}
            <span className={index === breadcrumbs.length - 1 ? "font-medium text-gray-900" : ""}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

// Page Title Component
const PageTitle = ({ title, description, actions }: { title: string, description: string, actions?: any[] }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-500 mt-1">{description}</p>
    </div>
    {actions && (
      <div className="flex gap-3">
        {actions.map((action, idx) => {
          const Icon = action.icon;
          return (
            <Button 
              key={idx}
              onClick={action.onClick}
              variant={action.variant === 'primary' ? 'default' : 'outline'}
              className={action.variant === 'primary' ? 'bg-orange-600 hover:bg-orange-700' : ''}
            >
              {Icon && <Icon className="w-4 h-4 mr-2" />}
              {action.label}
            </Button>
          );
        })}
      </div>
    )}
  </div>
);

// Template Card Component (Stage 2 version)
const TemplateCard = ({ template, onClick }: { template: DocumentTemplate, onClick: () => void }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-orange-300 hover:shadow-md transition-all group flex flex-col h-full"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-orange-50 rounded-lg group-hover:bg-orange-100 transition-colors">
          <FileText className="text-orange-600" size={24} />
        </div>
        <div className="flex gap-2">
           <Badge variant="outline" className="text-xs font-normal">
            {template.category}
          </Badge>
          <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 border-purple-100 flex items-center gap-1">
            <Sparkles size={10} /> AI
          </Badge>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-700 transition-colors">
        {template.title}
      </h3>
      
      <p className="text-sm text-gray-500 mb-4 line-clamp-3 flex-1">
        {template.description}
      </p>

      <div className="space-y-3 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{template.estimatedGenerationTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
             <Star size={14} className="text-yellow-400 fill-yellow-400" />
             <span>{template.avgRating}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
           <div className="flex items-center gap-1.5">
            <Users size={14} />
            <span>{template.requestCount} uses</span>
          </div>
           <span className="font-medium text-gray-900">v{template.version}</span>
        </div>
      </div>
    </div>
  );
};

export default function TemplateLibraryPage() {
  const navigate = useNavigate();
  const [category, setCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [complexity, setComplexity] = useState<string>('all');

  // Filter templates
  const filteredTemplates = documentTemplates.filter(template => {
    const matchesCategory = category === 'all' || template.category === category;
    const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesComplexity = complexity === 'all' || complexity === 'All' || template.complexity.toLowerCase() === complexity.toLowerCase();
    
    return matchesCategory && matchesSearch && matchesComplexity;
  });

  // Category counts
  const getCount = (cat: string) => documentTemplates.filter(t => t.category === cat).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ContentHeader 
        backLink="/stage2/templates/overview"
        backText="Overview"
        breadcrumbs={['AI DocWriter', 'Template Library']}
      />
      
      <PageTitle 
        title="Template Library"
        description="Browse AI-powered document templates for your organization"
        actions={[
          { label: 'New Request', icon: Plus, variant: 'primary', onClick: () => navigate('/stage2/templates/new-request') }
        ]}
      />
      
      {/* Category Tabs */}
      <div className="flex overflow-x-auto pb-4 mb-6 gap-2 border-b border-gray-200 scrollbar-hide">
        <button 
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${category === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          onClick={() => setCategory('all')}
        >
          All ({documentTemplates.length})
        </button>
        {['governance', 'operational', 'compliance', 'security', 'technical', 'hr'].map(cat => (
          <button 
            key={cat}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap capitalize transition-colors ${category === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            onClick={() => setCategory(cat)}
          >
            {cat} ({getCount(cat)})
          </button>
        ))}
      </div>
      
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input 
            placeholder="Search templates..." 
            className="pl-9 bg-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <Select value={complexity} onValueChange={setComplexity}>
            <SelectTrigger>
              <SelectValue placeholder="Complexity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Complexities</SelectItem>
              <SelectItem value="simple">Simple</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="complex">Complex</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map(template => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => navigate(`/stage2/templates/library/${template.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
          <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No templates found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
          <Button 
            variant="link" 
            onClick={() => {setCategory('all'); setSearchQuery(''); setComplexity('all');}}
            className="mt-2 text-orange-600"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
