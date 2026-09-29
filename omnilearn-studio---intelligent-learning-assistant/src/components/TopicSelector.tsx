import React, { useState } from 'react';
import { LearningLesson } from '../types/learning';
import { Search, Loader2, Sparkles, BookOpen, Layers } from 'lucide-react';

interface TopicSelectorProps {
  lessons: LearningLesson[];
  activeLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  onGenerateCustomLesson: (topic: string) => Promise<void>;
  isGeneratingLesson: boolean;
}

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  lessons,
  activeLessonId,
  onSelectLesson,
  onGenerateCustomLesson,
  isGeneratingLesson,
}) => {
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [showGenerator, setShowGenerator] = useState(false);

  const handleSubmitCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopicInput.trim() || isGeneratingLesson) return;
    onGenerateCustomLesson(customTopicInput.trim());
    setCustomTopicInput('');
  };

  return (
    <div className="w-full border-b border-slate-800/80 bg-slate-900/40 px-6 py-4">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Curated Topic Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium shrink-0 mr-1">
            <Layers className="w-3.5 h-3.5 text-indigo-400" />
            <span>Modules:</span>
          </div>

          {lessons.map((lesson) => {
            const isSelected = lesson.id === activeLessonId;
            return (
              <button
                key={lesson.id}
                onClick={() => onSelectLesson(lesson.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-200 border-indigo-500/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/80'
                }`}
              >
                {lesson.title}
              </button>
            );
          })}

          <button
            onClick={() => setShowGenerator(!showGenerator)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all flex items-center gap-1 border ${
              showGenerator
                ? 'bg-violet-600/30 text-violet-200 border-violet-500'
                : 'bg-slate-900 text-violet-300 border-violet-900/60 hover:bg-violet-950/40'
            }`}
          >
            <Sparkles className="w-3 h-3 text-violet-400" />
            <span>+ Custom Topic</span>
          </button>
        </div>

        {/* Quick Search / Direct Topic Prompt */}
        {showGenerator && (
          <form
            onSubmit={handleSubmitCustom}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <div className="relative flex-1 md:w-72">
              <input
                type="text"
                value={customTopicInput}
                onChange={(e) => setCustomTopicInput(e.target.value)}
                placeholder="e.g. Mitochondria, Transformer Attention..."
                className="w-full px-3 py-1.5 pl-8 text-xs bg-slate-950 border border-slate-700 rounded-md text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                disabled={isGeneratingLesson}
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-500" />
            </div>
            <button
              type="submit"
              disabled={!customTopicInput.trim() || isGeneratingLesson}
              className="px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 shrink-0"
            >
              {isGeneratingLesson ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Create Module</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
