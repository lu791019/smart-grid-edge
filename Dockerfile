FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm
WORKDIR /app

# 复制必要的文件
COPY package*.json pnpm-lock.yaml ./
COPY tsconfig.json ./
COPY src ./src


# 安装依赖项并构建项目
RUN pnpm install --frozen-lockfile && \
    pnpm run build && \
    pnpm prune --prod

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]