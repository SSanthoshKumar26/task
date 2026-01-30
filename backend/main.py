from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import text, or_, and_
from typing import Optional, List, Any
import models, database
import json
from pydantic import BaseModel

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# CORS
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class PresetCreate(BaseModel):
    name: str
    config: Any
    is_default: bool = False

class PresetResponse(PresetCreate):
    id: int
    class Config:
        orm_mode = True

# Helper for filtering
def apply_filters(query, filters_json):
    if not filters_json:
        return query
    
    try:
        # If filters_json is a string, load it. If dict (from pydantic/fastapi magic?), use it.
        # Query params usually come as strings.
        if isinstance(filters_json, str):
            filters = json.loads(filters_json)
        else:
            filters = filters_json
            
        # Structure: {"logic": "AND", "rules": [{"field": "status", "operator": "eq", "value": "Success"}]}
        
        rules = filters.get("rules", [])
        logic = filters.get("logic", "AND").upper()
        
        conditions = []
        for rule in rules:
            field_name = rule.get("field")
            if not field_name: continue
            
            # Map frontend field names to model fields
            field = getattr(models.Transaction, field_name, None)
            if not field: continue
            
            op = rule.get("operator")
            val = rule.get("value")
            
            if op == "eq": conditions.append(field == val)
            elif op == "neq": conditions.append(field != val)
            elif op == "contains": conditions.append(field.ilike(f"%{val}%"))
            elif op == "gt": conditions.append(field > val)
            elif op == "lt": conditions.append(field < val)
            elif op == "gte": conditions.append(field >= val)
            elif op == "lte": conditions.append(field <= val)
            
        if conditions:
            if logic == "OR":
                query = query.filter(or_(*conditions))
            else:
                query = query.filter(and_(*conditions))
            
    except Exception as e:
        print(f"Filter Error: {e}")
        pass
        
    return query

@app.get("/api/transactions")
def get_transactions(
    page: int = 1,
    limit: int = 20,
    sort_by: str = "date",
    order: str = "desc",
    filters: Optional[str] = None,
    db: Session = Depends(database.get_db)
):
    query = db.query(models.Transaction)
    
    # Filtering
    if filters:
        query = apply_filters(query, filters)
        
    # Sorting
    if hasattr(models.Transaction, sort_by):
        field = getattr(models.Transaction, sort_by)
        if order == "asc":
            query = query.order_by(field.asc())
        else:
            query = query.order_by(field.desc())
            
    total = query.count()
    
    # Pagination
    offset = (page - 1) * limit
    transactions = query.offset(offset).limit(limit).all()
    
    return {
        "data": transactions,
        "meta": {
            "total": total,
            "page": page,
            "limit": limit,
            "pages": (total + limit - 1) // limit
        }
    }

@app.get("/api/presets", response_model=List[PresetResponse])
def get_presets(db: Session = Depends(database.get_db)):
    return db.query(models.Preset).all()

@app.post("/api/presets", response_model=PresetResponse)
def create_preset(preset: PresetCreate, db: Session = Depends(database.get_db)):
    # If is_default is True, unset others
    if preset.is_default:
        db.query(models.Preset).update({"is_default": False})
        
    db_preset = models.Preset(name=preset.name, config=preset.config, is_default=preset.is_default)
    db.add(db_preset)
    db.commit()
    db.refresh(db_preset)
    return db_preset

@app.delete("/api/presets/{id}")
def delete_preset(id: int, db: Session = Depends(database.get_db)):
    db.query(models.Preset).filter(models.Preset.id == id).delete()
    db.commit()
    return {"ok": True}

# Add a seed endpoint for convenience
@app.post("/api/seed")
def seed_data(db: Session = Depends(database.get_db)):
    # Removed check to allow adding more data as requested
    # if db.query(models.Transaction).count() > 0:
    #    return {"message": "Already seeded"}
        
    import random
    import uuid
    from datetime import datetime, timedelta
    
    statuses = ["Success", "Pending", "Failed", "Refunded"]
    categories = ["SaaS", "E-commerce", "Agency", "Freelance"]
    
    data = []
    for i in range(1000):
        t = models.Transaction(
            transaction_id=str(uuid.uuid4())[:8],
            customer_name=f"Customer {random.randint(1000, 9999)}", # Randomized names
            customer_email=f"customer{random.randint(1000, 9999)}@example.com",
            amount=round(random.uniform(10.0, 5000.0), 2), # Increased amount range
            status=random.choice(statuses),
            date=datetime.utcnow() - timedelta(days=random.randint(0, 365)),
            category=random.choice(categories)
        )
        data.append(t)
        
    db.add_all(data)
    db.commit()
    return {"message": "Added 1000 transactions"}
