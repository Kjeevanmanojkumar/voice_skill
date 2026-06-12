-- Skills table: Vocational skill categories
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('electrical', 'healthcare', 'carpentry', 'computer_hardware')),
  icon TEXT NOT NULL,
  difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  total_missions INTEGER DEFAULT 0,
  estimated_hours INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Missions table: Learning tasks for each skill
CREATE TABLE missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  scenario TEXT NOT NULL,
  voice_instructions JSONB NOT NULL DEFAULT '[]',
  steps JSONB NOT NULL DEFAULT '[]',
  materials JSONB DEFAULT '[]',
  safety_notes TEXT[],
  difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  duration_minutes INTEGER DEFAULT 15,
  points INTEGER DEFAULT 100,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress tracking
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,
  missions_completed INTEGER DEFAULT 0,
  assessments_passed INTEGER DEFAULT 0,
  current_level INTEGER DEFAULT 1,
  mastery_percentage DECIMAL(5,2) DEFAULT 0,
  time_spent_minutes INTEGER DEFAULT 0,
  last_accessed TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- Mission attempts
CREATE TABLE mission_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('started', 'completed', 'failed', 'abandoned')),
  score INTEGER DEFAULT 0,
  voice_commands_used INTEGER DEFAULT 0,
  correct_commands INTEGER DEFAULT 0,
  time_taken_seconds INTEGER DEFAULT 0,
  feedback TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessments table
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  questions JSONB NOT NULL DEFAULT '[]',
  passing_score INTEGER DEFAULT 70,
  time_limit_minutes INTEGER DEFAULT 30,
  max_attempts INTEGER DEFAULT 3,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assessment attempts
CREATE TABLE assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  answers JSONB NOT NULL DEFAULT '{}',
  score INTEGER DEFAULT 0,
  passed BOOLEAN DEFAULT false,
  time_taken_seconds INTEGER DEFAULT 0,
  attempted_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Certificates table
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  certificate_number TEXT UNIQUE NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT NOW(),
  competency_level TEXT NOT NULL,
  score_achieved INTEGER NOT NULL,
  verification_code TEXT NOT NULL,
  is_valid BOOLEAN DEFAULT true
);

-- Voice sessions table for tracking voice interactions
CREATE TABLE voice_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mission_id UUID REFERENCES missions(id) ON DELETE SET NULL,
  session_type TEXT CHECK (session_type IN ('navigation', 'mission', 'assessment', 'training')),
  commands JSONB DEFAULT '[]',
  total_commands INTEGER DEFAULT 0,
  successful_commands INTEGER DEFAULT 0,
  average_confidence DECIMAL(5,2) DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  device_info JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ
);

-- Learning paths (AI-generated personalized paths)
CREATE TABLE learning_paths (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES skills(id) ON DELETE CASCADE,
  recommended_missions UUID[] DEFAULT '{}',
  weak_areas TEXT[] DEFAULT '{}',
  strengths TEXT[] DEFAULT '{}',
  recommended_difficulty INTEGER DEFAULT 1,
  ai_recommendations JSONB DEFAULT '{}',
  generated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, skill_id)
);

-- User profiles extended
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  preferred_voice_speed DECIMAL(2,1) DEFAULT 1.0,
  voice_feedback_enabled BOOLEAN DEFAULT true,
  high_contrast_mode BOOLEAN DEFAULT false,
  screen_reader_mode BOOLEAN DEFAULT false,
  language_preference TEXT DEFAULT 'en',
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_paths ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for skills (read-only for authenticated users)
CREATE POLICY "skills_select" ON skills FOR SELECT TO authenticated USING (true);

-- RLS Policies for missions (read-only for authenticated users)
CREATE POLICY "missions_select" ON missions FOR SELECT TO authenticated USING (true);

-- RLS Policies for user_progress
CREATE POLICY "user_progress_select" ON user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_progress_insert" ON user_progress FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_progress_update" ON user_progress FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for mission_attempts
CREATE POLICY "mission_attempts_select" ON mission_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "mission_attempts_insert" ON mission_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "mission_attempts_update" ON mission_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for assessments (read-only for authenticated users)
CREATE POLICY "assessments_select" ON assessments FOR SELECT TO authenticated USING (true);

-- RLS Policies for assessment_attempts
CREATE POLICY "assessment_attempts_select" ON assessment_attempts FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "assessment_attempts_insert" ON assessment_attempts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "assessment_attempts_update" ON assessment_attempts FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for certificates
CREATE POLICY "certificates_select" ON certificates FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "certificates_insert" ON certificates FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- RLS Policies for voice_sessions
CREATE POLICY "voice_sessions_select" ON voice_sessions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "voice_sessions_insert" ON voice_sessions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "voice_sessions_update" ON voice_sessions FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for learning_paths
CREATE POLICY "learning_paths_select" ON learning_paths FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "learning_paths_insert" ON learning_paths FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "learning_paths_update" ON learning_paths FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_profiles
CREATE POLICY "user_profiles_select" ON user_profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "user_profiles_insert" ON user_profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_profiles_update" ON user_profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_missions_skill_id ON missions(skill_id);
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_skill_id ON user_progress(skill_id);
CREATE INDEX idx_mission_attempts_user_id ON mission_attempts(user_id);
CREATE INDEX idx_mission_attempts_mission_id ON mission_attempts(mission_id);
CREATE INDEX idx_assessment_attempts_user_id ON assessment_attempts(user_id);
CREATE INDEX idx_certificates_user_id ON certificates(user_id);
CREATE INDEX idx_voice_sessions_user_id ON voice_sessions(user_id);
CREATE INDEX idx_learning_paths_user_id ON learning_paths(user_id);
CREATE INDEX idx_user_profiles_user_id ON user_profiles(user_id);