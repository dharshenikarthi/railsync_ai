"""
RAILSYNC AI - PostgreSQL 18 Database Setup & Migration Script
Creates 'RAILSYNC_AI_DB' on PostgreSQL 18 and seeds rich Indian Railways synthetic data
using SQLAlchemy ORM models for 100% schema alignment.
"""
import os
import sys
from datetime import datetime, date, time, timedelta
from decimal import Decimal
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import bcrypt

# Ensure root directory is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../backend")))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.models import (
    Base, User, Department, RailwayZone, Division, Station,
    RailwaySection, AssetCategory, Asset, Defect, MaintenanceTask,
    TrainType, Train, TrainSchedule, FreightForecast, BlockWindow,
    MaintenanceCompatibilityRule, MaintenancePlan, BlockApproval,
    Notification, SystemSetting
)

DB_USER = os.getenv("DB_USER", "postgres")
DB_PASS = os.getenv("DB_PASSWORD", "dharshenikarthi")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
TARGET_DB = "RAILSYNC_AI_DB"

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def create_database_if_not_exists():
    print(f"[*] Connecting to PostgreSQL 18 server at {DB_HOST}:{DB_PORT} as {DB_USER}...")
    conn = psycopg2.connect(
        dbname="postgres",
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cur = conn.cursor()
    
    cur.execute("SELECT 1 FROM pg_database WHERE datname = %s;", (TARGET_DB,))
    exists = cur.fetchone()
    if not exists:
        print(f"[*] Creating fresh database '{TARGET_DB}' in PostgreSQL 18...")
        cur.execute(f'CREATE DATABASE "{TARGET_DB}" WITH ENCODING "UTF8";')
        print(f"[+] Database '{TARGET_DB}' created successfully.")
    else:
        print(f"[*] Database '{TARGET_DB}' exists.")
        
    cur.close()
    conn.close()

def setup_and_seed_database(dbname=TARGET_DB):
    db_url = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{dbname}"
    engine = create_engine(db_url)
    
    print(f"[*] Creating ORM Schema tables in '{dbname}'...")
    Base.metadata.create_all(bind=engine)
    print(f"[+] Schema tables verified in '{dbname}'.")
    
    SessionLocal = sessionmaker(bind=engine)
    session = SessionLocal()

    try:
        # 1. Departments
        if session.query(Department).count() == 0:
            departments = [
                Department(department_id=1, department_code="ENG", department_name="Engineering (Civil / Track)", description="Track maintenance, USFD testing, ballast tamping"),
                Department(department_id=2, department_code="SNT", department_name="Signal & Telecommunication", description="Electronic interlocking, track circuits, point machines"),
                Department(department_id=3, department_code="TRD", department_name="Traction Distribution (TRD/OHE)", description="Overhead equipment, contact wire replacement, substations"),
                Department(department_id=4, department_code="OPT", department_name="Operating (Traffic / COA)", description="Train operations, train routing, headway management"),
                Department(department_id=5, department_code="ADM", department_name="Divisional Administration", description="Divisional Railway Manager and governance")
            ]
            session.add_all(departments)
            session.commit()
            print("[+] Seeded 5 departments.")

        # 2. Users
        if session.query(User).count() == 0:
            users = [
                User(username="admin", email="admin@railsync.ir.in", password_hash=hash_password("Admin@123"), full_name="System Administrator", phone="9876543210", role="ADMIN", department_id=5),
                User(username="planner", email="planner@railsync.ir.in", password_hash=hash_password("Planner@123"), full_name="Chief Planning Officer", phone="9876543211", role="MAINTENANCE_PLANNER", department_id=4),
                User(username="eng_officer", email="eng@railsync.ir.in", password_hash=hash_password("Eng@123"), full_name="Senior Divisional Engineer (Track)", phone="9876543212", role="ENGINEERING_OFFICER", department_id=1),
                User(username="snt_officer", email="snt@railsync.ir.in", password_hash=hash_password("Snt@123"), full_name="Senior Divisional Signal Engineer", phone="9876543213", role="SNT_OFFICER", department_id=2),
                User(username="trd_officer", email="trd@railsync.ir.in", password_hash=hash_password("Trd@123"), full_name="Senior Divisional Electrical Engineer", phone="9876543214", role="TRD_OFFICER", department_id=3),
                User(username="control_officer", email="control@railsync.ir.in", password_hash=hash_password("Control@123"), full_name="Chief Controller (COA)", phone="9876543215", role="CONTROL_OFFICER", department_id=4),
                User(username="manager", email="manager@railsync.ir.in", password_hash=hash_password("Manager@123"), full_name="Divisional Railway Manager", phone="9876543216", role="MANAGER", department_id=5),
            ]
            session.add_all(users)
            session.commit()
            print("[+] Seeded 7 users.")

        admin_user = session.query(User).filter_by(username="admin").first()

        # 3. Zone & Division
        if session.query(RailwayZone).count() == 0:
            zone = RailwayZone(zone_code="NR", zone_name="Northern Railway", headquarters="Baroda House, New Delhi")
            session.add(zone)
            session.commit()
            div = Division(zone_id=zone.zone_id, division_code="DLI", division_name="Delhi Division", headquarters="State Entry Road, New Delhi")
            session.add(div)
            session.commit()
            print("[+] Seeded Northern Railway Zone and Delhi Division.")

        div = session.query(Division).filter_by(division_code="DLI").first()

        # 4. Stations
        if session.query(Station).count() == 0:
            stations = [
                Station(division_id=div.division_id, station_code="NDLS", station_name="New Delhi", latitude=Decimal("28.6415"), longitude=Decimal("77.2209"), station_category="A1"),
                Station(division_id=div.division_id, station_code="GZB", station_name="Ghaziabad Junction", latitude=Decimal("28.6692"), longitude=Decimal("77.4538"), station_category="A"),
                Station(division_id=div.division_id, station_code="ALJN", station_name="Aligarh Junction", latitude=Decimal("27.8974"), longitude=Decimal("78.0880"), station_category="A"),
                Station(division_id=div.division_id, station_code="TDL", station_name="Tundla Junction", latitude=Decimal("27.2078"), longitude=Decimal("78.2415"), station_category="A"),
                Station(division_id=div.division_id, station_code="CNB", station_name="Kanpur Central", latitude=Decimal("26.4539"), longitude=Decimal("80.3508"), station_category="A1"),
            ]
            session.add_all(stations)
            session.commit()
            print("[+] Seeded 5 major stations.")

        stn_map = {s.station_code: s.station_id for s in session.query(Station).all()}

        # 5. Sections
        if session.query(RailwaySection).count() == 0:
            sections = [
                RailwaySection(division_id=div.division_id, section_code="SEC-01", section_name="New Delhi - Ghaziabad Main Line", start_station_id=stn_map["NDLS"], end_station_id=stn_map["GZB"], length_km=Decimal("25.6"), track_count=4, electrified=True, maximum_speed_kmph=Decimal("130.0"), status="ACTIVE"),
                RailwaySection(division_id=div.division_id, section_code="SEC-02", section_name="Ghaziabad - Aligarh Corridor", start_station_id=stn_map["GZB"], end_station_id=stn_map["ALJN"], length_km=Decimal("105.4"), track_count=4, electrified=True, maximum_speed_kmph=Decimal("130.0"), status="ACTIVE"),
                RailwaySection(division_id=div.division_id, section_code="SEC-03", section_name="Aligarh - Tundla Heavy Trunk", start_station_id=stn_map["ALJN"], end_station_id=stn_map["TDL"], length_km=Decimal("73.0"), track_count=4, electrified=True, maximum_speed_kmph=Decimal("130.0"), status="ACTIVE"),
                RailwaySection(division_id=div.division_id, section_code="SEC-04", section_name="Tundla Chord & Bypass Line", start_station_id=stn_map["TDL"], end_station_id=stn_map["CNB"], length_km=Decimal("26.0"), track_count=2, electrified=True, maximum_speed_kmph=Decimal("110.0"), status="ACTIVE")
            ]
            session.add_all(sections)
            session.commit()
            print("[+] Seeded 4 Northern Railway corridor sections.")

        sec_map = {s.section_code: s.section_id for s in session.query(RailwaySection).all()}

        # 6. Asset Categories
        if session.query(AssetCategory).count() == 0:
            categories = [
                AssetCategory(category_code="TRACK", category_name="Track & Turnouts", department_id=1, description="Rails, sleepers, fastenings, turnouts, switches"),
                AssetCategory(category_code="SIGNAL", category_name="Signalling Systems", department_id=2, description="Electronic Interlocking, signals, axle counters, point machines"),
                AssetCategory(category_code="OHE", category_name="Traction & OHE", department_id=3, description="Overhead contact wire, catenary, substations, insulators"),
            ]
            session.add_all(categories)
            session.commit()
            print("[+] Seeded asset categories.")

        cat_map = {c.category_code: c.category_id for c in session.query(AssetCategory).all()}

        # 7. Assets
        if session.query(Asset).count() == 0:
            assets = [
                Asset(section_id=sec_map["SEC-01"], category_id=cat_map["TRACK"], department_id=1, asset_code="AST-TRK-01", asset_name="UP Main Track Km 14-18", asset_type="TRACK", location_km=Decimal("16.4"), condition_score=Decimal("78.0"), criticality_level="HIGH", operational_status="OPERATIONAL"),
                Asset(section_id=sec_map["SEC-01"], category_id=cat_map["SIGNAL"], department_id=2, asset_code="AST-SNT-01", asset_name="Electronic Interlocking Cab-1 GZB", asset_type="INTERLOCKING", location_km=Decimal("25.2"), condition_score=Decimal("92.0"), criticality_level="CRITICAL", operational_status="OPERATIONAL"),
                Asset(section_id=sec_map["SEC-01"], category_id=cat_map["OHE"], department_id=3, asset_code="AST-TRD-01", asset_name="OHE Substation Sahibabad 25kV", asset_type="SUBSTATION", location_km=Decimal("18.5"), condition_score=Decimal("88.0"), criticality_level="HIGH", operational_status="OPERATIONAL"),
                Asset(section_id=sec_map["SEC-02"], category_id=cat_map["TRACK"], department_id=1, asset_code="AST-TRK-02", asset_name="Turnout Point 101-A Aligarh Jn", asset_type="TURNOUT", location_km=Decimal("130.9"), condition_score=Decimal("45.0"), criticality_level="CRITICAL", operational_status="DEGRADED"),
                Asset(section_id=sec_map["SEC-04"], category_id=cat_map["TRACK"], department_id=1, asset_code="AST-TRK-04", asset_name="Diamond Crossing 42B Tundla Chord", asset_type="CROSSING", location_km=Decimal("205.3"), condition_score=Decimal("52.0"), criticality_level="CRITICAL", operational_status="DEGRADED"),
                Asset(section_id=sec_map["SEC-04"], category_id=cat_map["SIGNAL"], department_id=2, asset_code="AST-SNT-03", asset_name="Point Machine 210-B Tundla Chord", asset_type="POINT_MACHINE", location_km=Decimal("205.2"), condition_score=Decimal("68.0"), criticality_level="HIGH", operational_status="OPERATIONAL"),
                Asset(section_id=sec_map["SEC-04"], category_id=cat_map["OHE"], department_id=3, asset_code="AST-TRD-02", asset_name="OHE Contact Wire Span Km 204-208", asset_type="OHE", location_km=Decimal("205.8"), condition_score=Decimal("62.0"), criticality_level="HIGH", operational_status="OPERATIONAL")
            ]
            session.add_all(assets)
            session.commit()
            print("[+] Seeded assets.")

        ast_map = {a.asset_code: a.asset_id for a in session.query(Asset).all()}

        # 8. Defects
        if session.query(Defect).count() == 0:
            defects = [
                Defect(asset_id=ast_map["AST-TRK-01"], section_id=sec_map["SEC-01"], defect_code="DEF-USFD-082", defect_type="USFD Internal Flaw", description="Internal transverse fissure detected in rail head by ultrasonic car. Imposed PSR 30 km/h.", severity_level="CRITICAL", safety_impact=True, operational_impact="HIGH", status="OPEN", reported_by=admin_user.user_id),
                Defect(asset_id=ast_map["AST-TRK-02"], section_id=sec_map["SEC-02"], defect_code="DEF-PNT-019", defect_type="Switch Rail Wear", description="Tongue rail clearance wear exceeded RDSO 4mm safety limit. Speed restricted to 15 km/h.", severity_level="HIGH", safety_impact=True, operational_impact="MEDIUM", status="OPEN", reported_by=admin_user.user_id),
                Defect(asset_id=ast_map["AST-TRK-04"], section_id=sec_map["SEC-04"], defect_code="DEF-TRK-055", defect_type="Diamond Crossing Nose Wear", description="Crossing nose batter reached 3.8mm, heavy vibration to bogies recorded by OMS car.", severity_level="HIGH", safety_impact=True, operational_impact="HIGH", status="OPEN", reported_by=admin_user.user_id),
                Defect(asset_id=ast_map["AST-SNT-03"], section_id=sec_map["SEC-04"], defect_code="DEF-SNT-031", defect_type="Point Machine Throw Error", description="Operating time high (6.2s vs 4.5s max permissible limit). Signal failure threat.", severity_level="CRITICAL", safety_impact=True, operational_impact="HIGH", status="OPEN", reported_by=admin_user.user_id),
                Defect(asset_id=ast_map["AST-TRD-02"], section_id=sec_map["SEC-04"], defect_code="DEF-OHE-044", defect_type="Contact Wire Dropper Sag", description="Dropper slackness causing arc pantograph sparking at night.", severity_level="HIGH", safety_impact=False, operational_impact="LOW", status="OPEN", reported_by=admin_user.user_id),
            ]
            session.add_all(defects)
            session.commit()
            print("[+] Seeded track defects.")

        def_map = {d.defect_code: d.defect_id for d in session.query(Defect).all()}

        # 9. Maintenance Tasks
        if session.query(MaintenanceTask).count() == 0:
            tasks = [
                # SEC-04 Demo Tasks (Shadow Block Group)
                MaintenanceTask(asset_id=ast_map["AST-TRK-04"], department_id=1, section_id=sec_map["SEC-04"], defect_id=def_map["DEF-TRK-055"], task_code="TSK-2026-001", task_title="Emergency Tamping & Diamond Nose Weld (SEC-04)", description="Deep hydraulic tamping and in-situ aluminothermic welding of nose cross", maintenance_type="CORRECTIVE", estimated_duration_minutes=45, criticality_score=Decimal("88.5"), urgency_score=Decimal("90.0"), ai_priority_score=Decimal("88.5"), priority_score=Decimal("88.5"), priority_level="CRITICAL", status="PENDING", created_by=admin_user.user_id),
                MaintenanceTask(asset_id=ast_map["AST-SNT-03"], department_id=2, section_id=sec_map["SEC-04"], defect_id=def_map["DEF-SNT-031"], task_code="TSK-2026-002", task_title="Point Machine 210-B Overhaul & Lubrication (SEC-04)", description="Internal motor replacement and microswitch stroke recalibration", maintenance_type="PREVENTIVE", estimated_duration_minutes=30, criticality_score=Decimal("82.0"), urgency_score=Decimal("85.0"), ai_priority_score=Decimal("82.0"), priority_score=Decimal("82.0"), priority_level="HIGH", status="PENDING", created_by=admin_user.user_id),
                MaintenanceTask(asset_id=ast_map["AST-TRD-02"], department_id=3, section_id=sec_map["SEC-04"], defect_id=def_map["DEF-OHE-044"], task_code="TSK-2026-003", task_title="OHE Dropper Adjustment & Tension Test (SEC-04)", description="Ladder gang inspection and tension recalibration under power block", maintenance_type="CORRECTIVE", estimated_duration_minutes=40, criticality_score=Decimal("74.5"), urgency_score=Decimal("75.0"), ai_priority_score=Decimal("74.5"), priority_score=Decimal("74.5"), priority_level="HIGH", status="PENDING", created_by=admin_user.user_id),
                
                # SEC-01 Tasks
                MaintenanceTask(asset_id=ast_map["AST-TRK-01"], department_id=1, section_id=sec_map["SEC-01"], defect_id=def_map["DEF-USFD-082"], task_code="TSK-2026-004", task_title="USFD Rail Defect Cut & Clamp SEC-01 Km 16.4", description="Emergency rail excision and clamped joint insertion", maintenance_type="CORRECTIVE", estimated_duration_minutes=60, criticality_score=Decimal("94.0"), urgency_score=Decimal("95.0"), ai_priority_score=Decimal("94.0"), priority_score=Decimal("94.0"), priority_level="CRITICAL", status="PENDING", created_by=admin_user.user_id),
                MaintenanceTask(asset_id=ast_map["AST-SNT-01"], department_id=2, section_id=sec_map["SEC-01"], defect_id=None, task_code="TSK-2026-005", task_title="Track Circuit Audio Frequency Calibration GZB", description="Routine audio frequency tuning of electronic sender/receiver pairs", maintenance_type="PREVENTIVE", estimated_duration_minutes=35, criticality_score=Decimal("58.0"), urgency_score=Decimal("55.0"), ai_priority_score=Decimal("58.0"), priority_score=Decimal("58.0"), priority_level="MEDIUM", status="PENDING", created_by=admin_user.user_id),
                MaintenanceTask(asset_id=ast_map["AST-TRD-01"], department_id=3, section_id=sec_map["SEC-01"], defect_id=None, task_code="TSK-2026-006", task_title="OHE Insulator Washing Sahibabad Substation", description="High-pressure de-mineralized water jet washing of post insulators", maintenance_type="ROUTINE", estimated_duration_minutes=45, criticality_score=Decimal("42.0"), urgency_score=Decimal("40.0"), ai_priority_score=Decimal("42.0"), priority_score=Decimal("42.0"), priority_level="LOW", status="PENDING", created_by=admin_user.user_id),

                # SEC-02 Tasks
                MaintenanceTask(asset_id=ast_map["AST-TRK-02"], department_id=1, section_id=sec_map["SEC-02"], defect_id=def_map["DEF-PNT-019"], task_code="TSK-2026-007", task_title="Turnout Switch Tongue Replacement ALJN Jn", description="Mechanical replacement of worn 1:12 thick web curved switch", maintenance_type="CORRECTIVE", estimated_duration_minutes=90, criticality_score=Decimal("86.0"), urgency_score=Decimal("85.0"), ai_priority_score=Decimal("86.0"), priority_score=Decimal("86.0"), priority_level="HIGH", status="PENDING", created_by=admin_user.user_id),
            ]
            session.add_all(tasks)
            session.commit()
            print("[+] Seeded maintenance tasks.")

        # 10. Train Types & Trains
        if session.query(TrainType).count() == 0:
            ttypes = [
                TrainType(train_type_id=1, type_code="VANDE_BHARAT", type_name="Vande Bharat Express", description="Semi-high speed premium EMU"),
                TrainType(train_type_id=2, type_code="RAJDHANI", type_name="Rajdhani Express", description="Superfast premier express"),
                TrainType(train_type_id=3, type_code="SUPERFAST", type_name="Superfast Express", description="Key intercity corridor passenger service"),
                TrainType(train_type_id=4, type_code="FREIGHT", type_name="Freight / Rake", description="Container, Coal, and Foodgrain goods trains")
            ]
            session.add_all(ttypes)
            session.commit()
            print("[+] Seeded train types.")

        if session.query(Train).count() == 0:
            trains = [
                Train(train_number="22436", train_name="Vande Bharat Express (NDLS-BSB)", train_type_id=1, priority_level="HIGH", is_passenger=True, is_freight=False),
                Train(train_number="12302", train_name="Howrah Rajdhani Express", train_type_id=2, priority_level="HIGH", is_passenger=True, is_freight=False),
                Train(train_number="12424", train_name="Dibrugarh Rajdhani Express", train_type_id=2, priority_level="HIGH", is_passenger=True, is_freight=False),
                Train(train_number="12418", train_name="Prayagraj Express", train_type_id=3, priority_level="NORMAL", is_passenger=True, is_freight=False),
                Train(train_number="12452", train_name="Shram Shakti Express", train_type_id=3, priority_level="NORMAL", is_passenger=True, is_freight=False),
                Train(train_number="FRT-CONT-101", train_name="Container Rake BTPN-101", train_type_id=4, priority_level="LOW", is_passenger=False, is_freight=True),
                Train(train_number="FRT-COAL-204", train_name="Heavy Coal Rake BOXNHL-204", train_type_id=4, priority_level="LOW", is_passenger=False, is_freight=True),
                Train(train_number="FRT-FOOD-429", train_name="Foodgrain Rake BCN-429", train_type_id=4, priority_level="LOW", is_passenger=False, is_freight=True),
            ]
            session.add_all(trains)
            session.commit()
            print("[+] Seeded trains.")

        trn_map = {t.train_number: t.train_id for t in session.query(Train).all()}

        # 11. Train Schedules
        if session.query(TrainSchedule).count() == 0:
            today = date.today()
            schedules = [
                TrainSchedule(train_id=trn_map["22436"], section_id=sec_map["SEC-01"], schedule_date=today, arrival_time=time(6, 0), departure_time=time(6, 22), direction="DOWN", scheduled_speed_kmph=Decimal("130.0"), status="SCHEDULED"),
                TrainSchedule(train_id=trn_map["22436"], section_id=sec_map["SEC-02"], schedule_date=today, arrival_time=time(6, 24), departure_time=time(7, 35), direction="DOWN", scheduled_speed_kmph=Decimal("130.0"), status="SCHEDULED"),
                TrainSchedule(train_id=trn_map["12302"], section_id=sec_map["SEC-01"], schedule_date=today, arrival_time=time(16, 50), departure_time=time(17, 15), direction="DOWN", scheduled_speed_kmph=Decimal("130.0"), status="SCHEDULED"),
                TrainSchedule(train_id=trn_map["12418"], section_id=sec_map["SEC-04"], schedule_date=today, arrival_time=time(0, 45), departure_time=time(1, 15), direction="UP", scheduled_speed_kmph=Decimal("110.0"), status="SCHEDULED"),
                TrainSchedule(train_id=trn_map["FRT-CONT-101"], section_id=sec_map["SEC-04"], schedule_date=today, arrival_time=time(1, 20), departure_time=time(1, 50), direction="DOWN", scheduled_speed_kmph=Decimal("75.0"), status="SCHEDULED"),
                TrainSchedule(train_id=trn_map["12452"], section_id=sec_map["SEC-04"], schedule_date=today, arrival_time=time(3, 15), departure_time=time(3, 45), direction="DOWN", scheduled_speed_kmph=Decimal("110.0"), status="SCHEDULED"),
            ]
            session.add_all(schedules)
            session.commit()
            print("[+] Seeded train schedules.")

        # 12. Freight Forecasts
        if session.query(FreightForecast).count() == 0:
            today = date.today()
            forecasts = [
                FreightForecast(section_id=sec_map["SEC-04"], forecast_date=today, time_slot_start=time(0, 0), time_slot_end=time(2, 0), expected_freight_trains=2, traffic_level="MODERATE", confidence_score=Decimal("0.85")),
                FreightForecast(section_id=sec_map["SEC-04"], forecast_date=today, time_slot_start=time(2, 0), time_slot_end=time(3, 30), expected_freight_trains=0, traffic_level="LOW", confidence_score=Decimal("0.95")),
                FreightForecast(section_id=sec_map["SEC-04"], forecast_date=today, time_slot_start=time(3, 30), time_slot_end=time(6, 0), expected_freight_trains=3, traffic_level="HIGH", confidence_score=Decimal("0.78")),
                FreightForecast(section_id=sec_map["SEC-01"], forecast_date=today, time_slot_start=time(1, 0), time_slot_end=time(3, 30), expected_freight_trains=1, traffic_level="LOW", confidence_score=Decimal("0.92")),
            ]
            session.add_all(forecasts)
            session.commit()
            print("[+] Seeded freight forecasts.")

        # 13. Block Windows
        if session.query(BlockWindow).count() == 0:
            today = date.today()
            blocks = [
                # SEC-04 Windows (Optimal demo window 02:00-03:00)
                BlockWindow(section_id=sec_map["SEC-04"], block_date=today, start_time=time(2, 0), end_time=time(3, 0), available_duration_minutes=60, block_type="INTEGRATED", availability_status="AVAILABLE", max_allowed_departments=3, operational_restrictions="Night freight lull; ideal for shadow possession", safety_buffer_minutes=15),
                BlockWindow(section_id=sec_map["SEC-04"], block_date=today, start_time=time(3, 30), end_time=time(4, 30), available_duration_minutes=60, block_type="INTEGRATED", availability_status="AVAILABLE", max_allowed_departments=3, operational_restrictions="Alternative slot; high freight rake risk", safety_buffer_minutes=15),
                BlockWindow(section_id=sec_map["SEC-04"], block_date=today, start_time=time(11, 0), end_time=time(12, 15), available_duration_minutes=75, block_type="TRAFFIC", availability_status="AVAILABLE", max_allowed_departments=2, operational_restrictions="Midday passenger interval", safety_buffer_minutes=10),

                # SEC-01 Windows
                BlockWindow(section_id=sec_map["SEC-01"], block_date=today, start_time=time(1, 30), end_time=time(3, 0), available_duration_minutes=90, block_type="INTEGRATED", availability_status="AVAILABLE", max_allowed_departments=3, operational_restrictions="Night mega corridor slot NDLS-GZB", safety_buffer_minutes=20),
                BlockWindow(section_id=sec_map["SEC-01"], block_date=today, start_time=time(13, 0), end_time=time(14, 30), available_duration_minutes=90, block_type="POWER", availability_status="AVAILABLE", max_allowed_departments=1, operational_restrictions="Off-peak OHE maintenance window", safety_buffer_minutes=15),

                # SEC-02 Windows
                BlockWindow(section_id=sec_map["SEC-02"], block_date=today, start_time=time(2, 30), end_time=time(4, 0), available_duration_minutes=90, block_type="INTEGRATED", availability_status="AVAILABLE", max_allowed_departments=3, operational_restrictions="Deep night trunk line slot", safety_buffer_minutes=15)
            ]
            session.add_all(blocks)
            session.commit()
            print("[+] Seeded candidate block windows.")

        # 14. Compatibility Rules
        if session.query(MaintenanceCompatibilityRule).count() == 0:
            rules = [
                MaintenanceCompatibilityRule(department_a_id=1, department_b_id=2, compatible=True, compatibility_score=Decimal("0.95"), safety_constraints="Track and S&T work can be coordinated under joint possession", resource_constraints="Separate gang supervisors required", notes="Compatible for shadow block"),
                MaintenanceCompatibilityRule(department_a_id=1, department_b_id=3, compatible=False, compatibility_score=Decimal("0.40"), safety_constraints="OHE power isolation required if heavy tamping machine deployed", resource_constraints="OHE ladder gang must clear before track machine", notes="Requires sequence clearance"),
                MaintenanceCompatibilityRule(department_a_id=2, department_b_id=3, compatible=True, compatibility_score=Decimal("0.90"), safety_constraints="S&T and TRD visual and sensor inspections are fully compatible", resource_constraints="Shared track access ladder", notes="Compatible for joint window")
            ]
            session.add_all(rules)
            session.commit()
            print("[+] Seeded cross-department compatibility rules.")

        # 15. Initial Maintenance Plan & Approval
        if session.query(MaintenancePlan).count() == 0:
            plan = MaintenancePlan(
                plan_code="PLAN-OPT-DEMO-01",
                plan_name="AI Integrated Shadow Block Plan (SEC-04)",
                planning_type="WEEKLY",
                period_start=date.today(),
                period_end=date.today() + timedelta(days=7),
                status="GENERATED",
                optimization_score=Decimal("94.8"),
                total_tasks=3,
                total_blocks=1,
                total_block_minutes=60,
                estimated_train_impact=Decimal("0.0"),
                asset_availability_score=Decimal("96.5"),
                block_utilization_score=Decimal("92.0"),
                generated_by=admin_user.user_id
            )
            session.add(plan)
            session.commit()

            first_block = session.query(BlockWindow).first()
            approval = BlockApproval(
                plan_id=plan.plan_id,
                block_id=first_block.block_id,
                requested_by=admin_user.user_id,
                approval_status="PENDING",
                comments="Joint Possession: Engineering + S&T + TRD on SEC-04 (02:00-03:00)"
            )
            session.add(approval)
            session.commit()
            print("[+] Seeded demo maintenance plan and approval record.")

        # 16. Notifications
        if session.query(Notification).count() == 0:
            notifications = [
                Notification(user_id=admin_user.user_id, title="High-Efficiency Shadow Block Ready", message="AI Optimizer grouped Engineering, S&T, and TRD into SEC-04 02:00-03:00 window, saving 47.8% downtime.", notification_type="INFO", priority="HIGH", reference_type="PLAN", is_read=False),
                Notification(user_id=admin_user.user_id, title="Critical Track Defect Detected", message="USFD ultrasonic car detected internal transverse flaw on SEC-01 km 16.4. Speed restriction 30 km/h active.", notification_type="ALERT", priority="CRITICAL", reference_type="DEFECT", is_read=False),
                Notification(user_id=admin_user.user_id, title="Joint Possession Clearance Pending", message="Divisional clearance requested for multi-department block execution on Tundla Chord.", notification_type="ACTION_REQUIRED", priority="HIGH", reference_type="APPROVAL", is_read=False)
            ]
            session.add_all(notifications)
            session.commit()
            print("[+] Seeded system alerts & notifications.")

        # 17. System Settings
        if session.query(SystemSetting).count() == 0:
            settings_rows = [
                SystemSetting(setting_key="DEFAULT_CORRIDOR", setting_value="NDLS-TDL", value_type="STRING", description="Primary active Northern Railway corridor"),
                SystemSetting(setting_key="ORTOOLS_SOLVER_TIME_LIMIT", setting_value="10", value_type="INTEGER", description="Max solver search time in seconds"),
                SystemSetting(setting_key="HEADWAY_BUFFER_MINUTES", setting_value="15", value_type="INTEGER", description="Minimum headway buffer between train slots and blocks"),
                SystemSetting(setting_key="ML_MODEL_VERSION", setting_value="v2.4-XAI", value_type="STRING", description="Active Random Forest priority predictor version")
            ]
            session.add_all(settings_rows)
            session.commit()
            print("[+] Seeded system settings.")

        print(f"\n[***] ALL SEEDING IN '{dbname}' COMPLETED SUCCESSFULLY! [***]")

    except Exception as e:
        session.rollback()
        print(f"[!] Error seeding '{dbname}': {e}")
        raise e
    finally:
        session.close()
        engine.dispose()

def verify_all_tables(dbname=TARGET_DB):
    print(f"\n=======================================================")
    print(f"  VERIFYING POSTGRESQL 18 DATABASE: {dbname}")
    print(f"=======================================================")
    conn = psycopg2.connect(
        dbname=dbname,
        user=DB_USER,
        password=DB_PASS,
        host=DB_HOST,
        port=DB_PORT
    )
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name;")
    tables = [r[0] for r in cur.fetchall()]
    total_rows = 0
    for t in tables:
        cur.execute(f"SELECT count(*) FROM {t};")
        cnt = cur.fetchone()[0]
        total_rows += cnt
        print(f"  [OK] {t.ljust(35)} : {str(cnt).rjust(4)} rows")
    print(f"-------------------------------------------------------")
    print(f"  TOTAL TABLES: {len(tables)} | TOTAL RECORDS: {total_rows}")
    print(f"=======================================================\n")
    cur.close()
    conn.close()

if __name__ == "__main__":
    create_database_if_not_exists()
    setup_and_seed_database(TARGET_DB)
    verify_all_tables(TARGET_DB)
