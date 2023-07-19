# Changelog

## [2.2.3](https://github.com/mariusbegby/cadence-discord-bot/compare/v2.2.2...v2.2.3) (2023-07-19)


### Minor changes and bug fixes

* small changes to logging ([800f4a3](https://github.com/mariusbegby/cadence-discord-bot/commit/800f4a30db32e3efe2c95489c66065cf0170f1b8))
* updated logging service to log levels separately ([b95be75](https://github.com/mariusbegby/cadence-discord-bot/commit/b95be75768ce41558010a3c0d7128c2bb2a12d40))


### Miscellaneous

* Updated README.md ([2f7e392](https://github.com/mariusbegby/cadence-discord-bot/commit/2f7e39236e8abb82f4edff9d2273da80f51e0565))

## [2.2.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v2.2.1...v2.2.2) (2023-07-19)


### Minor changes and bug fixes

* fix requiring local files ([cd83f72](https://github.com/mariusbegby/cadence-discord-bot/commit/cd83f7287f67f7fe95c02c4b32195bd1397407e5))

## [2.2.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v2.2.0...v2.2.1) (2023-07-18)


### Minor changes and bug fixes

* Add more logging to /play command ([389e60b](https://github.com/mariusbegby/cadence-discord-bot/commit/389e60baadff9501e03319dcc0cd2c1688c12c16))
* Add more logging to all commands ([8ab4cbe](https://github.com/mariusbegby/cadence-discord-bot/commit/8ab4cbead2371162176c27e475d09b9b7d600ab2))

## [2.2.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v2.1.3...v2.2.0) (2023-07-18)


### Features

* Added metadata to queue, and added more logging and handling of error events ([0bdf572](https://github.com/mariusbegby/cadence-discord-bot/commit/0bdf572d0de54b06bf4bc6cc9e2fa2b900ce1c55))


### Minor changes and bug fixes

* fixed typo in leaveOnEndCooldown in playerOptions ([9c47811](https://github.com/mariusbegby/cadence-discord-bot/commit/9c47811aea9bebe2835907bc5311daa1e40c8a17))
* Show total amount of tracks in queue footer besides pages ([3f15094](https://github.com/mariusbegby/cadence-discord-bot/commit/3f15094cf88ace4ac1e054231cd4a6dfb3b9ddc8))

## [2.1.3](https://github.com/mariusbegby/cadence-discord-bot/compare/v2.1.2...v2.1.3) (2023-07-18)


### Minor changes and bug fixes

* Added player query validation, will transform country-based Spotify URLs ([4020442](https://github.com/mariusbegby/cadence-discord-bot/commit/40204420fa7adf967e2ff6b1a3e55a516b82155a))
* Adjusted check on query URL domain ([5ac130a](https://github.com/mariusbegby/cadence-discord-bot/commit/5ac130ab45141c2fd4fe220f9cd8e83c276cadf8))
* Update text in /nowplaying for audio source ([2445337](https://github.com/mariusbegby/cadence-discord-bot/commit/2445337cccd3a6cdbc2bd29d15b6c3f8edf4ec3b))

## [2.1.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v2.1.1...v2.1.2) (2023-07-18)


### Minor changes and bug fixes

* added util for parsing cookies from json and convert to single-line string to .txt ([06a3b68](https://github.com/mariusbegby/cadence-discord-bot/commit/06a3b68850f96d0e0528d1f38ab7961473802d78))

## [2.1.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v2.1.0...v2.1.1) (2023-07-18)


### Minor changes and bug fixes

* add --legacy-peer-deps flag when installing npm packages in CI pipeline ([06c66d7](https://github.com/mariusbegby/cadence-discord-bot/commit/06c66d78ce46811457696825cb1aaa537ac0ead9))
* Moved some utility into categorized folders ([29ba4cc](https://github.com/mariusbegby/cadence-discord-bot/commit/29ba4ccb50e5db4710854db16357a854f60816b4))

## [2.1.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v2.0.0...v2.1.0) (2023-07-18)


### Features

* Added common logic for validating command execution ([c7400f9](https://github.com/mariusbegby/cadence-discord-bot/commit/c7400f9fcdefe2ba4e290438d08cad1ac39e3758))

## [2.0.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.7.2...v2.0.0) (2023-07-18)


### ⚠ BREAKING CHANGES

* Extracted logic from index.js to separate files
* Updated configuration and moved config location
* Extract logic with registering event listeners to a separate file
* New event handling
* Updated command folder structure for new command handler
* Moved source into /src folder

### Features

* Automatically send guildCount stats to botlist sites on startup ([547f3ca](https://github.com/mariusbegby/cadence-discord-bot/commit/547f3ca7c2a9f3a5133d1fb5e6d2846356129f6c))
* Extract logic with registering event listeners to a separate file ([9184722](https://github.com/mariusbegby/cadence-discord-bot/commit/9184722030bef24e2270ed089fad045bd7a29dfe))
* Extracted logic from index.js to separate files ([2818778](https://github.com/mariusbegby/cadence-discord-bot/commit/2818778663b3c921914619bd3ff97d770e8c6fb1))
* Moved source into /src folder ([ee274fe](https://github.com/mariusbegby/cadence-discord-bot/commit/ee274feb2bda3ab51beff8d6ce411b6c94fd0804))
* New event handling ([12d9234](https://github.com/mariusbegby/cadence-discord-bot/commit/12d9234271ae142d6ed5ced850677914bba7eca6))
* Setup caching in discord.js client for optimization ([623502c](https://github.com/mariusbegby/cadence-discord-bot/commit/623502c48afe0929e16240007e17463fd748bef1))
* Updated command folder structure for new command handler ([421734b](https://github.com/mariusbegby/cadence-discord-bot/commit/421734be2691a49417336557c7817b7dace233df))
* Updated configuration and moved config location ([dd4b56a](https://github.com/mariusbegby/cadence-discord-bot/commit/dd4b56ae675ca26575ff2ebdb68daa0ac4c17f12))


### Minor changes and bug fixes

* Add support for sending client ready, reconnect and disconnect events to system channel ([6fdd943](https://github.com/mariusbegby/cadence-discord-bot/commit/6fdd943e56445a3728260d49c7a57d91da958603))
* Add total member count in /guilds system command ([d895128](https://github.com/mariusbegby/cadence-discord-bot/commit/d8951284cb49286717738f334d7e8117aea8e624))
* Added another botlist site to auto post stats ([17d4295](https://github.com/mariusbegby/cadence-discord-bot/commit/17d4295862de45abc5c8b11d2c217a8d3f2ed709))
* Changed command logic to be in property execute instead of run ([2d0df79](https://github.com/mariusbegby/cadence-discord-bot/commit/2d0df79dac3844b7081365f621576a93f60b41ac))
* Changed name of deploy slash commands ([13f0b02](https://github.com/mariusbegby/cadence-discord-bot/commit/13f0b02472e09458da2f51f97ee65397e5ad4e13))
* Enforce indention in switch statements ([a4d5ab5](https://github.com/mariusbegby/cadence-discord-bot/commit/a4d5ab5ae4cecc18b740e98622e6dfcb706ce15c))
* Formatting ([1d520e9](https://github.com/mariusbegby/cadence-discord-bot/commit/1d520e95bdef27f0eb87e47a7e829e856fda72c6))
* Formatting to new eslint rules ([bcc4f8f](https://github.com/mariusbegby/cadence-discord-bot/commit/bcc4f8ffac9fe3a8db3750c72d258385c10d6ee2))
* Update presence status to use discord.js type ([6d132c7](https://github.com/mariusbegby/cadence-discord-bot/commit/6d132c774974ec7501e8dea4505c871bf07940b6))
* Update require of path node module to have node: prefix to bypass require cache ([3da8275](https://github.com/mariusbegby/cadence-discord-bot/commit/3da82753598d194ac09cd0b397fa0c4e36b5a767))
* Updated formatting rules ([22f4a22](https://github.com/mariusbegby/cadence-discord-bot/commit/22f4a22c0e00d87137ecc52a1da7175a4a045b1f))

## [1.7.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.7.1...v1.7.2) (2023-07-16)


### Minor changes and bug fixes

* fixed formatted string not being formatted correctly ([1828995](https://github.com/mariusbegby/cadence-discord-bot/commit/1828995a5d610803ab9507e5f698b95e26c72ee2))

## [1.7.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.7.0...v1.7.1) (2023-07-16)


### Minor changes and bug fixes

* add more debug logging ([52ef374](https://github.com/mariusbegby/cadence-discord-bot/commit/52ef374be3c0aa53b662835d9b20e3562b9ee193))
* add support for configurable icons for different sources ([9010060](https://github.com/mariusbegby/cadence-discord-bot/commit/9010060a1561c3f02f533a9b236cb5b8a3253b2e))
* make text where command is referenced bold ([de84385](https://github.com/mariusbegby/cadence-discord-bot/commit/de84385de1eac7b26a4050dde3b1a59acb4424fd))
* now showing icon for source in /nowplaying ([a554551](https://github.com/mariusbegby/cadence-discord-bot/commit/a554551022980bcf58f422d937e693c574edfc83))

## [1.7.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.6.0...v1.7.0) (2023-07-16)


### Features

* Added /seek command ([2a35c18](https://github.com/mariusbegby/cadence-discord-bot/commit/2a35c1864fe06bffac423fa7faffb4de7d89fb49))


### Minor changes and bug fixes

* Fixed showing top x guild count on /guilds system command ([c11fd9c](https://github.com/mariusbegby/cadence-discord-bot/commit/c11fd9c542729c11d29e491efc50e9048a2de868))
* Make commands bold when referenced in replies. ([ae134a7](https://github.com/mariusbegby/cadence-discord-bot/commit/ae134a78ff7486d059c5d8232d804475e4c1a21c))
* Update duration format in places to have bold text ([8ecad8a](https://github.com/mariusbegby/cadence-discord-bot/commit/8ecad8a02e3ca765bed74db0eb0b351a06813730))
* Updated /help with seek command ([2f1974d](https://github.com/mariusbegby/cadence-discord-bot/commit/2f1974d2ba7f12f5ab3fb67f99066d3fb81221d9))

## [1.6.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.5.4...v1.6.0) (2023-07-16)


### Features

* Added /loop command with support for track, queue or autoplay looping ([34d50a9](https://github.com/mariusbegby/cadence-discord-bot/commit/34d50a92358c2e25dc4b9d6d1f254a66aa6073ea))


### Minor changes and bug fixes

* /nowplaying and /queue now indicate looping mode if enabled ([3b147bd](https://github.com/mariusbegby/cadence-discord-bot/commit/3b147bd0b05fd714a5477fe6c884dec2980415a0))
* /nowplaying showing 'unavailable' views when track.views is set properly ([c59fce1](https://github.com/mariusbegby/cadence-discord-bot/commit/c59fce19c74bcb0f069807e02e2a1612e9241bad))
* Add configurable icon for autoplay action ([21e9587](https://github.com/mariusbegby/cadence-discord-bot/commit/21e95878f0881a7dbad72f0271f55d7ae92754db))
* Add more configurable options for loop and autoplay icons ([783f6ad](https://github.com/mariusbegby/cadence-discord-bot/commit/783f6ade356011c7563091305e278a5112db49e9))
* added /loop command in /help message ([18504f4](https://github.com/mariusbegby/cadence-discord-bot/commit/18504f46d77bb2a49f07c0c3d3c9cb2804163f04))
* Added configurable icon for loop action ([8450025](https://github.com/mariusbegby/cadence-discord-bot/commit/845002595f1529f51f2479e9114363bd0b384a6c))
* added configurable options for muted icon ([457dfa1](https://github.com/mariusbegby/cadence-discord-bot/commit/457dfa1ad77f2f65049f779b10d778679d52e2c4))
* Added period after sentence in message for toggling filters. ([798b65b](https://github.com/mariusbegby/cadence-discord-bot/commit/798b65b7810864488319c297af8978a9317bbe39))
* fixed /guilds command slicing array before sorting ([7e1054d](https://github.com/mariusbegby/cadence-discord-bot/commit/7e1054dbdad90e97ab058ade518146298296f6ab))
* fixed typo in /loop command description ([74b9fa0](https://github.com/mariusbegby/cadence-discord-bot/commit/74b9fa0e4361b486120517431922973b1b25f812))
* Improved user messages for muted audio in /volume ([d5eb032](https://github.com/mariusbegby/cadence-discord-bot/commit/d5eb032543f8b70a99e9ec8fcdbfdfe072d375fb))
* Indicate looping mode in skipping messages if enabled ([434bc67](https://github.com/mariusbegby/cadence-discord-bot/commit/434bc6730f4cfc0a88e678dcd6d283b58e10457e))
* remove period after url when skipping during /nowplaying ([8a15400](https://github.com/mariusbegby/cadence-discord-bot/commit/8a15400bbc49064367d7abe47cdbc0b01f45f57f))
* Set quality and highWaterMark in ytdlOptions ([7bc50d6](https://github.com/mariusbegby/cadence-discord-bot/commit/7bc50d6a8422f74b1329aad3e4152b6acd948b7a))
* Update text in help command ([d873ada](https://github.com/mariusbegby/cadence-discord-bot/commit/d873adacba8a54489a49419c8ae5418d0938f4c5))

## [1.5.4](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.5.3...v1.5.4) (2023-07-15)


### Minor changes and bug fixes

* Add cookie to ytdlOptions ([5f081c0](https://github.com/mariusbegby/cadence-discord-bot/commit/5f081c087d5ec7c67286d1ecc2d18897e40b99bb))
* Handle another player error from YouTube. ([de3657d](https://github.com/mariusbegby/cadence-discord-bot/commit/de3657d4febbf1319d6ee986ac5113740089b2d2))

## [1.5.3](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.5.2...v1.5.3) (2023-07-15)


### Minor changes and bug fixes

* Remove period after link to source in user message ([d31f4ed](https://github.com/mariusbegby/cadence-discord-bot/commit/d31f4ed95847942df86894ed4e6d51d78d73a207))
* solve error if track.metadata.bridge is not set ([a426135](https://github.com/mariusbegby/cadence-discord-bot/commit/a426135170bf045417ad78bc5335974e2ea8b6c2))

## [1.5.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.5.1...v1.5.2) (2023-07-15)


### Minor changes and bug fixes

* Fixed retrieving play count for some tracks that does not have track.views set ([ea4df17](https://github.com/mariusbegby/cadence-discord-bot/commit/ea4df17195f2dc810843b3bd73f3e1c9e8653524))

## [1.5.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.5.0...v1.5.1) (2023-07-15)


### Minor changes and bug fixes

* Show user nickname in interaction reply if set instead of username ([923e7a6](https://github.com/mariusbegby/cadence-discord-bot/commit/923e7a6845f4c5db51bac7f61d0e0ee8328a9540))

## [1.5.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.4.2...v1.5.0) (2023-07-15)


### Features

* Added configurable options for icons for use in embeds ([6a44a37](https://github.com/mariusbegby/cadence-discord-bot/commit/6a44a37c3220f6151b8409b9df6fe5f83fb42539))
* More error handling in /play command, and overhauled user messages. ([c4f14ef](https://github.com/mariusbegby/cadence-discord-bot/commit/c4f14ef6ba6b2bfdf76adc7b9e2ac602ad35716d))


### Minor changes and bug fixes

* Add await in interaction reply when toggling filters ([3b496ad](https://github.com/mariusbegby/cadence-discord-bot/commit/3b496ad4a8f002024829efd3d3ce3ef368b35d52))
* Add warning embed icon to /nowplaying that was missing ([d720eec](https://github.com/mariusbegby/cadence-discord-bot/commit/d720eeccfc723ba83538b739d66e8e91bf8984c6))
* Corrected embed message color on info message in /nowplaying ([85e1e01](https://github.com/mariusbegby/cadence-discord-bot/commit/85e1e01b68496d3019ab389fa7ee45bf218b2dae))
* Fixed invalid command option name (must be all lowercase) ([bf69d94](https://github.com/mariusbegby/cadence-discord-bot/commit/bf69d943540adc424288a247b8a72ecae1dce881))
* Remove unnecessary checkmark icon, added more options. ([8f859bb](https://github.com/mariusbegby/cadence-discord-bot/commit/8f859bb551ab4642bd14297d758e71ccc0c0e5b7))
* Removed icon for leaving. ([0aa810a](https://github.com/mariusbegby/cadence-discord-bot/commit/0aa810a1d4936da7254c30d101581a37d500ad85))
* Update description of /skip command ([4560639](https://github.com/mariusbegby/cadence-discord-bot/commit/45606399703703ed83744381ef6172b90c590690))
* Update layout and styling for /help command ([923697c](https://github.com/mariusbegby/cadence-discord-bot/commit/923697cce68f9bdc610744768c1213c546cafb00))
* Update leaving channel message in /leave ([e64ba0a](https://github.com/mariusbegby/cadence-discord-bot/commit/e64ba0ab3767679006833ec2cc5f5483ae0bb45f))
* Updated user message in status commands ([15f1a87](https://github.com/mariusbegby/cadence-discord-bot/commit/15f1a876e816b438b00defc2cf0113cf32a523ff))
* Updated user messages for /filter command ([430e66a](https://github.com/mariusbegby/cadence-discord-bot/commit/430e66a1a3fe5bb44feb5487bf4699b60c9ec062))
* Updated user messages for /leave command ([5b214ba](https://github.com/mariusbegby/cadence-discord-bot/commit/5b214bacb42ffdcd7972dc048f1b5f5dcc90ddb2))
* Updated user messages for /nowplaying command ([79b4f07](https://github.com/mariusbegby/cadence-discord-bot/commit/79b4f075059472b1ec2ff5a5f8d86aa97e89186f))
* Updated user messages for /pause command ([f4aa182](https://github.com/mariusbegby/cadence-discord-bot/commit/f4aa182fc2718eb68c9a12bce405252e765a2127))
* Updated user messages for /queue command ([ee11b71](https://github.com/mariusbegby/cadence-discord-bot/commit/ee11b712a03be55867f738695f02a061c9ce7863))
* Updated user messages for /remove ([0fc9815](https://github.com/mariusbegby/cadence-discord-bot/commit/0fc9815af150a922eb4379ae23ec95e442ee44c6))
* Updated user messages for /skip command ([960d553](https://github.com/mariusbegby/cadence-discord-bot/commit/960d55359546ef593bad9f2a0b7384c757346410))
* Updated user messages for /volume command ([5054da9](https://github.com/mariusbegby/cadence-discord-bot/commit/5054da995a428740bfda211ef836315c410c86cc))
* Updated user messages for unexpected errors ([f36b4d9](https://github.com/mariusbegby/cadence-discord-bot/commit/f36b4d966822e0618572316223c339c25af2636d))

## [1.4.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.4.1...v1.4.2) (2023-07-14)


### Minor changes and bug fixes

* Added more configurable options for user replies ([65a94ce](https://github.com/mariusbegby/cadence-discord-bot/commit/65a94ceb6cacce0a98ec3f320083f539062950b4))

## [1.4.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.4.0...v1.4.1) (2023-07-13)


### Minor changes and bug fixes

* Add buffering to pino async logging ([67402a8](https://github.com/mariusbegby/cadence-discord-bot/commit/67402a8911642aed7015f4496440e48742f17425))
* Added variables for node process args and YouTube cookie to .env file ([2df30c5](https://github.com/mariusbegby/cadence-discord-bot/commit/2df30c5d5fa1bbb1e3b52f663dd565eaa3576ab7))

## [1.4.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.3.0...v1.4.0) (2023-07-13)


### Features

* Add support for trace level logging in logging service ([78dcc1b](https://github.com/mariusbegby/cadence-discord-bot/commit/78dcc1b2e9cc82b397d60545f1692d237a6adaad))
* Added .env file, and moved some properties from config.json to .env file ([cc3fd95](https://github.com/mariusbegby/cadence-discord-bot/commit/cc3fd9569c8602b6f9c68b6e9532c2e052097f80))
* Remove pino-pretty as dependency, logger will by default write json to console. ([02d9180](https://github.com/mariusbegby/cadence-discord-bot/commit/02d9180a8492f18d42cd8a803d94c9b38204a744))
* Show channel name and bitrate in queue/nowplaying ([32bd63b](https://github.com/mariusbegby/cadence-discord-bot/commit/32bd63b4901719302830edfbaae84865ce523c4c))
* Updated /status system command with more details ([c909afb](https://github.com/mariusbegby/cadence-discord-bot/commit/c909afb9c023fcebeb8ad163f1716059ea3b1a36))


### Minor changes and bug fixes

* add .gitattributes to for crlf line endings ([9feaca5](https://github.com/mariusbegby/cadence-discord-bot/commit/9feaca5b51591e5ad6062a1004e2fa8ec45e062c))
* added .editorconfig ([ce3e2d6](https://github.com/mariusbegby/cadence-discord-bot/commit/ce3e2d63b523537466dc94567c2f828b4e39113b))
* Added eslint and prettier-eslint for formatting and linting ([d0f1c41](https://github.com/mariusbegby/cadence-discord-bot/commit/d0f1c4103ac2a4bf44c5298a03a6fe221e6dcc01))
* Added npm scripts to start and deploy with pino-pretty formatting ([3c85841](https://github.com/mariusbegby/cadence-discord-bot/commit/3c85841b878d24fd9b9b18c64b832864dcd797e1))
* Do not allow console logging statements ([2d7abaa](https://github.com/mariusbegby/cadence-discord-bot/commit/2d7abaab6ce94e62306803179ab573fb9b28dd8b))
* Make commands inaccessible in direct messages ([a4e7931](https://github.com/mariusbegby/cadence-discord-bot/commit/a4e7931daed55ed74baab629124e899c1a7d5e0b))
* run 'npm run eslint' in CI workflow ([fe544ff](https://github.com/mariusbegby/cadence-discord-bot/commit/fe544ff35980f63d44aff92b8f9740999cabd750))
* update error message for system commands no permission ([595c902](https://github.com/mariusbegby/cadence-discord-bot/commit/595c902027b57ab11e361779f99db364062fa47b))
* update generated headings for release-please ([d9a86fb](https://github.com/mariusbegby/cadence-discord-bot/commit/d9a86fbab8cc681f11b070b13434331ffcf974c9))
* Updated descriptions for commands and /help command ([19f65e9](https://github.com/mariusbegby/cadence-discord-bot/commit/19f65e951d6ed50ce7f9fa716b39f9389c55f15d))

## [1.3.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.2.0...v1.3.0) (2023-07-12)


### Features

* added /nowplaying command with interactive skip button ([16cc50b](https://github.com/mariusbegby/cadence-discord-bot/commit/16cc50b7eb708ff2940a423afe6a3067bde8b3d5))
* set default player volume to 50%, allow player options to be configured from config ([6826fea](https://github.com/mariusbegby/cadence-discord-bot/commit/6826feaa100e2a825ec6eca32ee73da357f4afe4))
* system commands are no longer restricted to bot owner id, and can be used in list of specified guilds ([cf5151f](https://github.com/mariusbegby/cadence-discord-bot/commit/cf5151fcd7236ca2d86d95684289245c3a4a71cc))


### Bug Fixes

* defer confirmation on filters command ([7534322](https://github.com/mariusbegby/cadence-discord-bot/commit/753432278479da9f27b4210507a8ed0442b771bd))
* Fixed execution time warnings and unexpected error ([da05193](https://github.com/mariusbegby/cadence-discord-bot/commit/da0519319d97ad81d3c0a44ab8fecd904f4ea388))
* formatting/linting ([550ec1a](https://github.com/mariusbegby/cadence-discord-bot/commit/550ec1ac9d1f29c53fa34e99aeee4b9c3f5cb23f))
* reply with "started playing" when adding track to empty queue ([4885398](https://github.com/mariusbegby/cadence-discord-bot/commit/4885398f05c73eac12eb4cab9790d5df2386ccc5))
* update config.json example with player options ([4622f18](https://github.com/mariusbegby/cadence-discord-bot/commit/4622f184a38d842ea33ef859c3f728c4e942b42d))
* update default value for progress bar length ([cac18dd](https://github.com/mariusbegby/cadence-discord-bot/commit/cac18dda441517f16060949b44a4e8ecbb69ace5))
* update progress bar in queue command ([df9b000](https://github.com/mariusbegby/cadence-discord-bot/commit/df9b0005ad369bc889cf0a46b2e958606bf39661))
* updated duration format in messages ([f87d35e](https://github.com/mariusbegby/cadence-discord-bot/commit/f87d35e635c8d26c0b3886ae561915289f968007))

## [1.2.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.1.1...v1.2.0) (2023-07-12)


### Features

* Log events to file based on log level ([6bb602e](https://github.com/mariusbegby/cadence-discord-bot/commit/6bb602ebbb655373c61de96b592a0de40585aa72))


### Bug Fixes

* add pino and pino-pretty as dependencies for logging ([bb07e5d](https://github.com/mariusbegby/cadence-discord-bot/commit/bb07e5defde3a64c87d45dad322706229803a6e6))
* added pino logging library ([4a2b60e](https://github.com/mariusbegby/cadence-discord-bot/commit/4a2b60e3ba63ad7e02e39e20861d294ca8048346))
* changed position of guild member count in log calls ([3c345cf](https://github.com/mariusbegby/cadence-discord-bot/commit/3c345cf14c83402411f61a993954acccbe7756da))
* Extract logger initialization to own file ([53d15b0](https://github.com/mariusbegby/cadence-discord-bot/commit/53d15b05e1ac13622cdda748e337f1bd094b3020))
* implemented new logging service to command deployment ([4a2f47c](https://github.com/mariusbegby/cadence-discord-bot/commit/4a2f47c94967e121333f4e12ba6784dfedbc21f3))
* remove console.log() statement in filters command ([6deec52](https://github.com/mariusbegby/cadence-discord-bot/commit/6deec529f9072e7e62b33c8cb2656fb64cb34df4))
* update .gitignore to not track log files ([cf2aa06](https://github.com/mariusbegby/cadence-discord-bot/commit/cf2aa06f3983337bd1bb598c70aac87ceea3fcc1))
* update config.json example with minimum log level ([c98bcdc](https://github.com/mariusbegby/cadence-discord-bot/commit/c98bcdce4951053f6a152b85650676b2aa302bda))
* Updated logging to pino for index.js ([2fe5fce](https://github.com/mariusbegby/cadence-discord-bot/commit/2fe5fce324c1528c4f44a08e1324e93c9b929997))

## [1.1.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.1.0...v1.1.1) (2023-07-10)


### Bug Fixes

* add page number also on empty queue ([0a7f31a](https://github.com/mariusbegby/cadence-discord-bot/commit/0a7f31a5652fd5b5e6758b939be621de0b01ff70))
* Better handling and formatting of duration ([ebe4f74](https://github.com/mariusbegby/cadence-discord-bot/commit/ebe4f7419a0d218d4f333ba13b9b71c4f6e39fee))
* format track amount as bold instead of code ([955bda9](https://github.com/mariusbegby/cadence-discord-bot/commit/955bda9d693fa10119deb7026bc0e4e1d25a49c1))
* handle unsupported YouTube live stream source ([b8bd552](https://github.com/mariusbegby/cadence-discord-bot/commit/b8bd552335a20d5cf5cd5cf86d11e7bdbed863bc))
* Removed "Failed" heading from reply ([7894867](https://github.com/mariusbegby/cadence-discord-bot/commit/789486747ba3d9f9f6a6bf2cabe92aa75be64ad5))

## [1.1.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.0.2...v1.1.0) (2023-07-10)


### Features

* Add playlist support to /play command ([88b9566](https://github.com/mariusbegby/cadence-discord-bot/commit/88b95665199c9edfa2edf0ebd551070742be363a))


### Bug Fixes

* Explicitly set legacy ffmpeg to false, log loaded dependencies on startup ([325feed](https://github.com/mariusbegby/cadence-discord-bot/commit/325feed8fb0e418e1139fb9248986e1d669b9b59))
* formatting ([f9c4c24](https://github.com/mariusbegby/cadence-discord-bot/commit/f9c4c24d6c91b30782dc57ff6761a4608f298cb1))
* party solves playback immediately cuts off on longer duration yt videoes ([5716c67](https://github.com/mariusbegby/cadence-discord-bot/commit/5716c67523c2c2df2433274865e28d2b606e4439))
* remove debug logging ([5a47630](https://github.com/mariusbegby/cadence-discord-bot/commit/5a476302a8e4b48caf0faa2a21467d375445d58d))
* Set max queue and history size ([981c8ce](https://github.com/mariusbegby/cadence-discord-bot/commit/981c8ce7c1fba3fbe88a25f71f165f3088325266))
* update user reply with info about /play on empty queue ([37f16a5](https://github.com/mariusbegby/cadence-discord-bot/commit/37f16a51fd5595e3f85a533115cd3929d97f5ec0))
* Use yt-stream instead of play-dl, solves playback of longer duration yt videoes ([31a9d8f](https://github.com/mariusbegby/cadence-discord-bot/commit/31a9d8f034a8091add33cb2f0554beecb66bb789))

## [1.0.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.0.1...v1.0.2) (2023-07-09)


### Bug Fixes

* Remove release-please command in workflow ([716eb8c](https://github.com/mariusbegby/cadence-discord-bot/commit/716eb8c96b31bb8845173dd93b2ab7510cd14139))

## [1.0.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v1.0.0...v1.0.1) (2023-07-09)


### Bug Fixes

* Cut /guilds command message reply length to 4000 characters ([8c7d4a0](https://github.com/mariusbegby/cadence-discord-bot/commit/8c7d4a07cacc8556f197f7e56eeef354736765ac))
* trying to read title on track for initialized but empty queue ([77c91a3](https://github.com/mariusbegby/cadence-discord-bot/commit/77c91a350f4c5b1336c7917a24ac9e9b3fc4ad66))
* Update command in workflow ([1eed36a](https://github.com/mariusbegby/cadence-discord-bot/commit/1eed36a295e3c671c1c52ce9c3553bbd6a2f95ae))
* Update README with credits to discord.js and discord-player ([81a7415](https://github.com/mariusbegby/cadence-discord-bot/commit/81a741541979f899745fbb38bd446305a7c61f33))
* Update release-please command ([ba3acd3](https://github.com/mariusbegby/cadence-discord-bot/commit/ba3acd38ad69bc18eb77177d87c08f38511eef4e))
* Updated link to MIT license in README ([4f8fc1e](https://github.com/mariusbegby/cadence-discord-bot/commit/4f8fc1e53cbdfbe14a4b1b7254abbbda776b03b1))

## 1.0.0 (2023-07-09)


### Bug Fixes

* formatting ([ee04a7c](https://github.com/mariusbegby/cadence-discord-bot/commit/ee04a7ca95eb94378d3087c31768f38c33f9aef2))
* Removed logging input values to console ([e1dccc7](https://github.com/mariusbegby/cadence-discord-bot/commit/e1dccc7c05b8c6ed2e492cd90b7802ec9c6c0614))
* Try second result when stream can not be extracted ([695243f](https://github.com/mariusbegby/cadence-discord-bot/commit/695243f7c423c713c426534ca7a24a22308fa6d3))

## Changelog

All notable changes to this project will be documented in this file.
