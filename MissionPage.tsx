import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getSkills, getAllUserProgress } from '../services/api';
import type { Skill, UserProgress } from '../lib/supabase';
import {
  Zap,
  Heart,
  Hammer,
  Cpu,
  ArrowRight,
  Target,
  Award,
  Clock,
  TrendingUp,
  Sparkles,
  Mic,
  Play,
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

export function DashboardPage() {
  const { user, profile } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [skillsData, progressData] = await Promise.all([
          getSkills(),
          getAllUserProgress(),
        ]);
        setSkills(skillsData);
        setProgress(progressData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

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

  const totalPoints = progress.reduce((sum, p) => sum + p.total_points, 0);
  const totalMissions = progress.reduce((sum, p) => sum + p.missions_completed, 0);
  const totalTime = progress.reduce((sum, p) => sum + p.time_spent_minutes, 0);
  const avgMastery = progress.length > 0
    ? progress.reduce((sum, p) => sum + p.mastery_percentage, 0) / progress.length
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
            Welcome back, <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">{profile?.full_name || 'Learner'}</span>
          </h1>
          <p className="text-slate-400">Continue your vocational skill development journey</p>
        </div>
        <Link to="/voice-arena" className="btn-primary inline-flex items-center gap-2">
          <Mic className="w-5 h-5" />
          Open Voice Arena
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <Target className="w-5 h-5 text-primary-400" />
          </div>
          <p className="stat-value">{totalPoints.toLocaleString()}</p>
          <p className="stat-label">Total XP</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <Award className="w-5 h-5 text-accent-400" />
          </div>
          <p className="stat-value">{totalMissions}</p>
          <p className="stat-label">Missions</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-warning-400" />
          </div>
          <p className="stat-value">{Math.floor(totalTime / 60)}h {totalTime % 60}m</p>
          <p className="stat-label">Time Spent</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-success-400" />
          </div>
          <p className="stat-value">{avgMastery.toFixed(1)}%</p>
          <p className="stat-label">Avg Mastery</p>
        </div>
      </div>

      {/* Skills Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-display font-bold text-white">Vocational Skills</h2>
          <Link to="/skills" className="text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors flex items-center gap-1">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {skills.map((skill, index) => {
            const Icon = skillIcons[skill.category] || Target;
            const skillProgress = progress.find((p) => p.skill_id === skill.id);
            const mastery = skillProgress?.mastery_percentage || 0;
            const gradient = skillGradients[skill.category] || skillGradients.electrical;

            return (
              <Link
                key={skill.id}
                to={`/skills/${skill.id}`}
                className="glass-card group relative overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient.bg} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient.bg} ${gradient.border} border flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${gradient.icon}`} />
                    </div>
                    <span className="text-xs font-medium text-slate-500 bg-slate-800/50 px-2 py-1 rounded-lg">
                      Level {skill.difficulty_level}
                    </span>
                  </div>
                  <h3 className="font-semibold text-white mb-1">{skill.name}</h3>
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{skill.description}</p>
                  <div className="progress-bar mb-2">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${mastery}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>{mastery.toFixed(0)}% mastery</span>
                    <span>{skillProgress?.missions_completed || 0}/{skill.total_missions}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/voice-arena"
              className="group relative overflow-hidden p-4 rounded-xl bg-primary-500/10 border border-primary-500/20 hover:border-primary-500/40 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                  <Zap className="w-5 h-5 text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Voice Arena</p>
                  <p className="text-xs text-slate-400">Start voice learning</p>
                </div>
              </div>
            </Link>
            <Link
              to="/missions"
              className="group relative overflow-hidden p-4 rounded-xl bg-accent-500/10 border border-accent-500/20 hover:border-accent-500/40 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-accent-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-accent-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Missions</p>
                  <p className="text-xs text-slate-400">Continue learning</p>
                </div>
              </div>
            </Link>
            <Link
              to="/assessments"
              className="group relative overflow-hidden p-4 rounded-xl bg-success-500/10 border border-success-500/20 hover:border-success-500/40 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-success-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-success-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Assessments</p>
                  <p className="text-xs text-slate-400">Test your skills</p>
                </div>
              </div>
            </Link>
            <Link
              to="/certificates"
              className="group relative overflow-hidden p-4 rounded-xl bg-warning-500/10 border border-warning-500/20 hover:border-warning-500/40 transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-warning-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-warning-500/20 flex items-center justify-center">
                  <Award className="w-5 h-5 text-warning-400" />
                </div>
                <div>
                  <p className="font-medium text-white">Certificates</p>
                  <p className="text-xs text-slate-400">View achievements</p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Getting Started Guide */}
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-white mb-4">Getting Started</h3>
          <div className="space-y-4">
            <p className="text-slate-400 text-sm">
              Welcome to VoiceSkill! Here's how to begin your learning journey:
            </p>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-400 text-sm font-medium">1</span>
                </div>
                <span className="text-slate-300 pt-1">Choose a vocational skill to learn</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-400 text-sm font-medium">2</span>
                </div>
                <span className="text-slate-300 pt-1">Complete missions with voice commands</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-400 text-sm font-medium">3</span>
                </div>
                <span className="text-slate-300 pt-1">Take assessments to verify skills</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-400 text-sm font-medium">4</span>
                </div>
                <span className="text-slate-300 pt-1">Earn certificates upon completion</span>
              </li>
            </ol>
            <Link to="/skills" className="btn-primary inline-flex items-center gap-2 mt-4">
              <Play className="w-4 h-4" />
              Choose Your First Skill
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
