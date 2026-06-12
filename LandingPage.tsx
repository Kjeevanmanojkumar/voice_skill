# VoiceSkill - Voice-Controlled Vocational Learning Platform

**Smart India Hackathon 2024 - Problem Statement 1779**

A comprehensive voice-controlled learning platform where learners acquire vocational skills through interactive game-based simulations.

## Features

### Voice-Controlled Learning Arena
- Speech recognition for hands-free navigation
- Voice commands for mission interaction
- Voice feedback and audio instructions
- Accessibility-first design

### Vocational Skill Simulations
Four skill tracks with interactive missions:

1. **Electrical Technician** - Electrical installation, maintenance, and troubleshooting
2. **Healthcare Assistant** - Patient care, vital signs monitoring, medical procedures
3. **Carpentry & Woodwork** - Woodworking techniques, furniture making, construction
4. **Computer Hardware Technician** - PC assembly, troubleshooting, hardware maintenance

### Learning Features
- Scenario-based interactive missions
- Step-by-step voice-guided instructions
- Real-world problem solving simulations
- Safety protocols and best practices

### Gamification
- Experience points (XP) system
- Mission completion tracking
- Skill mastery levels
- Learning streaks

### Certification
- Competency-based assessments
- Downloadable certificates (PDF)
- Skill verification codes
- Multiple competency levels (Competent, Proficient, Expert)

### Accessibility
- Voice-only navigation mode
- Screen reader compatibility
- High contrast mode
- Adjustable voice speed
- Multiple language support (English, Hindi, Tamil, Telugu, Bengali, Marathi)

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend/Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Voice**: Web Speech API (Speech Recognition & Synthesis)
- **PDF Generation**: jsPDF
- **Routing**: React Router v6

## Database Schema

### Tables
- `skills` - Vocational skill categories
- `missions` - Learning tasks for each skill
- `assessments` - Certification tests
- `user_progress` - Per-skill progress tracking
- `mission_attempts` - Individual mission attempts
- `assessment_attempts` - Assessment attempt history
- `certificates` - Issued certificates
- `voice_sessions` - Voice interaction logs
- `learning_paths` - AI-generated personalized paths
- `user_profiles` - Extended user profile with accessibility settings

### Row-Level Security (RLS)
All tables have RLS enabled with policies ensuring users can only access their own data.

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Install dependencies
npm install

# Create .env file with your Supabase credentials
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Run development server
npm run dev

# Build for production
npm run build
```

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Or build manually
docker build -t voiceskill .
docker run -p 3000:80 voiceskill
```

## Project Structure

```
src/
├── components/
│   └── Layout.tsx          # Main layout wrapper
├── contexts/
│   └── AuthContext.tsx     # Authentication context
├── hooks/
│   ├── useVoiceRecognition.ts  # Speech recognition hook
│   └── useSpeechSynthesis.ts   # Text-to-speech hook
├── lib/
│   └── supabase.ts         # Supabase client and types
├── pages/
│   ├── LandingPage.tsx    # Public landing page
│   ├── LoginPage.tsx      # Authentication
│   ├── RegisterPage.tsx   # User registration
│   ├── DashboardPage.tsx  # Main dashboard
│   ├── SkillsPage.tsx     # Skill catalog
│   ├── SkillDetailPage.tsx # Individual skill
│   ├── VoiceArenaPage.tsx  # Voice command center
│   ├── MissionPage.tsx    # Interactive mission
│   ├── MissionsPage.tsx   # Mission list
│   ├── AssessmentPage.tsx # Assessment taking
│   ├── AssessmentsPage.tsx # Assessment catalog
│   ├── ProgressPage.tsx   # Progress dashboard
│   ├── CertificatesPage.tsx # Certificate list
│   ├── ProfilePage.tsx    # User settings
│   └── AdminDashboardPage.tsx # Admin panel
├── services/
│   ├── api.ts             # API functions
│   └── ai.ts              # AI personalization
├── App.tsx                # Main app component
└── main.tsx               # Entry point
```

## Voice Commands

### Navigation Commands
- "Go to skills" - Navigate to skills page
- "Go to missions" - Navigate to mission center
- "Go to assessments" - Navigate to assessments
- "Go to progress" - View progress dashboard
- "Go to certificates" - View certificates
- "Go home" - Return to dashboard

### Mission Commands
- "Done" / "Complete" / "Next" - Complete current step
- "Repeat" / "Again" - Repeat last instruction
- "Back" / "Previous" - Go to previous step
- "Help" - Show available commands

## API Reference

All API functions are in `src/services/api.ts`:

- `getSkills()` - Get all vocational skills
- `getMissions(skillId)` - Get missions for a skill
- `getUserProgress(skillId)` - Get user progress
- `createMissionAttempt(missionId)` - Start a mission attempt
- `completeMissionAttempt()` - Submit mission results
- `createAssessmentAttempt()` - Submit assessment
- `getCertificates()` - Get user certificates

## AI Personalization

The platform includes AI-powered personalization (`src/services/ai.ts`):

- Analyzes user performance across missions
- Identifies weak areas and strengths
- Generates personalized learning paths
- Recommends appropriate difficulty levels
- Provides motivational feedback

## Browser Support

Voice recognition requires:
- Chrome 33+
- Edge 79+
- Safari 14.1+ (partial support)
- Opera 20+

## License

This project is developed for Smart India Hackathon 2024.

## Problem Statement Reference

**Problem Statement 1779**: Voice-Controlled Gaming Tools for Enhanced Learning in the Skill Ecosystem

The platform addresses the need for accessible, hands-free vocational training tools that use voice-controlled gaming approaches to enhance skill acquisition in the vocational education ecosystem.
