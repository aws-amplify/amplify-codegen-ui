# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.2.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.2.0...v2.2.1) (2022-06-15)

**Note:** Version bump only for package @aws-amplify/codegen-ui-test-generator

# [2.2.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v2.1.2...v2.2.0) (2022-04-13)

### Bug Fixes

- change tabs to buttons per UI release 2.9.0 ([1db38f3](https://github.com/aws-amplify/amplify-codegen-ui/commit/1db38f3fd4f581a7b91ae782cb272a801ac78364))
- make complex integ tests agnostic to style order ([b8e9922](https://github.com/aws-amplify/amplify-codegen-ui/commit/b8e9922e565bcba2a1c10d6def2d5a4996c87ec7))
- remove jsx ext from declaration file ext ([#458](https://github.com/aws-amplify/amplify-codegen-ui/issues/458)) ([e4062c8](https://github.com/aws-amplify/amplify-codegen-ui/commit/e4062c8760b3c850125c7ab5c6ae7d4e2258c598))

### Features

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

# [2.0.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v1.2.0...v2.0.0) (2022-02-25)

### Bug Fixes

- bringing action names back inline with external model ([#382](https://github.com/aws-amplify/amplify-codegen-ui/issues/382)) ([91f6786](https://github.com/aws-amplify/amplify-codegen-ui/commit/91f678614e242e762ca5217cd3fee12d461f844c))
- map prop to children prop for variant ([#297](https://github.com/aws-amplify/amplify-codegen-ui/issues/297)) ([1d606fa](https://github.com/aws-amplify/amplify-codegen-ui/commit/1d606fac4e8be1103aa1ce7e68c6d72d339e39e6))
- use correct syntax for conditonals as action parameter ([#398](https://github.com/aws-amplify/amplify-codegen-ui/issues/398)) ([300114c](https://github.com/aws-amplify/amplify-codegen-ui/commit/300114c013fb92aad2961583703d7bb4ddcc3862))

### Features

- add control event to all state references with change event ([#388](https://github.com/aws-amplify/amplify-codegen-ui/issues/388)) ([53b7e75](https://github.com/aws-amplify/amplify-codegen-ui/commit/53b7e75a2a74296640c3ecb31f674f50aa08f989))
- add Menu primitive ([#322](https://github.com/aws-amplify/amplify-codegen-ui/issues/322)) ([fe26cca](https://github.com/aws-amplify/amplify-codegen-ui/commit/fe26cca9843ef909160cf4861f0d8134b844b85e))
- add Table primitive ([#323](https://github.com/aws-amplify/amplify-codegen-ui/issues/323)) ([605284f](https://github.com/aws-amplify/amplify-codegen-ui/commit/605284fdbe9f09b7440ad949cb8dbab1f936f995))
- add TextAreaField primitive ([1573489](https://github.com/aws-amplify/amplify-codegen-ui/commit/1573489facbd72379148ddacceeb9cbb9305245d))
- adding form with actions example ([b11929a](https://github.com/aws-amplify/amplify-codegen-ui/commit/b11929ae0d64b69732d82f2022195400f68cde06))
- poc for useEffect to manage state dependencies ([ce65105](https://github.com/aws-amplify/amplify-codegen-ui/commit/ce651059cded8415d342123961dde4fe13c5e3a1))
- use default initial value for data dependent states ([022f9c5](https://github.com/aws-amplify/amplify-codegen-ui/commit/022f9c5361d72248507f3878f9450c3c995d77d7))

# [1.2.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v1.0.0...v1.2.0) (2021-12-13)

### Bug Fixes

- dont navigate on each test, and remove unnecessary gets from cypress suite ([#281](https://github.com/aws-amplify/amplify-codegen-ui/issues/281)) ([c72e66c](https://github.com/aws-amplify/amplify-codegen-ui/commit/c72e66cee560d7133650d242e3c36341c0356d98))
- map prop to children prop for variant ([#297](https://github.com/aws-amplify/amplify-codegen-ui/issues/297)) ([#304](https://github.com/aws-amplify/amplify-codegen-ui/issues/304)) ([cc932c2](https://github.com/aws-amplify/amplify-codegen-ui/commit/cc932c200928e5ef3264a5f6b5ac5fc89cbf2073))

### Features

- add Expander primitive ([#252](https://github.com/aws-amplify/amplify-codegen-ui/issues/252)) ([91096ce](https://github.com/aws-amplify/amplify-codegen-ui/commit/91096ce8b3e6e7604c6dd63df8be5ef642b08b58))
- add import mappings to non-dynamic, and correct EscapeHatchProps import type. ([#277](https://github.com/aws-amplify/amplify-codegen-ui/issues/277)) ([16acc35](https://github.com/aws-amplify/amplify-codegen-ui/commit/16acc35303f1fa62b6dbc8c72b4dd2dd22166238))
- add support for developing on windows ([#276](https://github.com/aws-amplify/amplify-codegen-ui/issues/276)) ([985f576](https://github.com/aws-amplify/amplify-codegen-ui/commit/985f576f1df7251b4890366096326fee097fb7fc))
- use typescript virtual file server to allow transpilation without requiring a real fs ([#268](https://github.com/aws-amplify/amplify-codegen-ui/issues/268)) ([d8219c5](https://github.com/aws-amplify/amplify-codegen-ui/commit/d8219c50928e33ffd032df3a11b1024b3d7bf982))

# [1.1.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v1.0.0...v1.1.0) (2021-12-02)

### Features

- use typescript virtual file server to allow transpilation without requiring a real fs ([#268](https://github.com/aws-amplify/amplify-codegen-ui/issues/268)) ([d8219c5](https://github.com/aws-amplify/amplify-codegen-ui/commit/d8219c50928e33ffd032df3a11b1024b3d7bf982))

# [1.0.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.13.1...v1.0.0) (2021-12-01)

**Note:** Version bump only for package @aws-amplify/codegen-ui-test-generator

## [0.13.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.13.0...v0.13.1) (2021-11-26)

**Note:** Version bump only for package @aws-amplify/codegen-ui-test-generator

# [0.13.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.12.0...v0.13.0) (2021-11-23)

### Bug Fixes

- convert built-in iconset names to pascal case ([#253](https://github.com/aws-amplify/amplify-codegen-ui/issues/253)) ([0c12c7b](https://github.com/aws-amplify/amplify-codegen-ui/commit/0c12c7bcf9a5d5a06ed7238ffe508c1e13a529dd))

# [0.12.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.10.1...v0.12.0) (2021-11-22)

### Bug Fixes

- deep merge variants and overrides rather than overwrite with spread ([a779553](https://github.com/aws-amplify/amplify-codegen-ui/commit/a779553f373c45406aa1631f9ff60eeb33775843))
- fixing typescript version to 4.4.x, since 4.5.2 breaks the imports ([b726682](https://github.com/aws-amplify/amplify-codegen-ui/commit/b726682e56129ade22616682a14f481176851f94))
- removing label override for checkbox field, and removing label, which is not in primitives ([c819478](https://github.com/aws-amplify/amplify-codegen-ui/commit/c819478525f20dcd1be5664cb0563ab3a7dd9875))

## [0.11.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.10.1...v0.11.1) (2021-11-19)

### Bug Fixes

- deep merge variants and overrides rather than overwrite with spread ([a779553](https://github.com/aws-amplify/amplify-codegen-ui/commit/a779553f373c45406aa1631f9ff60eeb33775843))
- fixing typescript version to 4.4.x, since 4.5.2 breaks the imports ([b726682](https://github.com/aws-amplify/amplify-codegen-ui/commit/b726682e56129ade22616682a14f481176851f94))
- removing label override for checkbox field, and removing label, which is not in primitives ([c819478](https://github.com/aws-amplify/amplify-codegen-ui/commit/c819478525f20dcd1be5664cb0563ab3a7dd9875))

# [0.11.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.10.1...v0.11.0) (2021-11-18)

### Bug Fixes

- fixing typescript version to 4.4.x, since 4.5.2 breaks the imports ([25c2dc9](https://github.com/aws-amplify/amplify-codegen-ui/commit/25c2dc970fab06abf7554d7ff69de4b12f65abd0))

## [0.10.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.10.0...v0.10.1) (2021-11-17)

**Note:** Version bump only for package @aws-amplify/codegen-ui-test-generator

# [0.10.0](https://github.com/aws-amplify/amplify-codegen-ui/compare/v0.9.0...v0.10.0) (2021-11-16)

### Bug Fixes

- remove special 'value' handling for text, since it causes issues, and is replaced w/ 'label' ([c4767da](https://github.com/aws-amplify/amplify-codegen-ui/commit/c4767da593f6cd091aa7a9642402f9f7433a8f58))

### Features

- add built-in iconset ([#219](https://github.com/aws-amplify/amplify-codegen-ui/issues/219)) ([d3e097b](https://github.com/aws-amplify/amplify-codegen-ui/commit/d3e097b1d48dee50061d304ba8a18089dcf668ac))

# 0.9.0 (2021-11-15)

### Bug Fixes

- add custom component test ([d765667](https://github.com/aws-amplify/amplify-codegen-ui/commit/d7656677669485a9acc9f537e80d630223b2b62d))
- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding additional test cases, and documenting failures as they come up ([8340f98](https://github.com/aws-amplify/amplify-codegen-ui/commit/8340f985f78e6af693286e9124d64108265e182b))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- adding tests for basic components, stubbing remaining basic components ([c3ee4e7](https://github.com/aws-amplify/amplify-codegen-ui/commit/c3ee4e77451d542b394c2b119704950f9b28d148))
- adding theme files to test-generator, and moving into subdirectories ([0b6f970](https://github.com/aws-amplify/amplify-codegen-ui/commit/0b6f9707ffc839b2d7412926ad9c1683eec19c7a))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
- enable info level logging, convert test-generator output to markdown ([a23ccb7](https://github.com/aws-amplify/amplify-codegen-ui/commit/a23ccb70a511f386ad11781a88e2987b5908cb38))
- ensuring we properly escape object keys with non-alpha characters ([5216eca](https://github.com/aws-amplify/amplify-codegen-ui/commit/5216ecad6c6f7c84dd8a25cfedbe9214b01dca76))
- fixing override indice bug, and adding e2e test ([c8500bf](https://github.com/aws-amplify/amplify-codegen-ui/commit/c8500bf06ff9be18715e834cd1f9f43942b9a0ea))
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- import custom component from local directory ([#182](https://github.com/aws-amplify/amplify-codegen-ui/issues/182)) ([5cd1076](https://github.com/aws-amplify/amplify-codegen-ui/commit/5cd1076a4cd7a0710c8be70cfcb70a5571979e6a))
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))
- update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
- update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating example goldens to use children property instead of explicit text or string ([19f3182](https://github.com/aws-amplify/amplify-codegen-ui/commit/19f31824f651d46122bb84d4b2f9c7646e2c7554))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating tests now that react router v6 is part of create-react-app ([3c6beed](https://github.com/aws-amplify/amplify-codegen-ui/commit/3c6beed31f7980422a6d2cbd5cdec4937ad6fed9))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))

### Features

- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add error handler to common entry points, and basic input validation ([84b28c3](https://github.com/aws-amplify/amplify-codegen-ui/commit/84b28c3e8b84caaf575873ef76c9c66779323ab3))
- add index file renderer, and update sample imports to reference ([361bed2](https://github.com/aws-amplify/amplify-codegen-ui/commit/361bed24af1501a710c3fffa5341a14613c46da1))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add SliderField primitive ([#213](https://github.com/aws-amplify/amplify-codegen-ui/issues/213)) ([78209e2](https://github.com/aws-amplify/amplify-codegen-ui/commit/78209e25a0ca324e99a5eb14c5e05cfa28df6fd4))
- add support for most existing primitives ([#194](https://github.com/aws-amplify/amplify-codegen-ui/issues/194)) ([f1fe271](https://github.com/aws-amplify/amplify-codegen-ui/commit/f1fe271ff128a8683cd8f06da8aaa0c577a9d1fc))
- add TextField primitive ([#211](https://github.com/aws-amplify/amplify-codegen-ui/issues/211)) ([bc7de0f](https://github.com/aws-amplify/amplify-codegen-ui/commit/bc7de0fd38f0dd16f93eee84d870fb606ad4cd13))
- add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding remaining test goldens, docs on e2e tests, and todos on next steps ([30a5587](https://github.com/aws-amplify/amplify-codegen-ui/commit/30a55872e60f00296f58128618014e44e480df3c))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- parse string wrapped fixed values ([#155](https://github.com/aws-amplify/amplify-codegen-ui/issues/155)) ([3827f7c](https://github.com/aws-amplify/amplify-codegen-ui/commit/3827f7c612f782a36d2563c4203c20437e75bfdd))
- primitive children prop mapping ([#191](https://github.com/aws-amplify/amplify-codegen-ui/issues/191)) ([d6cf178](https://github.com/aws-amplify/amplify-codegen-ui/commit/d6cf17856b7efe6ae5c0eb448c690a54628d3f89))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- remove FieldGroup, FieldGroupIcon, and FieldGroupIconButton primitives ([#207](https://github.com/aws-amplify/amplify-codegen-ui/issues/207)) ([baa8e64](https://github.com/aws-amplify/amplify-codegen-ui/commit/baa8e64182789234849833fd9934d50790305cab))
- remove input primitive ([#212](https://github.com/aws-amplify/amplify-codegen-ui/issues/212)) ([fc92841](https://github.com/aws-amplify/amplify-codegen-ui/commit/fc928413374ab11176011007dfb609462506e8c8))
- test-generate each case individually, add support for error cases as well ([46f65cc](https://github.com/aws-amplify/amplify-codegen-ui/commit/46f65ccef5cc748d7c86025c81573c64ed4afa3d))
- **test-generator:** run all schemas ([#39](https://github.com/aws-amplify/amplify-codegen-ui/issues/39)) ([00215ae](https://github.com/aws-amplify/amplify-codegen-ui/commit/00215ae32e043d366c2137346a74382cbd0d66f1))
- update model validator to throw on names and component types with whitespace ([760a826](https://github.com/aws-amplify/amplify-codegen-ui/commit/760a8269cee66252706efec08eb04fba1e0b72ec))

# 0.8.0 (2021-11-12)

### Bug Fixes

- add custom component test ([d765667](https://github.com/aws-amplify/amplify-codegen-ui/commit/d7656677669485a9acc9f537e80d630223b2b62d))
- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding additional test cases, and documenting failures as they come up ([8340f98](https://github.com/aws-amplify/amplify-codegen-ui/commit/8340f985f78e6af693286e9124d64108265e182b))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- adding tests for basic components, stubbing remaining basic components ([c3ee4e7](https://github.com/aws-amplify/amplify-codegen-ui/commit/c3ee4e77451d542b394c2b119704950f9b28d148))
- adding theme files to test-generator, and moving into subdirectories ([0b6f970](https://github.com/aws-amplify/amplify-codegen-ui/commit/0b6f9707ffc839b2d7412926ad9c1683eec19c7a))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
- enable info level logging, convert test-generator output to markdown ([a23ccb7](https://github.com/aws-amplify/amplify-codegen-ui/commit/a23ccb70a511f386ad11781a88e2987b5908cb38))
- ensuring we properly escape object keys with non-alpha characters ([5216eca](https://github.com/aws-amplify/amplify-codegen-ui/commit/5216ecad6c6f7c84dd8a25cfedbe9214b01dca76))
- fixing override indice bug, and adding e2e test ([c8500bf](https://github.com/aws-amplify/amplify-codegen-ui/commit/c8500bf06ff9be18715e834cd1f9f43942b9a0ea))
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- import custom component from local directory ([#182](https://github.com/aws-amplify/amplify-codegen-ui/issues/182)) ([5cd1076](https://github.com/aws-amplify/amplify-codegen-ui/commit/5cd1076a4cd7a0710c8be70cfcb70a5571979e6a))
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))
- update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
- update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating example goldens to use children property instead of explicit text or string ([19f3182](https://github.com/aws-amplify/amplify-codegen-ui/commit/19f31824f651d46122bb84d4b2f9c7646e2c7554))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating tests now that react router v6 is part of create-react-app ([3c6beed](https://github.com/aws-amplify/amplify-codegen-ui/commit/3c6beed31f7980422a6d2cbd5cdec4937ad6fed9))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))

### Features

- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add error handler to common entry points, and basic input validation ([84b28c3](https://github.com/aws-amplify/amplify-codegen-ui/commit/84b28c3e8b84caaf575873ef76c9c66779323ab3))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add support for most existing primitives ([#194](https://github.com/aws-amplify/amplify-codegen-ui/issues/194)) ([f1fe271](https://github.com/aws-amplify/amplify-codegen-ui/commit/f1fe271ff128a8683cd8f06da8aaa0c577a9d1fc))
- add TextField primitive ([#211](https://github.com/aws-amplify/amplify-codegen-ui/issues/211)) ([bc7de0f](https://github.com/aws-amplify/amplify-codegen-ui/commit/bc7de0fd38f0dd16f93eee84d870fb606ad4cd13))
- add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding remaining test goldens, docs on e2e tests, and todos on next steps ([30a5587](https://github.com/aws-amplify/amplify-codegen-ui/commit/30a55872e60f00296f58128618014e44e480df3c))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- parse string wrapped fixed values ([#155](https://github.com/aws-amplify/amplify-codegen-ui/issues/155)) ([3827f7c](https://github.com/aws-amplify/amplify-codegen-ui/commit/3827f7c612f782a36d2563c4203c20437e75bfdd))
- primitive children prop mapping ([#191](https://github.com/aws-amplify/amplify-codegen-ui/issues/191)) ([d6cf178](https://github.com/aws-amplify/amplify-codegen-ui/commit/d6cf17856b7efe6ae5c0eb448c690a54628d3f89))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- remove FieldGroup, FieldGroupIcon, and FieldGroupIconButton primitives ([#207](https://github.com/aws-amplify/amplify-codegen-ui/issues/207)) ([baa8e64](https://github.com/aws-amplify/amplify-codegen-ui/commit/baa8e64182789234849833fd9934d50790305cab))
- remove input primitive ([#212](https://github.com/aws-amplify/amplify-codegen-ui/issues/212)) ([fc92841](https://github.com/aws-amplify/amplify-codegen-ui/commit/fc928413374ab11176011007dfb609462506e8c8))
- test-generate each case individually, add support for error cases as well ([46f65cc](https://github.com/aws-amplify/amplify-codegen-ui/commit/46f65ccef5cc748d7c86025c81573c64ed4afa3d))
- **test-generator:** run all schemas ([#39](https://github.com/aws-amplify/amplify-codegen-ui/issues/39)) ([00215ae](https://github.com/aws-amplify/amplify-codegen-ui/commit/00215ae32e043d366c2137346a74382cbd0d66f1))
- update model validator to throw on names and component types with whitespace ([071a126](https://github.com/aws-amplify/amplify-codegen-ui/commit/071a1269e80f5c926602c0ef0a57524b6023bac3))

# 0.7.0 (2021-11-09)

### Bug Fixes

- add custom component test ([d765667](https://github.com/aws-amplify/amplify-codegen-ui/commit/d7656677669485a9acc9f537e80d630223b2b62d))
- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding additional test cases, and documenting failures as they come up ([8340f98](https://github.com/aws-amplify/amplify-codegen-ui/commit/8340f985f78e6af693286e9124d64108265e182b))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- adding tests for basic components, stubbing remaining basic components ([c3ee4e7](https://github.com/aws-amplify/amplify-codegen-ui/commit/c3ee4e77451d542b394c2b119704950f9b28d148))
- adding theme files to test-generator, and moving into subdirectories ([0b6f970](https://github.com/aws-amplify/amplify-codegen-ui/commit/0b6f9707ffc839b2d7412926ad9c1683eec19c7a))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
- enable info level logging, convert test-generator output to markdown ([a23ccb7](https://github.com/aws-amplify/amplify-codegen-ui/commit/a23ccb70a511f386ad11781a88e2987b5908cb38))
- ensuring we properly escape object keys with non-alpha characters ([5216eca](https://github.com/aws-amplify/amplify-codegen-ui/commit/5216ecad6c6f7c84dd8a25cfedbe9214b01dca76))
- fixing override indice bug, and adding e2e test ([c8500bf](https://github.com/aws-amplify/amplify-codegen-ui/commit/c8500bf06ff9be18715e834cd1f9f43942b9a0ea))
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- import custom component from local directory ([#182](https://github.com/aws-amplify/amplify-codegen-ui/issues/182)) ([5cd1076](https://github.com/aws-amplify/amplify-codegen-ui/commit/5cd1076a4cd7a0710c8be70cfcb70a5571979e6a))
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))
- update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
- update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating example goldens to use children property instead of explicit text or string ([19f3182](https://github.com/aws-amplify/amplify-codegen-ui/commit/19f31824f651d46122bb84d4b2f9c7646e2c7554))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating tests now that react router v6 is part of create-react-app ([3c6beed](https://github.com/aws-amplify/amplify-codegen-ui/commit/3c6beed31f7980422a6d2cbd5cdec4937ad6fed9))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))

### Features

- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add support for most existing primitives ([#194](https://github.com/aws-amplify/amplify-codegen-ui/issues/194)) ([f1fe271](https://github.com/aws-amplify/amplify-codegen-ui/commit/f1fe271ff128a8683cd8f06da8aaa0c577a9d1fc))
- add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding remaining test goldens, docs on e2e tests, and todos on next steps ([30a5587](https://github.com/aws-amplify/amplify-codegen-ui/commit/30a55872e60f00296f58128618014e44e480df3c))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- parse string wrapped fixed values ([#155](https://github.com/aws-amplify/amplify-codegen-ui/issues/155)) ([3827f7c](https://github.com/aws-amplify/amplify-codegen-ui/commit/3827f7c612f782a36d2563c4203c20437e75bfdd))
- primitive children prop mapping ([#191](https://github.com/aws-amplify/amplify-codegen-ui/issues/191)) ([d6cf178](https://github.com/aws-amplify/amplify-codegen-ui/commit/d6cf17856b7efe6ae5c0eb448c690a54628d3f89))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- test-generate each case individually, add support for error cases as well ([46f65cc](https://github.com/aws-amplify/amplify-codegen-ui/commit/46f65ccef5cc748d7c86025c81573c64ed4afa3d))
- **test-generator:** run all schemas ([#39](https://github.com/aws-amplify/amplify-codegen-ui/issues/39)) ([00215ae](https://github.com/aws-amplify/amplify-codegen-ui/commit/00215ae32e043d366c2137346a74382cbd0d66f1))

# 0.6.0 (2021-11-04)

### Bug Fixes

- add custom component test ([d765667](https://github.com/aws-amplify/amplify-codegen-ui/commit/d7656677669485a9acc9f537e80d630223b2b62d))
- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding additional test cases, and documenting failures as they come up ([8340f98](https://github.com/aws-amplify/amplify-codegen-ui/commit/8340f985f78e6af693286e9124d64108265e182b))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- adding tests for basic components, stubbing remaining basic components ([c3ee4e7](https://github.com/aws-amplify/amplify-codegen-ui/commit/c3ee4e77451d542b394c2b119704950f9b28d148))
- adding theme files to test-generator, and moving into subdirectories ([0b6f970](https://github.com/aws-amplify/amplify-codegen-ui/commit/0b6f9707ffc839b2d7412926ad9c1683eec19c7a))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
- enable info level logging, convert test-generator output to markdown ([a23ccb7](https://github.com/aws-amplify/amplify-codegen-ui/commit/a23ccb70a511f386ad11781a88e2987b5908cb38))
- ensuring we properly escape object keys with non-alpha characters ([5216eca](https://github.com/aws-amplify/amplify-codegen-ui/commit/5216ecad6c6f7c84dd8a25cfedbe9214b01dca76))
- fixing override indice bug, and adding e2e test ([c8500bf](https://github.com/aws-amplify/amplify-codegen-ui/commit/c8500bf06ff9be18715e834cd1f9f43942b9a0ea))
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- import custom component from local directory ([#182](https://github.com/aws-amplify/amplify-codegen-ui/issues/182)) ([5cd1076](https://github.com/aws-amplify/amplify-codegen-ui/commit/5cd1076a4cd7a0710c8be70cfcb70a5571979e6a))
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))
- update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
- update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating example goldens to use children property instead of explicit text or string ([19f3182](https://github.com/aws-amplify/amplify-codegen-ui/commit/19f31824f651d46122bb84d4b2f9c7646e2c7554))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating tests now that react router v6 is part of create-react-app ([3c6beed](https://github.com/aws-amplify/amplify-codegen-ui/commit/3c6beed31f7980422a6d2cbd5cdec4937ad6fed9))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))

### Features

- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding remaining test goldens, docs on e2e tests, and todos on next steps ([30a5587](https://github.com/aws-amplify/amplify-codegen-ui/commit/30a55872e60f00296f58128618014e44e480df3c))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- parse string wrapped fixed values ([#155](https://github.com/aws-amplify/amplify-codegen-ui/issues/155)) ([3827f7c](https://github.com/aws-amplify/amplify-codegen-ui/commit/3827f7c612f782a36d2563c4203c20437e75bfdd))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- **test-generator:** run all schemas ([#39](https://github.com/aws-amplify/amplify-codegen-ui/issues/39)) ([00215ae](https://github.com/aws-amplify/amplify-codegen-ui/commit/00215ae32e043d366c2137346a74382cbd0d66f1))

# 0.5.0 (2021-11-04)

### Bug Fixes

- add custom component test ([d765667](https://github.com/aws-amplify/amplify-codegen-ui/commit/d7656677669485a9acc9f537e80d630223b2b62d))
- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding additional test cases, and documenting failures as they come up ([8340f98](https://github.com/aws-amplify/amplify-codegen-ui/commit/8340f985f78e6af693286e9124d64108265e182b))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- adding tests for basic components, stubbing remaining basic components ([c3ee4e7](https://github.com/aws-amplify/amplify-codegen-ui/commit/c3ee4e77451d542b394c2b119704950f9b28d148))
- adding theme files to test-generator, and moving into subdirectories ([0b6f970](https://github.com/aws-amplify/amplify-codegen-ui/commit/0b6f9707ffc839b2d7412926ad9c1683eec19c7a))
- collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
- dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
- enable info level logging, convert test-generator output to markdown ([a23ccb7](https://github.com/aws-amplify/amplify-codegen-ui/commit/a23ccb70a511f386ad11781a88e2987b5908cb38))
- ensuring we properly escape object keys with non-alpha characters ([5216eca](https://github.com/aws-amplify/amplify-codegen-ui/commit/5216ecad6c6f7c84dd8a25cfedbe9214b01dca76))
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- import custom component from local directory ([#182](https://github.com/aws-amplify/amplify-codegen-ui/issues/182)) ([5cd1076](https://github.com/aws-amplify/amplify-codegen-ui/commit/5cd1076a4cd7a0710c8be70cfcb70a5571979e6a))
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))
- update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
- update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating example goldens to use children property instead of explicit text or string ([19f3182](https://github.com/aws-amplify/amplify-codegen-ui/commit/19f31824f651d46122bb84d4b2f9c7646e2c7554))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
- updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
- updating tests now that react router v6 is part of create-react-app ([3c6beed](https://github.com/aws-amplify/amplify-codegen-ui/commit/3c6beed31f7980422a6d2cbd5cdec4937ad6fed9))
- updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))

### Features

- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding remaining test goldens, docs on e2e tests, and todos on next steps ([30a5587](https://github.com/aws-amplify/amplify-codegen-ui/commit/30a55872e60f00296f58128618014e44e480df3c))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- parse string wrapped fixed values ([#155](https://github.com/aws-amplify/amplify-codegen-ui/issues/155)) ([3827f7c](https://github.com/aws-amplify/amplify-codegen-ui/commit/3827f7c612f782a36d2563c4203c20437e75bfdd))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- **test-generator:** run all schemas ([#39](https://github.com/aws-amplify/amplify-codegen-ui/issues/39)) ([00215ae](https://github.com/aws-amplify/amplify-codegen-ui/commit/00215ae32e043d366c2137346a74382cbd0d66f1))

## [0.2.1](https://github.com/aws-amplify/amplify-codegen-ui/compare/@amzn/test-generator@0.2.0...@amzn/test-generator@0.2.1) (2021-10-28)

### Bug Fixes

- simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))

# 0.2.0 (2021-10-27)

### Bug Fixes

- add custom component test ([d765667](https://github.com/aws-amplify/amplify-codegen-ui/commit/d7656677669485a9acc9f537e80d630223b2b62d))
- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding additional test cases, and documenting failures as they come up ([8340f98](https://github.com/aws-amplify/amplify-codegen-ui/commit/8340f985f78e6af693286e9124d64108265e182b))
- adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
- adding tests for basic components, stubbing remaining basic components ([c3ee4e7](https://github.com/aws-amplify/amplify-codegen-ui/commit/c3ee4e77451d542b394c2b119704950f9b28d148))
- adding theme files to test-generator, and moving into subdirectories ([0b6f970](https://github.com/aws-amplify/amplify-codegen-ui/commit/0b6f9707ffc839b2d7412926ad9c1683eec19c7a))
- dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
- enable info level logging, convert test-generator output to markdown ([a23ccb7](https://github.com/aws-amplify/amplify-codegen-ui/commit/a23ccb70a511f386ad11781a88e2987b5908cb38))
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
- update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))

### Features

- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding remaining test goldens, docs on e2e tests, and todos on next steps ([30a5587](https://github.com/aws-amplify/amplify-codegen-ui/commit/30a55872e60f00296f58128618014e44e480df3c))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- **test-generator:** run all schemas ([#39](https://github.com/aws-amplify/amplify-codegen-ui/issues/39)) ([00215ae](https://github.com/aws-amplify/amplify-codegen-ui/commit/00215ae32e043d366c2137346a74382cbd0d66f1))

# 0.1.0 (2021-10-20)

### Bug Fixes

- add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
- adding additional test cases, and documenting failures as they come up ([8340f98](https://github.com/aws-amplify/amplify-codegen-ui/commit/8340f985f78e6af693286e9124d64108265e182b))
- adding tests for basic components, stubbing remaining basic components ([c3ee4e7](https://github.com/aws-amplify/amplify-codegen-ui/commit/c3ee4e77451d542b394c2b119704950f9b28d148))
- adding theme files to test-generator, and moving into subdirectories ([0b6f970](https://github.com/aws-amplify/amplify-codegen-ui/commit/0b6f9707ffc839b2d7412926ad9c1683eec19c7a))
- enable info level logging, convert test-generator output to markdown ([a23ccb7](https://github.com/aws-amplify/amplify-codegen-ui/commit/a23ccb70a511f386ad11781a88e2987b5908cb38))
- getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
- react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
- remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
- remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
- setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
- updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
- updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))

### Features

- add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
- add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
- add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
- adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
- adding remaining test goldens, docs on e2e tests, and todos on next steps ([30a5587](https://github.com/aws-amplify/amplify-codegen-ui/commit/30a55872e60f00296f58128618014e44e480df3c))
- concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
- output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
- remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
- **test-generator:** run all schemas ([#39](https://github.com/aws-amplify/amplify-codegen-ui/issues/39)) ([00215ae](https://github.com/aws-amplify/amplify-codegen-ui/commit/00215ae32e043d366c2137346a74382cbd0d66f1))
