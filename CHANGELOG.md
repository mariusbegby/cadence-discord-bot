# Changelog

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
