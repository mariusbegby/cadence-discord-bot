# syntax=docker/dockerfile:1

# Using Node 18.16 (LTS) on Alpine base
ARG NODE_VERSION=18.16
FROM node:${NODE_VERSION}-alpine

# Install npm build dependencies and ffmpeg
RUN apk add --no-cache python3 make build-base ffmpeg

# Set work directory for subsequent commands
WORKDIR /cadence-discord-bot

# Copy the rest of the source files into the image.
COPY . .

# Install dependencies from package-lock.json and omit dev dependencies
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Cleanup of unneeded packages and apk cache
RUN apk del python3 make build-base && \
    rm -rf /var/cache/apk/* /tmp/*

# Startup command to run the bot after deploying slash commands
CMD /bin/sh -c "npm run deploy && npm run start"
