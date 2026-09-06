import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const DefectsPage: React.FC = () => {
  const defects = [
    { code: "DEF-TRK-002", asset: "AST-TRK-401", sec: "SEC-04", type: "WELD_DEFECT_AT", desc: "Alumino-thermic (AT) weld defective on turnout tongue rail SEC-04", sev: "CRITICAL", safety: true, status: "OPEN" },
    { code: "DEF-TRK-001", asset: "AST-TRK-102", sec: "SEC-01", type: "SURFACE_CRACK", desc: "Internal transverse fatigue crack in rail head detected by USFD testing", sev: "CRITICAL", safety: true, status: "OPEN" },
    { code: "DEF-SIG-001", asset: "AST-SIG-201", sec: "SEC-02", type: "BACKLASH_EXCESS", desc: "Point machine stroke backlash exceeds RDSO permissible tolerance (4.2mm)", sev: "HIGH", safety: true, status: "OPEN" },
    { code: "DEF-TRD-001", asset: "AST-TRD-202", sec: "SEC-02", type: "WIRE_WEAR_HIGH", desc: "Contact wire cross-sectional wear reached 24% at dropper junction km 93/4", sev: "CRITICAL", safety: true, status: "OPEN" },
    { code: "DEF-SIG-002", asset: "AST-SIG-401", sec: "SEC-04", type: "MOTOR_CURRENT_SPIKE", desc: "Peak operating current fluctuation on point machine motor SEC-04", sev: "HIGH", safety: false, status: "OPEN" },
    { code: "DEF-TRD-002", asset: "AST-TRD-401", sec: "SEC-04", type: "STAGGER_DISPLACEMENT", desc: "Contact wire stagger offset by +80mm due to cantilever bracket slip", sev: "HIGH", safety: true, status: "OPEN" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Defect & Flaw Detection Registry
          </h1>
          <span className="text-xs font-bold text-red-700 px-2.5 py-0.5 rounded-full bg-red-50 border border-red-200">
            Safety Priority Feed
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Ultrasonic Flaw Detection (USFD), track geometry car, and OHE inspection exception logs
        </p>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200 text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Defect Code</th>
              <th className="py-3.5 px-4">Asset ID</th>
              <th className="py-3.5 px-4">Section</th>
              <th className="py-3.5 px-4">Defect Type</th>
              <th className="py-3.5 px-4">Description</th>
              <th className="py-3.5 px-4 text-center">Severity</th>
              <th className="py-3.5 px-4 text-center">Safety Risk</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {defects.map((d, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-all">
                <td className="py-3.5 px-4 font-mono font-black text-red-600">{d.code}</td>
                <td className="py-3.5 px-4 font-mono text-slate-700">{d.asset}</td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{d.sec}</td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">{d.type}</td>
                <td className="py-3.5 px-4 max-w-sm text-slate-900 font-medium">{d.desc}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                    d.sev === 'CRITICAL' ? 'bg-red-50 text-red-800 border border-red-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {d.sev}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  {d.safety ? (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-800 border border-red-200 inline-flex items-center justify-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-600" /> Safety Risk
                    </span>
                  ) : (
                    <span className="text-slate-500 font-medium">Operational</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                    {d.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

