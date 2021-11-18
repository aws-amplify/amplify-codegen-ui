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

const DISABLED_SCHEMAS = [
  'ComponentWithActionSignOut', // TODO: Support Auth Action E2E Tests
  'ComponentWithActionNavigation', // TODO: Support Navigation Action E2E Tests
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

const jsxGenerator = new NodeTestGenerator({
  writeToLogger: false,
  writeToDisk: true,
  renderConfigOverride: {
    module: ModuleKind.ESNext,
    target: ScriptTarget.ESNext,
    script: ScriptKind.JSX,
    renderTypeDeclarations: true,
  },
  outputConfigOverride: {
    outputPathDir: INTEG_TEST_PATH,
  },
});

const testCases = tsxGenerator.getTestCases(DISABLED_SCHEMAS);

// tsxGenerator.generate(testCases);
jsxGenerator.generate(testCases);
