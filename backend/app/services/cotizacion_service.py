from datetime import datetime
from typing import List
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.cotizacion import Cotizacion
from app.models.historial_cotizacion import HistorialCotizacion
from app.schemas.cotizacion import CotizacionUpdate, CotizacionResponse
from uuid import UUID


class CotizacionService:
    def __init__(self, db: Session):
        self.db = db

    def obtener_cotizaciones(self) -> List[Cotizacion]:
        return self.db.query(Cotizacion).filter(Cotizacion.activo == True).all()

    def actualizar_cotizaciones(
        self,
        cotizaciones: List[CotizacionUpdate],
        usuario_id: UUID
    ) -> List[Cotizacion]:
        actualizadas = []

        for cotizacion_data in cotizaciones:
            cotizacion = self.db.query(Cotizacion).filter(
                Cotizacion.divisa == cotizacion_data.divisa
            ).first()

            if not cotizacion:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Cotización no encontrada: {cotizacion_data.divisa}"
                )

            # Validar que precio_venta > precio_compra
            if cotizacion_data.precio_venta <= cotizacion_data.precio_compra:
                raise HTTPException(
                    status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                    detail=f"El precio de venta debe ser mayor que el de compra para {cotizacion_data.divisa}"
                )

            # Guardar historial
            historial = HistorialCotizacion(
                cotizacion_id=cotizacion.id,
                precio_compra_ant=cotizacion.precio_compra,
                precio_venta_ant=cotizacion.precio_venta,
                precio_compra_new=cotizacion_data.precio_compra,
                precio_venta_new=cotizacion_data.precio_venta,
                usuario_id=usuario_id
            )
            self.db.add(historial)

            # Actualizar cotización
            cotizacion.precio_compra = cotizacion_data.precio_compra
            cotizacion.precio_venta = cotizacion_data.precio_venta
            cotizacion.actualizado_at = datetime.utcnow()

            actualizadas.append(cotizacion)

        self.db.commit()
        return actualizadas

    def obtener_historial(self, limit: int = 50) -> List[HistorialCotizacion]:
        return self.db.query(HistorialCotizacion).order_by(
            HistorialCotizacion.created_at.desc()
        ).limit(limit).all()
