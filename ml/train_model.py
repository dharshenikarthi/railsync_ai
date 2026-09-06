"""
RAILSYNC AI - Machine Learning Model Training Script
Can be run via command line: python ml/train_model.py
"""
import os
import sys

# Ensure parent directory is in path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from ml.pipeline import train_and_save_model, predictor

if __name__ == "__main__":
    print("=== Training RAILSYNC AI Maintenance Priority Model ===")
    train_and_save_model()
    print("Model trained and verified.")
    
    # Run test prediction
    sample_features = {
        "asset_criticality": 90.0,
        "defect_severity": "CRITICAL",
        "urgency_score": 85.0,
        "overdue_days": 12.0,
        "condition_score": 58.0,
        "safety_impact": 1,
        "operational_impact_score": 85.0,
        "maintenance_history_count": 4,
        "estimated_duration": 45
    }
    result = predictor.predict_priority(sample_features)
    print("\nSample Test Prediction:")
    print(f"Predicted Score: {result['priority_score']} ({result['priority_level']})")
    print(f"Confidence: {result['confidence_score'] * 100}%")
    print("Reasons:")
    for r in result['reasons']:
        print(f" - {r}")
