# syntax=docker/dockerfile:1
# Dockerfile for https://hub.docker.com/r/mariusbegby/cadence/
# Images automatically published: docker pull mariusbegby/cadence

# Stage 1: Build and transpile TypeScript
ARG NODE_VERSION=20.12
FROM node:${NODE_VERSION}-bookworm-slim as builder

# Set working directory
WORKDIR /app

# Install dependencies necessary to run npm install
RUN apt-get update && \
    apt-get install -y python3 make build-essential ffmpeg

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
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

# Stage 2: Production environment (final, lighter image, after installing deps etc)
FROM node:${NODE_VERSION}-bookworm-slim as production

# Copy built artifacts from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/config ./config
COPY --from=builder /app/locales ./locales
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /usr/bin/ffmpeg /usr/bin/ffmpeg

# Cleanup of unneeded packages, apk cache, and TypeScript source files
RUN apt-get update && apt-get install -y ca-certificates && \
    apt-get remove -y python3 make build-essential && \
    apt-get autoremove -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/* && \
    update-ca-certificates

# Set working directory
WORKDIR /app

# Startup command to run the bot after deploying slash commands
CMD /bin/sh -c "npm run deploy && npm run start"
