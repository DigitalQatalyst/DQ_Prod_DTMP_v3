 import { 
   Activity, AlertTriangle, TrendingUp, RefreshCw, DollarSign, Shield, 
   CheckCircle, Network, Gauge, Users, AlertCircle, Link, Target, Cpu,
   GitBranch, BarChart3, Map, Zap, ShieldAlert, Calendar, MessageSquare, BookOpen,
   Database, Clock, BarChart, Sparkles, ArrowRight, LucideIcon
 } from "lucide-react";
 
 // Icon mapping
 const iconMap: Record<string, LucideIcon> = {
   Activity, AlertTriangle, TrendingUp, RefreshCw, DollarSign, Shield, 
   CheckCircle, Network, Gauge, Users, AlertCircle, Link, Target, Cpu,
   GitBranch, BarChart3, Map, Zap, ShieldAlert, Calendar, MessageSquare, BookOpen,
   Database, Clock, BarChart
 };
 
 export interface IntelligenceService {
   id: string;
   title: string;
   description: string;
   icon: string;
   analyticsType: string;
   aiPowered: boolean;
   aiCapabilities: string[];
   updateFrequency?: string;
   visualizationType?: string;
   dataSource?: string;
   outputFormat?: string;
   complexity: "Low" | "Medium" | "High";
   accuracy: string;
   keyInsights: string[];
 }
 
 interface IntelligenceCardProps {
   service: IntelligenceService;
   onClick?: () => void;
 }
 
 const complexityColors: Record<string, string> = {
   Low: "bg-green-100 text-green-700",
   Medium: "bg-yellow-100 text-yellow-700",
   High: "bg-red-100 text-red-700",
 };
 
export function IntelligenceCard({ service, onClick }: IntelligenceCardProps) {
  const IconComponent = iconMap[service.icon] || Activity;

  return (
    <div
      role="listitem"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="bg-white border border-gray-200 rounded-xl p-4 cursor-pointer hover:border-purple-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      {/* Header — icon + badges inline */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center shrink-0">
          <IconComponent className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex flex-wrap items-center gap-1.5 min-w-0">
          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase leading-tight">
            {service.analyticsType}
          </span>
          {service.aiPowered && (
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-1.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-0.5 shadow-sm">
              <Sparkles className="w-2.5 h-2.5" />
              AI
            </span>
          )}
        </div>
      </div>

      {/* Title & Description */}
      <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 leading-snug">
        {service.title}
      </h3>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2 leading-relaxed">
        {service.description}
      </p>

      {/* AI Capabilities — compact inline tags */}
      {service.aiCapabilities.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 mb-3">
          <span className="text-[10px] font-semibold text-purple-600 uppercase">AI:</span>
          {service.aiCapabilities.slice(0, 2).map((capability) => (
            <span
              key={capability}
              className="bg-purple-50 border border-purple-200 text-purple-700 px-1.5 py-0.5 rounded text-[11px] font-medium"
            >
              {capability}
            </span>
          ))}
        </div>
      )}

      {/* Service Features — condensed single-row items */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 mb-3">
        {service.dataSource && (
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3" />
            {service.dataSource}
          </span>
        )}
        {service.updateFrequency && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {service.updateFrequency}
          </span>
        )}
        {(service.visualizationType || service.outputFormat) && (
          <span className="flex items-center gap-1">
            <BarChart className="w-3 h-3" />
            {service.visualizationType || service.outputFormat}
          </span>
        )}
      </div>

      {/* Key Insights — tighter */}
      {service.keyInsights.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {service.keyInsights.slice(0, 2).map((insight) => (
            <span
              key={insight}
              className="bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded text-[11px] font-medium"
            >
              {insight}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-3">
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${complexityColors[service.complexity]}`}>
          {service.accuracy}
        </span>
        <button
          className="bg-purple-600 text-white hover:bg-purple-700 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
          View Details
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}