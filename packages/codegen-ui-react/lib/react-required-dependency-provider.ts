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
import { RequiredDependency, RequiredDependencyProvider } from '@aws-amplify/codegen-ui';
import { getAmplifyJSVersionToRender } from './helpers/amplify-js-versioning';
import { AMPLIFY_JS_V5 } from './utils/constants';

type SemVerRequiredDependency = RequiredDependency & {
  supportedSemVerPattern: string;
};

export class ReactRequiredDependencyProvider extends RequiredDependencyProvider<SemVerRequiredDependency> {
  getRequiredDependencies(
    hasStorageManager?: boolean,
    config?: { dependencies: { [key: string]: string } },
  ): SemVerRequiredDependency[] {
    const amplifyJSVersion = getAmplifyJSVersionToRender(config?.dependencies);
    const dependencies = [
      {
        dependencyName: '@aws-amplify/ui-react',
        supportedSemVerPattern: amplifyJSVersion === AMPLIFY_JS_V5 ? '>=4.6.0  <6.0.0' : '^6.0.0',
        reason: 'Required to leverage Amplify UI primitives, and Amplify Studio component helper functions.',
      },
      {
        dependencyName: 'aws-amplify',
        supportedSemVerPattern: amplifyJSVersion === AMPLIFY_JS_V5 ? '^5.0.2' : '^6.0.0',
        reason: 'Required to leverage DataStore.',
      },
    ];

    if (hasStorageManager) {
      dependencies.push({
        dependencyName: '@aws-amplify/ui-react-storage',
        supportedSemVerPattern: amplifyJSVersion === AMPLIFY_JS_V5 ? '^1.1.0' : '^3.0.0',
        reason: 'Required to leverage StorageManager.',
      });
    }

    return dependencies;
  }
}
