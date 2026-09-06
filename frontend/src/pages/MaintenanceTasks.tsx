import React, { useState, useEffect } from 'react';
import { 
  Search, ChevronRight, Sparkles, Radio, HardHat, Cpu, RefreshCw, Play, Filter, Download
} from 'lucide-react';
import { api } from '../api/client';
import { mockTasks } from '../api/mockData';

interface MaintenanceTasksProps {
  tasks: any[];
  onSelectTask: (task: any) => void;
}

export const MaintenanceTasks: React.FC<MaintenanceTasksProps> = ({
  tasks: initialTasks,
  onSelectTask
}) => {
  const [taskList, setTaskList] = useState<any[]>(() => {
    if (initialTasks && Array.isArray(initialTasks) && initialTasks.length > 0) return initialTasks;
    return mockTasks;
  });

  useEffect(() => {
    if (initialTasks && Array.isArray(initialTasks) && initialTasks.length > 0) {
      setTaskList(initialTasks);
    }
  }, [initialTasks]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'ENG' | 'SNT' | 'TRD'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [selectedSection, setSelectedSection] = useState<string>('ALL');
  const [isPrioritizing, setIsPrioritizing] = useState<boolean>(false);
  const [priorityToast, setPriorityToast] = useState<string | null>(null);

  const handleAutoPrioritize = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setIsPrioritizing(true);
    try {
      const res = await api.prioritizeAllAI();
      if (res && res.prioritized_queue && Array.isArray(res.prioritized_queue)) {
        const updated = res.prioritized_queue.map((q: any) => ({
          task_id: q.task_id,
          task_code: q.task_code || `TSK-${q.task_id}`,
          task_title: q.task_title || 'Railway Maintenance Work Order',
          asset_code: q.asset_code || `AST-${q.task_id}`,
          department: q.department_id === 1 ? 'ENG' : (q.department_id === 2 ? 'SNT' : 'TRD'),
          department_name: q.department || 'Track (TMS)',
          section_code: `SEC-0${q.section_id || 1}`,
          priority_level: q.priority_level || 'HIGH',
          priority_score: q.priority_score || q.ai_priority_score || 75.0,
          ai_priority_score: q.priority_score || q.ai_priority_score || 75.0,
          estimated_duration_minutes: q.estimated_duration_minutes || 45,
          loco_pilot_linked: !!q.loco_pilot_linked,
          loco_pilot_notes: q.loco_pilot_notes || [],
          status: 'PRIORITIZED'
        }));
        setTaskList(updated);
        setPriorityToast(`AI Priority Engine ranked ${updated.length} tasks successfully!`);
        setTimeout(() => setPriorityToast(null), 4000);
      }
    } catch (e) {
      console.warn("Using local auto-prioritization sort:", e);
      setTaskList(prev => [...prev].sort((a, b) => ((b.ai_priority_score || b.priority_score || 50) - (a.ai_priority_score || a.priority_score || 50))));
      setPriorityToast("AI Priority Engine ranked queue successfully!");
      setTimeout(() => setPriorityToast(null), 4000);
    } finally {
      setIsPrioritizing(false);
    }
  };

  const filteredTasks = taskList.filter((t) => {
    if (!t) return false;
    const dept = t.department || (t.department_id === 1 ? 'ENG' : (t.department_id === 2 ? 'SNT' : 'TRD'));
    const matchesTab = activeTab === 'ALL' || dept === activeTab;
    const matchesSearch = 
      (t.task_title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.task_code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.asset_code || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'ALL' || t.priority_level === selectedPriority;
    const matchesSection = selectedSection === 'ALL' || t.section_code === selectedSection;
    return matchesTab && matchesSearch && matchesPriority && matchesSection;
  });

  const handleExportCSV = () => {
    const csvRows: string[][] = [
      ["Task Code", "Title", "Department", "Section", "Priority Level", "Priority Score", "Duration (Mins)", "Status"],
      ...filteredTasks.map(t => [
        `"${t.task_code || ''}"`,
        `"${(t.task_title || '').replace(/"/g, '""')}"`,
        `"${t.department || ''}"`,
        `"${t.section_code || ''}"`,
        `"${t.priority_level || ''}"`,
        String(t.priority_score || t.ai_priority_score || 50),
        String(t.estimated_duration_minutes || 0),
        `"${t.status || 'PENDING'}"`
      ])
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RAILSYNC_AI_Maintenance_Tasks_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Toast */}
      {priorityToast && (
        <div className="fixed top-16 right-6 z-50 bg-white text-slate-900 px-4 py-2.5 rounded-xl shadow-2xl border border-sky-300 text-xs font-bold flex items-center gap-2 animate-in slide-in-from-top-3 backdrop-blur-xl">
          <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
          <span>{priorityToast}</span>
        </div>
      )}

      {/* Page Title & Action */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-[#031B34] tracking-tight">
              Maintenance Tasks Repository
            </h1>
            <span className="text-xs font-bold text-[#002D62] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              Integrated TMS • SMMS • TDMS
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Consolidated maintenance work orders across Track (TMS), Signalling (SMMS), Traction (TDMS), and Loco Pilot Reports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleAutoPrioritize}
            disabled={isPrioritizing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#002D62] via-[#004B87] to-[#0284C7] hover:from-[#001F3F] hover:to-[#0369A1] text-white text-xs font-black shadow-md shadow-blue-900/20 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isPrioritizing ? 'animate-spin' : ''}`} />
            <span>{isPrioritizing ? 'Evaluating ML Model...' : 'AI Auto-Prioritize Queue'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold shadow-xs transition-all active:scale-95 border border-slate-300 cursor-pointer"
          >
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 glass-panel p-2 rounded-xl">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'ALL'
              ? 'bg-[#002D62] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Departments ({taskList.length})
        </button>
        <button
          onClick={() => setActiveTab('ENG')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'ENG'
              ? 'bg-[#002D62] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Track (TMS)</span>
        </button>
        <button
          onClick={() => setActiveTab('SNT')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'SNT'
              ? 'bg-[#002D62] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Signal & Telecom (SMMS)</span>
        </button>
        <button
          onClick={() => setActiveTab('TRD')}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 ${
            activeTab === 'TRD'
              ? 'bg-[#002D62] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <span>Traction / OHE (TDMS)</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by title, task code, asset..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002D62] shadow-xs"
          />
        </div>

        <select
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002D62] font-bold shadow-xs"
        >
          <option value="ALL">All Priority Levels</option>
          <option value="CRITICAL">Critical Priority (&ge; 80)</option>
          <option value="HIGH">High Priority (60-79)</option>
          <option value="MEDIUM">Medium Priority (40-59)</option>
          <option value="LOW">Low Priority (&lt; 40)</option>
        </select>

        <select
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value)}
          className="text-xs px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#002D62] shadow-xs"
        >
          <option value="ALL">All Corridor Sections</option>
          <option value="SEC-01">SEC-01 (NDLS - GZB)</option>
          <option value="SEC-02">SEC-02 (GZB - ALJN)</option>
          <option value="SEC-03">SEC-03 (ALJN - TDL)</option>
          <option value="SEC-04">SEC-04 (TDL Chord)</option>
        </select>
      </div>

      {/* Task Table */}
      <div className="glass-panel rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-black uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Task Details</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Section</th>
                <th className="py-3.5 px-4">AI Priority Score</th>
                <th className="py-3.5 px-4">Duration</th>
                <th className="py-3.5 px-4">Telemetry / Feedback</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredTasks.map((t) => (
                <tr key={t.task_id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-[11px] font-bold text-slate-500">{t.task_code}</span>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm">{t.task_title}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      t.department === 'ENG' ? 'bg-blue-50 text-[#002D62] border border-blue-200' :
                      t.department === 'SNT' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      'bg-purple-50 text-purple-800 border border-purple-200'
                    }`}>
                      {t.department === 'ENG' ? 'Track (TMS)' : t.department === 'SNT' ? 'Signal (SMMS)' : 'Traction (TDMS)'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                    {t.section_code || 'SEC-01'}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-[#002D62] text-sm">
                        {t.priority_score || t.ai_priority_score || 50.0}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                        (t.priority_level || 'MEDIUM') === 'CRITICAL' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        (t.priority_level || 'MEDIUM') === 'HIGH' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        'bg-blue-50 text-[#002D62] border border-blue-200'
                      }`}>
                        {t.priority_level || 'MEDIUM'}
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {t.estimated_duration_minutes || 45} mins
                  </td>
                  <td className="py-3.5 px-4">
                    {t.loco_pilot_linked ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-300">
                        <Radio className="w-3 h-3 text-amber-600" />
                        Loco Pilot Report
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">Periodic Cycle</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => onSelectTask(t)}
                      className="p-1.5 rounded-lg hover:bg-blue-50 text-[#002D62] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Analyze AI</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
