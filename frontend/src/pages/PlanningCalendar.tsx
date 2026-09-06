import React, { useState, useEffect } from 'react';
import { 
  CalendarDays, CalendarRange, Clock, CheckCircle2, 
  AlertCircle, ChevronRight, Layers, Sparkles, Download, Filter
} from 'lucide-react';

interface PlanningProps {
  initialView?: 'WEEKLY' | 'MONTHLY';
  onViewChange?: (view: 'WEEKLY' | 'MONTHLY') => void;
  onNavigateToPlanner?: () => void;
}

export const PlanningCalendar: React.FC<PlanningProps> = ({ 
  initialView = 'WEEKLY',
  onViewChange,
  onNavigateToPlanner
}) => {
  const [view, setView] = useState<'WEEKLY' | 'MONTHLY'>(initialView);
  const [selectedDay, setSelectedDay] = useState<string>("Tuesday");
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [scheduleToast, setScheduleToast] = useState<string | null>(null);

  // Sync internal view state whenever initialView prop changes
  useEffect(() => {
    if (initialView) {
      setView(initialView);
    }
  }, [initialView]);

  const handleSwitchView = (newView: 'WEEKLY' | 'MONTHLY') => {
    setView(newView);
    if (onViewChange) {
      onViewChange(newView);
    }
  };

  const weeklySchedule = [
    {
      day: "Monday",
      date: "07 Sep",
      blocks: [
        {
          id: "BLK-01",
          section: "SEC-01 (NDLS-GZB)",
          window: "03:00–04:15",
          departments: ["Engineering (Track)"],
          taskCount: 2,
          conflictRisk: "LOW",
          status: "APPROVED"
        }
      ]
    },
    {
      day: "Tuesday",
      date: "08 Sep",
      blocks: [
        {
          id: "BLK-02",
          section: "SEC-04 (TDL Chord)",
          window: "02:00–03:00",
          departments: ["Engineering", "S&T", "Traction"],
          taskCount: 3,
          conflictRisk: "LOW",
          status: "APPROVED"
        }
      ]
    },
    {
      day: "Wednesday",
      date: "09 Sep",
      blocks: [
        {
          id: "BLK-03",
          section: "SEC-02 (GZB-ALJN)",
          window: "04:30–06:30",
          departments: ["Engineering (Track)"],
          taskCount: 1,
          conflictRisk: "MEDIUM",
          status: "PENDING"
        }
      ]
    },
    {
      day: "Thursday",
      date: "10 Sep",
      blocks: [
        {
          id: "BLK-04",
          section: "SEC-03 (ALJN-TDL)",
          window: "02:30–04:00",
          departments: ["S&T Signalling"],
          taskCount: 2,
          conflictRisk: "LOW",
          status: "APPROVED"
        }
      ]
    },
    {
      day: "Friday",
      date: "11 Sep",
      blocks: [
        {
          id: "BLK-05",
          section: "SEC-01 (NDLS-GZB)",
          window: "11:30–13:00",
          departments: ["Traction (OHE)"],
          taskCount: 2,
          conflictRisk: "LOW",
          status: "APPROVED"
        }
      ]
    },
    {
      day: "Saturday",
      date: "12 Sep",
      blocks: [
        {
          id: "BLK-06",
          section: "SEC-02 (GZB-ALJN)",
          window: "02:00–03:30",
          departments: ["Traction", "S&T"],
          taskCount: 2,
          conflictRisk: "LOW",
          status: "PENDING"
        }
      ]
    },
    {
      day: "Sunday",
      date: "13 Sep",
      blocks: [
        {
          id: "BLK-07",
          section: "SEC-04 (TDL Chord)",
          window: "03:00–04:30",
          departments: ["Engineering (Track)"],
          taskCount: 1,
          conflictRisk: "LOW",
          status: "APPROVED"
        }
      ]
    }
  ];

  const monthlyWeeks = [
    {
      id: 1,
      week: "Week 1 (01–07 Sep)",
      totalTasks: 48,
      criticalOverdueResolved: 8,
      plannedBlocks: 6,
      availabilityTrend: "94.2% → 95.5%",
      status: "CURRENT",
      keyPossessions: ["SEC-01 03:00-04:15", "SEC-04 02:00-03:00 Shadow", "SEC-02 04:30-06:30"]
    },
    {
      id: 2,
      week: "Week 2 (08–14 Sep)",
      totalTasks: 42,
      criticalOverdueResolved: 7,
      plannedBlocks: 5,
      availabilityTrend: "95.5% → 96.1%",
      status: "SCHEDULED",
      keyPossessions: ["SEC-03 ALJN-TDL", "SEC-01 OHE Maintenance", "SEC-02 Night Block"]
    },
    {
      id: 3,
      week: "Week 3 (15–21 Sep)",
      totalTasks: 39,
      criticalOverdueResolved: 5,
      plannedBlocks: 4,
      availabilityTrend: "96.1% → 96.8%",
      status: "PROJECTED",
      keyPossessions: ["SEC-04 Chord Line Tie-Renewal", "SEC-01 Quad Track Tamping"]
    },
    {
      id: 4,
      week: "Week 4 (22–28 Sep)",
      totalTasks: 35,
      criticalOverdueResolved: 3,
      plannedBlocks: 4,
      availabilityTrend: "96.8% → 97.4%",
      status: "PROJECTED",
      keyPossessions: ["SEC-03 Bridge Joint Overhaul", "SEC-02 Point Machine Overhaul"]
    }
  ];

  const handleExportSchedule = () => {
    setScheduleToast("✓ Corridor Block Schedule exported as CSV / Roster Sheet");
    setTimeout(() => setScheduleToast(null), 3500);
  };

  const selectedDayData = weeklySchedule.find(d => d.day === selectedDay) || weeklySchedule[1];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Schedule Toast */}
      {scheduleToast && (
        <div className="fixed top-16 right-6 z-50 bg-[#0B1528] text-white px-4 py-2.5 rounded-xl shadow-2xl border border-sky-400/50 text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top-3 backdrop-blur-xl">
          <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>{scheduleToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {view === 'WEEKLY' ? 'Weekly 7-Day Tactical Block Plan' : 'Monthly 4-Week Strategic Maintenance Roadmap'}
            </h1>
            <span className="text-xs font-bold text-[#002D62] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              {view === 'WEEKLY' ? '7-Day Window Matrix' : 'Rolling Corridor Horizon'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {view === 'WEEKLY' 
              ? 'Tactical daily possession roster coordinating Track (TMS), S&T (SMMS), and Traction (TDMS) multi-disciplinary tasks'
              : 'Strategic 4-week corridor asset maintenance roadmap forecasting availability trajectories and clearing backlog'}
          </p>
        </div>

        {/* View Switcher Tabs & Actions */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => handleSwitchView('WEEKLY')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                view === 'WEEKLY'
                  ? 'bg-[#002D62] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>WEEKLY (7-Day)</span>
            </button>
            <button
              onClick={() => handleSwitchView('MONTHLY')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                view === 'MONTHLY'
                  ? 'bg-[#002D62] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>MONTHLY (4-Week)</span>
            </button>
          </div>

          <button
            onClick={handleExportSchedule}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 shadow-sm transition-all cursor-pointer"
            title="Export Roster"
          >
            <Download className="w-3.5 h-3.5 text-[#002D62]" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {view === 'WEEKLY' ? (
        /* WEEKLY 7-DAY CALENDAR VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {weeklySchedule.map((dayItem, idx) => {
              const isSelected = selectedDay === dayItem.day;
              return (
                <div 
                  key={idx}
                  onClick={() => setSelectedDay(dayItem.day)}
                  className={`bg-white p-3.5 rounded-xl cursor-pointer transition-all border shadow-sm ${
                    isSelected 
                      ? 'border-2 border-[#002D62] ring-1 ring-[#002D62] bg-blue-50/20 shadow-md' 
                      : 'border-slate-200 hover:border-slate-400 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <span className="text-xs font-extrabold text-slate-900">{dayItem.day}</span>
                    <span className="text-[10px] text-[#002D62] font-mono font-bold">{dayItem.date}</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {dayItem.blocks.map((b, bIdx) => (
                      <div 
                        key={bIdx}
                        className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] font-bold text-[#002D62]">{b.id}</span>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                            b.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {b.status}
                          </span>
                        </div>

                        <div className="text-[11px] font-bold text-slate-900 leading-tight">{b.window}</div>
                        <div className="text-[10px] text-slate-600 truncate">{b.section}</div>

                        <div className="pt-1 border-t border-slate-200 flex items-center justify-between text-[9px]">
                          <span className="text-slate-700 font-semibold">{b.taskCount} tasks</span>
                          <span className="text-emerald-700 font-bold">{b.conflictRisk} Risk</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Day Expanded Detail Card */}
          {selectedDayData && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#002D62] text-white flex items-center justify-center font-bold font-mono text-sm shadow-md">
                  {selectedDayData.date.split(' ')[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-slate-900">
                      Detailed Possession Schedule for {selectedDayData.day}, {selectedDayData.date}
                    </h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {selectedDayData.blocks.length} Scheduled Block(s)
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Coordinated traffic windows safely deconflicted against Shatabdi, Rajdhani, and Vande Bharat expresses.
                  </p>
                </div>
              </div>

              {onNavigateToPlanner && (
                <button
                  onClick={onNavigateToPlanner}
                  className="flex items-center gap-1.5 px-4 py-2 bg-[#002D62] hover:bg-[#001D3D] text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-200" />
                  <span>Open in Block Optimizer</span>
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* MONTHLY 4-WEEK ROADMAP VIEW */
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {monthlyWeeks.map((weekItem) => {
              const isSelected = selectedWeek === weekItem.id;
              return (
                <div 
                  key={weekItem.id} 
                  onClick={() => setSelectedWeek(weekItem.id)}
                  className={`bg-white p-5 rounded-xl border transition-all cursor-pointer shadow-sm space-y-4 ${
                    isSelected ? 'border-2 border-[#002D62] ring-1 ring-[#002D62] bg-blue-50/10' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                    <span className="text-xs font-black text-slate-900">{weekItem.week}</span>
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded ${
                      weekItem.status === 'CURRENT' ? 'bg-blue-100 text-[#002D62] border border-blue-300 font-bold' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {weekItem.status}
                    </span>
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Total Tasks Planned:</span>
                      <span className="font-bold text-slate-900">{weekItem.totalTasks}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Critical Overdue Cleared:</span>
                      <span className="font-bold text-red-600">{weekItem.criticalOverdueResolved} defects</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-600">Planned Possession Blocks:</span>
                      <span className="font-bold text-[#002D62]">{weekItem.plannedBlocks} blocks</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-600">Availability Trajectory:</span>
                      <span className="font-bold text-emerald-600">{weekItem.availabilityTrend}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 font-medium">
                    Integrated scheduling prevents back-to-back single department closures and optimizes tower-wagon utilization.
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Optimization Synergy Banner */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-50 text-[#002D62] border border-blue-200">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">
                  4-Week Strategic Capacity Optimization
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Over a 30-day horizon, cross-department shadow bundling preserves 142 hours of corridor capacity.
                </p>
              </div>
            </div>

            <button
              onClick={() => handleSwitchView('WEEKLY')}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition-all cursor-pointer shrink-0"
            >
              <span>View Current Week 7-Day Matrix</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


