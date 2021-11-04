# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 0.5.0 (2021-11-04)


### Bug Fixes

* add custom component test ([d765667](https://github.com/aws-amplify/amplify-codegen-ui/commit/d7656677669485a9acc9f537e80d630223b2b62d))
* add data binding model imports ([#49](https://github.com/aws-amplify/amplify-codegen-ui/issues/49)) ([11e5c47](https://github.com/aws-amplify/amplify-codegen-ui/commit/11e5c473e28a7e23e9768f4d695c9b0bdc6fd5fd))
* adding additional test cases, and documenting failures as they come up ([8340f98](https://github.com/aws-amplify/amplify-codegen-ui/commit/8340f985f78e6af693286e9124d64108265e182b))
* adding support for additional component types for string and text types ([53d5537](https://github.com/aws-amplify/amplify-codegen-ui/commit/53d5537f3fd0eca1313d0cd39277ecf297988551))
* adding tests for basic components, stubbing remaining basic components ([c3ee4e7](https://github.com/aws-amplify/amplify-codegen-ui/commit/c3ee4e77451d542b394c2b119704950f9b28d148))
* adding theme files to test-generator, and moving into subdirectories ([0b6f970](https://github.com/aws-amplify/amplify-codegen-ui/commit/0b6f9707ffc839b2d7412926ad9c1683eec19c7a))
* collections with name items no longer redeclare the prop name ([#183](https://github.com/aws-amplify/amplify-codegen-ui/issues/183)) ([6ab4cdf](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ab4cdf50b6e7b8962835422663f3152753e8aa3))
* dont pass all props to top level component ([ee9e1b4](https://github.com/aws-amplify/amplify-codegen-ui/commit/ee9e1b4a3ea9e9ddfc224e217edba4722365bb9a))
* enable info level logging, convert test-generator output to markdown ([a23ccb7](https://github.com/aws-amplify/amplify-codegen-ui/commit/a23ccb70a511f386ad11781a88e2987b5908cb38))
* ensuring we properly escape object keys with non-alpha characters ([5216eca](https://github.com/aws-amplify/amplify-codegen-ui/commit/5216ecad6c6f7c84dd8a25cfedbe9214b01dca76))
* getting cypress tests to run ([2a40055](https://github.com/aws-amplify/amplify-codegen-ui/commit/2a400557c416daab1ec2bd49d4800b6260648175))
* import custom component from local directory ([#182](https://github.com/aws-amplify/amplify-codegen-ui/issues/182)) ([5cd1076](https://github.com/aws-amplify/amplify-codegen-ui/commit/5cd1076a4cd7a0710c8be70cfcb70a5571979e6a))
* react render config ([#45](https://github.com/aws-amplify/amplify-codegen-ui/issues/45)) ([de74357](https://github.com/aws-amplify/amplify-codegen-ui/commit/de74357c2a323b11de1e464e7a47f43414d22409))
* remove Box to View mapping ([#144](https://github.com/aws-amplify/amplify-codegen-ui/issues/144)) ([74f860c](https://github.com/aws-amplify/amplify-codegen-ui/commit/74f860c18a7f8ee037753035002ecb8a051bb165))
* remove text value from props and render bound property ([#70](https://github.com/aws-amplify/amplify-codegen-ui/issues/70)) ([aabed87](https://github.com/aws-amplify/amplify-codegen-ui/commit/aabed87e8091a5f875d6edd417744b058a769b4e)), closes [#67](https://github.com/aws-amplify/amplify-codegen-ui/issues/67)
* setting license, author, homepage, and repo information ([e253a15](https://github.com/aws-amplify/amplify-codegen-ui/commit/e253a155f36c3451e7bc911225b8757b3dfd8b78))
* simple property binding default value ([#168](https://github.com/aws-amplify/amplify-codegen-ui/issues/168)) ([de84261](https://github.com/aws-amplify/amplify-codegen-ui/commit/de84261aebab5d9b570210c19cfb7a3d0214e1fe))
* update theme generation for new schema ([#142](https://github.com/aws-amplify/amplify-codegen-ui/issues/142)) ([a780893](https://github.com/aws-amplify/amplify-codegen-ui/commit/a7808934e3bb293068687526915a27a3ec8e7637))
* update theming to support ui@next ([92e9555](https://github.com/aws-amplify/amplify-codegen-ui/commit/92e95552603cde3c27512504aceb01b96031c97d))
* updates to get concat and conditional working, and adding tests ([ef4600f](https://github.com/aws-amplify/amplify-codegen-ui/commit/ef4600f78934b031830f450566b476c2d98caeba))
* updating example goldens to use children property instead of explicit text or string ([19f3182](https://github.com/aws-amplify/amplify-codegen-ui/commit/19f31824f651d46122bb84d4b2f9c7646e2c7554))
* updating generated theme to work in test app ([113a594](https://github.com/aws-amplify/amplify-codegen-ui/commit/113a5941800263223571e56c5f3c80c7b8ab093a))
* updating override paths to support child indices ([278b6f8](https://github.com/aws-amplify/amplify-codegen-ui/commit/278b6f8ac7486b2d6815d204cd59834238e12712))
* updating unit tests after merge failure, bumping package-locks back to v2 ([1c49ac0](https://github.com/aws-amplify/amplify-codegen-ui/commit/1c49ac0e7f6c73dc7190ebcd4270858b16bbe327))


### Features

* add conditional binding ([#102](https://github.com/aws-amplify/amplify-codegen-ui/issues/102)) ([8c66425](https://github.com/aws-amplify/amplify-codegen-ui/commit/8c664250058cf4703d4b2970bd72c9c269421901))
* add data binding predicate ([#57](https://github.com/aws-amplify/amplify-codegen-ui/issues/57)) ([d9e0216](https://github.com/aws-amplify/amplify-codegen-ui/commit/d9e0216c10f092ecda5fc1888f23bcbae60fe428))
* add output configuration for studio codegen ([#32](https://github.com/aws-amplify/amplify-codegen-ui/issues/32)) ([8cb2de9](https://github.com/aws-amplify/amplify-codegen-ui/commit/8cb2de92fe397d4277ddec05422d4112e917cb78))
* add type information to variants, and add e2e tests for variant rendering ([6ce2ac9](https://github.com/aws-amplify/amplify-codegen-ui/commit/6ce2ac9c0dadad4e25918712edf616e3c68732b3))
* adding gh workflow to test rendered goldens ([17e0ca0](https://github.com/aws-amplify/amplify-codegen-ui/commit/17e0ca09efdb27e7256b5d497956d11d969a9420))
* adding remaining test goldens, docs on e2e tests, and todos on next steps ([30a5587](https://github.com/aws-amplify/amplify-codegen-ui/commit/30a55872e60f00296f58128618014e44e480df3c))
* concatenation binding implementation ([#99](https://github.com/aws-amplify/amplify-codegen-ui/issues/99)) ([1bfd428](https://github.com/aws-amplify/amplify-codegen-ui/commit/1bfd4287acf7b2d5f410f045e17658929cb60eb3))
* output theme file ([#97](https://github.com/aws-amplify/amplify-codegen-ui/issues/97)) ([02508c1](https://github.com/aws-amplify/amplify-codegen-ui/commit/02508c1e8733ccee6a17551fed3b885619d70aa7))
* parse string wrapped fixed values ([#155](https://github.com/aws-amplify/amplify-codegen-ui/issues/155)) ([3827f7c](https://github.com/aws-amplify/amplify-codegen-ui/commit/3827f7c612f782a36d2563c4203c20437e75bfdd))
* remove console log ([#76](https://github.com/aws-amplify/amplify-codegen-ui/issues/76)) ([73fac18](https://github.com/aws-amplify/amplify-codegen-ui/commit/73fac1864494929571ca8ece684a9caf9aab9360))
* **test-generator:** run all schemas ([#39](https://github.com/aws-amplify/amplify-codegen-ui/issues/39)) ([00215ae](https://github.com/aws-amplify/amplify-codegen-ui/commit/00215ae32e043d366c2137346a74382cbd0d66f1))





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
