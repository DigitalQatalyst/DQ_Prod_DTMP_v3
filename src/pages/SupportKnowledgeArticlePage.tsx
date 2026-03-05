import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Eye, CheckCircle, Tag } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { knowledgeArticles, KnowledgeArticle } from "@/data/supportData";

interface KnowledgeDetailContent {
  stepByStepActions: string[];
  keyTakeaways: string[];
  fullGuidance: string;
  whyThisMatters: string;
  signalsToWatch: string;
  ifIssuesPersist: string;
}

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const withPeriod = (value: string) => (/[.!?]$/.test(value) ? value : `${value}.`);

const knowledgeDetailOverrides: Record<string, Partial<KnowledgeDetailContent>> = {
  "KB-00120": {
    stepByStepActions: ["SPF, DKIM, DMARC checks and queue monitoring steps."],
    keyTakeaways: ["Checklist to troubleshoot outbound email delays and failures."],
    fullGuidance: "SPF, DKIM, DMARC checks and queue monitoring steps.",
    whyThisMatters: "Checklist to troubleshoot outbound email delays and failures.",
    signalsToWatch:
      "Look for recurring themes like email, delivery, queue in user reports or monitoring alerts; they often indicate the same root causes described here.",
    ifIssuesPersist:
      "Capture logs/screenshots and submit a Support Services request from this page so the team can triage with the context above.",
  },
};

const buildKnowledgeDetailContent = (article: KnowledgeArticle): KnowledgeDetailContent => {
  const plainContent = stripHtml(article.content);
  const summary = withPeriod(article.summary.trim());
  const guidance = withPeriod((plainContent || article.summary).trim());
  const area = (article.subcategory || article.category).toLowerCase();
  const tagsLabel = article.tags.join(", ");

  const defaults: KnowledgeDetailContent = {
    stepByStepActions: [guidance],
    keyTakeaways: [summary],
    fullGuidance: guidance,
    whyThisMatters: `Resolving ${area} issues quickly reduces repeat incidents and business disruption.`,
    signalsToWatch: tagsLabel
      ? `Look for recurring themes like ${tagsLabel} in user reports or monitoring alerts; they often indicate the same root causes described here.`
      : "Look for recurring user reports and monitoring alerts that indicate repeat failure patterns.",
    ifIssuesPersist:
      "Capture logs/screenshots and submit a Support Services request from this page so the team can triage with the same context above.",
  };

  const override = knowledgeDetailOverrides[article.id];
  if (!override) {
    return defaults;
  }

  return {
    ...defaults,
    ...override,
    stepByStepActions: override.stepByStepActions ?? defaults.stepByStepActions,
    keyTakeaways: override.keyTakeaways ?? defaults.keyTakeaways,
  };
};

export default function SupportKnowledgeArticlePage() {
  const { articleId } = useParams<{ articleId: string }>();
  const navigate = useNavigate();

  const article = useMemo(
    () => knowledgeArticles.find((item) => item.id === articleId),
    [articleId],
  );

  if (!article) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1" id="main-content">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <button
              type="button"
              onClick={() => navigate("/marketplaces/support-services?tab=knowledge-base")}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft size={16} />
              Back to Knowledge Base
            </button>
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <h1 className="text-2xl font-semibold text-gray-900">Article not found</h1>
              <p className="text-sm text-gray-600 mt-2">The selected article is no longer available.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const detailContent = buildKnowledgeDetailContent(article);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1" id="main-content">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <button
            type="button"
            onClick={() => navigate("/marketplaces/support-services?tab=knowledge-base")}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={16} />
            Back to Knowledge Base
          </button>

          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="inline-flex items-center gap-1">
                <Tag size={12} />
                {article.category}
              </span>
              <span className="capitalize">{article.difficulty}</span>
              <span>{article.estimatedReadTime}</span>
            </div>

            <h1 className="text-xl font-bold text-gray-900">{article.title}</h1>
            <p className="text-[13px] text-gray-700">{article.summary}</p>

            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <span className="inline-flex items-center gap-1">
                <Calendar size={14} /> Updated {new Date(article.updatedAt).toLocaleDateString()}
              </span>
              <span className="inline-flex items-center gap-1">
                <Clock size={14} /> {article.estimatedReadTime}
              </span>
              <span className="inline-flex items-center gap-1">
                <Eye size={14} /> {article.views.toLocaleString()} views
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle size={14} /> {article.helpfulPercentage}% found this helpful
              </span>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {article.tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-4 mt-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Step-by-step actions</h3>
              <ul className="list-disc ml-5 mt-2 text-[13px] text-gray-700 space-y-1">
                {detailContent.stepByStepActions.map((step, index) => (
                  <li key={`${article.id}-step-${index}`}>{step}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Key takeaways</h3>
              <ul className="list-disc ml-5 mt-2 text-[13px] text-gray-700 space-y-1">
                {detailContent.keyTakeaways.map((point, index) => (
                  <li key={`${article.id}-takeaway-${index}`}>{point}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900">Full guidance</h3>
              <p className="text-[13px] text-gray-700 mt-2">{detailContent.fullGuidance}</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900">Why this matters</h3>
              <p className="text-[13px] text-gray-700 mt-1">{detailContent.whyThisMatters}</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900">Signals to watch</h3>
              <p className="text-[13px] text-gray-700 mt-1">{detailContent.signalsToWatch}</p>
            </div>

            <div>
              <h3 className="text-base font-semibold text-gray-900">If issues persist</h3>
              <p className="text-[13px] text-gray-700 mt-1">{detailContent.ifIssuesPersist}</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
