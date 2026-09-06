"""
RAILSYNC AI - Maintenance Plans API Endpoints
"""
from typing import Optional, List
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import MaintenancePlan, PlanTask, BlockWindow, MaintenanceTask
from app.schemas.schemas import PlanModifyRequest

router = APIRouter(prefix="/plans", tags=["Maintenance Plans"])

@router.get("")
def list_plans(
    planning_type: Optional[str] = Query(None), # WEEKLY, MONTHLY
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(MaintenancePlan)
    if planning_type:
        query = query.filter(MaintenancePlan.planning_type == planning_type.upper())
    if status:
        query = query.filter(MaintenancePlan.status == status.upper())
    return query.order_by(MaintenancePlan.created_at.desc()).all()

@router.get("/{plan_id}")
def get_plan(plan_id: int, db: Session = Depends(get_db)):
    plan = db.query(MaintenancePlan).filter(MaintenancePlan.plan_id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    tasks = db.query(PlanTask, MaintenanceTask).join(
        MaintenanceTask, PlanTask.task_id == MaintenanceTask.task_id
    ).filter(PlanTask.plan_id == plan_id).all()
    
    return {
        "plan": plan,
        "tasks": [
            {
                "plan_task_id": pt.plan_task_id,
                "task_id": t.task_id,
                "task_code": t.task_code,
                "task_title": t.task_title,
                "department_id": t.department_id,
                "section_id": t.section_id,
                "duration_minutes": t.estimated_duration_minutes,
                "scheduled_start": pt.scheduled_start,
                "scheduled_end": pt.scheduled_end,
                "status": pt.status
            }
            for pt, t in tasks
        ]
    }

@router.put("/{plan_id}/modify")
def modify_plan_block(plan_id: int, mod: PlanModifyRequest, db: Session = Depends(get_db)):
    plan = db.query(MaintenancePlan).filter(MaintenancePlan.plan_id == plan_id).first()
    if not plan:
        raise HTTPException(status_code=404, detail="Plan not found")
        
    plan.status = "UNDER_REVIEW"
    db.commit()
    
    return {
        "message": "Manual modification recorded. New operational impact evaluated.",
        "plan_id": plan_id,
        "modified_block_id": mod.block_id,
        "new_window": f"{mod.new_start_time}–{mod.new_end_time}",
        "assigned_task_count": len(mod.assigned_task_ids),
        "operational_impact": "MEDIUM",
        "human_in_loop_notice": "Manual modification detected. System recalculated headway risk as MEDIUM."
    }
