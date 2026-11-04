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
import { StudioTemplateRendererFactory, StudioView } from '@aws-amplify/codegen-ui';
import {
  createPrinter,
  createSourceFile,
  EmitHint,
  forEachChild,
  isJsxElement,
  isJsxExpression,
  isJsxSelfClosingElement,
  isJsxText,
  isStringLiteral,
  JsxChild,
  JsxElement,
  Node,
  ScriptKind as TsScriptKind,
  ScriptTarget as TsScriptTarget,
  SourceFile,
} from 'typescript';
import { AmplifyViewRenderer } from '../amplify-ui-renderers/amplify-view-renderer';
import { getDecoratedLabel } from '../forms/form-renderer-helper';
import { ScriptKind } from '../react-render-config';

const parseTsx = (code: string): SourceFile =>
  createSourceFile('generated.tsx', code, TsScriptTarget.ES2020, true, TsScriptKind.TSX);

const collect = <T extends Node>(root: Node, predicate: (n: Node) => n is T): T[] => {
  const found: T[] = [];
  const visit = (n: Node) => {
    if (predicate(n)) {
      found.push(n);
    }
    forEachChild(n, visit);
  };
  visit(root);
  return found;
};

const meaningfulChildren = (element: JsxElement): JsxChild[] =>
  element.children.filter((c) => !(isJsxText(c) && c.containsOnlyTriviaWhiteSpaces));

/**
 * A label child is literal text when it is JsxText containing exactly the label,
 * or a JSX expression container whose only content is a string literal of the label.
 */
const expectLiteralLabelChild = (children: JsxChild[], label: string) => {
  expect(children).toHaveLength(1);
  const [child] = children;
  if (isJsxText(child)) {
    expect(child.text.trim()).toBe(label);
    return;
  }
  expect(isJsxExpression(child)).toBe(true);
  const expression = isJsxExpression(child) ? child.expression : undefined;
  expect(expression && isStringLiteral(expression)).toBe(true);
  expect(expression && isStringLiteral(expression) ? expression.text : undefined).toBe(label);
};

const expressionLabel = '{value}';
const markupLabel = '</TableCell><b>x</b><TableCell>';

/** Elements named `tagName` anywhere in the parsed output, self-closing or not. */
const findElementsByTag = (sourceFile: SourceFile, tagName: string): Node[] => [
  ...collect(sourceFile, isJsxElement).filter(
    (element) => element.openingElement.tagName.getText(sourceFile) === tagName,
  ),
  ...collect(sourceFile, isJsxSelfClosingElement).filter((element) => element.tagName.getText(sourceFile) === tagName),
];

describe('table view column labels', () => {
  const buildView = (label: string): StudioView =>
    ({
      hasCustomDataSource: true,
      dataSource: { model: JSON.stringify({ name: 'bob', age: 25 }), type: 'Custom' },
      id: 'v-label-text',
      name: 'LabelTextTable',
      schemaVersion: '1.0.0',
      style: {},
      viewConfiguration: { type: 'Table', table: { columns: { name: { label } } } },
    } as StudioView);

  const renderHeaderCells = (label: string) => {
    const rendererFactory = new StudioTemplateRendererFactory(
      (view: StudioView) =>
        new AmplifyViewRenderer(view, undefined, { script: ScriptKind.TSX, renderTypeDeclarations: false }),
    );
    const { componentText } = rendererFactory.buildRenderer(buildView(label)).renderComponent();
    const sourceFile = parseTsx(componentText);
    const headerCells = collect(sourceFile, isJsxElement).filter((element) =>
      element.openingElement.getText(sourceFile).includes('as="th"'),
    );
    return { componentText, sourceFile, headerCells };
  };

  test('renders a plain label as text', () => {
    const { headerCells } = renderHeaderCells('Full Name');
    expect(headerCells).toHaveLength(2);
    expectLiteralLabelChild(meaningfulChildren(headerCells[0]), 'Full Name');
  });

  test('renders a label containing braces as a string literal', () => {
    const { componentText, headerCells } = renderHeaderCells(expressionLabel);
    expect(headerCells).toHaveLength(2);
    expectLiteralLabelChild(meaningfulChildren(headerCells[0]), expressionLabel);
    expect(componentText).toContain('{"{value}"}');
  });

  test('renders a label containing markup as a string literal without adding elements', () => {
    const { sourceFile, headerCells } = renderHeaderCells(markupLabel);
    // One cell per column (name, age) and no extra elements from the label text.
    expect(headerCells).toHaveLength(2);
    expectLiteralLabelChild(meaningfulChildren(headerCells[0]), markupLabel);
    expect(findElementsByTag(sourceFile, 'b')).toHaveLength(0);
  });
});

describe('decorated form labels', () => {
  const renderDecoratedLabel = (label: string, decorator: 'required' | 'optional') => {
    const printer = createPrinter();
    const host = parseTsx('');
    const attributeText = printer.printNode(EmitHint.Unspecified, getDecoratedLabel('label', label, decorator), host);
    const sourceFile = parseTsx(`const field = <TextField ${attributeText} />;`);
    // The outer span wraps the label span and the decorator span.
    const outerSpan = collect(sourceFile, isJsxElement).find((element) =>
      element.openingElement.getText(sourceFile).includes('inline-flex'),
    );
    return { attributeText, sourceFile, outerSpan };
  };

  (['required', 'optional'] as const).forEach((decorator) => {
    test(`renders a ${decorator} label containing braces as a string literal`, () => {
      const { attributeText, outerSpan } = renderDecoratedLabel(expressionLabel, decorator);
      expect(outerSpan).toBeDefined();
      const spans = outerSpan ? meaningfulChildren(outerSpan) : [];
      expect(spans).toHaveLength(2);
      const [labelSpan, decoratorSpan] = spans;
      expect(isJsxElement(labelSpan)).toBe(true);
      expectLiteralLabelChild(isJsxElement(labelSpan) ? meaningfulChildren(labelSpan) : [], expressionLabel);
      // Decorator markup is unchanged.
      expect(isJsxElement(decoratorSpan)).toBe(true);
      expect(attributeText).toContain('<span>{"{value}"}</span>');
    });

    test(`renders a ${decorator} label containing markup without adding elements`, () => {
      const { sourceFile, outerSpan } = renderDecoratedLabel(markupLabel, decorator);
      expect(outerSpan).toBeDefined();
      const spans = outerSpan ? meaningfulChildren(outerSpan) : [];
      expect(spans).toHaveLength(2);
      expectLiteralLabelChild(isJsxElement(spans[0]) ? meaningfulChildren(spans[0]) : [], markupLabel);
      expect(findElementsByTag(sourceFile, 'b')).toHaveLength(0);
    });
  });
});
