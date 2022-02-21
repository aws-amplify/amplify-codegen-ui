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
import { StudioComponent, RelationalOperator, StateReference } from '../../types';
import { computeDataDependenciesForStudioComponentProperty, computeStateReferenceMetadata } from '../../utils';

describe('state-reference-metadata', () => {
  describe('computeDataDependenciesForStudioComponentProperty', () => {
    test('concat', () => {
      const property = {
        concat: [
          {
            userAttribute: 'username',
          },
          {
            bindingProperties: {
              property: 'value',
            },
          },
        ],
      };
      expect(computeDataDependenciesForStudioComponentProperty(property)).toEqual(['authAttributes', 'value']);
    });

    test('user auth attribute', () => {
      const property = {
        userAttribute: 'username',
      };
      expect(computeDataDependenciesForStudioComponentProperty(property)).toEqual(['authAttributes']);
    });

    test('binding properties', () => {
      const property = {
        bindingProperties: {
          property: 'value',
        },
      };
      expect(computeDataDependenciesForStudioComponentProperty(property)).toEqual(['value']);
    });

    test('collection binding properties', () => {
      const property = {
        collectionBindingProperties: {
          property: 'value',
        },
      };
      expect(computeDataDependenciesForStudioComponentProperty(property)).toEqual(['items']);
    });

    test('conditional', () => {
      const property = {
        condition: {
          operator: 'gt' as RelationalOperator,
          operand: 'prop',
          then: {
            userAttribute: 'username',
          },
          else: {
            bindingProperties: {
              property: 'value',
            },
          },
          property: 'id',
        },
      };
      expect(computeDataDependenciesForStudioComponentProperty(property)).toEqual(['id', 'authAttributes', 'value']);
    });

    test('removes duplicates', () => {
      const property = {
        concat: [
          {
            userAttribute: 'username',
          },
          {
            userAttribute: 'username',
          },
        ],
      };
      expect(computeDataDependenciesForStudioComponentProperty(property)).toEqual(['authAttributes']);
    });
  });

  describe('computeStateReferenceMetadata', () => {
    test('no state reference', () => {
      const component = {
        id: '1234-5678-9010',
        componentType: 'Flex',
        name: 'InitialValueBindings',
        properties: {},
        bindingProperties: {},
        children: [],
        schemaVersion: '1.0',
      };
      const stateReferences: StateReference[] = [];
      expect(computeStateReferenceMetadata(component, stateReferences)).toEqual([]);
    });

    test('state reference with auth attribute', () => {
      const component: StudioComponent = {
        id: '1234-5678-9010',
        componentType: 'Flex',
        name: 'InitialValueBindings',
        properties: {},
        bindingProperties: {},
        children: [
          {
            componentType: 'Text',
            name: 'AuthValueContents',
            properties: {
              label: {
                userAttribute: 'email',
              },
            },
          },
          {
            componentType: 'Button',
            name: 'AuthValueMutation',
            properties: {},
            events: {
              click: {
                action: 'Amplify.Mutation',
                parameters: {
                  state: {
                    componentName: 'AuthValueContents',
                    property: 'label',
                    set: {
                      value: 'Mutated Value',
                    },
                  },
                },
              },
            },
          },
        ],
        schemaVersion: '1.0',
      };
      const stateReferences: StateReference[] = [
        {
          componentName: 'AuthValueContents',
          property: 'label',
          set: { value: 'Mutated Value' },
        },
      ];
      expect(computeStateReferenceMetadata(component, stateReferences)).toEqual([
        {
          dataDependencies: ['authAttributes'],
          reference: {
            componentName: 'AuthValueContents',
            property: 'label',
            set: {
              value: 'Mutated Value',
            },
          },
        },
      ]);
    });

    test('state reference with data store', () => {
      const component: StudioComponent = {
        id: '1234-5678-9010',
        componentType: 'Flex',
        name: 'InitialValueBindings',
        properties: {},
        bindingProperties: {
          user: {
            type: 'Data',
            bindingProperties: {
              model: 'User',
              predicate: {
                field: 'firstName',
                operand: 'Johnny',
                operator: 'eq',
              },
            },
          },
        },
        children: [
          {
            componentType: 'Text',
            name: 'BoundValueContents',
            properties: {
              label: {
                bindingProperties: {
                  property: 'user',
                  field: 'lastName',
                },
              },
            },
          },
          {
            componentType: 'Button',
            name: 'BoundValueMutation',
            events: {
              click: {
                action: 'Amplify.Mutation',
                parameters: {
                  state: {
                    componentName: 'BoundValueContents',
                    property: 'label',
                    set: {
                      value: 'Mutated Value',
                    },
                  },
                },
              },
            },
            properties: {},
          },
        ],
        schemaVersion: '1.0',
      };
      const stateReferences: StateReference[] = [
        {
          componentName: 'BoundValueContents',
          property: 'label',
          set: { value: 'Mutated Value' },
        },
      ];
      expect(computeStateReferenceMetadata(component, stateReferences)).toEqual([
        {
          dataDependencies: ['user'],
          reference: {
            componentName: 'BoundValueContents',
            property: 'label',
            set: {
              value: 'Mutated Value',
            },
          },
        },
      ]);
    });

    test('invalid state reference', () => {
      const component = {
        id: '1234-5678-9010',
        componentType: 'Flex',
        name: 'InitialValueBindings',
        properties: {},
        bindingProperties: {},
        children: [],
        schemaVersion: '1.0',
      };
      const stateReferences: StateReference[] = [
        {
          componentName: 'BoundValueContents',
          property: 'label',
          set: { value: 'Mutated Value' },
        },
      ];
      expect(() => computeStateReferenceMetadata(component, stateReferences)).toThrowError();
    });
  });
});
