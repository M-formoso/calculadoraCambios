# CambioCBA - Sistema de Cotizaciones y Calculadora

Sistema de visualizacion de cotizaciones de divisas, calculadora de conversion y panel de administracion para casa de cambio.

## Stack Tecnologico

### Backend
- Python 3.11+ con FastAPI
- PostgreSQL 15+
- SQLAlchemy 2.0
- JWT para autenticacion

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui
- Zustand para estado
- TanStack Query para data fetching

## Inicio Rapido con Docker

```bash
# Levantar todos los servicios
docker-compose up -d

# Ver logs
docker-compose logs -f
```

Accesos:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Desarrollo Local

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt

# Configurar .env
cp ../.env.example .env

# Iniciar servidor
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Credenciales por Defecto

- **Email:** admin@cambiocba.com
- **Password:** admin123

## Estructura del Proyecto

```
cambiocba/
├── backend/           # API FastAPI
│   ├── app/
│   │   ├── api/       # Endpoints
│   │   ├── core/      # Config y seguridad
│   │   ├── db/        # Base de datos
│   │   ├── models/    # Modelos SQLAlchemy
│   │   ├── schemas/   # Schemas Pydantic
│   │   └── services/  # Logica de negocio
│   └── tests/
├── frontend/          # App React
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── stores/
│       └── types/
├── docker-compose.yml
└── README.md
```

## Endpoints API

### Publicos
- `GET /api/v1/cotizaciones` - Obtener cotizaciones actuales

### Protegidos (requiere JWT)
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Renovar token
- `GET /api/v1/auth/me` - Usuario actual
- `PUT /api/v1/cotizaciones` - Actualizar cotizaciones
- `GET /api/v1/cotizaciones/historial` - Historial de cambios

## Deploy en Railway

El proyecto esta preparado para deploy en Railway. Ver la guia completa en [DEPLOY_RAILWAY.md](./DEPLOY_RAILWAY.md).

### Resumen rapido:

1. Crear proyecto en Railway
2. Agregar PostgreSQL como servicio
3. Agregar Backend (Root Directory: `backend`)
4. Agregar Frontend (Root Directory: `frontend`)
5. Configurar variables de entorno
6. Generar dominios

### Variables de entorno requeridas:

**Backend:**
```
DATABASE_URL=${{Postgres.DATABASE_URL}}
SECRET_KEY=clave-secreta-segura
ENVIRONMENT=production
ADMIN_EMAIL=admin@tudominio.com
ADMIN_PASSWORD=password-seguro
```

**Frontend:**
```
VITE_API_URL=https://tu-backend.up.railway.app/api/v1
VITE_WHATSAPP_NUMBER=5493511234567
VITE_TELEGRAM_USER=tu_usuario
```

---

Desarrollado por Developnet - developnet.com.ar
