import { ValueProp } from "@/data/valueProps";

interface ValueCardProps {
  value: ValueProp;
}

export function ValueCard({ value }: ValueCardProps) {
  const { icon: Icon, name, description } = value;
  const accent =
    value.id === "accelerate"
      ? "#F97316"
      : value.id === "control"
        ? "#16A34A"
        : value.id === "quality"
          ? "#0EA5E9"
          : "#7C3AED";

  return (
    <div
      className="bg-white border border-[#E2E8F0] rounded-xl p-6 text-center hover:shadow-lg transition-shadow shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
      style={{ borderTop: `4px solid ${accent}` }}
    >
      <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${accent}1A` }}>
        <Icon size={22} style={{ color: accent }} />
      </div>

      <h3 className="text-[18px] font-bold text-[#0F172A] mb-2">{name}</h3>
      <p className="text-sm text-[#334155]">{description}</p>
    </div>
  );
}
