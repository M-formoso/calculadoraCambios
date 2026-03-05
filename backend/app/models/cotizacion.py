import uuid
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Numeric
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base


class Cotizacion(Base):
    __tablename__ = "cotizaciones"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    divisa = Column(String(50), unique=True, nullable=False, index=True)
    nombre = Column(String(100), nullable=False)
    emoji = Column(String(10), nullable=True)
    precio_compra = Column(Numeric(10, 2), nullable=False)
    precio_venta = Column(Numeric(10, 2), nullable=False)
    actualizado_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    activo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
