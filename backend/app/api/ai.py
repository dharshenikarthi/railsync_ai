"""
RAILSYNC AI - Machine Learning Priority Prediction API
"""
import sys, os
from datetime import date
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

# Ensure ML package is reachable
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))
from ml.pipeline import predictor

from app.core.database import get_db
from app.models.models import MaintenanceTask, Asset, Defect, LocoPilotFeedback, Department
from app.schemas.schemas import AIPrioritizeRequest

router = APIRouter(prefix="/ai", tags=["AI & Machine Learning"])

@router.post("/prioritize")
def run_ai_prioritization(req: AIPrioritizeRequest, db: Session = Depends(get_db)):
    features = {
        "safety_criticality": 90.0 if req.safety_impact else 40.0,
        "defect_severity": req.defect_severity,
        "urgency_score": req.urgency_score,
        "asset_importance": req.asset_criticality,
        "overdue_days": req.overdue_days,
        "operational_impact_score": req.operational_impact_score,
        "loco_pilot_observations": req.loco_pilot_observations,
        "condition_score": req.condition_score,
        "maintenance_history_count": req.maintenance_history_count,
        "estimated_duration": req.estimated_duration
    }
    
    # Run ML prediction
    prediction = predictor.predict_priority(features)
    
    # If task_id provided, update database record
    if req.task_id:
        task = db.query(MaintenanceTask).filter(MaintenanceTask.task_id == req.task_id).first()
        if task:
            task.ai_priority_score = prediction["priority_score"]
            task.priority_score = prediction["priority_score"]
            task.priority_level = prediction["priority_level"]
            db.commit()
            
    return {
        "task_id": req.task_id,
        "predicted_priority_score": prediction["priority_score"],
        "predicted_priority_level": prediction["priority_level"],
        "confidence_score": prediction["confidence_score"],
        "confidence_percentage": f"{int(prediction['confidence_score'] * 100)}%",
        "explainable_reasons": prediction["reasons"],
        "feature_contributions": prediction["feature_contributions"],
        "model_version": prediction["model_version"],
        "formula_reference": "0.24×Safety + 0.20×Defect + 0.16×Urgency + 0.14×Asset + 0.12×LocoPilot + 0.08×OpImpact + 0.06×Cond"
    }

@router.post("/prioritize-all")
def prioritize_all_maintenance_tasks(db: Session = Depends(get_db)):
    """
    Executes the AI/ML Priority Engine across ALL registered maintenance tasks in the database.
    Integrates:
    - Safety criticality
    - Defect severity
    - Urgency
    - Asset importance
    - Overdue status
    - Operational impact
    - Loco Pilot observations on that asset/section
    Updates database records in real-time and returns the newly ranked priority queue.
    """
    tasks = db.query(MaintenanceTask).all()
    results = []
    
    # Fetch all active loco pilot feedback
    loco_feedbacks = db.query(LocoPilotFeedback).filter(
        LocoPilotFeedback.status.in_(["PENDING_VERIFICATION", "VERIFIED"])
    ).all()
    
    for task in tasks:
        # Fetch associated asset & defect
        asset = db.query(Asset).filter(Asset.asset_id == task.asset_id).first()
        defect = db.query(Defect).filter(Defect.defect_id == task.defect_id).first() if task.defect_id else None
        
        # Check for matching loco pilot reports in same section
        matching_fb = [fb for fb in loco_feedbacks if fb.section_id == task.section_id]
        max_lp_severity = 0.0
        lp_notes = []
        for fb in matching_fb:
            boost = float(fb.ai_urgency_boost or 15.0)
            if boost > max_lp_severity:
                max_lp_severity = boost
            lp_notes.append(f"Pilot {fb.pilot_name}: {fb.issue_category} ({fb.severity})")
            
        # Calculate overdue days
        overdue_days = 0.0
        if task.due_date and task.due_date < date.today():
            overdue_days = float((date.today() - task.due_date).days)
        elif not task.due_date:
            overdue_days = 4.0
            
        # Extract features
        asset_crit = float(asset.condition_score if asset else 75.0)
        safety_flag = True if (defect and defect.safety_impact) or max_lp_severity > 15 else (task.criticality_score and task.criticality_score > 70)
        
        features = {
            "safety_criticality": 95.0 if safety_flag else 45.0,
            "defect_severity": defect.severity_level if defect else (task.priority_level or "MEDIUM"),
            "urgency_score": float(task.urgency_score or 65.0),
            "asset_importance": float(task.criticality_score or 75.0),
            "overdue_days": overdue_days,
            "operational_impact_score": 85.0 if safety_flag else 50.0,
            "loco_pilot_observations": max_lp_severity * 3.0 if max_lp_severity > 0 else 0.0,
            "condition_score": float(asset.condition_score if asset else 65.0),
            "maintenance_history_count": 2,
            "estimated_duration": task.estimated_duration_minutes or 45
        }
        
        prediction = predictor.predict_priority(features)
        
        # Update task in database
        task.ai_priority_score = prediction["priority_score"]
        task.priority_score = prediction["priority_score"]
        task.priority_level = prediction["priority_level"]
        
        dept_name = "Track (TMS)"
        if task.department_id == 2:
            dept_name = "Signal & Telecom (SMMS)"
        elif task.department_id == 3:
            dept_name = "Traction / OHE (TDMS)"
            
        results.append({
            "task_id": task.task_id,
            "task_code": task.task_code,
            "task_title": task.task_title,
            "department": dept_name,
            "department_id": task.department_id,
            "section_id": task.section_id,
            "estimated_duration_minutes": task.estimated_duration_minutes,
            "priority_score": prediction["priority_score"],
            "priority_level": prediction["priority_level"],
            "confidence_score": prediction["confidence_score"],
            "confidence_percentage": f"{int(prediction['confidence_score'] * 100)}%",
            "overdue_days": int(overdue_days),
            "loco_pilot_linked": len(matching_fb) > 0,
            "loco_pilot_notes": lp_notes[:2],
            "explainable_reasons": prediction["reasons"],
            "feature_contributions": prediction["feature_contributions"]
        })
        
    db.commit()
    
    # Sort results by priority score descending
    results.sort(key=lambda x: x["priority_score"], reverse=True)
    
    return {
        "status": "SUCCESS",
        "message": f"Successfully evaluated and prioritized {len(results)} maintenance tasks across TMS, SMMS, and TDMS",
        "total_tasks_evaluated": len(results),
        "critical_priority_count": sum(1 for r in results if r["priority_level"] == "CRITICAL"),
        "high_priority_count": sum(1 for r in results if r["priority_level"] == "HIGH"),
        "medium_priority_count": sum(1 for r in results if r["priority_level"] == "MEDIUM"),
        "low_priority_count": sum(1 for r in results if r["priority_level"] == "LOW"),
        "prioritized_queue": results,
        "governance_notice": "AI priority rankings are decision-support recommendations subject to authorized officer block approval."
    }

@router.get("/model-info")
def get_ai_model_info():
    return {
        "model_name": "Indian Railways Multi-Factor Maintenance Priority Model (RandomForestRegressor)",
        "model_version": "v3.0-XAI-LocoPilot",
        "algorithm": "Ensemble Random Forest (100 Estimators, Depth 12)",
        "features_evaluated": [
            "Safety Criticality (RDSO passenger protection)",
            "Defect Severity (Flaw size & geometry deviation)",
            "Urgency Score (Inspection mandates)",
            "Asset Importance (Mainline trunk rating)",
            "Overdue Status (Days past deadline)",
            "Operational Impact (Capacity restriction)",
            "Loco Pilot Observations (Vibration & incident telemetry)",
            "Asset Health Condition Score",
            "Maintenance History Fault Recurrence",
            "Estimated Block Duration"
        ],
        "explainability_method": "Tree SHAP Deviation Decomposition",
        "norm_basis": "RDSO Indian Railways Track, Signalling & OHE Maintenance Guidelines",
        "last_trained": "Active Pipeline Model Artifact"
    }
