import React, { useState, useEffect } from 'react';
import { 
  Cpu, Wrench, AlertTriangle, Clock, Calendar, CheckCircle2, 
  TrendingUp, ShieldAlert, ArrowUpRight, Sparkles, 
  Info, IndianRupee, Radio, Train, Activity, 
  ArrowRight, Shield, RefreshCw, BarChart3, Layers,
  ChevronRight, Compass, Zap, Gauge, Flame, Signal
} from 'lucide-react';

interface DashboardProps {
  data: any;
  onNavigateToPlanner: () => void;
  onExplainRecommendation: () => void;
  onNavigateToPage?: (page: string) => void;
}

export const ExecutiveDashboard: React.FC<DashboardProps> = ({
  data,
  onNavigateToPlanner,
  onExplainRecommendation,
  onNavigateToPage
}) => {
  const kpis = data?.kpis || {};
  const charts = data?.charts || {};
  const rec = data?.ai_recommendation || {};

  const [selectedCorridorSection, setSelectedCorridorSection] = useState<string>("SEC-04");
  const [pulsePosition, setPulsePosition] = useState<number>(15);

  // Slow moving telemetry pulse along the railway network
  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePosition((prev) => (prev >= 92 ? 5 : prev + 1.2));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  const corridorHealthMap = [
    { 
      code: "SEC-01", 
      name: "New Delhi — Ghaziabad Quad", 
      stationFrom: "NDLS", 
      stationTo: "GZB", 
      km: "Km 0 – 25.5", 
      health: 94, 
      speed: "130 km/h", 
      status: "NORMAL", 
      statusLabel: "Clear Route", 
      tasks: 45, 
      signal: "GREEN",
      accent: "#00C98D" 
    },
    { 
      code: "SEC-02", 
      name: "Ghaziabad — Aligarh Main", 
      stationFrom: "GZB", 
      stationTo: "ALJN", 
      km: "Km 25.5 – 130.5", 
      health: 91, 
      speed: "130 km/h", 
      status: "MAINT_DUE", 
      statusLabel: "Maint Due", 
      tasks: 68, 
      signal: "YELLOW",
      accent: "#FFB020" 
    },
    { 
      code: "SEC-03", 
      name: "Aligarh — Tundla Heavy Trunk", 
      stationFrom: "ALJN", 
      stationTo: "TDL", 
      km: "Km 130.5 – 209.0", 
      health: 93, 
      speed: "130 km/h", 
      status: "NORMAL", 
      statusLabel: "Clear Route", 
      tasks: 52, 
      signal: "GREEN",
      accent: "#00C98D" 
    },
    { 
      code: "SEC-04", 
      name: "Tundla Chord & Bypass Line", 
      stationFrom: "TDL", 
      stationTo: "ETW", 
      km: "Km 209.0 – 244.0", 
      health: 97, 
      speed: "110 km/h", 
      status: "SHADOW_ACTIVE", 
      statusLabel: "Shadow Block Active", 
      tasks: 21, 
      signal: "CYAN",
      accent: "#20D5FF" 
    },
    { 
      code: "SEC-05", 
      name: "Tundla — Etawah Heavy Section", 
      stationFrom: "ETW", 
      stationTo: "CNB", 
      km: "Km 244.0 – 320.0", 
      health: 95, 
      speed: "130 km/h", 
      status: "NORMAL", 
      statusLabel: "Clear Route", 
      tasks: 38, 
      signal: "GREEN",
      accent: "#00C98D" 
    },
    { 
      code: "SEC-06", 
      name: "Etawah — Kanpur Express Trunk", 
      stationFrom: "CNB", 
      stationTo: "PRYJ", 
      km: "Km 320.0 – 440.0", 
      health: 92, 
      speed: "130 km/h", 
      status: "TSR_APPLIED", 
      statusLabel: "TSR 30 km/h Limit", 
      tasks: 58, 
      signal: "RED",
      accent: "#FF4757" 
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 
        1. HEADER & AI OPERATIONS INTELLIGENCE HERO
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Left Title Card (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl glass-panel border border-slate-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#002D62] via-[#0088CC] to-[#20D5FF]" />
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#002D62] to-[#004B87] border border-blue-400/40 flex items-center justify-center text-white shadow-md">
                <Train className="w-5 h-5 text-sky-200" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#031B34] flex items-center gap-1.5">
                    Executive Operations
                  </h1>
                  <span className="text-[10px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    CRIS LIVE
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-600 mt-2.5 font-medium leading-relaxed">
              Indian Railways Central Operations Command • <span className="text-[#0088CC] font-bold">Golden Diagonal Corridor (NDLS — PRYJ)</span>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1.5 text-slate-700 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0088CC] animate-ping" />
              Active Sector: SEC-04 (Tundla Chord)
            </span>
            <span className="text-sky-700 font-bold">130/160 km/h Trunk Feed</span>
          </div>
        </div>

        {/* Right: AI Intelligence Command Banner (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-gradient-to-r from-[#031B34] via-[#073B66] to-[#0B2545] text-white backdrop-blur-md border border-sky-400/30 shadow-md relative overflow-hidden flex flex-col justify-between">
          {/* Subtle animated scan pulse */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#20D5FF] to-transparent animate-shimmer" />

          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-purple-500/20 text-[#20D5FF] border border-purple-400/40 shrink-0 shadow-inner">
                <Sparkles className="w-5 h-5 text-[#20D5FF] animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#20D5FF] font-black bg-[#20D5FF]/15 px-2 py-0.5 rounded border border-[#20D5FF]/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#20D5FF]" />
                    AI Operations Intelligence
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-400/30">
                    CONFIDENCE 94%
                  </span>
                </div>

                <div className="text-sm sm:text-base font-black text-white mt-1.5 tracking-tight">
                  {rec.title || "Shadow Block Coordination Detected"}
                </div>
                
                <p className="text-xs text-slate-200 mt-1 font-medium leading-relaxed max-w-xl">
                  {rec.description || "7 maintenance tasks across Track, S&T, and OHE can be coordinated into 2 optimized blocks this week."}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex sm:flex-col gap-2 shrink-0 self-end sm:self-auto">
              <button
                onClick={onNavigateToPlanner}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00C98D] to-[#0088CC] hover:brightness-110 text-slate-950 font-black text-xs transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 border border-emerald-300/50 cursor-pointer"
              >
                <span>OPEN PLAN</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onExplainRecommendation}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold transition-all flex items-center gap-1 justify-center border border-white/20 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5 text-[#20D5FF]" />
                <span>Explain</span>
              </button>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-sky-400/20 flex items-center justify-between text-[11px] text-slate-300 font-mono">
            <span>Primary Slot: <strong className="text-white">SEC-04 (Tundla Chord) 02:00–03:00</strong></span>
            <span>Potential Track Hours Saved: <strong className="text-[#00C98D]">48.0%</strong></span>
          </div>
        </div>
      </div>

      {/* 
        2. LIVE RAILWAY NETWORK (CENTERPIECE SCHEMATIC ROUTE)
      */}
      <div className="p-5 rounded-2xl glass-panel border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-slate-200 gap-2">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-[#0088CC]" />
            <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#031B34]">
              Live Railway Network Topology (New Delhi ─── Kanpur Corridor)
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono">Click section to inspect:</span>
            <span className="px-2.5 py-0.5 rounded-md bg-sky-50 border border-sky-300 text-[#0088CC] font-mono font-extrabold text-[11px] shadow-xs">
              {selectedCorridorSection}
            </span>
          </div>
        </div>

        {/* Connected Railway Route Schematic with Moving Light/Pulse */}
        <div className="relative pt-6 pb-4 overflow-x-auto select-none">
          {/* Background Railway Trunk Track Line */}
          <div className="absolute top-1/2 left-8 right-8 h-2 bg-slate-200 -translate-y-6 rounded-full border-t border-b border-slate-300 shadow-inner" />
          <div className="absolute top-1/2 left-8 right-8 h-0.5 bg-[#0088CC]/30 -translate-y-6" />
          
          {/* Moving Light / Train Packet Pulse along track */}
          <div 
            className="absolute top-1/2 h-3.5 w-3.5 bg-[#0088CC] -translate-y-[28px] rounded-full shadow-[0_0_10px_#0088CC] transition-all duration-150 pointer-events-none ring-2 ring-white"
            style={{ left: `${pulsePosition}%` }}
          />

          {/* Connected Station Sections Grid */}
          <div className="relative flex items-center justify-between min-w-[820px] gap-2.5 z-10">
            {corridorHealthMap.map((sec) => {
              const isSelected = selectedCorridorSection === sec.code;
              return (
                <div
                  key={sec.code}
                  onClick={() => setSelectedCorridorSection(sec.code)}
                  className={`flex-1 p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                    isSelected
                      ? 'bg-gradient-to-b from-[#031B34] to-[#073B66] text-white border-[#0088CC] shadow-md ring-2 ring-[#0088CC]/50'
                      : 'bg-slate-50/90 text-slate-800 border-slate-200 hover:border-sky-300 hover:bg-white hover:shadow-xs'
                  }`}
                >
                  {/* Station Bead & Section Code */}
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span 
                        className="w-2.5 h-2.5 rounded-full border border-white/60 shadow-sm"
                        style={{ backgroundColor: sec.accent }}
                      />
                      <span className={`font-mono font-black ${isSelected ? 'text-[#20D5FF]' : 'text-[#0088CC]'}`}>
                        {sec.code}
                      </span>
                    </div>
                    <span 
                      className="px-1.5 py-0.5 rounded text-[9px] font-mono font-extrabold"
                      style={{ 
                        backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : `${sec.accent}15`,
                        color: isSelected ? '#ffffff' : sec.accent,
                        border: `1px solid ${isSelected ? 'rgba(255,255,255,0.3)' : sec.accent + '40'}`
                      }}
                    >
                      {sec.statusLabel}
                    </span>
                  </div>

                  {/* Section Name & Bounds */}
                  <div className={`text-xs font-bold truncate transition-colors ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-[#0088CC]'}`}>
                    {sec.name}
                  </div>

                  <div className={`flex items-center justify-between text-[10px] font-mono mt-2 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                    <span>{sec.km}</span>
                    <span className={`font-black ${isSelected ? 'text-emerald-300' : 'text-emerald-600'}`}>
                      {sec.health}% Health
                    </span>
                  </div>

                  {/* Mini Progress Track Gauge */}
                  <div className={`w-full h-1.5 rounded-full mt-2 overflow-hidden ${isSelected ? 'bg-slate-900/60 border border-white/10' : 'bg-slate-200 border border-slate-300/40'}`}>
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${sec.health}%`,
                        backgroundColor: isSelected ? '#20D5FF' : sec.accent
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 
        3. COMPACT OPERATIONAL KPI TILES (ALL 8 VALUES WITH PROMINENT NUMBERS & CLICKABLE NAVIGATION)
      */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-3">
        {/* Total Assets */}
        <div 
          onClick={() => onNavigateToPage?.('assets')}
          className="p-3.5 rounded-xl glass-panel border border-slate-200/90 hover:border-sky-300 hover:shadow-md transition-all shadow-xs cursor-pointer group"
          title="Click to view Fixed Assets Registry"
        >
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between group-hover:text-[#0088CC]">
            <span>Total Assets</span>
            <Cpu className="w-3.5 h-3.5 text-[#0088CC]" />
          </div>
          <div className="text-2xl font-black text-[#031B34] mt-1 font-mono tracking-tight group-hover:text-[#0088CC] transition-colors">
            {kpis.total_assets?.toLocaleString() || "1,845"}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5 font-medium truncate">
            Track • S&T • OHE
          </div>
        </div>

        {/* Demurrage Saved */}
        <div 
          onClick={() => onNavigateToPage?.('reports')}
          className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 hover:border-emerald-300 hover:shadow-md transition-all shadow-xs cursor-pointer group"
          title="Click to view Efficiency Reports"
        >
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-800 flex items-center justify-between">
            <span>Demurrage Saved</span>
            <IndianRupee className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 mt-1 font-mono tracking-tight truncate group-hover:text-emerald-800 transition-colors">
            {kpis.ohe_diesel_cost_savings_inr || "₹48.2L"}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5 font-semibold flex items-center gap-0.5 truncate">
            <ArrowUpRight className="w-3 h-3" /> Direct savings
          </div>
        </div>

        {/* Critical Defects */}
        <div 
          onClick={() => onNavigateToPage?.('defects')}
          className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 hover:border-rose-300 hover:shadow-md transition-all shadow-xs cursor-pointer group"
          title="Click to view Defect & Flaw Detection Registry"
        >
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-800 flex items-center justify-between">
            <span>Critical Defects</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
          </div>
          <div className="text-2xl font-black text-rose-700 mt-1 font-mono tracking-tight group-hover:text-rose-800 transition-colors">
            {kpis.critical_defects || "19"}
          </div>
          <div className="text-[10px] text-rose-600 mt-0.5 font-semibold truncate">
            TSR Mitigations
          </div>
        </div>

        {/* Pending Tasks */}
        <div 
          onClick={() => onNavigateToPage?.('tasks')}
          className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 hover:border-amber-300 hover:shadow-md transition-all shadow-xs cursor-pointer group"
          title="Click to view Maintenance Tasks Repository"
        >
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-800 flex items-center justify-between">
            <span>Pending Tasks</span>
            <Wrench className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 mt-1 font-mono tracking-tight group-hover:text-amber-800 transition-colors">
            {kpis.pending_tasks || "142"}
          </div>
          <div className="text-[10px] text-amber-700 mt-0.5 font-semibold truncate">
            Awaiting blocks
          </div>
        </div>

        {/* Planned Blocks */}
        <div 
          onClick={() => onNavigateToPage?.('blocks')}
          className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200 hover:border-sky-300 hover:shadow-md transition-all shadow-xs cursor-pointer group"
          title="Click to view Available Block Windows & Matrix"
        >
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-sky-800 flex items-center justify-between">
            <span>Available Blocks</span>
            <Calendar className="w-3.5 h-3.5 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-sky-900 mt-1 font-mono tracking-tight group-hover:text-[#0088CC] transition-colors">
            {kpis.planned_blocks || "24"}
          </div>
          <div className="text-[10px] text-sky-700 mt-0.5 font-semibold truncate">
            Shadow slots
          </div>
        </div>

        {/* Asset Availability % */}
        <div 
          onClick={() => onNavigateToPage?.('planner')}
          className="p-3.5 rounded-xl glass-panel border border-slate-200/90 hover:border-emerald-300 hover:shadow-md transition-all shadow-xs cursor-pointer group"
          title="Click to view Automatic Block Planner"
        >
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between group-hover:text-emerald-700">
            <span>Availability</span>
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 mt-1 font-mono tracking-tight group-hover:text-emerald-700 transition-colors">
            {kpis.asset_availability_pct || "96.4"}%
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold truncate">
            +3.2% vs baseline
          </div>
        </div>

        {/* Hours Saved % */}
        <div 
          onClick={() => onNavigateToPage?.('planner')}
          className="p-3.5 rounded-xl glass-panel border border-slate-200/90 hover:border-sky-300 hover:shadow-md transition-all shadow-xs cursor-pointer group"
          title="Click to view AI Block Optimization Center"
        >
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between group-hover:text-[#0088CC]">
            <span>Hours Saved</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-[#0088CC]" />
          </div>
          <div className="text-2xl font-black text-[#0088CC] mt-1 font-mono tracking-tight group-hover:text-[#002D62] transition-colors">
            {kpis.potential_hours_saved_pct || "34.8"}%
          </div>
          <div className="text-[10px] text-sky-700 mt-0.5 font-semibold truncate">
            Bundled synergy
          </div>
        </div>

        {/* Conflicts Avoided */}
        <div 
          onClick={() => onNavigateToPage?.('simulation')}
          className="p-3.5 rounded-xl glass-panel border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all shadow-xs cursor-pointer group"
          title="Click to view Operations Simulation"
        >
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center justify-between group-hover:text-[#002D62]">
            <span>Conflicts Avoided</span>
            <ShieldAlert className="w-3.5 h-3.5 text-[#002D62]" />
          </div>
          <div className="text-2xl font-black text-[#031B34] mt-1 font-mono tracking-tight group-hover:text-[#002D62] transition-colors">
            {kpis.conflicts_avoided || "14"}
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5 font-semibold truncate">
            0 Train delays
          </div>
        </div>
      </div>

      {/* 
        4. EDITORIAL ANALYTICS: AVAILABILITY TRAJECTORY & BLOCK UTILIZATION
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
        {/* Large: Availability Trajectory (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-2xl glass-panel border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#031B34]">
                Corridor Asset Availability Trajectory (7-Day Rolling)
              </h3>
              <p className="text-[11px] text-slate-500">Manual uncoordinated planning vs AI-Optimized shadow blocks</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono font-bold">
              <span className="flex items-center gap-1.5 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" /> Historical
              </span>
              <span className="flex items-center gap-1.5 text-[#0088CC]">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0088CC]" /> AI Optimized
              </span>
            </div>
          </div>

          {/* Custom Bar Comparison Graph */}
          <div className="h-44 w-full flex items-end justify-between pt-6 px-2">
            {charts.availability_trend?.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1">
                <div className="flex items-end gap-1.5 h-28">
                  {/* Historical Bar */}
                  <div 
                    className="w-3.5 sm:w-4 rounded-t bg-slate-300 hover:bg-slate-400 transition-all relative group"
                    style={{ height: `${(item.historical - 85) * 6}px` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] text-white whitespace-nowrap pointer-events-none transition-all shadow-md z-10 font-mono">
                      {item.historical}%
                    </div>
                  </div>
                  {/* Optimized Bar (Cyan / Railway Blue) */}
                  <div 
                    className="w-3.5 sm:w-4 rounded-t bg-gradient-to-t from-[#004B87] to-[#0088CC] hover:brightness-110 transition-all relative group shadow-xs"
                    style={{ height: `${(item.optimized - 85) * 6}px` }}
                  >
                    <div className="opacity-0 group-hover:opacity-100 absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-[#031B34] border border-sky-400 text-[10px] text-[#20D5FF] font-bold whitespace-nowrap pointer-events-none transition-all shadow-md z-10 font-mono">
                      {item.optimized}%
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-600">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Block Utilization (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl glass-panel border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#031B34]">
                Weekly Maintenance Block Utilization
              </h3>
              <p className="text-[11px] text-slate-500">Hours allocated vs productive possession utilized</p>
            </div>
            <span className="text-[10px] font-mono font-black text-emerald-700 px-2 py-0.5 rounded bg-emerald-50 border border-emerald-300">
              Avg 94.2% Efficiency
            </span>
          </div>

          <div className="space-y-2.5 pt-2 flex-1 flex flex-col justify-center">
            {charts.weekly_utilization?.map((u: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between gap-3 text-xs font-semibold">
                <span className="w-8 text-slate-600 font-mono font-bold">{u.day}</span>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden relative border border-slate-200">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#004B87] to-[#0088CC]" 
                    style={{ width: `${u.utilization_pct}%` }}
                  />
                </div>
                <div className="w-24 text-right text-slate-600 font-mono text-[11px]">
                  <span className="font-bold text-slate-900">{u.utilized_hours}h</span> / {u.allocated_hours}h
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 
        5. BOTTOM ROW: 3 TARGETED OPERATIONS PANELS
      */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Panel 1: Tasks by Department */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#031B34]">
              Tasks by Department
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              TMS / SMMS / TDMS
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {charts.tasks_by_dept?.map((dept: any, idx: number) => {
              const maxCount = 100;
              const pct = Math.round((dept.count / maxCount) * 100);
              const barColor = dept.code === 'ENG' ? 'bg-gradient-to-r from-[#004B87] to-[#0088CC]' : 
                               dept.code === 'SNT' ? 'bg-gradient-to-r from-purple-700 to-indigo-500' : 
                               'bg-gradient-to-r from-emerald-600 to-teal-400';
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700">{dept.name}</span>
                    <span className="text-slate-900 font-mono font-bold">{dept.count} tasks</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                    <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel 2: Tasks by AI Priority */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#031B34]">
              Tasks by AI Priority
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              RDSO Scale
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {charts.tasks_by_priority?.map((p: any, idx: number) => (
              <div key={idx} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }}></span>
                  <span className="text-xs font-bold text-slate-700">{p.priority}</span>
                </div>
                <span className="text-xs font-black text-slate-900 font-mono px-2.5 py-0.5 rounded bg-white border border-slate-200 shadow-xs">
                  {p.count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Panel 3: Train Headway Safety Index */}
        <div className="p-5 rounded-2xl glass-panel border border-slate-200/90 shadow-sm space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-xs font-black uppercase tracking-wider text-[#031B34]">
              Train Headway Safety Index
            </h3>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              COA Shield
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {charts.conflict_risk?.map((risk: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{risk.level}</span>
                  <span className="font-bold text-slate-900 font-mono">{risk.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${risk.percentage}%`, backgroundColor: risk.color }}
                  />
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
            82% of recommended maintenance blocks fit into clean headway gaps with zero passenger train path disruption.
          </p>
        </div>
      </div>
    </div>
  );
};
