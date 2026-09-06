/**
 * RAILSYNC AI - Enterprise Indian Railways Synthetic Dataset
 * Fully aligned with Indian Railways Standards (TMS, SMMS, TDMS, COA, ICMS, CRIS)
 * Covers Northern Railway (NR) & North Central Railway (NCR) New Delhi - Prayagraj Trunk Corridor.
 */

export interface RailwayUser {
  id: string;
  username: string;
  name: string;
  role: string;
  roleTitle: string;
  department: string;
  division: string;
  zone: string;
  badge: string;
  avatarBg: string;
  permissions: string[];
}

export const mockUsers: RailwayUser[] = [
  {
    id: "USR-001",
    username: "admin",
    name: "Shri Rajeshwar Sharma, IRTS",
    role: "CHIEF_PLANNER",
    roleTitle: "Chief Operations Manager / Chief Planner (CPTM)",
    department: "Operating & Traffic",
    division: "Delhi HQ (Northern Railway)",
    zone: "Northern Railway (NR)",
    badge: "HQ LEVEL 14",
    avatarBg: "from-blue-700 to-indigo-950",
    permissions: ["APPROVE_ALL", "OVERRIDE_CONSTRAINTS", "TRIGGER_OPTIMIZER", "EXPORT_GAZETTE", "SYSTEM_ADMIN"]
  },
  {
    id: "USR-002",
    username: "eng_officer",
    name: "Dr. Ananya Mukherjee, IRSE",
    role: "ENG_OFFICER",
    roleTitle: "Senior Divisional Engineer (Sr. DEN / Co-ord)",
    department: "Civil Engineering (Permanent Way)",
    division: "Prayagraj Division (NCR)",
    zone: "North Central Railway (NCR)",
    badge: "P-WAY COMMAND",
    avatarBg: "from-amber-600 to-stone-900",
    permissions: ["REQUEST_PWAY_BLOCK", "USFD_SIGNOFF", "MACHINE_TAMPING_ALLOCATION", "TSR_PSR_ENTRY"]
  },
  {
    id: "USR-003",
    username: "trd_officer",
    name: "Er. Vikramaditya Rao, IRSEE",
    role: "TRD_OFFICER",
    roleTitle: "Senior Divisional Electrical Engineer (Sr. DEE / TrD)",
    department: "Traction Distribution (25kV AC OHE)",
    division: "Delhi Division (NR)",
    zone: "Northern Railway (NR)",
    badge: "25kV TRD",
    avatarBg: "from-emerald-600 to-teal-950",
    permissions: ["OHE_POWER_BLOCK_PERMIT", "ISOLATOR_ISOLATION", "TOWER_WAGON_DISPATCH", "SHADOW_BLOCK_CONSENT"]
  },
  {
    id: "USR-004",
    username: "snt_officer",
    name: "Smt. Priyanka Kulkarni, IRSSE",
    role: "SNT_OFFICER",
    roleTitle: "Senior Divisional Signal & Telecom Engineer (Sr. DSTE)",
    department: "Signal & Telecommunication",
    division: "Agra Division (NCR)",
    zone: "North Central Railway (NCR)",
    badge: "S&T SIGNAL",
    avatarBg: "from-purple-600 to-slate-950",
    permissions: ["EI_DISCONNECTION_NOTICE", "POINT_MACHINE_LOCK", "AXLE_COUNTER_RESET", "KAVACH_TESTING"]
  },
  {
    id: "USR-005",
    username: "controller",
    name: "Shri Mahendra Singh Yadav",
    role: "CHIEF_CONTROLLER",
    roleTitle: "Chief Section Controller (Central Control Room)",
    department: "Operating / Traffic Control",
    division: "Prayagraj Division (NCR)",
    zone: "North Central Railway (NCR)",
    badge: "CONTROL ROOM",
    avatarBg: "from-rose-600 to-slate-900",
    permissions: ["GRANT_LIVE_BLOCK", "DISPATCH_TRAIN", "SPEED_RESTRICTION_POST", "TIME_DISTANCE_CONTROL"]
  },
  {
    id: "USR-006",
    username: "drm_officer",
    name: "Smt. Shailaja Ramachandran, HAG",
    role: "DRM_EXECUTIVE",
    roleTitle: "Divisional Railway Manager (DRM)",
    department: "Executive Management",
    division: "Delhi Division (NR)",
    zone: "Northern Railway (NR)",
    badge: "DRM APEX",
    avatarBg: "from-sky-600 to-blue-950",
    permissions: ["VIEW_ANALYTICS", "AUDIT_REPORTS", "SAFETY_COMPLIANCE", "PUNCTUALITY_OVERVIEW"]
  }
];

export const mockDashboardData = {
  kpis: {
    total_assets: 1845,
    pending_tasks: 142,
    critical_defects: 19,
    overdue_tasks: 28,
    planned_blocks: 24,
    asset_availability_pct: 96.4,
    potential_hours_saved_pct: 34.8,
    conflicts_avoided: 14,
    punctuality_impact_reduction_pct: 29.5,
    ohe_diesel_cost_savings_inr: "₹48.2 Lakhs"
  },
  charts: {
    tasks_by_dept: [
      { code: "ENG", name: "Civil Engineering (Track / P-Way)", count: 68, color: "#D97706" },
      { code: "SNT", name: "Signal & Telecom (EI / Kavach)", count: 48, color: "#8B5CF6" },
      { code: "TRD", name: "Traction Distribution (25kV OHE)", count: 38, color: "#10B981" }
    ],
    tasks_by_priority: [
      { priority: "Emergency / IMR", count: 19, color: "#EF4444" },
      { priority: "High / Urgent", count: 47, color: "#F97316" },
      { priority: "Medium / Routine", count: 61, color: "#F59E0B" },
      { priority: "Low / Periodic", count: 27, color: "#3B82F6" }
    ],
    availability_trend: [
      { day: "Mon", historical: 92.4, optimized: 95.8 },
      { day: "Tue", historical: 91.9, optimized: 96.2 },
      { day: "Wed", historical: 93.1, optimized: 96.9 },
      { day: "Thu", historical: 92.6, optimized: 97.4 },
      { day: "Fri", historical: 91.8, optimized: 97.1 },
      { day: "Sat", historical: 94.2, optimized: 98.0 },
      { day: "Sun", historical: 94.8, optimized: 98.5 }
    ],
    weekly_utilization: [
      { day: "Mon", allocated_hours: 5.0, utilized_hours: 4.8, utilization_pct: 96 },
      { day: "Tue", allocated_hours: 4.0, utilized_hours: 3.9, utilization_pct: 97 },
      { day: "Wed", allocated_hours: 5.5, utilized_hours: 5.3, utilization_pct: 96 },
      { day: "Thu", allocated_hours: 4.5, utilized_hours: 4.4, utilization_pct: 98 },
      { day: "Fri", allocated_hours: 6.5, utilized_hours: 6.1, utilization_pct: 94 },
      { day: "Sat", allocated_hours: 5.0, utilized_hours: 4.9, utilization_pct: 98 },
      { day: "Sun", allocated_hours: 4.0, utilized_hours: 3.9, utilization_pct: 98 }
    ],
    conflict_risk: [
      { level: "Zero Train Delay (<2m)", percentage: 82, color: "#10B981" },
      { level: "Controlled Precedence (3–8m)", percentage: 14, color: "#F59E0B" },
      { level: "High Rescheduling Risk (>10m)", percentage: 4, color: "#EF4444" }
    ]
  },
  ai_recommendation: {
    title: "Shadow Block Clustering Opportunity (Golden Trunk NDLS–TDL)",
    description: "Multi-departmental synergy detected: Track Tongue Rail weld overhaul, S&T Point Machine calibration, and OHE Contact Wire tensioning can be clustered into a single 50-minute possession window.",
    primary_window: "SEC-04 (Tundla Chord Bypass) 01:45 – 02:40 IST",
    tasks_bundled: 4,
    block_hours_saved_pct: 52.0,
    train_conflicts_avoided: 4,
    confidence_score: 97.4,
    priority_trains_shielded: ["22436 Vande Bharat", "12301 Howrah Rajdhani"]
  },
  system_status: {
    mode: "ENTERPRISE TELEMETRY — CRIS ICMS / TMS LINKED",
    last_updated: "2026-09-04 16:30 IST",
    active_corridor: "New Delhi (NDLS) → Prayagraj Jn (PRYJ) Golden Corridor (130/160 km/h)",
    connected_systems: ["TMS (Track Management System)", "SMMS (Signalling Maintenance)", "TDMS (Traction Distribution)", "COA (Control Office Application)", "Kavach (Train Collision Avoidance)"]
  }
};

export const mockTasks = [
  // Seed Scenario SEC-04 (Compatible)
  {
    task_id: 1,
    task_code: "TSK-ENG-401",
    task_title: "Track Tongue Rail AT Weld Correction",
    department: "ENG",
    department_name: "Engineering (Track)",
    section_code: "SEC-04",
    asset_code: "AST-TRK-401",
    asset_name: "SEC-04 Up Main Turnout 204",
    criticality: 90,
    urgency: 85,
    ai_priority: 91.5,
    priority_level: "CRITICAL",
    status: "PENDING",
    duration_minutes: 45,
    due_date: "2026-09-09",
    resource: "Gang 04-A (8 trackmen, weld cutter)",
    compatibility_group: "GRP-SEC04-SHADOW",
    safety_requirements: "Full track possession, traffic block"
  },
  {
    task_id: 2,
    task_code: "TSK-SNT-401",
    task_title: "S&T Point Machine Detection Calibration",
    department: "SNT",
    department_name: "Signal & Telecom",
    section_code: "SEC-04",
    asset_code: "AST-SIG-401",
    asset_name: "SEC-04 S&T Point Machine PM-401",
    criticality: 75,
    urgency: 70,
    ai_priority: 78.0,
    priority_level: "HIGH",
    status: "PENDING",
    duration_minutes: 30,
    due_date: "2026-09-10",
    resource: "S&T Signal Sectional Gang (4 technicians)",
    compatibility_group: "GRP-SEC04-SHADOW",
    safety_requirements: "S&T disconnection notice, joint possession"
  },
  {
    task_id: 3,
    task_code: "TSK-TRD-401",
    task_title: "OHE Cantilever Stagger & Isolator Tuning",
    department: "TRD",
    department_name: "Traction Distribution (OHE)",
    section_code: "SEC-04",
    asset_code: "AST-TRD-401",
    asset_name: "SEC-04 OHE Catenary & Contact Wire",
    criticality: 80,
    urgency: 78,
    ai_priority: 82.0,
    priority_level: "HIGH",
    status: "PENDING",
    duration_minutes: 40,
    due_date: "2026-09-08",
    resource: "Tower Wagon Gang (6 linesmen)",
    compatibility_group: "GRP-SEC04-SHADOW",
    safety_requirements: "OHE Power isolation permit"
  },
  // Incompatible tasks in SEC-02 to demonstrate constraint handling
  {
    task_id: 4,
    task_code: "TSK-ENG-201",
    task_title: "Heavy CSM Machine Tamping & Ballast Regulation",
    department: "ENG",
    department_name: "Engineering (Track)",
    section_code: "SEC-02",
    asset_code: "AST-TRK-201",
    asset_name: "Continuous Welded Rail km 45-48",
    criticality: 70,
    urgency: 65,
    ai_priority: 74.0,
    priority_level: "HIGH",
    status: "PENDING",
    duration_minutes: 120,
    due_date: "2026-09-12",
    resource: "Heavy CSM Tamping Machine Crew",
    compatibility_group: "INCOMPATIBLE-HEAVY-MACHINE",
    safety_requirements: "Absolute traffic possession, no live OHE adjacent"
  },
  {
    task_id: 5,
    task_code: "TSK-TRD-201",
    task_title: "High Speed Contact Wire Splice Joint Replacement",
    department: "TRD",
    department_name: "Traction Distribution (OHE)",
    section_code: "SEC-02",
    asset_code: "AST-TRD-202",
    asset_name: "Contact Wire Regulated km 90-95",
    criticality: 88,
    urgency: 85,
    ai_priority: 89.0,
    priority_level: "CRITICAL",
    status: "PENDING",
    duration_minutes: 90,
    due_date: "2026-09-06",
    resource: "8-Wheeler Tower Car Gang",
    compatibility_group: "POWER-ISOLATION-REQUIRED",
    safety_requirements: "OHE power and traffic block"
  },
  // SEC-01 Tasks
  {
    task_id: 6,
    task_code: "TSK-ENG-101",
    task_title: "Emergency Rail Head Cut & Fishplate Renewal",
    department: "ENG",
    department_name: "Engineering (Track)",
    section_code: "SEC-01",
    asset_code: "AST-TRK-102",
    asset_name: "Curved Track km 18/2-6 Up Line",
    criticality: 95,
    urgency: 95,
    ai_priority: 94.0,
    priority_level: "CRITICAL",
    status: "PENDING",
    duration_minutes: 60,
    due_date: "2026-09-05",
    resource: "Emergency Permanent Way Gang",
    compatibility_group: "EMERGENCY-TRACK",
    safety_requirements: "Emergency possession"
  },
  {
    task_id: 7,
    task_code: "TSK-SIG-101",
    task_title: "Axle Counter Track Sensor Maintenance",
    department: "SNT",
    department_name: "Signal & Telecom",
    section_code: "SEC-01",
    asset_code: "AST-SIG-102",
    asset_name: "Digital Axle Counter DAC-01-UP",
    criticality: 45,
    urgency: 40,
    ai_priority: 47.0,
    priority_level: "MEDIUM",
    status: "PENDING",
    duration_minutes: 25,
    due_date: "2026-09-18",
    resource: "Station Signal Tech Unit",
    compatibility_group: "ROUTINE-SENSOR",
    safety_requirements: "Caution order"
  }
];

export const mockOptimizationResult = {
  status: "OPTIMAL",
  solver: "Google OR-Tools CP-SAT v9.15",
  execution_time_ms: 54,
  selected_blocks: [
    {
      block_id: 1,
      section_id: 4,
      section_code: "SEC-04",
      section_name: "Tundla Chord & Bypass Line",
      start_time: "02:00",
      end_time: "03:00",
      duration_minutes: 60,
      block_type: "INTEGRATED_SHADOW_BLOCK",
      departments: ["Engineering (Track)", "S&T (Signalling)", "Traction (TRD/OHE)"],
      department_count: 3,
      assigned_tasks: [
        {
          task_id: 1,
          task_code: "TSK-ENG-401",
          task_title: "Track Tongue Rail AT Weld Correction",
          department: "ENG",
          duration_minutes: 45,
          priority_level: "CRITICAL"
        },
        {
          task_id: 2,
          task_code: "TSK-SNT-401",
          task_title: "S&T Point Machine Detection Calibration",
          department: "SNT",
          duration_minutes: 30,
          priority_level: "HIGH"
        },
        {
          task_id: 3,
          task_code: "TSK-TRD-401",
          task_title: "OHE Cantilever Stagger & Isolator Tuning",
          department: "TRD",
          duration_minutes: 40,
          priority_level: "HIGH"
        }
      ],
      operational_impact: "LOW",
      train_conflicts_avoided: 3,
      freight_risk: "LOW",
      confidence_score: 0.94,
      explanation: {
        summary: "Optimal multi-disciplinary maintenance window selected for Engineering, S&T, and Traction.",
        operational_impact: "LOW",
        asset_availability_benefit: "VERY_HIGH",
        confidence_score: "94%",
        bullet_reasons: [
          "3 compatible cross-department tasks successfully coordinated into 1 single shadow block.",
          "Contains critical overdue turnout weld defect requiring immediate possession.",
          "Zero passenger train timetable conflict: clean slot between Train 12398 (01:50) and Rajdhani 12302 (03:05).",
          "Freight forecast model projects low freight traffic probability (0.12) during this slot.",
          "Engineering P-Way gang, S&T signal unit, and OHE tower car crews are mutually available."
        ]
      }
    }
  ],
  before_after_comparison: {
    manual_planning: {
      total_blocks: 3,
      total_duration_minutes: 115,
      block_hours: 1.9,
      potential_train_conflicts: 3,
      asset_availability_pct: 88.5,
      coordination_degree: "Siloed / Disjoint (Sequential Engineering 45m + S&T 30m + TRD 40m)"
    },
    ai_optimized: {
      total_blocks: 1,
      total_duration_minutes: 60,
      block_hours: 1.0,
      potential_train_conflicts: 0,
      asset_availability_pct: 95.8,
      coordination_degree: "Integrated Shadow Block (Coordinated Parallel Execution)"
    },
    improvement: {
      block_hours_saved_pct: 47.8,
      blocks_reduced_count: 2,
      blocks_reduced_pct: 66.7,
      conflicts_avoided: 3,
      availability_gain_pct: 7.3
    }
  },
  alternatives: [
    {
      block_id: 1,
      window_time: "02:00–03:00",
      score: 94,
      operational_impact: "LOW",
      classification: "RECOMMENDED",
      reason: "Optimal window: zero passenger train conflicts and low freight probability."
    },
    {
      block_id: 2,
      window_time: "03:30–04:30",
      score: 76,
      operational_impact: "MEDIUM",
      classification: "ALTERNATIVE",
      reason: "Moderate risk: overlaps with scheduled BOXN coal rake path."
    },
    {
      block_id: 3,
      window_time: "14:00–15:00",
      score: 42,
      operational_impact: "HIGH",
      classification: "ALTERNATIVE",
      reason: "High risk: daytime peak express train path congestion (3 express trains affected)."
    }
  ]
};

export const mockCorridorSections = [
  {
    section_id: 1,
    section_code: "SEC-01",
    section_name: "New Delhi (NDLS) — Ghaziabad (GZB) Quad Line",
    length_km: 25.5,
    track_count: 4,
    electrified: true,
    maximum_speed_kmph: 130,
    asset_count: 342,
    pending_tasks: 45,
    critical_defects: 7,
    corridor_status: "HIGH_TRAFFIC_DENSITY",
    status_color: "#EF4444",
    availability_score: 92.4
  },
  {
    section_id: 2,
    section_code: "SEC-02",
    section_name: "Ghaziabad (GZB) — Aligarh (ALJN) Main Trunk",
    length_km: 105.0,
    track_count: 2,
    electrified: true,
    maximum_speed_kmph: 130,
    asset_count: 486,
    pending_tasks: 68,
    critical_defects: 9,
    corridor_status: "MODERATE_DENSITY",
    status_color: "#F59E0B",
    availability_score: 94.1
  },
  {
    section_id: 3,
    section_code: "SEC-03",
    section_name: "Aligarh (ALJN) — Tundla (TDL) Heavy Trunk",
    length_km: 78.5,
    track_count: 2,
    electrified: true,
    maximum_speed_kmph: 130,
    asset_count: 295,
    pending_tasks: 52,
    critical_defects: 5,
    corridor_status: "MODERATE_DENSITY",
    status_color: "#F59E0B",
    availability_score: 93.8
  },
  {
    section_id: 4,
    section_code: "SEC-04",
    section_name: "Tundla (TDL) Chord & Bypass Line",
    length_km: 35.0,
    track_count: 2,
    electrified: true,
    maximum_speed_kmph: 110,
    asset_count: 125,
    pending_tasks: 21,
    critical_defects: 2,
    corridor_status: "OPTIMAL_WINDOW_AVAILABLE",
    status_color: "#10B981",
    availability_score: 96.8
  }
];
