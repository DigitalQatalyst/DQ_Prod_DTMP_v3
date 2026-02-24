import { AlertCircle, Info, TrendingUp, Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIInsight } from '@/data/digitalIntelligence/stage2';

interface InsightCardProps {
  insight: AIInsight;
}

export function InsightCard({ insight }: InsightCardProps) {
  const getIcon = () => {
    switch (insight.type) {
      case 'alert':
        return AlertCircle;
      case 'prediction':
        return TrendingUp;
      case 'recommendation':
        return Lightbulb;
      default:
        return Info;
    }
  };

  const getStyles = () => {
    switch (insight.severity) {
      case 'critical':
        return {
          bg: 'bg-red-50',
          icon: 'text-red-600',
          border: 'border-red-200'
        };
      case 'high':
        return {
          bg: 'bg-orange-50',
          icon: 'text-orange-600',
          border: 'border-orange-200'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          icon: 'text-yellow-600',
          border: 'border-yellow-200'
        };
      default:
        return {
          bg: 'bg-cyan-50',
          icon: 'text-cyan-600',
          border: 'border-cyan-200'
        };
    }
  };

  const Icon = getIcon();
  const styles = getStyles();

  return (
    <Card className={`p-5 ${styles.bg} border ${styles.border} hover:shadow-md transition-shadow`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg bg-white flex items-center justify-center flex-shrink-0 ${styles.icon}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-semibold text-gray-900">{insight.title}</h4>
            <Badge variant="outline" className="flex-shrink-0 text-xs">
              {insight.severity}
            </Badge>
          </div>
          <p className="text-sm text-gray-700 mb-3">{insight.description}</p>
          
          {/* Confidence indicator */}
          <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
            <span className="font-medium">{insight.confidence}% confident</span>
            <span>•</span>
            <span className="capitalize">{insight.type}</span>
          </div>

          {insight.actionable && insight.suggestedAction && (
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <p className="text-sm text-gray-900">
                <span className="font-semibold">Suggested Action:</span> {insight.suggestedAction}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
