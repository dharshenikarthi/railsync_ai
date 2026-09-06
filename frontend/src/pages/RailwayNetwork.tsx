import React, { useState, useEffect } from 'react';
import { 
  GitBranch, Train, MapPin, Activity, 
  AlertTriangle, ShieldCheck, Clock, Download, 
  Printer, Play, Pause, RefreshCw, Radio, Layers, Info, CheckCircle2
} from 'lucide-react';

interface NetworkProps {
  corridorSections: any[];
}

export const RailwayNetwork: React.FC<NetworkProps> = ({ corridorSections }) => {
  const [selectedSection, setSelectedSection] = useState<string>("SEC-04");
  const [isSimulating, setIsSimulating] = useState<boolean>(true);
  const [showCautionModal, setShowCautionModal] = useState<boolean>(false);
  const [selectedTrainDetail, setSelectedTrainDetail] = useState<any | null>(null);
  const [cautionToast, setCautionToast] = useState<string | null>(null);

  const handleIssueCautionOrder = () => {
    const cautionText = `================================================================================
INDIAN RAILWAYS — NORTH CENTRAL RAILWAY
DIVISIONAL CONTROL OFFICE (PRAYAGRAJ / DELHI DIVISION)
--------------------------------------------------------------------------------
FORM T/409: CAUTION ORDER & TEMPORARY SPEED RESTRICTION BULLETIN
================================================================================
Order Number   : T-409/NCR/2026/09/SEC04-89
Date & Time    : ${new Date().toLocaleDateString('en-GB')} ${new Date().toLocaleTimeString('en-IN')} IST
To             : Loco Pilot, Co-Pilot & Train Manager (Guard) of all UP/DOWN Trains
Corridor Sec   : SEC-04 (Tundla Chord Junction km 204/10 to km 205/04)

SPEED RESTRICTION PARAMETERS:
• Maximum Permissible Speed : 30 km/h (Normal Sectional Speed: 110 km/h)
• Track Kilometrage Range   : Km 204/10 to Km 205/04 (Length: 0.94 km)
• Reason for Caution Order  : Multi-Disciplinary Engineering Block:
                              - Track (TMS): Thermit Weld grinding & ultrasonic joint clamp
                              - Signal (SMMS): Point Machine #204 stroke calibration
                              - Traction (TDMS): 25kV Catenary dropper re-tensioning
• Caution Indicator Post    : 800m ahead of Km 204/10
• Speed Indicator Board     : 30m ahead of Km 204/10 (Board '30')
• Termination Indicator     : Board 'T/P' (Passenger) & 'T/G' (Goods) at Km 205/20

AUTHORIZATION & CO-ORDINATION:
• Issued by                 : Sr. Divisional Engineer (Sr. DEN / Co-ord, NCR)
• Traffic Sanction          : Chief Controller & Power Controller (Operating Dept)
• Optimization Reference    : RAILSYNC AI Block Allocation System (CRIS-NCR-v2.4)
• Distribution              : Station Masters (TDL, ALJN, CNB), Crew Booking Lobby
================================================================================
Generated via RAILSYNC AI Operating Command Console.
`;

    const blob = new Blob([cautionText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IR_Caution_Order_Form_T409_SEC04_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCautionToast("Caution Order Form T/409 downloaded & transmitted to Division Control & Station Masters!");
    setShowCautionModal(false);
    setTimeout(() => setCautionToast(null), 5000);
  };

  // Live Simulated Train Positions along Corridor (0 to 100%)
  const [liveTrains, setLiveTrains] = useState([
    {
      id: "T-22436",
      number: "22436",
      name: "Vande Bharat Express",
      type: "VB-16",
      loco: "WAP-7 #30452 GZB Shed",
      speedKmph: 130,
      direction: "DOWN",
      positionPct: 22,
      currentStation: "Between GZB & ALJN",
      signalAspect: "GREEN",
      status: "ON_TIME",
      delayMin: 0
    },
    {
      id: "T-12301",
      number: "12301",
      name: "Howrah Rajdhani Express",
      type: "LHB-22",
      loco: "WAP-7 #30219 HWH Shed",
      speedKmph: 125,
      direction: "DOWN",
      positionPct: 68,
      currentStation: "Approaching Tundla Jn (TDL)",
      signalAspect: "DOUBLE_YELLOW",
      status: "ON_TIME",
      delayMin: 0
    },
    {
      id: "T-BOXN",
      number: "FRT-9041",
      name: "Dadri CONCOR Container Rake",
      type: "FREIGHT-45",
      loco: "WAG-9HC #31890 TKD Shed",
      speedKmph: 75,
      direction: "UP",
      positionPct: 88,
      currentStation: "Between TDL & ALJN Up Chord",
      signalAspect: "RED",
      status: "HEAVY_FREIGHT",
      delayMin: 4
    }
  ]);

  // Train animation ticker
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setLiveTrains(prev => prev.map(t => {
        let newPos = t.direction === 'DOWN' ? t.positionPct + 0.8 : t.positionPct - 0.8;
        if (newPos > 96) newPos = 4;
        if (newPos < 4) newPos = 96;

        let aspect = "GREEN";
        if (newPos > 60 && newPos < 75) aspect = "DOUBLE_YELLOW";
        if (newPos >= 75 && newPos <= 82) aspect = "RED";

        return { ...t, positionPct: Math.round(newPos * 10) / 10, signalAspect: aspect };
      }));
    }, 800);
    return () => clearInterval(interval);
  }, [isSimulating]);

  const stations = [
    { code: "NDLS", name: "New Delhi", km: 0, platforms: 16, pos: 5 },
    { code: "GZB", name: "Ghaziabad Jn", km: 25.5, platforms: 6, pos: 25 },
    { code: "ALJN", name: "Aligarh Jn", km: 130.5, platforms: 7, pos: 52 },
    { code: "TDL", name: "Tundla Jn", km: 209.0, platforms: 5, pos: 75 },
    { code: "CNB", name: "Kanpur Central", km: 440.0, platforms: 10, pos: 95 }
  ];

  const timeSlots = [
    { time: "01:00", event: "Train 12418 (Prayagraj Exp)", type: "PASSENGER", status: "OCCUPIED", color: "#DC2626" },
    { time: "01:30", event: "Train 12398 (Mahabodhi Exp)", type: "PASSENGER", status: "OCCUPIED", color: "#DC2626" },
    { time: "02:00", event: "OPTIMAL WINDOW (No passenger paths)", type: "AVAILABLE", status: "OPTIMAL", color: "#059669" },
    { time: "02:30", event: "LOW Freight Probability (0.12)", type: "AVAILABLE", status: "OPTIMAL", color: "#059669" },
    { time: "03:05", event: "Train 12302 (Rajdhani Exp)", type: "PASSENGER", status: "OCCUPIED", color: "#DC2626" },
    { time: "03:30", event: "BOXN Coal Rake Forecast", type: "FREIGHT", status: "CONGESTED", color: "#D97706" },
    { time: "06:00", event: "Train 22436 (Vande Bharat Exp)", type: "PASSENGER", status: "OCCUPIED", color: "#DC2626" },
    { time: "08:15", event: "Train 64552 (MEMU Passenger)", type: "PASSENGER", status: "OCCUPIED", color: "#DC2626" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Caution Order Toast */}
      {cautionToast && (
        <div className="fixed top-16 right-6 z-50 bg-white text-slate-900 px-4 py-3 rounded-xl shadow-2xl border border-sky-300 text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top-3 backdrop-blur-xl">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{cautionToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Corridor Topology & Real-Time Section Dispatch
            </h1>
            <span className="text-xs font-bold text-[#002D62] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200 flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              <span>NR/NCR Golden Quad</span>
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Dynamic Indian Railways section string diagram with live train telemetry, automatic signals, and shadow blocks
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border shadow-sm transition-all ${
              isSimulating 
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100' 
                : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isSimulating ? "Live Telemetry Active" : "Telemetry Paused"}</span>
          </button>

          <button
            onClick={() => setShowCautionModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002D62] hover:bg-[#001D3D] text-white text-xs font-bold shadow-md transition-all active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-sky-300" />
            <span>Generate Caution Order (T/409)</span>
          </button>
        </div>
      </div>

      {/* Live Animated Track Schematic Diagram */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-200">
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#002D62]" />
            <span>Quad-Track Live Section: New Delhi (NDLS) ─── Ghaziabad ─── Aligarh ─── Tundla ─── Kanpur</span>
          </h2>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-ping"></span>
              <span className="text-slate-600 font-bold">🟢 Clear (Auto Aspect)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm"></span>
              <span className="text-slate-600 font-bold">🟡 Caution (Double Yellow)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-sm"></span>
              <span className="text-slate-600 font-bold">🔴 Block Occupied</span>
            </div>
          </div>
        </div>

        {/* Schematic Canvas with Moving Trains */}
        <div className="relative py-12 px-6 overflow-x-auto select-none bg-slate-900 rounded-xl text-white shadow-inner">
          {/* Track Lines */}
          <div className="absolute top-[40%] left-8 right-8 h-2 bg-slate-700 rounded-full border-t border-b border-slate-600"></div>
          <div className="absolute top-[60%] left-8 right-8 h-2 bg-slate-700 rounded-full border-t border-b border-slate-600"></div>

          {/* Section 4 Shadow Block Zone Overlay */}
          <div className="absolute top-[35%] bottom-[35%] left-[62%] right-[22%] bg-emerald-500/20 border-2 border-dashed border-emerald-400 rounded-lg flex items-center justify-center pointer-events-none">
            <span className="text-[10px] font-mono font-bold text-emerald-300 bg-slate-950/80 px-2 py-0.5 rounded border border-emerald-500/50">
              SEC-04 AI SHADOW BLOCK ZONE (02:00-03:00)
            </span>
          </div>

          {/* Moving Train Markers on Tracks */}
          {liveTrains.map((train) => (
            <div
              key={train.id}
              onClick={() => setSelectedTrainDetail(train)}
              style={{ left: `${train.positionPct}%` }}
              className={`absolute cursor-pointer transition-all duration-700 -translate-x-1/2 z-20 ${
                train.direction === 'DOWN' ? 'top-[22%]' : 'top-[68%]'
              }`}
            >
              <div className={`p-1.5 rounded-lg border shadow-lg flex items-center gap-1.5 transition-transform hover:scale-110 active:scale-95 ${
                train.type.includes('VB') 
                  ? 'bg-blue-600 border-sky-300 text-white' 
                  : train.type.includes('FREIGHT')
                  ? 'bg-amber-600 border-amber-300 text-white'
                  : 'bg-indigo-700 border-indigo-300 text-white'
              }`}>
                <Train className="w-3.5 h-3.5 shrink-0" />
                <div className="text-[10px] font-extrabold whitespace-nowrap">
                  {train.number} ({train.speedKmph} km/h)
                </div>
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  train.signalAspect === 'GREEN' ? 'bg-emerald-400 shadow-md' :
                  train.signalAspect === 'DOUBLE_YELLOW' ? 'bg-amber-400' : 'bg-red-500 animate-ping'
                }`} />
              </div>
            </div>
          ))}

          {/* Fixed Station Nodes */}
          <div className="relative flex justify-between items-center min-w-[750px] z-10">
            {stations.map((s, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-sky-400 flex items-center justify-center shadow-lg text-sky-300 font-black text-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="mt-2 text-center">
                  <div className="text-xs font-black text-white tracking-wider">{s.code}</div>
                  <div className="text-[10px] text-slate-400 font-semibold">{s.name}</div>
                  <div className="text-[9px] text-sky-300 font-mono font-bold mt-0.5">{s.km} km</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Active Train Inspector Banner */}
        {selectedTrainDetail && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-[#002D62] text-white flex items-center justify-center shrink-0">
                <Train className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-slate-900 text-sm">
                  {selectedTrainDetail.number} — {selectedTrainDetail.name}
                </div>
                <div className="text-slate-600 text-[11px] font-medium">
                  Locomotive: <span className="font-mono font-bold text-[#002D62]">{selectedTrainDetail.loco}</span> • Current: {selectedTrainDetail.currentStation}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                Speed: {selectedTrainDetail.speedKmph} km/h (Permissible: 130)
              </span>
              <button 
                onClick={() => setSelectedTrainDetail(null)}
                className="text-xs text-slate-500 hover:text-slate-900 font-bold"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sections Telemetry Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {corridorSections.map((sec) => {
          const isSelected = selectedSection === sec.section_code;
          return (
            <div
              key={sec.section_id}
              onClick={() => setSelectedSection(sec.section_code)}
              className={`bg-white p-4 rounded-xl cursor-pointer transition-all border shadow-sm ${
                isSelected 
                  ? 'border-2 border-[#002D62] bg-blue-50/40 shadow-md ring-1 ring-[#002D62]' 
                  : 'border-slate-200 hover:border-slate-400 hover:shadow-md'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#002D62] font-mono">{sec.section_code}</span>
                <span 
                  className="px-2 py-0.5 rounded text-[10px] font-bold text-white uppercase shadow-sm"
                  style={{ backgroundColor: sec.status_color }}
                >
                  {sec.corridor_status?.replace(/_/g, ' ')}
                </span>
              </div>
              <div className="text-sm font-bold text-slate-900 mt-1.5 line-clamp-1">{sec.section_name}</div>
              
              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Assets</span>
                  <div className="font-bold text-slate-800">{sec.asset_count}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Pending Tasks</span>
                  <div className="font-bold text-amber-600">{sec.pending_tasks}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Critical Defects</span>
                  <div className="font-bold text-red-600">{sec.critical_defects}</div>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-medium">Availability</span>
                  <div className="font-bold text-emerald-600">{sec.availability_score}%</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Section Window Timeline & Freight Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline Visualization */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200">
            <div>
              <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Corridor Time-Occupancy Window ({selectedSection})</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Green = Optimal Window
                </span>
              </h3>
              <p className="text-xs text-slate-500">COA passenger headways and forecasted freight slot gaps</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {timeSlots.map((slot, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs font-semibold"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[#002D62] font-bold w-12">{slot.time}</span>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: slot.color }}></span>
                    <span className={slot.status === 'OPTIMAL' ? 'text-emerald-800 font-bold' : 'text-slate-800'}>
                      {slot.event}
                    </span>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  slot.status === 'OPTIMAL' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                  (slot.type === 'PASSENGER' ? 'bg-red-50 text-red-800 border border-red-200' :
                  'bg-amber-50 text-amber-800 border border-amber-200')
                }`}>
                  {slot.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Freight Forecast Explanation Panel */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Train className="w-4 h-4 text-[#002D62]" />
              Freight Forecast Integration
            </h3>
          </div>

          <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-[#002D62] leading-relaxed font-medium">
            "Freight forecast is evaluated to prevent siding stagnation while protecting scheduled passenger paths."
          </div>

          <div className="space-y-2.5 pt-1 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium">00:00–02:00</span>
              <span className="text-emerald-700 font-bold">Low Freight Density</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50 border border-emerald-200">
              <span className="text-emerald-900 font-bold">02:00–03:00</span>
              <span className="text-emerald-700 font-bold">Optimal Maintenance Window</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium">03:00–05:00</span>
              <span className="text-amber-700 font-bold">High Freight Density (Coal/Grain)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-600 font-medium">05:00–08:00</span>
              <span className="text-amber-700 font-bold">Medium Freight Congestion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Official Caution Order (Form T/409) Printable Modal */}
      {showCautionModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl max-w-2xl w-full p-6 space-y-4">
            <div className="border-b-2 border-[#002D62] pb-3 flex items-center justify-between">
              <div>
                <div className="text-base font-black text-[#002D62] tracking-wider">
                  INDIAN RAILWAYS • NORTHERN RAILWAY
                </div>
                <div className="text-xs font-mono font-bold text-slate-700">
                  FORM T/409 — CAUTION ORDER & SPEED RESTRICTION BULLETIN
                </div>
              </div>
              <div className="text-right text-[10px] font-mono text-slate-500">
                <div>DATE: 04-09-2026</div>
                <div>DIV: DELHI (NR)</div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>ACTIVE SPEED RESTRICTION NOTICE (SEC-04 TUNDLA CHORD)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                To Loco Pilot & Guard of all Up/Down trains: Observe Speed Restriction of <strong>30 km/h</strong> between Km 204/10 and 205/04 on account of Track AT Weld correction and OHE maintenance block.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-slate-500 text-[10px]">Permissible Speed</span>
                <div className="text-sm font-black text-[#002D62]">30 km/h (Normal: 110)</div>
              </div>
              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
                <span className="text-slate-500 text-[10px]">Authorized Authority</span>
                <div className="text-sm font-black text-slate-900">Sr. DEN / Co-ord (NCR)</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setShowCautionModal(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleIssueCautionOrder}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#002D62] hover:bg-[#001D3D] text-white text-xs font-bold shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Issue Caution Order</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


