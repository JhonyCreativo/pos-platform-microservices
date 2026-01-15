FROM node:20-alpine AS base

FROM base AS builder
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm install -g pnpm
RUN npm install -g turbo
COPY . .
RUN turbo prune auth-service --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
RUN apk update
WORKDIR /app
RUN npm install -g pnpm

COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json

RUN pnpm turbo build --filter=auth-service...

FROM base AS runner
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

COPY --from=installer /app .

CMD ["node", "apps/auth-service/dist/main"]