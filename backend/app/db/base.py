from sqlalchemy.orm import declarative_base

Base = declarative_base()

# Import all models here for Alembic
from app.models.usuario import Usuario
from app.models.cotizacion import Cotizacion
from app.models.historial_cotizacion import HistorialCotizacion
