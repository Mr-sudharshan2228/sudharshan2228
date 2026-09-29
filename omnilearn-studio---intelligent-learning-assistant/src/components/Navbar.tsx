import React from 'react';
import { ActiveTab } from '../types/learning';
import { Sparkles, Timer, Bookmark } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openFocusTimer: () => void;
  openNotes: () => void;
  bookmarksCount: number;
  currentTopicTitle: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  openFocusTimer,
  openNotes,
  bookmarksCount,
  currentTopicTitle,
}) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'tutor', label: 'Tutor Chat' },
    { id: 'explore', label: 'Concept Explorer' },
    { id: 'simulation', label: 'Interactive Sim' },
    { id: 'flashcards', label: 'Flashcards' },
    { id: 'quiz', label: 'Knowledge Quiz' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-6 py-3.5">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('tutor');
            }}
            className="text-lg font-bold tracking-tight text-white font-display hover:text-indigo-400 transition-colors"
          >
            OmniLearn Studio
          </a>
          <span className="hidden sm:inline-block text-xs text-slate-500 font-mono border-l border-slate-800 pl-3">
            {currentTopicTitle}
          </span>
        </div>

        {/* Zone 2: 4-6 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative py-1 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={openNotes}
            className="relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 rounded-md hover:bg-slate-800 hover:text-white transition-colors whitespace-nowrap"
            title="Saved Notes & Key Insights"
          >
            <Bookmark className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">Notes</span>
            {bookmarksCount > 0 && (
              <span className="font-mono text-xs px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded">
                {bookmarksCount}
              </span>
            )}
          </button>

          <button
            onClick={openFocusTimer}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors shadow-sm whitespace-nowrap"
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Focus Mode</span>
          </button>
        </div>
      </div>
    </header>
  );
};
