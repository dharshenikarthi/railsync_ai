"""
RAILSYNC AI - SQLAlchemy ORM Models matching PostgreSQL RAILSYNC_DB schema
"""
from datetime import datetime, date, time
from sqlalchemy import (
    Column, Integer, BigInteger, String, Text, Boolean,
    Numeric, Date, Time, DateTime, ForeignKey
)
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False)
    password_hash = Column(Text, nullable=False)
    full_name = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    role = Column(String(30), nullable=False) # ADMIN, MAINTENANCE_PLANNER, ENGINEERING_OFFICER, etc.
    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=True)
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Department(Base):
    __tablename__ = "departments"
    department_id = Column(Integer, primary_key=True, index=True)
    department_code = Column(String(10), unique=True, nullable=False)
    department_name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class RailwayZone(Base):
    __tablename__ = "railway_zones"
    zone_id = Column(Integer, primary_key=True, index=True)
    zone_code = Column(String(10), unique=True, nullable=False)
    zone_name = Column(String(100), nullable=False)
    headquarters = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Division(Base):
    __tablename__ = "divisions"
    division_id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, ForeignKey("railway_zones.zone_id"), nullable=False)
    division_code = Column(String(10), unique=True, nullable=False)
    division_name = Column(String(100), nullable=False)
    headquarters = Column(String(100), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Station(Base):
    __tablename__ = "stations"
    station_id = Column(Integer, primary_key=True, index=True)
    division_id = Column(Integer, ForeignKey("divisions.division_id"), nullable=True)
    station_code = Column(String(10), unique=True, nullable=False)
    station_name = Column(String(100), nullable=False)
    latitude = Column(Numeric(10, 6), nullable=True)
    longitude = Column(Numeric(10, 6), nullable=True)
    station_category = Column(String(5), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class RailwaySection(Base):
    __tablename__ = "railway_sections"
    section_id = Column(Integer, primary_key=True, index=True)
    division_id = Column(Integer, ForeignKey("divisions.division_id"), nullable=True)
    section_code = Column(String(20), unique=True, nullable=False)
    section_name = Column(String(100), nullable=False)
    start_station_id = Column(Integer, ForeignKey("stations.station_id"), nullable=True)
    end_station_id = Column(Integer, ForeignKey("stations.station_id"), nullable=True)
    length_km = Column(Numeric(8, 2), nullable=True)
    track_count = Column(Integer, default=2)
    electrified = Column(Boolean, default=True)
    maximum_speed_kmph = Column(Numeric(6, 2), default=130.0)
    status = Column(String(20), default="ACTIVE")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class AssetCategory(Base):
    __tablename__ = "asset_categories"
    category_id = Column(Integer, primary_key=True, index=True)
    category_code = Column(String(20), unique=True, nullable=False)
    category_name = Column(String(100), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Asset(Base):
    __tablename__ = "assets"
    asset_id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("railway_sections.section_id"), nullable=False)
    category_id = Column(Integer, ForeignKey("asset_categories.category_id"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=False)
    asset_code = Column(String(50), unique=True, nullable=False)
    asset_name = Column(String(150), nullable=False)
    asset_type = Column(String(50), nullable=False)
    location_km = Column(Numeric(8, 3), nullable=True)
    installation_date = Column(Date, nullable=True)
    last_maintenance_date = Column(Date, nullable=True)
    next_maintenance_date = Column(Date, nullable=True)
    condition_score = Column(Numeric(5, 2), default=100.0)
    criticality_level = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    operational_status = Column(String(30), default="OPERATIONAL") # OPERATIONAL, DEGRADED, FAILED, UNDER_MAINTENANCE
    manufacturer = Column(String(100), nullable=True)
    model_number = Column(String(50), nullable=True)
    expected_life_years = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class Defect(Base):
    __tablename__ = "defects"
    defect_id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.asset_id"), nullable=False)
    section_id = Column(Integer, ForeignKey("railway_sections.section_id"), nullable=True)
    defect_code = Column(String(50), unique=True, nullable=False)
    defect_type = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)
    detected_date = Column(DateTime, default=datetime.utcnow)
    severity_level = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    safety_impact = Column(Boolean, default=False)
    operational_impact = Column(String(50), default="LOW")
    recommended_action = Column(Text, nullable=True)
    status = Column(String(30), default="OPEN") # OPEN, UNDER_REVIEW, SCHEDULED, IN_PROGRESS, RESOLVED, CLOSED
    reported_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    resolved_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class MaintenanceTask(Base):
    __tablename__ = "maintenance_tasks"
    task_id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.asset_id"), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=False)
    section_id = Column(Integer, ForeignKey("railway_sections.section_id"), nullable=True)
    defect_id = Column(Integer, ForeignKey("defects.defect_id"), nullable=True)
    task_code = Column(String(50), unique=True, nullable=False)
    task_title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    maintenance_type = Column(String(30), default="PREVENTIVE")
    requested_date = Column(Date, default=date.today)
    due_date = Column(Date, nullable=True)
    estimated_duration_minutes = Column(Integer, nullable=False, default=60)
    minimum_duration_minutes = Column(Integer, nullable=True)
    maximum_duration_minutes = Column(Integer, nullable=True)
    criticality_score = Column(Numeric(5, 2), default=50.0)
    urgency_score = Column(Numeric(5, 2), default=50.0)
    asset_impact_score = Column(Numeric(5, 2), default=50.0)
    ai_priority_score = Column(Numeric(5, 2), default=50.0)
    priority_score = Column(Numeric(5, 2), default=50.0)
    priority_level = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(30), default="PENDING") # PENDING, PRIORITIZED, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED
    required_workers = Column(Integer, default=4)
    equipment_required = Column(Text, nullable=True)
    safety_requirements = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class TrainType(Base):
    __tablename__ = "train_types"
    train_type_id = Column(Integer, primary_key=True, index=True)
    type_code = Column(String(20), unique=True, nullable=False)
    type_name = Column(String(50), nullable=False)
    description = Column(Text, nullable=True)

class Train(Base):
    __tablename__ = "trains"
    train_id = Column(Integer, primary_key=True, index=True)
    train_number = Column(String(20), unique=True, nullable=False)
    train_name = Column(String(100), nullable=True)
    train_type_id = Column(Integer, ForeignKey("train_types.train_type_id"), nullable=True)
    priority_level = Column(String(20), default="NORMAL") # HIGH, NORMAL, LOW
    is_passenger = Column(Boolean, default=True)
    is_freight = Column(Boolean, default=False)
    operating_days = Column(String(50), default="DAILY")
    created_at = Column(DateTime, default=datetime.utcnow)

class TrainSchedule(Base):
    __tablename__ = "train_schedules"
    schedule_id = Column(BigInteger, primary_key=True, index=True)
    train_id = Column(Integer, ForeignKey("trains.train_id"), nullable=False)
    section_id = Column(Integer, ForeignKey("railway_sections.section_id"), nullable=False)
    schedule_date = Column(Date, default=date.today)
    arrival_time = Column(Time, nullable=True)
    departure_time = Column(Time, nullable=True)
    direction = Column(String(10), default="UP") # UP, DOWN
    scheduled_speed_kmph = Column(Numeric(6, 2), default=110.0)
    platform_number = Column(String(10), nullable=True)
    status = Column(String(20), default="SCHEDULED")
    created_at = Column(DateTime, default=datetime.utcnow)

class FreightForecast(Base):
    __tablename__ = "freight_forecasts"
    forecast_id = Column(BigInteger, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("railway_sections.section_id"), nullable=False)
    forecast_date = Column(Date, default=date.today)
    time_slot_start = Column(Time, nullable=False)
    time_slot_end = Column(Time, nullable=False)
    expected_freight_trains = Column(Integer, default=1)
    traffic_level = Column(String(20), default="LOW") # LOW, MEDIUM, HIGH, VERY_HIGH
    confidence_score = Column(Numeric(4, 2), default=0.85)
    model_name = Column(String(50), default="RailFreightPredictor-XGBoost")
    model_version = Column(String(20), default="v1.4")
    created_at = Column(DateTime, default=datetime.utcnow)

class BlockWindow(Base):
    __tablename__ = "block_windows"
    block_id = Column(Integer, primary_key=True, index=True)
    section_id = Column(Integer, ForeignKey("railway_sections.section_id"), nullable=False)
    block_date = Column(Date, default=date.today)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    available_duration_minutes = Column(Integer, nullable=False)
    block_type = Column(String(30), default="INTEGRATED") # TRAFFIC, POWER, INTEGRATED
    availability_status = Column(String(30), default="AVAILABLE") # AVAILABLE, RESERVED, USED, CANCELLED, UNAVAILABLE
    max_allowed_departments = Column(Integer, default=3)
    operational_restrictions = Column(Text, nullable=True)
    safety_buffer_minutes = Column(Integer, default=10)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class MaintenanceCompatibilityRule(Base):
    __tablename__ = "maintenance_compatibility_rules"
    rule_id = Column(Integer, primary_key=True, index=True)
    department_a_id = Column(Integer, ForeignKey("departments.department_id"), nullable=False)
    department_b_id = Column(Integer, ForeignKey("departments.department_id"), nullable=False)
    compatible = Column(Boolean, default=True)
    compatibility_score = Column(Numeric(4, 2), default=1.0)
    safety_constraints = Column(Text, nullable=True)
    resource_constraints = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class MaintenancePlan(Base):
    __tablename__ = "maintenance_plans"
    plan_id = Column(Integer, primary_key=True, index=True)
    plan_code = Column(String(50), unique=True, nullable=False)
    plan_name = Column(String(150), nullable=False)
    planning_type = Column(String(20), default="WEEKLY") # WEEKLY, MONTHLY, ADHOC
    period_start = Column(Date, nullable=False)
    period_end = Column(Date, nullable=False)
    status = Column(String(30), default="GENERATED") # DRAFT, GENERATED, UNDER_REVIEW, APPROVED, REJECTED, ACTIVE, COMPLETED
    generated_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    optimization_score = Column(Numeric(5, 2), default=90.0)
    total_tasks = Column(Integer, default=0)
    completed_tasks = Column(Integer, default=0)
    total_blocks = Column(Integer, default=0)
    total_block_minutes = Column(Integer, default=0)
    estimated_train_impact = Column(Numeric(5, 2), default=10.0)
    asset_availability_score = Column(Numeric(5, 2), default=95.0)
    block_utilization_score = Column(Numeric(5, 2), default=90.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class PlanTask(Base):
    __tablename__ = "plan_tasks"
    plan_task_id = Column(BigInteger, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("maintenance_plans.plan_id"), nullable=False)
    task_id = Column(Integer, ForeignKey("maintenance_tasks.task_id"), nullable=False)
    block_id = Column(Integer, ForeignKey("block_windows.block_id"), nullable=True)
    scheduled_start = Column(DateTime, nullable=True)
    scheduled_end = Column(DateTime, nullable=True)
    sequence_number = Column(Integer, default=1)
    status = Column(String(30), default="PLANNED")
    created_at = Column(DateTime, default=datetime.utcnow)

class BlockApproval(Base):
    __tablename__ = "block_approvals"
    approval_id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("maintenance_plans.plan_id"), nullable=False)
    block_id = Column(Integer, ForeignKey("block_windows.block_id"), nullable=False)
    requested_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    approval_status = Column(String(30), default="PENDING") # PENDING, APPROVED, REJECTED
    comments = Column(Text, nullable=True)
    requested_at = Column(DateTime, default=datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)

class OptimizationRun(Base):
    __tablename__ = "optimization_runs"
    optimization_id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("maintenance_plans.plan_id"), nullable=True)
    algorithm_name = Column(String(100), nullable=False)
    algorithm_version = Column(String(50), nullable=True)
    objective_function = Column(Text, nullable=True)
    input_task_count = Column(Integer, default=0)
    input_block_count = Column(Integer, default=0)
    constraints_count = Column(Integer, default=0)
    execution_time_ms = Column(Integer, default=0)
    optimization_score = Column(Numeric(5, 2), default=90.0)
    train_disruption_score = Column(Numeric(5, 2), nullable=True)
    block_utilization_score = Column(Numeric(5, 2), nullable=True)
    asset_availability_score = Column(Numeric(5, 2), nullable=True)
    cross_department_score = Column(Numeric(5, 2), nullable=True)
    status = Column(String(30), default="COMPLETED")
    error_message = Column(Text, nullable=True)
    started_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, default=datetime.utcnow)
    result_data = Column(Text, nullable=True)

class SimulationRun(Base):
    __tablename__ = "simulation_runs"
    simulation_id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("maintenance_plans.plan_id"), nullable=True)
    simulation_type = Column(String(50), default="DISCRETE_EVENT")
    scenario_name = Column(String(100), nullable=True)
    scenario_parameters = Column(Text, nullable=True)
    total_trains_simulated = Column(Integer, default=0)
    affected_trains = Column(Integer, default=0)
    total_delay_minutes = Column(Integer, default=0)
    average_delay_minutes = Column(Numeric(6, 2), default=0.0)
    maximum_delay_minutes = Column(Integer, default=0)
    operational_risk = Column(String(20), default="LOW")
    asset_availability_result = Column(Numeric(5, 2), default=95.0)
    result_summary = Column(Text, nullable=True)
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class WhatIfScenario(Base):
    __tablename__ = "what_if_scenarios"
    scenario_id = Column(Integer, primary_key=True, index=True)
    scenario_code = Column(String(50), unique=True, nullable=False)
    scenario_name = Column(String(100), nullable=False)
    base_plan_id = Column(Integer, ForeignKey("maintenance_plans.plan_id"), nullable=True)
    scenario_type = Column(String(50), default="UNEXPECTED_FREIGHT")
    description = Column(Text, nullable=True)
    input_parameters = Column(Text, nullable=True)
    original_plan_score = Column(Numeric(5, 2), nullable=True)
    new_plan_score = Column(Numeric(5, 2), nullable=True)
    improvement_percentage = Column(Numeric(5, 2), nullable=True)
    train_delay_difference = Column(Integer, nullable=True)
    block_utilization_difference = Column(Numeric(5, 2), nullable=True)
    recommended_action = Column(Text, nullable=True)
    status = Column(String(30), default="COMPLETED")
    created_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    notification_id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(30), default="INFO")
    priority = Column(String(20), default="NORMAL")
    reference_type = Column(String(50), nullable=True)
    reference_id = Column(Integer, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    audit_id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=True)
    entity_id = Column(Integer, nullable=True)
    old_data = Column(Text, nullable=True)
    new_data = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)
    user_agent = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class SystemSetting(Base):
    __tablename__ = "system_settings"
    setting_id = Column(Integer, primary_key=True, index=True)
    setting_key = Column(String(50), unique=True, nullable=False)
    setting_value = Column(Text, nullable=False)
    value_type = Column(String(20), default="STRING")
    description = Column(Text, nullable=True)
    updated_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow)

class LocoPilotFeedback(Base):
    __tablename__ = "loco_pilot_feedback"
    feedback_id = Column(Integer, primary_key=True, index=True)
    pilot_name = Column(String(100), default="Loco Pilot (Northern Railway)", nullable=False)
    pilot_badge_id = Column(String(50), default="LP-NR-4402", nullable=True)
    train_number = Column(String(50), default="12004", nullable=True) # e.g. Vande Bharat Express
    section_id = Column(Integer, ForeignKey("railway_sections.section_id"), nullable=True)
    location_km = Column(Numeric(8, 3), nullable=True)
    issue_category = Column(String(50), nullable=False) # TRACK_ABNORMALITY, VIBRATION, SIGNAL_PROBLEM, OHE_ISSUE, OBSTRUCTION, OTHER_SAFETY
    severity = Column(String(20), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    description = Column(Text, nullable=False)
    evidence_image_url = Column(Text, nullable=True)
    status = Column(String(30), default="PENDING_VERIFICATION") # PENDING_VERIFICATION, VERIFIED, REJECTED, ACTIONED
    verified_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    verification_notes = Column(Text, nullable=True)
    created_task_id = Column(Integer, ForeignKey("maintenance_tasks.task_id"), nullable=True)
    ai_urgency_boost = Column(Numeric(5, 2), default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    verified_at = Column(DateTime, nullable=True)

