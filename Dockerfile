FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Отдельный образ для миграций БД: drizzle-kit живёт в devDependencies
# и в standalone-сборку не попадает.
FROM deps AS migrator
COPY drizzle.config.ts ./
COPY drizzle ./drizzle
COPY src/db ./src/db
USER node
CMD ["npx", "drizzle-kit", "migrate"]

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
RUN addgroup -S -g 1001 nextjs && adduser -S -u 1001 -G nextjs nextjs \
    && mkdir -p /app/var && chown nextjs:nextjs /app/var
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nextjs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nextjs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
