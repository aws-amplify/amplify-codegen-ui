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
import {
  ComponentMetadata,
  ConditionalStudioComponentProperty,
  StudioComponent,
  StudioComponentSort,
  StudioTemplateRendererFactory,
  StudioComponentPredicate,
  StudioView,
} from '@aws-amplify/codegen-ui';
import { createPrinter, createSourceFile, EmitHint, Node, ScriptKind, ScriptTarget } from 'typescript';
import { buildConditionalExpression, buildOpeningElementProperties } from '../react-component-render-helper';
import { buildSortFunction } from '../react-studio-template-renderer-helper';
import { objectToExpression } from '../react-table-renderer-helper';
import { buildDefaultModelDisplayValue } from '../forms/form-renderer-helper/model-values';
import { buildOpeningElementEvents } from '../workflow/events';
import { ReactExpanderRenderer } from '../react-expander-renderer';
import { AmplifyRenderer } from '../amplify-ui-renderers/amplify-renderer';
import { ImportCollection } from '../imports';
import {
  buildIdentifierOrStringLiteral,
  escapeIdentifierPath,
  isSafeJsxAttributeName,
  safeIdentifierEntries,
} from '../utils/identifiers';

/**
 * Payloads that a malicious component/view schema can supply. Each one, when
 * passed verbatim to factory.createIdentifier(), escapes its intended syntactic
 * position and becomes live source in the generated .tsx.
 */
const INJECTION_PAYLOADS = [
  "eval('alert(1)')",
  "require('child_process').execSync('id')",
  '(0,eval)("process.exit(1)")',
  "a]\n;eval('x')\n//",
  'x = 1; console.log(process.env); y',
  'foo} onLoad={eval("1")} bar={',
  'a/**/;globalThis.pwned=1;/**/b',
  'name={x} dangerouslySetInnerHTML={{__html: y}}',
];

/**
 * Substrings that must never appear in generated output. Presence of any of
 * these means a payload survived into emitted source rather than being
 * neutralized to '' / a quoted string literal.
 */
const EXECUTABLE_MARKERS = ['eval(', 'require(', 'process.exit', 'globalThis.pwned', 'dangerouslySetInnerHTML'];

function print(node: Node): string {
  const file = createSourceFile('test.tsx', '', ScriptTarget.ES2015, true, ScriptKind.TSX);
  return createPrinter().printNode(EmitHint.Unspecified, node, file);
}

/**
 * Asserts the payload is not present as executable source. A payload is allowed
 * to survive inside a quoted string literal (the fail-safe fallback), because a
 * string literal cannot execute -- but it must never appear unquoted.
 */
function expectNoExecutableInjection(generated: string): void {
  EXECUTABLE_MARKERS.forEach((marker) => {
    const withoutStringLiterals = generated.replace(/"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'/g, '""');
    expect(withoutStringLiterals).not.toContain(marker);
  });
}

/**
 * Renders a component through the FULL pipeline (renderer + printer + prettier),
 * which is what a developer running codegen actually executes. The raw TS printer
 * alone will happily print a malformed identifier that prettier then rejects.
 */
function renderFullComponent(component: unknown): string {
  const rendererFactory = new StudioTemplateRendererFactory(
    (studioComponent: StudioComponent) => new AmplifyRenderer(studioComponent, {}),
  );
  return rendererFactory.buildRenderer(component as StudioComponent).renderComponent().componentText;
}

function emptyComponentMetadata(): ComponentMetadata {
  return { componentNameToTypeMap: {}, requiredDataModels: [], stateReferences: [], hasAuthBindings: false };
}

describe('schema-supplied strings must never be emitted as identifiers', () => {
  describe('validators', () => {
    it('escapeIdentifierPath allows identifiers and dot paths, rejects everything else', () => {
      expect(escapeIdentifierPath('userName')).toBe('userName');
      expect(escapeIdentifierPath('user.address.city')).toBe('user.address.city');
      expect(escapeIdentifierPath('_a$b0')).toBe('_a$b0');
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(escapeIdentifierPath(payload)).toBe('');
      });
    });

    it('isSafeJsxAttributeName allows JSXIdentifier grammar including hyphens', () => {
      expect(isSafeJsxAttributeName('onClick')).toBe(true);
      expect(isSafeJsxAttributeName('data-testid')).toBe(true);
      expect(isSafeJsxAttributeName('aria-label')).toBe(true);
      expect(isSafeJsxAttributeName('_private$0')).toBe(true);
    });

    it('isSafeJsxAttributeName rejects injection payloads and non-JSX names', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(isSafeJsxAttributeName(payload)).toBe(false);
      });
      expect(isSafeJsxAttributeName('user.name')).toBe(false);
      expect(isSafeJsxAttributeName('has space')).toBe(false);
      expect(isSafeJsxAttributeName('1leading')).toBe(false);
      expect(isSafeJsxAttributeName('trailing-')).toBe(false);
    });

    it('buildIdentifierOrStringLiteral quotes anything that is not a plain identifier', () => {
      expect(print(buildIdentifierOrStringLiteral('fieldName'))).toBe('fieldName');
      INJECTION_PAYLOADS.forEach((payload) => {
        const generated = print(buildIdentifierOrStringLiteral(payload));
        expect(generated.startsWith('"')).toBe(true);
        expectNoExecutableInjection(generated);
      });
    });

    it('safeIdentifierEntries keeps valid keys and drops injected ones', () => {
      const record = { validProp: 1, _other$0: 2 };
      expect(safeIdentifierEntries(record).map(([key]) => key)).toEqual(['validProp', '_other$0']);
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(safeIdentifierEntries({ ...record, [payload]: 3 }).map(([key]) => key)).toEqual([
          'validProp',
          '_other$0',
        ]);
      });
      expect(safeIdentifierEntries(undefined)).toEqual([]);
      expect(safeIdentifierEntries({ 'data-testid': 1 })).toEqual([]);
    });
  });

  describe('condition.property / condition.field (buildConditionalExpression)', () => {
    const buildConditional = (property: string, field?: string): ConditionalStudioComponentProperty => ({
      condition: {
        property,
        field,
        operator: 'eq',
        operand: 'x',
        then: { value: 'yes' },
        else: { value: 'no' },
      },
    });

    it('emits valid conditions unchanged', () => {
      const generated = print(buildConditionalExpression(emptyComponentMetadata(), buildConditional('user', 'age')));
      expect(generated).toContain('user?.age');
    });

    it('fails closed on an injected condition.property', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(() => buildConditionalExpression(emptyComponentMetadata(), buildConditional(payload))).toThrow(
          /condition\.property is not a valid identifier/,
        );
      });
    });

    it('fails closed on an injected condition.field', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(() => buildConditionalExpression(emptyComponentMetadata(), buildConditional('user', payload))).toThrow(
          /condition\.field is not a valid identifier/,
        );
      });
    });
  });

  describe('property key -> JSX attribute name (buildOpeningElementProperties)', () => {
    it('emits valid property keys, including hyphenated DOM attributes', () => {
      ['label', 'data-testid', 'aria-label'].forEach((key) => {
        const attribute = buildOpeningElementProperties(emptyComponentMetadata(), { value: 'v' }, key);
        expect(attribute).toBeDefined();
        expect(print(attribute as Node)).toContain(key);
      });
    });

    it('drops the attribute entirely for an injected property key', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(buildOpeningElementProperties(emptyComponentMetadata(), { value: 'v' }, payload)).toBeUndefined();
      });
    });

    it('drops the attribute for every property kind, not just fixed values', () => {
      const payload = 'foo} onLoad={eval("1")} bar={';
      const props = [
        { value: 'v' },
        { bindingProperties: { property: 'user', field: 'age' } },
        { collectionBindingProperties: { property: 'items' } },
        { concat: [{ value: 'a' }] },
        { condition: { property: 'user', operator: 'eq', operand: 'x', then: { value: 'y' }, else: { value: 'n' } } },
        { componentName: 'MyButton', property: 'label' },
      ];
      props.forEach((prop) => {
        expect(buildOpeningElementProperties(emptyComponentMetadata(), prop as never, payload)).toBeUndefined();
      });
    });
  });

  describe('sort.field (buildSortFunction)', () => {
    it('emits valid sort fields unchanged', () => {
      const sort: StudioComponentSort[] = [{ field: 'firstName', direction: 'ASC' }];
      expect(print(buildSortFunction('User', sort))).toContain('s.firstName');
    });

    it('fails closed on an injected sort.field', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        const sort: StudioComponentSort[] = [{ field: payload, direction: 'ASC' }];
        expect(() => buildSortFunction('User', sort)).toThrow(/sort\.field is not a valid identifier/);
      });
    });
  });

  describe('view field-formatting keys (objectToExpression)', () => {
    it('emits valid keys unchanged and quotes injected keys', () => {
      expect(print(objectToExpression({ dateFormat: 'locale' }))).toContain('dateFormat');
      INJECTION_PAYLOADS.forEach((payload) => {
        expectNoExecutableInjection(print(objectToExpression({ [payload]: 'locale' })));
      });
    });
  });

  describe('event name -> JSX attribute name (buildOpeningElementEvents)', () => {
    it('drops an unmapped event whose name is not a valid attribute name', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(buildOpeningElementEvents('Button', {} as never, payload, 'MyButton')).toBeUndefined();
      });
    });
  });

  describe('view predicate keys / fields', () => {
    it('quotes injected predicate keys rather than emitting them as identifiers', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        const predicate = { [payload]: 'value' } as unknown as StudioComponentPredicate;
        expectNoExecutableInjection(print(objectToExpression(predicate as never)));
      });
    });
  });

  describe('collectionProperties key -> collection items variable', () => {
    const buildCollection = (collectionProperties: Record<string, unknown>) => ({
      componentType: 'Collection',
      name: 'MyCollection',
      properties: {},
      collectionProperties,
      children: [{ componentType: 'Text', name: 'MyText', properties: { label: { value: 'hi' } } }],
    });

    it('renders a valid collection binding as the items variable', () => {
      const generated = renderFullComponent(buildCollection({ items: { model: 'User' } }));
      expect(generated).toContain('items');
    });

    it('falls back to `items` instead of emitting an injected collectionProperties key', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        const generated = renderFullComponent(buildCollection({ [`${payload}||items`]: { model: 'User' } }));
        expectNoExecutableInjection(generated);
      });
    });
  });

  describe('bindingProperties / collectionProperties keys -> generated declarations', () => {
    const buildComponent = (bindingProperties: Record<string, unknown>) => ({
      componentType: 'Button',
      name: 'MyButton',
      properties: { label: { value: 'Click' } },
      bindingProperties,
    });

    it('renders a valid binding property as a prop and variable', () => {
      const generated = renderFullComponent(buildComponent({ buttonColor: { type: 'String' } }));
      expect(generated).toContain('buttonColor');
    });

    it('drops injected binding property names from generated source', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        const generated = renderFullComponent(
          buildComponent({ buttonColor: { type: 'String' }, [payload]: { type: 'String' } }),
        );
        expectNoExecutableInjection(generated);
        expect(generated).toContain('buttonColor');
      });
    });
  });

  describe('stateReference dataDependencies -> useEffect identifiers', () => {
    /**
     * dataDependencies are computed in codegen-ui by copying
     * bindingProperties.property / condition.property in verbatim, then emitted
     * here as bare identifiers. Reached by binding one component's property to
     * another component's state.
     */
    const buildStateBound = (payload: string) => ({
      id: '1',
      schemaVersion: '1.0',
      componentType: 'Flex',
      name: 'Root',
      properties: {},
      children: [
        {
          componentType: 'TextField',
          name: 'Victim',
          properties: { value: { bindingProperties: { property: payload } }, defaultValue: { value: 'x' } },
        },
        {
          componentType: 'Text',
          name: 'Consumer',
          properties: { label: { componentName: 'Victim', property: 'value' } },
        },
      ],
    });

    it('renders a valid state-bound dependency', () => {
      const generated = renderFullComponent(buildStateBound('userName'));
      expect(generated).toContain('userName');
    });

    it('fails closed on an injected dataDependency', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(() => renderFullComponent(buildStateBound(payload))).toThrow(
          /stateReference dataDependency is not a valid identifier/,
        );
      });
    });
  });

  describe('relationship displayValue mapping (buildDefaultModelDisplayValue)', () => {
    // The human-readable branch is selected by a literal ' - ' separator at index 1.
    const buildDisplayValue = (property: string, field: string) =>
      ({
        concat: [
          { bindingProperties: { property, field } },
          { value: ' - ' },
          { bindingProperties: { property: 'r', field: 'id' } },
        ],
      } as never);

    // Without the ' - ' separator every element is treated as a primary key.
    const buildPrimaryKeyOnlyDisplayValue = (field: string) =>
      ({
        concat: [{ bindingProperties: { property: 'r', field } }],
      } as never);

    it('renders a valid default display value', () => {
      expect(print(buildDefaultModelDisplayValue({ displayValue: buildDisplayValue('r', 'name') }))).toContain(
        'r?.name',
      );
    });

    it('fails closed on an injected displayValue binding property', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(() => buildDefaultModelDisplayValue({ displayValue: buildDisplayValue(payload, 'name') })).toThrow(
          /displayValue bindingProperties\.property is not a valid identifier/,
        );
      });
    });

    it('fails closed on an injected displayValue binding field', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(() => buildDefaultModelDisplayValue({ displayValue: buildDisplayValue('r', payload) })).toThrow(
          /displayValue bindingProperties\.field is not a valid identifier/,
        );
      });
    });

    it('fails closed on an injected primary-key field in the composite branch', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(() =>
          buildDefaultModelDisplayValue({
            displayValue: {
              concat: [
                { bindingProperties: { property: 'r', field: 'name' } },
                { value: ' - ' },
                { bindingProperties: { property: 'r', field: payload } },
              ],
            } as never,
          }),
        ).toThrow(/displayValue key field is not a valid identifier/);
      });
    });

    // Without the ' - ' separator the function delegates to buildConcatExpression,
    // which is guarded by the pre-existing escapePropertyValue allowlist.
    it('neutralizes an injected field on the plain-concat path', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        expectNoExecutableInjection(
          print(buildDefaultModelDisplayValue({ displayValue: buildPrimaryKeyOnlyDisplayValue(payload) })),
        );
      });
    });
  });

  describe('expander view configuration (ReactExpanderRenderer)', () => {
    const buildView = (overrides: Record<string, unknown>): StudioView =>
      ({
        name: 'MyExpander',
        id: 'id',
        sourceId: 'sourceId',
        style: {},
        dataSource: { type: 'DataStore', model: 'User' },
        viewConfiguration: {
          type: 'Collection',
          collection: {
            title: { type: 'Amplify.Binding', content: { bindingProperty: { property: 'item', field: 'name' } } },
            body: { type: 'Amplify.Binding', content: { bindingProperty: { property: 'item', field: 'bio' } } },
            ...overrides,
          },
        },
      } as unknown as StudioView);

    const render = (view: StudioView): string => {
      const renderer = new ReactExpanderRenderer(view, new ImportCollection());
      return [print(renderer.createExpanderItemChild() as Node), print(renderer.createExpanderItemAttributes())].join(
        '\n',
      );
    };

    it('renders a valid expander binding', () => {
      const generated = render(buildView({}));
      expect(generated).toContain('item.bio');
      expect(generated).toContain('item.name');
    });

    it('fails closed on an injected body binding property/field', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(() =>
          render(
            buildView({
              body: { type: 'Amplify.Binding', content: { bindingProperty: { property: payload, field: payload } } },
            }),
          ),
        ).toThrow(/bindingProperty\.(property|field) is not a valid identifier/);
      });
    });

    it('fails closed on an injected title binding field', () => {
      INJECTION_PAYLOADS.forEach((payload) => {
        expect(() =>
          render(
            buildView({
              title: { type: 'Amplify.Binding', content: { bindingProperty: { property: 'item', field: payload } } },
            }),
          ),
        ).toThrow(/bindingProperty\.field is not a valid identifier/);
      });
    });

    it('drops injected componentSlot binding property keys and rejects injected component names', () => {
      const payload = 'foo} onLoad={eval("1")} bar={';
      expectNoExecutableInjection(
        render(
          buildView({
            body: {
              type: 'Amplify.ComponentSlot',
              content: {
                componentSlot: {
                  componentName: 'Text',
                  bindingProperties: { [payload]: { property: 'item', field: 'name' } },
                },
              },
            },
          }),
        ),
      );

      expect(() =>
        render(
          buildView({
            body: {
              type: 'Amplify.ComponentSlot',
              content: {
                componentSlot: { componentName: payload, bindingProperties: {} },
              },
            },
          }),
        ),
      ).toThrow(/not a valid identifier/);
    });
  });
});
