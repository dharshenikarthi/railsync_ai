import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { MaintenanceTasks } from './pages/MaintenanceTasks';
import { RailwayNetwork } from './pages/RailwayNetwork';
import { AIPriorityCenter } from './pages/AIPriorityCenter';
import { OptimizationCenter } from './pages/OptimizationCenter';
import { PlanningCalendar } from './pages/PlanningCalendar';
import { AssetsPage } from './pages/AssetsPage';
import { DefectsPage } from './pages/DefectsPage';
import { TrainSchedule } from './pages/TrainSchedule';
import { Simulation } from './pages/Simulation';
import { WhatIfAnalysis } from './pages/WhatIfAnalysis';
import { Approvals } from './pages/Approvals';
import { Notifications } from './pages/Notifications';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { LocoPilotFeedback } from './pages/LocoPilotFeedback';
import { DepartmentIntegration } from './pages/DepartmentIntegration';


import { 
  mockDashboardData, 
  mockTasks, 
  mockCorridorSections,
  mockUsers,
  type RailwayUser
} from './api/mockData';
import { api } from './api/client';

export function App() {
  const [activePage, setActivePage] = useState<string>('dashboard');
  const [horizon, setHorizon] = useState<'WEEKLY' | 'MONTHLY'>('WEEKLY');
  const [pendingApprovalsCount, setPendingApprovalsCount] = useState<number>(2);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);

  // Core Datasets
  const [dashboardData, setDashboardData] = useState<any>(mockDashboardData);
  const [tasks, setTasks] = useState<any[]>(mockTasks);
  const [corridorSections, setCorridorSections] = useState<any[]>(mockCorridorSections);

  // Multi-Role User state (defaults to COM / CPTM, persistent via localStorage)
  const [currentUser, setCurrentUser] = useState<RailwayUser>(() => {
    try {
      const saved = localStorage.getItem("railsync_active_user");
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = mockUsers.find(u => u.username === parsed.username);
        if (match) return match;
      }
    } catch {
      // fallback
    }
    return mockUsers[0];
  });

  const [roleChangeToast, setRoleChangeToast] = useState<string | null>(null);

  const handleSelectUser = (user: RailwayUser) => {
    setCurrentUser(user);
    try {
      localStorage.setItem("railsync_active_user", JSON.stringify(user));
    } catch {}
    setRoleChangeToast(`Active Persona: ${user.name} (${user.roleTitle})`);
    setTimeout(() => setRoleChangeToast(null), 3500);
  };

  useEffect(() => {
    async function initApp() {
      try {
        const [dashRes, tasksRes, secRes] = await Promise.allSettled([
          api.getDashboard(),
          api.getTasks(),
          api.getSections()
        ]);

        if (dashRes.status === 'fulfilled' && dashRes.value?.kpis) {
          setDashboardData(dashRes.value);
          setIsBackendConnected(true);
        }

        if (tasksRes.status === 'fulfilled' && Array.isArray(tasksRes.value) && tasksRes.value.length > 0) {
          setTasks(tasksRes.value);
        }

        if (secRes.status === 'fulfilled' && Array.isArray(secRes.value) && secRes.value.length > 0) {
          setCorridorSections(secRes.value);
        }
      } catch (err) {
        console.warn("Backend initialization connecting with fallback mock:", err);
      }
    }
    initApp();
  }, []);

  const handleStartDemo = () => {
    setActivePage('planner');
  };

  const handleTriggerWhatIf = () => {
    setActivePage('whatif');
  };

  const handleApprovalsUpdated = () => {
    setPendingApprovalsCount(prev => Math.max(0, prev - 1));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-sky-500 selection:text-white bg-grid-pattern">
      {/* Top Navigation Bar */}
      <Navbar
        horizon={horizon}
        setHorizon={setHorizon}
        onStartDemo={handleStartDemo}
        onTriggerWhatIf={handleTriggerWhatIf}
        activePage={activePage}
        isBackendConnected={isBackendConnected}
        currentUser={currentUser}
        onSelectUser={handleSelectUser}
        onNavigateToLogin={() => setActivePage('login')}
        onNavigateToNotifications={() => setActivePage('notifications')}
        onNavigateToWeekly={() => {
          setHorizon('WEEKLY');
          setActivePage('weekly');
        }}
        onNavigateToMonthly={() => {
          setHorizon('MONTHLY');
          setActivePage('monthly');
        }}
        onNavigateToDashboard={() => setActivePage('dashboard')}
      />

      {/* Role Switch Toast Indicator */}
      {roleChangeToast && (
        <div className="fixed bottom-12 right-6 z-50 bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-sky-500/50 text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-bottom-5 backdrop-blur-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{roleChangeToast}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex">
        {/* Left Navigational Sidebar */}
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
          pendingApprovalsCount={pendingApprovalsCount}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-5 sm:p-7 overflow-y-auto w-full min-w-0 bg-[#F8FAFC]/90">

          {activePage === 'dashboard' && (
            <ExecutiveDashboard
              data={dashboardData}
              onNavigateToPlanner={() => setActivePage('planner')}
              onExplainRecommendation={() => setActivePage('planner')}
              onNavigateToPage={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'network' && (
            <RailwayNetwork corridorSections={corridorSections} />
          )}

          {activePage === 'departments' && (
            <DepartmentIntegration />
          )}

          {activePage === 'loco_pilot' && (
            <LocoPilotFeedback />
          )}

          {activePage === 'trains' && (
            <TrainSchedule />
          )}

          {activePage === 'blocks' && (
            <PlanningCalendar 
              initialView={horizon} 
              onViewChange={(h) => setHorizon(h)}
              onNavigateToPlanner={() => setActivePage('planner')}
            />
          )}

          {activePage === 'tasks' && (
            <MaintenanceTasks
              tasks={tasks}
              onSelectTask={(task) => {
                setActivePage('priority');
              }}
            />
          )}

          {activePage === 'assets' && (
            <AssetsPage />
          )}

          {activePage === 'defects' && (
            <DefectsPage />
          )}

          {activePage === 'priority' && (
            <AIPriorityCenter />
          )}

          {activePage === 'planner' && (
            <OptimizationCenter
              horizon={horizon}
              onApprovalsUpdated={handleApprovalsUpdated}
            />
          )}

          {activePage === 'weekly' && (
            <PlanningCalendar 
              initialView="WEEKLY" 
              onViewChange={(h) => {
                setHorizon(h);
                if (h === 'MONTHLY') setActivePage('monthly');
              }}
              onNavigateToPlanner={() => setActivePage('planner')}
            />
          )}

          {activePage === 'monthly' && (
            <PlanningCalendar 
              initialView="MONTHLY" 
              onViewChange={(h) => {
                setHorizon(h);
                if (h === 'WEEKLY') setActivePage('weekly');
              }}
              onNavigateToPlanner={() => setActivePage('planner')}
            />
          )}

          {activePage === 'simulation' && (
            <Simulation />
          )}

          {activePage === 'whatif' && (
            <WhatIfAnalysis />
          )}

          {activePage === 'approvals' && (
            <Approvals />
          )}

          {activePage === 'notifications' && (
            <Notifications />
          )}

          {activePage === 'reports' && (
            <Reports />
          )}

          {activePage === 'settings' && (
            <Settings />
          )}

          {activePage === 'login' && (
            <Login onLoginSuccess={(u) => {
              setCurrentUser(u);
              setActivePage('dashboard');
            }} />
          )}
        </main>
      </div>

      {/* Global Prototype Footer Banner */}
      <footer className="h-9 bg-[#0B2545] border-t border-[#003865] px-6 flex items-center justify-between text-[11px] text-slate-300 select-none">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-bold text-white tracking-wide">RAILSYNC AI</span>
          <span className="text-slate-500">|</span>
          <span className="text-amber-300 font-medium">Synthetic Telemetry (Northern Railway NDLS–TDL Corridor)</span>
        </div>
        <div className="font-mono text-slate-300 hidden sm:flex items-center gap-3">
          <span className="text-slate-400">Engine:</span>
          <span className="px-2 py-0.5 rounded bg-[#001D3D] text-sky-300 border border-sky-900/50">FastAPI</span>
          <span className="px-2 py-0.5 rounded bg-[#001D3D] text-sky-300 border border-sky-900/50">Google OR-Tools CP-SAT</span>
          <span className="px-2 py-0.5 rounded bg-[#001D3D] text-sky-300 border border-sky-900/50">RandomForest ML</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
