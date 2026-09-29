import { LearningLesson } from '../types/learning';

export const CURRICULUM_DATA: LearningLesson[] = [
  {
    id: 'neural-networks-gradient-descent',
    title: 'Neural Networks & Gradient Descent',
    tagline: 'Navigating high-dimensional loss landscapes to minimize prediction error',
    category: 'AI & CS',
    imageSrc: '/src/assets/images/edu_neural_network_1790674074843.jpg',
    overview:
      'Artificial neural networks are function approximators parameterized by millions or billions of weights. The fundamental learning mechanism is Gradient Descent combined with Backpropagation: evaluating the loss function with respect to every weight parameter, computing the partial derivatives (gradients), and iteratively taking steps downhill against the slope until reaching an optimum.',
    prerequisites: ['Multivariate Calculus (Partial Derivatives)', 'Matrix Multiplication', 'Vector Dot Products'],
    coreMetaphor:
      'Imagine being blindfolded on a foggy, mountainous terrain in the middle of a thunderstorm. Your goal is to reach the lowest valley basin. You use your feet to feel the steepest downward slope under your boots, and take a calculated step in that direction. The size of your stride is the Learning Rate.',
    deepConcepts: [
      {
        title: 'The Weight Update Rule & Learning Rate',
        explanation:
          'Weights are updated iteratively by subtracting the product of the learning rate and the gradient vector from the current weight vector. If the learning rate is too large, you overshoot the valley and diverge. If too small, training crawls and gets stuck.',
        formulaOrCode: 'W_{t+1} = W_t - \\eta \\cdot \\nabla L(W_t)',
        keyTakeaway: 'Learning rate schedules or adaptive optimizers (e.g. Adam) dynamically calibrate stride size per parameter.',
      },
      {
        title: 'Backpropagation & The Chain Rule',
        explanation:
          'Backpropagation propagates the error gradient from the final prediction backward through each layer using the multivariate chain rule. Each layer calculates how much its weights contributed to the upstream error.',
        formulaOrCode: '\\frac{\\partial L}{\\partial W^{(l)}} = \\delta^{(l)} \\cdot (a^{(l-1)})^T',
        keyTakeaway: 'Reverse-mode automatic differentiation computes gradients for all parameters in a single backward pass.',
      },
      {
        title: 'Loss Landscapes, Saddles & Stochasticity',
        explanation:
          'Real deep learning loss surfaces have trillions of dimensions with local minima, saddle points, and narrow ravines. Mini-batch stochastic sampling injects noise that helps the optimizer escape shallow traps.',
        formulaOrCode: 'g_t = \\frac{1}{|B|} \\sum_{i \\in B} \\nabla L_i(W)',
        keyTakeaway: 'Mini-batch noise acts as implicit regularization, promoting generalization over memorization.',
      },
    ],
    simulationModel: {
      type: 'gradient_descent',
      title: 'Gradient Descent Convergence Simulator',
      description: 'Adjust the learning rate (stride size) to observe how a parameter travels across a non-convex loss function with local wells.',
      variableName: 'Learning Rate (η)',
      unit: 'α',
      min: 0.02,
      max: 1.1,
      defaultVal: 0.18,
      lowLabel: 'Underdamped / Sluggish: High stability but takes thousands of steps to escape shallow basins.',
      midLabel: 'Nominal Optimal: Rapid monotonic convergence into the global minimum basin.',
      highLabel: 'Overshooting / Divergence: Violent oscillations across valley walls, risk of infinite loss NaN.',
    },
    flashcards: [
      {
        id: 'nn-1',
        front: 'What does the gradient vector \\(\\nabla L(W)\\) mathematically represent?',
        back: 'The vector of partial derivatives pointing in the direction of steepest *increase* of the loss function.',
        category: 'Foundations',
      },
      {
        id: 'nn-2',
        front: 'Why do we subtract the gradient instead of adding it in parameter updates?',
        back: 'Because we want to minimize the loss (move downhill toward minimum error), not maximize it.',
        category: 'Mechanisms',
      },
      {
        id: 'nn-3',
        front: 'What is the vanishing gradient problem in deep networks?',
        back: 'Repeated multiplication of small derivatives (e.g., in Sigmoid) shrinks gradients to near-zero in early layers, halting weight updates.',
        category: 'Diagnostics',
      },
      {
        id: 'nn-4',
        front: 'How does Momentum accelerate gradient descent?',
        back: 'It accumulates an exponentially decaying moving average of past gradients, dampening oscillations in high-curvature dimensions.',
        category: 'Optimization',
      },
    ],
    quiz: [
      {
        id: 'nn-q1',
        question: 'If your training loss abruptly explodes toward Infinity (NaN) after a few iterations, what is the most probable diagnosis?',
        options: [
          'The learning rate is too high, causing gradient updates to violently overshoot and oscillate away from equilibrium',
          'The dataset is too large for the network capacity',
          'The activation functions have completely saturated at zero',
          'The batch size was reduced below 1',
        ],
        correctIndex: 0,
        hint: 'Consider what happens geometrically when step size exceeds the curvature radius of the loss bowl.',
        explanation:
          'An excessively high learning rate produces unbounded step expansions on steep canyon walls, sending weights into numerical overflow.',
      },
      {
        id: 'nn-q2',
        question: 'Why is mini-batch SGD preferred over full-dataset batch gradient descent in modern deep learning?',
        options: [
          'Mini-batch gradient descent is mathematically guaranteed to find the absolute global minimum in all polynomial problems',
          'Mini-batching fits in GPU memory and stochastic noise helps escape saddle points and shallow local minima',
          'Full-batch gradient descent cannot compute partial derivatives',
          'Mini-batching eliminates the need for backpropagation',
        ],
        correctIndex: 1,
        hint: 'Think about both hardware memory bounds and the benefits of slight variance in direction.',
        explanation:
          'Mini-batching balances computational parallelization on tensor cores with stochastic gradient variance that prevents settling into sharp, poor-generalizing minima.',
      },
      {
        id: 'nn-q3',
        question: 'Which component of the chain rule directly connects the loss gradient to the pre-activation outputs of a hidden layer?',
        options: [
          'The activation derivative multiplied by the backpropagated error signal from subsequent layers',
          'The sum of all input dataset labels',
          'The inverse determinant of the weight matrix',
          'The global learning rate parameter',
        ],
        correctIndex: 0,
        hint: 'Look at standard backprop formulation \\(\\delta^{(l)} = (W^{(l+1)})^T \\delta^{(l+1)} \\odot \\sigma\'(z^{(l)})\\).',
        explanation:
          'Error signal \\(\\delta^{(l)}\\) is obtained by multiplying the incoming backpropagated gradient with the element-wise derivative of the layer activation function evaluated at pre-activation \\(z^{(l)}\\).',
      },
    ],
    nextQuestions: [
      'How does Adam optimizer combine AdaGrad and RMSprop mathematical mechanics?',
      'Why do residual skip connections (ResNets) mitigate gradient vanishing in 100+ layer architectures?',
      'What is the difference between Batch Normalization and Layer Normalization?',
    ],
  },
  {
    id: 'cellular-respiration-bohr-effect',
    title: 'Cellular Respiration & The Bohr Effect',
    tagline: 'Physiological allosteric oxygen binding and tissue-level gas exchange',
    category: 'Biological Sciences',
    imageSrc: '/src/assets/images/edu_biology_cellular_1790674092431.jpg',
    overview:
      'The Bohr Effect describes a fundamental physiological feedback mechanism: hemoglobin oxygen binding affinity is inversely related to acidity and carbon dioxide concentration. In actively metabolizing muscle tissues, high CO2 and lactic acid decrease local pH, inducing a conformational shift in hemoglobin that unloads oxygen right where it is needed most.',
    prerequisites: ['Basic Acid-Base Equilibrium (pH)', 'Protein Quaternary Structure', 'Diffusion Gradients'],
    coreMetaphor:
      'Think of hemoglobin as a cargo delivery truck with magnetic latches holding oxygen canisters. In clean mountain air (lungs, high pH), the magnets lock tight. When the truck enters an industrial smoke zone filled with exhaust (acidic muscle tissue, high CO2), the chemical fumes loosen the latches, dumping oxygen immediately.',
    deepConcepts: [
      {
        title: 'Allosteric Cooperativity (T vs R States)',
        explanation:
          'Hemoglobin alternates between the T (tense, low affinity) and R (relaxed, high affinity) states. The binding of the first oxygen molecule alters the quaternary subunit contacts, making subsequent oxygen binding 300x easier—producing the signature sigmoidal binding curve.',
        formulaOrCode: 'Hb(O_2)_4 + H^+ \\rightleftharpoons HbH^+ + 4O_2',
        keyTakeaway: 'Cooperativity ensures sensitive switching between loading in lungs and releasing in periphery.',
      },
      {
        title: 'Proton and CO2 Binding Mechanism',
        explanation:
          'CO2 is converted by carbonic anhydrase into carbonic acid, which dissociates into bicarbonate and protons. Protons protonate histidine residues (His146), forming salt bridges that lock hemoglobin into the deoxygenated T-state.',
        formulaOrCode: 'CO_2 + H_2O \\xrightleftharpoons{\\text{CA}} H_2CO_3 \\rightleftharpoons H^+ + HCO_3^-',
        keyTakeaway: 'Actively working cells generate the exact chemical signal that forces oxygen release.',
      },
      {
        title: 'The Sigmoidal Shift (Right Shift vs Left Shift)',
        explanation:
          'Factors causing a RIGHT shift (easier oxygen unloading): High Temperature, High 2,3-BPG, High H+ (low pH), and High pCO2 (mnemonic: CADET face right: CO2, Acidity, 2,3-DPG, Exercise, Temperature).',
        formulaOrCode: 'P_{50} \\text{ shifts from } 26.6\\text{ mmHg to } >34\\text{ mmHg}',
        keyTakeaway: 'A rightward shift raises P50, meaning a higher partial pressure of O2 is required for 50% saturation.',
      },
    ],
    simulationModel: {
      type: 'bohr_effect',
      title: 'Bohr Oxygen Dissociation Curve Visualizer',
      description: 'Shift blood pH and CO2 concentration to observe how the hemoglobin saturation curve moves in real-time between lungs and working muscle.',
      variableName: 'Blood Acidity / pH Level',
      unit: 'pH',
      min: 7.0,
      max: 7.7,
      defaultVal: 7.4,
      lowLabel: 'Acidosis / Working Muscle (pH 7.1): Curve shifts RIGHT. High oxygen release into hypoxic tissue.',
      midLabel: 'Physiological Baseline (pH 7.4): Standard sigmoidal saturation curve at 37°C.',
      highLabel: 'Alkalosis / Hyperventilation (pH 7.65): Curve shifts LEFT. Oxygen clings tightly to hemoglobin.',
    },
    flashcards: [
      {
        id: 'bohr-1',
        front: 'What does a RIGHT shift in the oxygen-hemoglobin dissociation curve mean?',
        back: 'Decreased oxygen affinity: hemoglobin releases O2 more readily to tissues at any given pO2.',
        category: 'Physiology',
      },
      {
        id: 'bohr-2',
        front: 'What enzyme catalyzes the hydration of CO2 in red blood cells?',
        back: 'Carbonic anhydrase (CA), forming carbonic acid (H2CO3) which dissociates into H+ and HCO3-.',
        category: 'Biochemistry',
      },
      {
        id: 'bohr-3',
        front: 'What is P50 and what is its normal value in human arterial blood?',
        back: 'The partial pressure of oxygen at which hemoglobin is 50% saturated, normally ~26.6 mmHg.',
        category: 'Metrics',
      },
      {
        id: 'bohr-4',
        front: 'Why is fetal hemoglobin (HbF) left-shifted compared to maternal hemoglobin (HbA)?',
        back: 'HbF has lower affinity for 2,3-BPG, giving it higher O2 affinity to draw oxygen across the placental barrier.',
        category: 'Evolutionary Biology',
      },
    ],
    quiz: [
      {
        id: 'bohr-q1',
        question: 'During intense sprint exercise, what combination of physiological parameters induces optimal oxygen delivery to leg quadriceps?',
        options: [
          'Decreased pH (acidosis), elevated temperature, and increased local pCO2',
          'Increased pH (alkalosis), decreased temperature, and reduced 2,3-BPG',
          'Complete inhibition of carbonic anhydrase and elevated arterial pO2',
          'Conversion of hemoglobin from R-state to fetal hemoglobin',
        ],
        correctIndex: 0,
        hint: 'Remember the CADET mnemonic (CO2, Acidity, 2,3-DPG, Exercise, Temperature all cause right shifts).',
        explanation:
          'Lactic acid and CO2 lower local pH while muscle friction elevates temperature. Both factors destabilize oxygen binding and cause robust rightward shifting for maximum tissue unloading.',
      },
      {
        id: 'bohr-q2',
        question: 'If a patient hyperventilates in panic, blowing off excessive carbon dioxide (hypocapnia), what is the impact on tissue oxygen delivery?',
        options: [
          'A leftward shift in the dissociation curve causes hemoglobin to hold oxygen more tightly, paradoxically starving brain tissue of oxygen',
          'Oxygen is released instantly in toxic quantities',
          'The dissociation curve remains identical because CO2 has zero effect on hemoglobin',
          'Red blood cells immediately undergo hemolysis',
        ],
        correctIndex: 0,
        hint: 'Blowing off CO2 raises blood pH (respiratory alkalosis). What does high pH do to affinity?',
        explanation:
          'Respiratory alkalosis shifts the curve left (Bohr effect in reverse). Hemoglobin binds oxygen stubbornly and refuses to unload it at normal tissue capillary tensions, causing lightheadedness and cerebral hypoxia.',
      },
      {
        id: 'bohr-q3',
        question: 'What is the molecular basis of allosteric cooperativity in hemoglobin?',
        options: [
          'Binding of O2 to iron pulls the heme into the porphyrin ring plane, moving the proximal histidine and shifting quaternary subunit contacts',
          'Each hemoglobin molecule binds all four O2 molecules simultaneously in a single millisecond step',
          'Disulfide bonds permanently lock the four globins together without motion',
          'Heme rings are degraded and resynthesized between lung and tissue',
        ],
        correctIndex: 0,
        hint: 'Perutz mechanism: the iron atom moves 0.4 Angstroms upon oxygen coordination.',
        explanation:
          'Max Perutz demonstrated that upon oxygenation, the Fe2+ ion contracts and enters the plane of the protoporphyrin IX ring, pulling His F8 and triggering the T-to-R transition across αβ dimers.',
      },
    ],
    nextQuestions: [
      'How does the Haldane Effect complement the Bohr Effect in venous blood return?',
      'Why does carbon monoxide (CO) cause a devastating left-shift while simultaneously blocking binding sites?',
      'What physiological adaptations occur in high-altitude sherpas regarding 2,3-BPG concentration?',
    ],
  },
  {
    id: 'quantum-superposition-wave-mechanics',
    title: 'Quantum Superposition & Wave Mechanics',
    tagline: 'Linear combinations of state vectors, the Schrödinger equation, and measurement collapse',
    category: 'Physics & Quantum',
    imageSrc: '/src/assets/images/edu_quantum_physics_1790674103944.jpg',
    overview:
      'In quantum mechanics, physical systems do not possess definite values for observable properties prior to measurement. Instead, a system is described by a state vector |ψ⟩ in complex Hilbert space, existing as a linear superposition of all possible eigenstates. The time evolution follows the deterministic Schrödinger wave equation, while measurement induces probabilistic collapse governed by the Born Rule.',
    prerequisites: ['Complex Numbers (Euler Formula)', 'Linear Algebra (Eigenvalues & Eigenvectors)', 'Wave Mechanics'],
    coreMetaphor:
      'Think of a coin spinning on a tabletop at high speed. While spinning, it is not simply "heads" or "tails"; it exists in a blur combining both possibilities at once with specific angular momentum. Only when you slam your hand down to stop it (a measurement) does it snap into a definite single state.',
    deepConcepts: [
      {
        title: 'State Vectors & The Born Rule',
        explanation:
          'A quantum state |ψ⟩ is expressed as a normalized linear combination of basis vectors. The probability of measuring eigenvalue a_i is the square magnitude of its probability amplitude |c_i|^2.',
        formulaOrCode: '|\\psi\\rangle = \\alpha |0\\rangle + \\beta |1\\rangle, \\quad |\\alpha|^2 + |\\beta|^2 = 1',
        keyTakeaway: 'Probability amplitudes are complex numbers; interference occurs when amplitudes cancel out before squaring.',
      },
      {
        title: 'The Time-Dependent Schrödinger Equation',
        explanation:
          'The Schrödinger equation describes the continuous, reversible, deterministic unitary evolution of the wave function through time under the Hamiltonian operator.',
        formulaOrCode: 'i\\hbar \\frac{\\partial}{\\partial t} |\\psi(t)\\rangle = \\hat{H} |\\psi(t)\\rangle',
        keyTakeaway: 'Quantum indeterminacy only enters during measurement interaction, not during uninterrupted spatial propagation.',
      },
      {
        title: 'Heisenberg Uncertainty & Non-Commuting Observables',
        explanation:
          'If two physical observable operators do not commute ([A, B] ≠ 0), they do not share a common eigenbasis, meaning both cannot simultaneously have sharp, definite values.',
        formulaOrCode: '\\sigma_x \\sigma_p \\ge \\frac{\\hbar}{2}',
        keyTakeaway: 'Uncertainty is not an instrument flaw; it is an intrinsic geometric feature of wave packet Fourier transforms.',
      },
    ],
    simulationModel: {
      type: 'retention_curve',
      title: 'Quantum Wave Packet Dispersion & Measurement Simulator',
      description: 'Adjust the spatial confinement (barrier width) to observe how position localization causes momentum uncertainty and rapid wave packet spreading.',
      variableName: 'Spatial Confinement (Δx)',
      unit: 'nm',
      min: 0.1,
      max: 5.0,
      defaultVal: 1.2,
      lowLabel: 'Extreme Confinement (0.2 nm): Sharp position pinpointing induces violent momentum dispersion.',
      midLabel: 'Balanced Wave Packet (1.2 nm): Coherent Gaussian wave packet propagating smoothly.',
      highLabel: 'Delocalized Plane Wave (4.5 nm): Broad spatial spread, near-zero momentum uncertainty.',
    },
    flashcards: [
      {
        id: 'qm-1',
        front: 'What does the Born Rule state regarding quantum measurement?',
        back: 'The probability of obtaining a specific outcome is equal to the squared modulus of the inner product |⟨a|ψ⟩|².',
        category: 'Foundations',
      },
      {
        id: 'qm-2',
        front: 'Why can two wave functions interfere destructively in quantum mechanics?',
        back: 'Because probability amplitudes are complex numbers with phases; amplitudes add together algebraically before squaring.',
        category: 'Wave Dynamics',
      },
      {
        id: 'qm-3',
        front: 'What is a quantum qubit in comparison to a classical bit?',
        back: 'A classical bit is strictly 0 or 1; a qubit is a 2-level quantum system existing in any coherent superposition α|0⟩ + β|1⟩ on the Bloch sphere.',
        category: 'Quantum Computing',
      },
      {
        id: 'qm-4',
        front: 'What mathematical property ensures that quantum observables have real eigenvalues?',
        back: 'The operator representing the observable must be Hermitian (self-adjoint: Â† = Â).',
        category: 'Mathematical Rigor',
      },
    ],
    quiz: [
      {
        id: 'qm-q1',
        question: 'In the classic double-slit experiment with single electrons fired one at a time, what builds up on the detector screen over time?',
        options: [
          'An interference pattern with alternating high and zero probability bands, demonstrating self-interference',
          'Two sharp vertical lines directly behind the two open slits',
          'A uniform grey smear with no structure',
          'Electrons ricocheting backward into the emitter',
        ],
        correctIndex: 0,
        hint: 'Even single particles interfere with their own wave function pathways unless which-way information is gathered.',
        explanation:
          'Each electron wave packet passes through both slits simultaneously as a superposition of trajectories; amplitudes interfere constructively and destructively, accumulating the interference fringe pattern strike-by-strike.',
      },
      {
        id: 'qm-q2',
        question: 'If state |ψ⟩ = (1/√2)|0⟩ + (i/√2)|1⟩, what is the probability of measuring the system in state |1⟩?',
        options: [
          '50% (0.50)',
          '100% (1.0)',
          '25% (0.25)',
          'Imaginary number i',
        ],
        correctIndex: 0,
        hint: 'Calculate |β|² = |i/√2|² = (i/√2) * (-i/√2).',
        explanation:
          'The amplitude is i/√2. Its modulus squared is (1/√2)² = 1/2 = 50%. The phase factor i contributes to relative phase without altering measurement probability on the computational basis.',
      },
      {
        id: 'qm-q3',
        question: 'What happens immediately following a projective von Neumann measurement of a quantum system?',
        options: [
          'The wave function collapses into the eigenstate corresponding to the observed eigenvalue',
          'The wave function completely disappears from existence permanently',
          'The particle speeds up to the speed of light',
          'All other quantum systems in the universe instantaneously duplicate',
        ],
        correctIndex: 0,
        hint: 'Postulate of measurement: repeated measurements immediately afterward yield the identical eigenvalue.',
        explanation:
          'Under the Copenhagen interpretation, the state vector is projected onto the subspace spanned by the detected eigenstate, resetting its subsequent evolution from that boundary state.',
      },
    ],
    nextQuestions: [
      'What is quantum entanglement and how does it violate Bell inequalities?',
      'How does quantum decoherence explain the transition from quantum probabilities to classical reality?',
      'What is the difference between pure quantum states and mixed statistical ensembles represented by density matrices?',
    ],
  },
];
