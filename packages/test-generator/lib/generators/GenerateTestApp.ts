/*
  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.

  Licensed under the Apache License, Version 2.0 (the "License").
  You may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
 */
import { ModuleKind, ScriptTarget, ScriptKind } from '@aws-amplify/codegen-ui-react/dist/lib/react-render-config';
import { NodeTestGenerator } from './NodeTestGenerator';

const { DEPENDENCIES } = process.env;

if (!DEPENDENCIES) {
  throw new Error('DEPENDENCIES env var not found');
}

const GOLDEN_COMPONENTS = [
  'GoldenBasicComponent',
  'GoldenCollectionWithDataBindingAndPagination',
  'GoldenCollectionWithDataBindingAndSort',
  'GoldenCollectionWithDataBinding',
  'GoldenCollectionWithSearchAndPagination',
  'GoldenCollectionWithSpecificRecord',
  'GoldenComponentWithAuthAttributes',
  'GoldenComponentWithChildrenAndDataBinding',
  'GoldenComponentWithChildren',
  'GoldenComponentWithCustomChildren',
  'GoldenComponentWithConcatAndConditional',
  'GoldenComponentWithConditionalWithoutField',
  'GoldenComponentWithDataBindingAndDatastoreDefault',
  'GoldenComponentWithDataBinding',
  'GoldenComponentWithEvent',
  'GoldenComponentWithExposed',
  'GoldenComponentWithForm',
  'GoldenComponentWithImageWithStorage',
  'GoldenComponentWithTypedProp',
  'GoldenComponentWithVariants',
  'GoldenTheme',
];

const DISABLED_SCHEMAS = [
  ...GOLDEN_COMPONENTS, // Disabling golden components except to refresh examples
  'ComponentMissingProperties', // Expected failure cases
  'ComponentMissingType', // Expected failure cases
  'InvalidTheme', // Expected failure cases
  'CardWithInvalidChildComponentType', // Expected failure cases
];

const INTEG_TEST_PATH = 'packages/integration-test/src/ui-components';

const tsxGenerator = new NodeTestGenerator({
  writeToLogger: false,
  writeToDisk: true,
  renderConfigOverride: {}, // Use Defaults
  outputConfigOverride: {
    outputPathDir: INTEG_TEST_PATH,
  },
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const jsxGenerator = new NodeTestGenerator({
  writeToLogger: false,
  writeToDisk: true,
  renderConfigOverride: {
    module: ModuleKind.ES2020,
    target: ScriptTarget.ES2020,
    script: ScriptKind.JSX,
    renderTypeDeclarations: true,
    dependencies: JSON.parse(DEPENDENCIES),
  },
  outputConfigOverride: {
    outputPathDir: INTEG_TEST_PATH,
  },
});

const testCases = tsxGenerator.getTestCases(DISABLED_SCHEMAS);

// tsxGenerator.generate(testCases);
jsxGenerator.generate(testCases);
