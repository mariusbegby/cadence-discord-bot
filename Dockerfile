# syntax=docker/dockerfile:1
# Dockerfile for https://hub.docker.com/r/mariusbegby/cadence/
# Images automatically published: docker pull mariusbegby/cadence

# Using Node 18.16 (LTS) on bookworm-slim base
ARG NODE_VERSION=18.16
FROM node:${NODE_VERSION}-bookworm-slim

# Install npm build dependencies and ffmpeg
RUN apt-get update && apt-get install -y python3 make build-essential ffmpeg

# Set work directory for subsequent commands
WORKDIR /cadence-discord-bot

# Copy the rest of the source files into the image.
COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src/
COPY config/ ./config/
COPY locales/ ./locales

# Install dependencies from package-lock.json
RUN npm ci

# Transpile TypeScript to JavaScript, remove dev dependencies, and install production dependencies
RUN npm run build && \
    rm -rf node_modules && \
    npm ci --omit=dev

# Cleanup of unneeded packages, apk cache, and TypeScript source files
RUN apt remove -y python3 make build-essential && \
    rm -rf /var/cache/apt/* /tmp/* ./src/

# Startup command to run the bot after deploying slash commands
CMD /bin/sh -c "npm run deploy && npm run start"
