import { ValueProp } from "@/data/valueProps";
import { IconBadge } from "@/components/landing/shared";

interface ValueCardProps {
  value: ValueProp;
}

export function ValueCard({ value }: ValueCardProps) {
  const { icon: Icon, name, description } = value;

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center transition-all" onMouseEnter={e => (e.currentTarget.style.boxShadow = "8px 12px 32px rgba(0,0,0,0.18)")} onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}>
      <div className="flex justify-center mb-4">
        <IconBadge icon={<Icon size={18} className="text-white transition-transform group-hover:scale-110" />} />
      </div>
      <h3 className="font-bold text-slate-800 mb-2 text-base">{name}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
