Eres un arquitecto de software senior y DevOps engineer. 
Vas a continuar un proyecto que ya está en marcha. Lee con atención este contexto porque NO debes repetir pasos ya hechos ni proponer cosas incompatibles.

# CONTEXTO DEL PROYECTO

Estoy construyendo un POS escalable con microservicios usando:

- Backend: NestJS (microservicios REST, no gRPC)
- Orquestación: Turborepo (monorepo)
- Frontend: Next.js (App Router) + shadcn/ui + TanStack Query
- DB: PostgreSQL (Docker)
- Cache/colas: Redis (aún no integrado)
- Autenticación: JWT + Cookies HttpOnly
- Comunicación: API Gateway centralizado
- Infra: Docker Compose para Postgres y Redis

Arquitectura:

Web (Next) → API Gateway → auth-service / users-service / futuros servicios (catalog, inventory, sales, etc.)

Frontend solo habla con Gateway.
Gateway agrega: auth, permisos, swagger, proxy.
Microservicios solo exponen rutas /internal/*.

# SERVICIOS YA IMPLEMENTADOS

1) users-service (Nest + Prisma + Postgres)
- Modelos: User, Role, Permission, UserRole, RolePermission
- Tiene Prisma funcionando y migraciones hechas
- Endpoints internos:
  - POST /internal/users
  - GET /internal/users?email=
  - GET /internal/users/:id
  - GET /internal/users/:id/permissions
  - GET /internal/users/credentials?email= (devuelve password hasheado para auth-service)
- Usa bcrypt para hash de password.

2) auth-service (Nest)
- Endpoint:
  - POST /auth/login
- Se conecta a users-service para validar email/password.
- Emite accessToken y refreshToken.

3) API Gateway (Nest)
- Corre en puerto 3003
- Prefijo global: /api/v1
- Rutas:
  - POST /api/v1/auth/login → proxy a auth-service
  - POST /api/v1/auth/logout → limpia cookies
  - GET /api/v1/me → protegido con JWT (lee cookie)
- JWT se guarda en cookie HttpOnly desde el gateway:
  - Cookie: access_token (15 min)
  - Cookie: refresh_token (7 días)
- JwtStrategy lee token desde cookie, no desde Authorization header.
- CORS habilitado con credentials.
- Usa cookie-parser.

4) Frontend (Next.js App Router)
- Corre en puerto 3000
- Login en /login hace POST /api/v1/auth/login
- No guarda tokens, solo depende de cookies.
- Llama GET /api/v1/me para obtener usuario + permisos.
- Usa axios con withCredentials:true.
- Usa TanStack Query.

# ESTADO ACTUAL

Todo funciona:
- Login desde web funciona.
- Cookie se setea correctamente.
- /me devuelve usuario + permisos.
- No hay problemas de CORS ni JWT.

# EN QUÉ PUNTO NOS QUEDAMOS

Acabamos de terminar la capa de autenticación completa (users, auth, gateway, frontend login con cookies).
Ahora vamos a empezar la siguiente fase funcional del POS.

La siguiente decisión pendiente es:
👉 Crear el siguiente microservicio del dominio del POS.

Orden propuesto:
1) catalog-service (productos, categorías, imágenes)
2) inventory-service (stock, kardex)
3) sales-service (ventas, items)
4) payments-service (métodos de pago)
5) cash-service (apertura/cierre caja)

La siguiente acción concreta es empezar con `catalog-service`.

# REGLAS

- No me expliques conceptos básicos (sé Nest, Prisma, Next, Docker).
- No repitas pasos ya hechos.
- Respeta la arquitectura actual.
- Propón pasos concretos, ordenados y copy/paste friendly.
- Mantén todo escalable.

Continúa desde aquí proponiendo la implementación de `catalog-service` (Prisma schema, endpoints internos, gateway proxy y luego frontend).
