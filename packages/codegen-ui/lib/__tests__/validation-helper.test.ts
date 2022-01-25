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
import { validateComponentSchema, validateThemeSchema } from '../validation-helper';

describe('validation-helper', () => {
  describe('validateComponentSchema', () => {
    test('throws no error on valid type', () => {
      validateComponentSchema({
        name: 'MyBindingView',
        componentType: 'View',
        properties: {},
      });
    });

    test('top-level component requires componentType', () => {
      expect(() => {
        validateComponentSchema({
          name: 'MyBindingView',
          properties: {},
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('values can be `null` or not present', () => {
      validateComponentSchema({
        name: 'MyBindingView',
        componentType: 'View',
        properties: {},
        sourceId: null,
      });
    });

    test('top-level component requires properties', () => {
      expect(() => {
        validateComponentSchema({
          componentType: 'View',
          name: 'MyBindingView',
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('top-level component requires non-empty property values', () => {
      expect(() => {
        validateComponentSchema({
          componentType: 'View',
          name: 'MyBindingView',
          properties: {
            pathData: {},
          },
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('top-level component requires properties to be the correct type', () => {
      expect(() => {
        validateComponentSchema({
          componentType: 'View',
          name: 'MyBindingView',
          properties: 'property',
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('top-level component requires componentType to be the correct type', () => {
      expect(() => {
        validateComponentSchema({
          componentType: 2,
          name: 'MyBindingView',
          properties: {},
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('child component requires componentType to be the correct type', () => {
      expect(() => {
        validateComponentSchema({
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
        validateComponentSchema({
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

    test('fails on componentType with whitespace', () => {
      expect(() => {
        validateComponentSchema({
          name: 'CustomComponent',
          componentType: 'View 2',
          properties: {},
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('fails on componentType with leading number', () => {
      expect(() => {
        validateComponentSchema({
          name: 'CustomComponent',
          componentType: '2View',
          properties: {},
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('succeeds on componentType with trailing number', () => {
      validateComponentSchema({
        name: 'CustomComponent',
        componentType: 'View2',
        properties: {},
      });
    });

    test('child component name may contain whitespace', () => {
      validateComponentSchema({
        name: 'CustomComponent',
        componentType: 'View',
        properties: {},
        children: [
          {
            name: 'I Have Spaces',
            componentType: 'Button',
            properties: {},
          },
        ],
      });
    });

    test('allows eventBindings with valid names', () => {
      validateComponentSchema({
        name: 'CustomComponent',
        componentType: 'View',
        properties: {},
        children: [
          {
            name: 'I Have Spaces',
            componentType: 'Button',
            properties: {},
            events: {
              click: {
                bindingEvent: 'onButtonClick',
              },
            },
          },
        ],
      });
    });

    test('fails eventBindings with invalid names', () => {
      expect(() => {
        validateComponentSchema({
          name: 'CustomComponent',
          componentType: 'View',
          properties: {},
          children: [
            {
              name: 'I Have Spaces',
              componentType: 'Button',
              properties: {},
              events: {
                myclick: {
                  bindingEvent: 'onButtonClick',
                },
              },
            },
          ],
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('throws on all components sharing a name', () => {
      expect(() => {
        validateComponentSchema({
          name: 'MyComp',
          componentType: 'Flex',
          properties: {},
          children: [
            {
              name: 'MyComp',
              componentType: 'Button',
              properties: {},
            },
            {
              name: 'DeepComp',
              componentType: 'View',
              properties: {},
              children: [
                {
                  name: 'DeepComp',
                  componentType: 'Tooltip',
                  properties: {},
                },
                {
                  name: 'UniqueName',
                  componentType: 'Button',
                  properties: {},
                },
              ],
            },
          ],
        });
      }).toThrowErrorMatchingSnapshot();
    });
  });

  describe('validateThemeSchema', () => {
    test('throws no error on valid type', () => {
      validateThemeSchema({
        name: 'MyBindingView',
        values: [
          {
            key: 'breakpoints',
            value: {},
          },
          {
            key: 'tokens',
            value: {},
          },
        ],
        overrides: [],
      });
    });

    test('top-level component requires name', () => {
      expect(() => {
        validateThemeSchema({
          values: [
            {
              key: 'breakpoints',
              value: {},
            },
            {
              key: 'tokens',
              value: {},
            },
          ],
          overrides: [],
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('top-level component requires values', () => {
      expect(() => {
        validateThemeSchema({
          name: 'MyBindingView',
          overrides: [],
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('children objects should not be empty', () => {
      expect(() => {
        validateThemeSchema({
          name: 'MyBindingView',
          values: [
            {
              key: 'breakpoints',
              value: {},
            },
            {},
          ],
          overrides: [],
        });
      }).toThrowErrorMatchingSnapshot();
    });

    test('overrides should contain the right shape', () => {
      expect(() => {
        validateThemeSchema({
          name: 'MyBindingView',
          values: [],
          overrides: [
            {
              value: {},
            },
          ],
        });
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
