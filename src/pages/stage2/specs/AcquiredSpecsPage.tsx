import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Download,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  FileText,
  Archive,
  Table2,
  Layers,
  GitBranch,
  ChevronRight,
  PackageOpen,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { solutionSpecs, type SolutionSpec } from '@/data/blueprints/solutionSpecs';

const ACQUIRED_IDS = [
  'dbp-reference-architecture',
  'customer-360-platform',
  'enterprise-data-platform',
];

// ── Document helpers ──────────────────────────────────────────────────────
interface SpecDoc {
  name: string;
  type: 'PDF' | 'ZIP' | 'XLSX' | 'PPTX';
  size: string;
  url: string;
}

function buildDocs(spec: SolutionSpec): SpecDoc[] {
  const base = spec.downloadUrl ?? '#';
  const docs: SpecDoc[] = [
    { name: `${spec.title} — Full Specification`, type: 'PDF',  size: '2.4 MB', url: base },
    { name: 'Architecture Diagram Pack',           type: 'ZIP',  size: '8.1 MB', url: '#'  },
    { name: 'Component Reference Guide',           type: 'PDF',  size: '1.2 MB', url: '#'  },
    { name: 'Implementation Checklist',            type: 'XLSX', size: '0.4 MB', url: '#'  },
  ];
  if (spec.solutionType === 'DBP' || spec.solutionType === 'DIA') {
    docs.push({ name: 'Integration Patterns Reference', type: 'PDF',  size: '1.8 MB', url: '#' });
  }
  if (spec.maturityLevel === 'reference') {
    docs.push({ name: 'Executive Summary Deck', type: 'PPTX', size: '3.5 MB', url: '#' });
  }
  return docs;
}

const DOC_ICON: Record<SpecDoc['type'], React.ComponentType<{ className?: string }>> = {
  PDF:  FileText,
  ZIP:  Archive,
  XLSX: Table2,
  PPTX: Layers,
};

const DOC_COLOUR: Record<SpecDoc['type'], string> = {
  PDF:  'bg-red-50 text-red-600',
  ZIP:  'bg-purple-50 text-purple-600',
  XLSX: 'bg-green-50 text-green-600',
  PPTX: 'bg-orange-50 text-orange-600',
};

function maturityBadge(level: SolutionSpec['maturityLevel']) {
  if (level === 'reference') return 'bg-blue-100 text-blue-700';
  if (level === 'proven')    return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-600';
}

function triggerDownload(name: string, url: string) {
  if (url && url !== '#') { window.open(url, '_blank'); return; }
  const a = document.createElement('a');
  a.href = 'data:text/plain,demo';
  a.download = name;
  a.click();
}

// ── Detail view ───────────────────────────────────────────────────────────
function DetailView({ spec, onBack }: { spec: SolutionSpec; onBack: () => void }) {
  const navigate = useNavigate();
  const docs = buildDocs(spec);

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-600 transition-colors mb-5"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Acquired Specs
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-md">
                {spec.solutionType}
              </span>
              <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${maturityBadge(spec.maturityLevel)}`}>
                {spec.maturityLevel.charAt(0).toUpperCase() + spec.maturityLevel.slice(1)}
              </span>
              <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 border border-green-200 px-2.5 py-1 rounded-md">
                <CheckCircle className="w-3 h-3" />
                Acquired
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{spec.title}</h2>
            <p className="text-sm text-gray-500 mb-4 max-w-2xl">{spec.description}</p>
            <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500">
              <span className="flex items-center gap-1.5"><Layers   className="w-4 h-4 text-orange-400" />{spec.diagramCount} diagrams</span>
              <span className="flex items-center gap-1.5"><GitBranch className="w-4 h-4 text-orange-400" />{spec.componentCount} components</span>
              <span className="flex items-center gap-1.5"><BookOpen  className="w-4 h-4 text-orange-400" />{docs.length} documents</span>
              <span className="text-xs text-gray-400">
                Updated {new Date(spec.lastUpdated).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-shrink-0">
            <Button
              onClick={() => docs.forEach((d) => triggerDownload(d.name, d.url))}
              className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2 whitespace-nowrap"
            >
              <PackageOpen className="w-4 h-4" />
              Download All
            </Button>
          </div>
        </div>

        {spec.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-gray-100">
            {spec.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Document list */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-semibold text-gray-800">
          Available Documents
          <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">{docs.length}</span>
        </h3>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
        {docs.map((doc, i) => {
          const Icon = DOC_ICON[doc.type];
          return (
            <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${DOC_COLOUR[doc.type]}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{doc.type} · {doc.size}</p>
              </div>
              <button
                onClick={() => triggerDownload(doc.name, doc.url)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-orange-600 hover:text-orange-700 hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all opacity-0 group-hover:opacity-100"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── List view ─────────────────────────────────────────────────────────────
function ListView({
  specs,
  onSelect,
}: {
  specs: SolutionSpec[];
  onSelect: (s: SolutionSpec) => void;
}) {
  const navigate = useNavigate();
  const totalDocs = specs.reduce((n, s) => n + buildDocs(s).length, 0);

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Acquired Solution Specs</h1>
        <p className="text-gray-500 text-sm">
          Click a spec to view and download its documents individually, or download everything at once.
        </p>
      </div>

      {/* Summary / actions bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
          <span className="px-3 py-1 font-medium bg-green-100 text-green-700 rounded-full border border-green-200 text-xs">
            {specs.length} acquired
          </span>
          <span className="text-gray-400">·</span>
          <span>{totalDocs} documents available</span>
          <span className="text-gray-400">·</span>
          <span>
            {specs.filter((s) => s.maturityLevel === 'reference').length} reference ·{' '}
            {specs.filter((s) => s.maturityLevel === 'proven').length} proven
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => specs.forEach((s) => buildDocs(s).forEach((d) => triggerDownload(d.name, d.url)))}
            className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2"
          >
            <PackageOpen className="w-4 h-4" />
            Download All Blueprints
          </Button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {specs.map((spec) => {
          const docs = buildDocs(spec);
          return (
            <div
              key={spec.id}
              onClick={() => onSelect(spec)}
              className="bg-white rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all cursor-pointer group flex flex-col overflow-hidden"
            >
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-700 rounded-md">
                    {spec.solutionType}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-md ${maturityBadge(spec.maturityLevel)}`}>
                    {spec.maturityLevel.charAt(0).toUpperCase() + spec.maturityLevel.slice(1)}
                  </span>
                </div>

                <h3 className="text-base font-semibold text-gray-900 mb-1.5 group-hover:text-orange-700 transition-colors">
                  {spec.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{spec.description}</p>

                <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><Layers    className="w-3 h-3" />{spec.diagramCount} diagrams</span>
                  <span className="flex items-center gap-1"><GitBranch className="w-3 h-3" />{spec.componentCount} components</span>
                  <span className="flex items-center gap-1"><FileText  className="w-3 h-3" />{docs.length} docs</span>
                </div>

                {spec.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {spec.tags.slice(0, 3).map((t) => (
                      <span key={t} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">{t}</span>
                    ))}
                    {spec.tags.length > 3 && (
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded">+{spec.tags.length - 3}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Card footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                  <span className="text-xs text-green-600 font-medium">Acquired</span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs text-orange-600 font-medium group-hover:gap-2 transition-all">
                  View Documents <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {specs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No acquired specs yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">
            Browse the Solution Specs marketplace to acquire specifications for your workspace.
          </p>
          <Button onClick={() => navigate('/marketplaces/solution-specs')} className="bg-orange-600 hover:bg-orange-700 text-white">
            Browse Marketplace <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}

// ── Page root ─────────────────────────────────────────────────────────────
export default function AcquiredSpecsPage() {
  const [selected, setSelected] = useState<SolutionSpec | null>(null);
  const acquired = solutionSpecs.filter((s) => ACQUIRED_IDS.includes(s.id));

  return (
    <div className="stage2-content p-6">
      {selected
        ? <DetailView spec={selected} onBack={() => setSelected(null)} />
        : <ListView specs={acquired} onSelect={setSelected} />
      }
    </div>
  );
}
