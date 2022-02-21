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
import { MutationAction, ComponentMetadata } from '@aws-amplify/codegen-ui';
import { mapSyntheticStateReferences, getActionStateParameters } from '../../workflow/mutation';

describe('mapSyntheticStateReferences', () => {
  test('basic', () => {
    const componentMetadata: ComponentMetadata = {
      hasAuthBindings: false,
      requiredDataModels: [],
      stateReferences: [{ reference: { componentName: 'UserNameTextField', property: 'value' }, dataDependencies: [] }],
      componentNameToTypeMap: { UserNameTextField: 'TextField' },
    };
    expect(mapSyntheticStateReferences(componentMetadata)).toMatchSnapshot();
  });
});

describe('getActionStateParameters', () => {
  test('basic', () => {
    const action: MutationAction = {
      action: 'Amplify.Mutation',
      parameters: {
        state: {
          componentName: 'ColoredBox',
          property: 'backgroundColor',
          set: {
            value: 'something',
          },
        },
      },
    };
    expect(getActionStateParameters(action)).toMatchSnapshot();
  });
});
