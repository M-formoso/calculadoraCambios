# CambioCBA — Sistema de Cotizaciones y Calculadora para financiera "Linea de cambio"

**Documentación Técnica Completa v1.0**
Desarrollado por Developnet — developnet.com.ar

---

## 📋 Información del Proyecto

| Campo | Detalle |
|---|---|
| Nombre del Sistema | CambioCBA - Cotizaciones y Calculadora |
| Versión | 1.0.0 |
| Tipo de Sistema | Visualización de cotizaciones de divisas, calculadora de conversión y panel de administración de precios |
| Usuarios Estimados | 1 administrador (dueño) + N visitantes públicos (sin cuenta) |
| Entorno | Web responsive (mobile-first) |
| Moneda | Peso Argentino (ARS) — conversiones contra USD, EUR, USDT |
| Formato de Fechas | DD/MM/YYYY — estándar argentino |
| Desarrollado por | Developnet — developnet.com.ar |

---

## 🛠️ Stack Tecnológico

### Backend

- **Framework:** FastAPI 0.104+
- **Lenguaje:** Python 3.11+
- **ORM:** SQLAlchemy 2.0
- **Migraciones:** Alembic
- **Validación:** Pydantic v2
- **Autenticación:** python-jose (JWT) + passlib (bcrypt)
- **Base de Datos:** PostgreSQL 15+
- **Testing:** Pytest + pytest-asyncio

### Frontend

- **Framework:** React 18 + Vite
- **Lenguaje:** TypeScript 5+
- **Styling:** Tailwind CSS
- **Componentes UI:** shadcn/ui + lucide-react
- **Paleta de Colores:** Azul (#007BFF), Verde (#28A745), Gris claro (#F0F0F0) — identidad de casa de cambio
- **State Management:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Formularios:** React Hook Form + Zod
- **Router:** React Router v6
- **HTTP Client:** Axios

### Infraestructura

- **Containerización:** Docker + Docker Compose
- **Proxy Reverso:** Nginx (producción)
- **Deploy:** VPS (Railway / DigitalOcean)
- **CI/CD:** GitHub Actions (opcional)

---

## 📁 Estructura del Proyecto (Monorepo)

```
cambiocba/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                # shadcn/ui components
│   │   │   ├── layout/            # Header, Footer
│   │   │   ├── cotizaciones/      # Tarjetas de cotización pública
│   │   │   ├── calculadora/       # Calculadora de conversión
│   │   │   ├── admin/             # Componentes del panel admin
│   │   │   └── shared/            # Componentes compartidos
│   │   ├── pages/
│   │   │   ├── auth/              # Login admin
│   │   │   ├── home/              # Cotizaciones + Calculadora (público)
│   │   │   └── admin/             # Panel de administración de precios
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── services/              # API calls
│   │   ├── stores/                # Zustand stores
│   │   ├── types/                 # TypeScript types
│   │   └── utils/                 # Formateo, helpers
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   └── v1/
│   │   │       ├── endpoints/
│   │   │       │   ├── auth.py
│   │   │       │   ├── cotizaciones.py
│   │   │       │   └── dashboard.py
│   │   │       └── api.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── deps.py
│   │   ├── db/
│   │   │   ├── base.py
│   │   │   ├── session.py
│   │   │   └── init_db.py
│   │   ├── models/
│   │   │   ├── usuario.py
│   │   │   ├── cotizacion.py
│   │   │   └── historial_cotizacion.py
│   │   ├── schemas/
│   │   │   ├── usuario.py
│   │   │   ├── cotizacion.py
│   │   │   └── auth.py
│   │   └── services/
│   │       ├── auth_service.py
│   │       └── cotizacion_service.py
│   ├── alembic/
│   ├── tests/
│   ├── requirements.txt
│   └── pyproject.toml
│
├── docs/
│   ├── agent.md
│   └── api-documentation.md
│
├── docker-compose.yml
├── docker-compose.prod.yml
├── .env.example
└── README.md
```

---

## 🗂️ Módulos del Sistema

### Módulo 1 — Autenticación (Admin)

**Login exclusivo para el dueño de la casa de cambio**

#### Roles del Sistema

- **Administrador (Dueño):** Acceso al panel de gestión de cotizaciones
- **Visitante (Público):** Acceso sin cuenta — ve cotizaciones y usa la calculadora

#### Funcionalidades

- ✅ Login con JWT (access token + refresh token)
- ✅ Un único usuario administrador (precargado en la BD)
- ✅ Cambio de contraseña
- ✅ Protección de ruta `/admin` con token
- ✅ Logout con invalidación de sesión

#### Endpoints

```
POST   /api/v1/auth/login                  Login administrador
POST   /api/v1/auth/refresh                Renovar access token
POST   /api/v1/auth/logout                 Cerrar sesión
GET    /api/v1/auth/me                     Datos del usuario actual
PUT    /api/v1/auth/change-password        Cambiar contraseña
```

---

### Módulo 2 — Panel de Cotizaciones (Público)

**Visualización pública de cotizaciones de compra y venta de divisas**

#### Divisas Soportadas

| Divisa | Emoji | Identificador |
|---|---|---|
| Dólar Blue | 💵 | `dolar_blue` |
| Euro Blue | 💶 | `euro_blue` |
| USDT | 🌐 | `usdt` |

#### Funcionalidades

- ✅ Tarjeta por cada divisa con precio de compra y precio de venta
- ✅ Columna "VOS VENDÉS" → precio al que la casa compra (botón azul "VENDER")
- ✅ Columna "VOS COMPRÁS" → precio al que la casa vende (botón verde "COMPRAR")
- ✅ Indicador de última actualización con fecha y hora
- ✅ Precios en formato argentino: `$1.405`
- ✅ Al tocar "VENDER" o "COMPRAR" → scroll a la calculadora con divisa y operación preseleccionada
- ✅ Polling automático cada 60 segundos para reflejar cambios del admin sin recargar

#### Endpoints

```
GET    /api/v1/cotizaciones                    Obtener todas las cotizaciones actuales
```

#### Diseño Visual

- Header: fondo azul (#007BFF), nombre del negocio centrado en blanco, hora de actualización debajo
- Fondo general: gris claro (#F0F0F0)
- Tarjetas: fondo blanco, bordes redondeados, sombra suave
- Precios: tipografía grande y bold
- Botón "VENDER": fondo azul (#007BFF), texto blanco
- Botón "COMPRAR": fondo verde (#28A745), texto blanco
- Mobile-first, ancho máximo ~500px en desktop

---

### Módulo 3 — Calculadora de Conversión (Público)

**Calculadora en tiempo real para convertir divisas a pesos argentinos**

#### Funcionalidades

- ✅ Selector de divisa: tres botones pill (💵 Blue, 💶 Euro, 🌐 USDT)
- ✅ Selector de operación: toggle "QUIERO VENDER" / "QUIERO COMPRAR"
- ✅ Campo de entrada numérico grande y centrado (placeholder: `0`)
- ✅ Etiqueta debajo del input: "USD", "EUR" o "USDT" según divisa seleccionada
- ✅ Cálculo en tiempo real mientras el usuario escribe (sin botón de calcular)
- ✅ Tarjeta de resultado con:
  - Etiqueta "Total Estimado"
  - Monto en ARS, tipografía grande, color verde
  - "Cotización: $X.XXX" mostrando la cotización utilizada
- ✅ Botón "Enviar por WhatsApp": abre WhatsApp con mensaje predefinido
- ✅ Botón "Telegram": abre Telegram con mensaje predefinido

#### Lógica de Cálculo

```
Si "QUIERO VENDER":
  Total = monto_ingresado × precio_compra (casa compra al usuario → "VOS VENDÉS")

Si "QUIERO COMPRAR":
  Total = monto_ingresado × precio_venta (casa vende al usuario → "VOS COMPRÁS")
```

#### Formato del Mensaje WhatsApp/Telegram

```
Hola! Quiero [comprar/vender] [monto] [USD/EUR/USDT] a $[cotización]. Total estimado: $[total]. Gracias!
```

#### Diseño Visual

- Divisa activa: borde azul, texto azul
- Divisa inactiva: fondo gris claro, texto gris oscuro
- Operación activa: texto azul, fondo blanco
- Operación inactiva: fondo gris claro
- Resultado: fondo gris claro, monto en verde, tipografía grande
- Botón WhatsApp: fondo verde (#25D366), ancho completo
- Botón Telegram: fondo azul (#0088CC), ancho completo

---

### Módulo 4 — Panel de Administración (Privado)

**Gestión de precios de cotizaciones por el dueño de la casa de cambio**

#### Funcionalidades

- ✅ Acceso protegido con login (JWT)
- ✅ Tarjeta editable por cada divisa (Dólar Blue, Euro Blue, USDT)
- ✅ Campo editable "Precio de Compra" (lo que la casa paga → "VOS VENDÉS")
- ✅ Campo editable "Precio de Venta" (lo que la casa cobra → "VOS COMPRÁS")
- ✅ Inputs numéricos con valor actual precargado
- ✅ Botón "Guardar Cambios" que actualiza todas las cotizaciones a la vez
- ✅ Validación: no permitir valores vacíos, negativos o no numéricos
- ✅ Validación: precio de venta debe ser mayor que precio de compra
- ✅ Confirmación visual al guardar (toast de éxito/error)
- ✅ Al guardar se actualiza automáticamente la hora de "Actualizado" en el panel público
- ✅ Responsive: optimizado para editar desde el celular rápidamente
- ✅ Historial de cambios de cotización (opcional): registro con fecha/hora y valores anteriores

#### Endpoints

```
PUT    /api/v1/cotizaciones                    Actualizar todas las cotizaciones (protegido)
GET    /api/v1/cotizaciones/historial          Historial de cambios (protegido, opcional)
```

---

## 💾 Esquema de Base de Datos

### `usuarios`
```sql
id                UUID (PK)
email             VARCHAR(255) UNIQUE NOT NULL
password_hash     VARCHAR(255) NOT NULL
nombre            VARCHAR(100) NOT NULL
activo            BOOLEAN DEFAULT TRUE
ultimo_acceso     TIMESTAMP
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

### `cotizaciones`
```sql
id                UUID (PK)
divisa            VARCHAR(50) UNIQUE NOT NULL    -- 'dolar_blue', 'euro_blue', 'usdt'
nombre            VARCHAR(100) NOT NULL          -- 'Dólar Blue', 'Euro Blue', 'USDT'
emoji             VARCHAR(10)                    -- '💵', '💶', '🌐'
precio_compra     DECIMAL(10,2) NOT NULL         -- lo que la casa paga (VOS VENDÉS)
precio_venta      DECIMAL(10,2) NOT NULL         -- lo que la casa cobra (VOS COMPRÁS)
actualizado_at    TIMESTAMP NOT NULL             -- última vez que se modificaron los precios
activo            BOOLEAN DEFAULT TRUE
created_at        TIMESTAMP
updated_at        TIMESTAMP
```

### `historial_cotizaciones`
```sql
id                    UUID (PK)
cotizacion_id         UUID (FK cotizaciones)
precio_compra_ant     DECIMAL(10,2) NOT NULL     -- precio compra anterior
precio_venta_ant      DECIMAL(10,2) NOT NULL     -- precio venta anterior
precio_compra_new     DECIMAL(10,2) NOT NULL     -- precio compra nuevo
precio_venta_new      DECIMAL(10,2) NOT NULL     -- precio venta nuevo
usuario_id            UUID (FK usuarios)
created_at            TIMESTAMP                  -- momento del cambio
```

---

## 🤖 Archivo para Claude Code (`docs/agent.md`)

```markdown
# Agent Instructions — Sistema CambioCBA

## Contexto del Proyecto

Estás trabajando en un **Sistema de Cotizaciones y Calculadora para una Casa de Cambio** que incluye:
- Panel público con cotizaciones de Dólar Blue, Euro Blue y USDT
- Calculadora de conversión en tiempo real
- Panel de administración protegido para que el dueño actualice los precios
- Botones de contacto por WhatsApp y Telegram

**Usuarios del sistema:** 1 administrador (dueño) + visitantes públicos (sin cuenta)
**Acceso:** Web responsive (mobile-first)
**Complejidad:** Baja — es una app simple con pocos módulos

---

## Stack Tecnológico

### Backend
- Python 3.11+ con FastAPI 0.104+
- PostgreSQL 15+ como base de datos
- SQLAlchemy 2.0 como ORM / Alembic para migraciones
- Pydantic v2 para validación
- JWT con python-jose para autenticación (solo admin)
- Pytest para testing

### Frontend
- React 18 + TypeScript + Vite
- Tailwind CSS + shadcn/ui para componentes
- **Colores:** Azul (#007BFF), Verde (#28A745), Gris (#F0F0F0)
- Zustand para state management
- TanStack Query para data fetching
- React Hook Form + Zod para formularios
- React Router v6

---

## Principios de Desarrollo

### Arquitectura Backend
- Capas: Endpoints → Services → Models (NUNCA lógica de negocio en endpoints)
- Dependency injection de FastAPI para DB y auth
- Validación Pydantic v2 en todos los endpoints
- Endpoint público GET /cotizaciones SIN autenticación
- Endpoint PUT /cotizaciones CON autenticación JWT

### Arquitectura Frontend
- Componentes pequeños y reutilizables
- Custom hooks para lógica compartida
- TypeScript SIEMPRE — prohibido usar `any`
- Loading states y error handling en todas las operaciones
- Página pública (cotizaciones + calculadora) y panel admin son layouts y rutas separadas

---

## Características Específicas del Proyecto

### Cálculos de la Calculadora
- Si "QUIERO VENDER": Total = monto × precio_compra
- Si "QUIERO COMPRAR": Total = monto × precio_venta
- Cálculo reactivo en tiempo real (sin botón)

### Polling de Cotizaciones
- El frontend hace polling cada 60 segundos al endpoint GET /cotizaciones
- Si los precios cambiaron, se actualiza la UI automáticamente sin recarga

### Validaciones del Admin
- Precio de compra y venta deben ser numéricos y positivos
- Precio de venta > Precio de compra (la casa tiene margen)
- No se pueden dejar campos vacíos

### Formato Argentino
- Precios: separador de miles con punto ($1.405)
- Sin decimales para ARS (salvo que el cálculo lo requiera)
- Hora: formato 12h con a.m./p.m. (ej: 03:30 p.m.)

---

## Flujos Críticos

### Flujo de Consulta Pública
1. Visitante entra a la página
2. Ve las cotizaciones actuales de las 3 divisas
3. Toca "VENDER" o "COMPRAR" en una tarjeta
4. La página hace scroll a la calculadora con la divisa y operación preseleccionada
5. Ingresa el monto y ve el resultado en tiempo real
6. Toca "Enviar por WhatsApp" o "Telegram" → se abre la app con mensaje predefinido

### Flujo de Actualización de Precios (Admin)
1. Dueño abre /admin desde el celular
2. Ingresa email y contraseña
3. Ve las 3 divisas con precios actuales precargados en los inputs
4. Modifica los valores que necesite
5. Toca "Guardar Cambios"
6. Sistema valida los datos
7. Si es válido: actualiza precios + hora de actualización, muestra toast de éxito
8. Si hay error: muestra toast de error con detalle
9. Los visitantes ven los nuevos precios en el próximo ciclo de polling (máximo 60 segundos)

---

## Convenciones de Código

### Python
```python
# Nombres descriptivos en español
def obtener_cotizaciones_actuales(db: Session) -> List[CotizacionSchema]:
    pass

def actualizar_cotizaciones(
    db: Session,
    cotizaciones: List[CotizacionUpdate],
    usuario_id: UUID
) -> List[Cotizacion]:
    """
    Actualiza precios de todas las cotizaciones y registra historial.
    """
    pass
```

### TypeScript
```typescript
interface Cotizacion {
  id: string;
  divisa: string;
  nombre: string;
  emoji: string;
  precioCompra: number;
  precioVenta: number;
  actualizadoAt: string;
}

type Operacion = 'vender' | 'comprar';
type Divisa = 'dolar_blue' | 'euro_blue' | 'usdt';

const formatearPrecio = (monto: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monto);
};
```

---

## Estructura de Archivos por Módulo

### Backend:
```
1. models/{modulo}.py
2. schemas/{modulo}.py
3. services/{modulo}_service.py
4. api/v1/endpoints/{modulo}.py
5. tests/api/test_{modulo}.py
```

### Frontend:
```
src/
├── components/{modulo}/
│   ├── {Componente}.tsx
│   └── index.ts
├── pages/{modulo}/
│   └── index.tsx
├── services/{modulo}Service.ts
└── types/{modulo}.ts
```

---

## Seguridad

- ✅ Endpoint GET /cotizaciones es público (sin auth)
- ✅ Endpoint PUT /cotizaciones requiere JWT de admin
- ✅ Ruta /admin protegida en frontend con guard de autenticación
- ✅ Password hasheado con bcrypt
- ✅ JWT con expiración (access: 30min, refresh: 7 días)
- ✅ Validación de datos en backend antes de guardar
- ✅ CORS configurado para el dominio del frontend

---

## Testing — Mínimo Requerido

```python
# tests/api/test_cotizaciones.py

def test_obtener_cotizaciones_publico(client):
    """Cualquier visitante puede ver las cotizaciones sin auth."""
    response = client.get("/api/v1/cotizaciones")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    assert data[0]["precio_compra"] > 0
    assert data[0]["precio_venta"] > data[0]["precio_compra"]

def test_actualizar_cotizaciones_requiere_auth(client):
    """No se pueden actualizar cotizaciones sin token."""
    response = client.put("/api/v1/cotizaciones", json=[
        {"divisa": "dolar_blue", "precio_compra": 1410, "precio_venta": 1440}
    ])
    assert response.status_code == 401

def test_actualizar_cotizaciones_admin(client, admin_headers):
    """El admin puede actualizar cotizaciones."""
    response = client.put(
        "/api/v1/cotizaciones",
        json=[
            {"divisa": "dolar_blue", "precio_compra": 1410, "precio_venta": 1440},
            {"divisa": "euro_blue", "precio_compra": 1670, "precio_venta": 1695},
            {"divisa": "usdt", "precio_compra": 1410, "precio_venta": 1470},
        ],
        headers=admin_headers
    )
    assert response.status_code == 200

def test_venta_mayor_que_compra(client, admin_headers):
    """Precio de venta debe ser mayor que precio de compra."""
    response = client.put(
        "/api/v1/cotizaciones",
        json=[
            {"divisa": "dolar_blue", "precio_compra": 1500, "precio_venta": 1400}
        ],
        headers=admin_headers
    )
    assert response.status_code == 422
```
```

---

## Comandos Útiles

```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev

# Docker
docker-compose up -d
docker-compose logs -f backend
docker-compose exec backend alembic upgrade head

# Tests
pytest
pytest tests/api/test_cotizaciones.py -v
pytest --cov=app tests/
```

---

## ⚙️ Variables de Entorno (`.env.example`)

```bash
# Base de datos
DATABASE_URL=postgresql://user:password@localhost:5432/cambiocba

# JWT
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# WhatsApp (número de la casa de cambio)
VITE_WHATSAPP_NUMBER=5493511234567
VITE_TELEGRAM_USER=cambiocba

# Frontend
VITE_API_URL=http://localhost:8000/api/v1

# Polling interval (ms)
VITE_POLLING_INTERVAL=60000
```

---

## 🗓️ Fases de Desarrollo

| Fase | Contenido | Estimado |
|---|---|---|
| Fase 1 — Setup | Estructura monorepo, Docker Compose, PostgreSQL, FastAPI base, React + Vite | 1 día |
| Fase 2 — Auth | Modelo Usuario admin, JWT, login, protección de ruta /admin | 1 día |
| Fase 3 — Cotizaciones Públicas | Modelo Cotizacion, endpoint GET público, tarjetas con precios, polling | 1 día |
| Fase 4 — Calculadora | Selector divisa/operación, input, cálculo en tiempo real, resultado | 1 día |
| Fase 5 — Panel Admin | Edición de precios, validación, guardado, toast, historial | 1 día |
| Fase 6 — WhatsApp y Telegram | Botones de contacto con mensaje predefinido, interacción tarjetas → calculadora | 0.5 día |
| Fase 7 — Deploy y Ajustes | Docker prod, Nginx, deploy en Railway/VPS, testing final, ajustes visuales | 0.5 día |

**Total estimado: menos de 1 semana**

---

*Desarrollado por **Developnet** — developnet.com.ar — Villa Gesell, Buenos Aires, Argentina*