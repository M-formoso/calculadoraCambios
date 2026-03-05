from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from uuid import UUID


class UsuarioBase(BaseModel):
    email: EmailStr
    nombre: str


class UsuarioCreate(UsuarioBase):
    password: str


class UsuarioUpdate(BaseModel):
    nombre: Optional[str] = None
    email: Optional[EmailStr] = None


class UsuarioResponse(UsuarioBase):
    id: UUID
    activo: bool
    ultimo_acceso: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
