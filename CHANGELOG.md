# Changelog

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
