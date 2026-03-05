from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.usuario import Usuario
from app.schemas.cotizacion import (
    CotizacionResponse,
    CotizacionUpdate,
    HistorialCotizacionResponse
)
from app.services.cotizacion_service import CotizacionService

router = APIRouter()


@router.get("", response_model=List[CotizacionResponse])
def obtener_cotizaciones(db: Session = Depends(get_db)):
    """Obtener todas las cotizaciones actuales (público)"""
    service = CotizacionService(db)
    return service.obtener_cotizaciones()


@router.put("", response_model=List[CotizacionResponse])
def actualizar_cotizaciones(
    cotizaciones: List[CotizacionUpdate],
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Actualizar cotizaciones (requiere autenticación)"""
    service = CotizacionService(db)
    return service.actualizar_cotizaciones(cotizaciones, current_user.id)


@router.get("/historial", response_model=List[HistorialCotizacionResponse])
def obtener_historial(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener historial de cambios de cotizaciones (requiere autenticación)"""
    service = CotizacionService(db)
    return service.obtener_historial(limit)
