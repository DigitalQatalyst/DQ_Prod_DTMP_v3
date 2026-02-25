import { useParams, useNavigate } from "react-router-dom";
import SupportLayout from "./SupportLayout";
import { knowledgeArticles } from "@/data/supportData";
import { ArrowLeft, Calendar, Clock, Eye, Tag } from "lucide-react";

export default function ArticleDetailPage() {
  const { articleId } = useParams();
  const navigate = useNavigate();
  const article = knowledgeArticles.find((a) => a.id === articleId);

  if (!article) {
    return (
      <SupportLayout title="Article not found">
        <div className="bg-white border border-gray-200 rounded-lg p-6">Article {articleId} not found.</div>
      </SupportLayout>
    );
  }

  return (
    <SupportLayout title={article.title} description={article.summary}>
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-orange-700 font-semibold mb-4">
        <ArrowLeft size={16} /> Back
      </button>

      <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-3">
        <div className="flex gap-2 text-xs text-gray-600">
          <span className="px-2 py-1 bg-gray-100 rounded-full">{article.category}</span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">{article.difficulty}</span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">{article.estimatedReadTime}</span>
        </div>
        <div className="flex gap-4 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1"><Calendar size={14} /> Updated {new Date(article.updatedAt).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-1"><Clock size={14} /> {article.estimatedReadTime}</span>
          <span className="inline-flex items-center gap-1"><Eye size={14} /> {article.views.toLocaleString()} views</span>
        </div>
        <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 text-xs px-2 py-1 bg-gray-100 rounded-full text-gray-700">
              <Tag size={12} /> {tag}
            </span>
          ))}
        </div>
      </div>
    </SupportLayout>
  );
}
