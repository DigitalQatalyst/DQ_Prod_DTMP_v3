import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { ExecutionStream } from "@/data/executionStreams";
import { IconBadge } from "@/components/landing/shared";

const phaseColors: Record<string, string> = {
  "smart-grid": "#0369A1",
  "solar-park": "#6d28d9",
  "ai-cognitive": "#16A34A",
  "digital-customer": "#D97706",
};

interface StreamCardProps {
  stream: ExecutionStream;
}

export function StreamCard({ stream }: StreamCardProps) {
  const { icon: Icon, name, acronym, description, outcomes, ctaLabel, route } = stream;
  const accent = phaseColors[stream.id] ?? "#6d28d9";

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all flex flex-col" onMouseEnter={e => (e.currentTarget.style.boxShadow = "6px 8px 24px rgba(0,0,0,0.13)")} onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}>
      <div className="flex items-start gap-4 mb-3">
        <div className="transition-transform group-hover:scale-110 origin-left w-fit">
          <IconBadge icon={<Icon size={18} className="text-white" />} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-0.5" style={{ color: accent }}>{acronym}</p>
          <h3 className="font-bold text-slate-800 text-lg">{name}</h3>
        </div>
      </div>

      <p className="text-sm text-slate-500 mb-4 leading-relaxed">{description}</p>

      <p className="text-xs font-semibold text-slate-400 uppercase mb-2">DTMP Architecture Role</p>
      <ul className="space-y-1 mb-6 flex-1">
        {outcomes.map((outcome) => (
          <li key={outcome} className="text-sm text-slate-600 flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: accent }} />
            {outcome}
          </li>
        ))}
      </ul>

      <Link
        to={route}
        className="text-sm font-semibold inline-flex items-center gap-1"
        style={{ color: accent }}
      >
        {ctaLabel} <ChevronRight size={14} />
      </Link>
    </div>
  );
}
