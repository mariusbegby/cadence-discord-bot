# syntax=docker/dockerfile:1
# Dockerfile for https://hub.docker.com/r/mariusbegby/cadence/
# Images automatically published: docker pull mariusbegby/cadence

ARG NODE_VERSION=20.12

# Use Node.js image as the base image
FROM node:${NODE_VERSION}-bookworm-slim

# Set working directory
WORKDIR /app

# Install build dependencies necessary for native modules and clean up in one layer
RUN apt-get update && apt-get install -y python3 make build-essential ffmpeg ca-certificates \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm

# Copy only necessary source files
COPY package*.json ./ 
COPY tsconfig.json ./ 
COPY src/ ./src/ 
COPY config/ ./config/ 
COPY locales/ ./locales/ 
COPY prisma/ ./prisma/

# Install node dependencies
RUN pnpm install

# Install mediaplex
RUN pnpm install mediaplex

# Build the application
RUN pnpm build && pnpm dlx prisma generate

# Cleanup unnecessary packages to minimize image size
RUN apt-get purge -y python3 && apt-get autoremove -y

# Start the application
CMD pnpm start
