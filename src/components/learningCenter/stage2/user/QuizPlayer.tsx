import { useMemo, useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { QuizRuntimeConfig } from "@/data/learningCenter/stage2/types";

interface QuizPlayerProps {
  config: QuizRuntimeConfig;
  attemptsUsed: number;
  onSubmit: (score: number) => void;
  onClose: () => void;
}

const QuizPlayer = ({ config, attemptsUsed, onSubmit, onClose }: QuizPlayerProps) => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);

  const totalQuestions = config.questions.length;
  const answered = Object.keys(answers).length;
  const completion = totalQuestions === 0 ? 0 : Math.round((answered / totalQuestions) * 100);

  const result = useMemo(() => {
    if (submittedScore === null) return null;
    return {
      passed: submittedScore >= config.passThreshold,
    };
  }, [submittedScore, config.passThreshold]);

  const handleAnswer = (questionId: string, optionId: string) => {
    if (submittedScore !== null) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    if (answered < totalQuestions || totalQuestions === 0) return;
    const correct = config.questions.filter(
      (question) => answers[question.id] === question.correctOptionId
    ).length;
    const score = Math.round((correct / totalQuestions) * 100);
    setSubmittedScore(score);
    onSubmit(score);
  };

  return (
    <div className="mt-4 rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between gap-3 mb-4">
        <div>
          <h4 className="text-base font-semibold text-primary-navy">{config.title}</h4>
          <p className="text-xs text-muted-foreground">
            Attempt {Math.min(attemptsUsed + 1, config.maxAttempts)} of {config.maxAttempts} • Pass mark {config.passThreshold}%
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Quiz completion</span>
          <span>{completion}%</span>
        </div>
        <Progress value={completion} className="h-2 [&>div]:bg-orange-600" />
      </div>

      <div className="space-y-4">
        {config.questions.map((question, index) => (
          <div key={question.id} className="rounded-lg border border-gray-200 p-4">
            <p className="text-sm font-medium text-foreground mb-3">
              {index + 1}. {question.prompt}
            </p>
            <div className="grid gap-2">
              {question.options.map((option) => {
                const selected = answers[question.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleAnswer(question.id, option.id)}
                    className={`text-left rounded-md border px-3 py-2 text-sm ${
                      selected
                        ? "border-orange-500 bg-orange-50 text-orange-800"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {option.text}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Button
          size="sm"
          className="bg-orange-600 hover:bg-orange-700 text-white"
          onClick={handleSubmit}
          disabled={answered < totalQuestions || submittedScore !== null}
        >
          Submit Quiz
        </Button>
        {submittedScore !== null && result && (
          <div
            className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm ${
              result.passed
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {result.passed ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <XCircle className="w-4 h-4" />
            )}
            Score: {submittedScore}% ({result.passed ? "Passed" : "Retry required"})
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;
