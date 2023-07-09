<h1 align="center">
    <br>
    Cadence - A free Discord music and audio bot
    <br><br>
    <img src="./icons/Cadence-icon-rounded-128px.png" alt="Cadence icon">
    <br><br>
</h1>

<h3 align="center">
    🎶 A free music and audio bot for Discord. No locked functionality, free forever. Open source!
</h3>

<p align="center">
    <a href="https://discord.com/oauth2/authorize?client_id=1125742835946237992&permissions=0&scope=bot%20applications.commands">
        <img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&label=Add%20bot&labelColor=1b1c1d&logo=discord&logoColor=white&color=4c73df" alt="Add Cadence Discord bot"></a>&nbsp;
    <a href="https://discord.gg/t6Bm8wPpXB">
        <img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&label=Support%20Server&labelColor=1b1c1d&logo=discord&logoColor=white&color=4c73df" alt="Cadence Discord support server"></a>&nbsp;
    <a href="https://github.com/mariusbegby/cadence-discord-bot/releases">
        <img src="https://img.shields.io/github/package-json/v/mariusbegby/cadence-discord-bot/main?style=for-the-badge&label=Version&labelColor=1b1c1d&logo=github&logoColor=white&color=4c73df" alt="Cadence bot release"></a>&nbsp;
    <a href="https://github.com/mariusbegby/cadence-discord-bot/blob/main/LICENSE.md">
        <img src="https://img.shields.io/github/license/mariusbegby/cadence-discord-bot?style=for-the-badge&label=License&labelColor=1b1c1d&logo=github&logoColor=white&color=4c73df" alt="Cadence bot license">
    </a>
</p>

## Adding the bot 🤖

To add the bot to your Discord server, click [here](https://discord.com/oauth2/authorize?client_id=1125742835946237992&permissions=0&scope=bot%20applications.commands). This will invite the bot to your Discord server.

Once the bot has joined your Discord server, there is no additional configuration. Execute the `/help` command to view a list of commands to use.

## Hosting the bot yourself 🔓

This bot is open-source, and if you want to host it yourself, you can do so by following the steps below.

1. Install [Node.js](https://nodejs.org/en/download/) v18.16 LTS.
2. Install [FFmpeg](https://ffmpeg.org/download.html) latest release build.
3. After cloning this repository, install dependencies with `npm install`.
4. Create and configure the `config.json` document which contains configurable options and values such as `token` and `clientId`. This is required for the bot to communicate with Discord APIs and work properly. See `config.json.example` for an example, and [Discord developer portal](https://discord.com/developers/applications) to get `token` and `clientId`.
5. Deploy slash commands via Discord API by running `npm run deploy`. This is required to make the commands accessible for Discord servers.
6. Run `npm start` to start the bot. If everything is configured and setup correctly, the bot should be online and ready to use. You will need to invite the bot to a server, see [Adding your bot to servers](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links) article for help.

## Get help and support 🛟

If you experience any issues, please open an issue on this repository or join the [Discord support server](https://discord.gg/t6Bm8wPpXB) for the Cadence bot.

## Credits and acknowledgments 🎉

This project is made possible by using [discord.js](https://github.com/discordjs/discord.js/) and [discord-player](https://github.com/Androz2091/discord-player).
