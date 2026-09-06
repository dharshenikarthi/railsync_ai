"""
RAILSYNC AI - Database Initialization and Seed Script
Populates PostgreSQL RAILSYNC_DB with realistic synthetic Indian Railways data.
"""
import os
import datetime
from decimal import Decimal
import psycopg2
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

DB_NAME = os.getenv("DB_NAME", "RAILSYNC_DB")
DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASSWORD", "dharshenikarthi")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")

def get_connection():
    return psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )

def seed_database():
    conn = get_connection()
    conn.autocommit = False
    cur = conn.cursor()
    print("Connected to PostgreSQL RAILSYNC_DB successfully.")

    try:
        # 1. Seed Users
        users = [
            ("admin", "admin@railsync.ir.in", hash_password("Admin@123"), "System Administrator", "9876543210", "ADMIN", 5),
            ("planner", "planner@railsync.ir.in", hash_password("Planner@123"), "Chief Planning Officer", "9876543211", "MAINTENANCE_PLANNER", 4),
            ("eng_officer", "eng@railsync.ir.in", hash_password("Eng@123"), "Senior Divisional Engineer (Track)", "9876543212", "ENGINEERING_OFFICER", 1),
            ("snt_officer", "snt@railsync.ir.in", hash_password("Snt@123"), "Senior Divisional Signal & Telecom Engineer", "9876543213", "SNT_OFFICER", 2),
            ("trd_officer", "trd@railsync.ir.in", hash_password("Trd@123"), "Senior Divisional Electrical Engineer (TRD)", "9876543214", "TRD_OFFICER", 3),
            ("control_officer", "control@railsync.ir.in", hash_password("Control@123"), "Chief Controller (COA)", "9876543215", "CONTROL_OFFICER", 4),
            ("manager", "manager@railsync.ir.in", hash_password("Manager@123"), "Divisional Railway Manager", "9876543216", "MANAGER", 5),
        ]

        cur.execute("SELECT count(*) FROM users;")
        if cur.fetchone()[0] == 0:
            for u in users:
                cur.execute("""
                    INSERT INTO users (username, email, password_hash, full_name, phone, role, department_id, is_active, is_verified, created_at, updated_at)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, TRUE, TRUE, NOW(), NOW());
                """, u)
            print(f"Seeded {len(users)} users.")

        cur.execute("SELECT user_id FROM users WHERE username = 'admin';")
        admin_user_id = cur.fetchone()[0]

        # 2. Seed Zones and Divisions
        cur.execute("SELECT count(*) FROM railway_zones;")
        if cur.fetchone()[0] <= 1:
            cur.execute("""
                INSERT INTO railway_zones (zone_code, zone_name, headquarters, is_active, created_at)
                VALUES ('NR', 'Northern Railway', 'Baroda House, New Delhi', TRUE, NOW())
                ON CONFLICT (zone_code) DO NOTHING;
            """)

        cur.execute("SELECT zone_id FROM railway_zones WHERE zone_code = 'NR';")
        nr_zone_id = cur.fetchone()[0]

        cur.execute("SELECT count(*) FROM divisions;")
        if cur.fetchone()[0] <= 1:
            cur.execute("""
                INSERT INTO divisions (zone_id, division_code, division_name, headquarters, is_active, created_at)
                VALUES (%s, 'DLI', 'Delhi Division', 'State Entry Road, New Delhi', TRUE, NOW())
                ON CONFLICT (division_code) DO NOTHING;
            """, (nr_zone_id,))

        cur.execute("SELECT division_id FROM divisions WHERE division_code = 'DLI';")
        dli_div_id = cur.fetchone()[0]

        # 3. Seed Stations
        stations_data = [
            ("NDLS", "New Delhi", Decimal("28.6415"), Decimal("77.2209"), "A1"),
            ("GZB", "Ghaziabad Junction", Decimal("28.6692"), Decimal("77.4538"), "A"),
            ("ALJN", "Aligarh Junction", Decimal("27.8974"), Decimal("78.0880"), "A"),
            ("TDL", "Tundla Junction", Decimal("27.2078"), Decimal("78.2415"), "A"),
            ("CNB", "Kanpur Central", Decimal("26.4539"), Decimal("80.3508"), "A1")
        ]
        station_id_map = {}
        for code, name, lat, lon, cat in stations_data:
            cur.execute("""
                INSERT INTO stations (division_id, station_code, station_name, latitude, longitude, station_category, is_active, created_at)
                VALUES (%s, %s, %s, %s, %s, %s, TRUE, NOW())
                ON CONFLICT (station_code) DO UPDATE SET station_name = EXCLUDED.station_name
                RETURNING station_id, station_code;
            """, (dli_div_id, code, name, lat, lon, cat))
            row = cur.fetchone()
            station_id_map[row[1]] = row[0]
        print(f"Seeded {len(stations_data)} stations.")

        # 4. Seed Railway Sections
        sections_data = [
            ("SEC-01", "New Delhi - Ghaziabad Main Line", station_id_map["NDLS"], station_id_map["GZB"], Decimal("25.50"), 4, True, Decimal("130.00")),
            ("SEC-02", "Ghaziabad - Aligarh Corridor", station_id_map["GZB"], station_id_map["ALJN"], Decimal("105.00"), 2, True, Decimal("130.00")),
            ("SEC-03", "Aligarh - Tundla Heavy Trunk", station_id_map["ALJN"], station_id_map["TDL"], Decimal("78.50"), 2, True, Decimal("130.00")),
            ("SEC-04", "Tundla Chord & Bypass Line", station_id_map["TDL"], station_id_map["CNB"], Decimal("35.00"), 2, True, Decimal("110.00"))
        ]
        section_id_map = {}
        for code, name, start_stn, end_stn, length, tracks, elec, max_spd in sections_data:
            cur.execute("""
                INSERT INTO railway_sections (division_id, section_code, section_name, start_station_id, end_station_id, length_km, track_count, electrified, maximum_speed_kmph, status, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, 'ACTIVE', NOW(), NOW())
                ON CONFLICT (section_code) DO UPDATE SET section_name = EXCLUDED.section_name
                RETURNING section_id, section_code;
            """, (dli_div_id, code, name, start_stn, end_stn, length, tracks, elec, max_spd))
            row = cur.fetchone()
            section_id_map[row[1]] = row[0]
        print(f"Seeded {len(sections_data)} sections.")

        # 5. Asset Categories
        cur.execute("SELECT count(*) FROM asset_categories;")
        cat_count = cur.fetchone()[0]
        if cat_count < 5:
            cat_list = [
                ("TRK", "Track Infrastructure", 1, "Rails, sleepers, turnouts, ballast, and switches"),
                ("SIG", "Signalling & Telecom", 2, "Signals, point machines, track circuits, axle counters, EI"),
                ("OHE", "Overhead Equipment", 3, "Contact wire, catenary, mast, insulators, AT/PT"),
                ("TRF", "Traction Power Supply", 3, "Traction substations, switching posts, circuit breakers"),
                ("CIV", "Civil Structures", 1, "Bridges, culverts, level crossings, drainage")
            ]
            for c_code, c_name, dept_id, desc in cat_list:
                cur.execute("""
                    INSERT INTO asset_categories (category_code, category_name, department_id, description, created_at)
                    VALUES (%s, %s, %s, %s, NOW())
                    ON CONFLICT (category_code) DO NOTHING;
                """, (c_code, c_name, dept_id, desc))

        cur.execute("SELECT category_code, category_id FROM asset_categories;")
        category_map = dict(cur.fetchall())

        # 6. Seed Assets (21 assets across SEC-01 to SEC-04)
        cur.execute("SELECT count(*) FROM assets;")
        if cur.fetchone()[0] < 10:
            assets_to_seed = [
                # Track Assets (ENG, dept=1)
                ("AST-TRK-101", "Turnout 1:12 Point 101A/B", "TURNOUT", section_id_map["SEC-01"], category_map.get("TRK", 1), 1, Decimal("12.4"), Decimal("82.5"), "HIGH", "OPERATIONAL"),
                ("AST-TRK-102", "Curved Track km 18/2-6 Up Line", "TRACK_SEGMENT", section_id_map["SEC-01"], category_map.get("TRK", 1), 1, Decimal("18.3"), Decimal("65.0"), "CRITICAL", "DEGRADED"),
                ("AST-TRK-201", "Continuous Welded Rail km 45-48", "RAIL_CWR", section_id_map["SEC-02"], category_map.get("TRK", 1), 1, Decimal("46.5"), Decimal("88.0"), "MEDIUM", "OPERATIONAL"),
                ("AST-TRK-202", "Diamond Crossing km 72/1", "CROSSING", section_id_map["SEC-02"], category_map.get("TRK", 1), 1, Decimal("72.1"), Decimal("71.0"), "HIGH", "OPERATIONAL"),
                ("AST-TRK-301", "Deep Screening Ballast Bed km 115", "BALLAST_BED", section_id_map["SEC-03"], category_map.get("TRK", 1), 1, Decimal("115.0"), Decimal("58.0"), "CRITICAL", "DEGRADED"),
                ("AST-TRK-401", "SEC-04 Up Main Turnout 204", "TURNOUT", section_id_map["SEC-04"], category_map.get("TRK", 1), 1, Decimal("142.2"), Decimal("60.0"), "CRITICAL", "DEGRADED"),
                ("AST-TRK-402", "SEC-04 Track Geometry km 145-147", "TRACK_GEOMETRY", section_id_map["SEC-04"], category_map.get("TRK", 1), 1, Decimal("146.0"), Decimal("72.0"), "HIGH", "OPERATIONAL"),
                
                # S&T Assets (SNT, dept=2)
                ("AST-SIG-101", "Home Signal 4-Aspect LED GZB-H1", "COLOUR_LIGHT_SIGNAL", section_id_map["SEC-01"], category_map.get("SIG", 2), 2, Decimal("24.8"), Decimal("90.0"), "HIGH", "OPERATIONAL"),
                ("AST-SIG-102", "Digital Axle Counter DAC-01-UP", "AXLE_COUNTER", section_id_map["SEC-01"], category_map.get("SIG", 2), 2, Decimal("15.1"), Decimal("84.0"), "MEDIUM", "OPERATIONAL"),
                ("AST-SIG-201", "Point Machine 202A Electric", "POINT_MACHINE", section_id_map["SEC-02"], category_map.get("SIG", 2), 2, Decimal("55.0"), Decimal("62.0"), "CRITICAL", "DEGRADED"),
                ("AST-SIG-202", "Audio Frequency Track Circuit AFTC-22", "TRACK_CIRCUIT", section_id_map["SEC-02"], category_map.get("SIG", 2), 2, Decimal("85.4"), Decimal("78.0"), "MEDIUM", "OPERATIONAL"),
                ("AST-SIG-301", "Electronic Interlocking EI-Rack TDL", "INTERLOCKING_EI", section_id_map["SEC-03"], category_map.get("SIG", 2), 2, Decimal("135.0"), Decimal("95.0"), "CRITICAL", "OPERATIONAL"),
                ("AST-SIG-401", "SEC-04 S&T Point Machine PM-401", "POINT_MACHINE", section_id_map["SEC-04"], category_map.get("SIG", 2), 2, Decimal("142.3"), Decimal("68.0"), "HIGH", "OPERATIONAL"),
                ("AST-SIG-402", "SEC-04 Axle Counter Block System", "AXLE_COUNTER", section_id_map["SEC-04"], category_map.get("SIG", 2), 2, Decimal("148.0"), Decimal("85.0"), "MEDIUM", "OPERATIONAL"),

                # TRD Assets (TRD, dept=3)
                ("AST-TRD-101", "Cantilever Mast OHE-12/18 UP", "OHE_CANTILEVER", section_id_map["SEC-01"], category_map.get("OHE", 3), 3, Decimal("12.4"), Decimal("79.0"), "HIGH", "OPERATIONAL"),
                ("AST-TRD-102", "Section Insulator SI-GZB-01", "SECTION_INSULATOR", section_id_map["SEC-01"], category_map.get("OHE", 3), 3, Decimal("22.0"), Decimal("85.0"), "MEDIUM", "OPERATIONAL"),
                ("AST-TRD-201", "Traction Substation TSS-Khurja 25kV", "SUBSTATION_TSS", section_id_map["SEC-02"], category_map.get("TRF", 3), 3, Decimal("65.0"), Decimal("91.0"), "CRITICAL", "OPERATIONAL"),
                ("AST-TRD-202", "Contact Wire Regulated km 90-95", "OHE_CONTACT_WIRE", section_id_map["SEC-02"], category_map.get("OHE", 3), 3, Decimal("92.0"), Decimal("55.0"), "CRITICAL", "DEGRADED"),
                ("AST-TRD-301", "Auto Transformer Post km 120", "AT_POST", section_id_map["SEC-03"], category_map.get("TRF", 3), 3, Decimal("120.0"), Decimal("88.0"), "HIGH", "OPERATIONAL"),
                ("AST-TRD-401", "SEC-04 OHE Catenary & Contact Wire", "OHE_CONTACT_WIRE", section_id_map["SEC-04"], category_map.get("OHE", 3), 3, Decimal("142.2"), Decimal("62.0"), "CRITICAL", "DEGRADED"),
                ("AST-TRD-402", "SEC-04 Isolator Switch IS-402", "ISOLATOR_SWITCH", section_id_map["SEC-04"], category_map.get("OHE", 3), 3, Decimal("147.5"), Decimal("80.0"), "MEDIUM", "OPERATIONAL"),
            ]
            for a in assets_to_seed:
                cur.execute("""
                    INSERT INTO assets (
                        asset_code, asset_name, asset_type, section_id, category_id, department_id,
                        location_km, condition_score, criticality_level, operational_status,
                        installation_date, last_maintenance_date, next_maintenance_date, created_at, updated_at
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s,
                        NOW() - INTERVAL '3 years', NOW() - INTERVAL '45 days', NOW() + INTERVAL '10 days', NOW(), NOW()
                    ) ON CONFLICT (asset_code) DO NOTHING;
                """, a)
            print("Seeded assets.")

        # Map assets to dict
        cur.execute("SELECT asset_code, asset_id, section_id, department_id FROM assets;")
        asset_map = {row[0]: {"id": row[1], "section_id": row[2], "department_id": row[3]} for row in cur.fetchall()}

        # 7. Seed Defects
        cur.execute("SELECT count(*) FROM defects;")
        if cur.fetchone()[0] < 5:
            defects_to_seed = [
                ("DEF-TRK-001", "AST-TRK-102", "SURFACE_CRACK", "Internal transverse fatigue crack in rail head detected by USFD testing", "CRITICAL", True, "HIGH", "Emergency weld clamp and rail replacement required"),
                ("DEF-SIG-001", "AST-SIG-201", "BACKLASH_EXCESS", "Point machine stroke backlash exceeds RDSO permissible tolerance (4.2mm)", "HIGH", True, "MEDIUM", "Gear assembly overhaul and friction clutch adjustment"),
                ("DEF-TRD-001", "AST-TRD-202", "WIRE_WEAR_HIGH", "Contact wire cross-sectional wear reached 24% at dropper junction km 93/4", "CRITICAL", True, "HIGH", "Splice wire replacement and tension re-balancing"),
                ("DEF-TRK-002", "AST-TRK-401", "WELD_DEFECT_AT", "Alumino-thermic (AT) weld defective on turnout tongue rail SEC-04", "CRITICAL", True, "HIGH", "Immediate 1-hour engineering speed restriction removal block"),
                ("DEF-SIG-002", "AST-SIG-401", "MOTOR_CURRENT_SPIKE", "Peak operating current fluctuation on point machine motor SEC-04", "HIGH", False, "MEDIUM", "Point calibration and motor contact cleaning"),
                ("DEF-TRD-002", "AST-TRD-401", "STAGGER_DISPLACEMENT", "Contact wire stagger offset by +80mm due to cantilever bracket slip", "HIGH", True, "MEDIUM", "Cantilever re-alignment and isolator inspection"),
            ]
            for d_code, a_code, d_type, desc, sev, saf, op, rec in defects_to_seed:
                if a_code in asset_map:
                    a_info = asset_map[a_code]
                    cur.execute("""
                        INSERT INTO defects (
                            defect_code, asset_id, section_id, defect_type, description,
                            detected_date, severity_level, safety_impact, operational_impact,
                            recommended_action, status, reported_by, created_at, updated_at
                        ) VALUES (
                            %s, %s, %s, %s, %s,
                            CURRENT_DATE - 3, %s, %s, %s,
                            %s, 'OPEN', %s, NOW(), NOW()
                        ) ON CONFLICT (defect_code) DO NOTHING;
                    """, (d_code, a_info["id"], a_info["section_id"], d_type, desc, sev, saf, op, rec, admin_user_id))
            print("Seeded defects.")

        cur.execute("SELECT defect_code, defect_id FROM defects;")
        defect_map = dict(cur.fetchall())

        # 8. Seed Maintenance Tasks
        cur.execute("SELECT count(*) FROM maintenance_tasks;")
        if cur.fetchone()[0] < 5:
            tasks_to_seed = [
                # Seed Scenario SEC-04: The 3 Coordinated Compatible Tasks for SIH Demo!
                ("TSK-ENG-401", "AST-TRK-401", 1, section_id_map["SEC-04"], defect_map.get("DEF-TRK-002"), "Track Tongue Rail AT Weld Correction", "Replace defective AT weld and precision align tongue rail on SEC-04 Up Line", "CORRECTIVE", 45, 35, 55, Decimal("90.0"), Decimal("85.0"), Decimal("88.0"), Decimal("91.5"), Decimal("91.5"), "CRITICAL", "PENDING", 8, "USFD detector, weld cutter, hydraulic puller", "Full track possession, traffic block"),
                ("TSK-SNT-401", "AST-SIG-401", 2, section_id_map["SEC-04"], defect_map.get("DEF-SIG-002"), "S&T Point Machine Detection Calibration", "Simultaneous calibration of point detection contacts during track possession", "CORRECTIVE", 30, 20, 40, Decimal("75.0"), Decimal("70.0"), Decimal("72.0"), Decimal("78.0"), Decimal("78.0"), "HIGH", "PENDING", 4, "Digital multimeter, feeler gauges, test point lock", "Track possession coordination, S&T disconnection notice"),
                ("TSK-TRD-401", "AST-TRD-401", 3, section_id_map["SEC-04"], defect_map.get("DEF-TRD-002"), "OHE Cantilever Stagger & Isolator Tuning", "Power block coordination to adjust cantilever bracket stagger and inspect switch", "PREVENTIVE", 40, 30, 50, Decimal("80.0"), Decimal("78.0"), Decimal("76.0"), Decimal("82.0"), Decimal("82.0"), "HIGH", "PENDING", 6, "Tower wagon, earth discharge rods, torque wrench", "OHE Power isolation, permit to work"),

                # SEC-01 Tasks
                ("TSK-ENG-101", "AST-TRK-102", 1, section_id_map["SEC-01"], defect_map.get("DEF-TRK-001"), "Emergency Rail Head Cut & Fishplate Renewal", "Defect correction for transverse flaw detected by USFD car", "CORRECTIVE", 60, 45, 75, Decimal("95.0"), Decimal("95.0"), Decimal("90.0"), Decimal("94.0"), Decimal("94.0"), "CRITICAL", "PENDING", 10, "Abrasive rail cutter, drilling jig, fishplates", "Total track possession"),
                ("TSK-SIG-101", "AST-SIG-102", 2, section_id_map["SEC-01"], None, "Axle Counter Track Sensor Maintenance", "Quarterly calibration of DAC sensors and surge protection module", "ROUTINE", 25, 20, 35, Decimal("45.0"), Decimal("40.0"), Decimal("50.0"), Decimal("47.0"), Decimal("47.0"), "MEDIUM", "PENDING", 3, "Oscilloscope, frequency counter", "Caution order"),
                ("TSK-TRD-101", "AST-TRD-101", 3, section_id_map["SEC-01"], None, "OHE Periodic Mast Foot & Earthing Inspection", "Check mast earthing bond continuity and foundation settling", "ROUTINE", 30, 20, 40, Decimal("40.0"), Decimal("35.0"), Decimal("45.0"), Decimal("42.0"), Decimal("42.0"), "MEDIUM", "PENDING", 4, "Earth resistance tester", "Safety watchman"),

                # SEC-02 Incompatible tasks (to prove the optimizer separates heavy tamping and independent signalling)
                ("TSK-ENG-201", "AST-TRK-201", 1, section_id_map["SEC-02"], None, "Heavy Machine Tamping & Ballast Regulation", "CSM heavy tamping machine run over 3 km CWR track", "PREVENTIVE", 120, 90, 150, Decimal("70.0"), Decimal("65.0"), Decimal("80.0"), Decimal("74.0"), Decimal("74.0"), "HIGH", "PENDING", 12, "CSM Tamping Machine, Ballast Regulator", "Absolute traffic block"),
                ("TSK-SIG-201", "AST-SIG-201", 2, section_id_map["SEC-02"], defect_map.get("DEF-SIG-001"), "Point Machine Gearbox Overhaul & Replacement", "Replace worn gear train on PM 202A at Khurja junction", "CORRECTIVE", 50, 40, 60, Decimal("85.0"), Decimal("80.0"), Decimal("82.0"), Decimal("86.0"), Decimal("86.0"), "CRITICAL", "PENDING", 5, "Replacement motor assembly, mechanical hoist", "Disconnection notice"),
                ("TSK-TRD-201", "AST-TRD-202", 3, section_id_map["SEC-02"], defect_map.get("DEF-TRD-001"), "High Speed Contact Wire Splice Joint Replacement", "Splice replacement for severely worn contact wire at dropper km 93/4", "CORRECTIVE", 90, 75, 110, Decimal("88.0"), Decimal("85.0"), Decimal("85.0"), Decimal("89.0"), Decimal("89.0"), "CRITICAL", "PENDING", 8, "OHE 8-wheeler Tower Car, wire puller", "Power and traffic block"),
                
                # Additional Routine Tasks across sections
                ("TSK-ENG-301", "AST-TRK-301", 1, section_id_map["SEC-03"], None, "Deep Ballast Screening & Drainage Clearing", "Ballast cleaner BCM deployment on mud pumping stretch km 115", "PERIODIC", 180, 120, 240, Decimal("78.0"), Decimal("72.0"), Decimal("85.0"), Decimal("79.0"), Decimal("79.0"), "HIGH", "PENDING", 15, "BCM Ballast Screening Machine", "Major block window required"),
                ("TSK-SIG-301", "AST-SIG-301", 2, section_id_map["SEC-03"], None, "Electronic Interlocking Software Diagnostic & Standby Test", "Bi-monthly health check and failover dry-run of redundant VDU", "PREVENTIVE", 35, 25, 45, Decimal("60.0"), Decimal("50.0"), Decimal("70.0"), Decimal("62.0"), Decimal("62.0"), "MEDIUM", "PENDING", 3, "OEM Interlocking console, diagnostic dongle", "No traffic impact if standby intact"),
            ]
            for t in tasks_to_seed:
                cur.execute("""
                    INSERT INTO maintenance_tasks (
                        task_code, asset_id, department_id, section_id, defect_id,
                        task_title, description, maintenance_type,
                        requested_date, due_date,
                        estimated_duration_minutes, minimum_duration_minutes, maximum_duration_minutes,
                        criticality_score, urgency_score, asset_impact_score,
                        ai_priority_score, priority_score, priority_level, status,
                        required_workers, equipment_required, safety_requirements,
                        created_by, created_at, updated_at
                    ) VALUES (
                        %s, (SELECT asset_id FROM assets WHERE asset_code = %s), %s, %s, %s,
                        %s, %s, %s,
                        CURRENT_DATE - 2, CURRENT_DATE + 5,
                        %s, %s, %s,
                        %s, %s, %s,
                        %s, %s, %s, %s,
                        %s, %s, %s,
                        %s, NOW(), NOW()
                    ) ON CONFLICT (task_code) DO NOTHING;
                """, t + (admin_user_id,))
            print("Seeded maintenance tasks.")

        # 9. Seed Trains & Train Schedules (Realistic Indian Railways express & freight services)
        cur.execute("SELECT count(*) FROM trains;")
        train_count = cur.fetchone()[0]
        if train_count < 10:
            trains_to_seed = [
                ("22436", "Vande Bharat Express (NDLS-BSB)", 2, "HIGH", True, False, "DAILY"),
                ("12302", "Howrah Rajdhani Express", 2, "HIGH", True, False, "DAILY"),
                ("12004", "Lucknow Swarna Shatabdi", 2, "HIGH", True, False, "DAILY"),
                ("12418", "Prayagraj Express", 1, "NORMAL", True, False, "DAILY"),
                ("12398", "Mahabodhi Superfast Express", 1, "NORMAL", True, False, "DAILY"),
                ("12420", "Gomti Express", 1, "NORMAL", True, False, "DAILY"),
                ("64552", "Ghaziabad - Aligarh MEMU Passenger", 3, "LOW", True, False, "DAILY"),
                ("F-BOXN-101", "BOXN Coal Rake (Dadri - Tundla)", 4, "NORMAL", False, True, "DAILY"),
                ("F-BCN-429", "BCN Foodgrain Express Rake", 4, "NORMAL", False, True, "SPECIAL"),
                ("F-CONCOR-88", "CONCOR Double Stack Container", 4, "NORMAL", False, True, "DAILY"),
            ]
            for t_num, t_name, t_type, p_lvl, is_pass, is_frt, op_days in trains_to_seed:
                cur.execute("""
                    INSERT INTO trains (
                        train_number, train_name, train_type_id, priority_level,
                        is_passenger, is_freight, operating_days, created_at
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, NOW())
                    ON CONFLICT (train_number) DO NOTHING;
                """, (t_num, t_name, t_type, p_lvl, is_pass, is_frt, op_days))
            print("Seeded trains.")

        cur.execute("SELECT train_number, train_id FROM trains;")
        train_id_map = dict(cur.fetchall())

        # 10. Seed Train Schedules (Timetable paths matching the SIH demo scenario)
        cur.execute("SELECT count(*) FROM train_schedules;")
        if cur.fetchone()[0] < 10:
            schedules_to_seed = [
                # SEC-04 Schedules
                (train_id_map["12418"], section_id_map["SEC-04"], "01:00:00", "01:25:00", "DOWN", Decimal("110.0")),
                (train_id_map["12398"], section_id_map["SEC-04"], "01:30:00", "01:50:00", "DOWN", Decimal("105.0")),
                # Gap 02:00 to 03:00 is CLEAR!
                (train_id_map["12302"], section_id_map["SEC-04"], "03:05:00", "03:25:00", "UP", Decimal("120.0")),
                (train_id_map["F-BOXN-101"], section_id_map["SEC-04"], "03:30:00", "04:15:00", "DOWN", Decimal("75.0")),
                (train_id_map["22436"], section_id_map["SEC-04"], "06:00:00", "06:20:00", "DOWN", Decimal("130.0")),
                (train_id_map["12004"], section_id_map["SEC-04"], "06:30:00", "06:50:00", "DOWN", Decimal("120.0")),
                (train_id_map["64552"], section_id_map["SEC-04"], "08:15:00", "08:50:00", "DOWN", Decimal("60.0")),

                # SEC-01 Schedules
                (train_id_map["22436"], section_id_map["SEC-01"], "06:00:00", "06:25:00", "DOWN", Decimal("110.0")),
                (train_id_map["12004"], section_id_map["SEC-01"], "06:10:00", "06:35:00", "DOWN", Decimal("110.0")),
                (train_id_map["12302"], section_id_map["SEC-01"], "09:50:00", "10:15:00", "UP", Decimal("110.0")),
                (train_id_map["F-CONCOR-88"], section_id_map["SEC-01"], "02:15:00", "02:50:00", "DOWN", Decimal("70.0")),

                # SEC-02 Schedules
                (train_id_map["12418"], section_id_map["SEC-02"], "02:00:00", "03:00:00", "DOWN", Decimal("110.0")),
                (train_id_map["12398"], section_id_map["SEC-02"], "02:30:00", "03:30:00", "DOWN", Decimal("105.0")),
            ]
            for t_id, sec_id, arr, dep, dir_str, spd in schedules_to_seed:
                cur.execute("""
                    INSERT INTO train_schedules (
                        train_id, section_id, schedule_date,
                        arrival_time, departure_time, direction,
                        scheduled_speed_kmph, status, created_at
                    ) VALUES (
                        %s, %s, CURRENT_DATE,
                        %s, %s, %s,
                        %s, 'SCHEDULED', NOW()
                    );
                """, (t_id, sec_id, arr, dep, dir_str, spd))
            print("Seeded train schedules.")

        # 11. Seed Freight Forecasts
        cur.execute("SELECT count(*) FROM freight_forecasts;")
        if cur.fetchone()[0] < 5:
            forecasts_to_seed = [
                # SEC-04 Forecasts
                (section_id_map["SEC-04"], "00:00:00", "02:00:00", 1, "LOW", Decimal("0.85")),
                (section_id_map["SEC-04"], "02:00:00", "03:00:00", 0, "LOW", Decimal("0.92")), # Optimal maintenance slot!
                (section_id_map["SEC-04"], "03:00:00", "05:00:00", 3, "HIGH", Decimal("0.88")),
                (section_id_map["SEC-04"], "05:00:00", "08:00:00", 2, "MEDIUM", Decimal("0.78")),
                (section_id_map["SEC-04"], "08:00:00", "12:00:00", 4, "HIGH", Decimal("0.90")),
                (section_id_map["SEC-04"], "12:00:00", "16:00:00", 2, "MEDIUM", Decimal("0.80")),
                (section_id_map["SEC-04"], "16:00:00", "20:00:00", 3, "HIGH", Decimal("0.85")),
                (section_id_map["SEC-04"], "20:00:00", "23:59:59", 2, "MEDIUM", Decimal("0.82")),

                # SEC-01 Forecasts
                (section_id_map["SEC-01"], "01:00:00", "04:00:00", 2, "MEDIUM", Decimal("0.84")),
                (section_id_map["SEC-01"], "04:00:00", "08:00:00", 1, "LOW", Decimal("0.75")),
                (section_id_map["SEC-01"], "08:00:00", "12:00:00", 4, "HIGH", Decimal("0.89")),

                # SEC-02 Forecasts
                (section_id_map["SEC-02"], "01:00:00", "04:00:00", 4, "HIGH", Decimal("0.91")),
                (section_id_map["SEC-02"], "04:00:00", "08:00:00", 2, "MEDIUM", Decimal("0.80")),
            ]
            for sec_id, t_start, t_end, exp_trains, traf_lvl, conf in forecasts_to_seed:
                cur.execute("""
                    INSERT INTO freight_forecasts (
                        section_id, forecast_date, time_slot_start, time_slot_end,
                        expected_freight_trains, traffic_level, confidence_score,
                        model_name, model_version, created_at
                    ) VALUES (
                        %s, CURRENT_DATE, %s, %s,
                        %s, %s, %s,
                        'RailFreightPredictor-XGBoost', 'v1.4', NOW()
                    );
                """, (sec_id, t_start, t_end, exp_trains, traf_lvl, conf))
            print("Seeded freight forecasts.")

        # 12. Seed Candidate Block Windows
        cur.execute("SELECT count(*) FROM block_windows;")
        if cur.fetchone()[0] < 5:
            blocks_to_seed = [
                # SEC-04 Recommended Window (02:00 - 03:00)
                (section_id_map["SEC-04"], "02:00:00", "03:00:00", 60, "INTEGRATED", "AVAILABLE", 3, "Clean slot between passenger trains 01:30 and 03:05, low freight forecast", 10),
                # SEC-04 Alternative Window 1 (03:30 - 04:30)
                (section_id_map["SEC-04"], "03:30:00", "04:30:00", 60, "INTEGRATED", "AVAILABLE", 3, "Overlaps with freight rake BCN forecast (medium risk)", 10),
                # SEC-04 Alternative Window 2 (14:00 - 15:00)
                (section_id_map["SEC-04"], "14:00:00", "15:00:00", 60, "INTEGRATED", "AVAILABLE", 3, "Daytime passenger train path density is high (high risk)", 15),

                # SEC-01 Windows
                (section_id_map["SEC-01"], "03:00:00", "04:15:00", 75, "TRAFFIC", "AVAILABLE", 2, "Night engineering window", 10),
                (section_id_map["SEC-01"], "11:30:00", "13:00:00", 90, "POWER", "AVAILABLE", 1, "Off-peak noon OHE maintenance slot", 15),

                # SEC-02 Windows
                (section_id_map["SEC-02"], "04:30:00", "06:30:00", 120, "INTEGRATED", "AVAILABLE", 2, "Early morning corridor slot", 10),
            ]
            for sec_id, st_time, en_time, dur, b_type, av_stat, max_dept, restr, buff in blocks_to_seed:
                cur.execute("""
                    INSERT INTO block_windows (
                        section_id, block_date, start_time, end_time,
                        available_duration_minutes, block_type, availability_status,
                        max_allowed_departments, operational_restrictions, safety_buffer_minutes,
                        created_at, updated_at
                    ) VALUES (
                        %s, CURRENT_DATE, %s, %s,
                        %s, %s, %s,
                        %s, %s, %s,
                        NOW(), NOW()
                    );
                """, (sec_id, st_time, en_time, dur, b_type, av_stat, max_dept, restr, buff))
            print("Seeded block windows.")

        # 13. Seed Maintenance Compatibility Rules
        cur.execute("""
            INSERT INTO maintenance_compatibility_rules (
                department_a_id, department_b_id, compatible,
                compatibility_score, safety_constraints, resource_constraints, notes, created_at
            ) VALUES
                (1, 2, TRUE, 0.95, 'Track and S&T work can be coordinated under joint possession', 'Separate gang supervisors', 'Compatible for shadow block', NOW()),
                (1, 3, FALSE, 0.40, 'OHE power isolation required if heavy tamping machine deployed', 'OHE ladder gang must clear before track machine', 'Requires sequence clearance', NOW()),
                (2, 3, TRUE, 0.90, 'S&T and TRD visual and sensor inspections are fully compatible', 'Shared track access ladder', 'Compatible for joint window', NOW())
            ON CONFLICT DO NOTHING;
        """)

        # 14. Seed Notifications
        cur.execute("SELECT count(*) FROM notifications;")
        if cur.fetchone()[0] == 0:
            cur.execute("""
                INSERT INTO notifications (user_id, title, message, notification_type, priority, reference_type, is_read, created_at)
                VALUES 
                    (%s, 'New Critical Defect Detected', 'USFD ultrasonic car detected critical transverse flaw on SEC-01 km 18/2', 'ALERT', 'CRITICAL', 'DEFECT', FALSE, NOW() - INTERVAL '2 hours'),
                    (%s, 'Block Optimization Ready', 'AI Optimizer prepared coordinated block for SEC-04 (02:00-03:00)', 'INFO', 'HIGH', 'PLAN', FALSE, NOW() - INTERVAL '30 minutes'),
                    (%s, 'Joint Possession Requested', 'Engineering + SNT + TRD joint shadow block submitted for approval', 'ACTION_REQUIRED', 'HIGH', 'APPROVAL', FALSE, NOW() - INTERVAL '15 minutes');
            """, (admin_user_id, admin_user_id, admin_user_id))

        conn.commit()
        print("DATABASE INITIALIZATION AND SEEDING COMPLETED SUCCESSFULLY!")

    except Exception as e:
        conn.rollback()
        print(f"ERROR DURING DATABASE SEEDING: {e}")
        raise e
    finally:
        cur.close()
        conn.close()

if __name__ == "__main__":
    seed_database()
