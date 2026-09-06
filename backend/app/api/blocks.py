"""
RAILSYNC AI - Candidate Maintenance Blocks API Endpoints
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import BlockWindow, RailwaySection
from app.schemas.schemas import BlockWindowResponse

router = APIRouter(prefix="/blocks", tags=["Block Windows"])

@router.get("", response_model=List[BlockWindowResponse])
def list_block_windows(
    section_id: Optional[int] = Query(None),
    status: Optional[str] = Query("AVAILABLE"),
    db: Session = Depends(get_db)
):
    query = db.query(BlockWindow)
    if section_id:
        query = query.filter(BlockWindow.section_id == section_id)
    if status:
        query = query.filter(BlockWindow.availability_status == status.upper())
    return query.order_by(BlockWindow.start_time).all()
