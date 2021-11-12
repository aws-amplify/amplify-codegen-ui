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
import { NodeTestGenerator } from './NodeTestGenerator';

const DISABLED_SCHEMAS = [
  'ComponentWithActionSignOut', // TODO: Support Auth Action E2E Tests
  'ComponentWithActionNavigation', // TODO: Support Navigation Action E2E Tests
  'ComplexTest1', // TODO: Complex tests are broken
  'ComplexTest2', // TODO: Complex tests are broken
  'ComplexTest3', // TODO: Complex tests are broken
  'ComplexTest4', // TODO: Complex tests are broken
  'ComplexTest5', // TODO: Complex tests are broken
  'ComplexTest6', // TODO: Complex tests are broken
  'ComplexTest7', // TODO: Complex tests are broken
  'ComplexTest8', // TODO: Complex tests are broken
  'ComponentMissingProperties', // Expected failure cases
  'ComponentMissingType', // Expected failure cases
  'InvalidTheme', // Expected failure cases
  'CardWithInvalidChildComponentType', // Expected failure cases
];

const generator = new NodeTestGenerator({
  writeToLogger: false,
  writeToDisk: true,
  outputConfigOverride: {
    outputPathDir: 'packages/integration-test/src/ui-components',
  },
});

generator.generate(generator.getTestCases(DISABLED_SCHEMAS));
