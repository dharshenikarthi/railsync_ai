"""
RAILSYNC AI - Defects API Endpoints
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Defect, Asset
from app.schemas.schemas import DefectCreate, DefectResponse

router = APIRouter(prefix="/defects", tags=["Defects"])

@router.get("", response_model=List[DefectResponse])
def list_defects(
    severity_level: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    section_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Defect)
    if severity_level:
        query = query.filter(Defect.severity_level == severity_level.upper())
    if status:
        query = query.filter(Defect.status == status.upper())
    if section_id:
        query = query.filter(Defect.section_id == section_id)
    return query.order_by(Defect.created_at.desc()).all()

@router.post("", response_model=DefectResponse)
def report_defect(defect_in: DefectCreate, db: Session = Depends(get_db)):
    new_defect = Defect(
        defect_code=defect_in.defect_code,
        asset_id=defect_in.asset_id,
        section_id=defect_in.section_id,
        defect_type=defect_in.defect_type,
        description=defect_in.description,
        severity_level=defect_in.severity_level.upper(),
        safety_impact=defect_in.safety_impact,
        operational_impact=defect_in.operational_impact.upper(),
        recommended_action=defect_in.recommended_action,
        status="OPEN"
    )
    db.add(new_defect)
    db.commit()
    db.refresh(new_defect)
    return new_defect
