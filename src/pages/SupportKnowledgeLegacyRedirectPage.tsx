import { Navigate, useParams } from "react-router-dom";

export default function SupportKnowledgeLegacyRedirectPage() {
  const { articleId } = useParams<{ articleId: string }>();

  if (!articleId) {
    return <Navigate to="/marketplaces/support-services?tab=knowledge-base" replace />;
  }

  return <Navigate to={`/marketplaces/support-services/knowledge/${articleId}`} replace />;
}
