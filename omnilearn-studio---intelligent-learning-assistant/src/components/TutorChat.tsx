import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PedagogyMode, StudentLevel, LearningLesson } from '../types/learning';
import {
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  BookmarkPlus,
  RefreshCw,
  Lightbulb,
  Check,
  User,
  GraduationCap,
  HelpCircle,
  BrainCircuit,
} from 'lucide-react';

interface TutorChatProps {
  currentLesson: LearningLesson;
  onSaveBookmark: (text: string, category: string) => void;
}

export const TutorChat: React.FC<TutorChatProps> = ({ currentLesson, onSaveBookmark }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Hello! I'm your **OmniLearn AI Tutor** for **${currentLesson.title}**.\n\n*Core Metaphor*: ${currentLesson.coreMetaphor}\n\nHow would you like to explore this topic today? You can choose a pedagogy mode above or click one of the guided prompts below.`,
      timestamp: Date.now(),
      mode: 'feynman',
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pedagogyMode, setPedagogyMode] = useState<PedagogyMode>('feynman');
  const [studentLevel, setStudentLevel] = useState<StudentLevel>('undergraduate');
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  const [savedMessageId, setSavedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Reset chat when topic switches
  useEffect(() => {
    setMessages([
      {
        id: `topic-${currentLesson.id}`,
        role: 'assistant',
        content: `Switched topic to **${currentLesson.title}**.\n\n*Core Metaphor*: ${currentLesson.coreMetaphor}\n\nWhat aspect should we unpack first?`,
        timestamp: Date.now(),
        mode: pedagogyMode,
      },
    ]);
  }, [currentLesson.id]);

  const pedagogyOptions: { id: PedagogyMode; label: string; desc: string }[] = [
    { id: 'feynman', label: 'Feynman Technique', desc: 'Vivid everyday analogies, plain language' },
    { id: 'socratic', label: 'Socratic Method', desc: 'Guided questions to discover answers' },
    { id: 'deep-dive', label: 'Deep Academic', desc: 'Mathematical rigor, mechanics & edge cases' },
    { id: 'quiz-me', label: 'Practice Coach', desc: 'Active test scenarios with instant feedback' },
    { id: 'analogy', label: 'Physical Metaphors', desc: 'Translating abstractions to tangible mechanics' },
  ];

  const quickPrompts = [
    'Explain the core intuition simply',
    'Walk me through the mathematical formulation',
    'What is the #1 mistake students make?',
    'Give me a real-world scenario where this applies',
    'Quiz my understanding with a challenging question',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: Date.now(),
      mode: pedagogyMode,
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          topic: currentLesson.title,
          learningMode: pedagogyMode,
          studentLevel,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'No response generated.',
        timestamp: Date.now(),
        mode: pedagogyMode,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an issue connecting to the tutoring engine. Here is a key insight on **${currentLesson.title}**: Remember that ${currentLesson.coreMetaphor}`,
        timestamp: Date.now(),
        mode: pedagogyMode,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking === msgId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    // Clean markdown asterisks and backticks for smoother speech
    const cleanText = text.replace(/[*_#`]/g, '').slice(0, 500);
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(msgId);
    window.speechSynthesis.speak(utterance);
  };

  const handleBookmark = (msg: ChatMessage) => {
    onSaveBookmark(msg.content, `${currentLesson.title} (${msg.mode || 'Tutor'})`);
    setSavedMessageId(msg.id);
    setTimeout(() => setSavedMessageId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[580px] max-w-5xl mx-auto w-full px-4 py-4">
      {/* Top Pedagogical Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/70 border border-slate-800 rounded-lg mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
            Method:
          </span>
          {pedagogyOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setPedagogyMode(opt.id)}
              title={opt.desc}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                pedagogyMode === opt.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700/60'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Level:</span>
          <select
            value={studentLevel}
            onChange={(e) => setStudentLevel(e.target.value as StudentLevel)}
            className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="high-school">High School</option>
            <option value="undergraduate">Undergraduate</option>
            <option value="graduate">Graduate / Advanced</option>
            <option value="self-taught">Self-Learner</option>
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar Icon */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-semibold ${
                  isUser
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 border border-indigo-500/40 text-indigo-300'
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-lg p-3.5 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600/90 text-white shadow-sm'
                    : 'bg-slate-900 border border-slate-800 text-slate-200'
                }`}
              >
                {!isUser && msg.mode && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800/80 text-xs text-indigo-400 font-mono">
                    <span className="capitalize">{msg.mode} Guidance</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.content)}
                        className="hover:text-indigo-300 transition-colors p-1"
                        title={isSpeaking === msg.id ? 'Stop audio' : 'Listen with voice'}
                      >
                        {isSpeaking === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleBookmark(msg)}
                        className="hover:text-indigo-300 transition-colors p-1"
                        title="Save to study notes"
                      >
                        {savedMessageId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <BookmarkPlus className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Content Rendered with Paragraphs & Backticks */}
                <div className="space-y-2 prose prose-invert prose-sm max-w-none">
                  {msg.content.split('\n\n').map((paragraph, idx) => {
                    // Check for bullet lists
                    if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                      const items = paragraph.split('\n');
                      return (
                        <ul key={idx} className="list-disc pl-5 space-y-1">
                          {items.map((it, iIdx) => (
                            <li key={iIdx}>{it.replace(/^[-*]\s+/, '')}</li>
                          ))}
                        </ul>
                      );
                    }

                    // Check for code/formula blocks
                    if (paragraph.startsWith('```') || paragraph.includes('\\(')) {
                      return (
                        <div
                          key={idx}
                          className="bg-slate-950 p-2.5 rounded font-mono text-xs text-indigo-300 border border-slate-800 overflow-x-auto"
                        >
                          {paragraph.replace(/```/g, '')}
                        </div>
                      );
                    }

                    return <p key={idx}>{paragraph}</p>;
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-indigo-500/40 text-indigo-300 flex items-center justify-center shrink-0">
              <GraduationCap className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3.5 text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
              <span>OmniLearn is formulating an intuitive response...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Guided Quick Inquiry Prompts */}
      <div className="pt-2 pb-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-xs text-slate-500 shrink-0 flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-amber-400" />
          Ask:
        </span>
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            disabled={isLoading}
            className="px-2.5 py-1 text-xs bg-slate-900/90 border border-slate-800 text-slate-400 rounded-md hover:text-slate-200 hover:border-slate-700 whitespace-nowrap transition-colors"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-2 flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1.5 focus-within:border-indigo-500 transition-colors"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask a question or test your knowledge on ${currentLesson.title}...`}
          disabled={isLoading}
          className="flex-1 bg-transparent px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md text-xs font-semibold hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center gap-1.5 shrink-0"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
