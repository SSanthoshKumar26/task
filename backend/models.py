from sqlalchemy import Column, Integer, String, Boolean, JSON, Float, DateTime
from database import Base
import datetime

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(String, unique=True, index=True)
    customer_name = Column(String, index=True)
    customer_email = Column(String)
    amount = Column(Float)
    status = Column(String, index=True) # Success, Pending, Failed
    date = Column(DateTime, default=datetime.datetime.utcnow)
    category = Column(String, index=True)

class Preset(Base):
    __tablename__ = "presets"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    config = Column(JSON) # Stores filters, sort, etc.
    is_default = Column(Boolean, default=False)
