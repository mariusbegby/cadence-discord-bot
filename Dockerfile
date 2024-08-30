# syntax=docker/dockerfile:1
# Dockerfile for https://hub.docker.com/r/mariusbegby/cadence/
# Images automatically published: docker pull mariusbegby/cadence

ARG NODE_VERSION=20.12

# Use Node.js image as the base image
FROM node:${NODE_VERSION}-bookworm-slim

# Set working directory
WORKDIR /app

# Install build dependencies necessary for native modules and clean up in one layer
RUN apt-get update && apt-get install -y python3 make build-essential ffmpeg ca-certificates gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget chromium-browser \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install pnpm globally
RUN npm install -g pnpm

# Copy only necessary source files
COPY package*.json ./ 
COPY tsconfig.json ./ 
COPY src/ ./src/ 
COPY config/ ./config/ 
COPY locales/ ./locales/ 

# Install node dependencies
RUN pnpm install

# Install mediaplex
RUN pnpm install mediaplex

# Build the application
RUN pnpm build

# Cleanup unnecessary packages to minimize image size
RUN apt-get purge -y python3 && apt-get autoremove -y

# Start the application
CMD ["/bin/sh", "-c", "pnpm run deploy && pnpm start"]
