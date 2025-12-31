FROM node:20.19-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy Prisma schema separately (better cache)
COPY prisma ./prisma

# Generate Prisma Client
RUN npx prisma generate

# Copy remaining source
COPY . .

# Build Next.js
RUN npm run build

FROM node:20.19-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/next.config.* ./ || true

EXPOSE 3000
CMD ["npm", "start"]
