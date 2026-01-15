from fastapi import FastAPI, Depends, Query, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy import func
from database import SessionLocal, engine
from models import Base, MosquitoData
import requests
import base64
import os
# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------
# 1. GET all mosquito data
@app.get("/api/mosquito")
def get_all_data(db: Session = Depends(get_db)):
    data = db.query(MosquitoData).all()
    return [row.__dict__ for row in data]

# 2. Filter API
@app.get("/api/mosquito/filter")
def filter_data(
    health_topic: Optional[str] = Query(None),
    region_name: Optional[str] = Query(None),
    time: Optional[int] = Query(None),
    population: Optional[str] = Query(None),
    distribution: Optional[str] = Query(None),
    unit: Optional[str] = Query(None),
    value: Optional[float] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(MosquitoData)
    if health_topic:
        query = query.filter(MosquitoData.HealthTopic == health_topic)
    if region_name:
        query = query.filter(MosquitoData.RegionName == region_name)
    if time:
        query = query.filter(MosquitoData.Time == time)
    if population:
        query = query.filter(MosquitoData.Population == population)
    if distribution:
        query = query.filter(MosquitoData.Distribution == distribution)
    if unit:
        query = query.filter(MosquitoData.Unit == unit)
    if value is not None:
        query = query.filter(MosquitoData.Value == value)
    if category:
        query = query.filter(MosquitoData.Category == category)
    return [row.__dict__ for row in query.all()]

# 3. Dropdown filters
@app.get("/api/mosquito/countries")
def get_all_countries(db: Session = Depends(get_db)):
    return [row[0] for row in db.query(MosquitoData.RegionName).distinct().all() if row[0]]

@app.get("/api/mosquito/years")
def get_years(db: Session = Depends(get_db)):
    return sorted({str(row[0]) for row in db.query(MosquitoData.Time).distinct().all() if row[0]})

@app.get("/api/mosquito/healthtopics")
def get_health_topics(db: Session = Depends(get_db)):
    return [row[0] for row in db.query(MosquitoData.HealthTopic).distinct().all() if row[0]]

@app.get("/api/mosquito/populations")
def get_populations(db: Session = Depends(get_db)):
    return [row[0] for row in db.query(MosquitoData.Population).distinct().all() if row[0]]

@app.get("/api/mosquito/distributions")
def get_distributions(db: Session = Depends(get_db)):
    return [row[0] for row in db.query(MosquitoData.Distribution).distinct().all() if row[0]]

@app.get("/api/mosquito/units")
def get_units(db: Session = Depends(get_db)):
    return [row[0] for row in db.query(MosquitoData.Unit).distinct().all() if row[0]]

@app.get("/api/mosquito/categories")
def get_categories(db: Session = Depends(get_db)):
    return [row[0] for row in db.query(MosquitoData.Category).distinct().all() if row[0]]

# 4. Statistics
@app.get("/api/mosquito/stats")
def get_statistics(db: Session = Depends(get_db)):
    stats = db.query(
        func.count(MosquitoData.id).label("total_records"),
        func.avg(MosquitoData.NumValue),
        func.min(MosquitoData.NumValue),
        func.max(MosquitoData.NumValue),
        func.avg(MosquitoData.Value),
        func.min(MosquitoData.Value),
        func.max(MosquitoData.Value)
    ).first()

    return {
        "total_records": stats[0],
        "NumValue": {
            "avg": stats[1],
            "min": stats[2],
            "max": stats[3]
        },
        "Value": {
            "avg": stats[4],
            "min": stats[5],
            "max": stats[6]
        }
    }

# 5. Prediction via Roboflow

from fastapi import FastAPI, Depends, Query, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import Optional
from sqlalchemy import func
from database import SessionLocal, engine
from models import Base, MosquitoData
import requests
import base64
import os
# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# -------------------------
# 1. GET all mosquito data
@app.get("/api/mosquito")
def get_all_data(db: Session = Depends(get_db)):
    data = db.query(MosquitoData).all()
    return [row.__dict__ for row in data]

# 2. Filter API
@app.get("/api/mosquito/filter")
def filter_data(
    health_topic: Optional[str] = Query(None),
    region_name: Optional[str] = Query(None),
    time: Optional[int] = Query(None),
    population: Optional[str] = Query(None),
    distribution: Optional[str] = Query(None),
    unit: Optional[str] = Query(None),
    value: Optional[float] = Query(None),
    category: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(MosquitoData)
    if health_topic:
        query = query.filter(MosquitoData.HealthTopic == health_topic)
    if region_name:
        query = query.filter(MosquitoData.RegionName == region_name)
    if time:
        query = query.filter(MosquitoData.Time == time)
    if population:
        query = query.filter(MosquitoData.Population == population)
    if distribution:
        query = query.filter(MosquitoData.Distribution == distribution)
    if unit:
        query = query.filter(MosquitoData.Unit == unit)
    if value is not None:
        query = query.filter(MosquitoData.Value == value)
    if category:
        query = query.filter(MosquitoData.Category == category)
    return [row.__dict__ for row in query.all()]

# 3. Dropdown filters
@app.get("/api/mosquito/countries")
def get_all_countries(db: Session = Depends(get_db)):
    return [row[0] for row in db.query(MosquitoData.RegionName).distinct().all() if row[0]]

@app.get("/api/mosquito/years")
def get_years(db: Session = Depends(get_db)):
    return sorted({str(row[0]) for row in db.query(MosquitoData.Time).distinct().all() if row[0]})

@app.get("/api/mosquito/healthtopics")
def get_health_topics(db: Session = Depends(get_db)):
    return [row[0] for row in db.query(MosquitoData.HealthTopic).distinct().all() if row[0]]

@app.get("/api/mosquito/populations")
def get_populations(db: Session = Depends(get_db)):
    return [row[0] for row in db.query(MosquitoData.Population).distinct().all() if row[0]]

@app.get("/api/mosquito/distributions")
def get_distributions(db: Session = Depends(get_db)):
    return [row[0] for row in db.query(MosquitoData.Distribution).distinct().all() if row[0]]

@app.get("/api/mosquito/units")
def get_units(db: Session = Depends(get_db)):
    return [row[0] for row in db.query(MosquitoData.Unit).distinct().all() if row[0]]

@app.get("/api/mosquito/categories")
def get_categories(db: Session = Depends(get_db)):
    return [row[0] for row in db.query(MosquitoData.Category).distinct().all() if row[0]]

# 4. Statistics
@app.get("/api/mosquito/stats")
def get_statistics(db: Session = Depends(get_db)):
    stats = db.query(
        func.count(MosquitoData.id).label("total_records"),
        func.avg(MosquitoData.NumValue),
        func.min(MosquitoData.NumValue),
        func.max(MosquitoData.NumValue),
        func.avg(MosquitoData.Value),
        func.min(MosquitoData.Value),
        func.max(MosquitoData.Value)
    ).first()

    return {
        "total_records": stats[0],
        "NumValue": {
            "avg": stats[1],
            "min": stats[2],
            "max": stats[3]
        },
        "Value": {
            "avg": stats[4],
            "min": stats[5],
            "max": stats[6]
        }
    }

# 5. Prediction via Roboflow


# ✅ Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")
# ------------------------- Existing API routes (unchanged) -------------------------
from pathlib import Path

@app.post("/api/predict")
async def predict_model(
    image: UploadFile = File(...),
    date: str = Form(...),
    area: str = Form(...)
):
    try:
        contents = await image.read()
        img_base64 = base64.b64encode(contents).decode("utf-8")

        api_key = "rf_prambbOJd1hyxPiyKay77G0x8Qn2"
        model_id = "mosquito-surveillance-system-uxqnf/2"
        roboflow_base = f"https://detect.roboflow.com/{model_id}"

        # Get prediction (JSON with detection + image URL)
        response = requests.post(
            f"{roboflow_base}?api_key={api_key}",
            data=img_base64,
            headers={"Content-Type": "application/x-www-form-urlencoded"}
        )

        if response.status_code == 200:
            prediction_result = response.json()
            annotated_img_url = prediction_result.get("image")

            if not annotated_img_url:
                return {"error": "Annotated image URL not found in response."}

            print("Downloading from:", annotated_img_url)
            annotated_img_response = requests.get(annotated_img_url)

            # 🔥 Use absolute path to save image
            static_dir = Path(__file__).parent / "static"
            static_dir.mkdir(parents=True, exist_ok=True)

            image_filename = f"output_{area}_{date.replace('-', '')}.png"
            image_path = static_dir / image_filename

            with open(image_path, "wb") as f:
                f.write(annotated_img_response.content)

            # ✅ Return public URL for browser
            output_image_url = f"http://localhost:8000/static/{image_filename}"

            return {
                "message": "Prediction successful",
                "date": date,
                "area": area,
                "detections": prediction_result.get("predictions", []),
                "output_image_url": output_image_url
            }

        else:
            return {"error": response.text}

    except Exception as e:
        return {"error": str(e)}
