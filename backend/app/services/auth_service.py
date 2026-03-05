from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from jose import jwt, JWTError
from app.models.usuario import Usuario
from app.schemas.auth import LoginRequest, TokenResponse, ChangePasswordRequest
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.core.config import settings
from uuid import UUID


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def login(self, credentials: LoginRequest) -> TokenResponse:
        user = self.db.query(Usuario).filter(Usuario.email == credentials.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos"
            )
        if not verify_password(credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email o contraseña incorrectos"
            )
        if not user.activo:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Usuario inactivo"
            )

        # Actualizar último acceso
        user.ultimo_acceso = datetime.utcnow()
        self.db.commit()

        access_token = create_access_token(subject=str(user.id))
        refresh_token = create_refresh_token(subject=str(user.id))

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token
        )

    def refresh_token(self, refresh_token: str) -> TokenResponse:
        try:
            payload = jwt.decode(
                refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
            user_id: str = payload.get("sub")
            token_type: str = payload.get("type")
            if user_id is None or token_type != "refresh":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Token inválido"
                )
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token inválido o expirado"
            )

        user = self.db.query(Usuario).filter(Usuario.id == UUID(user_id)).first()
        if not user or not user.activo:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario no encontrado o inactivo"
            )

        new_access_token = create_access_token(subject=str(user.id))
        new_refresh_token = create_refresh_token(subject=str(user.id))

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token
        )

    def change_password(self, user: Usuario, request: ChangePasswordRequest) -> bool:
        if not verify_password(request.current_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Contraseña actual incorrecta"
            )

        user.password_hash = get_password_hash(request.new_password)
        self.db.commit()
        return True
