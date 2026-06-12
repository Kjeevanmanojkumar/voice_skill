import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import {
  getMission,
  getSkill,
  createMissionAttempt,
  completeMissionAttempt,
  getUserProgress,
  updateUserProgress,
  createVoiceSession,
  updateVoiceSession,
} from '../services/api';
import type { Mission, Skill, UserProgress } from '../lib/supabase';
import {
  Mic,
  MicOff,
  ArrowLeft,
  Clock,
  Target,
  AlertCircle,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Volume2,
  VolumeX,
  ChevronRight,
  Zap,
  Heart,
  Hammer,
  Cpu,
} from 'lucide-react';

type MissionPhase = 'intro' | 'active' | 'complete';

const skillIcons: Record<string, React.ElementType> = {
  electrical: Zap,
  healthcare: Heart,
  carpentry: Hammer,
  computer_hardware: Cpu,
};

const skillGradients: Record<string, { bg: string; border: string; icon: string }> = {
  electrical: {
    bg: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
  },
  healthcare: {
    bg: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-500/30',
    icon: 'text-rose-400',
  },
  carpentry: {
    bg: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
  },
  computer_hardware: {
    bg: 'from-sky-500/20 to-blue-500/20',
    border: 'border-sky-500/30',
    icon: 'text-sky-400',
  },
};

export function MissionPage() {
  const { missionId } = useParams<{ missionId: string }>();
  const navigate = useNavigate();

  const [mission, setMission] = useState<Mission | null>(null);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<MissionPhase>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [voiceCommandsUsed, setVoiceCommandsUsed] = useState(0);
  const [correctCommands, setCorrectCommands] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [showSafety, setShowSafety] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [feedback, setFeedback] = useState<string>('');

  const handleVoiceResult = useCallback((transcript: string, confidence: number) => {
    if (phase !== 'active' || !mission) return;

    setVoiceCommandsUsed((prev) => prev + 1);

    const recognized = confidence > 0.6;

    if (recognized) {
      setCorrectCommands((prev) => prev + 1);

      const lowerTranscript = transcript.toLowerCase();

      if (
        lowerTranscript.includes('done') ||
        lowerTranscript.includes('complete') ||
        lowerTranscript.includes('next') ||
        lowerTranscript.includes('finished')
      ) {
        handleStepComplete();
      } else if (
        lowerTranscript.includes('repeat') ||
        lowerTranscript.includes('again')
      ) {
        speakCurrentStep();
      } else if (lowerTranscript.includes('back') || lowerTranscript.includes('previous')) {
        if (currentStep > 0) {
          setCurrentStep((prev) => prev - 1);
          setFeedback('Going back to previous step');
        }
      } else {
        setFeedback(`Heard: "${transcript}"`);
      }
    }
  }, [phase, mission, currentStep]);

  const {
    isListening,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  } = useVoiceRecognition({
    onResult: handleVoiceResult,
    continuous: true,
  });

  const { speak, isSpeaking, cancel, isSupported: speechSupported } = useSpeechSynthesis();

  function speakText(text: string) {
    if (voiceEnabled && speechSupported) {
      speak(text);
    }
    setFeedback(text);
  }

  function speakCurrentStep() {
    if (!mission) return;
    const step = mission.steps[currentStep];
    speakText(`Step ${currentStep + 1}: ${step}`);
  }

  useEffect(() => {
    if (phase === 'active' && mission && mission.steps.length > 0) {
      speakCurrentStep();
    }
  }, [phase, currentStep]);

  const handleStartMission = async () => {
    if (!mission) return;

    try {
      const attempt = await createMissionAttempt(mission.id);
      setAttemptId(attempt.id);

      const session = await createVoiceSession(mission.id, 'mission');
      setSessionId(session.id);

      setPhase('active');
      setStartTime(Date.now());
      setCurrentStep(0);
      setCompletedSteps(new Set());
      setVoiceCommandsUsed(0);
      setCorrectCommands(0);
      resetTranscript();

      startListening();

      if (mission.scenario) {
        speakText(`Scenario: ${mission.scenario}. Let's begin. ${mission.steps[0]}`);
      }
    } catch (error) {
      console.error('Failed to start mission:', error);
    }
  };

  const handleStepComplete = async () => {
    if (!mission) return;

    setCompletedSteps((prev) => new Set(prev).add(currentStep));

    if (currentStep < mission.steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      speakText(`Step complete. ${mission.steps[nextStep]}`);
    } else {
      await handleMissionComplete();
    }
  };

  const handleMissionComplete = async () => {
    if (!attemptId || !sessionId || !mission || !skill) return;

    stopListening();
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    const score = Math.round(
      ((correctCommands / Math.max(voiceCommandsUsed, 1)) * 50 +
        (completedSteps.size / mission.steps.length) * 50) *
        mission.points
    );

    try {
      await completeMissionAttempt(attemptId, {
        status: 'completed',
        score,
        voice_commands_used: voiceCommandsUsed,
        correct_commands: correctCommands,
        time_taken_seconds: timeTaken,
        feedback: `Completed ${completedSteps.size} of ${mission.steps.length} steps`,
      });

      if (sessionId) {
        await updateVoiceSession(sessionId, {
          total_commands: voiceCommandsUsed,
          successful_commands: correctCommands,
          duration_seconds: timeTaken,
          commands: [],
          ended_at: new Date().toISOString(),
        });
      }

      const progressData = await getUserProgress(skill.id);
      if (progressData || missionId) {
        await updateUserProgress(skill.id, {
          total_points: (progressData?.total_points || 0) + score,
          missions_completed: (progressData?.missions_completed || 0) + 1,
          time_spent_minutes: (progressData?.time_spent_minutes || 0) + Math.ceil(timeTaken / 60),
          mastery_percentage: Math.min(
            100,
            ((progressData?.missions_completed || 0) + 1) / skill.total_missions * 100
          ),
          last_accessed: new Date().toISOString(),
        });
      }

      setPhase('complete');
      speakText(`Mission complete! You earned ${score} points.`);
    } catch (error) {
      console.error('Failed to complete mission:', error);
    }
  };

  const handleAbort = async () => {
    stopListening();

    if (attemptId) {
      try {
        await completeMissionAttempt(attemptId, {
          status: 'abandoned',
          score: 0,
          voice_commands_used: voiceCommandsUsed,
          correct_commands: 0,
          time_taken_seconds: Math.floor((Date.now() - startTime) / 1000),
        });
      } catch (error) {
        console.error('Failed to abort mission:', error);
      }
    }

    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="relative">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse" />
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 blur-xl opacity-50 animate-pulse" />
        </div>
      </div>
    );
  }

  if (!mission || !skill) {
    return (
      <div className="text-center py-20">
        <div className="glass-card inline-block p-8">
          <h2 className="text-xl font-semibold text-white mb-2">Mission not found</h2>
          <Link to="/skills" className="text-primary-400 hover:text-primary-300">
            Back to Skills
          </Link>
        </div>
      </div>
    );
  }

  const gradient = skillGradients[skill.category] || skillGradients.electrical;

  if (phase === 'complete') {
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const score = Math.round(
      ((correctCommands / Math.max(voiceCommandsUsed, 1)) * 50 +
        (completedSteps.size / mission.steps.length) * 50) *
        mission.points
    );

    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${gradient.bg}`} />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-success-400/30 to-success-600/30 animate-ping" />
          <div className="relative w-24 h-24 rounded-full bg-success-500/20 border border-success-500/30 flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-success-400" />
          </div>
        </div>
        <h1 className="text-2xl font-display font-bold text-white mb-2">Mission Complete!</h1>
        <p className="text-slate-400 mb-8">{mission.title}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="stat-card">
            <p className="stat-value text-success-400">{score}</p>
            <p className="stat-label">Points Earned</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{completedSteps.size}/{mission.steps.length}</p>
            <p className="stat-label">Steps</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{Math.floor(timeTaken / 60)}:{String(timeTaken % 60).padStart(2, '0')}</p>
            <p className="stat-label">Time</p>
          </div>
        </div>

        <div className="space-y-3">
          <Link to={`/skills/${skill.id}`} className="btn-primary block w-full">
            Continue Learning
          </Link>
          <button
            onClick={() => {
              setPhase('intro');
              setCurrentStep(0);
              setCompletedSteps(new Set());
            }}
            className="btn-secondary block w-full"
          >
            Retry Mission
          </button>
        </div>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        <Link
          to={`/skills/${skill.id}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {skill.name}
        </Link>

        <div className="glass-card overflow-hidden">
          {/* Mission Header */}
          <div className={`relative p-8 bg-gradient-to-br ${gradient.bg}`}>
            <div className="flex items-center gap-3 mb-4">
              <Target className={`w-8 h-8 ${gradient.icon}`} />
              <span className="text-sm font-medium text-slate-300">Mission {mission.order_index}</span>
            </div>
            <h1 className="text-2xl font-display font-bold text-white mb-2">{mission.title}</h1>
            <p className="text-slate-300">{mission.description}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Scenario */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <h3 className="font-medium text-white mb-2">Scenario</h3>
              <p className="text-slate-400">{mission.scenario}</p>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4 text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {mission.duration_minutes} min
                </span>
                <span className="flex items-center gap-1">
                  <Target className="w-4 h-4" />
                  {mission.points} pts
                </span>
              </div>
              <span className="text-slate-500">Difficulty: {mission.difficulty}/5</span>
            </div>

            {/* Safety Notes */}
            <div>
              <button
                onClick={() => setShowSafety(!showSafety)}
                className="flex items-center gap-2 text-warning-400 font-medium hover:text-warning-300 transition-colors"
              >
                <AlertCircle className="w-5 h-5" />
                Safety Notes
                <ChevronRight className={`w-4 h-4 transition-transform ${showSafety ? 'rotate-90' : ''}`} />
              </button>
              {showSafety && mission.safety_notes && (
                <ul className="mt-3 space-y-1 pl-7">
                  {mission.safety_notes.map((note, idx) => (
                    <li key={idx} className="text-slate-400 text-sm flex items-start gap-2">
                      <span className="text-warning-400 mt-1">-</span>
                      {note}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Materials */}
            <div>
              <h3 className="font-medium text-white mb-3">Materials Needed</h3>
              <div className="flex flex-wrap gap-2">
                {mission.materials?.map((material, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 bg-slate-800/50 border border-slate-700/50 text-slate-300 rounded-lg text-sm"
                  >
                    {material}
                  </span>
                ))}
              </div>
            </div>

            {/* Voice Commands */}
            <div>
              <h3 className="font-medium text-white mb-3">Voice Commands</h3>
              <div className="bg-slate-800/50 rounded-xl p-4">
                <ul className="space-y-2">
                  {mission.voice_instructions?.map((instruction, idx) => (
                    <li key={idx} className="text-slate-400 text-sm">
                      {instruction}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <button
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
              >
                {voiceEnabled ? (
                  <>
                    <Volume2 className="w-5 h-5" />
                    Voice guidance ON
                  </>
                ) : (
                  <>
                    <VolumeX className="w-5 h-5" />
                    Voice guidance OFF
                  </>
                )}
              </button>
              <button
                onClick={handleStartMission}
                className="btn-primary inline-flex items-center gap-2"
                disabled={!isSupported}
              >
                <Play className="w-5 h-5" />
                Start Mission
              </button>
            </div>

            {!isSupported && (
              <div className="p-4 bg-warning-500/10 border border-warning-500/30 rounded-xl text-warning-400 text-sm">
                Voice recognition is not supported in this browser. You can still complete the mission using the buttons.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Active Mission Phase
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display font-bold text-white">{mission.title}</h1>
          <p className="text-slate-400 text-sm">
            Step {currentStep + 1} of {mission.steps.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="p-2 rounded-lg hover:bg-slate-800/50 transition-colors"
          >
            {voiceEnabled ? (
              <Volume2 className="w-5 h-5 text-primary-400" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-500" />
            )}
          </button>
          <button
            onClick={handleAbort}
            className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            Abort
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar h-3">
        <div
          className="progress-bar-fill"
          style={{ width: `${((currentStep + 1) / mission.steps.length) * 100}%` }}
        />
      </div>

      {/* Current Step */}
      <div className="glass-card p-6">
        <div className="flex items-start justify-between mb-4">
          <span className={`text-sm font-medium bg-gradient-to-r ${gradient.bg} ${gradient.border} border px-3 py-1 rounded-lg ${gradient.icon}`}>
            Step {currentStep + 1}
          </span>
          <span className="text-sm text-slate-500">
            {Math.floor((Date.now() - startTime) / 1000)}s elapsed
          </span>
        </div>

        <p className="text-lg text-white mb-6">{mission.steps[currentStep]}</p>

        {feedback && (
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 mb-4">
            <p className="text-primary-400">{feedback}</p>
          </div>
        )}

        {interimTranscript && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4">
            <p className="text-slate-400">Listening: "{interimTranscript}"</p>
          </div>
        )}

        {/* Voice Control Button */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={toggleListening}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${
              isListening
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 shadow-glow'
                : 'bg-slate-800/50 border-2 border-slate-700/50 hover:border-primary-500/50'
            }`}
          >
            {isListening ? (
              <Mic className="w-8 h-8 text-white animate-pulse" />
            ) : (
              <MicOff className="w-8 h-8 text-slate-500" />
            )}
          </button>
          <div className="flex-1">
            <p className="text-slate-400">
              {isListening
                ? 'Say "done" or "complete" when step is finished'
                : 'Click to start voice input'}
            </p>
          </div>
        </div>

        {/* Step Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="btn-secondary"
            >
              Previous
            </button>
          )}
          <button
            onClick={speakCurrentStep}
            className="btn-secondary flex items-center gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Repeat
          </button>
          <button
            onClick={handleStepComplete}
            className="btn-primary flex items-center gap-2 ml-auto"
          >
            {currentStep < mission.steps.length - 1 ? 'Next Step' : 'Complete'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="glass-card p-4">
        <h3 className="font-medium text-white mb-3">Progress</h3>
        <div className="flex items-center gap-2 flex-wrap">
          {mission.steps.map((_, idx) => (
            <div
              key={idx}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                completedSteps.has(idx)
                  ? 'bg-success-500/20 border border-success-500/30 text-success-400'
                  : idx === currentStep
                  ? `bg-gradient-to-br ${gradient.bg} ${gradient.border} border ${gradient.icon}`
                  : 'bg-slate-800/50 text-slate-500 border border-slate-700/50'
              }`}
            >
              {completedSteps.has(idx) ? <CheckCircle className="w-4 h-4" /> : idx + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  function toggleListening() {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }
}
