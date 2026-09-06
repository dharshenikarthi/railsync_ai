import React from 'react';
import { 
  LayoutDashboard, Wrench, Cpu, AlertTriangle, GitBranch, 
  Train, Calendar, Sparkles, Layers, CalendarDays, CalendarRange, 
  PlayCircle, Sliders, CheckCircle2, Bell, FileBarChart, Settings, Radio, ShieldCheck 
} from 'lucide-react';




interface SidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  pendingApprovalsCount: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: number;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  setActivePage,
  pendingApprovalsCount
}) => {
  const menuGroups: MenuGroup[] = [
    {
      group: "OPERATIONS",
      items: [
        { id: "dashboard", label: "Executive Dashboard", icon: LayoutDashboard },
        { id: "network", label: "Corridor & Network", icon: GitBranch },
        { id: "trains", label: "Train Timetables & COA", icon: Train },
        { id: "blocks", label: "Available Block Windows", icon: Calendar },
      ]
    },
    {
      group: "MAINTENANCE DATA",
      items: [
        { id: "departments", label: "TMS • SMMS • TDMS Feed", icon: GitBranch },
        { id: "loco_pilot", label: "Loco Pilot Feedback", icon: Radio },
        { id: "tasks", label: "Maintenance Tasks Repository", icon: Wrench },
        { id: "assets", label: "Fixed Assets Registry", icon: Cpu },
        { id: "defects", label: "Defects & Inspections", icon: AlertTriangle },
      ]
    },
    {
      group: "AI & OPTIMIZATION",
      items: [
        { id: "priority", label: "AI Priority Center (ML)", icon: Sparkles },
        { id: "planner", label: "Automatic Block Planner", icon: Layers },
        { id: "weekly", label: "Weekly Plan Matrix", icon: CalendarDays },
        { id: "monthly", label: "Monthly Plan Matrix", icon: CalendarRange },
      ]
    },
    {
      group: "SIMULATION & GOVERNANCE",
      items: [
        { id: "simulation", label: "Operations Simulation", icon: PlayCircle },
        { id: "whatif", label: "What-If Analysis", icon: Sliders },
        { id: "approvals", label: "Human Approvals", icon: CheckCircle2, badge: pendingApprovalsCount },
        { id: "notifications", label: "System Alerts", icon: Bell },
        { id: "reports", label: "Efficiency Reports", icon: FileBarChart },
        { id: "settings", label: "System Settings", icon: Settings },
      ]
    }
  ];

  return (
    <aside className="w-64 bg-[#070D18]/95 backdrop-blur-xl border-r border-slate-800/80 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none overflow-y-auto shadow-xl shadow-black/20">
      {/* Governance Philosophy Callout */}
      <div className="p-3.5 mx-3.5 my-3 rounded-2xl bg-slate-900/90 border border-sky-500/20 text-[11px] text-slate-300 leading-relaxed font-medium shadow-sm">
        <div className="flex items-center gap-1.5 text-sky-400 font-bold mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Core Governance</span>
        </div>
        <p className="text-[10.5px] text-slate-400 italic">
          "AI predicts & prioritizes, optimization schedules, authorized officers approve."
        </p>
      </div>

      <nav className="flex-1 px-3 py-2 space-y-4">
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <h3 className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              {group.group}
            </h3>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActivePage(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition-all duration-150 cursor-pointer ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-black shadow-xs'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-sky-300' : 'text-slate-500'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-slate-950 shadow-xs">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Footer Corridor Section Status */}
      <div className="p-3.5 border-t border-slate-800 text-[11px] text-slate-400 bg-slate-900/60">
        <div className="flex items-center justify-between font-semibold text-slate-300">
          <span>Active Line Model</span>
          <span className="text-emerald-400 flex items-center gap-1 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Online
          </span>
        </div>
        <div className="mt-1 text-sky-400 font-mono font-bold truncate">NDLS–TDL Mainline Corridor</div>
      </div>
    </aside>
  );
};


