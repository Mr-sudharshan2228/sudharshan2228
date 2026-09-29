import React, { useState, useEffect, useRef } from 'react';
import { LearningLesson } from '../types/learning';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Activity,
  Sliders,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface InteractiveSimulatorProps {
  lesson: LearningLesson;
  onAskTutor: (prompt: string) => void;
}

export const InteractiveSimulator: React.FC<InteractiveSimulatorProps> = ({
  lesson,
  onAskTutor,
}) => {
  const simType = lesson.simulationModel?.type || 'gradient_descent';

  // Gradient Descent State
  const [learningRate, setLearningRate] = useState<number>(0.18);
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [currentWeight, setCurrentWeight] = useState<number>(2.4);
  const [trajectory, setTrajectory] = useState<{ step: number; w: number; loss: number }[]>([
    { step: 0, w: 2.4, loss: calcLoss(2.4) },
  ]);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Bohr Effect State
  const [pHValue, setPHValue] = useState<number>(7.4);
  const [tempValue, setTempValue] = useState<number>(37); // Celsius

  // Retention Curve State
  const [reviewCount, setReviewCount] = useState<number>(2);

  // Helper loss function: L(w) = 0.5 * w^2 + 0.6 * sin(2.5 * w) + 1.2
  function calcLoss(w: number): number {
    return 0.5 * w * w + 0.6 * Math.sin(2.5 * w) + 1.2;
  }
  function calcGrad(w: number): number {
    return w + 0.6 * 2.5 * Math.cos(2.5 * w);
  }

  // Gradient Descent Single Step
  const stepGradientDescent = () => {
    setCurrentWeight((prevW) => {
      const grad = calcGrad(prevW);
      const nextW = prevW - learningRate * grad;
      // Clamping to avoid infinite canvas explosion
      const clampedW = Math.max(-3.5, Math.min(3.5, nextW));
      const nextLoss = calcLoss(clampedW);

      setTrajectory((prevTraj) => [
        ...prevTraj.slice(-25),
        { step: prevTraj.length, w: clampedW, loss: nextLoss },
      ]);
      setStepIndex((s) => s + 1);
      return clampedW;
    });
  };

  const resetGradientDescent = () => {
    setIsPlaying(false);
    setStepIndex(0);
    setCurrentWeight(2.4);
    setTrajectory([{ step: 0, w: 2.4, loss: calcLoss(2.4) }]);
  };

  // Auto-play timer for gradient descent
  useEffect(() => {
    let interval: any = null;
    if (isPlaying && simType === 'gradient_descent') {
      interval = setInterval(() => {
        stepGradientDescent();
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlaying, learningRate, simType]);

  // Bohr Effect calculations
  // Base P50 is 26.6 mmHg at pH 7.4. Higher pH lowers P50 (left shift), lower pH raises P50 (right shift)
  const calcP50 = (ph: number, temp: number) => {
    const phDelta = ph - 7.4;
    const tempDelta = temp - 37;
    // Right shift: lower pH (+P50), higher temp (+P50)
    return 26.6 * Math.pow(10, -0.48 * phDelta + 0.024 * tempDelta);
  };

  const currentP50 = calcP50(pHValue, tempValue);

  // Hill equation for Hb saturation
  const calcHbSat = (pO2: number, p50: number) => {
    const n = 2.7; // Hill coefficient
    const ratio = Math.pow(pO2 / p50, n);
    return (ratio / (1 + ratio)) * 100;
  };

  const lungSat = calcHbSat(100, currentP50);
  const muscleSat = calcHbSat(25, currentP50);
  const oxygenDelivered = lungSat - muscleSat;

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-6">
      {/* Simulation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-mono mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Interactive Sandbox & Simulation</span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-white font-display">
            {lesson.simulationModel?.title || 'Dynamic Concept Simulator'}
          </h1>
          <p className="text-xs text-slate-400 max-w-3xl mt-1">
            {lesson.simulationModel?.description}
          </p>
        </div>

        <button
          onClick={() =>
            onAskTutor(
              `Can you explain the mechanics behind this simulator in depth for ${lesson.title}?`
            )
          }
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/80 rounded-md hover:bg-indigo-900/60 transition-colors shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Tutor About This State</span>
        </button>
      </div>

      {/* Two-Zone Sandbox Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left / Top Zone: Interactive Visual Stage (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-slate-200">System Dynamic Visualizer</span>
            <span className="font-mono text-slate-500">Live Mathematical Renderer</span>
          </div>

          {/* SIMULATION VISUAL CANVAS */}
          {simType === 'gradient_descent' && (
            <div className="space-y-4">
              {/* SVG 2D Loss Function and Particle Position */}
              <div className="relative w-full h-[280px] bg-slate-950 border border-slate-800 rounded-lg overflow-hidden flex items-center justify-center p-2">
                <svg className="w-full h-full" viewBox="-4 -0.5 8 5">
                  {/* Grid Lines */}
                  <line x1="-4" y1="0" x2="4" y2="0" stroke="#1e293b" strokeWidth="0.05" />
                  <line x1="-4" y1="1" x2="4" y2="1" stroke="#1e293b" strokeWidth="0.05" />
                  <line x1="-4" y1="2" x2="4" y2="2" stroke="#1e293b" strokeWidth="0.05" />
                  <line x1="-4" y1="3" x2="4" y2="3" stroke="#1e293b" strokeWidth="0.05" />
                  <line x1="-4" y1="4" x2="4" y2="4" stroke="#1e293b" strokeWidth="0.05" />
                  <line x1="0" y1="-0.5" x2="0" y2="5" stroke="#334155" strokeWidth="0.06" strokeDasharray="0.1 0.1" />

                  {/* Curve L(w) */}
                  <path
                    d={(() => {
                      let d = '';
                      for (let x = -3.8; x <= 3.8; x += 0.08) {
                        const y = calcLoss(x);
                        // Invert Y for SVG coordinates: 4.5 - y
                        const svgY = 4.5 - y;
                        d += (d === '' ? 'M ' : ' L ') + `${x.toFixed(2)} ${svgY.toFixed(2)}`;
                      }
                      return d;
                    })()}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="0.12"
                  />

                  {/* Trajectory history dots */}
                  {trajectory.map((point, idx) => {
                    const svgY = 4.5 - point.loss;
                    const isLatest = idx === trajectory.length - 1;
                    return (
                      <circle
                        key={idx}
                        cx={point.w}
                        cy={svgY}
                        r={isLatest ? 0.22 : 0.09}
                        fill={isLatest ? '#38bdf8' : '#818cf8'}
                        opacity={isLatest ? 1 : 0.4 + (idx / trajectory.length) * 0.4}
                        stroke={isLatest ? '#ffffff' : 'none'}
                        strokeWidth="0.05"
                      />
                    );
                  })}

                  {/* Tangent slope vector indicator at current point */}
                  {(() => {
                    const grad = calcGrad(currentWeight);
                    const currY = 4.5 - calcLoss(currentWeight);
                    const tanLen = 0.5;
                    const dx = tanLen / Math.sqrt(1 + grad * grad);
                    const dy = -grad * dx;
                    return (
                      <line
                        x1={currentWeight - dx}
                        y1={currY - dy}
                        x2={currentWeight + dx}
                        y2={currY + dy}
                        stroke="#f43f5e"
                        strokeWidth="0.06"
                      />
                    );
                  })()}
                </svg>

                {/* Floating Metric Callout on Canvas */}
                <div className="absolute top-3 left-3 bg-slate-900/90 border border-slate-800 rounded px-2.5 py-1.5 text-xs font-mono space-y-0.5">
                  <div className="text-slate-400">
                    Step: <span className="text-white tabular-nums font-semibold">{stepIndex}</span>
                  </div>
                  <div className="text-slate-400">
                    Weight (w): <span className="text-sky-400 tabular-nums font-semibold">{currentWeight.toFixed(4)}</span>
                  </div>
                  <div className="text-slate-400">
                    Loss L(w): <span className="text-indigo-300 tabular-nums font-semibold">{calcLoss(currentWeight).toFixed(4)}</span>
                  </div>
                  <div className="text-slate-400">
                    ∇L(w): <span className="text-rose-400 tabular-nums font-semibold">{calcGrad(currentWeight).toFixed(4)}</span>
                  </div>
                </div>

                {/* Step controls inside canvas */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 rounded-lg p-1">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 text-xs text-white bg-indigo-600 rounded hover:bg-indigo-500 transition-colors"
                    title={isPlaying ? 'Pause simulation' : 'Play descent'}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={stepGradientDescent}
                    disabled={isPlaying}
                    className="p-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors disabled:opacity-40"
                    title="Take single step"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={resetGradientDescent}
                    className="p-1.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                    title="Reset to initial parameter"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Status explanation */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white mr-1">Convergence Status:</span>
                  {Math.abs(calcGrad(currentWeight)) < 0.05 ? (
                    <span className="text-emerald-400 font-semibold">
                      Converged into equilibrium basin (∇L ≈ 0).
                    </span>
                  ) : learningRate > 0.6 ? (
                    <span className="text-rose-400 font-semibold">
                      High Learning Rate warning: Stride causes overshooting across the potential well.
                    </span>
                  ) : (
                    <span>
                      Descending gradient toward minimum. Next step: Δw = -{learningRate} × ({calcGrad(currentWeight).toFixed(3)}).
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {simType === 'bohr_effect' && (
            <div className="space-y-4">
              {/* Sigmoidal Hemoglobin Dissociation Curve */}
              <div className="relative w-full h-[280px] bg-slate-950 border border-slate-800 rounded-lg overflow-hidden p-2">
                <svg className="w-full h-full" viewBox="0 0 120 110">
                  {/* Axes */}
                  <line x1="15" y1="95" x2="115" y2="95" stroke="#475569" strokeWidth="0.8" />
                  <line x1="15" y1="15" x2="15" y2="95" stroke="#475569" strokeWidth="0.8" />

                  {/* Grid ticks */}
                  <text x="15" y="105" fill="#64748b" fontSize="4" textAnchor="middle">0</text>
                  <text x="40" y="105" fill="#64748b" fontSize="4" textAnchor="middle">25 (Muscle)</text>
                  <text x="65" y="105" fill="#64748b" fontSize="4" textAnchor="middle">50</text>
                  <text x="110" y="105" fill="#64748b" fontSize="4" textAnchor="middle">100 (Lung)</text>

                  <text x="10" y="96" fill="#64748b" fontSize="4" textAnchor="end">0%</text>
                  <text x="10" y="55" fill="#64748b" fontSize="4" textAnchor="end">50%</text>
                  <text x="10" y="20" fill="#64748b" fontSize="4" textAnchor="end">100%</text>

                  {/* Reference standard curve at pH 7.4 (light dotted) */}
                  <path
                    d={(() => {
                      let d = '';
                      for (let pO2 = 0; pO2 <= 100; pO2 += 2) {
                        const sat = calcHbSat(pO2, 26.6);
                        const svgX = 15 + pO2;
                        const svgY = 95 - (sat / 100) * 80;
                        d += (d === '' ? 'M ' : ' L ') + `${svgX.toFixed(1)} ${svgY.toFixed(1)}`;
                      }
                      return d;
                    })()}
                    fill="none"
                    stroke="#475569"
                    strokeWidth="0.8"
                    strokeDasharray="1.5 1.5"
                  />

                  {/* Active shifted curve */}
                  <path
                    d={(() => {
                      let d = '';
                      for (let pO2 = 0; pO2 <= 100; pO2 += 2) {
                        const sat = calcHbSat(pO2, currentP50);
                        const svgX = 15 + pO2;
                        const svgY = 95 - (sat / 100) * 80;
                        d += (d === '' ? 'M ' : ' L ') + `${svgX.toFixed(1)} ${svgY.toFixed(1)}`;
                      }
                      return d;
                    })()}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="1.8"
                  />

                  {/* Muscle tension marker (pO2 = 25) */}
                  <circle
                    cx={15 + 25}
                    cy={95 - (muscleSat / 100) * 80}
                    r="2.2"
                    fill="#dc2626"
                  />
                  <line
                    x1={15 + 25}
                    y1="95"
                    x2={15 + 25}
                    y2={95 - (muscleSat / 100) * 80}
                    stroke="#dc2626"
                    strokeWidth="0.6"
                    strokeDasharray="1 1"
                  />

                  {/* Lung tension marker (pO2 = 100) */}
                  <circle
                    cx={15 + 100}
                    cy={95 - (lungSat / 100) * 80}
                    r="2.2"
                    fill="#059669"
                  />
                </svg>

                <div className="absolute top-3 left-16 bg-slate-900/90 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono">
                  <span className="text-slate-400">P50: </span>
                  <span className="text-sky-400 font-bold tabular-nums">{currentP50.toFixed(1)} mmHg</span>
                  <span className="text-slate-500 ml-2">
                    {currentP50 > 27 ? '(Right Shift - High Release)' : currentP50 < 26 ? '(Left Shift - High Affinity)' : '(Normal)'}
                  </span>
                </div>
              </div>

              {/* Delivery stats */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-500">Lung Saturation</div>
                  <div className="text-base font-bold font-mono text-emerald-400 tabular-nums">
                    {lungSat.toFixed(1)}%
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                  <div className="text-xs text-slate-500">Muscle Saturation</div>
                  <div className="text-base font-bold font-mono text-rose-400 tabular-nums">
                    {muscleSat.toFixed(1)}%
                  </div>
                </div>
                <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-800/80">
                  <div className="text-xs text-indigo-300 font-medium">Delivered to Tissue</div>
                  <div className="text-base font-bold font-mono text-white tabular-nums">
                    {oxygenDelivered.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          )}

          {simType === 'retention_curve' && (
            <div className="space-y-4">
              <div className="relative w-full h-[280px] bg-slate-950 border border-slate-800 rounded-lg overflow-hidden p-3">
                <svg className="w-full h-full" viewBox="0 0 120 100">
                  <line x1="15" y1="85" x2="115" y2="85" stroke="#475569" strokeWidth="0.8" />
                  <line x1="15" y1="10" x2="15" y2="85" stroke="#475569" strokeWidth="0.8" />
                  <text x="15" y="93" fill="#64748b" fontSize="4">Day 0</text>
                  <text x="65" y="93" fill="#64748b" fontSize="4">Day 15</text>
                  <text x="110" y="93" fill="#64748b" fontSize="4">Day 30</text>

                  {/* Curves with decay */}
                  {/* Single exposure without reviews */}
                  <path
                    d="M 15 15 Q 30 75 115 80"
                    fill="none"
                    stroke="#dc2626"
                    strokeWidth="1.2"
                    strokeDasharray="2 2"
                  />
                  <text x="80" y="78" fill="#dc2626" fontSize="4">No Review (18%)</text>

                  {/* Spaced repetition curve */}
                  <path
                    d={
                      reviewCount === 1
                        ? 'M 15 15 Q 25 50 35 40 Q 60 65 115 70'
                        : reviewCount === 2
                        ? 'M 15 15 Q 25 45 35 25 Q 55 45 70 30 Q 90 45 115 50'
                        : 'M 15 15 Q 25 40 35 20 Q 55 35 65 20 Q 85 30 95 22 Q 105 25 115 28'
                    }
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2"
                  />
                  <text x="75" y="24" fill="#10b981" fontSize="4">
                    {reviewCount >= 3 ? 'Permanent Consolidation (~90%)' : 'Active Recall Spacing'}
                  </text>
                </svg>
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">
                <span className="font-semibold text-emerald-400">Ebbinghaus Spaced Repetition Law:</span> Each active retrieval session resets forgetting latency and flattens the decay gradient by over 400%.
              </div>
            </div>
          )}
        </div>

        {/* Right / Bottom Zone: Control & Concept Deck (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800 rounded-xl p-5 space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <Sliders className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-semibold text-white">
              Parameter Control Deck
            </h3>
          </div>

          {/* PARAMETER SLIDERS */}
          {simType === 'gradient_descent' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-medium text-slate-200">
                    Learning Rate (η):
                  </label>
                  <span className="font-mono text-indigo-400 font-bold tabular-nums">
                    {learningRate.toFixed(2)} α
                  </span>
                </div>
                <input
                  type="range"
                  min="0.02"
                  max="1.0"
                  step="0.02"
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>0.02 (Underdamped)</span>
                  <span>0.20 (Balanced)</span>
                  <span>1.00 (Overshoot)</span>
                </div>
              </div>

              {/* Pedagogy explanation based on current slider */}
              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <span className="text-indigo-400 font-semibold font-mono">
                  PHYSIO-PHYSICAL MECHANICS:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {learningRate < 0.1
                    ? lesson.simulationModel.lowLabel
                    : learningRate <= 0.4
                    ? lesson.simulationModel.midLabel
                    : lesson.simulationModel.highLabel}
                </p>
              </div>

              {/* Initial Condition Tuner */}
              <div>
                <label className="text-xs text-slate-400 block mb-1.5">
                  Starting Coordinate (w₀):
                </label>
                <div className="flex items-center gap-2">
                  {[-3.0, -1.5, 0.5, 2.4, 3.2].map((wVal) => (
                    <button
                      key={wVal}
                      onClick={() => {
                        setIsPlaying(false);
                        setCurrentWeight(wVal);
                        setStepIndex(0);
                        setTrajectory([{ step: 0, w: wVal, loss: calcLoss(wVal) }]);
                      }}
                      className={`px-2.5 py-1 text-xs font-mono rounded border transition-colors ${
                        Math.abs(currentWeight - wVal) < 0.1
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {wVal}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {simType === 'bohr_effect' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-medium text-slate-200">
                    Blood Capillary pH Level:
                  </label>
                  <span className="font-mono text-sky-400 font-bold tabular-nums">
                    {pHValue.toFixed(2)} pH
                  </span>
                </div>
                <input
                  type="range"
                  min="7.0"
                  max="7.8"
                  step="0.05"
                  value={pHValue}
                  onChange={(e) => setPHValue(parseFloat(e.target.value))}
                  className="w-full accent-sky-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                  <span>7.0 (Acidic / Sprint)</span>
                  <span>7.4 (Baseline)</span>
                  <span>7.8 (Alkalosis)</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-medium text-slate-200">
                    Tissue Temperature:
                  </label>
                  <span className="font-mono text-amber-400 font-bold tabular-nums">
                    {tempValue}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="32"
                  max="43"
                  step="1"
                  value={tempValue}
                  onChange={(e) => setTempValue(parseInt(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <span className="text-sky-400 font-semibold font-mono">
                  BOHR EFFECT DYNAMICS:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {pHValue < 7.3
                    ? lesson.simulationModel.lowLabel
                    : pHValue <= 7.5
                    ? lesson.simulationModel.midLabel
                    : lesson.simulationModel.highLabel}
                </p>
              </div>
            </div>
          )}

          {simType === 'retention_curve' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <label className="font-medium text-slate-200">
                    Active Recall Reviews Completed:
                  </label>
                  <span className="font-mono text-emerald-400 font-bold tabular-nums">
                    {reviewCount} Sessions
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="1"
                  value={reviewCount}
                  onChange={(e) => setReviewCount(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
                <span className="text-emerald-400 font-semibold font-mono">
                  RETENTION OUTCOME:
                </span>
                <p className="text-slate-300 leading-relaxed">
                  {reviewCount === 0 && 'Without review, human memory retention drops to ~20% within 48 hours.'}
                  {reviewCount === 1 && '1st spaced review stabilizes retention at ~55% after two weeks.'}
                  {reviewCount >= 2 && 'Multiple active recall iterations transfer working memory schemas into durable long-term storage.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
