# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.3.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.3.0...v2.3.1) (2022-07-15)

**Note:** Version bump only for package @aws-amplify/codegen-ui





# [2.3.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.2.1...v2.3.0) (2022-07-14)


### Bug Fixes

* handle auth prop in concat ([f7d645e](https://github.com/aws-amplify/amplify-codegen-ui/commit/f7d645e07e91848465e92f450e81d6ed92604057))


### Features

* adding breakpoint functionality in theme generation ([#515](https://github.com/aws-amplify/amplify-codegen-ui/issues/515)) ([28f97aa](https://github.com/aws-amplify/amplify-codegen-ui/commit/28f97aa7a290e3fd25efc6f0d51a39403d79b947))





## [2.2.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.2.0...v2.2.1) (2022-06-15)

**Note:** Version bump only for package @aws-amplify/codegen-ui

# [2.2.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.1.2...v2.2.0) (2022-04-13)

**Note:** Version bump only for package @aws-amplify/codegen-ui

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

# [2.0.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v1.2.0...v2.0.0) (2022-02-25)

### Bug Fixes

- add missing import statement, and correct controlled component state tracking ([#374](https://github.com/aws-amplify/amplify-codegen-ui/issues/374)) ([f6dfa0f](https://github.com/aws-amplify/amplify-codegen-ui/commit/f6dfa0fc26a7dbb65746c0ecb900404d1c4a9159))
- add override for stepper field controlled change event ([#389](https://github.com/aws-amplify/amplify-codegen-ui/issues/389)) ([ebd2542](https://github.com/aws-amplify/amplify-codegen-ui/commit/ebd2542bb39416a4403c72274a68069235b8fedc))
- add state for state reference in set state param ([#397](https://github.com/aws-amplify/amplify-codegen-ui/issues/397)) ([3a031b6](https://github.com/aws-amplify/amplify-codegen-ui/commit/3a031b616113199e30215cb6a55ca165e7546a7c))
- allow operand type to be specified in ConditionalStudioComponentProperty ([#335](https://github.com/aws-amplify/amplify-codegen-ui/issues/335)) ([3b3932b](https://github.com/aws-amplify/amplify-codegen-ui/commit/3b3932bf3824a63043700034e7d4d74fd8f329d9))
- bringing action names back inline with external model ([#382](https://github.com/aws-amplify/amplify-codegen-ui/issues/382)) ([91f6786](https://github.com/aws-amplify/amplify-codegen-ui/commit/91f678614e242e762ca5217cd3fee12d461f844c))
- enable authAttributes statement for component with auth action binding ([#395](https://github.com/aws-amplify/amplify-codegen-ui/issues/395)) ([9190dd6](https://github.com/aws-amplify/amplify-codegen-ui/commit/9190dd6d59e67ab18d6ee8dddf137a39af52952b))
- ensure value is not undefined before accessing in computeComponentMetadata ([c0e2cee](https://github.com/aws-amplify/amplify-codegen-ui/commit/c0e2cee1f4b929940c5aed8fd8ad3f2f7fe284c3))
- move validate schema to template renderer ([459f5ff](https://github.com/aws-amplify/amplify-codegen-ui/commit/459f5ffad0e43718c20015e1efa4541bfe3feaee))
- sanitize component name before generating statement declarations ([6c24129](https://github.com/aws-amplify/amplify-codegen-ui/commit/6c241295cc61edcb1a8c6983bbac19276aa36821))
- support mutation targets with invalid js names ([24c9eac](https://github.com/aws-amplify/amplify-codegen-ui/commit/24c9eacb4d4ba449ceb2bab176333f0c00d5e047))
- support synthetic prop mutation, and duplicate mutations on the same property ([#375](https://github.com/aws-amplify/amplify-codegen-ui/issues/375)) ([d3818ec](https://github.com/aws-amplify/amplify-codegen-ui/commit/d3818ec296701091fd6302e0777954740fb39472))
- use correct syntax for conditonals as action parameter ([#398](https://github.com/aws-amplify/amplify-codegen-ui/issues/398)) ([300114c](https://github.com/aws-amplify/amplify-codegen-ui/commit/300114c013fb92aad2961583703d7bb4ddcc3862))

### Features

- add control event to all state references with change event ([#388](https://github.com/aws-amplify/amplify-codegen-ui/issues/388)) ([53b7e75](https://github.com/aws-amplify/amplify-codegen-ui/commit/53b7e75a2a74296640c3ecb31f674f50aa08f989))
- add mutations ([#371](https://github.com/aws-amplify/amplify-codegen-ui/issues/371)) ([04b3d27](https://github.com/aws-amplify/amplify-codegen-ui/commit/04b3d2700726cbc4d57648a55dad9d8b6d495371))
- add schema version and validation ([90f9846](https://github.com/aws-amplify/amplify-codegen-ui/commit/90f9846088378b7599ba3b0ce453b8e360964dd9))
- add support for auth actions ([#361](https://github.com/aws-amplify/amplify-codegen-ui/issues/361)) ([e6c18cf](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6c18cfee448c8f0f10e558205f3905f6492ea5c))
- add support for DataStore actions ([#365](https://github.com/aws-amplify/amplify-codegen-ui/issues/365)) ([0289052](https://github.com/aws-amplify/amplify-codegen-ui/commit/028905237e52fed3c78ea18d0b447668927dc80e))
- add TextAreaField primitive ([1573489](https://github.com/aws-amplify/amplify-codegen-ui/commit/1573489facbd72379148ddacceeb9cbb9305245d))
- adding method to compute component metadata ([#400](https://github.com/aws-amplify/amplify-codegen-ui/issues/400)) ([867233f](https://github.com/aws-amplify/amplify-codegen-ui/commit/867233f0b5db2f3d51dbc20744735a29fab0bd28))
- allow objects to be passed into properties to support paths in icons ([#384](https://github.com/aws-amplify/amplify-codegen-ui/issues/384)) ([874e5e6](https://github.com/aws-amplify/amplify-codegen-ui/commit/874e5e6d300c5ebc1c8e9682e413b2734cf2558a))
- poc for useEffect to manage state dependencies ([ce65105](https://github.com/aws-amplify/amplify-codegen-ui/commit/ce651059cded8415d342123961dde4fe13c5e3a1))
- try and marshall variant values to json objects to support icon viewBox/paths ([d0dd300](https://github.com/aws-amplify/amplify-codegen-ui/commit/d0dd300bfad5a4e495fa26c19d22c7b597930b31))
- use default initial value for data dependent states ([022f9c5](https://github.com/aws-amplify/amplify-codegen-ui/commit/022f9c5361d72248507f3878f9450c3c995d77d7))

### BREAKING CHANGES

- schamaVersion is now a required field

# [1.2.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v1.0.0...v1.2.0) (2021-12-13)

### Bug Fixes

- dont navigate on each test, and remove unnecessary gets from cypress suite ([#281](https://github.com/aws-amplify/amplify-codegen-ui/issues/281)) ([c72e66c](https://github.com/aws-amplify/amplify-codegen-ui/commit/c72e66cee560d7133650d242e3c36341c0356d98))
- map prop to children prop for variant ([#297](https://github.com/aws-amplify/amplify-codegen-ui/issues/297)) ([#304](https://github.com/aws-amplify/amplify-codegen-ui/issues/304)) ([cc932c2](https://github.com/aws-amplify/amplify-codegen-ui/commit/cc932c200928e5ef3264a5f6b5ac5fc89cbf2073))

### Features

- add min required library versions for generated components ([#302](https://github.com/aws-amplify/amplify-codegen-ui/issues/302)) ([#303](https://github.com/aws-amplify/amplify-codegen-ui/issues/303)) ([7f08cd9](https://github.com/aws-amplify/amplify-codegen-ui/commit/7f08cd9f0d74436686057bfb0ee6563ef47fef3e))
- add support for developing on windows ([#276](https://github.com/aws-amplify/amplify-codegen-ui/issues/276)) ([985f576](https://github.com/aws-amplify/amplify-codegen-ui/commit/985f576f1df7251b4890366096326fee097fb7fc))
- use typescript virtual file server to allow transpilation without requiring a real fs ([#268](https://github.com/aws-amplify/amplify-codegen-ui/issues/268)) ([d8219c5](https://github.com/aws-amplify/amplify-codegen-ui/commit/d8219c50928e33ffd032df3a11b1024b3d7bf982))
- validate property values are not empty ([#247](https://github.com/aws-amplify/amplify-codegen-ui/issues/247)) ([d6933d5](https://github.com/aws-amplify/amplify-codegen-ui/commit/d6933d505b000856451bb873ef4406500345dd65))

# [1.1.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v1.0.0...v1.1.0) (2021-12-02)

### Features

- use typescript virtual file server to allow transpilation without requiring a real fs ([#268](https://github.com/aws-amplify/amplify-codegen-ui/issues/268)) ([d8219c5](https://github.com/aws-amplify/amplify-codegen-ui/commit/d8219c50928e33ffd032df3a11b1024b3d7bf982))

# [1.0.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.13.1...v1.0.0) (2021-12-01)

**Note:** Version bump only for package @aws-amplify/codegen-ui

## [0.13.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.13.0...v0.13.1) (2021-11-26)

**Note:** Version bump only for package @aws-amplify/codegen-ui

# [0.13.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.12.0...v0.13.0) (2021-11-23)

**Note:** Version bump only for package @aws-amplify/codegen-ui

# [0.12.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.10.1...v0.12.0) (2021-11-22)

### Bug Fixes

- fixing typescript version to 4.4.x, since 4.5.2 breaks the imports ([b726682](https://github.com/aws-amplify/amplify-codegen-ui/commit/b726682e56129ade22616682a14f481176851f94))

## [0.11.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.10.1...v0.11.1) (2021-11-19)

### Bug Fixes

- fixing typescript version to 4.4.x, since 4.5.2 breaks the imports ([b726682](https://github.com/aws-amplify/amplify-codegen-ui/commit/b726682e56129ade22616682a14f481176851f94))

# [0.11.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.10.1...v0.11.0) (2021-11-18)

### Bug Fixes

- fixing typescript version to 4.4.x, since 4.5.2 breaks the imports ([25c2dc9](https://github.com/aws-amplify/amplify-codegen-ui/commit/25c2dc970fab06abf7554d7ff69de4b12f65abd0))

## [0.10.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.10.0...v0.10.1) (2021-11-17)

### Bug Fixes

- use static list iconset instead of dynamic from import ([3607d50](https://github.com/aws-amplify/amplify-codegen-ui/commit/3607d50e2436d4e24341e6e5a03e2358ca0ee93b))

# [0.10.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.9.0...v0.10.0) (2021-11-16)

**Note:** Version bump only for package @aws-amplify/codegen-ui

# 0.9.0 (2021-11-15)

### Bug Fixes

- add eslint ignore to address gh style warning ([8ee7c15](https://github.com/aws-amplify/amplify-codegen-ui/commit/8ee7c1502494171044b10efad6e1e536825d64f1))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- fixing override indice bug, and adding e2e test ([c8500bf](https://github.com/aws-amplify/amplify-codegen-ui/commit/c8500bf06ff9be18715e834cd1f9f43942b9a0ea))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add error handler to common entry points, and basic input validation ([84b28c3](https://github.com/aws-amplify/amplify-codegen-ui/commit/84b28c3e8b84caaf575873ef76c9c66779323ab3))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add SliderField primitive ([#213](https://github.com/aws-amplify/amplify-codegen-ui/issues/213)) ([78209e2](https://github.com/aws-amplify/amplify-codegen-ui/commit/78209e25a0ca324e99a5eb14c5e05cfa28df6fd4))
- add support for most existing primitives ([#194](https://github.com/aws-amplify/amplify-codegen-ui/issues/194)) ([f1fe271](https://github.com/aws-amplify/amplify-codegen-ui/commit/f1fe271ff128a8683cd8f06da8aaa0c577a9d1fc))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- test-generate each case individually, add support for error cases as well ([46f65cc](https://github.com/aws-amplify/amplify-codegen-ui/commit/46f65ccef5cc748d7c86025c81573c64ed4afa3d))
- update model validator to throw on names and component types with whitespace ([760a826](https://github.com/aws-amplify/amplify-codegen-ui/commit/760a8269cee66252706efec08eb04fba1e0b72ec))

# 0.8.0 (2021-11-12)

### Bug Fixes

- add eslint ignore to address gh style warning ([8ee7c15](https://github.com/aws-amplify/amplify-codegen-ui/commit/8ee7c1502494171044b10efad6e1e536825d64f1))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- fixing override indice bug, and adding e2e test ([c8500bf](https://github.com/aws-amplify/amplify-codegen-ui/commit/c8500bf06ff9be18715e834cd1f9f43942b9a0ea))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add error handler to common entry points, and basic input validation ([84b28c3](https://github.com/aws-amplify/amplify-codegen-ui/commit/84b28c3e8b84caaf575873ef76c9c66779323ab3))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add support for most existing primitives ([#194](https://github.com/aws-amplify/amplify-codegen-ui/issues/194)) ([f1fe271](https://github.com/aws-amplify/amplify-codegen-ui/commit/f1fe271ff128a8683cd8f06da8aaa0c577a9d1fc))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- test-generate each case individually, add support for error cases as well ([46f65cc](https://github.com/aws-amplify/amplify-codegen-ui/commit/46f65ccef5cc748d7c86025c81573c64ed4afa3d))
- update model validator to throw on names and component types with whitespace ([071a126](https://github.com/aws-amplify/amplify-codegen-ui/commit/071a1269e80f5c926602c0ef0a57524b6023bac3))

# 0.7.0 (2021-11-09)

### Bug Fixes

- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- fixing override indice bug, and adding e2e test ([c8500bf](https://github.com/aws-amplify/amplify-codegen-ui/commit/c8500bf06ff9be18715e834cd1f9f43942b9a0ea))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add support for most existing primitives ([#194](https://github.com/aws-amplify/amplify-codegen-ui/issues/194)) ([f1fe271](https://github.com/aws-amplify/amplify-codegen-ui/commit/f1fe271ff128a8683cd8f06da8aaa0c577a9d1fc))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- test-generate each case individually, add support for error cases as well ([46f65cc](https://github.com/aws-amplify/amplify-codegen-ui/commit/46f65ccef5cc748d7c86025c81573c64ed4afa3d))

# 0.6.0 (2021-11-04)

### Bug Fixes

- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- fixing override indice bug, and adding e2e test ([c8500bf](https://github.com/aws-amplify/amplify-codegen-ui/commit/c8500bf06ff9be18715e834cd1f9f43942b9a0ea))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))

# 0.5.0 (2021-11-04)

### Bug Fixes

- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))

## [0.2.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/@amzn/codegen-ui@0.2.0...@amzn/codegen-ui@0.2.1) (2021-10-28)

**Note:** Version bump only for package @amzn/codegen-ui

# 0.2.0 (2021-10-27)

### Bug Fixes

- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))

# 0.1.0 (2021-10-20)

### Bug Fixes

- moving @aws-amplify/ui-react to a devDependency ([1aaa55d](https://github.com/aws-amplify/amplify-codegen-ui/commit/1aaa55d3eee0cd9a272888eada1f283cfc2a93c5))
- only pass props to top level ([#63](https://github.com/aws-amplify/amplify-codegen-ui/issues/63)) ([5e59d9b](https://github.com/aws-amplify/amplify-codegen-ui/commit/5e59d9b861bff6b363a15fa3e6ee7f985ecc53dd)), closes [#58](https://github.com/aws-amplify/amplify-codegen-ui/issues/58)
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- **codegen-ui-react:** include babel parser for prettier ([#83](https://github.com/aws-amplify/amplify-codegen-ui/issues/83)) ([e28551c](https://github.com/aws-amplify/amplify-codegen-ui/commit/e28551c96d0b22fd4f4135554291a94f5cfddea0))

### Features

- add base action binding support ([#124](https://github.com/aws-amplify/amplify-codegen-ui/issues/124)) ([e6e60c0](https://github.com/aws-amplify/amplify-codegen-ui/commit/e6e60c0394036065991920622bc30caac00dafed))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- adding support for style variants in generated components ([bb41ac5](https://github.com/aws-amplify/amplify-codegen-ui/commit/bb41ac5a836f7b3bfb6aeb72308db362fdec127f))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
