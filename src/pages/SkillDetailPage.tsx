import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getSkill, getMissions, getUserProgress, initializeUserProgress, getAssessments } from '../services/api';
import type { Skill, Mission, UserProgress, Assessment } from '../lib/supabase';
import {
  Zap,
  Heart,
  Hammer,
  Cpu,
  ArrowLeft,
  Target,
  Clock,
  Award,
  CheckCircle,
  Play,
  Lock,
} from 'lucide-react';

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

export function SkillDetailPage() {
  const { skillId } = useParams<{ skillId: string }>();
  const navigate = useNavigate();

  const [skill, setSkill] = useState<Skill | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!skillId) return;

      try {
        const [skillData, missionsData, assessmentsData, progressData] = await Promise.all([
          getSkill(skillId),
          getMissions(skillId),
          getAssessments(skillId),
          getUserProgress(skillId),
        ]);

        setSkill(skillData);
        setMissions(missionsData);
        setAssessments(assessmentsData);
        setProgress(progressData);
      } catch (error) {
        console.error('Failed to load skill data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [skillId]);

  const handleStartLearning = async () => {
    if (!skillId) return;

    setStarting(true);
    try {
      if (!progress) {
        const newProgress = await initializeUserProgress(skillId);
        setProgress(newProgress);
      }
      if (missions.length > 0) {
        navigate(`/mission/${missions[0].id}`);
      }
    } catch (error) {
      console.error('Failed to start learning:', error);
    } finally {
      setStarting(false);
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

  if (!skill) {
    return (
      <div className="text-center py-20">
        <div className="glass-card inline-block p-8">
          <h2 className="text-xl font-semibold text-white mb-2">Skill not found</h2>
          <Link to="/skills" className="text-primary-400 hover:text-primary-300">
            Back to Skills
          </Link>
        </div>
      </div>
    );
  }

  const Icon = skillIcons[skill.category] || Target;
  const gradient = skillGradients[skill.category] || skillGradients.electrical;
  const completedMissions = progress?.missions_completed || 0;
  const mastery = progress?.mastery_percentage || 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Navigation */}
      <div>
        <Link
          to="/skills"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Skills
        </Link>
      </div>

      {/* Skill Header */}
      <div className="glass-card relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${gradient.bg} rounded-2xl`} />
        <div className="relative p-8">
          <div className="flex items-start gap-6">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient.bg} ${gradient.border} border flex items-center justify-center flex-shrink-0`}>
              <Icon className={`w-8 h-8 ${gradient.icon}`} />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">{skill.name}</h1>
              <p className="text-slate-300">{skill.description}</p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  {skill.total_missions} missions
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {skill.estimated_hours} hours
                </span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  Level {skill.difficulty_level}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="stat-card">
          <p className="stat-value">{completedMissions}</p>
          <p className="stat-label">Missions Completed</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{progress?.total_points || 0}</p>
          <p className="stat-label">Points Earned</p>
        </div>
        <div className="stat-card">
          <p className="stat-value">{mastery.toFixed(0)}%</p>
          <p className="stat-label">Mastery Level</p>
        </div>
      </div>

      {/* Start Button */}
      {mastery === 0 && (
        <button
          onClick={handleStartLearning}
          disabled={starting}
          className="btn-primary inline-flex items-center gap-2"
        >
          {starting ? (
            <>
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              Starting...
            </>
          ) : (
            <>
              <Play className="w-5 h-5" />
              Start Learning
            </>
          )}
        </button>
      )}

      {/* Missions List */}
      <div>
        <h2 className="text-xl font-display font-bold text-white mb-4">Learning Missions</h2>
        <div className="space-y-3">
          {missions.map((mission, index) => {
            const isCompleted = index < completedMissions;
            const isCurrent = index === completedMissions;
            const isLocked = index > completedMissions && !progress?.assessments_passed;

            return (
              <div
                key={mission.id}
                className={`glass-card transition-all duration-200 ${
                  isLocked ? 'opacity-50' : 'hover:shadow-glow cursor-pointer'
                }`}
                onClick={() => {
                  if (!isLocked) {
                    navigate(`/mission/${mission.id}`);
                  }
                }}
              >
                <div className="flex items-center gap-4 p-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isCompleted
                        ? 'bg-success-500/20 border border-success-500/30'
                        : isCurrent
                        ? `bg-gradient-to-br ${gradient.bg} ${gradient.border} border`
                        : 'bg-slate-800/50 border border-slate-700/50'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-success-400" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-slate-500" />
                    ) : (
                      <span className={`text-sm font-medium ${gradient.icon}`}>{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-white">{mission.title}</h3>
                      <span className="text-primary-400 text-sm">{mission.points} pts</span>
                    </div>
                    <p className="text-slate-400 text-sm truncate">{mission.description}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>{mission.duration_minutes} min</span>
                      <span>Difficulty: {mission.difficulty}/5</span>
                    </div>
                  </div>
                  {!isLocked && (
                    <Play className="w-5 h-5 text-primary-400 flex-shrink-0" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Assessment Section */}
      {assessments.length > 0 && mastery >= 50 && (
        <div>
          <h2 className="text-xl font-display font-bold text-white mb-4">Certification Assessment</h2>
          {assessments.map((assessment) => (
            <div key={assessment.id} className="glass-card">
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-white text-lg mb-1">{assessment.title}</h3>
                    <p className="text-slate-400 text-sm">{assessment.description}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-500">
                      <span>Passing score: {assessment.passing_score}%</span>
                      <span>Time: {assessment.time_limit_minutes} min</span>
                      <span>Max attempts: {assessment.max_attempts}</span>
                    </div>
                  </div>
                  <Link
                    to={`/assessment/${assessment.id}`}
                    className="btn-primary inline-flex items-center gap-2 whitespace-nowrap"
                  >
                    Take Assessment
                    <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
