import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Brain } from 'lucide-react';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  topicTitle,
}) => {
  const [mode, setMode] = useState<'focus' | 'short-break' | 'long-break'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isAmbientSoundOn, setIsAmbientSoundOn] = useState<boolean>(false);

  // Web Audio Context for pure client-side ambient focus sound
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      // Play completion chime
      playChime();
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const switchMode = (newMode: 'focus' | 'short-break' | 'long-break') => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'focus') setTimeLeft(25 * 60);
    if (newMode === 'short-break') setTimeLeft(5 * 60);
    if (newMode === 'long-break') setTimeLeft(15 * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (mode === 'focus') setTimeLeft(25 * 60);
    if (mode === 'short-break') setTimeLeft(5 * 60);
    if (mode === 'long-break') setTimeLeft(15 * 60);
  };

  // Ambient sound synthesizer
  const toggleAmbientSound = () => {
    if (isAmbientSoundOn) {
      stopAmbientSound();
    } else {
      startAmbientSound();
    }
  };

  const startAmbientSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Soft soothing tone generator (alpha wave ~10Hz modulated sine)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(108, ctx.currentTime); // gentle low frequency
      gain.gain.setValueAtTime(0.04, ctx.currentTime); // quiet ambient

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();

      oscillatorRef.current = osc;
      gainNodeRef.current = gain;
      setIsAmbientSoundOn(true);
    } catch (e) {
      console.warn('AudioContext not allowed or supported', e);
    }
  };

  const stopAmbientSound = () => {
    try {
      oscillatorRef.current?.stop();
      oscillatorRef.current?.disconnect();
      audioCtxRef.current?.close();
    } catch (e) {}
    setIsAmbientSoundOn(false);
  };

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3); // E5
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}
  };

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-indigo-400 font-mono">
            <Brain className="w-3.5 h-3.5" />
            <span>Deep Cognitive Focus</span>
          </div>
          <h2 className="text-xl font-bold text-white font-display">
            Pomodoro Study Session
          </h2>
          <p className="text-xs text-slate-400 truncate max-w-xs mx-auto">
            Studying: {topicTitle}
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
          <button
            onClick={() => switchMode('focus')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'focus'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => switchMode('short-break')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'short-break'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => switchMode('long-break')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'long-break'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Big Timer Display */}
        <div className="text-center py-4">
          <div className="text-6xl font-bold font-mono tracking-tight text-white tabular-nums">
            {formattedTime}
          </div>
          <p className="text-xs text-slate-500 mt-2 font-mono uppercase tracking-widest">
            {isRunning ? 'Session Active' : 'Session Paused'}
          </p>
        </div>

        {/* Primary Timer Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors shadow-md"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Pause' : 'Start Focus'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-2.5 text-slate-400 hover:text-white bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Ambient Study Tone Toggle */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Alpha Focus Frequency (108Hz)</span>
          </span>
          <button
            onClick={toggleAmbientSound}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
              isAmbientSoundOn
                ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            {isAmbientSoundOn ? <Volume2 className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span>{isAmbientSoundOn ? 'Sound On' : 'Sound Off'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
