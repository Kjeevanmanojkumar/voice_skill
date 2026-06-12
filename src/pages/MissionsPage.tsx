import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSkills, getMissions, getAllUserProgress } from '../services/api';
import type { Skill, Mission, UserProgress } from '../lib/supabase';
import { Zap, Heart, Hammer, Cpu, Target, CheckCircle } from 'lucide-react';

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

export function MissionsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [missionsBySkill, setMissionsBySkill] = useState<Record<string, Mission[]>>({});
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const skillsData = await getSkills();
        setSkills(skillsData);

        const missionPromises = skillsData.map(async (skill) => {
          const missions = await getMissions(skill.id);
          return { skillId: skill.id, missions };
        });

        const missionResults = await Promise.all(missionPromises);
        const map: Record<string, Mission[]> = {};
        missionResults.forEach(({ skillId, missions }) => {
          map[skillId] = missions;
        });
        setMissionsBySkill(map);

        const progressData = await getAllUserProgress();
        const progressMapData: Record<string, UserProgress> = {};
        progressData.forEach((p) => {
          progressMapData[p.skill_id] = p;
        });
        setProgressMap(progressMapData);
      } catch (error) {
        console.error('Failed to load missions:', error);
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

  const filteredSkills = selectedSkill
    ? skills.filter((s) => s.id === selectedSkill)
    : skills;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Mission Center</h1>
        <p className="text-slate-400">Select a mission to practice vocational skills</p>
      </div>

      {/* Skill Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedSkill(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
            selectedSkill === null
              ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
              : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border border-transparent'
          }`}
        >
          All Skills
        </button>
        {skills.map((skill) => {
          const Icon = skillIcons[skill.category] || Target;
          const gradient = skillGradients[skill.category];
          return (
            <button
              key={skill.id}
              onClick={() => setSelectedSkill(skill.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border ${
                selectedSkill === skill.id
                  ? `${gradient.bg} ${gradient.border} ${gradient.icon}`
                  : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-700/50 border-transparent'
              }`}
            >
              <Icon className="w-4 h-4" />
              {skill.name}
            </button>
          );
        })}
      </div>

      {/* Missions by Skill */}
      {filteredSkills.map((skill) => {
        const missions = missionsBySkill[skill.id] || [];
        const progress = progressMap[skill.id];
        const completedCount = progress?.missions_completed || 0;
        const Icon = skillIcons[skill.category] || Target;
        const gradient = skillGradients[skill.category] || skillGradients.electrical;

        return (
          <div key={skill.id} className="glass-card overflow-hidden">
            {/* Skill Header */}
            <div className={`p-4 border-b border-white/5 bg-gradient-to-r ${gradient.bg}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient.bg} ${gradient.border} border flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${gradient.icon}`} />
                  </div>
                  <div>
                    <h2 className="font-semibold text-white">{skill.name}</h2>
                    <p className="text-sm text-slate-400">
                      {completedCount} of {missions.length} missions completed
                    </p>
                  </div>
                </div>
                <div className="w-32">
                  <div className="progress-bar h-2.5">
                    <div
                      className="progress-bar-fill"
                      style={{ width: `${(completedCount / Math.max(missions.length, 1)) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Missions List */}
            <div className="divide-y divide-white/5">
              {missions.map((mission, index) => {
                const isCompleted = index < completedCount;
                const isCurrent = index === completedCount;

                return (
                  <Link
                    key={mission.id}
                    to={`/mission/${mission.id}`}
                    className={`flex items-center gap-4 p-4 transition-all duration-200 ${
                      !isCompleted && !isCurrent ? 'opacity-50' : 'hover:bg-white/5'
                    }`}
                  >
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
                      ) : (
                        <span className={`text-sm font-medium ${isCurrent ? gradient.icon : 'text-slate-500'}`}>
                          {index + 1}
                        </span>
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
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
