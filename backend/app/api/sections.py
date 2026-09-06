"""
RAILSYNC AI - Railway Sections & Corridor Topology API
"""
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import RailwaySection, Station, Asset, MaintenanceTask, Defect
from app.schemas.schemas import SectionResponse

router = APIRouter(prefix="/sections", tags=["Railway Sections & Corridor"])

@router.get("", response_model=List[SectionResponse])
def list_sections(db: Session = Depends(get_db)):
    return db.query(RailwaySection).order_by(RailwaySection.section_id).all()

@router.get("/corridor/overview")
def get_corridor_overview(db: Session = Depends(get_db)):
    """Returns visual representation of corridor stations and sections."""
    stations = db.query(Station).order_by(Station.station_id).all()
    sections = db.query(RailwaySection).order_by(RailwaySection.section_id).all()
    
    corridor_data = []
    for sec in sections:
        asset_count = db.query(Asset).filter(Asset.section_id == sec.section_id).count()
        pending_tasks = db.query(MaintenanceTask).filter(
            MaintenanceTask.section_id == sec.section_id,
            MaintenanceTask.status == "PENDING"
        ).count()
        critical_defects = db.query(Defect).filter(
            Defect.section_id == sec.section_id,
            Defect.severity_level == "CRITICAL",
            Defect.status == "OPEN"
        ).count()
        
        # Color coding: Green = safe window, Yellow = moderate risk, Red = high traffic
        if sec.section_code == "SEC-04":
            density_status = "OPTIMAL_WINDOW_AVAILABLE"
            status_color = "#10B981" # Green
        elif sec.section_code == "SEC-01":
            density_status = "HIGH_TRAFFIC_DENSITY"
            status_color = "#EF4444" # Red
        else:
            density_status = "MODERATE_DENSITY"
            status_color = "#F59E0B" # Amber
            
        corridor_data.append({
            "section_id": sec.section_id,
            "section_code": sec.section_code,
            "section_name": sec.section_name,
            "length_km": float(sec.length_km or 30.0),
            "track_count": sec.track_count,
            "electrified": sec.electrified,
            "maximum_speed_kmph": float(sec.maximum_speed_kmph or 130.0),
            "asset_count": asset_count,
            "pending_tasks": pending_tasks,
            "critical_defects": critical_defects,
            "corridor_status": density_status,
            "status_color": status_color,
            "availability_score": 96.2 if sec.section_code == "SEC-04" else 93.4
        })
        
    return {
        "corridor_name": "New Delhi (NDLS) — Tundla (TDL) Main Quad Trunk",
        "stations": [
            {"code": s.station_code, "name": s.station_name, "category": s.station_category}
            for s in stations
        ],
        "sections": corridor_data
    }

@router.get("/{section_id}", response_model=SectionResponse)
def get_section(section_id: int, db: Session = Depends(get_db)):
    sec = db.query(RailwaySection).filter(RailwaySection.section_id == section_id).first()
    if not sec:
        raise HTTPException(status_code=404, detail="Section not found")
    return sec
