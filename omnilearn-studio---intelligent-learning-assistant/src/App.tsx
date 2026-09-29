/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, LearningLesson, StudyBookmark } from './types/learning';
import { CURRICULUM_DATA } from './data/curriculumData';
import { Navbar } from './components/Navbar';
import { TopicSelector } from './components/TopicSelector';
import { TutorChat } from './components/TutorChat';
import { ConceptExplorer } from './components/ConceptExplorer';
import { InteractiveSimulator } from './components/InteractiveSimulator';
import { FlashcardsDeck } from './components/FlashcardsDeck';
import { QuizWorkspace } from './components/QuizWorkspace';
import { FocusTimerModal } from './components/FocusTimerModal';
import { StudyNotesDrawer } from './components/StudyNotesDrawer';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('tutor');
  const [lessons, setLessons] = useState<LearningLesson[]>(CURRICULUM_DATA);
  const [activeLessonId, setActiveLessonId] = useState<string>(CURRICULUM_DATA[0].id);
  const [isGeneratingLesson, setIsGeneratingLesson] = useState<boolean>(false);

  // Modals & Drawers
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState<boolean>(false);
  const [isNotesOpen, setIsNotesOpen] = useState<boolean>(false);

  // Bookmarks & Notes state
  const [bookmarks, setBookmarks] = useState<StudyBookmark[]>(() => {
    try {
      const saved = localStorage.getItem('omni_learn_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('omni_learn_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Failed to save bookmarks', e);
    }
  }, [bookmarks]);

  const currentLesson = lessons.find((l) => l.id === activeLessonId) || lessons[0];

  const handleSaveBookmark = (text: string, category: string) => {
    const newBm: StudyBookmark = {
      id: `bm-${Date.now()}`,
      topicTitle: currentLesson.title,
      text,
      category,
      date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setBookmarks((prev) => [newBm, ...prev]);
  };

  const handleDeleteBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleAddCustomNote = (text: string) => {
    handleSaveBookmark(text, `${currentLesson.title} - User Note`);
  };

  // Cross-component tutor navigation
  const handleAskTutor = (prompt: string) => {
    setActiveTab('tutor');
  };

  // Generate dynamic lesson module via server Gemini endpoint
  const handleGenerateCustomLesson = async (topic: string) => {
    setIsGeneratingLesson(true);
    try {
      const res = await fetch('/api/generate-lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate lesson module');
      }

      const data = await res.json();
      const newLessonId = `custom-${Date.now()}`;
      const newLesson: LearningLesson = {
        id: newLessonId,
        title: data.title || topic,
        tagline: data.tagline || 'AI-synthesized custom learning track',
        category: 'Custom',
        overview: data.overview || `Exploration of ${topic}`,
        prerequisites: data.prerequisites || ['Foundational Systems Reasoning'],
        coreMetaphor: data.coreMetaphor || `Imagine ${topic} like an interconnected network of nodes.`,
        deepConcepts: data.deepConcepts || [],
        simulationModel: data.simulationModel || {
          type: 'generic',
          title: `${topic} Dynamics`,
          description: 'Parameter tuning simulation',
          variableName: 'Input Intensity',
          unit: '%',
          min: 0,
          max: 100,
          defaultVal: 50,
          lowLabel: 'Low Intensity',
          midLabel: 'Balanced',
          highLabel: 'High',
        },
        flashcards: data.flashcards || [],
        quiz: data.quiz || [],
        nextQuestions: data.nextQuestions || [],
      };

      setLessons((prev) => [newLesson, ...prev]);
      setActiveLessonId(newLessonId);
      setActiveTab('explore');
    } catch (err) {
      console.error('Error creating custom lesson:', err);
    } finally {
      setIsGeneratingLesson(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openFocusTimer={() => setIsFocusTimerOpen(true)}
        openNotes={() => setIsNotesOpen(true)}
        bookmarksCount={bookmarks.length}
        currentTopicTitle={currentLesson.title}
      />

      {/* Module Switcher & AI Generator Bar */}
      <TopicSelector
        lessons={lessons}
        activeLessonId={activeLessonId}
        onSelectLesson={(id) => setActiveLessonId(id)}
        onGenerateCustomLesson={handleGenerateCustomLesson}
        isGeneratingLesson={isGeneratingLesson}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 w-full pb-12">
        {activeTab === 'tutor' && (
          <TutorChat
            currentLesson={currentLesson}
            onSaveBookmark={handleSaveBookmark}
          />
        )}

        {activeTab === 'explore' && (
          <ConceptExplorer
            lesson={currentLesson}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onAskTutor={handleAskTutor}
            onSaveBookmark={handleSaveBookmark}
          />
        )}

        {activeTab === 'simulation' && (
          <InteractiveSimulator
            lesson={currentLesson}
            onAskTutor={handleAskTutor}
          />
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsDeck
            lesson={currentLesson}
            onAskTutor={handleAskTutor}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizWorkspace
            lesson={currentLesson}
            onAskTutor={handleAskTutor}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <FocusTimerModal
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
        topicTitle={currentLesson.title}
      />

      <StudyNotesDrawer
        isOpen={isNotesOpen}
        onClose={() => setIsNotesOpen(false)}
        bookmarks={bookmarks}
        onDeleteBookmark={handleDeleteBookmark}
        onAddCustomNote={handleAddCustomNote}
        currentTopicTitle={currentLesson.title}
      />
    </div>
  );
}
