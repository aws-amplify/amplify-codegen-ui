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
import { NoApiError } from '@aws-amplify/codegen-ui';
import { ModuleKind, ScriptTarget, ScriptKind } from '..';
import {
  authorHasManySchema,
  compositePersonSchema,
  generateWithAmplifyRenderer,
  rendererConfigWithGraphQL,
  userSchema,
  rendererConfigWithNoApi,
} from './__utils__';

describe('amplify render tests', () => {
  describe('basic component tests', () => {
    it('should generate a simple view component', () => {
      const generatedCode = generateWithAmplifyRenderer('viewTest');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should generate a simple button component', () => {
      const generatedCode = generateWithAmplifyRenderer('buttonGolden');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should generate a simple text component', () => {
      const generatedCode = generateWithAmplifyRenderer('textGolden');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should generate a simple component without variant specific generation', () => {
      const generatedCode = generateWithAmplifyRenderer('buttonGolden');
      expect(generatedCode.componentText.includes('restProp')).toBe(false);
      expect(generatedCode.componentText.includes('breakpointHook')).toBe(false);
      expect(generatedCode.componentText.includes('breakpoint: breakpointHook')).toBe(false);
    });
  });

  describe('complex component tests', () => {
    it('should generate a button within a view component', () => {
      const generatedCode = generateWithAmplifyRenderer('viewGolden');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should generate a component with custom child', () => {
      const generatedCode = generateWithAmplifyRenderer('customChild');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should generate a component with custom child (malformed property)', () => {
      const generatedCode = generateWithAmplifyRenderer('customChildMalformedProperty');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should generate a component with exposeAs prop', () => {
      const generatedCode = generateWithAmplifyRenderer('exposedAsTest');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('sample code snippet tests', () => {
    it('should generate a sample code snippet for components', () => {
      const generatedCode = generateWithAmplifyRenderer('sampleCodeSnippet');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('component with data binding', () => {
    it('should add model imports', () => {
      const generatedCode = generateWithAmplifyRenderer('componentWithDataBinding');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should add GraphQL model imports', () => {
      const generatedCode = generateWithAmplifyRenderer('componentWithDataBinding', rendererConfigWithGraphQL);
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should not have useDataStoreBinding when there is no predicate', () => {
      const generatedCode = generateWithAmplifyRenderer('dataBindingWithoutPredicate');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render with data binding in child elements', () => {
      const generatedCode = generateWithAmplifyRenderer('childComponentWithDataBinding');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('renderer configurations with NoApi', () => {
    it('should throw if component has data binding', () => {
      expect(() => {
        generateWithAmplifyRenderer('workflow/dataStoreCreateItem', rendererConfigWithNoApi);
      }).toThrow(NoApiError);
    });

    it('should render component without data binding successfully', () => {
      const generatedCode = generateWithAmplifyRenderer('buttonGolden', rendererConfigWithNoApi);
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render component without graphql types', () => {
      const generatedCode = generateWithAmplifyRenderer('componentWithDataBinding', {
        apiConfiguration: {
          dataApi: 'GraphQL',
          typesFilePath: '',
          fragmentsFilePath: '../graphql/fragments',
          mutationsFilePath: '../graphql/mutations',
          queriesFilePath: '../graphql/queries',
          subscriptionsFilePath: '../graphql/subscriptions',
        },
        module: ModuleKind.ES2020,
        target: ScriptTarget.ES2020,
        script: ScriptKind.JSX,
        renderTypeDeclarations: true,
      });
      expect(generatedCode.declaration).toMatchSnapshot();
    });
  });

  describe('collection', () => {
    it('should render collection with data binding', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithBinding');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render collection without data binding', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithoutBinding');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render collection with data binding with no predicate', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithBindingWithoutPredicate');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render collection with data binding and sort', () => {
      const generatedCode = generateWithAmplifyRenderer('collectionWithBindingAndSort');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should render collection with data binding if binding name is items', () => {
      const generatedCode = generateWithAmplifyRenderer(
        'collectionWithBindingItemsName',
        undefined,
        undefined,
        userSchema,
      );
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render nested query if model has a hasMany relationship', () => {
      const { componentText } = generateWithAmplifyRenderer(
        'authorCollectionComponent',
        {},
        false,
        authorHasManySchema,
      );
      expect(componentText).toMatchSnapshot();
    });

    it('should not render nested query if the data schema is not provided', () => {
      const { componentText } = generateWithAmplifyRenderer('authorCollectionComponent');
      expect(componentText).toMatchSnapshot();
    });
    it('should render if model name collides with component types', () => {
      const { componentText } = generateWithAmplifyRenderer('collectionWithModelNameCollisions');
      expect(componentText).toMatchSnapshot();
    });

    it('should render concatenated keys if model has composite keys', () => {
      const { componentText } = generateWithAmplifyRenderer(
        'compositePersonCollectionComponent',
        {},
        false,
        compositePersonSchema,
      );
      expect(componentText).toContain(`key={\`\${item.name}\${item.description}\`}`);
      expect(componentText).toMatchSnapshot();
    });

    describe('GraphQL', () => {
      it('should render collection with data binding', () => {
        const generatedCode = generateWithAmplifyRenderer('collectionWithBinding', rendererConfigWithGraphQL);
        expect(generatedCode.componentText).toMatchSnapshot();
      });

      it('should render collection with data binding - amplify js v6', () => {
        const { componentText } = generateWithAmplifyRenderer('collectionWithBinding', {
          ...rendererConfigWithGraphQL,
          dependencies: { 'aws-amplify': '^6.0.0' },
        });
        expect(componentText).not.toContain('import { API } from "aws-amplify";');
        expect(componentText).not.toContain(`await API.graphql`);
        expect(componentText).toContain('import { generateClient } from "aws-amplify/api";');
        expect(componentText).toContain(`await client.graphql`);

        expect(componentText).toMatchSnapshot();
      });

      it('should render collection without data binding', () => {
        const generatedCode = generateWithAmplifyRenderer('collectionWithoutBinding', rendererConfigWithGraphQL);
        expect(generatedCode.componentText).toMatchSnapshot();
      });

      it('should render collection with data binding with no predicate', () => {
        const generatedCode = generateWithAmplifyRenderer(
          'collectionWithBindingWithoutPredicate',
          rendererConfigWithGraphQL,
        );
        expect(generatedCode.componentText).toMatchSnapshot();
      });

      it('should render nested query if model has a hasMany relationship', () => {
        const { componentText } = generateWithAmplifyRenderer(
          'authorCollectionComponent',
          rendererConfigWithGraphQL,
          false,
          authorHasManySchema,
        );
        expect(componentText).toMatchSnapshot();
      });

      it('should not render nested query if the data schema is not provided', () => {
        const { componentText } = generateWithAmplifyRenderer('authorCollectionComponent', rendererConfigWithGraphQL);
        expect(componentText).toMatchSnapshot();
      });
    });
  });

  describe('complex examples', () => {
    it('should render complex sample 1', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest1');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render complex sample 2', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest2');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render complex sample 3', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest3');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 4', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest4');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 5', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest5');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 6', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest6');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 7', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest7');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 8', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest8');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 9', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest9');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 10', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest10');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
    it('should render complex sample 11', () => {
      const generatedCode = generateWithAmplifyRenderer('complexTest11');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('concat and conditional transform', () => {
    it('should render component with concatenation prop', () => {
      const generatedCode = generateWithAmplifyRenderer('concatTest');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render child component with static concatenation', () => {
      const generatedCode = generateWithAmplifyRenderer('childComponentWithStaticConcatenation');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render child component with data bound concatenation', () => {
      const generatedCode = generateWithAmplifyRenderer('childComponentWithDataBoundConcatenation');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render component with conditional data binding prop', () => {
      const generatedCode = generateWithAmplifyRenderer('conditionalTest');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render component with conditional simple binding prop', () => {
      const generatedCode = generateWithAmplifyRenderer('componentWithSimplePropertyConditional');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render component with conditional data binding prop from a bug', () => {
      const generatedCode = generateWithAmplifyRenderer('conditionalComponentWithDataBinding');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('component with binding', () => {
    it('should render build property on Text', () => {
      const generatedCode = generateWithAmplifyRenderer('textWithDataBinding');
      expect(generatedCode.componentText).toMatchSnapshot();
    });

    it('should render slot binding', () => {
      const generatedCode = generateWithAmplifyRenderer('slotBinding');
      expect(generatedCode.componentText).toMatchSnapshot();
    });
  });

  describe('component with variants', () => {
    it('should render variants with options provided', () => {
      const generatedCode = generateWithAmplifyRenderer('componentWithVariants');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should render object variants', () => {
      const generatedCode = generateWithAmplifyRenderer('componentWithObjectVariants');
      expect(generatedCode).toMatchSnapshot();
    });

    it('should have breakpoint specific generation', () => {
      const { componentText } = generateWithAmplifyRenderer('componentWithBreakpoint');
      expect(componentText).toContain('restProp');
      expect(componentText).toContain('breakpointHook');
      expect(componentText).toContain('breakpoint: breakpointHook');
      expect(componentText).toContain('base: "small",');
      expect(componentText).toContain('small: "small",');
      expect(componentText).toContain('medium: "medium",');
      expect(componentText).not.toContain('large: "large"');
    });
  });

  describe('component with variants with mapped children prop', () => {
    it('should render variants with options provided, and mapped children prop', () => {
      const generatedCode = generateWithAmplifyRenderer('componentWithVariantsWithMappedChildrenProp');
      expect(generatedCode).toMatchSnapshot();
    });
  });

  describe('component with variants and not override children prop', () => {
    it('should render variants with options provided, and not override children prop', () => {
      const generatedCode = generateWithAmplifyRenderer('componentWithVariantsAndNotOverrideChildProp');
      expect(generatedCode).toMatchSnapshot();
    });
  });

  describe('component referencing an aliased component', () => {
    it('should have an import statement referencing non-aliased source path and name for custom component', () => {
      const { componentText } = generateWithAmplifyRenderer('components/footerWithCustomButton');
      expect(componentText).toContain('import { Button as ButtonCustom, ButtonProps } from "./Button";');
      expect(componentText).not.toContain('import { Button16 as ButtonCustom } from "./Button16";');
      expect(componentText).not.toContain('import { Button18 as ButtonCustom } from "./Button18";');
      expect(componentText).not.toContain('import { Button110 as ButtonCustom } from "./Button110";');
    });
  });

  describe('custom render config', () => {
    it('should render ES5', () => {
      expect(
        generateWithAmplifyRenderer('viewGolden', { target: ScriptTarget.ES5, script: ScriptKind.JS }).componentText,
      ).toMatchSnapshot();
    });

    it('should render JSX', () => {
      expect(generateWithAmplifyRenderer('viewGolden', { script: ScriptKind.JSX }).componentText).toMatchSnapshot();
    });

    it('should render common JS', () => {
      expect(
        generateWithAmplifyRenderer('viewGolden', { module: ModuleKind.CommonJS, script: ScriptKind.JS }).componentText,
      ).toMatchSnapshot();
    });
  });

  describe('user specific attributes', () => {
    it('should render user specific attributes', () => {
      expect(generateWithAmplifyRenderer('componentWithUserSpecificAttributes').componentText).toMatchSnapshot();
    });
  });

  describe('declarations', () => {
    it('should render declarations', () => {
      expect(
        generateWithAmplifyRenderer('componentWithUserSpecificAttributes', {
          script: ScriptKind.JS,
          renderTypeDeclarations: true,
        }).declaration,
      ).toMatchSnapshot();
    });
  });

  describe('source maps', () => {
    it('should render inline source maps', () => {
      expect(
        generateWithAmplifyRenderer('componentWithUserSpecificAttributes', {
          script: ScriptKind.JS,
          inlineSourceMap: true,
        }).componentText,
      ).toMatchSnapshot();
    });
  });

  describe('actions', () => {
    describe('navigation', () => {
      it('hard navigation action', () => {
        expect(generateWithAmplifyRenderer('workflow/hardNavigationAction')).toMatchSnapshot();
      });

      it('new tab navigation action', () => {
        expect(generateWithAmplifyRenderer('workflow/newTabNavigationAction')).toMatchSnapshot();
      });

      it('anchor navigation action', () => {
        expect(generateWithAmplifyRenderer('workflow/anchorNavigationAction')).toMatchSnapshot();
      });

      it('reload navigation action', () => {
        expect(generateWithAmplifyRenderer('workflow/reloadNavigationAction')).toMatchSnapshot();
      });
    });

    describe('auth', () => {
      it('signs out', () => {
        expect(generateWithAmplifyRenderer('workflow/authSignOutAction')).toMatchSnapshot();
      });
    });

    describe('DataStore', () => {
      it('DataStoreCreateItem', () => {
        expect(generateWithAmplifyRenderer('workflow/dataStoreCreateItem')).toMatchSnapshot();
      });

      it('DataStoreUpdateItem', () => {
        expect(generateWithAmplifyRenderer('workflow/dataStoreUpdateItem')).toMatchSnapshot();
      });

      it('DataStoreDeleteItem', () => {
        expect(generateWithAmplifyRenderer('workflow/dataStoreDeleteItem')).toMatchSnapshot();
      });
    });

    describe('GraphQL', () => {
      it('DataStoreCreateItem', () => {
        expect(
          generateWithAmplifyRenderer('workflow/dataStoreCreateItem', rendererConfigWithGraphQL),
        ).toMatchSnapshot();
      });

      it('DataStoreCreateItem - amplify js v6', () => {
        const { componentText } = generateWithAmplifyRenderer('workflow/dataStoreCreateItem', {
          ...rendererConfigWithGraphQL,
          dependencies: { 'aws-amplify': '^6.0.0' },
        });
        expect(componentText).toMatchSnapshot();
        expect(componentText).not.toContain('import { API } from "aws-amplify";');
        expect(componentText).not.toContain(`await API.graphql`);
        expect(componentText).toContain('import { generateClient } from "aws-amplify/api";');
        expect(componentText).toContain(`await client.graphql`);
      });

      it('DataStoreUpdateItem', () => {
        expect(
          generateWithAmplifyRenderer('workflow/dataStoreUpdateItem', rendererConfigWithGraphQL),
        ).toMatchSnapshot();
      });

      it('DataStoreDeleteItem', () => {
        expect(
          generateWithAmplifyRenderer('workflow/dataStoreDeleteItem', rendererConfigWithGraphQL),
        ).toMatchSnapshot();
      });
    });

    it('with conditional in parameters', () => {
      expect(generateWithAmplifyRenderer('workflow/conditionalInMutation')).toMatchSnapshot();
    });
  });

  it('should render events', () => {
    expect(generateWithAmplifyRenderer('workflow/event')).toMatchSnapshot();
  });

  describe('mutations', () => {
    it('form', () => {
      expect(generateWithAmplifyRenderer('workflow/form')).toMatchSnapshot();
    });

    it('internal mutation', () => {
      expect(generateWithAmplifyRenderer('workflow/internalMutation')).toMatchSnapshot();
    });

    it('supports mutations on synthetic props', () => {
      expect(generateWithAmplifyRenderer('workflow/mutationWithSyntheticProp')).toMatchSnapshot();
    });

    it('supports multiple actions pointing to the same value', () => {
      expect(generateWithAmplifyRenderer('workflow/buttonsToggleState')).toMatchSnapshot();
    });

    it('supports mutations on visibility props', () => {
      expect(generateWithAmplifyRenderer('workflow/updateVisibility')).toMatchSnapshot();
    });

    it('supports mutations with no initial state', () => {
      expect(generateWithAmplifyRenderer('workflow/setStateWithoutInitialValue')).toMatchSnapshot();
    });

    it('supports two-way data binding on form elements', () => {
      expect(generateWithAmplifyRenderer('workflow/twoWayBindings')).toMatchSnapshot();
    });

    it('supports a controlled stepper primitive', () => {
      expect(generateWithAmplifyRenderer('workflow/stepperControlledElement')).toMatchSnapshot();
    });

    it('supports a controlled checkbox primitive', () => {
      expect(generateWithAmplifyRenderer('workflow/checkboxControlledElement')).toMatchSnapshot();
    });

    it('supports a controlled switch primitive', () => {
      expect(generateWithAmplifyRenderer('workflow/switchControlledElement')).toMatchSnapshot();
    });

    it('modifies text in component on input change', () => {
      expect(generateWithAmplifyRenderer('workflow/inputToTextChange')).toMatchSnapshot();
    });

    it('controls an input that is modified by a button', () => {
      expect(generateWithAmplifyRenderer('workflow/inputMutationOnClick')).toMatchSnapshot();
    });

    it('supports nested mutation', () => {
      expect(generateWithAmplifyRenderer('workflow/nestedMutation')).toMatchSnapshot();
    });

    it('supports names that cant be directly turned into methodnames', () => {
      expect(generateWithAmplifyRenderer('workflow/invalidNameForMethod')).toMatchSnapshot();
    });

    it('supports invalid statement names for mutation targets', () => {
      expect(generateWithAmplifyRenderer('workflow/mutationWithUnsanitizedTarget')).toMatchSnapshot();
    });

    it('supports invalid statement names for mutation targets with ES5', () => {
      expect(
        generateWithAmplifyRenderer('workflow/mutationWithUnsanitizedTarget', {
          target: ScriptTarget.ES5,
          script: ScriptKind.JS,
        }).componentText,
      ).toMatchSnapshot();
    });

    it('supports all initial value binding types', () => {
      expect(generateWithAmplifyRenderer('workflow/initialValueBindings')).toMatchSnapshot();
    });
  });

  describe('default value', () => {
    it('should render bound default value', () => {
      expect(generateWithAmplifyRenderer('default-value-components/boundDefaultValue')).toMatchSnapshot();
    });

    it('should render simple and bound default value', () => {
      expect(generateWithAmplifyRenderer('default-value-components/simpleAndBoundDefaultValue')).toMatchSnapshot();
    });

    it('should render simple default value', () => {
      expect(
        generateWithAmplifyRenderer('default-value-components/simplePropertyBindingDefaultValue'),
      ).toMatchSnapshot();
    });

    it('should render collection default value', () => {
      expect(generateWithAmplifyRenderer('default-value-components/collectionDefaultValue')).toMatchSnapshot();
    });
  });

  it('should render parsed fixed values', () => {
    expect(generateWithAmplifyRenderer('parsedFixedValues')).toMatchSnapshot();
  });

  describe('custom components', () => {
    describe('custom children', () => {
      it('should render component with custom children', () => {
        expect(generateWithAmplifyRenderer('custom/customChildren').componentText).toMatchSnapshot();
      });

      it('should render component with custom children with ES5', () => {
        expect(
          generateWithAmplifyRenderer('custom/customChildren', {
            target: ScriptTarget.ES5,
            script: ScriptKind.JS,
          }).componentText,
        ).toMatchSnapshot();
      });

      it('should render declarations', () => {
        expect(
          generateWithAmplifyRenderer('custom/customChildren', {
            script: ScriptKind.JS,
            renderTypeDeclarations: true,
          }).declaration,
        ).toMatchSnapshot();
      });
    });

    describe('custom parent', () => {
      it('should render component', () => {
        expect(generateWithAmplifyRenderer('custom/customParent').componentText).toMatchSnapshot();
      });

      it('should render component with ES5', () => {
        expect(
          generateWithAmplifyRenderer('custom/customParent', {
            target: ScriptTarget.ES5,
            script: ScriptKind.JS,
          }).componentText,
        ).toMatchSnapshot();
      });

      it('should render declarations', () => {
        expect(
          generateWithAmplifyRenderer('custom/customParent', {
            script: ScriptKind.JS,
            renderTypeDeclarations: true,
          }).declaration,
        ).toMatchSnapshot();
      });
    });

    describe('custom parent and children', () => {
      it('should render component with custom parent and children', () => {
        expect(generateWithAmplifyRenderer('custom/customParentAndChildren').componentText).toMatchSnapshot();
      });

      it('should render component with custom parent and children with ES5', () => {
        expect(
          generateWithAmplifyRenderer('custom/customParentAndChildren', {
            target: ScriptTarget.ES5,
            script: ScriptKind.JS,
          }).componentText,
        ).toMatchSnapshot();
      });

      it('should render declarations', () => {
        expect(
          generateWithAmplifyRenderer('custom/customParentAndChildren', {
            script: ScriptKind.JS,
            renderTypeDeclarations: true,
          }).declaration,
        ).toMatchSnapshot();
      });
    });

    describe('alias parent', () => {
      it('should render parent with aliased child instead of primitive', () => {
        expect(generateWithAmplifyRenderer('custom/aliasParent').componentText).toMatchSnapshot();
      });

      it('should render declarations', () => {
        expect(
          generateWithAmplifyRenderer('custom/aliasParent', {
            script: ScriptKind.JS,
            renderTypeDeclarations: true,
          }).declaration,
        ).toMatchSnapshot();
      });
    });
  });

  describe('primitives', () => {
    test('Expander', () => {
      expect(generateWithAmplifyRenderer('primitives/ExpanderPrimitive').componentText).toMatchSnapshot();
    });

    test('ExpanderItem', () => {
      expect(generateWithAmplifyRenderer('primitives/ExpanderItemPrimitive').componentText).toMatchSnapshot();
    });

    test('TextAreaField', () => {
      expect(generateWithAmplifyRenderer('primitives/TextAreaFieldPrimitive').componentText).toMatchSnapshot();
    });

    test('TextField', () => {
      expect(generateWithAmplifyRenderer('primitives/TextFieldPrimitive').componentText).toMatchSnapshot();
    });

    test('SliderField', () => {
      expect(generateWithAmplifyRenderer('primitives/SliderFieldPrimitive').componentText).toMatchSnapshot();
    });

    test('CheckboxField', () => {
      expect(generateWithAmplifyRenderer('primitives/CheckboxFieldPrimitive').componentText).toMatchSnapshot();
    });

    test('Table', () => {
      expect(generateWithAmplifyRenderer('primitives/TablePrimitive').componentText).toMatchSnapshot();
    });

    test('Menu', () => {
      expect(generateWithAmplifyRenderer('primitives/MenuPrimitive').componentText).toMatchSnapshot();
    });

    test('MenuButton', () => {
      expect(generateWithAmplifyRenderer('primitives/MenuButtonPrimitive').componentText).toMatchSnapshot();
    });

    test('Icon', () => {
      expect(generateWithAmplifyRenderer('primitives/IconPrimitive').componentText).toMatchSnapshot();
    });

    test('Icon with lower-cased type `object` for values', () => {
      expect(generateWithAmplifyRenderer('primitives/IconPrimitiveWithLowerCasedType').componentText).toMatchSnapshot();
    });
  });

  describe('icon-indices', () => {
    it('does not return negative indices for icons', () => {
      expect(generateWithAmplifyRenderer('iconBug').componentText).toMatchSnapshot();
    });
  });

  describe('bindings', () => {
    describe('auth', () => {
      it('supports auth bindings in actions', () => {
        expect(
          generateWithAmplifyRenderer('bindings/auth/componentWithAuthActionBinding').componentText,
        ).toMatchSnapshot();
      });
      it('supports auth bindings in actions - amplify js v6', () => {
        expect(
          generateWithAmplifyRenderer('bindings/auth/componentWithAuthActionBinding', {
            dependencies: { 'aws-amplify': '^6.0.0' },
          }).componentText,
        ).toMatchSnapshot();
      });
    });

    describe('data', () => {
      it('supports bindings with reserved keywords', () => {
        expect(generateWithAmplifyRenderer('bindings/data/dataBindingNamedClass').componentText).toMatchSnapshot();
      });
      it('supports model with conflicting component type', () => {
        expect(generateWithAmplifyRenderer('bindings/data/dataBindingNamedFlex').componentText).toMatchSnapshot();
      });
    });
  });
});
