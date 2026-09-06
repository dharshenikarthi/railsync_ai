import React from 'react';

export const AssetsPage: React.FC = () => {
  const assets = [
    { code: "AST-TRK-401", name: "SEC-04 Up Main Turnout 204", type: "TURNOUT", dept: "Engineering", km: 142.2, health: 60, status: "DEGRADED", crit: "CRITICAL" },
    { code: "AST-SIG-401", name: "SEC-04 S&T Point Machine PM-401", type: "POINT_MACHINE", dept: "S&T", km: 142.3, health: 68, status: "OPERATIONAL", crit: "HIGH" },
    { code: "AST-TRD-401", name: "SEC-04 OHE Catenary & Contact Wire", type: "CONTACT_WIRE", dept: "Traction", km: 142.2, health: 62, status: "DEGRADED", crit: "CRITICAL" },
    { code: "AST-TRK-102", name: "Curved Track km 18/2-6 Up Line", type: "TRACK_SEGMENT", dept: "Engineering", km: 18.3, health: 65, status: "DEGRADED", crit: "CRITICAL" },
    { code: "AST-SIG-201", name: "Point Machine 202A Electric", type: "POINT_MACHINE", dept: "S&T", km: 55.0, health: 62, status: "DEGRADED", crit: "CRITICAL" },
    { code: "AST-TRD-202", name: "Contact Wire Regulated km 90-95", type: "CONTACT_WIRE", dept: "Traction", km: 92.0, health: 55, status: "DEGRADED", crit: "CRITICAL" },
    { code: "AST-TRK-201", name: "Continuous Welded Rail km 45-48", type: "RAIL_CWR", dept: "Engineering", km: 46.5, health: 88, status: "OPERATIONAL", crit: "MEDIUM" },
    { code: "AST-SIG-102", name: "Digital Axle Counter DAC-01-UP", type: "AXLE_COUNTER", dept: "S&T", km: 15.1, health: 84, status: "OPERATIONAL", crit: "MEDIUM" }
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Fixed Assets & Infrastructure Registry
          </h1>
          <span className="text-xs font-bold text-[#002D62] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
            TMS / SMMS / TDMS Cross-Link
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Telemetry condition monitoring, asset health indices, and preventive maintenance cycles
        </p>
      </div>

      <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200 text-[10px]">
            <tr>
              <th className="py-3.5 px-4">Asset Code</th>
              <th className="py-3.5 px-4">Asset Description</th>
              <th className="py-3.5 px-4">Type</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Location (km)</th>
              <th className="py-3.5 px-4 text-center">Health Score</th>
              <th className="py-3.5 px-4 text-center">Criticality</th>
              <th className="py-3.5 px-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {assets.map((a, idx) => (
              <tr key={idx} className="hover:bg-slate-50/80 transition-all">
                <td className="py-3.5 px-4 font-mono font-black text-[#002D62]">{a.code}</td>
                <td className="py-3.5 px-4 font-bold text-slate-900">{a.name}</td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">{a.type}</td>
                <td className="py-3.5 px-4 font-bold text-slate-800">{a.dept}</td>
                <td className="py-3.5 px-4 font-mono text-slate-600 font-medium">{a.km} km</td>
                <td className="py-3.5 px-4 text-center font-bold">
                  <span className={a.health < 70 ? 'text-amber-600 font-black' : 'text-emerald-600 font-black'}>{a.health}/100</span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-black ${
                    a.crit === 'CRITICAL' ? 'bg-red-50 text-red-800 border border-red-200' :
                    (a.crit === 'HIGH' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                    'bg-slate-100 text-slate-700')
                  }`}>
                    {a.crit}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                    a.status === 'OPERATIONAL' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {a.status}
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

