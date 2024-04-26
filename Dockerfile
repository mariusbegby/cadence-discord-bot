# syntax=docker/dockerfile:1
# Dockerfile for https://hub.docker.com/r/mariusbegby/cadence/
# Images automatically published: docker pull mariusbegby/cadence

ARG NODE_VERSION=20.12

# Stage 1: Build and transpile TypeScript
FROM node:${NODE_VERSION}-bookworm-slim as builder

# Set working directory
WORKDIR /app

# Install build dependencies necessary for native modules
RUN apt-get update && apt-get install -y \
    python3 make build-essential

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies with all required build scripts
RUN npm ci

# Copy tsconfig and other necessary files
COPY tsconfig.json ./
COPY src/ ./src/
COPY config/ ./config/
COPY locales/ ./locales/
COPY prisma/ ./prisma/

# Transpile TypeScript to JavaScript
RUN npm run build && \
    npx prisma generate && \
    npm ci --omit=dev

# Stage 2: Production environment
FROM node:${NODE_VERSION}-bookworm-slim as production

# Set working directory
WORKDIR /app

# Install runtime dependencies for native modules
RUN apt-get update && \
    apt-get install -y ffmpeg

# Copy built artifacts from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/locales ./locales
COPY --from=builder /app/prisma ./prisma

# Clear npm cache and install mediaplex
RUN npm cache clean --force && \
    npm install mediaplex

# Rebuild all native dependencies
RUN npm rebuild

# Cleanup of unneeded packages, apk cache, and TypeScript source files
RUN apt-get update && apt-get install -y ca-certificates && \
    apt-get remove -y python3 make build-essential && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    update-ca-certificates

# CMD /bin/sh -c "npm run deploy && npm run start"
CMD /bin/sh -c "npm run start"
