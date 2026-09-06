"""
RAILSYNC AI - Human-in-the-Loop Approvals API Endpoints
"""
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import BlockApproval, MaintenancePlan, BlockWindow
from app.schemas.schemas import ApprovalAction

router = APIRouter(prefix="/approvals", tags=["Human-in-the-Loop Approvals"])

@router.get("")
def list_approvals(db: Session = Depends(get_db)):
    # Returns simulated active approval items for demonstration
    return [
        {
            "approval_id": 1,
            "plan_id": 101,
            "section_code": "SEC-04",
            "section_name": "Tundla Chord & Bypass Line",
            "block_window": "02:00–03:00 (Tomorrow)",
            "departments": ["Engineering", "S&T", "TRD (OHE)"],
            "tasks_count": 3,
            "duration_minutes": 60,
            "operational_impact": "LOW",
            "approval_status": "PENDING",
            "confidence_score": "94%",
            "requested_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
            "notes": "Coordinated multi-disciplinary shadow block recommended by AI optimizer."
        },
        {
            "approval_id": 2,
            "plan_id": 102,
            "section_code": "SEC-01",
            "section_name": "New Delhi - Ghaziabad",
            "block_window": "03:00–04:15",
            "departments": ["Engineering"],
            "tasks_count": 1,
            "duration_minutes": 75,
            "operational_impact": "MEDIUM",
            "approval_status": "PENDING",
            "confidence_score": "88%",
            "requested_at": datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
            "notes": "Emergency rail defect replacement."
        }
    ]

@router.post("/{approval_id}/approve")
def approve_block(approval_id: int, action: ApprovalAction, db: Session = Depends(get_db)):
    return {
        "status": "SUCCESS",
        "approval_id": approval_id,
        "new_status": "APPROVED",
        "reviewed_at": datetime.utcnow().isoformat(),
        "officer_comments": action.comments,
        "message": "Block officially authorized by Railway Control Officer. Forwarded to COA dispatch."
    }

@router.post("/{approval_id}/reject")
def reject_block(approval_id: int, action: ApprovalAction, db: Session = Depends(get_db)):
    return {
        "status": "SUCCESS",
        "approval_id": approval_id,
        "new_status": "REJECTED",
        "reviewed_at": datetime.utcnow().isoformat(),
        "officer_comments": action.comments,
        "message": "Block rejected. Optimizer notified to seek alternative maintenance window."
    }
