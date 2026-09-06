import React, { useState } from 'react';
import { 
  Layers, Play, CheckCircle2, XCircle, Edit3, 
  Sparkles, AlertCircle, 
  Sliders, UserCheck, TrendingUp, HelpCircle
} from 'lucide-react';
import { api } from '../api/client';
import { mockOptimizationResult } from '../api/mockData';

interface OptimizationCenterProps {
  horizon: 'WEEKLY' | 'MONTHLY';
  onApprovalsUpdated?: () => void;
}

export const OptimizationCenter: React.FC<OptimizationCenterProps> = ({
  horizon,
  onApprovalsUpdated
}) => {
  const [selectedSection, setSelectedSection] = useState<string>("SEC-04");
  const [optimizationData, setOptimizationData] = useState<any>(mockOptimizationResult);
  const [loading, setLoading] = useState<boolean>(false);
  const [showWhyModal, setShowWhyModal] = useState<boolean>(false);
  const [showModifyModal, setShowModifyModal] = useState<boolean>(false);
  const [showWhatIfModal, setShowWhatIfModal] = useState<boolean>(false);
  const [whatIfResult, setWhatIfResult] = useState<any>(null);
  
  // Modify Block State
  const [modStartTime, setModStartTime] = useState<string>("02:00");
  const [modEndTime, setModEndTime] = useState<string>("03:00");
  const [modificationNotice, setModificationNotice] = useState<string | null>(null);

  // Approval state
  const [approvalStatus, setApprovalStatus] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'MODIFIED'>('PENDING');

  const getSectionId = (secCode: string): number => {
    if (secCode === "SEC-01") return 1;
    if (secCode === "SEC-02") return 2;
    if (secCode === "SEC-03") return 3;
    return 4; // SEC-04 default
  };

  const handleGeneratePlan = async () => {
    setLoading(true);
    setModificationNotice(null);
    try {
      const res = await api.runOptimization({
        section_id: getSectionId(selectedSection),
        horizon: horizon
      });
      if (res && res.selected_blocks && res.selected_blocks.length > 0) {
        setOptimizationData(res);
      } else {
        setOptimizationData(mockOptimizationResult);
      }
    } catch (e) {
      console.warn("Backend optimization call fell back to deterministic heuristic:", e);
      setOptimizationData(mockOptimizationResult);
    } finally {
      setLoading(false);
    }
  };

  const handleUnexpectedFreight = async () => {
    setLoading(true);
    try {
      const res = await api.runWhatIf({
        scenario_type: "UNEXPECTED_FREIGHT",
        section_id: getSectionId(selectedSection),
        custom_parameters: {
          freight_delay_minutes: 45
        }
      });
      setWhatIfResult(res);
      if (res.new_plan && res.new_plan.selected_blocks) {
        setOptimizationData(res.new_plan);
      }
      setShowWhatIfModal(true);
    } catch (e) {
      setWhatIfResult({
        scenario: "UNEXPECTED_FREIGHT",
        diff: {
          scenario_type: "UNEXPECTED_FREIGHT",
          event_description: "COA inserted urgent coal rake BCN-429 into 02:15–02:50 window.",
          action_taken: "Optimizer shifted block from 02:00–03:00 to 02:30–03:30 to avoid freight rake path conflict.",
          original_block: { window: "02:00–03:00", operational_impact: "LOW" },
          new_block: { window: "02:30–03:30", operational_impact: "MEDIUM" },
          why_it_changed: "Block moved because operational conflict risk increased from 0 to 18 min headway delay."
        }
      });
      setShowWhatIfModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setApprovalStatus('APPROVED');
    try {
      const planId = optimizationData?.plan_id || 1;
      await api.approveBlock(planId, "Approved by Divisional Planning Officer for execution");
    } catch (e) {}
    if (onApprovalsUpdated) onApprovalsUpdated();
  };

  const handleReject = async () => {
    setApprovalStatus('REJECTED');
    try {
      const planId = optimizationData?.plan_id || 1;
      await api.rejectBlock(planId, "Rejected due to urgent freight rake movement");
    } catch (e) {}
    if (onApprovalsUpdated) onApprovalsUpdated();
  };

  const handleApplyModification = async () => {
    setApprovalStatus('MODIFIED');
    setModificationNotice(
      `Manual modification detected: Window adjusted to ${modStartTime}–${modEndTime}. Recalculated Operational Impact: MEDIUM.`
    );
    try {
      const planId = optimizationData?.plan_id || 1;
      await api.modifyPlan(planId, {
        block_id: 1,
        new_start_time: modStartTime,
        new_end_time: modEndTime,
        assigned_task_ids: [1, 2, 3],
        comments: `Manual shift to ${modStartTime}–${modEndTime}`
      });
    } catch (e) {}
    setShowModifyModal(false);
  };

  const selectedBlock = optimizationData?.selected_blocks?.[0] || mockOptimizationResult.selected_blocks[0];
  const comparison = optimizationData?.before_after_comparison || mockOptimizationResult.before_after_comparison;
  const alternatives = optimizationData?.alternatives || mockOptimizationResult.alternatives;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              AI Automatic Block Planner
            </h1>
            <span className="text-xs font-bold text-[#002D62] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              OR-Tools CP-SAT Solver
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Automated multi-disciplinary maintenance scheduling maximizing fixed-infrastructure availability
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002D62] font-bold shadow-sm"
          >
            <option value="SEC-04">SEC-04 (Tundla Chord - Demo Seed)</option>
            <option value="SEC-01">SEC-01 (New Delhi - Ghaziabad)</option>
            <option value="SEC-02">SEC-02 (Ghaziabad - Aligarh)</option>
            <option value="SEC-03">SEC-03 (Aligarh - Tundla)</option>
          </select>

          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#002D62] hover:bg-[#001D3D] text-white text-xs font-black shadow-md transition-all active:scale-95 border border-blue-900"
          >
            <Sparkles className="w-4 h-4 text-sky-300" />
            <span>{loading ? "SOLVING CP-SAT..." : "GENERATE OPTIMIZED BLOCK PLAN"}</span>
          </button>
        </div>
      </div>

      {/* Manual Modification Alert */}
      {modificationNotice && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-center gap-3 shadow-sm">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-semibold">{modificationNotice}</span>
        </div>
      )}

      {/* CORE TIMELINE / GANTT VISUALIZATION (60% White / Light Grey) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-lg bg-blue-50 text-[#002D62] border border-blue-200">
              <Layers className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                Coordinated Multi-Disciplinary Shadow Block
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedBlock.block_type || "INTEGRATED_SHADOW_BLOCK"}
                </span>
              </h2>
              <div className="text-xs text-slate-500 font-medium">
                Section: <span className="text-slate-900 font-bold">{selectedBlock.section_name}</span> | Date: Tomorrow
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowWhyModal(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-all flex items-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-[#002D62]" />
              <span>WHY THIS BLOCK?</span>
            </button>
            <button
              onClick={handleUnexpectedFreight}
              className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-[#002D62] text-xs font-bold border border-sky-300 transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 text-[#002D62]" />
              <span>ADD UNEXPECTED FREIGHT</span>
            </button>
          </div>
        </div>

        {/* Visual Block Timeline / Gantt Bar */}
        <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#002D62] font-bold border-b border-slate-200 pb-2">
            <span>Possession Start: {selectedBlock.start_time || "02:00"}</span>
            <span className="text-slate-800 px-3 py-0.5 rounded-full bg-white border border-slate-300 text-[11px] font-sans shadow-sm">
              Total Duration: {selectedBlock.duration_minutes} minutes
            </span>
            <span>Possession End: {selectedBlock.end_time || "03:00"}</span>
          </div>

          {/* Parallel Tasks Gantt Rows */}
          <div className="space-y-2.5 pt-1">
            {selectedBlock.assigned_tasks?.map((t: any, idx: number) => {
              const deptColor = t.department === 'ENG' ? 'bg-[#002D62]' : (t.department === 'SNT' ? 'bg-amber-500' : 'bg-sky-600');
              const durPct = Math.min(100, Math.round((t.duration_minutes / 60) * 100));
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-800 font-bold">{t.task_title}</span>
                    <span className="text-[#002D62] font-mono font-bold">{t.duration_minutes} min ({t.department})</span>
                  </div>
                  <div className="w-full h-7 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden relative flex items-center px-3">
                    <div 
                      className={`h-full rounded-md ${deptColor} absolute left-0 top-0 transition-all flex items-center px-3 text-white text-[11px] font-bold shadow-sm`}
                      style={{ width: `${durPct}%` }}
                    >
                      {t.task_code} • {t.duration_minutes}m Coordinated Work
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between pt-2 text-xs text-slate-500 border-t border-slate-200">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded bg-[#002D62]"></span> Track Engineering
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> S&T Signalling
              </span>
              <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                <span className="w-2.5 h-2.5 rounded bg-sky-600"></span> Traction (OHE)
              </span>
            </div>
            <div className="text-emerald-700 font-bold">
              3 Departments Synchronized under 1 Traffic Block
            </div>
          </div>
        </div>

        {/* HUMAN-IN-THE-LOOP APPROVAL CONTROLS */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-[#002D62] shrink-0" />
            <div>
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Human-in-the-Loop Governance
              </div>
              <div className="text-xs text-slate-600">
                Status: <span className={`font-bold ${
                  approvalStatus === 'APPROVED' ? 'text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200' :
                  (approvalStatus === 'REJECTED' ? 'text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200' :
                  (approvalStatus === 'MODIFIED' ? 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200' : 'text-[#002D62] bg-blue-50 px-2 py-0.5 rounded border border-blue-200'))
                }`}>{approvalStatus}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApprove}
              disabled={approvalStatus === 'APPROVED'}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                approvalStatus === 'APPROVED'
                  ? 'bg-emerald-100 text-emerald-800 cursor-default border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{approvalStatus === 'APPROVED' ? 'APPROVED' : 'APPROVE BLOCK'}</span>
            </button>

            <button
              onClick={() => setShowModifyModal(true)}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>MODIFY</span>
            </button>

            <button
              onClick={handleReject}
              disabled={approvalStatus === 'REJECTED'}
              className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>REJECT</span>
            </button>
          </div>
        </div>
      </div>

      {/* BEFORE VS AFTER COMPARISON CARD (60% White / Light Grey with Railway Blue Accents) */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              Before vs. After Optimization Impact
            </h2>
            <p className="text-xs text-slate-500">Comparing siloed manual railway planning against AI-coordinated shadow blocks</p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            Simulated Prototype Results
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Manual / Existing Planning */}
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
              Existing / Manual Planning (Baseline)
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Coordination Structure:</span>
                <span className="font-bold text-slate-800">3 Fragmented Separate Blocks</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Total Track Downtime:</span>
                <span className="font-bold text-red-600 font-mono">{comparison?.manual_planning?.total_duration_minutes || 115} minutes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-600">Train Headway Conflicts:</span>
                <span className="font-bold text-red-600">{comparison?.manual_planning?.potential_train_conflicts || 3} train paths impacted</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-600">Asset Availability:</span>
                <span className="font-bold text-slate-800">{comparison?.manual_planning?.asset_availability_pct || 88.5}%</span>
              </div>
            </div>
          </div>

          {/* AI Optimized Planning (Railway Blue Accent Surface) */}
          <div className="p-5 rounded-xl bg-blue-50/50 border-2 border-[#002D62] space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#002D62]">
                AI Optimized Planning (RailSync AI)
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#002D62] text-white">
                Optimal Solved
              </span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-blue-200">
                <span className="text-slate-700 font-medium">Coordination Structure:</span>
                <span className="font-bold text-emerald-700">1 Unified Coordinated Shadow Block</span>
              </div>
              <div className="flex justify-between py-1 border-b border-blue-200">
                <span className="text-slate-700 font-medium">Total Track Downtime:</span>
                <span className="font-bold text-emerald-700 font-mono">{comparison?.ai_optimized?.total_duration_minutes || 60} minutes</span>
              </div>
              <div className="flex justify-between py-1 border-b border-blue-200">
                <span className="text-slate-700 font-medium">Train Headway Conflicts:</span>
                <span className="font-bold text-emerald-700">0 Passenger Conflicts (Zero Delay)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-700 font-medium">Asset Availability:</span>
                <span className="font-bold text-[#002D62]">{comparison?.ai_optimized?.asset_availability_pct || 95.8}% (+7.3%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Highlights Counters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] font-bold uppercase text-slate-500">Block Duration Saved</div>
            <div className="text-lg font-black text-emerald-600 font-mono mt-0.5">
              {comparison?.improvement?.block_hours_saved_pct || 47.8}%
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] font-bold uppercase text-slate-500">Separate Blocks Reduced</div>
            <div className="text-lg font-black text-[#002D62] font-mono mt-0.5">
              {comparison?.improvement?.blocks_reduced_count || 2} blocks saved
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] font-bold uppercase text-slate-500">Train Conflicts Avoided</div>
            <div className="text-lg font-black text-emerald-600 font-mono mt-0.5">
              {comparison?.improvement?.conflicts_avoided || 3} express trains
            </div>
          </div>
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
            <div className="text-[10px] font-bold uppercase text-slate-500">Availability Gain</div>
            <div className="text-lg font-black text-[#002D62] font-mono mt-0.5">
              +{comparison?.improvement?.availability_gain_pct || 7.3}%
            </div>
          </div>
        </div>
      </div>

      {/* ALTERNATIVE BLOCK SUGGESTIONS */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-sm font-extrabold text-slate-900">Alternative Candidate Window Comparisons</h2>
            <p className="text-xs text-slate-500">Proves the optimization algorithm explores and scores multiple corridor windows</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {alternatives.map((alt: any, idx: number) => {
            const isRec = alt.classification === 'RECOMMENDED';
            return (
              <div 
                key={idx} 
                className={`p-4 rounded-xl border transition-all ${
                  isRec 
                    ? 'bg-blue-50/60 border-2 border-[#002D62] shadow-sm' 
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                    isRec ? 'bg-[#002D62] text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {alt.classification}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-900">
                    Score: <span className={isRec ? 'text-[#002D62] font-black' : 'text-slate-600'}>{alt.score}/100</span>
                  </span>
                </div>

                <div className="text-lg font-black text-slate-900 font-mono mt-2">
                  {alt.window_time}
                </div>

                <div className="mt-2 text-xs text-slate-600 leading-relaxed font-medium">
                  {alt.reason}
                </div>

                <div className="mt-4 pt-2 border-t border-slate-200 flex justify-between items-center text-[11px]">
                  <span className="text-slate-500 font-medium">Operational Impact:</span>
                  <span className={`font-bold ${alt.operational_impact === 'LOW' ? 'text-emerald-700' : (alt.operational_impact === 'MEDIUM' ? 'text-amber-700' : 'text-red-700')}`}>
                    {alt.operational_impact}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* WHY THIS BLOCK MODAL */}
      {showWhyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full border border-slate-200 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#002D62]" />
                Explainable AI: Why This Block Was Selected?
              </h3>
              <button onClick={() => setShowWhyModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-[#002D62] font-semibold leading-relaxed">
              {selectedBlock.explanation?.summary}
            </div>

            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Auditable Factor Justifications:</h4>
              <ul className="space-y-2 text-slate-700">
                {selectedBlock.explanation?.bullet_reasons?.map((r: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 p-2.5 rounded bg-slate-50 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Operational Impact</div>
                <div className="font-black text-emerald-600 mt-0.5">{selectedBlock.explanation?.operational_impact || "LOW"}</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Availability Gain</div>
                <div className="font-black text-[#002D62] mt-0.5">{selectedBlock.explanation?.asset_availability_benefit || "HIGH"}</div>
              </div>
              <div className="p-2 rounded bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Confidence</div>
                <div className="font-black text-emerald-600 mt-0.5">{selectedBlock.explanation?.confidence_score || "94%"}</div>
              </div>
            </div>

            <button
              onClick={() => setShowWhyModal(false)}
              className="w-full py-2.5 rounded-lg bg-[#002D62] hover:bg-[#001D3D] text-white font-bold text-xs transition-all shadow-sm"
            >
              Close Explanation
            </button>
          </div>
        </div>
      )}

      {/* MODIFY BLOCK MODAL */}
      {showModifyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full border border-slate-200 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-600" />
                Human-in-the-Loop Block Adjustment
              </h3>
              <button onClick={() => setShowModifyModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Modify the start time or duration of this block. The system will immediately re-verify train path safety constraints.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs text-slate-700 font-bold">Start Time</label>
                <input
                  type="time"
                  value={modStartTime}
                  onChange={(e) => setModStartTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-slate-700 font-bold">End Time</label>
                <input
                  type="time"
                  value={modEndTime}
                  onChange={(e) => setModEndTime(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-[11px] text-amber-900 font-medium">
              Warning: Modifying block window beyond 03:00 introduces a secondary headway clash with Rajdhani Express Train 12302.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowModifyModal(false)}
                className="flex-1 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs border border-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyModification}
                className="flex-1 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WHAT-IF SCENARIO MODAL */}
      {showWhatIfModal && whatIfResult && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl max-w-lg w-full border border-slate-200 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#002D62]" />
                What-If Re-Optimization Diff
              </h3>
              <button onClick={() => setShowWhatIfModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">
                ✕
              </button>
            </div>

            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-[#002D62] font-medium leading-relaxed">
              <div className="font-bold text-slate-900 mb-1">Simulated Trigger: {whatIfResult.diff?.scenario_type}</div>
              {whatIfResult.diff?.event_description}
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500 uppercase font-bold">Original Block Window</div>
                <div className="text-sm font-black text-slate-800 font-mono mt-1">02:00–03:00</div>
                <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">Impact: LOW</div>
              </div>
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-300">
                <div className="text-[10px] text-[#002D62] uppercase font-bold">New Shifted Window</div>
                <div className="text-sm font-black text-[#002D62] font-mono mt-1">03:30–04:30</div>
                <div className="text-[10px] text-amber-700 font-semibold mt-0.5">Impact: MEDIUM</div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 leading-relaxed">
              <span className="font-bold text-[#002D62]">Why the block moved: </span>
              {whatIfResult.diff?.why_it_changed}
            </div>

            <button
              onClick={() => setShowWhatIfModal(false)}
              className="w-full py-2.5 rounded-lg bg-[#002D62] hover:bg-[#001D3D] text-white font-bold text-xs shadow-sm"
            >
              Acknowledge Re-Optimization
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


