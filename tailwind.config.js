import { supabase } from '../lib/supabase';
import type { Mission, UserProgress, LearningPath } from '../lib/supabase';

interface AIAnalysis {
  weakAreas: string[];
  strengths: string[];
  recommendedMissions: string[];
  recommendedDifficulty: number;
  personalizedMessage: string;
}

export async function generateLearningPath(
  skillId: string,
  missions: Mission[],
  progress: UserProgress | null
): Promise<LearningPath | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const existingPath = await getExistingLearningPath(skillId);
  if (existingPath) return existingPath;

  const analysis = analyzePerformance(missions, progress);

  const { data, error } = await supabase
    .from('learning_paths')
    .insert({
      user_id: user.id,
      skill_id: skillId,
      recommended_missions: analysis.recommendedMissions,
      weak_areas: analysis.weakAreas,
      strengths: analysis.strengths,
      recommended_difficulty: analysis.recommendedDifficulty,
      ai_recommendations: { message: analysis.personalizedMessage },
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getExistingLearningPath(skillId: string): Promise<LearningPath | null> {
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

export function analyzePerformance(
  missions: Mission[],
  progress: UserProgress | null
): AIAnalysis {
  if (!progress || progress.missions_completed === 0) {
    return {
      weakAreas: [],
      strengths: [],
      recommendedMissions: missions.slice(0, 3).map((m) => m.id),
      recommendedDifficulty: 1,
      personalizedMessage: 'Welcome! Start with beginner missions to build your foundation in this skill.',
    };
  }

  const completionRate = progress.missions_completed / missions.length;
  const mastery = progress.mastery_percentage;

  const weakAreas: string[] = [];
  const strengths: string[] = [];

  if (mastery < 30) {
    weakAreas.push('Foundation concepts');
    weakAreas.push('Basic procedures');
  } else if (mastery < 60) {
    weakAreas.push('Intermediate techniques');
    strengths.push('Basic concepts');
  } else if (mastery < 80) {
    weakAreas.push('Advanced troubleshooting');
    strengths.push('Core procedures');
    strengths.push('Safety protocols');
  } else {
    strengths.push('Comprehensive skill mastery');
    strengths.push('Problem-solving');
    strengths.push('Procedure execution');
  }

  let recommendedDifficulty = 2;
  if (mastery < 40) recommendedDifficulty = 1;
  else if (mastery < 60) recommendedDifficulty = 2;
  else if (mastery < 80) recommendedDifficulty = 3;
  else recommendedDifficulty = 4;

  const incompleteMissions = missions.filter((_, idx) => idx >= progress.missions_completed);

  const recommendedMissions = incompleteMissions
    .filter((m) => m.difficulty <= recommendedDifficulty)
    .slice(0, 3)
    .map((m) => m.id);

  let personalizedMessage = '';
  if (mastery < 30) {
    personalizedMessage = "You're just getting started. Focus on understanding the basics and completing beginner missions. Consistency is key!";
  } else if (mastery < 60) {
    personalizedMessage = "Good progress! You've mastered the basics. Now focus on intermediate missions to strengthen your skills.";
  } else if (mastery < 80) {
    personalizedMessage = "You're doing great! Continue with advanced missions to deepen your expertise and prepare for certification.";
  } else {
    personalizedMessage = "Excellent work! You're nearing mastery. Consider taking the assessment to earn your certificate.";
  }

  return {
    weakAreas,
    strengths,
    recommendedMissions,
    recommendedDifficulty,
    personalizedMessage,
  };
}

export async function getPersonalizedRecommendations(
  skillId: string
): Promise<AIAnalysis | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: missions } = await supabase
    .from('missions')
    .select('*')
    .eq('skill_id', skillId)
    .eq('is_active', true)
    .order('order_index');

  const { data: progress } = await supabase
    .from('user_progress')
    .select('*')
    .eq('user_id', user.id)
    .eq('skill_id', skillId)
    .single();

  return analyzePerformance(missions || [], progress);
}
