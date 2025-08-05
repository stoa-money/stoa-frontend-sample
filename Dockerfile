FROM node:20-alpine AS base
# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json ./
RUN npm ci


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_CORE_SIGNALR_URL
ARG NEXT_PUBLIC_CORE_API_BASE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_BLOB_STORAGE_URL
ENV NEXT_PUBLIC_CORE_SIGNALR_URL=$NEXT_PUBLIC_CORE_SIGNALR_URL \
    NEXT_PUBLIC_CORE_API_BASE_URL=$NEXT_PUBLIC_CORE_API_BASE_URL \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
    NEXT_PUBLIC_BLOB_STORAGE_URL=$NEXT_PUBLIC_BLOB_STORAGE_URL

RUN npm run build
RUN npm prune --omit=dev

FROM base AS runner
RUN apk add --no-cache libc6-compat

ARG NEXT_PUBLIC_CORE_SIGNALR_URL
ARG NEXT_PUBLIC_CORE_API_BASE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
ARG NEXT_PUBLIC_BLOB_STORAGE_URL
ENV NEXT_PUBLIC_CORE_SIGNALR_URL=$NEXT_PUBLIC_CORE_SIGNALR_URL \
    NEXT_PUBLIC_CORE_API_BASE_URL=$NEXT_PUBLIC_CORE_API_BASE_URL \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY \
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=$NEXT_PUBLIC_GOOGLE_MAPS_API_KEY \
    NEXT_PUBLIC_BLOB_STORAGE_URL=$NEXT_PUBLIC_BLOB_STORAGE_URL \
    NODE_ENV=production \
    PORT=3000 \
    WEBSITES_PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy application files for non-standalone build
WORKDIR /app
# Copy package files
COPY --from=builder /app/.next              ./.next
COPY --from=builder /app/public             ./public
COPY --from=builder /app/node_modules       ./node_modules
COPY --from=builder /app/package.json       ./package.json
COPY --from=builder /app/next.config.ts     ./
USER nextjs

EXPOSE 3000

ENV HOSTNAME=0.0.0.0

CMD ["npm", "start"]