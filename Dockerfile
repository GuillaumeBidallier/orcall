FROM node:22.14-slim AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:22.14-slim AS runner
WORKDIR /app
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser
USER appuser
COPY --from=builder /app/package.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
CMD ["npm", "run", "start"]
