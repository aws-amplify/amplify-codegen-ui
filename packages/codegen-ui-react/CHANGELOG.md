# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.6.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.5.8...v2.6.0) (2022-12-14)


### Bug Fixes

* make textfield a controlled component ([#830](https://github.com/aws-amplify/amplify-codegen-ui/issues/830)) ([1dcda83](https://github.com/aws-amplify/amplify-codegen-ui/commit/1dcda8390aab1539f607474885a98526763828a9))


### Features

* disable form submit when model is invalid ([#826](https://github.com/aws-amplify/amplify-codegen-ui/issues/826)) ([6898d10](https://github.com/aws-amplify/amplify-codegen-ui/commit/6898d108547fa84484364ccaf699f6f94f1fb25e))





## [2.5.8](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.5.7...v2.5.8) (2022-12-08)


### Bug Fixes

* update import file path to handle aliased children ([#814](https://github.com/aws-amplify/amplify-codegen-ui/issues/814)) ([ffe7659](https://github.com/aws-amplify/amplify-codegen-ui/commit/ffe765970e7e26579790c9e1a9fc006624c660dc))





## [2.5.7](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.5.6...v2.5.7) (2022-12-06)


### Bug Fixes

* have rest props override variant values ([6df4d94](https://github.com/aws-amplify/amplify-codegen-ui/commit/6df4d94ea31465e36a1a293d5fdb6bd85829368a))





## [2.5.6](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.5.5...v2.5.6) (2022-11-23)


### Bug Fixes

* improve runtime safety for usage of the in operator ([fa3e09a](https://github.com/aws-amplify/amplify-codegen-ui/commit/fa3e09aaad4872c634d47fc3c4b73fb8f0e1b204))
* nested boolean field isn't controlled ([#783](https://github.com/aws-amplify/amplify-codegen-ui/issues/783)) ([fb943e8](https://github.com/aws-amplify/amplify-codegen-ui/commit/fb943e86328cb84c1afea73a854a854c6c9f29fd))





## [2.5.5](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.5.4...v2.5.5) (2022-11-18)


### Bug Fixes

* fix grammar in pull warning message ([#758](https://github.com/aws-amplify/amplify-codegen-ui/issues/758)) ([5e06e62](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e06e626390b2fdcd0d7c3939baed589e4dd82cf))
* fix typo in required dependency provider ([f62a8ad](https://github.com/aws-amplify/amplify-codegen-ui/commit/f62a8ad127dbe7fe2d6a874f09f07beabe5c627a))
* fix value passed to onChange override ([d30aacf](https://github.com/aws-amplify/amplify-codegen-ui/commit/d30aacfa717ed28e45de0f11e3738803bec90846))
* fix variables for nested arrays ([3559c31](https://github.com/aws-amplify/amplify-codegen-ui/commit/3559c31779239883755b110646c9e59bcbab25ac))
* generate gap attribute for CTA row ([e658019](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6580193652ef47ee2a0219f22927c96443937b7))
* remove stringify for json type array initial value ([#753](https://github.com/aws-amplify/amplify-codegen-ui/issues/753)) ([362564f](https://github.com/aws-amplify/amplify-codegen-ui/commit/362564f571bf5a5027b9fb97ffbd94dfed6501c5))
* stringify existing AWSJSON field value ([#754](https://github.com/aws-amplify/amplify-codegen-ui/issues/754)) ([e3e285d](https://github.com/aws-amplify/amplify-codegen-ui/commit/e3e285d42b94765d787fe160022d3986614009ef))
* update model used ([ad0beda](https://github.com/aws-amplify/amplify-codegen-ui/commit/ad0beda3f05b086bdd4347589b4f8bde243be07a))
* update snapshot ([3b86a7b](https://github.com/aws-amplify/amplify-codegen-ui/commit/3b86a7b23f0a62ddf0c402f107eab7e57cce562e))


### Reverts

* Revert "fix: refresh stale data on update form" ([b1444cd](https://github.com/aws-amplify/amplify-codegen-ui/commit/b1444cd564fd9c1908d730489a3402407d27a934))





## [2.5.4](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.5.2...v2.5.4) (2022-11-07)

### Bug Fixes

- alias model names collision with component types ([#733](https://github.com/aws-amplify/amplify-codegen-ui/issues/733)) ([ec0167d](https://github.com/aws-amplify/amplify-codegen-ui/commit/ec0167d5a13cc89988df242ec637078283af1faa)), closes [#730](https://github.com/aws-amplify/amplify-codegen-ui/issues/730)
- allow empty string for url field ([#735](https://github.com/aws-amplify/amplify-codegen-ui/issues/735)) ([ba2bb1d](https://github.com/aws-amplify/amplify-codegen-ui/commit/ba2bb1d4a86f135bb309b1e47ac9efb25376aef9)), closes [#730](https://github.com/aws-amplify/amplify-codegen-ui/issues/730)
- forms checkbox to reflect correct model state ([#738](https://github.com/aws-amplify/amplify-codegen-ui/issues/738)) ([db310d7](https://github.com/aws-amplify/amplify-codegen-ui/commit/db310d7865cc7f23a41d4c619ad5d7a2062df3be))
- less than char validation ([#739](https://github.com/aws-amplify/amplify-codegen-ui/issues/739)) ([ba1f175](https://github.com/aws-amplify/amplify-codegen-ui/commit/ba1f17542451aaab8e7d5ad449b3e03cc5e05b74))
- refresh stale data on update form ([7ab3126](https://github.com/aws-amplify/amplify-codegen-ui/commit/7ab3126a0c9ef9e38fc4295dbb56e628c0dcdeb5))
- support nested arrays ([c4ab231](https://github.com/aws-amplify/amplify-codegen-ui/commit/c4ab23133354274c0cee7ebfb192c6b564da9e08))

### Features

- allow style related props ([3921f71](https://github.com/aws-amplify/amplify-codegen-ui/commit/3921f71620ad49922849c01926814113468ef816))
- expander init ([#725](https://github.com/aws-amplify/amplify-codegen-ui/issues/725)) ([bad7b04](https://github.com/aws-amplify/amplify-codegen-ui/commit/bad7b04cb84e45050dd016db36eb055b2be5cfc1))
- render default theme option ([#749](https://github.com/aws-amplify/amplify-codegen-ui/issues/749)) ([11e08dd](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e08dd20338561e660ac1a38c85396cde5a0a34))

## [2.5.3](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.5.2...v2.5.3) (2022-11-04)

### Bug Fixes

- alias model names collision with component types ([#733](https://github.com/aws-amplify/amplify-codegen-ui/issues/733)) ([ec0167d](https://github.com/aws-amplify/amplify-codegen-ui/commit/ec0167d5a13cc89988df242ec637078283af1faa)), closes [#730](https://github.com/aws-amplify/amplify-codegen-ui/issues/730)
- allow empty string for url field ([#735](https://github.com/aws-amplify/amplify-codegen-ui/issues/735)) ([ba2bb1d](https://github.com/aws-amplify/amplify-codegen-ui/commit/ba2bb1d4a86f135bb309b1e47ac9efb25376aef9)), closes [#730](https://github.com/aws-amplify/amplify-codegen-ui/issues/730)
- forms checkbox to reflect correct model state ([#738](https://github.com/aws-amplify/amplify-codegen-ui/issues/738)) ([db310d7](https://github.com/aws-amplify/amplify-codegen-ui/commit/db310d7865cc7f23a41d4c619ad5d7a2062df3be))
- less than char validation ([#739](https://github.com/aws-amplify/amplify-codegen-ui/issues/739)) ([ba1f175](https://github.com/aws-amplify/amplify-codegen-ui/commit/ba1f17542451aaab8e7d5ad449b3e03cc5e05b74))
- refresh stale data on update form ([7ab3126](https://github.com/aws-amplify/amplify-codegen-ui/commit/7ab3126a0c9ef9e38fc4295dbb56e628c0dcdeb5))
- support nested arrays ([c4ab231](https://github.com/aws-amplify/amplify-codegen-ui/commit/c4ab23133354274c0cee7ebfb192c6b564da9e08))

### Features

- allow style related props ([3921f71](https://github.com/aws-amplify/amplify-codegen-ui/commit/3921f71620ad49922849c01926814113468ef816))
- expander init ([#725](https://github.com/aws-amplify/amplify-codegen-ui/issues/725)) ([bad7b04](https://github.com/aws-amplify/amplify-codegen-ui/commit/bad7b04cb84e45050dd016db36eb055b2be5cfc1))

## [2.5.2](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.4.1...v2.5.2) (2022-10-18)

### Bug Fixes

- add datastore as dev dep ([#708](https://github.com/aws-amplify/amplify-codegen-ui/issues/708)) ([e4ce2e9](https://github.com/aws-amplify/amplify-codegen-ui/commit/e4ce2e993bfb542daee1c1755f7d6528487823bf))
- allow float to have decimals ([#704](https://github.com/aws-amplify/amplify-codegen-ui/issues/704)) ([2edfafa](https://github.com/aws-amplify/amplify-codegen-ui/commit/2edfafa802870f1afecf6fa72f48bad340330c67))
- do not parse AWSJSON for submit ([#703](https://github.com/aws-amplify/amplify-codegen-ui/issues/703)) ([9b7377a](https://github.com/aws-amplify/amplify-codegen-ui/commit/9b7377a5d95468889e6ac5b9a33193666437c152))
- fix dependency ([95979eb](https://github.com/aws-amplify/amplify-codegen-ui/commit/95979eb3baa672ab98acbd8cf7fcdb12184b8f98))
- make ArrayField children value controlled again ([f3e639c](https://github.com/aws-amplify/amplify-codegen-ui/commit/f3e639c8f38c6dcf3d368952571229f779212ff8))
- minimize type usage of datastore ([#701](https://github.com/aws-amplify/amplify-codegen-ui/issues/701)) ([40b0f23](https://github.com/aws-amplify/amplify-codegen-ui/commit/40b0f231d4e42cdcdbcb0e74580a34a03952eb18))

## [2.5.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.4.1...v2.5.1) (2022-10-12)

### Bug Fixes

- fix dependency ([95979eb](https://github.com/aws-amplify/amplify-codegen-ui/commit/95979eb3baa672ab98acbd8cf7fcdb12184b8f98))
- minimize type usage of datastore ([#701](https://github.com/aws-amplify/amplify-codegen-ui/issues/701)) ([40b0f23](https://github.com/aws-amplify/amplify-codegen-ui/commit/40b0f231d4e42cdcdbcb0e74580a34a03952eb18))

# [2.5.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.4.2...v2.5.0) (2022-10-12)

**Note:** Version bump only for package @aws-amplify/codegen-ui-react

## [2.4.2](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.4.1...v2.4.2) (2022-10-11)

### Bug Fixes

- limit workers during testing in ci ([#531](https://github.com/aws-amplify/amplify-codegen-ui/issues/531)) ([be36527](https://github.com/aws-amplify/amplify-codegen-ui/commit/be36527e86e76360e3368daa62ece4f9616bd69d))

## [2.4.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.3.1...v2.4.1) (2022-09-20)

**Note:** Version bump only for package @aws-amplify/codegen-ui-react

# [2.4.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.3.1...v2.4.0) (2022-09-19)

### Bug Fixes

- limit workers during testing in ci ([#531](https://github.com/aws-amplify/amplify-codegen-ui/issues/531)) ([be36527](https://github.com/aws-amplify/amplify-codegen-ui/commit/be36527e86e76360e3368daa62ece4f9616bd69d))

## [2.3.2](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.3.1...v2.3.2) (2022-07-22)

### Bug Fixes

- limit workers during testing in ci ([#531](https://github.com/aws-amplify/amplify-codegen-ui/issues/531)) ([be36527](https://github.com/aws-amplify/amplify-codegen-ui/commit/be36527e86e76360e3368daa62ece4f9616bd69d))

## [2.4.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.3.1...v2.4.1) (2022-09-20)

**Note:** Version bump only for package @aws-amplify/codegen-ui-react

# [2.4.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.3.1...v2.4.0) (2022-09-19)

### Bug Fixes

- limit workers during testing in ci ([#531](https://github.com/aws-amplify/amplify-codegen-ui/issues/531)) ([be36527](https://github.com/aws-amplify/amplify-codegen-ui/commit/be36527e86e76360e3368daa62ece4f9616bd69d))

## [2.3.2](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.3.1...v2.3.2) (2022-07-22)

### Bug Fixes

- limit workers during testing in ci ([#531](https://github.com/aws-amplify/amplify-codegen-ui/issues/531)) ([be36527](https://github.com/aws-amplify/amplify-codegen-ui/commit/be36527e86e76360e3368daa62ece4f9616bd69d))

## [2.3.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.3.0...v2.3.1) (2022-07-15)

### Bug Fixes

- change recommended ui-react version to ^3.1.0 ([#521](https://github.com/aws-amplify/amplify-codegen-ui/issues/521)) ([33b6d06](https://github.com/aws-amplify/amplify-codegen-ui/commit/33b6d0658b87acd1e6eadc8ae3cb8629b2258b4b))

# [2.3.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.2.1...v2.3.0) (2022-07-14)

### Bug Fixes

- handle auth prop in concat ([f7d645e](https://github.com/aws-amplify/amplify-codegen-ui/commit/f7d645e07e91848465e92f450e81d6ed92604057))

### Features

- adding breakpoint functionality in theme generation ([#515](https://github.com/aws-amplify/amplify-codegen-ui/issues/515)) ([28f97aa](https://github.com/aws-amplify/amplify-codegen-ui/commit/28f97aa7a290e3fd25efc6f0d51a39403d79b947))

## [2.2.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.2.0...v2.2.1) (2022-06-15)

**Note:** Version bump only for package @aws-amplify/codegen-ui-react

# [2.2.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.1.2...v2.2.0) (2022-04-13)

### Bug Fixes

- remove hook from conditional statement ([#455](https://github.com/aws-amplify/amplify-codegen-ui/issues/455)) ([5b05377](https://github.com/aws-amplify/amplify-codegen-ui/commit/5b053772e3e018957c47c28962d09f843bdaad84))
- remove jsx ext from declaration file ext ([#458](https://github.com/aws-amplify/amplify-codegen-ui/issues/458)) ([e4062c8](https://github.com/aws-amplify/amplify-codegen-ui/commit/e4062c8760b3c850125c7ab5c6ae7d4e2258c598))

### Features

- rev required minimum version of ui-react ([#462](https://github.com/aws-amplify/amplify-codegen-ui/issues/462)) ([d33f873](https://github.com/aws-amplify/amplify-codegen-ui/commit/d33f8736d4a51344a6d5e4f2b8cbbadca6e17b83))
- support type casting for DataStore hooks ([#460](https://github.com/aws-amplify/amplify-codegen-ui/issues/460)) ([79953c5](https://github.com/aws-amplify/amplify-codegen-ui/commit/79953c5d7dfd20d68238089fe9900532f1e9e0e6))

## [2.1.2](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.1.1...v2.1.2) (2022-03-03)

### Bug Fixes

- revert export aliased component name on data model collision ([0cc5422](https://github.com/aws-amplify/amplify-codegen-ui/commit/0cc5422a4e019dc97b5e5817f1e6fdeea883e713))

## [2.1.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.1.0...v2.1.1) (2022-03-02)

### Bug Fixes

- export aliased component name on data model collision ([63e5317](https://github.com/aws-amplify/amplify-codegen-ui/commit/63e53178dc8e284990c1bbfdb1ad192be633cb7c))

# [2.1.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.0.0...v2.1.0) (2022-03-01)

### Bug Fixes

- address reserved keywords in bindings ([#431](https://github.com/aws-amplify/amplify-codegen-ui/issues/431)) ([fd0a2a5](https://github.com/aws-amplify/amplify-codegen-ui/commit/fd0a2a599b68e17c0e66663d16451dc5541cf137))
- use react style event names ([#445](https://github.com/aws-amplify/amplify-codegen-ui/issues/445)) ([6396930](https://github.com/aws-amplify/amplify-codegen-ui/commit/639693067f7d08e405f8265acbd6e0229da78cfc))

### Features

- replace non-alpha characters with description ([#440](https://github.com/aws-amplify/amplify-codegen-ui/issues/440)) ([d25c3b8](https://github.com/aws-amplify/amplify-codegen-ui/commit/d25c3b85fed3c33503935023880ab102c6f77ce3))

# [2.0.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v1.2.0...v2.0.0) (2022-02-25)

### Bug Fixes

- add missing import statement, and correct controlled component state tracking ([#374](https://github.com/aws-amplify/amplify-codegen-ui/issues/374)) ([f6dfa0f](https://github.com/aws-amplify/amplify-codegen-ui/commit/f6dfa0fc26a7dbb65746c0ecb900404d1c4a9159))
- add override for stepper field controlled change event ([#389](https://github.com/aws-amplify/amplify-codegen-ui/issues/389)) ([ebd2542](https://github.com/aws-amplify/amplify-codegen-ui/commit/ebd2542bb39416a4403c72274a68069235b8fedc))
- add state for state reference in set state param ([#397](https://github.com/aws-amplify/amplify-codegen-ui/issues/397)) ([3a031b6](https://github.com/aws-amplify/amplify-codegen-ui/commit/3a031b616113199e30215cb6a55ca165e7546a7c))
- allow operand type to be specified in ConditionalStudioComponentProperty ([#335](https://github.com/aws-amplify/amplify-codegen-ui/issues/335)) ([3b3932b](https://github.com/aws-amplify/amplify-codegen-ui/commit/3b3932bf3824a63043700034e7d4d74fd8f329d9))
- bringing action names back inline with external model ([#382](https://github.com/aws-amplify/amplify-codegen-ui/issues/382)) ([91f6786](https://github.com/aws-amplify/amplify-codegen-ui/commit/91f678614e242e762ca5217cd3fee12d461f844c))
- do not swallow prettier.format errors ([#321](https://github.com/aws-amplify/amplify-codegen-ui/issues/321)) ([628a5cc](https://github.com/aws-amplify/amplify-codegen-ui/commit/628a5ccb0138c93971264c4ea84d4be56068213e))
- don't use replaceAll since it's not supported in ES2015 ([eb3f04e](https://github.com/aws-amplify/amplify-codegen-ui/commit/eb3f04eabfcc7b2aea59810de8bb377945e59d31))
- enable authAttributes statement for component with auth action binding ([#395](https://github.com/aws-amplify/amplify-codegen-ui/issues/395)) ([9190dd6](https://github.com/aws-amplify/amplify-codegen-ui/commit/9190dd6d59e67ab18d6ee8dddf137a39af52952b))
- get grand child from component tree ([#394](https://github.com/aws-amplify/amplify-codegen-ui/issues/394)) ([b427d09](https://github.com/aws-amplify/amplify-codegen-ui/commit/b427d09b53841746f1ad46341d90d55705c2b9ba))
- move validate schema to template renderer ([459f5ff](https://github.com/aws-amplify/amplify-codegen-ui/commit/459f5ffad0e43718c20015e1efa4541bfe3feaee))
- proper use of type from ui builder backend ([#317](https://github.com/aws-amplify/amplify-codegen-ui/issues/317)) ([61dc5aa](https://github.com/aws-amplify/amplify-codegen-ui/commit/61dc5aa71a58455bee7c1dbdf40436fe6e8a1abc))
- remove defaultValue if value is added to component ([7e26b20](https://github.com/aws-amplify/amplify-codegen-ui/commit/7e26b20e9da6a2bf75192af54378700ab40bfdb4))
- sanitize component name before generating statement declarations ([6c24129](https://github.com/aws-amplify/amplify-codegen-ui/commit/6c241295cc61edcb1a8c6983bbac19276aa36821))
- support mutation targets with invalid js names ([24c9eac](https://github.com/aws-amplify/amplify-codegen-ui/commit/24c9eacb4d4ba449ceb2bab176333f0c00d5e047))
- support synthetic prop mutation, and duplicate mutations on the same property ([#375](https://github.com/aws-amplify/amplify-codegen-ui/issues/375)) ([d3818ec](https://github.com/aws-amplify/amplify-codegen-ui/commit/d3818ec296701091fd6302e0777954740fb39472))
- use correct syntax for conditonals as action parameter ([#398](https://github.com/aws-amplify/amplify-codegen-ui/issues/398)) ([300114c](https://github.com/aws-amplify/amplify-codegen-ui/commit/300114c013fb92aad2961583703d7bb4ddcc3862))

### Features

- add control event to all state references with change event ([#388](https://github.com/aws-amplify/amplify-codegen-ui/issues/388)) ([53b7e75](https://github.com/aws-amplify/amplify-codegen-ui/commit/53b7e75a2a74296640c3ecb31f674f50aa08f989))
- add default initial value for form component state ([#396](https://github.com/aws-amplify/amplify-codegen-ui/issues/396)) ([b676997](https://github.com/aws-amplify/amplify-codegen-ui/commit/b6769978dfb8433f48ccf224f3fd9ba506570c24))
- add Menu primitive ([#322](https://github.com/aws-amplify/amplify-codegen-ui/issues/322)) ([fe26cca](https://github.com/aws-amplify/amplify-codegen-ui/commit/fe26cca9843ef909160cf4861f0d8134b844b85e))
- add mutations ([#371](https://github.com/aws-amplify/amplify-codegen-ui/issues/371)) ([04b3d27](https://github.com/aws-amplify/amplify-codegen-ui/commit/04b3d2700726cbc4d57648a55dad9d8b6d495371))
- add option to render inline source map ([#324](https://github.com/aws-amplify/amplify-codegen-ui/issues/324)) ([46f4ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/46f4ac5832c2175e7ca6cc23ea4d34f4c2a2caeb))
- add requiredDataModels to renderComponentOnly method ([325d369](https://github.com/aws-amplify/amplify-codegen-ui/commit/325d36940aca0afd42ac8ac65cf2d573d705e89d))
- add schema version and validation ([90f9846](https://github.com/aws-amplify/amplify-codegen-ui/commit/90f9846088378b7599ba3b0ce453b8e360964dd9))
- add special case for fields and model action parameters ([#358](https://github.com/aws-amplify/amplify-codegen-ui/issues/358)) ([36505eb](https://github.com/aws-amplify/amplify-codegen-ui/commit/36505eb4b70d98c9156b1f6853bd72d9f07d6d68))
- add support for auth actions ([#361](https://github.com/aws-amplify/amplify-codegen-ui/issues/361)) ([e6c18cf](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6c18cfee448c8f0f10e558205f3905f6492ea5c))
- add support for DataStore actions ([#365](https://github.com/aws-amplify/amplify-codegen-ui/issues/365)) ([0289052](https://github.com/aws-amplify/amplify-codegen-ui/commit/028905237e52fed3c78ea18d0b447668927dc80e))
- add Table primitive ([#323](https://github.com/aws-amplify/amplify-codegen-ui/issues/323)) ([605284f](https://github.com/aws-amplify/amplify-codegen-ui/commit/605284fdbe9f09b7440ad949cb8dbab1f936f995))
- add TextAreaField primitive ([1573489](https://github.com/aws-amplify/amplify-codegen-ui/commit/1573489facbd72379148ddacceeb9cbb9305245d))
- allow objects to be passed into properties to support paths in icons ([#384](https://github.com/aws-amplify/amplify-codegen-ui/issues/384)) ([874e5e6](https://github.com/aws-amplify/amplify-codegen-ui/commit/874e5e6d300c5ebc1c8e9682e413b2734cf2558a))
- conditionally set state in useEffect hooks ([a3ef729](https://github.com/aws-amplify/amplify-codegen-ui/commit/a3ef729780559542abe7f93a6ba2010210650224))
- expose renderThemeJson method to generating themes in studio ui ([#340](https://github.com/aws-amplify/amplify-codegen-ui/issues/340)) ([e130fd0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e130fd0e7f6d1bc969d20b026f2d0beb24d75fd4))
- import buildMergeOverrides from amplify-ui ([#316](https://github.com/aws-amplify/amplify-codegen-ui/issues/316)) ([5b2b838](https://github.com/aws-amplify/amplify-codegen-ui/commit/5b2b838769fe42db46a2b8b27b73258a8c54e2ec))
- make prettier an optional dependency ([#307](https://github.com/aws-amplify/amplify-codegen-ui/issues/307)) ([ad941cd](https://github.com/aws-amplify/amplify-codegen-ui/commit/ad941cd3756c5f21cde6c1bc9c1fa45793380152))
- poc for useEffect to manage state dependencies ([ce65105](https://github.com/aws-amplify/amplify-codegen-ui/commit/ce651059cded8415d342123961dde4fe13c5e3a1))
- try and marshall variant values to json objects to support icon viewBox/paths ([d0dd300](https://github.com/aws-amplify/amplify-codegen-ui/commit/d0dd300bfad5a4e495fa26c19d22c7b597930b31))
- use default initial value for data dependent states ([022f9c5](https://github.com/aws-amplify/amplify-codegen-ui/commit/022f9c5361d72248507f3878f9450c3c995d77d7))
- use unique identifier for actions ([#366](https://github.com/aws-amplify/amplify-codegen-ui/issues/366)) ([bbddbb5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bbddbb59188123fc7669f167bafeb9e8274891e6))
- various workflow cleanup ([#383](https://github.com/aws-amplify/amplify-codegen-ui/issues/383)) ([db2c7c6](https://github.com/aws-amplify/amplify-codegen-ui/commit/db2c7c614102b3b811eb081bfbf30d0430dbf889))

### BREAKING CHANGES

- schamaVersion is now a required field

# [1.2.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v1.0.0...v1.2.0) (2021-12-13)

### Bug Fixes

- dont navigate on each test, and remove unnecessary gets from cypress suite ([#281](https://github.com/aws-amplify/amplify-codegen-ui/issues/281)) ([c72e66c](https://github.com/aws-amplify/amplify-codegen-ui/commit/c72e66cee560d7133650d242e3c36341c0356d98))
- map prop to children prop for variant ([#297](https://github.com/aws-amplify/amplify-codegen-ui/issues/297)) ([#304](https://github.com/aws-amplify/amplify-codegen-ui/issues/304)) ([cc932c2](https://github.com/aws-amplify/amplify-codegen-ui/commit/cc932c200928e5ef3264a5f6b5ac5fc89cbf2073))
- use correct override index for built-in iconset components ([#266](https://github.com/aws-amplify/amplify-codegen-ui/issues/266)) ([04c3baa](https://github.com/aws-amplify/amplify-codegen-ui/commit/04c3baa68f76a8f227178488c2928248fb1b5292))

### Features

- add Expander primitive ([#252](https://github.com/aws-amplify/amplify-codegen-ui/issues/252)) ([91096ce](https://github.com/aws-amplify/amplify-codegen-ui/commit/91096ce8b3e6e7604c6dd63df8be5ef642b08b58))
- add import mappings to non-dynamic, and correct EscapeHatchProps import type. ([#277](https://github.com/aws-amplify/amplify-codegen-ui/issues/277)) ([16acc35](https://github.com/aws-amplify/amplify-codegen-ui/commit/16acc35303f1fa62b6dbc8c72b4dd2dd22166238))
- add min required library versions for generated components ([#302](https://github.com/aws-amplify/amplify-codegen-ui/issues/302)) ([#303](https://github.com/aws-amplify/amplify-codegen-ui/issues/303)) ([7f08cd9](https://github.com/aws-amplify/amplify-codegen-ui/commit/7f08cd9f0d74436686057bfb0ee6563ef47fef3e))
- add support for developing on windows ([#276](https://github.com/aws-amplify/amplify-codegen-ui/issues/276)) ([985f576](https://github.com/aws-amplify/amplify-codegen-ui/commit/985f576f1df7251b4890366096326fee097fb7fc))
- use typescript virtual file server to allow transpilation without requiring a real fs ([#268](https://github.com/aws-amplify/amplify-codegen-ui/issues/268)) ([d8219c5](https://github.com/aws-amplify/amplify-codegen-ui/commit/d8219c50928e33ffd032df3a11b1024b3d7bf982))

# [1.1.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v1.0.0...v1.1.0) (2021-12-02)

### Bug Fixes

- use correct override index for built-in iconset components ([#266](https://github.com/aws-amplify/amplify-codegen-ui/issues/266)) ([04c3baa](https://github.com/aws-amplify/amplify-codegen-ui/commit/04c3baa68f76a8f227178488c2928248fb1b5292))

### Features

- use typescript virtual file server to allow transpilation without requiring a real fs ([#268](https://github.com/aws-amplify/amplify-codegen-ui/issues/268)) ([d8219c5](https://github.com/aws-amplify/amplify-codegen-ui/commit/d8219c50928e33ffd032df3a11b1024b3d7bf982))

# [1.0.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.13.1...v1.0.0) (2021-12-01)

**Note:** Version bump only for package @aws-amplify/codegen-ui-react

## [0.13.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.13.0...v0.13.1) (2021-11-26)

**Note:** Version bump only for package @aws-amplify/codegen-ui-react

# [0.13.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.12.0...v0.13.0) (2021-11-23)

### Bug Fixes

- convert built-in iconset names to pascal case ([#253](https://github.com/aws-amplify/amplify-codegen-ui/issues/253)) ([0c12c7b](https://github.com/aws-amplify/amplify-codegen-ui/commit/0c12c7bcf9a5d5a06ed7238ffe508c1e13a529dd))
- use double-equal instead of triple for conditional comparisons ([ff57822](https://github.com/aws-amplify/amplify-codegen-ui/commit/ff57822b5046bcbf2387b9fe8980c6aad956bc5a))

### Features

- add datastore object id as key to collections if not set ([63ffb89](https://github.com/aws-amplify/amplify-codegen-ui/commit/63ffb891e2d67dd63951a4cc4a103d8986cdfef0))

# [0.12.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.10.1...v0.12.0) (2021-11-22)

### Bug Fixes

- deep merge variants and overrides rather than overwrite with spread ([a779553](https://github.com/aws-amplify/amplify-codegen-ui/commit/a779553f373c45406aa1631f9ff60eeb33775843))
- fixing typescript version to 4.4.x, since 4.5.2 breaks the imports ([b726682](https://github.com/aws-amplify/amplify-codegen-ui/commit/b726682e56129ade22616682a14f481176851f94))
- remove unnecessary types file from generated index ([f7565a0](https://github.com/aws-amplify/amplify-codegen-ui/commit/f7565a0ccf2626d3801839acef656e1b54e9f046))
- removing label override for checkbox field, and removing label, which is not in primitives ([c819478](https://github.com/aws-amplify/amplify-codegen-ui/commit/c819478525f20dcd1be5664cb0563ab3a7dd9875))

### Features

- update internal hook import paths to use internal ui-react path ([74f4614](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f4614409e361d7c423572c0ef2ef473bd07b1d))

## [0.11.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.10.1...v0.11.1) (2021-11-19)

### Bug Fixes

- deep merge variants and overrides rather than overwrite with spread ([a779553](https://github.com/aws-amplify/amplify-codegen-ui/commit/a779553f373c45406aa1631f9ff60eeb33775843))
- fixing typescript version to 4.4.x, since 4.5.2 breaks the imports ([b726682](https://github.com/aws-amplify/amplify-codegen-ui/commit/b726682e56129ade22616682a14f481176851f94))
- removing label override for checkbox field, and removing label, which is not in primitives ([c819478](https://github.com/aws-amplify/amplify-codegen-ui/commit/c819478525f20dcd1be5664cb0563ab3a7dd9875))

# [0.11.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.10.1...v0.11.0) (2021-11-18)

### Bug Fixes

- fixing typescript version to 4.4.x, since 4.5.2 breaks the imports ([25c2dc9](https://github.com/aws-amplify/amplify-codegen-ui/commit/25c2dc970fab06abf7554d7ff69de4b12f65abd0))

## [0.10.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.10.0...v0.10.1) (2021-11-17)

### Bug Fixes

- use static list iconset instead of dynamic from import ([3607d50](https://github.com/aws-amplify/amplify-codegen-ui/commit/3607d50e2436d4e24341e6e5a03e2358ca0ee93b))

# [0.10.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.9.0...v0.10.0) (2021-11-16)

**Note:** Version bump only for package @aws-amplify/codegen-ui-react

# 0.9.0 (2021-11-15)

### Bug Fixes

- add children prop to all custom components ([#198](https://github.com/aws-amplify/amplify-codegen-ui/issues/198)) ([cbd96c9](https://github.com/aws-amplify/amplify-codegen-ui/commit/cbd96c908e03155521d37c20a81464e3ccb1274c))
- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- collection binding with no predicate ([#98](https://github.com/aws-amplify/amplify-codegen-ui/issues/98)) ([3e38fcc](https://github.com/aws-amplify/amplify-codegen-ui/commit/3e38fccf4c456d34f15b7ca050be6041ccb80417))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- createDatastorePredicate call was added ([#166](https://github.com/aws-amplify/amplify-codegen-ui/issues/166)) ([fbee20c](https://github.com/aws-amplify/amplify-codegen-ui/commit/fbee20c9aae661571653a1b0ee3801e67d02e123))
- dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
- enable esModuleInterop ([#85](https://github.com/aws-amplify/amplify-codegen-ui/issues/85)) ([32eac19](https://github.com/aws-amplify/amplify-codegen-ui/commit/32eac194dc4ba4fbb5571926698e5560a1a6b14d)), closes [#77](https://github.com/aws-amplify/amplify-codegen-ui/issues/77)
- ensuring we properly escape object keys with non-alpha characters ([5216eca](https://github.com/aws-amplify/amplify-codegen-ui/commit/5216ecad6c6f7c84dd8a25cfedbe9214b01dca76))
- fixing override indice bug, and adding e2e test ([c8500bf](https://github.com/aws-amplify/amplify-codegen-ui/commit/c8500bf06ff9be18715e834cd1f9f43942b9a0ea))
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- import custom component from local directory ([#182](https://github.com/aws-amplify/amplify-codegen-ui/issues/182)) ([5cd1076](https://github.com/aws-amplify/amplify-codegen-ui/commit/5cd1076a4cd7a0710c8be70cfcb70a5571979e6a))
- include typescript parser plugin ([8b4e765](https://github.com/aws-amplify/amplify-codegen-ui/commit/8b4e7655f244d08286e7ac15551221fe6bf06589))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only import props type for top-level component ([c850b8c](https://github.com/aws-amplify/amplify-codegen-ui/commit/c850b8c5ad110421d2ad68898452e8fef5321cd8))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- only use useDataStoreBinding when predicate is set ([#86](https://github.com/aws-amplify/amplify-codegen-ui/issues/86)) ([ec079f1](https://github.com/aws-amplify/amplify-codegen-ui/commit/ec079f14a50ec6e1132669761e6b924638e1c9ce)), closes [#84](https://github.com/aws-amplify/amplify-codegen-ui/issues/84)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove export modifier for renderComponentOnly ([#66](https://github.com/aws-amplify/amplify-codegen-ui/issues/66)) ([6e3d097](https://github.com/aws-amplify/amplify-codegen-ui/commit/6e3d097f217ecbdfb5165888e47eb0e6a16da8c4))
- remove extra component directories ([#71](https://github.com/aws-amplify/amplify-codegen-ui/issues/71)) ([e68d92b](https://github.com/aws-amplify/amplify-codegen-ui/commit/e68d92bdfa4d2f5d34f9cdf0ee70376cec5ce43b))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- set correct import location for code sample ([#203](https://github.com/aws-amplify/amplify-codegen-ui/issues/203)) ([aabb39f](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabb39f483d264fb26fc35b8405caed1bb25733c))
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))
- **codegen-ui-react:** collection items props takes precedent ([#96](https://github.com/aws-amplify/amplify-codegen-ui/issues/96)) ([0149ca2](https://github.com/aws-amplify/amplify-codegen-ui/commit/0149ca28741969aae5c3c5442985c10ad065501c)), closes [#90](https://github.com/aws-amplify/amplify-codegen-ui/issues/90)
- **codegen-ui-react:** include all imports used in generated components ([#40](https://github.com/aws-amplify/amplify-codegen-ui/issues/40)) ([04f86bb](https://github.com/aws-amplify/amplify-codegen-ui/commit/04f86bb6a3146d578420b7e0bc3c525fa6572b6b))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))
- top level bindingProperties should be optional ([#61](https://github.com/aws-amplify/amplify-codegen-ui/issues/61)) ([b97d6fd](https://github.com/aws-amplify/amplify-codegen-ui/commit/b97d6fdeba5f2525e9a8ced50e5fdb0dfaff3f51))
- top level prop available as variables ([#62](https://github.com/aws-amplify/amplify-codegen-ui/issues/62)) ([788802e](https://github.com/aws-amplify/amplify-codegen-ui/commit/788802e7c0d2426a1c22460bf3bc240e94cbb0c7))
- update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
- update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
- update unit tests per change from React.Element to React.ReactElement ([d1b782f](https://github.com/aws-amplify/amplify-codegen-ui/commit/d1b782fc4220976bfaa40a9693ed8a4a0109684b))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating sample code snippets to accurately reflect current usage ([2de5561](https://github.com/aws-amplify/amplify-codegen-ui/commit/2de5561c36eab5c86c7a4b62d148706424836360))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))
- use correct identifier when using useDataStoreBinding ([#104](https://github.com/aws-amplify/amplify-codegen-ui/issues/104)) ([ef93e45](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef93e4583b68a6fe28d50663bd2c49d9889b8029))
- use temp package that does not break browser ([#136](https://github.com/aws-amplify/amplify-codegen-ui/issues/136)) ([12c9efb](https://github.com/aws-amplify/amplify-codegen-ui/commit/12c9efb673b186abe55dd643bae531d06ec8e368))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add error handler to common entry points, and basic input validation ([84b28c3](https://github.com/aws-amplify/amplify-codegen-ui/commit/84b28c3e8b84caaf575873ef76c9c66779323ab3))
- add index file renderer, and update sample imports to reference ([361bed2](https://github.com/aws-amplify/amplify-codegen-ui/commit/361bed24af1501a710c3fffa5341a14613c46da1))
- add notice to top of generated files ([#56](https://github.com/aws-amplify/amplify-codegen-ui/issues/56)) ([4f492cd](https://github.com/aws-amplify/amplify-codegen-ui/commit/4f492cdcd08757c7e23f3be86e7264b29e4e3a0d)), closes [#55](https://github.com/aws-amplify/amplify-codegen-ui/issues/55)
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add react attr generation for collectionBindingProperties ([#53](https://github.com/aws-amplify/amplify-codegen-ui/issues/53)) ([33390ed](https://github.com/aws-amplify/amplify-codegen-ui/commit/33390ed150c33a51de3808663b9fc3c46c998de5))
- add single record binding generation ([#51](https://github.com/aws-amplify/amplify-codegen-ui/issues/51)) ([454d754](https://github.com/aws-amplify/amplify-codegen-ui/commit/454d7541b5a699a0598f5fb160639050f104fc73))
- add SliderField primitive ([#213](https://github.com/aws-amplify/amplify-codegen-ui/issues/213)) ([78209e2](https://github.com/aws-amplify/amplify-codegen-ui/commit/78209e25a0ca324e99a5eb14c5e05cfa28df6fd4))
- add support for most existing primitives ([#194](https://github.com/aws-amplify/amplify-codegen-ui/issues/194)) ([f1fe271](https://github.com/aws-amplify/amplify-codegen-ui/commit/f1fe271ff128a8683cd8f06da8aaa0c577a9d1fc))
- add temp label synthetic prop to CheckboxField ([#217](https://github.com/aws-amplify/amplify-codegen-ui/issues/217)) ([b386451](https://github.com/aws-amplify/amplify-codegen-ui/commit/b386451f68a2597959e569d564abd34620906cf5))
- add TextField primitive ([#211](https://github.com/aws-amplify/amplify-codegen-ui/issues/211)) ([bc7de0f](https://github.com/aws-amplify/amplify-codegen-ui/commit/bc7de0fd38f0dd16f93eee84d870fb606ad4cd13))
- add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
- add user specific attrs ([#107](https://github.com/aws-amplify/amplify-codegen-ui/issues/107)) ([67f34ac](https://github.com/aws-amplify/amplify-codegen-ui/commit/67f34acc6d13f1f9ebd283e20454480db393343f))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- extend base action binding types with navigation types and add test ([dbccfbd](https://github.com/aws-amplify/amplify-codegen-ui/commit/dbccfbd0466186c8cc09d71419504b0ee3abc4ff))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- output type declaration ([#118](https://github.com/aws-amplify/amplify-codegen-ui/issues/118)) ([9db8bdc](https://github.com/aws-amplify/amplify-codegen-ui/commit/9db8bdc80f66567b3d4d9d94d4b4a6bb386af28d))
- parse string wrapped fixed values ([#155](https://github.com/aws-amplify/amplify-codegen-ui/issues/155)) ([3827f7c](https://github.com/aws-amplify/amplify-codegen-ui/commit/3827f7c612f782a36d2563c4203c20437e75bfdd))
- primitive children prop mapping ([#191](https://github.com/aws-amplify/amplify-codegen-ui/issues/191)) ([d6cf178](https://github.com/aws-amplify/amplify-codegen-ui/commit/d6cf17856b7efe6ae5c0eb448c690a54628d3f89))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- remove FieldGroup, FieldGroupIcon, and FieldGroupIconButton primitives ([#207](https://github.com/aws-amplify/amplify-codegen-ui/issues/207)) ([baa8e64](https://github.com/aws-amplify/amplify-codegen-ui/commit/baa8e64182789234849833fd9934d50790305cab))
- remove input primitive ([#212](https://github.com/aws-amplify/amplify-codegen-ui/issues/212)) ([fc92841](https://github.com/aws-amplify/amplify-codegen-ui/commit/fc928413374ab11176011007dfb609462506e8c8))
- remove string component type ([#193](https://github.com/aws-amplify/amplify-codegen-ui/issues/193)) ([986fc5f](https://github.com/aws-amplify/amplify-codegen-ui/commit/986fc5ffe4ea68e38c3cf028228a9ce85a5fcd28))
- replacing dependency on helper for collections sort with inline sort function ([0d0df62](https://github.com/aws-amplify/amplify-codegen-ui/commit/0d0df626fe5b2b0bf028a569adf0faad1aa3f0aa))
- test-generate each case individually, add support for error cases as well ([46f65cc](https://github.com/aws-amplify/amplify-codegen-ui/commit/46f65ccef5cc748d7c86025c81573c64ed4afa3d))
- throw error on invalid script kind ([#133](https://github.com/aws-amplify/amplify-codegen-ui/issues/133)) ([ee3e79f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee3e79f351cf0d5151bf9bbaa048f05897bcb9b0))

# 0.8.0 (2021-11-12)

### Bug Fixes

- add children prop to all custom components ([#198](https://github.com/aws-amplify/amplify-codegen-ui/issues/198)) ([cbd96c9](https://github.com/aws-amplify/amplify-codegen-ui/commit/cbd96c908e03155521d37c20a81464e3ccb1274c))
- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- collection binding with no predicate ([#98](https://github.com/aws-amplify/amplify-codegen-ui/issues/98)) ([3e38fcc](https://github.com/aws-amplify/amplify-codegen-ui/commit/3e38fccf4c456d34f15b7ca050be6041ccb80417))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- createDatastorePredicate call was added ([#166](https://github.com/aws-amplify/amplify-codegen-ui/issues/166)) ([fbee20c](https://github.com/aws-amplify/amplify-codegen-ui/commit/fbee20c9aae661571653a1b0ee3801e67d02e123))
- dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
- enable esModuleInterop ([#85](https://github.com/aws-amplify/amplify-codegen-ui/issues/85)) ([32eac19](https://github.com/aws-amplify/amplify-codegen-ui/commit/32eac194dc4ba4fbb5571926698e5560a1a6b14d)), closes [#77](https://github.com/aws-amplify/amplify-codegen-ui/issues/77)
- ensuring we properly escape object keys with non-alpha characters ([5216eca](https://github.com/aws-amplify/amplify-codegen-ui/commit/5216ecad6c6f7c84dd8a25cfedbe9214b01dca76))
- fixing override indice bug, and adding e2e test ([c8500bf](https://github.com/aws-amplify/amplify-codegen-ui/commit/c8500bf06ff9be18715e834cd1f9f43942b9a0ea))
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- import custom component from local directory ([#182](https://github.com/aws-amplify/amplify-codegen-ui/issues/182)) ([5cd1076](https://github.com/aws-amplify/amplify-codegen-ui/commit/5cd1076a4cd7a0710c8be70cfcb70a5571979e6a))
- include typescript parser plugin ([8b4e765](https://github.com/aws-amplify/amplify-codegen-ui/commit/8b4e7655f244d08286e7ac15551221fe6bf06589))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only import props type for top-level component ([c850b8c](https://github.com/aws-amplify/amplify-codegen-ui/commit/c850b8c5ad110421d2ad68898452e8fef5321cd8))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- only use useDataStoreBinding when predicate is set ([#86](https://github.com/aws-amplify/amplify-codegen-ui/issues/86)) ([ec079f1](https://github.com/aws-amplify/amplify-codegen-ui/commit/ec079f14a50ec6e1132669761e6b924638e1c9ce)), closes [#84](https://github.com/aws-amplify/amplify-codegen-ui/issues/84)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove export modifier for renderComponentOnly ([#66](https://github.com/aws-amplify/amplify-codegen-ui/issues/66)) ([6e3d097](https://github.com/aws-amplify/amplify-codegen-ui/commit/6e3d097f217ecbdfb5165888e47eb0e6a16da8c4))
- remove extra component directories ([#71](https://github.com/aws-amplify/amplify-codegen-ui/issues/71)) ([e68d92b](https://github.com/aws-amplify/amplify-codegen-ui/commit/e68d92bdfa4d2f5d34f9cdf0ee70376cec5ce43b))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- set correct import location for code sample ([#203](https://github.com/aws-amplify/amplify-codegen-ui/issues/203)) ([aabb39f](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabb39f483d264fb26fc35b8405caed1bb25733c))
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))
- **codegen-ui-react:** collection items props takes precedent ([#96](https://github.com/aws-amplify/amplify-codegen-ui/issues/96)) ([0149ca2](https://github.com/aws-amplify/amplify-codegen-ui/commit/0149ca28741969aae5c3c5442985c10ad065501c)), closes [#90](https://github.com/aws-amplify/amplify-codegen-ui/issues/90)
- **codegen-ui-react:** include all imports used in generated components ([#40](https://github.com/aws-amplify/amplify-codegen-ui/issues/40)) ([04f86bb](https://github.com/aws-amplify/amplify-codegen-ui/commit/04f86bb6a3146d578420b7e0bc3c525fa6572b6b))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))
- top level bindingProperties should be optional ([#61](https://github.com/aws-amplify/amplify-codegen-ui/issues/61)) ([b97d6fd](https://github.com/aws-amplify/amplify-codegen-ui/commit/b97d6fdeba5f2525e9a8ced50e5fdb0dfaff3f51))
- top level prop available as variables ([#62](https://github.com/aws-amplify/amplify-codegen-ui/issues/62)) ([788802e](https://github.com/aws-amplify/amplify-codegen-ui/commit/788802e7c0d2426a1c22460bf3bc240e94cbb0c7))
- update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
- update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
- update unit tests per change from React.Element to React.ReactElement ([d1b782f](https://github.com/aws-amplify/amplify-codegen-ui/commit/d1b782fc4220976bfaa40a9693ed8a4a0109684b))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating sample code snippets to accurately reflect current usage ([2de5561](https://github.com/aws-amplify/amplify-codegen-ui/commit/2de5561c36eab5c86c7a4b62d148706424836360))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))
- use correct identifier when using useDataStoreBinding ([#104](https://github.com/aws-amplify/amplify-codegen-ui/issues/104)) ([ef93e45](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef93e4583b68a6fe28d50663bd2c49d9889b8029))
- use temp package that does not break browser ([#136](https://github.com/aws-amplify/amplify-codegen-ui/issues/136)) ([12c9efb](https://github.com/aws-amplify/amplify-codegen-ui/commit/12c9efb673b186abe55dd643bae531d06ec8e368))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add error handler to common entry points, and basic input validation ([84b28c3](https://github.com/aws-amplify/amplify-codegen-ui/commit/84b28c3e8b84caaf575873ef76c9c66779323ab3))
- add notice to top of generated files ([#56](https://github.com/aws-amplify/amplify-codegen-ui/issues/56)) ([4f492cd](https://github.com/aws-amplify/amplify-codegen-ui/commit/4f492cdcd08757c7e23f3be86e7264b29e4e3a0d)), closes [#55](https://github.com/aws-amplify/amplify-codegen-ui/issues/55)
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add react attr generation for collectionBindingProperties ([#53](https://github.com/aws-amplify/amplify-codegen-ui/issues/53)) ([33390ed](https://github.com/aws-amplify/amplify-codegen-ui/commit/33390ed150c33a51de3808663b9fc3c46c998de5))
- add single record binding generation ([#51](https://github.com/aws-amplify/amplify-codegen-ui/issues/51)) ([454d754](https://github.com/aws-amplify/amplify-codegen-ui/commit/454d7541b5a699a0598f5fb160639050f104fc73))
- add support for most existing primitives ([#194](https://github.com/aws-amplify/amplify-codegen-ui/issues/194)) ([f1fe271](https://github.com/aws-amplify/amplify-codegen-ui/commit/f1fe271ff128a8683cd8f06da8aaa0c577a9d1fc))
- add temp label synthetic prop to CheckboxField ([#217](https://github.com/aws-amplify/amplify-codegen-ui/issues/217)) ([b386451](https://github.com/aws-amplify/amplify-codegen-ui/commit/b386451f68a2597959e569d564abd34620906cf5))
- add TextField primitive ([#211](https://github.com/aws-amplify/amplify-codegen-ui/issues/211)) ([bc7de0f](https://github.com/aws-amplify/amplify-codegen-ui/commit/bc7de0fd38f0dd16f93eee84d870fb606ad4cd13))
- add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
- add user specific attrs ([#107](https://github.com/aws-amplify/amplify-codegen-ui/issues/107)) ([67f34ac](https://github.com/aws-amplify/amplify-codegen-ui/commit/67f34acc6d13f1f9ebd283e20454480db393343f))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- extend base action binding types with navigation types and add test ([dbccfbd](https://github.com/aws-amplify/amplify-codegen-ui/commit/dbccfbd0466186c8cc09d71419504b0ee3abc4ff))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- output type declaration ([#118](https://github.com/aws-amplify/amplify-codegen-ui/issues/118)) ([9db8bdc](https://github.com/aws-amplify/amplify-codegen-ui/commit/9db8bdc80f66567b3d4d9d94d4b4a6bb386af28d))
- parse string wrapped fixed values ([#155](https://github.com/aws-amplify/amplify-codegen-ui/issues/155)) ([3827f7c](https://github.com/aws-amplify/amplify-codegen-ui/commit/3827f7c612f782a36d2563c4203c20437e75bfdd))
- primitive children prop mapping ([#191](https://github.com/aws-amplify/amplify-codegen-ui/issues/191)) ([d6cf178](https://github.com/aws-amplify/amplify-codegen-ui/commit/d6cf17856b7efe6ae5c0eb448c690a54628d3f89))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- remove FieldGroup, FieldGroupIcon, and FieldGroupIconButton primitives ([#207](https://github.com/aws-amplify/amplify-codegen-ui/issues/207)) ([baa8e64](https://github.com/aws-amplify/amplify-codegen-ui/commit/baa8e64182789234849833fd9934d50790305cab))
- remove input primitive ([#212](https://github.com/aws-amplify/amplify-codegen-ui/issues/212)) ([fc92841](https://github.com/aws-amplify/amplify-codegen-ui/commit/fc928413374ab11176011007dfb609462506e8c8))
- remove string component type ([#193](https://github.com/aws-amplify/amplify-codegen-ui/issues/193)) ([986fc5f](https://github.com/aws-amplify/amplify-codegen-ui/commit/986fc5ffe4ea68e38c3cf028228a9ce85a5fcd28))
- replacing dependency on helper for collections sort with inline sort function ([0d0df62](https://github.com/aws-amplify/amplify-codegen-ui/commit/0d0df626fe5b2b0bf028a569adf0faad1aa3f0aa))
- test-generate each case individually, add support for error cases as well ([46f65cc](https://github.com/aws-amplify/amplify-codegen-ui/commit/46f65ccef5cc748d7c86025c81573c64ed4afa3d))
- throw error on invalid script kind ([#133](https://github.com/aws-amplify/amplify-codegen-ui/issues/133)) ([ee3e79f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee3e79f351cf0d5151bf9bbaa048f05897bcb9b0))

# 0.7.0 (2021-11-09)

### Bug Fixes

- add children prop to all custom components ([#198](https://github.com/aws-amplify/amplify-codegen-ui/issues/198)) ([cbd96c9](https://github.com/aws-amplify/amplify-codegen-ui/commit/cbd96c908e03155521d37c20a81464e3ccb1274c))
- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- collection binding with no predicate ([#98](https://github.com/aws-amplify/amplify-codegen-ui/issues/98)) ([3e38fcc](https://github.com/aws-amplify/amplify-codegen-ui/commit/3e38fccf4c456d34f15b7ca050be6041ccb80417))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- createDatastorePredicate call was added ([#166](https://github.com/aws-amplify/amplify-codegen-ui/issues/166)) ([fbee20c](https://github.com/aws-amplify/amplify-codegen-ui/commit/fbee20c9aae661571653a1b0ee3801e67d02e123))
- dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
- enable esModuleInterop ([#85](https://github.com/aws-amplify/amplify-codegen-ui/issues/85)) ([32eac19](https://github.com/aws-amplify/amplify-codegen-ui/commit/32eac194dc4ba4fbb5571926698e5560a1a6b14d)), closes [#77](https://github.com/aws-amplify/amplify-codegen-ui/issues/77)
- ensuring we properly escape object keys with non-alpha characters ([5216eca](https://github.com/aws-amplify/amplify-codegen-ui/commit/5216ecad6c6f7c84dd8a25cfedbe9214b01dca76))
- fixing override indice bug, and adding e2e test ([c8500bf](https://github.com/aws-amplify/amplify-codegen-ui/commit/c8500bf06ff9be18715e834cd1f9f43942b9a0ea))
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- import custom component from local directory ([#182](https://github.com/aws-amplify/amplify-codegen-ui/issues/182)) ([5cd1076](https://github.com/aws-amplify/amplify-codegen-ui/commit/5cd1076a4cd7a0710c8be70cfcb70a5571979e6a))
- include typescript parser plugin ([8b4e765](https://github.com/aws-amplify/amplify-codegen-ui/commit/8b4e7655f244d08286e7ac15551221fe6bf06589))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only import props type for top-level component ([c850b8c](https://github.com/aws-amplify/amplify-codegen-ui/commit/c850b8c5ad110421d2ad68898452e8fef5321cd8))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- only use useDataStoreBinding when predicate is set ([#86](https://github.com/aws-amplify/amplify-codegen-ui/issues/86)) ([ec079f1](https://github.com/aws-amplify/amplify-codegen-ui/commit/ec079f14a50ec6e1132669761e6b924638e1c9ce)), closes [#84](https://github.com/aws-amplify/amplify-codegen-ui/issues/84)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove export modifier for renderComponentOnly ([#66](https://github.com/aws-amplify/amplify-codegen-ui/issues/66)) ([6e3d097](https://github.com/aws-amplify/amplify-codegen-ui/commit/6e3d097f217ecbdfb5165888e47eb0e6a16da8c4))
- remove extra component directories ([#71](https://github.com/aws-amplify/amplify-codegen-ui/issues/71)) ([e68d92b](https://github.com/aws-amplify/amplify-codegen-ui/commit/e68d92bdfa4d2f5d34f9cdf0ee70376cec5ce43b))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- set correct import location for code sample ([#203](https://github.com/aws-amplify/amplify-codegen-ui/issues/203)) ([aabb39f](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabb39f483d264fb26fc35b8405caed1bb25733c))
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))
- **codegen-ui-react:** collection items props takes precedent ([#96](https://github.com/aws-amplify/amplify-codegen-ui/issues/96)) ([0149ca2](https://github.com/aws-amplify/amplify-codegen-ui/commit/0149ca28741969aae5c3c5442985c10ad065501c)), closes [#90](https://github.com/aws-amplify/amplify-codegen-ui/issues/90)
- **codegen-ui-react:** include all imports used in generated components ([#40](https://github.com/aws-amplify/amplify-codegen-ui/issues/40)) ([04f86bb](https://github.com/aws-amplify/amplify-codegen-ui/commit/04f86bb6a3146d578420b7e0bc3c525fa6572b6b))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))
- top level bindingProperties should be optional ([#61](https://github.com/aws-amplify/amplify-codegen-ui/issues/61)) ([b97d6fd](https://github.com/aws-amplify/amplify-codegen-ui/commit/b97d6fdeba5f2525e9a8ced50e5fdb0dfaff3f51))
- top level prop available as variables ([#62](https://github.com/aws-amplify/amplify-codegen-ui/issues/62)) ([788802e](https://github.com/aws-amplify/amplify-codegen-ui/commit/788802e7c0d2426a1c22460bf3bc240e94cbb0c7))
- update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
- update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
- update unit tests per change from React.Element to React.ReactElement ([d1b782f](https://github.com/aws-amplify/amplify-codegen-ui/commit/d1b782fc4220976bfaa40a9693ed8a4a0109684b))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))
- use correct identifier when using useDataStoreBinding ([#104](https://github.com/aws-amplify/amplify-codegen-ui/issues/104)) ([ef93e45](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef93e4583b68a6fe28d50663bd2c49d9889b8029))
- use temp package that does not break browser ([#136](https://github.com/aws-amplify/amplify-codegen-ui/issues/136)) ([12c9efb](https://github.com/aws-amplify/amplify-codegen-ui/commit/12c9efb673b186abe55dd643bae531d06ec8e368))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add notice to top of generated files ([#56](https://github.com/aws-amplify/amplify-codegen-ui/issues/56)) ([4f492cd](https://github.com/aws-amplify/amplify-codegen-ui/commit/4f492cdcd08757c7e23f3be86e7264b29e4e3a0d)), closes [#55](https://github.com/aws-amplify/amplify-codegen-ui/issues/55)
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add react attr generation for collectionBindingProperties ([#53](https://github.com/aws-amplify/amplify-codegen-ui/issues/53)) ([33390ed](https://github.com/aws-amplify/amplify-codegen-ui/commit/33390ed150c33a51de3808663b9fc3c46c998de5))
- add single record binding generation ([#51](https://github.com/aws-amplify/amplify-codegen-ui/issues/51)) ([454d754](https://github.com/aws-amplify/amplify-codegen-ui/commit/454d7541b5a699a0598f5fb160639050f104fc73))
- add support for most existing primitives ([#194](https://github.com/aws-amplify/amplify-codegen-ui/issues/194)) ([f1fe271](https://github.com/aws-amplify/amplify-codegen-ui/commit/f1fe271ff128a8683cd8f06da8aaa0c577a9d1fc))
- add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
- add user specific attrs ([#107](https://github.com/aws-amplify/amplify-codegen-ui/issues/107)) ([67f34ac](https://github.com/aws-amplify/amplify-codegen-ui/commit/67f34acc6d13f1f9ebd283e20454480db393343f))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- extend base action binding types with navigation types and add test ([dbccfbd](https://github.com/aws-amplify/amplify-codegen-ui/commit/dbccfbd0466186c8cc09d71419504b0ee3abc4ff))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- output type declaration ([#118](https://github.com/aws-amplify/amplify-codegen-ui/issues/118)) ([9db8bdc](https://github.com/aws-amplify/amplify-codegen-ui/commit/9db8bdc80f66567b3d4d9d94d4b4a6bb386af28d))
- parse string wrapped fixed values ([#155](https://github.com/aws-amplify/amplify-codegen-ui/issues/155)) ([3827f7c](https://github.com/aws-amplify/amplify-codegen-ui/commit/3827f7c612f782a36d2563c4203c20437e75bfdd))
- primitive children prop mapping ([#191](https://github.com/aws-amplify/amplify-codegen-ui/issues/191)) ([d6cf178](https://github.com/aws-amplify/amplify-codegen-ui/commit/d6cf17856b7efe6ae5c0eb448c690a54628d3f89))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- remove string component type ([#193](https://github.com/aws-amplify/amplify-codegen-ui/issues/193)) ([986fc5f](https://github.com/aws-amplify/amplify-codegen-ui/commit/986fc5ffe4ea68e38c3cf028228a9ce85a5fcd28))
- replacing dependency on helper for collections sort with inline sort function ([0d0df62](https://github.com/aws-amplify/amplify-codegen-ui/commit/0d0df626fe5b2b0bf028a569adf0faad1aa3f0aa))
- test-generate each case individually, add support for error cases as well ([46f65cc](https://github.com/aws-amplify/amplify-codegen-ui/commit/46f65ccef5cc748d7c86025c81573c64ed4afa3d))
- throw error on invalid script kind ([#133](https://github.com/aws-amplify/amplify-codegen-ui/issues/133)) ([ee3e79f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee3e79f351cf0d5151bf9bbaa048f05897bcb9b0))

# 0.6.0 (2021-11-04)

### Bug Fixes

- add children prop to all custom components ([#198](https://github.com/aws-amplify/amplify-codegen-ui/issues/198)) ([cbd96c9](https://github.com/aws-amplify/amplify-codegen-ui/commit/cbd96c908e03155521d37c20a81464e3ccb1274c))
- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- collection binding with no predicate ([#98](https://github.com/aws-amplify/amplify-codegen-ui/issues/98)) ([3e38fcc](https://github.com/aws-amplify/amplify-codegen-ui/commit/3e38fccf4c456d34f15b7ca050be6041ccb80417))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- createDatastorePredicate call was added ([#166](https://github.com/aws-amplify/amplify-codegen-ui/issues/166)) ([fbee20c](https://github.com/aws-amplify/amplify-codegen-ui/commit/fbee20c9aae661571653a1b0ee3801e67d02e123))
- dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
- enable esModuleInterop ([#85](https://github.com/aws-amplify/amplify-codegen-ui/issues/85)) ([32eac19](https://github.com/aws-amplify/amplify-codegen-ui/commit/32eac194dc4ba4fbb5571926698e5560a1a6b14d)), closes [#77](https://github.com/aws-amplify/amplify-codegen-ui/issues/77)
- ensuring we properly escape object keys with non-alpha characters ([5216eca](https://github.com/aws-amplify/amplify-codegen-ui/commit/5216ecad6c6f7c84dd8a25cfedbe9214b01dca76))
- fixing override indice bug, and adding e2e test ([c8500bf](https://github.com/aws-amplify/amplify-codegen-ui/commit/c8500bf06ff9be18715e834cd1f9f43942b9a0ea))
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- import custom component from local directory ([#182](https://github.com/aws-amplify/amplify-codegen-ui/issues/182)) ([5cd1076](https://github.com/aws-amplify/amplify-codegen-ui/commit/5cd1076a4cd7a0710c8be70cfcb70a5571979e6a))
- include typescript parser plugin ([8b4e765](https://github.com/aws-amplify/amplify-codegen-ui/commit/8b4e7655f244d08286e7ac15551221fe6bf06589))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only import props type for top-level component ([c850b8c](https://github.com/aws-amplify/amplify-codegen-ui/commit/c850b8c5ad110421d2ad68898452e8fef5321cd8))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- only use useDataStoreBinding when predicate is set ([#86](https://github.com/aws-amplify/amplify-codegen-ui/issues/86)) ([ec079f1](https://github.com/aws-amplify/amplify-codegen-ui/commit/ec079f14a50ec6e1132669761e6b924638e1c9ce)), closes [#84](https://github.com/aws-amplify/amplify-codegen-ui/issues/84)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove export modifier for renderComponentOnly ([#66](https://github.com/aws-amplify/amplify-codegen-ui/issues/66)) ([6e3d097](https://github.com/aws-amplify/amplify-codegen-ui/commit/6e3d097f217ecbdfb5165888e47eb0e6a16da8c4))
- remove extra component directories ([#71](https://github.com/aws-amplify/amplify-codegen-ui/issues/71)) ([e68d92b](https://github.com/aws-amplify/amplify-codegen-ui/commit/e68d92bdfa4d2f5d34f9cdf0ee70376cec5ce43b))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))
- **codegen-ui-react:** collection items props takes precedent ([#96](https://github.com/aws-amplify/amplify-codegen-ui/issues/96)) ([0149ca2](https://github.com/aws-amplify/amplify-codegen-ui/commit/0149ca28741969aae5c3c5442985c10ad065501c)), closes [#90](https://github.com/aws-amplify/amplify-codegen-ui/issues/90)
- **codegen-ui-react:** include all imports used in generated components ([#40](https://github.com/aws-amplify/amplify-codegen-ui/issues/40)) ([04f86bb](https://github.com/aws-amplify/amplify-codegen-ui/commit/04f86bb6a3146d578420b7e0bc3c525fa6572b6b))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))
- top level bindingProperties should be optional ([#61](https://github.com/aws-amplify/amplify-codegen-ui/issues/61)) ([b97d6fd](https://github.com/aws-amplify/amplify-codegen-ui/commit/b97d6fdeba5f2525e9a8ced50e5fdb0dfaff3f51))
- top level prop available as variables ([#62](https://github.com/aws-amplify/amplify-codegen-ui/issues/62)) ([788802e](https://github.com/aws-amplify/amplify-codegen-ui/commit/788802e7c0d2426a1c22460bf3bc240e94cbb0c7))
- update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
- update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
- update unit tests per change from React.Element to React.ReactElement ([d1b782f](https://github.com/aws-amplify/amplify-codegen-ui/commit/d1b782fc4220976bfaa40a9693ed8a4a0109684b))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))
- use correct identifier when using useDataStoreBinding ([#104](https://github.com/aws-amplify/amplify-codegen-ui/issues/104)) ([ef93e45](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef93e4583b68a6fe28d50663bd2c49d9889b8029))
- use temp package that does not break browser ([#136](https://github.com/aws-amplify/amplify-codegen-ui/issues/136)) ([12c9efb](https://github.com/aws-amplify/amplify-codegen-ui/commit/12c9efb673b186abe55dd643bae531d06ec8e368))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add notice to top of generated files ([#56](https://github.com/aws-amplify/amplify-codegen-ui/issues/56)) ([4f492cd](https://github.com/aws-amplify/amplify-codegen-ui/commit/4f492cdcd08757c7e23f3be86e7264b29e4e3a0d)), closes [#55](https://github.com/aws-amplify/amplify-codegen-ui/issues/55)
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add react attr generation for collectionBindingProperties ([#53](https://github.com/aws-amplify/amplify-codegen-ui/issues/53)) ([33390ed](https://github.com/aws-amplify/amplify-codegen-ui/commit/33390ed150c33a51de3808663b9fc3c46c998de5))
- add single record binding generation ([#51](https://github.com/aws-amplify/amplify-codegen-ui/issues/51)) ([454d754](https://github.com/aws-amplify/amplify-codegen-ui/commit/454d7541b5a699a0598f5fb160639050f104fc73))
- add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
- add user specific attrs ([#107](https://github.com/aws-amplify/amplify-codegen-ui/issues/107)) ([67f34ac](https://github.com/aws-amplify/amplify-codegen-ui/commit/67f34acc6d13f1f9ebd283e20454480db393343f))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- extend base action binding types with navigation types and add test ([dbccfbd](https://github.com/aws-amplify/amplify-codegen-ui/commit/dbccfbd0466186c8cc09d71419504b0ee3abc4ff))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- output type declaration ([#118](https://github.com/aws-amplify/amplify-codegen-ui/issues/118)) ([9db8bdc](https://github.com/aws-amplify/amplify-codegen-ui/commit/9db8bdc80f66567b3d4d9d94d4b4a6bb386af28d))
- parse string wrapped fixed values ([#155](https://github.com/aws-amplify/amplify-codegen-ui/issues/155)) ([3827f7c](https://github.com/aws-amplify/amplify-codegen-ui/commit/3827f7c612f782a36d2563c4203c20437e75bfdd))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- replacing dependency on helper for collections sort with inline sort function ([0d0df62](https://github.com/aws-amplify/amplify-codegen-ui/commit/0d0df626fe5b2b0bf028a569adf0faad1aa3f0aa))
- throw error on invalid script kind ([#133](https://github.com/aws-amplify/amplify-codegen-ui/issues/133)) ([ee3e79f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee3e79f351cf0d5151bf9bbaa048f05897bcb9b0))

# 0.5.0 (2021-11-04)

### Bug Fixes

- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- collection binding with no predicate ([#98](https://github.com/aws-amplify/amplify-codegen-ui/issues/98)) ([3e38fcc](https://github.com/aws-amplify/amplify-codegen-ui/commit/3e38fccf4c456d34f15b7ca050be6041ccb80417))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- createDatastorePredicate call was added ([#166](https://github.com/aws-amplify/amplify-codegen-ui/issues/166)) ([fbee20c](https://github.com/aws-amplify/amplify-codegen-ui/commit/fbee20c9aae661571653a1b0ee3801e67d02e123))
- dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
- enable esModuleInterop ([#85](https://github.com/aws-amplify/amplify-codegen-ui/issues/85)) ([32eac19](https://github.com/aws-amplify/amplify-codegen-ui/commit/32eac194dc4ba4fbb5571926698e5560a1a6b14d)), closes [#77](https://github.com/aws-amplify/amplify-codegen-ui/issues/77)
- ensuring we properly escape object keys with non-alpha characters ([5216eca](https://github.com/aws-amplify/amplify-codegen-ui/commit/5216ecad6c6f7c84dd8a25cfedbe9214b01dca76))
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- import custom component from local directory ([#182](https://github.com/aws-amplify/amplify-codegen-ui/issues/182)) ([5cd1076](https://github.com/aws-amplify/amplify-codegen-ui/commit/5cd1076a4cd7a0710c8be70cfcb70a5571979e6a))
- include typescript parser plugin ([8b4e765](https://github.com/aws-amplify/amplify-codegen-ui/commit/8b4e7655f244d08286e7ac15551221fe6bf06589))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only import props type for top-level component ([c850b8c](https://github.com/aws-amplify/amplify-codegen-ui/commit/c850b8c5ad110421d2ad68898452e8fef5321cd8))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- only use useDataStoreBinding when predicate is set ([#86](https://github.com/aws-amplify/amplify-codegen-ui/issues/86)) ([ec079f1](https://github.com/aws-amplify/amplify-codegen-ui/commit/ec079f14a50ec6e1132669761e6b924638e1c9ce)), closes [#84](https://github.com/aws-amplify/amplify-codegen-ui/issues/84)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove export modifier for renderComponentOnly ([#66](https://github.com/aws-amplify/amplify-codegen-ui/issues/66)) ([6e3d097](https://github.com/aws-amplify/amplify-codegen-ui/commit/6e3d097f217ecbdfb5165888e47eb0e6a16da8c4))
- remove extra component directories ([#71](https://github.com/aws-amplify/amplify-codegen-ui/issues/71)) ([e68d92b](https://github.com/aws-amplify/amplify-codegen-ui/commit/e68d92bdfa4d2f5d34f9cdf0ee70376cec5ce43b))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))
- **codegen-ui-react:** collection items props takes precedent ([#96](https://github.com/aws-amplify/amplify-codegen-ui/issues/96)) ([0149ca2](https://github.com/aws-amplify/amplify-codegen-ui/commit/0149ca28741969aae5c3c5442985c10ad065501c)), closes [#90](https://github.com/aws-amplify/amplify-codegen-ui/issues/90)
- **codegen-ui-react:** include all imports used in generated components ([#40](https://github.com/aws-amplify/amplify-codegen-ui/issues/40)) ([04f86bb](https://github.com/aws-amplify/amplify-codegen-ui/commit/04f86bb6a3146d578420b7e0bc3c525fa6572b6b))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))
- top level bindingProperties should be optional ([#61](https://github.com/aws-amplify/amplify-codegen-ui/issues/61)) ([b97d6fd](https://github.com/aws-amplify/amplify-codegen-ui/commit/b97d6fdeba5f2525e9a8ced50e5fdb0dfaff3f51))
- top level prop available as variables ([#62](https://github.com/aws-amplify/amplify-codegen-ui/issues/62)) ([788802e](https://github.com/aws-amplify/amplify-codegen-ui/commit/788802e7c0d2426a1c22460bf3bc240e94cbb0c7))
- update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
- update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
- update unit tests per change from React.Element to React.ReactElement ([d1b782f](https://github.com/aws-amplify/amplify-codegen-ui/commit/d1b782fc4220976bfaa40a9693ed8a4a0109684b))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))
- use correct identifier when using useDataStoreBinding ([#104](https://github.com/aws-amplify/amplify-codegen-ui/issues/104)) ([ef93e45](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef93e4583b68a6fe28d50663bd2c49d9889b8029))
- use temp package that does not break browser ([#136](https://github.com/aws-amplify/amplify-codegen-ui/issues/136)) ([12c9efb](https://github.com/aws-amplify/amplify-codegen-ui/commit/12c9efb673b186abe55dd643bae531d06ec8e368))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add notice to top of generated files ([#56](https://github.com/aws-amplify/amplify-codegen-ui/issues/56)) ([4f492cd](https://github.com/aws-amplify/amplify-codegen-ui/commit/4f492cdcd08757c7e23f3be86e7264b29e4e3a0d)), closes [#55](https://github.com/aws-amplify/amplify-codegen-ui/issues/55)
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add react attr generation for collectionBindingProperties ([#53](https://github.com/aws-amplify/amplify-codegen-ui/issues/53)) ([33390ed](https://github.com/aws-amplify/amplify-codegen-ui/commit/33390ed150c33a51de3808663b9fc3c46c998de5))
- add single record binding generation ([#51](https://github.com/aws-amplify/amplify-codegen-ui/issues/51)) ([454d754](https://github.com/aws-amplify/amplify-codegen-ui/commit/454d7541b5a699a0598f5fb160639050f104fc73))
- add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
- add user specific attrs ([#107](https://github.com/aws-amplify/amplify-codegen-ui/issues/107)) ([67f34ac](https://github.com/aws-amplify/amplify-codegen-ui/commit/67f34acc6d13f1f9ebd283e20454480db393343f))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- extend base action binding types with navigation types and add test ([dbccfbd](https://github.com/aws-amplify/amplify-codegen-ui/commit/dbccfbd0466186c8cc09d71419504b0ee3abc4ff))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- output type declaration ([#118](https://github.com/aws-amplify/amplify-codegen-ui/issues/118)) ([9db8bdc](https://github.com/aws-amplify/amplify-codegen-ui/commit/9db8bdc80f66567b3d4d9d94d4b4a6bb386af28d))
- parse string wrapped fixed values ([#155](https://github.com/aws-amplify/amplify-codegen-ui/issues/155)) ([3827f7c](https://github.com/aws-amplify/amplify-codegen-ui/commit/3827f7c612f782a36d2563c4203c20437e75bfdd))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- replacing dependency on helper for collections sort with inline sort function ([0d0df62](https://github.com/aws-amplify/amplify-codegen-ui/commit/0d0df626fe5b2b0bf028a569adf0faad1aa3f0aa))
- throw error on invalid script kind ([#133](https://github.com/aws-amplify/amplify-codegen-ui/issues/133)) ([ee3e79f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee3e79f351cf0d5151bf9bbaa048f05897bcb9b0))

## [0.2.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/@amzn/codegen-ui-react@0.2.0...@amzn/codegen-ui-react@0.2.1) (2021-10-28)

### Bug Fixes

- createDatastorePredicate call was added ([#166](https://github.com/aws-amplify/amplify-codegen-ui/issues/166)) ([fbee20c](https://github.com/aws-amplify/amplify-codegen-ui/commit/fbee20c9aae661571653a1b0ee3801e67d02e123))
- simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))

# 0.2.0 (2021-10-27)

### Bug Fixes

- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- collection binding with no predicate ([#98](https://github.com/aws-amplify/amplify-codegen-ui/issues/98)) ([3e38fcc](https://github.com/aws-amplify/amplify-codegen-ui/commit/3e38fccf4c456d34f15b7ca050be6041ccb80417))
- dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
- enable esModuleInterop ([#85](https://github.com/aws-amplify/amplify-codegen-ui/issues/85)) ([32eac19](https://github.com/aws-amplify/amplify-codegen-ui/commit/32eac194dc4ba4fbb5571926698e5560a1a6b14d)), closes [#77](https://github.com/aws-amplify/amplify-codegen-ui/issues/77)
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- include typescript parser plugin ([8b4e765](https://github.com/aws-amplify/amplify-codegen-ui/commit/8b4e7655f244d08286e7ac15551221fe6bf06589))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- only use useDataStoreBinding when predicate is set ([#86](https://github.com/aws-amplify/amplify-codegen-ui/issues/86)) ([ec079f1](https://github.com/aws-amplify/amplify-codegen-ui/commit/ec079f14a50ec6e1132669761e6b924638e1c9ce)), closes [#84](https://github.com/aws-amplify/amplify-codegen-ui/issues/84)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove export modifier for renderComponentOnly ([#66](https://github.com/aws-amplify/amplify-codegen-ui/issues/66)) ([6e3d097](https://github.com/aws-amplify/amplify-codegen-ui/commit/6e3d097f217ecbdfb5165888e47eb0e6a16da8c4))
- remove extra component directories ([#71](https://github.com/aws-amplify/amplify-codegen-ui/issues/71)) ([e68d92b](https://github.com/aws-amplify/amplify-codegen-ui/commit/e68d92bdfa4d2f5d34f9cdf0ee70376cec5ce43b))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- **codegen-ui-react:** collection items props takes precedent ([#96](https://github.com/aws-amplify/amplify-codegen-ui/issues/96)) ([0149ca2](https://github.com/aws-amplify/amplify-codegen-ui/commit/0149ca28741969aae5c3c5442985c10ad065501c)), closes [#90](https://github.com/aws-amplify/amplify-codegen-ui/issues/90)
- **codegen-ui-react:** include all imports used in generated components ([#40](https://github.com/aws-amplify/amplify-codegen-ui/issues/40)) ([04f86bb](https://github.com/aws-amplify/amplify-codegen-ui/commit/04f86bb6a3146d578420b7e0bc3c525fa6572b6b))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))
- top level bindingProperties should be optional ([#61](https://github.com/aws-amplify/amplify-codegen-ui/issues/61)) ([b97d6fd](https://github.com/aws-amplify/amplify-codegen-ui/commit/b97d6fdeba5f2525e9a8ced50e5fdb0dfaff3f51))
- top level prop available as variables ([#62](https://github.com/aws-amplify/amplify-codegen-ui/issues/62)) ([788802e](https://github.com/aws-amplify/amplify-codegen-ui/commit/788802e7c0d2426a1c22460bf3bc240e94cbb0c7))
- update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
- update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
- update unit tests per change from React.Element to React.ReactElement ([d1b782f](https://github.com/aws-amplify/amplify-codegen-ui/commit/d1b782fc4220976bfaa40a9693ed8a4a0109684b))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
- use correct identifier when using useDataStoreBinding ([#104](https://github.com/aws-amplify/amplify-codegen-ui/issues/104)) ([ef93e45](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef93e4583b68a6fe28d50663bd2c49d9889b8029))
- use temp package that does not break browser ([#136](https://github.com/aws-amplify/amplify-codegen-ui/issues/136)) ([12c9efb](https://github.com/aws-amplify/amplify-codegen-ui/commit/12c9efb673b186abe55dd643bae531d06ec8e368))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add notice to top of generated files ([#56](https://github.com/aws-amplify/amplify-codegen-ui/issues/56)) ([4f492cd](https://github.com/aws-amplify/amplify-codegen-ui/commit/4f492cdcd08757c7e23f3be86e7264b29e4e3a0d)), closes [#55](https://github.com/aws-amplify/amplify-codegen-ui/issues/55)
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add react attr generation for collectionBindingProperties ([#53](https://github.com/aws-amplify/amplify-codegen-ui/issues/53)) ([33390ed](https://github.com/aws-amplify/amplify-codegen-ui/commit/33390ed150c33a51de3808663b9fc3c46c998de5))
- add single record binding generation ([#51](https://github.com/aws-amplify/amplify-codegen-ui/issues/51)) ([454d754](https://github.com/aws-amplify/amplify-codegen-ui/commit/454d7541b5a699a0598f5fb160639050f104fc73))
- add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
- add user specific attrs ([#107](https://github.com/aws-amplify/amplify-codegen-ui/issues/107)) ([67f34ac](https://github.com/aws-amplify/amplify-codegen-ui/commit/67f34acc6d13f1f9ebd283e20454480db393343f))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- extend base action binding types with navigation types and add test ([dbccfbd](https://github.com/aws-amplify/amplify-codegen-ui/commit/dbccfbd0466186c8cc09d71419504b0ee3abc4ff))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- output type declaration ([#118](https://github.com/aws-amplify/amplify-codegen-ui/issues/118)) ([9db8bdc](https://github.com/aws-amplify/amplify-codegen-ui/commit/9db8bdc80f66567b3d4d9d94d4b4a6bb386af28d))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- replacing dependency on helper for collections sort with inline sort function ([0d0df62](https://github.com/aws-amplify/amplify-codegen-ui/commit/0d0df626fe5b2b0bf028a569adf0faad1aa3f0aa))
- throw error on invalid script kind ([#133](https://github.com/aws-amplify/amplify-codegen-ui/issues/133)) ([ee3e79f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee3e79f351cf0d5151bf9bbaa048f05897bcb9b0))

# 0.1.0 (2021-10-20)

### Bug Fixes

- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- collection binding with no predicate ([#98](https://github.com/aws-amplify/amplify-codegen-ui/issues/98)) ([3e38fcc](https://github.com/aws-amplify/amplify-codegen-ui/commit/3e38fccf4c456d34f15b7ca050be6041ccb80417))
- enable esModuleInterop ([#85](https://github.com/aws-amplify/amplify-codegen-ui/issues/85)) ([32eac19](https://github.com/aws-amplify/amplify-codegen-ui/commit/32eac194dc4ba4fbb5571926698e5560a1a6b14d)), closes [#77](https://github.com/aws-amplify/amplify-codegen-ui/issues/77)
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- include typescript parser plugin ([8b4e765](https://github.com/aws-amplify/amplify-codegen-ui/commit/8b4e7655f244d08286e7ac15551221fe6bf06589))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- only use useDataStoreBinding when predicate is set ([#86](https://github.com/aws-amplify/amplify-codegen-ui/issues/86)) ([ec079f1](https://github.com/aws-amplify/amplify-codegen-ui/commit/ec079f14a50ec6e1132669761e6b924638e1c9ce)), closes [#84](https://github.com/aws-amplify/amplify-codegen-ui/issues/84)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove export modifier for renderComponentOnly ([#66](https://github.com/aws-amplify/amplify-codegen-ui/issues/66)) ([6e3d097](https://github.com/aws-amplify/amplify-codegen-ui/commit/6e3d097f217ecbdfb5165888e47eb0e6a16da8c4))
- remove extra component directories ([#71](https://github.com/aws-amplify/amplify-codegen-ui/issues/71)) ([e68d92b](https://github.com/aws-amplify/amplify-codegen-ui/commit/e68d92bdfa4d2f5d34f9cdf0ee70376cec5ce43b))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- **codegen-ui-react:** collection items props takes precedent ([#96](https://github.com/aws-amplify/amplify-codegen-ui/issues/96)) ([0149ca2](https://github.com/aws-amplify/amplify-codegen-ui/commit/0149ca28741969aae5c3c5442985c10ad065501c)), closes [#90](https://github.com/aws-amplify/amplify-codegen-ui/issues/90)
- **codegen-ui-react:** include all imports used in generated components ([#40](https://github.com/aws-amplify/amplify-codegen-ui/issues/40)) ([04f86bb](https://github.com/aws-amplify/amplify-codegen-ui/commit/04f86bb6a3146d578420b7e0bc3c525fa6572b6b))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))
- top level bindingProperties should be optional ([#61](https://github.com/aws-amplify/amplify-codegen-ui/issues/61)) ([b97d6fd](https://github.com/aws-amplify/amplify-codegen-ui/commit/b97d6fdeba5f2525e9a8ced50e5fdb0dfaff3f51))
- top level prop available as variables ([#62](https://github.com/aws-amplify/amplify-codegen-ui/issues/62)) ([788802e](https://github.com/aws-amplify/amplify-codegen-ui/commit/788802e7c0d2426a1c22460bf3bc240e94cbb0c7))
- update unit tests per change from React.Element to React.ReactElement ([d1b782f](https://github.com/aws-amplify/amplify-codegen-ui/commit/d1b782fc4220976bfaa40a9693ed8a4a0109684b))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
- use correct identifier when using useDataStoreBinding ([#104](https://github.com/aws-amplify/amplify-codegen-ui/issues/104)) ([ef93e45](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef93e4583b68a6fe28d50663bd2c49d9889b8029))
- use temp package that does not break browser ([#136](https://github.com/aws-amplify/amplify-codegen-ui/issues/136)) ([12c9efb](https://github.com/aws-amplify/amplify-codegen-ui/commit/12c9efb673b186abe55dd643bae531d06ec8e368))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add notice to top of generated files ([#56](https://github.com/aws-amplify/amplify-codegen-ui/issues/56)) ([4f492cd](https://github.com/aws-amplify/amplify-codegen-ui/commit/4f492cdcd08757c7e23f3be86e7264b29e4e3a0d)), closes [#55](https://github.com/aws-amplify/amplify-codegen-ui/issues/55)
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add react attr generation for collectionBindingProperties ([#53](https://github.com/aws-amplify/amplify-codegen-ui/issues/53)) ([33390ed](https://github.com/aws-amplify/amplify-codegen-ui/commit/33390ed150c33a51de3808663b9fc3c46c998de5))
- add single record binding generation ([#51](https://github.com/aws-amplify/amplify-codegen-ui/issues/51)) ([454d754](https://github.com/aws-amplify/amplify-codegen-ui/commit/454d7541b5a699a0598f5fb160639050f104fc73))
- add user specific attrs ([#107](https://github.com/aws-amplify/amplify-codegen-ui/issues/107)) ([67f34ac](https://github.com/aws-amplify/amplify-codegen-ui/commit/67f34acc6d13f1f9ebd283e20454480db393343f))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- extend base action binding types with navigation types and add test ([dbccfbd](https://github.com/aws-amplify/amplify-codegen-ui/commit/dbccfbd0466186c8cc09d71419504b0ee3abc4ff))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- output type declaration ([#118](https://github.com/aws-amplify/amplify-codegen-ui/issues/118)) ([9db8bdc](https://github.com/aws-amplify/amplify-codegen-ui/commit/9db8bdc80f66567b3d4d9d94d4b4a6bb386af28d))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- replacing dependency on helper for collections sort with inline sort function ([0d0df62](https://github.com/aws-amplify/amplify-codegen-ui/commit/0d0df626fe5b2b0bf028a569adf0faad1aa3f0aa))
- throw error on invalid script kind ([#133](https://github.com/aws-amplify/amplify-codegen-ui/issues/133)) ([ee3e79f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee3e79f351cf0d5151bf9bbaa048f05897bcb9b0))
