FROM node:20-alpine AS base

# 設置工作目錄
WORKDIR /app

# 安裝所需依賴
RUN apk add --no-cache libc6-compat curl

FROM base AS builder

# 安裝 yarn
RUN curl -o- -L https://yarnpkg.com/install.sh | sh

# 設置 PATH 環境變量以包含 yarn
ENV PATH="/root/.yarn/bin:/root/.config/yarn/global/node_modules/.bin:${PATH}"

# 複製必要的文件
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

# 安裝依賴項，構建項目，並安裝生產依賴項
RUN yarn install --frozen-lockfile && \
    yarn build && \
    yarn install --production --frozen-lockfile

FROM base AS runner

# 設置工作目錄
WORKDIR /app

# 創建用於運行應用程序的組和用戶
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 hono

# 確認 builder 階段的構建輸出存在


# 複製構建應用程序文件
COPY --from=builder --chown=root:root /app/node_modules /app/node_modules
COPY --from=builder --chown=root:root /app/dist /app/dist
COPY --from=builder --chown=root:root /app/package.json /app/package.json

# 創建日志目錄並複製 CA 證書（如果需要）
RUN mkdir -p /app/public/logs
COPY  ca/ /app/ca

# 設置運行用戶
#USER hono

# 暴露應用程序端口
EXPOSE 3000

# 運行應用程序命令
CMD ["node", "/app/dist/index.js"]