"""
RAILSYNC AI - Maintenance Tasks API Endpoints
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import MaintenanceTask, Asset, Department, Defect
from app.schemas.schemas import TaskCreate, TaskResponse

router = APIRouter(prefix="/tasks", tags=["Maintenance Tasks"])

@router.get("", response_model=List[TaskResponse])
def list_tasks(
    department_id: Optional[int] = Query(None),
    section_id: Optional[int] = Query(None),
    priority_level: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(MaintenanceTask)
    if department_id:
        query = query.filter(MaintenanceTask.department_id == department_id)
    if section_id:
        query = query.filter(MaintenanceTask.section_id == section_id)
    if priority_level:
        query = query.filter(MaintenanceTask.priority_level == priority_level.upper())
    if status:
        query = query.filter(MaintenanceTask.status == status.upper())
    if search:
        query = query.filter(
            (MaintenanceTask.task_title.ilike(f"%{search}%")) |
            (MaintenanceTask.task_code.ilike(f"%{search}%"))
        )
    return query.order_by(MaintenanceTask.priority_score.desc()).all()

@router.get("/prioritized")
def list_prioritized_tasks(db: Session = Depends(get_db)):
    tasks = db.query(
        MaintenanceTask, Asset.asset_code, Asset.asset_name, Department.department_code
    ).join(Asset, MaintenanceTask.asset_id == Asset.asset_id)\
     .join(Department, MaintenanceTask.department_id == Department.department_id)\
     .order_by(MaintenanceTask.priority_score.desc()).all()
     
    results = []
    for t, a_code, a_name, d_code in tasks:
        results.append({
            "task_id": t.task_id,
            "task_code": t.task_code,
            "task_title": t.task_title,
            "department": d_code,
            "section_id": t.section_id,
            "asset_code": a_code,
            "asset_name": a_name,
            "criticality_score": float(t.criticality_score or 50),
            "urgency_score": float(t.urgency_score or 50),
            "ai_priority_score": float(t.ai_priority_score or t.priority_score or 50),
            "priority_level": t.priority_level,
            "status": t.status,
            "duration_minutes": t.estimated_duration_minutes,
            "due_date": str(t.due_date) if t.due_date else None,
            "required_workers": t.required_workers
        })
    return results

@router.post("", response_model=TaskResponse)
def create_task(task_in: TaskCreate, db: Session = Depends(get_db)):
    existing = db.query(MaintenanceTask).filter(MaintenanceTask.task_code == task_in.task_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="Task code already exists")
        
    new_task = MaintenanceTask(
        task_code=task_in.task_code,
        task_title=task_in.task_title,
        description=task_in.description,
        asset_id=task_in.asset_id,
        department_id=task_in.department_id,
        section_id=task_in.section_id,
        defect_id=task_in.defect_id,
        maintenance_type=task_in.maintenance_type,
        estimated_duration_minutes=task_in.estimated_duration_minutes,
        criticality_score=task_in.criticality_score,
        urgency_score=task_in.urgency_score,
        ai_priority_score=(task_in.criticality_score * 0.4 + task_in.urgency_score * 0.6),
        priority_score=(task_in.criticality_score * 0.4 + task_in.urgency_score * 0.6),
        priority_level="HIGH" if task_in.criticality_score > 70 else "MEDIUM",
        status="PENDING",
        required_workers=task_in.required_workers,
        equipment_required=task_in.equipment_required,
        safety_requirements=task_in.safety_requirements
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@router.get("/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db)):
    task = db.query(MaintenanceTask).filter(MaintenanceTask.task_id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
        
    asset = db.query(Asset).filter(Asset.asset_id == task.asset_id).first()
    defect = db.query(Defect).filter(Defect.defect_id == task.defect_id).first() if task.defect_id else None
    
    return {
        "task": task,
        "asset": asset,
        "defect": defect,
        "priority_formula": {
            "formula": "0.30×Criticality + 0.25×Urgency + 0.15×Overdue + 0.15×AssetRisk + 0.15×OperationalImpact",
            "criticality_weight": 0.30,
            "urgency_weight": 0.25,
            "overdue_weight": 0.15,
            "asset_risk_weight": 0.15,
            "operational_impact_weight": 0.15
        }
    }
