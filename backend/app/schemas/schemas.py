"""
RAILSYNC AI - Pydantic Request & Response Validation Schemas
"""
from datetime import datetime, date, time
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, EmailStr

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: int
    username: str
    role: str
    full_name: str
    department_id: Optional[int]

class LoginRequest(BaseModel):
    username: str
    password: str

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    full_name: str
    phone: Optional[str] = None
    role: str = "MAINTENANCE_PLANNER"
    department_id: Optional[int] = 1

class UserResponse(BaseModel):
    user_id: int
    username: str
    email: str
    full_name: str
    phone: Optional[str]
    role: str
    department_id: Optional[int]
    is_active: bool
    class Config:
        from_attributes = True

# Task Schemas
class TaskCreate(BaseModel):
    task_code: str
    task_title: str
    description: Optional[str] = None
    asset_id: int
    department_id: int
    section_id: Optional[int] = None
    defect_id: Optional[int] = None
    maintenance_type: str = "CORRECTIVE"
    estimated_duration_minutes: int = 45
    criticality_score: float = 70.0
    urgency_score: float = 70.0
    required_workers: int = 4
    equipment_required: Optional[str] = None
    safety_requirements: Optional[str] = None

class TaskResponse(BaseModel):
    task_id: int
    task_code: str
    task_title: str
    description: Optional[str]
    asset_id: int
    department_id: int
    section_id: Optional[int]
    defect_id: Optional[int]
    maintenance_type: Optional[str]
    requested_date: Optional[date]
    due_date: Optional[date]
    estimated_duration_minutes: int
    criticality_score: Optional[float]
    urgency_score: Optional[float]
    ai_priority_score: Optional[float]
    priority_score: Optional[float]
    priority_level: Optional[str]
    status: Optional[str]
    required_workers: Optional[int]
    equipment_required: Optional[str]
    safety_requirements: Optional[str]
    class Config:
        from_attributes = True

# Asset Schemas
class AssetResponse(BaseModel):
    asset_id: int
    asset_code: str
    asset_name: str
    asset_type: str
    section_id: int
    department_id: int
    location_km: Optional[float]
    condition_score: Optional[float]
    criticality_level: str
    operational_status: str
    class Config:
        from_attributes = True

# Defect Schemas
class DefectCreate(BaseModel):
    defect_code: str
    asset_id: int
    section_id: Optional[int] = None
    defect_type: str
    description: str
    severity_level: str = "HIGH"
    safety_impact: bool = True
    operational_impact: str = "HIGH"
    recommended_action: Optional[str] = None

class DefectResponse(BaseModel):
    defect_id: int
    defect_code: str
    asset_id: int
    section_id: Optional[int]
    defect_type: str
    description: Optional[str]
    detected_date: Optional[datetime]
    severity_level: str
    safety_impact: bool
    operational_impact: str
    recommended_action: Optional[str]
    status: str
    class Config:
        from_attributes = True

# Section Schemas
class SectionResponse(BaseModel):
    section_id: int
    section_code: str
    section_name: str
    length_km: Optional[float]
    track_count: int
    electrified: bool
    maximum_speed_kmph: Optional[float]
    status: str
    class Config:
        from_attributes = True

# Block Window Schemas
class BlockWindowResponse(BaseModel):
    block_id: int
    section_id: int
    block_date: date
    start_time: time
    end_time: time
    available_duration_minutes: int
    block_type: str
    availability_status: str
    max_allowed_departments: int
    operational_restrictions: Optional[str]
    class Config:
        from_attributes = True

# Train & Schedule Schemas
class TrainResponse(BaseModel):
    train_id: int
    train_number: str
    train_name: Optional[str]
    priority_level: str
    is_passenger: bool
    is_freight: bool
    operating_days: Optional[str]
    class Config:
        from_attributes = True

class ScheduleResponse(BaseModel):
    schedule_id: int
    train_id: int
    section_id: int
    schedule_date: date
    arrival_time: Optional[time]
    departure_time: Optional[time]
    direction: Optional[str]
    scheduled_speed_kmph: Optional[float]
    status: Optional[str]
    class Config:
        from_attributes = True

# AI Priority Request
class AIPrioritizeRequest(BaseModel):
    task_id: Optional[int] = None
    asset_criticality: float = 80.0
    defect_severity: str = "HIGH"
    urgency_score: float = 75.0
    overdue_days: float = 5.0
    condition_score: float = 65.0
    safety_impact: bool = True
    operational_impact_score: float = 75.0
    loco_pilot_observations: float = 0.0
    maintenance_history_count: int = 2
    estimated_duration: int = 45

# Loco Pilot Feedback Schemas
class LocoPilotFeedbackCreate(BaseModel):
    pilot_name: str = "Loco Pilot (Northern Railway)"
    pilot_badge_id: Optional[str] = "LP-NR-4402"
    train_number: Optional[str] = "12004"
    section_id: Optional[int] = 1
    location_km: Optional[float] = 18.25
    issue_category: str = "VIBRATION" # TRACK_ABNORMALITY, VIBRATION, SIGNAL_PROBLEM, OHE_ISSUE, OBSTRUCTION, OTHER_SAFETY
    severity: str = "HIGH" # LOW, MEDIUM, HIGH, CRITICAL
    description: str
    evidence_image_url: Optional[str] = None

class LocoPilotFeedbackVerify(BaseModel):
    status: str = "VERIFIED" # VERIFIED, REJECTED
    verification_notes: Optional[str] = "Verified by Section Engineer. Creating urgent maintenance work order."
    create_maintenance_task: bool = True

class LocoPilotFeedbackResponse(BaseModel):
    feedback_id: int
    pilot_name: str
    pilot_badge_id: Optional[str]
    train_number: Optional[str]
    section_id: Optional[int]
    location_km: Optional[float]
    issue_category: str
    severity: str
    description: str
    evidence_image_url: Optional[str]
    status: str
    verified_by: Optional[int]
    verification_notes: Optional[str]
    created_task_id: Optional[int]
    ai_urgency_boost: Optional[float]
    created_at: datetime
    verified_at: Optional[datetime]
    class Config:
        from_attributes = True

# Optimization Request & Plan
class OptimizationRunRequest(BaseModel):
    section_id: Optional[int] = None
    department_id: Optional[int] = None
    horizon: str = "WEEKLY" # WEEKLY or MONTHLY
    weights: Optional[Dict[str, float]] = None

class PlanModifyRequest(BaseModel):
    block_id: int
    new_start_time: str
    new_end_time: str
    assigned_task_ids: List[int]
    comments: Optional[str] = None

class ApprovalAction(BaseModel):
    comments: Optional[str] = "Approved by authorized officer"

# Simulation Request
class SimulationRequest(BaseModel):
    plan_id: Optional[int] = None
    scenario_name: Optional[str] = "Standard Corridor Operations"
    scenario: Optional[str] = "OPTIMIZED"
    section_code: Optional[str] = "SEC-04"
    headway_buffer_min: Optional[int] = 15
    include_freight: bool = True

# What-If Request
class WhatIfRequest(BaseModel):
    scenario_type: str = "UNEXPECTED_FREIGHT"
    section_id: int = 4
    custom_parameters: Optional[Dict[str, Any]] = None

