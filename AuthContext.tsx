import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Users,
  Target,
  Award,
  Clock,
  TrendingUp,
  Settings,
  Database,
  Activity,
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalMissionsCompleted: number;
  totalCertificates: number;
  totalHoursLearned: number;
  activeUsersToday: number;
}

interface SkillStats {
  skillId: string;
  skillName: string;
  category: string;
  userCount: number;
  avgMastery: number;
  totalMissions: number;
}

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalMissionsCompleted: 0,
    totalCertificates: 0,
    totalHoursLearned: 0,
    activeUsersToday: 0,
  });
  const [skillStats, setSkillStats] = useState<SkillStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const { count: userCount } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true });

        const { data: progressData } = await supabase
          .from('user_progress')
          .select('missions_completed, time_spent_minutes, mastery_percentage, skill_id');

        const { count: certCount } = await supabase
          .from('certificates')
          .select('*', { count: 'exact', head: true });

        const { data: skillsData } = await supabase
          .from('skills')
          .select('id, name, category, total_missions');

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const { count: activeToday } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true })
          .gte('last_activity', today.toISOString());

        const totalMissions = progressData?.reduce((sum, p) => sum + (p.missions_completed || 0), 0) || 0;
        const totalHours = Math.floor((progressData?.reduce((sum, p) => sum + (p.time_spent_minutes || 0), 0) || 0) / 60);

        setStats({
          totalUsers: userCount || 0,
          totalMissionsCompleted: totalMissions,
          totalCertificates: certCount || 0,
          totalHoursLearned: totalHours,
          activeUsersToday: activeToday || 0,
        });

        if (skillsData && progressData) {
          const skillStatsData = skillsData.map((skill) => {
            const skillProgress = progressData.filter((p) => p.skill_id === skill.id);
            const userCount = skillProgress.length;
            const avgMastery = userCount > 0
              ? skillProgress.reduce((sum, p) => sum + (p.mastery_percentage || 0), 0) / userCount
              : 0;

            return {
              skillId: skill.id,
              skillName: skill.name,
              category: skill.category,
              userCount,
              avgMastery,
              totalMissions: skill.total_missions,
            };
          });
          setSkillStats(skillStatsData);
        }
      } catch (error) {
        console.error('Failed to load admin data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAdminData();
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Admin Dashboard</h1>
        <p className="text-slate-400">Platform overview and analytics</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Total Users</span>
            <Users className="w-5 h-5 text-primary-400" />
          </div>
          <p className="stat-value">{stats.totalUsers}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Missions</span>
            <Target className="w-5 h-5 text-accent-400" />
          </div>
          <p className="stat-value">{stats.totalMissionsCompleted}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Certificates</span>
            <Award className="w-5 h-5 text-warning-400" />
          </div>
          <p className="stat-value">{stats.totalCertificates}</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Hours Learned</span>
            <Clock className="w-5 h-5 text-slate-400" />
          </div>
          <p className="stat-value">{stats.totalHoursLearned}h</p>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-slate-500 text-sm">Active Today</span>
            <TrendingUp className="w-5 h-5 text-success-400" />
          </div>
          <p className="stat-value">{stats.activeUsersToday}</p>
        </div>
      </div>

      {/* Skill Statistics Table */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
            <Database className="w-5 h-5 text-primary-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Skill Statistics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Skill</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Category</th>
                <th className="text-center py-3 px-4 text-slate-500 font-medium">Enrolled</th>
                <th className="text-center py-3 px-4 text-slate-500 font-medium">Avg. Mastery</th>
                <th className="text-center py-3 px-4 text-slate-500 font-medium">Missions</th>
              </tr>
            </thead>
            <tbody>
              {skillStats.map((skill) => (
                <tr key={skill.skillId} className="border-b border-white/5 last:border-b-0">
                  <td className="py-4 px-4 font-medium text-white">{skill.skillName}</td>
                  <td className="py-4 px-4 text-slate-400 capitalize">{skill.category.replace('_', ' ')}</td>
                  <td className="text-center py-4 px-4 text-slate-400">{skill.userCount}</td>
                  <td className="text-center py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full"
                          style={{ width: `${skill.avgMastery}%` }}
                        />
                      </div>
                      <span className="text-slate-400 text-sm">{skill.avgMastery.toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4 text-slate-400">{skill.totalMissions}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Platform Health */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-success-500/20 border border-success-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5 text-success-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Platform Health</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <span className="text-slate-400">Voice Sessions Today</span>
              <span className="font-medium text-white">--</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <span className="text-slate-400">Avg. Session Duration</span>
              <span className="font-medium text-white">-- min</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl">
              <span className="text-slate-400">Assessment Pass Rate</span>
              <span className="font-medium text-white">-- %</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-500/20 border border-accent-500/30 flex items-center justify-center">
              <Settings className="w-5 h-5 text-accent-400" />
            </div>
            <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full text-left p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors group">
              <p className="font-medium text-white group-hover:text-primary-400 transition-colors">Manage Skills</p>
              <p className="text-slate-400 text-sm">Add or modify vocational skills</p>
            </button>
            <button className="w-full text-left p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors group">
              <p className="font-medium text-white group-hover:text-primary-400 transition-colors">Manage Missions</p>
              <p className="text-slate-400 text-sm">Create and update learning missions</p>
            </button>
            <button className="w-full text-left p-4 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors group">
              <p className="font-medium text-white group-hover:text-primary-400 transition-colors">View Reports</p>
              <p className="text-slate-400 text-sm">Access detailed analytics reports</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
