<h1 align="center">
    <br>
    Cadence - A free Discord music and audio bot
    <br><br>
    <img src="./assets/logo-rounded-128px.png" alt="Cadence icon">
    <br><br>
</h1>

<h3 align="center">
    🎶 A free music and audio bot for Discord. No locked functionality, free forever. Open source!
</h3>

<p align="center">
    <a href="https://discord.com/oauth2/authorize?client_id=1125742835946237992&permissions=0&scope=bot%20applications.commands">
        <img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&label=Add%20bot&labelColor=1b1c1d&logo=discord&logoColor=white&color=4c73df" alt="Add Cadence Discord bot">
    </a>&nbsp;
    <a href="https://discord.gg/t6Bm8wPpXB">
        <img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&label=Support%20Server&labelColor=1b1c1d&logo=discord&logoColor=white&color=4c73df" alt="Cadence Discord support server">
    </a>&nbsp;
    <a href="https://github.com/mariusbegby/cadence-discord-bot/blob/main/LICENSE.md">
        <img src="https://img.shields.io/github/license/mariusbegby/cadence-discord-bot?style=for-the-badge&label=License&labelColor=1b1c1d&logo=github&logoColor=white&color=4c73df" alt="Cadence bot license">
    </a>
    <br>
    <a href="https://github.com/mariusbegby/cadence-discord-bot/releases">
        <img src="https://img.shields.io/github/package-json/v/mariusbegby/cadence-discord-bot/main?style=for-the-badge&label=Version&labelColor=1b1c1d&logo=github&logoColor=white&color=4c73df" alt="Cadence bot release">
    </a>&nbsp;
    <a href="https://hub.docker.com/r/mariusbegby/cadence">
        <img src="https://img.shields.io/docker/pulls/mariusbegby/cadence.svg?style=for-the-badge&label=Pulls&labelColor=1b1c1d&logo=docker&logoColor=white&color=4c73df" alt="Docker pulls for Cadence">
    </a>
</p>

## Adding the bot 🤖

To add the bot to your Discord server, click [here](https://discord.com/oauth2/authorize?client_id=1125742835946237992&permissions=0&scope=bot%20applications.commands). This will invite the bot to your Discord server.

Once the bot has joined your Discord server, there is no additional setup needed. Execute the **`/help`** command to view a list of commands to use.

## Hosting the bot yourself 🔓

**⚠️ Migrating from V3 to V4 (config update) and later**

`v4.0.0` brings a new configuration system. To migrate your old configuration, copy your config file in `./src/config.js` to `./config/local.js`. This will override the new default config file stored in `/config/default.js`. No additional actions are required, and if configurable options are missing in your `./config/local.js` file, the bot will automatically use the default values from `./config/default.js`.

---

**This bot is open-source, and if you want to host it yourself, here's how you can do it:**

1. Install [Node.js](https://nodejs.org/en/download/) v18.16 LTS.
2. Install [FFmpeg](https://ffmpeg.org/download.html) latest release build. Make sure you can run `ffmpeg` in your terminal, for Windows, add it to your PATH.
3. Clone this repository and install its dependencies using `npm install`. If you encounter any errors, try use `npm install --legacy-peer-deps`.
4. Use `npm run build` to build the project and convert typescript to javascript.
5. Setup your `.env` file in the root directory to configure bot token `DISCORD_BOT_TOKEN` and client id `DISCORD_APPLICATION_ID`. You obtain these from the [Discord developer portal](https://discord.com/developers/applications). The `.env.example` file provides an example configuration.
6. To make the commands accessible on Discord servers, deploy slash commands using `npm run deploy`.
7. Start the bot using `npm start`. If set up correctly, the bot should now be online and operational. You will need to invite it to a server, see [Adding your bot to servers](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links) article for help.

### Additional information:

-   If you want to override default config options, create a file `/config/local.js`. The options defined in this file will override the default configurable options in `/config/default.js`. See `/config/default.js` for all available options. You do not need to copy the whole `/config/default.js` file, only the options you want to override.
-   You can use `npm run deploy-pretty` and `npm run start-pretty` to get formatted, colorized output to console instead of JSON format. For this to work, you need the npm package `pino-pretty` installed, `npm install pino-pretty -g` to install it globally.
-   Logs are stored in `/logs` directory, you can configure the logging level to file and console in the configuration file.
-   For production use, we recommend using a process manager like `pm2` or similar to automatically restart it the process crashes. Here is a simple setup for `pm2`:
    -   Install `pm2` globally: `npm install pm2 -g`.
    -   In repository root directory, start the bot with `pm2 start ./dist/index.js --name "Cadence"`.
    -   Save the process list with `pm2 save`.
    -   To view logs with `pino-pretty`, run `pm2 logs 0 --out --raw | pino-pretty`. _Note: Does not work well in Windows PowerShell, use command prompt (cmd) to view logs with `pino-pretty` using same command if you are using `pm2`_.

## Get help and support 🛟

Encounter an issue? Open an issue in this repository or join our [Discord support server](https://discord.gg/t6Bm8wPpXB) for assistance.

## Credits and acknowledgments 🎉

This project is made possible by using [discord.js](https://github.com/discordjs/discord.js/) and [discord-player](https://github.com/Androz2091/discord-player). A special thanks to [@twlite](https://github.com/twlite) for his work on [discord-player](https://github.com/Androz2091/discord-player), [mediaplex](https://github.com/androzdev/mediaplex) and for providing feedback and help during development of this bot.

### Contributors

<table>
<tr>
    <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
        <a href=https://github.com/mariusbegby>
            <img src=https://avatars.githubusercontent.com/u/25694918?v=4 width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Marius Begby/>
            <br />
            <sub style="font-size:14px"><b>Marius Begby</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
        <a href=https://github.com/sloraris>
            <img src=https://avatars.githubusercontent.com/u/97694636?v=4 width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Parker Owings/>
            <br />
            <sub style="font-size:14px"><b>Parker Owings</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
        <a href=https://github.com/twlite>
            <img src=https://avatars.githubusercontent.com/u/46562212?v=4 width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Archaeopteryx/>
            <br />
            <sub style="font-size:14px"><b>Archaeopteryx</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
        <a href=https://github.com/Kriblin>
            <img src=https://avatars.githubusercontent.com/u/28916166?v=4 width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Niko G./>
            <br />
            <sub style="font-size:14px"><b>Niko G.</b></sub>
        </a>
    </td>
</tr>
</table>
