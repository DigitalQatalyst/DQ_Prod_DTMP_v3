import { ArrowRight, Tag, TrendingUp } from "lucide-react";
import { BestPractice } from "@/data/knowledgeCenter/bestPractices";
import { cn } from "@/lib/utils";

interface BestPracticeCardProps {
  practice: BestPractice;
  onClick: () => void;
}

const complexityColors = {
  Low: "bg-green-100 text-green-700",
  Medium: "bg-yellow-100 text-yellow-700",
  High: "bg-red-100 text-red-700",
};

export function BestPracticeCard({ practice, onClick }: BestPracticeCardProps) {
  const Icon = practice.icon;
  
  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-orange-300 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-16 h-16 rounded-lg bg-green-50 flex items-center justify-center">
          <Icon className="w-8 h-8 text-green-600" />
        </div>
        {practice.featured && (
          <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
          {practice.domain}
        </span>
        <span className={cn("px-2 py-1 rounded text-xs font-medium", complexityColors[practice.complexity])}>
          {practice.complexity}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {practice.title}
      </h3>
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {practice.summary}
      </p>

      <div className="flex items-center gap-3 text-xs text-gray-600 mb-4">
        <span className="flex items-center gap-1">
          <Tag className="w-3 h-3" />
          {practice.category}
        </span>
        <span className="flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          {practice.maturityLevel}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          {practice.impactAreas.slice(0, 3).map((area) => (
            <span
              key={area}
              className="bg-purple-50 text-purple-700 px-2 py-1 rounded text-xs"
            >
              {area}
            </span>
          ))}
        </div>
        <ArrowRight className="w-5 h-5 text-orange-600 flex-shrink-0" />
      </div>
    </div>
  );
}
