import React, { useState } from 'react';
import { LearningLesson, ConceptPillar } from '../types/learning';
import {
  Compass,
  ArrowRight,
  Sparkles,
  BookOpen,
  Code,
  Network,
  HelpCircle,
  BookmarkPlus,
  Check,
} from 'lucide-react';

interface ConceptExplorerProps {
  lesson: LearningLesson;
  onNavigateToTab: (tab: 'tutor' | 'simulation' | 'flashcards' | 'quiz') => void;
  onAskTutor: (prompt: string) => void;
  onSaveBookmark: (text: string, category: string) => void;
}

export const ConceptExplorer: React.FC<ConceptExplorerProps> = ({
  lesson,
  onNavigateToTab,
  onAskTutor,
  onSaveBookmark,
}) => {
  const [selectedPillar, setSelectedPillar] = useState<number>(0);
  const [activeGraphNode, setActiveGraphNode] = useState<string | null>(null);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  const [imgError, setImgError] = useState(false);

  const handleSavePillar = (pillar: ConceptPillar, index: number) => {
    onSaveBookmark(
      `**${pillar.title}**\n${pillar.explanation}\n*Key Takeaway*: ${pillar.keyTakeaway}`,
      `${lesson.title} - Pillar`
    );
    setSavedIndex(index);
    setTimeout(() => setSavedIndex(null), 2000);
  };

  // Node graph definitions based on lesson
  const graphNodes = [
    { id: 'foundation', label: '1. Foundations', sub: lesson.prerequisites[0] || 'Prerequisites', x: 80, y: 70 },
    { id: 'core', label: '2. Core Dynamics', sub: lesson.deepConcepts[0]?.title || 'Core Rule', x: 260, y: 70 },
    { id: 'feedback', label: '3. Equilibrium', sub: lesson.deepConcepts[1]?.title || 'Feedback Loop', x: 440, y: 70 },
    { id: 'synthesis', label: '4. Application', sub: lesson.deepConcepts[2]?.title || 'Edge Cases', x: 620, y: 70 },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">
      {/* Top Banner / Topic Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="lg:col-span-7 space-y-4">
          {/* Unboxed Metadata as per frontend guidelines */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-indigo-400 font-semibold">{lesson.category}</span>
            <span aria-hidden="true">·</span>
            <span>{lesson.deepConcepts.length} Core Pillars</span>
            <span aria-hidden="true">·</span>
            <span>{lesson.flashcards.length} Flashcards</span>
            <span aria-hidden="true">·</span>
            <span>{lesson.quiz.length} Assessment Questions</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-display text-balance">
            {lesson.title}
          </h1>

          <p className="text-sm text-indigo-300/90 font-medium">
            {lesson.tagline}
          </p>

          <p className="text-sm text-slate-300 leading-relaxed">
            {lesson.overview}
          </p>

          {/* Prerequisites - Unboxed text */}
          <div className="pt-2">
            <span className="text-xs text-slate-500 font-medium mr-2">Prerequisites:</span>
            <span className="text-xs text-slate-300">
              {lesson.prerequisites.join(' · ')}
            </span>
          </div>
        </div>

        {/* Visual Slot with Zero-Broken-Image Fallback */}
        <div className="lg:col-span-5">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
            {lesson.imageSrc && !imgError ? (
              <img
                src={lesson.imageSrc}
                alt={lesson.title}
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-indigo-950/40 to-slate-900">
                <Compass className="w-10 h-10 text-indigo-400 mb-2" />
                <span className="text-sm font-semibold text-slate-200">{lesson.title}</span>
                <span className="text-xs text-slate-500 mt-1">Conceptual Blueprint & Mental Model</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Core Metaphor Card */}
      <div className="bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900/60 border border-indigo-900/40 rounded-xl p-5 relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-400 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xs font-semibold text-indigo-300 tracking-wider">
              CORE MENTAL ANALOGY
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed italic">
              "{lesson.coreMetaphor}"
            </p>
          </div>
        </div>
      </div>

      {/* Concept Pillars & Deep Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white font-display">
            Pillars of Understanding
          </h2>
          <span className="text-xs text-slate-400">
            Select a pillar to inspect formal equations and mechanisms
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {lesson.deepConcepts.map((pillar, idx) => {
            const isSelected = selectedPillar === idx;
            return (
              <div
                key={idx}
                onClick={() => setSelectedPillar(idx)}
                className={`cursor-pointer rounded-xl p-5 border transition-all ${
                  isSelected
                    ? 'bg-slate-900/90 border-indigo-500 shadow-md ring-1 ring-indigo-500/30'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/70'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-indigo-400">
                    Pillar 0{idx + 1}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSavePillar(pillar, idx);
                    }}
                    title="Bookmark this pillar"
                    className="text-slate-500 hover:text-indigo-400 transition-colors"
                  >
                    {savedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <BookmarkPlus className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <h3 className="text-base font-semibold text-white mb-2 font-display">
                  {pillar.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-4 mb-3">
                  {pillar.explanation}
                </p>

                {pillar.formulaOrCode && (
                  <div className="bg-slate-950 p-2 rounded border border-slate-800 text-xs font-mono text-indigo-300 mb-3 overflow-x-auto">
                    {pillar.formulaOrCode}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400">
                  <strong className="text-slate-300">Takeaway:</strong> {pillar.keyTakeaway}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Conceptual Pathway / SVG Knowledge Flow */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">
              Sequential Cognitive Flow Map
            </h3>
          </div>
          <span className="text-xs text-slate-400">
            Click any checkpoint node to explore the reasoning flow
          </span>
        </div>

        {/* SVG Flow diagram */}
        <div className="w-full overflow-x-auto py-2">
          <svg
            className="w-[720px] h-[130px] mx-auto block"
            viewBox="0 0 720 130"
          >
            {/* Connection Lines */}
            <line x1="80" y1="50" x2="260" y2="50" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="260" y1="50" x2="440" y2="50" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
            <line x1="440" y1="50" x2="620" y2="50" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />

            {/* Nodes */}
            {graphNodes.map((node) => {
              const isActive = activeGraphNode === node.id;
              return (
                <g
                  key={node.id}
                  onClick={() => setActiveGraphNode(activeGraphNode === node.id ? null : node.id)}
                  className="cursor-pointer group"
                >
                  <circle
                    cx={node.x}
                    cy="50"
                    r={isActive ? 22 : 18}
                    fill={isActive ? '#4f46e5' : '#1e293b'}
                    stroke={isActive ? '#818cf8' : '#475569'}
                    strokeWidth="2"
                    className="transition-all"
                  />
                  <text
                    x={node.x}
                    y="54"
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="11"
                    fontWeight="bold"
                    className="pointer-events-none select-none font-mono"
                  >
                    {node.id === 'foundation' ? '01' : node.id === 'core' ? '02' : node.id === 'feedback' ? '03' : '04'}
                  </text>
                  <text
                    x={node.x}
                    y="88"
                    textAnchor="middle"
                    fill={isActive ? '#818cf8' : '#cbd5e1'}
                    fontSize="11"
                    fontWeight="600"
                    className="pointer-events-none select-none"
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x}
                    y="104"
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize="9"
                    className="pointer-events-none select-none truncate"
                  >
                    {node.sub.slice(0, 22)}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {activeGraphNode && (
          <div className="bg-slate-950 p-4 rounded-lg border border-indigo-900/60 text-xs text-slate-300 flex items-start justify-between gap-4 animate-in fade-in duration-150">
            <div>
              <span className="text-indigo-400 font-semibold mr-2 font-mono">NODE INSIGHT:</span>
              <span>
                {activeGraphNode === 'foundation' &&
                  `Starts with the axioms: ${lesson.prerequisites.join(' and ')}. Without these, subsequent derivations become brittle.`}
                {activeGraphNode === 'core' &&
                  `First principles update mechanics: ${lesson.deepConcepts[0]?.explanation || 'The primary governing dynamic.'}`}
                {activeGraphNode === 'feedback' &&
                  `System equilibrium: ${lesson.deepConcepts[1]?.explanation || 'Balancing forces.'}`}
                {activeGraphNode === 'synthesis' &&
                  `Real-world deployment and limit testing: ${lesson.deepConcepts[2]?.explanation || 'Edge conditions.'}`}
              </span>
            </div>
            <button
              onClick={() => onAskTutor(`Tell me more about the ${activeGraphNode} stage of ${lesson.title}`)}
              className="text-indigo-400 hover:text-indigo-300 font-medium whitespace-nowrap shrink-0 flex items-center gap-1"
            >
              <span>Ask Tutor</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Suggested Follow-up Questions & Next Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-white">
              Thought Experiments & Inquiries
            </h3>
          </div>
          <div className="space-y-2">
            {lesson.nextQuestions.map((q, qIdx) => (
              <button
                key={qIdx}
                onClick={() => onAskTutor(q)}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 hover:border-indigo-500 hover:text-indigo-200 transition-colors flex items-center justify-between group"
              >
                <span>{q}</span>
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white">
              Ready to test your intuition?
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Step into the interactive simulator to manipulate parameters live, review spaced repetition flashcards, or take the diagnostic quiz.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={() => onNavigateToTab('simulation')}
              className="flex-1 py-2 px-3 text-xs font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors text-center"
            >
              Open Interactive Sim
            </button>
            <button
              onClick={() => onNavigateToTab('quiz')}
              className="flex-1 py-2 px-3 text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 hover:text-white transition-colors text-center"
            >
              Take Practice Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
