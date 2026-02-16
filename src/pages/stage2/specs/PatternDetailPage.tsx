import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getPatternById } from '@/data/specs/patterns';

export default function PatternDetailPage() {
  const { patternId } = useParams<{ patternId: string }>();
  const navigate = useNavigate();
  
  const pattern = patternId ? getPatternById(patternId) : null;
  
  if (!pattern) {
    return (
      <div className="stage2-content p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Pattern not found</p>
          <Button onClick={() => navigate('/stage2/specs/patterns')} className="mt-4">
            Back to Patterns
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
        onClick={() => navigate('/stage2/specs/patterns')}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Patterns
      </Button>

      <div className="bg-white rounded-lg border border-gray-200 p-8 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 text-sm font-medium bg-orange-100 text-orange-700 rounded">
                {pattern.patternType}
              </span>
              <span className="px-3 py-1 text-sm font-medium bg-gray-100 text-gray-700 rounded">
                {pattern.difficulty}
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{pattern.name}</h1>
            <p className="text-lg text-gray-600 mb-2">{pattern.intent}</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Problem</h2>
          <p className="text-gray-700">{pattern.problem}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Solution</h2>
          <p className="text-gray-700">{pattern.solution}</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {pattern.benefits.map((benefit, idx) => (
              <li key={idx}>{benefit}</li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tradeoffs</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            {pattern.tradeoffs.map((tradeoff, idx) => (
              <li key={idx}>{tradeoff}</li>
            ))}
          </ul>
        </div>

        {pattern.codeExamples.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Code Examples</h2>
            {pattern.codeExamples.map((example, idx) => (
              <div key={idx} className="mb-4">
                <h3 className="font-medium text-gray-900 mb-2">{example.language} - {example.description}</h3>
                <pre className="bg-gray-100 p-4 rounded overflow-x-auto">
                  <code>{example.code}</code>
                </pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}




