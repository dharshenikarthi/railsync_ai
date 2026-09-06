import React, { useState, useEffect } from 'react';
import { 
  Bell, AlertTriangle, CheckCircle2, ShieldAlert, 
  CheckCheck 
} from 'lucide-react';
import { api } from '../api/client';

export const Notifications: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'UNREAD'>('ALL');
  const [alerts, setAlerts] = useState<any[]>([
    {
      id: 1,
      title: "Critical Defect Detected: Turnout 204 Tongue Rail",
      type: "CRITICAL",
      department: "ENG",
      section: "SEC-04 (Tundla Chord)",
      message: "Ultrasonic flaw detection flagged 4mm crack in tongue rail AT weld. Immediate shadow possession required.",
      timestamp: "10 mins ago",
      read: false
    },
    {
      id: 2,
      title: "Shadow Block Opportunity Identified",
      type: "OPTIMIZATION",
      department: "SYSTEM",
      section: "SEC-04",
      message: "AI Optimizer bundled 3 cross-department tasks (Track, S&T, OHE) into single 02:00–03:00 window, saving 55 mins.",
      timestamp: "32 mins ago",
      read: false
    },
    {
      id: 3,
      title: "Upcoming Freight Slot Reservation",
      type: "WARNING",
      department: "COA",
      section: "SEC-03 (ALJN-TDL)",
      message: "High-tonnage thermal coal rake (BOXN-101) forecasted at 03:30. Headway separation auto-enforced.",
      timestamp: "1 hour ago",
      read: true
    },
    {
      id: 4,
      title: "Block Permit Authorized",
      type: "SUCCESS",
      department: "CHIEF_CONTROLLER",
      section: "SEC-01 (NDLS-GZB)",
      message: "Chief Controller signed off on emergency rail renewal window BLK-01 for 03:00–04:15.",
      timestamp: "3 hours ago",
      read: true
    }
  ]);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const res = await api.getNotifications();
        if (Array.isArray(res) && res.length > 0) {
          setAlerts(res);
        }
      } catch (e) {
        // Keeps fallback
      }
    }
    loadAlerts();
  }, []);

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'CRITICAL') return a.type === 'CRITICAL';
    if (filter === 'UNREAD') return !a.read;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              System Alerts & Operational Notifications
            </h1>
            <span className="text-xs font-bold text-[#002D62] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              Live Stream
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Real-time automated alerts across TMS, SMMS, TDMS, and Control Office dispatchers
          </p>
        </div>

        <button
          onClick={markAllRead}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 border border-slate-200 shadow-sm text-xs font-bold text-[#002D62] transition-all"
        >
          <CheckCheck className="w-4 h-4 text-[#002D62]" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
            filter === 'ALL' ? 'bg-[#002D62] text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          All Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setFilter('CRITICAL')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
            filter === 'CRITICAL' ? 'bg-red-600 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          Critical Only ({alerts.filter(a => a.type === 'CRITICAL').length})
        </button>
        <button
          onClick={() => setFilter('UNREAD')}
          className={`px-3.5 py-1.5 text-xs font-bold rounded-md transition-all ${
            filter === 'UNREAD' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          Unread ({alerts.filter(a => !a.read).length})
        </button>
      </div>

      {/* Alerts Stream (60% White / Light Grey Canvas) */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-xl border transition-all flex items-start gap-4 shadow-sm ${
              !alert.read ? 'border-l-4 border-l-[#002D62] border-slate-200 bg-white' : 'border-slate-200 bg-white/80'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {alert.type === 'CRITICAL' ? (
                <div className="w-8 h-8 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              ) : alert.type === 'OPTIMIZATION' ? (
                <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-[#002D62]">
                  <Bell className="w-4 h-4" />
                </div>
              ) : alert.type === 'SUCCESS' ? (
                <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black text-slate-900">{alert.title}</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold">
                    {alert.section}
                  </span>
                </div>
                <span className="text-[10px] font-medium text-slate-500 shrink-0">{alert.timestamp}</span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

