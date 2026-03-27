import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Layers,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  lifecycleTemplates,
  type LifecycleTemplate,
} from "@/data/lifecycle/lifecycleData";

// ── Helpers ───────────────────────────────────────────────────────────────────

const COMPLEXITY_CLASSES = {
  simple: "bg-green-100 text-green-700 border-green-200",
  moderate: "bg-amber-100 text-amber-800 border-amber-200",
  complex: "bg-red-100 text-red-700 border-red-200",
};

const METHODOLOGY_CLASSES: Record<string, string> = {
  agile: "bg-blue-100 text-blue-700 border-blue-200",
  waterfall: "bg-slate-100 text-slate-700 border-slate-200",
  hybrid: "bg-purple-100 text-purple-700 border-purple-200",
  "stage-gate": "bg-teal-100 text-teal-700 border-teal-200",
};

const RISK_CLASSES = {
  low: "bg-green-100 text-green-700",
  medium: "bg-amber-100 text-amber-800",
  high: "bg-red-100 text-red-700",
};

function StarRating({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= Math.round(rating)
              ? "text-amber-400 fill-amber-400"
              : "text-gray-200 fill-gray-200"
          }`}
        />
      ))}
      <span className="ml-1 text-xs text-gray-500">{rating.toFixed(1)}</span>
    </span>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function TemplatesLibrary() {
  const [selected, setSelected] = useState<LifecycleTemplate | null>(null);
  const [methodologyFilter, setMethodologyFilter] = useState("all");
  const [complexityFilter, setComplexityFilter] = useState("all");

  const filtered = lifecycleTemplates.filter((t) => {
    if (methodologyFilter !== "all" && t.methodology !== methodologyFilter) return false;
    if (complexityFilter !== "all" && t.complexity !== complexityFilter) return false;
    return true;
  });

  // ── Detail view ──────────────────────────────────────────────────────────────
  if (selected) {
    return (
      <div className="p-6 space-y-5">
        <button
          onClick={() => setSelected(null)}
          className="text-sm text-orange-700 font-semibold hover:underline flex items-center gap-1"
        >
          ← Back to Templates Library
        </button>

        {/* Header */}
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{selected.title}</h2>
            <p className="text-sm text-gray-500 mt-1">{selected.category}</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-xs border ${COMPLEXITY_CLASSES[selected.complexity]}`}>
              {selected.complexity}
            </Badge>
            <Badge
              className={`text-xs border ${METHODOLOGY_CLASSES[selected.methodology] ?? ""}`}
            >
              {selected.methodology}
            </Badge>
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${RISK_CLASSES[selected.riskLevel]}`}>
              {selected.riskLevel} risk
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed">{selected.description}</p>

        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card>
            <CardContent className="p-3 space-y-1">
              <p className="text-xs text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Duration</p>
              <p className="font-semibold text-gray-900 text-sm">{selected.totalDuration}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 space-y-1">
              <p className="text-xs text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" /> Times Used</p>
              <p className="font-semibold text-gray-900 text-sm">{selected.usageCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 space-y-1">
              <p className="text-xs text-gray-500 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Success Rate</p>
              <p className="font-semibold text-gray-900 text-sm">{selected.successRate}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3 space-y-1">
              <p className="text-xs text-gray-500 flex items-center gap-1"><Star className="w-3 h-3" /> Rating</p>
              <StarRating rating={selected.rating} />
            </CardContent>
          </Card>
        </div>

        {/* Governance + compliance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-700">Governance Framework</p>
              <p className="text-sm text-gray-600">{selected.governanceFramework}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-2">
              <p className="text-sm font-semibold text-gray-700">Compliance Requirements</p>
              <ul className="space-y-1">
                {selected.complianceRequirements.map((c) => (
                  <li key={c} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                    {c}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Stages */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-500" />
              {selected.stages.length} Lifecycle Stages
            </p>
            <div className="space-y-4">
              {selected.stages.map((stage, idx) => (
                <div key={stage.id} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    {idx < selected.stages.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
                    )}
                  </div>
                  <div className="pb-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold text-gray-900">{stage.name}</h4>
                      <Badge variant="outline" className="text-xs border-gray-200 text-gray-600">
                        {stage.durationEstimate}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{stage.description}</p>

                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Deliverables
                        </p>
                        <ul className="space-y-0.5">
                          {stage.deliverables.map((d) => (
                            <li key={d} className="text-xs text-gray-500 flex items-start gap-1.5">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-teal-400 flex-shrink-0" />
                              {d}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-1 flex items-center gap-1">
                          <BookOpen className="w-3 h-3" /> Activities
                        </p>
                        <ul className="space-y-0.5">
                          {stage.activities.map((a) => (
                            <li key={a} className="text-xs text-gray-500 flex items-start gap-1.5">
                              <span className="mt-1.5 w-1 h-1 rounded-full bg-orange-400 flex-shrink-0" />
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {selected.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
              {tag}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // ── List view ────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lifecycle Templates Library</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Pre-built frameworks and stage-gate processes. Click any template to explore stages, deliverables and governance requirements.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <Select value={methodologyFilter} onValueChange={setMethodologyFilter}>
          <SelectTrigger className="h-9 w-44 text-sm">
            <SelectValue placeholder="All methodologies" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All methodologies</SelectItem>
            <SelectItem value="agile">Agile</SelectItem>
            <SelectItem value="waterfall">Waterfall</SelectItem>
            <SelectItem value="hybrid">Hybrid</SelectItem>
            <SelectItem value="stage-gate">Stage-Gate</SelectItem>
          </SelectContent>
        </Select>
        <Select value={complexityFilter} onValueChange={setComplexityFilter}>
          <SelectTrigger className="h-9 w-36 text-sm">
            <SelectValue placeholder="Complexity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All complexity</SelectItem>
            <SelectItem value="simple">Simple</SelectItem>
            <SelectItem value="moderate">Moderate</SelectItem>
            <SelectItem value="complex">Complex</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-500 ml-auto">{filtered.length} templates</span>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((template) => (
          <Card
            key={template.id}
            className="border border-gray-200 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer"
            onClick={() => setSelected(template)}
          >
            <CardContent className="p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 mb-1">{template.category}</p>
                  <h3 className="text-sm font-bold text-gray-900 leading-snug">{template.title}</h3>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <Badge className={`text-xs border ${COMPLEXITY_CLASSES[template.complexity]}`}>
                    {template.complexity}
                  </Badge>
                  <Badge className={`text-xs border ${METHODOLOGY_CLASSES[template.methodology] ?? ""}`}>
                    {template.methodology}
                  </Badge>
                </div>
              </div>

              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{template.description}</p>

              <Separator />

              <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {template.totalDuration}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" /> {template.usageCount}x used
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" /> {template.successRate}% success
                </span>
              </div>

              <div className="flex items-center justify-between">
                <StarRating rating={template.rating} />
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  {template.stages.length} stages <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
