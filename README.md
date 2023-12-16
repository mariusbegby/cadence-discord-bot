<h1 align="center">
    <br>
    Cadence - A Free Discord Music Bot
    <br><br>
    <img src="./assets/logo-rounded-128px.png" alt="Cadence icon">
    <br><br>
</h1>

<h3 align="center">
    Enhance your Discord experience with high-quality music.<br>
    Completely free and open source!
</h3>

<p align="center">
    <a href="https://discord.com/oauth2/authorize?client_id=1125742835946237992&permissions=0&scope=bot%20applications.commands"><img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&label=Add%20bot&labelColor=1b1c1d&logo=discord&logoColor=white&color=4c73df" alt="Add Cadence Discord bot"></a>&nbsp;
    <a href="https://discord.gg/t6Bm8wPpXB"><img src="https://img.shields.io/badge/Discord-%235865F2.svg?style=for-the-badge&label=Support%20Server&labelColor=1b1c1d&logo=discord&logoColor=white&color=4c73df" alt="Cadence Discord support server"></a>&nbsp;
    <a href="https://github.com/mariusbegby/cadence-discord-bot/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/mariusbegby/cadence-discord-bot?style=for-the-badge&label=License&labelColor=1b1c1d&logo=github&logoColor=white&color=4c73df" alt="Cadence bot license"></a>
    <br>
    <a href="https://github.com/mariusbegby/cadence-discord-bot/releases"><img src="https://img.shields.io/github/package-json/v/mariusbegby/cadence-discord-bot/main?style=for-the-badge&label=Version&labelColor=1b1c1d&logo=github&logoColor=white&color=4c73df" alt="Cadence bot release"></a>&nbsp;
    <a href="https://hub.docker.com/r/mariusbegby/cadence"><img src="https://img.shields.io/docker/pulls/mariusbegby/cadence.svg?style=for-the-badge&label=Pulls&labelColor=1b1c1d&logo=docker&logoColor=white&color=4c73df" alt="Docker pulls for Cadence"></a>
</p>

## Core Features 🌟
Cadence offers an enriching audio experience on Discord with features such as:
- High-quality music playback from [many supported sources](https://discord-player.js.org/guide/extractors/stream-sources) thanks to [discord-player](https://github.com/androz2091/discord-player).
- Latest Discord features such as slash commands, autocompleting search queries, select menus, buttons and more!
- Full queue management system to add, remove, skip or move tracks, view queue and history.
- Audio filters, shuffle mode, repeat track, queue or autoplay similar tracks!
- Open-source codebase and community based development, open to feedback and improvements.
- No locked functionality, no premium tier, no ads; everything's free, always.

<br>

## Adding Cadence to Your Discord Server 🤖

1. **Invite Cadence**: Click [here](https://discord.com/oauth2/authorize?client_id=1125742835946237992&permissions=0&scope=bot%20applications.commands) to invite Cadence to your Discord server.
2. **Start Using**: After Cadence has joined your server, use the **`/help`** command for a list of available commands.
3. **Enjoy**: That's it! There is no additional setup, but you might want to join our [support server](https://discord.gg/t6Bm8wPpXB) to stay updated.

<br>

## Hosting Cadence Yourself 🔓

**Self-Hosting Steps**:

1. Install [Node.js](https://nodejs.org/en/download/) v20.x LTS and latest version of [FFmpeg](https://ffmpeg.org/download.html).
2. Clone this repository and run `npm install` (use `npm install --legacy-peer-deps` if errors occur).
3. Build the project with `npm run build`.
4. Configure `.env` file in the root directory with your bot token and client id (details in `.env.example`).
5. Deploy slash commands using `npm run deploy`.
6. Start the bot with `npm start`, the bot should now appear online and be operational.

**Note:** Refer to [Adding your bot to servers](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links) for help on inviting the bot to your server.

### Configuration and Logging:

- Override default configuration by creating `/config/local.js`.
- Use `npm run deploy-pretty` and `npm run start-pretty` for better console output, requires [pino-pretty](https://www.npmjs.com/package/pino-pretty).
- Logs are stored in `/logs` folder. Configure the logging level in the config file.
- For production, usage of `pm2` or similar to manage the bot process is recommended.

<br>

## Get help and support 🛟

Encounter an issue? Open an issue in this repository or join our [Discord support server](https://discord.gg/t6Bm8wPpXB) for assistance.

<br>

## Credits and acknowledgments 🎉

This project is made possible by the contributions from the community and the use of libraries like [discord.js](https://github.com/discordjs/discord.js/) and [discord-player](https://github.com/Androz2091/discord-player). Special thanks to [@twlite](https://github.com/twlite) for providing feedback and help during development of this bot.

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
        <a href=https://github.com/tacheometry>
            <img src=https://avatars.githubusercontent.com/u/39647014?v=4 width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=tacheometry/>
            <br />
            <sub style="font-size:14px"><b>tacheometry</b></sub>
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
