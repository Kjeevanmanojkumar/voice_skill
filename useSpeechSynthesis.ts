import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Home,
  GraduationCap,
  Target,
  ClipboardCheck,
  BarChart3,
  Award,
  User,
  LogOut,
  Mic,
  Sparkles,
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/skills', label: 'Skills', icon: GraduationCap },
    { path: '/missions', label: 'Missions', icon: Target },
    { path: '/assessments', label: 'Assessments', icon: ClipboardCheck },
    { path: '/progress', label: 'Progress', icon: BarChart3 },
    { path: '/certificates', label: 'Certificates', icon: Award },
    { path: '/voice-arena', label: 'Voice Arena', icon: Mic },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-400/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/70 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
                  <Mic className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity" />
              </div>
              <span className="font-display font-bold text-xl bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                VoiceSkill
              </span>
            </Link>

            {/* Desktop Navigation */}
            {user && (
              <nav className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-xl bg-slate-800/50 backdrop-blur-sm border border-white/5">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.path)
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            )}

            {/* Right section */}
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive('/profile')
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/30 to-accent-500/30 flex items-center justify-center">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="hidden md:inline">{profile?.full_name || 'Profile'}</span>
                  </Link>
                  <button
                    onClick={signOut}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
                    title="Sign out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="btn-ghost"
                  >
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary text-sm">
                    <Sparkles className="w-4 h-4 mr-1" />
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {user && (
        <nav className="lg:hidden sticky top-16 z-40 backdrop-blur-xl bg-slate-900/70 border-b border-white/5 px-4 py-2">
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Main content */}
      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative mt-auto border-t border-white/5 backdrop-blur-sm bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <Mic className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-slate-400">
                VoiceSkill - Voice-Controlled Vocational Learning
              </span>
            </div>
            <p className="text-sm text-slate-500">
              Smart India Hackathon 2024 - PS 1779
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
