import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserDesignById } from '@/data/specs/userDesigns';

export default function DesignDetailPage() {
  const { designId } = useParams<{ designId: string }>();
  const navigate = useNavigate();
  
  const design = designId ? getUserDesignById(designId) : null;
  
  if (!design) {
    return (
      <div className="stage2-content p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Design not found</p>
          <Button onClick={() => navigate('/stage2/specs/my-designs')} className="mt-4">
            Back to My Designs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="stage2-content p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate('/stage2/specs/my-designs')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to My Designs
      </Button>

      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded ${
                design.status === 'approved' ? 'bg-green-100 text-green-700' :
                design.status === 'in-review' ? 'bg-yellow-100 text-yellow-700' :
                design.status === 'draft' ? 'bg-gray-100 text-gray-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {design.status}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded">
                {design.designType}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{design.title}</h1>
            <p className="text-lg text-gray-600 mb-4">{design.description}</p>
            <div className="text-sm text-gray-600">
              <p><span className="font-medium">Owner:</span> {design.owner.name} ({design.owner.role})</p>
              {design.projectName && <p><span className="font-medium">Project:</span> {design.projectName}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Objective</h2>
          <p className="text-gray-700">{design.businessObjective}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {design.requirements.map((req, idx) => (
              <li key={idx}>{req}</li>
            ))}
          </ul>
        </div>

        {design.architectureDecisions.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Architecture Decisions</h2>
            <div className="space-y-4">
              {design.architectureDecisions.map(adr => (
                <div key={adr.id} className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{adr.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      adr.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      adr.status === 'proposed' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {adr.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2"><span className="font-medium">Context:</span> {adr.context}</p>
                  <p className="text-sm text-gray-700 mb-2"><span className="font-medium">Decision:</span> {adr.decision}</p>
                  <p className="text-sm text-gray-700"><span className="font-medium">Consequences:</span> {adr.consequences}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {design.comments.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments</h2>
            <div className="space-y-4">
              {design.comments.map(comment => (
                <div key={comment.id} className="border-l-4 border-gray-300 pl-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">{comment.author.name}</span>
                    <span className="text-xs text-gray-500">{comment.author.role}</span>
                    <span className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleDateString()}</span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}




