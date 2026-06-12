import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSkills, getAssessments, getAllUserProgress } from '../services/api';
import type { Skill, Assessment, UserProgress } from '../lib/supabase';
import { Zap, Heart, Hammer, Cpu, Award, Clock, ArrowRight, CheckCircle } from 'lucide-react';

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

export function AssessmentsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [assessmentsBySkill, setAssessmentsBySkill] = useState<Record<string, Assessment[]>>({});
  const [progressMap, setProgressMap] = useState<Record<string, UserProgress>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const skillsData = await getSkills();
        setSkills(skillsData);

        const assessmentPromises = skillsData.map(async (skill) => {
          const assessments = await getAssessments(skill.id);
          return { skillId: skill.id, assessments };
        });

        const assessmentResults = await Promise.all(assessmentPromises);
        const map: Record<string, Assessment[]> = {};
        assessmentResults.forEach(({ skillId, assessments }) => {
          map[skillId] = assessments;
        });
        setAssessmentsBySkill(map);

        const progressData = await getAllUserProgress();
        const progressMapData: Record<string, UserProgress> = {};
        progressData.forEach((p) => {
          progressMapData[p.skill_id] = p;
        });
        setProgressMap(progressMapData);
      } catch (error) {
        console.error('Failed to load assessments:', error);
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

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
          Assessment Center
        </h1>
        <p className="text-slate-400">
          Test your knowledge and earn certifications
        </p>
      </div>

      {/* Skills Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {skills.map((skill) => {
          const assessments = assessmentsBySkill[skill.id] || [];
          const progress = progressMap[skill.id];
          const mastery = progress?.mastery_percentage || 0;
          const passed = progress?.assessments_passed || 0;
          const Icon = skillIcons[skill.category] || Award;
          const gradient = skillGradients[skill.category] || skillGradients.electrical;
          const canTakeAssessment = mastery >= 50;

          return (
            <div key={skill.id} className="glass-card overflow-hidden">
              <div className="p-6">
                {/* Skill Header */}
                <div className="flex items-start gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient.bg} ${gradient.border} border flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${gradient.icon}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{skill.name}</h3>
                    <p className="text-slate-400 text-sm">Mastery: {mastery.toFixed(0)}%</p>
                  </div>
                </div>

                {/* Lock Message */}
                {!canTakeAssessment && (
                  <div className="mb-4 p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-sm text-slate-400">
                    Complete at least 50% of missions to unlock assessments
                  </div>
                )}

                {/* Assessments List */}
                {assessments.length === 0 ? (
                  <p className="text-slate-500 text-sm">No assessments available</p>
                ) : (
                  <div className="space-y-3">
                    {assessments.map((assessment) => (
                      <Link
                        key={assessment.id}
                        to={canTakeAssessment ? `/assessment/${assessment.id}` : '#'}
                        className={`block p-4 rounded-xl border transition-all ${
                          canTakeAssessment
                            ? 'bg-slate-800/30 border-slate-700/50 hover:border-primary-500/30 hover:bg-primary-500/5'
                            : 'bg-slate-800/20 border-slate-700/30 opacity-50 cursor-not-allowed'
                        }`}
                        onClick={(e) => !canTakeAssessment && e.preventDefault()}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-white">{assessment.title}</h4>
                            <p className="text-slate-400 text-sm mt-1">{assessment.description}</p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                              <span>{assessment.questions.length} questions</span>
                              <span>{assessment.time_limit_minutes} min</span>
                              <span>Pass: {assessment.passing_score}%</span>
                            </div>
                          </div>
                          {passed > 0 ? (
                            <div className="w-8 h-8 rounded-lg bg-success-500/20 border border-success-500/30 flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-success-400" />
                            </div>
                          ) : (
                            <ArrowRight className="w-5 h-5 text-slate-500" />
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Assessment Guidelines */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Assessment Guidelines</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-400 font-bold">1</span>
            </div>
            <div>
              <p className="font-medium text-white">Prepare Thoroughly</p>
              <p className="text-slate-400 text-sm">Complete missions and review materials</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-400 font-bold">2</span>
            </div>
            <div>
              <p className="font-medium text-white">Time Management</p>
              <p className="text-slate-400 text-sm">Pace yourself through all questions</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-slate-800/30 rounded-xl">
            <div className="w-10 h-10 rounded-lg bg-primary-500/20 border border-primary-500/30 flex items-center justify-center flex-shrink-0">
              <span className="text-primary-400 font-bold">3</span>
            </div>
            <div>
              <p className="font-medium text-white">Pass to Certify</p>
              <p className="text-slate-400 text-sm">Score 80%+ for certification</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
