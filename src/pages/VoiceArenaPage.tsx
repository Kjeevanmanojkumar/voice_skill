import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  HelpCircle,
  ArrowRight,
  CheckCircle,
  XCircle,
  Home,
  Target,
  Award,
  Settings,
  Sparkles,
} from 'lucide-react';

const voiceCommands = [
  { command: 'go to skills', action: '/skills', description: 'Navigate to Skills page' },
  { command: 'go to missions', action: '/missions', description: 'Navigate to Mission Center' },
  { command: 'go to assessments', action: '/assessments', description: 'Navigate to Assessments' },
  { command: 'go to progress', action: '/progress', description: 'Navigate to Progress page' },
  { command: 'go to certificates', action: '/certificates', description: 'Navigate to Certificates' },
  { command: 'go to profile', action: '/profile', description: 'Navigate to Profile' },
  { command: 'go home', action: '/dashboard', description: 'Go to Dashboard' },
  { command: 'start learning', action: 'start', description: 'Start selected learning module' },
  { command: 'next', action: 'next', description: 'Go to next item' },
  { command: 'back', action: 'back', description: 'Go back' },
  { command: 'help', action: 'help', description: 'Show voice commands help' },
  { command: 'repeat', action: 'repeat', description: 'Repeat last instruction' },
];

const quickActions = [
  { label: 'Electrical Training', path: '/skills', icon: Target, gradient: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30', iconColor: 'text-amber-400' },
  { label: 'Healthcare Training', path: '/skills', icon: Award, gradient: 'from-rose-500/20 to-pink-500/20', border: 'border-rose-500/30', iconColor: 'text-rose-400' },
  { label: 'Carpentry Training', path: '/skills', icon: Settings, gradient: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30', iconColor: 'text-emerald-400' },
  { label: 'Computer Hardware', path: '/skills', icon: Home, gradient: 'from-sky-500/20 to-blue-500/20', border: 'border-sky-500/30', iconColor: 'text-sky-400' },
];

export function VoiceArenaPage() {
  const [feedback, setFeedback] = useState<string>('');
  const [lastSpoken, setLastSpoken] = useState<string>('');
  const [commandHistory, setCommandHistory] = useState<{ text: string; success: boolean }[]>([]);
  const [showHelp, setShowHelp] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const handleVoiceResult = useCallback((transcript: string, confidence: number) => {
    const normalizedTranscript = transcript.toLowerCase().trim();

    setCommandHistory((prev) => [
      { text: transcript, success: confidence > 0.5 },
      ...prev.slice(0, 9),
    ]);

    const matchedCommand = voiceCommands.find((cmd) =>
      normalizedTranscript.includes(cmd.command.toLowerCase())
    );

    if (matchedCommand) {
      setFeedback(`Command recognized: ${matchedCommand.description}`);
      speakText(matchedCommand.description);
    } else {
      setFeedback(`Voice input: "${transcript}"`);
    }
  }, []);

  const {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
  } = useVoiceRecognition({
    onResult: handleVoiceResult,
    continuous: true,
  });

  const { speak, isSpeaking, cancel, isSupported: speechSupported } = useSpeechSynthesis();

  function speakText(text: string) {
    if (voiceEnabled && speechSupported) {
      setLastSpoken(text);
      speak(text);
    }
  }

  useEffect(() => {
    if (error) {
      speakText(error);
    }
  }, [error]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
      speakText('Voice recognition stopped');
    } else {
      startListening();
      speakText('Listening. Speak a command.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">Voice Learning Arena</h1>
        <p className="text-slate-400">
          Navigate and interact with the platform using voice commands
        </p>
      </div>

      {/* Main Voice Control */}
      <div className="glass-card text-center p-8">
        {/* Mic Button */}
        <div className="mb-6">
          <button
            onClick={toggleListening}
            className={`relative w-36 h-36 rounded-full flex items-center justify-center mx-auto transition-all duration-500 group ${
              isListening
                ? 'bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 shadow-glow-lg scale-110'
                : 'bg-slate-800/50 border-2 border-slate-700/50 hover:border-primary-500/50'
            }`}
          >
            {isListening && (
              <>
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 animate-ping opacity-30" />
                <div className="absolute inset-4 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 animate-pulse" />
              </>
            )}
            <div className="relative z-10">
              {isListening ? (
                <Mic className="w-16 h-16 text-white animate-pulse" />
              ) : (
                <MicOff className="w-16 h-16 text-slate-500 group-hover:text-primary-400 transition-colors" />
              )}
            </div>
          </button>
        </div>

        {/* Status */}
        {isListening && (
          <div className="mb-4">
            <p className="text-primary-400 font-medium animate-pulse">Listening...</p>
            {interimTranscript && (
              <p className="text-slate-400 text-sm mt-1 italic">"{interimTranscript}"</p>
            )}
          </div>
        )}

        {/* Transcript */}
        {transcript && (
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 mb-4">
            <p className="text-white">Recognized: "{transcript}"</p>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="bg-primary-500/10 border border-primary-500/30 rounded-xl p-4 mb-4">
            <p className="text-primary-400">{feedback}</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center gap-2 text-primary-400 font-medium hover:text-primary-300 transition-colors px-4 py-2 rounded-lg hover:bg-primary-500/10"
          >
            <HelpCircle className="w-5 h-5" />
            Voice Commands
          </button>
          <button
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className={`flex items-center gap-2 font-medium px-4 py-2 rounded-lg transition-all ${
              voiceEnabled
                ? 'text-primary-400 hover:bg-primary-500/10'
                : 'text-slate-500 hover:bg-slate-800/50'
            }`}
          >
            {voiceEnabled ? (
              <>
                <Volume2 className="w-5 h-5" />
                Voice On
              </>
            ) : (
              <>
                <VolumeX className="w-5 h-5" />
                Voice Off
              </>
            )}
          </button>
        </div>

        {/* Browser Support Warning */}
        {!isSupported && (
          <div className="mt-4 p-4 bg-warning-500/10 border border-warning-500/30 rounded-xl text-warning-400 text-sm">
            Voice recognition is not supported in this browser. Please use Chrome or Edge.
          </div>
        )}
      </div>

      {/* Help Panel */}
      {showHelp && (
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Available Voice Commands</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {voiceCommands.map((cmd, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50"
              >
                <div>
                  <code className="text-primary-400 text-sm">"{cmd.command}"</code>
                  <p className="text-slate-400 text-xs mt-1">{cmd.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions & History */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {quickActions.map((action, idx) => (
              <Link
                key={idx}
                to={action.path}
                className={`flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r ${action.gradient} border ${action.border} hover:border-opacity-60 transition-all group`}
              >
                <div className={`w-10 h-10 rounded-lg bg-slate-800/50 flex items-center justify-center`}>
                  <action.icon className={`w-5 h-5 ${action.iconColor}`} />
                </div>
                <span className="font-medium text-white">{action.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
              </Link>
            ))}
          </div>
        </div>

        {/* Command History */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Command History</h2>
          {commandHistory.length === 0 ? (
            <p className="text-slate-400 text-center py-8">
              No commands yet. Start speaking to see your history.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {commandHistory.map((cmd, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2 bg-slate-800/50 rounded-lg"
                >
                  {cmd.success ? (
                    <CheckCircle className="w-4 h-4 text-success-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                  <span className="text-slate-300 text-sm">{cmd.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div className="glass-card p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Voice Training Tips</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-primary-500/10 border border-primary-500/20 rounded-xl">
            <h3 className="font-medium text-primary-400 mb-2">Speak Clearly</h3>
            <p className="text-sm text-slate-400">
              Articulate words clearly and at a moderate pace for better recognition.
            </p>
          </div>
          <div className="p-4 bg-success-500/10 border border-success-500/20 rounded-xl">
            <h3 className="font-medium text-success-400 mb-2">Quiet Environment</h3>
            <p className="text-sm text-slate-400">
              Use voice commands in a quiet space for optimal accuracy.
            </p>
          </div>
          <div className="p-4 bg-accent-500/10 border border-accent-500/20 rounded-xl">
            <h3 className="font-medium text-accent-400 mb-2">Use Commands</h3>
            <p className="text-sm text-slate-400">
              Say "help" anytime to hear available voice commands.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
