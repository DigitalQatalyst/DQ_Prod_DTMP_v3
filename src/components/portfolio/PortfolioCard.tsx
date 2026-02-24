import { useNavigate, useLocation } from "react-router-dom";
import { Clock, Zap, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Icon mapping for string-based icon names
const iconMap = {
  Activity: "📊",
  LayoutDashboard: "📋", 
  Users: "👥",
  DollarSign: "💰",
  // Add more icon emojis as needed
};

const complexityColors: Record<string, string> = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-blue-100 text-blue-700", 
  High: "bg-purple-100 text-purple-700",
};

const gradientColors = [
  "from-orange-400 to-pink-500",
  "from-blue-400 to-purple-500",
  "from-green-400 to-teal-500",
  "from-purple-400 to-pink-500",
  "from-teal-400 to-blue-500",
  "from-rose-400 to-orange-500",
];

type PortfolioService = {
  id: string;
  title: string;
  description: string;
  iconName: string;
  category: string;
  deliveryModel: string;
  updateFrequency: string;
  complexity: "Low" | "Medium" | "High";
  realtime: boolean;
  keyMetrics: string[];
  tab: string;
  scope?: string;
  reportingLevel?: string;
  analysisType?: string;
  portfolioType?: string;
};

interface PortfolioCardProps {
  service: PortfolioService;
}

export function PortfolioCard({ service }: PortfolioCardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const gradientIndex = service.id.length % gradientColors.length;
  const iconEmoji = iconMap[service.iconName as keyof typeof iconMap] || "📊";

  const handleCardClick = () => {
    // Determine marketplace from current path
    const pathParts = location.pathname.split('/');
    const marketplace = pathParts[2] || 'portfolio-management';
    navigate(`/marketplaces/${marketplace}/${service.tab}/${service.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white border border-gray-200 rounded-xl hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Header with Icon */}
      <div className={`aspect-video bg-gradient-to-br ${gradientColors[gradientIndex]} flex items-center justify-center relative`}>
        <span className="text-4xl opacity-60">{iconEmoji}</span>
        {service.realtime && (
          <span className="absolute top-3 right-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Live
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-gray-500 mb-2">{service.category}</p>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {service.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {service.description}
        </p>

        {/* Metadata */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="w-3 h-3" />
            {service.updateFrequency}
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Target className="w-3 h-3" />
            {service.deliveryModel}
          </span>
          <Badge className={`${complexityColors[service.complexity]} border-0 text-xs`}>
            {service.complexity}
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="flex items-center gap-2 pt-3">
          <span className="text-xs text-gray-500">Key metrics:</span>
          <div className="flex flex-wrap gap-1">
            {service.keyMetrics.slice(0, 2).map((metric, index) => (
              <span
                key={index}
                className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded"
              >
                {metric}
              </span>
            ))}
            {service.keyMetrics.length > 2 && (
              <span className="text-xs text-gray-400">
                +{service.keyMetrics.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}