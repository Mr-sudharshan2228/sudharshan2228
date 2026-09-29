import React, { useState } from 'react';
import { QuizQuestion, LearningLesson } from '../types/learning';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Award,
  BookOpen,
} from 'lucide-react';

interface QuizWorkspaceProps {
  lesson: LearningLesson;
  onAskTutor: (prompt: string) => void;
}

export const QuizWorkspace: React.FC<QuizWorkspaceProps> = ({ lesson, onAskTutor }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(lesson.quiz);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showHint, setShowHint] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Reset when lesson switches
  React.useEffect(() => {
    setQuestions(lesson.quiz);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setShowHint(false);
    setIsCompleted(false);
  }, [lesson.id]);

  const currentQ = questions[currentIndex];
  const userSelectedIndex = selectedAnswers[currentIndex];
  const hasAnsweredCurrent = userSelectedIndex !== undefined;

  const handleSelectOption = (optIndex: number) => {
    if (hasAnsweredCurrent) return;
    setSelectedAnswers((prev) => ({ ...prev, [currentIndex]: optIndex }));
  };

  const handleNext = () => {
    setShowHint(false);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((c) => c + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setShowHint(false);
    setIsCompleted(false);
  };

  const correctCount = Object.entries(selectedAnswers).filter(
    ([qIdx, optIdx]) => questions[Number(qIdx)]?.correctIndex === optIdx
  ).length;

  if (isCompleted) {
    const scorePct = Math.round((correctCount / questions.length) * 100);
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 mx-auto flex items-center justify-center">
          <Award className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white font-display">
            Assessment Completed!
          </h2>
          <p className="text-sm text-slate-400">
            You scored{' '}
            <span className="text-indigo-400 font-bold font-mono tabular-nums">
              {correctCount} / {questions.length} ({scorePct}%)
            </span>{' '}
            on {lesson.title}.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 max-w-md mx-auto text-left leading-relaxed">
          {scorePct >= 80 ? (
            <p>
              🌟 <strong>Exceptional conceptual mastery!</strong> You demonstrate deep understanding of the governing mechanics, equilibrium conditions, and edge cases.
            </p>
          ) : scorePct >= 50 ? (
            <p>
              📘 <strong>Solid conceptual foundation.</strong> Review the core metaphor and test parameter boundaries in the Interactive Simulator to solidify your understanding.
            </p>
          ) : (
            <p>
              💡 <strong>Growth opportunity detected.</strong> We recommend a Socratic tutoring session with OmniLearn to break down the first-principles steps before re-testing.
            </p>
          )}
        </div>

        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={handleRestart}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
          <button
            onClick={() =>
              onAskTutor(
                `I just took the diagnostic assessment on ${lesson.title} and got ${correctCount}/${questions.length}. Can you guide me through my conceptual weak spots?`
              )
            }
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-indigo-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Review with Tutor</span>
          </button>
        </div>
      </div>
    );
  }

  if (!currentQ) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-slate-400">
        No assessment questions loaded.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Quiz Header & Progress */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <span className="text-xs font-mono text-indigo-400 font-semibold uppercase tracking-wider">
            DIAGNOSTIC ASSESSMENT
          </span>
          <h1 className="text-lg font-bold text-white font-display">
            {lesson.title}
          </h1>
        </div>

        <div className="text-xs font-mono text-slate-400 tabular-nums">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6 space-y-6 shadow-md">
        <h2 className="text-base md:text-lg font-semibold text-white leading-snug">
          {currentQ.question}
        </h2>

        {/* Options List */}
        <div className="space-y-3">
          {currentQ.options.map((opt, optIdx) => {
            const isSelected = userSelectedIndex === optIdx;
            const isCorrect = currentQ.correctIndex === optIdx;

            let stateStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900';
            if (hasAnsweredCurrent) {
              if (isCorrect) {
                stateStyle = 'bg-emerald-950/40 border-emerald-600 text-emerald-200';
              } else if (isSelected && !isCorrect) {
                stateStyle = 'bg-rose-950/40 border-rose-600 text-rose-200';
              } else {
                stateStyle = 'bg-slate-950/40 border-slate-800/60 text-slate-500 opacity-60';
              }
            }

            return (
              <button
                key={optIdx}
                onClick={() => handleSelectOption(optIdx)}
                disabled={hasAnsweredCurrent}
                className={`w-full text-left p-4 rounded-lg border text-xs md:text-sm leading-relaxed transition-all flex items-start justify-between gap-3 ${stateStyle}`}
              >
                <div className="flex items-start gap-3">
                  <span className="font-mono text-xs font-bold text-indigo-400 mt-0.5 shrink-0">
                    {String.fromCharCode(65 + optIdx)}.
                  </span>
                  <span>{opt}</span>
                </div>

                {hasAnsweredCurrent && (
                  <div className="shrink-0 mt-0.5">
                    {isCorrect ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 className="w-4 h-4" /> Correct
                      </span>
                    ) : isSelected ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-rose-400">
                        <XCircle className="w-4 h-4" /> Incorrect
                      </span>
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Hint reveal */}
        {!hasAnsweredCurrent && (
          <div className="pt-2">
            <button
              onClick={() => setShowHint(!showHint)}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showHint ? 'Hide Clue' : 'Need a Clue?'}</span>
            </button>
            {showHint && (
              <div className="mt-2 p-3 rounded-lg bg-indigo-950/30 border border-indigo-900/50 text-xs text-indigo-300 leading-relaxed animate-in fade-in duration-150">
                💡 <strong>Clue:</strong> {currentQ.hint}
              </div>
            )}
          </div>
        )}

        {/* Explanation Card upon answering */}
        {hasAnsweredCurrent && (
          <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 animate-in fade-in duration-150">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-indigo-400 font-mono">CONCEPTUAL RATIONALE:</span>
              <button
                onClick={() =>
                  onAskTutor(
                    `Can you explain why "${currentQ.options[currentQ.correctIndex]}" is the correct answer to: "${currentQ.question}"?`
                  )
                }
                className="text-slate-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-indigo-400" />
                <span>Discuss with Tutor</span>
              </button>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Bottom Nav Action */}
      {hasAnsweredCurrent && (
        <div className="flex justify-end pt-2">
          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors shadow-sm"
          >
            <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
