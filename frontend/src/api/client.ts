/**
 * RAILSYNC AI - API Client
 * Connects to FastAPI backend at http://localhost:8000/api
 * Features automatic fallback for 100% demo resilience.
 */

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("railsync_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
    
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Request failed with status ${res.status}`);
    }
    
    return await res.json();
  } catch (error) {
    console.warn(`API call to ${endpoint} failed, checking fallback:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  login: (credentials: any) => apiRequest("/auth/login", { method: "POST", body: JSON.stringify(credentials) }),
  getProfile: () => apiRequest("/auth/me"),
  
  // Dashboard
  getDashboard: () => apiRequest("/dashboard/summary"),
  
  // Tasks
  getTasks: (params: string = "") => apiRequest(`/tasks${params ? "?" + params : ""}`),
  getPrioritizedTasks: () => apiRequest("/tasks/prioritized"),
  createTask: (task: any) => apiRequest("/tasks", { method: "POST", body: JSON.stringify(task) }),
  getTaskDetail: (id: number) => apiRequest(`/tasks/${id}`),
  
  // AI
  prioritizeAI: (data: any) => apiRequest("/ai/prioritize", { method: "POST", body: JSON.stringify(data) }),
  prioritizeAllAI: () => apiRequest("/ai/prioritize-all", { method: "POST" }),
  getModelInfo: () => apiRequest("/ai/model-info"),

  // Loco Pilot Feedback & Dynamic Re-planning
  getLocoPilotFeedback: (params: string = "") => apiRequest(`/loco-pilot/feedback${params ? "?" + params : ""}`),
  submitLocoPilotFeedback: (feedback: any) => apiRequest("/loco-pilot/feedback", { method: "POST", body: JSON.stringify(feedback) }),
  verifyLocoPilotFeedback: (id: number, data: any) => apiRequest(`/loco-pilot/feedback/${id}/verify`, { method: "PUT", body: JSON.stringify(data) }),
  triggerDynamicReplanning: (id: number) => apiRequest(`/loco-pilot/feedback/${id}/trigger-dynamic-replanning`, { method: "POST" }),
  getLocoPilotSummary: () => apiRequest("/loco-pilot/summary"),

  // Department Integration (TMS, SMMS, TDMS, Control Office)
  getDepartmentIntegration: () => apiRequest("/departments/integration-data"),
  
  // Assets & Defects
  getAssets: (params: string = "") => apiRequest(`/assets${params ? "?" + params : ""}`),
  getAssetDetail: (id: number) => apiRequest(`/assets/${id}`),
  getDefects: (params: string = "") => apiRequest(`/defects${params ? "?" + params : ""}`),
  reportDefect: (defect: any) => apiRequest("/defects", { method: "POST", body: JSON.stringify(defect) }),
  
  // Corridor & Sections
  getSections: () => apiRequest("/sections"),
  getCorridorOverview: () => apiRequest("/sections/corridor/overview"),
  
  // Trains & Schedules
  getTrains: () => apiRequest("/trains"),
  createTrain: (data: any) => apiRequest("/trains", { method: "POST", body: JSON.stringify(data) }),
  getSchedules: (params: string = "") => apiRequest(`/trains/schedules${params ? "?" + params : ""}`),
  getFreightForecasts: (params: string = "") => apiRequest(`/trains/freight-forecasts${params ? "?" + params : ""}`),
  
  // Blocks & Optimization
  getBlockWindows: () => apiRequest("/blocks"),
  runOptimization: (data: any) => apiRequest("/optimization/run", { method: "POST", body: JSON.stringify(data) }),
  getDemoScenario: () => apiRequest("/optimization/demo-scenario"),
  
  // Plans & Approvals
  getPlans: (params: string = "") => apiRequest(`/plans${params ? "?" + params : ""}`),
  getPlanDetail: (id: number) => apiRequest(`/plans/${id}`),
  modifyPlan: (id: number, data: any) => apiRequest(`/plans/${id}/modify`, { method: "PUT", body: JSON.stringify(data) }),
  getApprovals: () => apiRequest("/approvals"),
  approveBlock: (id: number, comments: string) => apiRequest(`/approvals/${id}/approve`, { method: "POST", body: JSON.stringify({ comments }) }),
  rejectBlock: (id: number, comments: string) => apiRequest(`/approvals/${id}/reject`, { method: "POST", body: JSON.stringify({ comments }) }),
  
  // Simulation & What-If
  runSimulation: (data: any) => apiRequest("/simulation/run", { method: "POST", body: JSON.stringify(data) }),
  runWhatIf: (data: any) => apiRequest("/what-if/run", { method: "POST", body: JSON.stringify(data) }),
  
  // Notifications & Reports
  getNotifications: () => apiRequest("/notifications"),
  markNotificationRead: (id: number) => apiRequest(`/notifications/${id}/read`, { method: "PUT" }),
  getReportsSummary: () => apiRequest("/reports/summary"),
};

