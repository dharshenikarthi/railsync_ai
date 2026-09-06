"""
RAILSYNC AI - Assets API Endpoints
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Asset, Department, RailwaySection
from app.schemas.schemas import AssetResponse

router = APIRouter(prefix="/assets", tags=["Assets"])

@router.get("", response_model=List[AssetResponse])
def list_assets(
    department_id: Optional[int] = Query(None),
    section_id: Optional[int] = Query(None),
    criticality_level: Optional[str] = Query(None),
    operational_status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Asset)
    if department_id:
        query = query.filter(Asset.department_id == department_id)
    if section_id:
        query = query.filter(Asset.section_id == section_id)
    if criticality_level:
        query = query.filter(Asset.criticality_level == criticality_level.upper())
    if operational_status:
        query = query.filter(Asset.operational_status == operational_status.upper())
    return query.all()

@router.get("/{asset_id}")
def get_asset_detail(asset_id: int, db: Session = Depends(get_db)):
    asset = db.query(Asset).filter(Asset.asset_id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    section = db.query(RailwaySection).filter(RailwaySection.section_id == asset.section_id).first()
    dept = db.query(Department).filter(Department.department_id == asset.department_id).first()
    return {
        "asset": asset,
        "section": section,
        "department": dept
    }
