from sqlalchemy import Column, Integer, Float, Text
from database import Base

class MosquitoData(Base):
    __tablename__ = "final_data_two"  # Use your actual table name

    ID= Column(Integer, primary_key=True, index=True)
    HealthTopic = Column(Text)
    Population = Column(Text)
    Unit = Column(Text)
    Time = Column(Integer)
    RegionCode = Column(Text)
    RegionName = Column(Text)
    Distribution = Column(Text)
    Category = Column(Text)
    Value = Column(Float)
