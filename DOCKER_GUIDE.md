
# Guía de Despliegue con Docker - POS Platform

Este documento relata el proceso de corrección y despliegue de la arquitectura de microservicios, además de proporcionar las instrucciones finales para levantar el proyecto.

## 1. Arquitectura

La plataforma utiliza Docker Compose para orquestar los siguientes servicios en la red `pos-net`:

| Servicio | Puerto Host | Descripción |
|---|---|---|
| **pos-web** | `3000` | Frontend Next.js. Se conecta al API Gateway. |
| **pos-gateway-api** | `3003` | API Gateway (NestJS). Enruta tráfico a Auth y Users. |
| **pos-auth-service** | `3002` (Interno) | Servicio de Autenticación. |
| **pos-users-service** | `3001` (Interno) | Servicio de Usuarios y BD. |
| **pos-postgres** | `5432` | Base de datos PostgreSQL. |
| **pos-redis** | `6379` | Caché Redis. |

## 2. Soluciones Implementadas (Log de Cambios)

Para lograr un despliegue estable, se realizaron las siguientes correcciones críticas:

### Backend y Base de Datos
1.  **Users Service Build**: Se añadió `prisma generate` al Dockerfile para asegurar que el cliente Prisma exista antes de compilar la app.
2.  **Rutas Duplicadas**: Se eliminó una ruta `@Get()` duplicada en `UsersController` que causaba errores 500 intermitentes y ambigüedad en los endpoints.
3.  **Base de Datos Inicial**: El error `500` en login se debía a una base de datos vacía. Se creó y ejecutó un script de **seed** (`prisma/seed.ts`) para crear el usuario administrador.
4.  **Contraseña Segura**: El login fallaba con `400 Bad Request` porque la contraseña 'admin' era muy corta. Se actualizó el seed a `admin123` (mínimo 6 caracteres).
5.  **Path de Inicio**: `pos-users-service` fallaba al iniciar porque `dist/main.js` no existía en la raíz. Se corrigió el `CMD` para apuntar a `apps/users-service/dist/src/main`.

### Frontend (Web)
1.  **Next.js Standalone**: Se habilitó `output: 'standalone'` en `next.config.js` para crear un build optimizado para Docker.
2.  **Archivos Faltantes**: El contenedor `pos-web` se reiniciaba por falta de módulos. Se actualizó el `Dockerfile` para copiar explícitamente las carpetas `.next/standalone`, `.next/static` y `public` al contenedor final.

## 3. Cómo Ejecutar el Proyecto

Para levantar **TODA** la plataforma (Infraestructura, Backend y Web) de una sola vez y asegurar que se apliquen todos los cambios:

```bash
docker compose --profile infra --profile backend --profile web up -d --build
```

### Acceso a la Plataforma
- **Frontend Web**: [http://localhost:3000](http://localhost:3000)
- **API Gateway**: [http://localhost:3003](http://localhost:3003)

### Credenciales de Acceso (Admin)
- **Usuario**: `admin@pos.com`
- **Contraseña**: `admin123`

---

## Comandos Útiles de Mantenimiento

**Reiniciar solo un servicio (ej. web):**
```bash
docker compose --profile web up -d --build web
```

**Ver logs en tiempo real:**
```bash
docker logs -f pos-gateway-api
docker logs -f pos-users-service
docker logs -f pos-web
```

**Reiniciar Base de Datos (Destructivo):**
Si necesitas borrar todo y empezar de cero:
```bash
docker compose down -v
docker compose --profile infra --profile backend --profile web up -d --build
# Volver a crear tablas y usuario admin
docker exec pos-users-service npx prisma migrate deploy
docker exec pos-users-service npx ts-node prisma/seed.ts
```

# Levantar el proyecto 
```bash
docker compose --profile infra --profile backend --profile web up -d --build
```
# levanta el solo infra + backend
```bash
docker compose --profile infra --profile backend up -d --build
```
