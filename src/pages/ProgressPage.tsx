import React, { useState, useEffect } from 'react';
import { getSkills, getAllUserProgress } from '../services/api';
import type { Skill, UserProgress } from '../lib/supabase';
import {
  Zap,
  Heart,
  Hammer,
  Cpu,
  Target,
  Clock,
  TrendingUp,
  Award,
  BarChart3,
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

export function ProgressPage() {
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
        console.error('Failed to load progress:', error);
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
  const totalAssessments = progress.reduce((sum, p) => sum + p.assessments_passed, 0);

  const getSkillProgress = (skillId: string) => {
    return progress.find((p) => p.skill_id === skillId);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Progress Dashboard</h1>
        <p className="text-slate-400">Track your vocational skill development</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Total XP</span>
            <Target className="w-5 h-5 text-primary-400" />
          </div>
          <p className="stat-value">{totalPoints.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Missions</span>
            <Award className="w-5 h-5 text-accent-400" />
          </div>
          <p className="stat-value">{totalMissions}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Time Spent</span>
            <Clock className="w-5 h-5 text-warning-400" />
          </div>
          <p className="stat-value">
            {Math.floor(totalTime / 60)}h {totalTime % 60}m
          </p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Assessments</span>
            <BarChart3 className="w-5 h-5 text-success-400" />
          </div>
          <p className="stat-value">{totalAssessments}</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Mastery */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Skill Mastery</h2>
          <div className="space-y-4">
            {skills.map((skill) => {
              const skillProgress = getSkillProgress(skill.id);
              const mastery = skillProgress?.mastery_percentage || 0;
              const Icon = skillIcons[skill.category] || Target;
              const gradient = skillGradients[skill.category] || skillGradients.electrical;

              return (
                <div key={skill.id} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient.bg} ${gradient.border} border flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${gradient.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-white">{skill.name}</span>
                      <span className="text-sm text-slate-400">{mastery.toFixed(0)}%</span>
                    </div>
                    <div className="progress-bar h-3">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${mastery}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Stats */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Learning Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-success-400" />
                <span className="text-slate-300">Strongest Skill</span>
              </div>
              <span className="font-medium text-white">
                {skills.reduce((best, skill) => {
                  const mastery = getSkillProgress(skill.id)?.mastery_percentage || 0;
                  const bestMastery = getSkillProgress(best?.id || '')?.mastery_percentage || 0;
                  return mastery > bestMastery ? skill : best;
                }, skills[0])?.name || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-warning-400" />
                <span className="text-slate-300">Focus Area</span>
              </div>
              <span className="font-medium text-white">
                {skills.reduce((weakest, skill) => {
                  const mastery = getSkillProgress(skill.id)?.mastery_percentage || 0;
                  const weakestMastery = getSkillProgress(weakest?.id || '')?.mastery_percentage || 100;
                  return mastery < weakestMastery ? skill : weakest;
                }, skills[0])?.name || 'N/A'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-accent-400" />
                <span className="text-slate-300">Certificates Earned</span>
              </div>
              <span className="font-medium text-white">{totalAssessments}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-400" />
                <span className="text-slate-300">Avg. Time per Mission</span>
              </div>
              <span className="font-medium text-white">
                {totalMissions > 0 ? Math.round(totalTime / totalMissions) : 0} min
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Progress Table */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Detailed Progress</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Skill</th>
                <th className="text-center py-3 px-4 text-slate-500 font-medium">Level</th>
                <th className="text-center py-3 px-4 text-slate-500 font-medium">Missions</th>
                <th className="text-center py-3 px-4 text-slate-500 font-medium">Points</th>
                <th className="text-center py-3 px-4 text-slate-500 font-medium">Mastery</th>
                <th className="text-center py-3 px-4 text-slate-500 font-medium">Time</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => {
                const skillProgress = getSkillProgress(skill.id) || {
                  current_level: 1,
                  missions_completed: 0,
                  total_points: 0,
                  mastery_percentage: 0,
                  time_spent_minutes: 0,
                };
                const Icon = skillIcons[skill.category] || Target;
                const gradient = skillGradients[skill.category] || skillGradients.electrical;

                return (
                  <tr key={skill.id} className="border-b border-white/5 last:border-b-0">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient.bg} ${gradient.border} border flex items-center justify-center`}>
                          <Icon className={`w-4 h-4 ${gradient.icon}`} />
                        </div>
                        <span className="font-medium text-white">{skill.name}</span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 text-slate-400">
                      {skillProgress.current_level}
                    </td>
                    <td className="text-center py-4 px-4 text-slate-400">
                      {skillProgress.missions_completed}/{skill.total_missions}
                    </td>
                    <td className="text-center py-4 px-4 text-slate-400">
                      {skillProgress.total_points}
                    </td>
                    <td className="text-center py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                            style={{ width: `${skillProgress.mastery_percentage}%` }}
                          />
                        </div>
                        <span className="text-slate-400 text-sm">
                          {skillProgress.mastery_percentage.toFixed(0)}%
                        </span>
                      </div>
                    </td>
                    <td className="text-center py-4 px-4 text-slate-400">
                      {skillProgress.time_spent_minutes} min
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
