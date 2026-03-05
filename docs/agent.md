# Agent Instructions - Sistema CambioCBA

## Contexto del Proyecto

Sistema de Cotizaciones y Calculadora para Casa de Cambio que incluye:
- Panel publico con cotizaciones de Dolar Blue, Euro Blue y USDT
- Calculadora de conversion en tiempo real
- Panel de administracion protegido para actualizar precios
- Botones de contacto por WhatsApp y Telegram

**Usuarios:** 1 administrador + visitantes publicos (sin cuenta)
**Complejidad:** Baja - app simple con pocos modulos

## Stack

### Backend
- Python 3.11+ / FastAPI 0.104+
- PostgreSQL 15+ / SQLAlchemy 2.0 / Alembic
- JWT con python-jose

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Colores: Azul (#007BFF), Verde (#28A745), Gris (#F0F0F0)
- Zustand + TanStack Query

## Principios

### Backend
- Capas: Endpoints -> Services -> Models
- Endpoint publico GET /cotizaciones SIN auth
- Endpoint PUT /cotizaciones CON auth JWT

### Frontend
- Componentes pequenos y reutilizables
- TypeScript estricto (prohibido `any`)
- Loading states y error handling en todo

## Calculos

```
QUIERO VENDER: Total = monto x precio_compra
QUIERO COMPRAR: Total = monto x precio_venta
```

## Validaciones Admin

- Precios numericos y positivos
- precio_venta > precio_compra
- Campos obligatorios

## Formato Argentino

- Precios: $1.405 (punto como separador de miles)
- Hora: 03:30 p.m.
