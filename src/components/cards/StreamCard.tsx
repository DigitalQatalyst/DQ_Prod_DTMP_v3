import { Link } from "react-router-dom";
import { ExecutionStream } from "@/data/executionStreams";

interface StreamCardProps {
  stream: ExecutionStream;
}

export function StreamCard({ stream }: StreamCardProps) {
  const { icon: Icon, name, acronym, description, outcomes, ctaLabel, route } = stream;
  const accent =
    stream.id === "solar"
      ? "#0EA5E9"
      : stream.id === "storage"
        ? "#F97316"
        : stream.id === "ai"
          ? "#16A34A"
          : "#DC2626";

  return (
    <div
      className="bg-white border border-[#E2E8F0] rounded-xl p-6 hover:shadow-lg transition-shadow h-full shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${accent}1A` }}>
          <Icon size={20} style={{ color: accent }} />
        </div>
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.08em] mb-1" style={{ color: accent }}>{acronym}</p>
          <h3 className="text-[18px] font-bold text-[#0F172A]">{name}</h3>
          <p className="text-[15px] leading-relaxed text-[#334155] mt-2">{description}</p>
        </div>
      </div>

      <p className="text-[11px] font-semibold text-[#64748B] uppercase mb-2">DTMP Architecture Role</p>
      <ul className="list-disc list-inside space-y-1 text-[14px] text-[#334155] mb-4">
        {outcomes.map((outcome) => (
          <li key={outcome}>{outcome}</li>
        ))}
      </ul>

      <Link to={route} className="text-sm font-semibold" style={{ color: accent }}>
        → {ctaLabel}
      </Link>
    </div>
  );
}
