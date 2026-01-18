import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from sqlalchemy import select, distinct
from sqlalchemy.exc import IntegrityError

from db import SessionLocal, engine, Base
from models import Dashboard

load_dotenv()  # local .env only

app = Flask(__name__)

# For dev: allow all. For production: set FRONTEND_ORIGIN in Railway.
frontend_origin = os.getenv("FRONTEND_ORIGIN", "*")
CORS(app, resources={r"/api/*": {"origins": frontend_origin}})

# Create tables (safe on startup)
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def bad_request(msg):
    return jsonify({"ok": False, "error": msg}), 400


@app.get("/api/health")
def health():
    return jsonify({"ok": True})


@app.get("/api/options")
def options():
    """
    Returns distinct values for dropdowns (category, client, created_by).
    """
    db = SessionLocal()
    try:
        categories = [r[0] for r in db.execute(select(distinct(Dashboard.category)).order_by(Dashboard.category)).all() if r[0]]
        clients = [r[0] for r in db.execute(select(distinct(Dashboard.client)).order_by(Dashboard.client)).all() if r[0]]
        created_bys = [r[0] for r in db.execute(select(distinct(Dashboard.created_by)).order_by(Dashboard.created_by)).all() if r[0]]
        return jsonify({"ok": True, "categories": categories, "clients": clients, "created_bys": created_bys})
    finally:
        db.close()


@app.get("/api/dashboards")
def list_dashboards():
    """
    Optional filters:
      ?category=...&client=...&created_by=...
    """
    category = request.args.get("category", "").strip()
    client = request.args.get("client", "").strip()
    created_by = request.args.get("created_by", "").strip()
    search = request.args.get("search", "").strip()

    db = SessionLocal()
    try:
        q = select(Dashboard).order_by(Dashboard.updated_at.desc(), Dashboard.id.desc())
        if category:
            q = q.where(Dashboard.category == category)
        if client:
            q = q.where(Dashboard.client == client)
        if created_by:
            q = q.where(Dashboard.created_by == created_by)
        if search:
            q = q.where(Dashboard.topic.ilike(f"%{search}%"))

        rows = db.execute(q).scalars().all()

        data = []
        for d in rows:
            data.append({
                "id": d.id,
                "category": d.category,
                "client": d.client,
                "created_by": d.created_by,
                "last_updated_date": d.last_updated_date.isoformat(),
                "updated_by": d.updated_by,
                "topic": d.topic,
                "description": d.description,
                "link": d.link,
                "created_at": d.created_at.isoformat() if d.created_at else None,
                "updated_at": d.updated_at.isoformat() if d.updated_at else None,
            })

        return jsonify({"ok": True, "items": data})
    finally:
        db.close()


@app.post("/api/dashboards")
def create_dashboard():
    payload = request.get_json(silent=True) or {}

    required_fields = [
        "category", "client", "created_by",
        "last_updated_date", "updated_by",
        "topic", "description", "link"
    ]

    for f in required_fields:
        if not str(payload.get(f, "")).strip():
            return bad_request(f"'{f}' is required")

    # Basic link check
    link = payload["link"].strip()
    if not (link.startswith("http://") or link.startswith("https://")):
        return bad_request("link must start with http:// or https://")

    db = SessionLocal()
    try:
        d = Dashboard(
            category=payload["category"].strip(),
            client=payload["client"].strip(),
            created_by=payload["created_by"].strip(),
            last_updated_date=payload["last_updated_date"],  # YYYY-MM-DD
            updated_by=payload["updated_by"].strip(),
            topic=payload["topic"].strip(),
            description=payload["description"].strip(),
            link=link
        )
        db.add(d)
        db.commit()
        db.refresh(d)
        return jsonify({"ok": True, "id": d.id})
    except IntegrityError as e:
        db.rollback()
        return jsonify({"ok": False, "error": "Database error"}), 500
    finally:
        db.close()

@app.put("/api/dashboards/<int:dashboard_id>")
def update_dashboard(dashboard_id):
    payload = request.get_json(silent=True) or {}

    required_fields = ["description", "last_updated_date", "updated_by"]
    for f in required_fields:
        if not str(payload.get(f, "")).strip():
            return bad_request(f"'{f}' is required")

    db = SessionLocal()
    try:
        d = db.get(Dashboard, dashboard_id)
        if not d:
            return jsonify({"ok": False, "error": "Dashboard not found"}), 404

        d.description = payload["description"].strip()
        d.last_updated_date = payload["last_updated_date"]
        d.updated_by = payload["updated_by"].strip()

        db.commit()
        return jsonify({"ok": True})
    finally:
        db.close()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5000")))
