"""
Test script to verify OR-Tools optimizer execution on the SEC-04 SIH Seed Scenario.
"""
import sys, os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from optimization.ortools_optimizer import optimizer

def test_optimizer():
    # SEC-04 Seed Scenario with the 3 compatible tasks
    tasks = [
        {"task_id": 1, "section_id": 4, "department_id": 1, "task_title": "Track Tongue Rail AT Weld", "estimated_duration_minutes": 45, "priority_score": 90.0, "priority_level": "CRITICAL"},
        {"task_id": 2, "section_id": 4, "department_id": 2, "task_title": "S&T Point Machine Calibration", "estimated_duration_minutes": 30, "priority_score": 75.0, "priority_level": "HIGH"},
        {"task_id": 3, "section_id": 4, "department_id": 3, "task_title": "OHE Cantilever Stagger Tuning", "estimated_duration_minutes": 40, "priority_score": 80.0, "priority_level": "HIGH"}
    ]
    
    candidate_blocks = [
        {"block_id": 101, "section_id": 4, "block_date": "2026-09-04", "start_time": "02:00:00", "end_time": "03:00:00", "available_duration_minutes": 60, "max_allowed_departments": 3},
        {"block_id": 102, "section_id": 4, "block_date": "2026-09-04", "start_time": "03:30:00", "end_time": "04:30:00", "available_duration_minutes": 60, "max_allowed_departments": 3},
        {"block_id": 103, "section_id": 4, "block_date": "2026-09-04", "start_time": "14:00:00", "end_time": "15:00:00", "available_duration_minutes": 60, "max_allowed_departments": 3}
    ]
    
    train_schedules = [
        {"section_id": 4, "departure_time": "01:25:00", "arrival_time": "01:00:00"},
        {"section_id": 4, "departure_time": "01:50:00", "arrival_time": "01:30:00"},
        # 02:00 to 03:00 is clean!
        {"section_id": 4, "departure_time": "03:25:00", "arrival_time": "03:05:00"},
    ]
    
    freight_forecasts = [
        {"section_id": 4, "time_slot_start": "02:00:00", "time_slot_end": "03:00:00", "traffic_level": "LOW"},
        {"section_id": 4, "time_slot_start": "03:00:00", "time_slot_end": "05:00:00", "traffic_level": "HIGH"}
    ]
    
    print("Executing OR-Tools CP-SAT Optimizer...")
    res = optimizer.optimize_blocks(tasks, candidate_blocks, train_schedules, freight_forecasts)
    print("Status:", res["status"])
    print("Execution time:", res["execution_time_ms"], "ms")
    print("Selected blocks count:", len(res["selected_blocks"]))
    for b in res["selected_blocks"]:
        print(f"\nBlock ID {b['block_id']} ({b['start_time']}–{b['end_time']}):")
        print(f"  Departments: {', '.join(b['departments'])}")
        print(f"  Assigned tasks: {[t['task_title'] for t in b['assigned_tasks']]}")
        print(f"  Operational Impact: {b['operational_impact']}")
        print(f"  Confidence: {b['confidence_score']}")
    
    print("\nBefore vs After:")
    bfa = res["before_after_comparison"]
    print("  Manual duration:", bfa["manual_planning"]["total_duration_minutes"], "min (in", bfa["manual_planning"]["total_blocks"], "blocks)")
    print("  AI duration:", bfa["ai_optimized"]["total_duration_minutes"], "min (in", bfa["ai_optimized"]["total_blocks"], "block)")
    print("  Block hours saved:", bfa["improvement"]["block_hours_saved_pct"], "%")

if __name__ == "__main__":
    test_optimizer()
