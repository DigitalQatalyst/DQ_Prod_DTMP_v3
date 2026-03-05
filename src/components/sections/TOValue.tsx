import { ValueCard } from "@/components/cards/ValueCard";
import { valueProps, stats } from "@/data/valueProps";

export function TOValue() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">
            Corporate EA Office Value
          </h2>
          <p className="section-subheading max-w-3xl mx-auto">
            Why enterprise-wide EA governance matters and what it delivers for all DEWA divisions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {valueProps.map((value) => (
            <ValueCard key={value.id} value={value} />
          ))}
        </div>

        <div className="bg-[#EBF4FB] rounded-xl p-6 text-center mb-10">
          <p className="text-2xl font-bold text-primary mb-1">One Architecture. One Direction. Across All of DEWA.</p>
          <p className="text-slate-700">
            Governed by DEWA&apos;s Corporate EA Office, not fragmented across divisions.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="rounded-xl p-6 text-center bg-white border border-[#E2E8F0] shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              style={{
                borderTop: `4px solid ${
                  index === 0 ? "#0EA5E9" : index === 1 ? "#16A34A" : index === 2 ? "#F97316" : "#166534"
                }`,
              }}
            >
              <p
                className="text-[44px] lg:text-[56px] leading-none font-bold mb-2"
                style={{ color: index === 0 ? "#0EA5E9" : index === 1 ? "#16A34A" : index === 2 ? "#F97316" : "#166534" }}
              >
                {stat.value}
              </p>
              <p className="text-[14px] font-semibold text-[#64748B] mb-1">{stat.label}</p>
              <p className="text-xs text-[#64748B]">{stat.note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
