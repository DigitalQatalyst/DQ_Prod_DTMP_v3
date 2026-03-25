import { Sparkles } from "lucide-react";

export const iconGradient = "linear-gradient(135deg, #1e3a5f 0%, #0369A1 100%)";

export function SectionPill({ label }: { label: string }) {
  return (
    <div className="flex justify-center mb-4">
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-300 bg-white text-xs font-semibold uppercase tracking-widest text-slate-500">
        <Sparkles size={12} className="text-violet-500" />
        {label}
      </span>
    </div>
  );
}

export function IconBadge({ icon, size = 60 }: { icon: React.ReactNode; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-xl flex-shrink-0"
      style={{ width: size, height: size, background: iconGradient }}
    >
      {icon}
    </div>
  );
}

export function StatCard({ value, label, sub }: { value: string; label: string; sub: string }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 transition-all duration-200" style={{}} onMouseEnter={e => (e.currentTarget.style.boxShadow = "6px 8px 24px rgba(0,0,0,0.13)")} onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}>
      <p className="text-3xl font-bold mb-1" style={{ background: "linear-gradient(90deg, #6d28d9 0%, #db2777 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{value}</p>
      <p className="font-semibold text-slate-800 text-sm mb-2">{label}</p>
      <p className="text-xs text-slate-500 leading-relaxed">{sub}</p>
    </div>
  );
}
