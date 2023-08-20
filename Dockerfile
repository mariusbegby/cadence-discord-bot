# Using Node 18.16.1 (LTS) on Alpine base
FROM node:18.16-alpine

# Install npm build dependencies and ffmpeg
RUN apk add --no-cache python3 make build-base ffmpeg git

# Clone Cadence repository - Shallow clone used to avoid including entire git history.
RUN git clone --depth 1 https://github.com/mariusbegby/cadence-discord-bot.git /cadence-discord-bot

# Set work directory for subsequent commands
WORKDIR /cadence-discord-bot

# Install dependencies from package-lock.json and omit dev dependencies
RUN npm ci --omit=dev

# Remove unnecessary files
RUN rm -rf /assets
RUN rm -rf /.github

# Copy .env and config file to docker container
# Do NOT share the built image with anyone as it will contain the .env file
# Optionally skip this step and set environment variables manually
COPY .env .env
COPY *local.js config/local.js

# Deploy Slash Commands to Discord API
RUN npm run deploy

# Startup command to run the bot
CMD [ "npm", "start" ]
