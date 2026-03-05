import uuid
from datetime import datetime
from sqlalchemy import Column, DateTime, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.db.base import Base


class HistorialCotizacion(Base):
    __tablename__ = "historial_cotizaciones"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    cotizacion_id = Column(UUID(as_uuid=True), ForeignKey("cotizaciones.id"), nullable=False)
    precio_compra_ant = Column(Numeric(10, 2), nullable=False)
    precio_venta_ant = Column(Numeric(10, 2), nullable=False)
    precio_compra_new = Column(Numeric(10, 2), nullable=False)
    precio_venta_new = Column(Numeric(10, 2), nullable=False)
    usuario_id = Column(UUID(as_uuid=True), ForeignKey("usuarios.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    cotizacion = relationship("Cotizacion", backref="historial")
    usuario = relationship("Usuario", backref="cambios_cotizacion")
