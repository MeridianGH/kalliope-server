# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [2.3.0](https://github.com/MeridianGH/kalliope-server/compare/2.2.0...2.3.0) (2024-10-09)


### Features

* implement page title hook to fix title reset ([77ba433](https://github.com/MeridianGH/kalliope-server/commit/77ba4332aba4aa094de13b7cef8d15c633fc9ab6))
* improve websocket closure handling ([62df3c0](https://github.com/MeridianGH/kalliope-server/commit/62df3c0484a8bc225f471b0c29e22f1c37eed241))
* track functions are now accessible on mobile ([b6c119c](https://github.com/MeridianGH/kalliope-server/commit/b6c119c1a7376bf1db3a48993275e5b122927db0))
* work on mobile feature accessibility ([c40699e](https://github.com/MeridianGH/kalliope-server/commit/c40699e0981c434fdf01d96383cef3799a3edab1))


### Bug Fixes

* current song link is not clickable in some places ([d92e3f3](https://github.com/MeridianGH/kalliope-server/commit/d92e3f38f161536daecad2a852f2ebdfc4ded166))
* export types for correct docs generation ([b12a63d](https://github.com/MeridianGH/kalliope-server/commit/b12a63d4bf9866ffcb70f08b8a10b69a579a518f))
* toast hidden behind playerbar ([848cbf6](https://github.com/MeridianGH/kalliope-server/commit/848cbf64ac59121726e231aac4a943efb817799b))
* various layout fixes ([bd3a90c](https://github.com/MeridianGH/kalliope-server/commit/bd3a90c24d90df9709845e72252edf96a0951207))

## [2.2.0](https://github.com/MeridianGH/kalliope-server/compare/2.1.0...2.2.0) (2024-07-15)

## [2.1.0](https://github.com/MeridianGH/kalliope-server/compare/2.0.0...2.1.0) (2024-07-15)


### Features

* add drag-and-drop feature for queue ([50d0c6f](https://github.com/MeridianGH/kalliope-server/commit/50d0c6f81080dcf40b26a1c104490ca68364cda4))
* automatically resend request if page loads before websocket ([858cd09](https://github.com/MeridianGH/kalliope-server/commit/858cd09cec8ad579c3dceb912673806d8b9888b8))
* fix some more styles ([25ca343](https://github.com/MeridianGH/kalliope-server/commit/25ca343e318001ae3514df9cf8551c168a7e4386))
* improve keyboard highlighting on sidebar ([22b495d](https://github.com/MeridianGH/kalliope-server/commit/22b495d02e351822ebe6dd8c5c535d27953b245a))
* improve loading button ([ecb364a](https://github.com/MeridianGH/kalliope-server/commit/ecb364ae1486d5f78590c8ac2d434d70b7d7f5ca))
* improve queue buttons styling ([5c64eba](https://github.com/MeridianGH/kalliope-server/commit/5c64eba66051e7dd9d29cf6bad4d8c2198279de4))
* improve styling and work on channel join feature ([0584814](https://github.com/MeridianGH/kalliope-server/commit/0584814f6cb786f6d1eaf18e063c66c2f9ee1d86))
* migrate to phosphoricons ([36fee60](https://github.com/MeridianGH/kalliope-server/commit/36fee603d563895eccf1a1e930b6d26d21f364f0))
* reimplement dynamic color ([d914bdb](https://github.com/MeridianGH/kalliope-server/commit/d914bdbda302b235140d9afc241baca7f5482c37))
* start work on new dashboard ([d21d5ac](https://github.com/MeridianGH/kalliope-server/commit/d21d5acd3bed8775201418d69f5979c5c2f4774f))
* styling improvements ([4f268b1](https://github.com/MeridianGH/kalliope-server/commit/4f268b199116955ce4b6ac8a1ecd8957aaca10be))
* support browser navigation for expanding/collapsing ([80980b4](https://github.com/MeridianGH/kalliope-server/commit/80980b463c603687b4d1e496aa33cdd04c0ce441))
* update API urls ([e204a39](https://github.com/MeridianGH/kalliope-server/commit/e204a396a405cf6a6cf91b6e3539cf1707a0f2f1))
* use dominant color in less places ([756c31d](https://github.com/MeridianGH/kalliope-server/commit/756c31d19f061c35369a44b0b550c329c1964392))
* use dynamic loading button size ([8cdb9c0](https://github.com/MeridianGH/kalliope-server/commit/8cdb9c01a9ec84d4dc498aecf69212c0613dce25))
* various fixes and improvements ([b233449](https://github.com/MeridianGH/kalliope-server/commit/b233449db2fd9d0b7d049a7cafc6ca0ceae9dfa4))
* work on loading button ([79ff98d](https://github.com/MeridianGH/kalliope-server/commit/79ff98d0053eba637db07e2ed03ae5ee7e9e509f))
* work on mobile dashboard ([35b5bf3](https://github.com/MeridianGH/kalliope-server/commit/35b5bf32c751be64783decd74e866bff48a19b3c))


### Bug Fixes

* add missing dots in titles ([0f475d9](https://github.com/MeridianGH/kalliope-server/commit/0f475d93c5006de0c3264449c966fee719ac96ef))
* color conversion not working with alpha ([9ae753b](https://github.com/MeridianGH/kalliope-server/commit/9ae753b9ed0e94095d37198189e6cabd37c80ab6))
* guildClientMap conflict log showing on client register ([c4b8407](https://github.com/MeridianGH/kalliope-server/commit/c4b8407f7cda73b1314265fabea324506894b9df))
* ignore version mismatch with clientData ([b4c9f75](https://github.com/MeridianGH/kalliope-server/commit/b4c9f750e0b40f70c616a75462a59dd707728083))
* make synchronous click handlers async ([9838f86](https://github.com/MeridianGH/kalliope-server/commit/9838f86f8c5877cbea150b771355b77fb45ce46d))
* no player was requested on guild selection ([13dd0a5](https://github.com/MeridianGH/kalliope-server/commit/13dd0a5fcf597840bf964545231efd2cf4a4bd18))
* position did not change properly ([2ca3ca1](https://github.com/MeridianGH/kalliope-server/commit/2ca3ca11e2fb8079d59e673c19b693f03d6d1269))
* update debug logs ([15e9c00](https://github.com/MeridianGH/kalliope-server/commit/15e9c0084ab37099ff03abb1d363a7a0b2d5a1b4))
* various fixes ([a58affa](https://github.com/MeridianGH/kalliope-server/commit/a58affa580a60f5cef1cc885b362c415c68728fa))

## [2.0.0](https://github.com/MeridianGH/kalliope-server/compare/a2eb8009726b9d147d467776d384f960d0cf6caf...2.0.0) (2024-06-05)


### Features

* add commitlint ([a2eb800](https://github.com/MeridianGH/kalliope-server/commit/a2eb8009726b9d147d467776d384f960d0cf6caf))
* add scope-enum to commitlint config ([c5f6098](https://github.com/MeridianGH/kalliope-server/commit/c5f6098df033cf7016025c5f1ef3158cb2b1c4bc))


### Bug Fixes

* cursor on home feature cards ([a0bf518](https://github.com/MeridianGH/kalliope-server/commit/a0bf51810ebfe444bef322bf1f220bca7cbfa9f1))
* display real track name instead of query on queue add toast ([f08df29](https://github.com/MeridianGH/kalliope-server/commit/f08df2902a9491b770279659505d312044ee1f91))
* husky not working for GH Desktop ([40c568c](https://github.com/MeridianGH/kalliope-server/commit/40c568cb68faf1ecb9860df2115b549ff298714f))
