from sqlalchemy import Column, Integer, String, Text, Date, DateTime, func
from db import Base

class Dashboard(Base):
    __tablename__ = "dashboards"

    id = Column(Integer, primary_key=True, index=True)

    category = Column(String(120), nullable=False)
    client = Column(String(120), nullable=False)

    # 🔹 NEW
    data_from = Column(Date, nullable=False)
    data_to = Column(Date, nullable=False)

    created_by = Column(String(120), nullable=False)
    last_updated_date = Column(Date, nullable=False)
    updated_by = Column(String(120), nullable=False)

    # 🔹 NEW
    published_account = Column(String(255), nullable=False)

    topic = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    link = Column(String(1000), nullable=False)

    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

