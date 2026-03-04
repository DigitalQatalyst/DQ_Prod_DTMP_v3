import { RequestCard as RequestCardType } from "@/types/requests";
import { RequestCard } from "./RequestCard";
import { portfolioRequestCards } from "@/data/portfolio/requestCards";

interface RequestCardsSectionProps {
  serviceId: string;
  onRequestClick: (card: RequestCardType) => void;
}

export function RequestCardsSection({ serviceId, onRequestClick }: RequestCardsSectionProps) {
  // Get request cards for this service
  const config = portfolioRequestCards.find(c => c.serviceId === serviceId);
  const cards = config?.cards || [];

  if (cards.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-12 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Request Expert Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Based on the insights above, request customized analysis, reports, workshops, or consulting 
            from our Portfolio Management experts to help you take action.
          </p>
        </div>

        {/* Request Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <RequestCard 
              key={card.id} 
              card={card} 
              onRequestClick={onRequestClick}
            />
          ))}
        </div>

        {/* Help Text */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Not sure which service to request? Contact our Portfolio Management team at{' '}
            <a href="mailto:portfolio@company.com" className="text-orange-600 hover:text-orange-700 font-medium">
              portfolio@company.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
