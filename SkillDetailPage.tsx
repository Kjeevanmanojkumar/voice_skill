import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getSkills, getUserProgress } from '../services/api';
import type { Skill, UserProgress } from '../lib/supabase';
import { Zap, Heart, Hammer, Cpu, ArrowRight, Clock, Target } from 'lucide-react';

const skillIcons: Record<string, React.ElementType> = {
  electrical: Zap,
  healthcare: Heart,
  carpentry: Hammer,
  computer_hardware: Cpu,
};

const skillGradients: Record<string, { bg: string; border: string; icon: string; glow: string }> = {
  electrical: {
    bg: 'from-amber-500/20 to-orange-500/20',
    border: 'border-amber-500/30',
    icon: 'text-amber-400',
    glow: 'hover:shadow-[0_0_30px_rgba(251,191,36,0.2)]',
  },
  healthcare: {
    bg: 'from-rose-500/20 to-pink-500/20',
    border: 'border-rose-500/30',
    icon: 'text-rose-400',
    glow: 'hover:shadow-[0_0_30px_rgba(244,63,94,0.2)]',
  },
  carpentry: {
    bg: 'from-emerald-500/20 to-teal-500/20',
    border: 'border-emerald-500/30',
    icon: 'text-emerald-400',
    glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
  },
  computer_hardware: {
    bg: 'from-sky-500/20 to-blue-500/20',
    border: 'border-sky-500/30',
    icon: 'text-sky-400',
    glow: 'hover:shadow-[0_0_30px_rgba(14,165,233,0.2)]',
  },
};

const categoryLabels: Record<string, string> = {
  electrical: 'Electrical',
  healthcare: 'Healthcare',
  carpentry: 'Carpentry',
  computer_hardware: 'Computer Hardware',
};

export function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const skillsData = await getSkills();
        setSkills(skillsData);

        const progressPromises = skillsData.map(async (skill) => {
          const progress = await getUserProgress(skill.id);
          return { skillId: skill.id, progress };
        });

        const progressResults = await Promise.all(progressPromises);
        const map: Record<string, UserProgress> = {};
        progressResults.forEach(({ skillId, progress }) => {
          if (progress) map[skillId] = progress;
        });
        setProgressMap(map);
      } catch (error) {
        console.error('Failed to load skills:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const categories = [...new Set(skills.map((s) => s.category))];

  const filteredSkills = selectedCategory
    ? skills.filter((s) => s.category === selectedCategory)
    : skills;

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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
          Vocational Skills
        </h1>
        <p className="text-slate-400">
          Choose a skill track to begin your learning journey
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            selectedCategory === null
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
              : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
          }`}
        >
          All Skills
        </button>
        {categories.map((category) => {
          const gradient = skillGradients[category];
          return (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                selectedCategory === category
                  ? `${gradient.bg} ${gradient.border} ${gradient.icon}`
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border-transparent'
              }`}
            >
              {categoryLabels[category] || category}
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredSkills.map((skill, index) => {
          const Icon = skillIcons[skill.category] || Target;
          const progress = progressMap[skill.id];
          const mastery = progress?.mastery_percentage || 0;
          const missionsCompleted = progress?.missions_completed || 0;
          const gradient = skillGradients[skill.category] || skillGradients.electrical;

          return (
            <Link
              key={skill.id}
              to={`/skills/${skill.id}`}
              className={`group glass-card relative overflow-hidden ${gradient.glow} transition-all duration-300`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient.bg} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient.bg} ${gradient.border} border flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-7 h-7 ${gradient.icon}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-lg text-white">{skill.name}</h3>
                      <span className="text-xs font-medium text-slate-500 bg-slate-800/50 px-2 py-1 rounded-lg">
                        Lvl {skill.difficulty_level}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm mb-4">{skill.description}</p>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        {skill.total_missions} missions
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {skill.estimated_hours}h estimated
                      </span>
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-slate-400">Progress</span>
                        <span className="font-medium text-white">
                          {missionsCompleted}/{skill.total_missions} missions
                        </span>
                      </div>
                      <div className="progress-bar h-2.5">
                        <div
                          className="progress-bar-fill"
                          style={{ width: `${mastery}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1.5">{mastery.toFixed(0)}% mastery</p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-sm text-primary-400 font-medium">
                        {mastery > 0 ? 'Continue Learning' : 'Start Learning'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
