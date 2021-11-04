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
import { validateStudioComponent } from '../validation-helper';

describe('validation-helper', () => {
  describe('validateStudioComponent', () => {
    test('top-level component requires componentType', () => {
      expect(() => {
        validateStudioComponent({
          name: 'MyBindingView',
          properties: {},
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('top-level component requires properties', () => {
      expect(() => {
        validateStudioComponent({
          componentType: 'View',
          name: 'MyBindingView',
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('top-level component requires componentType to be the correct type', () => {
      expect(() => {
        validateStudioComponent({
          componentType: 2,
          name: 'MyBindingView',
          properties: {},
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('child component requires componentType to be the correct type', () => {
      expect(() => {
        validateStudioComponent({
          componentType: 'View',
          name: 'MyBindingView',
          properties: {},
          children: [
            {
              componentType: 3,
              properties: {},
            },
          ],
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('deeply nested child components requires properties', () => {
      expect(() => {
        validateStudioComponent({
          componentType: 'View',
          name: 'MyBindingView',
          properties: {},
          children: [
            {
              componentType: 'View',
              properties: {},
              children: [
                {
                  componentType: 'View',
                  properties: {},
                  children: [
                    {
                      componentType: 'Button',
                    },
                  ],
                },
              ],
            },
          ],
        });
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
