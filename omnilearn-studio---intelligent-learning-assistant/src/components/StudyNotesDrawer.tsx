import React, { useState } from 'react';
import { StudyBookmark } from '../types/learning';
import {
  X,
  Bookmark,
  Trash2,
  Copy,
  Check,
  Download,
  Plus,
  FileText,
} from 'lucide-react';

interface StudyNotesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: StudyBookmark[];
  onDeleteBookmark: (id: string) => void;
  onAddCustomNote: (text: string) => void;
  currentTopicTitle: string;
}

export const StudyNotesDrawer: React.FC<StudyNotesDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onDeleteBookmark,
  onAddCustomNote,
  currentTopicTitle,
}) => {
  const [newNoteText, setNewNoteText] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    onAddCustomNote(newNoteText.trim());
    setNewNoteText('');
  };

  const handleCopyAll = () => {
    const markdown = `# OmniLearn Study Notes: ${currentTopicTitle}\n\n` +
      bookmarks
        .map((b) => `### ${b.category} (${b.date})\n${b.text}\n`)
        .join('\n---\n\n');

    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMarkdown = () => {
    const markdown = `# OmniLearn Study Notes: ${currentTopicTitle}\n\n` +
      bookmarks
        .map((b) => `### ${b.category} (${b.date})\n${b.text}\n`)
        .join('\n---\n\n');

    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniLearn_Notes_${currentTopicTitle.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 p-6 flex flex-col shadow-2xl space-y-5 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-indigo-400" />
            <h2 className="text-base font-bold text-white font-display">
              Saved Study Notes & Insights
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Row */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 font-mono">
            {bookmarks.length} saved insights
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyAll}
              disabled={bookmarks.length === 0}
              className="flex items-center gap-1 px-2.5 py-1 text-slate-300 bg-slate-800 border border-slate-700 rounded hover:bg-slate-700 transition-colors disabled:opacity-40"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy All'}</span>
            </button>
            <button
              onClick={handleDownloadMarkdown}
              disabled={bookmarks.length === 0}
              className="flex items-center gap-1 px-2.5 py-1 text-indigo-300 bg-indigo-950/60 border border-indigo-900 rounded hover:bg-indigo-900/60 transition-colors disabled:opacity-40"
            >
              <Download className="w-3 h-3" />
              <span>Export .MD</span>
            </button>
          </div>
        </div>

        {/* Quick Add Note Form */}
        <form onSubmit={handleAddNote} className="space-y-2">
          <textarea
            value={newNoteText}
            onChange={(e) => setNewNoteText(e.target.value)}
            placeholder="Type a quick insight or takeaway to save..."
            rows={2}
            className="w-full p-2.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={!newNoteText.trim()}
            className="w-full py-1.5 px-3 text-xs font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 disabled:opacity-40 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add to Study Notes</span>
          </button>
        </form>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              No saved bookmarks yet.
              <p className="mt-1 text-slate-600">
                Click the bookmark icon on any Tutor response or Concept pillar to save it here.
              </p>
            </div>
          ) : (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-200 group relative"
              >
                <div className="flex items-center justify-between text-[11px] text-indigo-400 font-mono">
                  <span>{bm.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{bm.date}</span>
                    <button
                      onClick={() => onDeleteBookmark(bm.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-0.5"
                      title="Delete note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {bm.text}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
