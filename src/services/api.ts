import { supabase } from '../lib/supabase';
import type {
  Skill,
  Mission,
  Assessment,
  UserProgress,
  MissionAttempt,
  Certificate,
  VoiceSession,
  LearningPath,
  UserProfile,
} from '../lib/supabase';

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getSkill(skillId: string): Promise<Skill | null> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('id', skillId)
    .single();

  if (error) return null;
  return data;
}

export async function getMissions(skillId: string): Promise<Mission[]> {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('skill_id', skillId)
    .eq('is_active', true)
    .order('order_index');

  if (error) throw error;
  return data || [];
}

export async function getMission(missionId: string): Promise<Mission | null> {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('id', missionId)
    .single();

  if (error) return null;
  return data;
}

export async function getAssessments(skillId: string): Promise<Assessment[]> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('skill_id', skillId)
    .eq('is_active', true);

  if (error) throw error;
  return data || [];
}

export async function getAssessment(assessmentId: string): Promise<Assessment | null> {
  const { data, error } = await supabase
    .from('assessments')
    .select('*')
    .eq('id', assessmentId)
    .single();

  if (error) return null;
  return data;
}

export async function getUserProgress(skillId: string): Promise<UserProgress | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('skill_id', skillId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getAllUserProgress(): Promise<UserProgress[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id);

  if (error) throw error;
  return data || [];
}

export async function initializeUserProgress(skillId: string): Promise<UserProgress> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_progress')
    .insert({
      user_id: user.id,
      skill_id: skillId,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProgress(
  skillId: string,
  updates: Partial<UserProgress>
): Promise<UserProgress> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_progress')
    .update(updates)
    .eq('user_id', user.id)
    .eq('skill_id', skillId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMissionAttempts(missionId: string): Promise<MissionAttempt[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('mission_attempts')
    .select('*')
    .eq('user_id', user.id)
    .eq('mission_id', missionId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function createMissionAttempt(
  missionId: string
): Promise<MissionAttempt> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('mission_attempts')
    .insert({
      user_id: user.id,
      mission_id: missionId,
      status: 'started',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function completeMissionAttempt(
  attemptId: string,
  updates: {
    status: 'completed' | 'failed' | 'abandoned';
    score: number;
    voice_commands_used: number;
    correct_commands: number;
    time_taken_seconds: number;
    feedback?: string;
  }
): Promise<MissionAttempt> {
  const { data, error } = await supabase
    .from('mission_attempts')
    .update({
      ...updates,
      completed_at: new Date().toISOString(),
    })
    .eq('id', attemptId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCertificates(): Promise<(Certificate & { skill: Skill })[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('certificates')
    .select('*, skill:skills(*)')
    .eq('user_id', user.id)
    .eq('is_valid', true)
    .order('issued_at', { ascending: false });

  if (error) throw error;
  return (data || []) as (Certificate & { skill: Skill })[];
}

export async function createCertificate(
  skillId: string,
  competencyLevel: string,
  score: number
): Promise<Certificate> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const certificateNumber = `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  const verificationCode = Math.random().toString(36).substr(2, 12).toUpperCase();

  const { data, error } = await supabase
    .from('certificates')
    .insert({
      user_id: user.id,
      skill_id: skillId,
      certificate_number: certificateNumber,
      competency_level: competencyLevel,
      score_achieved: score,
      verification_code: verificationCode,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createVoiceSession(
  missionId: string | null,
  sessionType: VoiceSession['session_type']
): Promise<{ id: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('voice_sessions')
    .insert({
      user_id: user.id,
      mission_id: missionId,
      session_type: sessionType,
    })
    .select('id')
    .single();

  if (error) throw error;
  return data;
}

export async function updateVoiceSession(
  sessionId: string,
  updates: Partial<VoiceSession>
): Promise<void> {
  const { error } = await supabase
    .from('voice_sessions')
    .update(updates)
    .eq('id', sessionId);

  if (error) throw error;
}

export async function getLearningPath(skillId: string): Promise<LearningPath | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('user_id', user.id)
    .eq('skill_id', skillId)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function getUserProfile(): Promise<UserProfile | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createAssessmentAttempt(
  assessmentId: string,
  answers: Record<string, number>,
  score: number,
  passed: boolean,
  timeTaken: number
): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('assessment_attempts')
    .insert({
      user_id: user.id,
      assessment_id: assessmentId,
      answers,
      score,
      passed,
      time_taken_seconds: timeTaken,
      completed_at: new Date().toISOString(),
    });

  if (error) throw error;
}
