import { StreamCard } from "@/components/cards/StreamCard";
import { executionStreams } from "@/data/executionStreams";

export function ExecutionStreams() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">Digital DEWA - Four Strategic Pillars</p>
          <h2 className="text-[36px] lg:text-[40px] font-bold text-[#061927] mb-2">
            The Four Strategic Pillars of Digital DEWA
          </h2>
          <p className="section-subheading max-w-4xl mx-auto">
            These live programmes define DEWA&apos;s digital future. DTMP provides the
            architecture governance layer that keeps all four aligned to one
            enterprise direction.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {executionStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>
      </div>
    </section>
  );
}
