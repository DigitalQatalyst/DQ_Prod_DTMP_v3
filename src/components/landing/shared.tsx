import { Sparkles } from "lucide-react";

export const iconGradient = "linear-gradient(135deg, #6d28d9 0%, #db2777 60%, #ea580c 100%)";

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

export function IconBadge({ icon, size = 40 }: { icon: React.ReactNode; size?: number }) {
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
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <p className="text-3xl font-bold mb-1" style={{ color: "#6d28d9" }}>{value}</p>
      <p className="font-semibold text-slate-800 text-sm mb-1">{label}</p>
      <p className="text-xs text-slate-500 leading-relaxed">{sub}</p>
    </div>
  );
}
