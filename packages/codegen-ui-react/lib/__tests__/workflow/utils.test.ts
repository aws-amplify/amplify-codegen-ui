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

import { getChildPropMappingForComponentName } from '../../workflow/utils';

describe('getChildPropMappingForComponentName', () => {
  const componentNameToTypeMap = {
    MyFlex: 'Flex',
    MyButton: 'Button',
  };

  test('throws on missing name mapping', () => {
    expect(() => {
      getChildPropMappingForComponentName(componentNameToTypeMap, 'MissingComponent');
    }).toThrowErrorMatchingInlineSnapshot(
      `"Invalid definition, found reference to component name MissingComponent which wasn't found in the schema."`,
    );
  });

  test('returns mapping for synthetic mapped prop', () => {
    expect(getChildPropMappingForComponentName(componentNameToTypeMap, 'MyButton')).toEqual('label');
  });

  test('returns undefined for non-mapped component', () => {
    expect(getChildPropMappingForComponentName(componentNameToTypeMap, 'MyFlex')).toBeUndefined();
  });
});
