import { ValueProp } from "@/data/valueProps";
import { IconBadge } from "@/components/landing/shared";

interface ValueCardProps {
  value: ValueProp;
}

export function ValueCard({ value }: ValueCardProps) {
  const { icon: Icon, name, description } = value;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 text-center hover:shadow-md transition-all">
      <div className="flex justify-center mb-4">
        <IconBadge icon={<Icon size={18} className="text-white" />} />
      </div>
      <h3 className="font-bold text-slate-800 mb-2 text-base">{name}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
