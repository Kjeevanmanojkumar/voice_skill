import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Mic,
  Zap,
  Heart,
  Hammer,
  Cpu,
  ArrowRight,
  Play,
  Award,
  Target,
  BarChart3,
  Accessibility,
  Sparkles,
  Headphones,
  Shield,
} from 'lucide-react';

const skillIcons = {
  electrical: Zap,
  healthcare: Heart,
  carpentry: Hammer,
  computer_hardware: Cpu,
};

const features = [
  {
    icon: Mic,
    title: 'Voice-Controlled Learning',
    description: 'Navigate and interact entirely through voice commands for hands-free learning.',
    color: 'from-primary-500 to-primary-600',
  },
  {
    icon: Target,
    title: 'Interactive Missions',
    description: 'Complete scenario-based tasks that simulate real-world vocational challenges.',
    color: 'from-accent-500 to-accent-600',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Monitor your skill development with detailed analytics and performance metrics.',
    color: 'from-success-500 to-success-600',
  },
  {
    icon: Award,
    title: 'Industry Certificates',
    description: 'Earn verified certificates upon demonstrating competency in vocational skills.',
    color: 'from-warning-500 to-warning-600',
  },
];

export function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-400/5 rounded-full blur-3xl" />

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-slate-900/50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow">
                  <Mic className="w-5 h-5 text-white" />
                </div>
              </div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                VoiceSkill
              </span>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <Link to="/dashboard" className="btn-primary text-sm">
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-ghost text-sm">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8 animate-fade-in">
              <Accessibility className="w-4 h-4" />
              Accessible Vocational Training Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold mb-6 animate-slide-up">
              <span className="text-white">Learn Vocational Skills</span>
              <br />
              <span className="bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500 bg-clip-text text-transparent">
                With Your Voice
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              Master electrical, healthcare, carpentry, and computer hardware skills through
              interactive voice-controlled simulations designed for the skill ecosystem.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              {user ? (
                <Link to="/skills" className="btn-primary text-lg px-8 py-4">
                  Start Learning
                  <ArrowRight className="w-5 h-5 ml-2 inline" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-4">
                    <Sparkles className="w-5 h-5 mr-2 inline" />
                    Start Free
                  </Link>
                  <Link to="/login" className="btn-secondary text-lg px-8 py-4">
                    Sign In
                  </Link>
                </>
              )}
            </div>

            {/* Floating elements */}
            <div className="absolute top-20 left-10 hidden lg:block animate-float">
              <div className="glass-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-success-500/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-success-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">32+</p>
                    <p className="text-slate-400 text-sm">Missions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-32 right-10 hidden lg:block animate-float" style={{ animationDelay: '-2s' }}>
              <div className="glass-card p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center">
                    <Mic className="w-5 h-5 text-primary-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-white font-semibold">100%</p>
                    <p className="text-slate-400 text-sm">Voice-Controlled</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              Vocational Skills Training
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Choose from four comprehensive skill tracks designed for hands-free, voice-controlled learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                category: 'electrical',
                title: 'Electrical Technician',
                description: 'Learn electrical installation, maintenance, and troubleshooting',
                missions: 8,
                hours: 40,
                gradient: 'from-amber-500/20 to-orange-500/20',
                border: 'border-amber-500/30',
                iconColor: 'text-amber-400',
              },
              {
                category: 'healthcare',
                title: 'Healthcare Assistant',
                description: 'Develop patient care and basic medical procedure skills',
                missions: 8,
                hours: 50,
                gradient: 'from-rose-500/20 to-pink-500/20',
                border: 'border-rose-500/30',
                iconColor: 'text-rose-400',
              },
              {
                category: 'carpentry',
                title: 'Carpentry & Woodwork',
                description: 'Master carpentry techniques and furniture making',
                missions: 8,
                hours: 35,
                gradient: 'from-emerald-500/20 to-teal-500/20',
                border: 'border-emerald-500/30',
                iconColor: 'text-emerald-400',
              },
              {
                category: 'computer_hardware',
                title: 'Computer Hardware',
                description: 'Learn PC assembly and hardware troubleshooting',
                missions: 8,
                hours: 45,
                gradient: 'from-sky-500/20 to-blue-500/20',
                border: 'border-sky-500/30',
                iconColor: 'text-sky-400',
              },
            ].map((skill) => {
              const Icon = skillIcons[skill.category as keyof typeof skillIcons];
              return (
                <div
                  key={skill.category}
                  className={`group relative glass-card hover:shadow-glow transition-all duration-300`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${skill.gradient} border ${skill.border} flex items-center justify-center mb-4`}>
                      <Icon className={`w-7 h-7 ${skill.iconColor}`} />
                    </div>
                    <h3 className="font-semibold text-lg text-white mb-2">{skill.title}</h3>
                    <p className="text-slate-400 text-sm mb-4">{skill.description}</p>
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>{skill.missions} missions</span>
                      <span>{skill.hours} hours</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              Interactive, voice-controlled learning designed for effective skill acquisition
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="glass-card text-center group hover:shadow-glow transition-all duration-300">
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative glass-card p-10 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 via-accent-500/20 to-primary-500/20 rounded-2xl" />
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-6 shadow-glow-lg animate-pulse">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white mb-4">
                Start Your Learning Journey Today
              </h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Join learners building practical skills for the vocational workforce with voice-controlled interactive training
              </p>
              <Link
                to={user ? '/skills' : '/register'}
                className="btn-primary text-lg px-10 py-4 inline-flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust indicators */}
      <section className="relative py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="glass-card p-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-success-400" />
              <span className="text-slate-300 text-sm">Secure & Private</span>
            </div>
            <div className="glass-card p-4 flex items-center gap-3">
              <Headphones className="w-6 h-6 text-primary-400" />
              <span className="text-slate-300 text-sm">Voice-First Design</span>
            </div>
            <div className="glass-card p-4 flex items-center gap-3">
              <Accessibility className="w-6 h-6 text-accent-400" />
              <span className="text-slate-300 text-sm">Accessible to All</span>
            </div>
            <div className="glass-card p-4 flex items-center gap-3">
              <Award className="w-6 h-6 text-warning-400" />
              <span className="text-slate-300 text-sm">Verified Certificates</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 backdrop-blur-sm bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Mic className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-slate-400">
                VoiceSkill - Voice-Controlled Vocational Learning Platform
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Smart India Hackathon 2024 - Problem Statement 1779
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
