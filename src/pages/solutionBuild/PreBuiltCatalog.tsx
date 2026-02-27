import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, Clock, DollarSign, Wrench } from "lucide-react";
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
import { preBuiltSolutions } from "@/data/solutionBuild";
import type { SolutionType } from "@/data/solutionBuild";

export default function PreBuiltCatalog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<SolutionType | "all">("all");
  const [timelineFilter, setTimelineFilter] = useState<string>("all");

  const filteredSolutions = useMemo(() => {
    return preBuiltSolutions.filter((solution) => {
      const matchesSearch =
        solution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        solution.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === "all" || solution.type === typeFilter;
      const matchesTimeline =
        timelineFilter === "all" ||
        (timelineFilter === "fast" && solution.estimatedWeeks <= 4) ||
        (timelineFilter === "medium" && solution.estimatedWeeks > 4 && solution.estimatedWeeks <= 8) ||
        (timelineFilter === "long" && solution.estimatedWeeks > 8);

      return matchesSearch && matchesType && matchesTimeline;
    });
  }, [searchQuery, typeFilter, timelineFilter]);

  const getSolutionTypeLabel = (type: SolutionType) => {
    const labels: Record<SolutionType, string> = {
      DBP: "Data & Business Platform",
      DIA: "Digital Intelligence & Analytics",
      DXP: "Digital Experience Platform",
      SDO: "Software Delivery & Operations",
      DWS: "Digital Workplace Solutions",
    };
    return labels[type];
  };

  const getSolutionTypeColor = (type: SolutionType) => {
    const colors: Record<SolutionType, string> = {
      DBP: "bg-blue-100 text-blue-800",
      DIA: "bg-purple-100 text-purple-800",
      DXP: "bg-green-100 text-green-800",
      SDO: "bg-orange-100 text-orange-800",
      DWS: "bg-pink-100 text-pink-800",
    };
    return colors[type];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/stage2")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Stage 2
          </Button>
          <h1 className="text-2xl font-semibold text-gray-900">Pre-Built Solutions Catalog</h1>
          <p className="text-gray-500">Browse and deploy pre-configured solutions</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search solutions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as SolutionType | "all")}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="DBP">Data & Business Platform</SelectItem>
                <SelectItem value="DIA">Digital Intelligence & Analytics</SelectItem>
                <SelectItem value="DXP">Digital Experience Platform</SelectItem>
                <SelectItem value="SDO">Software Delivery & Operations</SelectItem>
                <SelectItem value="DWS">Digital Workplace Solutions</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timelineFilter} onValueChange={setTimelineFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Timelines" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Timelines</SelectItem>
                <SelectItem value="fast">Fast (≤4 weeks)</SelectItem>
                <SelectItem value="medium">Medium (5-8 weeks)</SelectItem>
                <SelectItem value="long">Long (&gt;8 weeks)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredSolutions.length} of {preBuiltSolutions.length} solutions
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolutions.map((solution) => (
            <div
              key={solution.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/stage2/build/catalog/${solution.id}`)}
            >
              <div className="mb-4">
                <Badge className={getSolutionTypeColor(solution.type)}>{solution.type}</Badge>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{solution.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{solution.description}</p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {solution.estimatedWeeks} weeks
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {solution.costRange}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Wrench className="w-4 h-4 mr-2" />
                  {solution.customizationLevel} customization
                </div>
              </div>

              <Button
                className="w-full"
                style={{ backgroundColor: '#ea580c', color: 'white', cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/stage2/build/catalog/${solution.id}`);
                }}
              >
                View Details
              </Button>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredSolutions.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500">No solutions found matching your criteria.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
                setTimelineFilter("all");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
