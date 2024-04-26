# syntax=docker/dockerfile:1
# Dockerfile for https://hub.docker.com/r/mariusbegby/cadence/
# Images automatically published: docker pull mariusbegby/cadence

ARG NODE_VERSION=20.12

# Stage 1: Build and transpile TypeScript
FROM node:${NODE_VERSION}-bookworm-slim as builder

# Set working directory
WORKDIR /app

# Install build dependencies necessary for native modules and clean up in one layer
RUN apt-get update && apt-get install -y python3 make build-essential \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install node dependencies
COPY package*.json ./
RUN npm ci

# Copy only necessary source files
COPY tsconfig.json ./
COPY src/ ./src/
COPY config/ ./config/
COPY locales/ ./locales/
COPY prisma/ ./prisma/

# Build the application
RUN npm run build && npx prisma generate

# Remove development dependencies
RUN npm prune --omit=dev

# Stage 2: Production environment
FROM node:${NODE_VERSION}-bookworm-slim as production

# Set working directory
WORKDIR /app

# Install runtime dependencies necessary for the application
RUN apt-get update && apt-get install -y ffmpeg ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy built artifacts from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/locales ./locales
COPY --from=builder /app/prisma ./prisma

# Rebuild native dependencies
RUN npm rebuild && npm cache clean --force

# Install mediaplex
RUN npm install mediaplex

# Cleanup unnecessary packages to minimize image size
RUN apt-get purge -y python3 && apt-get autoremove -y

# CMD /bin/sh -c "npm run deploy && npm run start"
CMD /bin/sh -c "npm run start"
