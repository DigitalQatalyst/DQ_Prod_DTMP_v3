import { useNavigate } from "react-router-dom";
import { icons, Sparkles, FileText, Download, Star, Users, Wand2, ShieldCheck, LucideIcon } from "lucide-react";

interface TemplateCardProps {
  template: {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
    pageLength: string;
    outputFormats: string[];
    aiGeneration: string;
    specialFeature?: string;
    usageCount: number;
    compliance?: string | null;
  };
  tab: string;
}

export function TemplateCard({ template, tab }: TemplateCardProps) {
  const navigate = useNavigate();
  
  // Get the icon component dynamically using the icons object
  const IconComponent: LucideIcon = (icons[template.icon as keyof typeof icons] as LucideIcon) || FileText;

  const handleClick = () => {
    navigate(`/marketplaces/templates/${tab}/${template.id}`);
  };

  const handleGenerateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/marketplaces/templates/${tab}/${template.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-purple-400 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Card Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
          <IconComponent className="text-purple-600" size={32} />
        </div>
        <div className="bg-purple-50 border border-purple-200 px-2 py-1 rounded-full text-xs font-medium text-purple-700 flex items-center gap-1">
          <Sparkles size={14} />
          <span>{template.aiGeneration}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="template-tags flex flex-wrap items-center gap-2 mb-3">
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-semibold">
          {template.category}
        </span>
        {template.compliance && (
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
            <ShieldCheck size={12} />
            {template.compliance}
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
        {template.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {template.description}
      </p>

      {/* Template Features */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 mb-4">
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <FileText size={14} />
          <span>{template.pageLength}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <Download size={14} />
          <span>{template.outputFormats.join(', ')}</span>
        </div>
        {template.specialFeature && (
          <div className="flex items-center gap-2 text-xs text-gray-700">
            <Star size={14} />
            <span>{template.specialFeature}</span>
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="flex justify-between items-center border-t border-gray-200 pt-4">
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Users size={14} />
          {template.usageCount} uses
        </span>
        <button 
          onClick={handleGenerateClick}
          className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all"
        >
          <Wand2 size={16} />
          Generate
        </button>
      </div>
    </div>
  );
}
