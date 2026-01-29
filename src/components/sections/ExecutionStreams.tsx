import { StreamCard } from "@/components/cards/StreamCard";
import { executionStreams } from "@/data/executionStreams";

export function ExecutionStreams() {
  return (
    <section className="py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-wide text-muted-foreground mb-2">
            4 Core Streams
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-primary mb-4">
            Execution Streams Feeding DBP
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Four primary execution streams contribute measurable assets and
            capabilities tracked through DBP. Each stream ensures consistent,
            measurable outcomes that advance our digital maturity.
          </p>
        </div>

        {/* Stream Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {executionStreams.map((stream) => (
            <StreamCard key={stream.id} stream={stream} />
          ))}
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground italic">
          All streams are governed by the Transformation Office through this platform
        </p>
      </div>
    </section>
  );
}
