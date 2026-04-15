FROM node:20-alpine AS base
RUN npm install -g pnpm@9

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY packages/contracts/package.json ./packages/contracts/
COPY packages/tsconfig/package.json ./packages/tsconfig/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY services/api/package.json ./services/api/
RUN pnpm install --frozen-lockfile --filter @marry-tone/api...

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=deps /app/services/api/node_modules ./services/api/node_modules
COPY packages/ ./packages/
COPY services/api/ ./services/api/
RUN pnpm --filter @marry-tone/contracts build
RUN pnpm --filter @marry-tone/api build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/services/api/dist ./dist
COPY --from=builder /app/services/api/node_modules ./node_modules
COPY --from=builder /app/packages ./packages

EXPOSE 4000
CMD ["node", "dist/main.js"]
