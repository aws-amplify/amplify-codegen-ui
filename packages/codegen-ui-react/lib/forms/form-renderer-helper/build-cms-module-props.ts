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
import { factory } from 'typescript';
import { Primitive } from '../../primitive';

export const buildCMSModuleFormProps = (componentNameToTypeMap?: Record<string, string>, isGraphQL?: boolean) => {
  const components = Object.values(componentNameToTypeMap ?? {}).filter((name) => name in Primitive);
  const amplifyUIProps = [
    ...new Set(
      components.concat(['useTheme', 'Flex', 'Grid', 'Icon', 'ScrollView', 'Badge', 'Divider', 'Button', 'Text']),
    ),
  ].map((name) => {
    return factory.createBindingElement(undefined, undefined, factory.createIdentifier(name), undefined);
  });

  const formProps = [
    'validateField',
    'fetchByPath',
    'useDataStoreBinding',
    'getOverrideProps',
    isGraphQL ? 'client' : 'DataStore',
    'React',
  ];
  return [
    ...formProps.map((prop) =>
      factory.createBindingElement(undefined, undefined, factory.createIdentifier(prop), undefined),
    ),
    factory.createBindingElement(
      undefined,
      factory.createIdentifier('AmplifyUI'),
      factory.createObjectBindingPattern(amplifyUIProps),
      undefined,
    ),
  ];
};
