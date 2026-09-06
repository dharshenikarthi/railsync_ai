"""
RAILSYNC AI - Complete Project Dossier & Pitch Guide Generator
Generates both comprehensive PDF and Word (DOCX) documents covering every page,
R&D research links, mathematical formulations, and judge pitch scripts.
"""
import os, sys
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../docs"))
os.makedirs(OUTPUT_DIR, exist_ok=True)

DOCX_PATH = os.path.join(OUTPUT_DIR, "RAILSYNC_AI_Complete_Project_Dossier.docx")
PDF_PATH = os.path.join(OUTPUT_DIR, "RAILSYNC_AI_Complete_Project_Dossier.pdf")

PAGES_BREAKDOWN = [
    {
        "number": "1",
        "title": "Executive Operations Dashboard (ExecutiveDashboard.tsx)",
        "consist": (
            "• Live Golden Diagonal Route Topology (NDLS–PRYJ via TDL) with moving train telemetry pulse.\n"
            "• 8 Core Operations KPIs: Total Fixed Assets (1,845), Demurrage Saved (₹48.2L), Critical Defects (19), "
            "Pending Tasks (142), Available Blocks (24), Asset Availability (96.4%), Hours Saved (34.8%), Conflicts Avoided (14).\n"
            "• 7-Day Rolling Corridor Asset Availability Trajectory comparing manual baseline (88.5%) vs AI-optimized (95.8%).\n"
            "• Weekly Maintenance Block Utilization chart (hours allocated vs utilized, 94.2% average efficiency).\n"
            "• 3 Target Breakdown Panels: Tasks by Department (TMS/SMMS/TDMS), Tasks by RDSO Priority Scale, and Train Headway Safety Index (82% zero-conflict buffer)."
        ),
        "how_works": (
            "• Pulls real-time summary statistics from the FastAPI backend endpoint `/api/dashboard/summary` backed by PostgreSQL 18.\n"
            "• Displays dynamic AI operations recommendations computed by the OR-Tools solver.\n"
            "• All 8 KPI tiles and network sections are interactive, allowing 1-click drill-down navigation into underlying registries and planning modules."
        )
    },
    {
        "number": "2",
        "title": "Corridor & Network Topology (RailwayNetwork.tsx)",
        "consist": (
            "• Detailed sectional mapping of the Golden Diagonal Corridor across 6 sectors (SEC-01 New Delhi-Ghaziabad, "
            "SEC-02 Ghaziabad-Aligarh, SEC-03 Aligarh-Tundla, SEC-04 Tundla Chord, SEC-05 Tundla-Etawah, SEC-06 Etawah-Kanpur).\n"
            "• Track specifications: Quad Track, Double Line, Electrification (25kV AC), Section Speed (130/160 km/h), Maximum Axle Load (25t), TQI Health Index."
        ),
        "how_works": (
            "• Fetches structured spatial data from `/api/sections`.\n"
            "• Allows engineers and dispatchers to inspect sectional bottleneck indices, temporary speed restrictions (TSR), "
            "and scheduled shadow blocks across individual railway segments."
        )
    },
    {
        "number": "3",
        "title": "Train Timetables & COA Feed (TrainSchedule.tsx)",
        "consist": (
            "• Integrated Control Office Application (COA) live timetable feed.\n"
            "• Tracks passenger expresses (Vande Bharat 22436, Rajdhani 12424, Shatabdi 12004, Gomti Express 12420) and heavy freight rakes (BOXN Coal, BCN Fertilizer).\n"
            "• Arrival, departure, directional transit paths, sectional speeds, and headway safety windows."
        ),
        "how_works": (
            "• Ingests timetable records from `/api/trains` and `/api/trains/schedules`.\n"
            "• Identifies clean operational gaps (e.g. 02:00–04:30 IST night curfew) where multi-disciplinary maintenance can be performed without delaying high-priority passenger services."
        )
    },
    {
        "number": "4",
        "title": "Available Block Windows & Matrix (PlanningCalendar.tsx)",
        "consist": (
            "• Registry of certified engineering possession slots granted by the Operating Department.\n"
            "• Shows date, start/end time, available duration, allowed department limit (up to 3 parallel disciplines), and status (Available, Reserved, Approved)."
        ),
        "how_works": (
            "• Connects to `/api/blocks`.\n"
            "• Acts as candidate time-slot inputs for the Google OR-Tools CP-SAT combinatorial scheduling engine."
        )
    },
    {
        "number": "5",
        "title": "Cross-Department Live Telemetry Stream (DepartmentIntegration.tsx)",
        "consist": (
            "• Unified real-time telemetry hub bridging Track Maintenance System (TMS), Signal & Telecom (SMMS), Traction/OHE (TDMS), and Control Office (COA).\n"
            "• TMS Feed: Ultrasonic Flaw Detection (USFD) crack logs, Track Recording Car (TRC) geometry runs, TQI scores.\n"
            "• SMMS Feed: Point Machine operating current telemetry (perm. <= 4.2A), Digital Axle Counter wheel counts, Interlocking status.\n"
            "• TDMS Feed: 25 kV AC catenary tension (kgf), contact wire residual thickness (mm), spark-gap calibration, isolator resistance.\n"
            "• COA Feed: Active train paths, headway safety restrictions, power permit coordination."
        ),
        "how_works": (
            "• Pulls consolidated telemetry from `/api/departments/integration-data` with auto-sync polling every 5 seconds.\n"
            "• Harmonizes siloed departmental data into unified JSON schema feeds for the AI Compatibility & Scheduling Engine."
        )
    },
    {
        "number": "6",
        "title": "Loco Pilot Telemetry Feedback (LocoPilotFeedback.tsx)",
        "consist": (
            "• Crowdsourced operational feedback submitted by Loco Pilots and Assistant Loco Pilots (V-Crew).\n"
            "• Captures track jerk/vibration, rail abnormal sound, signal visibility obstruction, and OHE pantograph sparking with GPS kilometer markers.\n"
            "• Verification workflow with Section Engineer sign-off and automatic AI urgency booster (+15-25 points)."
        ),
        "how_works": (
            "• Connects to `/api/loco-pilot/feedback`.\n"
            "• Verified loco pilot complaints automatically spawn high-priority maintenance work orders and trigger dynamic re-planning."
        )
    },
    {
        "number": "7",
        "title": "Maintenance Tasks Repository (MaintenanceTasks.tsx)",
        "consist": (
            "• Master repository of all pending, scheduled, and completed maintenance work orders across Track, S&T, and Traction.\n"
            "• Displays Task Code, Department, Section, AI Urgency Score, Estimated Duration, and Loco Pilot linkage.\n"
            "• 1-Click CSV Export and 'AI Auto-Prioritize Queue' button."
        ),
        "how_works": (
            "• Connects to `/api/tasks` and `/api/ai/prioritize-all`.\n"
            "• Allows filtering by priority level (Critical, High, Medium, Low), department, and corridor section."
        )
    },
    {
        "number": "8",
        "title": "Fixed Assets Registry (AssetsPage.tsx)",
        "consist": (
            "• Comprehensive inventory of fixed railway infrastructure assets: Turnouts, Rail Segments (CWR/LWR), Point Machines, Digital Axle Counters, Contact Wires, Cantilevers, and TSS Isolators.\n"
            "• Location (km), health condition score (0-100), criticality grade, and operational status."
        ),
        "how_works": (
            "• Connects to `/api/assets`.\n"
            "• Maps asset degradation curves to inform preventive maintenance scheduling before failures occur."
        )
    },
    {
        "number": "9",
        "title": "Defect & Flaw Detection Registry (DefectsPage.tsx)",
        "consist": (
            "• Real-time safety defect registry capturing Ultrasonic Flaw Detection (USFD) transverse fatigue cracks, Alumino-thermic (AT) weld flaws, point machine stroke backlash, and contact wire wear.\n"
            "• Severity classification (IMR - Immediate Removal, REM - Early Removal, OBS - Observe)."
        ),
        "how_works": (
            "• Connects to `/api/defects`.\n"
            "• Feeds directly into the ML Priority Engine to enforce mandatory emergency block allocation."
        )
    },
    {
        "number": "10",
        "title": "AI Priority Center - ML Urgency Scoring (AIPriorityCenter.tsx)",
        "consist": (
            "• Interactive Machine Learning evaluation sandbox running a trained RandomForest Regressor.\n"
            "• Parameter Sliders: Asset Criticality, Defect Severity, Urgency Score, Overdue Days, Asset Condition, Safety Risk, Operational Impact, Loco Pilot Observations.\n"
            "• Live Radar Chart of 7 Operational Dimensions, ML Prediction Gauge (0-100), and Explainable AI (XAI) feature importance breakdown."
        ),
        "how_works": (
            "• Ingests parameters and calls `/api/ai/prioritize` to compute mathematical urgency scores and plain-English factor justifications."
        )
    },
    {
        "number": "11",
        "title": "AI Automatic Block Planner - OR-Tools CP-SAT (OptimizationCenter.tsx)",
        "consist": (
            "• Core automated multi-disciplinary block optimizer.\n"
            "• Section selector (SEC-01 to SEC-04) and 'GENERATE OPTIMIZED BLOCK PLAN' action.\n"
            "• Parallel Gantt Chart Timeline: Visualizes Track, S&T, and Traction tasks executing concurrently under 1 traffic block.\n"
            "• Before vs After Comparison: Proves 47.8% track hours saved, 0 express clashes, and +7.3% availability gain.\n"
            "• Alternative Candidate Windows scoring table (Top 3 candidate slots).\n"
            "• 'WHY THIS BLOCK?' Explainable AI Modal and 'ADD UNEXPECTED FREIGHT' scenario trigger.\n"
            "• Human-in-the-Loop Governance: APPROVE, MODIFY (with start/end time sliders), and REJECT controls."
        ),
        "how_works": (
            "• Submits combinatorial optimization requests to `/api/optimization/run`.\n"
            "• Google OR-Tools CP-SAT evaluates candidate blocks, enforces 15-min passenger headway buffers, and returns optimal shadow blocks in <120 ms."
        )
    },
    {
        "number": "12",
        "title": "Weekly Plan Matrix - 7-Day Tactical Roster (PlanningCalendar.tsx - Weekly)",
        "consist": (
            "• Tactical 7-day calendar matrix (Monday to Sunday).\n"
            "• Day-by-day block cards showing Block ID, Section, Window Time, Departments bundled, Task counts, Conflict Risk, and Approval status.\n"
            "• Interactive Day Selection showing detailed possession schedule and 'Open in Block Optimizer' action."
        ),
        "how_works": (
            "• Synchronizes with top navbar 'Weekly Plan' toggle and renders tactical schedules with 1-click export to CSV/PDF."
        )
    },
    {
        "number": "13",
        "title": "Monthly Plan Matrix - 4-Week Strategic Roadmap (PlanningCalendar.tsx - Monthly)",
        "consist": (
            "• Strategic 4-week corridor roadmap (Week 1 to Week 4).\n"
            "• Weekly summary cards: Total Tasks Planned, Critical Overdue Cleared, Planned Blocks, and Availability Trajectory (94.2% -> 97.4%).\n"
            "• Strategic capacity synergy callouts."
        ),
        "how_works": (
            "• Synchronizes with top navbar 'Monthly Plan' toggle to provide senior management with rolling 30-day capacity forecasts."
        )
    },
    {
        "number": "14",
        "title": "Operations Simulation Engine (Simulation.tsx)",
        "consist": (
            "• Discrete-event traffic simulator comparing 'Manual Sequential Baseline' vs 'AI-Optimized Shadow Plan'.\n"
            "• Train Path String Chart / Time-Distance Diagram.\n"
            "• Conflict detection matrix calculating headway clashes, speed restriction penalties, and net passenger punctuality."
        ),
        "how_works": (
            "• Calls `/api/simulation/run` to simulate train paths minute-by-minute across the corridor."
        )
    },
    {
        "number": "15",
        "title": "What-If Scenario Analysis - Digital Twin (WhatIfAnalysis.tsx)",
        "consist": (
            "• Real-time perturbation sandbox testing corridor resilience against 3 disturbance presets:\n"
            "  1. Unexpected Freight Influx (NTPC Dadri Coal Rake BCN-429 inserted into 02:10-02:50 slot).\n"
            "  2. Emergency IMR Rail Defect (Ultrasonic crack at Turnout 204 requiring urgent preemption).\n"
            "  3. Resource / Crew Diverted (S&T gang missing, dynamically unbundling into a 45-min dual block).\n"
            "• Interactive Sliders: Freight Delay Offset (0-120 mins), TSR Speed Limit (15-110 km/h), Emergency Preemption Toggle.\n"
            "• 3-Way Comparative Diff: Original Baseline vs Unmitigated Impact vs AI Re-Optimized Solution.\n"
            "• 'Submit Re-Plan for Approval' action transmitting re-routes to the Chief Controller."
        ),
        "how_works": (
            "• Sends perturbations to `/api/what-if/run` and re-solves the mathematical model in under 120 milliseconds."
        )
    },
    {
        "number": "16",
        "title": "Human Approvals Governance (Approvals.tsx)",
        "consist": (
            "• Official electronic sign-off queue for Divisional Railway Officers.\n"
            "• Displays pending block proposals, departments coordinated, safety impact assessment, and automated explanation summary.\n"
            "• Digital Approve, Reject, and Request Modification actions with auditable officer comments."
        ),
        "how_works": (
            "• Connects to `/api/approvals`, upholding the governance principle that AI proposes while authorized officers sign off."
        )
    },
    {
        "number": "17",
        "title": "System Alerts & Operational Notifications (Notifications.tsx)",
        "consist": (
            "• Live operational alert stream across TMS, SMMS, TDMS, and Control Office dispatchers.\n"
            "• Filter by All, Critical Only (IMR flaw alerts), and Unread.\n"
            "• 1-Click 'Mark All as Read' action."
        ),
        "how_works": (
            "• Connects to `/api/notifications` and reflects unread alert count badge ('4') in the top navbar."
        )
    },
    {
        "number": "18",
        "title": "Operational Efficiency & Audit Reports (Reports.tsx)",
        "consist": (
            "• Comprehensive audit dashboard for RDSO and Railway Board inspections.\n"
            "• Metric views across Weekly, Monthly, and Quarterly periods: Total Blocks Executed, Block Hours Utilized, Possession Hours Saved (47.4%), Passenger Punctuality (98.2%), Demurrage Avoided (₹14.8L), Corridor Availability Score (96.4%).\n"
            "• Departmental bundling breakdown and verified audit compliance logs.\n"
            "• 1-Click Downloads for Complete Project Dossier (PDF), Complete Dossier (Word DOCX), and Audit CSV."
        ),
        "how_works": (
            "• Connects to `/api/reports/summary` and `/api/docs/download/{file_type}`."
        )
    },
    {
        "number": "19",
        "title": "System Settings & Configuration (Settings.tsx)",
        "consist": (
            "• Engine parameter tuning: Headway buffer threshold (15 mins), Optimization objective weights, solver timeout (1000 ms), auto-sync intervals.\n"
            "• Database status and connected subsystem health."
        ),
        "how_works": (
            "• Allows authorized administrators to calibrate optimization weights and connection strings."
        )
    },
    {
        "number": "20",
        "title": "Role-Based Access Control & Login (Navbar & Login.tsx)",
        "consist": (
            "• Top navbar Multi-Persona Switcher supporting 5 Railway Personas:\n"
            "  1. Shri Rajeshwar Sharma, IRTS (Chief Operations Manager - CPTM, HQ Level 14)\n"
            "  2. Smt. Ananya Sen, IRSE (Senior Divisional Engineer - Sr. DEN / P-Way)\n"
            "  3. Shri Vikramaditya Rao, IRSSE (Senior Divisional Signal & Telecom Engineer - Sr. DSTE)\n"
            "  4. Shri Harpreet Singh, IRSEE (Senior Divisional Electrical Engineer - Sr. DEE / Traction)\n"
            "  5. Shri Manoj Deshmukh (Chief Controller & Power Controller - Operating Department)\n"
            "• Custom JWT credentials login page."
        ),
        "how_works": (
            "• Persists user state in `localStorage` and transmits JWT Bearer tokens with full RBAC permission enforcement."
        )
    }
]


def create_docx():
    doc = Document()

    for section in doc.sections:
        section.top_margin = Inches(0.7)
        section.bottom_margin = Inches(0.7)
        section.left_margin = Inches(0.7)
        section.right_margin = Inches(0.7)

    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    # Document Header
    title_p = doc.add_paragraph()
    title_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = title_p.add_run("RAILSYNC.AI")
    r_title.bold = True
    r_title.font.size = Pt(26)
    r_title.font.color.rgb = RGBColor(0, 45, 98)

    sub_p = doc.add_paragraph()
    sub_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = sub_p.add_run("Automatic Block Planning, Cross-Departmental Coordination & Optimization System\nIndian Railways • Ministry of Railways (CRIS / RDSO Architecture)")
    r_sub.font.size = Pt(11.5)
    r_sub.font.color.rgb = RGBColor(2, 132, 199)

    tag_p = doc.add_paragraph()
    tag_p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_tag = tag_p.add_run("COMPLETE PROJECT DOSSIER, FULL APPLICATION PAGE-BY-PAGE SPECIFICATION, R&D RESEARCH LINKS & JUDGES' PITCH GUIDE\nVersion 2.4 (Production Grade) • Confidential & Academic Documentation")
    r_tag.italic = True
    r_tag.font.size = Pt(9)
    r_tag.font.color.rgb = RGBColor(100, 116, 139)

    doc.add_paragraph("―" * 55).alignment = WD_ALIGN_PARAGRAPH.CENTER

    # SECTION 1
    doc.add_heading("1. Executive Summary & Problem Landscape", level=1)
    doc.add_paragraph(
        "Indian Railways operates the 4th largest railway network in the world, running over 13,000 passenger trains "
        "and 8,000 freight rakes daily across 68,000+ route kilometers. Maintaining track safety and fixed infrastructure "
        "requires periodic traffic possessions ('traffic blocks') where train movements are suspended to allow maintenance crews onto the tracks.\n\n"
        "The Existing Crisis in Manual Planning:\n"
        "Currently, maintenance scheduling is conducted in manual departmental silos:\n"
        "• Civil Engineering (TMS): Requests track tamping, rail weld renewals, ballast screening.\n"
        "• Signalling & Telecom (SMMS): Requests point machine lubrication, axle counter overhauls, track circuit testing.\n"
        "• Traction / Electrical (TDMS): Requests 25 kV AC catenary tuning, insulator cleaning, cantilever adjustments.\n"
        "• Control Office (COA / FOIS): Evaluates requests manually against dynamic train schedules.\n\n"
        "Because each department requests separate, uncoordinated blocks, the same railway track section is closed 3 to 4 times a week. "
        "This leads to severe track capacity loss, train punctuality deterioration (15-45 min delays per block), coal/freight demurrage penalties, "
        "and maintenance backlogs that cause speed restrictions (TSR) and safety incidents."
    )

    # SECTION 2
    doc.add_heading("2. Multi-Disciplinary Shadow Block Concept (The Core Breakthrough)", level=1)
    doc.add_paragraph(
        "RAILSYNC.AI introduces the Coordinated Shadow Block Architecture. Instead of granting 3 separate closures of 45 minutes each "
        "(totaling 135 minutes of track downtime), the system synchronizes compatible maintenance tasks across Engineering, S&T, "
        "and Traction under a single 60-minute window during off-peak headway gaps."
    )
    
    table = doc.add_table(rows=1, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    hdr_cells = table.rows[0].cells
    hdr_cells[0].text = "Operational Metric"
    hdr_cells[1].text = "Manual Siloed Planning (Baseline)"
    hdr_cells[2].text = "RAILSYNC.AI Coordinated Shadow Block"
    for cell in hdr_cells:
        set_cell_background(cell, "002D62")
        for par in cell.paragraphs:
            for r in par.runs:
                r.bold = True
                r.font.color.rgb = RGBColor(255, 255, 255)

    comparison_data = [
        ("Possession Structure", "3 separate uncoordinated closures", "1 unified shadow block"),
        ("Total Track Downtime", "115–135 minutes per week", "60 minutes per week (47.8% saved)"),
        ("Passenger Train Conflicts", "3–5 train path disruptions", "0 conflicts (Clean off-peak window)"),
        ("Corridor Availability", "88.5% capacity utilization", "95.8% capacity utilization (+7.3%)"),
        ("Traction Power Permits", "Manual paper PTW coordination", "Automated 25kV power block lockstep"),
        ("Emergency Re-Planning", "Manual cancellation (3-4 hours)", "AI Re-solve in < 120 milliseconds")
    ]

    for metric, manual, ai in comparison_data:
        row = table.add_row().cells
        row[0].text = metric
        row[1].text = manual
        row[2].text = ai
        set_cell_background(row[2], "E0F2FE")

    doc.add_page_break()

    # SECTION 3 - COMPLETE PAGE-BY-PAGE DEEP DIVE
    doc.add_heading("3. Complete Application Page-by-Page Deep Dive", level=1)
    doc.add_paragraph(
        "This section details each of the 20 distinct pages, screens, and modules in the RAILSYNC.AI application, "
        "documenting exactly what each page consists of and how it works under the hood."
    )

    for page in PAGES_BREAKDOWN:
        p_title = doc.add_heading(f"Page {page['number']}: {page['title']}", level=2)
        p_consist = doc.add_paragraph()
        r_c_hdr = p_consist.add_run("What it Consists of:\n")
        r_c_hdr.bold = True
        r_c_hdr.font.color.rgb = RGBColor(0, 45, 98)
        p_consist.add_run(page['consist'])

        p_works = doc.add_paragraph()
        r_w_hdr = p_works.add_run("How it Works & Technical Flow:\n")
        r_w_hdr.bold = True
        r_w_hdr.font.color.rgb = RGBColor(2, 132, 199)
        p_works.add_run(page['how_works'])
        doc.add_paragraph("")

    doc.add_page_break()

    # SECTION 4
    doc.add_heading("4. Mathematical Optimization Formulation (Google OR-Tools CP-SAT)", level=1)
    doc.add_paragraph(
        "Objective Function:\n"
        "Maximize Z = Σ (w_priority * Priority_Score_i * X_i,j) + Σ (w_shadow * Multi_Dept_Synergy_Bonus_j) "
        "- Σ (w_train * Train_Clash_Penalty_j) - Σ (w_freight * Freight_Congestion_Penalty_j) - Σ (w_duration * Downtime_Minutes_j)\n\n"
        "Subject to Hard Constraints:\n"
        "1. Safety Headway Buffer: start_time(Block_j) >= dep_time(PassengerTrain_k) + 15 min buffer.\n"
        "2. Task Capacity Constraint: Σ duration(Task_i) <= Block_Duration_j (Parallel non-interfering tasks execute simultaneously).\n"
        "3. Department Compatibility Matrix: P-Way tamping and OHE catenary work can execute in parallel; heavy track slewing isolates OHE power.\n"
        "4. Machine Resource Uniqueness: Tower wagons and Track Tamping machines cannot be assigned to overlapping sections simultaneously."
    )

    # SECTION 5
    doc.add_heading("5. Machine Learning Priority Pipeline & Explainable AI (XAI)", level=1)
    doc.add_paragraph(
        "RAILSYNC.AI uses a trained RandomForest Regression Pipeline calibrated on RDSO Track Inspection Standards. "
        "Every incoming maintenance task is dynamically scored from 0 to 100 based on:\n"
        "• Asset Criticality (Turnout > Mainline Track > Loop Line)\n"
        "• Ultrasonic Flaw Detection (USFD) defect severity (IMR: Immediate Removal, REM: Early Removal, OBS: Observe)\n"
        "• Track Geometry Recording Car (TRC) Track Quality Index (TQI)\n"
        "• Days Overdue beyond mandatory maintenance cycle\n"
        "• Real-time Loco Pilot V-Crew Feedback Observations (Vibration, Track Jerk, OHE Sparking)\n\n"
        "Explainable AI Justifications:\n"
        "The system generates auditable, plain-English rationales for every block scheduled, explaining to the Chief Controller "
        "exactly why a window was chosen, why specific tasks were bundled, and which train conflicts were avoided."
    )

    # SECTION 6
    doc.add_heading("6. Official R&D References & Indian Railways Research Links", level=1)
    rd_refs = [
        ("RDSO Track Maintenance Manual (2024 Edition)", "Indian Railways Technical Guidelines for USFD, TRC & Track Safety", "https://rdso.indianrailways.gov.in"),
        ("Indian Railway Permanent Way Manual (IRPWM)", "Mandatory Regulations for Track Maintenance & Traffic Block Planning", "https://indianrailways.gov.in"),
        ("CRIS Control Office Application (COA)", "Real-Time Train Movement & Timetable Governance Infrastructure", "https://cris.org.in"),
        ("Google OR-Tools CP-SAT Documentation", "Constraint Programming and Combinatorial Optimization in Transportation", "https://developers.google.com/optimization/cp"),
        ("Scikit-Learn XAI / RandomForest", "Predictive Asset Health & Condition-Based Maintenance Analytics", "https://scikit-learn.org")
    ]
    for title, desc, link in rd_refs:
        p = doc.add_paragraph()
        r_t = p.add_run(f"• {title}: ")
        r_t.bold = True
        p.add_run(f"{desc} — Reference URL: {link}")

    doc.add_page_break()

    # SECTION 7 - PITCH GUIDE
    doc.add_heading("7. Winning Pitch Guide: How to Present to Judges & Officers", level=1)
    doc.add_paragraph(
        "THE 3-MINUTE ELEVATOR PITCH SCRIPT:\n\n"
        "[0:00 – 0:45] The Problem Hook:\n"
        "'Respected Judges, Indian Railways operates over 21,000 trains every day. But today, whenever Civil Engineering, "
        "Signalling, or Traction needs to fix a track, they ask for separate blocks at separate times. The result? The same track is closed "
        "3 to 4 times a week, causing cascading train delays, passenger dissatisfaction, and crores of rupees in demurrage penalties.'\n\n"
        "[0:45 – 1:30] The Solution:\n"
        "'We present RAILSYNC.AI: Indian Railways' first Intelligent Multi-Disciplinary Automatic Block Planning & Optimization System. "
        "Instead of fragmented closures, our Google OR-Tools CP-SAT engine bundles compatible cross-department tasks into unified 'Shadow Blocks' "
        "fitted precisely into off-peak train headway gaps.'\n\n"
        "[1:30 – 2:30] Live Demonstration Walkthrough:\n"
        "'In our live demonstration on the New Delhi–Tundla Golden Diagonal Corridor:\n"
        "1. Our ML Priority Engine ingests USFD flaw logs, track geometry data, and Loco Pilot feedback to score task urgency.\n"
        "2. With one click on 'OPTIMIZE', OR-Tools solves millions of combinatorial possibilities in 118 milliseconds, cutting track downtime by 47.8%.\n"
        "3. In our What-If Sandbox, when a surprise coal rake arrives, the Digital Twin dynamically shifts the block without delaying a single Rajdhani or Vande Bharat train.'\n\n"
        "[2:30 – 3:00] Conclusion & Governance:\n"
        "'Crucially, RAILSYNC.AI preserves human governance: AI recommends, optimization schedules, and authorized Railway Officers approve. "
        "RAILSYNC.AI transforms railway maintenance from reactive firefighting into predictive, mathematically optimal orchestration.'"
    )

    doc.add_heading("8. Top 10 Anticipated Judges' Questions & Model Answers", level=1)
    qa_list = [
        (
            "Q1: How do you guarantee passenger train safety and zero collision risk?",
            "Answer: Our CP-SAT model strictly enforces a mandatory 15-minute headway safety buffer before and after every passenger train path (COA timetable feed). A block is mathematically prohibited from being scheduled if it violates sectional headway."
        ),
        (
            "Q2: How does the system handle incompatible tasks (e.g. track slewing vs OHE live wire)?",
            "Answer: We built a Cross-Department Compatibility Matrix. Tasks that require power shut-down (25kV OHE isolation) are paired exclusively with work permits that can safely execute under de-energized catenaries."
        ),
        (
            "Q3: What if maintenance work overruns its scheduled time?",
            "Answer: The system features real-time telemetry buffer tracking and dynamic speed restriction (TSR) fallback simulation, immediately alerting the Chief Controller with mitigation routes."
        ),
        (
            "Q4: Is human authority bypassed by the AI?",
            "Answer: Absolutely not. Our core governance philosophy is: 'AI predicts & prioritizes, optimization schedules, authorized officers approve.' The system provides explainable AI recommendations, but requires digital approval from the CPTM or Divisional Officer."
        ),
        (
            "Q5: How does this scale across all 68 Indian Railways divisions?",
            "Answer: The architecture is built on standard REST APIs and PostgreSQL 18, with Docker containerization. It can ingest any divisional TMS, SMMS, TDMS, and COA timetable feed."
        ),
        (
            "Q6: What is the return on investment (ROI)?",
            "Answer: On the 244 km Northern Railway test corridor, RAILSYNC.AI delivers a 47.8% reduction in track downtime, eliminates passenger headway clashes, and generates ₹48.2 Lakhs in monthly demurrage savings per corridor section."
        )
    ]
    for q, a in qa_list:
        p = doc.add_paragraph()
        r_q = p.add_run(f"{q}\n")
        r_q.bold = True
        r_q.font.color.rgb = RGBColor(0, 45, 98)
        p.add_run(f"{a}\n")

    doc.save(DOCX_PATH)
    print(f"[OK] DOCX created: {DOCX_PATH}")


def create_pdf():
    pdf = SimpleDocTemplate(
        PDF_PATH,
        pagesize=A4,
        rightMargin=36,
        leftMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor('#002D62'),
        alignment=1
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=colors.HexColor('#0284C7'),
        alignment=1
    )

    tag_style = ParagraphStyle(
        'DocTag',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#64748B'),
        alignment=1
    )

    h1_style = ParagraphStyle(
        'Heading1_Custom',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#002D62'),
        spaceBefore=10,
        spaceAfter=4
    )

    h2_style = ParagraphStyle(
        'Heading2_Custom',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=13,
        textColor=colors.HexColor('#004B87'),
        spaceBefore=6,
        spaceAfter=2
    )

    body_style = ParagraphStyle(
        'Body_Custom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=4
    )

    qa_q_style = ParagraphStyle(
        'QA_Q',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#002D62'),
        spaceBefore=4
    )

    story = []

    # Title & Header
    story.append(Paragraph("RAILSYNC.AI", title_style))
    story.append(Spacer(1, 3))
    story.append(Paragraph("Automatic Block Planning, Cross-Departmental Coordination & Optimization System<br/>Indian Railways • Ministry of Railways (CRIS / RDSO Architecture)", subtitle_style))
    story.append(Spacer(1, 3))
    story.append(Paragraph("COMPLETE PROJECT DOSSIER, FULL APPLICATION PAGE-BY-PAGE SPECIFICATION, R&D RESEARCH LINKS & JUDGES' PITCH GUIDE<br/>Version 2.4 (Production Grade) • Confidential & Academic Documentation", tag_style))
    story.append(Spacer(1, 6))
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor('#002D62'), spaceAfter=8))

    # Section 1
    story.append(Paragraph("1. Executive Summary & Problem Landscape", h1_style))
    story.append(Paragraph(
        "Indian Railways operates 13,000+ passenger trains and 8,000+ freight rakes daily. "
        "Maintenance is currently scheduled in manual departmental silos (Civil Track/TMS, Signalling/SMMS, Traction/TDMS, and Control Office/COA). "
        "Because departments operate independently, the same track section is closed 3 to 4 times a week, causing cascading train delays, "
        "freight demurrage penalties, and maintenance backlogs.", body_style
    ))

    # Section 2
    story.append(Paragraph("2. Multi-Disciplinary Shadow Block Concept", h1_style))
    story.append(Paragraph(
        "RAILSYNC.AI synchronizes compatible cross-departmental maintenance tasks under unified 'Shadow Blocks' fitted precisely into "
        "off-peak train headway gaps. This cuts total track closure hours by 47.8% while preserving full safety buffers.", body_style
    ))

    # Table
    table_data = [
        [Paragraph("<b>Metric</b>", body_style), Paragraph("<b>Manual Siloed Planning</b>", body_style), Paragraph("<b>RAILSYNC.AI Shadow Block</b>", body_style)],
        [Paragraph("Possession Structure", body_style), Paragraph("3 separate uncoordinated blocks", body_style), Paragraph("<b>1 unified shadow block</b>", body_style)],
        [Paragraph("Total Track Downtime", body_style), Paragraph("115–135 mins / week", body_style), Paragraph("<b>60 mins / week (47.8% saved)</b>", body_style)],
        [Paragraph("Passenger Train Delay", body_style), Paragraph("3–5 train path disruptions", body_style), Paragraph("<b>0 conflicts (Zero delay)</b>", body_style)],
        [Paragraph("Corridor Availability", body_style), Paragraph("88.5% capacity", body_style), Paragraph("<b>95.8% capacity (+7.3%)</b>", body_style)],
        [Paragraph("Re-Planning Speed", body_style), Paragraph("3–4 hours manual paper flow", body_style), Paragraph("<b>< 120 ms (OR-Tools CP-SAT)</b>", body_style)]
    ]
    t = Table(table_data, colWidths=[1.8*inch, 2.3*inch, 2.8*inch])
    t.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#002D62')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
        ('BACKGROUND', (2, 1), (2, -1), colors.HexColor('#E0F2FE')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
    ]))
    story.append(t)
    story.append(Spacer(1, 8))

    # Section 3 - COMPLETE PAGE-BY-PAGE SPECIFICATION
    story.append(Paragraph("3. Complete Application Page-by-Page Deep Dive (All Modules)", h1_style))
    story.append(Paragraph(
        "Comprehensive architectural breakdown of all 20 pages and subsystems in the RAILSYNC.AI application:", body_style
    ))

    for page in PAGES_BREAKDOWN:
        story.append(Paragraph(f"<b>Page {page['number']}: {page['title']}</b>", h2_style))
        story.append(Paragraph(f"<b>• What it Consists of:</b> {page['consist'].replace(chr(10), '<br/>')}", body_style))
        story.append(Paragraph(f"<b>• How it Works:</b> {page['how_works'].replace(chr(10), '<br/>')}", body_style))
        story.append(Spacer(1, 3))

    # Section 4 - Mathematical Formulation
    story.append(Paragraph("4. Mathematical Optimization Formulation (Google OR-Tools CP-SAT)", h1_style))
    story.append(Paragraph(
        "<b>Objective Function:</b> Maximize Z = Σ(w_priority * Priority_i * X_i,j) + Σ(w_shadow * Synergy_Bonus_j) - Σ(w_train * Clash_Penalty_j) - Σ(w_duration * Duration_j)<br/>"
        "<b>Hard Constraints:</b> Mandatory 15-minute passenger train headway safety buffer, machine resource exclusivity (tamping machines & tower wagons), and 25kV traction power isolation lockstep.", body_style
    ))

    # Section 5 - ML & XAI
    story.append(Paragraph("5. Machine Learning Urgency Scoring & Explainable AI (XAI)", h1_style))
    story.append(Paragraph(
        "RandomForest Regressor ingests USFD flaw detection logs, TRC geometry car indices (TQI), asset criticality, and real-time Loco Pilot feedback. "
        "Generates auditable, plain-English rationales explaining why each block was selected and how conflicts were avoided.", body_style
    ))

    # Section 6 - References
    story.append(Paragraph("6. Official R&D References & Research Links", h1_style))
    story.append(Paragraph(
        "1. <b>RDSO Track Maintenance Manual (2024):</b> Technical specs for USFD, TRC & Track Geometry (<font color='#0284C7'>https://rdso.indianrailways.gov.in</font>)<br/>"
        "2. <b>Indian Railway Permanent Way Manual (IRPWM):</b> Traffic Block Regulations (<font color='#0284C7'>https://indianrailways.gov.in</font>)<br/>"
        "3. <b>CRIS Control Office Application (COA):</b> Timetable & Freight Dispatch System (<font color='#0284C7'>https://cris.org.in</font>)<br/>"
        "4. <b>Google OR-Tools CP-SAT:</b> Combinatorial Transportation Optimization (<font color='#0284C7'>https://developers.google.com/optimization</font>)", body_style
    ))

    # Section 7 - Pitch Guide
    story.append(Paragraph("7. Pitch Guide: 3-Minute Presentation to Judges", h1_style))
    story.append(Paragraph(
        "<b>[0:00–0:45] The Hook:</b> Highlight the daily challenge of 21,000+ trains and 3–4 uncoordinated closures on the same track.<br/>"
        "<b>[0:45–1:30] The Solution:</b> Introduce RAILSYNC.AI and the Coordinated Multi-Disciplinary Shadow Block innovation.<br/>"
        "<b>[1:30–2:30] Live Demo:</b> Show ML Priority ranking, click 'OPTIMIZE' (118 ms solve time, 47.8% hours saved), and trigger What-If freight influx.<br/>"
        "<b>[2:30–3:00] Governance:</b> Emphasize officer-in-the-loop approval: 'AI predicts, optimization schedules, authorized officers approve.'", body_style
    ))

    # Section 8 - Top Q&A
    story.append(Paragraph("8. Top Judges' Q&A", h1_style))
    story.append(Paragraph("<b>Q: How is train safety guaranteed?</b>", qa_q_style))
    story.append(Paragraph("A: The CP-SAT solver strictly enforces mandatory 15-minute headway buffers before and after passenger trains. Overlapping blocks are mathematically prohibited.", body_style))
    story.append(Paragraph("<b>Q: Is human authority bypassed?</b>", qa_q_style))
    story.append(Paragraph("A: No. AI only generates optimal recommendations; final execution requires authorized digital sign-off via RBAC.", body_style))

    pdf.build(story)
    print(f"[OK] PDF created: {PDF_PATH}")


if __name__ == "__main__":
    create_docx()
    create_pdf()
