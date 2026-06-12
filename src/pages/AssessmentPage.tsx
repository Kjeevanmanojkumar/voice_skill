import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  getAssessment,
  getSkill,
  createAssessmentAttempt,
  getUserProgress,
  updateUserProgress,
  createCertificate,
} from '../services/api';
import type { Assessment, Skill, AssessmentQuestion } from '../lib/supabase';
import {
  ArrowLeft,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Award,
  ArrowRight,
  Zap,
  Heart,
  Hammer,
  Cpu,
} from 'lucide-react';

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

export function AssessmentPage() {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<'intro' | 'active' | 'results'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!assessmentId) return;

      try {
        const assessmentData = await getAssessment(assessmentId);
        setAssessment(assessmentData);

        if (assessmentData) {
          const skillData = await getSkill(assessmentData.skill_id);
          setSkill(skillData);
        }
      } catch (error) {
        console.error('Failed to load assessment:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [assessmentId]);

  const handleStartAssessment = () => {
    setPhase('active');
    setStartTime(Date.now());
    setCurrentQuestion(0);
    setAnswers({});
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: answerIndex,
    }));
  };

  const handleNextQuestion = () => {
    if (!assessment) return;

    if (currentQuestion < assessment.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      handleSubmitAssessment();
    }
  };

  const handleSubmitAssessment = async () => {
    if (!assessment || !skill) return;

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    let correctCount = 0;
    assessment.questions.forEach((q: AssessmentQuestion, idx: number) => {
      if (answers[idx] === q.correct) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / assessment.questions.length) * 100);
    const hasPassed = calculatedScore >= assessment.passing_score;

    setScore(calculatedScore);
    setPassed(hasPassed);

    try {
      await createAssessmentAttempt(
        assessment.id,
        answers,
        calculatedScore,
        hasPassed,
        timeTaken
      );

      const progress = await getUserProgress(skill.id);
      if (progress) {
        await updateUserProgress(skill.id, {
          assessments_passed: hasPassed
            ? (progress.assessments_passed || 0) + 1
            : progress.assessments_passed,
          last_accessed: new Date().toISOString(),
        });
      }

      if (hasPassed) {
        const competencyLevel = calculatedScore >= 90 ? 'Expert' :
                                 calculatedScore >= 80 ? 'Proficient' : 'Competent';

        await createCertificate(skill.id, competencyLevel, calculatedScore);
      }

      setPhase('results');
    } catch (error) {
      console.error('Failed to submit assessment:', error);
    }
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

  if (!assessment || !skill) {
    return (
      <div className="text-center py-20">
        <div className="glass-card inline-block p-8">
          <h2 className="text-xl font-semibold text-white mb-2">Assessment not found</h2>
          <Link to="/assessments" className="text-primary-400 hover:text-primary-300">
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  const gradient = skillGradients[skill.category] || skillGradients.electrical;

  // Results Phase
  if (phase === 'results') {
    return (
      <div className="max-w-2xl mx-auto text-center py-12 animate-fade-in">
        <div className={`relative w-24 h-24 mx-auto mb-6 rounded-full ${
          passed ? 'bg-success-500/20' : 'bg-red-500/20'
        } border ${passed ? 'border-success-500/30' : 'border-red-500/30'} flex items-center justify-center`}>
          {passed ? (
            <Award className="w-12 h-12 text-success-400" />
          ) : (
            <XCircle className="w-12 h-12 text-red-400" />
          )}
        </div>

        <h1 className="text-2xl font-display font-bold text-white mb-2">
          {passed ? 'Congratulations!' : 'Not Quite There'}
        </h1>
        <p className="text-slate-400 mb-8">
          {passed
            ? 'You have successfully passed the assessment.'
            : 'You did not meet the passing score. Review the material and try again.'}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="stat-card">
            <p className={`stat-value ${passed ? 'text-success-400' : 'text-red-400'}`}>{score}%</p>
            <p className="stat-label">Score</p>
          </div>
          <div className="stat-card">
            <div className={`stat-value ${passed ? 'text-success-400' : 'text-red-400'}`}>
              {passed ? 'Pass' : 'Fail'}
            </div>
            <p className="stat-label">Result</p>
          </div>
          <div className="stat-card">
            <p className="stat-value">{assessment.passing_score}%</p>
            <p className="stat-label">Required</p>
          </div>
        </div>

        {passed && (
          <p className="text-success-400 font-medium mb-6">
            A certificate has been generated for your achievement.
          </p>
        )}

        <div className="space-y-3">
          <Link to="/certificates" className="btn-primary block w-full">
            View Certificates
          </Link>
          <Link to={`/skills/${skill.id}`} className="btn-secondary block w-full">
            Return to Skill
          </Link>
        </div>
      </div>
    );
  }

  // Intro Phase
  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
        <Link
          to={`/skills/${skill.id}`}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {skill.name}
        </Link>

        <div className="glass-card overflow-hidden">
          {/* Header */}
          <div className={`relative p-8 bg-gradient-to-br ${gradient.bg}`}>
            <Award className={`w-10 h-10 mb-4 ${gradient.icon}`} />
            <h1 className="text-2xl font-display font-bold text-white mb-2">{assessment.title}</h1>
            <p className="text-slate-300">{assessment.description}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-lg font-bold text-white">{assessment.questions.length}</p>
                <p className="text-slate-400 text-sm">Questions</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-lg font-bold text-white">{assessment.time_limit_minutes} min</p>
                <p className="text-slate-400 text-sm">Time Limit</p>
              </div>
              <div className="p-4 bg-slate-800/50 rounded-xl">
                <p className="text-lg font-bold text-white">{assessment.passing_score}%</p>
                <p className="text-slate-400 text-sm">Passing Score</p>
              </div>
            </div>

            {/* Warning */}
            <div className="flex items-start gap-3 p-4 bg-warning-500/10 border border-warning-500/30 rounded-xl">
              <AlertCircle className="w-5 h-5 text-warning-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-warning-400">Important Notes</p>
                <ul className="text-warning-300/80 text-sm mt-1 space-y-1">
                  <li>You have {assessment.max_attempts} attempts for this assessment.</li>
                  <li>Once started, you must complete all questions.</li>
                  <li>You can review answers before submitting.</li>
                </ul>
              </div>
            </div>

            <button
              onClick={handleStartAssessment}
              className="btn-primary w-full py-3"
            >
              Start Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Phase
  const question = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const timeRemaining = Math.max(
    0,
    assessment.time_limit_minutes * 60 - Math.floor((Date.now() - startTime) / 1000)
  );

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-slate-400 text-sm">
          Question {currentQuestion + 1} of {assessment.questions.length}
        </span>
        <div className="flex items-center gap-4">
          <span className={`flex items-center gap-1.5 font-medium ${
            timeRemaining < 300 ? 'text-red-400' : 'text-slate-400'
          }`}>
            <Clock className="w-4 h-4" />
            {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar h-3">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Question Card */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-medium text-white mb-6">{question.q}</h2>

        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswerSelect(currentQuestion, idx)}
              className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                answers[currentQuestion] === idx
                  ? 'border-primary-500 bg-primary-500/10 text-white'
                  : 'border-slate-700/50 hover:border-slate-600 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                  answers[currentQuestion] === idx
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
          {currentQuestion > 0 ? (
            <button
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
              className="btn-secondary"
            >
              Previous
            </button>
          ) : (
            <div />
          )}
          <button
            onClick={handleNextQuestion}
            disabled={answers[currentQuestion] === undefined}
            className="btn-primary flex items-center gap-2"
          >
            {currentQuestion < assessment.questions.length - 1 ? 'Next' : 'Submit'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question Navigator */}
      <div className="glass-card p-4">
        <div className="flex items-center gap-2 flex-wrap">
          {assessment.questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestion(idx)}
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-all ${
                idx === currentQuestion
                  ? 'bg-primary-500 text-white'
                  : answers[idx] !== undefined
                  ? 'bg-success-500/20 border border-success-500/30 text-success-400'
                  : 'bg-slate-800/50 text-slate-400 border border-slate-700/50'
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
