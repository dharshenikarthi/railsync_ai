"""
RAILSYNC AI - Trains and Schedules API Endpoints
"""
from typing import Optional, List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.models import Train, TrainSchedule, FreightForecast, RailwaySection
from app.schemas.schemas import TrainResponse, ScheduleResponse

router = APIRouter(prefix="/trains", tags=["Trains & COA Timetables"])

@router.get("", response_model=List[TrainResponse])
def list_trains(
    is_passenger: Optional[bool] = Query(None),
    is_freight: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Train)
    if is_passenger is not None:
        query = query.filter(Train.is_passenger == is_passenger)
    if is_freight is not None:
        query = query.filter(Train.is_freight == is_freight)
    return query.order_by(Train.priority_level.desc()).all()

@router.get("/schedules", response_model=List[ScheduleResponse])
def list_schedules(
    section_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(TrainSchedule)
    if section_id:
        query = query.filter(TrainSchedule.section_id == section_id)
    return query.order_by(TrainSchedule.arrival_time).all()

@router.get("/freight-forecasts")
def list_freight_forecasts(
    section_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(FreightForecast)
    if section_id:
        query = query.filter(FreightForecast.section_id == section_id)
    forecasts = query.order_by(FreightForecast.time_slot_start).all()
    return [
        {
            "forecast_id": f.forecast_id,
            "section_id": f.section_id,
            "time_slot": f"{str(f.time_slot_start)[:5]}–{str(f.time_slot_end)[:5]}",
            "expected_freight_trains": f.expected_freight_trains,
            "traffic_level": f.traffic_level,
            "confidence_score": float(f.confidence_score or 0.85),
            "color": "#10B981" if f.traffic_level == "LOW" else ("#F59E0B" if f.traffic_level == "MEDIUM" else "#EF4444")
        }
        for f in forecasts
    ]

@router.post("", response_model=TrainResponse)
def create_train(
    train_data: dict,
    db: Session = Depends(get_db)
):
    train = Train(
        train_number=train_data.get("train_number"),
        train_name=train_data.get("train_name"),
        priority_level="HIGH" if train_data.get("operational_priority") == 1 else "NORMAL",
        is_passenger=train_data.get("train_type") != "FREIGHT_PARCEL",
        is_freight=train_data.get("train_type") == "FREIGHT_PARCEL",
        operating_days=train_data.get("days_of_run", "Daily")
    )
    db.add(train)
    db.commit()
    db.refresh(train)
    return train
