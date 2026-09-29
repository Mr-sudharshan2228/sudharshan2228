import React, { useState, useEffect } from 'react';
import { Flashcard, LearningLesson } from '../types/learning';
import {
  RotateCw,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface FlashcardsDeckProps {
  lesson: LearningLesson;
  onAskTutor: (prompt: string) => void;
}

export const FlashcardsDeck: React.FC<FlashcardsDeckProps> = ({ lesson, onAskTutor }) => {
  const [cards, setCards] = useState<Flashcard[]>(lesson.flashcards);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredIds, setMasteredIds] = useState<Set<string>>(new Set());
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    setCards(lesson.flashcards);
    setCurrentIndex(0);
    setIsFlipped(false);
    setMasteredIds(new Set());
    setActiveCategory('all');
  }, [lesson.id]);

  // Categories list
  const categories = ['all', ...Array.from(new Set(lesson.flashcards.map((c) => c.category)))];

  const filteredCards =
    activeCategory === 'all'
      ? cards
      : cards.filter((c) => c.category === activeCategory);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % filteredCards.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + filteredCards.length) % filteredCards.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setCards([...cards].sort(() => Math.random() - 0.5));
    setCurrentIndex(0);
  };

  const handleMarkMastered = () => {
    if (!currentCard) return;
    setMasteredIds((prev) => {
      const next = new Set(prev);
      if (next.has(currentCard.id)) {
        next.delete(currentCard.id);
      } else {
        next.add(currentCard.id);
      }
      return next;
    });
    // Auto advance if newly mastered
    if (!masteredIds.has(currentCard.id) && currentIndex < filteredCards.length - 1) {
      setTimeout(() => handleNext(), 300);
    }
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        setIsFlipped((f) => !f);
      } else if (e.code === 'ArrowRight') {
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredCards.length]);

  if (!currentCard) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-slate-400">
        No flashcards available in this category.
      </div>
    );
  }

  const isMastered = masteredIds.has(currentCard.id);
  const masteryPercentage = Math.round((masteredIds.size / cards.length) * 100);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
      {/* Deck Header & Category Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-display">
            Active Recall Flashcards
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Spaced repetition memory consolidation for {lesson.title}
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setCurrentIndex(0);
                setIsFlipped(false);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Mastery Progress Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="font-semibold">Mastery:</span>
          <span className="font-mono text-indigo-400 font-bold tabular-nums">
            {masteredIds.size} / {cards.length} cards ({masteryPercentage}%)
          </span>
        </div>
        <div className="flex-1 max-w-xs h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{ width: `${masteryPercentage}%` }}
          />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Shuffle cards"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setMasteredIds(new Set());
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className="p-1 text-slate-400 hover:text-white transition-colors"
            title="Reset mastery progress"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D Flashcard Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer min-h-[300px] w-full rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 flex flex-col justify-between shadow-xl hover:border-slate-700 transition-all select-none relative group"
      >
        {/* Card Top Metadata - Unboxed text */}
        <div className="flex items-center justify-between text-xs text-slate-400 pb-4 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <span className="font-mono text-indigo-400 font-semibold">{currentCard.category}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">
              Card {currentIndex + 1} of {filteredCards.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isMastered && (
              <span className="text-emerald-400 font-semibold flex items-center gap-1 text-[11px]">
                <CheckCircle className="w-3 h-3" /> Mastered
              </span>
            )}
            <span className="text-[11px] text-slate-500 group-hover:text-indigo-400 transition-colors flex items-center gap-1">
              <RotateCw className="w-3 h-3" /> Click to flip
            </span>
          </div>
        </div>

        {/* Center Prompt / Answer */}
        <div className="py-6 flex flex-col items-center justify-center text-center">
          {!isFlipped ? (
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-wider text-slate-500 font-mono">
                QUESTION / CHALLENGE
              </span>
              <p className="text-lg md:text-xl font-medium text-white max-w-xl font-display leading-snug">
                {currentCard.front}
              </p>
            </div>
          ) : (
            <div className="space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <span className="text-[11px] uppercase tracking-wider text-indigo-400 font-mono font-semibold">
                ANSWER & REASONING
              </span>
              <p className="text-base md:text-lg text-slate-200 max-w-xl leading-relaxed">
                {currentCard.back}
              </p>
            </div>
          )}
        </div>

        {/* Card Bottom Hint / Keyboard Tip */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800/80 text-xs text-slate-500">
          <span>Press Space or Enter to flip</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAskTutor(`Can you explain more about this question: "${currentCard.front}"?`);
            }}
            className="hover:text-indigo-300 text-slate-400 flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-indigo-400" />
            <span>Deep Dive with Tutor</span>
          </button>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrev}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <button
          onClick={handleMarkMastered}
          className={`flex items-center gap-1.5 px-5 py-2 text-xs font-semibold rounded-lg border transition-all ${
            isMastered
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800 hover:bg-emerald-900/40'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-emerald-600 hover:text-emerald-400'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          <span>{isMastered ? 'Mastered (Click to Unmark)' : 'Mark as Mastered'}</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
