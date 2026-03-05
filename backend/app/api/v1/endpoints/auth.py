from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.deps import get_db, get_current_user
from app.models.usuario import Usuario
from app.schemas.auth import LoginRequest, TokenResponse, RefreshRequest, ChangePasswordRequest
from app.schemas.usuario import UsuarioResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
def login(
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):
    """Login para administrador"""
    service = AuthService(db)
    return service.login(credentials)


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(
    request: RefreshRequest,
    db: Session = Depends(get_db)
):
    """Renovar access token usando refresh token"""
    service = AuthService(db)
    return service.refresh_token(request.refresh_token)


@router.post("/logout")
def logout():
    """Cerrar sesión (el frontend debe eliminar los tokens)"""
    return {"message": "Sesión cerrada exitosamente"}


@router.get("/me", response_model=UsuarioResponse)
def get_current_user_info(
    current_user: Usuario = Depends(get_current_user)
):
    """Obtener datos del usuario actual"""
    return current_user


@router.put("/change-password")
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """Cambiar contraseña del usuario actual"""
    service = AuthService(db)
    service.change_password(current_user, request)
    return {"message": "Contraseña actualizada exitosamente"}
