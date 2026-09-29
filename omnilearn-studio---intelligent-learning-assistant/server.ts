import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 3000;

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', hasApiKey: !!apiKey });
  });

  // Chat endpoint with multiple pedagogical styles
  app.post('/api/chat', async (req, res) => {
    const { messages, topic, learningMode = 'feynman', studentLevel = 'undergraduate' } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const modePrompts: Record<string, string> = {
      feynman: `Adopt the Feynman Technique. Explain concepts using vivid, relatable everyday analogies, plain language without confusing academic jargon, and test for real understanding. If the user misunderstands, gently clarify with another concrete mental model.`,
      socratic: `Adopt the Socratic Method. Guide the learner by asking insightful, probing questions one step at a time. Do not dump the entire answer at once. Challenge their assumptions, stimulate critical thinking, and help them arrive at the conclusion themselves.`,
      'deep-dive': `Adopt a rigorous academic professor persona. Provide deep mechanical details, mathematical foundations or code where applicable, exact terminology, edge cases, and architectural intuition.`,
      'quiz-me': `Act as a supportive exam coach. Test the student with targeted scenario-based questions, provide instant formative feedback on their reasoning, highlight subtle misconceptions, and reinforce key concepts.`,
      analogy: `Focus heavily on visual and physical metaphors. Translate abstract formulas or definitions into tangible systems (e.g. water pipes for electricity, traffic flow for queueing theory, city logistics for operating systems).`,
    };

    const systemInstruction = `You are OmniLearn, a premier AI learning assistant and private tutor.
Topic context: "${topic || 'General Learning'}".
Learner level: "${studentLevel}".
Pedagogy mode: ${learningMode}.
${modePrompts[learningMode] || modePrompts.feynman}

Guidelines:
- Format with clean Markdown (bold key terms, use bullet points for clarity, use backticks for formulas or terms).
- Keep responses engaging, focused, and conversational (avoid overwhelming walls of text; keep to 150-350 words per turn unless a deep derivation is explicitly requested).
- End each response with an active checkpoint question or interactive prompt to keep the learner engaged.`;

    if (!ai) {
      // Fallback response when API key is not yet provided
      const lastMsg = messages[messages.length - 1]?.content || '';
      return res.json({
        reply: `**OmniLearn Tutor Note**: (Running in offline preview)\n\nRegarding *"${lastMsg}"*: In a learning context, the core principle involves breaking the concept into its fundamental axioms, observing the feedback loop, and testing edge conditions.\n\n*Interactive checkpoint*: How would you describe the difference between the input and the transformed state in your own words?`,
      });
    }

    try {
      // Convert messages to history format
      const formattedContents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const reply = response.text || 'I could not generate a response at this moment.';
      res.json({ reply });
    } catch (err: any) {
      console.error('Error calling Gemini API for chat:', err);
      res.status(500).json({
        error: 'Failed to generate tutor response',
        details: err?.message || String(err),
      });
    }
  });

  // Structured Lesson & Study Material Generator
  app.post('/api/generate-lesson', async (req, res) => {
    const { topic, depth = 'intermediate', focus = 'comprehensive' } = req.body;

    if (!topic || typeof topic !== 'string') {
      return res.status(400).json({ error: 'Topic string is required' });
    }

    if (!ai) {
      // Fallback pre-crafted curriculum
      return res.json(getFallbackLesson(topic));
    }

    try {
      const prompt = `Create a comprehensive, highly engaging learning module for the topic: "${topic}".
Target Depth: ${depth}.
Focus: ${focus}.

You must return a strictly valid JSON object matching the following structure:
{
  "title": "Clear concise title",
  "tagline": "A memorable 1-line conceptual hook",
  "overview": "2-3 paragraphs explaining what this is, why it matters, and where it is used in the modern world",
  "prerequisites": ["List of 2-3 foundational concepts to know first"],
  "coreMetaphor": "A vivid real-world analogy (e.g., comparing neural weights to volume sliders on a soundboard)",
  "deepConcepts": [
    {
      "title": "Concept 1 Name",
      "explanation": "Clear, intuitive breakdown",
      "formulaOrCode": "Short formula, mathematical notation, or code snippet if relevant, or empty string",
      "keyTakeaway": "Single sentence takeaway"
    },
    {
      "title": "Concept 2 Name",
      "explanation": "Clear, intuitive breakdown",
      "formulaOrCode": "Short formula, mathematical notation, or code snippet if relevant, or empty string",
      "keyTakeaway": "Single sentence takeaway"
    },
    {
      "title": "Concept 3 Name",
      "explanation": "Clear, intuitive breakdown",
      "formulaOrCode": "Short formula, mathematical notation, or code snippet if relevant, or empty string",
      "keyTakeaway": "Single sentence takeaway"
    }
  ],
  "simulationModel": {
    "title": "Interactive Variable Experiment",
    "description": "How changing this key variable alters the outcome of the system",
    "variableName": "Name of the tunable parameter (e.g. Learning Rate, Oxygen Partial Pressure, Temperature)",
    "unit": "Unit (e.g. alpha, mmHg, Kelvin, %)",
    "min": 0,
    "max": 100,
    "defaultVal": 50,
    "lowLabel": "Low condition behavior",
    "midLabel": "Balanced condition behavior",
    "highLabel": "Extreme/high condition behavior"
  },
  "flashcards": [
    {
      "id": "fc-1",
      "front": "Prompt or Question",
      "back": "Clear, memorable answer",
      "category": "Core Definition"
    },
    {
      "id": "fc-2",
      "front": "Prompt or Question",
      "back": "Clear, memorable answer",
      "category": "Mechanisms"
    },
    {
      "id": "fc-3",
      "front": "Prompt or Question",
      "back": "Clear, memorable answer",
      "category": "Edge Cases"
    },
    {
      "id": "fc-4",
      "front": "Prompt or Question",
      "back": "Clear, memorable answer",
      "category": "Application"
    }
  ],
  "quiz": [
    {
      "id": "q-1",
      "question": "Realistic scenario or conceptual question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "hint": "Think about the primary balancing force",
      "explanation": "Comprehensive explanation of why this answer is correct and why other distractors fail."
    },
    {
      "id": "q-2",
      "question": "Another realistic scenario or conceptual question",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 1,
      "hint": "Recall the relationship between the two variables",
      "explanation": "Detailed rationale."
    },
    {
      "id": "q-3",
      "question": "A diagnostic check for common student pitfalls",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 2,
      "hint": "Check what happens at the boundary conditions",
      "explanation": "Detailed rationale."
    }
  ],
  "nextQuestions": [
    "Thought-provoking follow-up question 1 to explore next",
    "Thought-provoking follow-up question 2 to explore next",
    "Thought-provoking follow-up question 3 to explore next"
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const text = response.text?.trim() || '{}';
      const parsed = JSON.parse(text);
      res.json(parsed);
    } catch (err: any) {
      console.error('Error generating lesson via Gemini:', err);
      // Fallback
      res.json(getFallbackLesson(topic));
    }
  });

  // Vite middleware in development or static hosting in production
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Learning Assistant server running on http://0.0.0.0:${port}`);
  });
}

function getFallbackLesson(topic: string) {
  return {
    title: topic.charAt(0).toUpperCase() + topic.slice(1),
    tagline: 'Mastering the fundamental dynamics and intuitive principles',
    overview: `${topic} is a cornerstone discipline that connects core theoretical foundations with practical problem solving. By understanding how the primary variables interact, you can develop rapid intuition rather than relying on rote memorization.`,
    prerequisites: ['Basic Systems Modeling', 'Cause & Effect Feedback Loops', 'Critical Thinking'],
    coreMetaphor: `Think of ${topic} like an orchestra where every instrument must calibrate its timing and amplitude; if one section rushes, the harmonic balance shifts entirely.`,
    deepConcepts: [
      {
        title: 'First Principles & Fundamental Equations',
        explanation: 'At its root, the phenomenon is governed by conservation of state and the balance of energy or information flux across boundaries.',
        formulaOrCode: 'Delta S >= 0  |  f(x) = sigma(W^T x + b)',
        keyTakeaway: 'Always isolate the independent variable before evaluating the dependent reaction.',
      },
      {
        title: 'Feedback Loops & Equilibrium',
        explanation: 'Perturbations in the system induce counter-balancing responses that stabilize the process within bounded thresholds.',
        formulaOrCode: 'dx/dt = -k * (x - x_target)',
        keyTakeaway: 'Damping factors prevent catastrophic runaway oscillations.',
      },
      {
        title: 'Edge Cases & Non-Linearities',
        explanation: 'Under extreme conditions or saturation limits, standard linear approximations break down, revealing higher-order behaviors.',
        formulaOrCode: 'lim_{x -> inf} f(x) = L',
        keyTakeaway: 'Always test boundary values (zero, infinity, and inflection points).',
      },
    ],
    simulationModel: {
      title: 'Dynamic Equilibrium Visualizer',
      description: 'Observe how tuning the control factor alters stability, throughput, and error rates.',
      variableName: 'System Excitation Level',
      unit: '% Intensity',
      min: 0,
      max: 100,
      defaultVal: 50,
      lowLabel: 'Sub-critical: Low throughput, sluggish reaction, high latency',
      midLabel: 'Nominal Optimal: Balanced energy efficiency, stable flow',
      highLabel: 'Super-critical: High saturation, increased noise, nonlinear strain',
    },
    flashcards: [
      {
        id: 'fc-1',
        front: `What is the primary governing principle of ${topic}?`,
        back: 'Balancing the driving force against system constraints to achieve dynamic equilibrium.',
        category: 'Core Theory',
      },
      {
        id: 'fc-2',
        front: 'How do you detect when this system enters saturation?',
        back: 'When incremental inputs no longer produce proportional changes in output signal.',
        category: 'Diagnostics',
      },
      {
        id: 'fc-3',
        front: 'Why does the Feynman Technique work so effectively here?',
        back: 'Translating jargon into plain analogies forces you to uncover hidden knowledge gaps.',
        category: 'Methodology',
      },
      {
        id: 'fc-4',
        front: 'What is the most common student misconception?',
        back: 'Confusing transient state oscillations with the final steady-state equilibrium.',
        category: 'Troubleshooting',
      },
    ],
    quiz: [
      {
        id: 'q-1',
        question: `When analyzing a problem in ${topic}, what is the recommended first step?`,
        options: [
          'Isolate the boundary conditions and identify conserved quantities',
          'Immediately apply complex numerical formulas without checking assumptions',
          'Assume the system is in infinite equilibrium without external influence',
          'Disregard feedback loops and non-linearities',
        ],
        correctIndex: 0,
        hint: 'First principles always begin with boundaries and conservation laws.',
        explanation: 'Establishing boundary conditions and identifying what is conserved eliminates invalid assumptions early.',
      },
      {
        id: 'q-2',
        question: 'What occurs when the driving parameter exceeds the stability threshold?',
        options: [
          'The system remains unchanged forever',
          'Oscillations grow in amplitude until damping or saturation occurs',
          'The system instantly drops to absolute zero',
          'All parameters invert their algebraic signs immediately',
        ],
        correctIndex: 1,
        hint: 'Think of feedback that exceeds damping capacity.',
        explanation: 'Beyond critical threshold, non-damped positive feedback creates runaway or chaotic oscillation until physical limits saturate the response.',
      },
      {
        id: 'q-3',
        question: 'Why are analogies powerful tools for learning this concept?',
        options: [
          'They completely replace the need for mathematical proofs',
          'They anchor unfamiliar abstract concepts to well-understood physical intuitions',
          'They guarantee 100% precision in all boundary conditions',
          'They make examinations redundant',
        ],
        correctIndex: 1,
        hint: 'Analogies build mental scaffolding.',
        explanation: 'Cognitive science shows mapping new schemas onto familiar physical experiences accelerates deep conceptual retention.',
      },
    ],
    nextQuestions: [
      'How does this system behave if noise is introduced into the feedback channel?',
      'Can you derive the equilibrium condition from basic energy conservation?',
      'What real-world engineering failures occurred because of ignoring this principle?',
    ],
  };
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
