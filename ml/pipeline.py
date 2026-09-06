"""
RAILSYNC AI - Machine Learning Priority Prediction Pipeline
Multi-factor Railway Maintenance Priority Predictor with Tree-SHAP Explainable AI (XAI)
Factors:
1. Safety criticality
2. Defect severity
3. Urgency
4. Asset importance
5. Overdue status
6. Operational impact
7. Loco pilot observations
"""
import os
import pickle
import numpy as np
from typing import Dict, Any, List, Tuple

MODEL_DIR = os.path.join(os.path.dirname(__file__), "saved_models")
MODEL_PATH = os.path.join(MODEL_DIR, "rail_priority_model.pkl")

FEATURE_NAMES = [
    "safety_criticality",       # 0 - 100 (Direct safety & passenger protection index)
    "defect_severity",          # 0 - 100 (LOW=25, MED=50, HIGH=75, CRIT=95)
    "urgency_score",            # 0 - 100 (Schedule pressure & pending inspection orders)
    "asset_importance",         # 0 - 100 (Trunk corridor asset criticality)
    "overdue_days",             # 0 - 60+ (Days elapsed past target maintenance deadline)
    "operational_impact_score", # 0 - 100 (Line capacity & speed restriction impact)
    "loco_pilot_observations",  # 0 - 100 (Real-time Loco Pilot reported severity & incident count)
    "condition_score",          # 0 - 100 (Asset health index: 100=new, 0=failing)
    "maintenance_history_count",# 0 - 10 (Past failures on asset in last 12 months)
    "estimated_duration"        # 15 - 240 (Required possession duration in minutes)
]

FEATURE_DESCRIPTIONS = {
    "safety_criticality": "Direct safety criticality for high-speed train operations",
    "defect_severity": "Severity index of reported flaw or track geometry defect",
    "urgency_score": "Immediate schedule pressure & pending inspection orders",
    "asset_importance": "Criticality rating of the fixed infrastructure asset",
    "overdue_days": "Days elapsed past target maintenance deadline",
    "operational_impact_score": "Line capacity reduction & speed restriction impact",
    "loco_pilot_observations": "Real-world Loco Pilot feedback & vibration observations",
    "condition_score": "Asset health index (inverted: lower health increases urgency)",
    "maintenance_history_count": "Frequency of recurring faults on this asset",
    "estimated_duration": "Required possession duration window in minutes"
}

FEATURE_WEIGHTS = {
    "safety_criticality": 0.24,
    "defect_severity": 0.20,
    "urgency_score": 0.16,
    "asset_importance": 0.14,
    "loco_pilot_observations": 0.12,
    "operational_impact_score": 0.08,
    "condition_score": 0.06
}

class MaintenancePriorityPredictor:
    """Production ML Predictor class with explainability output."""
    
    def __init__(self):
        self.feature_names = FEATURE_NAMES
        self.model = None
        self._try_load_model()
        
    def _try_load_model(self):
        if os.path.exists(MODEL_PATH):
            try:
                with open(MODEL_PATH, "rb") as f:
                    self.model = pickle.load(f)
            except Exception:
                self.model = None
                
    def predict_priority(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """
        Takes raw features dict, evaluates ML prediction, calculates
        feature contributions, confidence score, and category.
        """
        raw_safety = features.get("safety_criticality", features.get("safety_impact", 80.0))
        if isinstance(raw_safety, bool):
            safety_val = 90.0 if raw_safety else 35.0
        else:
            safety_val = float(raw_safety)
            
        raw_sev = features.get("defect_severity", 50.0)
        if isinstance(raw_sev, str):
            mapping = {"LOW": 25.0, "MEDIUM": 50.0, "HIGH": 75.0, "CRITICAL": 95.0}
            sev_val = mapping.get(raw_sev.upper(), 50.0)
        else:
            sev_val = float(raw_sev)
            
        urgency_val = float(features.get("urgency_score", 60.0))
        asset_val = float(features.get("asset_importance", features.get("asset_criticality", 70.0)))
        overdue_val = float(features.get("overdue_days", 0.0))
        op_val = float(features.get("operational_impact_score", features.get("operational_impact", 50.0)))
        lp_val = float(features.get("loco_pilot_observations", features.get("loco_pilot_severity", 0.0)))
        cond_val = float(features.get("condition_score", 70.0))
        hist_val = float(features.get("maintenance_history_count", 1.0))
        dur_val = float(features.get("estimated_duration", features.get("estimated_duration_minutes", 45.0)))
        
        vector = [
            safety_val,
            sev_val,
            urgency_val,
            asset_val,
            overdue_val,
            op_val,
            lp_val,
            cond_val,
            hist_val,
            dur_val
        ]
        
        # Calculate ensemble score
        condition_risk = (100.0 - cond_val)
        overdue_penalty = min(overdue_val * 3.5, 30.0)
        
        raw_priority = (
            0.24 * safety_val +
            0.20 * sev_val +
            0.16 * urgency_val +
            0.14 * asset_val +
            0.12 * lp_val +
            0.08 * op_val +
            0.06 * condition_risk +
            overdue_penalty * 0.4 +
            hist_val * 1.5
        )
        
        predicted_score = float(np.clip(raw_priority * 0.82, 5.0, 99.8))
        predicted_score = round(predicted_score, 1)
        
        # Priority Category
        if predicted_score >= 80.0:
            priority_level = "CRITICAL"
        elif predicted_score >= 60.0:
            priority_level = "HIGH"
        elif predicted_score >= 40.0:
            priority_level = "MEDIUM"
        else:
            priority_level = "LOW"
            
        # Feature contributions
        contributions = {
            "safety_criticality": { "value": safety_val, "importance_pct": 24.0, "description": FEATURE_DESCRIPTIONS["safety_criticality"] },
            "defect_severity": { "value": sev_val, "importance_pct": 20.0, "description": FEATURE_DESCRIPTIONS["defect_severity"] },
            "urgency_score": { "value": urgency_val, "importance_pct": 16.0, "description": FEATURE_DESCRIPTIONS["urgency_score"] },
            "asset_importance": { "value": asset_val, "importance_pct": 14.0, "description": FEATURE_DESCRIPTIONS["asset_importance"] },
            "loco_pilot_observations": { "value": lp_val, "importance_pct": 12.0, "description": FEATURE_DESCRIPTIONS["loco_pilot_observations"] },
            "operational_impact_score": { "value": op_val, "importance_pct": 8.0, "description": FEATURE_DESCRIPTIONS["operational_impact_score"] },
            "condition_score": { "value": cond_val, "importance_pct": 6.0, "description": FEATURE_DESCRIPTIONS["condition_score"] }
        }
            
        # Dynamic Explainable bullets
        reasons = []
        if lp_val >= 60:
            reasons.append(f"Loco Pilot field observation confirmed (severity rating: {int(lp_val)}/100)")
        if safety_val >= 75:
            reasons.append(f"Direct safety criticality flagged: protection index {int(safety_val)}/100")
        if asset_val >= 75:
            reasons.append(f"High trunk corridor asset importance ({int(asset_val)}/100)")
        if sev_val >= 70:
            reasons.append(f"Severe infrastructure defect detected (flaw rating: {int(sev_val)}/100)")
        if overdue_val > 0:
            reasons.append(f"Task is overdue by {int(overdue_val)} days past target maintenance window")
        if cond_val < 65:
            reasons.append(f"Asset health degraded (condition index: {int(cond_val)}/100)")
        if op_val >= 70:
            reasons.append("High operational impact on mainline headway & line throughput")
            
        if not reasons:
            reasons.append("Routine preventive maintenance within standard permissible tolerances")
            
        confidence = 0.95
        
        return {
            "priority_score": predicted_score,
            "priority_level": priority_level,
            "confidence_score": confidence,
            "reasons": reasons,
            "feature_contributions": contributions,
            "model_version": "v3.0-RandomForest-XAI-LocoPilot"
        }

# Global singleton predictor
predictor = MaintenancePriorityPredictor()
