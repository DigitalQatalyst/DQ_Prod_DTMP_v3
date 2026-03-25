import { StreamCard } from "@/components/cards/StreamCard";
import { executionStreams } from "@/data/executionStreams";
import { SectionPill } from "@/components/landing/shared";

export function ExecutionStreams() {
  return (
    <section className="py-20" style={{ background: "#EEF2FF" }}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <SectionPill label="Digital DEWA — Four Strategic Pillars" />
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 text-center mb-3">
          The Four Strategic Pillars of Digital DEWA
        </h2>
        <p className="text-slate-500 text-center max-w-2xl mx-auto mb-12 text-sm leading-relaxed">
          These live programmes define DEWA&apos;s digital future. DTMP provides the
          architecture governance layer that keeps all four aligned to one enterprise direction.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {executionStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </div>
    </section>
  );
}
