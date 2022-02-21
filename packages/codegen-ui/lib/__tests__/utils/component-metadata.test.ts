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
import { StudioComponent } from '../../types';
import { ComponentMetadata, computeComponentMetadata } from '../../utils';

describe('computeComponentMetadata', () => {
  describe('builds hasAuthBindings', () => {
    test('returns false for no binding', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: [],
        stateReferences: [],
        componentNameToTypeMap: {
          MyText: 'Text',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    test('builds for top-level auth binding', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {
          label: {
            userAttribute: 'email',
          },
        },
        bindingProperties: {},
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: true,
        requiredDataModels: [],
        stateReferences: [],
        componentNameToTypeMap: {
          MyText: 'Text',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    test('builds for nested auth binding', () => {
      const component: StudioComponent = {
        componentType: 'Flex',
        name: 'Comp',
        properties: {
          label: {
            userAttribute: 'email',
          },
        },
        bindingProperties: {},
        children: [
          {
            componentType: 'Text',
            name: 'BoundText',
            properties: {
              label: {
                concat: [
                  {
                    userAttribute: 'email',
                  },
                ],
              },
            },
          },
        ],
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: true,
        requiredDataModels: [],
        stateReferences: [],
        componentNameToTypeMap: {
          BoundText: 'Text',
          Comp: 'Flex',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    test('builds for auth binding in action', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
        events: {
          click: {
            action: 'Amplify.DataStoreCreateItemAction',
            parameters: {
              model: 'User',
              fields: {
                email: {
                  userAttribute: 'email',
                },
              },
            },
          },
        },
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: true,
        requiredDataModels: ['User'],
        stateReferences: [],
        componentNameToTypeMap: {
          MyText: 'Text',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    test('builds for nested auth binding in action', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
        events: {
          click: {
            action: 'Amplify.DataStoreCreateItemAction',
            parameters: {
              model: 'User',
              fields: {
                title: {
                  concat: [
                    {
                      value: 'The Honorable - ',
                    },
                    {
                      userAttribute: 'firstName',
                    },
                  ],
                },
              },
            },
          },
        },
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: true,
        requiredDataModels: ['User'],
        stateReferences: [],
        componentNameToTypeMap: {
          MyText: 'Text',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });
  });

  describe('builds requiredDataModels', () => {
    it('returns no required data models if there are no state references', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: [],
        stateReferences: [],
        componentNameToTypeMap: {
          MyText: 'Text',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('returns models in events', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
        events: {
          click: {
            action: 'Amplify.DataStoreCreateItemAction',
            parameters: {
              model: 'User',
              fields: {},
            },
          },
        },
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: ['User'],
        stateReferences: [],
        componentNameToTypeMap: {
          MyText: 'Text',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('returns models in binding properties', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {
          user: {
            type: 'Data',
            bindingProperties: {
              model: 'User',
            },
          },
        },
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: ['User'],
        stateReferences: [],
        componentNameToTypeMap: {
          MyText: 'Text',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('returns models in collection properties', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
        collectionProperties: {
          user: {
            model: 'User',
          },
        },
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: ['User'],
        stateReferences: [],
        componentNameToTypeMap: {
          MyText: 'Text',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('returns multiple different models', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {
          user: {
            type: 'Data',
            bindingProperties: {
              model: 'User',
            },
          },
        },
        events: {
          click: {
            action: 'Amplify.DataStoreCreateItemAction',
            parameters: {
              model: 'Listing',
              fields: {},
            },
          },
        },
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: ['User', 'Listing'],
        stateReferences: [],
        componentNameToTypeMap: {
          MyText: 'Text',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('dedupes models', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {
          user: {
            type: 'Data',
            bindingProperties: {
              model: 'User',
            },
          },
        },
        events: {
          click: {
            action: 'Amplify.DataStoreCreateItemAction',
            parameters: {
              model: 'User',
              fields: {},
            },
          },
        },
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: ['User'],
        stateReferences: [],
        componentNameToTypeMap: {
          MyText: 'Text',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });
  });

  describe('builds stateReferences', () => {
    it('returns for no state binding', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: [],
        stateReferences: [],
        componentNameToTypeMap: {
          MyText: 'Text',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('returns for state binding in prop', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {
          label: {
            componentName: 'UserNameField',
            property: 'value',
          },
        },
        bindingProperties: {},
        children: [
          {
            componentType: 'TextField',
            name: 'UserNameField',
            properties: {
              value: {
                value: 'username',
              },
            },
          },
        ],
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: [],
        stateReferences: [{ reference: { componentName: 'UserNameField', property: 'value' }, dataDependencies: [] }],
        componentNameToTypeMap: {
          MyText: 'Text',
          UserNameField: 'TextField',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('returns for nested state binding in prop', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {
          label: {
            concat: [
              {
                componentName: 'UserNameField',
                property: 'value',
              },
            ],
          },
        },
        bindingProperties: {},
        children: [
          {
            componentType: 'TextField',
            name: 'UserNameField',
            properties: {
              value: {
                value: 'username',
              },
            },
          },
        ],
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: [],
        stateReferences: [{ reference: { componentName: 'UserNameField', property: 'value' }, dataDependencies: [] }],
        componentNameToTypeMap: {
          MyText: 'Text',
          UserNameField: 'TextField',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('returns for state binding in event', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
        events: {
          click: {
            action: 'Amplify.DataStoreCreateItemAction',
            parameters: {
              model: 'User',
              fields: {
                title: {
                  componentName: 'UserNameField',
                  property: 'value',
                },
              },
            },
          },
        },
        children: [
          {
            componentType: 'TextField',
            name: 'UserNameField',
            properties: {
              value: {
                value: 'username',
              },
            },
          },
        ],
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: ['User'],
        stateReferences: [{ reference: { componentName: 'UserNameField', property: 'value' }, dataDependencies: [] }],
        componentNameToTypeMap: {
          MyText: 'Text',
          UserNameField: 'TextField',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('returns for nested state binding in event', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
        events: {
          click: {
            action: 'Amplify.DataStoreCreateItemAction',
            parameters: {
              model: 'User',
              fields: {
                title: {
                  concat: [
                    {
                      value: 'The Honorable - ',
                    },
                    {
                      componentName: 'UserNameField',
                      property: 'value',
                    },
                  ],
                },
              },
            },
          },
        },
        children: [
          {
            componentType: 'TextField',
            name: 'UserNameField',
            properties: {
              value: {
                value: 'username',
              },
            },
          },
        ],
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: ['User'],
        stateReferences: [{ reference: { componentName: 'UserNameField', property: 'value' }, dataDependencies: [] }],
        componentNameToTypeMap: {
          MyText: 'Text',
          UserNameField: 'TextField',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('returns multiple state bindings', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {
          label: {
            componentName: 'NicknameField',
            property: 'value',
          },
        },
        bindingProperties: {},
        events: {
          click: {
            action: 'Amplify.DataStoreCreateItemAction',
            parameters: {
              model: 'User',
              fields: {
                title: {
                  concat: [
                    {
                      value: 'The Honorable - ',
                    },
                    {
                      componentName: 'UserNameField',
                      property: 'value',
                    },
                  ],
                },
              },
            },
          },
        },
        children: [
          {
            componentType: 'TextField',
            name: 'UserNameField',
            properties: {
              value: {
                value: 'username',
              },
            },
          },
          {
            componentType: 'TextField',
            name: 'NicknameField',
            properties: {
              value: {
                value: 'nickname',
              },
            },
          },
        ],
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: ['User'],
        stateReferences: [
          { reference: { componentName: 'NicknameField', property: 'value' }, dataDependencies: [] },
          { reference: { componentName: 'UserNameField', property: 'value' }, dataDependencies: [] },
        ],
        componentNameToTypeMap: {
          MyText: 'Text',
          UserNameField: 'TextField',
          NicknameField: 'TextField',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('dedupes state bindings', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {
          label: {
            componentName: 'UserNameField',
            property: 'value',
          },
        },
        bindingProperties: {},
        events: {
          click: {
            action: 'Amplify.DataStoreCreateItemAction',
            parameters: {
              model: 'User',
              fields: {
                title: {
                  concat: [
                    {
                      value: 'The Honorable - ',
                    },
                    {
                      componentName: 'UserNameField',
                      property: 'value',
                    },
                  ],
                },
              },
            },
          },
        },
        children: [
          {
            componentType: 'TextField',
            name: 'UserNameField',
            properties: {
              value: {
                value: 'username',
              },
            },
          },
        ],
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: ['User'],
        stateReferences: [{ reference: { componentName: 'UserNameField', property: 'value' }, dataDependencies: [] }],
        componentNameToTypeMap: {
          MyText: 'Text',
          UserNameField: 'TextField',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('mutation events with set does not dedupe against bindings', () => {
      const component: StudioComponent = {
        componentType: 'Text',
        name: 'MyText',
        properties: {},
        bindingProperties: {},
        events: {
          click: {
            action: 'Amplify.DataStoreCreateItemAction',
            parameters: {
              model: 'User',
              fields: {
                title: {
                  componentName: 'UserNameField',
                  property: 'value',
                },
              },
            },
          },
          doubleclick: {
            action: 'Amplify.Mutation',
            parameters: {
              state: {
                componentName: 'UserNameField',
                property: 'value',
                set: {
                  value: 'Setter',
                },
              },
            },
          },
        },
        children: [
          {
            componentType: 'TextField',
            name: 'UserNameField',
            properties: {
              value: {
                value: 'username',
              },
            },
          },
        ],
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: ['User'],
        stateReferences: [
          { reference: { componentName: 'UserNameField', property: 'value' }, dataDependencies: [] },
          {
            reference: { componentName: 'UserNameField', property: 'value', set: { value: 'Setter' } },
            dataDependencies: [],
          },
        ],
        componentNameToTypeMap: {
          MyText: 'Text',
          UserNameField: 'TextField',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });
  });

  describe('builds componentNameToTypeMap', () => {
    test('builds for a single component', () => {
      const component: StudioComponent = {
        componentType: 'Flex',
        name: 'SingleFlexComponent',
        properties: {},
        bindingProperties: {},
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: [],
        stateReferences: [],
        componentNameToTypeMap: {
          SingleFlexComponent: 'Flex',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    test('builds for a single component with no name', () => {
      const component: StudioComponent = {
        componentType: 'Flex',
        name: 'MyFlex',
        properties: {},
        bindingProperties: {},
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: [],
        stateReferences: [],
        componentNameToTypeMap: {
          MyFlex: 'Flex',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    test('builds deeply nested objects', () => {
      const component: StudioComponent = {
        componentType: 'Flex',
        name: 'TopLevelComponent',
        properties: {},
        bindingProperties: {},
        children: [
          {
            componentType: 'Flex',
            name: 'NestedComponent',
            properties: {},
            children: [
              {
                componentType: 'Button',
                name: 'NestedButton',
                properties: {},
              },
            ],
          },
          {
            componentType: 'Button',
            name: 'MyButton',
            properties: {},
          },
        ],
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: false,
        requiredDataModels: [],
        stateReferences: [],
        componentNameToTypeMap: {
          TopLevelComponent: 'Flex',
          NestedComponent: 'Flex',
          MyButton: 'Button',
          NestedButton: 'Button',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });
  });

  describe('builds for complex cases', () => {
    it('works for this mess', () => {
      const component: StudioComponent = {
        componentType: 'Flex',
        name: 'TopLevelComponent',
        properties: {},
        bindingProperties: {
          color: {
            type: 'String',
          },
        },
        collectionProperties: {
          user: {
            model: 'User',
          },
        },
        children: [
          {
            componentType: 'Flex',
            name: 'NestedComponent',
            properties: {},
            children: [
              {
                componentType: 'Button',
                name: 'NestedButton',
                properties: {},
                events: {
                  click: {
                    action: 'Amplify.Mutation',
                    parameters: {
                      state: {
                        componentName: 'NestedComponent',
                        property: 'color',
                        set: {
                          bindingProperties: {
                            property: 'color',
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          {
            componentType: 'TextField',
            name: 'NicknameField',
            properties: {
              label: {
                value: 'Enter your nickname',
              },
            },
          },
          {
            componentType: 'Button',
            name: 'MyButton',
            properties: {
              label: {
                concat: [
                  {
                    value: 'Click Me - ',
                  },
                  {
                    userAttribute: 'firstName',
                  },
                ],
              },
            },
            events: {
              click: {
                action: 'Amplify.DataStoreCreateItemAction',
                parameters: {
                  model: 'Listing',
                  fields: {
                    name: {
                      userAttribute: 'firstName',
                    },
                    preferredName: {
                      condition: {
                        property: 'color',
                        operator: 'eq',
                        operand: 'blue',
                        then: {
                          value: 'Nice Color',
                        },
                        else: {
                          componentName: 'NicknameField',
                          property: 'value',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: true,
        requiredDataModels: ['User', 'Listing'],
        stateReferences: [
          { reference: { componentName: 'NicknameField', property: 'value' }, dataDependencies: [] },
          {
            reference: {
              componentName: 'NestedComponent',
              property: 'color',
              set: { bindingProperties: { property: 'color' } },
            },
            dataDependencies: [],
          },
        ],
        componentNameToTypeMap: {
          TopLevelComponent: 'Flex',
          NestedComponent: 'Flex',
          MyButton: 'Button',
          NestedButton: 'Button',
          NicknameField: 'TextField',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });

    it('supports undefined values coming in from the sdk', () => {
      const component: StudioComponent = {
        componentType: 'Flex',
        name: 'TopLevelComponent',
        properties: {},
        bindingProperties: {
          color: {
            type: 'String',
          },
        },
        collectionProperties: {
          user: {
            model: 'User',
          },
        },
        children: [
          {
            componentType: 'Flex',
            name: 'NestedComponent',
            properties: {},
            children: [
              {
                componentType: 'Button',
                name: 'NestedButton',
                properties: {},
                events: {
                  click: {
                    action: 'Amplify.Mutation',
                    parameters: {
                      state: {
                        componentName: 'NestedComponent',
                        property: 'color',
                        set: {
                          bindingProperties: {
                            property: 'color',
                          },
                        },
                      },
                    },
                  },
                },
              },
            ],
          },
          {
            componentType: 'TextField',
            name: 'NicknameField',
            properties: {
              label: {
                value: 'Enter your nickname',
                concat: undefined,
                condition: undefined,
              },
            },
          },
          {
            componentType: 'Button',
            name: 'MyButton',
            properties: {
              label: {
                concat: [
                  {
                    value: 'Click Me - ',
                  },
                  {
                    userAttribute: 'firstName',
                  },
                ],
              },
            },
            events: {
              click: {
                action: 'Amplify.DataStoreCreateItemAction',
                parameters: {
                  model: 'Listing',
                  fields: {
                    name: {
                      userAttribute: 'firstName',
                    },
                    preferredName: {
                      condition: {
                        property: 'color',
                        operator: 'eq',
                        operand: 'blue',
                        then: {
                          value: 'Nice Color',
                        },
                        else: {
                          componentName: 'NicknameField',
                          property: 'value',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      };
      const expectedMetadata: ComponentMetadata = {
        hasAuthBindings: true,
        requiredDataModels: ['User', 'Listing'],
        stateReferences: [
          { reference: { componentName: 'NicknameField', property: 'value' }, dataDependencies: [] },
          {
            reference: {
              componentName: 'NestedComponent',
              property: 'color',
              set: { bindingProperties: { property: 'color' } },
            },
            dataDependencies: [],
          },
        ],
        componentNameToTypeMap: {
          TopLevelComponent: 'Flex',
          NestedComponent: 'Flex',
          MyButton: 'Button',
          NestedButton: 'Button',
          NicknameField: 'TextField',
        },
      };
      expect(computeComponentMetadata(component)).toEqual(expectedMetadata);
    });
  });
});
