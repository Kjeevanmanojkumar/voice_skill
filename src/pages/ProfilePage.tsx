import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/api';
import type { UserProfile } from '../lib/supabase';
import {
  User,
  Mail,
  Calendar,
  Volume2,
  Eye,
  Save,
  CheckCircle,
  Settings,
  Globe,
  Accessibility,
} from 'lucide-react';

export function ProfilePage() {
  const { user, profile } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [fullName, setFullName] = useState('');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voiceFeedback, setVoiceFeedback] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [screenReader, setScreenReader] = useState(false);
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile();
        if (data) {
          setUserProfile(data);
          setFullName(data.full_name || '');
          setVoiceSpeed(data.preferred_voice_speed);
          setVoiceFeedback(data.voice_feedback_enabled);
          setHighContrast(data.high_contrast_mode);
          setScreenReader(data.screen_reader_mode);
          setLanguage(data.language_preference);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      await updateUserProfile({
        full_name: fullName,
        preferred_voice_speed: voiceSpeed,
        voice_feedback_enabled: voiceFeedback,
        high_contrast_mode: highContrast,
        screen_reader_mode: screenReader,
        language_preference: language,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save profile:', error);
    } finally {
      setSaving(false);
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Profile Settings</h1>
        <p className="text-slate-400">Manage your account and accessibility preferences</p>
      </div>

      {/* Profile Card */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500/30 to-accent-500/30 border border-primary-500/30 flex items-center justify-center">
              <User className="w-10 h-10 text-primary-400" />
            </div>
          </div>
          <div>
            <p className="font-semibold text-lg text-white">
              {fullName || 'Learner'}
            </p>
            <p className="text-slate-400 flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4" />
              {user?.email}
            </p>
            <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4" />
              Joined {userProfile ? new Date(userProfile.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </div>

        {/* Saved Notification */}
        {saved && (
          <div className="mb-4 p-3 bg-success-500/10 border border-success-500/30 rounded-xl flex items-center gap-2 text-success-400">
            <CheckCircle className="w-5 h-5" />
            Settings saved successfully
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="label-text">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-field max-w-md"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="label-text">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="input-field max-w-md"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
              <option value="bn">Bengali</option>
              <option value="mr">Marathi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Voice Settings */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary-500/20 border border-primary-500/30 flex items-center justify-center">
            <Volume2 className="w-5 h-5 text-primary-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Voice Settings</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="label-text">Voice Speed</label>
            <div className="flex items-center gap-4 max-w-md">
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={voiceSpeed}
                onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                className="flex-1 h-2 bg-slate-800 rounded-full appearance-none cursor-pointer accent-primary-500"
              />
              <span className="text-slate-400 text-sm w-12">{voiceSpeed.toFixed(1)}x</span>
            </div>
            <p className="text-slate-500 text-sm mt-1">Adjust the speed of voice feedback</p>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white">Voice Feedback</p>
              <p className="text-slate-400 text-sm">Enable spoken instructions during missions</p>
            </div>
            <button
              onClick={() => setVoiceFeedback(!voiceFeedback)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                voiceFeedback ? 'bg-primary-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                  voiceFeedback ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Accessibility Settings */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-accent-500/20 border border-accent-500/30 flex items-center justify-center">
            <Accessibility className="w-5 h-5 text-accent-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Accessibility</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white">High Contrast Mode</p>
              <p className="text-slate-400 text-sm">Increase visual clarity with higher contrast</p>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                highContrast ? 'bg-primary-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                  highContrast ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="font-medium text-white">Screen Reader Compatibility</p>
              <p className="text-slate-400 text-sm">Optimize for screen reader navigation</p>
            </div>
            <button
              onClick={() => setScreenReader(!screenReader)}
              className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                screenReader ? 'bg-primary-500' : 'bg-slate-700'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                  screenReader ? 'left-7' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-success-500/20 border border-success-500/30 flex items-center justify-center">
            <Settings className="w-5 h-5 text-success-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Learning Stats</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <p className="text-2xl font-bold bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
              {userProfile?.total_xp || 0}
            </p>
            <p className="text-slate-400 text-sm mt-1">Total XP</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <p className="text-2xl font-bold text-white">
              {userProfile?.current_streak || 0}
            </p>
            <p className="text-slate-400 text-sm mt-1">Current Streak</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <p className="text-2xl font-bold text-white">
              {userProfile?.longest_streak || 0}
            </p>
            <p className="text-slate-400 text-sm mt-1">Longest Streak</p>
          </div>
          <div className="text-center p-4 bg-slate-800/50 rounded-xl">
            <p className="text-sm text-slate-500">Last Active</p>
            <p className="text font-medium text-white mt-1">
              {userProfile?.last_activity
                ? new Date(userProfile.last_activity).toLocaleDateString()
                : 'Today'}
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-primary flex items-center gap-2"
      >
        {saving ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="w-5 h-5" />
            Save Changes
          </>
        )}
      </button>
    </div>
  );
}
