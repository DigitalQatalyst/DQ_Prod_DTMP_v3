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
       className="bg-white border-2 border-gray-200 rounded-xl p-6 cursor-pointer hover:border-purple-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
     >
       {/* Header */}
       <div className="flex justify-between items-start mb-4">
         {/* Icon */}
         <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center">
           <IconComponent className="w-8 h-8 text-purple-600" />
         </div>
 
         {/* Badges */}
         <div className="flex items-center gap-2">
           <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase">
             {service.analyticsType}
           </span>
           {service.aiPowered && (
             <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-md">
               <Sparkles className="w-3 h-3" />
               AI
             </span>
           )}
         </div>
       </div>
 
       {/* Title & Description */}
       <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
         {service.title}
       </h3>
       <p className="text-sm text-gray-600 mb-4 line-clamp-2">
         {service.description}
       </p>
 
       {/* AI Capabilities */}
       {service.aiCapabilities.length > 0 && (
         <div className="border-l-4 border-purple-500 bg-purple-50 p-3 rounded-r-lg mb-4">
           <p className="text-xs font-semibold text-purple-700 uppercase mb-2">
             AI Capabilities:
           </p>
           <div className="flex flex-wrap gap-2">
             {service.aiCapabilities.slice(0, 2).map((capability) => (
               <span
                 key={capability}
                 className="bg-white border border-purple-200 text-purple-700 px-2 py-1 rounded text-xs font-medium flex items-center gap-1"
               >
                 <Sparkles className="w-3 h-3" />
                 {capability}
               </span>
             ))}
           </div>
         </div>
       )}
 
       {/* Service Features */}
       <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2 mb-4">
         {service.dataSource && (
           <div className="flex items-center gap-2 text-sm text-gray-700">
             <Database className="w-4 h-4 text-gray-500" />
             {service.dataSource}
           </div>
         )}
         {service.updateFrequency && (
           <div className="flex items-center gap-2 text-sm text-gray-700">
             <Clock className="w-4 h-4 text-gray-500" />
             {service.updateFrequency}
           </div>
         )}
         {service.visualizationType && (
           <div className="flex items-center gap-2 text-sm text-gray-700">
             <BarChart className="w-4 h-4 text-gray-500" />
             {service.visualizationType}
           </div>
         )}
         {service.outputFormat && (
           <div className="flex items-center gap-2 text-sm text-gray-700">
             <BarChart className="w-4 h-4 text-gray-500" />
             {service.outputFormat}
           </div>
         )}
       </div>
 
       {/* Key Insights */}
       {service.keyInsights.length > 0 && (
         <div className="border-t border-gray-200 pt-3 mb-4">
           <p className="text-xs font-semibold text-gray-700 uppercase mb-2">
             Key Insights:
           </p>
           <div className="flex flex-wrap gap-2">
             {service.keyInsights.slice(0, 2).map((insight) => (
               <span
                 key={insight}
                 className="bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded text-xs font-medium"
               >
                 {insight}
               </span>
             ))}
           </div>
         </div>
       )}
 
       {/* Footer */}
       <div className="flex justify-between items-center border-t border-gray-200 pt-4">
         <span className={`px-3 py-1 rounded-full text-xs font-semibold ${complexityColors[service.complexity]}`}>
           {service.accuracy}
         </span>
         <button
           className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
           onClick={(e) => {
             e.stopPropagation();
             onClick?.();
           }}
         >
           Request Dashboard
           <ArrowRight className="w-4 h-4" />
         </button>
       </div>
     </div>
   );
 }