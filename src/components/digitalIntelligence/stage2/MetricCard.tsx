import { LucideIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MetricCardProps {
  icon: LucideIcon;
  iconColor?: string;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  onClick?: () => void;
}

export function MetricCard({
  icon: Icon,
  iconColor = 'blue',
  label,
  value,
  change,
  changeType = 'neutral',
  onClick
}: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    orange: 'bg-orange-100 text-orange-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600'
  };

  const changeColorClasses = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500'
  };

  return (
    <Card
      className={`p-6 ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className={`w-10 h-10 rounded-lg ${colorClasses[iconColor as keyof typeof colorClasses] || colorClasses.blue} flex items-center justify-center mb-3`}>
            <Icon className="w-5 h-5" />
          </div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <p className={`text-xs mt-1 ${changeColorClasses[changeType]}`}>
              {change}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
