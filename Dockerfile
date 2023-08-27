# syntax=docker/dockerfile:1
# Dockerfile for https://hub.docker.com/r/mariusbegby/cadence/
# Images automatically published: docker pull mariusbegby/cadence

# Using Node 18.16 (LTS) on Alpine base
ARG NODE_VERSION=18.16
FROM node:${NODE_VERSION}-alpine

# Install npm build dependencies and ffmpeg
RUN apk add --no-cache python3 make build-base ffmpeg

# Set work directory for subsequent commands
WORKDIR /cadence-discord-bot

# Copy the rest of the source files into the image.
COPY package*.json ./
COPY tsconfig.json ./
COPY src/ ./src/
COPY config/ ./config/

# Install dependencies from package-lock.json and omit dev dependencies
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Transpile TypeScript to JavaScript, remove dev dependencies, and install production dependencies
RUN npm run build && \
    rm -rf node_modules && \
    npm ci --omit=dev

# Cleanup of unneeded packages, apk cache, and TypeScript source files
RUN apk del python3 make build-base && \
    rm -rf /var/cache/apk/* /tmp/* ./src/

# Startup command to run the bot after deploying slash commands
CMD /bin/sh -c "npm run deploy && npm run start"
