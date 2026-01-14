## comandos para crear el backend dentro de turbo repo

```bash
cd apps

pnpm dlx @nestjs/cli@latest new gateway-api --package-manager pnpm
pnpm dlx @nestjs/cli@latest new users-service --package-manager pnpm
pnpm dlx @nestjs/cli@latest new auth-service --package-manager pnpm

cd ..

```
