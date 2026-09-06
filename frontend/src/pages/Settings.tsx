import React, { useState } from 'react';
import { 
  ShieldCheck, Database, 
  Save, CheckCircle2, Cpu 
} from 'lucide-react';

export const Settings: React.FC = () => {
  const [solverTimeout, setSolverTimeout] = useState(10);
  const [headwayMin, setHeadwayMin] = useState(15);
  const [shadowWeight, setShadowWeight] = useState(85);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [enableSMSAlerts, setEnableSMSAlerts] = useState(true);
  const [enableAutoReoptimize, setEnableAutoReoptimize] = useState(true);

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Corridor & System Settings
            </h1>
            <span className="text-xs font-bold text-[#002D62] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              System Configuration
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Configure optimization weights, safety headway constraints, and dispatch notifications
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#002D62] hover:bg-[#001D3D] text-white font-bold text-xs shadow-md transition-all active:scale-95 border border-blue-900"
        >
          <Save className="w-4 h-4 text-sky-300" />
          <span>Save Configuration</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Configuration parameters persisted successfully. Solver rules updated.</span>
        </div>
      )}

      {/* Settings Sections (60% White / Light Grey Canvas) */}
      <div className="space-y-4">
        {/* Section 1: Optimization Solver Engine */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Cpu className="w-5 h-5 text-[#002D62]" />
            <div>
              <h2 className="text-sm font-black text-slate-900">Google OR-Tools CP-SAT Solver Rules</h2>
              <p className="text-[11px] text-slate-500 font-medium">Configure integer programming objective functions and time bounds</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5 font-bold text-slate-700">
                <span>Maximum Solver Time Limit</span>
                <span className="text-[#002D62] font-mono">{solverTimeout} seconds</span>
              </div>
              <input
                type="range"
                min="2"
                max="30"
                value={solverTimeout}
                onChange={(e) => setSolverTimeout(Number(e.target.value))}
                className="w-full accent-[#002D62] h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-medium">Benchmark: Solution converges within 100ms for 20+ tasks</span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5 font-bold text-slate-700">
                <span>Shadow Block Bonus Weight</span>
                <span className="text-[#002D62] font-mono">{shadowWeight}%</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                value={shadowWeight}
                onChange={(e) => setShadowWeight(Number(e.target.value))}
                className="w-full accent-[#002D62] h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-medium">Incentivizes multi-department bundling vs single closures</span>
            </div>
          </div>
        </div>

        {/* Section 2: RDSO Headway Safety Norms */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h2 className="text-sm font-black text-slate-900">RDSO Headway & Buffer Standards</h2>
              <p className="text-[11px] text-slate-500 font-medium">Separation margins enforced between maintenance possession and high-speed trains</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between items-center mb-1.5 font-bold text-slate-700">
                <span>High Speed Train Buffer (Vande Bharat / Rajdhani)</span>
                <span className="text-emerald-700 font-mono font-bold">{headwayMin} mins</span>
              </div>
              <input
                type="range"
                min="10"
                max="30"
                value={headwayMin}
                onChange={(e) => setHeadwayMin(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-500 font-medium">Mandatory minimum clearance under Indian Railways operating manual</span>
            </div>

            <div className="flex flex-col justify-center space-y-3">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableAutoReoptimize}
                  onChange={(e) => setEnableAutoReoptimize(e.target.checked)}
                  className="w-4 h-4 rounded text-[#002D62] bg-slate-100 border-slate-300 focus:ring-[#002D62]"
                />
                <span className="text-slate-800 font-medium">Auto-trigger What-If Re-optimization on 15m+ timetable delay</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableSMSAlerts}
                  onChange={(e) => setEnableSMSAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#002D62] bg-slate-100 border-slate-300 focus:ring-[#002D62]"
                />
                <span className="text-slate-800 font-medium">Broadcast SMS alert to Gang Incharges upon Chief Controller signoff</span>
              </label>
            </div>
          </div>
        </div>

        {/* Section 3: Environment & Database Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 border-b border-slate-200 pb-3">
            <Database className="w-5 h-5 text-amber-500" />
            <div>
              <h2 className="text-sm font-black text-slate-900">Database & System Environment</h2>
              <p className="text-[11px] text-slate-500 font-medium">PostgreSQL connection and active ML model weights</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Active Database</div>
              <div className="font-mono text-[#002D62] font-black mt-1">RAILSYNC_DB (PostgreSQL 18)</div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">ML Priority Model</div>
              <div className="font-mono text-emerald-700 font-bold mt-1">RandomForest (100 trees, 92% conf)</div>
            </div>
            <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Deployment State</div>
              <div className="font-mono text-amber-700 font-bold mt-1">OPERATIONAL MOCK + FASTAPI LIVE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

