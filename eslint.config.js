@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply antialiased bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 min-h-screen;
  }

  * {
    @apply border-slate-700/50;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    @apply bg-slate-800/50 rounded-full;
  }

  ::-webkit-scrollbar-thumb {
    @apply bg-slate-600/50 rounded-full hover:bg-slate-500/50 transition-colors;
  }
}

@layer components {
  .glass {
    @apply bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl;
  }

  .glass-card {
    @apply glass hover:bg-white/10 transition-all duration-300 hover:shadow-glow;
  }

  .glass-button {
    @apply glass hover:bg-white/15 active:scale-95 transition-all duration-200;
  }

  .btn-primary {
    @apply relative overflow-hidden bg-gradient-to-r from-primary-500 to-primary-600
           hover:from-primary-400 hover:to-primary-500
           text-white font-semibold py-2.5 px-6 rounded-xl
           transition-all duration-300
           shadow-lg hover:shadow-glow
           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
           before:absolute before:inset-0 before:bg-white/20 before:translate-x-[-100%]
           hover:before:translate-x-[100%] before:transition-transform before:duration-500;
  }

  .btn-secondary {
    @apply bg-white/5 hover:bg-white/10 text-white font-medium py-2.5 px-6 rounded-xl
           border border-white/20 hover:border-white/30
           transition-all duration-200 backdrop-blur-sm;
  }

  .btn-ghost {
    @apply text-slate-300 hover:text-white hover:bg-white/10
           font-medium py-2 px-4 rounded-xl transition-all duration-200;
  }

  .btn-voice {
    @apply relative bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500
           bg-size-200 bg-pos-0 hover:bg-pos-100
           text-white font-bold py-5 px-10 rounded-2xl
           transition-all duration-500
           shadow-glow-lg hover:scale-105 active:scale-95
           animate-pulse-slow;
  }

  .card {
    @apply glass-card p-6;
  }

  .card-solid {
    @apply bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6
           hover:border-slate-600/50 transition-all duration-300;
  }

  .input-field {
    @apply w-full px-4 py-3 rounded-xl
           bg-slate-800/50 border border-slate-700/50
           focus:border-primary-500/50 focus:ring-2 focus:ring-primary-500/20
           text-white placeholder:text-slate-400
           outline-none transition-all duration-200
           backdrop-blur-sm;
  }

  .label-text {
    @apply block text-sm font-medium text-slate-300 mb-2;
  }

  .progress-bar {
    @apply h-2 bg-slate-700/50 rounded-full overflow-hidden;
  }

  .progress-bar-fill {
    @apply h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full
           transition-all duration-700 ease-out;
  }

  .stat-card {
    @apply glass-card p-5 flex flex-col;
  }

  .stat-value {
    @apply text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent;
  }

  .stat-label {
    @apply text-sm text-slate-400 mt-1;
  }

  .nav-item {
    @apply flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium
           text-slate-300 hover:text-white hover:bg-white/10
           transition-all duration-200;
  }

  .nav-item-active {
    @apply nav-item bg-primary-500/20 text-primary-400 border border-primary-500/30;
  }

  .gradient-text {
    @apply bg-gradient-to-r from-primary-400 via-accent-400 to-primary-500
           bg-clip-text text-transparent;
  }

  .gradient-border {
    @apply relative before:absolute before:inset-0 before:rounded-2xl
           before:p-[1px] before:bg-gradient-to-r before:from-primary-500/50
           before:via-accent-500/50 before:to-primary-500/50
           before:-z-10;
  }

  .glow-effect {
    @apply relative after:absolute after:inset-0 after:rounded-2xl
           after:bg-primary-500/20 after:blur-xl after:-z-10 after:opacity-0
           hover:after:opacity-100 after:transition-opacity after:duration-300;
  }

  .icon-container {
    @apply w-12 h-12 rounded-xl flex items-center justify-center
           bg-gradient-to-br from-primary-500/20 to-primary-600/20
           border border-primary-500/30;
  }

  .skill-icon {
    @apply w-14 h-14 rounded-2xl flex items-center justify-center
           bg-gradient-to-br text-white shadow-lg;
  }

  .tooltip {
    @apply absolute bottom-full left-1/2 -translate-x-1/2 mb-2
           px-3 py-1.5 rounded-lg bg-slate-700 text-xs text-white
           opacity-0 group-hover:opacity-100 transition-opacity
           whitespace-nowrap pointer-events-none;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .bg-glass-gradient {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%);
  }

  .bg-shine {
    background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
    background-size: 200% 100%;
    animation: shine 3s infinite;
  }

  @keyframes shine {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .gradient-mask {
    mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
  }
}
