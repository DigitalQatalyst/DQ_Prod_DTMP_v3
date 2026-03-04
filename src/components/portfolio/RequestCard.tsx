import { RequestCard as RequestCardType } from "@/types/requests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  TrendingUp, 
  Map, 
  Shield, 
  DollarSign, 
  Handshake, 
  GraduationCap,
  Calculator,
  TrendingDown,
  Presentation,
  AlertTriangle,
  Layers,
  CheckCircle,
  Settings,
  AlertCircle,
  Award,
  ShieldCheck,
  GitBranch
} from "lucide-react";

interface RequestCardProps {
  card: RequestCardType;
  onRequestClick: (card: RequestCardType) => void;
}

const iconMap: Record<string, any> = {
  FileText,
  Users,
  TrendingUp,
  Map,
  Shield,
  DollarSign,
  Handshake,
  GraduationCap,
  Calculator,
  TrendingDown,
  Presentation,
  AlertTriangle,
  Layers,
  CheckCircle,
  Settings,
  AlertCircle,
  Award,
  ShieldCheck,
  GitBranch
};

const categoryColors: Record<string, string> = {
  'deep-dive-analysis': 'bg-blue-100 text-blue-700',
  'workshop': 'bg-purple-100 text-purple-700',
  'consulting': 'bg-green-100 text-green-700',
  'custom-deliverable': 'bg-orange-100 text-orange-700'
};

const categoryLabels: Record<string, string> = {
  'deep-dive-analysis': 'Analysis & Report',
  'workshop': 'Workshop',
  'consulting': 'Consulting',
  'custom-deliverable': 'Custom Deliverable'
};

export function RequestCard({ card, onRequestClick }: RequestCardProps) {
  const Icon = iconMap[card.icon] || FileText;
  const categoryColor = categoryColors[card.category] || 'bg-gray-100 text-gray-700';
  const categoryLabel = categoryLabels[card.category] || card.category;

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-200 border-2 hover:border-orange-300">
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-orange-600" />
          </div>
          <Badge className={`${categoryColor} border-0 text-xs`}>
            {categoryLabel}
          </Badge>
        </div>
        <CardTitle className="text-lg font-bold text-gray-900 leading-tight">
          {card.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1">
        <CardDescription className="text-sm text-gray-600 leading-relaxed mb-4">
          {card.description}
        </CardDescription>
        
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">{card.estimatedTimeline}</span>
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={() => onRequestClick(card)}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold"
        >
          Request This
        </Button>
      </CardFooter>
    </Card>
  );
}
