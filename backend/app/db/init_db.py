from sqlalchemy.orm import Session
from app.models.usuario import Usuario
from app.models.cotizacion import Cotizacion
from app.core.security import get_password_hash
from app.core.config import settings
from datetime import datetime


def init_db(db: Session) -> None:
    """Inicializa la base de datos con datos por defecto"""

    # Crear usuario admin si no existe
    admin = db.query(Usuario).filter(Usuario.email == settings.ADMIN_EMAIL).first()
    if not admin:
        admin = Usuario(
            email=settings.ADMIN_EMAIL,
            password_hash=get_password_hash(settings.ADMIN_PASSWORD),
            nombre=settings.ADMIN_NOMBRE,
            activo=True
        )
        db.add(admin)
        db.commit()
        print(f"Usuario admin creado: {settings.ADMIN_EMAIL}")

    # Crear cotizaciones iniciales si no existen
    cotizaciones_iniciales = [
        {
            "divisa": "dolar_blue",
            "nombre": "Dólar Blue",
            "emoji": "💵",
            "precio_compra": 1405.00,
            "precio_venta": 1435.00
        },
        {
            "divisa": "euro_blue",
            "nombre": "Euro Blue",
            "emoji": "💶",
            "precio_compra": 1520.00,
            "precio_venta": 1560.00
        },
        {
            "divisa": "usdt",
            "nombre": "USDT",
            "emoji": "🌐",
            "precio_compra": 1400.00,
            "precio_venta": 1450.00
        }
    ]

    for cot_data in cotizaciones_iniciales:
        cotizacion = db.query(Cotizacion).filter(
            Cotizacion.divisa == cot_data["divisa"]
        ).first()
        if not cotizacion:
            cotizacion = Cotizacion(
                divisa=cot_data["divisa"],
                nombre=cot_data["nombre"],
                emoji=cot_data["emoji"],
                precio_compra=cot_data["precio_compra"],
                precio_venta=cot_data["precio_venta"],
                actualizado_at=datetime.utcnow(),
                activo=True
            )
            db.add(cotizacion)
            print(f"Cotización creada: {cot_data['nombre']}")

    db.commit()
