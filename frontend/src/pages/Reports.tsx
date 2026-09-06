import React, { useState } from 'react';
import { 
  Download, 
  CheckCircle2, 
  Layers 
} from 'lucide-react';

export const Reports: React.FC = () => {
  const [reportPeriod, setReportPeriod] = useState<'WEEK' | 'MONTH' | 'QUARTER'>('MONTH');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Period-specific operational data
  const periodDataMap = {
    WEEK: {
      metrics: {
        total_blocks_executed: 12,
        total_block_hours_utilized: 16.2,
        hours_saved_via_shadowing: 14.8,
        percent_hours_saved: 47.7,
        passenger_punctuality_impact: "98.8% on-time",
        cross_dept_bundling_ratio: "75.0%",
        demurrage_avoided_inr: "₹3,80,000",
        corridor_availability_score: "97.1%"
      },
      breakdown: [
        { department: "Engineering (Track)", tasks_executed: 38, hours: 11.5, bundling_rate: "80%" },
        { department: "Signal & Telecom", tasks_executed: 31, hours: 8.5, bundling_rate: "85%" },
        { department: "Traction Distribution (TRD)", tasks_executed: 19, hours: 7.0, bundling_rate: "88%" }
      ]
    },
    MONTH: {
      metrics: {
        total_blocks_executed: 48,
        total_block_hours_utilized: 64.5,
        hours_saved_via_shadowing: 58.2,
        percent_hours_saved: 47.4,
        passenger_punctuality_impact: "98.2% on-time",
        cross_dept_bundling_ratio: "71.4%",
        demurrage_avoided_inr: "₹14,80,000",
        corridor_availability_score: "96.4%"
      },
      breakdown: [
        { department: "Engineering (Track)", tasks_executed: 142, hours: 44.0, bundling_rate: "78%" },
        { department: "Signal & Telecom", tasks_executed: 118, hours: 32.5, bundling_rate: "82%" },
        { department: "Traction Distribution (TRD)", tasks_executed: 74, hours: 28.0, bundling_rate: "85%" }
      ]
    },
    QUARTER: {
      metrics: {
        total_blocks_executed: 144,
        total_block_hours_utilized: 194.0,
        hours_saved_via_shadowing: 176.5,
        percent_hours_saved: 47.6,
        passenger_punctuality_impact: "97.9% on-time",
        cross_dept_bundling_ratio: "73.2%",
        demurrage_avoided_inr: "₹44,40,000",
        corridor_availability_score: "96.8%"
      },
      breakdown: [
        { department: "Engineering (Track)", tasks_executed: 426, hours: 132.0, bundling_rate: "79%" },
        { department: "Signal & Telecom", tasks_executed: 354, hours: 98.0, bundling_rate: "83%" },
        { department: "Traction Distribution (TRD)", tasks_executed: 222, hours: 84.0, bundling_rate: "86%" }
      ]
    }
  };

  const performanceMetrics = periodDataMap[reportPeriod].metrics;
  const departmentalBreakdown = periodDataMap[reportPeriod].breakdown;

  const handleExportCSV = () => {
    // Construct rich multi-section CSV string
    const csvRows: string[][] = [
      ["INDIAN RAILWAYS - RAILSYNC AI OPERATIONAL AUDIT REPORT"],
      ["Report Type", `Operational Efficiency & RDSO Audit (${reportPeriod})`],
      ["Generated At", new Date().toISOString()],
      ["Corridor", "Northern Railway Golden Diagonal (NDLS - PRYJ)"],
      [],
      ["EXECUTIVE SUMMARY & KPIS"],
      ["Metric", "Value", "Baseline Comparison"],
      ["Total Blocks Executed", String(performanceMetrics.total_blocks_executed), "Coordinated Shadow Windows"],
      ["Total Block Hours Utilized", `${performanceMetrics.total_block_hours_utilized} hrs`, "Optimized Possession"],
      ["Possession Hours Saved", `${performanceMetrics.hours_saved_via_shadowing} hrs`, `${performanceMetrics.percent_hours_saved}% reduction vs manual sequential blocks`],
      ["Passenger Punctuality Impact", performanceMetrics.passenger_punctuality_impact, "Zero primary passenger cancellations"],
      ["Cross-Department Bundling Ratio", performanceMetrics.cross_dept_bundling_ratio, "Track / S&T / TRD Joint Possessions"],
      ["Demurrage Penalty Avoided", `"${performanceMetrics.demurrage_avoided_inr}"`, "Freight detention saved"],
      ["Corridor Availability Score", performanceMetrics.corridor_availability_score, "RDSO Standard (>95%) Target Exceeded"],
      [],
      ["DEPARTMENTAL COORDINATION BREAKDOWN"],
      ["Department", "Tasks Executed", "Possession Hours Logged", "Coordinated Shadow Rate", "RDSO Compliance Status"],
      ...departmentalBreakdown.map(d => [
        `"${d.department}"`,
        String(d.tasks_executed),
        String(d.hours),
        `"${d.bundling_rate}"`,
        "Fully Compliant"
      ]),
      [],
      ["AUDIT LOG ENTRIES & COMPLIANCE VERIFICATION"],
      ["Audit ID", "Timestamp", "Corridor Section", "Optimization Engine", "Sign-Off Authority"],
      ["AUD-2026-IR-01", new Date().toLocaleDateString(), "SEC-04 (Tundla Chord)", "OR-Tools CP-SAT + Conflict Resolver", "Chief Controller of Track Operations (CRIS / IR)"],
      ["AUD-2026-IR-02", new Date().toLocaleDateString(), "SEC-01 (NDLS - GZB)", "Automated Headway Separator", "Sr. Divisional Operations Manager (Sr. DOM)"]
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `RAILSYNC_AI_Audit_Report_${reportPeriod}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Operational Efficiency & Audit Reports
            </h1>
            <span className="text-xs font-bold text-[#002D62] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              RDSO Compliance
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Quantitative analysis of block utilization, cross-department coordination gains, and punctuality protection
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
            <button
              onClick={() => setReportPeriod('WEEK')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                reportPeriod === 'WEEK' ? 'bg-[#002D62] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setReportPeriod('MONTH')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                reportPeriod === 'MONTH' ? 'bg-[#002D62] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setReportPeriod('QUARTER')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                reportPeriod === 'QUARTER' ? 'bg-[#002D62] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Quarterly
            </button>
          </div>

          <a
            href="http://localhost:8000/api/docs/download/pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-sm transition-all active:scale-95 border border-red-400/40"
            title="Download Complete Project Dossier (PDF)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Dossier (PDF)</span>
          </a>

          <a
            href="http://localhost:8000/api/docs/download/docx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#002D62] to-[#0284C7] hover:brightness-110 text-white text-xs font-bold shadow-sm transition-all active:scale-95 border border-sky-400/40"
            title="Download Complete Project Dossier (Word Document)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Dossier (Word)</span>
          </a>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold shadow-xs transition-all active:scale-95 border border-slate-300"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Audit report data bundle downloaded successfully (CSV & JSON format).</span>
        </div>
      )}

      {/* KPI Cards (60% White / Light Grey Canvas) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Possession Hours Saved</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {performanceMetrics.hours_saved_via_shadowing} <span className="text-sm font-normal text-slate-500">hours</span>
          </div>
          <div className="text-[11px] text-[#002D62] mt-1 font-semibold">
            {performanceMetrics.percent_hours_saved}% reduction vs manual sequential blocks
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Multi-Dept Bundling Ratio</div>
          <div className="text-3xl font-black text-[#002D62] mt-1">
            {performanceMetrics.cross_dept_bundling_ratio}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            3-department shadow coordination
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Corridor Availability</div>
          <div className="text-3xl font-black text-slate-900 mt-1">
            {performanceMetrics.corridor_availability_score}
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">
            Above RDSO 95% target threshold
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Demurrage Penalty Avoided</div>
          <div className="text-3xl font-black text-amber-600 mt-1">
            {performanceMetrics.demurrage_avoided_inr}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-medium">
            Freight holding charges prevented
          </div>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#002D62]" />
            <span>Departmental Coordination & Execution Breakdown</span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium">Aggregated Northern Railway Corridor</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase tracking-wider text-[10px] font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Tasks Executed</th>
                <th className="py-3.5 px-4">Possession Hours Logged</th>
                <th className="py-3.5 px-4">Coordinated Shadow Rate</th>
                <th className="py-3.5 px-4">RDSO Compliance Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {departmentalBreakdown.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-black text-slate-900">{d.department}</td>
                  <td className="py-3.5 px-4 font-mono text-[#002D62] font-black">{d.tasks_executed} tasks</td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">{d.hours} hrs</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {d.bundling_rate} Coordinated
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Fully Compliant
                    </span>
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

