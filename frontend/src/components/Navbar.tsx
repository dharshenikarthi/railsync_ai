import React, { useState, useEffect } from 'react';
import { 
  Train, Play, Sparkles, ChevronDown, Check,
  User, Shield, Radio, Bell,
  CalendarDays, CalendarRange, Activity, Cpu, ExternalLink
} from 'lucide-react';
import { mockUsers, type RailwayUser } from '../api/mockData';

interface NavbarProps {
  horizon: 'WEEKLY' | 'MONTHLY';
  setHorizon: (h: 'WEEKLY' | 'MONTHLY') => void;
  onStartDemo: () => void;
  onTriggerWhatIf: () => void;
  activePage: string;
  isBackendConnected: boolean;
  currentUser: RailwayUser;
  onSelectUser: (user: RailwayUser) => void;
  onNavigateToLogin: () => void;
  onNavigateToNotifications?: () => void;
  onNavigateToWeekly?: () => void;
  onNavigateToMonthly?: () => void;
  onNavigateToDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  horizon,
  setHorizon,
  onStartDemo,
  onTriggerWhatIf,
  activePage,
  isBackendConnected,
  currentUser,
  onSelectUser,
  onNavigateToLogin,
  onNavigateToNotifications,
  onNavigateToWeekly,
  onNavigateToMonthly,
  onNavigateToDashboard
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Live IST Clock with Milliseconds precision sync
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-IN', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const playClickSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {
      // ignore audio context restrictions
    }
  };

  const handleWeeklyClick = () => {
    playClickSound();
    setHorizon('WEEKLY');
    if (onNavigateToWeekly) {
      onNavigateToWeekly();
    }
  };

  const handleMonthlyClick = () => {
    playClickSound();
    setHorizon('MONTHLY');
    if (onNavigateToMonthly) {
      onNavigateToMonthly();
    }
  };

  const handleRoleChange = (user: RailwayUser) => {
    playClickSound();
    onSelectUser(user);
    setShowUserDropdown(false);
  };

  const isWeeklyActive = activePage === 'weekly' || (activePage !== 'monthly' && horizon === 'WEEKLY');
  const isMonthlyActive = activePage === 'monthly' || (activePage !== 'weekly' && horizon === 'MONTHLY');

  return (
    <header className="sticky top-0 z-50 select-none bg-white/95 backdrop-blur-2xl border-b border-slate-200/90 shadow-[0_4px_25px_-4px_rgba(0,45,98,0.07)] text-slate-800 transition-all">
      {/* Top Futuristic Railway Accent Line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-[#002D62] via-[#0284C7] to-[#10B981] animate-pulse" />

      <div className="h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
        {/* Left: Brand, Logo & Live Network Indicator */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <div 
            onClick={() => { playClickSound(); onNavigateToDashboard?.(); }}
            className="flex items-center gap-3 cursor-pointer group"
            title="Return to Executive Dashboard"
          >
            {/* 3D Train Logo Emblem */}
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#002D62] via-[#004B87] to-[#0284C7] flex items-center justify-center shadow-md shadow-sky-900/20 border border-white/30 group-hover:scale-105 group-hover:shadow-sky-600/30 transition-all">
              <Train className="w-5 h-5 text-white drop-shadow-sm" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-lg tracking-wider text-[#031B34] group-hover:text-[#004B87] transition-colors flex items-center">
                  RAILSYNC
                  <span className="bg-gradient-to-r from-[#0284C7] to-[#38BDF8] bg-clip-text text-transparent ml-0.5 font-black">
                    .AI
                  </span>
                </span>

                <span className="text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-50 to-sky-50 text-[#002D62] border border-blue-200/80 shadow-2xs font-mono">
                  CRIS PROD v2.4
                </span>
              </div>
              <p className="text-[10.5px] text-slate-500 font-semibold hidden md:flex items-center gap-1.5 leading-tight">
                <span>Automatic Block Optimization</span>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-bold">Indian Railways</span>
              </p>
            </div>
          </div>

          {/* Live Operations Telemetry Capsule */}
          <div className="hidden xl:flex items-center gap-2.5 ml-2 px-3.5 py-1.5 rounded-xl bg-slate-50/90 border border-slate-200/80 shadow-inner text-xs font-mono text-slate-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_6px_#10B981]"></span>
            </span>
            <span className="text-slate-900 font-black tracking-tight">{currentTime || '16:30:00 IST'}</span>
            <span className="text-[10px] text-slate-500 font-semibold px-1.5 py-0.2 bg-white rounded border border-slate-200 shadow-2xs">
              NDLS–TDL (130 km/h)
            </span>
          </div>
        </div>

        {/* Center: Tactical Horizon Switcher & Mission-Critical Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Segmented Horizon Capsule Toggle */}
          <div className="flex items-center bg-slate-100/90 rounded-2xl p-1 border border-slate-200 shadow-inner">
            <button
              onClick={handleWeeklyClick}
              className={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                isWeeklyActive
                  ? 'bg-gradient-to-r from-[#002D62] to-[#004B87] text-white shadow-md shadow-sky-950/20 border border-blue-400/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Tactical 7-Day Matrix Schedule"
            >
              <CalendarDays className={`w-3.5 h-3.5 ${isWeeklyActive ? 'text-sky-300' : 'text-slate-500'}`} />
              <span>Weekly Plan</span>
            </button>

            <button
              onClick={handleMonthlyClick}
              className={`px-3.5 py-1.5 text-xs font-black rounded-xl transition-all duration-150 cursor-pointer flex items-center gap-1.5 ${
                isMonthlyActive
                  ? 'bg-gradient-to-r from-[#002D62] to-[#004B87] text-white shadow-md shadow-sky-950/20 border border-blue-400/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
              title="Strategic 4-Week Maintenance Roadmap"
            >
              <CalendarRange className={`w-3.5 h-3.5 ${isMonthlyActive ? 'text-sky-300' : 'text-slate-500'}`} />
              <span>Monthly Plan</span>
            </button>
          </div>

          {/* Quick Demo CTA - Optimizer */}
          <button
            onClick={() => { playClickSound(); onStartDemo(); }}
            className="group relative flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black shadow-md shadow-emerald-600/25 transition-all duration-150 active:scale-95 border border-emerald-300/50 cursor-pointer overflow-hidden"
            title="Launch Section 4 Automatic Block Optimizer"
          >
            <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-100 animate-pulse" />
            <span className="hidden sm:inline tracking-wide font-black">⚡ OPTIMIZE (SEC-04)</span>
            <span className="sm:hidden font-black">⚡ OPTIMIZE</span>
          </button>

          {/* What-If Digital Twin CTA */}
          <button
            onClick={() => { playClickSound(); onTriggerWhatIf(); }}
            className="group relative flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#002D62] via-[#004B87] to-[#0284C7] hover:brightness-110 text-white text-xs font-black shadow-md shadow-sky-900/20 transition-all duration-150 active:scale-95 border border-sky-400/40 cursor-pointer overflow-hidden"
            title="Launch What-If Digital Twin Sandbox"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            <Play className="w-3.5 h-3.5 text-sky-200 fill-sky-200" />
            <span className="hidden md:inline tracking-wide font-black">WHAT-IF TWIN</span>
            <span className="md:hidden font-black">WHAT-IF</span>
          </button>

          {/* Notifications Bell */}
          {onNavigateToNotifications && (
            <button
              onClick={() => { playClickSound(); onNavigateToNotifications(); }}
              className={`p-2 rounded-xl border transition-all relative cursor-pointer shadow-2xs ${
                activePage === 'notifications'
                  ? 'bg-[#002D62] text-white border-[#002D62] shadow-md shadow-sky-950/20'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
              title="Live Operational Alerts & Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 text-[8px] text-white font-black items-center justify-center ring-2 ring-white">
                  4
                </span>
              </span>
            </button>
          )}
        </div>

        {/* Right: Engine Telemetry Badge & RBAC Persona Switcher */}
        <div className="relative flex items-center gap-3 shrink-0">
          {/* Engine Status Badge */}
          <div className="hidden 2xl:flex items-center gap-2 text-xs px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_#10B981] animate-pulse" />
            <span className="text-slate-700 text-[11px] font-mono font-bold">FastAPI • OR-Tools • PG18</span>
          </div>

          {/* Multi-Role Quick Switcher Dropdown Button */}
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl bg-gradient-to-b from-white to-slate-50/90 hover:to-slate-100 border border-slate-200/90 hover:border-sky-300 transition-all shadow-sm hover:shadow-md cursor-pointer group"
            title="Click to Switch Active Persona (RBAC)"
          >
            <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${currentUser.avatarBg || 'from-[#002D62] to-[#0284C7]'} flex items-center justify-center text-white font-black text-xs shadow-md border border-white/30 group-hover:scale-105 transition-transform`}>
              {currentUser.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            
            <div className="text-left hidden sm:block max-w-[150px] lg:max-w-[195px]">
              <div className="text-xs font-black text-slate-900 truncate group-hover:text-[#004B87] transition-colors">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-500 font-semibold truncate flex items-center gap-1.5">
                <span className="px-1.5 py-0.2 rounded bg-blue-50 text-[9px] text-[#002D62] font-mono font-black border border-blue-200">
                  {currentUser.badge || 'OFFICIAL'}
                </span>
                <span className="truncate">{currentUser.division}</span>
              </div>
            </div>

            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 group-hover:text-[#002D62] transition-transform duration-200 ${showUserDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Luxury Role Switcher Dropdown Modal */}
          {showUserDropdown && (
            <div className="absolute right-0 top-14 w-80 sm:w-96 bg-white/95 backdrop-blur-2xl text-slate-800 rounded-2xl shadow-2xl border border-slate-200 p-3.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-50 text-[#002D62] border border-blue-200">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 uppercase tracking-wider block">
                      Active Persona Switcher
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">Role-Based Access Control (RBAC)</span>
                  </div>
                </div>
                <span className="text-[10px] bg-blue-50 text-[#002D62] font-black px-2 py-0.5 rounded-full border border-blue-200">
                  {mockUsers.length} Personas
                </span>
              </div>

              <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
                {mockUsers.map((user) => {
                  const isSelected = user.username === currentUser.username;
                  return (
                    <button
                      key={user.id}
                      onClick={() => handleRoleChange(user)}
                      className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'bg-gradient-to-r from-blue-50/90 to-sky-50/60 border-[#002D62] shadow-sm ring-1 ring-[#002D62]'
                          : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${user.avatarBg} text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 shadow-sm border border-white/20`}>
                        {user.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs font-black truncate ${isSelected ? 'text-[#002D62]' : 'text-slate-900'}`}>
                            {user.name}
                          </span>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-[#002D62] text-white flex items-center justify-center shrink-0 shadow-2xs">
                              <Check className="w-2.5 h-2.5" />
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-slate-700 font-bold truncate">
                          {user.roleTitle}
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                          <span className="font-mono bg-slate-100 px-1 py-0.2 rounded border border-slate-200 font-black text-[#002D62]">
                            {user.badge}
                          </span>
                          <span className="truncate font-medium">{user.department}</span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between">
                <button
                  onClick={() => { setShowUserDropdown(false); onNavigateToLogin(); }}
                  className="text-xs text-[#002D62] font-black hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Custom Credentials Login</span>
                </button>
                <span className="text-[10px] text-slate-400 font-mono font-bold">JWT 256-bit Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
