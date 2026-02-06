import {
  Download,
  ExternalLink,
  FileText,
  Presentation,
  Table2,
  Archive,
  Film,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Resource } from "@/data/learningCenter/stage2/types";

interface UserResourcesTabProps {
  resources: Resource[];
}

const typeIcon: Record<string, typeof FileText> = {
  pdf: FileText,
  powerpoint: Presentation,
  spreadsheet: Table2,
  zip: Archive,
  link: ExternalLink,
};

const UserResourcesTab = ({ resources }: UserResourcesTabProps) => {
  const downloadable = resources.filter((r) => r.downloadable);
  const restricted = resources.filter(
    (r) => !r.downloadable && r.availableAfterCompletion
  );

  const additionalLinks = [
    {
      id: "ext-1",
      name: "McKinsey Digital Transformation Report",
      label: "External",
    },
    {
      id: "ext-2",
      name: "Gartner Hype Cycle for Digital Business",
      label: "External",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Downloadable Resources */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-primary-navy flex items-center gap-2">
            <Download className="w-5 h-5 text-orange-600" />
            Course Materials
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {downloadable.map((resource) => {
            const Icon = typeIcon[resource.type] || FileText;
            return (
              <div
                key={resource.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground">
                    {resource.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {resource.fileType}, {resource.size}
                  </p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                  {resource.downloadCount && (
                    <span className="text-xs text-muted-foreground hidden sm:block">
                      {resource.downloadCount.toLocaleString()} downloads
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-300 text-orange-600 hover:bg-orange-50"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            );
          })}

          {/* Restricted Resources */}
          {restricted.map((resource) => {
            const Icon = typeIcon[resource.type] || FileText;
            return (
              <div
                key={resource.id}
                className="flex items-center gap-4 px-6 py-4 opacity-60"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground flex items-center gap-2">
                    <Film className="w-4 h-4" />
                    {resource.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {resource.fileType}, {resource.size}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" disabled>
                    <Lock className="w-4 h-4 mr-1" />
                    Available after completion
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Additional Reading */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-primary-navy flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Additional Reading
          </h3>
        </div>
        <div className="divide-y divide-gray-100">
          {additionalLinks.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">
                  {link.name}
                </p>
                <p className="text-xs text-muted-foreground">({link.label})</p>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="flex-shrink-0"
              >
                Open Link
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserResourcesTab;
