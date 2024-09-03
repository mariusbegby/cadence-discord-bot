<h1 align="center">
    <br>
    Cadence - The free Discord music bot.
    <br><br>
    <img src="./assets/logo-rounded-128px.png" alt="Cadence icon">
    <br><br>
</h1>

<h3 align="center">
    Enhance your Discord experience with high-quality music.<br>
    Free, open source, community-driven!
</h3>

<p align="center">
    <a href="https://github.com/mariusbegby/cadence-discord-bot/blob/main/LICENSE.md"><img src="https://img.shields.io/github/license/mariusbegby/cadence-discord-bot?style=for-the-badge&label=License&labelColor=1b1c1d&logo=github&logoColor=white&color=4c73df" alt="Cadence bot license"></a>
    <a href="https://github.com/mariusbegby/cadence-discord-bot/releases"><img src="https://img.shields.io/github/package-json/v/mariusbegby/cadence-discord-bot/main?style=for-the-badge&label=Version&labelColor=1b1c1d&logo=github&logoColor=white&color=4c73df" alt="Cadence bot release"></a>&nbsp;
    <a href="https://hub.docker.com/r/mariusbegby/cadence"><img src="https://img.shields.io/docker/pulls/mariusbegby/cadence.svg?style=for-the-badge&label=Pulls&labelColor=1b1c1d&logo=docker&logoColor=white&color=4c73df" alt="Docker pulls for Cadence"></a>
</p>

## 🚨 Deprecation notice 🚨

This project is deprecated, meaning it will not receive any new updates. You can still download the code and setup hosting yourself if desired, but no support will be provided.

<br>

## Core Features 🌟

Cadence offers an enriching audio experience on Discord with features such as:

-   High-quality music playback from [many supported sources](https://discord-player.js.org/guide/extractors/stream-sources) thanks to [discord-player](https://github.com/androz2091/discord-player).
-   Slash commands, autocompleting search queries, select menus, buttons and more interactive features!
-   Full queue management system to add, remove, skip or move tracks, view queue and history.
-   Audio filters, shuffle mode, repeat track, queue or autoplay similar tracks!
-   Open-source codebase and and fully configurable. Download, setup and host yourself.
-   No locked functionality, no premium tier, no ads; everything is free, always.

<br>

## Hosting Cadence Yourself 🔓

**Self-Hosting Steps**:

1. Install [Node.js](https://nodejs.org/en/download/) v20.x LTS and latest version of [FFmpeg](https://ffmpeg.org/download.html).
2. Install `pnpm` using `npm install -g pnpm`.
3. Clone this repository and run `pnpm install`.
4. Build the project with `pnpm build`.
5. Create a `.env` file in with your bot token and client id (see details in `.env.example`).
6. For use with YouTube, it is highly recommended to set YT_EXTRACTOR_AUTH in `.env` file.
7. Deploy slash commands using `pnpm run deploy`.
8. Start the bot with `pnpm start`, the bot should now appear online and be operational.

**Note:** Refer to [Adding your bot to servers](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links) for help on inviting the bot to your server.

### Configuration and Logging:

-   Override default configuration by creating `/config/local.ts`, copy over settings from `/config/default.ts`.
-   Have [pino-pretty](https://www.npmjs.com/package/pino-pretty) installed for formatted, colorized console output.
-   Logs are stored in `/logs` folder. Configure the logging level in the config file.

<br>

## Credits and acknowledgments 🎉

This project is made possible by the contributions from the community and the use of libraries like [discord.js](https://github.com/discordjs/discord.js/) and [discord-player](https://github.com/Androz2091/discord-player). Special thanks to [@twlite](https://github.com/twlite) and [@pryzmian](https://github.com/pryzmian) for providing feedback and help during development of this bot!

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
        <a href=https://github.com/tacheometry>
            <img src=https://avatars.githubusercontent.com/u/39647014?v=4 width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=tacheometry/>
            <br />
            <sub style="font-size:14px"><b>tacheometry</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
        <a href=https://github.com/pryzmian>
            <img src=https://avatars.githubusercontent.com/u/89826250?v=4 width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Aaron Sandoval/>
            <br />
            <sub style="font-size:14px"><b>Aaron Sandoval</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
        <a href=https://github.com/missfrizzy>
            <img src=https://avatars.githubusercontent.com/u/128760145?v=4 width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=MissFrizzy/>
            <br />
            <sub style="font-size:14px"><b>MissFrizzy</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
        <a href=https://github.com/twlite>
            <img src=https://avatars.githubusercontent.com/u/46562212?v=4 width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Twilight/>
            <br />
            <sub style="font-size:14px"><b>Twilight</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
        <a href=https://github.com/Edward205>
            <img src=https://avatars.githubusercontent.com/u/52004020?v=4 width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Edward205/>
            <br />
            <sub style="font-size:14px"><b>Edward205</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
        <a href=https://github.com/Kriblin>
            <img src=https://avatars.githubusercontent.com/u/28916166?v=4 width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Niko G./>
            <br />
            <sub style="font-size:14px"><b>Niko G.</b></sub>
        </a>
    </td>
    <td align="center" style="word-wrap: break-word; width: 75.0; height: 75.0">
        <a href=https://github.com/sloraris>
            <img src=https://avatars.githubusercontent.com/u/97694636?v=4 width="50;"  style="border-radius:50%;align-items:center;justify-content:center;overflow:hidden;padding-top:10px" alt=Parker Owings/>
            <br />
            <sub style="font-size:14px"><b>Parker Owings</b></sub>
        </a>
    </td>
</tr>
</table>
