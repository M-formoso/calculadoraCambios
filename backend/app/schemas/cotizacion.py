from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime
from uuid import UUID
from decimal import Decimal


class CotizacionBase(BaseModel):
    divisa: str
    nombre: str
    emoji: Optional[str] = None
    precio_compra: Decimal
    precio_venta: Decimal


class CotizacionCreate(CotizacionBase):
    pass


class CotizacionUpdate(BaseModel):
    divisa: str
    precio_compra: Decimal
    precio_venta: Decimal

    @field_validator('precio_compra', 'precio_venta')
    @classmethod
    def precio_debe_ser_positivo(cls, v):
        if v <= 0:
            raise ValueError('El precio debe ser mayor a 0')
        return v

    @field_validator('precio_venta')
    @classmethod
    def venta_mayor_que_compra(cls, v, info):
        if 'precio_compra' in info.data and v <= info.data['precio_compra']:
            raise ValueError('El precio de venta debe ser mayor que el precio de compra')
        return v


class CotizacionResponse(CotizacionBase):
    id: UUID
    actualizado_at: datetime
    activo: bool

    class Config:
        from_attributes = True


class CotizacionesUpdateRequest(BaseModel):
    cotizaciones: List[CotizacionUpdate]


class HistorialCotizacionResponse(BaseModel):
    id: UUID
    cotizacion_id: UUID
    precio_compra_ant: Decimal
    precio_venta_ant: Decimal
    precio_compra_new: Decimal
    precio_venta_new: Decimal
    usuario_id: UUID
    created_at: datetime

    class Config:
        from_attributes = True
