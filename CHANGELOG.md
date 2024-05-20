# Changelog

## 1.0.0 (2024-05-20)


### ⚠ BREAKING CHANGES

* New folder structure and organize files
* remove /guilds system command
* Implement Prisma for persistent storage
* Make pino-pretty and pino-loki optional dependencies, removed old pretty scripts and created new dev script
* Localization support, breaking change.

### deps

* Make pino-pretty and pino-loki optional dependencies, removed old pretty scripts and created new dev script ([056e052](https://github.com/mariusbegby/cadence-discord-bot/commit/056e052ba4b50c1f20cbb2b7b803a80b9142129c))


### Features

* add /join command ([9901374](https://github.com/mariusbegby/cadence-discord-bot/commit/990137468e7ce1302b22ac5f5b935a551812814d))
* add biquad filters support ([0b94a9b](https://github.com/mariusbegby/cadence-discord-bot/commit/0b94a9b5ec3fdb3108cbd0bd960c9d97ea866c76))
* Add new /history command to show previously played tracks ([bf461c2](https://github.com/mariusbegby/cadence-discord-bot/commit/bf461c2f26ebbc24f6e3dc1d33b0657bfec3f065))
* Add new /move command to move a track to specified position ([100325b](https://github.com/mariusbegby/cadence-discord-bot/commit/100325b7d819243cc8785edbad69f8f02c9a55e9))
* Add new config option to enable/disable button labels ([47d3c36](https://github.com/mariusbegby/cadence-discord-bot/commit/47d3c36cc727531eaa4436d069c28d1426f88602))
* Add norwegian localization file (no) ([a0dd74e](https://github.com/mariusbegby/cadence-discord-bot/commit/a0dd74e8d86a54d0a515cdc56b2fe4d80c61f3c7))
* Added /back command to go back in history ([e11df37](https://github.com/mariusbegby/cadence-discord-bot/commit/e11df3706fa02dfdba73c8b3856071b7cca1b785))
* added equalizer filters to /filters command ([9584fe8](https://github.com/mariusbegby/cadence-discord-bot/commit/9584fe8ebe7b1cb97200d7a13e8763b1f4babba2))
* Implement Prisma for persistent storage ([ad29a63](https://github.com/mariusbegby/cadence-discord-bot/commit/ad29a6388d491d0d1fcde0d976dfc6d94bada154))
* Localization support, breaking change. ([28592b1](https://github.com/mariusbegby/cadence-discord-bot/commit/28592b13d836f52f501ab9d0b6168cdf7174804b))
* **music:** implement Song Announce Feature ([99c3cd0](https://github.com/mariusbegby/cadence-discord-bot/commit/99c3cd006f075957a22eaa6f408706bab4592d66))
* Optionally add pino-pretty and pino-loki transports if installed ([eb9eceb](https://github.com/mariusbegby/cadence-discord-bot/commit/eb9eceb5398564bfcf4c2b39db8edba1a5659b59))
* **settings:** created settings command. ([1c98fd6](https://github.com/mariusbegby/cadence-discord-bot/commit/1c98fd6c41326fe3467f5da204409e0c38793dce))
* show queue total duration in footer, update uptime duration format ([b139516](https://github.com/mariusbegby/cadence-discord-bot/commit/b1395164ea0d4117ecf6ae5f09a4eeecb25c3d86))
* Updated /remove command with options for range, queue, user and duplicates! ([27d4c6c](https://github.com/mariusbegby/cadence-discord-bot/commit/27d4c6c0220e84f4005c077a768040528ebbdffb))


### Minor changes and bug fixes

* Add check on startup to see if ffmpeg is available ([0b72e92](https://github.com/mariusbegby/cadence-discord-bot/commit/0b72e926934e5dc942a4af8b24458a2d299c7e03))
* add config option for open source url and icon ([4f29399](https://github.com/mariusbegby/cadence-discord-bot/commit/4f29399a8eb2204b72e89e5bffdac730aca5fc13))
* add missing translator for /systemstatus title ([e216791](https://github.com/mariusbegby/cadence-discord-bot/commit/e21679152bc060e45e2a7089624806b714aa95e4))
* Add new action buttons also to /history command ([fac39e4](https://github.com/mariusbegby/cadence-discord-bot/commit/fac39e45cbd752db7148ea4be590a5cd05a88fb9))
* Add Open source button to /status ([fa84e29](https://github.com/mariusbegby/cadence-discord-bot/commit/fa84e2925e048819e56b37f1257699653daf472b))
* add requested by string before mention ([e3efa48](https://github.com/mariusbegby/cadence-discord-bot/commit/e3efa48ade580db411246b85afcd57bf7a516dff))
* Add track position to footer when track(s) added to queue in /play ([d496945](https://github.com/mariusbegby/cadence-discord-bot/commit/d496945949e58d7430c61177a3d38f0e178195e2))
* add translation of unexpected error ([b953179](https://github.com/mariusbegby/cadence-discord-bot/commit/b953179e965c64c1f3359d936b83a2d34d5baff3))
* add user in footer on validation warnings ([eb26f5a](https://github.com/mariusbegby/cadence-discord-bot/commit/eb26f5ab93019b36a9a2dab85a819c7a28ae9c83))
* Added setup for unit tests ([f04d5ab](https://github.com/mariusbegby/cadence-discord-bot/commit/f04d5ab79b360ba1f66cb2913ef1d24f08896ca2))
* Adds Missing Prisma Dockerfile Setup ([15e67f4](https://github.com/mariusbegby/cadence-discord-bot/commit/15e67f4c442d0811522b927fbf1db4147eeb5b88))
* also translate command params for /help ([e2040ba](https://github.com/mariusbegby/cadence-discord-bot/commit/e2040baa8d0943d0295e62a9c29dceb67298cbdd))
* await client.login, thanks to @Kriblin ([64a709b](https://github.com/mariusbegby/cadence-discord-bot/commit/64a709b03226b2f4d2b0489bdd7d3ba59f59e2fc))
* Better handling of unavailable source  after added to queue ([69d23d1](https://github.com/mariusbegby/cadence-discord-bot/commit/69d23d1b77fc9066abd2cc532e5a54c36c0f064c))
* change addNumberOption to addIntegerOption ([6ca7ce3](https://github.com/mariusbegby/cadence-discord-bot/commit/6ca7ce3e4be92e9240208c76c6bdf1418193ccef))
* change Dockerfile base image to fix mediaplex not working ([3360782](https://github.com/mariusbegby/cadence-discord-bot/commit/3360782d2ed8bf5cd05933f25f2de1c2a9cfaac5))
* change map to switch statement ([7018b69](https://github.com/mariusbegby/cadence-discord-bot/commit/7018b690bbc591b1b1eb689dfb4b36ab199165f3))
* check for duplicate /track/id in spotify url and trim ([b3b73ad](https://github.com/mariusbegby/cadence-discord-bot/commit/b3b73ad49f920dfd81598ea15c20b6ab87fa5ea4))
* correct usage for deploying commands ([7fb2c5e](https://github.com/mariusbegby/cadence-discord-bot/commit/7fb2c5ebeee3bf4b33c42d6efcc91e4161971bd2))
* Dockerfile was missing locales copy ([556cefa](https://github.com/mariusbegby/cadence-discord-bot/commit/556cefa71b6087bc68e11f4d61e80a5538d3f57a))
* dont log error object before handling ([c35a3ad](https://github.com/mariusbegby/cadence-discord-bot/commit/c35a3ad5aac96309f9f2afacd22186d2613d1e1a))
* eslint formatting errors ([fec394f](https://github.com/mariusbegby/cadence-discord-bot/commit/fec394ffc0886c44d557c61f1dc3dd0aa2e39d84))
* Fix deconstruction error if no lastQuery result in autocomplete ([851e932](https://github.com/mariusbegby/cadence-discord-bot/commit/851e9321f561f1b50f52ad55c9497fea60be7300))
* fix duration validation not using padded and formatted duration ([c4f9403](https://github.com/mariusbegby/cadence-discord-bot/commit/c4f9403ecffdefff892085bedd32c4d8da4c02d3))
* Fix not being able to select multiple ffmpeg filters ([83462ab](https://github.com/mariusbegby/cadence-discord-bot/commit/83462ab6265937d0c517436cbf2a9bc60d1c1aaa))
* Fix playlist added position being incorrect in some cases ([664fa50](https://github.com/mariusbegby/cadence-discord-bot/commit/664fa50dfe65d85a86808e6aa712d821025bc8c1))
* Fix posting bot stats status codes. ([6beb29d](https://github.com/mariusbegby/cadence-discord-bot/commit/6beb29d8b75bcf3efd7e4237dc5b604e4d65eb00))
* Fix showing repeat mode in skipped track ([88511f8](https://github.com/mariusbegby/cadence-discord-bot/commit/88511f87c1fffb7270a70fe4782789e1288c5f22))
* fix string comparison to lowercase for filter provider ([e89075e](https://github.com/mariusbegby/cadence-discord-bot/commit/e89075ef440fb56c4a42ffee6f90cefa7d5b5a56))
* increased default history size ([85e27af](https://github.com/mariusbegby/cadence-discord-bot/commit/85e27afc5c53d70f78388337bdb60e965a8b633a))
* **lang:** Fixed translation string bug ([1728503](https://github.com/mariusbegby/cadence-discord-bot/commit/1728503bb6c35ac0363214d3167216bfccc586d4))
* log error object in error handler ([79e1b5f](https://github.com/mariusbegby/cadence-discord-bot/commit/79e1b5f3ada7820746f37787ef311c1e61b97127))
* New folder structure and organize files ([39ff5ec](https://github.com/mariusbegby/cadence-discord-bot/commit/39ff5ecb5d2d28b06e161054f0c793531ce06506))
* override willAutoPlay event to set bot user as requestedBy ([aa36925](https://github.com/mariusbegby/cadence-discord-bot/commit/aa3692592dc876c10b0372df399c1fb0925359ec))
* **playerSkip:** only log on error ([f5a39f4](https://github.com/mariusbegby/cadence-discord-bot/commit/f5a39f430eb99c8702ad3cd502a385ef545bf22c))
* possibly solve duplicate event 'interactionCreate' listener bug ([2d08a9a](https://github.com/mariusbegby/cadence-discord-bot/commit/2d08a9aa858fcd7f82c02fe0f0dc9b6e4524421c))
* refactor filters disable button ([9458ed6](https://github.com/mariusbegby/cadence-discord-bot/commit/9458ed60a1c4eaf654bc32e9eb26bb719c0cf60b))
* refactor guilds command ([c689452](https://github.com/mariusbegby/cadence-discord-bot/commit/c68945272e6b26654d1baa173d9087cba994b0ff))
* refactor nowplaying command ([f061000](https://github.com/mariusbegby/cadence-discord-bot/commit/f061000f933d89add34c8123ec1d8395e6da14fb))
* refactor postBotStats.ts ([f06f2ae](https://github.com/mariusbegby/cadence-discord-bot/commit/f06f2ae352c72844317b519a46650807bddc3eb2))
* refactor remove command ([230ba5f](https://github.com/mariusbegby/cadence-discord-bot/commit/230ba5fd9388ca67fa25720671706853e0a72aad))
* refactor volume command ([fca1a90](https://github.com/mariusbegby/cadence-discord-bot/commit/fca1a9048986d56136994824b949545e68933abf))
* refactored autocomplete interactions ([af78759](https://github.com/mariusbegby/cadence-discord-bot/commit/af7875981364fc01cc96d8d2c3624f3ac70dd2f9))
* refactored filters select menu component ([a9ce285](https://github.com/mariusbegby/cadence-discord-bot/commit/a9ce2856502aeb6b27dfeefe3c5e43b5c2e0454b))
* refactored guilds command ([56b25f9](https://github.com/mariusbegby/cadence-discord-bot/commit/56b25f9b97addc13ffb233ef45642dca6c990ae3))
* refactored lyrics command ([c1de63d](https://github.com/mariusbegby/cadence-discord-bot/commit/c1de63da2735ada18dde25df9bfbe3c3a5212124))
* refactored nowplaying skip button component + more common methods ([78e8f12](https://github.com/mariusbegby/cadence-discord-bot/commit/78e8f12c99f9f3650d013bb92c7a20177f59b636))
* refactored pause command, added common method getDisplayTrackDurationAndUrl() ([0850d9b](https://github.com/mariusbegby/cadence-discord-bot/commit/0850d9b26d459dd8d9b6c81ec58cb47060b304f2))
* refactored play command and added common method for getting thumbnail url ([bf30d56](https://github.com/mariusbegby/cadence-discord-bot/commit/bf30d565d7ad311a7daea5900fbe3d6bf1d7c008))
* refactored queue command, added more common methods ([1ebb7c3](https://github.com/mariusbegby/cadence-discord-bot/commit/1ebb7c3b8951f2aca3f943e601b2fff127083fff))
* refactored seek command ([c871a75](https://github.com/mariusbegby/cadence-discord-bot/commit/c871a758222cc99ce7e50eae916a9d79f4c5bd33))
* refactored shards command ([9259bc2](https://github.com/mariusbegby/cadence-discord-bot/commit/9259bc2ffa8f9e4c72fd8baac5c203ec07f6f8b4))
* refactored skip command ([90346e7](https://github.com/mariusbegby/cadence-discord-bot/commit/90346e74698864b999bfebd29df3d10fbfab646b))
* refactored status commands ([20bc4aa](https://github.com/mariusbegby/cadence-discord-bot/commit/20bc4aa88f624719fe296092378e23fba94b1193))
* remove /guilds system command ([ccc4f19](https://github.com/mariusbegby/cadence-discord-bot/commit/ccc4f19cc0911f663b503b1dbef48842b902db29))
* remove async from class methods for getting author ([fe14fc3](https://github.com/mariusbegby/cadence-discord-bot/commit/fe14fc308fe1d85f04f528a649034043dfda21c8))
* remove async from getUptimeFormatted ([4041404](https://github.com/mariusbegby/cadence-discord-bot/commit/4041404f01e58fd88009d73950691f2a5cbd3e1f))
* remove caching from npm ci in Dockerfile ([5e591c7](https://github.com/mariusbegby/cadence-discord-bot/commit/5e591c739f7679efcf29df9e0ac37e12083bf0cd))
* remove incorrect ** from string ([cf45bde](https://github.com/mariusbegby/cadence-discord-bot/commit/cf45bde80b42e69e7a8e797905502b261e86e269))
* remove unnecessary async/await ([7dc7b4f](https://github.com/mariusbegby/cadence-discord-bot/commit/7dc7b4ff7e80df4c1979fb1e95ad511ce3bea831))
* remove unnecessary queue.clear() call in /stop ([f9fa501](https://github.com/mariusbegby/cadence-discord-bot/commit/f9fa501125bc96ade97fc76dda65729712be5044))
* Replace support server and add bot info with link buttons in /help ([612e3a0](https://github.com/mariusbegby/cadence-discord-bot/commit/612e3a00a65fc8c3aa36b5c0c0a012349d44ee09))
* set skipFFmpeg to false to solve bug ([ea8f97d](https://github.com/mariusbegby/cadence-discord-bot/commit/ea8f97dc2b405b5ed0ace99b6016fd1937790117))
* sets noImplicity false for `any` types ([d2bb9d3](https://github.com/mariusbegby/cadence-discord-bot/commit/d2bb9d364461bb2e65018258bbee3d067ee2fe15))
* small change to getEmbedQueueAuthor for bitrate calculation ([f3de02a](https://github.com/mariusbegby/cadence-discord-bot/commit/f3de02a6a8f4fc8cfe3e80a8b49117d076b5a9f5))
* Small changes to new action buttons ([981be70](https://github.com/mariusbegby/cadence-discord-bot/commit/981be707f04af0fd21481075683c63a3d0d42a2f))
* solve bug using getNumber after changing to addIntegerOption ([4b630e2](https://github.com/mariusbegby/cadence-discord-bot/commit/4b630e2512282a481b50678714f7dd580d3f4be5))
* transform search query in /play autocomplete ([5601767](https://github.com/mariusbegby/cadence-discord-bot/commit/56017678062a343f94f18ebb1ed770c6d9efe49a))
* update default config value for button labels to true ([ee54513](https://github.com/mariusbegby/cadence-discord-bot/commit/ee5451320e99f92edeb89dbcf21641304f0ca296))
* update default leave settings ([ee0f769](https://github.com/mariusbegby/cadence-discord-bot/commit/ee0f769ba5fe8ffe02aa66387e33dfdd5a484cc4))
* update deps ([dd06263](https://github.com/mariusbegby/cadence-discord-bot/commit/dd06263699e6fc75d5c987ce1c59ce3f9bd03e0c))
* update deps ([e029314](https://github.com/mariusbegby/cadence-discord-bot/commit/e029314ee2e125a90db2756b20e116a7b8fa45f5))
* update deps ([608dfe5](https://github.com/mariusbegby/cadence-discord-bot/commit/608dfe556636bb4afae46093fd3f94f9af377c1f))
* update deps, change opus provider ([814029e](https://github.com/mariusbegby/cadence-discord-bot/commit/814029e6361ed3824aa7854f7857b46ecb065c71))
* update extractor to stable ([d7ef706](https://github.com/mariusbegby/cadence-discord-bot/commit/d7ef706604c3fb23b497075f3637b2c55c99cc92))
* update getDisplayRepeatMode showing wrong icon on success ([ea8cf10](https://github.com/mariusbegby/cadence-discord-bot/commit/ea8cf100f5fb98b57fd19e1bd4ec40712968add5))
* update interactionCreate event handling ([7902a84](https://github.com/mariusbegby/cadence-discord-bot/commit/7902a8427c5516c0586a86f27c2646cad1d81151))
* update mediaplex to latest ([78b5d85](https://github.com/mariusbegby/cadence-discord-bot/commit/78b5d85c9e045eb26f47063f33d04dfef96e0f24))
* Update npm scripts ([9c4c995](https://github.com/mariusbegby/cadence-discord-bot/commit/9c4c99558ae4b26febe84e7a56fc496591cb5c38))
* update youtube-ext to fix YouTube HTTP response bug ([48bffc8](https://github.com/mariusbegby/cadence-discord-bot/commit/48bffc87b8b6654714b1047d72ea3fdd5586e41e))
* Updates Node.JS 18 engine to latest minor version ([c9743f8](https://github.com/mariusbegby/cadence-discord-bot/commit/c9743f8eb861661c60720523659453af1c48b639))
* use new runValidators format on components ([74c1447](https://github.com/mariusbegby/cadence-discord-bot/commit/74c1447e7d27e7a87dcfc9d1893f232550365824))
* use Promise.all when fetching info for status commands ([2d7ffc1](https://github.com/mariusbegby/cadence-discord-bot/commit/2d7ffc1a3ff9f58740dd1c77078feadcce6478d7))


### Miscellaneous

* add jest coverage npm script ([b73dee5](https://github.com/mariusbegby/cadence-discord-bot/commit/b73dee52adaf348cc0106527a7987b25908e0c47))
* adjust getUptimeFormatted method ([5558c0b](https://github.com/mariusbegby/cadence-discord-bot/commit/5558c0bca2ec2241a2899e5e1c00a1a6090c0fce))
* created simple command class method unit test ([aa37704](https://github.com/mariusbegby/cadence-discord-bot/commit/aa37704331e529248b612a803f94feb92505329f))
* **deps-dev:** bump @babel/traverse from 7.22.17 to 7.23.2 ([aea0683](https://github.com/mariusbegby/cadence-discord-bot/commit/aea068377b3a6c338c1c620f00069a05a14c769f))
* **deps-dev:** bump @types/jest from 29.5.4 to 29.5.5 ([c689589](https://github.com/mariusbegby/cadence-discord-bot/commit/c689589b495ebb56c20c58c0f1dd2de4e4671ae1))
* **deps-dev:** bump @types/jest from 29.5.5 to 29.5.6 ([a36cbee](https://github.com/mariusbegby/cadence-discord-bot/commit/a36cbee8b90567670f348c772e5e5d99f1412270))
* **deps-dev:** bump @types/jest from 29.5.6 to 29.5.8 ([f98dbeb](https://github.com/mariusbegby/cadence-discord-bot/commit/f98dbeb05c067b489a3d616860f5945c6261c5e4))
* **deps-dev:** bump @types/jest from 29.5.8 to 29.5.11 ([fd40f25](https://github.com/mariusbegby/cadence-discord-bot/commit/fd40f251327ac769ca7d18353acb882465672f4f))
* **deps-dev:** bump @types/node from 20.10.4 to 20.10.5 ([a834e4b](https://github.com/mariusbegby/cadence-discord-bot/commit/a834e4bfa80d96dd7a9f75f14f6619c760f92576))
* **deps-dev:** bump @types/node from 20.10.5 to 20.10.6 ([10513ba](https://github.com/mariusbegby/cadence-discord-bot/commit/10513baf19a40dfdfdeb4e1d0eae433463a7fceb))
* **deps-dev:** bump @types/node from 20.10.6 to 20.10.7 ([8f37bfe](https://github.com/mariusbegby/cadence-discord-bot/commit/8f37bfe557b5a561462eee1aca5135483bd5906f))
* **deps-dev:** bump @types/node from 20.10.7 to 20.11.2 ([c794128](https://github.com/mariusbegby/cadence-discord-bot/commit/c7941285c564e3ce64c71b55aa113fb341c962ee))
* **deps-dev:** bump @types/node from 20.11.16 to 20.11.17 ([c7d6a30](https://github.com/mariusbegby/cadence-discord-bot/commit/c7d6a3063b5d673e524409d85f08165592b31b8c))
* **deps-dev:** bump @types/node from 20.11.2 to 20.11.10 ([cd90e7f](https://github.com/mariusbegby/cadence-discord-bot/commit/cd90e7fc126b5b5afbf790e934af38427f2943fd))
* **deps-dev:** bump @types/node from 20.11.20 to 20.11.24 ([44bc390](https://github.com/mariusbegby/cadence-discord-bot/commit/44bc390305035ce2568f33bbca4f8e8c0ebf3412))
* **deps-dev:** bump @types/node from 20.11.24 to 20.11.25 ([931ab45](https://github.com/mariusbegby/cadence-discord-bot/commit/931ab456eff6be63150509eedf31d83872bf3dd5))
* **deps-dev:** bump @types/node from 20.5.9 to 20.6.0 ([759171f](https://github.com/mariusbegby/cadence-discord-bot/commit/759171fd6b492198e92900bb92f429617fb51220))
* **deps-dev:** bump @types/node from 20.6.0 to 20.6.2 ([97869a0](https://github.com/mariusbegby/cadence-discord-bot/commit/97869a04fdb21a2afd98dac656ca677d06d26368))
* **deps-dev:** bump @types/node from 20.6.2 to 20.6.5 ([9684c8b](https://github.com/mariusbegby/cadence-discord-bot/commit/9684c8b1f4de1e92f3b7bd29ef286d5b6763c65c))
* **deps-dev:** bump @types/node from 20.6.5 to 20.8.0 ([ef9381d](https://github.com/mariusbegby/cadence-discord-bot/commit/ef9381d7d27572e44095119daecf57b961fca31d))
* **deps-dev:** bump @types/node from 20.8.0 to 20.8.4 ([963af52](https://github.com/mariusbegby/cadence-discord-bot/commit/963af52470b4e25a920d6d5ece6c7dde10ba65c8))
* **deps-dev:** bump @types/node from 20.8.4 to 20.8.7 ([7dd5739](https://github.com/mariusbegby/cadence-discord-bot/commit/7dd57395abf1ed9a4c8cad104143e9cb9f8920ad))
* **deps-dev:** bump @types/node from 20.8.8 to 20.8.10 ([8d35f0b](https://github.com/mariusbegby/cadence-discord-bot/commit/8d35f0b4f9ecc5d53dc7620b3580cf1c8e3074ce))
* **deps-dev:** bump @types/node-os-utils from 1.3.1 to 1.3.2 ([5f2e0d5](https://github.com/mariusbegby/cadence-discord-bot/commit/5f2e0d5f1cb05d85a784c1156a25dd988cc5d5e9))
* **deps-dev:** bump @types/node-os-utils from 1.3.2 to 1.3.3 ([3544c76](https://github.com/mariusbegby/cadence-discord-bot/commit/3544c76c24e0886a249efcfb7f36da086a4cae9e))
* **deps-dev:** bump @types/node-os-utils from 1.3.3 to 1.3.4 ([9bdd4a7](https://github.com/mariusbegby/cadence-discord-bot/commit/9bdd4a7aea645aa99022647324869f23094a9c27))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([3d7311e](https://github.com/mariusbegby/cadence-discord-bot/commit/3d7311edc2dc24107211a1ddd0710de6121415f1))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([21aa0ca](https://github.com/mariusbegby/cadence-discord-bot/commit/21aa0cae9e40075f97bb34b3d936a736095a7026))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([e59cd1f](https://github.com/mariusbegby/cadence-discord-bot/commit/e59cd1fd67e74eea39b91076fc55e13ec7769c69))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([90b13db](https://github.com/mariusbegby/cadence-discord-bot/commit/90b13dbdcf1b45d938b090ef9d9fd2491af8d4d8))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([c209881](https://github.com/mariusbegby/cadence-discord-bot/commit/c2098816de6d743a4bc49fa8bf1521e8f5b7326a))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([2a8a3e5](https://github.com/mariusbegby/cadence-discord-bot/commit/2a8a3e51b65ea4d50fca71b23f6dc0c6a88435c1))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([965fd60](https://github.com/mariusbegby/cadence-discord-bot/commit/965fd60d54a16f6d55ef2e3a4230d901f98e8970))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([9d6931e](https://github.com/mariusbegby/cadence-discord-bot/commit/9d6931ebe913082186f11b136c1ce46c0ba3687b))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([eed285c](https://github.com/mariusbegby/cadence-discord-bot/commit/eed285c98990bfa702d7ed09a332884bdb3e312b))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([dfa4393](https://github.com/mariusbegby/cadence-discord-bot/commit/dfa439368364b6a11169ac87fb54d2b681c68d61))
* **deps-dev:** bump @typescript-eslint/parser from 6.12.0 to 6.13.2 ([027cbb7](https://github.com/mariusbegby/cadence-discord-bot/commit/027cbb7d170478acba17ead4804991c242107576))
* **deps-dev:** bump @typescript-eslint/parser from 6.15.0 to 6.16.0 ([ba94891](https://github.com/mariusbegby/cadence-discord-bot/commit/ba9489175a42321a223353c791894a3e9d0ec2ad))
* **deps-dev:** bump @typescript-eslint/parser from 6.16.0 to 6.18.1 ([3fd12e3](https://github.com/mariusbegby/cadence-discord-bot/commit/3fd12e3ff6b95a734e800ba5fa7f0c477f29cf6a))
* **deps-dev:** bump @typescript-eslint/parser from 6.18.1 to 6.19.0 ([737e82c](https://github.com/mariusbegby/cadence-discord-bot/commit/737e82cc705e46f164922c63938aa98d49553b52))
* **deps-dev:** bump @typescript-eslint/parser from 6.19.0 to 6.19.1 ([af559c8](https://github.com/mariusbegby/cadence-discord-bot/commit/af559c8654569a781e31c24d2463242a0c428d05))
* **deps-dev:** bump @typescript-eslint/parser from 6.19.1 to 6.20.0 ([54ca9ec](https://github.com/mariusbegby/cadence-discord-bot/commit/54ca9ecfb9e4785fe0d463ee80be3f30a9c7856b))
* **deps-dev:** bump @typescript-eslint/parser from 6.6.0 to 6.7.0 ([2e9dd22](https://github.com/mariusbegby/cadence-discord-bot/commit/2e9dd229da4d696f630d0f20ba628e41aec55ac3))
* **deps-dev:** bump @typescript-eslint/parser from 6.7.0 to 6.7.3 ([2bc1729](https://github.com/mariusbegby/cadence-discord-bot/commit/2bc17298fa7b2678ab44f2d50d45260dd192263f))
* **deps-dev:** bump @typescript-eslint/parser from 6.7.3 to 6.7.5 ([229e32b](https://github.com/mariusbegby/cadence-discord-bot/commit/229e32b955cfb1d110950eab2b8b0ba5be598520))
* **deps-dev:** bump @typescript-eslint/parser from 6.7.5 to 6.9.0 ([3789bf0](https://github.com/mariusbegby/cadence-discord-bot/commit/3789bf0cb9a8b89c05c358c86ee6288d9ab9a0ba))
* **deps-dev:** bump @typescript-eslint/parser from 6.9.0 to 6.9.1 ([7c7fa4e](https://github.com/mariusbegby/cadence-discord-bot/commit/7c7fa4e55d1861f1c2c3456accc93b6c6f12fb10))
* **deps-dev:** bump @typescript-eslint/parser from 6.9.1 to 6.12.0 ([600c1e9](https://github.com/mariusbegby/cadence-discord-bot/commit/600c1e93fd43ebc4c1d53718731b9af7c066294c))
* **deps-dev:** bump @typescript-eslint/parser from 7.0.2 to 7.1.0 ([62a6ffb](https://github.com/mariusbegby/cadence-discord-bot/commit/62a6ffb2683d597847698a0e9a856fc9d0b9c81d))
* **deps-dev:** bump @typescript-eslint/parser from 7.1.0 to 7.1.1 ([b337658](https://github.com/mariusbegby/cadence-discord-bot/commit/b337658dde5c30e7f1c7b7252d04bcb0a53f33c5))
* **deps-dev:** bump eslint from 8.48.0 to 8.49.0 ([0f72034](https://github.com/mariusbegby/cadence-discord-bot/commit/0f7203447739ee94be641cd5511976cc01d9141f))
* **deps-dev:** bump eslint from 8.49.0 to 8.50.0 ([ebae3f1](https://github.com/mariusbegby/cadence-discord-bot/commit/ebae3f186cf77905267858c6e4f5e9e6c861f830))
* **deps-dev:** bump eslint from 8.50.0 to 8.51.0 ([ff2d82c](https://github.com/mariusbegby/cadence-discord-bot/commit/ff2d82cd5b6aa88563e75ab2fecd1016d68036b9))
* **deps-dev:** bump eslint from 8.51.0 to 8.52.0 ([2e9ca21](https://github.com/mariusbegby/cadence-discord-bot/commit/2e9ca212b27c54d5ed540936a8925d0443bef2ac))
* **deps-dev:** bump eslint from 8.52.0 to 8.53.0 ([b070635](https://github.com/mariusbegby/cadence-discord-bot/commit/b070635353824c8c11d28de53fc409223ec5d89c))
* **deps-dev:** bump eslint from 8.55.0 to 8.56.0 ([6c4f3a9](https://github.com/mariusbegby/cadence-discord-bot/commit/6c4f3a9d280631113f0b0f6a82428a069ae1fd94))
* **deps-dev:** bump eslint-plugin-prettier from 5.0.0 to 5.0.1 ([96cad41](https://github.com/mariusbegby/cadence-discord-bot/commit/96cad413ed3aadd01a431e783f6529f987a68df5))
* **deps-dev:** bump eslint-plugin-prettier from 5.1.1 to 5.1.2 ([72b6490](https://github.com/mariusbegby/cadence-discord-bot/commit/72b64909aec72329ec294dfd937c7e1e821ac9a4))
* **deps-dev:** bump eslint-plugin-prettier from 5.1.2 to 5.1.3 ([01568d3](https://github.com/mariusbegby/cadence-discord-bot/commit/01568d3ef746b6a1fd1e3b283759193484a5a2f4))
* **deps-dev:** bump i18next-resources-for-ts from 1.4.0 to 1.5.0 ([fc16137](https://github.com/mariusbegby/cadence-discord-bot/commit/fc16137427cbf5eec46646eae6b6e2a7f15c432f))
* **deps-dev:** bump prettier from 3.0.3 to 3.1.0 ([b638255](https://github.com/mariusbegby/cadence-discord-bot/commit/b638255244dd1a9123b596824dc2c69ec2fcea59))
* **deps-dev:** bump prettier from 3.1.1 to 3.2.2 ([18b010a](https://github.com/mariusbegby/cadence-discord-bot/commit/18b010ac80a12cddf134f539fd3aea9a16a5c259))
* **deps-dev:** bump ts-jest from 29.1.1 to 29.1.2 ([ef09de8](https://github.com/mariusbegby/cadence-discord-bot/commit/ef09de8284bb670d92a973c3999a84fc9a289179))
* **deps-dev:** bump typescript from 5.2.2 to 5.3.2 ([bae6e9e](https://github.com/mariusbegby/cadence-discord-bot/commit/bae6e9ecd14be426cdebbb1fb860f5d97cf5f6f2))
* **deps-dev:** bump typescript from 5.3.3 to 5.4.2 ([3495805](https://github.com/mariusbegby/cadence-discord-bot/commit/3495805073c97f074de494ffa068bc6ada1b20b0))
* **deps:** bump @prisma/client from 5.7.1 to 5.8.1 ([82f352d](https://github.com/mariusbegby/cadence-discord-bot/commit/82f352d613ce34835e77edbd891d6092472d6847))
* **deps:** bump config from 3.3.9 to 3.3.10 ([5c2cbab](https://github.com/mariusbegby/cadence-discord-bot/commit/5c2cbab0c495934f810c451c4ba6409624922872))
* **deps:** bump discord-player from 6.6.5-dev.4 to 6.6.6 ([34ad44e](https://github.com/mariusbegby/cadence-discord-bot/commit/34ad44ea5ffd35296c0f431904cbaf75fa96a423))
* **deps:** bump discord-player from 6.6.6 to 6.6.7 ([d89e1e6](https://github.com/mariusbegby/cadence-discord-bot/commit/d89e1e60091b0730c2db72e5543196012a0f96fe))
* **deps:** bump dotenv from 16.3.1 to 16.4.1 ([f55b18b](https://github.com/mariusbegby/cadence-discord-bot/commit/f55b18b0836b1a960470998fdb948bdf8e3a5605))
* **deps:** bump dotenv from 16.4.1 to 16.4.3 ([fee5cd1](https://github.com/mariusbegby/cadence-discord-bot/commit/fee5cd166f74bafc179cd9a2fdbd0ed5e7caa1f3))
* **deps:** bump i18next from 23.10.0 to 23.10.1 ([edfce65](https://github.com/mariusbegby/cadence-discord-bot/commit/edfce659b3c38875026270c23bd09756c7ed89de))
* **deps:** bump i18next from 23.7.11 to 23.7.13 ([425aac5](https://github.com/mariusbegby/cadence-discord-bot/commit/425aac5ce6f3f89c9332370f43ede957d61c1398))
* **deps:** bump i18next from 23.7.13 to 23.7.16 ([748742a](https://github.com/mariusbegby/cadence-discord-bot/commit/748742a2fceb22950f4fb41f5137eb8d060653e3))
* **deps:** bump i18next from 23.7.16 to 23.8.1 ([75b7ebb](https://github.com/mariusbegby/cadence-discord-bot/commit/75b7ebb26adf6d9cd7503292e4b430142b4e6d94))
* **deps:** bump ip from 1.1.8 to 1.1.9 ([d0be0ce](https://github.com/mariusbegby/cadence-discord-bot/commit/d0be0cea84e93d1a8b0c793b3034aab0f022c23c))
* **deps:** bump mediaplex from 0.0.6 to 0.0.7 ([a79cb44](https://github.com/mariusbegby/cadence-discord-bot/commit/a79cb4467d3c02ad50229ba495b8cb83cbeabe0d))
* **deps:** bump mediaplex from 0.0.7 to 0.0.8 ([e348fc3](https://github.com/mariusbegby/cadence-discord-bot/commit/e348fc368669a30bb66ef666d72318f83b72e374))
* **deps:** bump pino from 8.15.0 to 8.15.1 ([8814a55](https://github.com/mariusbegby/cadence-discord-bot/commit/8814a55f92e256418d25cbbab671bfe000bc2026))
* **deps:** bump pino from 8.15.1 to 8.15.3 ([adb2174](https://github.com/mariusbegby/cadence-discord-bot/commit/adb2174ffbaaa76182b60ca8c8ade820cdddc31d))
* **deps:** bump pino from 8.15.3 to 8.15.7 ([bc0c8bb](https://github.com/mariusbegby/cadence-discord-bot/commit/bc0c8bbbc9c8371557428c64ffc4af0e2800d5ff))
* **deps:** bump pino from 8.16.1 to 8.16.2 ([9d92ad3](https://github.com/mariusbegby/cadence-discord-bot/commit/9d92ad39fdfb1ea31066bb57e7b1b697dfbfef95))
* **deps:** bump pino from 8.16.2 to 8.17.1 ([d7a98c1](https://github.com/mariusbegby/cadence-discord-bot/commit/d7a98c1f8605e5364019e18f94da853e67d3f31e))
* **deps:** bump pino from 8.17.1 to 8.17.2 ([80f8ec2](https://github.com/mariusbegby/cadence-discord-bot/commit/80f8ec2fc4ff7f257d395fedb51f9c6850b932b9))
* **deps:** bump pino-loki from 2.1.3 to 2.2.1 ([1bd8e12](https://github.com/mariusbegby/cadence-discord-bot/commit/1bd8e125303b4bfa4c2b202a6f420b67dbd95355))
* **deps:** bump pino-pretty from 10.3.0 to 10.3.1 ([637210b](https://github.com/mariusbegby/cadence-discord-bot/commit/637210b4e0898ff4af9b1161fd6f6a7f3de26923))
* **deps:** bump youtube-ext from 1.1.14 to 1.1.16 ([0ae1993](https://github.com/mariusbegby/cadence-discord-bot/commit/0ae19931ddc814426942cd879d379099207353f9))
* **deps:** Updated dependencies ([1728503](https://github.com/mariusbegby/cadence-discord-bot/commit/1728503bb6c35ac0363214d3167216bfccc586d4))
* formatting strings to multiple lines ([e57dcaf](https://github.com/mariusbegby/cadence-discord-bot/commit/e57dcaf399affd40d3ef28717a3b52b8ea6bc9df))
* **main:** release 5.3.0 ([aaf2b09](https://github.com/mariusbegby/cadence-discord-bot/commit/aaf2b09f124785ec5c1379259a2de4165706dcea))
* **main:** release 5.3.1 ([66022d7](https://github.com/mariusbegby/cadence-discord-bot/commit/66022d78ab370819ba580f4e826e05757295fa1e))
* **main:** release 5.3.2 ([f3dbaea](https://github.com/mariusbegby/cadence-discord-bot/commit/f3dbaea49e6d793c0d9c4f226ccef190ac63d4f2))
* **main:** release 5.3.3 ([8977bf4](https://github.com/mariusbegby/cadence-discord-bot/commit/8977bf434c462dc274b19fe4fd8bce6c3b2c369d))
* **main:** release 5.3.4 ([d04a093](https://github.com/mariusbegby/cadence-discord-bot/commit/d04a093bbbf49d45817e66870d1e2aa0978652ee))
* **main:** release 5.3.5 ([a13c9f9](https://github.com/mariusbegby/cadence-discord-bot/commit/a13c9f998462e24366771b1e932ec814fa0dafcf))
* **main:** release 5.3.6 ([7447688](https://github.com/mariusbegby/cadence-discord-bot/commit/744768808c08db646fd672dd1158849b030256dd))
* **main:** release 5.3.7 ([46193a9](https://github.com/mariusbegby/cadence-discord-bot/commit/46193a94f17766cd48cc3355fe140c507d6d377e))
* **main:** release 5.3.8 ([f09a166](https://github.com/mariusbegby/cadence-discord-bot/commit/f09a166e81f955065a820715c3f7ed885eaba922))
* **main:** release 5.4.0 ([efa0d81](https://github.com/mariusbegby/cadence-discord-bot/commit/efa0d81e596d3f3a860e981b642aa3e068e05545))
* **main:** release 5.4.1 ([6b4faf7](https://github.com/mariusbegby/cadence-discord-bot/commit/6b4faf7e7437e0a0a35320a06c11cc4d8298fd36))
* **main:** release 5.5.0 ([68f8cff](https://github.com/mariusbegby/cadence-discord-bot/commit/68f8cff119231e85d64aa1d5a2a9e1f7ece0a958))
* **main:** release 5.6.0 ([309349e](https://github.com/mariusbegby/cadence-discord-bot/commit/309349ebb1108195fec620ea9f6d452953815dba))
* **main:** release 5.6.1 ([cc28c04](https://github.com/mariusbegby/cadence-discord-bot/commit/cc28c04426adaaff89657ac16c89fafb392f8b6c))
* **main:** release 5.6.2 ([758a171](https://github.com/mariusbegby/cadence-discord-bot/commit/758a17157ef19153a4e77a4c426d83d46677ef23))
* **main:** release 5.6.3 ([00a6ecc](https://github.com/mariusbegby/cadence-discord-bot/commit/00a6eccb19457ca0c9e7d955fcb01079f3624abd))
* **main:** release 5.6.4 ([005893e](https://github.com/mariusbegby/cadence-discord-bot/commit/005893e04c433f710c898390f83b0f3666f0b57d))
* **main:** release 5.6.5 ([66f6647](https://github.com/mariusbegby/cadence-discord-bot/commit/66f6647dc625e37c336c35a194d24ae36c24d83a))
* **main:** release 5.6.6 ([ab93c25](https://github.com/mariusbegby/cadence-discord-bot/commit/ab93c25f1644edca05b585fe4e35684364f10475))
* **main:** release 5.6.7 ([adc6d69](https://github.com/mariusbegby/cadence-discord-bot/commit/adc6d69dabd4cbc272b5710ff6d7f57cbb799273))
* **main:** release 5.6.8 ([5059c5d](https://github.com/mariusbegby/cadence-discord-bot/commit/5059c5dd615f784ded72307f2ad189950f17daa1))
* **main:** release 5.7.0 ([7c7c233](https://github.com/mariusbegby/cadence-discord-bot/commit/7c7c2330c415c75bc39965a5f7501685e9fc94fb))
* more type annotations ([10c03d5](https://github.com/mariusbegby/cadence-discord-bot/commit/10c03d599f9eb060304b10e5e5b6572c7ab253b0))
* update CI ([54899b0](https://github.com/mariusbegby/cadence-discord-bot/commit/54899b0a97cc8fc5a85cd17c0f0bcf441368ef84))
* Update Dockerfile to node 20 & optimize build ([eb74c9a](https://github.com/mariusbegby/cadence-discord-bot/commit/eb74c9ae8b46968e16a63fdaf167e2aa0da923ba))
* update volume command options ([46a81fb](https://github.com/mariusbegby/cadence-discord-bot/commit/46a81fb474b223c16584c88b9339c125c74003d1))
* update volume command options and remove duplicate file ([d48503f](https://github.com/mariusbegby/cadence-discord-bot/commit/d48503f565f4b0104e9f48891ece6c808e1f81f9))

## [5.7.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.6.8...v5.7.0) (2023-12-13)


### Features

* Add new /history command to show previously played tracks ([bf461c2](https://github.com/mariusbegby/cadence-discord-bot/commit/bf461c2f26ebbc24f6e3dc1d33b0657bfec3f065))
* Add new /move command to move a track to specified position ([100325b](https://github.com/mariusbegby/cadence-discord-bot/commit/100325b7d819243cc8785edbad69f8f02c9a55e9))
* Add new config option to enable/disable button labels ([47d3c36](https://github.com/mariusbegby/cadence-discord-bot/commit/47d3c36cc727531eaa4436d069c28d1426f88602))
* Added /back command to go back in history ([e11df37](https://github.com/mariusbegby/cadence-discord-bot/commit/e11df3706fa02dfdba73c8b3856071b7cca1b785))
* Updated /remove command with options for range, queue, user and duplicates! ([27d4c6c](https://github.com/mariusbegby/cadence-discord-bot/commit/27d4c6c0220e84f4005c077a768040528ebbdffb))


### Minor changes and bug fixes

* Add check on startup to see if ffmpeg is available ([0b72e92](https://github.com/mariusbegby/cadence-discord-bot/commit/0b72e926934e5dc942a4af8b24458a2d299c7e03))
* Add new action buttons also to /history command ([fac39e4](https://github.com/mariusbegby/cadence-discord-bot/commit/fac39e45cbd752db7148ea4be590a5cd05a88fb9))
* await client.login, thanks to @Kriblin ([64a709b](https://github.com/mariusbegby/cadence-discord-bot/commit/64a709b03226b2f4d2b0489bdd7d3ba59f59e2fc))
* change addNumberOption to addIntegerOption ([6ca7ce3](https://github.com/mariusbegby/cadence-discord-bot/commit/6ca7ce3e4be92e9240208c76c6bdf1418193ccef))
* Small changes to new action buttons ([981be70](https://github.com/mariusbegby/cadence-discord-bot/commit/981be707f04af0fd21481075683c63a3d0d42a2f))
* solve bug using getNumber after changing to addIntegerOption ([4b630e2](https://github.com/mariusbegby/cadence-discord-bot/commit/4b630e2512282a481b50678714f7dd580d3f4be5))
* update default config value for button labels to true ([ee54513](https://github.com/mariusbegby/cadence-discord-bot/commit/ee5451320e99f92edeb89dbcf21641304f0ca296))

## [5.6.8](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.6.7...v5.6.8) (2023-12-09)


### Minor changes and bug fixes

* update mediaplex to latest ([78b5d85](https://github.com/mariusbegby/cadence-discord-bot/commit/78b5d85c9e045eb26f47063f33d04dfef96e0f24))

## [5.6.7](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.6.6...v5.6.7) (2023-12-09)


### Minor changes and bug fixes

* Update npm scripts ([9c4c995](https://github.com/mariusbegby/cadence-discord-bot/commit/9c4c99558ae4b26febe84e7a56fc496591cb5c38))


### Miscellaneous

* **deps-dev:** bump @types/jest from 29.5.6 to 29.5.8 ([f98dbeb](https://github.com/mariusbegby/cadence-discord-bot/commit/f98dbeb05c067b489a3d616860f5945c6261c5e4))
* **deps-dev:** bump @types/jest from 29.5.8 to 29.5.11 ([fd40f25](https://github.com/mariusbegby/cadence-discord-bot/commit/fd40f251327ac769ca7d18353acb882465672f4f))
* **deps-dev:** bump @types/node-os-utils from 1.3.3 to 1.3.4 ([9bdd4a7](https://github.com/mariusbegby/cadence-discord-bot/commit/9bdd4a7aea645aa99022647324869f23094a9c27))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([2a8a3e5](https://github.com/mariusbegby/cadence-discord-bot/commit/2a8a3e51b65ea4d50fca71b23f6dc0c6a88435c1))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([965fd60](https://github.com/mariusbegby/cadence-discord-bot/commit/965fd60d54a16f6d55ef2e3a4230d901f98e8970))
* **deps-dev:** bump @typescript-eslint/parser from 6.12.0 to 6.13.2 ([027cbb7](https://github.com/mariusbegby/cadence-discord-bot/commit/027cbb7d170478acba17ead4804991c242107576))
* **deps-dev:** bump @typescript-eslint/parser from 6.9.0 to 6.9.1 ([7c7fa4e](https://github.com/mariusbegby/cadence-discord-bot/commit/7c7fa4e55d1861f1c2c3456accc93b6c6f12fb10))
* **deps-dev:** bump @typescript-eslint/parser from 6.9.1 to 6.12.0 ([600c1e9](https://github.com/mariusbegby/cadence-discord-bot/commit/600c1e93fd43ebc4c1d53718731b9af7c066294c))
* **deps-dev:** bump eslint from 8.52.0 to 8.53.0 ([b070635](https://github.com/mariusbegby/cadence-discord-bot/commit/b070635353824c8c11d28de53fc409223ec5d89c))
* **deps-dev:** bump prettier from 3.0.3 to 3.1.0 ([b638255](https://github.com/mariusbegby/cadence-discord-bot/commit/b638255244dd1a9123b596824dc2c69ec2fcea59))
* **deps-dev:** bump typescript from 5.2.2 to 5.3.2 ([bae6e9e](https://github.com/mariusbegby/cadence-discord-bot/commit/bae6e9ecd14be426cdebbb1fb860f5d97cf5f6f2))
* **deps:** bump pino from 8.16.1 to 8.16.2 ([9d92ad3](https://github.com/mariusbegby/cadence-discord-bot/commit/9d92ad39fdfb1ea31066bb57e7b1b697dfbfef95))

## [5.6.6](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.6.5...v5.6.6) (2023-11-02)


### Minor changes and bug fixes

* add user in footer on validation warnings ([eb26f5a](https://github.com/mariusbegby/cadence-discord-bot/commit/eb26f5ab93019b36a9a2dab85a819c7a28ae9c83))
* **playerSkip:** only log on error ([f5a39f4](https://github.com/mariusbegby/cadence-discord-bot/commit/f5a39f430eb99c8702ad3cd502a385ef545bf22c))
* update extractor to stable ([d7ef706](https://github.com/mariusbegby/cadence-discord-bot/commit/d7ef706604c3fb23b497075f3637b2c55c99cc92))


### Miscellaneous

* **deps-dev:** bump @types/node from 20.8.8 to 20.8.10 ([8d35f0b](https://github.com/mariusbegby/cadence-discord-bot/commit/8d35f0b4f9ecc5d53dc7620b3580cf1c8e3074ce))
* **deps:** bump discord-player from 6.6.5-dev.4 to 6.6.6 ([34ad44e](https://github.com/mariusbegby/cadence-discord-bot/commit/34ad44ea5ffd35296c0f431904cbaf75fa96a423))

## [5.6.5](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.6.4...v5.6.5) (2023-10-26)


### Minor changes and bug fixes

* set skipFFmpeg to false to solve bug ([ea8f97d](https://github.com/mariusbegby/cadence-discord-bot/commit/ea8f97dc2b405b5ed0ace99b6016fd1937790117))

## [5.6.4](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.6.3...v5.6.4) (2023-10-24)


### Minor changes and bug fixes

* update deps, change opus provider ([814029e](https://github.com/mariusbegby/cadence-discord-bot/commit/814029e6361ed3824aa7854f7857b46ecb065c71))

## [5.6.3](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.6.2...v5.6.3) (2023-10-24)


### Minor changes and bug fixes

* update deps ([dd06263](https://github.com/mariusbegby/cadence-discord-bot/commit/dd06263699e6fc75d5c987ce1c59ce3f9bd03e0c))


### Miscellaneous

* **deps-dev:** bump @babel/traverse from 7.22.17 to 7.23.2 ([aea0683](https://github.com/mariusbegby/cadence-discord-bot/commit/aea068377b3a6c338c1c620f00069a05a14c769f))
* **deps-dev:** bump @types/jest from 29.5.5 to 29.5.6 ([a36cbee](https://github.com/mariusbegby/cadence-discord-bot/commit/a36cbee8b90567670f348c772e5e5d99f1412270))
* **deps-dev:** bump @types/node from 20.8.0 to 20.8.4 ([963af52](https://github.com/mariusbegby/cadence-discord-bot/commit/963af52470b4e25a920d6d5ece6c7dde10ba65c8))
* **deps-dev:** bump @types/node from 20.8.4 to 20.8.7 ([7dd5739](https://github.com/mariusbegby/cadence-discord-bot/commit/7dd57395abf1ed9a4c8cad104143e9cb9f8920ad))
* **deps-dev:** bump @types/node-os-utils from 1.3.2 to 1.3.3 ([3544c76](https://github.com/mariusbegby/cadence-discord-bot/commit/3544c76c24e0886a249efcfb7f36da086a4cae9e))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([9d6931e](https://github.com/mariusbegby/cadence-discord-bot/commit/9d6931ebe913082186f11b136c1ce46c0ba3687b))
* **deps-dev:** bump @typescript-eslint/parser from 6.7.3 to 6.7.5 ([229e32b](https://github.com/mariusbegby/cadence-discord-bot/commit/229e32b955cfb1d110950eab2b8b0ba5be598520))
* **deps-dev:** bump @typescript-eslint/parser from 6.7.5 to 6.9.0 ([3789bf0](https://github.com/mariusbegby/cadence-discord-bot/commit/3789bf0cb9a8b89c05c358c86ee6288d9ab9a0ba))
* **deps-dev:** bump eslint from 8.50.0 to 8.51.0 ([ff2d82c](https://github.com/mariusbegby/cadence-discord-bot/commit/ff2d82cd5b6aa88563e75ab2fecd1016d68036b9))
* **deps-dev:** bump eslint from 8.51.0 to 8.52.0 ([2e9ca21](https://github.com/mariusbegby/cadence-discord-bot/commit/2e9ca212b27c54d5ed540936a8925d0443bef2ac))
* **deps-dev:** bump eslint-plugin-prettier from 5.0.0 to 5.0.1 ([96cad41](https://github.com/mariusbegby/cadence-discord-bot/commit/96cad413ed3aadd01a431e783f6529f987a68df5))
* **deps:** bump pino from 8.15.3 to 8.15.7 ([bc0c8bb](https://github.com/mariusbegby/cadence-discord-bot/commit/bc0c8bbbc9c8371557428c64ffc4af0e2800d5ff))
* **deps:** bump youtube-ext from 1.1.14 to 1.1.16 ([0ae1993](https://github.com/mariusbegby/cadence-discord-bot/commit/0ae19931ddc814426942cd879d379099207353f9))

## [5.6.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.6.1...v5.6.2) (2023-10-02)


### Minor changes and bug fixes

* update default leave settings ([ee0f769](https://github.com/mariusbegby/cadence-discord-bot/commit/ee0f769ba5fe8ffe02aa66387e33dfdd5a484cc4))


### Miscellaneous

* **deps-dev:** bump @types/node from 20.6.5 to 20.8.0 ([ef9381d](https://github.com/mariusbegby/cadence-discord-bot/commit/ef9381d7d27572e44095119daecf57b961fca31d))
* **deps:** bump pino from 8.15.1 to 8.15.3 ([adb2174](https://github.com/mariusbegby/cadence-discord-bot/commit/adb2174ffbaaa76182b60ca8c8ade820cdddc31d))

## [5.6.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.6.0...v5.6.1) (2023-09-25)


### Minor changes and bug fixes

* change Dockerfile base image to fix mediaplex not working ([3360782](https://github.com/mariusbegby/cadence-discord-bot/commit/3360782d2ed8bf5cd05933f25f2de1c2a9cfaac5))
* remove caching from npm ci in Dockerfile ([5e591c7](https://github.com/mariusbegby/cadence-discord-bot/commit/5e591c739f7679efcf29df9e0ac37e12083bf0cd))


### Miscellaneous

* **deps-dev:** bump @types/node from 20.6.2 to 20.6.5 ([9684c8b](https://github.com/mariusbegby/cadence-discord-bot/commit/9684c8b1f4de1e92f3b7bd29ef286d5b6763c65c))
* **deps-dev:** bump @types/node-os-utils from 1.3.1 to 1.3.2 ([5f2e0d5](https://github.com/mariusbegby/cadence-discord-bot/commit/5f2e0d5f1cb05d85a784c1156a25dd988cc5d5e9))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([eed285c](https://github.com/mariusbegby/cadence-discord-bot/commit/eed285c98990bfa702d7ed09a332884bdb3e312b))
* **deps-dev:** bump @typescript-eslint/parser from 6.7.0 to 6.7.3 ([2bc1729](https://github.com/mariusbegby/cadence-discord-bot/commit/2bc17298fa7b2678ab44f2d50d45260dd192263f))
* **deps-dev:** bump eslint from 8.49.0 to 8.50.0 ([ebae3f1](https://github.com/mariusbegby/cadence-discord-bot/commit/ebae3f186cf77905267858c6e4f5e9e6c861f830))

## [5.6.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.5.0...v5.6.0) (2023-09-18)


### Features

* add /join command ([9901374](https://github.com/mariusbegby/cadence-discord-bot/commit/990137468e7ce1302b22ac5f5b935a551812814d))


### Miscellaneous

* **deps-dev:** bump @types/jest from 29.5.4 to 29.5.5 ([c689589](https://github.com/mariusbegby/cadence-discord-bot/commit/c689589b495ebb56c20c58c0f1dd2de4e4671ae1))
* **deps-dev:** bump @types/node from 20.6.0 to 20.6.2 ([97869a0](https://github.com/mariusbegby/cadence-discord-bot/commit/97869a04fdb21a2afd98dac656ca677d06d26368))
* **deps-dev:** bump @typescript-eslint/eslint-plugin ([dfa4393](https://github.com/mariusbegby/cadence-discord-bot/commit/dfa439368364b6a11169ac87fb54d2b681c68d61))
* **deps-dev:** bump @typescript-eslint/parser from 6.6.0 to 6.7.0 ([2e9dd22](https://github.com/mariusbegby/cadence-discord-bot/commit/2e9dd229da4d696f630d0f20ba628e41aec55ac3))
* **deps:** bump mediaplex from 0.0.7 to 0.0.8 ([e348fc3](https://github.com/mariusbegby/cadence-discord-bot/commit/e348fc368669a30bb66ef666d72318f83b72e374))

## [5.5.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.4.1...v5.5.0) (2023-09-17)


### Features

* added equalizer filters to /filters command ([9584fe8](https://github.com/mariusbegby/cadence-discord-bot/commit/9584fe8ebe7b1cb97200d7a13e8763b1f4babba2))

## [5.4.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.4.0...v5.4.1) (2023-09-16)


### Minor changes and bug fixes

* update deps ([e029314](https://github.com/mariusbegby/cadence-discord-bot/commit/e029314ee2e125a90db2756b20e116a7b8fa45f5))


### Miscellaneous

* add jest coverage npm script ([b73dee5](https://github.com/mariusbegby/cadence-discord-bot/commit/b73dee52adaf348cc0106527a7987b25908e0c47))
* created simple command class method unit test ([aa37704](https://github.com/mariusbegby/cadence-discord-bot/commit/aa37704331e529248b612a803f94feb92505329f))

## [5.4.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.3.8...v5.4.0) (2023-09-16)


### Features

* add biquad filters support ([0b94a9b](https://github.com/mariusbegby/cadence-discord-bot/commit/0b94a9b5ec3fdb3108cbd0bd960c9d97ea866c76))
* show queue total duration in footer, update uptime duration format ([b139516](https://github.com/mariusbegby/cadence-discord-bot/commit/b1395164ea0d4117ecf6ae5f09a4eeecb25c3d86))


### Minor changes and bug fixes

* remove unnecessary async/await ([7dc7b4f](https://github.com/mariusbegby/cadence-discord-bot/commit/7dc7b4ff7e80df4c1979fb1e95ad511ce3bea831))

## [5.3.8](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.3.7...v5.3.8) (2023-09-14)


### Minor changes and bug fixes

* remove incorrect ** from string ([cf45bde](https://github.com/mariusbegby/cadence-discord-bot/commit/cf45bde80b42e69e7a8e797905502b261e86e269))
* update getDisplayRepeatMode showing wrong icon on success ([ea8cf10](https://github.com/mariusbegby/cadence-discord-bot/commit/ea8cf100f5fb98b57fd19e1bd4ec40712968add5))

## [5.3.7](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.3.6...v5.3.7) (2023-09-14)


### Minor changes and bug fixes

* Added setup for unit tests ([f04d5ab](https://github.com/mariusbegby/cadence-discord-bot/commit/f04d5ab79b360ba1f66cb2913ef1d24f08896ca2))
* change map to switch statement ([7018b69](https://github.com/mariusbegby/cadence-discord-bot/commit/7018b690bbc591b1b1eb689dfb4b36ab199165f3))
* Fix posting bot stats status codes. ([6beb29d](https://github.com/mariusbegby/cadence-discord-bot/commit/6beb29d8b75bcf3efd7e4237dc5b604e4d65eb00))
* possibly solve duplicate event 'interactionCreate' listener bug ([2d08a9a](https://github.com/mariusbegby/cadence-discord-bot/commit/2d08a9aa858fcd7f82c02fe0f0dc9b6e4524421c))
* refactor postBotStats.ts ([f06f2ae](https://github.com/mariusbegby/cadence-discord-bot/commit/f06f2ae352c72844317b519a46650807bddc3eb2))
* remove async from getUptimeFormatted ([4041404](https://github.com/mariusbegby/cadence-discord-bot/commit/4041404f01e58fd88009d73950691f2a5cbd3e1f))
* small change to getEmbedQueueAuthor for bitrate calculation ([f3de02a](https://github.com/mariusbegby/cadence-discord-bot/commit/f3de02a6a8f4fc8cfe3e80a8b49117d076b5a9f5))
* update interactionCreate event handling ([7902a84](https://github.com/mariusbegby/cadence-discord-bot/commit/7902a8427c5516c0586a86f27c2646cad1d81151))
* use Promise.all when fetching info for status commands ([2d7ffc1](https://github.com/mariusbegby/cadence-discord-bot/commit/2d7ffc1a3ff9f58740dd1c77078feadcce6478d7))


### Miscellaneous

* adjust getUptimeFormatted method ([5558c0b](https://github.com/mariusbegby/cadence-discord-bot/commit/5558c0bca2ec2241a2899e5e1c00a1a6090c0fce))
* more type annotations ([10c03d5](https://github.com/mariusbegby/cadence-discord-bot/commit/10c03d599f9eb060304b10e5e5b6572c7ab253b0))

## [5.3.6](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.3.5...v5.3.6) (2023-09-13)


### Minor changes and bug fixes

* add requested by string before mention ([e3efa48](https://github.com/mariusbegby/cadence-discord-bot/commit/e3efa48ade580db411246b85afcd57bf7a516dff))
* fix duration validation not using padded and formatted duration ([c4f9403](https://github.com/mariusbegby/cadence-discord-bot/commit/c4f9403ecffdefff892085bedd32c4d8da4c02d3))
* refactor filters disable button ([9458ed6](https://github.com/mariusbegby/cadence-discord-bot/commit/9458ed60a1c4eaf654bc32e9eb26bb719c0cf60b))
* refactor guilds command ([c689452](https://github.com/mariusbegby/cadence-discord-bot/commit/c68945272e6b26654d1baa173d9087cba994b0ff))
* refactor remove command ([230ba5f](https://github.com/mariusbegby/cadence-discord-bot/commit/230ba5fd9388ca67fa25720671706853e0a72aad))
* refactor volume command ([fca1a90](https://github.com/mariusbegby/cadence-discord-bot/commit/fca1a9048986d56136994824b949545e68933abf))
* refactored autocomplete interactions ([af78759](https://github.com/mariusbegby/cadence-discord-bot/commit/af7875981364fc01cc96d8d2c3624f3ac70dd2f9))
* refactored filters select menu component ([a9ce285](https://github.com/mariusbegby/cadence-discord-bot/commit/a9ce2856502aeb6b27dfeefe3c5e43b5c2e0454b))
* refactored guilds command ([56b25f9](https://github.com/mariusbegby/cadence-discord-bot/commit/56b25f9b97addc13ffb233ef45642dca6c990ae3))
* refactored nowplaying skip button component + more common methods ([78e8f12](https://github.com/mariusbegby/cadence-discord-bot/commit/78e8f12c99f9f3650d013bb92c7a20177f59b636))
* refactored seek command ([c871a75](https://github.com/mariusbegby/cadence-discord-bot/commit/c871a758222cc99ce7e50eae916a9d79f4c5bd33))
* refactored shards command ([9259bc2](https://github.com/mariusbegby/cadence-discord-bot/commit/9259bc2ffa8f9e4c72fd8baac5c203ec07f6f8b4))
* refactored skip command ([90346e7](https://github.com/mariusbegby/cadence-discord-bot/commit/90346e74698864b999bfebd29df3d10fbfab646b))
* refactored status commands ([20bc4aa](https://github.com/mariusbegby/cadence-discord-bot/commit/20bc4aa88f624719fe296092378e23fba94b1193))
* remove async from class methods for getting author ([fe14fc3](https://github.com/mariusbegby/cadence-discord-bot/commit/fe14fc308fe1d85f04f528a649034043dfda21c8))


### Miscellaneous

* formatting strings to multiple lines ([e57dcaf](https://github.com/mariusbegby/cadence-discord-bot/commit/e57dcaf399affd40d3ef28717a3b52b8ea6bc9df))

## [5.3.5](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.3.4...v5.3.5) (2023-09-12)


### Minor changes and bug fixes

* increased default history size ([85e27af](https://github.com/mariusbegby/cadence-discord-bot/commit/85e27afc5c53d70f78388337bdb60e965a8b633a))
* refactored pause command, added common method getDisplayTrackDurationAndUrl() ([0850d9b](https://github.com/mariusbegby/cadence-discord-bot/commit/0850d9b26d459dd8d9b6c81ec58cb47060b304f2))
* refactored play command and added common method for getting thumbnail url ([bf30d56](https://github.com/mariusbegby/cadence-discord-bot/commit/bf30d565d7ad311a7daea5900fbe3d6bf1d7c008))
* refactored queue command, added more common methods ([1ebb7c3](https://github.com/mariusbegby/cadence-discord-bot/commit/1ebb7c3b8951f2aca3f943e601b2fff127083fff))

## [5.3.4](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.3.3...v5.3.4) (2023-09-11)


### Miscellaneous

* **deps-dev:** bump @types/node from 20.5.9 to 20.6.0 ([759171f](https://github.com/mariusbegby/cadence-discord-bot/commit/759171fd6b492198e92900bb92f429617fb51220))
* **deps-dev:** bump eslint from 8.48.0 to 8.49.0 ([0f72034](https://github.com/mariusbegby/cadence-discord-bot/commit/0f7203447739ee94be641cd5511976cc01d9141f))
* **deps:** bump mediaplex from 0.0.6 to 0.0.7 ([a79cb44](https://github.com/mariusbegby/cadence-discord-bot/commit/a79cb4467d3c02ad50229ba495b8cb83cbeabe0d))
* **deps:** bump pino from 8.15.0 to 8.15.1 ([8814a55](https://github.com/mariusbegby/cadence-discord-bot/commit/8814a55f92e256418d25cbbab671bfe000bc2026))

## [5.3.3](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.3.2...v5.3.3) (2023-09-10)


### Minor changes and bug fixes

* refactor nowplaying command ([f061000](https://github.com/mariusbegby/cadence-discord-bot/commit/f061000f933d89add34c8123ec1d8395e6da14fb))

## [5.3.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.3.1...v5.3.2) (2023-09-10)


### Minor changes and bug fixes

* dont log error object before handling ([c35a3ad](https://github.com/mariusbegby/cadence-discord-bot/commit/c35a3ad5aac96309f9f2afacd22186d2613d1e1a))
* Fix deconstruction error if no lastQuery result in autocomplete ([851e932](https://github.com/mariusbegby/cadence-discord-bot/commit/851e9321f561f1b50f52ad55c9497fea60be7300))
* refactored lyrics command ([c1de63d](https://github.com/mariusbegby/cadence-discord-bot/commit/c1de63da2735ada18dde25df9bfbe3c3a5212124))
* use new runValidators format on components ([74c1447](https://github.com/mariusbegby/cadence-discord-bot/commit/74c1447e7d27e7a87dcfc9d1893f232550365824))

## [5.3.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.3.0...v5.3.1) (2023-09-10)


### Minor changes and bug fixes

* fix string comparison to lowercase for filter provider ([e89075e](https://github.com/mariusbegby/cadence-discord-bot/commit/e89075ef440fb56c4a42ffee6f90cefa7d5b5a56))
* update deps ([608dfe5](https://github.com/mariusbegby/cadence-discord-bot/commit/608dfe556636bb4afae46093fd3f94f9af377c1f))

## [5.3.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.2.1...v5.3.0) (2023-09-07)


### Features

* refactored handling of validators ([8c05499](https://github.com/mariusbegby/cadence-discord-bot/commit/8c05499f08df6fac9cf7159a34b5a13cd642d7dc))


### Minor changes and bug fixes

* add bun scripts to package.json ([00aaece](https://github.com/mariusbegby/cadence-discord-bot/commit/00aaece22766a9a900c809a18c3ce288725dfad4))
* changed loop mode option input to number ([c4bb6ee](https://github.com/mariusbegby/cadence-discord-bot/commit/c4bb6eef3fed1a3e5e6c2869b35a688aeb271812))
* Extract logic for getting author value for embeds ([83e23d8](https://github.com/mariusbegby/cadence-discord-bot/commit/83e23d87b4d79e8b37d45dcca15ecaa603e8a30d))
* extracted logic for retrieving shard status ([8da6f44](https://github.com/mariusbegby/cadence-discord-bot/commit/8da6f44ebbf56ede204d515b03f6aca5339daeda))
* Fix .ENV file not being properly loaded ([1220ef1](https://github.com/mariusbegby/cadence-discord-bot/commit/1220ef171f5b1266a481881d5f7b2c5daa185e5e))
* Fixed mapped guild list not being parsed by Bun ([d953fc9](https://github.com/mariusbegby/cadence-discord-bot/commit/d953fc97af2d9c2ece7ed232a892609f7ba27559))
* refactor loop command ([03c1d5d](https://github.com/mariusbegby/cadence-discord-bot/commit/03c1d5d90f0c9860a21b3210281dac85498eba1b))
* refactored help slash command ([9223377](https://github.com/mariusbegby/cadence-discord-bot/commit/922337769da9260e0c9eb0004fce49c892d7951e))
* remove unneccessary logging in leave command ([6999598](https://github.com/mariusbegby/cadence-discord-bot/commit/6999598c8708e987233c4eaab1dcdf766ccd50be))
* Update postBotStats to output status codes from request ([9e20805](https://github.com/mariusbegby/cadence-discord-bot/commit/9e20805529a1671772362e591a8518fa7eabd3ee))
* Update validators with new types ([e67d000](https://github.com/mariusbegby/cadence-discord-bot/commit/e67d0004b05a7d6a72a723430c183880802cc6f4))
* Updated sending in checks for validation runner ([56056cd](https://github.com/mariusbegby/cadence-discord-bot/commit/56056cd73d03d51d5a49e0cace710ccdcc930281))
* Updated some validator error messages ([04dd7a7](https://github.com/mariusbegby/cadence-discord-bot/commit/04dd7a72181d69c6332692c4912c8fb5274a6581))


### Miscellaneous

* add Bun CI workflow ([15b0a54](https://github.com/mariusbegby/cadence-discord-bot/commit/15b0a54e298d237494ba2c1cdcc83880e03a1fbe))
* **deps-dev:** bump @types/config from 3.3.0 to 3.3.1 ([260e1d6](https://github.com/mariusbegby/cadence-discord-bot/commit/260e1d637ad73d192e19046b95da0d1e11cc0e47))

## [5.2.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.2.0...v5.2.1) (2023-09-03)


### Minor changes and bug fixes

* Fixed bug in postBotStats resulting in guildCount being NaN ([57c83ff](https://github.com/mariusbegby/cadence-discord-bot/commit/57c83ff48749e8421812b62f929617577256368d))

## [5.2.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.1.1...v5.2.0) (2023-09-03)


### Features

* support new discord-player ip rotation config ([cfd45fc](https://github.com/mariusbegby/cadence-discord-bot/commit/cfd45fc711c31c9bfb1801a3335b4604d9fdcce1))


### Minor changes and bug fixes

* Add configurable option for ip rotation config ([8dd8860](https://github.com/mariusbegby/cadence-discord-bot/commit/8dd88609f8360266ae14cac46a280965b14861f6))
* separated types and classes ([ea32ae6](https://github.com/mariusbegby/cadence-discord-bot/commit/ea32ae6c612c1863ffe7c4b58012da3454e90eb1))
* Updated deps ([650e35b](https://github.com/mariusbegby/cadence-discord-bot/commit/650e35b48eb4c1cc73dd575fda784fb06368bb27))
* Updated to discord-player 6.6.3 release ([4865e20](https://github.com/mariusbegby/cadence-discord-bot/commit/4865e208e17c20d15632fc9f069333f7e87f36cd))


### Miscellaneous

* updated linting and formatting, updated deps ([6dcddee](https://github.com/mariusbegby/cadence-discord-bot/commit/6dcddee2e993e3816f1ee1b3ff381cfe2bc4c864))

## [5.1.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.1.0...v5.1.1) (2023-08-31)


### Minor changes and bug fixes

* fix "Unknown interaction" error not being handled due to uppercase I ([8a0ade3](https://github.com/mariusbegby/cadence-discord-bot/commit/8a0ade3ac42dece669d91169b7e677a79cddc17f))
* Updated handling of interaction errors ([da919d1](https://github.com/mariusbegby/cadence-discord-bot/commit/da919d1c5a749a9f013245c9617e024bef128f3a))

## [5.1.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.0.5...v5.1.0) (2023-08-31)


### Features

* removed source property from logger ([9aaba5e](https://github.com/mariusbegby/cadence-discord-bot/commit/9aaba5ea40880a5c245bd09ea28be51af91a0eb3))


### Minor changes and bug fixes

* more type annotation ([2560f0f](https://github.com/mariusbegby/cadence-discord-bot/commit/2560f0fe9a128a16f482195f06842d45414ea2fb))

## [5.0.5](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.0.4...v5.0.5) (2023-08-29)


### Minor changes and bug fixes

* Fix logger for handlers not including executionId ([0db7bb0](https://github.com/mariusbegby/cadence-discord-bot/commit/0db7bb0cf37027e33762ba329590add9e5931da6))

## [5.0.4](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.0.3...v5.0.4) (2023-08-29)


### Minor changes and bug fixes

* Handle "unknown interaction" with log message and return ([48f2f44](https://github.com/mariusbegby/cadence-discord-bot/commit/48f2f44f21451e6c2691aff039f2d69e13ebf126))

## [5.0.3](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.0.2...v5.0.3) (2023-08-29)


### Minor changes and bug fixes

* added configurable fallback icon url for use in embeds ([69fff97](https://github.com/mariusbegby/cadence-discord-bot/commit/69fff97e3836a55569fe3c217ff7089b1fd9c73b))


### Miscellaneous

* add discord default profile icon asset ([e47256a](https://github.com/mariusbegby/cadence-discord-bot/commit/e47256a15e826f114707f06cecf8663e8a7fdee6))

## [5.0.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.0.1...v5.0.2) (2023-08-29)


### Minor changes and bug fixes

* add validation to component interactions ([7053f01](https://github.com/mariusbegby/cadence-discord-bot/commit/7053f01bc58c9e39ca5cd40d4403aed540852d5b))
* exit script if env vars not provided ([3754640](https://github.com/mariusbegby/cadence-discord-bot/commit/37546405e204cbc73429cedae80d144a88156a8c))
* fixed bug with not being able to read command data ([e44e0b2](https://github.com/mariusbegby/cadence-discord-bot/commit/e44e0b23f3db26fe9cb8f62fdedc88f4f39e0102))
* remove Promise.resolve() return and fix queue type ([67e4572](https://github.com/mariusbegby/cadence-discord-bot/commit/67e45729a3739c461d3844f506c7504d2d88e822))
* update validation in interactions ([5bc0239](https://github.com/mariusbegby/cadence-discord-bot/commit/5bc0239cdf818507f3ecd838f1dead1081d7ac4e))


### Miscellaneous

* **deps-dev:** bump @types/node from 20.5.6 to 20.5.7 ([11de25c](https://github.com/mariusbegby/cadence-discord-bot/commit/11de25c0b483ea91e214d6a0673feb799e5bab17))
* **deps-dev:** bump eslint from 8.47.0 to 8.48.0 ([16deed1](https://github.com/mariusbegby/cadence-discord-bot/commit/16deed169305aca8a70732387ec2375aacaadc2d))
* remove comment ([fe855f0](https://github.com/mariusbegby/cadence-discord-bot/commit/fe855f0870a40ca606a396b233b9f46a15c4586c))

## [5.0.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v5.0.0...v5.0.1) (2023-08-28)


### Minor changes and bug fixes

* remove buildx from  docker CI/CD, caused error on using cache ([0706d44](https://github.com/mariusbegby/cadence-discord-bot/commit/0706d446b1844792148d48941ea47a4697c61e63))

## [5.0.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.3.1...v5.0.0) (2023-08-28)


### ⚠ BREAKING CHANGES

* fixed logging service not logging to file, removed app-info log file.
* Extracted handling of interactions into separate files
* better handling and error handling for interaction events
* Extract logic for autocomplete and  component interactions
* Change interaction structure and handling of component responses

### Features

* better handling and error handling for interaction events ([f231c53](https://github.com/mariusbegby/cadence-discord-bot/commit/f231c53fe87de5e912135a90a50bf8bac9b714dd))
* Change interaction structure and handling of component responses ([9b02b21](https://github.com/mariusbegby/cadence-discord-bot/commit/9b02b21283e3b66a2aa0197b39b31a8a48ff4abf))
* Extract logic for autocomplete and  component interactions ([1ec1281](https://github.com/mariusbegby/cadence-discord-bot/commit/1ec1281e985d2e34a0822f01d4d6f841f86a00e3))
* Extracted handling of interactions into separate files ([780e20d](https://github.com/mariusbegby/cadence-discord-bot/commit/780e20d4195a1dbd011931ee49d762a6301e797d))


### Minor changes and bug fixes

* add executionTime property to logging for interactions ([a248452](https://github.com/mariusbegby/cadence-discord-bot/commit/a248452f2ce725f602807a34eda81243975a66f6))
* Ensure promise is returned where applicable ([14cb6b4](https://github.com/mariusbegby/cadence-discord-bot/commit/14cb6b4936f5e005081d713104398e187e3fccd8))
* fixed logging service not logging to file, removed app-info log file. ([92a535d](https://github.com/mariusbegby/cadence-discord-bot/commit/92a535d83719113b7b4aeb8f7294ea9908405e89))
* listen for more shard events ([1e11700](https://github.com/mariusbegby/cadence-discord-bot/commit/1e1170099e823335a428d29284cbdaee77bf2053))
* log interaction identifier (name) instead of type ([35047ca](https://github.com/mariusbegby/cadence-discord-bot/commit/35047ca8be088ff40fd531d8e8f64801e1fa5d02))
* refactored registering of event listeners ([9757252](https://github.com/mariusbegby/cadence-discord-bot/commit/975725276a6e1c804f0664746b4827e2dc6202f5))
* set module correctly for autocomplete interactions ([cd3947c](https://github.com/mariusbegby/cadence-discord-bot/commit/cd3947c22bcbe08512a1cd1999a26bc297b5379f))
* Small adjustments ([931c6eb](https://github.com/mariusbegby/cadence-discord-bot/commit/931c6eb1403febf98acfbc2de38ac26c571cd0ef))
* some logging changes to permission validator ([8e9cb30](https://github.com/mariusbegby/cadence-discord-bot/commit/8e9cb308e97f98174e414e258ad384a1659a88de))

## [4.3.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.3.0...v4.3.1) (2023-08-27)


### Minor changes and bug fixes

* fix loki error ([2fe7591](https://github.com/mariusbegby/cadence-discord-bot/commit/2fe7591380aa4f8cfaf67095a4ad08ffa38034e3))
* update deps ([3d904f5](https://github.com/mariusbegby/cadence-discord-bot/commit/3d904f51af05f2ef0659733e73889168bddc5168))

## [4.3.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.2.1...v4.3.0) (2023-08-27)


### Features

* rename .js files to .ts ([92b1992](https://github.com/mariusbegby/cadence-discord-bot/commit/92b1992b1ac6d4ce3cf15d14b6b78914536f7610))
* update paths to typescript /dist ([c3891f9](https://github.com/mariusbegby/cadence-discord-bot/commit/c3891f9c2dfb6469e1f72d6f95093d9269166d05))


### Minor changes and bug fixes

* add annotations to command parameters ([179f7dd](https://github.com/mariusbegby/cadence-discord-bot/commit/179f7ddbfd9d77cb32d8c5f362eecb34432a1bbd))
* annotate volume command ([e9ed2eb](https://github.com/mariusbegby/cadence-discord-bot/commit/e9ed2eb0b8a10ed0467d6ed9ecd28140a234a9b1))
* annotated system commands ([0bdc550](https://github.com/mariusbegby/cadence-discord-bot/commit/0bdc5501bee6874ab9f77812a0235e414f30e0b3))
* annotated the rest of commands ([45d6ffa](https://github.com/mariusbegby/cadence-discord-bot/commit/45d6ffa1798bcbe532d4319f46a9839e607311c6))
* annotated util validation ([d38ed18](https://github.com/mariusbegby/cadence-discord-bot/commit/d38ed188429ab7e532c8bdd261ebb3dc0ddbf8d9))
* annotated util validation functions ([1ae9503](https://github.com/mariusbegby/cadence-discord-bot/commit/1ae950347713378408d1429b54680a116155f071))
* annotations for events ([b118ebd](https://github.com/mariusbegby/cadence-discord-bot/commit/b118ebdfb0de07b6f2d0895fb022458eb6984034))
* created initial tsconfig.json ([40bf9d9](https://github.com/mariusbegby/cadence-discord-bot/commit/40bf9d926b2dc3ba8944669a848093766d854a6d))
* fix annotation issue for guild cache list ([7185fe4](https://github.com/mariusbegby/cadence-discord-bot/commit/7185fe4071990b822d9b4cd2eb983302dce50345))
* Fixed annotations ([89f8e2d](https://github.com/mariusbegby/cadence-discord-bot/commit/89f8e2d0d168297891e662261bbd40a8ce5d6773))
* Fixed most imports and some typescript changes ([0d9f4bd](https://github.com/mariusbegby/cadence-discord-bot/commit/0d9f4bd404413db34cf06a1464453fe069464ff2))
* installed typescript ([ef76e9c](https://github.com/mariusbegby/cadence-discord-bot/commit/ef76e9c3ad4cbf72f02e8be621d378f7166270ef))
* more annotation for util functions ([39e8182](https://github.com/mariusbegby/cadence-discord-bot/commit/39e818283d517e8b8caf9803fc997ca955ab626d))
* types for logger service ([f4f4182](https://github.com/mariusbegby/cadence-discord-bot/commit/f4f418292a4e7fa002df3e79d6da647a3c36f901))
* update Dockerfile and CI/CD workflows ([f21bfba](https://github.com/mariusbegby/cadence-discord-bot/commit/f21bfbae6f900d800b3d8edd0808918630f00b18))
* update eslint to respect typescript and run eslint fix ([1a7f800](https://github.com/mariusbegby/cadence-discord-bot/commit/1a7f800ba2d354b717bc1dc9e58a66dc18bc18ae))
* update module import statements from require to import ([9125e4a](https://github.com/mariusbegby/cadence-discord-bot/commit/9125e4a5dada8f9073cdcbd64944aad37a8e41a3))


### Miscellaneous

* formatting and sorting ([72e2b2a](https://github.com/mariusbegby/cadence-discord-bot/commit/72e2b2aa138bf87b6a2e6614eca28b1044d4903d))
* initiate RELEASE_VERSION env var ([98f8d43](https://github.com/mariusbegby/cadence-discord-bot/commit/98f8d4338f4e73ff164f39c6f7ad12dccb16deea))
* removed unused import ([1b00222](https://github.com/mariusbegby/cadence-discord-bot/commit/1b00222ecf376a193302fb9d3323b9a1e7a9ea44))

## [4.2.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.2.0...v4.2.1) (2023-08-26)


### Minor changes and bug fixes

* small fixes ([4b48df5](https://github.com/mariusbegby/cadence-discord-bot/commit/4b48df53932e0cf4b52dd5208f723fd65e77b37e))

## [4.2.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.1.3...v4.2.0) (2023-08-26)


### Features

* add default properties for logger, ignore these in pino-pretty output ([5531699](https://github.com/mariusbegby/cadence-discord-bot/commit/55316995e5dcd5f4f73479a35a8e395b4acee86d))
* add pushing logs to loki ([9c1ab82](https://github.com/mariusbegby/cadence-discord-bot/commit/9c1ab820da913b958353bfdc135bc39d9377e841))
* better autocomplete by caching and debounce ([a9a9183](https://github.com/mariusbegby/cadence-discord-bot/commit/a9a918392a12b42254353b864fb6c6d525c4727b))
* debounce autocomplete on /play ([68a8274](https://github.com/mariusbegby/cadence-discord-bot/commit/68a8274b44917953dc1cbfcc691a435af19fae84))


### Minor changes and bug fixes

* add env variable for LOKI_HOST ([875d903](https://github.com/mariusbegby/cadence-discord-bot/commit/875d9036f11a163a7e929d62046b2b7844a052c0))
* add execution id to footer in error embeds ([82ab8c9](https://github.com/mariusbegby/cadence-discord-bot/commit/82ab8c9387518050c5b5caf06886afae974e9833))
* add toggle for showing discord player debug logging ([91570e7](https://github.com/mariusbegby/cadence-discord-bot/commit/91570e7c2e880b1e32ff5bd24fb5726f69d07f6c))
* Improvements to spotify country-based url filter and playlist support ([4d9353d](https://github.com/mariusbegby/cadence-discord-bot/commit/4d9353d43afc26993e3c5429abe8ecc781ef7317))
* indicate live track for duration ([0111d3a](https://github.com/mariusbegby/cadence-discord-bot/commit/0111d3af37fab8d5dfb89c58ec239d652527b623))
* Logging changes, lower level logging ([dfea740](https://github.com/mariusbegby/cadence-discord-bot/commit/dfea74080e99b5ad301104a32f4684d789e7e6bf))
* more changes to logging ([9d9087d](https://github.com/mariusbegby/cadence-discord-bot/commit/9d9087d4c3733d60cdf641851fff1e3191a26541))
* show track url instead of source on player start event ([7ef666f](https://github.com/mariusbegby/cadence-discord-bot/commit/7ef666f03d2fa174b0cf649fe9906044f0f92b7c))
* Support custom emojis in config for liveTrack  icon ([97ffa12](https://github.com/mariusbegby/cadence-discord-bot/commit/97ffa127032a98dd66dd55348b6d3e5761f07c5f))
* update logger for all util ([7cb25c5](https://github.com/mariusbegby/cadence-discord-bot/commit/7cb25c56486cd846874a11f3ef4d35de54c78906))
* update logging for events ([5c8f335](https://github.com/mariusbegby/cadence-discord-bot/commit/5c8f3353f9821efb46b4e174383ee515826bab31))
* update to mediaplex 0.0.6 ([3a7212a](https://github.com/mariusbegby/cadence-discord-bot/commit/3a7212a7a25740c43351e8c3f37de3d22d9841ea))
* update voice channel validator logging ([2210982](https://github.com/mariusbegby/cadence-discord-bot/commit/22109823e1fceafe4c6877197c8f64761765e579))
* updated logging for commands ([a04d0ae](https://github.com/mariusbegby/cadence-discord-bot/commit/a04d0aeb5bc2ca86c1f6911c4de14c501454dd84))
* updated logging for validators ([57fc1e3](https://github.com/mariusbegby/cadence-discord-bot/commit/57fc1e3ee82ac3f3a730be3ddd48ffacbb5cb7f0))


### Miscellaneous

* remove comments ([45b0039](https://github.com/mariusbegby/cadence-discord-bot/commit/45b00395a7aa53e5e704e84600a80f81ed770b10))
* update logging for client ready ([bdaf998](https://github.com/mariusbegby/cadence-discord-bot/commit/bdaf998e31f4b06554d2f54f755875841d473ceb))
* update package.json with new ignore flags for pino-pretty ([3971f51](https://github.com/mariusbegby/cadence-discord-bot/commit/3971f517ab42595963071e2e71d76222c21771ef))

## [4.1.3](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.1.2...v4.1.3) (2023-08-22)


### Minor changes and bug fixes

* add more sorting options to /shards command ([3a93193](https://github.com/mariusbegby/cadence-discord-bot/commit/3a93193b845434c5ead65d3ffef0228ab37e8883))
* add node.js process memory usage per shard ([c5a21ae](https://github.com/mariusbegby/cadence-discord-bot/commit/c5a21ae6c5cc185be8e1dbfc311cf0f871c3f433))


### Miscellaneous

* add comment to Dockerfile ([8a73e0b](https://github.com/mariusbegby/cadence-discord-bot/commit/8a73e0b256d666492bec6a28598aeb1bae9d6984))
* change wording ([943ad0b](https://github.com/mariusbegby/cadence-discord-bot/commit/943ad0b5927c78c48e3757653b5a70a567d8cfa9))
* removed unused asset ([adf1a48](https://github.com/mariusbegby/cadence-discord-bot/commit/adf1a48887047d5db3b8c10aa759513d970d6f60))
* update new and beta status of commands ([6e3c465](https://github.com/mariusbegby/cadence-discord-bot/commit/6e3c46567e1b180bc3d9324bf8feb12393333582))

## [4.1.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.1.1...v4.1.2) (2023-08-21)


### Minor changes and bug fixes

* Fix bug in /shards when shard count is 1 on shown page ([623f4e2](https://github.com/mariusbegby/cadence-discord-bot/commit/623f4e200fbf33613370c974b6c483748fd96cce))
* handle message component interactions logging ([94ef202](https://github.com/mariusbegby/cadence-discord-bot/commit/94ef202c7f8443a40bf813247950fa6867d97bb3))
* handle no queue dispatcher error when /queue and bot not in vc ([bd249e6](https://github.com/mariusbegby/cadence-discord-bot/commit/bd249e686701f3473a2c5c24eba5a996d7c1732d))

## [4.1.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.1.0...v4.1.1) (2023-08-21)


### Miscellaneous

* **deps:** bump discord.js from 14.12.1 to 14.13.0 ([9839b98](https://github.com/mariusbegby/cadence-discord-bot/commit/9839b986bfb2a7ddf744fec65956b63f9df18128))

## [4.1.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.0.7...v4.1.0) (2023-08-21)


### Features

* added /shards system command ([173b234](https://github.com/mariusbegby/cadence-discord-bot/commit/173b234b0da7571934cb9e63580ae3dc8ae61662))
* Update shards command ([825db5e](https://github.com/mariusbegby/cadence-discord-bot/commit/825db5ea5a45015d22149b9e68330faf8b22d2bd))


### Minor changes and bug fixes

* add distube ytdl core version to system status ([7eb4d48](https://github.com/mariusbegby/cadence-discord-bot/commit/7eb4d4858ffa74223da19d5ca8e160d566150006))

## [4.0.7](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.0.6...v4.0.7) (2023-08-20)


### Minor changes and bug fixes

* add latest tag to built docker image before pushing ([ca1fd84](https://github.com/mariusbegby/cadence-discord-bot/commit/ca1fd84a3000434cc85e6bebdb4b2beb5534c3ee))

## [4.0.6](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.0.5...v4.0.6) (2023-08-20)


### Miscellaneous

* add manual trigger ([d92a6c2](https://github.com/mariusbegby/cadence-discord-bot/commit/d92a6c284497e3845cf6e7d4d7a04aff52e862a8))
* remove dispatch ([5fbd3e0](https://github.com/mariusbegby/cadence-discord-bot/commit/5fbd3e0d819e9e483e87cb28aad8eed3f89735d4))
* update release-please to use custom token. ([142efb8](https://github.com/mariusbegby/cadence-discord-bot/commit/142efb8e961664b8312ab7483e9f298f56b3278b))

## [4.0.5](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.0.4...v4.0.5) (2023-08-20)


### Minor changes and bug fixes

* change contributor workflow to run once daily ([d326be1](https://github.com/mariusbegby/cadence-discord-bot/commit/d326be1d16cf9e26b5488a1a1455d1dcbb5db952))


### Miscellaneous

* update docker release workflow ([e755e2e](https://github.com/mariusbegby/cadence-discord-bot/commit/e755e2e6937122adba9bf1a9656e585c1c49af51))

## [4.0.4](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.0.3...v4.0.4) (2023-08-20)


### Miscellaneous

* **main:** release 4.0.3 ([7bcd28d](https://github.com/mariusbegby/cadence-discord-bot/commit/7bcd28df7677b2ae828bdc3467bfb9c18c94da89))
* update docker release workflow ([1853062](https://github.com/mariusbegby/cadence-discord-bot/commit/185306253f90b55d31792e68bff8b292e427ca87))

## [4.0.3](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.0.2...v4.0.3) (2023-08-20)


### Minor changes and bug fixes

* Remove git from Dockerfile ([1bfa8ed](https://github.com/mariusbegby/cadence-discord-bot/commit/1bfa8ede5af29b1a179f4c11fb2c9ebbe782b540))
* Update Dockerfile and add .dockerignore ([054a07d](https://github.com/mariusbegby/cadence-discord-bot/commit/054a07dd77ce35ebe498837e2bc3fe8bb29dd621))
* Update Dockerfile to deploy as part of startup ([6837ec6](https://github.com/mariusbegby/cadence-discord-bot/commit/6837ec6cc88a8f94d1d86c796c8294d73da73913))


### Miscellaneous

* update workflow for docker build and publish ([c361a41](https://github.com/mariusbegby/cadence-discord-bot/commit/c361a4148da5a2395699b07176bee67bd1353a45))

## [4.0.3](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.0.2...v4.0.3) (2023-08-20)


### Minor changes and bug fixes

* Remove git from Dockerfile ([1bfa8ed](https://github.com/mariusbegby/cadence-discord-bot/commit/1bfa8ede5af29b1a179f4c11fb2c9ebbe782b540))
* Update Dockerfile and add .dockerignore ([054a07d](https://github.com/mariusbegby/cadence-discord-bot/commit/054a07dd77ce35ebe498837e2bc3fe8bb29dd621))
* Update Dockerfile to deploy as part of startup ([6837ec6](https://github.com/mariusbegby/cadence-discord-bot/commit/6837ec6cc88a8f94d1d86c796c8294d73da73913))

## [4.0.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.0.1...v4.0.2) (2023-08-20)


### Minor changes and bug fixes

* Update Dockerfile ([5ff66ce](https://github.com/mariusbegby/cadence-discord-bot/commit/5ff66ce5ba2ccab07203fe7b7a3d55003a369c22))

## [4.0.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v4.0.0...v4.0.1) (2023-08-19)


### Miscellaneous

* Update README.md ([88d0019](https://github.com/mariusbegby/cadence-discord-bot/commit/88d00190365f6e09f005e26ef9076ad2370dd306))

## [4.0.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.7.4...v4.0.0) (2023-08-19)


### ⚠ BREAKING CHANGES

* Added new config system with config npm package

### Features

* Added new config system with config npm package ([2da7cb3](https://github.com/mariusbegby/cadence-discord-bot/commit/2da7cb360a0bdccd44888f460c0778a465e25079))

## [3.7.4](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.7.3...v3.7.4) (2023-08-18)


### Minor changes and bug fixes

* adjustments to error and permission handling ([6bcc489](https://github.com/mariusbegby/cadence-discord-bot/commit/6bcc489e840d9fa69fdaa1de002e2134ddf931b8))

## [3.7.3](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.7.2...v3.7.3) (2023-08-13)


### Minor changes and bug fixes

* check if interaction has timed out or can be replied to ([c0894d2](https://github.com/mariusbegby/cadence-discord-bot/commit/c0894d214a60290947e800a09e1747dda2702cce))

## [3.7.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.7.1...v3.7.2) (2023-08-12)


### Minor changes and bug fixes

* update mediaplex to latest version ([6b48491](https://github.com/mariusbegby/cadence-discord-bot/commit/6b484919768b3477e91c002db5fc2f45cdf4436a))

## [3.7.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.7.0...v3.7.1) (2023-08-12)


### Minor changes and bug fixes

* remove unused import ([3e6dc6e](https://github.com/mariusbegby/cadence-discord-bot/commit/3e6dc6e926ddfda3ce70c0b3a5725c9d0d957e80))

## [3.7.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.6.5...v3.7.0) (2023-08-12)


### Features

* Change from yt-stream to @distube/ytdl-core for streaming audio ([fa15af5](https://github.com/mariusbegby/cadence-discord-bot/commit/fa15af5b1445c6c7ec5f2ea68cbefa5fe5c2b190))

## [3.6.5](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.6.4...v3.6.5) (2023-08-11)


### Minor changes and bug fixes

* Updated dependencies, use discord-player new dev versions ([c04b3c9](https://github.com/mariusbegby/cadence-discord-bot/commit/c04b3c944cc5aaf39e320b3ce8358bc7f9f5c6d2))

## [3.6.4](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.6.3...v3.6.4) (2023-08-08)


### Minor changes and bug fixes

* Updated dependencies ([7b8f86b](https://github.com/mariusbegby/cadence-discord-bot/commit/7b8f86bd1d933ab98acce719303e390a01312f91))


### Miscellaneous

* **deps:** bump discord.js from 14.11.0 to 14.12.1 ([f799c95](https://github.com/mariusbegby/cadence-discord-bot/commit/f799c955a9c8cc2d1800375e08de7110b6bab5ec))
* **deps:** bump pino from 8.14.2 to 8.15.0 ([39a3362](https://github.com/mariusbegby/cadence-discord-bot/commit/39a336248e098a00c3323ee4319ad725fdbb8f6b))

## [3.6.3](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.6.2...v3.6.3) (2023-08-01)


### Miscellaneous

* add workflow for auto adding contributors to readme ([fa7146e](https://github.com/mariusbegby/cadence-discord-bot/commit/fa7146ea98defc4615d598be96697ed9bbb1ec47))
* **deps-dev:** bump eslint from 8.45.0 to 8.46.0 ([50587b5](https://github.com/mariusbegby/cadence-discord-bot/commit/50587b533956b0ab218d78603c62ca8f099b9fbc))
* **deps:** bump pino from 8.14.1 to 8.14.2 ([493e374](https://github.com/mariusbegby/cadence-discord-bot/commit/493e374a9d1c5d5e3f6fcbe466cc6ea2ac6f9eea))

## [3.6.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.6.1...v3.6.2) (2023-07-30)


### Minor changes and bug fixes

* Updated depdendencies ([de74bb0](https://github.com/mariusbegby/cadence-discord-bot/commit/de74bb0c2d5a85c5309d0dd44c4f47b3ff588de6))

## [3.6.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.6.0...v3.6.1) (2023-07-28)


### Minor changes and bug fixes

* enforce max character length of 100 for name and value in autocomplete ([724f407](https://github.com/mariusbegby/cadence-discord-bot/commit/724f40755a58c0c87dfc1d055f93f2809fbefa13))
* fixed lyrics being cut off ([002f520](https://github.com/mariusbegby/cadence-discord-bot/commit/002f520e8e0b8d2468828f3dbe9486213c728d3c))

## [3.6.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.5.0...v3.6.0) (2023-07-27)


### Features

* Added /lyrics command ([1dcc9e0](https://github.com/mariusbegby/cadence-discord-bot/commit/1dcc9e00b87935eead3b52899d360393b5c49792))


### Minor changes and bug fixes

* Also validate is user is in same voice channel as bot for commands ([311e141](https://github.com/mariusbegby/cadence-discord-bot/commit/311e1419922c4fc7a02952bda772ce705e567736))
* Improvement to play command autocomplete search ([f590558](https://github.com/mariusbegby/cadence-discord-bot/commit/f59055807f9a7170edab5d476e370575ba09803a))


### Miscellaneous

* remove comment and rewrite text ([0887a47](https://github.com/mariusbegby/cadence-discord-bot/commit/0887a47af94d3bc4b2e6865de8d41040c5369a24))
* update isNew status for stop command ([0d003a8](https://github.com/mariusbegby/cadence-discord-bot/commit/0d003a868bf509209400b56714aadab8b32ca3df))

## [3.5.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.4.0...v3.5.0) (2023-07-27)


### Features

* Added reload command ([2c5d5ec](https://github.com/mariusbegby/cadence-discord-bot/commit/2c5d5ec3a5029062aa85c1276eb1d579962cc8d7))


### Minor changes and bug fixes

* Fixed error when no thumbnail available ([80f26af](https://github.com/mariusbegby/cadence-discord-bot/commit/80f26af2427f91dea6ef155a7139348318fd370a))
* update filter property name to correct name ([8b0c0e3](https://github.com/mariusbegby/cadence-discord-bot/commit/8b0c0e3d547bdb0b097964e8a687861d3025427c))


### Miscellaneous

* make text for track amount bold ([76d1177](https://github.com/mariusbegby/cadence-discord-bot/commit/76d11772987f8484c5da7ed0be4e5688f7b1d935))

## [3.4.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.3.2...v3.4.0) (2023-07-26)


### Features

* added /shuffle command ([83d5336](https://github.com/mariusbegby/cadence-discord-bot/commit/83d5336e176c212982a72e3fe0da157fa254b690))


### Miscellaneous

* update shuffle command description ([18a88ec](https://github.com/mariusbegby/cadence-discord-bot/commit/18a88ec78296a6dd9445f19fd2c0bc69adfd3ee8))

## [3.3.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.3.1...v3.3.2) (2023-07-26)


### Minor changes and bug fixes

* handle "all" yt warnings requiring confirmations ([215d36e](https://github.com/mariusbegby/cadence-discord-bot/commit/215d36e9e4b3e902449fa28e088d306e2d4d1f7c))

## [3.3.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.3.0...v3.3.1) (2023-07-26)


### Minor changes and bug fixes

* add support for new site and auto post shard count and member count ([8713baa](https://github.com/mariusbegby/cadence-discord-bot/commit/8713baa6578c33c746d799b5613312d3ce34f340))

## [3.3.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.2.4...v3.3.0) (2023-07-25)


### Features

* Added options for load testing to automatically play music in specified channels ([8e04d59](https://github.com/mariusbegby/cadence-discord-bot/commit/8e04d59a6a34665ef4f3183cee9ed67f4172bd91))

## [3.2.4](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.2.3...v3.2.4) (2023-07-25)


### Minor changes and bug fixes

* Additional handling of autocomplete interaction errors ([524b4d2](https://github.com/mariusbegby/cadence-discord-bot/commit/524b4d2f30d8da5b01b2488ae3d5de680545393d))
* Possibly fix interaction not reply errors ([36c5a15](https://github.com/mariusbegby/cadence-discord-bot/commit/36c5a15f11735de38304da0a7f445e629092208f))

## [3.2.3](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.2.2...v3.2.3) (2023-07-24)


### Minor changes and bug fixes

* don't run  permission validation on autocomplete interactions ([fd63691](https://github.com/mariusbegby/cadence-discord-bot/commit/fd6369169ba62eb8f72f2bec126dc0e984bee81c))
* don't warn user about execution time ([3b842f3](https://github.com/mariusbegby/cadence-discord-bot/commit/3b842f3cd549f946bb64f55ec6f4d56cc3980702))
* Update to 300 seconds timeout for collectorFilters ([57bc6c8](https://github.com/mariusbegby/cadence-discord-bot/commit/57bc6c8d3fb0282fcb55f46c06b73a90b166723f))

## [3.2.2](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.2.1...v3.2.2) (2023-07-24)


### Minor changes and bug fixes

* Handle max queue size in /play command when adding large playlists. ([8e42f75](https://github.com/mariusbegby/cadence-discord-bot/commit/8e42f755e76f033a4f11c07b2ee1a235edc50fdc))

## [3.2.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.2.0...v3.2.1) (2023-07-24)


### Minor changes and bug fixes

* Added configurable options for buffering and connection timeout ([15ecca7](https://github.com/mariusbegby/cadence-discord-bot/commit/15ecca7c05da3d33563da789056a29dc1463de42))
* Added Normalizer as filter, fixed bug with bassboost filter enabling normalizing filter not working properly ([21b15a1](https://github.com/mariusbegby/cadence-discord-bot/commit/21b15a10a03d1f8df243c09afa18c7b9fb00247b))
* also show emoji for enabled filters, show to user that normalizer gets enabled when selecting bass boost. ([aebc726](https://github.com/mariusbegby/cadence-discord-bot/commit/aebc726e457f6c687051f7b37f548fb1ed919b4e))
* enable normalizer filter when bassboost is chosen ([b236371](https://github.com/mariusbegby/cadence-discord-bot/commit/b236371abc30741cbc02a8f0faf80263d76a9226))

## [3.2.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.1.1...v3.2.0) (2023-07-23)


### Features

* Added /status user command, updated /systemstatus command ([831ff04](https://github.com/mariusbegby/cadence-discord-bot/commit/831ff047815a8e7abf6bbb7566416d9092bc28c6))
* added status of active voice connections, tracks in queues and listeners across shards ([88ac919](https://github.com/mariusbegby/cadence-discord-bot/commit/88ac919d67ef11258f97c599125ed7b1ba806775))
* Updated /help command to be dynamic ([b95a652](https://github.com/mariusbegby/cadence-discord-bot/commit/b95a652f1c18f1816a4a47c3197549487f33e545))


### Minor changes and bug fixes

* create copy of status system command to be used by users ([aa82c6d](https://github.com/mariusbegby/cadence-discord-bot/commit/aa82c6d44ddc11c698af4ee775b811a1ca72b038))
* make player accessible globally for use in sharding eval ([bcc0c92](https://github.com/mariusbegby/cadence-discord-bot/commit/bcc0c926ac1c382ca1a8e4c8b41326f6325049ea))

## [3.1.1](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.1.0...v3.1.1) (2023-07-23)


### Minor changes and bug fixes

* fixed loop mode will continue playing tracks after /stop ([ab38f85](https://github.com/mariusbegby/cadence-discord-bot/commit/ab38f851e49caa0bf5c989b5d5a9ca842be3f96e))
* Fixed name field in response can be over 100 characters. ([3c522df](https://github.com/mariusbegby/cadence-discord-bot/commit/3c522df54acee8ad5b501f134fa411700f21ccfc))

## [3.1.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v3.0.0...v3.1.0) (2023-07-23)


### Features

* added /stop command ([3c52841](https://github.com/mariusbegby/cadence-discord-bot/commit/3c52841cd6f221ef549c06cdc90aac45f581633e))
* Autocomplete queries in /play command ([025715c](https://github.com/mariusbegby/cadence-discord-bot/commit/025715c0da58ad967736e8fd33ee089068385ff2))
* Renamed validator files and added permission validator ([b68b7da](https://github.com/mariusbegby/cadence-discord-bot/commit/b68b7dac95d564cf1fccc314f74e968e94adc3ae))


### Minor changes and bug fixes

* add logging for youtube confirmation errors ([50f4157](https://github.com/mariusbegby/cadence-discord-bot/commit/50f4157648787dde248d8bf8683b905b5e3fef23))
* Added check on text channel permissions on intereactionCreate ([0c7a627](https://github.com/mariusbegby/cadence-discord-bot/commit/0c7a627e83a4769c6cc61b6b59ca8630ebcb4f12))
* Added new /stop command to /help list ([e2ea990](https://github.com/mariusbegby/cadence-discord-bot/commit/e2ea9907dd69c198fb764af71a635b7adf188f84))
* Handle youtube graphic or violent imagery warning ([cef6b7f](https://github.com/mariusbegby/cadence-discord-bot/commit/cef6b7f1411ddcf04afe48e4ee95d1d224476e63))

## [3.0.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v2.3.0...v3.0.0) (2023-07-21)


### ⚠ BREAKING CHANGES

* Sharding implemented across the bot

### Features

* add sharding with discord.js ([006f2fa](https://github.com/mariusbegby/cadence-discord-bot/commit/006f2fab512399c9425add10dd62a2b8f6b70f0a))
* Sharding implemented across the bot ([9c15c63](https://github.com/mariusbegby/cadence-discord-bot/commit/9c15c636d9fa5761f649b51693b027418c02a640))
* update ready events to handle sharding ([184b528](https://github.com/mariusbegby/cadence-discord-bot/commit/184b528f56f36df00f0e1366a531bad42ea18779))
* Updated /guilds and /status (partly) to use sharding for values ([8f1d253](https://github.com/mariusbegby/cadence-discord-bot/commit/8f1d253dc9ddaef70928aab06ae0b8d4d05c7d42))
* Updated logging for guildCreate and guildDelete for sharding ([b160cbf](https://github.com/mariusbegby/cadence-discord-bot/commit/b160cbf564d5f8bf6c84e7d9a3b34b8ecd8e5874))


### Minor changes and bug fixes

* Actually updated example config with configurable status ([1e7d723](https://github.com/mariusbegby/cadence-discord-bot/commit/1e7d723aef2871fd23aa31ac05e78e94d40cb038))
* Add configurable status/presence options into config.js ([5f456da](https://github.com/mariusbegby/cadence-discord-bot/commit/5f456daf67b2f57330922bcd0123cfd8fa5ba007))

## [2.3.0](https://github.com/mariusbegby/cadence-discord-bot/compare/v2.2.3...v2.3.0) (2023-07-20)


### Features

* changed yt cookie name  in .env arguments ([e3b945b](https://github.com/mariusbegby/cadence-discord-bot/commit/e3b945bcecef1c11f2b6ebeda4696bfc34572673))


### Minor changes and bug fixes

* add error handling to registering commands on startup ([e251299](https://github.com/mariusbegby/cadence-discord-bot/commit/e251299c0c9f3f8b147a66843cb317fb3229bb4b))
* Added try/catch around createClient and createPlayer factory functions ([4e81451](https://github.com/mariusbegby/cadence-discord-bot/commit/4e8145151fe9b7595036ffcd849836c080c198b9))
* More input validation in deploying system commands ([85cfad8](https://github.com/mariusbegby/cadence-discord-bot/commit/85cfad8e51571eb05ee10ad06c7e94717d4fc80e))
* Small changes to deploying system commands ([3292c88](https://github.com/mariusbegby/cadence-discord-bot/commit/3292c889ec87a30fd5b3e557c8775cae604cae32))
* Update mediaplex and extractor to latest dev versions ([72f3690](https://github.com/mariusbegby/cadence-discord-bot/commit/72f3690bb3a354feba9d8c2f1404068b59ac62f4))


### Miscellaneous

* Update README.md with pm2 instructions ([342e861](https://github.com/mariusbegby/cadence-discord-bot/commit/342e86147a2a509ba097f358fe179716dd5fc461))

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
