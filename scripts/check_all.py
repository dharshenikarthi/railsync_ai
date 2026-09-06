import os
import sys

print("1. Starting check...", flush=True)
try:
    import psycopg2
    print("2. psycopg2 imported", flush=True)
    conn = psycopg2.connect(
        dbname="RAILSYNC_DB",
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD", "dharshenikarthi"),
        host=os.getenv("DB_HOST", "localhost"),
        port=os.getenv("DB_PORT", "5432"),
        connect_timeout=3
    )
    print("3. Connected to PostgreSQL!", flush=True)
    cur = conn.cursor()
    cur.execute("SELECT version();")
    print("PostgreSQL Version:", cur.fetchone()[0], flush=True)
    cur.execute("SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")
    print("Table count:", cur.fetchone()[0], flush=True)
    cur.close()
    conn.close()
except Exception as e:
    print("PostgreSQL error:", e, flush=True)

print("4. Testing ML model import...", flush=True)
try:
    sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
    from ml.pipeline import get_model_summary
    print("ML model summary:", get_model_summary(), flush=True)
except Exception as e:
    print("ML error:", e, flush=True)

print("5. Testing OR-Tools import...", flush=True)
try:
    from optimization.ortools_optimizer import get_default_demo_scenario, run_block_optimization
    print("OR-Tools imported successfully!", flush=True)
except Exception as e:
    print("OR-Tools error:", e, flush=True)

print("ALL CHECKS COMPLETED.", flush=True)
