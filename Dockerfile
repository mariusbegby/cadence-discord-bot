# syntax=docker/dockerfile:1

# Using Node 18.16 (LTS) on Alpine base
ARG NODE_VERSION=18.16
FROM node:${NODE_VERSION}-alpine

# Install npm build dependencies and ffmpeg
RUN apk add --no-cache python3 make build-base ffmpeg git

# Set work directory for subsequent commands
WORKDIR /cadence-discord-bot

# Copy the rest of the source files into the image.
COPY . .

# Install dependencies from package-lock.json and omit dev dependencies
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Deploy Slash Commands to Discord API
RUN npm run deploy

# Startup command to run the bot
CMD [ "npm", "run", "start" ]
