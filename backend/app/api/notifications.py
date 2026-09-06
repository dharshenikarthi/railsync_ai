"""
RAILSYNC AI - Notifications and Departments API Endpoints
"""
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Notification, Department

router = APIRouter(tags=["Notifications & Departments"])

@router.get("/notifications")
def list_notifications(db: Session = Depends(get_db)):
    notes = db.query(Notification).order_by(Notification.created_at.desc()).limit(15).all()
    return [
        {
            "notification_id": n.notification_id,
            "title": n.title,
            "message": n.message,
            "type": n.notification_type,
            "priority": n.priority,
            "is_read": n.is_read,
            "created_at": n.created_at.strftime("%Y-%m-%d %H:%M")
        }
        for n in notes
    ]

@router.put("/notifications/{notification_id}/read")
def mark_notification_read(notification_id: int, db: Session = Depends(get_db)):
    n = db.query(Notification).filter(Notification.notification_id == notification_id).first()
    if n:
        n.is_read = True
        db.commit()
    return {"status": "SUCCESS"}

@router.get("/departments")
def list_departments(db: Session = Depends(get_db)):
    return db.query(Department).all()

@router.get("/reports/summary")
def get_reports_summary():
    return {
        "report_period": "Current Month",
        "total_maintenance_hours_saved": 84.5,
        "coordination_ratio": "3.2 tasks per block window",
        "train_punctuality_impact": "0.02% variance from nominal timetable",
        "department_breakdown": [
            {"department": "Engineering (Track)", "tasks_cleared": 42, "compliance": "98.2%"},
            {"department": "Signal & Telecommunication", "tasks_cleared": 38, "compliance": "97.5%"},
            {"department": "Traction Distribution (TRD)", "tasks_cleared": 31, "compliance": "99.1%"}
        ],
        "top_bottlenecks_eliminated": [
            "Ghaziabad yard crossover turnout alignment conflict",
            "Tundla chord joint OHE power block congestion",
            "Automatic Block Signalling sensor false drop rate"
        ]
    }
