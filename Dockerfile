## Using Node 18.16.1 (LTS) on Alpine base
FROM node:18.16-alpine

## Install npm build dependencies
RUN apk add --no-cache python3 make build-base ffmpeg git

## Install Cadence
RUN git clone https://github.com/mariusbegby/cadence-discord-bot.git

## Run all subsequent commands from cadence root
WORKDIR /cadence-discord-bot

# Copy .env and config.js to docker container
COPY .env .env
COPY *local.js config/local.js

## Install node_modules
RUN npm install --production
RUN npm run deploy

## Cadence startup command
CMD [ "npm", "start" ]
