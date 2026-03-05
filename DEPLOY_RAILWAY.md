# Deploy en Railway - CambioCBA

## Requisitos Previos

1. Cuenta en [Railway](https://railway.app)
2. Repositorio en GitHub con el codigo del proyecto

## Paso 1: Crear Proyecto en Railway

1. Ir a [Railway Dashboard](https://railway.app/dashboard)
2. Click en **"New Project"**
3. Seleccionar **"Deploy from GitHub repo"**
4. Conectar tu cuenta de GitHub si no lo has hecho
5. Seleccionar el repositorio del proyecto

## Paso 2: Configurar Base de Datos PostgreSQL

1. En tu proyecto de Railway, click en **"+ New"**
2. Seleccionar **"Database"** → **"Add PostgreSQL"**
3. Railway creara automaticamente la variable `DATABASE_URL`

## Paso 3: Configurar Backend

1. Click en **"+ New"** → **"GitHub Repo"**
2. Seleccionar el repositorio
3. En **Settings** → **General**:
   - **Root Directory**: `backend`
   - **Watch Paths**: `/backend/**`

4. En **Settings** → **Variables**, agregar:

```
DATABASE_URL=${{Postgres.DATABASE_URL}}
SECRET_KEY=tu-clave-secreta-muy-segura-aqui-cambiar-en-produccion
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
ADMIN_EMAIL=admin@tudominio.com
ADMIN_PASSWORD=tu-password-seguro
ADMIN_NOMBRE=Administrador
ENVIRONMENT=production
FRONTEND_URL=https://tu-frontend.up.railway.app
```

**IMPORTANTE:** Reemplaza los valores por tus propios datos seguros.

5. Railway detectara automaticamente el Procfile y desplegara

## Paso 4: Configurar Frontend

1. Click en **"+ New"** → **"GitHub Repo"**
2. Seleccionar el mismo repositorio
3. En **Settings** → **General**:
   - **Root Directory**: `frontend`
   - **Watch Paths**: `/frontend/**`

4. En **Settings** → **Variables**, agregar:

```
VITE_API_URL=https://tu-backend.up.railway.app/api/v1
VITE_WHATSAPP_NUMBER=5493511234567
VITE_TELEGRAM_USER=tu_usuario_telegram
VITE_POLLING_INTERVAL=60000
```

**IMPORTANTE:** Reemplaza `tu-backend.up.railway.app` con la URL real de tu backend.

## Paso 5: Generar Dominios

1. En cada servicio (backend y frontend), ir a **Settings** → **Networking**
2. Click en **"Generate Domain"**
3. Copiar las URLs generadas

## Paso 6: Actualizar URLs

Una vez que tengas las URLs:

1. **En el Backend**, actualizar la variable:
   - `FRONTEND_URL=https://tu-frontend.up.railway.app`

2. **En el Frontend**, actualizar la variable:
   - `VITE_API_URL=https://tu-backend.up.railway.app/api/v1`

3. Redeploy ambos servicios

## Variables de Entorno - Resumen

### Backend (PostgreSQL incluido)

| Variable | Descripcion | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de PostgreSQL (auto) | `${{Postgres.DATABASE_URL}}` |
| `SECRET_KEY` | Clave secreta para JWT | `clave-muy-segura-123` |
| `ALGORITHM` | Algoritmo JWT | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Expiracion access token | `30` |
| `REFRESH_TOKEN_EXPIRE_DAYS` | Expiracion refresh token | `7` |
| `ADMIN_EMAIL` | Email del admin | `admin@midominio.com` |
| `ADMIN_PASSWORD` | Password del admin | `password-seguro` |
| `ADMIN_NOMBRE` | Nombre del admin | `Administrador` |
| `ENVIRONMENT` | Entorno | `production` |
| `FRONTEND_URL` | URL del frontend | `https://frontend.up.railway.app` |

### Frontend

| Variable | Descripcion | Ejemplo |
|----------|-------------|---------|
| `VITE_API_URL` | URL del backend | `https://backend.up.railway.app/api/v1` |
| `VITE_WHATSAPP_NUMBER` | Numero WhatsApp | `5493511234567` |
| `VITE_TELEGRAM_USER` | Usuario Telegram | `cambiocba` |
| `VITE_POLLING_INTERVAL` | Intervalo polling (ms) | `60000` |

## Verificar Deploy

1. **Backend**: Visitar `https://tu-backend.up.railway.app/health`
   - Deberia mostrar: `{"status": "healthy"}`

2. **API Docs**: Visitar `https://tu-backend.up.railway.app/docs`
   - Deberia mostrar la documentacion Swagger

3. **Frontend**: Visitar `https://tu-frontend.up.railway.app`
   - Deberia mostrar la app con las cotizaciones

## Dominio Personalizado (Opcional)

1. En **Settings** → **Networking** → **Custom Domain**
2. Agregar tu dominio (ej: `cotizaciones.midominio.com`)
3. Configurar DNS en tu proveedor:
   - Tipo: `CNAME`
   - Nombre: `cotizaciones`
   - Valor: `tu-servicio.up.railway.app`

## Troubleshooting

### Error: Database connection failed
- Verificar que PostgreSQL este corriendo
- Verificar que `DATABASE_URL` este correctamente referenciada

### Error: CORS
- Verificar que `FRONTEND_URL` en el backend sea correcto
- Asegurar que `ENVIRONMENT=production`

### Error: Build failed
- Revisar logs en Railway
- Verificar que las dependencias esten correctas

### Frontend no muestra datos
- Verificar que `VITE_API_URL` apunte al backend correcto
- Verificar en Network tab del navegador si las requests llegan

## Costos Railway

Railway ofrece:
- **Free Tier**: $5 de creditos gratis por mes
- **Hobby Plan**: $5/mes por mas recursos
- PostgreSQL incluido en ambos planes

Para una app pequena como CambioCBA, el Free Tier suele ser suficiente.

---

Desarrollado por Developnet - developnet.com.ar
